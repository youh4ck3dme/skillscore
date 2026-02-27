# SJT BASIC TEST - KOMPLETNÝ MULTJAZYČNÝ TEMPLATE

## ČO JE TENTO SÚBOR
Toto je kompletný template pre vytvorenie SJT (Situational Judgement Test) základného testu v 3 jazykoch.
Skopíruj tento text do AI a povedz mu: "Vyplň tento template 40 otázkami podľa pokynov".

---

## INŠTRUKCIE PRE AI

Vytvor 40 otázok pre SJT (Situational Judgement Test) podľa týchto pravidiel:

### 1. DISTRIBÚCIA OTÁZOK
- **Difficulty levels:**
  - `screen`: 10 otázok (ľahké základné scenáre)
  - `standard`: 15 otázok (bežné pracovné situácie)
  - `extended`: 15 otázok (komplexnejšie situácie)

### 2. TÉMY (rovnomerne rozdelené)
- `communication` - komunikácia v tíme a s klientmi
- `problem_solving` - riešenie problémov a kritické myslenie
- `teamwork` - spolupráca a tímová práca
- `decision_making` - rozhodovanie pod tlakom
- `time_management` - plánovanie a organizácia práce
- `conflict_resolution` - riešenie konfliktov

### 3. FORMÁT OTÁZOK
- Každá otázka je **realistický pracovný scenár**
- 4 možnosti odpovedí (a, b, c, d)
- Správna odpoveď je najlepší profesionálny prístup
- Nesprávne odpovede sú buď príliš pasívne, agresívne alebo neprofe siónálne

### 4. ŠTÝL OTÁZOK
- Používaj konkrétne pracovné situácie (nie abstraktné)
- Situácie musia byť univerzálne (nie špecifické pre jedno odvetvie)
- Vhodné pre administratívnych/kancelárskych pracovníkov
- Neutrálne formulované (nie genderovo špecifické)

### 5. SPRÁVNA ODPOVEĎ (`correct_index`)
- 0 = odpoveď A
- 1 = odpoveď B
- 2 = odpoveď C
- 3 = odpoveď D

### 6. JAZYKOVÉ VERZIE
Každá otázka MUSÍ byť preložená do:
- Slovenčina (stem_sk, options_sk)
- Angličtina (stem_en, options_en)
- Nemčina (stem_de, options_de)

DÔLEŽITÉ:
- Preklady musia byť prirodzené, nie doslovné
- Zachovaj profesionálny tón vo všetkých jazykoch
- V JSON escape úvodzovky pomocou '' (dva apostrofy)

---

## SQL TEMPLATE (POUŽI TENTO PRESNÝ FORMÁT)

