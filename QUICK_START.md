# Quick Start Guide

## Getting the Application Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```env
NEAR_AI_API_KEY=your_near_ai_api_key_here
NEAR_AI_BASE_URL=https://cloud-api.near.ai/v1
NEXT_PUBLIC_APP_NAME=CryptoAI Research

# Optional: API keys for data source failover
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key_here
COINCAP_API_KEY=your_coincap_api_key_here
```

**Required - NEAR AI API Key:**
1. Visit [cloud.near.ai](https://cloud.near.ai)
2. Sign in with GitHub or Google
3. Navigate to API Keys section
4. Create a new API key
5. Add credits to your account

**Optional - Additional Data Sources (for enhanced reliability):**
- CoinMarketCap: [coinmarketcap.com/api](https://coinmarketcap.com/api)
- CoinCap Pro: [pro.coincap.io](https://pro.coincap.io)

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

## Features Overview

### 🏠 Dashboard (/)
- Market overview with global stats (total market cap, 24h volume, BTC dominance)
- Bitcoin price chart
- Trending cryptocurrencies
- AI chat interface
- Quick start guide

### 📊 Markets (/markets)
- Full market screener with 100+ cryptocurrencies
- Sort by: price, market cap, volume, 24h/7d changes
- Filter by price range
- Add coins to watchlist (star icon)
- Real-time market data from CoinGecko

### 📈 Charts (/charts)
- Interactive price and candlestick charts
- Select popular assets: BTC, ETH, SOL, NEAR, BNB, ADA
- Multiple timeframes: 7D, 30D, 90D, 1Y
- Technical analysis panel with:
  - RSI (Relative Strength Index)
  - MACD
  - Bollinger Bands
  - Moving Averages (SMA20/SMA50)
  - Overall signal aggregation
- AI-generated technical analysis summaries

### 💬 AI Chat (/chat)
- Natural language interface powered by NEAR AI Cloud
- Ask questions like:
  - "Show me the top 10 cryptocurrencies by market cap"
  - "What's Bitcoin's RSI over the last 30 days?"
  - "Compare ETH and SOL performance this week"
  - "Find coins under $1 with high volume"
- Context-aware conversations
- Intent parsing and automated query routing

### 🔍 Search (/search)
- Search all cryptocurrencies
- View trending coins
- Quick access to popular assets

## Architecture

### Frontend
- **Next.js 15** with App Router
- **React 18** with Server Components
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Zustand** for state management
- **TanStack Query** for data fetching and caching

### Backend/API
- **Next.js API Routes** (serverless functions)
- **NEAR AI Cloud** for AI capabilities
  - Model: deepseek-chat-v3-0324
  - Private, verifiable inference in TEEs
- **Multi-Source Cryptocurrency Data:**
  - Primary: CoinGecko API (free, no key required)
  - Fallback 1: CoinMarketCap Pro (optional API key)
  - Fallback 2: CoinCap Pro (optional API key)
- **technicalindicators.js** for TA calculations

### Key Libraries
- `openai` - NEAR AI Cloud client (OpenAI-compatible)
- `recharts` - Chart components
- `technicalindicators` - Technical analysis
- `axios` - HTTP client
- `lucide-react` - Icon library
- `date-fns` - Date utilities

## API Endpoints

### `/api/ai` (POST)
AI chat completions and intent parsing
- Body: `{ messages: [...], mode?: 'chat' | 'intent' }`

### `/api/market` (GET)
Market data for cryptocurrencies
- Params: `currency`, `perPage`, `page`, `includeGlobal`

### `/api/assets/[id]` (GET)
Asset-specific data
- Params: `type` (details|ohlc|history), `days`

### `/api/technical` (POST)
Technical analysis calculations
- Body: `{ symbol, days, indicators }`

### `/api/search` (GET)
Search and trending cryptocurrencies
- Params: `q` (query), `type` (search|trending)

## Data Flow Example

User asks: "Show me Bitcoin's RSI over the last 30 days"

1. User input sent to `/api/ai` with mode='intent'
2. AI parses intent: `{ intent: 'analysis', assets: ['BTC'], timeframe: '30d', indicators: ['RSI'] }`
3. Frontend fetches data from `/api/technical`
4. Backend:
   - Converts 'BTC' → 'bitcoin' (CoinGecko ID)
   - Fetches 30 days of price data from CoinGecko
   - Calculates RSI using technicalindicators library
5. Frontend displays:
   - RSI chart with Recharts
   - AI-generated analysis summary
   - Technical indicator cards

## Customization

### Adding More Cryptocurrencies
Edit `src/lib/crypto-api.ts`, function `symbolToCoinGeckoId()` to add more symbol mappings.

### Changing AI Models
Edit `src/lib/nearai-client.ts`, change `DEFAULT_MODEL` to any model available on [cloud.near.ai/models](https://cloud.near.ai/models).

### Styling
- Colors: Edit `src/app/globals.css` and Tailwind classes
- Dark/light mode: Uses system preference by default, toggle in header
- Fonts: Change in `src/app/layout.tsx`

## Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use
```bash
# Use different port
PORT=3001 npm run dev
```

### API Rate Limiting
Data sources have rate limits:
- CoinGecko free tier: 10-50 calls/minute
- Platform automatically fails over to CoinMarketCap or CoinCap if limits exceeded
- Consider adding optional API keys for CoinMarketCap and CoinCap Pro for maximum reliability

### NEAR AI API Issues
- Check API key in `.env.local`
- Verify balance at [cloud.near.ai](https://cloud.near.ai)
- Check model availability

## Performance Tips

1. **Enable SWR/React Query caching** (already configured)
2. **Reduce API calls** - data refreshes every 60 seconds
3. **Use production build** - `npm run build && npm start`
4. **Consider adding a reverse proxy** for API rate limiting
5. **Add request deduplication** for popular queries

## Security Notes

⚠️ **Important Security Considerations:**

1. **.env.local is gitignored** - Never commit API keys
2. **API routes are server-side** - Keys not exposed to client
3. **Rate limiting recommended** for production deployment
4. **Input validation** on all user inputs
5. **CORS configuration** if deploying to different domains

## Deployment

### Vercel (Recommended)
```bash
vercel deploy
```
Set environment variables in Vercel dashboard.

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Other Platforms
- Works on any Node.js hosting (AWS, Google Cloud, Azure, etc.)
- Requires Node.js 18+
- Set environment variables
- Run `npm run build && npm start`

## License

MIT License - Free to use and modify

## Support

For issues or questions:
1. Check the README.md
2. Review the code comments
3. Check Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)
4. Check NEAR AI documentation: [docs.near.ai](https://docs.near.ai)

