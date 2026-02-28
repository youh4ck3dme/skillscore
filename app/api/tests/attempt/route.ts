import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { startTestAttempt, finishTestAttempt } from "@/lib/supabase/test-services";

export async function POST(request: Request) {
    try {
        const { testId, action, attemptId, score, passed } = await request.json();
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (action === "start") {
            const attempt = await startTestAttempt(testId, user.id);
            return NextResponse.json(attempt);
        }

        if (action === "finish") {
            await finishTestAttempt(attemptId, score, passed);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
