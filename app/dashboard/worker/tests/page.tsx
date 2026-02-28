"use client";

import { useEffect, useState } from "react";
import { TestCard } from "@/components/tests/TestCard";
import { Test } from "@/lib/supabase/test-services";
import { Loader2, AlertCircle } from "lucide-react";

export default function TestsPage() {
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTests() {
            try {
                const res = await fetch("/api/tests");
                if (!res.ok) throw new Error("Nepodarilo sa načítať testy");
                const data = await res.json();
                setTests(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchTests();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Dostupné testy</h1>
                <p className="text-muted-foreground">
                    Vyberte si test a preukážte svoje zručnosti. Po úspešnom absolvovaní získate certifikát do vášho profilu.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map((test) => (
                    <TestCard key={test.id} test={test} />
                ))}
                {tests.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
                        <p className="text-muted-foreground">Momentálne nie sú k dispozícii žiadne verejné testy.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
