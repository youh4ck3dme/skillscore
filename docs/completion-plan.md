# SOMVIAC - PLÁN DOKONČENIA APLIKÁCIE

## AKTUÁLNY STAV: 65% HOTOVO

---

## FÁZA 1: KRITICKÉ FUNKCIE (PRIORITA 1)

### KROK 1: Dokončenie testovacieho systému
**Čas: 5-7 dní**

#### 1.1 Implementácia 7 základných testov
- [ ] Logické myslenie test
- [ ] Numerické schopnosti test  
- [ ] Verbálne schopnosti test
- [ ] Priestorová predstavivosť test
- [ ] Pamäť a koncentrácia test
- [ ] Technické zručnosti test
- [ ] Osobnostný profil test

#### 1.2 Vyhodnocovanie a scoring systém
- [ ] Algoritmus pre vyhodnocovanie testov
- [ ] Percentilové hodnotenie
- [ ] Generovanie reportov pre kandidátov
- [ ] Uloženie výsledkov do databázy

#### 1.3 Test management pre firmy
- [ ] Objednávanie testov pre pozície
- [ ] Nastavenie požadovaných skóre
- [ ] Prezeranie výsledkov kandidátov

### KROK 2: Admin panel funkcionalita
**Čas: 3-4 dni**

#### 2.1 Dashboard so štatistikami
- [ ] Celkový počet používateľov (kandidáti/firmy/rekrúteri)
- [ ] Počet aktívnych pozícií
- [ ] Počet aplikácií za mesiac
- [ ] Finančné štatistiky (coiny, transakcie)
- [ ] Grafy a vizualizácie

#### 2.2 Správa používateľov
- [ ] Zoznam všetkých používateľov
- [ ] Blokovanie/odblokovanie účtov
- [ ] Editácia profilov
- [ ] Mazanie účtov (GDPR)

#### 2.3 Správa pozícií a aplikácií
- [ ] Moderácia pracovných pozícií
- [ ] Schvaľovanie/zamietanie pozícií
- [ ] Sledovanie aplikačného procesu

---

## FÁZA 2: MULTIJAZYČNOSŤ (PRIORITA 2)

### KROK 3: Implementácia i18n systému
**Čas: 4-5 dní**

#### 3.1 Nastavenie Next.js internationalization
- [ ] Konfigurácia next.config.js pre i18n
- [ ] Middleware pre detekciu jazyka
- [ ] Routing pre rôzne jazyky

#### 3.2 Preklad do 5 hlavných jazykov
- [ ] Slovenčina (už hotovo)
- [ ] Angličtina
- [ ] Nemčina  
- [ ] Čeština
- [ ] Maďarčina

#### 3.3 Jazykový switcher
- [ ] Komponenta pre výber jazyka
- [ ] Uloženie preferencie do localStorage
- [ ] Automatická detekcia jazyka prehliadača

---

## FÁZA 3: POKROČILÉ FUNKCIE (PRIORITA 3)

### KROK 4: Matching algoritmus
**Čas: 6-8 dní**

#### 4.1 AI-powered párovanie
- [ ] Algoritmus pre porovnávanie kandidátov s pozíciami
- [ ] Skórovanie kompatibility
- [ ] Odporúčania pre firmy
- [ ] Odporúčania pre kandidátov

#### 4.2 Anonymné profily
- [ ] Skrývanie osobných údajov
- [ ] Zobrazovanie len relevantných schopností
- [ ] Systém pre odhalenie identity po súhlase

#### 4.3 Pokročilé filtrovanie
- [ ] Filtrovanie podľa testových výsledkov
- [ ] Filtrovanie podľa lokality
- [ ] Filtrovanie podľa platového rozpätia
- [ ] Uložené vyhľadávania

### KROK 5: Notifikačný systém
**Čas: 3-4 dni**

#### 5.1 Email notifikácie
- [ ] Nové aplikácie pre firmy
- [ ] Nové pozície pre kandidátov
- [ ] Statusy aplikácií
- [ ] Pripomienky testov

#### 5.2 In-app notifikácie
- [ ] Real-time notifikácie
- [ ] Notifikačný panel
- [ ] Označovanie ako prečítané

---

## FÁZA 4: PLATOBNÝ SYSTÉM (PRIORITA 4)

### KROK 6: Rozšírenie platobného systému
**Čas: 5-6 dní**

#### 6.1 Integrácia s bankami
- [ ] Stripe integrácia
- [ ] PayPal integrácia
- [ ] SEPA platby
- [ ] Bankové prevody

#### 6.2 Automatické platby
- [ ] Mesačné odpočítavanie 5% z mzdy
- [ ] Automatické obnovenie coinov
- [ ] Faktúry a účtovníctvo

#### 6.3 Kryptomeny (voliteľné)
- [ ] Bitcoin platby
- [ ] Ethereum platby
- [ ] Stablecoin platby

---

## FÁZA 5: OPTIMALIZÁCIA A TESTOVANIE (PRIORITA 5)

### KROK 7: Performance optimalizácia
**Čas: 3-4 dni**

#### 7.1 Databázová optimalizácia
- [ ] Indexy pre rýchle vyhľadávanie
- [ ] Query optimalizácia
- [ ] Caching stratégia

#### 7.2 Frontend optimalizácia
- [ ] Code splitting
- [ ] Image optimization
- [ ] Lazy loading komponentov

### KROK 8: Bezpečnosť a testovanie
**Čas: 4-5 dni**

#### 8.1 Bezpečnostné audity
- [ ] SQL injection testy
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Rate limiting

#### 8.2 Load testing
- [ ] Testovanie výkonu pod záťažou
- [ ] Stress testing
- [ ] Monitoring a alerting

---

## KROK 9: Finálne dokončenie
**Čas: 2-3 dni**

#### 9.1 Bug fixing
- [ ] Oprava nájdených chýb
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing

#### 9.2 Dokumentácia
- [ ] API dokumentácia
- [ ] User manuály
- [ ] Admin príručky

---

## CELKOVÝ ČASOVÝ ODHAD

| Fáza | Čas | Priorita |
|-------|-----|----------|
| Fáza 1: Kritické funkcie | 8-11 dní | Vysoká |
| Fáza 2: Multijazyčnosť | 4-5 dní | Stredná |
| Fáza 3: Pokročilé funkcie | 9-12 dní | Stredná |
| Fáza 4: Platobný systém | 5-6 dní | Nízka |
| Fáza 5: Optimalizácia | 9-12 dní | Nízka |

**CELKOVÝ ČAS: 35-46 dní (7-9 týždňov)**

---

## ODPORÚČANÉ PORADIE IMPLEMENTÁCIE

1. **NAJPRV**: Testovací systém (kritický pre core funkcionalitu)
2. **POTOM**: Admin panel (potrebný pre správu)
3. **NÁSLEDNE**: Multijazyčnosť (rozšírenie trhu)
4. **ĎALEJ**: Matching algoritmus (konkurenčná výhoda)
5. **NAKONIEC**: Optimalizácia a pokročilé funkcie

---

## POZNÁMKY

- Každý krok môže byť implementovaný nezávisle
- Priorita 1 a 2 sú kritické pre launch
- Priorita 3-5 môžu byť implementované postupne po spustení
- Odhadované časy sú pre jedného vývojára
