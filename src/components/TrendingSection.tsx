'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Flame } from 'lucide-react';
import { formatCurrency, formatPercentage, getChangeColor } from '@/lib/utils';

export default function TrendingSection() {
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/search?type=trending');
      const data = await response.json();
      
      if (data.data?.coins) {
        setTrending(data.data.coins.slice(0, 7));
      }
    } catch (error) {
      console.error('Failed to fetch trending:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Trending
        </h3>
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Flame className="w-5 h-5 text-orange-500" />
        Trending
      </h3>

      <div className="space-y-3">
        {trending.map((coin, index) => {
          const item = coin.item;
          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400">
                  {index + 1}
                </div>
                {item.thumb && (
                  <img src={item.thumb} alt={item.name} className="w-6 h-6" />
                )}
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                    {item.symbol}
                  </div>
                </div>
              </div>
              <div className="text-right">
                {item.data?.price && (
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(parseFloat(item.data.price))}
                  </div>
                )}
                {item.data?.price_change_percentage_24h && (
                  <div
                    className={`text-xs ${getChangeColor(
                      item.data.price_change_percentage_24h.usd
                    )}`}
                  >
                    {formatPercentage(item.data.price_change_percentage_24h.usd)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

