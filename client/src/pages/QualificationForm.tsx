import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { qualificationFormSchema, type QualificationFormData } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const SECTIONS = ["Basic Details", "Business Readiness", "Location Details", "Expectations"];

const initialFormData: Record<string, any> = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  state: "",
  currentOccupation: "",
  previousBusiness: "no",
  previousBusinessDetails: "",
  investmentRange: "",
  timeline: "",
  operatorType: "",
  exploringOther: "no",
  hasLocation: "",
  locationAddress: "",
  locationArea: "",
  locationFloor: "",
  locationFrontage: "",
  monthlyRentBudget: "",
  attraction: "",
  expectedRevenue: "",
  understandsNotFranchise: "",
};

export default function QualificationForm() {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const payload: Record<string, any> = { ...data };
      if (payload.locationArea) payload.locationArea = Number(payload.locationArea);
      if (payload.locationFrontage) payload.locationFrontage = Number(payload.locationFrontage);
      if (payload.monthlyRentBudget) payload.monthlyRentBudget = Number(payload.monthlyRentBudget);
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
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateSection = (section: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (section === 0) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
    } else if (section === 1) {
      if (!formData.investmentRange) newErrors.investmentRange = "Please select an investment range";
      if (!formData.timeline) newErrors.timeline = "Please select a timeline";
      if (!formData.operatorType) newErrors.operatorType = "Please select an operator type";
    } else if (section === 2) {
      if (!formData.hasLocation) newErrors.hasLocation = "Please select a location status";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection((prev) => Math.min(prev + 1, SECTIONS.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentSection((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    if (validateSection(currentSection)) {
      mutation.mutate(formData);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
        <style>{`
          @keyframes confetti-fall {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          .confetti-piece {
            position: absolute;
            width: 10px;
            height: 10px;
            animation: confetti-fall linear forwards;
          }
        `}</style>
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              backgroundColor: ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"][i % 6],
              borderRadius: i % 3 === 0 ? "50%" : "0",
              width: `${6 + Math.random() * 8}px`,
              height: `${6 + Math.random() * 8}px`,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
        <Card className="max-w-md w-full text-center relative z-10" data-testid="success-card">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-success-title">Application Submitted!</h2>
            <p className="text-gray-600" data-testid="text-success-message">
              Thank you for your interest! Our team will connect with you within 24 hours.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-form-title">Partner with Eazy to Sell</h1>
          <p className="text-gray-600 mt-2" data-testid="text-form-subtitle">Complete this form to start your store launch journey</p>
        </div>

        <div className="flex items-center justify-between mb-8 px-4">
          {SECTIONS.map((label, idx) => (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    idx < currentSection
                      ? "bg-red-600 text-white"
                      : idx === currentSection
                      ? "bg-red-600 text-white ring-4 ring-red-100"
                      : "bg-gray-200 text-gray-500"
                  }`}
                  data-testid={`progress-step-${idx}`}
                >
                  {idx < currentSection ? "✓" : idx + 1}
                </div>
                <span className="text-xs mt-1 text-gray-500 hidden sm:block">{label}</span>
              </div>
              {idx < SECTIONS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    idx < currentSection ? "bg-red-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">{SECTIONS[currentSection]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentSection === 0 && (
              <>
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    data-testid="input-fullName"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    data-testid="input-phone"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    data-testid="input-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="Enter your email address"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      data-testid="input-city"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      placeholder="Your city"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      data-testid="input-state"
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      placeholder="Your state"
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>
                </div>
              </>
            )}

            {currentSection === 1 && (
              <>
                <div>
                  <Label htmlFor="currentOccupation">Current Occupation</Label>
                  <Input
                    id="currentOccupation"
                    data-testid="input-currentOccupation"
                    value={formData.currentOccupation}
                    onChange={(e) => updateField("currentOccupation", e.target.value)}
                    placeholder="What do you currently do?"
                  />
                </div>
                <div>
                  <Label>Have you run a business before? *</Label>
                  <RadioGroup
                    value={formData.previousBusiness}
                    onValueChange={(val) => updateField("previousBusiness", val)}
                    data-testid="radio-previousBusiness"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="prevBiz-yes" data-testid="radio-previousBusiness-yes" />
                      <Label htmlFor="prevBiz-yes" className="font-normal">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="prevBiz-no" data-testid="radio-previousBusiness-no" />
                      <Label htmlFor="prevBiz-no" className="font-normal">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                {formData.previousBusiness === "yes" && (
                  <div>
                    <Label htmlFor="previousBusinessDetails">Business Details</Label>
                    <Input
                      id="previousBusinessDetails"
                      data-testid="input-previousBusinessDetails"
                      value={formData.previousBusinessDetails}
                      onChange={(e) => updateField("previousBusinessDetails", e.target.value)}
                      placeholder="Tell us about your previous business"
                    />
                  </div>
                )}
                <div>
                  <Label>Investment Range *</Label>
                  <Select
                    value={formData.investmentRange}
                    onValueChange={(val) => updateField("investmentRange", val)}
                  >
                    <SelectTrigger data-testid="select-investmentRange">
                      <SelectValue placeholder="Select investment range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="below_8l" data-testid="select-investmentRange-below_8l">Below ₹8L</SelectItem>
                      <SelectItem value="8_10l" data-testid="select-investmentRange-8_10l">₹8-10L</SelectItem>
                      <SelectItem value="10_15l" data-testid="select-investmentRange-10_15l">₹10-15L</SelectItem>
                      <SelectItem value="above_15l" data-testid="select-investmentRange-above_15l">Above ₹15L</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.investmentRange && <p className="text-red-500 text-sm mt-1">{errors.investmentRange}</p>}
                </div>
                <div>
                  <Label>Timeline to Launch *</Label>
                  <Select
                    value={formData.timeline}
                    onValueChange={(val) => updateField("timeline", val)}
                  >
                    <SelectTrigger data-testid="select-timeline">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less_1_month" data-testid="select-timeline-less_1_month">Less than 1 month</SelectItem>
                      <SelectItem value="1_3_months" data-testid="select-timeline-1_3_months">1-3 months</SelectItem>
                      <SelectItem value="3_6_months" data-testid="select-timeline-3_6_months">3-6 months</SelectItem>
                      <SelectItem value="above_6_months" data-testid="select-timeline-above_6_months">Above 6 months</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.timeline && <p className="text-red-500 text-sm mt-1">{errors.timeline}</p>}
                </div>
                <div>
                  <Label>How will you operate the store? *</Label>
                  <RadioGroup
                    value={formData.operatorType}
                    onValueChange={(val) => updateField("operatorType", val)}
                    data-testid="radio-operatorType"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="self" id="op-self" data-testid="radio-operatorType-self" />
                      <Label htmlFor="op-self" className="font-normal">Self-operated</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hiring" id="op-hiring" data-testid="radio-operatorType-hiring" />
                      <Label htmlFor="op-hiring" className="font-normal">Hiring manager</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="passive" id="op-passive" data-testid="radio-operatorType-passive" />
                      <Label htmlFor="op-passive" className="font-normal">Passive investor</Label>
                    </div>
                  </RadioGroup>
                  {errors.operatorType && <p className="text-red-500 text-sm mt-1">{errors.operatorType}</p>}
                </div>
                <div>
                  <Label>Are you exploring other retail options?</Label>
                  <RadioGroup
                    value={formData.exploringOther}
                    onValueChange={(val) => updateField("exploringOther", val)}
                    data-testid="radio-exploringOther"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="explore-yes" data-testid="radio-exploringOther-yes" />
                      <Label htmlFor="explore-yes" className="font-normal">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="explore-no" data-testid="radio-exploringOther-no" />
                      <Label htmlFor="explore-no" className="font-normal">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            {currentSection === 2 && (
              <>
                <div>
                  <Label>Do you have a location? *</Label>
                  <RadioGroup
                    value={formData.hasLocation}
                    onValueChange={(val) => updateField("hasLocation", val)}
                    data-testid="radio-hasLocation"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="loc-yes" data-testid="radio-hasLocation-yes" />
                      <Label htmlFor="loc-yes" className="font-normal">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="searching" id="loc-searching" data-testid="radio-hasLocation-searching" />
                      <Label htmlFor="loc-searching" className="font-normal">Searching</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not_yet" id="loc-not_yet" data-testid="radio-hasLocation-not_yet" />
                      <Label htmlFor="loc-not_yet" className="font-normal">Not yet</Label>
                    </div>
                  </RadioGroup>
                  {errors.hasLocation && <p className="text-red-500 text-sm mt-1">{errors.hasLocation}</p>}
                </div>
                {formData.hasLocation === "yes" && (
                  <div>
                    <Label htmlFor="locationAddress">Location Address</Label>
                    <Input
                      id="locationAddress"
                      data-testid="input-locationAddress"
                      value={formData.locationAddress}
                      onChange={(e) => updateField("locationAddress", e.target.value)}
                      placeholder="Full address of your location"
                    />
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="locationArea">Area (sq ft)</Label>
                    <Input
                      id="locationArea"
                      data-testid="input-locationArea"
                      type="number"
                      value={formData.locationArea}
                      onChange={(e) => updateField("locationArea", e.target.value)}
                      placeholder="e.g. 500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="locationFloor">Floor</Label>
                    <Input
                      id="locationFloor"
                      data-testid="input-locationFloor"
                      value={formData.locationFloor}
                      onChange={(e) => updateField("locationFloor", e.target.value)}
                      placeholder="e.g. Ground floor"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="locationFrontage">Frontage (ft)</Label>
                    <Input
                      id="locationFrontage"
                      data-testid="input-locationFrontage"
                      type="number"
                      value={formData.locationFrontage}
                      onChange={(e) => updateField("locationFrontage", e.target.value)}
                      placeholder="e.g. 20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyRentBudget">Monthly Rent Budget (₹)</Label>
                    <Input
                      id="monthlyRentBudget"
                      data-testid="input-monthlyRentBudget"
                      type="number"
                      value={formData.monthlyRentBudget}
                      onChange={(e) => updateField("monthlyRentBudget", e.target.value)}
                      placeholder="e.g. 25000"
                    />
                  </div>
                </div>
              </>
            )}

            {currentSection === 3 && (
              <>
                <div>
                  <Label htmlFor="attraction">What attracted you to Eazy to Sell?</Label>
                  <Textarea
                    id="attraction"
                    data-testid="input-attraction"
                    value={formData.attraction}
                    onChange={(e) => updateField("attraction", e.target.value)}
                    placeholder="Tell us what excited you about partnering with us"
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Expected Monthly Revenue</Label>
                  <Select
                    value={formData.expectedRevenue}
                    onValueChange={(val) => updateField("expectedRevenue", val)}
                  >
                    <SelectTrigger data-testid="select-expectedRevenue">
                      <SelectValue placeholder="Select expected revenue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="below_2l" data-testid="select-expectedRevenue-below_2l">Below ₹2L</SelectItem>
                      <SelectItem value="2_4l" data-testid="select-expectedRevenue-2_4l">₹2-4L</SelectItem>
                      <SelectItem value="4_6l" data-testid="select-expectedRevenue-4_6l">₹4-6L</SelectItem>
                      <SelectItem value="above_6l" data-testid="select-expectedRevenue-above_6l">Above ₹6L</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Do you understand this is a Store Launch Program and not a franchise?</Label>
                  <RadioGroup
                    value={formData.understandsNotFranchise}
                    onValueChange={(val) => updateField("understandsNotFranchise", val)}
                    data-testid="radio-understandsNotFranchise"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="understand-yes" data-testid="radio-understandsNotFranchise-yes" />
                      <Label htmlFor="understand-yes" className="font-normal">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="need_clarification" id="understand-clarify" data-testid="radio-understandsNotFranchise-need_clarification" />
                      <Label htmlFor="understand-clarify" className="font-normal">Need clarification</Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            {mutation.isError && (
              <p className="text-red-500 text-sm" data-testid="text-error">
                {(mutation.error as Error).message || "Something went wrong. Please try again."}
              </p>
            )}

            <div className="flex justify-between pt-4">
              {currentSection > 0 ? (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  data-testid="button-previous"
                >
                  Previous
                </Button>
              ) : (
                <div />
              )}
              {currentSection < SECTIONS.length - 1 ? (
                <Button
                  onClick={handleNext}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  data-testid="button-next"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={mutation.isPending}
                  data-testid="button-submit"
                >
                  {mutation.isPending ? "Submitting..." : "Submit Application"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
