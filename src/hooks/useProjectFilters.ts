'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { facetCounts, filterProjectsV2, parseProjectSearchParams, serializeProjectFilters, type FilterState, type FilterableProject } from '../lib/project-filters'

const DEFAULTS: FilterState = { status: 'all', tags: new Set<string>(), q: '', sort: 'newest' }

export function useProjectFilters(opts: { lang: 'en' | 'id'; projects: FilterableProject[]; syncUrl: boolean; tagLabels: (id: string) => string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [state, setState] = useState<FilterState>(DEFAULTS)
  const [query, setQueryState] = useState<string>('')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!opts.syncUrl) return
    const params = new URLSearchParams(searchParams.toString())
    const parsed = parseProjectSearchParams(params)
    setState(parsed)
    setQueryState(parsed.q)
  }, [searchParams, opts.syncUrl])

  const writeUrl = useCallback((next: FilterState) => {
    if (!opts.syncUrl) return
    const qs = serializeProjectFilters(next)
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [opts.syncUrl, pathname, router])

  const setStatus = useCallback((status: FilterState['status']) => {
    setState((prev) => {
      const next: FilterState = { ...prev, status }
      writeUrl(next)
      return next
    })
  }, [writeUrl])

  const toggleTag = useCallback((id: string) => {
    setState((prev) => {
      const tags = new Set(prev.tags)
      if (tags.has(id)) tags.delete(id)
      else tags.add(id)
      const next: FilterState = { ...prev, tags }
      writeUrl(next)
      return next
    })
  }, [writeUrl])

  const setQuery = useCallback((q: string) => {
    setQueryState(q)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setState((prev) => {
        const next: FilterState = { ...prev, q }
        writeUrl(next)
        return next
      })
    }, 200)
  }, [writeUrl])

  const setSort = useCallback((sort: FilterState['sort']) => {
    setState((prev) => {
      const next: FilterState = { ...prev, sort }
      writeUrl(next)
      return next
    })
  }, [writeUrl])

  const clear = useCallback(() => {
    const next: FilterState = { ...DEFAULTS, tags: new Set<string>() }
    setQueryState('')
    setState(next)
    writeUrl(next)
  }, [writeUrl])

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
