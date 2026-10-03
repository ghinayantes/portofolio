export type Project = { title: string; desc: string; tags: string[]; links: string[]; status?: string; wip?: boolean }
export type Entry = { title: string; when: string; desc: string; current?: boolean }
export type Note = { meta: string; title: string; desc: string }
export type SkillGroup = { title: string; items: string[] }

export const projects: Project[] = [
  { title: 'Food Waste Stop', status: 'Completed', desc: 'A web app that connects people with surplus food so less of it is thrown away. Built with a team for a software engineering course.', tags: ['Web app', 'Use case design', 'Team of 4'], links: ['Live site', 'GitHub', 'Case study'] },
  { title: 'Portfolio Website', status: 'In progress', wip: true, desc: 'This site: designed in Figma, then built with React and Tailwind.', tags: ['Figma', 'React', 'Tailwind'], links: ['GitHub'] },
  { title: 'Event Session Design', status: 'Completed', desc: 'A learning session for a campus orientation program, from outline to run-of-show.', tags: ['Planning', 'Facilitation'], links: ['Case study'] },
]
export const organizations: Entry[] = [
  { title: 'Committee Member, OSKM ITB 2026', when: '2026 – Present', desc: 'Designing a learning session for new students and coordinating with other divisions.', current: true },
  { title: 'PSP Excellence', when: '2025 – Present', desc: 'Scholarship and mentorship program at ITB.', current: true },
]
export const education: Entry[] = [
  { title: 'Informatics Engineering, ITB', when: '2025 – Present', desc: 'Focus: software engineering and web development.', current: true },
  { title: 'High school', when: '2022 – 2025', desc: 'Add your school, major, and activities.' },
]
export const milestones: Entry[] = [
  { title: 'OSKM ITB 2026 committee', when: '2026', desc: 'Designing a learning session.', current: true },
  { title: 'PSP Excellence', when: '2025', desc: 'Joined the scholarship and mentorship program.' },
  { title: 'Started at ITB', when: '2025', desc: 'Informatics Engineering.' },
  { title: 'Finished high school', when: '2025', desc: 'Add your milestone.' },
]
export const awards: Note[] = [
  { meta: '2026', title: 'Award name', desc: 'Organizer and one line on why it mattered.' },
  { meta: '2025', title: 'Scholarship grantee', desc: 'Selected for a scholarship and mentorship program.' },
]
export const certificates: Note[] = [
  { meta: 'Issuer, 2026', title: 'Certificate name', desc: 'What you learned and the skills it covers.' },
  { meta: 'Issuer, 2025', title: 'Certificate name', desc: 'What you learned and the skills it covers.' },
  { meta: 'Issuer, 2025', title: 'Certificate name', desc: 'What you learned and the skills it covers.' },
]
export const news: Note[] = [
  { meta: 'Oct 2026', title: 'Designing my portfolio in Figma', desc: 'Notes on the sitemap, design tokens, and what I would change.' },
  { meta: 'Sep 2026', title: 'Wrapping up a team project', desc: 'What worked, what slipped, and what I learned.' },
]
export const design: Project[] = [
  { title: 'Portfolio UI', desc: 'Design system, wireframes, and hi-fi screens.', tags: ['Figma', 'Design system'], links: [] },
  { title: 'App flow', desc: 'User flow and prototype for a team project.', tags: ['UX', 'Prototype'], links: [] },
]
export const writing: Project[] = [
  { title: 'Use case and scenario document', desc: 'How I describe features so a team can build them.', tags: ['Documentation'], links: ['Read'] },
  { title: 'Event run-of-show', desc: 'A minute-by-minute plan for a learning session.', tags: ['Planning'], links: ['Read'] },
]
export const about: [string, string][] = [['University', 'Institut Teknologi Bandung'], ['Major', 'Informatics Engineering'], ['Location', 'Bandung, Indonesia'], ['Email', 'nama@email.com'], ['Status', 'Open to internships']]
export const skills: SkillGroup[] = [
  { title: 'Code', items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'SQL', 'HTML/CSS'] },
  { title: 'Frameworks and tools', items: ['React', 'Next.js', 'Tailwind', 'Git', 'Figma'] },
  { title: 'Working with people', items: ['Event planning', 'Public speaking', 'Documentation', 'Leadership'] },
]
