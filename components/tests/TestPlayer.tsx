"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Question, Option } from "@/lib/supabase/test-services";
import { ChevronLeft, ChevronRight, Send, Timer } from "lucide-react";

interface TestPlayerProps {
    test: any; // TestWithQuestions
    onComplete: (answers: Record<string, string[]>) => void;
}

export function TestPlayer({ test, onComplete }: TestPlayerProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string[]>>({});
    const [timeLeft, setTimeLeft] = useState(test.time_limit_minutes * 60);

    const currentQuestion = test.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;

    useEffect(() => {
        if (timeLeft <= 0) {
            handleFinish();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleOptionChange = (questionId: string, optionId: string, qType: string) => {
        setAnswers((prev) => {
            if (qType === "single_choice") {
                return { ...prev, [questionId]: [optionId] };
            } else {
                const currentAnswers = prev[questionId] || [];
                if (currentAnswers.includes(optionId)) {
                    return { ...prev, [questionId]: currentAnswers.filter((id) => id !== optionId) };
                } else {
                    return { ...prev, [questionId]: [...currentAnswers, optionId] };
                }
            }
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < test.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const handleFinish = () => {
        onComplete(answers);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-primary/10 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <Timer className="h-5 w-5 text-primary" />
                    <span className={`font-mono font-bold ${timeLeft < 60 ? "text-red-500 animate-pulse" : ""}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>
                <div className="flex-1 mx-6">
                    <Progress value={progress} className="h-2" />
                </div>
                <div className="text-sm font-medium">
                    Otázka {currentQuestionIndex + 1} / {test.questions.length}
                </div>
            </div>

            <Card className="border-primary/10 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold leading-tight">
                        {currentQuestion.question_text}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {currentQuestion.q_type === "single_choice" ? (
                        <RadioGroup
                            value={answers[currentQuestion.id]?.[0]}
                            onValueChange={(val) => handleOptionChange(currentQuestion.id, val, "single_choice")}
                            className="space-y-3"
                        >
                            {currentQuestion.options.map((option: Option) => (
                                <div key={option.id} className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-primary/5 transition-colors cursor-pointer group">
                                    <RadioGroupItem value={option.id} id={option.id} />
                                    <Label htmlFor={option.id} className="flex-1 cursor-pointer font-medium">
                                        {option.option_text}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    ) : (
                        <div className="space-y-3">
                            {currentQuestion.options.map((option: Option) => (
                                <div key={option.id} className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-primary/5 transition-colors cursor-pointer group">
                                    <Checkbox
                                        id={option.id}
                                        checked={answers[currentQuestion.id]?.includes(option.id)}
                                        onCheckedChange={() => handleOptionChange(currentQuestion.id, option.id, "multiple_choice")}
                                    />
                                    <Label htmlFor={option.id} className="flex-1 cursor-pointer font-medium">
                                        {option.option_text}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-between items-center bg-muted/30 p-4 rounded-xl">
                <Button
                    variant="ghost"
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                    className="gap-2"
                >
                    <ChevronLeft className="h-4 w-4" /> Predošlá
                </Button>

                {currentQuestionIndex === test.questions.length - 1 ? (
                    <Button onClick={handleFinish} className="gap-2 bg-green-600 hover:bg-green-700">
                        Odovzdať test <Send className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button onClick={handleNext} className="gap-2">
                        Ďalšia otázka <ChevronRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
