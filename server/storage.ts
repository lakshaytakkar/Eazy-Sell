import { supabase } from "./supabase";
import { calculatePrices, DEFAULT_SETTINGS, type PriceInputs } from "./priceEngine";
import type {
  User, InsertUser,
  Category, InsertCategory,
  Product, InsertProduct,
  Client, InsertClient,
  LaunchKitItem, InsertLaunchKitItem,
  LaunchKitSubmission, InsertLaunchKitSubmission,
  Payment, InsertPayment,
  PriceSetting, InsertPriceSetting,
} from "@shared/schema";

function snakeToCamel(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (typeof obj !== "object") return obj;
  const result: any = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = obj[key];
  }
  return result;
}

function camelToSnake(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(camelToSnake);
  if (typeof obj !== "object") return obj;
  const result: any = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase());
    result[snakeKey] = obj[key];
  }
  return result;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(cat: InsertCategory): Promise<Category>;
  updateCategory(id: number, cat: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<void>;

  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(prod: InsertProduct): Promise<Product>;
  updateProduct(id: number, prod: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;

  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<void>;

  getKitItems(clientId: number): Promise<LaunchKitItem[]>;
  upsertKitItem(item: InsertLaunchKitItem): Promise<LaunchKitItem>;
  removeKitItem(id: number): Promise<void>;
  clearKit(clientId: number): Promise<void>;

  getSubmissions(): Promise<LaunchKitSubmission[]>;
  getSubmission(id: number): Promise<LaunchKitSubmission | undefined>;
  getSubmissionsByClient(clientId: number): Promise<LaunchKitSubmission[]>;
  createSubmission(sub: InsertLaunchKitSubmission): Promise<LaunchKitSubmission>;
  updateSubmission(id: number, sub: Partial<InsertLaunchKitSubmission>): Promise<LaunchKitSubmission | undefined>;

  getPaymentsByClient(clientId: number): Promise<Payment[]>;
  getAllPayments(): Promise<Payment[]>;
  createPayment(pay: InsertPayment): Promise<Payment>;
  updatePayment(id: number, pay: Partial<InsertPayment>): Promise<Payment | undefined>;

  getPriceSettings(): Promise<PriceSetting[]>;
  getSettingsMap(): Promise<Record<string, number>>;
  upsertPriceSetting(setting: InsertPriceSetting): Promise<PriceSetting>;

  recalculateProduct(productId: number): Promise<Product | undefined>;
  recalculateAllProducts(): Promise<number>;
  recalculateCategoryProducts(categoryId: number): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const { data } = await supabase.from("users").select("*").eq("id", id).single();
    return data ? snakeToCamel(data) : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data } = await supabase.from("users").select("*").eq("username", username).single();
    return data ? snakeToCamel(data) : undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await supabase.from("users").insert(camelToSnake(user)).select().single();
    if (error) throw new Error(error.message);
    return snakeToCamel(data);
  }

  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) throw new Error(error.message);
    return (data ?? []).map(snakeToCamel);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const { data } = await supabase.from("categories").select("*").eq("id", id).single();
    return data ? snakeToCamel(data) : undefined;
  }

  async createCategory(cat: InsertCategory): Promise<Category> {
    const { data, error } = await supabase.from("categories").insert(camelToSnake(cat)).select().single();
    if (error) throw new Error(error.message);
    return snakeToCamel(data);
  }

  async updateCategory(id: number, cat: Partial<InsertCategory>): Promise<Category | undefined> {
    const { data, error } = await supabase.from("categories").update(camelToSnake(cat)).eq("id", id).select().single();
    if (error) return undefined;
    return snakeToCamel(data);
  }

  async deleteCategory(id: number): Promise<void> {
    await supabase.from("categories").delete().eq("id", id);
  }

  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase.from("products").select("*");
    if (error) throw new Error(error.message);
    return (data ?? []).map(snakeToCamel);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const { data } = await supabase.from("products").select("*").eq("id", id).single();
    return data ? snakeToCamel(data) : undefined;
  }

  async createProduct(prod: InsertProduct): Promise<Product> {
    const settings = await this.getSettingsMap();
    const category = await this.getCategory(prod.categoryId);

    const snakeData: any = camelToSnake(prod);

    if (prod.exwPriceYuan && prod.exwPriceYuan > 0 && category) {
      const priceInputs: PriceInputs = {
        exwPriceYuan: prod.exwPriceYuan,
        unitsPerCarton: prod.unitsPerCarton || 1,
        cartonLengthCm: prod.cartonLengthCm || 0,
        cartonWidthCm: prod.cartonWidthCm || 0,
        cartonHeightCm: prod.cartonHeightCm || 0,
        categoryDutyPercent: category.customsDutyPercent ?? 0,
        categoryIgstPercent: category.igstPercent ?? 18,
        exchangeRate: settings.exchange_rate,
        sourcingCommission: settings.sourcing_commission,
        freightPerCbm: settings.freight_per_cbm,
        insurancePercent: settings.insurance_percent,
        swSurchargePercent: settings.sw_surcharge_percent,
        ourMarkupPercent: settings.our_markup_percent,
        targetStoreMargin: settings.target_store_margin,
      };
      const calc = calculatePrices(priceInputs);
      Object.assign(snakeData, camelToSnake(calc));
    }

    const { data, error } = await supabase.from("products").insert(snakeData).select().single();
    if (error) throw new Error(error.message);
    return snakeToCamel(data);
  }

  async updateProduct(id: number, prod: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = await this.getProduct(id);
    if (!existing) return undefined;

    const merged = { ...existing, ...prod };
    const settings = await this.getSettingsMap();
    const category = await this.getCategory(merged.categoryId);

    const snakeData: any = camelToSnake(prod);

    if (merged.exwPriceYuan && merged.exwPriceYuan > 0 && category) {
      const priceInputs: PriceInputs = {
        exwPriceYuan: merged.exwPriceYuan,
        unitsPerCarton: merged.unitsPerCarton || 1,
        cartonLengthCm: merged.cartonLengthCm || 0,
        cartonWidthCm: merged.cartonWidthCm || 0,
        cartonHeightCm: merged.cartonHeightCm || 0,
        categoryDutyPercent: category.customsDutyPercent ?? 0,
        categoryIgstPercent: category.igstPercent ?? 18,
        exchangeRate: settings.exchange_rate,
        sourcingCommission: settings.sourcing_commission,
        freightPerCbm: settings.freight_per_cbm,
        insurancePercent: settings.insurance_percent,
        swSurchargePercent: settings.sw_surcharge_percent,
        ourMarkupPercent: settings.our_markup_percent,
        targetStoreMargin: settings.target_store_margin,
      };
      const calc = calculatePrices(priceInputs);
      Object.assign(snakeData, camelToSnake(calc));
    }

    const { data, error } = await supabase.from("products").update(snakeData).eq("id", id).select().single();
    if (error) return undefined;
    return snakeToCamel(data);
  }

  async deleteProduct(id: number): Promise<void> {
    await supabase.from("products").delete().eq("id", id);
  }

  async getClients(): Promise<Client[]> {
    const { data, error } = await supabase.from("clients").select("*");
    if (error) throw new Error(error.message);
    return (data ?? []).map(snakeToCamel);
  }

  async getClient(id: number): Promise<Client | undefined> {
    const { data } = await supabase.from("clients").select("*").eq("id", id).single();
    return data ? snakeToCamel(data) : undefined;
  }

  async createClient(client: InsertClient): Promise<Client> {
    const { data, error } = await supabase.from("clients").insert(camelToSnake(client)).select().single();
    if (error) throw new Error(error.message);
    return snakeToCamel(data);
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined> {
    const { data, error } = await supabase.from("clients").update(camelToSnake(client)).eq("id", id).select().single();
    if (error) return undefined;
    return snakeToCamel(data);
  }

  async deleteClient(id: number): Promise<void> {
    await supabase.from("clients").delete().eq("id", id);
  }

  async getKitItems(clientId: number): Promise<LaunchKitItem[]> {
    const { data, error } = await supabase.from("launch_kit_items").select("*").eq("client_id", clientId);
    if (error) throw new Error(error.message);
    return (data ?? []).map(snakeToCamel);
  }

  async upsertKitItem(item: InsertLaunchKitItem): Promise<LaunchKitItem> {
    const snakeItem = camelToSnake(item);
    const { data: existing } = await supabase
      .from("launch_kit_items")
      .select("*")
      .eq("client_id", snakeItem.client_id)
      .eq("product_id", snakeItem.product_id);

    if (existing && existing.length > 0) {
      const { data, error } = await supabase
        .from("launch_kit_items")
        .update({ quantity: snakeItem.quantity })
        .eq("id", existing[0].id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return snakeToCamel(data);
    }

    const { data, error } = await supabase.from("launch_kit_items").insert(snakeItem).select().single();
    if (error) throw new Error(error.message);
    return snakeToCamel(data);
  }

  async removeKitItem(id: number): Promise<void> {
    await supabase.from("launch_kit_items").delete().eq("id", id);
  }

  async clearKit(clientId: number): Promise<void> {
    await supabase.from("launch_kit_items").delete().eq("client_id", clientId);
  }

  async getSubmissions(): Promise<LaunchKitSubmission[]> {
    const { data, error } = await supabase.from("launch_kit_submissions").select("*").order("submitted_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(snakeToCamel);
  }

  async getSubmission(id: number): Promise<LaunchKitSubmission | undefined> {
    const { data } = await supabase.from("launch_kit_submissions").select("*").eq("id", id).single();
    return data ? snakeToCamel(data) : undefined;
  }

  async getSubmissionsByClient(clientId: number): Promise<LaunchKitSubmission[]> {
    const { data, error } = await supabase.from("launch_kit_submissions").select("*").eq("client_id", clientId);
    if (error) throw new Error(error.message);
    return (data ?? []).map(snakeToCamel);
  }

  async createSubmission(sub: InsertLaunchKitSubmission): Promise<LaunchKitSubmission> {
    const { data, error } = await supabase.from("launch_kit_submissions").insert(camelToSnake(sub)).select().single();
    if (error) throw new Error(error.message);
    return snakeToCamel(data);
  }

  async updateSubmission(id: number, sub: Partial<InsertLaunchKitSubmission>): Promise<LaunchKitSubmission | undefined> {
    const { data, error } = await supabase.from("launch_kit_submissions").update(camelToSnake(sub)).eq("id", id).select().single();
    if (error) return undefined;
    return snakeToCamel(data);
  }

  async getPaymentsByClient(clientId: number): Promise<Payment[]> {
    const { data, error } = await supabase.from("payments").select("*").eq("client_id", clientId);
    if (error) throw new Error(error.message);
    return (data ?? []).map(snakeToCamel);
  }

  async getAllPayments(): Promise<Payment[]> {
    const { data, error } = await supabase.from("payments").select("*");
    if (error) throw new Error(error.message);
    return (data ?? []).map(snakeToCamel);
  }

  async createPayment(pay: InsertPayment): Promise<Payment> {
    const { data, error } = await supabase.from("payments").insert(camelToSnake(pay)).select().single();
    if (error) throw new Error(error.message);
    return snakeToCamel(data);
  }

  async updatePayment(id: number, pay: Partial<InsertPayment>): Promise<Payment | undefined> {
    const { data, error } = await supabase.from("payments").update(camelToSnake(pay)).eq("id", id).select().single();
    if (error) return undefined;
    return snakeToCamel(data);
  }

  async getPriceSettings(): Promise<PriceSetting[]> {
    const { data, error } = await supabase.from("price_settings").select("*");
    if (error) throw new Error(error.message);
    return (data ?? []).map(snakeToCamel);
  }

  async getSettingsMap(): Promise<Record<string, number>> {
    const settings = await this.getPriceSettings();
    const map: Record<string, number> = { ...DEFAULT_SETTINGS };
    for (const s of settings) {
      map[s.key] = parseFloat(s.value) || DEFAULT_SETTINGS[s.key] || 0;
    }
    return map;
  }

  async upsertPriceSetting(setting: InsertPriceSetting): Promise<PriceSetting> {
    const { data: existing } = await supabase.from("price_settings").select("*").eq("key", setting.key);

    if (existing && existing.length > 0) {
      const { data, error } = await supabase
        .from("price_settings")
        .update({ value: setting.value, label: setting.label })
        .eq("key", setting.key)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return snakeToCamel(data);
    }

    const { data, error } = await supabase.from("price_settings").insert(setting).select().single();
    if (error) throw new Error(error.message);
    return snakeToCamel(data);
  }

  async recalculateProduct(productId: number): Promise<Product | undefined> {
    const product = await this.getProduct(productId);
    if (!product) return undefined;

    const settings = await this.getSettingsMap();
    const category = await this.getCategory(product.categoryId);
    if (!category || !product.exwPriceYuan || product.exwPriceYuan <= 0) return product;

    const priceInputs: PriceInputs = {
      exwPriceYuan: product.exwPriceYuan,
      unitsPerCarton: product.unitsPerCarton || 1,
      cartonLengthCm: product.cartonLengthCm || 0,
      cartonWidthCm: product.cartonWidthCm || 0,
      cartonHeightCm: product.cartonHeightCm || 0,
      categoryDutyPercent: category.customsDutyPercent ?? 0,
      categoryIgstPercent: category.igstPercent ?? 18,
      exchangeRate: settings.exchange_rate,
      sourcingCommission: settings.sourcing_commission,
      freightPerCbm: settings.freight_per_cbm,
      insurancePercent: settings.insurance_percent,
      swSurchargePercent: settings.sw_surcharge_percent,
      ourMarkupPercent: settings.our_markup_percent,
      targetStoreMargin: settings.target_store_margin,
    };

    const calc = calculatePrices(priceInputs);
    const { data, error } = await supabase
      .from("products")
      .update(camelToSnake(calc))
      .eq("id", productId)
      .select()
      .single();
    if (error) return undefined;
    return snakeToCamel(data);
  }

  async recalculateAllProducts(): Promise<number> {
    const products = await this.getProducts();
    let count = 0;
    for (const p of products) {
      if (p.exwPriceYuan && p.exwPriceYuan > 0) {
        await this.recalculateProduct(p.id);
        count++;
      }
    }
    return count;
  }

  async recalculateCategoryProducts(categoryId: number): Promise<number> {
    const { data: products } = await supabase.from("products").select("id, exw_price_yuan").eq("category_id", categoryId);
    let count = 0;
    for (const p of (products ?? [])) {
      if (p.exw_price_yuan && p.exw_price_yuan > 0) {
        await this.recalculateProduct(p.id);
        count++;
      }
    }
    return count;
  }
}

export const storage = new DatabaseStorage();
