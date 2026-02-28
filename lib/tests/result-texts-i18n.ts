export const resultTexts = {
    sk: {
        title: "Výsledky testu",
    },
    en: {
        title: "Test Results",
    }
};

export type SupportedResultLanguage = "sk" | "en" | "de";

export const getLanguageTestCandidateText = (band: string, lang: SupportedResultLanguage) => "Text pre kandidáta";
export const getLanguageTestCompanyText = (band: string, lang: SupportedResultLanguage) => "Text pre firmu";
export const getITTestCandidateText = (band: string, lang: string) => "IT text pre kandidáta";
export const getITTestCompanyText = (band: string, lang: string) => "IT text pre firmu";
export const determineResultLanguage = (langCode?: string) => langCode || "sk";
export const getRetentionCandidateText = (testId: string, bandLabel: string, score: number, lang: string) => "Retention text pre kandidáta";
export const getRetentionCompanyText = (testId: string, bandLabel: string, score: number, lang: string) => "Retention text pre firmu";
