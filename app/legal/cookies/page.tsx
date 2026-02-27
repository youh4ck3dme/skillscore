import { CookiePolicy } from "@/components/legal/cookie-policy"

export const metadata = {
  title: "Cookie Policy | SOMVIAC",
  description:
    "Zásady používania cookies na platforme SOMVIAC - informácie o tom, ako používame cookies a ako ich môžete spravovať.",
}

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto py-8">
      <CookiePolicy />
    </div>
  )
}
