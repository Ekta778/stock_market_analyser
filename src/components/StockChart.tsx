import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { HistoricalData, TechnicalIndicators, ForecastData } from '../types/stock';
import { getHistoricalData, formatCurrency } from '../utils/stockApi';
import { calculateTechnicalIndicators, generateForecast } from '../utils/technicalAnalysis';

interface StockChartProps {
  symbol: string;
}

const StockChart: React.FC<StockChartProps> = ({ symbol }) => {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [indicators, setIndicators] = useState<TechnicalIndicators | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('3M');
  const [isLoading, setIsLoading] = useState(true);
  const [showForecast, setShowForecast] = useState(false);

  const periods = [
    { label: '5D', value: '5D' },
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '1Y', value: '1Y' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getHistoricalData(symbol, selectedPeriod);
        setHistoricalData(data);
        
        const technicalIndicators = calculateTechnicalIndicators(data);
        setIndicators(technicalIndicators);
        
        const forecastData = generateForecast(data);
        setForecast(forecastData);
      } catch (error) {
        console.error('Failed to fetch historical data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [symbol, selectedPeriod]);

  const chartData = historicalData.map((item, index) => ({
    date: item.date,
    price: item.close,
    sma20: indicators?.sma20[index] || null,
    sma50: indicators?.sma50[index] || null,
    volume: item.volume
  }));

  const forecastChartData = forecast.map(item => ({
    date: item.date,
    forecast: item.predicted,
    confidence: item.confidence
  }));

  const combinedData = showForecast 
    ? [...chartData, ...forecastChartData.map(f => ({ ...f, price: null, sma20: null, sma50: null, volume: null }))]
    : chartData;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isForecasted = payload.some((p: any) => p.dataKey === 'forecast');
      return (
        <div className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => {
            if (entry.value === null) return null;
            return (
              <p key={index} className={`text-sm font-medium`} style={{ color: entry.color }}>
                {entry.dataKey === 'price' && 'Price: '}
                {entry.dataKey === 'forecast' && 'Forecast: '}
                {entry.dataKey === 'sma20' && 'SMA 20: '}
                {entry.dataKey === 'sma50' && 'SMA 50: '}
                {formatCurrency(entry.value)}
              </p>
            );
          })}
          {isForecasted && (
            <p className="text-xs text-slate-500 mt-1">Forecasted data</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const latestPrice = historicalData[historicalData.length - 1]?.close || 0;
  const firstPrice = historicalData[0]?.close || 0;
  const priceChange = latestPrice - firstPrice;
  const priceChangePercent = (priceChange / firstPrice) * 100;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Price Chart</h3>
          <div className="flex items-center space-x-2">
            {priceChange >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
            <span className={`text-sm font-medium ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}% ({selectedPeriod})
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowForecast(!showForecast)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              showForecast 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Forecast
          </button>
          
          <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedPeriod === period.value
                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {showForecast && (
              <ReferenceLine 
                x={historicalData[historicalData.length - 1]?.date} 
                stroke="#94a3b8" 
                strokeDasharray="2 2" 
              />
            )}
            
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#3b82f6' }}
            />
            
            {showForecast && (
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 4, fill: '#f59e0b' }}
              />
            )}
            
            <Line
              type="monotone"
              dataKey="sma20"
              stroke="#10b981"
              strokeWidth={1}
              dot={false}
              strokeOpacity={0.7}
            />
            
            <Line
              type="monotone"
              dataKey="sma50"
              stroke="#f97316"
              strokeWidth={1}
              dot={false}
              strokeOpacity={0.7}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            <span className="text-slate-600 dark:text-slate-400">Price</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-green-500"></div>
            <span className="text-slate-600 dark:text-slate-400">SMA 20</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-orange-500"></div>
            <span className="text-slate-600 dark:text-slate-400">SMA 50</span>
          </div>
          {showForecast && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-amber-500 border-dashed border-t border-amber-500"></div>
              <span className="text-slate-600 dark:text-slate-400">Forecast</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
          <Calendar className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default StockChart;