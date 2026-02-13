import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  products, type Product, type InsertProduct,
  clients, type Client, type InsertClient,
  launchKitItems, type LaunchKitItem, type InsertLaunchKitItem,
  launchKitSubmissions, type LaunchKitSubmission, type InsertLaunchKitSubmission,
  payments, type Payment, type InsertPayment,
  priceSettings, type PriceSetting, type InsertPriceSetting,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(cat: InsertCategory): Promise<Category>;
  updateCategory(id: number, cat: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<void>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(prod: InsertProduct): Promise<Product>;
  updateProduct(id: number, prod: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;

  // Clients
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<void>;

  // Launch Kit Items
  getKitItems(clientId: number): Promise<LaunchKitItem[]>;
  upsertKitItem(item: InsertLaunchKitItem): Promise<LaunchKitItem>;
  removeKitItem(id: number): Promise<void>;
  clearKit(clientId: number): Promise<void>;

  // Launch Kit Submissions
  getSubmissions(): Promise<LaunchKitSubmission[]>;
  getSubmission(id: number): Promise<LaunchKitSubmission | undefined>;
  getSubmissionsByClient(clientId: number): Promise<LaunchKitSubmission[]>;
  createSubmission(sub: InsertLaunchKitSubmission): Promise<LaunchKitSubmission>;
  updateSubmission(id: number, sub: Partial<InsertLaunchKitSubmission>): Promise<LaunchKitSubmission | undefined>;

  // Payments
  getPaymentsByClient(clientId: number): Promise<Payment[]>;
  getAllPayments(): Promise<Payment[]>;
  createPayment(pay: InsertPayment): Promise<Payment>;
  updatePayment(id: number, pay: Partial<InsertPayment>): Promise<Payment | undefined>;

  // Price Settings
  getPriceSettings(): Promise<PriceSetting[]>;
  upsertPriceSetting(setting: InsertPriceSetting): Promise<PriceSetting>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async createCategory(cat: InsertCategory): Promise<Category> {
    const [created] = await db.insert(categories).values(cat).returning();
    return created;
  }

  async updateCategory(id: number, cat: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db.update(categories).set(cat).where(eq(categories.id, id)).returning();
    return updated;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [prod] = await db.select().from(products).where(eq(products.id, id));
    return prod;
  }

  async createProduct(prod: InsertProduct): Promise<Product> {
    const [created] = await db.insert(products).values(prod).returning();
    return created;
  }

  async updateProduct(id: number, prod: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db.update(products).set(prod).where(eq(products.id, id)).returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Clients
  async getClients(): Promise<Client[]> {
    return db.select().from(clients);
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [created] = await db.insert(clients).values(client).returning();
    return created;
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined> {
    const [updated] = await db.update(clients).set(client).where(eq(clients.id, id)).returning();
    return updated;
  }

  async deleteClient(id: number): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  // Launch Kit Items
  async getKitItems(clientId: number): Promise<LaunchKitItem[]> {
    return db.select().from(launchKitItems).where(eq(launchKitItems.clientId, clientId));
  }

  async upsertKitItem(item: InsertLaunchKitItem): Promise<LaunchKitItem> {
    const existing = await db.select().from(launchKitItems)
      .where(and(eq(launchKitItems.clientId, item.clientId), eq(launchKitItems.productId, item.productId)));
    
    if (existing.length > 0) {
      const [updated] = await db.update(launchKitItems)
        .set({ quantity: item.quantity })
        .where(eq(launchKitItems.id, existing[0].id))
        .returning();
      return updated;
    }

    const [created] = await db.insert(launchKitItems).values(item).returning();
    return created;
  }

  async removeKitItem(id: number): Promise<void> {
    await db.delete(launchKitItems).where(eq(launchKitItems.id, id));
  }

  async clearKit(clientId: number): Promise<void> {
    await db.delete(launchKitItems).where(eq(launchKitItems.clientId, clientId));
  }

  // Launch Kit Submissions
  async getSubmissions(): Promise<LaunchKitSubmission[]> {
    return db.select().from(launchKitSubmissions).orderBy(desc(launchKitSubmissions.submittedAt));
  }

  async getSubmission(id: number): Promise<LaunchKitSubmission | undefined> {
    const [sub] = await db.select().from(launchKitSubmissions).where(eq(launchKitSubmissions.id, id));
    return sub;
  }

  async getSubmissionsByClient(clientId: number): Promise<LaunchKitSubmission[]> {
    return db.select().from(launchKitSubmissions).where(eq(launchKitSubmissions.clientId, clientId));
  }

  async createSubmission(sub: InsertLaunchKitSubmission): Promise<LaunchKitSubmission> {
    const [created] = await db.insert(launchKitSubmissions).values(sub).returning();
    return created;
  }

  async updateSubmission(id: number, sub: Partial<InsertLaunchKitSubmission>): Promise<LaunchKitSubmission | undefined> {
    const [updated] = await db.update(launchKitSubmissions).set(sub).where(eq(launchKitSubmissions.id, id)).returning();
    return updated;
  }

  // Payments
  async getPaymentsByClient(clientId: number): Promise<Payment[]> {
    return db.select().from(payments).where(eq(payments.clientId, clientId));
  }

  async getAllPayments(): Promise<Payment[]> {
    return db.select().from(payments);
  }

  async createPayment(pay: InsertPayment): Promise<Payment> {
    const [created] = await db.insert(payments).values(pay).returning();
    return created;
  }

  async updatePayment(id: number, pay: Partial<InsertPayment>): Promise<Payment | undefined> {
    const [updated] = await db.update(payments).set(pay).where(eq(payments.id, id)).returning();
    return updated;
  }

  // Price Settings
  async getPriceSettings(): Promise<PriceSetting[]> {
    return db.select().from(priceSettings);
  }

  async upsertPriceSetting(setting: InsertPriceSetting): Promise<PriceSetting> {
    const existing = await db.select().from(priceSettings).where(eq(priceSettings.key, setting.key));
    if (existing.length > 0) {
      const [updated] = await db.update(priceSettings)
        .set({ value: setting.value, label: setting.label })
        .where(eq(priceSettings.key, setting.key))
        .returning();
      return updated;
    }
    const [created] = await db.insert(priceSettings).values(setting).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
