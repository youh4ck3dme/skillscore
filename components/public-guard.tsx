"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";

const PUBLIC_ROUTES = [
  "/",
  "/praca-v-zahranici",
  "/zivotopis-a-cv",
  "/testovanie-kandidatov",
  "/pre-firmy",
  "/kontakt",
  "/info",
  "/legal",
];

// čo považujeme za "app" zónu (len pre prihlásených)
const PROTECTED_PREFIXES = ["/dashboard", "/admin"];

export function PublicGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const isPublic = PUBLIC_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  useEffect(() => {
    // PUBLIC stránky nechaj tak – nikdy nepresmeruj na login
    if (isPublic) return;

    // Ak niekto ide na dashboard/admin bez loginu -> hoď ho na hlavnú
    if (isProtected && !user) {
      router.replace("/");
    }
  }, [isPublic, isProtected, user, router]);

  return null;
}
