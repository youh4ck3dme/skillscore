# Google OAuth Setup Guide

## Krok 1: Vytvor Google OAuth Credentials

1. Choď na [Google Cloud Console](https://console.cloud.google.com/)
2. Vytvor nový projekt alebo vyber existujúci
3. Choď na **APIs & Services** → **Credentials**
4. Klikni **Create Credentials** → **OAuth 2.0 Client ID**
5. Vyber **Web application**
6. Pridaj **Authorized redirect URIs**:
   - Supabase callback (POVINNÉ): `https://your-project-ref.supabase.co/auth/v1/callback`
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://your-domain.com/auth/callback`
7. Skopíruj **Client ID** a **Client Secret**

## Krok 2: Nastav Google OAuth v Supabase

1. Choď do Supabase Dashboard
2. **Authentication** → **Providers**
3. Nájdi **Google** a klikni na nastavenia
4. Zapni **Enable Sign in with Google**
5. Vlož **Client ID** a **Client Secret** z Google Cloud Console
6. V sekcii **Redirect URLs** pridaj:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://your-domain.com/auth/callback`
7. Klikni **Save**

## Krok 3: Nastav Environment Variables

Uisti sa, že máš nastavené tieto environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Krok 4: Testuj

1. Choď na `/auth/register`
2. Vyber typ účtu (Kandidát alebo Recruiter)
3. Klikni na "Pokračovať s Google"
4. Mal by ťa presmerovať na Google prihlásenie
5. Po úspešnom prihlásení ťa presmeruje späť na aplikáciu

## Ako to funguje

1. Používateľ klikne na "Pokračovať s Google"
2. Aplikácia uloží typ používateľa (candidate/recruiter) do localStorage
3. Supabase presmeruje na Google OAuth
4. Google presmeruje späť na `/auth/callback` (Route Handler)
5. Route Handler vymení OAuth kód za session (server-side)
6. Ak profil existuje → presmeruje na dashboard
7. Ak profil neexistuje → vytvorí nový profil a presmeruje na dashboard

## Troubleshooting

### Chyba: "invalid request: both auth code and code verifier should be non-empty"

**Riešenie:**
- Táto chyba sa vyskytuje keď PKCE flow nie je správne nakonfigurovaný
- Uisti sa, že používaš Route Handler (`app/auth/callback/route.ts`) namiesto Page
- Route Handler spracováva OAuth callback na serveri, čo rieši PKCE problémy

### Chyba: "redirect_uri_mismatch"

**Riešenie:**
- Skontroluj, či sú redirect URIs v Google Cloud Console presne rovnaké ako v aplikácii
- Musí sa zhodovať protokol (http/https), doména a cesta
- V Google Cloud Console pridaj VŠETKY tri URIs:
  - Supabase: `https://your-project-ref.supabase.co/auth/v1/callback`
  - Dev: `http://localhost:3000/auth/callback`
  - Prod: `https://your-domain.com/auth/callback`

### Google OAuth nefunguje v produkcii

**Riešenie:**
- Skontroluj, či je production redirect URI pridaný v Google Cloud Console
- Skontroluj, či je production redirect URI pridaný v Supabase Dashboard
- Skontroluj browser console pre chybové hlášky
- Uisti sa, že environment variables sú správne nastavené v Vercel/produkcii
