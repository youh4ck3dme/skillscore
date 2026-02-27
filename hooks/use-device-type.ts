"use client"

import * as React from "react"

// Updated breakpoints for better device detection
const MOBILE_BREAKPOINT = 640 // sm breakpoint
const TABLET_BREAKPOINT = 1024 // lg breakpoint

export type DeviceType = "mobile" | "tablet" | "desktop"

export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = React.useState<DeviceType>("desktop")

  React.useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth
      if (width < MOBILE_BREAKPOINT) {
        setDeviceType("mobile")
      } else if (width < TABLET_BREAKPOINT) {
        setDeviceType("tablet")
      } else {
        setDeviceType("desktop")
      }
    }

    // Set initial value
    updateDeviceType()

    // Listen for resize events
    window.addEventListener("resize", updateDeviceType)
    return () => window.removeEventListener("resize", updateDeviceType)
  }, [])

  return deviceType
}

// Keep the old hook for backward compatibility
export function useIsMobile(): boolean {
  const deviceType = useDeviceType()
  return deviceType === "mobile"
}

// New hooks for specific device types
export function useIsTablet(): boolean {
  const deviceType = useDeviceType()
  return deviceType === "tablet"
}

export function useIsDesktop(): boolean {
  const deviceType = useDeviceType()
  return deviceType === "desktop"
}
