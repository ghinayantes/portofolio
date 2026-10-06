import { localized, pair, type Localized, type Pair } from './nav'

export type Project = { title: Localized; desc: Pair; tags: Localized[]; links: Localized[]; linkHrefs?: string[]; image?: string; status?: Pair; wip?: boolean }
export type Entry = { title: Localized; when: Pair; desc: Pair; current?: boolean }
export type Note = { meta: Pair; title: Localized; desc: Pair }
export type SkillGroup = { title: Pair; items: Localized[] }

/** URL slug derived from the English title, e.g. 'Food Waste Stop' -> 'food-waste-stop'. */
export const projectSlug = (p: Project): string =>
  localized(p.title, 'en')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const projects: Project[] = [
  { title: pair('Portfolio Website', 'Situs Portofolio'), status: pair('In progress', 'Sedang dikerjakan'), wip: true, desc: pair('This site: designed in Figma, then built with Next.js and Tailwind.', 'Situs ini dirancang di Figma, lalu dibuat menggunakan Next.js dan Tailwind.'), tags: ['Figma', 'Next.js', 'Tailwind', 'TypeScript'], links: [pair('Live site', 'Situs langsung'), 'GitHub'], linkHrefs: ['', 'https://github.com/ghinayantes/portofolio'] },
  { title: 'Food Waste Stop', status: pair('In progress', 'Sedang dikerjakan'), wip: true, desc: pair('A web app that connects people with surplus food so less of it is thrown away. Built with a team for a software engineering course.', 'Aplikasi web yang menghubungkan orang dengan makanan berlebih agar lebih sedikit makanan terbuang. Dibuat bersama tim untuk mata kuliah Rekayasa Perangkat Lunak.'), tags: [pair('Web app', 'Aplikasi web'), pair('Use case design', 'Perancangan use case'), pair('Team of 4', 'Tim beranggotakan 4 orang')], links: ['GitHub', pair('Case study', 'Studi kasus')], linkHrefs: ['', ''] },
  { title: pair('Linear Algebra Calculator', 'Kalkulator Aljabar Linear'), status: pair('Completed', 'Selesai'), desc: pair('A Java-based linear algebra calculator implementing matrix operations, determinants, matrix inversion, systems of linear equations, polynomial interpolation, and spline interpolation. Built with Java and Maven with a focus on numerical methods and algorithmic problem-solving.', 'Kalkulator aljabar linear berbasis Java yang mendukung operasi matriks, determinan, invers matriks, sistem persamaan linear, interpolasi polinomial, dan interpolasi spline. Dibuat dengan Java dan Maven, dengan fokus pada metode numerik dan pemecahan masalah algoritmik.'), tags: [pair('Desktop app', 'Aplikasi desktop'), 'Java', 'JavaFX', 'CSS'], links: ['GitHub'], linkHrefs: ['https://github.com/ghinayantes/algeo26-tb1-Padang'] },
  { title: 'sOS', status: pair('In progress', 'Sedang dikerjakan'), wip: true, desc: pair('Developing a custom 32-bit operating system from scratch (sOS) as part of the Operating Systems course at ITB, utilizing C and Assembly languages.', 'Mengembangkan sistem operasi 32-bit kustom bernama sOS dari awal untuk mata kuliah Sistem Operasi di ITB, menggunakan bahasa C dan Assembly.'), tags: [pair('Operating system', 'Sistem operasi'), 'C', 'Assembly'], links: ['GitHub'], linkHrefs: ['https://github.com/ghinayantes/sOS'] },
  { title: 'AlproShell', status: pair('Completed', 'Selesai'), desc: pair('Developed a command-line interface (CLI) web browser simulator from scratch using the C programming language, applying core data structures and algorithms learned in Informatics coursework.', 'Membuat simulasi peramban web berbasis command-line interface (CLI) dari awal menggunakan bahasa C, dengan menerapkan struktur data dan algoritma yang dipelajari di perkuliahan Informatika.'), tags: ['C'], image: '/alproshell.png', links: ['GitHub'], linkHrefs: [''] },
  { title: pair('UNI - UNO Card Game', 'Permainan Kartu UNI - UNO'), status: pair('Completed', 'Selesai'), desc: pair('Developed a terminal-based Uno card game simulation featuring custom special rules, implemented from scratch using the Prolog programming language for the Computational Logic course at ITB.', 'Membuat simulasi permainan kartu Uno berbasis terminal dengan aturan khusus, dari awal menggunakan bahasa Prolog untuk mata kuliah Logika Komputasional di ITB.'), tags: ['Prolog'], image: '/uni card.png', links: ['GitHub'], linkHrefs: [''] },
  { title: pair('Consistent Hashing Ring', 'Cincin Consistent Hashing'), status: pair('Completed', 'Selesai'), desc: pair('Applied discrete mathematics concepts, functions, and algorithmic mapping to distribute data nodes efficiently across a hash ring.', 'Menerapkan konsep matematika diskret, fungsi, dan pemetaan algoritmik untuk mendistribusikan node data secara efisien pada hash ring.'), tags: ['Python'], image: '/hashing.png', links: ['GitHub'], linkHrefs: [''] },
  { title: pair('Digital Canteen', 'Kantin Digital'), status: pair('Completed', 'Selesai'), desc: pair('Developed a terminal-based digital canteen ordering system simulation in Python to streamline food browsing, menu selection, and order placement processes.', 'Membuat simulasi sistem pemesanan kantin digital berbasis Python untuk memudahkan penelusuran makanan, pemilihan menu, dan pemesanan.'), tags: ['Python'], image: '/canteen.png', links: ['GitHub'], linkHrefs: [''] },
  { title: pair('Elevator Simulation', 'Simulasi Lift'), status: pair('Completed', 'Selesai'), desc: pair('Developed a command-line interface (CLI) elevator simulation program in Python to model real-world elevator movement, floor routing, and passenger request handling.', 'Membuat program simulasi lift berbasis command-line interface (CLI) dengan Python untuk memodelkan pergerakan lift, rute antar lantai, dan permintaan penumpang.'), tags: ['Python'], image: '/elevator.png', links: ['GitHub'], linkHrefs: [''] },
]

