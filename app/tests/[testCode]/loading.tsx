import { Loader2 } from "lucide-react"

export default function TestLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-lg text-muted-foreground">Načítavam test...</p>
      </div>
    </div>
  )
}
