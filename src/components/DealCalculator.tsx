import React, { useState, useEffect } from 'react';
import type { Property } from '../types/property';
import { calculateDealAnalysis, formatCurrency, formatPercent } from '../utils/calculations';
import type { DealInputs } from '../utils/calculations';
import { ROIChart } from './ROIChart';

interface DealCalculatorProps {
  property?: Property | null;
  onClose?: () => void;
}

export const DealCalculator: React.FC<DealCalculatorProps> = ({ property, onClose }) => {
  const [inputs, setInputs] = useState<DealInputs>({
    purchasePrice: property?.price || 800000,
    renovationBudget: 700000,
    estimatedARV: 1800000,
    holdingPeriod: 12,
    downPaymentPercent: 20,
    interestRate: 8,
  });

  useEffect(() => {
    if (property) {
      setInputs((prev) => ({
        ...prev,
        purchasePrice: property.price,
      }));
    }
  }, [property]);

  const analysis = calculateDealAnalysis(inputs);

  const handleInputChange = (field: keyof DealInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Deal Analysis Calculator</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        )}
      </div>

      {property && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="font-semibold text-blue-900">{property.address}</p>
          <p className="text-sm text-blue-700">
            {property.city}, {property.state} {property.zipCode} | {property.beds} bed / {property.baths} bath | {property.sqft.toLocaleString()} sqft
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Deal Inputs</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Price
              </label>
              <input
                type="number"
                value={inputs.purchasePrice}
                onChange={(e) => handleInputChange('purchasePrice', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Renovation Budget
              </label>
              <input
                type="number"
                value={inputs.renovationBudget}
                onChange={(e) => handleInputChange('renovationBudget', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated ARV (After Repair Value)
              </label>
              <input
                type="number"
                value={inputs.estimatedARV}
                onChange={(e) => handleInputChange('estimatedARV', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Holding Period (months)
              </label>
              <input
                type="number"
                value={inputs.holdingPeriod}
                onChange={(e) => handleInputChange('holdingPeriod', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Down Payment (%)
              </label>
              <input
                type="number"
                value={inputs.downPaymentPercent}
                onChange={(e) => handleInputChange('downPaymentPercent', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.interestRate}
                onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Analysis Results</h3>

          {/* Key Metrics */}
          <div className="space-y-3 mb-6">
            <div className={`p-4 rounded-lg ${analysis.roi >= 30 ? 'bg-green-100' : analysis.roi >= 20 ? 'bg-yellow-100' : 'bg-red-100'}`}>
              <p className="text-sm text-gray-600">Return on Investment</p>
              <p className={`text-3xl font-bold ${analysis.roi >= 30 ? 'text-green-700' : analysis.roi >= 20 ? 'text-yellow-700' : 'text-red-700'}`}>
                {formatPercent(analysis.roi)}
              </p>
            </div>

            <div className={`p-4 rounded-lg ${analysis.netProfit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className="text-sm text-gray-600">Net Profit</p>
              <p className={`text-2xl font-bold ${analysis.netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {formatCurrency(analysis.netProfit)}
              </p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-gray-800 mb-3">Cost Breakdown</h4>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Purchase Price:</span>
              <span className="font-semibold">{formatCurrency(analysis.purchasePrice)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Renovation Budget:</span>
              <span className="font-semibold">{formatCurrency(analysis.renovationBudget)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Acquisition Costs (3%):</span>
              <span className="font-semibold">{formatCurrency(analysis.acquisitionCosts)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Monthly Holding:</span>
              <span className="font-semibold">{formatCurrency(analysis.monthlyHoldingCosts)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Holding ({inputs.holdingPeriod}mo):</span>
              <span className="font-semibold">{formatCurrency(analysis.totalHoldingCosts)}</span>
            </div>

            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-gray-700">Total Investment:</span>
                <span>{formatCurrency(analysis.totalInvestment)}</span>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ARV:</span>
                <span className="font-semibold">{formatCurrency(analysis.estimatedARV)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Selling Costs (8%):</span>
                <span className="font-semibold">{formatCurrency(analysis.sellingCosts)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Gross Profit:</span>
                <span className="font-semibold">{formatCurrency(analysis.grossProfit)}</span>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-700">Net Profit:</span>
                <span className={analysis.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(analysis.netProfit)}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Cash Invested:</span>
                <span className="font-semibold">{formatCurrency(analysis.totalCashInvested)}</span>
              </div>
            </div>
          </div>

          {/* ROI Guidance */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Target ROI:</strong> 30%+ for qualified flip deals
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6">
        <ROIChart analysis={analysis} />
      </div>
    </div>
  );
};