export const organizations: Entry[] = [
  { title: pair('Technology Development Staff Intern (Frontend) - HMIF ITB', 'Staf Magang Pengembangan Teknologi (Frontend) — HMIF ITB'), when: pair('Sep 2026 – Present', 'Sep 2026 – Sekarang'), desc: pair('Developed and maintained responsive, user-friendly web interfaces for HMIF ITB platforms using modern frontend technologies.', 'Mengembangkan dan memelihara antarmuka web yang responsif dan mudah digunakan untuk platform HMIF ITB dengan teknologi frontend modern.'), current: true },
  { title: pair('Competitive Programming Staff - ARKAVIDIA 11.0', 'Staf Competitive Programming — ARKAVIDIA 11.0'), when: pair('Sep 2026 – Present', 'Sep 2026 – Sekarang'), desc: pair('Designed and curated competitive programming problem sets, test cases, and solutions for national-level programming contests.', 'Merancang dan menyusun kumpulan soal, kasus uji, serta solusi untuk kompetisi pemrograman tingkat nasional.'), current: true },
  { title: pair('Wisnight Staff - Wisuda Oktober HMIF ITB 2026', 'Staf Wisnight — Wisuda Oktober HMIF ITB 2026'), when: pair('Sep 2026 – Oct 2026', 'Sep 2026 – Okt 2026'), desc: pair('Designed and conceptualized an engaging, memorable celebration night program dedicated to honoring and celebrating the graduating students of HMIF ITB.', 'Merancang konsep acara malam perayaan yang berkesan untuk menghormati dan merayakan kelulusan mahasiswa HMIF ITB.'), current: true },
  { title: pair('Frontend - Aksi Angkatan SPARTA HMIF ITB 2025', 'Frontend — Aksi Angkatan SPARTA HMIF ITB 2025'), when: pair('Aug 2026 – Sep 2026', 'Agu 2026 – Sep 2026'), desc: pair('Developed and maintained responsive frontend interfaces for SPARTA HMIF ITB platforms to support angkatan activities and student engagement.', 'Mengembangkan dan memelihara antarmuka frontend yang responsif untuk platform SPARTA HMIF ITB guna mendukung kegiatan angkatan dan keterlibatan mahasiswa.'), current: false },
  { title: pair('Event Organizer Staff - OSKM ITB 2026', 'Staf Penyelenggara Acara — OSKM ITB 2026'), when: pair('Aug 2026', 'Agu 2026'), desc: pair('Collaborated with the event division team to plan, design, and execute the official student orientation program for incoming undergraduate students at Institut Teknologi Bandung.', 'Berkolaborasi dengan tim divisi acara untuk merencanakan dan menjalankan program orientasi resmi bagi mahasiswa baru Institut Teknologi Bandung.'), current: false },
  { title: pair('Web Developer Explorer - Google Developer on Campus ITB', 'Web Developer Explorer — Google Developer on Campus ITB'), when: pair('May 2026 – Present', 'Mei 2026 – Sekarang'), desc: pair('Completed hands-on web development modules and built responsive projects leveraging AI-assisted workflows.', 'Menyelesaikan modul praktik pengembangan web dan membuat proyek responsif dengan dukungan alur kerja berbantuan AI.'), current: true },
  { title: pair('Curriculum Staff - COMPILE 2026', 'Staf Kurikulum — COMPILE 2026'), when: pair('Feb 2026 – Apr 2026', 'Feb 2026 – Apr 2026'), desc: pair('Collaborated with the academic team to coordinate teaching schedules, curriculum delivery, and educational materials to optimize student learning outcomes.', 'Berkolaborasi dengan tim akademik untuk mengatur jadwal pengajaran, pelaksanaan kurikulum, dan materi pembelajaran agar hasil belajar mahasiswa lebih optimal.'), current: false },
  { title: pair('Media & Publication - Student Body PSP Excellence ITB', 'Media & Publikasi — Student Body PSP Excellence ITB'), when: pair('Jul 2026 – Present', 'Jul 2026 – Sekarang'), desc: pair('Scholarship and mentorship program by ParagonCorp.', 'Program beasiswa dan pendampingan dari ParagonCorp.'), current: true },
  { title: pair('Competition Staff (Mathematics) - IMPACT ITB 6.0', 'Staf Kompetisi (Matematika) — IMPACT ITB 6.0'), when: pair('Mar 2026 – Jul 2026', 'Mar 2026 – Jul 2026'), desc: pair('Designed, curated, and reviewed mathematics competition problem sets, solution keys, and comprehensive grading rubrics for the IMPACT ITB 6.0 event.', 'Merancang, menyusun, dan meninjau soal kompetisi matematika, kunci jawaban, serta rubrik penilaian untuk acara IMPACT ITB 6.0.'), current: false },
  { title: pair('IUP Mathematics Class Tutor - IMPACT ITB 6.0', 'Tutor Kelas Matematika IUP — IMPACT ITB 6.0'), when: pair('May 2026', 'Mei 2026'), desc: pair('Delivered engaging and comprehensive mathematics tutoring sessions for IUP students, ensuring clear understanding of advanced mathematical concepts.', 'Mengajar matematika kepada mahasiswa IUP dengan cara yang menarik dan menyeluruh agar mereka memahami konsep matematika tingkat lanjut.'), current: false },
  { title: pair('Member - Unit Kesenian Minangkabau (UKM) ITB', 'Anggota — Unit Kesenian Minangkabau (UKM) ITB'), when: pair('2025 – Present', '2025 – Sekarang'), desc: pair('Student unit on Minangkabau regional arts and culture at ITB.', 'Unit kegiatan mahasiswa ITB yang berfokus pada seni dan budaya Minangkabau.'), current: true },
  { title: pair('Academic Staff - Badan Pengurus Angkatan STEI-K ITB 2025', 'Staf Akademik — Badan Pengurus Angkatan STEI-K ITB 2025'), when: pair('Oct 2025 – Sep 2026', 'Okt 2025 – Sep 2026'), desc: pair('Managed academic support programs and initiatives to assist first-year students in adapting to coursework within STEI-K ITB.', 'Mengelola program dan kegiatan dukungan akademik untuk membantu mahasiswa tahun pertama beradaptasi dengan perkuliahan di STEI-K ITB.'), current: false },
]

