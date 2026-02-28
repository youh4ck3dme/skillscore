"use client";

import { useEffect, useState } from "react";
import { TestPlayer } from "@/components/tests/TestPlayer";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TestExecutionPage({ params }: { params: { id: string } }) {
    const [test, setTest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [attempt, setAttempt] = useState<any>(null);
    const [result, setResult] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        async function initTest() {
            try {
                // 1. Fetch test details with questions
                const testRes = await fetch(`/api/tests/${params.id}`);
                if (!testRes.ok) throw new Error("Test sa nepodarilo načítať");
                const testData = await testRes.json();
                setTest(testData);

                // 2. Start an attempt
                const attemptRes = await fetch("/api/tests/attempt", {
                    method: "POST",
                    body: JSON.stringify({ testId: params.id, action: "start" }),
                });
                if (!attemptRes.ok) throw new Error("Nepodarilo sa spustiť pokus");
                const attemptData = await attemptRes.json();
                setAttempt(attemptData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        initTest();
    }, [params.id]);

    const handleComplete = async (answers: Record<string, string[]>) => {
        setLoading(true);
        try {
            // Simple scoring logic for MVP (client-side for now, normally server-side)
            let correctCount = 0;
            test.questions.forEach((q: any) => {
                const userAnswers = answers[q.id] || [];
                const correctOptions = q.options.filter((o: any) => o.is_correct).map((o: any) => o.id);

                if (q.q_type === "single_choice") {
                    if (userAnswers[0] === correctOptions[0]) correctCount++;
                } else {
                    const isCorrect = correctOptions.length === userAnswers.length &&
                        correctOptions.every((id: string) => userAnswers.includes(id));
                    if (isCorrect) correctCount++;
                }
            });

            const score = Math.round((correctCount / test.questions.length) * 100);
            const passed = score >= test.passing_score_percentage;

            // Finish attempt in DB
            const res = await fetch("/api/tests/attempt", {
                method: "POST",
                body: JSON.stringify({
                    action: "finish",
                    attemptId: attempt.id,
                    score,
                    passed
                }),
            });

            if (!res.ok) throw new Error("Nepodarilo sa uložiť výsledok");

            setResult({ score, passed });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[600px] flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Pripravujeme váš test...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-20 text-center space-y-4">
                <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex flex-col items-center gap-3">
                    <AlertCircle className="h-10 w-10" />
                    <p className="font-bold">{error}</p>
                </div>
                <Button variant="outline" onClick={() => router.back()}>Naspäť</Button>
            </div>
        );
    }

    if (result) {
        return (
            <div className="max-w-md mx-auto mt-20 text-center animate-in zoom-in duration-500">
                <div className={`p-8 rounded-3xl border ${result.passed ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200 shadow-lg"}`}>
                    {result.passed ? (
                        <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    ) : (
                        <AlertCircle className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                    )}
                    <h2 className="text-3xl font-black mb-2">
                        {result.passed ? "Gratulujeme!" : "Skoro si to mal!"}
                    </h2>
                    <p className="text-lg mb-6">
                        Dosiahli ste skóre <span className="font-bold text-2xl">{result.score}%</span>
                    </p>
                    <div className="space-y-3">
                        <Button asChild className="w-full h-12 text-lg">
                            <Link href="/dashboard/worker/tests">Naspäť na zoznam testov</Link>
                        </Button>
                        <Button variant="ghost" asChild className="w-full">
                            <Link href="/dashboard/worker">Ísť na profil</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8">
            <TestPlayer test={test} onComplete={handleComplete} />
        </div>
    );
}
