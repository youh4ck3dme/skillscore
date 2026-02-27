# Štandardný Test Flow pre všetky testy

**Platí pre VŠETKY testy v systéme (test-digi, test-lang, test-sjt, test-IT, atď.)**

---

## 1. Spustenie testu (3 spôsoby na Candidate Dashboard)

### A) Rýchla navigácia → Základné/Pokročilé testy
- Kandidát klikne na kartu "Základné testy" alebo "Pokročilé testy"
- Zobrazí sa zoznam testov
- Klikne na názov testu → test sa spustí

### B) Rýchla navigácia → Prehľad testov
- Kandidát klikne na kartu "Prehľad testov"
- Zobrazí sa zoznam VŠETKÝCH testov
- Vidí prehľad: ktoré sú spravené ✓ / nespravené ✗
- **Farby testov sa menia podľa completion statusu**
- Klikne na test → test sa spustí

### C) Prehľad testov tabuľka (úplne dolu na dashboarde)
- Kandidát scrollne dolu
- Vidí tabuľku s testami
- Klikne na test → test sa spustí

---

## 2. Info Modal
- Zobrazí sa modal s info o teste
- Kandidát vidí: čo test meria, koľko otázok, časový limit
- Tlačidlo "Začať test"

---

## 3. Pre-start Checklist Modal
- Proctoring checks:
  - Kamera povolená?
  - Fokus na okno?
  - VPN/proxy detekcia?
- Kandidát potvrdí podmienky

---

## 4. Test Session Start
- API volanie `/api/tests/start` → vytvorí `candidate_attempts` záznam
- Načíta otázky podľa blueprintu (topic quotas, anti-repeat, level matching)
- Spustí časovač

---

## 5. Test Interface
- Kandidát odpovedá na otázky
- Proctoring tracking (focus loss, tab switch)

---

## 6. Submit
- API volanie `/api/tests/submit`
- Scoring algorithm → band assignment
- Uloženie do `candidate_results`

---

## 7. Result Page
- Zobrazí personalizovaný feedback podľa bandu

---

## 8. Uloženie výsledkov do CV
- **Textové výsledky sa uložia do "Tvoje CV" sekcie**
- Kandidát ich vidí vo svojom CV profile

---

## Poznámky:
- Tento flow je ROVNAKÝ pre všetky testy
- Líšia sa len: počet otázok, časový limit, témy, bands, level mode
- Všetko ostatné (modals, proctoring, API flow) je identické
