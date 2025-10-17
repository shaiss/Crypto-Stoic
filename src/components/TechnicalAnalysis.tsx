'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import type { TechnicalAnalysisResult } from '@/types';

interface TechnicalAnalysisProps {
  symbol: string;
  days?: number;
}

export default function TechnicalAnalysis({ symbol, days = 30 }: TechnicalAnalysisProps) {
  const [analysis, setAnalysis] = useState<TechnicalAnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    fetchAnalysis();
  }, [symbol, days]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/technical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, days, indicators: ['all'] }),
      });

      const result = await response.json();
      if (result.data?.analysis) {
        setAnalysis(result.data.analysis);
      }
    } catch (error) {
      console.error('Failed to fetch technical analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAISummary = async () => {
    try {
      setLoadingAI(true);
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content:
                'You are a cryptocurrency technical analyst. Provide concise analysis based on technical indicators.',
            },
            {
              role: 'user',
              content: `Analyze ${symbol} based on these indicators: ${JSON.stringify(
                analysis
              )}. Provide a brief 2-3 paragraph summary with trading outlook. Include disclaimer.`,
            },
          ],
        }),
      });

      const data = await response.json();
      setAiSummary(data.content);
    } catch (error) {
      console.error('Failed to generate AI summary:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'buy':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'sell':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400';
      case 'sell':
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-40">
          <div className="text-gray-500 dark:text-gray-400">Loading analysis...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Technical Analysis - {symbol.toUpperCase()}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Based on {days}-day data
          </p>
        </div>
        <button
          onClick={fetchAnalysis}
          className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Indicators Grid */}
      <div className="space-y-4 mb-6">
        {analysis.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getSignalIcon(item.signal)}
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {item.indicator}
                </h4>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getSignalColor(
                  item.signal
                )}`}
              >
                {item.signal.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Value: {item.value}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* AI Summary */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900 dark:text-white">AI Analysis Summary</h4>
          <button
            onClick={generateAISummary}
            disabled={loadingAI}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            {loadingAI ? 'Generating...' : 'Generate Summary'}
          </button>
        </div>

        {aiSummary && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {aiSummary}
            </p>
          </div>
        )}
      </div>

      {/* Overall Signal */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Overall Signal</p>
        <div className="flex items-center gap-2">
          {(() => {
            const buySignals = analysis.filter((a) => a.signal === 'buy').length;
            const sellSignals = analysis.filter((a) => a.signal === 'sell').length;
            const totalSignals = buySignals + sellSignals;

            if (totalSignals === 0) {
              return (
                <>
                  <Minus className="w-6 h-6 text-gray-500" />
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Neutral
                  </span>
                </>
              );
            }

            const buyPercentage = (buySignals / totalSignals) * 100;

            if (buyPercentage > 60) {
              return (
                <>
                  <TrendingUp className="w-6 h-6 text-green-500" />
                  <span className="text-lg font-semibold text-green-700 dark:text-green-400">
                    Bullish ({buyPercentage.toFixed(0)}%)
                  </span>
                </>
              );
            } else if (buyPercentage < 40) {
              return (
                <>
                  <TrendingDown className="w-6 h-6 text-red-500" />
                  <span className="text-lg font-semibold text-red-700 dark:text-red-400">
                    Bearish ({(100 - buyPercentage).toFixed(0)}%)
                  </span>
                </>
              );
            } else {
              return (
                <>
                  <Minus className="w-6 h-6 text-gray-500" />
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Mixed Signals
                  </span>
                </>
              );
            }
          })()}
        </div>
      </div>
    </div>
  );
}

