import axios from 'axios';
import { StockData, HistoricalData } from '../types/stock';

// Demo data for when API is not available
const DEMO_STOCKS: StockData[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 178.25,
    change: 2.34,
    changePercent: 1.33,
    volume: 45234567,
    marketCap: 2800000000000,
    peRatio: 28.5,
    high52Week: 198.23,
    low52Week: 124.17
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.85,
    change: -1.22,
    changePercent: -0.32,
    volume: 23456789,
    marketCap: 2820000000000,
    peRatio: 32.1,
    high52Week: 384.30,
    low52Week: 245.61
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 138.93,
    change: 3.45,
    changePercent: 2.55,
    volume: 34567890,
    marketCap: 1750000000000,
    peRatio: 25.8,
    high52Week: 153.78,
    low52Week: 102.21
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 248.50,
    change: -8.75,
    changePercent: -3.40,
    volume: 67890123,
    marketCap: 790000000000,
    peRatio: 78.2,
    high52Week: 299.29,
    low52Week: 138.80
  }
];

const generateHistoricalData = (symbol: string, days: number = 365): HistoricalData[] => {
  const data: HistoricalData[] = [];
  const basePrice = DEMO_STOCKS.find(s => s.symbol === symbol)?.price || 100;
  let currentPrice = basePrice * 0.8; // Start from 80% of current price
  
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simulate realistic price movement
    const volatility = 0.02; // 2% daily volatility
    const trend = 0.0003; // Slight upward trend
    const change = (Math.random() - 0.5) * volatility + trend;
    
    currentPrice = Math.max(currentPrice * (1 + change), 1);
    
    const open = currentPrice;
    const high = open * (1 + Math.random() * 0.03);
    const low = open * (1 - Math.random() * 0.03);
    const close = low + Math.random() * (high - low);
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.floor(Math.random() * 50000000) + 10000000
    });
    
    currentPrice = close;
  }
  
  return data;
};

export const searchStocks = async (query: string): Promise<StockData[]> => {
  // In a real app, this would call an actual API
  // For demo purposes, we'll filter our demo data
  return DEMO_STOCKS.filter(stock => 
    stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
    stock.name.toLowerCase().includes(query.toLowerCase())
  );
};

export const getStockData = async (symbol: string): Promise<StockData | null> => {
  // In a real app, this would call an actual API
  return DEMO_STOCKS.find(stock => stock.symbol === symbol) || null;
};

export const getHistoricalData = async (symbol: string, period: string = '1Y'): Promise<HistoricalData[]> => {
  // In a real app, this would call an actual API
  const days = period === '1D' ? 1 : period === '5D' ? 5 : period === '1M' ? 30 : period === '3M' ? 90 : 365;
  return generateHistoricalData(symbol, days);
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const formatNumber = (value: number): string => {
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  }
  return value.toLocaleString();
};