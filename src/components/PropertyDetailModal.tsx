import React from 'react';
import type { Property } from '../types/property';
import { formatCurrency } from '../utils/calculations';
import { DealCalculator } from './DealCalculator';
import { ComparablesSales } from './ComparablesSales';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Property Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Property Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
            <h3 className="text-3xl font-bold mb-2">{property.address}</h3>
            <p className="text-xl mb-4">
              {property.city}, {property.state} {property.zipCode}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-blue-200 text-sm">Price</p>
                <p className="text-2xl font-bold">{formatCurrency(property.price)}</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Price/Sqft</p>
                <p className="text-2xl font-bold">${property.pricePerSqft.toFixed(0)}</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Beds/Baths</p>
                <p className="text-2xl font-bold">
                  {property.beds}/{property.baths}
                </p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Square Feet</p>
                <p className="text-2xl font-bold">{property.sqft.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Property Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Year Built</p>
              <p className="text-lg font-semibold">{property.yearBuilt || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Days on Market</p>
              <p className="text-lg font-semibold">{property.daysOnMarket}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Property Type</p>
              <p className="text-lg font-semibold">{property.propertyType}</p>
            </div>
          </div>

          {/* Anomaly Score */}
          {property.anomalyScore && (
            <div
              className={`rounded-lg p-4 ${
                property.anomalyScore >= 7
                  ? 'bg-green-100 border border-green-300'
                  : property.anomalyScore >= 5
                  ? 'bg-yellow-100 border border-yellow-300'
                  : 'bg-gray-100 border border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Anomaly Score</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Higher scores indicate better potential deals
                  </p>
                </div>
                <div
                  className={`text-4xl font-bold ${
                    property.anomalyScore >= 7
                      ? 'text-green-700'
                      : property.anomalyScore >= 5
                      ? 'text-yellow-700'
                      : 'text-gray-700'
                  }`}
                >
                  {property.anomalyScore.toFixed(1)}/10
                </div>
              </div>
            </div>
          )}

          {/* Public Remarks */}
          {property.remarks && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Property Description</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{property.remarks}</p>
            </div>
          )}

          {/* MLS Information */}
          {(property.mlsNumber || property.listingAgent) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Listing Information</h4>
              <div className="space-y-1">
                {property.mlsNumber && (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">MLS#:</span> {property.mlsNumber}
                  </p>
                )}
                {property.listingAgent && (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Listing Agent:</span> {property.listingAgent}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Comparables Sales */}
          <ComparablesSales property={property} />

          {/* Deal Calculator */}
          <DealCalculator property={property} />
        </div>
      </div>
    </div>
  );
};
