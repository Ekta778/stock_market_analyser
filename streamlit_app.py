import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import plotly.express as px
from datetime import datetime, timedelta
import time

# Page configuration
st.set_page_config(
    page_title="📈 Stock Market Analysis Tool",
    page_icon="📈",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        text-align: center;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 2rem;
    }
    
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin: 0.5rem 0;
    }
    
    .recommendation-buy {
        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
        padding: 1rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        font-weight: bold;
    }
    
    .recommendation-sell {
        background: linear-gradient(135deg, #f44336 0%, #da190b 100%);
        padding: 1rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        font-weight: bold;
    }
    
    .recommendation-hold {
        background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
        padding: 1rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        font-weight: bold;
    }
    
    .sidebar .sidebar-content {
        background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
    }
</style>
""", unsafe_allow_html=True)

# Demo stock data
DEMO_STOCKS = {
    'AAPL': {
        'name': 'Apple Inc.',
        'price': 178.25,
        'change': 2.34,
        'change_percent': 1.33,
        'volume': 45234567,
        'market_cap': 2800000000000,
        'pe_ratio': 28.5,
        'high_52w': 198.23,
        'low_52w': 124.17
    },
    'MSFT': {
        'name': 'Microsoft Corporation',
        'price': 378.85,
        'change': -1.22,
        'change_percent': -0.32,
        'volume': 23456789,
        'market_cap': 2820000000000,
        'pe_ratio': 32.1,
        'high_52w': 384.30,
        'low_52w': 245.61
    },
    'GOOGL': {
        'name': 'Alphabet Inc.',
        'price': 138.93,
        'change': 3.45,
        'change_percent': 2.55,
        'volume': 34567890,
        'market_cap': 1750000000000,
        'pe_ratio': 25.8,
        'high_52w': 153.78,
        'low_52w': 102.21
    },
    'TSLA': {
        'name': 'Tesla, Inc.',
        'price': 248.50,
        'change': -8.75,
        'change_percent': -3.40,
        'volume': 67890123,
        'market_cap': 790000000000,
        'pe_ratio': 78.2,
        'high_52w': 299.29,
        'low_52w': 138.80
    },
    'AMZN': {
        'name': 'Amazon.com Inc.',
        'price': 145.86,
        'change': 1.23,
        'change_percent': 0.85,
        'volume': 28456789,
        'market_cap': 1520000000000,
        'pe_ratio': 45.3,
        'high_52w': 170.00,
        'low_52w': 118.35
    }
}

def generate_historical_data(symbol, days=365):
    """Generate realistic historical stock data"""
    np.random.seed(hash(symbol) % 2**32)  # Consistent data for same symbol
    
    base_price = DEMO_STOCKS[symbol]['price']
    current_price = base_price * 0.8  # Start from 80% of current price
    
    dates = pd.date_range(end=datetime.now(), periods=days, freq='D')
    data = []
    
    for date in dates:
        # Simulate realistic price movement
        volatility = 0.02  # 2% daily volatility
        trend = 0.0003  # Slight upward trend
        change = np.random.normal(trend, volatility)
        
        current_price = max(current_price * (1 + change), 1)
        
        open_price = current_price
        high_price = open_price * (1 + np.random.uniform(0, 0.03))
        low_price = open_price * (1 - np.random.uniform(0, 0.03))
        close_price = low_price + np.random.uniform(0, 1) * (high_price - low_price)
        volume = np.random.randint(10000000, 50000000)
        
        data.append({
            'Date': date,
            'Open': round(open_price, 2),
            'High': round(high_price, 2),
            'Low': round(low_price, 2),
            'Close': round(close_price, 2),
            'Volume': volume
        })
        
        current_price = close_price
    
    return pd.DataFrame(data)

def calculate_technical_indicators(df):
    """Calculate technical indicators"""
    # Simple Moving Averages
    df['SMA_20'] = df['Close'].rolling(window=20).mean()
    df['SMA_50'] = df['Close'].rolling(window=50).mean()
    
    # RSI
    delta = df['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss
    df['RSI'] = 100 - (100 / (1 + rs))
    
    # MACD
    exp1 = df['Close'].ewm(span=12).mean()
    exp2 = df['Close'].ewm(span=26).mean()
    df['MACD'] = exp1 - exp2
    df['MACD_Signal'] = df['MACD'].ewm(span=9).mean()
    df['MACD_Histogram'] = df['MACD'] - df['MACD_Signal']
    
    return df

def generate_investment_recommendation(df, stock_data):
    """Generate investment recommendation based on technical analysis"""
    latest_rsi = df['RSI'].iloc[-1]
    latest_price = df['Close'].iloc[-1]
    latest_sma20 = df['SMA_20'].iloc[-1]
    latest_sma50 = df['SMA_50'].iloc[-1]
    latest_macd = df['MACD'].iloc[-1]
    latest_signal = df['MACD_Signal'].iloc[-1]
    
    score = 50  # Neutral score
    reasons = []
    
    # RSI Analysis
    if latest_rsi < 30:
        score += 15
        reasons.append("RSI indicates oversold conditions (bullish)")
    elif latest_rsi > 70:
        score -= 15
        reasons.append("RSI indicates overbought conditions (bearish)")
    
    # Moving Average Analysis
    if latest_price > latest_sma20 and latest_sma20 > latest_sma50:
        score += 10
        reasons.append("Price above both moving averages (bullish trend)")
    elif latest_price < latest_sma20 and latest_sma20 < latest_sma50:
        score -= 10
        reasons.append("Price below both moving averages (bearish trend)")
    
    # MACD Analysis
    if latest_macd > latest_signal:
        score += 8
        reasons.append("MACD above signal line (bullish momentum)")
    else:
        score -= 8
        reasons.append("MACD below signal line (bearish momentum)")
    
    # Volume analysis
    avg_volume = df['Volume'].tail(10).mean()
    latest_volume = df['Volume'].iloc[-1]
    if latest_volume > avg_volume * 1.2:
        score += 5
        reasons.append("Above average trading volume")
    
    # Determine recommendation
    if score >= 65:
        action = "BUY"
        target_price = latest_price * 1.15
        risk_level = "MEDIUM" if latest_rsi > 60 else "LOW"
    elif score <= 35:
        action = "SELL"
        target_price = latest_price * 0.85
        risk_level = "HIGH" if latest_rsi < 40 else "MEDIUM"
    else:
        action = "HOLD"
        target_price = latest_price
        risk_level = "MEDIUM"
    
    return {
        'action': action,
        'score': score,
        'target_price': target_price,
        'risk_level': risk_level,
        'reasons': reasons
    }

def format_currency(value):
    """Format number as currency"""
    return f"${value:,.2f}"

def format_number(value):
    """Format large numbers with suffixes"""
    if value >= 1e12:
        return f"${value/1e12:.2f}T"
    elif value >= 1e9:
        return f"${value/1e9:.2f}B"
    elif value >= 1e6:
        return f"${value/1e6:.2f}M"
    elif value >= 1e3:
        return f"${value/1e3:.2f}K"
    return f"${value:,.0f}"

# Main app
def main():
    # Header
    st.markdown('<h1 class="main-header">📈 Stock Market Analysis Tool</h1>', unsafe_allow_html=True)
    st.markdown("### Professional trading insights & AI-powered forecasting")
    
    # Sidebar
    with st.sidebar:
        st.header("🔍 Stock Selection")
        
        selected_symbol = st.selectbox(
            "Choose a stock:",
            options=list(DEMO_STOCKS.keys()),
            format_func=lambda x: f"{x} - {DEMO_STOCKS[x]['name']}"
        )
        
        st.header("📊 Analysis Options")
        
        time_period = st.selectbox(
            "Time Period:",
            options=['1M', '3M', '6M', '1Y'],
            index=3
        )
        
        period_days = {'1M': 30, '3M': 90, '6M': 180, '1Y': 365}
        days = period_days[time_period]
        
        show_forecast = st.checkbox("Show AI Forecast", value=False)
        show_volume = st.checkbox("Show Volume", value=True)
        
        st.header("ℹ️ About")
        st.info("""
        This is a demo version using simulated data. 
        
        **Features:**
        - Real-time stock analysis
        - Technical indicators
        - AI-powered forecasting
        - Investment recommendations
        """)
    
    # Get stock data
    stock_data = DEMO_STOCKS[selected_symbol]
    df = generate_historical_data(selected_symbol, days)
    df = calculate_technical_indicators(df)
    
    # Main content
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown(f"""
        <div class="metric-card">
            <h3>{format_currency(stock_data['price'])}</h3>
            <p>Current Price</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        change_color = "🟢" if stock_data['change'] >= 0 else "🔴"
        st.markdown(f"""
        <div class="metric-card">
            <h3>{change_color} {stock_data['change']:+.2f}</h3>
            <p>Change ({stock_data['change_percent']:+.2f}%)</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"""
        <div class="metric-card">
            <h3>{format_number(stock_data['volume'])}</h3>
            <p>Volume</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown(f"""
        <div class="metric-card">
            <h3>{format_number(stock_data['market_cap'])}</h3>
            <p>Market Cap</p>
        </div>
        """, unsafe_allow_html=True)
    
    # Stock details
    st.subheader(f"📊 {selected_symbol} - {stock_data['name']}")
    
    # Price chart
    fig = make_subplots(
        rows=3 if show_volume else 2,
        cols=1,
        shared_xaxes=True,
        vertical_spacing=0.05,
        subplot_titles=('Price Chart', 'Technical Indicators', 'Volume' if show_volume else None),
        row_heights=[0.6, 0.3, 0.1] if show_volume else [0.7, 0.3]
    )
    
    # Price and moving averages
    fig.add_trace(
        go.Scatter(x=df['Date'], y=df['Close'], name='Close Price', line=dict(color='#1f77b4', width=2)),
        row=1, col=1
    )
    fig.add_trace(
        go.Scatter(x=df['Date'], y=df['SMA_20'], name='SMA 20', line=dict(color='#ff7f0e', width=1)),
        row=1, col=1
    )
    fig.add_trace(
        go.Scatter(x=df['Date'], y=df['SMA_50'], name='SMA 50', line=dict(color='#2ca02c', width=1)),
        row=1, col=1
    )
    
    # Forecast (if enabled)
    if show_forecast:
        # Simple linear forecast
        last_prices = df['Close'].tail(30).values
        trend = np.polyfit(range(len(last_prices)), last_prices, 1)[0]
        last_price = df['Close'].iloc[-1]
        
        forecast_days = 30
        forecast_dates = pd.date_range(start=df['Date'].iloc[-1] + timedelta(days=1), periods=forecast_days, freq='D')
        forecast_prices = [last_price + trend * i for i in range(1, forecast_days + 1)]
        
        fig.add_trace(
            go.Scatter(
                x=forecast_dates, 
                y=forecast_prices, 
                name='AI Forecast', 
                line=dict(color='#d62728', width=2, dash='dash')
            ),
            row=1, col=1
        )
    
    # RSI
    fig.add_trace(
        go.Scatter(x=df['Date'], y=df['RSI'], name='RSI', line=dict(color='purple')),
        row=2, col=1
    )
    fig.add_hline(y=70, line_dash="dash", line_color="red", row=2, col=1)
    fig.add_hline(y=30, line_dash="dash", line_color="green", row=2, col=1)
    
    # Volume
    if show_volume:
        fig.add_trace(
            go.Bar(x=df['Date'], y=df['Volume'], name='Volume', marker_color='lightblue'),
            row=3, col=1
        )
    
    fig.update_layout(
        height=800,
        title=f"{selected_symbol} Stock Analysis ({time_period})",
        showlegend=True,
        template="plotly_white"
    )
    
    fig.update_xaxes(title_text="Date", row=3 if show_volume else 2, col=1)
    fig.update_yaxes(title_text="Price ($)", row=1, col=1)
    fig.update_yaxes(title_text="RSI", row=2, col=1, range=[0, 100])
    if show_volume:
        fig.update_yaxes(title_text="Volume", row=3, col=1)
    
    st.plotly_chart(fig, use_container_width=True)
    
    # Technical Analysis and Recommendation
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.subheader("📈 Technical Indicators")
        
        latest_rsi = df['RSI'].iloc[-1]
        latest_macd = df['MACD'].iloc[-1]
        latest_signal = df['MACD_Signal'].iloc[-1]
        
        # RSI Status
        if latest_rsi < 30:
            rsi_status = "🟢 Oversold"
            rsi_color = "green"
        elif latest_rsi > 70:
            rsi_status = "🔴 Overbought"
            rsi_color = "red"
        else:
            rsi_status = "🟡 Neutral"
            rsi_color = "orange"
        
        st.metric("RSI (14)", f"{latest_rsi:.1f}", rsi_status)
        
        # MACD Status
        macd_trend = "🟢 Bullish" if latest_macd > latest_signal else "🔴 Bearish"
        st.metric("MACD", f"{latest_macd:.3f}", macd_trend)
        
        # Moving Averages
        st.metric("SMA 20", f"{df['SMA_20'].iloc[-1]:.2f}")
        st.metric("SMA 50", f"{df['SMA_50'].iloc[-1]:.2f}")
        
        # 52-week range
        price_position = ((stock_data['price'] - stock_data['low_52w']) / 
                         (stock_data['high_52w'] - stock_data['low_52w'])) * 100
        
        st.subheader("📊 52-Week Range")
        st.progress(price_position / 100)
        st.write(f"**Low:** {format_currency(stock_data['low_52w'])} | **High:** {format_currency(stock_data['high_52w'])}")
        st.write(f"**Position:** {price_position:.1f}% of range")
    
    with col2:
        st.subheader("🎯 AI Investment Recommendation")
        
        recommendation = generate_investment_recommendation(df, stock_data)
        
        # Recommendation display
        if recommendation['action'] == 'BUY':
            st.markdown(f"""
            <div class="recommendation-buy">
                <h2>🟢 {recommendation['action']}</h2>
                <p>Confidence Score: {recommendation['score']}/100</p>
            </div>
            """, unsafe_allow_html=True)
        elif recommendation['action'] == 'SELL':
            st.markdown(f"""
            <div class="recommendation-sell">
                <h2>🔴 {recommendation['action']}</h2>
                <p>Confidence Score: {recommendation['score']}/100</p>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div class="recommendation-hold">
                <h2>🟡 {recommendation['action']}</h2>
                <p>Confidence Score: {recommendation['score']}/100</p>
            </div>
            """, unsafe_allow_html=True)
        
        st.metric("Target Price", format_currency(recommendation['target_price']))
        st.metric("Risk Level", recommendation['risk_level'])
        
        st.subheader("📋 Analysis Summary")
        for reason in recommendation['reasons']:
            st.write(f"• {reason}")
    
    # Additional metrics
    st.subheader("📊 Key Metrics")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("P/E Ratio", f"{stock_data['pe_ratio']:.1f}")
    
    with col2:
        volatility = df['Close'].pct_change().std() * np.sqrt(252) * 100
        st.metric("Volatility (Annual)", f"{volatility:.1f}%")
    
    with col3:
        returns = ((df['Close'].iloc[-1] / df['Close'].iloc[0]) - 1) * 100
        st.metric(f"Returns ({time_period})", f"{returns:+.1f}%")
    
    with col4:
        avg_volume = df['Volume'].mean()
        st.metric("Avg Volume", format_number(avg_volume))
    
    # Footer
    st.markdown("---")
    st.markdown("""
    <div style='text-align: center; color: #666;'>
        <p>📊 Stock Market Analysis Tool | Demo Version with Simulated Data</p>
        <p>⚠️ This is for educational purposes only. Not financial advice.</p>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()