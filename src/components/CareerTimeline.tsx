'use client'

import { useEffect, useMemo, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa6'
import * as C from '../data/content'
import { localized } from '../data/nav'
import type { Lang } from '../lib/i18n'
import { Reveal } from './motion'

type TimelineCategory = 'work' | 'project' | 'award' | 'education'
type TimelineFilter = 'all' | TimelineCategory
type FlowBreakpoint = 'mobile' | 'tablet' | 'desktop'

type TimelineEntry = {
  id: string
  category: TimelineCategory
  title: string
  dateLabel: string
  year: number | null
  timestamp: number | null
  organization?: string
  location?: string
  description: string
  highlights: string[]
  tags: string[]
}


const categoryNames: Record<TimelineCategory, { en: string; id: string }> = {
  work: { en: 'Work', id: 'Kerja' },
  project: { en: 'Projects', id: 'Proyek' },
  award: { en: 'Awards', id: 'Penghargaan' },
  education: { en: 'Education', id: 'Pendidikan' },
}

function getDateParts(value: string): { year: number | null; timestamp: number | null } {
  const firstDate = value.trim().split(/\s+(?:–|—|-)\s+/)[0]
  const matchedYear = value.match(/\b(?:19|20)\d{2}\b/)?.[0]
  const year = matchedYear ? Number(matchedYear) : null
  const parsedTimestamp = Date.parse(firstDate)
  return {
    year,
    timestamp: Number.isFinite(parsedTimestamp) ? parsedTimestamp : year ? Date.UTC(year, 0, 1) : null,
  }
}

function projectDateLabel(value: string | undefined, lang: Lang): string {
  if (!value) return lang === 'id' ? 'Tanpa tanggal' : 'Undated'
  const date = new Date(`${value}T12:00:00Z`)
  if (!Number.isFinite(date.getTime())) return value
  return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

function createTimelineEntries(lang: Lang): TimelineEntry[] {
  const undated = lang === 'id' ? 'Tanpa tanggal' : 'Undated'

  const workEntries: TimelineEntry[] = C.work.map((entry, index) => {
    const sourceDate = entry.when.en
    const parsed = getDateParts(sourceDate)
    return {
      id: `work-${index}`,
      category: 'work',
      title: localized(entry.role, lang),
      dateLabel: localized(entry.when, lang) || undated,
      ...parsed,
      organization: localized(entry.company, lang),
      location: localized(entry.location, lang),
      description: localized(entry.desc, lang),
      highlights: entry.highlights.map((item) => localized(item, lang)),
      tags: entry.tech,
    }
  })

  const projectEntries: TimelineEntry[] = C.projects.map((entry, index) => {
    const sourceDate = entry.date ?? ''
    const parsed = getDateParts(sourceDate)
    return {
      id: `project-${entry.slug ?? index}`,
      category: 'project',
      title: localized(entry.title, lang),
      dateLabel: projectDateLabel(entry.date, lang),
      ...parsed,
      description: localized(entry.desc, lang),
      highlights: [],
      tags: entry.tags.map((tag) => localized(tag, lang)),
    }
  })

  const awardEntries: TimelineEntry[] = C.awards.map((entry, index) => {
    const sourceDate = entry.date?.en ?? entry.meta.en
    const parsed = getDateParts(sourceDate)
    const description = localized(entry.desc, lang)
    const bullets = entry.bullets?.map((item) => localized(item, lang)).filter((item) => item !== description) ?? []
    return {
      id: `award-${index}`,
      category: 'award',
      title: localized(entry.title, lang),
      dateLabel: entry.date ? localized(entry.date, lang) : localized(entry.meta, lang) || undated,
      ...parsed,
      organization: entry.org ? localized(entry.org, lang) : undefined,
      description,
      highlights: bullets,
      tags: entry.category ? [localized(entry.category, lang)] : [],
    }
  })

  const educationEntries: TimelineEntry[] = C.education.map((entry, index) => {
    const sourceDate = entry.when.en
    const parsed = getDateParts(sourceDate)
    return {
      id: `education-${index}`,
      category: 'education',
      title: localized(entry.title, lang),
      dateLabel: localized(entry.when, lang) || undated,
      ...parsed,
      description: localized(entry.desc, lang),
      highlights: [],
      tags: [],
    }
  })

  return [...workEntries, ...projectEntries, ...awardEntries, ...educationEntries].sort((a, b) => {
    if (a.timestamp === null) return b.timestamp === null ? 0 : 1
    if (b.timestamp === null) return -1
    return b.timestamp - a.timestamp
  })
}

export default function CareerTimeline({ lang }: { lang: Lang }) {
  const id = lang === 'id'
  const [filter, setFilter] = useState<TimelineFilter>('all')
  const [flowBreakpoint, setFlowBreakpoint] = useState<FlowBreakpoint>('mobile')
  const [openEntryId, setOpenEntryId] = useState<string | null>(null)
  useEffect(() => {
    const updateBreakpoint = () => setFlowBreakpoint(window.innerWidth >= 1024 ? 'desktop' : window.innerWidth >= 768 ? 'tablet' : 'mobile')
    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])
  const allEntries = useMemo(() => createTimelineEntries(lang), [lang])
  const entries = useMemo(
    () => filter === 'all' ? allEntries : allEntries.filter((entry) => entry.category === filter),
    [allEntries, filter],
  )
  const flowRows = useMemo(() => {
    const pattern = flowBreakpoint === 'desktop' ? [3, 4, 5, 4, 3, 5] : flowBreakpoint === 'tablet' ? [2] : [1]
    const rows: TimelineEntry[][] = []
    let offset = 0
    while (offset < entries.length) {
      const rowSize = pattern[rows.length % pattern.length]
      rows.push(entries.slice(offset, offset + rowSize))
      offset += rowSize
    }
    return rows
  }, [entries, flowBreakpoint])

  const filters: { key: TimelineFilter; label: string; count: number }[] = [
    { key: 'all', label: id ? 'Semua' : 'All', count: allEntries.length },
    ...(['work', 'project', 'award', 'education'] as const).map((category) => ({
      key: category,
      label: categoryNames[category][lang],
      count: allEntries.filter((entry) => entry.category === category).length,
    })),
  ]

  const renderCard = (entry: TimelineEntry, index: number) => {
    const expanded = openEntryId === entry.id
    const detailsId = `timeline-details-${entry.id}`
    const categoryLabel = categoryNames[entry.category][lang]
    return (
      <Reveal index={index}>
        <article className={`unified-timeline__card${expanded ? ' is-expanded' : ''}`} data-category={entry.category}>
          <button
            type="button"
            className="unified-timeline__summary"
            aria-expanded={expanded}
            aria-controls={detailsId}
            onClick={() => setOpenEntryId((current) => current === entry.id ? null : entry.id)}
          >
            <span className="unified-timeline__meta">
              <span className="unified-timeline__date">{entry.dateLabel}</span>
              <span className="unified-timeline__category">{categoryLabel}</span>
            </span>
            <span className="unified-timeline__title-row">
              <span className="unified-timeline__title">{entry.title}</span>
              <FaChevronDown className={`unified-timeline__chevron${expanded ? ' is-open' : ''}`} aria-hidden="true" />
            </span>
            {entry.organization && <span className="unified-timeline__organization">{entry.organization}{entry.location ? ` · ${entry.location}` : ''}</span>}
          </button>
          <div id={detailsId} className={`unified-timeline__details${expanded ? ' is-open' : ''}`} aria-hidden={!expanded}>
            <div className="unified-timeline__details-inner">
              <p>{entry.description}</p>
              {entry.highlights.length > 0 && (
                <ul>{entry.highlights.map((highlight, highlightIndex) => <li key={highlightIndex}>{highlight}</li>)}</ul>
              )}
              {entry.tags.length > 0 && (
                <div className="unified-timeline__tags">
                  {entry.tags.map((tag, tagIndex) => <span key={`${entry.id}-tag-${tagIndex}`}>{tag}</span>)}
                </div>
              )}
            </div>
          </div>
        </article>
      </Reveal>
    )
  }

  return (
    <div className="unified-timeline unified-timeline--flow">
      <div className="unified-timeline__filters" role="group" aria-label={id ? 'Filter timeline' : 'Timeline filters'}>
        {filters.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`unified-timeline__filter${filter === item.key ? ' is-active' : ''}`}
            aria-pressed={filter === item.key}
            onClick={() => {
              setFilter(item.key)
              setOpenEntryId(null)
            }}
          >
            <span>{item.label}</span>
            <span className="unified-timeline__count">{item.count}</span>
          </button>
        ))}
      </div>

      <div className="unified-timeline__groups" aria-live="polite">
        <div className={`unified-timeline__flow unified-timeline__flow--${flowBreakpoint}`}>
          {flowRows.map((rowEntries, rowIndex) => (
            <ol className={`unified-timeline__flow-row${rowIndex % 2 ? ' is-return' : ''}`} key={`flow-${rowIndex}`}>
              {rowEntries.map((entry, index) => (
                <li className={`unified-timeline__flow-item${index === rowEntries.length - 1 && rowIndex < flowRows.length - 1 ? ' is-turn' : ''}`} key={entry.id}>
                  <div className="unified-timeline__flow-rail" aria-hidden="true"><span /></div>
                  {renderCard(entry, rowIndex * 5 + index)}
                </li>
              ))}
            </ol>
          ))}
        </div>
        {entries.length === 0 && <p className="unified-timeline__empty">{id ? 'Tidak ada entri di kategori ini.' : 'No entries in this category.'}</p>}
      </div>
    </div>
  )
}
