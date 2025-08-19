import { type NextRequest, NextResponse } from "next/server"
import { LocalDatabaseService } from "@/lib/local-database"
import FileStorage from "@/lib/file-storage"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const photoId = Number.parseInt(params.id)

    if (isNaN(photoId)) {
      return NextResponse.json({ error: "Invalid photo ID" }, { status: 400 })
    }

    const photo = await LocalDatabaseService.getPhotoById(photoId)

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      photo: {
        id: photo.id,
        userId: photo.user_id,
        fieldId: photo.field_id,
        filename: photo.filename,
        originalName: photo.original_name,
        filePath: photo.file_path,
        fileSize: photo.file_size,
        mimeType: photo.mime_type,
        source: photo.source,
        captureDate: photo.capture_date,
        gpsLatitude: photo.gps_latitude,
        gpsLongitude: photo.gps_longitude,
        altitude: photo.altitude,
        analysisStatus: photo.analysis_status,
        analysisResults: photo.analysis_results,
        tags: photo.tags,
        createdAt: photo.created_at,
      },
    })
  } catch (error) {
    console.error("[v0] Get photo error:", error)
    return NextResponse.json({ error: "Failed to get photo" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const photoId = Number.parseInt(params.id)

    if (isNaN(photoId)) {
      return NextResponse.json({ error: "Invalid photo ID" }, { status: 400 })
    }

    // Get photo info first
    const photo = await LocalDatabaseService.getPhotoById(photoId)

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 })
    }

    // Delete file from storage
    await FileStorage.deleteFile(photo.file_path)

    // Delete photo record from local database
    await LocalDatabaseService.deletePhoto(photoId)

    return NextResponse.json({
      success: true,
      message: "Photo deleted successfully",
    })
  } catch (error) {
    console.error("[v0] Delete photo error:", error)
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const photoId = Number.parseInt(params.id)
    const body = await request.json()

    if (isNaN(photoId)) {
      return NextResponse.json({ error: "Invalid photo ID" }, { status: 400 })
    }

    const updates: any = {}
    if (body.tags !== undefined) updates.tags = body.tags
    if (body.analysisStatus !== undefined) updates.analysisStatus = body.analysisStatus
    if (body.analysisResults !== undefined) updates.analysisResults = body.analysisResults

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    const updatedPhoto = await LocalDatabaseService.updatePhoto(photoId, updates)
    if (!updatedPhoto) return NextResponse.json({ error: "Photo not found" }, { status: 404 })

    return NextResponse.json({
      success: true,
      photo: {
        id: updatedPhoto.id,
        userId: updatedPhoto.user_id,
        fieldId: updatedPhoto.field_id,
        filename: updatedPhoto.filename,
        originalName: updatedPhoto.original_name,
        filePath: updatedPhoto.file_path,
        fileSize: updatedPhoto.file_size,
        mimeType: updatedPhoto.mime_type,
        source: updatedPhoto.source,
        captureDate: updatedPhoto.capture_date,
        analysisStatus: updatedPhoto.analysis_status,
        analysisResults: updatedPhoto.analysis_results,
        tags: updatedPhoto.tags,
        createdAt: updatedPhoto.created_at,
      },
    })
  } catch (error) {
    console.error("[v0] Update photo error:", error)
    return NextResponse.json({ error: "Failed to update photo" }, { status: 500 })
  }
}
