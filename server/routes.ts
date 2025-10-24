import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { sendWhatsAppMessage } from "./twilio";
import { insertSubscriptionSchema } from "@shared/schema";
import { differenceInDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import cron from "node-cron";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware - Required for Replit Auth
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Subscription routes
  app.get("/api/subscriptions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Admins see all subscriptions, others see only their own
      const subscriptions = user?.role === 'admin' 
        ? await storage.getSubscriptions()
        : await storage.getSubscriptions(userId);
      
      res.json(subscriptions);
    } catch (error: any) {
      console.error("Error fetching subscriptions:", error);
      res.status(500).json({ message: "Failed to fetch subscriptions" });
    }
  });

  app.get("/api/subscriptions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const subscription = await storage.getSubscriptionById(req.params.id);
      
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }

      // Check permissions
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin' && subscription.responsibleUserId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      res.json(subscription);
    } catch (error: any) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });

  app.post("/api/subscriptions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate request body
      const validatedData = insertSubscriptionSchema.parse(req.body);
      
      // Set responsible user to current user if not provided
      if (!validatedData.responsibleUserId) {
        validatedData.responsibleUserId = userId;
      }

      const subscription = await storage.createSubscription(validatedData);
      res.status(201).json(subscription);
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid subscription data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  app.put("/api/subscriptions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const subscription = await storage.getSubscriptionById(req.params.id);
      
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }

      // Check permissions
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin' && subscription.responsibleUserId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Validate partial update
      const validatedData = insertSubscriptionSchema.partial().parse(req.body);
      
      const updated = await storage.updateSubscription(req.params.id, validatedData);
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating subscription:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid subscription data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update subscription" });
    }
  });

  app.delete("/api/subscriptions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const subscription = await storage.getSubscriptionById(req.params.id);
      
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }

      // Check permissions
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin' && subscription.responsibleUserId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const deleted = await storage.deleteSubscription(req.params.id);
      
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to delete subscription" });
      }
    } catch (error: any) {
      console.error("Error deleting subscription:", error);
      res.status(500).json({ message: "Failed to delete subscription" });
    }
  });

  // WhatsApp alerts routes
  app.get("/api/alerts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Admins see all alerts, others see only their own
      const alerts = user?.role === 'admin' 
        ? await storage.getWhatsAppAlerts()
        : await storage.getWhatsAppAlerts(userId);
      
      res.json(alerts);
    } catch (error: any) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts/send-test", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.phoneNumber) {
        return res.status(400).json({ message: "User has no phone number configured" });
      }

      const message = "[TESTE] Gerente de SaaS: Seus alertas WhatsApp estão funcionando perfeitamente!";
      
      // Create alert record (subscriptionId is null for test alerts)
      const alert = await storage.createWhatsAppAlert({
        subscriptionId: null,
        userId: userId,
        phoneNumber: user.phoneNumber,
        message: message,
        status: "pending",
      });

      // Send WhatsApp message
      const result = await sendWhatsAppMessage(user.phoneNumber, message);
      
      if (result.success) {
        await storage.updateWhatsAppAlertStatus(
          alert.id,
          "sent",
          result.messageSid
        );
        res.json({ success: true, message: "Test alert sent successfully" });
      } else {
        await storage.updateWhatsAppAlertStatus(
          alert.id,
          "failed",
          undefined,
          result.error
        );
        res.status(500).json({ success: false, message: result.error });
      }
    } catch (error: any) {
      console.error("Error sending test alert:", error);
      res.status(500).json({ message: "Failed to send test alert" });
    }
  });

  // Dashboard stats route
  app.get("/api/dashboard/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      const subscriptions = user?.role === 'admin' 
        ? await storage.getSubscriptions()
        : await storage.getSubscriptions(userId);

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

      res.json({
        totalMonthly: totalMonthly.toFixed(2),
        totalAnnual: totalAnnual.toFixed(2),
        activeCount: activeSubscriptions.length,
        totalCount: subscriptions.length,
        expiringSoonCount: expiringSoon.length,
      });
    } catch (error: any) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Cron job to check for renewals and send WhatsApp alerts
  // Runs every day at 9 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Running renewal check cron job...');
    
    try {
      const allSubscriptions = await storage.getSubscriptions();
      const activeSubscriptions = allSubscriptions.filter(s => s.status === 'active');

      for (const subscription of activeSubscriptions) {
        const daysUntilRenewal = differenceInDays(new Date(subscription.renewalDate), new Date());
        
        // Send alert 7 days before renewal
        if (daysUntilRenewal === 7) {
          const user = await storage.getUser(subscription.responsibleUserId);
          
          if (user?.phoneNumber) {
            const cost = subscription.billingCycle === 'monthly'
              ? `$${subscription.monthlyCost}/mês`
              : `$${subscription.annualCost}/ano`;
            
            const renewalDateFormatted = format(new Date(subscription.renewalDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
            
            const message = `[ALERTA] Lembrete: sua assinatura do *${subscription.appName}* vence em *${renewalDateFormatted}*. Valor: *${cost}*.`;
            
            // Create alert record
            const alert = await storage.createWhatsAppAlert({
              subscriptionId: subscription.id,
              userId: user.id,
              phoneNumber: user.phoneNumber,
              message: message,
              status: "pending",
            });

            // Send WhatsApp message
            const result = await sendWhatsAppMessage(user.phoneNumber, message);
            
            if (result.success) {
              await storage.updateWhatsAppAlertStatus(
                alert.id,
                "sent",
                result.messageSid
              );
              console.log(`Alert sent successfully for subscription ${subscription.appName}`);
            } else {
              await storage.updateWhatsAppAlertStatus(
                alert.id,
                "failed",
                undefined,
                result.error
              );
              console.error(`Failed to send alert for subscription ${subscription.appName}:`, result.error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in renewal check cron job:', error);
    }
  });

  console.log('Cron job scheduled: Daily renewal checks at 9 AM');

  const httpServer = createServer(app);

  return httpServer;
}
