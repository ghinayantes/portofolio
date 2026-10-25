'use client'

import { Timeline } from './cards'
import { Reveal } from './motion'
import { useSettings } from '../context/Settings'
import { education, organizations, projects, work } from '../data/content'
import { localized, pair, type Pair } from '../data/nav'

type Course = {
  code: string
  title: string
  credits: number
  grade: string | null
  curriculumSemester: number
  inTranscript: boolean
}

type Term = {
  title: string
  status: 'completed' | 'current'
  courses: Course[]
  totalCredits: number
  nr: string | null
}

type Coursework = { project: (typeof projects)[number]; course: Pair }
type AcademicActivity = { title: string; period: string; description: string }

const courseworkBySlug: Record<string, Pair> = {
  'food-waste-stop': pair('Software Engineering', 'Rekayasa Perangkat Lunak'),
  sos: pair('Operating Systems', 'Sistem Operasi'),
  alproshell: pair('Informatics coursework', 'Perkuliahan Informatika'),
  'uni-uno-card-game': pair('Computational Logic', 'Logika Komputasional'),
}

const terms: Term[] = [
  {
    title: 'Semester 1 · 2025/2026', status: 'completed', totalCredits: 18, nr: '3.78',
    courses: [
      { code: 'FI1101-24', title: 'Fisika Dasar I', credits: 3, grade: 'A', curriculumSemester: 1, inTranscript: true },
      { code: 'KI1101-24', title: 'Kimia Dasar I', credits: 3, grade: 'B', curriculumSemester: 1, inTranscript: true },
      { code: 'MA1101-24', title: 'Matematika I', credits: 4, grade: 'A', curriculumSemester: 1, inTranscript: true },
      { code: 'WI1102-24', title: 'Berpikir Komputasional', credits: 2, grade: 'A', curriculumSemester: 1, inTranscript: true },
      { code: 'WI1103-24', title: 'Pengantar Prinsip Keberlanjutan', credits: 2, grade: 'AB', curriculumSemester: 1, inTranscript: true },
      { code: 'WI1111-24', title: 'Laboratorium Fisika Dasar', credits: 1, grade: 'A', curriculumSemester: 1, inTranscript: true },
      { code: 'WI1116-24', title: 'Laboratorium Interaksi Komputer', credits: 1, grade: 'A', curriculumSemester: 1, inTranscript: true },
      { code: 'WI2005-24', title: 'Bahasa Indonesia', credits: 2, grade: 'A', curriculumSemester: 1, inTranscript: true },
    ],
  },
  {
    title: 'Semester 2 · 2025/2026', status: 'completed', totalCredits: 18, nr: '4.00',
    courses: [
      { code: 'IF1210-24', title: 'Algoritma dan Pemrograman 1', credits: 3, grade: 'A', curriculumSemester: 2, inTranscript: true },
      { code: 'IF1220-24', title: 'Matematika Diskrit', credits: 3, grade: 'A', curriculumSemester: 2, inTranscript: true },
      { code: 'IF1221-24', title: 'Logika Komputasional', credits: 2, grade: 'A', curriculumSemester: 2, inTranscript: true },
      { code: 'IF1230-24', title: 'Organisasi dan Arsitektur Komputer', credits: 3, grade: 'A', curriculumSemester: 2, inTranscript: true },
      { code: 'WI1101-24', title: 'Pancasila', credits: 2, grade: 'A', curriculumSemester: 2, inTranscript: true },
      { code: 'WI2001-24', title: 'Pengenalan Rekayasa dan Desain', credits: 3, grade: 'A', curriculumSemester: 2, inTranscript: true },
      { code: 'WI2002-24', title: 'Literasi Data dan Inteligensi Artifisial', credits: 2, grade: 'A', curriculumSemester: 2, inTranscript: true },
    ],
  },
  {
    title: 'Semester 1 · 2026/2027', status: 'current', totalCredits: 21, nr: null,
    courses: [
      { code: 'IF2110-24', title: 'Algoritma dan Pemrograman 2', credits: 3, grade: null, curriculumSemester: 3, inTranscript: false },
      { code: 'IF2120-24', title: 'Probabilitas dan Statistika', credits: 3, grade: null, curriculumSemester: 3, inTranscript: false },
      { code: 'IF2123-24', title: 'Aljabar Linier dan Geometri', credits: 3, grade: null, curriculumSemester: 3, inTranscript: false },
      { code: 'IF2130-24', title: 'Sistem Operasi', credits: 3, grade: null, curriculumSemester: 3, inTranscript: false },
      { code: 'IF2150-24', title: 'Rekayasa Perangkat Lunak', credits: 4, grade: null, curriculumSemester: 3, inTranscript: false },
      { code: 'IF2180-24', title: 'Sosio-informatika dan Profesionalisme', credits: 2, grade: null, curriculumSemester: 3, inTranscript: false },
      { code: 'KU4078-24', title: 'Studium Generale', credits: 2, grade: null, curriculumSemester: 7, inTranscript: false },
      { code: 'WI2003-24', title: 'Olah Raga', credits: 1, grade: null, curriculumSemester: 3, inTranscript: false },
    ],
  },
]

