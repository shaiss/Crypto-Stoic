# CryptoAI Research Platform

An advanced AI-powered cryptocurrency research and analysis platform built with Next.js, TypeScript, and NEAR AI Cloud.

## Features

### 🤖 AI-Powered Natural Language Interface
- Ask questions about cryptocurrency markets in plain English
- Get intelligent insights powered by NEAR AI Cloud (DeepSeek models)
- Context-aware conversation history
- Automated intent parsing and query routing

### 📊 Market Screener
- Real-time data for 100+ cryptocurrencies
- Advanced filtering and sorting capabilities
- Key metrics: Price, Market Cap, Volume, Price Changes (24h, 7d, 30d)
- Watchlist functionality
- Custom screener queries via AI

### 📈 Interactive Charts
- Price charts (line and area)
- Candlestick/OHLC charts
- Multiple timeframes (7d, 30d, 90d, 1y)
- Smooth animations and responsive design

### 🔬 Technical Analysis
- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)
- Bollinger Bands
- SMA/EMA (Moving Averages)
- Support and Resistance levels
- AI-generated technical analysis summaries
- Overall signal aggregation (Bullish/Bearish/Neutral)

### 🔍 Unified Search
- Search across all cryptocurrencies
- Trending coins
- Quick access to popular assets

### 🎨 Modern UI/UX
- Clean, modern design
- Dark/light mode
- Fully responsive (mobile, tablet, desktop)
- Smooth transitions and animations
- Accessible components

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: NEAR AI Cloud (OpenAI-compatible API)
- **Charts**: Recharts
- **Technical Indicators**: technicalindicators.js
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Data Source**: CoinGecko API (free tier)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crypto-research-platform
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
NEAR_AI_API_KEY=your_near_ai_api_key_here
NEAR_AI_BASE_URL=https://cloud-api.near.ai/v1
NEXT_PUBLIC_APP_NAME=CryptoAI Research
```

Get your NEAR AI API key from [cloud.near.ai](https://cloud.near.ai)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
crypto-research-platform/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── api/               # API routes
│   │   │   ├── ai/           # AI chat endpoint
│   │   │   ├── assets/       # Asset data endpoint
│   │   │   ├── market/       # Market data endpoint
│   │   │   ├── technical/    # Technical analysis endpoint
│   │   │   └── search/       # Search endpoint
│   │   ├── charts/           # Charts page
│   │   ├── chat/             # AI chat page
│   │   ├── markets/          # Markets page
│   │   ├── search/           # Search page
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home/Dashboard page
│   │   ├── providers.tsx     # React Query provider
│   │   └── globals.css       # Global styles
│   ├── components/            # React components
│   │   ├── Charts/           # Chart components
│   │   ├── ChatInterface.tsx
│   │   ├── Layout.tsx
│   │   ├── MarketScreener.tsx
│   │   ├── MarketOverview.tsx
│   │   ├── TechnicalAnalysis.tsx
│   │   └── TrendingSection.tsx
│   ├── lib/                   # Utility libraries
│   │   ├── crypto-api.ts     # CoinGecko API client
│   │   ├── nearai-client.ts  # NEAR AI Cloud client
│   │   ├── technical-indicators.ts
│   │   ├── store.ts          # Zustand store
│   │   └── utils.ts          # Helper functions
│   └── types/                 # TypeScript types
│       └── index.ts
├── .env.local                 # Environment variables
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## API Integration

### NEAR AI Cloud
This platform uses [NEAR AI Cloud](https://cloud.near.ai) for private, verifiable AI inference. The AI powers:
- Natural language understanding
- Sentiment analysis
- Technical analysis summaries
- Query intent parsing

### CoinGecko
Cryptocurrency market data is sourced from the [CoinGecko API](https://www.coingecko.com/api) (free tier):
- Real-time prices
- Market data
- Historical OHLC data
- Trending coins
- Search functionality

## Usage Examples

### AI Chat Examples
- "Show me the top 10 cryptocurrencies by market cap"
- "What's Bitcoin's RSI over the last 30 days?"
- "Compare ETH and SOL performance this week"
- "Find coins under $1 with high volume"

### Market Screener
1. Navigate to Markets page
2. Use filters to screen by price, market cap, or volume
3. Click column headers to sort
4. Star coins to add to watchlist

### Charts & Analysis
1. Go to Charts page
2. Select an asset (BTC, ETH, SOL, etc.)
3. Choose timeframe
4. View technical indicators
5. Generate AI analysis summary

## Development

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

### Type Check
```bash
npx tsc --noEmit
```

## Disclaimer

⚠️ **This platform is for research and educational purposes only. It does NOT provide financial advice.**

- Cryptocurrency investments are highly volatile and risky
- Always do your own research (DYOR)
- Never invest more than you can afford to lose
- Past performance does not guarantee future results
- Consult with a financial advisor before making investment decisions

## License

MIT License - See LICENSE file for details

## Acknowledgments

- [NEAR AI Cloud](https://cloud.near.ai) for AI infrastructure
- [CoinGecko](https://www.coingecko.com) for market data
- [Recharts](https://recharts.org) for charting library
- [Technical Indicators](https://github.com/anandanand84/technicalindicators) for TA calculations
