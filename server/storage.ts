// Following the PostgreSQL database blueprint
import {
  users,
  subscriptions,
  whatsappAlerts,
  type User,
  type UpsertUser,
  type Subscription,
  type InsertSubscription,
  type WhatsappAlert,
  type InsertWhatsappAlert,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Subscription operations
  getSubscriptions(userId?: string): Promise<Subscription[]>;
  getSubscriptionById(id: string): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: string, subscription: Partial<InsertSubscription>): Promise<Subscription | undefined>;
  deleteSubscription(id: string): Promise<boolean>;

  // WhatsApp alert operations
  getWhatsAppAlerts(userId?: string): Promise<WhatsappAlert[]>;
  createWhatsAppAlert(alert: InsertWhatsappAlert): Promise<WhatsappAlert>;
  updateWhatsAppAlertStatus(id: string, status: string, twilioMessageSid?: string, errorMessage?: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Subscription operations
  async getSubscriptions(userId?: string): Promise<Subscription[]> {
    if (userId) {
      // If user is not admin, only return their subscriptions
      return await db.select()
        .from(subscriptions)
        .where(eq(subscriptions.responsibleUserId, userId))
        .orderBy(desc(subscriptions.createdAt));
    }
    // Return all subscriptions (for admins)
    return await db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
  }

  async getSubscriptionById(id: string): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return subscription;
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const [created] = await db
      .insert(subscriptions)
      .values(subscription)
      .returning();
    return created;
  }

  async updateSubscription(id: string, subscription: Partial<InsertSubscription>): Promise<Subscription | undefined> {
    const [updated] = await db
      .update(subscriptions)
      .set({ ...subscription, updatedAt: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();
    return updated;
  }

  async deleteSubscription(id: string): Promise<boolean> {
    const result = await db.delete(subscriptions).where(eq(subscriptions.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // WhatsApp alert operations
  async getWhatsAppAlerts(userId?: string): Promise<WhatsappAlert[]> {
    if (userId) {
      return await db.select()
        .from(whatsappAlerts)
        .where(eq(whatsappAlerts.userId, userId))
        .orderBy(desc(whatsappAlerts.createdAt));
    }
    return await db.select().from(whatsappAlerts).orderBy(desc(whatsappAlerts.createdAt));
  }

  async createWhatsAppAlert(alert: InsertWhatsappAlert): Promise<WhatsappAlert> {
    const [created] = await db
      .insert(whatsappAlerts)
      .values(alert)
      .returning();
    return created;
  }

  async updateWhatsAppAlertStatus(
    id: string,
    status: string,
    twilioMessageSid?: string,
    errorMessage?: string
  ): Promise<void> {
    const updateData: any = { status };
    
    if (status === 'sent' || status === 'delivered' || status === 'read') {
      updateData.sentAt = new Date();
    }
    if (status === 'delivered' || status === 'read') {
      updateData.deliveredAt = new Date();
    }
    if (status === 'read') {
      updateData.readAt = new Date();
    }
    if (twilioMessageSid) {
      updateData.twilioMessageSid = twilioMessageSid;
    }
    if (errorMessage) {
      updateData.errorMessage = errorMessage;
    }

    await db
      .update(whatsappAlerts)
      .set(updateData)
      .where(eq(whatsappAlerts.id, id));
  }
}

export const storage = new DatabaseStorage();
