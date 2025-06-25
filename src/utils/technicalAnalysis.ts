import { HistoricalData, TechnicalIndicators, ForecastData, InvestmentRecommendation } from '../types/stock';

export const calculateSMA = (data: number[], period: number): number[] => {
  const sma: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(NaN);
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
  }
  return sma;
};

export const calculateRSI = (prices: number[], period: number = 14): number[] => {
  const rsi: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  for (let i = 0; i < prices.length; i++) {
    if (i < period) {
      rsi.push(NaN);
    } else {
      const avgGain = gains.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
      const rs = avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    }
  }
  
  return rsi;
};

export const calculateMACD = (prices: number[]): { macd: number[], signal: number[] } => {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macd = ema12.map((val, i) => val - ema26[i]);
  const signal = calculateEMA(macd, 9);
  
  return { macd, signal };
};

const calculateEMA = (data: number[], period: number): number[] => {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);
  
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      ema.push(data[i]);
    } else {
      ema.push((data[i] * multiplier) + (ema[i - 1] * (1 - multiplier)));
    }
  }
  
  return ema;
};

export const calculateTechnicalIndicators = (historicalData: HistoricalData[]): TechnicalIndicators => {
  const closePrices = historicalData.map(d => d.close);
  const { macd, signal } = calculateMACD(closePrices);
  
  return {
    sma20: calculateSMA(closePrices, 20),
    sma50: calculateSMA(closePrices, 50),
    rsi: calculateRSI(closePrices),
    macd,
    signal
  };
};

export const generateForecast = (historicalData: HistoricalData[], days: number = 30): ForecastData[] => {
  const prices = historicalData.map(d => d.close);
  const forecast: ForecastData[] = [];
  
  // Simple linear regression for trend
  const n = prices.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = prices.reduce((a, b) => a + b, 0);
  const sumXY = prices.reduce((sum, price, i) => sum + (i * price), 0);
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  const lastDate = new Date(historicalData[historicalData.length - 1].date);
  
  for (let i = 1; i <= days; i++) {
    const futureDate = new Date(lastDate);
    futureDate.setDate(futureDate.getDate() + i);
    
    const predicted = intercept + slope * (n + i - 1);
    const confidence = Math.max(0.3, 1 - (i / days) * 0.7); // Confidence decreases over time
    
    forecast.push({
      date: futureDate.toISOString().split('T')[0],
      predicted: Math.max(predicted, 0),
      confidence
    });
  }
  
  return forecast;
};

export const generateInvestmentRecommendation = (
  historicalData: HistoricalData[],
  indicators: TechnicalIndicators
): InvestmentRecommendation => {
  const latestPrice = historicalData[historicalData.length - 1].close;
  const latestRSI = indicators.rsi[indicators.rsi.length - 1];
  const latestSMA20 = indicators.sma20[indicators.sma20.length - 1];
  const latestSMA50 = indicators.sma50[indicators.sma50.length - 1];
  const latestMACD = indicators.macd[indicators.macd.length - 1];
  const latestSignal = indicators.signal[indicators.signal.length - 1];
  
  let score = 50; // Neutral score
  const reasons: string[] = [];
  
  // RSI Analysis
  if (latestRSI < 30) {
    score += 15;
    reasons.push('RSI indicates oversold conditions');
  } else if (latestRSI > 70) {
    score -= 15;
    reasons.push('RSI indicates overbought conditions');
  }
  
  // Moving Average Analysis
  if (latestPrice > latestSMA20 && latestSMA20 > latestSMA50) {
    score += 10;
    reasons.push('Price above both moving averages (bullish trend)');
  } else if (latestPrice < latestSMA20 && latestSMA20 < latestSMA50) {
    score -= 10;
    reasons.push('Price below both moving averages (bearish trend)');
  }
  
  // MACD Analysis
  if (latestMACD > latestSignal) {
    score += 8;
    reasons.push('MACD above signal line (bullish momentum)');
  } else {
    score -= 8;
    reasons.push('MACD below signal line (bearish momentum)');
  }
  
  // Volume trend (simplified)
  const avgVolume = historicalData.slice(-10).reduce((sum, d) => sum + d.volume, 0) / 10;
  const latestVolume = historicalData[historicalData.length - 1].volume;
  if (latestVolume > avgVolume * 1.2) {
    score += 5;
    reasons.push('Above average trading volume');
  }
  
  let action: 'BUY' | 'SELL' | 'HOLD';
  let targetPrice: number;
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  
  if (score >= 65) {
    action = 'BUY';
    targetPrice = latestPrice * 1.15;
    riskLevel = latestRSI > 60 ? 'MEDIUM' : 'LOW';
  } else if (score <= 35) {
    action = 'SELL';
    targetPrice = latestPrice * 0.85;
    riskLevel = latestRSI < 40 ? 'MEDIUM' : 'HIGH';
  } else {
    action = 'HOLD';
    targetPrice = latestPrice;
    riskLevel = 'MEDIUM';
  }
  
  return {
    action,
    score,
    reasons,
    targetPrice,
    riskLevel
  };
};