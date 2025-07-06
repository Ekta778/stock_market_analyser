# 📈 Stock Market Analysis Tool - Streamlit Version

A professional stock market analysis application built with Streamlit, featuring real-time data visualization, technical indicators, and AI-powered investment recommendations.

## 🚀 Live Demo

Deploy this app instantly on Streamlit Cloud!

[![Open in Streamlit](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://share.streamlit.io/your-username/your-repo/main/streamlit_app.py)

## ✨ Features

### 📊 Core Functionality
- **Interactive Stock Analysis**: Real-time analysis of major stocks (AAPL, MSFT, GOOGL, TSLA, AMZN)
- **Technical Indicators**: RSI, MACD, Moving Averages (SMA 20/50)
- **AI-Powered Forecasting**: Linear regression-based price predictions
- **Investment Recommendations**: Automated BUY/SELL/HOLD suggestions with confidence scores
- **Multiple Timeframes**: 1M, 3M, 6M, 1Y analysis periods

### 🎨 User Experience
- **Professional UI**: Clean, modern interface with gradient styling
- **Interactive Charts**: Plotly-powered visualizations with zoom and hover features
- **Real-time Metrics**: Live updating of key financial indicators
- **Responsive Design**: Works perfectly on desktop and mobile devices

### 📈 Technical Analysis
- **RSI Analysis**: Momentum oscillator for overbought/oversold conditions
- **MACD Indicators**: Trend analysis with signal line crossovers
- **Moving Averages**: 20-day and 50-day trend indicators
- **Volume Analysis**: Trading volume patterns and trends
- **52-Week Range**: Visual price range with current position

## 🛠️ Technology Stack

- **Streamlit** - Web application framework
- **Pandas** - Data manipulation and analysis
- **NumPy** - Numerical computing
- **Plotly** - Interactive data visualization
- **Python 3.8+** - Core programming language

## 📁 Project Structure

```
streamlit-stock-analyzer/
├── streamlit_app.py          # Main application file
├── requirements.txt          # Python dependencies
├── README_STREAMLIT.md      # This file
└── .streamlit/
    └── config.toml          # Streamlit configuration (optional)
```

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/streamlit-stock-analyzer.git
   cd streamlit-stock-analyzer
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   streamlit run streamlit_app.py
   ```

4. **Open your browser**
   Navigate to `http://localhost:8501`

### Deploy on Streamlit Cloud

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Streamlit Cloud**
   - Go to [share.streamlit.io](https://share.streamlit.io)
   - Click "New app"
   - Connect your GitHub repository
   - Set main file path: `streamlit_app.py`
   - Click "Deploy"

3. **Your app will be live!**
   - Get a public URL like: `https://your-app-name.streamlit.app`
   - Share with anyone instantly

## 📊 Data Implementation

### Current Demo Data
The application uses **algorithmically generated realistic stock data** for demonstration:

- **Stock Universe**: AAPL, MSFT, GOOGL, TSLA, AMZN
- **Historical Simulation**: Realistic price movements with proper volatility
- **Technical Accuracy**: All indicators calculated using real financial formulas
- **Consistent Data**: Same symbol always generates identical historical patterns

### Data Generation Features
```python
# Realistic price simulation includes:
- 2% daily volatility
- Slight upward trend (0.03%)
- Proper OHLC relationships
- Volume correlation with price movements
- Consistent seed-based generation
```

### Integration with Real APIs

To connect with live data sources, replace the demo data generation with real API calls:

#### Option 1: Alpha Vantage
```python
import requests

API_KEY = 'your-alpha-vantage-key'
url = f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={API_KEY}'
response = requests.get(url)
data = response.json()
```

#### Option 2: Yahoo Finance (yfinance)
```python
import yfinance as yf

ticker = yf.Ticker(symbol)
hist = ticker.history(period="1y")
```

#### Option 3: Financial Modeling Prep
```python
import requests

API_KEY = 'your-fmp-key'
url = f'https://financialmodelingprep.com/api/v3/historical-price-full/{symbol}?apikey={API_KEY}'
```

## 🔧 Technical Analysis Algorithms

### RSI (Relative Strength Index)
```python
def calculate_rsi(prices, period=14):
    delta = prices.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi
```

### MACD (Moving Average Convergence Divergence)
```python
def calculate_macd(prices):
    exp1 = prices.ewm(span=12).mean()
    exp2 = prices.ewm(span=26).mean()
    macd = exp1 - exp2
    signal = macd.ewm(span=9).mean()
    histogram = macd - signal
    return macd, signal, histogram
```

### Investment Recommendation Engine
```python
def generate_recommendation(df, stock_data):
    score = 50  # Neutral baseline
    
    # RSI Analysis (±15 points)
    if rsi < 30: score += 15  # Oversold
    elif rsi > 70: score -= 15  # Overbought
    
    # Moving Average Analysis (±10 points)
    if price > sma20 > sma50: score += 10  # Bullish
    elif price < sma20 < sma50: score -= 10  # Bearish
    
    # MACD Analysis (±8 points)
    if macd > signal: score += 8  # Bullish momentum
    else: score -= 8  # Bearish momentum
    
    # Volume Analysis (±5 points)
    if volume > avg_volume * 1.2: score += 5
    
    return recommendation_based_on_score(score)
```

## 🎯 Features Breakdown

### 📊 Interactive Dashboard
- **Real-time Metrics**: Current price, change, volume, market cap
- **52-Week Range**: Visual progress bar showing price position
- **Technical Indicators**: RSI, MACD, Moving Averages with status
- **Investment Recommendation**: AI-powered BUY/SELL/HOLD with confidence

### 📈 Advanced Charting
- **Price Charts**: Candlestick-style with moving averages overlay
- **Technical Indicators**: Separate RSI subplot with overbought/oversold levels
- **Volume Analysis**: Bar chart showing trading volume patterns
- **AI Forecasting**: Optional 30-day price prediction overlay

### 🎨 Professional Styling
- **Gradient Design**: Modern CSS with professional color schemes
- **Responsive Layout**: Optimized for all screen sizes
- **Interactive Elements**: Hover effects and smooth transitions
- **Status Indicators**: Color-coded metrics and recommendations

## 🚀 Deployment Options

### Streamlit Cloud (Recommended)
- **Free hosting** for public repositories
- **Automatic deployments** from GitHub
- **Custom domains** available
- **Built-in authentication** options

### Heroku
```bash
# Create Procfile
echo "web: streamlit run streamlit_app.py --server.port=$PORT --server.address=0.0.0.0" > Procfile

# Deploy
heroku create your-app-name
git push heroku main
```

### Docker
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8501

CMD ["streamlit", "run", "streamlit_app.py"]
```

## 🔮 Future Enhancements

### Phase 1: Data Integration
- [ ] Real-time API integration (Alpha Vantage, Yahoo Finance)
- [ ] Extended stock universe (international markets)
- [ ] Cryptocurrency support
- [ ] Economic indicators integration

### Phase 2: Advanced Analytics
- [ ] Bollinger Bands and additional indicators
- [ ] Candlestick pattern recognition
- [ ] Portfolio tracking and optimization
- [ ] Risk management tools

### Phase 3: AI & Machine Learning
- [ ] LSTM neural networks for forecasting
- [ ] Sentiment analysis from news/social media
- [ ] Anomaly detection algorithms
- [ ] Custom trading strategies

### Phase 4: User Features
- [ ] User authentication and profiles
- [ ] Watchlists and alerts
- [ ] Custom dashboard layouts
- [ ] PDF report generation

## 📝 Configuration

### Streamlit Configuration
Create `.streamlit/config.toml`:

```toml
[theme]
primaryColor = "#667eea"
backgroundColor = "#ffffff"
secondaryBackgroundColor = "#f0f2f6"
textColor = "#262730"

[server]
maxUploadSize = 200
enableCORS = false
enableXsrfProtection = false
```

### Environment Variables
For production deployment with real APIs:

```bash
# .env file
ALPHA_VANTAGE_API_KEY=your_api_key_here
YAHOO_FINANCE_API_KEY=your_api_key_here
FINNHUB_API_KEY=your_api_key_here
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 style guidelines
- Add docstrings to all functions
- Include type hints where appropriate
- Test with multiple stock symbols
- Ensure responsive design

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Streamlit** for the amazing web app framework
- **Plotly** for interactive visualizations
- **Pandas** for data manipulation capabilities
- **NumPy** for numerical computing

## 📞 Support

- **Documentation**: [Streamlit Docs](https://docs.streamlit.io)
- **Community**: [Streamlit Forum](https://discuss.streamlit.io)
- **Issues**: [GitHub Issues](https://github.com/your-username/your-repo/issues)

---

**⚠️ Disclaimer**: This application is for educational and demonstration purposes only. The data used is simulated and should not be used for actual investment decisions. Always consult with financial professionals before making investment choices.