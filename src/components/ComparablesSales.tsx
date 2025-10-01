import React, { useState } from 'react';
import type { Property, ComparableSale } from '../types/property';
import { calculateARVFromComps, formatCurrency } from '../utils/calculations';

interface ComparablesSalesProps {
  property: Property;
}

export const ComparablesSales: React.FC<ComparablesSalesProps> = ({ property }) => {
  const [comps, setComps] = useState<ComparableSale[]>([]);
  const [newComp, setNewComp] = useState<Partial<ComparableSale>>({
    address: '',
    salePrice: 0,
    sqft: 0,
    beds: 0,
    baths: 0,
    saleDate: '',
  });

  const handleAddComp = () => {
    if (newComp.address && newComp.salePrice && newComp.sqft) {
      const comp: ComparableSale = {
        id: `comp-${Date.now()}`,
        address: newComp.address,
        salePrice: newComp.salePrice,
        sqft: newComp.sqft,
        pricePerSqft: newComp.salePrice / newComp.sqft,
        beds: newComp.beds || 0,
        baths: newComp.baths || 0,
        saleDate: newComp.saleDate,
      };

      setComps([...comps, comp]);
      setNewComp({
        address: '',
        salePrice: 0,
        sqft: 0,
        beds: 0,
        baths: 0,
        saleDate: '',
      });
    }
  };

  const handleRemoveComp = (id: string) => {
    setComps(comps.filter((c) => c.id !== id));
  };

  const averagePricePerSqft = comps.length > 0
    ? comps.reduce((sum, comp) => sum + comp.pricePerSqft, 0) / comps.length
    : 0;

  const averageSalePrice = comps.length > 0
    ? comps.reduce((sum, comp) => sum + comp.salePrice, 0) / comps.length
    : 0;

  const arvEstimates = comps.length > 0
    ? calculateARVFromComps(averagePricePerSqft, property.sqft)
    : null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Comparable Sales Analysis</h3>

      {/* Add New Comp Form */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">Add Comparable Sale</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <input
            type="text"
            placeholder="Address"
            value={newComp.address}
            onChange={(e) => setNewComp({ ...newComp, address: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md col-span-2"
          />
          <input
            type="number"
            placeholder="Sale Price"
            value={newComp.salePrice || ''}
            onChange={(e) => setNewComp({ ...newComp, salePrice: Number(e.target.value) })}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="Sqft"
            value={newComp.sqft || ''}
            onChange={(e) => setNewComp({ ...newComp, sqft: Number(e.target.value) })}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="Beds"
            value={newComp.beds || ''}
            onChange={(e) => setNewComp({ ...newComp, beds: Number(e.target.value) })}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="Baths"
            value={newComp.baths || ''}
            onChange={(e) => setNewComp({ ...newComp, baths: Number(e.target.value) })}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mt-3 flex gap-3">
          <input
            type="date"
            value={newComp.saleDate}
            onChange={(e) => setNewComp({ ...newComp, saleDate: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleAddComp}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Comp
          </button>
        </div>
      </div>

      {/* Comps List */}
      {comps.length > 0 ? (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Sale Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Sqft
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    $/Sqft
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Beds/Baths
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Sale Date
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comps.map((comp) => (
                  <tr key={comp.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{comp.address}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatCurrency(comp.salePrice)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {comp.sqft.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      ${comp.pricePerSqft.toFixed(0)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {comp.beds}/{comp.baths}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{comp.saleDate || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => handleRemoveComp(comp.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700 font-medium mb-2">Average Statistics</p>
              <div className="space-y-1">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Avg Sale Price:</span>{' '}
                  {formatCurrency(averageSalePrice)}
                </p>
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Avg Price/Sqft:</span> $
                  {averagePricePerSqft.toFixed(0)}
                </p>
              </div>
            </div>

            {arvEstimates && (
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-700 font-medium mb-2">
                  Estimated ARV for Subject Property ({property.sqft.toLocaleString()} sqft)
                </p>
                <div className="space-y-1">
                  <p className="text-sm text-green-900">
                    <span className="font-semibold">Conservative:</span>{' '}
                    {formatCurrency(arvEstimates.conservative)}
                  </p>
                  <p className="text-sm text-green-900">
                    <span className="font-semibold">Moderate:</span>{' '}
                    {formatCurrency(arvEstimates.moderate)}
                  </p>
                  <p className="text-sm text-green-900">
                    <span className="font-semibold">Aggressive:</span>{' '}
                    {formatCurrency(arvEstimates.aggressive)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Guidance */}
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Use the moderate ARV estimate for conservative deal
              analysis. Only use aggressive estimates if property will receive premium
              finishes and is in a highly desirable location.
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No comparable sales added yet.</p>
          <p className="text-sm mt-2">
            Add 3-5 comparable sales to estimate the After Repair Value (ARV).
          </p>
        </div>
      )}
    </div>
  );
};
