import { z } from "zod";

export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
}

export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  role: z.string().default("client"),
  name: z.string().min(1),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
});
export type InsertUser = z.infer<typeof insertUserSchema>;

export interface Category {
  id: number;
  name: string;
  customsDutyPercent: number;
  igstPercent: number;
  hsCode: string | null;
  dutyPercent: number | null;
  gstPercent: number | null;
}

export const insertCategorySchema = z.object({
  name: z.string().min(1),
  customsDutyPercent: z.number().default(0),
  igstPercent: z.number().default(18),
  hsCode: z.string().nullable().optional(),
});
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  image: string | null;

  exwPriceYuan: number;
  unitsPerCarton: number;
  cartonLengthCm: number;
  cartonWidthCm: number;
  cartonHeightCm: number;
  cartonWeightKg: number | null;
  moq: number | null;
  supplierName: string | null;
  hsCode: string | null;

  fobPriceYuan: number | null;
  fobPriceInr: number | null;
  cbmPerUnit: number | null;
  freightPerUnit: number | null;
  cifPriceInr: number | null;
  customsDuty: number | null;
  swSurcharge: number | null;
  igst: number | null;
  totalLandedCost: number | null;
  storeLandingPrice: number | null;
  suggestedMrp: number | null;
  storeMarginPercent: number | null;
  storeMarginRs: number | null;

  costPrice: number | null;
  mrp: number | null;

  tags: string[] | null;
  status: string;
}

export const insertProductSchema = z.object({
  name: z.string().min(1),
  categoryId: z.number(),
  image: z.string().nullable().optional(),
  exwPriceYuan: z.number().default(0),
  unitsPerCarton: z.number().default(1),
  cartonLengthCm: z.number().default(0),
  cartonWidthCm: z.number().default(0),
  cartonHeightCm: z.number().default(0),
  cartonWeightKg: z.number().nullable().optional(),
  moq: z.number().nullable().optional(),
  supplierName: z.string().nullable().optional(),
  hsCode: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional().default([]),
  status: z.string().default("Active"),
});
export type InsertProduct = z.infer<typeof insertProductSchema>;

export interface Client {
  id: number;
  userId: number | null;
  name: string;
  city: string;
  stage: string;
  phone: string | null;
  email: string | null;
  totalPaid: number | null;
  totalDue: number | null;
  nextAction: string | null;
  managerName: string | null;
  managerPhone: string | null;
  storeAddress: string | null;
  storeArea: number | null;
}

export const insertClientSchema = z.object({
  userId: z.number().nullable().optional(),
  name: z.string().min(1),
  city: z.string().min(1),
  stage: z.string().default("Lead"),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  totalPaid: z.number().nullable().optional().default(0),
  totalDue: z.number().nullable().optional().default(0),
  nextAction: z.string().nullable().optional(),
  managerName: z.string().nullable().optional(),
  managerPhone: z.string().nullable().optional(),
  storeAddress: z.string().nullable().optional(),
  storeArea: z.number().nullable().optional(),
});
export type InsertClient = z.infer<typeof insertClientSchema>;

export interface LaunchKitItem {
  id: number;
  clientId: number;
  productId: number;
  quantity: number;
}

export const insertLaunchKitItemSchema = z.object({
  clientId: z.number(),
  productId: z.number(),
  quantity: z.number().default(1),
});
export type InsertLaunchKitItem = z.infer<typeof insertLaunchKitItemSchema>;

export interface LaunchKitSubmission {
  id: number;
  clientId: number;
  status: string;
  totalInvestment: number | null;
  totalUnits: number | null;
  budget: number | null;
  comments: string | null;
  submittedAt: string | null;
}

export const insertLaunchKitSubmissionSchema = z.object({
  clientId: z.number(),
  status: z.string().default("pending"),
  totalInvestment: z.number().nullable().optional().default(0),
  totalUnits: z.number().nullable().optional().default(0),
  budget: z.number().nullable().optional().default(500000),
  comments: z.string().nullable().optional(),
});
export type InsertLaunchKitSubmission = z.infer<typeof insertLaunchKitSubmissionSchema>;

export interface Payment {
  id: number;
  clientId: number;
  invoiceId: string;
  date: string;
  description: string;
  amount: number;
  status: string;
  method: string | null;
}

export const insertPaymentSchema = z.object({
  clientId: z.number(),
  invoiceId: z.string().min(1),
  date: z.string().min(1),
  description: z.string().min(1),
  amount: z.number(),
  status: z.string().default("Due"),
  method: z.string().nullable().optional(),
});
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export interface PriceSetting {
  id: number;
  key: string;
  value: string;
  label: string;
}

export const insertPriceSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  label: z.string().min(1),
});
export type InsertPriceSetting = z.infer<typeof insertPriceSettingSchema>;

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

export const PRODUCT_TAGS = [
  'Bestseller',
  'New Arrival',
  'Recommended',
  'Seasonal',
  'High Margin',
  'Fast Mover',
] as const;

export const MRP_BANDS = [29, 49, 79, 99, 129, 149, 199, 249, 299, 399, 499, 599, 799, 999] as const;
