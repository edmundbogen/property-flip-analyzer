import type { Property } from '../types/property';

const STORAGE_KEY = 'property-flip-analyzer-data';

export interface StorageData {
  properties: Property[];
  lastUpdated: string;
}

export function saveProperties(properties: Property[]): void {
  try {
    const data: StorageData = {
      properties,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save properties to localStorage:', error);
    throw new Error('Failed to save data. Storage might be full.');
  }
}

export function loadProperties(): Property[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const data: StorageData = JSON.parse(stored);
    return data.properties || [];
  } catch (error) {
    console.error('Failed to load properties from localStorage:', error);
    return [];
  }
}

export function clearProperties(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear properties from localStorage:', error);
  }
}

export function getLastUpdated(): string | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const data: StorageData = JSON.parse(stored);
    return data.lastUpdated || null;
  } catch (error) {
    console.error('Failed to get last updated timestamp:', error);
    return null;
  }
}

export function exportToCSV(properties: Property[]): string {
  const headers = [
    'Address',
    'City',
    'State',
    'Zip Code',
    'Price',
    'Beds',
    'Baths',
    'Sqft',
    'Price/Sqft',
    'Year Built',
    'Days on Market',
    'Property Type',
    'Anomaly Score',
    'Est. Profit',
    'Est. ROI %',
  ];

  const rows = properties.map((p) => [
    p.address,
    p.city,
    p.state,
    p.zipCode,
    p.price,
    p.beds,
    p.baths,
    p.sqft,
    p.pricePerSqft.toFixed(2),
    p.yearBuilt,
    p.daysOnMarket,
    p.propertyType,
    p.anomalyScore?.toFixed(1) || 'N/A',
    p.estimatedProfit ? `$${p.estimatedProfit.toFixed(0)}` : 'N/A',
    p.estimatedROI ? `${p.estimatedROI.toFixed(1)}%` : 'N/A',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => {
        const cellStr = String(cell);
        // Wrap in quotes if contains comma, newline, or quote
        if (cellStr.includes(',') || cellStr.includes('\n') || cellStr.includes('"')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')
    ),
  ].join('\n');

  return csvContent;
}

export function downloadCSV(csvContent: string, filename: string = 'properties-export.csv'): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
