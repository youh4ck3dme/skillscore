import type React from "react"
import type { Metadata, Viewport } from "next"
import { AuthProvider } from "@/lib/auth/auth-context"
import { I18nProvider } from "@/lib/i18n/context"
import { Suspense } from "react"
import { Footer } from "@/components/footer"

import { GlobalErrorHandler } from "@/components/global-error-handler"

import "./globals.css"

export const metadata: Metadata = {
  title: "SkillScore - Overte svoje remeslo",
  description: "Získajte SkillScore certifikát a odlíšte sa od konkurencie. Profesionálne hodnotenie zručností remeselníkov.",
  generator: "v0.app",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.png",
  },
  appleWebApp: null,
  itunes: null,
  abstract: null,
  other: {
    "mobile-web-app-capable": "yes",
  },
}

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
}

// Force rebuild after revert
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sk" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var origPromise = window.Promise;
                var isAbortError = function(e) {
                  return e && (e.name === 'AbortError' || (e.message && e.message.indexOf('aborted') !== -1));
                };
                window.addEventListener('error', function(e) {
                  if (isAbortError(e.error)) { e.preventDefault(); e.stopImmediatePropagation(); return false; }
                }, true);
                window.addEventListener('unhandledrejection', function(e) {
                  if (isAbortError(e.reason)) { e.preventDefault(); e.stopImmediatePropagation(); return false; }
                }, true);
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <GlobalErrorHandler />
        <Suspense fallback={<div>Loading...</div>}>
          <I18nProvider>
            <AuthProvider>
              {children}
              <Footer />

            </AuthProvider>
          </I18nProvider>
        </Suspense>
      </body>
    </html>
  )
}
