import Layout from '@/components/Layout';
import MarketScreener from '@/components/MarketScreener';
import MarketOverview from '@/components/MarketOverview';

export default function MarketsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Markets
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time cryptocurrency market data and advanced screening tools
          </p>
        </div>

        {/* Market Overview */}
        <MarketOverview />

        {/* Market Screener */}
        <MarketScreener />
      </div>
    </Layout>
  );
}

