import streamlit as st
import pandas as pd
from functions import download_data, plot_closing_price, plot_volume, plot_moving_averages

# Page Config
st.set_page_config(page_title="📊 Stock Market Analyzer", layout="centered")

# Custom CSS for styling like Netlify page
st.markdown("""
    <style>
    .main {
        background-color: #f5f7fa;
        padding: 2rem;
        border-radius: 1rem;
        max-width: 900px;
        margin: auto;
        box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }
    h1 {
        text-align: center;
        color: #2b2d42;
    }
    </style>
""", unsafe_allow_html=True)

with st.container():
    st.markdown('<div class="main">', unsafe_allow_html=True)
    st.markdown("<h1>📊 Stock Market Analyzer</h1>", unsafe_allow_html=True)

    ticker = st.text_input("Enter Stock Ticker Symbol (e.g., AAPL, TSLA)", "AAPL")
    start_date = st.date_input("Start Date", pd.to_datetime("2022-01-01"))
    end_date = st.date_input("End Date", pd.to_datetime("2023-01-01"))

    if st.button("🔍 Analyze"):
        data = download_data(ticker, start_date, end_date)

        if data is not None and not data.empty:
            st.subheader("📈 Closing Price")
            plot_closing_price(data, ticker)

            st.subheader("📉 Volume")
            plot_volume(data, ticker)

            st.subheader("🔁 Moving Averages")
            plot_moving_averages(data, ticker)
        else:
            st.warning("⚠️ No data found for given ticker and date range.")
    st.markdown("</div>", unsafe_allow_html=True)

