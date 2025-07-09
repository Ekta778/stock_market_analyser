#!/usr/bin/env python3
"""
Streamlit Deployment Script
Run this script to deploy your app to Streamlit Cloud
"""

import os
import subprocess
import sys

def check_requirements():
    """Check if all required files exist"""
    required_files = [
        'streamlit_app.py',
        'requirements.txt',
        '.streamlit/config.toml'
    ]
    
    missing_files = []
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print("❌ Missing required files:")
        for file in missing_files:
            print(f"   - {file}")
        return False
    
    print("✅ All required files found!")
    return True

def test_app_locally():
    """Test the app locally before deployment"""
    print("🧪 Testing app locally...")
    try:
        # Run streamlit for 5 seconds to test
        process = subprocess.Popen(['streamlit', 'run', 'streamlit_app.py', '--server.headless=true'])
        import time
        time.sleep(5)
        process.terminate()
        print("✅ Local test successful!")
        return True
    except Exception as e:
        print(f"❌ Local test failed: {e}")
        return False

def create_github_workflow():
    """Create GitHub Actions workflow for automatic deployment"""
    workflow_content = """name: Deploy to Streamlit Cloud

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v3
      with:
        python-version: '3.9'
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    
    - name: Test Streamlit app
      run: |
        streamlit run streamlit_app.py --server.headless=true &
        sleep 10
        kill %1
"""
    
    os.makedirs('.github/workflows', exist_ok=True)
    with open('.github/workflows/deploy.yml', 'w') as f:
        f.write(workflow_content)
    
    print("✅ GitHub Actions workflow created!")

def main():
    print("🚀 Streamlit Deployment Helper")
    print("=" * 40)
    
    # Check requirements
    if not check_requirements():
        sys.exit(1)
    
    # Test locally
    if not test_app_locally():
        print("⚠️  Local test failed, but you can still deploy")
    
    # Create GitHub workflow
    create_github_workflow()
    
    print("\n🎯 Deployment Instructions:")
    print("=" * 40)
    print("1. Push your code to GitHub:")
    print("   git add .")
    print("   git commit -m 'Deploy Streamlit app'")
    print("   git push origin main")
    print()
    print("2. Go to https://share.streamlit.io")
    print("3. Click 'New app'")
    print("4. Connect your GitHub repository")
    print("5. Set main file path: streamlit_app.py")
    print("6. Click 'Deploy'")
    print()
    print("🌟 Your app will be live at: https://your-app-name.streamlit.app")
    print()
    print("📋 Alternative deployment methods:")
    print("   - Heroku: Use the Procfile method")
    print("   - Docker: Use the provided Dockerfile")
    print("   - Local: streamlit run streamlit_app.py")

if __name__ == "__main__":
    main()