# Property Flip Analyzer

A professional web-based dashboard for real estate investors specializing in fix-and-flip projects in South Florida. This tool helps identify profitable investment opportunities by analyzing MLS property listings, calculating ROI, and detecting market anomalies.

## Features

### Core Functionality
- **CSV Upload System**: Import MLS property listings via CSV files
- **Deal Analysis Calculator**: Calculate ROI, profit projections, and holding costs
- **Neighborhood Anomaly Detection**: Identify undervalued properties automatically
- **Comparable Sales Analysis**: Input comps to estimate After Repair Value (ARV)
- **Advanced Filtering**: Filter by price, ROI, anomaly score, zip codes
- **Data Persistence**: Properties stored in browser localStorage
- **Export Functionality**: Export filtered results to CSV

### Key Metrics Calculated
- **ROI %**: Return on investment based on total cash invested
- **Net Profit**: After all costs and selling expenses
- **Anomaly Score (1-10)**: Identifies high-potential deals based on:
  - Price vs neighborhood median
  - Price-per-sqft vs area average
  - Days on market
  - Distress keywords in property description
  - Property age and price point

### Deal Analysis Includes
- Purchase price + renovation budget
- Acquisition costs (3% of purchase)
- Monthly holding costs (taxes, insurance, interest, utilities)
- Total investment calculation
- Selling costs (8%: 6% commission + 2% closing)
- ARV estimation from comparable sales
- Visual profit/cost breakdowns with charts

## Getting Started

### Prerequisites
- Node.js 18+ (recommended: Node.js 20+)
- npm or yarn package manager

### Installation

1. Clone or download this repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to Vercel, Netlify, or any static hosting service.

## Usage Guide

### 1. Uploading Property Data

The app accepts CSV files exported from MLS systems. Required columns:
- **Address** (required)
- **Price** or **List Price** (required)
- **SqFt** or **Square Feet** (required)

Optional but recommended columns:
- City, State, Zip Code
- Beds, Baths
- Year Built
- DOM (Days on Market)
- Property Type
- Public Remarks (for distress keyword detection)
- MLS#, Listing Agent

#### Exporting from Common MLS Systems

**Florida MLS / Miami Realtors MLS:**
1. Run your property search with desired criteria
2. Select properties you want to analyze
3. Click "Export" → Choose "CSV" format
4. Ensure you include all standard fields (especially address, price, sqft)
5. Upload the downloaded CSV file

**Flexmls:**
1. Search for properties
2. Click the export icon (usually top-right)
3. Select "Spreadsheet (CSV)"
4. Include all available fields
5. Download and upload to the analyzer

**Tips:**
- Include as many fields as possible for best results
- The parser is flexible and will map common column name variations
- If upload fails, check that required fields (address, price, sqft) are present

### 2. Analyzing Properties

Once properties are uploaded:
- **Dashboard Overview**: See total properties, high-potential deals, and averages
- **Property Table**: View all properties with sortable columns
- **Filters**: Narrow down by price range, ROI, anomaly score, zip codes
- **Color Coding**:
  - Green rows = 30%+ ROI (qualified deals)
  - Yellow rows = 20-30% ROI
  - Red rows = <20% ROI

### 3. Detailed Property Analysis

Click any property row to open the detailed analysis modal:
- View full property information
- See anomaly score breakdown
- Add comparable sales (3-5 recommended)
- Run deal calculator with custom inputs
- View cost breakdown charts

### 4. Deal Calculator

The calculator uses the following formulas:

**Total Investment:**
```
Total Investment = Purchase Price
                 + Renovation Budget
                 + Holding Costs
                 + Acquisition Costs (3%)
```

**Monthly Holding Costs:**
```
Monthly Holding = (Purchase × 1.5% property tax / 12)
                + (Purchase × 0.5% insurance / 12)
                + (Loan Amount × Interest Rate / 12)
                + $500 utilities/maintenance
```

**Net Profit:**
```
Gross Profit = ARV - Total Investment
Selling Costs = ARV × 8% (6% commission + 2% closing)
Net Profit = Gross Profit - Selling Costs
```

