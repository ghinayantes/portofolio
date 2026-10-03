import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { SettingsProvider } from './context/Settings'
import { ALL } from './data/nav'
import Layout from './components/Layout'
import { PageShell } from './components/ui'
import Home from './pages/Home'
import { PAGES } from './pages'

const NotFound = () => (
  <div className="py-24 text-center">
    <h1 className="grad-text font-display text-7xl font-extrabold">404</h1>
    <p className="mt-3 text-fg2">This page does not exist.</p>
    <Link to="/" className="btn-primary mt-6">Back home</Link>
  </div>
)

export default function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            {ALL.map((item) => {
              const Page = PAGES[item.key]
              return <Route key={item.key} path={item.key} element={<PageShell item={item} gi={item.gi}><Page /></PageShell>} />
            })}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  )
}
