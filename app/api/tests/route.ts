import { NextResponse } from "next/server";
import { getAvailableTests } from "@/lib/supabase/test-services";

export async function GET() {
    try {
        const tests = await getAvailableTests();
        return NextResponse.json(tests);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
