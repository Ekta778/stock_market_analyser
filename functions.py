# functions.py

import yfinance as yf
import matplotlib.pyplot as plt
import streamlit as st

def download_data(ticker, start_date, end_date):
    try:
        data = yf.download(ticker, start=start_date, end=end_date)
        return data
    except Exception as e:
        st.error(f"Error downloading data: {e}")
        return None

def plot_closing_price(data, ticker):
    fig, ax = plt.subplots()
    ax.plot(data['Close'], label='Closing Price')
    ax.set_title(f"{ticker} Closing Price")
    ax.set_xlabel("Date")
    ax.set_ylabel("Price")
    ax.legend()
    st.pyplot(fig)

def plot_volume(data, ticker):
    fig, ax = plt.subplots()
    ax.bar(data.index, data['Volume'], color='orange')
    ax.set_title(f"{ticker} Volume")
    ax.set_xlabel("Date")
    ax.set_ylabel("Volume")
    st.pyplot(fig)

def plot_moving_averages(data, ticker):
    data['MA20'] = data['Close'].rolling(window=20).mean()
    data['MA50'] = data['Close'].rolling(window=50).mean()

    fig, ax = plt.subplots()
    ax.plot(data['Close'], label='Closing Price', color='blue')
    ax.plot(data['MA20'], label='20-Day MA', color='green')
    ax.plot(data['MA50'], label='50-Day MA', color='red')
    ax.set_title(f"{ticker} Moving Averages")
    ax.set_xlabel("Date")
    ax.set_ylabel("Price")
    ax.legend()
    st.pyplot(fig)
