import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { qualificationFormSchema, type QualificationFormData } from "@shared/schema";
import { ArrowRight, Store, TrendingUp, Package, Truck, Palette, CheckCircle2, MapPin, Star, Users, ShoppingBag, Zap, Lock, Shield, Layers, ChevronRight, ChevronLeft, Phone, User, Mail, Building2, Check } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import storeInterior1 from "@/assets/images/store-interior-1.png";
import shelvesCloseup from "@/assets/images/shelves-closeup.png";
import storeExterior from "@/assets/images/store-exterior.png";
import warehouse from "@/assets/images/warehouse.png";
import layout3d from "@/assets/images/3d-layout.png";
import partner1 from "@/assets/images/partner-1.png";
import partner2 from "@/assets/images/partner-2.png";
import storeInterior2 from "@/assets/images/store-interior-2.png";
import launchKitPackage from "@/assets/images/launch-kit-package.png";
import designScreen from "@/assets/images/3d-design-screen.png";

import catHeadwear from "@/assets/images/cat-headwear.png";
import catJewelry from "@/assets/images/cat-jewelry.png";
import catDressing from "@/assets/images/cat-dressing.png";
import catAccessory from "@/assets/images/cat-accessory.png";
import catCraft from "@/assets/images/cat-craft.png";
import catHousehold from "@/assets/images/cat-household.png";
import catKitchenCleaning from "@/assets/images/cat-kitchen-cleaning.png";
import catBambooWooden from "@/assets/images/cat-bamboo-wooden.png";
import catDailyChemical from "@/assets/images/cat-daily-chemical.png";
import catPaperProducts from "@/assets/images/cat-paper-products.png";
import catBooksPens from "@/assets/images/cat-books-pens.png";
import catEntertainment from "@/assets/images/cat-entertainment.png";
import catHardwareTools from "@/assets/images/cat-hardware-tools.png";
import catUtensilsTools from "@/assets/images/cat-utensils-tools.png";
import catDryingCleaning from "@/assets/images/cat-drying-cleaning.png";
import catHouseholdKitchen from "@/assets/images/cat-household-kitchen.png";
import catHomeFurnishings from "@/assets/images/cat-home-furnishings.png";
import catCottonTextile from "@/assets/images/cat-cotton-textile.png";
import catToy from "@/assets/images/cat-toy.png";
import catPremiumCeramics from "@/assets/images/cat-premium-ceramics.png";
import catPremiumGlassware from "@/assets/images/cat-premium-glassware.png";
import catForeignTrade from "@/assets/images/cat-foreign-trade.png";
import catSpecialOffers from "@/assets/images/cat-special-offers.png";

import filterHotSelling from "@/assets/images/filter-hot-selling.png";
import filterHighMargin from "@/assets/images/filter-high-margin.png";
import filterBestseller from "@/assets/images/filter-bestseller.png";
import filterNewArrivals from "@/assets/images/filter-new-arrivals.png";
import filterEcoFriendly from "@/assets/images/filter-eco-friendly.png";
import filterKids from "@/assets/images/filter-kids.png";
import filterGifting from "@/assets/images/filter-gifting.png";
import filterLuxury from "@/assets/images/filter-luxury.png";
import filterEssentials from "@/assets/images/filter-essentials.png";
import filterDurable from "@/assets/images/filter-durable.png";

import prodWaterBottles from "@/assets/images/prod-water-bottles.png";
import prodStorageBins from "@/assets/images/prod-storage-bins.png";
import prodDeskOrganizer from "@/assets/images/prod-desk-organizer.png";
import prodBuildingBlocks from "@/assets/images/prod-building-blocks.png";
import prodCeramicVases from "@/assets/images/prod-ceramic-vases.png";
import prodToteBags from "@/assets/images/prod-tote-bags.png";
import prodBathroomSet from "@/assets/images/prod-bathroom-set.png";
import prodCleaningCloths from "@/assets/images/prod-cleaning-cloths.png";
import prodCandleSet from "@/assets/images/prod-candle-set.png";
import prodLunchBox from "@/assets/images/prod-lunch-box.png";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Product, Category, FaqItem } from "@shared/schema";
import { getProductImage } from "@/lib/productImages";