**ROI:**
```
Total Cash Invested = Down Payment + Renovation + Holding Costs
ROI % = (Net Profit / Total Cash Invested) × 100
```

### 5. Customizing Assumptions

Default assumptions (can be changed in calculator):
- **Down Payment**: 20%
- **Interest Rate**: 8%
- **Holding Period**: 12 months
- **Property Tax Rate**: 1.5% annually
- **Insurance Rate**: 0.5% annually
- **Monthly Utilities**: $500
- **Acquisition Costs**: 3% of purchase
- **Selling Costs**: 8% of ARV

### 6. Anomaly Scoring System

Properties receive a score from 1-10 based on:

**Points Added (+):**
- +2 if price is 20%+ below neighborhood median
- +2 if price-per-sqft is 25%+ below area average
- +1 if days on market > 60 days
- +1 per distress keyword (max 2 points)

**Points Deducted (-):**
- -1 if price > $1.5M (harder to flip)
- -1 if built after 2000 (less renovation opportunity)

**Distress Keywords Detected:**
- "fixer", "tlc", "as-is", "handyman special"
- "estate sale", "needs work", "needs repair"
- "investor special", "cash only", "motivated seller"
- "bring offers"

**Interpretation:**
- **7-10**: High potential deal, investigate immediately
- **5-7**: Moderate potential, worth reviewing
- **1-5**: Lower potential, but still may be viable

## Sample Data

A sample CSV file with 30 fictional Miami Beach properties is included at:
```
public/sample-properties.csv
```

Use this to test the application and understand the expected format.

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks (useState, useEffect)
- **CSV Parsing**: PapaParse
- **Charts**: Recharts
- **Build Tool**: Vite
- **Storage**: Browser localStorage (no backend required)

## Project Structure

```
property-flip-analyzer/
├── src/
│   ├── components/
│   │   ├── PropertyUpload.tsx       # CSV upload interface
│   │   ├── PropertyTable.tsx        # Main dashboard table
│   │   ├── DealCalculator.tsx       # ROI calculator
│   │   ├── PropertyDetailModal.tsx  # Detailed property view
│   │   ├── ComparablesSales.tsx     # Comps input form
│   │   └── ROIChart.tsx            # Profit visualizations
│   ├── utils/
│   │   ├── csvParser.ts            # MLS CSV parsing logic
│   │   ├── calculations.ts         # ROI/profit formulas
│   │   ├── anomalyScoring.ts       # Deal detection logic
│   │   └── storage.ts              # localStorage helpers
│   ├── types/
│   │   └── property.ts             # TypeScript interfaces
│   ├── App.tsx                     # Main application
│   └── main.tsx                    # Entry point
├── public/
│   └── sample-properties.csv       # Test data
└── README.md                       # This file
```

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Mobile Support

The dashboard is fully responsive and works on tablets for field use during property visits.

## Data Privacy

All data is stored locally in your browser's localStorage. No information is sent to external servers. To clear all data, click the "Clear Data" button in the header.

## Troubleshooting

**CSV Upload Fails:**
- Verify your CSV has required columns: Address, Price, SqFt
- Check that the file is a valid CSV (not Excel .xlsx)
- Try opening the CSV in a text editor to check for formatting issues

**Properties Not Showing:**
- Check your filter settings (especially price range and ROI threshold)
- Clear filters and try again

**Anomaly Scores All Low:**
- This means properties are priced at or above neighborhood averages
- Adjust your MLS search to find distressed/as-is properties
- Look for properties with longer days on market

**Calculator Showing Negative ROI:**
- Reduce renovation budget estimate
- Increase ARV estimate (use comparable sales)
- Adjust holding period (faster flips = lower holding costs)

## License

MIT License - feel free to use and modify for your real estate investing business.

## Support

For questions or issues, please review the troubleshooting section above or examine the sample CSV format.

---

**Built for South Florida real estate investors. Target ROI: 30%+ for qualified flip deals.**
