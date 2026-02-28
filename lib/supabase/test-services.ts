import { createClient } from "./client";

export type Test = {
    id: string;
    title: string;
    description: string;
    category: string;
    time_limit_minutes: number;
    passing_score_percentage: number;
};

export type Question = {
    id: string;
    test_id: string;
    question_text: string;
    q_type: "single_choice" | "multiple_choice";
    points: number;
    order_num: number;
    options?: Option[];
};

export type Option = {
    id: string;
    question_id: string;
    option_text: string;
    is_correct: boolean;
    order_num: number;
};

export const getAvailableTests = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("tests")
        .select("*")
        .eq("is_active", true);

    if (error) throw error;
    return data as Test[];
};

export const getTestWithQuestions = async (testId: string) => {
    const supabase = createClient();

    // Fetch test header
    const { data: test, error: testError } = await supabase
        .from("tests")
        .select("*")
        .eq("id", testId)
        .single();

    if (testError) throw testError;

    // Fetch questions and options
    const { data: questions, error: questionsError } = await supabase
        .from("questions")
        .select(`
      *,
      options (*)
    `)
        .eq("test_id", testId)
        .order("order_num", { ascending: true });

    if (questionsError) throw questionsError;

    return {
        ...test,
        questions: questions as Question[]
    };
};

export const startTestAttempt = async (testId: string, userId: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("test_attempts")
        .insert({
            test_id: testId,
            user_id: userId,
            status: "in_progress"
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const submitAnswer = async (attemptId: string, questionId: string, optionId: string) => {
    const supabase = createClient();
    const { error } = await supabase
        .from("user_answers")
        .upsert({
            attempt_id: attemptId,
            question_id: questionId,
            option_id: optionId
        }, {
            onConflict: "attempt_id,question_id,option_id"
        });

    if (error) throw error;
    return true;
};

export const finishTestAttempt = async (attemptId: string, score: number, passed: boolean) => {
    const supabase = createClient();
    const { error } = await supabase
        .from("test_attempts")
        .update({
            status: "completed",
            completed_at: new Date().toISOString(),
            percentage_score: score,
            passed
        })
        .eq("id", attemptId);

    if (error) throw error;
    return true;
};
