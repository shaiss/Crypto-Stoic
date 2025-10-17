import Layout from '@/components/Layout';
import ChatInterface from '@/components/ChatInterface';

export default function ChatPage() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Research Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ask questions about crypto markets using natural language
          </p>
        </div>

        {/* Chat Interface - Full Height */}
        <div className="h-[calc(100vh-16rem)]">
          <ChatInterface />
        </div>

        {/* Example Queries */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Example Queries
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                Market Analysis
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Show me the top 10 cryptocurrencies by market cap</li>
                <li>• What are the biggest gainers in the last 24 hours?</li>
                <li>• Compare Bitcoin and Ethereum performance this month</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                Technical Analysis
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• What&apos;s the RSI for Solana right now?</li>
                <li>• Show me MACD for Bitcoin over 30 days</li>
                <li>• Is Ethereum overbought or oversold?</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                Price & Trends
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• What&apos;s the current price of NEAR?</li>
                <li>• Show me trending cryptocurrencies</li>
                <li>• Find coins under $1 with high volume</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                Sentiment & News
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• What&apos;s the market sentiment for Bitcoin?</li>
                <li>• Any recent news about Ethereum?</li>
                <li>• What are people saying about Dogecoin?</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

