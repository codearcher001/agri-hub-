# AgriSecure Hub - Crop Disease Analysis System

Advanced agricultural image analysis powered by Google Gemini 2.0 Flash

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/dasrajdeep2021-gmailcoms-projects/v0-agri-secure-hub-design)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/njsuvIjSU1N)

## Overview

AgriSecure Hub is a comprehensive crop disease analysis system that uses Google Gemini 2.0 Flash to provide detailed agricultural insights. The system can identify crops, detect diseases, provide treatment recommendations, and generate comprehensive reports.

## Deployment

Your project is live at:

**[https://vercel.com/dasrajdeep2021-gmailcoms-projects/v0-agri-secure-hub-design](https://vercel.com/dasrajdeep2021-gmailcoms-projects/v0-agri-secure-hub-design)**

## Features

### 🌱 Crop Disease Analysis
- **Crop Identification**: Automatically identifies crop types from images
- **Disease Detection**: Detects diseases with confidence scoring
- **Severity Assessment**: Low/Medium/High/Critical severity levels
- **Treatment Recommendations**: Specific treatment plans and dosages
- **Yield Loss Estimation**: Percentage-based yield impact assessment

### 📊 Comprehensive Reporting
- **Detailed Reports**: Includes crop name, disease, symptoms, causes, treatments
- **Financial Impact**: Cost estimates for treatment and yield loss projections
- **Multiple Formats**: Text and JSON report downloads
- **Professional Formatting**: Structured, easy-to-read reports

### 🔧 API Integration
- **Google Gemini 2.0 Flash**: Multimodal plant and disease understanding
- **RESTful Endpoints**: Complete API for upload, analysis, and reporting
- **Batch Processing**: Analyze multiple images simultaneously
- **Fallback System**: Basic analysis if AI API fails

## Setup Instructions

### 1. Environment Configuration

**Option 1: Use the setup script (recommended)**
```bash
./setup-env.sh
```

**Option 2: Manual setup**
Copy the example environment file and configure your API key:

```bash
cp .env.example .env.local
```

The API key is already configured in the example file:
```env
GOOGLE_API_KEY=your_api_key_here
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

### 4. Test the System

Visit the test pages to verify functionality:
- `/test-upload` - Basic file upload testing
  

## API Endpoints

### Upload and Analysis
- `POST /api/photos/upload` - Upload image with automatic analysis
- `POST /api/photos/analyze` - Analyze existing or new images
- `GET /api/photos/analyze` - Get analysis history

### Report Generation
- `POST /api/photos/report` - Generate and download reports
- `GET /api/photos/report` - Get report preview

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/njsuvIjSU1N](https://v0.app/chat/projects/njsuvIjSU1N)**

## How It Works

1. Upload crop images through the web interface or API
2. Gemini analyzes the image for diseases and health issues
3. System generates comprehensive reports with treatment recommendations
4. Download detailed reports in multiple formats
5. Track analysis history and monitor crop health over time