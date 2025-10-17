import { NextRequest, NextResponse } from 'next/server';
import {
  fetchAssetDetails,
  fetchOHLCData,
  fetchHistoricalPrices,
} from '@/lib/crypto-api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get('type') || 'details';
    const days = parseInt(searchParams.get('days') || '30');

    const resolvedParams = await params;
    const assetId = resolvedParams.id;

    switch (dataType) {
      case 'ohlc':
        const ohlcData = await fetchOHLCData(assetId, days);
        return NextResponse.json({ data: ohlcData });

      case 'history':
        const historyData = await fetchHistoricalPrices(assetId, days);
        return NextResponse.json({ data: historyData });

      case 'details':
      default:
        const details = await fetchAssetDetails(assetId);
        return NextResponse.json({ data: details });
    }
  } catch (error) {
    console.error('Asset API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asset data' },
      { status: 500 }
    );
  }
}

