#!/bin/bash

echo "🚀 Setting up environment variables for Agri-Hub XL"
echo "=================================================="

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ .env.local already exists"
    echo "📝 Current API key configuration:"
    grep "PLANT_ID_API_KEY" .env.local
else
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ .env.local created from .env.example"
fi

echo ""
echo "🔑 API Key Configuration:"
echo "   NEXT_PUBLIC_PLANT_ID_API_KEY=Mya5fMP8BBNyEHyixcUUACTISK2QlGk1jNWRfkEc9nYN8TNUTd"
echo "   PLANT_ID_API_KEY=Mya5fMP8BBNyEHyixcUUACTISK2QlGk1jNWRfkEc9nYN8TNUTd"
echo "   PLANT_ID_API_URL=https://plant.id/api/v3"
echo ""
echo "✅ Environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Start the development server: npm run dev"
echo "   2. Test photo upload: http://localhost:3000/test-upload-simple"
echo "   3. View crop analysis: http://localhost:3000/crop-analysis-report"
echo ""