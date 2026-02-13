import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertProductSchema,
  insertCategorySchema,
  insertClientSchema,
  insertLaunchKitItemSchema,
  insertLaunchKitSubmissionSchema,
  insertPaymentSchema,
  insertPriceSettingSchema,
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ─── Categories ────────────────────────────────────────────
  app.get("/api/categories", async (_req, res) => {
    const cats = await storage.getCategories();
    res.json(cats);
  });

  app.post("/api/categories", async (req, res) => {
    const parsed = insertCategorySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const cat = await storage.createCategory(parsed.data);
    res.status(201).json(cat);
  });

  app.patch("/api/categories/:id", async (req, res) => {
    const cat = await storage.updateCategory(Number(req.params.id), req.body);
    if (!cat) return res.status(404).json({ error: "Not found" });
    res.json(cat);
  });

  app.delete("/api/categories/:id", async (req, res) => {
    await storage.deleteCategory(Number(req.params.id));
    res.status(204).send();
  });

  // ─── Products ──────────────────────────────────────────────
  app.get("/api/products", async (_req, res) => {
    const prods = await storage.getProducts();
    res.json(prods);
  });

  app.get("/api/products/:id", async (req, res) => {
    const prod = await storage.getProduct(Number(req.params.id));
    if (!prod) return res.status(404).json({ error: "Not found" });
    res.json(prod);
  });

  app.post("/api/products", async (req, res) => {
    const parsed = insertProductSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const prod = await storage.createProduct(parsed.data);
    res.status(201).json(prod);
  });

  app.patch("/api/products/:id", async (req, res) => {
    const prod = await storage.updateProduct(Number(req.params.id), req.body);
    if (!prod) return res.status(404).json({ error: "Not found" });
    res.json(prod);
  });

  app.delete("/api/products/:id", async (req, res) => {
    await storage.deleteProduct(Number(req.params.id));
    res.status(204).send();
  });

  // ─── Clients ───────────────────────────────────────────────
  app.get("/api/clients", async (_req, res) => {
    const cls = await storage.getClients();
    res.json(cls);
  });

  app.get("/api/clients/:id", async (req, res) => {
    const client = await storage.getClient(Number(req.params.id));
    if (!client) return res.status(404).json({ error: "Not found" });
    res.json(client);
  });

  app.post("/api/clients", async (req, res) => {
    const parsed = insertClientSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const client = await storage.createClient(parsed.data);
    res.status(201).json(client);
  });

  app.patch("/api/clients/:id", async (req, res) => {
    const client = await storage.updateClient(Number(req.params.id), req.body);
    if (!client) return res.status(404).json({ error: "Not found" });
    res.json(client);
  });

  app.delete("/api/clients/:id", async (req, res) => {
    await storage.deleteClient(Number(req.params.id));
    res.status(204).send();
  });

  // ─── Launch Kit Items ──────────────────────────────────────
  app.get("/api/kit-items/:clientId", async (req, res) => {
    const items = await storage.getKitItems(Number(req.params.clientId));
    res.json(items);
  });

  app.post("/api/kit-items", async (req, res) => {
    const parsed = insertLaunchKitItemSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const item = await storage.upsertKitItem(parsed.data);
    res.status(201).json(item);
  });

  app.delete("/api/kit-items/:id", async (req, res) => {
    await storage.removeKitItem(Number(req.params.id));
    res.status(204).send();
  });

  app.delete("/api/kit-items/clear/:clientId", async (req, res) => {
    await storage.clearKit(Number(req.params.clientId));
    res.status(204).send();
  });

  // ─── Launch Kit Submissions ────────────────────────────────
  app.get("/api/submissions", async (_req, res) => {
    const subs = await storage.getSubmissions();
    res.json(subs);
  });

  app.get("/api/submissions/client/:clientId", async (req, res) => {
    const subs = await storage.getSubmissionsByClient(Number(req.params.clientId));
    res.json(subs);
  });

  app.post("/api/submissions", async (req, res) => {
    const parsed = insertLaunchKitSubmissionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const sub = await storage.createSubmission(parsed.data);
    res.status(201).json(sub);
  });

  app.patch("/api/submissions/:id", async (req, res) => {
    const sub = await storage.updateSubmission(Number(req.params.id), req.body);
    if (!sub) return res.status(404).json({ error: "Not found" });
    res.json(sub);
  });

  // ─── Payments ──────────────────────────────────────────────
  app.get("/api/payments", async (_req, res) => {
    const pays = await storage.getAllPayments();
    res.json(pays);
  });

  app.get("/api/payments/client/:clientId", async (req, res) => {
    const pays = await storage.getPaymentsByClient(Number(req.params.clientId));
    res.json(pays);
  });

  app.post("/api/payments", async (req, res) => {
    const parsed = insertPaymentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const pay = await storage.createPayment(parsed.data);
    res.status(201).json(pay);
  });

  app.patch("/api/payments/:id", async (req, res) => {
    const pay = await storage.updatePayment(Number(req.params.id), req.body);
    if (!pay) return res.status(404).json({ error: "Not found" });
    res.json(pay);
  });

  // ─── Price Settings ────────────────────────────────────────
  app.get("/api/settings", async (_req, res) => {
    const settings = await storage.getPriceSettings();
    res.json(settings);
  });

  app.post("/api/settings", async (req, res) => {
    const parsed = insertPriceSettingSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const setting = await storage.upsertPriceSetting(parsed.data);
    res.json(setting);
  });

  // ─── Seed endpoint ─────────────────────────────────────────
  app.post("/api/seed", async (_req, res) => {
    try {
      // Check if already seeded
      const existingProducts = await storage.getProducts();
      if (existingProducts.length > 0) {
        return res.json({ message: "Already seeded" });
      }

      // Seed categories
      const catData = [
        { name: "Kitchen", dutyPercent: 5, gstPercent: 18 },
        { name: "Stationery", dutyPercent: 0, gstPercent: 12 },
        { name: "Toys", dutyPercent: 10, gstPercent: 18 },
        { name: "Decor", dutyPercent: 5, gstPercent: 18 },
        { name: "Storage", dutyPercent: 5, gstPercent: 18 },
        { name: "Bags", dutyPercent: 10, gstPercent: 18 },
        { name: "Bathroom", dutyPercent: 5, gstPercent: 18 },
        { name: "Cleaning", dutyPercent: 0, gstPercent: 12 },
        { name: "Gifts", dutyPercent: 5, gstPercent: 18 },
      ];
      const createdCats: Record<string, number> = {};
      for (const c of catData) {
        const cat = await storage.createCategory(c);
        createdCats[cat.name] = cat.id;
      }

      // Seed products
      const prodData = [
        { name: "Premium Glass Water Bottle Set", categoryId: createdCats["Kitchen"], image: "https://images.unsplash.com/photo-1602143407151-01114192003b?auto=format&fit=crop&q=80&w=500", costPrice: 250, mrp: 699, tags: ["Bestseller", "High Margin"], status: "Active" },
        { name: "Stackable Storage Bins (Set of 3)", categoryId: createdCats["Storage"], image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=500", costPrice: 450, mrp: 1299, tags: ["Recommended"], status: "Active" },
        { name: "Minimalist Desk Organizer", categoryId: createdCats["Stationery"], image: "https://images.unsplash.com/photo-1520970014086-2208d15799f0?auto=format&fit=crop&q=80&w=500", costPrice: 180, mrp: 499, tags: ["New"], status: "Active" },
        { name: "Kids Educational Building Blocks", categoryId: createdCats["Toys"], image: "https://images.unsplash.com/photo-1587654780291-39c940483713?auto=format&fit=crop&q=80&w=500", costPrice: 350, mrp: 899, tags: ["Kids", "Seasonal"], status: "Active" },
        { name: "Ceramic Flower Vase", categoryId: createdCats["Decor"], image: "https://images.unsplash.com/photo-1581783342308-f792ca11df53?auto=format&fit=crop&q=80&w=500", costPrice: 120, mrp: 399, tags: ["High Margin"], status: "Active" },
        { name: "Canvas Tote Bag", categoryId: createdCats["Bags"], image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=500", costPrice: 85, mrp: 299, tags: ["Eco Friendly", "Bestseller"], status: "Active" },
        { name: "Bamboo Bathroom Set", categoryId: createdCats["Bathroom"], image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=500", costPrice: 550, mrp: 1499, tags: ["Luxury"], status: "Active" },
        { name: "Microfiber Cleaning Cloths (Pack of 5)", categoryId: createdCats["Cleaning"], image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=500", costPrice: 90, mrp: 249, tags: ["Essentials"], status: "Active" },
        { name: "Scented Soy Candle", categoryId: createdCats["Gifts"], image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=500", costPrice: 140, mrp: 449, tags: ["Gifting", "Seasonal"], status: "Active" },
        { name: "Stainless Steel Lunch Box", categoryId: createdCats["Kitchen"], image: "https://images.unsplash.com/photo-1594910243285-b1a72d3f232b?auto=format&fit=crop&q=80&w=500", costPrice: 280, mrp: 799, tags: ["Durable"], status: "Active" },
      ];
      for (const p of prodData) {
        await storage.createProduct(p);
      }

      // Seed clients
      const clientData = [
        { name: "Rahul Sharma", city: "Jaipur", stage: "3D Design", phone: "+91 98765 43210", email: "rahul.s@example.com", totalPaid: 150000, totalDue: 350000, nextAction: "Approve 3D Design Layout", managerName: "Amit Verma", managerPhone: "+91 99999 88888", storeAddress: "Plot 45, Raja Park, Jaipur", storeArea: 300 },
        { name: "Priya Patel", city: "Ahmedabad", stage: "Location Approved", phone: "+91 98989 89898", email: "priya.p@example.com", totalPaid: 50000, totalDue: 450000, nextAction: "Submit Floor Plan measurements", managerName: "Sneha Gupta", managerPhone: "+91 77777 66666", storeAddress: "Shop 12, CG Road, Ahmedabad", storeArea: 250 },
        { name: "Vikram Singh", city: "Chandigarh", stage: "Lead", phone: "+91 91234 56789", email: "vikram.s@example.com", totalPaid: 0, totalDue: 500000, nextAction: "Schedule Initial Call", managerName: "Amit Verma", managerPhone: "+91 99999 88888" },
      ];
      for (const c of clientData) {
        await storage.createClient(c);
      }

      // Seed payments for client 1
      const payData = [
        { clientId: 1, invoiceId: "INV-001", date: "Jan 15, 2024", description: "Token Amount", amount: 50000, status: "Paid", method: "Bank Transfer" },
        { clientId: 1, invoiceId: "INV-002", date: "Feb 10, 2024", description: "Partial Payment (Inventory)", amount: 100000, status: "Paid", method: "UPI" },
        { clientId: 1, invoiceId: "INV-003", date: "Pending", description: "Final Settlement", amount: 350000, status: "Due", method: "" },
      ];
      for (const p of payData) {
        await storage.createPayment(p);
      }

      // Seed price settings
      const settingsData = [
        { key: "exchange_rate", value: "83.5", label: "USD/INR Exchange Rate" },
        { key: "freight_percent", value: "8", label: "Freight % of Cost" },
        { key: "markup_percent", value: "40", label: "Default Markup %" },
        { key: "gst_default", value: "18", label: "Default GST %" },
      ];
      for (const s of settingsData) {
        await storage.upsertPriceSetting(s);
      }

      res.json({ message: "Seeded successfully" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return httpServer;
}