function TranscriptTable({ term, isIndonesian }: { term: Term; isIndonesian: boolean }) {
  const labels = isIndonesian
    ? { code: 'Kode', course: 'Mata kuliah', credits: 'SKS', grade: 'Nilai', curriculum: 'Sem. kurikulum', included: 'Masuk transkrip', pending: 'Belum dinilai', yes: 'Ya', no: 'Belum' }
    : { code: 'Code', course: 'Course', credits: 'Credits', grade: 'Grade', curriculum: 'Curriculum sem.', included: 'In transcript', pending: 'Pending', yes: 'Yes', no: 'No' }

  return (
    <section className="transcript-term" aria-label={term.title}>
      <header className="transcript-term__heading">
        <h3>{term.title}</h3>
        {term.status === 'current' && <span>{isIndonesian ? 'Berjalan' : 'In progress'}</span>}
      </header>
      <div className="transcript-table-scroll" role="region" aria-label={`${isIndonesian ? 'Tabel transkrip' : 'Transcript table'}: ${term.title}`} tabIndex={0}>
        <table className="transcript-table">
          <thead><tr>
            <th scope="col">No.</th><th scope="col">{labels.code}</th><th scope="col">{labels.course}</th>
            <th scope="col" className="transcript-table__number">{labels.credits}</th><th scope="col">{labels.grade}</th>
            <th scope="col" className="transcript-table__number">{labels.curriculum}</th><th scope="col">{labels.included}</th>
          </tr></thead>
          <tbody>{term.courses.map((course, index) => (
            <tr key={course.code}>
              <td className="transcript-table__number">{index + 1}</td><td className="transcript-table__code">{course.code}</td>
              <td>{course.title}</td><td className="transcript-table__number">{course.credits}</td>
              <td className={course.grade ? 'transcript-table__grade' : 'transcript-table__pending'}>{course.grade ?? labels.pending}</td>
              <td className="transcript-table__number">{course.curriculumSemester}</td>
              <td><span className={`transcript-table__status${course.inTranscript ? ' is-included' : ''}`} aria-label={course.inTranscript ? labels.yes : labels.no}>{course.inTranscript ? '✓' : '—'}</span></td>
            </tr>
          ))}</tbody>
          <tfoot><tr>
            <th scope="row" colSpan={3}>{isIndonesian ? 'Total semester' : 'Semester total'}</th>
            <td className="transcript-table__number">{term.totalCredits}</td>
            <td colSpan={3} className="transcript-table__nr">NR {term.nr ?? '—'}</td>
          </tr></tfoot>
        </table>
      </div>
    </section>
  )
}

