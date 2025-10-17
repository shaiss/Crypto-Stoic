'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import PriceChart from '@/components/Charts/PriceChart';
import CandlestickChart from '@/components/Charts/CandlestickChart';
import TechnicalAnalysis from '@/components/TechnicalAnalysis';
import { symbolToCoinGeckoId } from '@/lib/crypto-api';

export default function ChartsPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [timeframe, setTimeframe] = useState(30);
  const [chartType, setChartType] = useState<'price' | 'candlestick'>('price');

  const assetId = symbolToCoinGeckoId(selectedSymbol);

  const popularAssets = [
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'SOL', name: 'Solana' },
    { symbol: 'NEAR', name: 'NEAR' },
    { symbol: 'BNB', name: 'BNB' },
    { symbol: 'ADA', name: 'Cardano' },
  ];

  const timeframes = [
    { label: '7D', value: 7 },
    { label: '30D', value: 30 },
    { label: '90D', value: 90 },
    { label: '1Y', value: 365 },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Charts & Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Interactive price charts and technical indicators
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Asset Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Asset
              </label>
              <div className="flex gap-2">
                {popularAssets.map((asset) => (
                  <button
                    key={asset.symbol}
                    onClick={() => setSelectedSymbol(asset.symbol)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedSymbol === asset.symbol
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {asset.symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeframe Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timeframe
              </label>
              <div className="flex gap-2">
                {timeframes.map((tf) => (
                  <button
                    key={tf.value}
                    onClick={() => setTimeframe(tf.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      timeframe === tf.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chart Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setChartType('price')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    chartType === 'price'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Price
                </button>
                <button
                  onClick={() => setChartType('candlestick')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    chartType === 'candlestick'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Candlestick
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {chartType === 'price' ? (
              <PriceChart assetId={assetId} days={timeframe} />
            ) : (
              <CandlestickChart assetId={assetId} days={timeframe} />
            )}
          </div>

          <div className="lg:col-span-1">
            <TechnicalAnalysis symbol={selectedSymbol} days={timeframe} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

