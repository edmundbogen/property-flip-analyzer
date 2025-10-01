import type { DealAnalysis } from '../types/property';
import { CALCULATION_CONSTANTS } from '../types/property';

export interface DealInputs {
  purchasePrice: number;
  renovationBudget: number;
  estimatedARV: number;
  holdingPeriod: number; // months
  downPaymentPercent: number;
  interestRate: number;
}

export function calculateDealAnalysis(inputs: DealInputs): DealAnalysis {
  const {
    purchasePrice,
    renovationBudget,
    estimatedARV,
    holdingPeriod,
    downPaymentPercent,
    interestRate,
  } = inputs;

  // Calculate loan amount
  const downPayment = purchasePrice * (downPaymentPercent / 100);
  const loanAmount = purchasePrice - downPayment;

  // Calculate acquisition costs (3% of purchase price)
  const acquisitionCosts = purchasePrice * CALCULATION_CONSTANTS.ACQUISITION_COST_PERCENT;

  // Calculate monthly holding costs
  const monthlyPropertyTax =
    (purchasePrice * CALCULATION_CONSTANTS.PROPERTY_TAX_RATE) / 12;
  const monthlyInsurance =
    (purchasePrice * CALCULATION_CONSTANTS.INSURANCE_RATE) / 12;
  const monthlyInterest = (loanAmount * (interestRate / 100)) / 12;
  const monthlyUtilities = CALCULATION_CONSTANTS.MONTHLY_UTILITIES;

  const monthlyHoldingCosts =
    monthlyPropertyTax + monthlyInsurance + monthlyInterest + monthlyUtilities;

  // Calculate total holding costs
  const totalHoldingCosts = monthlyHoldingCosts * holdingPeriod;

  // Calculate total investment
  const totalInvestment =
    purchasePrice + renovationBudget + totalHoldingCosts + acquisitionCosts;

  // Calculate gross profit
  const grossProfit = estimatedARV - totalInvestment;

  // Calculate selling costs (8%: 6% commission + 2% closing)
  const sellingCosts = estimatedARV * CALCULATION_CONSTANTS.SELLING_COST_PERCENT;

  // Calculate net profit
  const netProfit = grossProfit - sellingCosts;

  // Calculate total cash invested
  const totalCashInvested = downPayment + renovationBudget + totalHoldingCosts;

  // Calculate ROI
  const roi = totalCashInvested > 0 ? (netProfit / totalCashInvested) * 100 : 0;

  return {
    purchasePrice,
    renovationBudget,
    estimatedARV,
    holdingPeriod,
    downPaymentPercent,
    interestRate,
    acquisitionCosts,
    monthlyHoldingCosts,
    totalHoldingCosts,
    totalInvestment,
    grossProfit,
    sellingCosts,
    netProfit,
    totalCashInvested,
    roi,
  };
}

export function calculateQuickROI(
  purchasePrice: number,
  renovationBudget: number,
  estimatedARV: number,
  holdingPeriod: number = 12
): number {
  const analysis = calculateDealAnalysis({
    purchasePrice,
    renovationBudget,
    estimatedARV,
    holdingPeriod,
    downPaymentPercent: 20,
    interestRate: 8,
  });

  return analysis.roi;
}

export function calculateQuickProfit(
  purchasePrice: number,
  renovationBudget: number,
  estimatedARV: number,
  holdingPeriod: number = 12
): number {
  const analysis = calculateDealAnalysis({
    purchasePrice,
    renovationBudget,
    estimatedARV,
    holdingPeriod,
    downPaymentPercent: 20,
    interestRate: 8,
  });

  return analysis.netProfit;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function calculateARVFromComps(
  compsAveragePricePerSqft: number,
  propertySqft: number
): { conservative: number; moderate: number; aggressive: number } {
  const baseARV = compsAveragePricePerSqft * propertySqft;

  // Adjust based on renovation quality expectations
  return {
    conservative: baseARV * 0.95, // 5% below comps (conservative)
    moderate: baseARV, // At comps average
    aggressive: baseARV * 1.05, // 5% above comps (aggressive)
  };
}
