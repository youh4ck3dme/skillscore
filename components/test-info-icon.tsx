"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TestInfoIconProps {
  testCode: string
  testInfo: {
    tooltip: string
    why: string
    why_text: string
    what: string
    what_points: string[]
    tells: string
    tells_text: string
  }
  className?: string
}

export function TestInfoIcon({ testCode, testInfo, className }: TestInfoIconProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn("p-1 hover:bg-muted rounded flex-shrink-0 transition-colors", className)}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setModalOpen(true)
              }}
              type="button"
            >
              <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-teal-600 transition-colors" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <p className="text-xs">{testInfo.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{testCode}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Why Section */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{testInfo.why}</h3>
              <p className="text-muted-foreground leading-relaxed">{testInfo.why_text}</p>
            </div>

            {/* What It Checks Section */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">{testInfo.what}</h3>
              <ul className="space-y-2">
                {testInfo.what_points.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tells Section */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{testInfo.tells}</h3>
              <p className="text-muted-foreground leading-relaxed">{testInfo.tells_text}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