export default function EducationPage() {
  const { lang } = useSettings()
  const isIndonesian = lang === 'id'
  const coursework: Coursework[] = projects.flatMap((project) => {
    const course = project.slug ? courseworkBySlug[project.slug] : undefined
    return course ? [{ project, course }] : []
  })
  const academicActivities: AcademicActivity[] = [
    ...work
      .filter((entry) => localized(entry.role, 'en') === 'Computational Thinking Teaching Assistant')
      .map((entry) => ({
        title: localized(entry.role, lang),
        period: localized(entry.when, lang),
        description: localized(entry.desc, lang),
      })),
    ...organizations
      .filter((entry) => {
        const title = localized(entry.title, 'en')
        return title.startsWith('IUP Mathematics Class Tutor')
          || title.startsWith('Academic Staff -')
          || title.startsWith('Curriculum Staff -')
      })
      .map((entry) => ({
        title: localized(entry.title, lang),
        period: localized(entry.when, lang),
        description: localized(entry.desc, lang),
      })),
  ]
  return (
    <div className="education-page">
      <Reveal className="education-reveal">
        <section className="education-history" aria-labelledby="education-history-title">
          <h2 id="education-history-title">{isIndonesian ? 'Riwayat pendidikan' : 'Education history'}</h2>
          <Timeline items={education} />
        </section>
      </Reveal>
      <section className="education-transcript" aria-labelledby="education-transcript-title">
        <Reveal className="education-transcript__reveal">
        <header className="education-transcript__header">
          <div>
            <p className="education-transcript__eyebrow">INSTITUT TEKNOLOGI BANDUNG</p>
            <h2 id="education-transcript-title">{isIndonesian ? 'Rekam Akademik' : 'Academic Record'}</h2>
            <p className="education-transcript__degree">{isIndonesian ? 'Sarjana Informatika' : 'Bachelor of Science in Informatics'}</p>
          </div>
          <div className="education-gpa" aria-label={isIndonesian ? 'IPK kumulatif 3,89 dari 4,00, 36 SKS lulus' : 'Cumulative GPA 3.89 out of 4.00, 36 credits completed'}>
            <span className="education-gpa__label">{isIndonesian ? 'IPK KUMULATIF' : 'CUMULATIVE GPA'}</span>
            <p><strong>{isIndonesian ? '3,89' : '3.89'}</strong><span>/ 4.00</span></p>
            <small>{isIndonesian ? '36 SKS lulus' : '36 credits completed'}</small>
          </div>
        </header>
        </Reveal>
        <div className="education-transcript__terms">
          {terms.map((term, index) => (
            <Reveal className="education-transcript__reveal" index={index} key={term.title}>
              <TranscriptTable term={term} isIndonesian={isIndonesian} />
            </Reveal>
          ))}
        </div>
        <Reveal className="education-transcript__reveal">
        <section className="grade-conversion" aria-labelledby="grade-conversion-title">
          <h3 id="grade-conversion-title">{isIndonesian ? 'Konversi Nilai' : 'Grade Conversion'}</h3>
          <div className="grade-conversion__list">
            {[
              ['A', '4.0'], ['AB', '3.5'], ['B', '3.0'], ['BC', '2.5'], ['C', '2.0'], ['D', '1.0'], ['E', '0.0'], ['P', isIndonesian ? 'Lulus' : 'Pass'], ['F', isIndonesian ? 'Gagal' : 'Fail'],
            ].map(([grade, value]) => (
              <div className="grade-conversion__item" key={grade}><strong>{grade}</strong><span>= {value}</span></div>
            ))}
          </div>
        </section>
        </Reveal>
      </section>
      <section className="education-extra" aria-label={isIndonesian ? 'Proyek perkuliahan dan aktivitas akademik' : 'Course projects and academic activities'}>
        <Reveal className="education-reveal">
        <section className="education-extra__section" aria-labelledby="coursework-title">
          <h2 id="coursework-title">{isIndonesian ? 'Proyek perkuliahan' : 'Course projects'}</h2>
          <div className="education-coursework">
            {coursework.map(({ project, course }, index) => {
              const links = project.links.flatMap((link, index) => {
                const href = project.linkHrefs?.[index]
                return href ? [{ label: localized(link, lang), href }] : []
              })
              return (
                <Reveal className="education-coursework__reveal" index={index} key={project.slug}>
                <article className="education-coursework__item">
                  <p className="education-coursework__course">{localized(course, lang)}</p>
                  <h3>{localized(project.title, lang)}</h3>
                  <p className="education-coursework__description">{localized(project.desc, lang)}</p>
                  <div className="education-coursework__footer">
                    <span>{project.tags.map((tag) => localized(tag, lang)).join(' · ')}</span>
                    {links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}
                  </div>
                </article>
                </Reveal>
              )
            })}
          </div>
        </section>
        </Reveal>
        <Reveal className="education-reveal" index={1}>
        <section className="education-extra__section" aria-labelledby="academic-activities-title">
          <h2 id="academic-activities-title">{isIndonesian ? 'Aktivitas akademik' : 'Academic activities'}</h2>
          <div className="education-activities">
            {academicActivities.map((activity, index) => (
              <Reveal className="education-activities__reveal" index={index} key={`${activity.title}-${activity.period}`}>
              <article className="education-activities__item">
                <div className="education-activities__heading">
                  <h3>{activity.title}</h3><time>{activity.period}</time>
                </div>
                <p>{activity.description}</p>
              </article>
              </Reveal>
            ))}
          </div>
        </section>
        </Reveal>
      </section>
    </div>
  )
}
