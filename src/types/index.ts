// Core type definitions for the application

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price: number;
  market_cap: number;
  market_cap_rank?: number;
  fully_diluted_valuation?: number;
  total_volume: number;
  high_24h?: number;
  low_24h?: number;
  price_change_24h?: number;
  price_change_percentage_24h?: number;
  price_change_percentage_7d?: number;
  price_change_percentage_30d?: number;
  market_cap_change_24h?: number;
  market_cap_change_percentage_24h?: number;
  circulating_supply?: number;
  total_supply?: number;
  max_supply?: number;
  ath?: number;
  ath_change_percentage?: number;
  ath_date?: string;
  atl?: number;
  atl_change_percentage?: number;
  atl_date?: string;
  last_updated?: string;
}

export interface OHLCData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicator {
  name: string;
  value: number | number[];
  signal?: 'buy' | 'sell' | 'neutral';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: {
    type?: 'text' | 'chart' | 'table' | 'analysis';
    data?: any;
  };
}

export interface MarketScreenerFilters {
  priceMin?: number;
  priceMax?: number;
  marketCapMin?: number;
  marketCapMax?: number;
  volumeMin?: number;
  change24hMin?: number;
  change24hMax?: number;
  sortBy?: 'market_cap' | 'volume' | 'price_change_percentage_24h' | 'current_price';
  sortOrder?: 'asc' | 'desc';
}

export interface SocialSentiment {
  platform: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  mentions: number;
  timestamp: number;
  topics?: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  relatedCoins?: string[];
}

export interface ChartDataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

export interface TechnicalAnalysisResult {
  indicator: string;
  value: number | string;
  signal: 'buy' | 'sell' | 'neutral';
  description: string;
}

export interface FundamentalMetrics {
  assetId: string;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply?: number;
  developerScore?: number;
  communityScore?: number;
  liquidityScore?: number;
  publicInterest?: number;
}

