export interface PriceInputs {
  exwPriceYuan: number;
  unitsPerCarton: number;
  cartonLengthCm: number;
  cartonWidthCm: number;
  cartonHeightCm: number;
  categoryDutyPercent: number;
  categoryIgstPercent: number;
  exchangeRate: number;
  sourcingCommission: number;
  freightPerCbm: number;
  insurancePercent: number;
  swSurchargePercent: number;
  ourMarkupPercent: number;
  targetStoreMargin: number;
}

export interface PriceResult {
  fobPriceYuan: number;
  fobPriceInr: number;
  cbmPerUnit: number;
  freightPerUnit: number;
  cifPriceInr: number;
  customsDuty: number;
  swSurcharge: number;
  igst: number;
  totalLandedCost: number;
  storeLandingPrice: number;
  suggestedMrp: number;
  storeMarginPercent: number;
  storeMarginRs: number;
  marginWarning: boolean;
}

const MRP_BANDS = [29, 49, 79, 99, 129, 149, 199, 249, 299, 399, 499, 599, 799, 999];

function round2(n: number) { return Math.round(n * 100) / 100; }
function round4(n: number) { return Math.round(n * 10000) / 10000; }
function round1(n: number) { return Math.round(n * 10) / 10; }

export function calculatePrices(inputs: PriceInputs): PriceResult {
  const fobYuan = inputs.exwPriceYuan * (1 + inputs.sourcingCommission / 100);
  const fobInr = fobYuan * inputs.exchangeRate;

  const cbmPerCarton = (inputs.cartonLengthCm * inputs.cartonWidthCm * inputs.cartonHeightCm) / 1000000;
  const cbmPerUnit = inputs.unitsPerCarton > 0 ? cbmPerCarton / inputs.unitsPerCarton : 0;
  const freightPerUnit = cbmPerUnit * inputs.freightPerCbm;

  const insuranceInr = fobInr * (inputs.insurancePercent / 100);
  const cifInr = fobInr + freightPerUnit + insuranceInr;

  const customsDuty = cifInr * (inputs.categoryDutyPercent / 100);
  const swSurcharge = customsDuty * (inputs.swSurchargePercent / 100);
  const assessableValue = cifInr + customsDuty + swSurcharge;
  const igst = assessableValue * (inputs.categoryIgstPercent / 100);

  const totalLandedCost = assessableValue + igst;
  const storeLandingPrice = totalLandedCost * (1 + inputs.ourMarkupPercent / 100);

  const targetMarginFraction = (inputs.targetStoreMargin || 35) / 100;
  let suggestedMrp = MRP_BANDS[MRP_BANDS.length - 1];
  for (const band of MRP_BANDS) {
    const margin = (band - storeLandingPrice) / band;
    if (band >= storeLandingPrice && margin >= targetMarginFraction) {
      suggestedMrp = band;
      break;
    }
  }

  const storeMarginRs = suggestedMrp - storeLandingPrice;
  const storeMarginPercent = suggestedMrp > 0 ? (storeMarginRs / suggestedMrp) * 100 : 0;

  return {
    fobPriceYuan: round2(fobYuan),
    fobPriceInr: round2(fobInr),
    cbmPerUnit: round4(cbmPerUnit),
    freightPerUnit: round2(freightPerUnit),
    cifPriceInr: round2(cifInr),
    customsDuty: round2(customsDuty),
    swSurcharge: round2(swSurcharge),
    igst: round2(igst),
    totalLandedCost: round2(totalLandedCost),
    storeLandingPrice: round2(storeLandingPrice),
    suggestedMrp,
    storeMarginPercent: round1(storeMarginPercent),
    storeMarginRs: round2(storeMarginRs),
    marginWarning: storeMarginPercent < (inputs.targetStoreMargin || 35),
  };
}

export const DEFAULT_SETTINGS: Record<string, number> = {
  exchange_rate: 12.0,
  sourcing_commission: 5,
  freight_per_cbm: 8000,
  insurance_percent: 0.5,
  sw_surcharge_percent: 10,
  our_markup_percent: 25,
  target_store_margin: 50,
};
