# 📊 Stock Market Analyser

A Python-based web app that allows users to analyze stock market data, view quarterly results, and read the latest news for publicly traded companies.

---

## 🔍 Features

- 🔎 Real-time stock symbol search
- 📈 View latest stock prices, volume, and percentage changes
- 📊 Analyze quarterly financial results
- 📰 Read the latest financial news related to a specific stock
- ☁️ Deployable to platforms like Hugging Face Spaces, Render, or Netlify

---

## ⚙️ Tech Stack

- Python
- Streamlit (Web UI)
- YFinance / Financial Modeling Prep API
- Requests & JSON
- HTML + CSS (injected styles)

---

---

## 🚀 How to Run Locally

```bash
git clone https://github.com/yourusername/stock_market_analyser.git
cd stock_market_analyser

# (Optional) Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the app
streamlit run app.py