export const education: Entry[] = [
  { title: pair('Bachelor of Science - Informatics, Institut Teknologi Bandung', 'Sarjana Informatika, Institut Teknologi Bandung'), when: pair('2025 – Present', '2025 – Sekarang'), desc: pair('Focus: software engineering, machine learning, and data science.', 'Fokus: rekayasa perangkat lunak, machine learning, dan data science.'), current: true },
  { title: 'SMAN 1 Padang Panjang', when: pair('2022 – 2025', '2022 – 2025'), desc: pair('Focus: Science', 'Fokus: Ilmu Pengetahuan Alam'), current: false },
]

export const milestones: Entry[] = [
  { title: 'PSP Excellence', when: pair('2025', '2025'), desc: pair('Joined the scholarship and mentorship program.', 'Bergabung dalam program beasiswa dan pendampingan.') },
  { title: pair('Started at ITB', 'Memulai kuliah di ITB'), when: pair('2025', '2025'), desc: pair('Started studying Informatics Engineering.', 'Memulai studi Teknik Informatika.') },
  { title: pair('Finished high school', 'Lulus SMA'), when: pair('2025', '2025'), desc: pair('Completed high school.', 'Menyelesaikan pendidikan sekolah menengah atas.') },
]

export const awards: Note[] = [
  { meta: pair('2026', '2026'), title: pair('Award name', 'Nama penghargaan'), desc: pair('Organizer and one line on why it mattered.', 'Penyelenggara dan penjelasan singkat tentang arti penghargaan ini.') },
  { meta: pair('2025', '2025'), title: pair('Scholarship grantee', 'Penerima beasiswa'), desc: pair('Selected for a scholarship and mentorship program.', 'Terpilih untuk mengikuti program beasiswa dan pendampingan.') },
]

