import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <h1 className="grad-text font-display text-7xl font-extrabold">404</h1>
      <p className="mt-3 text-fg2">This page does not exist.</p>
      <Link href="/" className="btn-primary mt-6">Back home</Link>
    </div>
  )
}
