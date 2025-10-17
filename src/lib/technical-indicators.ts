import { 
  RSI, 
  MACD, 
  BollingerBands, 
  EMA, 
  SMA,
  Stochastic,
  ATR,
  ADX
} from 'technicalindicators';
import type { TechnicalAnalysisResult } from '@/types';

/**
 * Calculate RSI (Relative Strength Index)
 */
export function calculateRSI(prices: number[], period: number = 14): number[] {
  return RSI.calculate({
    values: prices,
    period,
  });
}

/**
 * Calculate MACD (Moving Average Convergence Divergence)
 */
export function calculateMACD(
  prices: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
) {
  return MACD.calculate({
    values: prices,
    fastPeriod,
    slowPeriod,
    signalPeriod,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  });
}

/**
 * Calculate Bollinger Bands
 */
export function calculateBollingerBands(
  prices: number[],
  period: number = 20,
  stdDev: number = 2
) {
  return BollingerBands.calculate({
    period,
    values: prices,
    stdDev,
  });
}

/**
 * Calculate EMA (Exponential Moving Average)
 */
export function calculateEMA(prices: number[], period: number = 20): number[] {
  return EMA.calculate({
    values: prices,
    period,
  });
}

/**
 * Calculate SMA (Simple Moving Average)
 */
export function calculateSMA(prices: number[], period: number = 20): number[] {
  return SMA.calculate({
    values: prices,
    period,
  });
}

/**
 * Calculate Stochastic Oscillator
 */
export function calculateStochastic(
  high: number[],
  low: number[],
  close: number[],
  period: number = 14,
  signalPeriod: number = 3
) {
  return Stochastic.calculate({
    high,
    low,
    close,
    period,
    signalPeriod,
  });
}

/**
 * Calculate ATR (Average True Range)
 */
export function calculateATR(
  high: number[],
  low: number[],
  close: number[],
  period: number = 14
) {
  return ATR.calculate({
    high,
    low,
    close,
    period,
  });
}

/**
 * Calculate ADX (Average Directional Index)
 */
export function calculateADX(
  high: number[],
  low: number[],
  close: number[],
  period: number = 14
) {
  return ADX.calculate({
    high,
    low,
    close,
    period,
  });
}

/**
 * Generate comprehensive technical analysis
 */
