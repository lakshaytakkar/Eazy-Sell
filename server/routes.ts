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
    if (req.body.customsDutyPercent !== undefined || req.body.igstPercent !== undefined) {
      const count = await storage.recalculateCategoryProducts(Number(req.params.id));
      return res.json({ ...cat, recalculatedProducts: count });
    }
    res.json(cat);
  });

  app.delete("/api/categories/:id", async (req, res) => {
    await storage.deleteCategory(Number(req.params.id));
    res.status(204).send();
  });

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

  app.post("/api/products/bulk", async (req, res) => {
    try {
      const products = req.body.products;
      if (!Array.isArray(products)) return res.status(400).json({ error: "products array required" });
      const results = [];
      const errors = [];
      for (let i = 0; i < products.length; i++) {
        const parsed = insertProductSchema.safeParse(products[i]);
        if (!parsed.success) {
          errors.push({ row: i + 1, error: parsed.error.message });
          continue;
        }
        try {
          const prod = await storage.createProduct(parsed.data);
          results.push(prod);
        } catch (err: any) {
          errors.push({ row: i + 1, error: err.message });
        }
      }
      res.json({ imported: results.length, errors: errors.length, details: errors });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
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

  app.post("/api/recalculate-all", async (_req, res) => {
    try {
      const count = await storage.recalculateAllProducts();
      res.json({ message: `Recalculated ${count} products`, count });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

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

  app.get("/api/settings", async (_req, res) => {
    const settings = await storage.getPriceSettings();
    res.json(settings);
  });

  app.get("/api/settings/map", async (_req, res) => {
    const map = await storage.getSettingsMap();
    res.json(map);
  });

  app.post("/api/settings", async (req, res) => {
    const parsed = insertPriceSettingSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const setting = await storage.upsertPriceSetting(parsed.data);
    res.json(setting);
  });

  app.post("/api/sync-airtable", async (_req, res) => {
    try {
      const airtableToken = process.env.AIRTABLE_API_TOKEN;
      if (!airtableToken) {
        return res.status(500).json({ error: "AIRTABLE_API_TOKEN not set" });
      }

      const baseId = "appJ3KjLi2gubnBak";
      const allRecords: Array<{ id: string; fields: Record<string, any> }> = [];
      let offset: string | undefined;
      do {
        const pageUrl = `https://api.airtable.com/v0/${baseId}/Customers${offset ? `?offset=${offset}` : ""}`;
        const airtableRes = await fetch(pageUrl, {
          headers: { Authorization: `Bearer ${airtableToken}` },
        });
        if (!airtableRes.ok) {
          const errText = await airtableRes.text();
          return res.status(500).json({ error: `Airtable fetch failed: ${errText}` });
        }
        const page = await airtableRes.json() as {
          records: Array<{ id: string; fields: Record<string, any> }>;
          offset?: string;
        };
        allRecords.push(...page.records);
        offset = page.offset;
      } while (offset);

      const statusToStage: Record<string, string> = {
        "Active": "Active",
        "All Done": "Launched",
        "Searching Area": "Location Shared",
        "Pending": "Lead",
      };

      const parseArea = (val: string | undefined): number | null => {
        if (!val) return null;
        const match = val.match(/(\d[\d,]*)/);
        return match ? parseInt(match[1].replace(/,/g, ""), 10) : null;
      };

      const knownCities = [
        "Delhi", "New Delhi", "Mumbai", "Ahmedabad", "Jaipur", "Chandigarh",
        "Mathura", "Jind", "Rohini", "Ladpur", "Idar", "Ankleshwar",
        "Raigang", "Najafgarh", "Gurgaon", "Noida", "Hyderabad",
        "Greater Kailash", "Kalkaji", "Kukatpally", "Gujarat", "UK",
        "West Bengal", "Uttar Pradesh", "Haryana", "Telangana",
      ];
      const extractCity = (location: string | undefined): string => {
        if (!location) return "Unknown";
        for (const city of knownCities) {
          if (location.toLowerCase().includes(city.toLowerCase())) return city;
        }
        const parts = location.split(",").map(s => s.trim()).filter(Boolean);
        const lastMeaningful = parts.find(p => p.length > 2 && !/^\d/.test(p) && !p.includes("floor"));
        return lastMeaningful || parts[0] || "Unknown";
      };

      const { supabase: sb } = await import("./supabase");

      await sb.from("payments").delete().neq("id", 0);
      await sb.from("launch_kit_items").delete().neq("id", 0);
      await sb.from("launch_kit_submissions").delete().neq("id", 0);
      await sb.from("clients").delete().neq("id", 0);

      const syncedClients: Array<{ name: string; id: number }> = [];
      const syncedPayments: Array<{ clientName: string; amount: number }> = [];
      let skipped = 0;

      for (const record of allRecords) {
        const f = record.fields;
        const customerName = f["Customer Name"];
        if (!customerName) { skipped++; continue; }

        const status = f["Status"] || "Pending";
        const stage = statusToStage[status] || "Lead";
        const location = f["Customer Location"] || "";
        const city = extractCity(location);
        const storeLocation = f["Stores location"] || f["Customer Location"] || "";

        const clientRow = {
          name: customerName.trim(),
          city,
          stage,
          phone: f["Customer Number"] || null,
          email: f["Customer Email"] || null,
          total_paid: f["Payment Amount"] || 0,
          total_due: 0,
          next_action: null,
          manager_name: null,
          manager_phone: null,
          store_address: storeLocation || null,
          store_area: parseArea(f["Store Area"]),
          user_id: null,
        };

        const { data: inserted, error: clientErr } = await sb
          .from("clients")
          .insert(clientRow)
          .select()
          .single();

        if (clientErr || !inserted) {
          console.error(`Failed to insert client ${customerName}:`, clientErr);
          continue;
        }

        syncedClients.push({ name: customerName, id: inserted.id });

        if (f["Payment Amount"] && f["Payment Amount"] > 0) {
          const paymentRow = {
            client_id: inserted.id,
            invoice_id: f["Payment Description"] || `AT-${record.id}`,
            date: f["Payment Date"] || new Date().toISOString().split("T")[0],
            description: f["Payment Description"] || "Payment from Airtable",
            amount: f["Payment Amount"],
            status: "Paid",
            method: f["Payments"] || "Other",
          };

          const { error: payErr } = await sb.from("payments").insert(paymentRow);
          if (payErr) {
            console.error(`Failed to insert payment for ${customerName}:`, payErr);
          } else {
            syncedPayments.push({ clientName: customerName, amount: f["Payment Amount"] });
          }
        }
      }

      res.json({
        message: "Airtable sync complete",
        clients: syncedClients.length,
        payments: syncedPayments.length,
        skipped,
        details: { syncedClients, syncedPayments },
      });
    } catch (err: any) {
      console.error("Airtable sync error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/seed", async (_req, res) => {
    try {
      const existingProducts = await storage.getProducts();
      if (existingProducts.length > 0) {
        return res.json({ message: "Already seeded" });
      }

      const catData = [
        { name: "Kitchen", customsDutyPercent: 5, igstPercent: 18 },
        { name: "Stationery", customsDutyPercent: 0, igstPercent: 12 },
        { name: "Toys", customsDutyPercent: 10, igstPercent: 18 },
        { name: "Decor", customsDutyPercent: 5, igstPercent: 18 },
        { name: "Storage", customsDutyPercent: 5, igstPercent: 18 },
        { name: "Bags", customsDutyPercent: 10, igstPercent: 18 },
        { name: "Bathroom", customsDutyPercent: 5, igstPercent: 18 },
        { name: "Cleaning", customsDutyPercent: 0, igstPercent: 12 },
        { name: "Gifts", customsDutyPercent: 5, igstPercent: 18 },
      ];
      const createdCats: Record<string, number> = {};
      for (const c of catData) {
        const cat = await storage.createCategory(c);
        createdCats[cat.name] = cat.id;
      }

      const prodData = [
        { name: "Premium Glass Water Bottle Set", categoryId: createdCats["Kitchen"], image: "https://images.unsplash.com/photo-1602143407151-01114192003b?auto=format&fit=crop&q=80&w=500", exwPriceYuan: 8.5, unitsPerCarton: 24, cartonLengthCm: 50, cartonWidthCm: 40, cartonHeightCm: 35, tags: ["Bestseller", "High Margin"], status: "Active" },
        { name: "Stackable Storage Bins (Set of 3)", categoryId: createdCats["Storage"], image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=500", exwPriceYuan: 15, unitsPerCarton: 12, cartonLengthCm: 60, cartonWidthCm: 45, cartonHeightCm: 40, tags: ["Recommended"], status: "Active" },
        { name: "Minimalist Desk Organizer", categoryId: createdCats["Stationery"], image: "https://images.unsplash.com/photo-1520970014086-2208d15799f0?auto=format&fit=crop&q=80&w=500", exwPriceYuan: 6, unitsPerCarton: 36, cartonLengthCm: 55, cartonWidthCm: 40, cartonHeightCm: 30, tags: ["New Arrival"], status: "Active" },
        { name: "Kids Educational Building Blocks", categoryId: createdCats["Toys"], image: "https://images.unsplash.com/photo-1587654780291-39c940483713?auto=format&fit=crop&q=80&w=500", exwPriceYuan: 12, unitsPerCarton: 20, cartonLengthCm: 55, cartonWidthCm: 45, cartonHeightCm: 40, tags: ["Seasonal"], status: "Active" },
        { name: "Ceramic Flower Vase", categoryId: createdCats["Decor"], image: "https://images.unsplash.com/photo-1581783342308-f792ca11df53?auto=format&fit=crop&q=80&w=500", exwPriceYuan: 4.5, unitsPerCarton: 48, cartonLengthCm: 50, cartonWidthCm: 40, cartonHeightCm: 35, tags: ["High Margin"], status: "Active" },
        { name: "Canvas Tote Bag", categoryId: createdCats["Bags"], image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=500", exwPriceYuan: 3.5, unitsPerCarton: 60, cartonLengthCm: 50, cartonWidthCm: 40, cartonHeightCm: 30, tags: ["Bestseller", "Fast Mover"], status: "Active" },
        { name: "Bamboo Bathroom Set", categoryId: createdCats["Bathroom"], image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=500", exwPriceYuan: 18, unitsPerCarton: 12, cartonLengthCm: 55, cartonWidthCm: 45, cartonHeightCm: 35, tags: ["Recommended"], status: "Active" },
        { name: "Microfiber Cleaning Cloths (Pack of 5)", categoryId: createdCats["Cleaning"], image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=500", exwPriceYuan: 2.5, unitsPerCarton: 100, cartonLengthCm: 50, cartonWidthCm: 40, cartonHeightCm: 35, tags: ["Fast Mover"], status: "Active" },
        { name: "Scented Soy Candle", categoryId: createdCats["Gifts"], image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=500", exwPriceYuan: 5, unitsPerCarton: 36, cartonLengthCm: 45, cartonWidthCm: 35, cartonHeightCm: 30, tags: ["Seasonal"], status: "Active" },
        { name: "Stainless Steel Lunch Box", categoryId: createdCats["Kitchen"], image: "https://images.unsplash.com/photo-1594910243285-b1a72d3f232b?auto=format&fit=crop&q=80&w=500", exwPriceYuan: 10, unitsPerCarton: 24, cartonLengthCm: 50, cartonWidthCm: 40, cartonHeightCm: 30, tags: ["Bestseller"], status: "Active" },
      ];
      for (const p of prodData) {
        await storage.createProduct(p);
      }

      const clientData = [
        { name: "Rahul Sharma", city: "Jaipur", stage: "3D Design", phone: "+91 98765 43210", email: "rahul.s@example.com", totalPaid: 150000, totalDue: 350000, nextAction: "Approve 3D Design Layout", managerName: "Amit Verma", managerPhone: "+91 99999 88888", storeAddress: "Plot 45, Raja Park, Jaipur", storeArea: 300 },
        { name: "Priya Patel", city: "Ahmedabad", stage: "Location Approved", phone: "+91 98989 89898", email: "priya.p@example.com", totalPaid: 50000, totalDue: 450000, nextAction: "Submit Floor Plan measurements", managerName: "Sneha Gupta", managerPhone: "+91 77777 66666", storeAddress: "Shop 12, CG Road, Ahmedabad", storeArea: 250 },
        { name: "Vikram Singh", city: "Chandigarh", stage: "Lead", phone: "+91 91234 56789", email: "vikram.s@example.com", totalPaid: 0, totalDue: 500000, nextAction: "Schedule Initial Call", managerName: "Amit Verma", managerPhone: "+91 99999 88888" },
      ];
      for (const c of clientData) {
        await storage.createClient(c);
      }

      const payData = [
        { clientId: 1, invoiceId: "INV-001", date: "Jan 15, 2024", description: "Token Amount", amount: 50000, status: "Paid", method: "Bank Transfer" },
        { clientId: 1, invoiceId: "INV-002", date: "Feb 10, 2024", description: "Partial Payment (Inventory)", amount: 100000, status: "Paid", method: "UPI" },
        { clientId: 1, invoiceId: "INV-003", date: "Pending", description: "Final Settlement", amount: 350000, status: "Due", method: "" },
      ];
      for (const p of payData) {
        await storage.createPayment(p);
      }

      const settingsData = [
        { key: "exchange_rate", value: "12.0", label: "Yuan to INR Exchange Rate" },
        { key: "sourcing_commission", value: "5", label: "Sourcing Commission %" },
        { key: "freight_per_cbm", value: "8000", label: "Freight Rate per CBM (INR)" },
        { key: "insurance_percent", value: "0.5", label: "Insurance % of FOB" },
        { key: "sw_surcharge_percent", value: "10", label: "Social Welfare Surcharge %" },
        { key: "our_markup_percent", value: "25", label: "Our Markup %" },
        { key: "target_store_margin", value: "50", label: "Target Store Margin % for MRP" },
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
