import { NextResponse } from "next/server";
import { getTestWithQuestions } from "@/lib/supabase/test-services";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const test = await getTestWithQuestions(params.id);
        return NextResponse.json(test);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