export function generateTechnicalAnalysis(
  prices: number[],
  high?: number[],
  low?: number[],
  close?: number[]
): TechnicalAnalysisResult[] {
  const results: TechnicalAnalysisResult[] = [];

  // RSI Analysis
  const rsi = calculateRSI(prices);
  const latestRSI = rsi[rsi.length - 1];
  if (latestRSI !== undefined) {
    results.push({
      indicator: 'RSI',
      value: latestRSI.toFixed(2),
      signal: latestRSI < 30 ? 'buy' : latestRSI > 70 ? 'sell' : 'neutral',
      description: `RSI is ${latestRSI.toFixed(2)}. ${
        latestRSI < 30
          ? 'Oversold condition - potential buy signal'
          : latestRSI > 70
          ? 'Overbought condition - potential sell signal'
          : 'Neutral territory'
      }`,
    });
  }

  // MACD Analysis
  const macd = calculateMACD(prices);
  const latestMACD = macd[macd.length - 1];
  if (latestMACD && latestMACD.MACD !== undefined && latestMACD.signal !== undefined) {
    const signal =
      latestMACD.MACD > latestMACD.signal
        ? 'buy'
        : latestMACD.MACD < latestMACD.signal
        ? 'sell'
        : 'neutral';
    results.push({
      indicator: 'MACD',
      value: `${latestMACD.MACD.toFixed(4)} / ${latestMACD.signal.toFixed(4)}`,
      signal,
      description: `MACD line is ${
        signal === 'buy' ? 'above' : signal === 'sell' ? 'below' : 'at'
      } signal line`,
    });
  }

  // Moving Average Analysis
  const sma20 = calculateSMA(prices, 20);
  const sma50 = calculateSMA(prices, 50);
  const latestSMA20 = sma20[sma20.length - 1];
  const latestSMA50 = sma50[sma50.length - 1];
  const currentPrice = prices[prices.length - 1];

  if (latestSMA20 && latestSMA50) {
    const maSignal =
      latestSMA20 > latestSMA50 ? 'buy' : latestSMA20 < latestSMA50 ? 'sell' : 'neutral';
    results.push({
      indicator: 'Moving Averages',
      value: `SMA20: ${latestSMA20.toFixed(2)} | SMA50: ${latestSMA50.toFixed(2)}`,
      signal: maSignal,
      description: `Price is ${
        currentPrice > latestSMA20 ? 'above' : 'below'
      } SMA20. ${
        maSignal === 'buy'
          ? 'Short-term MA above long-term (bullish)'
          : maSignal === 'sell'
          ? 'Short-term MA below long-term (bearish)'
          : 'Neutral'
      }`,
    });
  }

  // Bollinger Bands
  const bb = calculateBollingerBands(prices);
  const latestBB = bb[bb.length - 1];
  if (latestBB) {
    const pricePosition =
      currentPrice < latestBB.lower
        ? 'below lower band'
        : currentPrice > latestBB.upper
        ? 'above upper band'
        : 'within bands';
    results.push({
      indicator: 'Bollinger Bands',
      value: `U: ${latestBB.upper.toFixed(2)} | M: ${latestBB.middle.toFixed(
        2
      )} | L: ${latestBB.lower.toFixed(2)}`,
      signal:
        currentPrice < latestBB.lower
          ? 'buy'
          : currentPrice > latestBB.upper
          ? 'sell'
          : 'neutral',
      description: `Price is ${pricePosition}. ${
        currentPrice < latestBB.lower
          ? 'Potentially oversold'
          : currentPrice > latestBB.upper
          ? 'Potentially overbought'
          : 'Normal volatility range'
      }`,
    });
  }

  return results;
}

/**
 * Detect support and resistance levels
 */
export function detectSupportResistance(
  prices: number[],
  tolerance: number = 0.02
): { support: number[]; resistance: number[] } {
  const support: number[] = [];
  const resistance: number[] = [];

  // Simple peak and trough detection
  for (let i = 2; i < prices.length - 2; i++) {
    // Detect local minimum (support)
    if (
      prices[i] < prices[i - 1] &&
      prices[i] < prices[i - 2] &&
      prices[i] < prices[i + 1] &&
      prices[i] < prices[i + 2]
    ) {
      support.push(prices[i]);
    }

    // Detect local maximum (resistance)
    if (
      prices[i] > prices[i - 1] &&
      prices[i] > prices[i - 2] &&
      prices[i] > prices[i + 1] &&
      prices[i] > prices[i + 2]
    ) {
      resistance.push(prices[i]);
    }
  }

  // Cluster similar levels
  const clusterLevels = (levels: number[]): number[] => {
    if (levels.length === 0) return [];

    const sorted = [...levels].sort((a, b) => a - b);
    const clustered: number[] = [];
    let currentCluster = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const diff = Math.abs(sorted[i] - sorted[i - 1]) / sorted[i - 1];
      if (diff < tolerance) {
        currentCluster.push(sorted[i]);
      } else {
        clustered.push(
          currentCluster.reduce((a, b) => a + b) / currentCluster.length
        );
        currentCluster = [sorted[i]];
      }
    }

    if (currentCluster.length > 0) {
      clustered.push(
        currentCluster.reduce((a, b) => a + b) / currentCluster.length
      );
    }

    return clustered;
  };

  return {
    support: clusterLevels(support).slice(-3), // Return top 3 support levels
    resistance: clusterLevels(resistance).slice(-3), // Return top 3 resistance levels
  };
}

