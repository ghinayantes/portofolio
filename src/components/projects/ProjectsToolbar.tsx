import type { FormEvent, KeyboardEvent, ReactElement } from 'react'
import type { FilterState } from '../../lib/project-filters'

export type TechChip = { id: string; label: string; count: number; disabled: boolean }

type ToolbarProps = {
  lang: 'en' | 'id'
  state: FilterState
  statusCounts: Record<string, number>
  visibleTags: TechChip[]
  overflowTags: TechChip[]
  resultCount: number
  totalCount: number
  onStatus: (s: FilterState['status']) => void
  onToggleTag: (id: string) => void
  onQuery: (q: string) => void
  onSort: (s: FilterState['sort']) => void
  onClear: () => void
}

const chipClass = (active: boolean) =>
  `rounded-full border px-4 py-2 text-sm font-medium ${active ? 'border-brand bg-brand text-ink' : 'border-brand/25 text-fg2 hover:border-brand/50 hover:text-brand'}`

function TechButton({ chip, active, onToggle }: { chip: TechChip; active: boolean; onToggle: (id: string) => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={chip.disabled && !active}
      onClick={() => onToggle(chip.id)}
      className={`${chipClass(active)} projects-tech-chip shrink-0 disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {chip.label} {chip.count}
    </button>
  )
}

function closeDetailsOnEscape(e: KeyboardEvent<HTMLElement>) {
  if (e.key === 'Escape') {
    const details = e.currentTarget as HTMLElement & { open?: boolean }
    if (typeof details.open === 'boolean') details.open = false
    ;(e.currentTarget.querySelector('summary') as HTMLElement | null)?.focus()
  }
}

/** Sticky filter toolbar: status segment, search, sort, tech chips, result summary. Presentational only. */
export function ProjectsToolbar(props: ToolbarProps): ReactElement {
  const id = props.lang === 'id'
  const activeFilter =
    props.state.status !== 'all' || props.state.tags.size > 0 || props.state.q.trim() !== '' || props.state.sort !== 'newest'
  const statusOptions: { value: FilterState['status']; label: string }[] = [
    { value: 'all', label: `${id ? 'Semua' : 'All'} ${props.statusCounts['all'] ?? 0}` },
    { value: 'completed', label: `${id ? 'Selesai' : 'Completed'} ${props.statusCounts['completed'] ?? 0}` },
    { value: 'in-progress', label: `${id ? 'Berjalan' : 'In progress'} ${props.statusCounts['in-progress'] ?? 0}` },
  ]
  const submitSearch = (e: FormEvent) => e.preventDefault()
  return (
    <div className="projects-toolbar">
      <div className="projects-toolbar__row">
        <div role="radiogroup" aria-label={id ? 'Status proyek' : 'Project status'} className="flex flex-wrap gap-2">
          {statusOptions.map((opt) => (
            <label key={opt.value} className={`${chipClass(props.state.status === opt.value)} cursor-pointer has-checked:border-brand has-checked:bg-brand has-checked:text-ink`}>
              <input
                type="radio"
                name="project-status"
                value={opt.value}
                checked={props.state.status === opt.value}
                onChange={() => props.onStatus(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
        <form role="search" onSubmit={submitSearch} className="projects-search">
          <label className="sr-only" htmlFor="project-search">{id ? 'Cari proyek' : 'Search projects'}</label>
          <input
            id="project-search"
            type="search"
            value={props.state.q}
            onChange={(e) => props.onQuery(e.target.value)}
            placeholder={id ? 'Cari…' : 'Search…'}
            autoComplete="off"
          />
        </form>
        <label className="projects-sort">
          <span className="sr-only">{id ? 'Urutkan' : 'Sort'}</span>
          <select value={props.state.sort} onChange={(e) => props.onSort(e.target.value as FilterState['sort'])}>
            <option value="newest">{id ? 'Terbaru' : 'Newest'}</option>
            <option value="az">{id ? 'A–Z' : 'A–Z'}</option>
            <option value="status">{id ? 'Status' : 'Status'}</option>
          </select>
        </label>
      </div>
      <div className="projects-toolbar__row">
        <p className="projects-tech-label">{id ? 'Tech stack' : 'Tech stack'}</p>
        <div className="projects-tech-chips" role="group" aria-label={id ? 'Filter tech stack' : 'Tech stack filter'}>
          {props.visibleTags.map((chip) => (
            <TechButton key={chip.id} chip={chip} active={props.state.tags.has(chip.id)} onToggle={props.onToggleTag} />
          ))}
          {props.overflowTags.length > 0 && (
            <details className="projects-more" onKeyDown={closeDetailsOnEscape}>
              <summary className={chipClass(false)}>{id ? `Lainnya (${props.overflowTags.length})` : `More (${props.overflowTags.length})`}</summary>
              <div className="projects-more__panel" role="group" aria-label={id ? 'Tech stack lainnya' : 'More tech stacks'}>
                {props.overflowTags.map((chip) => (
                  <TechButton key={chip.id} chip={chip} active={props.state.tags.has(chip.id)} onToggle={props.onToggleTag} />
                ))}
              </div>
            </details>
          )}
        </div>
      </div>
      <div className="projects-toolbar__row">
        <p aria-live="polite" className="projects-result">
          {id ? `${props.resultCount} dari ${props.totalCount} proyek` : `${props.resultCount} of ${props.totalCount} projects`}
        </p>
        {activeFilter && (
          <button type="button" onClick={props.onClear} className="projects-clear">
            {id ? 'Hapus filter' : 'Clear filters'}
          </button>
        )}
      </div>
    </div>
  )
}