const categoryImages: Record<string, string> = {
  "01.Headwear": catHeadwear,
  "02.Jewelry": catJewelry,
  "03.Dressing": catDressing,
  "04.Accessory": catAccessory,
  "05.Craft": catCraft,
  "06.Household Items": catHousehold,
  "07.Kitchen Cleaning": catKitchenCleaning,
  "08.Bamboo and Wooden Products": catBambooWooden,
  "09.Daily Chemical Products": catDailyChemical,
  "10.Paper Products and Household Cleaning": catPaperProducts,
  "11.Books and Pens": catBooksPens,
  "12.Cultural and Entertainment Products": catEntertainment,
  "13.Hardware Tools": catHardwareTools,
  "14.Utensils and Tools": catUtensilsTools,
  "15.Drying and Cleaning": catDryingCleaning,
  "16.Household and Kitchen Supplies": catHouseholdKitchen,
  "17.Home Furnishings": catHomeFurnishings,
  "18.Cotton and Textile Consumption": catCottonTextile,
  "19.Toy": catToy,
  "20.Premium Ceramics": catPremiumCeramics,
  "21.Premium Glassware": catPremiumGlassware,
  "22.Foreign Trade Zone": catForeignTrade,
  "25.Special Offers": catSpecialOffers,
};

const productImages: Record<number, string> = {
  1: prodWaterBottles,
  2: prodStorageBins,
  3: prodDeskOrganizer,
  4: prodBuildingBlocks,
  5: prodCeramicVases,
  6: prodToteBags,
  7: prodBathroomSet,
  8: prodCleaningCloths,
  9: prodCandleSet,
  10: prodLunchBox,
};

const quickFilters = [
  { label: "Hot Selling", image: filterHotSelling },
  { label: "High Margin", image: filterHighMargin },
  { label: "Bestseller", image: filterBestseller },
  { label: "New Arrivals", image: filterNewArrivals },
  { label: "Eco Friendly", image: filterEcoFriendly },
  { label: "Kids", image: filterKids },
  { label: "Gifting", image: filterGifting },
  { label: "Luxury", image: filterLuxury },
  { label: "Essentials", image: filterEssentials },
  { label: "Durable", image: filterDurable },
];

function getMarginMultiplier(price: number, mrp: number): string {
  if (!price || price <= 0) return "5x";
  const ratio = mrp / price;
  if (ratio >= 4) return "20x";
  if (ratio >= 3) return "10x";
  if (ratio >= 2.5) return "5x";
  if (ratio >= 2) return "3x";
  return "2x";
}

function getProductPrice(p: any) { return p.storeLandingPrice ?? p.costPrice ?? 0; }
function getProductMrp(p: any) { return p.suggestedMrp ?? p.mrp ?? 0; }

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

const STEP_LABELS = ["Your Details", "Business Info", "Location", "Final Step"];
const STEP_FIELDS: (keyof QualificationFormData)[][] = [
  ["fullName", "phone", "email", "city", "state"],
  ["investmentRange", "timeline", "operatorType", "previousBusiness"],
  ["hasLocation"],
  [],
];

function HeroRegistrationForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<QualificationFormData>({
    resolver: zodResolver(qualificationFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      city: "",
      state: "",
      currentOccupation: "",
      previousBusiness: "no",
      previousBusinessDetails: "",
      investmentRange: "below_8l",
      timeline: "1_3_months",
      operatorType: "self",
      exploringOther: "no",
      hasLocation: "not_yet",
      locationAddress: "",
      locationArea: undefined,
      locationFloor: "",
      locationFrontage: undefined,
      monthlyRentBudget: undefined,
      attraction: "",
      expectedRevenue: undefined,
      understandsNotFranchise: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: QualificationFormData) => {
      const payload: Record<string, any> = { ...data };
      if (!payload.locationArea) delete payload.locationArea;
      if (!payload.locationFrontage) delete payload.locationFrontage;
      if (!payload.monthlyRentBudget) delete payload.monthlyRentBudget;
      if (!payload.previousBusinessDetails) delete payload.previousBusinessDetails;
      if (!payload.locationAddress) delete payload.locationAddress;
      if (!payload.locationFloor) delete payload.locationFloor;
      if (!payload.currentOccupation) delete payload.currentOccupation;
      if (!payload.attraction) delete payload.attraction;
      if (!payload.expectedRevenue) delete payload.expectedRevenue;
      if (!payload.understandsNotFranchise) delete payload.understandsNotFranchise;
      const res = await apiRequest("POST", "/api/qualify", payload);
      return res.json();
    },
    onSuccess: () => setSubmitted(true),
    onError: (err: any) => {
      toast({ title: "Something went wrong", description: err.message, variant: "destructive" });
    },
  });

  const nextStep = async () => {
    const fields = STEP_FIELDS[step - 1];
    const valid = fields.length === 0 || await form.trigger(fields);
    if (valid && step < 4) setStep(step + 1);
  };
  const prevStep = () => { if (step > 1) setStep(step - 1); };
  const onSubmit = (data: QualificationFormData) => mutation.mutate(data);

  if (submitted) {
    return (
      <div className="bg-white dark:bg-card rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md text-center" data-testid="form-hero-success">
        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2" data-testid="text-success-title">Application Submitted</h3>
        <p className="text-sm text-muted-foreground mb-6" data-testid="text-success-message">
          Thank you for your interest. Our team will connect with you within 24 hours.
        </p>
        <Link href="/login">
          <Button className="w-full" data-testid="button-success-login">Go to Login</Button>
        </Link>
      </div>
    );
  }

  const watchHasLocation = form.watch("hasLocation");

  return (
    <div className="bg-white dark:bg-card rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md flex flex-col" data-testid="form-hero-registration">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-foreground mb-1">Start Your Store</h3>
        <p className="text-sm text-muted-foreground">Step {step} of 4 &mdash; {STEP_LABELS[step - 1]}</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex-1">
            <div className={`h-1.5 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-border"}`} data-testid={`progress-step-${s}`} />
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {step === 1 && (
            <div className="space-y-3">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Enter your full name" className="pl-10" {...field} data-testid="input-fullName" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="+91 98765 43210" className="pl-10" {...field} data-testid="input-phone" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="email" placeholder="you@example.com" className="pl-10" {...field} data-testid="input-email" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="city" render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl><Input placeholder="e.g. Jaipur" {...field} data-testid="input-city" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="state" render={({ field }) => (
                  <FormItem>
                    <FormLabel>State *</FormLabel>
                    <FormControl><Input placeholder="e.g. Rajasthan" {...field} data-testid="input-state" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <Button type="button" className="w-full" onClick={nextStep} data-testid="button-step-1-next">
                Continue <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <FormField control={form.control} name="investmentRange" render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Range *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger data-testid="select-investmentRange"><SelectValue placeholder="Select budget" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="below_8l">Below 8 Lakhs</SelectItem>
                      <SelectItem value="8_10l">8 - 10 Lakhs</SelectItem>
                      <SelectItem value="10_15l">10 - 15 Lakhs</SelectItem>
                      <SelectItem value="above_15l">Above 15 Lakhs</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="timeline" render={({ field }) => (
                <FormItem>
                  <FormLabel>Timeline to Launch *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger data-testid="select-timeline"><SelectValue placeholder="Select timeline" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="less_1_month">Less than 1 month</SelectItem>
                      <SelectItem value="1_3_months">1 - 3 months</SelectItem>
                      <SelectItem value="3_6_months">3 - 6 months</SelectItem>
                      <SelectItem value="above_6_months">Above 6 months</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="operatorType" render={({ field }) => (
                <FormItem>
                  <FormLabel>How will you operate? *</FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="space-y-1" data-testid="radio-operatorType">
                      {[{ v: "self", l: "Self-operated" }, { v: "hiring", l: "Hiring a manager" }, { v: "passive", l: "Passive investor" }].map(o => (
                        <div key={o.v} className="flex items-center gap-2">
                          <RadioGroupItem value={o.v} id={`op-${o.v}`} data-testid={`radio-operatorType-${o.v}`} />
                          <Label htmlFor={`op-${o.v}`} className="font-normal text-sm">{o.l}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="previousBusiness" render={({ field }) => (
                <FormItem>
                  <FormLabel>Previous business experience?</FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-4" data-testid="radio-previousBusiness">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="yes" id="prevBiz-yes" data-testid="radio-previousBusiness-yes" />
                        <Label htmlFor="prevBiz-yes" className="font-normal text-sm">Yes</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="no" id="prevBiz-no" data-testid="radio-previousBusiness-no" />
                        <Label htmlFor="prevBiz-no" className="font-normal text-sm">No</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={prevStep} className="flex-1" data-testid="button-step-2-back">Back</Button>
                <Button type="button" onClick={nextStep} className="flex-1" data-testid="button-step-2-next">
                  Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <FormField control={form.control} name="hasLocation" render={({ field }) => (
                <FormItem>
                  <FormLabel>Do you have a location? *</FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="space-y-1" data-testid="radio-hasLocation">
                      {[{ v: "yes", l: "Yes, I have one" }, { v: "searching", l: "Currently searching" }, { v: "not_yet", l: "Not yet" }].map(o => (
                        <div key={o.v} className="flex items-center gap-2">
                          <RadioGroupItem value={o.v} id={`loc-${o.v}`} data-testid={`radio-hasLocation-${o.v}`} />
                          <Label htmlFor={`loc-${o.v}`} className="font-normal text-sm">{o.l}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {watchHasLocation === "yes" && (
                <FormField control={form.control} name="locationAddress" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl><Input placeholder="Full address" {...field} data-testid="input-locationAddress" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="locationArea" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area (sq ft)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g. 500" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} data-testid="input-locationArea" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="monthlyRentBudget" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rent Budget</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g. 25000" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} data-testid="input-monthlyRentBudget" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={prevStep} className="flex-1" data-testid="button-step-3-back">Back</Button>
                <Button type="button" onClick={nextStep} className="flex-1" data-testid="button-step-3-next">
                  Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <FormField control={form.control} name="attraction" render={({ field }) => (
                <FormItem>
                  <FormLabel>What attracted you to Eazy to Sell?</FormLabel>
                  <FormControl><Textarea placeholder="Tell us what excited you..." rows={3} {...field} data-testid="input-attraction" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="expectedRevenue" render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Monthly Revenue</FormLabel>
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger data-testid="select-expectedRevenue"><SelectValue placeholder="Select range" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="below_2l">Below 2 Lakhs</SelectItem>
                      <SelectItem value="2_4l">2 - 4 Lakhs</SelectItem>
                      <SelectItem value="4_6l">4 - 6 Lakhs</SelectItem>
                      <SelectItem value="above_6l">Above 6 Lakhs</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="understandsNotFranchise" render={({ field }) => (
                <FormItem>
                  <FormLabel>This is a Store Launch Program, not a franchise. Understood?</FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value ?? ""} onValueChange={field.onChange} className="flex gap-4" data-testid="radio-understandsNotFranchise">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="yes" id="understand-yes" data-testid="radio-understandsNotFranchise-yes" />
                        <Label htmlFor="understand-yes" className="font-normal text-sm">Yes</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="need_clarification" id="understand-no" data-testid="radio-understandsNotFranchise-no" />
                        <Label htmlFor="understand-no" className="font-normal text-sm">Need clarification</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={prevStep} className="flex-1" data-testid="button-step-4-back">Back</Button>
                <Button type="submit" className="flex-1" disabled={mutation.isPending} data-testid="button-submit-registration">
                  {mutation.isPending ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Our team will contact you within 24 hours
              </p>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}

function QuickFilterCarousel({ filters }: { filters: { label: string; image: string }[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -280 : 280;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="py-12 bg-background" data-testid="section-quick-filters">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
          <div>
            <h3 className="text-xl font-bold">Browse by Collection</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Curated product tags for every retail niche</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="rounded-full"
              aria-label="Scroll left"
              data-testid="button-filter-scroll-left"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="rounded-full"
              aria-label="Scroll right"
              data-testid="button-filter-scroll-right"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        >
          {filters.map((filter) => (
            <div
              key={filter.label}
              className="flex flex-col items-center gap-2.5 shrink-0 cursor-pointer snap-start"
              data-testid={`filter-${filter.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              <div className="h-24 w-24 md:h-28 md:w-28 rounded-full overflow-hidden border-2 border-primary/20 shadow-md">
                <img
                  src={filter.image}
                  alt={filter.label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span className="text-xs md:text-sm font-semibold text-muted-foreground whitespace-nowrap">{filter.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: faqs = [] } = useQuery<FaqItem[]>({
    queryKey: ["/api/faqs"],
  });

  const categoryMap: Record<number, string> = {};
  categories.forEach(c => { categoryMap[c.id] = c.name; });

  const categoryProductCounts = categories.map((cat) => ({
    ...cat,
    count: products.filter((p) => p.categoryId === cat.id).length,
    image: categoryImages[cat.name] || catHeadwear,
  }));

  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section - Split Layout */}
      <section className="relative overflow-hidden" data-testid="section-hero" style={{ background: "linear-gradient(135deg, hsl(32 95% 52% / 0.08) 0%, hsl(45 90% 50% / 0.05) 50%, hsl(40 33% 98%) 100%)", minHeight: "calc(100vh - 5rem)" }}>
        <div className="w-full pl-0 pr-4 md:pr-6 py-4 md:py-6 h-full">
          <div className="grid md:grid-cols-[55%_45%] gap-4 md:gap-6 items-center h-full">
            <div className="order-2 md:order-1">
              <div className="pl-4 md:pl-8 lg:pl-16">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block h-1 w-8 rounded-full bg-primary" />
                  <span className="text-sm font-semibold text-primary tracking-wide uppercase">Now in 15+ Cities</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-3 leading-[1.1]" data-testid="text-hero-title">
                  Build Your Own{" "}
                  <span className="text-primary">Value Retail</span>{" "}
                  Store
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mb-4 leading-relaxed max-w-lg">
                  We provide the products, the store design, and the platform.
                  You bring the ambition. Launch a fully stocked, beautifully designed store in under 30 days.
                </p>
              </div>

              <div className="relative w-full">
                <img
                  src="/hero-store.png"
                  alt="Pikko franchise store with panda mascot"
                  className="w-full h-auto rounded-r-xl"
                  loading="eager"
                  data-testid="img-hero-store"
                />
                <svg
                  viewBox="0 0 180 110"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute pointer-events-none select-none w-32 md:w-[166px]"
                  style={{ top: "-10%", right: "calc(-10% - 60px)" }}
                  aria-hidden="true"
                  data-testid="svg-curvy-arrow"
                >
                  <path
                    d="M160 10 C140 8, 100 5, 70 30 C40 55, 50 75, 55 90"
                    stroke="hsl(32 95% 52%)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    style={{ strokeDasharray: 200, strokeDashoffset: 0 }}
                  />
                  <polygon
                    points="48,88 55,100 62,88"
                    fill="hsl(32 95% 52%)"
                  />
                  <text
                    x="178"
                    y="18"
                    textAnchor="end"
                    className="fill-primary"
                    style={{ fontFamily: "'Caveat', 'Segoe Script', cursive", fontSize: "22px", fontWeight: 700 }}
                  >
                    Your
                  </text>
                  <text
                    x="180"
                    y="40"
                    textAnchor="end"
                    className="fill-primary"
                    style={{ fontFamily: "'Caveat', 'Segoe Script', cursive", fontSize: "22px", fontWeight: 700 }}
                  >
                    Store!
                  </text>
                </svg>
              </div>
            </div>

            <div className="order-1 md:order-2 flex justify-center md:justify-end items-stretch pr-0 md:pr-4 lg:pr-8">
              <HeroRegistrationForm />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 border-y bg-[hsl(30,15%,10%)] dark:bg-[hsl(25,15%,6%)]" data-testid="section-stats">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1" data-testid="stat-stores">30+</div>
              <div className="text-sm font-medium text-white/50">Active Stores</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1" data-testid="stat-revenue">15L+</div>
              <div className="text-sm font-medium text-white/50">Avg. Annual Revenue</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1" data-testid="stat-margin">45%</div>
              <div className="text-sm font-medium text-white/50">Avg. Profit Margin</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1" data-testid="stat-products">35,000+</div>
              <div className="text-sm font-medium text-white/50">SKUs Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Filter Carousel */}
      <QuickFilterCarousel filters={quickFilters} />

      {/* Product Showcase */}
      <section className="py-20 bg-muted/30" data-testid="section-product-showcase">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-6">
            <span className="text-sm font-semibold text-primary tracking-wide uppercase">Product Preview</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4">Unbeatable Margins on Every Product</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              Source directly from manufacturers. Your customers pay MRP -- you keep the massive margins.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full px-4 py-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">Margins up to 5x - 10x - 20x</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full px-4 py-2">
              <Package className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Only 1 Box MOQ</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {(() => {
              const withImages = products.filter(p => p.image);
              const seen = new Set<number>();
              const diverse: typeof products = [];
              for (const p of withImages) {
                if (!seen.has(p.categoryId)) {
                  diverse.push(p);
                  seen.add(p.categoryId);
                }
                if (diverse.length >= 8) break;
              }
              if (diverse.length < 8) {
                for (const p of withImages) {
                  if (!diverse.includes(p)) diverse.push(p);
                  if (diverse.length >= 8) break;
                }
              }
              return diverse.length > 0 ? diverse : products.slice(0, 8);
            })().map((product) => {
              const price = getProductPrice(product);
              const mrp = getProductMrp(product);
              const marginMultiplier = getMarginMultiplier(price, mrp);
              const marginPercent = mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;
              const catName = categoryMap[product.categoryId] || "";
              const imgSrc = product.image || getProductImage(product.id, catName);
              return (
                <Card key={product.id} className="overflow-hidden border" data-testid={`product-card-${product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                        <span className="text-lg font-bold">{product.name.slice(0,2).toUpperCase()}</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                      <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 font-bold shadow-md">
                        {marginMultiplier} Margin
                      </Badge>
                    </div>
                    {product.tags && product.tags.length > 0 && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-white/90 dark:bg-black/70 text-foreground shadow-sm">
                          {product.tags[0]}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3 md:p-4">
                    <p className="font-semibold text-sm leading-tight mb-2 line-clamp-2" data-testid={`text-product-name-${product.id}`}>{product.name}</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs text-muted-foreground">MRP</span>
                        <span className="text-sm font-bold" data-testid={`text-product-mrp-${product.id}`}>{formatINR(mrp)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs text-muted-foreground">Partner Price</span>
                        <div className="flex items-center gap-1.5" data-testid={`text-product-locked-price-${product.id}`}>
                          <div className="relative">
                            <span className="text-sm font-bold text-green-600 blur-[5px] select-none">{formatINR(price)}</span>
                          </div>
                          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="pt-1.5 border-t mt-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs text-muted-foreground">Your Profit</span>
                          <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-[11px] font-bold px-2" data-testid={`text-product-margin-${product.id}`}>
                            {marginPercent}% margin
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 text-sm font-semibold shadow-lg" data-testid="button-unlock-catalog">
                <Lock className="h-4 w-4 mr-2" /> Sign Up to Unlock Full Catalog & Prices
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-3">35,000+ products across multiple categories. Partner pricing revealed after sign-up.</p>
          </div>
        </div>
      </section>

      {/* Categories Bento Grid */}
      <section className="py-20 bg-background" data-testid="section-categories">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-primary tracking-wide uppercase">Product Categories</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4">Categories for Every Store</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              From kitchen essentials to luxury gifting -- curate the perfect product mix for your store.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 grid-flow-dense gap-3 md:gap-4 auto-rows-[160px] md:auto-rows-[200px]">
            {categoryProductCounts.map((cat, idx) => {
              const isLarge = idx === 0 || idx === 4;
              return (
                <div
                  key={cat.id}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer ${isLarge ? "col-span-2 row-span-2" : "col-span-1 row-span-1"}`}
                  data-testid={`category-tile-${cat.name.toLowerCase()}`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <h3 className={`text-white font-bold ${isLarge ? "text-xl md:text-2xl" : "text-sm md:text-base"}`} data-testid={`text-category-name-${cat.id}`}>{cat.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-white/70 text-xs md:text-sm" data-testid={`text-category-count-${cat.id}`}>{cat.count > 0 ? `${cat.count}+ products` : "Coming soon"}</span>
                      <ChevronRight className="h-3 w-3 text-white/50" />
                    </div>
                  </div>
                  {isLarge && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 font-bold">Popular</Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Only 1 Box MOQ", desc: "No bulk orders needed", icon: Package },
              { label: "Quality Checked", desc: "Every product inspected", icon: Shield },
              { label: "35,000+ SKUs", desc: "Endless variety", icon: Layers },
              { label: "Curated Expertise", desc: "5x to 20x margins", icon: TrendingUp },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-muted/50 border" data-testid={`usp-${item.label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Stats Strip */}
      <section className="py-16 bg-[hsl(30,15%,10%)] dark:bg-[hsl(25,15%,6%)]" data-testid="section-conversion-usps">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold mb-3 text-white">Why Partners Choose <span className="text-primary">Eazy to Sell</span></h2>
            <p className="text-sm md:text-base max-w-xl mx-auto text-white/50">Product curation expertise that delivers real profits. No guesswork, no risk.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {[
              { value: "1 Box", label: "Minimum Order", sub: "No bulk commitment", icon: Package },
              { value: "35K+", label: "SKUs Available", sub: "Build your own mix", icon: Layers },
              { value: "100%", label: "Quality Checked", sub: "Factory inspected", icon: Shield },
              { value: "Multi", label: "Categories", sub: "Endless variety", icon: Store },
              { value: "5x-20x", label: "Profit Margins", sub: "Direct sourcing", icon: TrendingUp },
            ].map((item) => (
              <div key={item.label} className="text-center p-4 rounded-xl bg-white/5" data-testid={`conv-usp-${item.label.toLowerCase().replace(/\s/g, "-")}`}>
                <item.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{item.value}</div>
                <p className="text-sm font-semibold text-white/90">{item.label}</p>
                <p className="text-xs mt-0.5 text-white/40">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Showcase Grid */}
      <section className="py-20 bg-background" data-testid="section-showcase">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-primary tracking-wide uppercase">What We Deliver</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4">Everything You Need to Succeed</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              From store design to fully stocked shelves -- we handle every detail so you can focus on growing your business.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[220px] md:auto-rows-[260px]">
            <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden" data-testid="bento-store-interior">
              <img src={storeInterior1} alt="Beautiful store interior" className="w-full h-full object-cover" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className="bg-primary text-primary-foreground mb-2">Turnkey Stores</Badge>
                <h3 className="text-white text-xl md:text-2xl font-bold">Beautifully Designed Retail Spaces</h3>
                <p className="text-white/70 text-sm mt-1">Move-in ready stores with optimized layouts</p>
              </div>
            </div>

            <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden" data-testid="bento-shelves">
              <img src={shelvesCloseup} alt="Organized shelves" className="w-full h-full object-cover" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-sm font-semibold">Curated Product Displays</p>
              </div>
            </div>

            <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden" data-testid="bento-warehouse">
              <img src={warehouse} alt="Warehouse operations" className="w-full h-full object-cover" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-sm font-semibold">Supply Chain Handled</p>
              </div>
            </div>

            <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden" data-testid="bento-lifestyle">
              <img src={storeInterior2} alt="Lifestyle store" className="w-full h-full object-cover" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-sm font-semibold">Lifestyle Brands</p>
              </div>
            </div>

            <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden" data-testid="bento-launch-kit">
              <img src={launchKitPackage} alt="Launch kit package" className="w-full h-full object-cover" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-sm font-semibold">Opening Inventory Kit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Design & Architecture Section */}
      <section className="py-20 bg-muted/30" data-testid="section-3d-design">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold text-primary tracking-wide uppercase">Store Design</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">We Design Your Store in 3D Before Building It</h2>
              <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
                Our architectural team creates a complete 3D model of your retail space -- optimizing shelf placement, customer flow, and visual merchandising before a single fixture is installed.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Custom Layout Design", desc: "Tailored to your exact store dimensions and area", icon: Palette },
                  { title: "Optimized Customer Flow", desc: "Maximize footfall-to-purchase conversion", icon: MapPin },
                  { title: "Visual Merchandising Strategy", desc: "Products placed for maximum appeal and sales", icon: ShoppingBag },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-2xl border">
                <img src={designScreen} alt="3D store design on screen" className="w-full h-auto" loading="lazy" decoding="async" />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg border">
                <img src={layout3d} alt="3D floor plan layout" className="w-full h-auto" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step by Step Process */}
      <section className="py-20 bg-background" data-testid="section-steps">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary tracking-wide uppercase">Your Journey</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4">From Idea to Grand Opening</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              A proven 6-step process that gets your store open and profitable in under 30 days.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Sign Up & Consultation", desc: "Tell us about your location, budget, and vision. We'll assess the opportunity together.", icon: Users },
              { step: "02", title: "Location Approval", desc: "Share your store location. Our team evaluates footfall, demographics, and commercial viability.", icon: MapPin },
              { step: "03", title: "3D Store Design", desc: "Our architects create a complete 3D layout optimized for your exact space and product mix.", icon: Palette },
              { step: "04", title: "Select Your Launch Kit", desc: "Browse 35,000+ products, customize your opening inventory, and finalize your investment plan.", icon: Package },
              { step: "05", title: "Production & Shipping", desc: "We handle sourcing, quality checks, and deliver everything directly to your store location.", icon: Truck },
              { step: "06", title: "Grand Opening!", desc: "Your store is set up, stocked, and ready for customers. Start selling from day one.", icon: Zap },
            ].map((item) => (
              <Card key={item.step} className="border" data-testid={`step-card-${item.step}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4 gap-2">
                    <span className="text-4xl font-bold text-primary/15">{item.step}</span>
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-primary/10 shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Store Exterior + Features */}
      <section className="py-20 bg-muted/30" data-testid="section-features">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img src={storeExterior} alt="Store exterior" className="w-full h-auto" loading="lazy" decoding="async" />
            </div>
            <div>
              <span className="text-sm font-semibold text-primary tracking-wide uppercase">Why Us</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-8">Everything Is Taken Care Of</h2>
              <div className="space-y-5">
                {[
                  { title: "Branded Store Identity", desc: "Custom signage, branded interiors, and a professional storefront that builds trust." },
                  { title: "Direct-from-Factory Pricing", desc: "Source products at 40-60% below MRP. Keep the margins that matter." },
                  { title: "Real-Time Dashboard", desc: "Track sales, inventory, payments, and restocking -- all from your phone." },
                  { title: "Dedicated Store Manager Support", desc: "Your personal account manager guides you through every step of the journey." },
                  { title: "Repeat Restock Orders", desc: "One-click reordering for fast-selling items. Never run out of bestsellers." },
                ].map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">{feature.title}</p>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-background" data-testid="section-success-stories">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-primary tracking-wide uppercase">Partner Stories</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4">Real Partners, Real Results</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              Meet some of the entrepreneurs who turned their retail dreams into reality with Eazy to Sell.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="overflow-hidden border" data-testid="story-card-1">
              <div className="grid sm:grid-cols-5 h-full">
                <div className="sm:col-span-2 h-64 sm:h-auto">
                  <img src={partner1} alt="Rahul Sharma" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </div>
                <div className="sm:col-span-3 p-6 flex flex-col justify-center">
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
                  </div>
                  <p className="text-muted-foreground mb-4 italic leading-relaxed">
                    "I invested 5L and my store was profitable within the first month. The team handled everything -- from design to stocking the shelves. All I had to do was open the doors."
                  </p>
                  <div>
                    <p className="font-bold">Rahul Sharma</p>
                    <p className="text-sm text-muted-foreground">Store Owner, Jaipur</p>
                  </div>
                  <div className="mt-4 pt-4 border-t flex gap-6 flex-wrap">
                    <div>
                      <p className="text-xl font-bold text-primary">18L</p>
                      <p className="text-xs text-muted-foreground">Annual Revenue</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">48%</p>
                      <p className="text-xs text-muted-foreground">Profit Margin</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden border" data-testid="story-card-2">
              <div className="grid sm:grid-cols-5 h-full">
                <div className="sm:col-span-2 h-64 sm:h-auto">
                  <img src={partner2} alt="Priya Patel" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </div>
                <div className="sm:col-span-3 p-6 flex flex-col justify-center">
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
                  </div>
                  <p className="text-muted-foreground mb-4 italic leading-relaxed">
                    "The 3D design blew me away. I could see exactly how my store would look before anything was built. The product margins are incredible -- my customers love the quality and pricing."
                  </p>
                  <div>
                    <p className="font-bold">Priya Patel</p>
                    <p className="text-sm text-muted-foreground">Store Owner, Ahmedabad</p>
                  </div>
                  <div className="mt-4 pt-4 border-t flex gap-6 flex-wrap">
                    <div>
                      <p className="text-xl font-bold text-primary">22L</p>
                      <p className="text-xs text-muted-foreground">Annual Revenue</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">52%</p>
                      <p className="text-xs text-muted-foreground">Profit Margin</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="py-20 bg-muted/30" data-testid="section-faq">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-primary tracking-wide uppercase">FAQs</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4" data-testid="text-faq-title">Frequently Asked Questions</h2>
              <p className="text-muted-foreground text-base md:text-lg">Everything you need to know about partnering with Eazy to Sell</p>
            </div>
            <Accordion type="single" collapsible className="w-full" data-testid="accordion-faq">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={`faq-${faq.id}`} data-testid={`faq-item-${faq.id}`}>
                  <AccordionTrigger className="text-base font-semibold text-left" data-testid={`faq-trigger-${faq.id}`}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed" data-testid={`faq-content-${faq.id}`}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden" data-testid="section-cta">
        <div className="absolute inset-0">
          <img src={storeInterior1} alt="Store background" className="w-full h-full object-cover" loading="lazy" decoding="async" />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to Build Your Retail Empire?</h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-10 text-base md:text-lg leading-relaxed">
            Join 30+ successful retail partners across India. Investment starts at 5 Lakhs. Full support from day one to profitability.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="h-14 px-10 text-base font-semibold shadow-xl" data-testid="button-cta-start">
                Create Partner Account <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/roi-calculator">
              <Button variant="outline" size="lg" className="h-14 px-10 text-base font-semibold bg-white/10 backdrop-blur-md border-white/20 text-white" data-testid="button-cta-roi">
                Calculate Your Returns
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
