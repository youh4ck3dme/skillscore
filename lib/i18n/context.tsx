export const useI18n = () => ({ language: 'sk', setLanguage: () => {} }); export const I18nProvider = ({children}:any) => <>{children}</>; export type Language = 'sk' | 'en' | 'de';
