export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  daysOnMarket: number;
  propertyType: string;
  remarks?: string;
  listingAgent?: string;
  mlsNumber?: string;
  pricePerSqft: number;
  anomalyScore?: number;
  estimatedProfit?: number;
  estimatedROI?: number;
}

export interface DealAnalysis {
  purchasePrice: number;
  renovationBudget: number;
  estimatedARV: number;
  holdingPeriod: number; // months
  downPaymentPercent: number;
  interestRate: number;

  // Calculated fields
  acquisitionCosts: number;
  monthlyHoldingCosts: number;
  totalHoldingCosts: number;
  totalInvestment: number;
  grossProfit: number;
  sellingCosts: number;
  netProfit: number;
  totalCashInvested: number;
  roi: number;
}

export interface ComparableSale {
  id: string;
  address: string;
  salePrice: number;
  sqft: number;
  pricePerSqft: number;
  beds: number;
  baths: number;
  saleDate?: string;
}

export interface NeighborhoodStats {
  zipCode: string;
  averagePricePerSqft: number;
  medianSalePrice: number;
  propertyCount: number;
}

export interface FilterOptions {
  minPrice: number;
  maxPrice: number;
  minROI: number;
  minAnomalyScore: number;
  zipCodes: string[];
  minBeds?: number;
  maxDaysOnMarket?: number;
}

export const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  minPrice: 500000,
  maxPrice: 2000000,
  minROI: 30,
  minAnomalyScore: 0,
  zipCodes: [],
};

export interface CalculationConstants {
  PROPERTY_TAX_RATE: number; // 1.5% annual
  INSURANCE_RATE: number; // 0.5% annual
  MONTHLY_UTILITIES: number; // $500
  ACQUISITION_COST_PERCENT: number; // 3%
  SELLING_COST_PERCENT: number; // 8% (6% commission + 2% closing)
  COMMISSION_PERCENT: number; // 6%
  CLOSING_COST_PERCENT: number; // 2%
}

export const CALCULATION_CONSTANTS: CalculationConstants = {
  PROPERTY_TAX_RATE: 0.015,
  INSURANCE_RATE: 0.005,
  MONTHLY_UTILITIES: 500,
  ACQUISITION_COST_PERCENT: 0.03,
  SELLING_COST_PERCENT: 0.08,
  COMMISSION_PERCENT: 0.06,
  CLOSING_COST_PERCENT: 0.02,
};

export const DISTRESS_KEYWORDS = [
  'fixer',
  'tlc',
  'as-is',
  'as is',
  'handyman special',
  'estate sale',
  'needs work',
  'needs repair',
  'investor special',
  'cash only',
  'motivated seller',
  'bring offers',
];
