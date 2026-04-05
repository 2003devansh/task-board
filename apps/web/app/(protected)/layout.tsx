// app/(protected)/layout.tsx
"use client"

import { useEffect } from "react"
import { isAuthenticated } from "../../lib/api"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = "/login"
    }
  }, [])

  return <>{children}</>
}