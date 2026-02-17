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
  state: string | null;
  stage: string;
  phone: string | null;
  email: string | null;
  leadSource: string | null;

  scoreBudget: number | null;
  scoreLocation: number | null;
  scoreOperator: number | null;
  scoreTimeline: number | null;
  scoreExperience: number | null;
  scoreEngagement: number | null;
  totalScore: number | null;

  selectedPackage: string | null;
  totalInvestment: number | null;
  totalPaid: number | null;
  totalDue: number | null;

  storeAddress: string | null;
  storeArea: number | null;
  storeFrontage: number | null;

  launchPhase: string | null;
  estimatedLaunchDate: string | null;
  actualLaunchDate: string | null;

  nextAction: string | null;
  nextActionDate: string | null;
  assignedTo: string | null;

  qualificationFormCompleted: boolean;
  scopeDocShared: boolean;
  agreementSigned: boolean;

  notes: string | null;
  managerName: string | null;
  managerPhone: string | null;

  createdAt: string | null;
  updatedAt: string | null;
}

export const insertClientSchema = z.object({
  userId: z.number().nullable().optional(),
  name: z.string().min(1),
  city: z.string().min(1),
  state: z.string().nullable().optional(),
  stage: z.string().default("New Inquiry"),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  leadSource: z.string().nullable().optional(),

  scoreBudget: z.number().nullable().optional().default(0),
  scoreLocation: z.number().nullable().optional().default(0),
  scoreOperator: z.number().nullable().optional().default(0),
  scoreTimeline: z.number().nullable().optional().default(0),
  scoreExperience: z.number().nullable().optional().default(0),
  scoreEngagement: z.number().nullable().optional().default(0),
  totalScore: z.number().nullable().optional().default(0),

  selectedPackage: z.string().nullable().optional(),
  totalInvestment: z.number().nullable().optional().default(0),
  totalPaid: z.number().nullable().optional().default(0),
  totalDue: z.number().nullable().optional().default(0),

  storeAddress: z.string().nullable().optional(),
  storeArea: z.number().nullable().optional(),
  storeFrontage: z.number().nullable().optional(),

  launchPhase: z.string().nullable().optional(),
  estimatedLaunchDate: z.string().nullable().optional(),
  actualLaunchDate: z.string().nullable().optional(),

  nextAction: z.string().nullable().optional(),
  nextActionDate: z.string().nullable().optional(),
  assignedTo: z.string().nullable().optional(),

  qualificationFormCompleted: z.boolean().optional().default(false),
  scopeDocShared: z.boolean().optional().default(false),
  agreementSigned: z.boolean().optional().default(false),

  notes: z.string().nullable().optional(),
  managerName: z.string().nullable().optional(),
  managerPhone: z.string().nullable().optional(),
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

export interface ReadinessChecklistItem {
  id: number;
  category: string;
  label: string;
  sortOrder: number;
}

export interface ReadinessChecklistStatus {
  id: number;
  clientId: number;
  itemId: number;
  completed: boolean;
  updatedAt: string | null;
}

export interface WhatsAppTemplate {
  id: number;
  title: string;
  stage: string;
  body: string;
  mergeFields: string | null;
  sortOrder: number;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  sortOrder: number;
}

export const qualificationFormSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  city: z.string().min(1),
  state: z.string().min(1),
  currentOccupation: z.string().optional(),
  previousBusiness: z.enum(["yes", "no"]),
  previousBusinessDetails: z.string().optional(),
  investmentRange: z.enum(["below_8l", "8_10l", "10_15l", "above_15l"]),
  timeline: z.enum(["less_1_month", "1_3_months", "3_6_months", "above_6_months"]),
  operatorType: z.enum(["self", "hiring", "passive"]),
  exploringOther: z.enum(["yes", "no"]),
  hasLocation: z.enum(["yes", "searching", "not_yet"]),
  locationAddress: z.string().optional(),
  locationArea: z.number().optional(),
  locationFloor: z.string().optional(),
  locationFrontage: z.number().optional(),
  monthlyRentBudget: z.number().optional(),
  attraction: z.string().optional(),
  expectedRevenue: z.enum(["below_2l", "2_4l", "4_6l", "above_6l"]).optional(),
  understandsNotFranchise: z.enum(["yes", "need_clarification"]).optional(),
});
export type QualificationFormData = z.infer<typeof qualificationFormSchema>;

export const PIPELINE_STAGES = [
  'New Inquiry',
  'Qualification Sent',
  'Discovery Call',
  'Proposal Sent',
  'Negotiation',
  'Token Paid',
  'In Execution',
  'Launched',
  'Lost',
] as const;

export const LEAD_SOURCES = [
  'WhatsApp',
  'Referral',
  'Social Media',
  'Walk-in',
  'Website',
  'Other',
] as const;

export const LAUNCH_PHASES = [
  'Planning',
  'Interior Kit',
  'Inventory',
  'Setup',
  'Launched',
] as const;

export const PACKAGES = [
  { id: 'Lite', name: 'Launch Lite', range: '₹8-10L', skus: '~2,000' },
  { id: 'Pro', name: 'Launch Pro', range: '₹10-15L', skus: '~3,500' },
  { id: 'Elite', name: 'Launch Elite', range: '₹15L+', skus: '~5,000+' },
] as const;

export const STAGES = PIPELINE_STAGES;

export const PRODUCT_TAGS = [
  'Bestseller',
  'New Arrival',
  'Recommended',
  'Seasonal',
  'High Margin',
  'Fast Mover',
] as const;

export const MRP_BANDS = [29, 49, 79, 99, 129, 149, 199, 249, 299, 399, 499, 599, 799, 999] as const;

export function getScoreLabel(totalScore: number | null | undefined): { label: string; color: string; emoji: string } {
  const score = totalScore || 0;
  if (score >= 15) return { label: 'Hot', color: 'text-red-600 bg-red-50', emoji: '🔴' };
  if (score >= 10) return { label: 'Warm', color: 'text-yellow-600 bg-yellow-50', emoji: '🟡' };
  return { label: 'Nurture', color: 'text-green-600 bg-green-50', emoji: '🟢' };
}
