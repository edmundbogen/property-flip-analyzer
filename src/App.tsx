import { useState, useEffect } from 'react';
import type { Property } from './types/property';
import { PropertyUpload } from './components/PropertyUpload';
import { PropertyTable } from './components/PropertyTable';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { DealCalculator } from './components/DealCalculator';
import { enrichPropertiesWithAnomalyScores } from './utils/anomalyScoring';
import { saveProperties, loadProperties, clearProperties, exportToCSV, downloadCSV } from './utils/storage';

function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [view, setView] = useState<'upload' | 'dashboard'>('upload');

  // Load properties from localStorage on mount
  useEffect(() => {
    const loaded = loadProperties();
    if (loaded.length > 0) {
      setProperties(loaded);
      setView('dashboard');
    }
  }, []);

  const handlePropertiesLoaded = (newProperties: Property[]) => {
    // Enrich with anomaly scores
    const enriched = enrichPropertiesWithAnomalyScores(newProperties);
    setProperties(enriched);
    saveProperties(enriched);
    setView('dashboard');
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleCloseModal = () => {
    setSelectedProperty(null);
  };

  const handleExport = () => {
    const csv = exportToCSV(properties);
    downloadCSV(csv, `property-analysis-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all property data? This cannot be undone.')) {
      clearProperties();
      setProperties([]);
      setView('upload');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Property Flip Analyzer
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                South Florida Real Estate Investment Analysis
              </p>
            </div>
            <div className="flex gap-3">
              {properties.length > 0 && (
                <>
                  <button
                    onClick={() => setView('upload')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Upload New Data
                  </button>
                  <button
                    onClick={() => setShowCalculator(!showCalculator)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    {showCalculator ? 'Hide Calculator' : 'New Analysis'}
                  </button>
                  <button
                    onClick={handleClearData}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Clear Data
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'upload' || properties.length === 0 ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Get Started
              </h2>
              <p className="text-gray-600">
                Upload your MLS CSV export to analyze potential flip opportunities
              </p>
            </div>
            <PropertyUpload onPropertiesLoaded={handlePropertiesLoaded} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600 mb-1">Total Properties</p>
                <p className="text-3xl font-bold text-gray-900">{properties.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600 mb-1">High Potential</p>
                <p className="text-3xl font-bold text-green-600">
                  {properties.filter((p) => (p.anomalyScore || 0) >= 7).length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600 mb-1">Avg Anomaly Score</p>
                <p className="text-3xl font-bold text-blue-600">
                  {(
                    properties.reduce((sum, p) => sum + (p.anomalyScore || 0), 0) /
                    properties.length
                  ).toFixed(1)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600 mb-1">Avg Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  $
                  {(
                    properties.reduce((sum, p) => sum + p.price, 0) / properties.length
                  ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>

            {/* Standalone Calculator */}
            {showCalculator && (
              <div className="mb-6">
                <DealCalculator onClose={() => setShowCalculator(false)} />
              </div>
            )}

            {/* Property Table */}
            <PropertyTable
              properties={properties}
              onPropertyClick={handlePropertyClick}
              onExport={handleExport}
            />
          </div>
        )}
      </main>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetailModal property={selectedProperty} onClose={handleCloseModal} />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            Property Flip Analyzer | Built for South Florida Real Estate Investors
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
