'use client'

import { useEffect } from 'react'
import { hydrateAuthStore } from '@/store/authStore'

export default function AuthHydration({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    hydrateAuthStore()
  }, [])

  return <>{children}</>
}
