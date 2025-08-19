import { type NextRequest, NextResponse } from "next/server"
import { LocalDatabaseService } from "@/lib/local-database"
import { analyzeWithPlantId } from "@/lib/plant-id"
import FileStorage from "@/lib/file-storage"

// Configure for large file uploads
export const maxDuration = 300 // 5 minutes
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log("[v0] Plant.id crop analysis request received")

  try {
    const formData = await request.formData().catch(() => null)
    const body = formData ? null : await request.json().catch(() => null)

    const photoId = (formData?.get("photoId") as string) || (body?.photoId as string)
    const userId = (formData?.get("userId") as string) || (body?.userId as string) || "1"
    const base64 = (formData?.get("imageBase64") as string) || (body?.imageBase64 as string)
    const file = formData?.get("file") as File | null

    if (!photoId && !base64 && !file) {
      return NextResponse.json({ error: "Provide one of: file, photoId, or imageBase64" }, { status: 400 })
    }

    let imagePath: string
    let filename: string

    if (file) {
      const saved = await FileStorage.saveUploadedFile(file, "photos", Number.parseInt(userId))
      imagePath = saved.filepath
      filename = saved.filename
    } else if (photoId) {
      const photo = await LocalDatabaseService.getPhotoById(Number.parseInt(photoId))
      if (!photo) return NextResponse.json({ error: "Photo not found" }, { status: 404 })
      imagePath = photo.file_path
      filename = photo.filename
    } else {
      // Write base64 to a temporary file for unified processing
      const fs = await import("fs")
      const path = await import("path")
      const tmpPath = path.join("/tmp", `plantid_${Date.now()}.jpg`)
      const raw = base64!.startsWith("data:") ? base64!.split(",")[1] : base64!
      fs.writeFileSync(tmpPath, Buffer.from(raw, "base64"))
      imagePath = tmpPath
      filename = path.basename(tmpPath)
    }

    // Run Plant.id analysis
    const analysisReport = await analyzeWithPlantId(imagePath)

    // Flatten for storage and frontend
    const flattened = {
      cropName: analysisReport.analysis.cropName,
      diseaseName: analysisReport.analysis.diseaseName,
      confidence: analysisReport.analysis.confidence,
      severity: analysisReport.analysis.severity,
      symptoms: analysisReport.analysis.symptoms,
      causes: analysisReport.analysis.causes,
      treatments: analysisReport.analysis.treatments,
      prevention: analysisReport.analysis.prevention,
      recommendations: analysisReport.analysis.recommendations,
      urgency: analysisReport.analysis.urgency,
      estimatedYieldLoss: analysisReport.analysis.estimatedYieldLoss,
      costOfTreatment: analysisReport.analysis.costOfTreatment,
      lastAnalyzed: new Date().toISOString(),
      analysisType: "plant_id_v3",
    }

    if (photoId) {
      await LocalDatabaseService.updatePhotoAnalysis(Number.parseInt(photoId), flattened, "completed")
    }

    return NextResponse.json({
      success: true,
      analysis: flattened,
      imageInfo: analysisReport.imageInfo,
      filename,
      message: "Crop disease analysis completed successfully via Plant.id",
    })
  } catch (error: any) {
    console.error("[v0] Plant.id crop analysis error:", error)
    return NextResponse.json({ error: "Analysis failed", details: error?.message || String(error) }, { status: 500 })
  }
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
