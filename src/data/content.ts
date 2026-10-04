export type Project = { title: string; desc: string; tags: string[]; links: string[]; status?: string; wip?: boolean }
export type Entry = { title: string; when: string; desc: string; current?: boolean }
export type Note = { meta: string; title: string; desc: string }
export type SkillGroup = { title: string; items: string[] }

export const projects: Project[] = [
  { title: 'Portfolio Website', status: 'In progress', wip: true, desc: 'This site: designed in Figma, then built with Next.js and Tailwind.', tags: ['Figma', 'Next.js', 'Tailwind', 'TypeScript'], links: ['Live site', 'GitHub'] },
  { title: 'Food Waste Stop', status: 'In progress', wip: true, desc: 'A web app that connects people with surplus food so less of it is thrown away. Built with a team for a software engineering course.', tags: ['Web app', 'Use case design', 'Team of 4'], links: ['GitHub', 'Case study'] },
  { title: 'Linear Algebra Calculator', status: 'Completed', desc: 'A Java-based linear algebra calculator implementing matrix operations, determinants, matrix inversion, systems of linear equations, polynomial interpolation, and spline interpolation. Built with Java and Maven with a focus on numerical methods and algorithmic problem-solving.', tags: ['Desktop base', 'Java', 'Javafx', 'CSS'], links: ['GitHub'] },
  { title: 'sOS', status: 'In progress', wip: true, desc: 'Developing a custom 32-bit operating system from scratch (sOS) as part of the Operating Systems course at ITB, utilizing C and Assembly languages.', tags: ['Operating system', 'C', 'Assembly'], links: ['GitHub'] },
  { title: 'AlproShell', status: 'Completed', desc: 'Developed a command-line interface (CLI) web browser simulator from scratch using the C programming language, applying core data structures and algorithms learned in Informatics coursework.', tags: ['C'], links: ['Github'] },
  { title: 'UNI - UNO Card Game', status: 'Completed', desc: 'Developed a terminal-based Uno card game simulation featuring custom special rules, implemented from scratch using the Prolog programming language for the Computational Logic course at ITB.', tags: ['Prolog'], links: ['Github'] },
  { title: 'Consistent Hashing Ring', status: 'Completed', desc: 'Applied discrete mathematics concepts, functions, and algorithmic mapping to distribute data nodes efficiently across a hash ring.', tags: ['Python'], links: ['Github'] },
  { title: 'Digital Canteen', status: 'Completed', desc: 'Developed a terminal-based digital canteen ordering system simulation in Python to streamline food browsing, menu selection, and order placement processes.', tags: ['Python'], links: ['Github'] },
  { title: 'Elevator Simulation', status: 'Completed', desc: 'Developed a command-line interface (CLI) elevator simulation program in Python to model real-world elevator movement, floor routing, and passenger request handling.', tags: ['Python'], links: ['Github'] },
]
export const organizations: Entry[] = [
  { title: 'Technology Development Staff Intern (Frontend) - HMIF ITB', when: 'Sep, 2026 - Present', desc: 'Developed and maintained responsive, user-friendly web interfaces for HMIF ITB platforms using modern frontend technologies.', current: true },
  { title: 'Competitive Programming Staff - ARKAVIDIA 11.0', when: 'Sep, 2026 - Present', desc: 'Designed and curated competitive programming problem sets, test cases, and solutions for national-level programming contests.', current: true },
  { title: 'Wisnight Staff - Wisuda Oktober HMIF ITB 2026', when: 'Sep, 2026 - Oct, 2026', desc: 'Designed and conceptualized an engaging, memorable celebration night program dedicated to honoring and celebrating the graduating students of HMIF ITB.', current: true },
  { title: 'Frontend - Aksi Angkatan SPARTA HMIF ITB 2025', when: 'Aug, 2026 – Sep, 2026', desc: 'Developed and maintained responsive frontend interfaces for SPARTA HMIF ITB platforms to support angkatan activities and student engagement.', current: false },
  { title: 'Event Organizer Staff - OSKM ITB 2026', when: 'Aug, 2026', desc: 'Collaborated with the event division team to plan, design, and execute the official student orientation program for incoming undergraduate students at Institut Teknologi Bandung.', current: false },
  { title: 'Web Developer Explorer - Google Developer on Campus ITB', when: 'May, 2026 – Present', desc: 'Completed hands-on web development modules and built responsive projects leveraging AI-assisted workflows.', current: true },
  { title: 'Curriculum Staff - COMPILE 2026', when: 'Feb, 2026 – Apr, 2026', desc: 'Collaborated with the academic team to coordinate teaching schedules, curriculum delivery, and educational materials to optimize student learning outcomes.', current: false },
  { title: 'Media & Publication - Student Body PSP Excellence ITB', when: 'July, 2026 – Present', desc: 'Scholarship and mentorship program by ParagonCorp.', current: true },
  { title: 'Competition Staff (Mathematics) - IMPACT ITB 6.0', when: 'Mar, 2026 – July, 2026', desc: 'Designed, curated, and reviewed mathematics competition problem sets, solution keys, and comprehensive grading rubrics for the IMPACT ITB 6.0 event.', current: false },
  { title: 'IUP Mathematics Class Tutor - IMPACT ITB 6.0', when: 'May, 2026', desc: 'Delivered engaging and comprehensive mathematics tutoring sessions for IUP students, ensuring clear understanding of advanced mathematical concepts.', current: false },
  { title: 'Member - Unit Kesenian Minangkabau (UKM) ITB', when: '2025 – Present', desc: 'Student unit on Minangkabau regional arts and culture at ITB.', current: true },
  { title: 'Academic Staff - Badan Pengurus Angkatan STEI-K ITB 2025', when: 'Oct, 2025 – Sep, 2026', desc: 'Managed academic support programs and initiatives to assist first-year students in adapting to coursework within STEI-K ITB.', current: false },
]
export const education: Entry[] = [
  { title: 'Bachelor of Science - Informatics, Institut Teknologi Bandung', when: '2025 – Present', desc: 'Focus: software engineering, machine learning, and data science ', current: true },
  { title: 'SMAN 1 Padang Panjang', when: '2022 – 2025', desc: 'Focus: Science', current: false },
]
export const milestones: Entry[] = [
  // { title: 'OSKM ITB 2026 committee', when: '2026', desc: 'Designing a learning session.', current: true },
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
