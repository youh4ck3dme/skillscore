# PROCES NAPOJENIA NOVÉHO TESTU

Tento dokument popisuje krok po kroku proces napojenia nového testu do systému.

## PREHĽAD PROCESU

1. Používateľ pripraví dáta pre test (otázky, result texts)
2. Používateľ použije iný AI s promptom na vygenerovanie SQL scriptu
3. Používateľ mi dodá SQL script
4. Ja zvalidujem SQL script
5. Ak je všetko OK → spustím SQL script
6. Otestujeme, či test funguje
7. Ak niečo chýba → opravíme a opakujeme

## KROK 1: PRÍPRAVA DÁT

Používateľ potrebuje pripraviť:

### A) Konfigurácia testu
- Kód testu (napr. test-digi)
- Názov testu
- Popis testu
- Kategória
- Typ testu
- Počet otázok
- Trvanie v minútach
- Je adaptívny? (true/false)
- Je závislý od CV? (true/false)
- Úroveň obtiažnosti (single_level / leveled)

### B) Otázky
Pre každú otázku:
- Kód otázky (napr. DIGI_SEC_001)
- Typ otázky (MCQ, ordering, root_cause)
- Téma (napr. security_phishing_privacy)
- Úroveň obtiažnosti (single_level alebo A1-C2, screen/standard/expert)
- Text otázky (stem_sk)
- Možnosti odpovede (A, B, C, D)
- Správna odpoveď (0=A, 1=B, 2=C, 3=D)
- Vysvetlenie (rationale_sk)

### C) Result texts
Pre každý performance band (4 bands):
- 10 variantov pre kandidáta (audience='candidate', variant_index=0-9)
- 20 variantov pre firmu (audience='company', variant_index=0-19)

Každý result text obsahuje:
- Text feedbacku (text_content)
- Odporúčaná úroveň (recommended_level) - pre kandidáta
- Odporúčanie pre nasadenie (deployment_recommendation) - pre firmu
- Bezpečnostná poznámka (safety_note) - pre firmu
- Okamžitá rada (immediate_advice) - pre kandidáta

## KROK 2: GENEROVANIE SQL SCRIPTU

1. Používateľ otvorí ChatGPT / Claude
2. Skopíruje celý obsah súboru `AI-SQL-GENERATOR-PROMPT.txt`
3. Pridá svoje dáta (otázky, result texts)
4. AI vygeneruje kompletný SQL script
5. Používateľ skopíruje SQL script

## KROK 3: DODANIE SQL SCRIPTU

Používateľ mi dodá SQL script jedným z týchto spôsobov:
- Nahrá ho do `/scripts/` priečinka ako `XXX-seed-test-YYY.sql`
- Alebo mi ho pošle priamo v chate

## KROK 4: VALIDÁCIA SQL SCRIPTU

Ja skontolujem SQL script podľa `VALIDATION-CHECKLIST.md`:
- Základná štruktúra
- Tests tabuľka
- Test_questions tabuľka
- Result_text_variants tabuľka
- Počty a konzistencia
- Escapovanie a formátovanie
- Špecifické pre typ testu

## KROK 5A: AK JE VŠETKO OK

1. Spustím SQL script v Supabase
2. Skontolujem, či sa test vytvoril v `tests` tabuľke
3. Skontolujem, či sa otázky vytvorili v `test_questions` tabuľke
4. Skontolujem, či sa result texts vytvorili v `result_text_variants` tabuľke
5. Poviem používateľovi: "SQL script úspešne spustený! Test je napojený."

## KROK 5B: AK NIEČO CHÝBA

1. Poviem používateľovi presne, čo chýba alebo čo je zle
2. Používateľ opraví dáta
3. Používateľ znova vygeneruje SQL script cez AI
4. Opakujeme KROK 3-5

## KROK 6: TESTOVANIE

1. Používateľ otvorí candidate dashboard
2. Spustí test
3. Skontrolujeme:
   - Načítavajú sa otázky?
   - Dajú sa odpovedať?
   - Ukladajú sa odpovede?
   - Zobrazuje sa výsledok?
   - Zobrazuje sa personalizovaný feedback?

## KROK 7: AKTUALIZÁCIA KONFIGURÁCIE

Ak je potrebné, aktualizujem `lib/tests/tests-rules-config.json`:
- Skontolujem, či konfigurácia sedí s novým testom
- Ak nie, aktualizujem ju

## HOTOVO!

Test je napojený a funkčný. Proces sa dá opakovať pre ďalšie testy.

## ČASOVÝ ODHAD

- Príprava dát: 30-60 minút (závisí od počtu otázok)
- Generovanie SQL: 2-5 minút
- Validácia: 5-10 minút
- Spustenie: 1-2 minúty
- Testovanie: 5-10 minút

**Celkovo: 45-90 minút na jeden test**

## TIPY PRE EFEKTÍVNOSŤ

1. Priprav všetky dáta naraz (otázky + result texts)
2. Použi rovnaký formát pre všetky testy
3. Skontroluj escapovanie špeciálnych znakov pred generovaním SQL
4. Testuj na jednej otázke najprv, potom pridaj zvyšok
5. Použi rovnaký prompt pre všetky testy rovnakého typu
