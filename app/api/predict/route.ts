import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Mock disease prediction model - in production, this would use a real ML model
const mockDiseasePredictor = async (imagePath: string) => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Mock disease types and their treatments
  const diseases = [
    {
      name: "Early Blight",
      confidence: 0.87,
      description: "A fungal disease affecting tomato and potato plants",
      symptoms: "Dark brown spots with concentric rings on leaves",
      treatment: "Remove infected leaves, apply copper-based fungicide, improve air circulation",
      fertilizer: "Balanced NPK fertilizer (10-10-10) at 2-3 lbs per 100 sq ft",
      severity: "Medium",
      prevention: "Avoid overhead watering, maintain plant spacing, rotate crops"
    },
    {
      name: "Late Blight",
      confidence: 0.92,
      description: "A destructive disease caused by Phytophthora infestans",
      symptoms: "Water-soaked lesions on leaves and stems, white fungal growth",
      treatment: "Immediate removal of infected plants, apply systemic fungicide",
      fertilizer: "Phosphorus-rich fertilizer (0-20-0) to strengthen plant defenses",
      severity: "High",
      prevention: "Plant resistant varieties, avoid overhead irrigation, monitor weather conditions"
    },
    {
      name: "Powdery Mildew",
      confidence: 0.78,
      description: "A common fungal disease affecting many plant species",
      symptoms: "White powdery spots on leaves, stems, and flowers",
      treatment: "Apply neem oil or sulfur-based fungicide, prune affected areas",
      fertilizer: "Potassium-rich fertilizer (0-0-30) to improve plant resistance",
      severity: "Low to Medium",
      prevention: "Ensure good air circulation, avoid overcrowding, water at soil level"
    },
    {
      name: "Rust Disease",
      confidence: 0.85,
      description: "A fungal disease causing orange or brown pustules on leaves",
      symptoms: "Small, raised spots on leaves that release powdery spores",
      treatment: "Remove infected leaves, apply fungicide containing myclobutanil",
      fertilizer: "Zinc and manganese supplements to boost plant immunity",
      severity: "Medium",
      prevention: "Plant resistant varieties, maintain proper spacing, avoid overhead watering"
    },
    {
      name: "Bacterial Spot",
      confidence: 0.79,
      description: "A bacterial disease affecting tomato and pepper plants",
      symptoms: "Small, dark spots with yellow halos on leaves and fruits",
      treatment: "Remove infected plants, apply copper-based bactericide",
      fertilizer: "Calcium-rich fertilizer to strengthen cell walls",
      severity: "Medium to High",
      prevention: "Use disease-free seeds, avoid working with wet plants, rotate crops"
    }
  ]
  
  // Randomly select a disease (in production, this would be the actual prediction)
  const randomIndex = Math.floor(Math.random() * diseases.length)
  const selectedDisease = diseases[randomIndex]
  
  // Add some randomness to confidence for realism
  const confidenceVariation = (Math.random() - 0.5) * 0.1
  selectedDisease.confidence = Math.max(0.6, Math.min(0.98, selectedDisease.confidence + confidenceVariation))
  
  return selectedDisease
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imagePath } = body
    
    if (!imagePath) {
      return NextResponse.json(
        { error: 'Image path is required' },
        { status: 400 }
      )
    }

    // Validate that the image file exists
    const fullImagePath = join(process.cwd(), 'public', imagePath.replace('/uploads/', ''))
    if (!existsSync(fullImagePath)) {
      return NextResponse.json(
        { error: 'Image file not found' },
        { status: 404 }
      )
    }

    // Run disease prediction
    const prediction = await mockDiseasePredictor(imagePath)
    
    // Generate timestamp for the prediction
    const timestamp = new Date().toISOString()
    
    return NextResponse.json({
      success: true,
      prediction: {
        ...prediction,
        timestamp: timestamp,
        imagePath: imagePath
      },
      message: 'Disease prediction completed successfully'
    })

  } catch (error) {
    console.error('Prediction error:', error)
    return NextResponse.json(
      { error: 'Failed to process disease prediction' },
      { status: 500 }
    )
  }
}