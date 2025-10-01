import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { DealAnalysis } from '../types/property';
import { formatCurrency } from '../utils/calculations';

interface ROIChartProps {
  analysis: DealAnalysis;
}

export const ROIChart: React.FC<ROIChartProps> = ({ analysis }) => {
  const costData = [
    {
      name: 'Purchase Price',
      amount: analysis.purchasePrice,
      color: '#3B82F6',
    },
    {
      name: 'Renovation',
      amount: analysis.renovationBudget,
      color: '#8B5CF6',
    },
    {
      name: 'Holding Costs',
      amount: analysis.totalHoldingCosts,
      color: '#EC4899',
    },
    {
      name: 'Acquisition',
      amount: analysis.acquisitionCosts,
      color: '#F59E0B',
    },
    {
      name: 'Selling Costs',
      amount: analysis.sellingCosts,
      color: '#EF4444',
    },
  ];

  const revenueData = [
    {
      name: 'ARV',
      amount: analysis.estimatedARV,
      color: '#10B981',
    },
    {
      name: 'Total Costs',
      amount: analysis.totalInvestment + analysis.sellingCosts,
      color: '#EF4444',
    },
    {
      name: 'Net Profit',
      amount: analysis.netProfit,
      color: analysis.netProfit >= 0 ? '#059669' : '#DC2626',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Cost Breakdown</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={costData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-15}
              textAnchor="end"
              height={80}
              style={{ fontSize: '12px' }}
            />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
            />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
              {costData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Revenue vs Costs vs Profit</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" style={{ fontSize: '12px' }} />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
            />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
              {revenueData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-700 font-medium">Total Investment</p>
          <p className="text-2xl font-bold text-blue-900">
            {formatCurrency(analysis.totalInvestment)}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-700 font-medium">After Repair Value</p>
          <p className="text-2xl font-bold text-green-900">
            {formatCurrency(analysis.estimatedARV)}
          </p>
        </div>

        <div
          className={`rounded-lg p-4 border ${
            analysis.netProfit >= 0
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <p
            className={`text-sm font-medium ${
              analysis.netProfit >= 0 ? 'text-green-700' : 'text-red-700'
            }`}
          >
            Net Profit
          </p>
          <p
            className={`text-2xl font-bold ${
              analysis.netProfit >= 0 ? 'text-green-900' : 'text-red-900'
            }`}
          >
            {formatCurrency(analysis.netProfit)}
          </p>
        </div>
      </div>
    </div>
  );
};
