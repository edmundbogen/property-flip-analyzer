import type { Property, NeighborhoodStats } from '../types/property';
import { DISTRESS_KEYWORDS } from '../types/property';

export function calculateAnomalyScore(
  property: Property,
  neighborhoodStats: NeighborhoodStats | null
): number {
  let score = 5; // Base score

  if (!neighborhoodStats) {
    return score;
  }

  // +2 points if price is 20%+ below neighborhood median
  const medianThreshold = neighborhoodStats.medianSalePrice * 0.8;
  if (property.price <= medianThreshold) {
    score += 2;
  }

  // +2 points if price-per-sqft is 25%+ below area average
  const pricePerSqftThreshold = neighborhoodStats.averagePricePerSqft * 0.75;
  if (property.pricePerSqft <= pricePerSqftThreshold) {
    score += 2;
  }

  // +1 point if DOM > 60 days
  if (property.daysOnMarket > 60) {
    score += 1;
  }

  // +1 point per distress keyword found in description (max 2 points)
  if (property.remarks) {
    const remarksLower = property.remarks.toLowerCase();
    let keywordCount = 0;
    for (const keyword of DISTRESS_KEYWORDS) {
      if (remarksLower.includes(keyword)) {
        keywordCount++;
      }
    }
    score += Math.min(keywordCount, 2);
  }

  // -1 point if price > $1.5M (harder to flip)
  if (property.price > 1500000) {
    score -= 1;
  }

  // -1 point if year built > 2000 (less renovation opportunity)
  if (property.yearBuilt > 2000) {
    score -= 1;
  }

  // Ensure score is between 1 and 10
  return Math.max(1, Math.min(10, score));
}

export function calculateNeighborhoodStats(
  properties: Property[],
  zipCode: string
): NeighborhoodStats | null {
  const zipProperties = properties.filter((p) => p.zipCode === zipCode);

  if (zipProperties.length === 0) {
    return null;
  }

  // Calculate average price per sqft
  const totalPricePerSqft = zipProperties.reduce(
    (sum, p) => sum + p.pricePerSqft,
    0
  );
  const averagePricePerSqft = totalPricePerSqft / zipProperties.length;

  // Calculate median sale price
  const prices = zipProperties.map((p) => p.price).sort((a, b) => a - b);
  const medianIndex = Math.floor(prices.length / 2);
  const medianSalePrice =
    prices.length % 2 === 0
      ? (prices[medianIndex - 1] + prices[medianIndex]) / 2
      : prices[medianIndex];

  return {
    zipCode,
    averagePricePerSqft,
    medianSalePrice,
    propertyCount: zipProperties.length,
  };
}

export function findHighPotentialProperties(
  properties: Property[],
  minAnomalyScore: number = 7
): Property[] {
  return properties
    .filter((p) => (p.anomalyScore || 0) >= minAnomalyScore)
    .sort((a, b) => (b.anomalyScore || 0) - (a.anomalyScore || 0));
}

export function enrichPropertiesWithAnomalyScores(
  properties: Property[]
): Property[] {
  // Calculate neighborhood stats for all zip codes
  const zipCodes = [...new Set(properties.map((p) => p.zipCode))];
  const neighborhoodStatsMap = new Map<string, NeighborhoodStats | null>();

  zipCodes.forEach((zipCode) => {
    const stats = calculateNeighborhoodStats(properties, zipCode);
    neighborhoodStatsMap.set(zipCode, stats);
  });

  // Calculate anomaly scores for all properties
  return properties.map((property) => {
    const stats = neighborhoodStatsMap.get(property.zipCode);
    const anomalyScore = calculateAnomalyScore(property, stats || null);

    return {
      ...property,
      anomalyScore,
    };
  });
}