```sql
-- ========================================
-- SJT BASIC TEST - SITUATIONAL JUDGEMENT
-- Test Code: test-sjt
-- Tabuľka: test_questions
-- Počet otázok: 40
-- Jazyky: SK, EN, DE
-- ========================================

-- PRÍKLAD OTÁZKY (SKOPÍRUJ TENTO FORMÁT 40x)

INSERT INTO test_questions (
  id,
  stem_sk,
  stem_en,
  stem_de,
  options_sk,
  options_en,
  options_de,
  correct_index,
  question_type,
  difficulty_level,
  topic,
  created_at,
  updated_at
) VALUES

-- ============ SCREEN LEVEL (10 otázok) ============

(
  gen_random_uuid(),
  'Váš kolega vás požiada o pomoc s naliehavou úlohou, ale vy máte vlastný uzáver termínu o hodinu. Ako postupujete?',
  'Your colleague asks you for help with an urgent task, but you have your own deadline in one hour. How do you proceed?',
  'Ihr Kollege bittet Sie um Hilfe bei einer dringenden Aufgabe, aber Sie haben Ihre eigene Frist in einer Stunde. Wie gehen Sie vor?',
  '{"a": "Okamžite pomôžem kolegovi a vlastnú prácu dokončím neskôr", "b": "Vysvetlím mu svoju situáciu a ponúknem pomoc po dokončení mojej úlohy", "c": "Poviem, že nemám čas a odkážem ho na niekoho iného", "d": "Ignorujem požiadavku a sústreďujem sa na svoju prácu"}'::jsonb,
  '{"a": "Immediately help the colleague and finish my work later", "b": "Explain my situation and offer help after completing my task", "c": "Say I don''t have time and refer them to someone else", "d": "Ignore the request and focus on my work"}'::jsonb,
  '{"a": "Helfe dem Kollegen sofort und erledige meine Arbeit später", "b": "Erkläre meine Situation und biete Hilfe nach Abschluss meiner Aufgabe an", "c": "Sage, dass ich keine Zeit habe und verweise auf jemand anderen", "d": "Ignoriere die Anfrage und konzentriere mich auf meine Arbeit"}'::jsonb,
  1,
  'single_choice',
  'screen',
  'communication',
  NOW(),
  NOW()
),

-- OTÁZKA 2 (screen, problem_solving)
(
  gen_random_uuid(),
  '[SLOVENSKÝ TEXT OTÁZKY]',
  '[ENGLISH QUESTION TEXT]',
  '[DEUTSCHER FRAGETEXT]',
  '{"a": "[SK odpoveď A]", "b": "[SK odpoveď B]", "c": "[SK odpoveď C]", "d": "[SK odpoveď D]"}'::jsonb,
  '{"a": "[EN answer A]", "b": "[EN answer B]", "c": "[EN answer C]", "d": "[EN answer D]"}'::jsonb,
  '{"a": "[DE Antwort A]", "b": "[DE Antwort B]", "c": "[DE Antwort C]", "d": "[DE Antwort D]"}'::jsonb,
  [0-3],
  'single_choice',
  'screen',
  '[topic]',
  NOW(),
  NOW()
),

-- ... POKRAČUJ S ĎALŠÍMI 8 OTÁZKAMI PRE SCREEN ...

-- ============ STANDARD LEVEL (15 otázok) ============

(
  gen_random_uuid(),
  'Zistíte chybu v procese, ktorý používa celý tím. Čo urobíte ako prvé?',
  'You discover an error in a process that the whole team uses. What do you do first?',
  'Sie entdecken einen Fehler in einem Prozess, den das ganze Team verwendet. Was tun Sie zuerst?',
  '{"a": "Snažím sa chybu opraviť sám bez informovania ostatných", "b": "Nahláším chybu nadriadenému a tímu a navrh nem riešenie", "c": "Počkám, či si to niekto iný všimne", "d": "Pokračujem v práci ako obvykle"}'::jsonb,
  '{"a": "Try to fix the error myself without informing others", "b": "Report the error to my supervisor and team and suggest a solution", "c": "Wait to see if someone else notices", "d": "Continue working as usual"}'::jsonb,
  '{"a": "Versuche den Fehler selbst zu beheben, ohne andere zu informieren", "b": "Melde den Fehler meinem Vorgesetzten und Team und schlage eine Lösung vor", "c": "Warte ab, ob jemand anderes es bemerkt", "d": "Arbeite wie gewohnt weiter"}'::jsonb,
  1,
  'single_choice',
  'standard',
  'problem_solving',
  NOW(),
  NOW()
),

-- ... POKRAČUJ S ĎALŠÍMI 14 OTÁZKAMI PRE STANDARD ...

-- ============ EXTENDED LEVEL (15 otázok) ============

(
  gen_random_uuid(),
  '[Komplexný scenár s viacerými faktormi]',
  '[Complex scenario with multiple factors]',
  '[Komplexes Szenario mit mehreren Faktoren]',
  '{"a": "[SK odpoveď A]", "b": "[SK odpoveď B]", "c": "[SK odpoveď C]", "d": "[SK odpoveď D]"}'::jsonb,
  '{"a": "[EN answer A]", "b": "[EN answer B]", "c": "[EN answer C]", "d": "[EN answer D]"}'::jsonb,
  '{"a": "[DE Antwort A]", "b": "[DE Antwort B]", "c": "[DE Antwort C]", "d": "[DE Antwort D]"}'::jsonb,
  [0-3],
  'single_choice',
  'extended',
  '[topic]',
  NOW(),
  NOW()
);

-- KONIEC SQL
```

---

## PRÍKLADY SCENÁROV PRE INŠPIRÁCIU

### SCREEN Level (jednoduchšie):
- Kolega potrebuje pomoc, ale máte vlastný termín
- Dostanete nejasnú inštrukciu od nadriadeného
- Zistíte, že vám chýbajú informácie na dokončenie úlohy
- Musíte komunikovať zlé správy klientovi
- Máte konfli kt priorít medzi dvoma úlohami

### STANDARD Level (stredné):
- Zistíte chybu v systéme, ktorý používa celý tím
- Kolega sa sťažuje na iného člena tímu
- Musíte rozhodnúť, ktorá úloha je dôležitejšia
- Dostanete kritiku na vašu prácu
- Klient je nespokojný so službou

### EXTENDED Level (komplexnejšie):
- Musíte vybalansovať potreby viacerých zainteresovaných strán
- Riešenie konfliktu medzi dvoma kolegami
- Rozhodovanie v situácii s neúplnými informáciami
- Manažovanie krízy so zákazníkom
- Etická dilema v práci

---

## ČO ROBIŤ POTOM

1. Skopíruj tento celý text do AI (ChatGPT, Claude, etc.)
2. Povedz: "Vyplň tento template 40 otázkami podľa pokynov"
3. AI ti vygeneruje kompletný SQL s 40 otázkami
4. Skopíruj výsledný SQL do Supabase SQL Editora
5. Spusti SQL script
6. HOTOVO - test bude fungovať v 3 jazykoch!
