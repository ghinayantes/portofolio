'use client'

import { useEffect, useState } from 'react'

export default function WelcomeIntro() {
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (document.documentElement.dataset.welcomeSeen === 'true') {
      setFinished(true)
      return
    }

    const timer = window.setTimeout(() => {
      document.documentElement.dataset.welcomeSeen = 'true'
      setFinished(true)
    }, 1370)

    return () => window.clearTimeout(timer)
  }, [])

  if (finished) return null
  return <div className="welcome-intro" aria-hidden="true"><span>WELCOME</span></div>
}
