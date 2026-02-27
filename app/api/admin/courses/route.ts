import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Mock courses data - in real implementation, this would come from database
    const courses = [
      {
        id: "1",
        title: "Základy programovania",
        description: "Úvod do programovania pre začiatočníkov",
        category: "IT",
        duration_hours: 40,
        skill_level: "Začiatočník",
        is_active: true,
      },
      {
        id: "2",
        title: "Pokročilé Excel zručnosti",
        description: "Pokročilé funkcie a analýza dát v Excel",
        category: "Kancelárske zručnosti",
        duration_hours: 20,
        skill_level: "Stredný",
        is_active: true,
      },
      {
        id: "3",
        title: "Komunikačné zručnosti",
        description: "Efektívna komunikácia na pracovisku",
        category: "Soft skills",
        duration_hours: 16,
        skill_level: "Všetky úrovne",
        is_active: true,
      },
      {
        id: "4",
        title: "Projektové riadenie",
        description: "Základy projektového riadenia a agilných metodík",
        category: "Manažment",
        duration_hours: 32,
        skill_level: "Pokročilý",
        is_active: true,
      },
      {
        id: "5",
        title: "Digitálny marketing",
        description: "Stratégie a nástroje digitálneho marketingu",
        category: "Marketing",
        duration_hours: 24,
        skill_level: "Stredný",
        is_active: false,
      },
    ]

    return NextResponse.json({ courses })
  } catch (error) {
    console.error("Error in courses API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
