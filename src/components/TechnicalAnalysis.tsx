import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { HistoricalData, TechnicalIndicators, InvestmentRecommendation } from '../types/stock';
import { getHistoricalData } from '../utils/stockApi';
import { calculateTechnicalIndicators, generateInvestmentRecommendation } from '../utils/technicalAnalysis';

interface TechnicalAnalysisProps {
  symbol: string;
}

const TechnicalAnalysis: React.FC<TechnicalAnalysisProps> = ({ symbol }) => {
  const [indicators, setIndicators] = useState<TechnicalIndicators | null>(null);
  const [recommendation, setRecommendation] = useState<InvestmentRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoading(true);
      try {
        const historicalData = await getHistoricalData(symbol, '1Y');
        const technicalIndicators = calculateTechnicalIndicators(historicalData);
        const investmentRec = generateInvestmentRecommendation(historicalData, technicalIndicators);
        
        setIndicators(technicalIndicators);
        setRecommendation(investmentRec);
      } catch (error) {
        console.error('Failed to fetch technical analysis:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [symbol]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!indicators || !recommendation) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="text-center text-slate-500 dark:text-slate-400">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <p>Unable to load technical analysis</p>
        </div>
      </div>
    );
  }

  const latestRSI = indicators.rsi[indicators.rsi.length - 1];
  const latestMACD = indicators.macd[indicators.macd.length - 1];
  const latestSignal = indicators.signal[indicators.signal.length - 1];

  const rsiData = [
    { name: 'RSI', value: latestRSI, target: 50 }
  ];

  const getRSIColor = (rsi: number) => {
    if (rsi < 30) return '#ef4444'; // Red - oversold
    if (rsi > 70) return '#f59e0b'; // Orange - overbought
    return '#10b981'; // Green - neutral
  };

  const getRecommendationColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'SELL': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-green-600';
      case 'HIGH': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Investment Recommendation */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3 mb-6">
          <Target className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Investment Recommendation</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Action</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRecommendationColor(recommendation.action)}`}>
                {recommendation.action}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Confidence Score</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                  <div 
                    className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                    style={{ width: `${recommendation.score}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {recommendation.score}/100
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Target Price</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                ${recommendation.targetPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Risk Level</span>
              <span className={`font-medium ${getRiskColor(recommendation.riskLevel)}`}>
                {recommendation.riskLevel}
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-slate-900 dark:text-white mb-3">Key Reasons</h4>
            <ul className="space-y-2">
              {recommendation.reasons.map((reason, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Technical Indicators */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3 mb-6">
          <Activity className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Technical Indicators</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* RSI */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-900 dark:text-white">RSI (14)</h4>
              <span className="text-sm text-slate-500 dark:text-slate-400">Momentum</span>
            </div>
            
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rsiData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                  <XAxis dataKey="name" hide />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(1)}`, 'RSI']}
                    labelStyle={{ display: 'none' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    <Cell fill={getRSIColor(latestRSI)} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {latestRSI.toFixed(1)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {latestRSI < 30 ? 'Oversold' : latestRSI > 70 ? 'Overbought' : 'Neutral'}
              </div>
            </div>
          </div>

          {/* MACD */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-900 dark:text-white">MACD</h4>
              <span className="text-sm text-slate-500 dark:text-slate-400">Trend</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">MACD Line</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {latestMACD.toFixed(3)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Signal Line</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {latestSignal.toFixed(3)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Histogram</span>
                <span className={`font-medium ${
                  latestMACD - latestSignal > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(latestMACD - latestSignal).toFixed(3)}
                </span>
              </div>
            </div>
            
            <div className="text-center pt-2">
              <div className={`flex items-center justify-center space-x-1 ${
                latestMACD > latestSignal ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`w-4 h-4 ${latestMACD <= latestSignal ? 'rotate-180' : ''}`} />
                <span className="text-sm font-medium">
                  {latestMACD > latestSignal ? 'Bullish' : 'Bearish'}
                </span>
              </div>
            </div>
          </div>

          {/* Moving Averages */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-900 dark:text-white">Moving Averages</h4>
              <span className="text-sm text-slate-500 dark:text-slate-400">Trend</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">SMA 20</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  ${indicators.sma20[indicators.sma20.length - 1]?.toFixed(2) || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">SMA 50</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  ${indicators.sma50[indicators.sma50.length - 1]?.toFixed(2) || 'N/A'}
                </span>
              </div>
            </div>
            
            <div className="text-center pt-2">
              <div className={`flex items-center justify-center space-x-1 ${
                (indicators.sma20[indicators.sma20.length - 1] || 0) > 
                (indicators.sma50[indicators.sma50.length - 1] || 0) 
                  ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`w-4 h-4 ${
                  (indicators.sma20[indicators.sma20.length - 1] || 0) <= 
                  (indicators.sma50[indicators.sma50.length - 1] || 0) 
                    ? 'rotate-180' : ''
                }`} />
                <span className="text-sm font-medium">
                  {(indicators.sma20[indicators.sma20.length - 1] || 0) > 
                   (indicators.sma50[indicators.sma50.length - 1] || 0) 
                    ? 'Bullish Cross' : 'Bearish Cross'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalAnalysis;