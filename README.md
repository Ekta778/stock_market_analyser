# 📈 **Stock Market Analyser**

An interactive frontend-based tool to analyze and visualize 5 years of historical stock performance. Built using **Vite**, **TypeScript**, and **Tailwind CSS**, the project uses manually downloaded data from **Yahoo Finance** stored as CSV files. The app is fully responsive and deployed live using **Netlify**.

---

## 🔗 **Live Demo**

👉 [https://stockmarketsanalyzer.netlify.app](https://stockmarketsanalyzer.netlify.app)

---

## 🧰 **Tech Stack**

- **Frontend:** Vite, TypeScript, Tailwind CSS, HTML
- **Data Handling (Optional):** Python, Pandas
- **Deployment:** Netlify

---

## 📊 **Features**

- Visualizes stock data: **Open, High, Low, Close, Volume, Adjusted Close**
- Displays charts for **10+ stocks** over a **5-year** period
- Applies **Simple Moving Averages (SMA)** and basic **Volatility indicators**
- Clean, responsive UI with filters for **stock symbol** and **date range**
- Hosted live with **Netlify** for fast access

---

## 📥 **Data Source**

- Historical stock data is **manually downloaded from [Yahoo Finance](https://finance.yahoo.com/)**.
- Stored locally in the `/data/` directory as CSV files.
- Each file contains:
  - Daily Open, High, Low, Close, Adjusted Close, and Volume data

> ✅ **Optional Python Script to Fetch Automatically**:
> ```python
> import yfinance as yf
> df = yf.download('AAPL', start='2019-01-01', end='2024-12-31')
> df.to_csv('data/AAPL.csv')
> ```

---

## 📁 **Project Structure**

├── src/ # Frontend code (Vite + TypeScript)

├── data/ # CSV stock data files

├── app.py (optional) # Python script to preprocess data

├── requirements.txt # Python dependencies

├── package.json # Frontend dependencies

├── tailwind.config.js # Tailwind CSS config

├── vite.config.ts # Vite config

├── index.html # App entry point

└── README.md # Project documentation



---

## 💻 **Local Setup Instructions**

### ✅ **Frontend Setup (Vite + Tailwind)**

```bash
git clone https://github.com/Ekta778/stock_market_analyser.git
cd stock_market_analyser

npm install
npm run dev

### 🐍 Python Setup (Optional - For local CSV processing)

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Python script (if any)
streamlit run app.py

