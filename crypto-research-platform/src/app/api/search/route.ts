import { NextRequest, NextResponse } from 'next/server';
import { searchCrypto, fetchTrending } from '@/lib/crypto-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'search';

    if (type === 'trending') {
      const trendingData = await fetchTrending();
      return NextResponse.json({ data: trendingData });
    }

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const results = await searchCrypto(query);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    );
  }
}

