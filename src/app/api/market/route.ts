import { NextRequest, NextResponse } from 'next/server';
import { fetchMarketData, fetchGlobalData } from '@/lib/crypto-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get('currency') || 'usd';
    const perPage = parseInt(searchParams.get('perPage') || '100');
    const page = parseInt(searchParams.get('page') || '1');
    const includeGlobal = searchParams.get('includeGlobal') === 'true';

    const marketData = await fetchMarketData(currency, perPage, page);
    
    if (includeGlobal) {
      try {
        const globalData = await fetchGlobalData();
        return NextResponse.json({ assets: marketData, global: globalData });
      } catch (globalError) {
        // If global data fails, still return market data
        console.warn('[API] Global data fetch failed, returning market data only:', (globalError as any)?.message);
        return NextResponse.json({ assets: marketData, global: null });
      }
    }

    return NextResponse.json({ assets: marketData });
  } catch (error) {
    console.error('Market API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}

