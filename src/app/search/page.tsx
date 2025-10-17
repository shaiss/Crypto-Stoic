'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { Search as SearchIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Search
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search for cryptocurrencies, tokens, and projects
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for cryptocurrencies..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Search Results ({results.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((coin) => (
                <div
                  key={coin.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    {coin.thumb && (
                      <img src={coin.thumb} alt={coin.name} className="w-8 h-8" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {coin.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                        {coin.symbol}
                      </div>
                    </div>
                  </div>
                  {coin.market_cap_rank && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Rank #{coin.market_cap_rank}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && query && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-12 text-center">
            <SearchIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No results found for &quot;{query}&quot;
            </p>
          </div>
        )}

        {/* Initial State */}
        {!loading && results.length === 0 && !query && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-12 text-center">
            <SearchIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start searching for cryptocurrencies
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Bitcoin', 'Ethereum', 'Solana', 'NEAR', 'Cardano'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    handleSearch({ preventDefault: () => {} } as any);
                  }}
                  className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

