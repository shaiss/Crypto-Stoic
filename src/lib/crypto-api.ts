import axios from 'axios';
import type { CryptoAsset, OHLCData } from '@/types';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const COINMARKETCAP_BASE_URL = 'https://pro-api.coinmarketcap.com/v1';
const COINCAP_BASE_URL = 'https://api.coincap.io/v2';

// Create axios instances with API keys
const coingeckoClient = axios.create({
  baseURL: COINGECKO_BASE_URL,
  timeout: 8000,
});

const coinmarketcapClient = axios.create({
  baseURL: COINMARKETCAP_BASE_URL,
  headers: {
    'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
  },
  timeout: 8000,
});

const coincapClient = axios.create({
  baseURL: COINCAP_BASE_URL,
  headers: process.env.COINCAP_API_KEY ? {
    'Authorization': `Bearer ${process.env.COINCAP_API_KEY}`,
  } : {},
  timeout: 8000,
});

/**
 * Fetch list of cryptocurrencies with market data
 * Primary: CoinGecko (free, works reliably)
 * Fallback 1: CoinMarketCap (when CoinGecko fails)
 * Fallback 2: CoinCap Pro (when both fail)
 */
export async function fetchMarketData(
  currency: string = 'usd',
  perPage: number = 100,
  page: number = 1
): Promise<CryptoAsset[]> {
  try {
    // Try CoinGecko first (primary - free, reliable)
    console.log('[API] Fetching market data from CoinGecko...');
    const response = await coingeckoClient.get('/coins/markets', {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: perPage,
        page,
        sparkline: false,
        price_change_percentage: '1h,24h,7d,30d',
      },
    });

    return response.data;
  } catch (geckoError) {
    console.warn('[API] CoinGecko failed, trying CoinMarketCap...', (geckoError as any)?.message);
    
    // Fallback to CoinMarketCap
    try {
      const cmcResponse = await coinmarketcapClient.get('/cryptocurrency/listings/latest', {
        params: {
          limit: perPage,
          start: (page - 1) * perPage + 1,
          convert: currency.toUpperCase(),
        },
      });

      return cmcResponse.data.data.map((coin: any) => ({
        id: coin.slug,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.logo,
        current_price: coin.quote[currency.toUpperCase()]?.price || 0,
        market_cap: coin.quote[currency.toUpperCase()]?.market_cap || 0,
        market_cap_rank: coin.cmc_rank,
        total_volume: coin.quote[currency.toUpperCase()]?.volume_24h || 0,
        price_change_24h: null,
        price_change_percentage_24h: coin.quote[currency.toUpperCase()]?.percent_change_24h,
        price_change_percentage_7d: coin.quote[currency.toUpperCase()]?.percent_change_7d,
        price_change_percentage_30d: null,
        circulating_supply: coin.circulating_supply,
        total_supply: coin.total_supply,
        max_supply: coin.max_supply,
      }));
    } catch (cmcError) {
      console.warn('[API] CoinMarketCap failed, trying CoinCap...', (cmcError as any)?.message);
      
      // Final fallback to CoinCap Pro
      try {
        const coincapResponse = await coincapClient.get('/assets', {
          params: {
            limit: perPage,
            offset: (page - 1) * perPage,
          },
        });

        return coincapResponse.data.data.map((coin: any, index: number) => ({
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
          image: `https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`,
          current_price: parseFloat(coin.priceUsd) || 0,
          market_cap: parseFloat(coin.marketCapUsd) || 0,
          market_cap_rank: (page - 1) * perPage + index + 1,
          total_volume: parseFloat(coin.volumeUsd24Hr) || 0,
          price_change_24h: null,
          price_change_percentage_24h: parseFloat(coin.changePercent24Hr) || null,
          price_change_percentage_7d: null,
          price_change_percentage_30d: null,
          circulating_supply: parseFloat(coin.supply) || 0,
          total_supply: parseFloat(coin.supply) || 0,
          max_supply: parseFloat(coin.maxSupply) || null,
        }));
      } catch (coincapError) {
        console.error('[API] All data sources failed (CoinGecko, CoinMarketCap, CoinCap)', (coincapError as any)?.message);
        throw new Error('Failed to fetch market data from all sources');
      }
    }
  }
}

/**
 * Fetch detailed data for a specific cryptocurrency
 */
export async function fetchAssetDetails(assetId: string): Promise<any> {
  try {
    const response = await coingeckoClient.get(`/coins/${assetId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`[API] Failed to fetch details for ${assetId}`);
    throw new Error(`Failed to fetch asset details for ${assetId}`);
  }
}

/**
 * Fetch historical OHLC data
 */
export async function fetchOHLCData(
  assetId: string,
  days: number = 30
): Promise<OHLCData[]> {
  try {
    const response = await coingeckoClient.get(`/coins/${assetId}/ohlc`, {
      params: {
        vs_currency: 'usd',
        days,
      },
    });

    return response.data.map((item: number[]) => ({
      time: item[0],
      open: item[1],
      high: item[2],
      low: item[3],
      close: item[4],
      volume: 0,
    }));
  } catch (error) {
    console.error(`[API] Error fetching OHLC data for ${assetId}:`, error);
    throw new Error(`Failed to fetch OHLC data for ${assetId}`);
  }
}

/**
 * Fetch historical price data with volume
 */
export async function fetchHistoricalPrices(
  assetId: string,
  days: number = 30
): Promise<{ prices: number[][]; volumes: number[][] }> {
  try {
    const response = await coingeckoClient.get(`/coins/${assetId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days,
        interval: days > 90 ? 'daily' : 'hourly',
      },
    });

    return {
      prices: response.data.prices || [],
      volumes: response.data.total_volumes || [],
    };
  } catch (error) {
    console.error(`[API] Error fetching historical prices for ${assetId}:`, error);
    throw new Error(`Failed to fetch historical prices for ${assetId}`);
  }
}

/**
 * Search for cryptocurrencies
 */
export async function searchCrypto(query: string): Promise<any[]> {
  try {
    const response = await coingeckoClient.get('/search', {
      params: { query },
    });

    return response.data.coins || [];
  } catch (error) {
    console.error('[API] Search error:', error);
    throw new Error('Failed to search cryptocurrencies');
  }
}

/**
 * Fetch trending cryptocurrencies
 */
export async function fetchTrending(): Promise<any> {
  try {
    const response = await coingeckoClient.get('/search/trending');
    return response.data;
  } catch (error) {
    console.error('[API] Error fetching trending:', error);
    throw new Error('Failed to fetch trending cryptocurrencies');
  }
}

/**
 * Fetch global crypto market data
 */
export async function fetchGlobalData(): Promise<any> {
  try {
    const response = await coingeckoClient.get('/global');
    return response.data.data;
  } catch (error) {
    console.error('[API] Error fetching global data:', error);
    throw new Error('Failed to fetch global market data');
  }
}

/**
 * Convert symbol to CoinGecko ID
 */
export function symbolToCoinGeckoId(symbol: string): string {
  const symbolMap: Record<string, string> = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    SOL: 'solana',
    NEAR: 'near',
    BNB: 'binancecoin',
    ADA: 'cardano',
    DOT: 'polkadot',
    DOGE: 'dogecoin',
    AVAX: 'avalanche-2',
    MATIC: 'matic-network',
    LINK: 'chainlink',
    UNI: 'uniswap',
    ATOM: 'cosmos',
    XRP: 'ripple',
    LTC: 'litecoin',
  };

  return symbolMap[symbol.toUpperCase()] || symbol.toLowerCase();
}

