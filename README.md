# 📈 Stock Market Analysis Tool

A modern, responsive web application for comprehensive stock market analysis featuring real-time data visualization, technical indicators, and AI-powered forecasting capabilities.

![Stock Market Analysis Tool](https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## 🚀 Live Demo

[View Live Application](https://your-app-url.netlify.app) *(Replace with your actual deployment URL)*

## ✨ Features

### 📊 Core Functionality
- **Real-time Stock Search**: Search and analyze any stock symbol
- **Interactive Charts**: Dynamic price charts with multiple timeframes (5D, 1M, 3M, 1Y)
- **Technical Analysis**: RSI, MACD, Moving Averages (SMA 20/50)
- **AI-Powered Forecasting**: Predictive price modeling with confidence intervals
- **Investment Recommendations**: Automated BUY/SELL/HOLD suggestions with risk assessment

### 🎨 User Experience
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Professional UI**: Apple-level design aesthetics with smooth animations
- **Real-time Updates**: Live data refresh with visual indicators

### 📈 Technical Indicators
- **RSI (Relative Strength Index)**: Momentum oscillator for overbought/oversold conditions
- **MACD**: Moving Average Convergence Divergence for trend analysis
- **Simple Moving Averages**: 20-day and 50-day trend indicators
- **Volume Analysis**: Trading volume trends and patterns
- **52-Week Range**: Visual price range indicators

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling framework
- **Vite** - Fast build tool and development server

### Data Visualization
- **Recharts** - Responsive chart library
- **Lucide React** - Beautiful icon system

### Development Tools
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Dashboard.tsx    # Main dashboard layout
│   ├── StockChart.tsx   # Interactive price charts
│   ├── StockDetails.tsx # Stock information display
│   ├── StockSearch.tsx  # Search functionality
│   └── TechnicalAnalysis.tsx # Technical indicators
├── types/               # TypeScript type definitions
│   └── stock.ts        # Stock data interfaces
├── utils/              # Utility functions
│   ├── stockApi.ts     # Data fetching and formatting
│   └── technicalAnalysis.ts # Technical calculations
├── App.tsx             # Root component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stock-market-analysis-tool.git
   cd stock-market-analysis-tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📊 Data Sources & Implementation

### Current Implementation (Demo Mode)
The application currently uses **simulated data** for demonstration purposes:

- **Demo Stocks**: Pre-configured data for AAPL, MSFT, GOOGL, TSLA
- **Historical Data**: Algorithmically generated realistic price movements
- **Technical Indicators**: Calculated using actual financial formulas
- **Forecasting**: Linear regression-based predictions

### Data Generation Algorithm
```typescript
// Realistic price simulation with:
- 2% daily volatility
- Slight upward trend (0.03%)
- Random walk with bounds
- Volume correlation with price movements
```

### Integration with Real APIs
To connect with live data sources, replace the demo functions in `src/utils/stockApi.ts`:

#### Option 1: Alpha Vantage
```typescript
const API_KEY = 'your-alpha-vantage-key';
const BASE_URL = 'https://www.alphavantage.co/query';

export const getStockData = async (symbol: string) => {
  const response = await fetch(
    `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
  );
  return response.json();
};
```

#### Option 2: Yahoo Finance (via RapidAPI)
```typescript
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'your-rapidapi-key',
    'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
  }
};
```

#### Option 3: Finnhub
```typescript
const FINNHUB_TOKEN = 'your-finnhub-token';
const BASE_URL = 'https://finnhub.io/api/v1';
```

## 🔧 Technical Analysis Algorithms

### RSI (Relative Strength Index)
```typescript
RSI = 100 - (100 / (1 + RS))
RS = Average Gain / Average Loss
```

### MACD (Moving Average Convergence Divergence)
```typescript
MACD Line = EMA(12) - EMA(26)
Signal Line = EMA(9) of MACD Line
Histogram = MACD Line - Signal Line
```

### Simple Moving Average
```typescript
SMA = (Sum of closing prices over n periods) / n
```

### Forecasting Model
- **Linear Regression**: Trend analysis using least squares method
- **Confidence Intervals**: Decreasing confidence over time
- **Volatility Adjustment**: Based on historical price movements

## 🎯 Investment Recommendation Engine

The application generates automated investment recommendations based on:

### Scoring Algorithm
- **RSI Analysis**: +15 points for oversold, -15 for overbought
- **Moving Averages**: +10 points for bullish cross, -10 for bearish
- **MACD Signals**: +8 points for bullish momentum, -8 for bearish
- **Volume Trends**: +5 points for above-average volume

### Risk Assessment
- **LOW**: RSI < 60, stable trends
- **MEDIUM**: Mixed signals, moderate volatility
- **HIGH**: RSI > 60, conflicting indicators

## 🚀 Deployment

### Netlify (Recommended)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure custom domain (optional)

### Vercel
1. Connect your GitHub repository
2. Vercel will auto-detect Vite configuration
3. Deploy with zero configuration

### Manual Deployment
1. Run `npm run build`
2. Upload `dist` folder contents to your web server
3. Configure server for SPA routing

## 🔮 Future Enhancements

### Phase 1: Data Integration
- [ ] Real-time API integration (Alpha Vantage, Yahoo Finance)
- [ ] WebSocket connections for live updates
- [ ] Extended stock universe (international markets)
- [ ] Cryptocurrency support

### Phase 2: Advanced Analytics
- [ ] Bollinger Bands and additional indicators
- [ ] Candlestick pattern recognition
- [ ] Portfolio tracking and management
- [ ] Options chain analysis

### Phase 3: AI & Machine Learning
- [ ] LSTM neural networks for forecasting
- [ ] Sentiment analysis from news/social media
- [ ] Anomaly detection algorithms
- [ ] Risk management tools

### Phase 4: User Features
- [ ] User authentication and profiles
- [ ] Watchlists and alerts
- [ ] Custom dashboard layouts
- [ ] Export capabilities (PDF reports)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain component modularity
- Write descriptive commit messages
- Add tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Recharts** for excellent charting capabilities
- **Tailwind CSS** for rapid UI development
- **Lucide React** for beautiful icons
- **Vite** for lightning-fast development experience

## 📞 Support

For support, email your-email@example.com or create an issue in the GitHub repository.

---

**Built with ❤️ using React, TypeScript, and modern web technologies**

![GitHub stars](https://img.shields.io/github/stars/yourusername/stock-market-analysis-tool?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/stock-market-analysis-tool?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/stock-market-analysis-tool)
![GitHub license](https://img.shields.io/github/license/yourusername/stock-market-analysis-tool)