import type { ReactNode } from 'react'

/** Re-mounts on every navigation, so each page fades/slides in. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-in">{children}</div>
}
