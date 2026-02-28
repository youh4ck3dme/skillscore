"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Award, Play } from "lucide-react";
import { Test } from "@/lib/supabase/test-services";
import Link from "next/link";

interface TestCardProps {
    test: Test;
}

export function TestCard({ test }: TestCardProps) {
    return (
        <Card className="flex flex-col h-full border-primary/10 hover:border-primary/30 transition-all hover:shadow-md">
            <CardHeader>
                <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {test.category}
                    </span>
                </div>
                <CardTitle className="text-xl">{test.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                    {test.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{test.time_limit_minutes} minút</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        <span>Min. úspešnosť: {test.passing_score_percentage}%</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Link href={`/dashboard/worker/tests/${test.id}`} className="w-full">
                    <Button className="w-full group">
                        Spustiť test
                        <Play className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
