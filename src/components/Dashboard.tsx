import React, { useState } from 'react';
import { Moon, Sun, BarChart3, TrendingUp, DollarSign, Eye } from 'lucide-react';
import { StockData } from '../types/stock';
import StockSearch from './StockSearch';
import StockDetails from './StockDetails';
import StockChart from './StockChart';
import TechnicalAnalysis from './TechnicalAnalysis';

const Dashboard: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'chart' | 'analysis'>('overview');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'chart', label: 'Chart', icon: BarChart3 },
    { id: 'analysis', label: 'Analysis', icon: TrendingUp }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-slate-50 to-white'
    }`}>
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Stock Market Analysis
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Professional trading insights & forecasting
                </p>
              </div>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Search Stocks
            </h2>
            <StockSearch 
              onSelectStock={setSelectedStock}
              selectedStock={selectedStock}
            />
          </div>
        </div>

        {selectedStock ? (
          <>
            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 max-w-md">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              {activeTab === 'overview' && (
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <StockDetails stock={selectedStock} />
                  </div>
                  <div className="lg:col-span-2">
                    <StockChart symbol={selectedStock.symbol} />
                  </div>
                </div>
              )}

              {activeTab === 'chart' && (
                <StockChart symbol={selectedStock.symbol} />
              )}

              {activeTab === 'analysis' && (
                <TechnicalAnalysis symbol={selectedStock.symbol} />
              )}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Ready to Analyze Stocks
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
              Search for any stock symbol above to get started with comprehensive market analysis, 
              technical indicators, and AI-powered forecasting.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span>Real-time Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <span>Technical Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-purple-500" />
                <span>AI Forecasting</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;