'use client';

import { useState, useEffect } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { OHLCData } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface CandlestickChartProps {
  assetId: string;
  days?: number;
}

export default function CandlestickChart({ assetId, days = 30 }: CandlestickChartProps) {
  const [data, setData] = useState<OHLCData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [assetId, days]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/assets/${assetId}?type=ohlc&days=${days}`);
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error('Failed to fetch OHLC data:', error);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {formatDate(data.time)}
          </p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-900 dark:text-white">
              <span className="font-medium">O:</span> {formatCurrency(data.open)}
            </p>
            <p className="text-green-500">
              <span className="font-medium">H:</span> {formatCurrency(data.high)}
            </p>
            <p className="text-red-500">
              <span className="font-medium">L:</span> {formatCurrency(data.low)}
            </p>
            <p className="text-gray-900 dark:text-white">
              <span className="font-medium">C:</span> {formatCurrency(data.close)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-gray-500 dark:text-gray-400">Loading chart...</div>
      </div>
    );
  }

  // Transform OHLC data for candlestick representation
  const chartData = data.map((d) => ({
    ...d,
    date: new Date(d.time).toLocaleDateString(),
    range: [d.low, d.high],
    body: d.close >= d.open ? [d.open, d.close] : [d.close, d.open],
    isGreen: d.close >= d.open,
  }));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Candlestick Chart
      </h3>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            tickLine={false}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            tickLine={false}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Wicks (high-low range) */}
          <Bar dataKey="range" fill="transparent" barSize={2}>
            {chartData.map((entry, index) => (
              <Cell
                key={`wick-${index}`}
                stroke={entry.isGreen ? '#10b981' : '#ef4444'}
                strokeWidth={1}
              />
            ))}
          </Bar>

          {/* Candle bodies */}
          <Bar dataKey="body" barSize={8}>
            {chartData.map((entry, index) => (
              <Cell
                key={`body-${index}`}
                fill={entry.isGreen ? '#10b981' : '#ef4444'}
              />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

