export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  high52Week: number;
  low52Week: number;
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  sma20: number[];
  sma50: number[];
  rsi: number[];
  macd: number[];
  signal: number[];
}

export interface ForecastData {
  date: string;
  predicted: number;
  confidence: number;
}

export interface InvestmentRecommendation {
  action: 'BUY' | 'SELL' | 'HOLD';
  score: number;
  reasons: string[];
  targetPrice: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}