import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("client"),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  city: text("city"),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  dutyPercent: real("duty_percent").default(0),
  gstPercent: real("gst_percent").default(18),
});

export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  categoryId: integer("category_id").notNull(),
  image: text("image"),
  costPrice: real("cost_price").notNull(),
  mrp: real("mrp").notNull(),
  tags: text("tags").array().default(sql`'{}'::text[]`),
  status: text("status").notNull().default("Active"),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Clients
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  name: text("name").notNull(),
  city: text("city").notNull(),
  stage: text("stage").notNull().default("Lead"),
  phone: text("phone"),
  email: text("email"),
  totalPaid: real("total_paid").default(0),
  totalDue: real("total_due").default(0),
  nextAction: text("next_action"),
  managerName: text("manager_name"),
  managerPhone: text("manager_phone"),
  storeAddress: text("store_address"),
  storeArea: integer("store_area"),
});

export const insertClientSchema = createInsertSchema(clients).omit({ id: true });
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

// Launch Kit Items
export const launchKitItems = pgTable("launch_kit_items", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

export const insertLaunchKitItemSchema = createInsertSchema(launchKitItems).omit({ id: true });
export type InsertLaunchKitItem = z.infer<typeof insertLaunchKitItemSchema>;
export type LaunchKitItem = typeof launchKitItems.$inferSelect;

// Launch Kit Submissions
export const launchKitSubmissions = pgTable("launch_kit_submissions", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  status: text("status").notNull().default("pending"),
  totalInvestment: real("total_investment").default(0),
  totalUnits: integer("total_units").default(0),
  budget: real("budget").default(500000),
  comments: text("comments"),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const insertLaunchKitSubmissionSchema = createInsertSchema(launchKitSubmissions).omit({ id: true, submittedAt: true });
export type InsertLaunchKitSubmission = z.infer<typeof insertLaunchKitSubmissionSchema>;
export type LaunchKitSubmission = typeof launchKitSubmissions.$inferSelect;

// Payments
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  invoiceId: text("invoice_id").notNull(),
  date: text("date").notNull(),
  description: text("description").notNull(),
  amount: real("amount").notNull(),
  status: text("status").notNull().default("Due"),
  method: text("method"),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true });
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// Price Settings (admin)
export const priceSettings = pgTable("price_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  label: text("label").notNull(),
});

export const insertPriceSettingSchema = createInsertSchema(priceSettings).omit({ id: true });
export type InsertPriceSetting = z.infer<typeof insertPriceSettingSchema>;
export type PriceSetting = typeof priceSettings.$inferSelect;

// Stage constants
export const STAGES = [
  'Lead',
  'Token Paid',
  'Location Shared',
  'Location Approved',
  '3D Design',
  'Payment Partial',
  'In Production',
  'Shipped',
  'Setup',
  'Launched',
  'Active'
] as const;
