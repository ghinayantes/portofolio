'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { sanitizeTechIds } from '../lib/project-tags'
import { facetCounts, filterProjectsV2, parseProjectSearchParams, serializeProjectFilters, type FilterState, type FilterableProject } from '../lib/project-filters'

const freshDefaults = (): FilterState => ({ status: 'all', tags: new Set<string>(), q: '', sort: 'newest' })

export function useProjectFilters(opts: { lang: 'en' | 'id'; projects: FilterableProject[]; syncUrl: boolean; tagLabels: (id: string) => string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [state, setState] = useState<FilterState>(freshDefaults)
  const [query, setQueryState] = useState<string>('')
  const timer = useRef<number | undefined>(undefined)
  const stateRef = useRef<FilterState>(state)
  stateRef.current = state

  useEffect(() => () => window.clearTimeout(timer.current), [])

  useEffect(() => {
    if (!opts.syncUrl) return
    window.clearTimeout(timer.current)
    const parsed = parseProjectSearchParams(new URLSearchParams(searchParams.toString()))
    parsed.tags = sanitizeTechIds(parsed.tags)
    setState(parsed)
    setQueryState(parsed.q)
  }, [searchParams, opts.syncUrl])

  const writeUrl = useCallback((next: FilterState, currentSearch: string) => {
    if (!opts.syncUrl) return
    const qs = serializeProjectFilters(next)
    if (qs === currentSearch) return
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [opts.syncUrl, pathname, router])

  const setStatus = useCallback((status: FilterState['status']) => {
    const next: FilterState = { ...state, status }
    setState(next)
    writeUrl(next, searchParams.toString())
  }, [state, searchParams, writeUrl])

  const toggleTag = useCallback((id: string) => {
    const tags = new Set(state.tags)
    if (tags.has(id)) tags.delete(id)
    else tags.add(id)
    const next: FilterState = { ...state, tags }
    setState(next)
    writeUrl(next, searchParams.toString())
  }, [state, searchParams, writeUrl])

  const setQuery = useCallback((q: string) => {
    setQueryState(q)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      const next: FilterState = { ...stateRef.current, q }
      setState(next)
      writeUrl(next, searchParams.toString())
    }, 200)
  }, [searchParams, writeUrl])

  const setSort = useCallback((sort: FilterState['sort']) => {
    const next: FilterState = { ...state, sort }
    setState(next)
    writeUrl(next, searchParams.toString())
  }, [state, searchParams, writeUrl])

  const clear = useCallback(() => {
    const next: FilterState = freshDefaults()
    setQueryState('')
    window.clearTimeout(timer.current)
    setState(next)
    writeUrl(next, searchParams.toString())
  }, [searchParams, writeUrl])

  const results = useMemo(
    () => filterProjectsV2(opts.projects, { ...state, q: query }, opts.lang, opts.tagLabels),
    [opts.projects, state, query, opts.lang, opts.tagLabels],
  )
  const counts = useMemo(
    () => facetCounts(opts.projects, { ...state, q: query }, opts.lang, opts.tagLabels),
    [opts.projects, state, query, opts.lang, opts.tagLabels],
  )
  return { state: { ...state, q: query }, results, counts, setStatus, toggleTag, setQuery, setSort, clear }
}
