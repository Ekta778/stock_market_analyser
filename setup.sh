#!/bin/bash

# Streamlit Cloud Setup Script
echo "🚀 Setting up Streamlit deployment..."

# Create necessary directories
mkdir -p .streamlit

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Test the application
echo "🧪 Testing application..."
streamlit run streamlit_app.py --server.headless=true &
STREAMLIT_PID=$!

# Wait for app to start
sleep 10

# Kill the test process
kill $STREAMLIT_PID

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Push to GitHub: git add . && git commit -m 'Deploy app' && git push"
echo "2. Go to https://share.streamlit.io"
echo "3. Connect your repository"
echo "4. Deploy!"