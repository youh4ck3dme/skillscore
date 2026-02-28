export const generateResults = async (testId: string, answers: any) => {
    return {
        score: 0,
        passing: false,
        maxScore: 100
    };
};

export const getLevelBand = (score: number) => {
    if (score >= 80) return "expert";
    if (score >= 60) return "stay";
    return "beginner";
};

export const getBandForPercentage = (score: number) => {
    if (score >= 80) return "expert";
    return "beginner";
};

export const generateCandidateMessage = (band: string, testId: string, score: number, lang: string) => {
    return `Dosiahli ste úroveň ${band} so skóre ${score}%.`;
};

export const generateCompanyMessage = (band: string, testId: string, score: number, data: any, lang: string) => {
    return `Kandidát dosiahol úroveň ${band} so skóre ${score}%.`;
};
