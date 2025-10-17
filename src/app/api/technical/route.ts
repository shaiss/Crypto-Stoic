import { NextRequest, NextResponse } from 'next/server';
import {
  generateTechnicalAnalysis,
  detectSupportResistance,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
} from '@/lib/technical-indicators';
import { fetchHistoricalPrices, symbolToCoinGeckoId } from '@/lib/crypto-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symbol, days = 30, indicators = [] } = body;

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol is required' },
        { status: 400 }
      );
    }

    // Fetch historical price data
    const assetId = symbolToCoinGeckoId(symbol);
    const { prices } = await fetchHistoricalPrices(assetId, days);

    // Extract closing prices
    const closePrices = prices.map((p) => p[1]);

    // Calculate requested indicators or all if none specified
    const results: any = {};

    if (indicators.length === 0 || indicators.includes('all')) {
      // Generate comprehensive analysis
      results.analysis = generateTechnicalAnalysis(closePrices);
      results.supportResistance = detectSupportResistance(closePrices);
    } else {
      if (indicators.includes('rsi')) {
        results.rsi = calculateRSI(closePrices);
      }
      if (indicators.includes('macd')) {
        results.macd = calculateMACD(closePrices);
      }
      if (indicators.includes('bollinger')) {
        results.bollingerBands = calculateBollingerBands(closePrices);
      }
      if (indicators.includes('support')) {
        results.supportResistance = detectSupportResistance(closePrices);
      }
    }

    return NextResponse.json({
      symbol,
      days,
      data: results,
      prices: closePrices,
    });
  } catch (error) {
    console.error('Technical Analysis API Error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate technical indicators' },
      { status: 500 }
    );
  }
}

