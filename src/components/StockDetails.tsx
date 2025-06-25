import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Users, PieChart } from 'lucide-react';
import { StockData } from '../types/stock';
import { formatCurrency, formatNumber } from '../utils/stockApi';

interface StockDetailsProps {
  stock: StockData;
}

const StockDetails: React.FC<StockDetailsProps> = ({ stock }) => {
  const metrics = [
    {
      label: 'Market Cap',
      value: formatNumber(stock.marketCap),
      icon: PieChart,
      color: 'text-blue-600'
    },
    {
      label: 'P/E Ratio',
      value: stock.peRatio.toFixed(2),
      icon: BarChart3,
      color: 'text-purple-600'
    },
    {
      label: 'Volume',
      value: formatNumber(stock.volume),
      icon: Users,
      color: 'text-green-600'
    },
    {
      label: '52W High',
      value: formatCurrency(stock.high52Week),
      icon: TrendingUp,
      color: 'text-emerald-600'
    },
    {
      label: '52W Low',
      value: formatCurrency(stock.low52Week),
      icon: TrendingDown,
      color: 'text-red-600'
    }
  ];

  const pricePosition = ((stock.price - stock.low52Week) / (stock.high52Week - stock.low52Week)) * 100;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{stock.symbol}</h2>
              <p className="text-slate-600 dark:text-slate-400">{stock.name}</p>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            {formatCurrency(stock.price)}
          </div>
          <div className={`flex items-center justify-end space-x-1 ${
            stock.change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {stock.change >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="font-medium">
              {stock.change >= 0 ? '+' : ''}{formatCurrency(Math.abs(stock.change))}
            </span>
            <span className="text-sm">
              ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* 52-Week Range */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">52-Week Range</span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {pricePosition.toFixed(0)}% of range
          </span>
        </div>
        <div className="relative">
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
            <div 
              className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full relative"
              style={{ width: '100%' }}
            >
              <div 
                className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white border-2 border-slate-800 rounded-full shadow-lg"
                style={{ left: `${pricePosition}%`, marginLeft: '-6px' }}
              />
            </div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
            <span>{formatCurrency(stock.low52Week)}</span>
            <span>{formatCurrency(stock.high52Week)}</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div 
              key={index}
              className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    {metric.label}
                  </p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {metric.value}
                  </p>
                </div>
                <Icon className={`w-5 h-5 ${metric.color}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StockDetails;