export const certificates: Note[] = [
  { meta: pair('Issuer, 2026', 'Penerbit, 2026'), title: pair('Certificate name', 'Nama sertifikat'), desc: pair('What you learned and the skills it covers.', 'Hal yang dipelajari dan keterampilan yang tercakup.') },
  { meta: pair('Issuer, 2025', 'Penerbit, 2025'), title: pair('Certificate name', 'Nama sertifikat'), desc: pair('What you learned and the skills it covers.', 'Hal yang dipelajari dan keterampilan yang tercakup.') },
  { meta: pair('Issuer, 2025', 'Penerbit, 2025'), title: pair('Certificate name', 'Nama sertifikat'), desc: pair('What you learned and the skills it covers.', 'Hal yang dipelajari dan keterampilan yang tercakup.') },
]

export const news: Note[] = [
  { meta: pair('Oct 2026', 'Okt 2026'), title: pair('Designing my portfolio in Figma', 'Merancang portofolio di Figma'), desc: pair('Notes on the sitemap, design tokens, and what I would change.', 'Catatan tentang peta situs, token desain, dan hal yang ingin kuubah.') },
  { meta: pair('Sep 2026', 'Sep 2026'), title: pair('Wrapping up a team project', 'Menuntaskan proyek tim'), desc: pair('What worked, what slipped, and what I learned.', 'Hal yang berjalan baik, yang tertunda, dan pelajaran yang kudapat.') },
]

export const design: Project[] = [
  { title: pair('Portfolio UI', 'UI Portofolio'), desc: pair('Design system, wireframes, and hi-fi screens.', 'Sistem desain, wireframe, dan rancangan antarmuka berfidelitas tinggi.'), tags: ['Figma', pair('Design system', 'Sistem desain')], links: [] },
  { title: pair('App flow', 'Alur aplikasi'), desc: pair('User flow and prototype for a team project.', 'Alur pengguna dan prototipe untuk proyek tim.'), tags: ['UX', pair('Prototype', 'Prototipe')], links: [] },
]

export const writing: Project[] = [
  { title: pair('Use case and scenario document', 'Dokumen use case dan skenario'), desc: pair('How I describe features so a team can build them.', 'Cara menjelaskan fitur agar dapat diwujudkan oleh tim.'), tags: [pair('Documentation', 'Dokumentasi')], links: [pair('Read', 'Baca')] },
  { title: pair('Event run-of-show', 'Susunan acara'), desc: pair('A minute-by-minute plan for a learning session.', 'Rencana kegiatan sesi pembelajaran secara terperinci dari menit ke menit.'), tags: [pair('Planning', 'Perencanaan')], links: [pair('Read', 'Baca')] },
]

export const about: [Pair, Localized][] = [
  [pair('University', 'Universitas'), 'Institut Teknologi Bandung'],
  [pair('Major', 'Program studi'), pair('Informatics Engineering', 'Teknik Informatika')],
  [pair('Location', 'Lokasi'), pair('Bandung, Indonesia', 'Bandung, Indonesia')],
  [pair('Email', 'Email'), 'nama@email.com'],
  [pair('Status', 'Status'), pair('Open to internships', 'Terbuka untuk magang')],
]

export const skills: SkillGroup[] = [
  { title: pair('Code', 'Pemrograman'), items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'SQL', 'HTML/CSS'] },
  { title: pair('Frameworks and tools', 'Framework dan tools'), items: ['React', 'Next.js', 'Tailwind', 'Git', 'Figma'] },
  { title: pair('Working with people', 'Kolaborasi'), items: [pair('Event planning', 'Perencanaan acara'), pair('Public speaking', 'Berbicara di depan umum'), pair('Documentation', 'Dokumentasi'), pair('Leadership', 'Kepemimpinan')] },
]
