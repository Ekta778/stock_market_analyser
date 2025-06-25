import React, { useState, useEffect } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { StockData } from '../types/stock';
import { searchStocks } from '../utils/stockApi';

interface StockSearchProps {
  onSelectStock: (stock: StockData) => void;
  selectedStock: StockData | null;
}

const StockSearch: React.FC<StockSearchProps> = ({ onSelectStock, selectedStock }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const searchForStocks = async () => {
      if (query.trim().length > 0) {
        setIsLoading(true);
        try {
          const stocks = await searchStocks(query);
          setResults(stocks);
          setShowResults(true);
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    };

    const debounceTimer = setTimeout(searchForStocks, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelectStock = (stock: StockData) => {
    onSelectStock(stock);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stocks (e.g., AAPL, Microsoft)..."
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400"
        />
      </div>

      {showResults && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-slate-500">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleSelectStock(stock)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150 flex items-center justify-between group"
                >
                  <div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {stock.symbol}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {stock.name}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      ${stock.price.toFixed(2)}
                    </div>
                    <div className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-slate-500">
              <p className="text-sm">No stocks found for "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockSearch;