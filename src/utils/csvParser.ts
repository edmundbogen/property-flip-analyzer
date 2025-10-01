import Papa from 'papaparse';
import type { Property } from '../types/property';

export interface CSVParseResult {
  properties: Property[];
  errors: string[];
}

// Common MLS CSV column name mappings
const COLUMN_MAPPINGS: Record<string, string[]> = {
  address: ['address', 'street address', 'property address', 'full address', 'street'],
  city: ['city', 'municipality'],
  state: ['state', 'st'],
  zipCode: ['zip', 'zipcode', 'zip code', 'postal code'],
  price: ['price', 'list price', 'listing price', 'current price', 'asking price'],
  beds: ['beds', 'bedrooms', 'bed', 'br', '#beds'],
  baths: ['baths', 'bathrooms', 'bath', 'ba', '#baths', 'total baths'],
  sqft: ['sqft', 'square feet', 'sq ft', 'living area', 'gross living area', 'gla'],
  yearBuilt: ['year built', 'yearbuilt', 'yr built', 'year_built'],
  daysOnMarket: ['dom', 'days on market', 'days_on_market', 'daysonmarket', 'cdom', 'cumulative dom'],
  propertyType: ['property type', 'type', 'property_type', 'prop type'],
  remarks: ['remarks', 'public remarks', 'description', 'property description', 'comments'],
  listingAgent: ['listing agent', 'agent', 'agent name', 'list agent'],
  mlsNumber: ['mls#', 'mls number', 'mls', 'listing number', 'listing#'],
};

function findColumnName(headers: string[], possibleNames: string[]): string | null {
  const headersLower = headers.map((h) => h.toLowerCase().trim());
  for (const possibleName of possibleNames) {
    const index = headersLower.indexOf(possibleName.toLowerCase());
    if (index !== -1) {
      return headers[index];
    }
  }
  return null;
}

function parseNumber(value: any): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Remove currency symbols, commas, and whitespace
    const cleaned = value.replace(/[$,\s]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function parseString(value: any): string {
  return value ? String(value).trim() : '';
}

export function parseCSV(csvContent: string): Promise<CSVParseResult> {
  return new Promise((resolve) => {
    const errors: string[] = [];
    const properties: Property[] = [];

    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          results.errors.forEach((error) => {
            errors.push(`Row ${error.row}: ${error.message}`);
          });
        }

        const headers = results.meta.fields || [];

        // Find column mappings
        const columnMap: Record<string, string | null> = {};
        Object.keys(COLUMN_MAPPINGS).forEach((field) => {
          columnMap[field] = findColumnName(headers, COLUMN_MAPPINGS[field]);
        });

        // Check required fields
        const requiredFields = ['address', 'price', 'sqft'];
        const missingFields = requiredFields.filter((field) => !columnMap[field]);

        if (missingFields.length > 0) {
          errors.push(
            `Missing required columns: ${missingFields.join(', ')}. ` +
            `Available columns: ${headers.join(', ')}`
          );
          resolve({ properties: [], errors });
          return;
        }

        // Parse each row
        results.data.forEach((row: any, index: number) => {
          try {
            const address = parseString(row[columnMap.address!]);
            const price = parseNumber(row[columnMap.price!]);
            const sqft = parseNumber(row[columnMap.sqft!]);

            // Skip rows with invalid required data
            if (!address || price <= 0 || sqft <= 0) {
              errors.push(`Row ${index + 2}: Invalid or missing required data`);
              return;
            }

            const property: Property = {
              id: `prop-${Date.now()}-${index}`,
              address,
              city: columnMap.city ? parseString(row[columnMap.city]) : '',
              state: columnMap.state ? parseString(row[columnMap.state]) : 'FL',
              zipCode: columnMap.zipCode ? parseString(row[columnMap.zipCode]) : '',
              price,
              beds: columnMap.beds ? parseNumber(row[columnMap.beds]) : 0,
              baths: columnMap.baths ? parseNumber(row[columnMap.baths]) : 0,
              sqft,
              yearBuilt: columnMap.yearBuilt ? parseNumber(row[columnMap.yearBuilt]) : 0,
              daysOnMarket: columnMap.daysOnMarket
                ? parseNumber(row[columnMap.daysOnMarket])
                : 0,
              propertyType: columnMap.propertyType
                ? parseString(row[columnMap.propertyType])
                : 'Single Family',
              remarks: columnMap.remarks ? parseString(row[columnMap.remarks]) : undefined,
              listingAgent: columnMap.listingAgent
                ? parseString(row[columnMap.listingAgent])
                : undefined,
              mlsNumber: columnMap.mlsNumber
                ? parseString(row[columnMap.mlsNumber])
                : undefined,
              pricePerSqft: price / sqft,
            };

            properties.push(property);
          } catch (error) {
            errors.push(`Row ${index + 2}: ${error instanceof Error ? error.message : 'Parse error'}`);
          }
        });

        resolve({ properties, errors });
      },
      error: (error: Error) => {
        errors.push(`CSV Parse Error: ${error.message}`);
        resolve({ properties: [], errors });
      },
    });
  });
}

export function generateSampleCSV(): string {
  const headers = [
    'Address',
    'City',
    'State',
    'Zip',
    'List Price',
    'Beds',
    'Baths',
    'SqFt',
    'Year Built',
    'DOM',
    'Property Type',
    'Public Remarks',
    'MLS#',
  ];

  const sampleData = [
    [
      '1234 Ocean Dr',
      'Miami Beach',
      'FL',
      '33139',
      '$875,000',
      '3',
      '2',
      '1,800',
      '1985',
      '45',
      'Single Family',
      'Fixer upper with great potential! Needs TLC but in prime location.',
      'A11234567',
    ],
    [
      '5678 Collins Ave',
      'Miami Beach',
      'FL',
      '33139',
      '$1,200,000',
      '4',
      '3',
      '2,400',
      '1995',
      '12',
      'Single Family',
      'Beautiful waterfront property, recently renovated.',
      'A11234568',
    ],
    // Add more sample rows as needed
  ];

  const csvRows = [headers.join(',')];
  sampleData.forEach((row) => {
    csvRows.push(row.map((cell) => `"${cell}"`).join(','));
  });

  return csvRows.join('\n');
}
