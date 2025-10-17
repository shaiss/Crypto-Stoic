'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils';

export default function MarketOverview() {
  const [globalData, setGlobalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlobalData();
  }, []);

  const fetchGlobalData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/market?includeGlobal=true');
      const data = await response.json();
      setGlobalData(data.global);
    } catch (error) {
      console.error('Failed to fetch global data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !globalData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Market Cap',
      value: formatCurrency(globalData.total_market_cap?.usd || 0),
      change: globalData.market_cap_change_percentage_24h_usd,
      icon: DollarSign,
      color: 'blue',
    },
    {
      label: '24h Volume',
      value: formatCurrency(globalData.total_volume?.usd || 0),
      icon: Activity,
      color: 'purple',
    },
    {
      label: 'BTC Dominance',
      value: `${(globalData.market_cap_percentage?.btc || 0).toFixed(1)}%`,
      icon: TrendingUp,
      color: 'orange',
    },
    {
      label: 'Active Cryptocurrencies',
      value: formatNumber(globalData.active_cryptocurrencies || 0, 0),
      icon: TrendingDown,
      color: 'green',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colorClasses = {
          blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
          purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
          orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
          green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
        }[stat.color];

        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              <div className={`p-2 rounded-lg ${colorClasses}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </p>
            {stat.change !== undefined && (
              <p
                className={`text-sm font-medium ${
                  stat.change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {stat.change >= 0 ? '↑' : '↓'} {formatPercentage(Math.abs(stat.change))}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

