-- Script pre pridanie coinov užívateľovi
-- Použi tento script na simuláciu nákupu coinov

-- 1. Najprv nájdi user ID firmy podľa emailu alebo mena
-- SELECT id, email, company_name FROM profiles WHERE user_type = 'company';

-- 2. Pridaj coiny užívateľovi (nahraď USER_ID_HERE skutočným UUID)
-- Príklad: pridanie 100 coinov

-- Ak užívateľ ešte nemá záznam v user_balances, vytvor ho:
INSERT INTO user_balances (id, coin_balance, updated_at)
VALUES (
  '23f18cbf-ca45-46fe-a9aa-171e2467f987',  -- <-- Nahraď skutočným user ID
  1000,                                       -- <-- Počet coinov
  NOW()
)
ON CONFLICT (id) 
DO UPDATE SET 
  coin_balance = user_balances.coin_balance + 1000,  -- <-- Pridá 100 coinov k existujúcemu zostatku
  updated_at = NOW();

-- 3. Voliteľne: Zaznamenaj transakciu
INSERT INTO coin_transactions (id, user_id, amount, transaction_type, description, created_at)
VALUES (
  gen_random_uuid(),
  '23f18cbf-ca45-46fe-a9aa-171e2467f987',  -- <-- Rovnaké user ID
  100,                                       -- <-- Rovnaký počet coinov
  'admin_credit',
  'Testovací kredit od admina',
  NOW()
);

-- 4. Over zostatok
SELECT id, coin_balance FROM user_balances 
WHERE id = '23f18cbf-ca45-46fe-a9aa-171e2467f987';
