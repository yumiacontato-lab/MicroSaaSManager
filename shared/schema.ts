import { sql } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from 'drizzle-orm';

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User role enum
export const userRoleEnum = pgEnum('user_role', ['admin', 'finance', 'user']);

// Subscription status enum
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'cancelled', 'trial']);

// Payment method enum
export const paymentMethodEnum = pgEnum('payment_method', ['credit_card', 'debit_card', 'bank_transfer', 'paypal', 'other']);

// Billing cycle enum
export const billingCycleEnum = pgEnum('billing_cycle', ['monthly', 'annual']);

// WhatsApp alert status enum
export const alertStatusEnum = pgEnum('alert_status', ['pending', 'sent', 'delivered', 'read', 'failed']);

// Currency enum
export const currencyEnum = pgEnum('currency', ['USD', 'BRL']);

// User storage table - Required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default('user').notNull(),
  phoneNumber: varchar("phone_number"), // For WhatsApp alerts
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
  whatsappAlerts: many(whatsappAlerts),
}));

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  appName: varchar("app_name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  monthlyCost: decimal("monthly_cost", { precision: 10, scale: 2 }),
  annualCost: decimal("annual_cost", { precision: 10, scale: 2 }),
  billingCycle: billingCycleEnum("billing_cycle").default('monthly').notNull(),
  currency: currencyEnum("currency").default('USD').notNull(),
  renewalDate: timestamp("renewal_date").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  responsibleUserId: varchar("responsible_user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: subscriptionStatusEnum("status").default('active').notNull(),
  logoUrl: varchar("logo_url"),
  invoiceUrl: varchar("invoice_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  responsibleUser: one(users, {
    fields: [subscriptions.responsibleUserId],
    references: [users.id],
  }),
  whatsappAlerts: many(whatsappAlerts),
}));

// WhatsApp alerts tracking table
export const whatsappAlerts = pgTable("whatsapp_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subscriptionId: varchar("subscription_id").references(() => subscriptions.id, { onDelete: 'cascade' }), // Nullable for test alerts
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  phoneNumber: varchar("phone_number").notNull(),
  message: text("message").notNull(),
  status: alertStatusEnum("status").default('pending').notNull(),
  twilioMessageSid: varchar("twilio_message_sid"),
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  readAt: timestamp("read_at"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const whatsappAlertsRelations = relations(whatsappAlerts, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [whatsappAlerts.subscriptionId],
    references: [subscriptions.id],
  }),
  user: one(users, {
    fields: [whatsappAlerts.userId],
    references: [users.id],
  }),
}));

// Types for Replit Auth
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Subscription types
export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  monthlyCost: z.string().optional(),
  annualCost: z.string().optional(),
  renewalDate: z.union([
    z.date(),
    z.string().transform(val => new Date(val))
  ]),
});

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

// WhatsApp alert types
export const insertWhatsappAlertSchema = createInsertSchema(whatsappAlerts).omit({
  id: true,
  createdAt: true,
  twilioMessageSid: true,
  sentAt: true,
  deliveredAt: true,
  readAt: true,
  errorMessage: true,
});

export type InsertWhatsappAlert = z.infer<typeof insertWhatsappAlertSchema>;
export type WhatsappAlert = typeof whatsappAlerts.$inferSelect;
