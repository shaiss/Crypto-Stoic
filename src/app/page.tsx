import Layout from '@/components/Layout';
import MarketOverview from '@/components/MarketOverview';
import TrendingSection from '@/components/TrendingSection';
import ChatInterface from '@/components/ChatInterface';
import PriceChart from '@/components/Charts/PriceChart';

export default function Home() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered cryptocurrency research and analysis platform
          </p>
        </div>

        {/* Market Overview Stats */}
        <MarketOverview />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Chart & Trending */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bitcoin Chart */}
            <PriceChart assetId="bitcoin" days={30} />

            {/* Trending Section */}
            <TrendingSection />
          </div>

          {/* Right Column - AI Chat */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <ChatInterface />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Getting Started
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                💬 Ask AI Assistant
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use natural language to analyze markets, get technical insights, and research
                cryptocurrencies
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                📊 Screen Markets
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Filter and sort through 100+ cryptocurrencies with real-time data and advanced
                metrics
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                📈 Technical Analysis
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View charts, indicators like RSI, MACD, Bollinger Bands, and get AI-powered
                analysis
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
