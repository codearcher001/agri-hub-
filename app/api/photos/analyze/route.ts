import { type NextRequest, NextResponse } from "next/server"

// Configure for large file uploads
export const maxDuration = 60
export const dynamic = 'force-dynamic'

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
  console.log("[v0] Analysis history request received")

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "1"
    const limit = Number(searchParams.get("limit")) || 10

    // Get analysis history from database
    const photos = await LocalDatabaseService.getRecentPhotos(Number.parseInt(userId), limit)
    
    const analysisHistory = photos
      .filter(photo => photo.analysis_results)
      .map(photo => ({
        id: photo.id,
        filename: photo.filename,
        originalName: photo.original_name,
        uploadedAt: photo.created_at,
        analysisStatus: photo.analysis_status,
        analysisResults: photo.analysis_results,
        cropName: photo.analysis_results?.cropName,
        diseaseName: photo.analysis_results?.diseaseName,
        severity: photo.analysis_results?.severity,
        confidence: photo.analysis_results?.confidence,
      }))

    return NextResponse.json({
      success: true,
      analysisHistory,
      totalCount: analysisHistory.length,
      message: "Analysis history retrieved successfully",
    })

  } catch (error: any) {
    console.error("[v0] Analysis history error:", error)
    
    return NextResponse.json(
      {
        error: "Failed to retrieve analysis history",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
