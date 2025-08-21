#!/bin/bash

echo "🚀 Setting up environment variables for Agri-Hub XL"
echo "=================================================="

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ .env.local already exists"
    echo "📝 Current API key configuration (Gemini):"
    grep "GOOGLE_API_KEY" .env.local
else
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ .env.local created from .env.example"
fi

echo ""
echo "🔑 API Key Configuration:"
echo "   GOOGLE_API_KEY=your_api_key_here"
echo ""
echo "✅ Environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Start the development server: npm run dev"
echo "   2. Test photo upload: http://localhost:3000/test-upload-simple"
echo "   3. View crop analysis: http://localhost:3000/crop-analysis-report"
echo ""