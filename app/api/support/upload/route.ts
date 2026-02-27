import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${user.id}/${timestamp}-${file.name}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from("support-attachments").upload(filename, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Error uploading file:", error)
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("support-attachments").getPublicUrl(filename)

    return NextResponse.json({ url: publicUrl }, { status: 200 })
  } catch (error) {
    console.error("Error in support upload API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
