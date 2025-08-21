import { NextResponse } from "next/server"

export async function GET() {
  const config = {
    googleApiKey: {
      serverSide: !!process.env.GOOGLE_API_KEY,
      value: process.env.GOOGLE_API_KEY ? "Configured" : "Not configured",
    },
    uploadDir: process.env.UPLOAD_DIR || "./uploads",
    maxFileSize: process.env.MAX_FILE_SIZE || "20971520",
    nodeEnv: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  }

  return NextResponse.json({
    success: true,
    config,
    message: "Environment configuration check completed"
  })
}