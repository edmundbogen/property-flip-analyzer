import React, { useMemo, useState } from 'react';
import type { Property, FilterOptions } from '../types/property';
import { DEFAULT_FILTER_OPTIONS } from '../types/property';
import { formatCurrency } from '../utils/calculations';

interface PropertyTableProps {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
  onExport: () => void;
}

type SortField = 'address' | 'price' | 'pricePerSqft' | 'anomalyScore' | 'estimatedROI' | 'daysOnMarket';
type SortDirection = 'asc' | 'desc';

export const PropertyTable: React.FC<PropertyTableProps> = ({
  properties,
  onPropertyClick,
  onExport,
}) => {
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTER_OPTIONS);
  const [sortField, setSortField] = useState<SortField>('anomalyScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const uniqueZipCodes = useMemo(() => {
    return [...new Set(properties.map((p) => p.zipCode))].filter(Boolean).sort();
  }, [properties]);

  const filteredAndSortedProperties = useMemo(() => {
    let filtered = properties.filter((property) => {
      if (property.price < filters.minPrice || property.price > filters.maxPrice) {
        return false;
      }

      if (filters.minROI > 0 && (property.estimatedROI || 0) < filters.minROI) {
        return false;
      }

      if (filters.minAnomalyScore > 0 && (property.anomalyScore || 0) < filters.minAnomalyScore) {
        return false;
      }

      if (filters.zipCodes.length > 0 && !filters.zipCodes.includes(property.zipCode)) {
        return false;
      }

      if (filters.minBeds && property.beds < filters.minBeds) {
        return false;
      }

      if (filters.maxDaysOnMarket && property.daysOnMarket > filters.maxDaysOnMarket) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: number | string = 0;
      let bValue: number | string = 0;

      switch (sortField) {
        case 'address':
          aValue = a.address;
          bValue = b.address;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'pricePerSqft':
          aValue = a.pricePerSqft;
          bValue = b.pricePerSqft;
          break;
        case 'anomalyScore':
          aValue = a.anomalyScore || 0;
          bValue = b.anomalyScore || 0;
          break;
        case 'estimatedROI':
          aValue = a.estimatedROI || 0;
          bValue = b.estimatedROI || 0;
          break;
        case 'daysOnMarket':
          aValue = a.daysOnMarket;
          bValue = b.daysOnMarket;
          break;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
    });

    return filtered;
  }, [properties, filters, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getROIColor = (roi: number | undefined): string => {
    if (!roi) return 'text-gray-500';
    if (roi >= 30) return 'text-green-600 font-semibold';
    if (roi >= 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRowColor = (property: Property): string => {
    const roi = property.estimatedROI || 0;
    if (roi >= 30) return 'bg-green-50 hover:bg-green-100';
    if (roi >= 20) return 'bg-yellow-50 hover:bg-yellow-100';
    if (roi > 0) return 'bg-red-50 hover:bg-red-100';
    return 'hover:bg-gray-50';
  };

  const handleZipCodeToggle = (zipCode: string) => {
    setFilters((prev) => {
      const newZipCodes = prev.zipCodes.includes(zipCode)
        ? prev.zipCodes.filter((z) => z !== zipCode)
        : [...prev.zipCodes, zipCode];
      return { ...prev, zipCodes: newZipCodes };
    });
  };

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Price
            </label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price
            </label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min ROI %
            </label>
            <input
              type="number"
              value={filters.minROI}
              onChange={(e) =>
                setFilters({ ...filters, minROI: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Anomaly Score
            </label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.5"
              value={filters.minAnomalyScore}
              onChange={(e) =>
                setFilters({ ...filters, minAnomalyScore: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zip Codes
            </label>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              {uniqueZipCodes.map((zip) => (
                <button
                  key={zip}
                  onClick={() => handleZipCodeToggle(zip)}
                  className={`px-2 py-1 text-xs rounded ${
                    filters.zipCodes.includes(zip)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {zip}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {filteredAndSortedProperties.length} of {properties.length} properties
          </p>
          <button
            onClick={onExport}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Export to CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort('address')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Address {sortField === 'address' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('price')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Price {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Beds/Baths
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sqft
                </th>
                <th
                  onClick={() => handleSort('pricePerSqft')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  $/Sqft {sortField === 'pricePerSqft' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('anomalyScore')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Anomaly {sortField === 'anomalyScore' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('estimatedROI')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  ROI % {sortField === 'estimatedROI' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('daysOnMarket')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  DOM {sortField === 'daysOnMarket' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedProperties.map((property) => (
                <tr
                  key={property.id}
                  onClick={() => onPropertyClick(property)}
                  className={`cursor-pointer transition-colors ${getRowColor(property)}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {property.address}
                    </div>
                    <div className="text-sm text-gray-500">
                      {property.city}, {property.state} {property.zipCode}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(property.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {property.beds}/{property.baths}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {property.sqft.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${property.pricePerSqft.toFixed(0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        (property.anomalyScore || 0) >= 7
                          ? 'bg-green-100 text-green-800'
                          : (property.anomalyScore || 0) >= 5
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {property.anomalyScore?.toFixed(1) || 'N/A'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getROIColor(property.estimatedROI)}`}>
                    {property.estimatedROI ? `${property.estimatedROI.toFixed(1)}%` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {property.daysOnMarket}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
