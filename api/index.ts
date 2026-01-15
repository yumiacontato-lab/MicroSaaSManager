import type { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc } from "drizzle-orm";
import { differenceInDays } from "date-fns";
import * as schema from "../shared/schema";

// Initialize database connection
function getDb() {
    const sql = neon(process.env.DATABASE_URL!);
    return drizzle(sql, { schema });
}

// Simple session storage using cookies (stateless)
function getSessionFromCookie(req: VercelRequest): any {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.substring(7);
            return JSON.parse(Buffer.from(token, 'base64').toString());
        } catch {
            return null;
        }
    }

    // Check for demo mode (for development/testing)
    if (process.env.DEMO_MODE === 'true') {
        return {
            userId: 'demo-user-id',
            email: 'demo@example.com'
        };
    }

    return null;
}

// API Routes handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const db = getDb();
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const path = url.pathname;
    const method = req.method;

    try {
        // Health check endpoint
        if (path === '/api/health' || path === '/api') {
            return res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
        }

        // Demo login endpoint (for development/testing)
        if (path === '/api/auth/demo-login' && method === 'POST') {
            const { email, name } = req.body || {};

            // Create or get demo user
            const userId = `demo-${Date.now()}`;
            await db.insert(schema.users).values({
                id: userId,
                email: email || 'demo@example.com',
                firstName: name?.split(' ')[0] || 'Demo',
                lastName: name?.split(' ').slice(1).join(' ') || 'User',
                role: 'admin',
            }).onConflictDoNothing();

            const token = Buffer.from(JSON.stringify({
                userId,
                email: email || 'demo@example.com'
            })).toString('base64');

            return res.status(200).json({
                success: true,
                token,
                user: {
                    id: userId,
                    email: email || 'demo@example.com',
                    firstName: name?.split(' ')[0] || 'Demo',
                    lastName: name?.split(' ').slice(1).join(' ') || 'User',
                }
            });
        }

        // === Protected routes - require authentication ===
        const session = getSessionFromCookie(req);

        if (!session && !path.includes('/auth/')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userId = session?.userId;

        // Get current user
        if (path === '/api/auth/user' && method === 'GET') {
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const users = await db.select().from(schema.users).where(eq(schema.users.id, userId));
            const user = users[0];
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(user);
        }

        // Get user from session
        const getUser = async () => {
            if (!userId) return null;
            const users = await db.select().from(schema.users).where(eq(schema.users.id, userId));
            return users[0] || null;
        };

        // === Subscriptions ===
        if (path === '/api/subscriptions') {
            if (method === 'GET') {
                const user = await getUser();
                const subscriptions = user?.role === 'admin'
                    ? await db.select().from(schema.subscriptions).orderBy(desc(schema.subscriptions.createdAt))
                    : await db.select().from(schema.subscriptions).where(eq(schema.subscriptions.responsibleUserId, userId!)).orderBy(desc(schema.subscriptions.createdAt));
                return res.status(200).json(subscriptions);
            }

            if (method === 'POST') {
                const data = req.body;
                const subscription = await db.insert(schema.subscriptions).values({
                    ...data,
                    responsibleUserId: data.responsibleUserId || userId,
                    renewalDate: new Date(data.renewalDate),
                }).returning();
                return res.status(201).json(subscription[0]);
            }
        }

        // Subscription by ID
        const subscriptionIdMatch = path.match(/^\/api\/subscriptions\/([^/]+)$/);
        if (subscriptionIdMatch) {
            const id = subscriptionIdMatch[1];

            if (method === 'GET') {
                const subscriptions = await db.select().from(schema.subscriptions).where(eq(schema.subscriptions.id, id));
                if (!subscriptions[0]) {
                    return res.status(404).json({ message: 'Subscription not found' });
                }
                return res.status(200).json(subscriptions[0]);
            }

            if (method === 'PUT') {
                const data = req.body;
                const updated = await db.update(schema.subscriptions)
                    .set({
                        ...data,
                        renewalDate: data.renewalDate ? new Date(data.renewalDate) : undefined,
                        updatedAt: new Date(),
                    })
                    .where(eq(schema.subscriptions.id, id))
                    .returning();
                return res.status(200).json(updated[0]);
            }

            if (method === 'DELETE') {
                await db.delete(schema.subscriptions).where(eq(schema.subscriptions.id, id));
                return res.status(204).end();
            }
        }

        // === Dashboard Stats ===
        if (path === '/api/dashboard/stats' && method === 'GET') {
            const user = await getUser();
            const subscriptions = user?.role === 'admin'
                ? await db.select().from(schema.subscriptions)
                : await db.select().from(schema.subscriptions).where(eq(schema.subscriptions.responsibleUserId, userId!));

            const activeSubscriptions = subscriptions.filter(s => s.status === 'active');

            const totalMonthly = activeSubscriptions.reduce((sum, sub) => {
                const cost = sub.billingCycle === 'monthly'
                    ? parseFloat(sub.monthlyCost || '0')
                    : parseFloat(sub.annualCost || '0') / 12;
                return sum + cost;
            }, 0);

            const totalAnnual = totalMonthly * 12;

            const expiringSoon = activeSubscriptions.filter(sub => {
                const days = differenceInDays(new Date(sub.renewalDate), new Date());
                return days >= 0 && days <= 7;
            });

            return res.status(200).json({
                totalMonthly: totalMonthly.toFixed(2),
                totalAnnual: totalAnnual.toFixed(2),
                activeCount: activeSubscriptions.length,
                totalCount: subscriptions.length,
                expiringSoonCount: expiringSoon.length,
            });
        }

        // === WhatsApp Alerts ===
        if (path === '/api/alerts' && method === 'GET') {
            const user = await getUser();
            const alerts = user?.role === 'admin'
                ? await db.select().from(schema.whatsappAlerts).orderBy(desc(schema.whatsappAlerts.createdAt))
                : await db.select().from(schema.whatsappAlerts).where(eq(schema.whatsappAlerts.userId, userId!)).orderBy(desc(schema.whatsappAlerts.createdAt));
            return res.status(200).json(alerts);
        }

        // Route not found
        return res.status(404).json({ message: 'Not found', path });

    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
}
