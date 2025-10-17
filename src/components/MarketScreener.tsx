'use client';

import { useState, useEffect, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Star, TrendingUp } from 'lucide-react';
import type { CryptoAsset } from '@/types';
import { formatCurrency, formatPercentage, formatNumber, getChangeColor } from '@/lib/utils';
import { useStore } from '@/lib/store';

export default function MarketScreener() {
  const [assets, setAssets] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<keyof CryptoAsset>('market_cap_rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterPrice, setFilterPrice] = useState<{ min?: number; max?: number }>({});
  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useStore();

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/market?perPage=100&includeGlobal=true');
      const data = await response.json();
      if (Array.isArray(data.assets)) {
        setAssets(data.assets);
      } else if (Array.isArray(data)) {
        setAssets(data);
      } else {
        console.error('Invalid assets data:', data);
        setAssets([]);
      }
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedAssets = useMemo(() => {
    let filtered = [...assets];

    // Apply price filter
    if (filterPrice.min !== undefined) {
      filtered = filtered.filter((a) => a.current_price >= filterPrice.min!);
    }
    if (filterPrice.max !== undefined) {
      filtered = filtered.filter((a) => a.current_price <= filterPrice.max!);
    }

    // Sort
    filtered.sort((a, b) => {
      const aVal = a[sortBy] as number;
      const bVal = b[sortBy] as number;
      
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;
      
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return filtered;
  }, [assets, sortBy, sortOrder, filterPrice]);

  const handleSort = (column: keyof CryptoAsset) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ column }: { column: keyof CryptoAsset }) => {
    if (sortBy !== column) return <ArrowUpDown className="w-4 h-4 opacity-30" />;
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading market data...</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Market Screener
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredAndSortedAssets.length} cryptocurrencies
            </p>
          </div>
          <button
            onClick={fetchMarketData}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Min Price
            </label>
            <input
              type="number"
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              onChange={(e) =>
                setFilterPrice({
                  ...filterPrice,
                  min: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Max Price
            </label>
            <input
              type="number"
              placeholder="∞"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              onChange={(e) =>
                setFilterPrice({
                  ...filterPrice,
                  max: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Asset
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                onClick={() => handleSort('current_price')}
              >
                <div className="flex items-center justify-end gap-1">
                  Price
                  <SortIcon column="current_price" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                onClick={() => handleSort('price_change_percentage_24h')}
              >
                <div className="flex items-center justify-end gap-1">
                  24h
                  <SortIcon column="price_change_percentage_24h" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                onClick={() => handleSort('price_change_percentage_7d')}
              >
                <div className="flex items-center justify-end gap-1">
                  7d
                  <SortIcon column="price_change_percentage_7d" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                onClick={() => handleSort('market_cap')}
              >
                <div className="flex items-center justify-end gap-1">
                  Market Cap
                  <SortIcon column="market_cap" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                onClick={() => handleSort('total_volume')}
              >
                <div className="flex items-center justify-end gap-1">
                  Volume
                  <SortIcon column="total_volume" />
                </div>
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Watch
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAndSortedAssets.map((asset) => (
              <tr
                key={asset.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {asset.market_cap_rank || '-'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {asset.image && (
                      <img src={asset.image} alt={asset.name} className="w-6 h-6" />
                    )}
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {asset.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                        {asset.symbol}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                  {formatCurrency(asset.current_price)}
                </td>
                <td className={`px-4 py-3 text-right text-sm ${getChangeColor(asset.price_change_percentage_24h || 0)}`}>
                  {asset.price_change_percentage_24h !== undefined
                    ? formatPercentage(asset.price_change_percentage_24h)
                    : '-'}
                </td>
                <td className={`px-4 py-3 text-right text-sm ${getChangeColor(asset.price_change_percentage_7d || 0)}`}>
                  {asset.price_change_percentage_7d !== undefined
                    ? formatPercentage(asset.price_change_percentage_7d)
                    : '-'}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                  ${formatNumber(asset.market_cap)}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                  ${formatNumber(asset.total_volume)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() =>
                      isInWatchlist(asset.id)
                        ? removeFromWatchlist(asset.id)
                        : addToWatchlist(asset.id)
                    }
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        isInWatchlist(asset.id) ? 'fill-yellow-500 text-yellow-500' : ''
                      }`}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

