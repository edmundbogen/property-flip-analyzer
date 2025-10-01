import React, { useCallback, useState } from 'react';
import { parseCSV } from '../utils/csvParser';
import type { Property } from '../types/property';

interface PropertyUploadProps {
  onPropertiesLoaded: (properties: Property[]) => void;
}

export const PropertyUpload: React.FC<PropertyUploadProps> = ({ onPropertiesLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setErrors([]);
    setSuccessMessage('');

    try {
      const text = await file.text();
      const result = await parseCSV(text);

      if (result.errors.length > 0) {
        setErrors(result.errors);
      }

      if (result.properties.length > 0) {
        onPropertiesLoaded(result.properties);
        setSuccessMessage(
          `Successfully loaded ${result.properties.length} properties!`
        );
      } else {
        setErrors(['No valid properties found in CSV file.']);
      }
    } catch (error) {
      setErrors([`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      processFile(file);
    } else {
      setErrors(['Please upload a valid CSV file.']);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
          ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-blue-400'}
        `}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="hidden"
          id="csv-upload"
          disabled={isProcessing}
        />
        <label htmlFor="csv-upload" className="cursor-pointer">
          <div className="flex flex-col items-center space-y-4">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div>
              <p className="text-lg font-semibold text-gray-700">
                {isProcessing ? 'Processing...' : 'Drop your MLS CSV file here'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or click to browse
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Accepts CSV files with property listings
            </p>
          </div>
        </label>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">{successMessage}</p>
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold mb-2">Errors:</p>
          <ul className="list-disc list-inside space-y-1">
            {errors.slice(0, 5).map((error, index) => (
              <li key={index} className="text-red-700 text-sm">
                {error}
              </li>
            ))}
          </ul>
          {errors.length > 5 && (
            <p className="text-red-600 text-sm mt-2">
              ... and {errors.length - 5} more errors
            </p>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-900 font-semibold mb-2">CSV Requirements:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
          <li>Must include: Address, Price, Square Footage</li>
          <li>Optional: Beds, Baths, Year Built, Days on Market, Remarks</li>
          <li>Common MLS export formats are supported</li>
        </ul>
      </div>
    </div>
  );
};
