import streamlit as st
import pandas as pd
from functions import download_data, plot_closing_price, plot_volume, plot_moving_averages

st.set_page_config(page_title="Stock Market Analyzer", layout="wide")

st.title("📊 Stock Market Analyzer")

ticker = st.text_input("Enter Stock Ticker Symbol", "AAPL")
start_date = st.date_input("Start Date", pd.to_datetime("2022-01-01"))
end_date = st.date_input("End Date", pd.to_datetime("2023-01-01"))

if st.button("Analyze"):
    data = download_data(ticker, start_date, end_date)

    if data is not None and not data.empty:
        st.subheader("📈 Closing Price")
        plot_closing_price(data, ticker)

        st.subheader("📉 Volume")
        plot_volume(data, ticker)

        st.subheader("🔁 Moving Averages")
        plot_moving_averages(data, ticker)
    else:
        st.warning("No data available for the selected period.")
