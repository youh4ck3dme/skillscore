import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const testId = searchParams.get("test_id")
    const templateType = searchParams.get("template_type")
    const language = searchParams.get("language") || "sk"

    if (!templateType) {
      return NextResponse.json({ error: "template_type parameter is required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    let query = supabase
      .from("assessment_templates")
      .select("*")
      .eq("template_type", templateType.toUpperCase())
      .eq("language", language.toLowerCase())

    if (testId) {
      query = query.eq("test_id", testId)
    } else {
      query = query.is("test_id", null)
    }

    const { data: templates, error: templatesError } = await query

    if (templatesError) {
      console.error("[v0] Error fetching templates:", templatesError)
      return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
    }

    if (!templates || templates.length === 0) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    const template = templates[0]

    return NextResponse.json({
      test_id: template.test_id,
      template_type: template.template_type,
      language: template.language,
      content: template.content,
      variant_key: template.variant_key,
    })
  } catch (error) {
    console.error("[v0] Error in assessment templates route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
