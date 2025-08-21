import { type NextRequest, NextResponse } from "next/server"

// Configure for large file uploads and extended processing time
export const maxDuration = 60
export const dynamic = 'force-dynamic'

function buildAnalysisText(a: any): string {
  const parts: string[] = []
  parts.push(`Crop: ${a.analysis?.cropName || a.cropName || "Unknown"}`)
  parts.push(`Disease: ${a.analysis?.diseaseName || a.diseaseName || "Unknown"}`)
  if (a.analysis?.confidence ?? a.confidence) parts.push(`Confidence: ${a.analysis?.confidence ?? a.confidence}%`)
  if (a.analysis?.severity ?? a.severity) parts.push(`Severity: ${a.analysis?.severity ?? a.severity}`)
  if (a.analysis?.urgency ?? a.urgency) parts.push(`Urgency: ${a.analysis?.urgency ?? a.urgency}`)
  if ((a.analysis?.symptoms || a.symptoms)?.length) parts.push("\nSymptoms:\n- " + (a.analysis?.symptoms || a.symptoms).join("\n- "))
  if ((a.analysis?.treatments || a.treatments)?.length) parts.push("\nTreatments:\n- " + (a.analysis?.treatments || a.treatments).join("\n- "))
  if ((a.analysis?.recommendations || a.recommendations)?.length) parts.push("\nRecommendations:\n- " + (a.analysis?.recommendations || a.recommendations).join("\n- "))
  return parts.join("\n")
}

export async function POST(_request: NextRequest) {
  return NextResponse.json(
    {
      error: "Deprecated endpoint",
      message: "Use POST /api/analyze on the Gemini server",
    },
    { status: 410 },
  )
}

export async function GET(request: NextRequest) {
  console.log("[v0] Enhanced analysis configuration request received")

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "1"

    // Get enhanced analysis history from database
    const photos = await LocalDatabaseService.getRecentPhotos(Number.parseInt(userId), 20)
    
    const enhancedAnalysisHistory = photos
      .filter(photo => photo.analysis_results && (photo.analysis_results.analysisType === "plant_id_v3" || photo.analysis_results.analysisType === "plant_id_fallback"))
      .map(photo => ({
        id: photo.id,
        filename: photo.filename,
        originalName: photo.original_name,
        uploadedAt: photo.created_at,
        analyzedAt: photo.analysis_results?.lastAnalyzed,
        cropName: photo.analysis_results?.cropName,
        diseaseName: photo.analysis_results?.diseaseName,
        severity: photo.analysis_results?.severity,
        confidence: photo.analysis_results?.confidence,
        urgency: photo.analysis_results?.urgency,
        estimatedYieldLoss: photo.analysis_results?.estimatedYieldLoss,
        hasReport: !!photo.analysis_results?.report,
      }))

    return NextResponse.json({
      success: true,
      enhancedAnalysisHistory,
      totalCount: enhancedAnalysisHistory.length,
      message: "Enhanced analysis history retrieved successfully",
    })

  } catch (error: any) {
    console.error("[v0] Enhanced analysis history error:", error)
    
    return NextResponse.json(
      {
        error: "Failed to retrieve enhanced analysis history",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}