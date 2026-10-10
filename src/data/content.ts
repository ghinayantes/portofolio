import { localized, pair, type Localized, type Pair } from './nav'

export type Project = { title: Localized; desc: Pair; tags: Localized[]; links: Localized[]; linkHrefs?: string[]; image?: string; status?: Pair; wip?: boolean; slug?: string; date?: string; featured?: boolean; tech?: string[]; state?: 'completed' | 'in-progress' }
/** `logo` = image path in /public (e.g. '/logos/hmif.png'); `mono` = short monogram shown when no logo is set. */
export type Entry = { title: Localized; when: Pair; desc: Pair; current?: boolean; logo?: string; mono?: string }
export type Note = { meta: Pair; title: Localized; desc: Pair }
/** Certificate with optional image (falls back to a gradient + medal). */
export type Certificate = Note & { image?: string }
/** News item with optional editorial fields (image, tag chip, org line). */
export type NewsItem = Note & { image?: string; tag?: Localized; org?: Localized }
/** Award with reference-style detail fields. All detail fields are optional and fall back to desc. */
export type Award = Note & { org?: Pair; category?: Localized; date?: Pair; bullets?: Pair[] }
export type SkillGroup = { title: Pair; items: Localized[] }
export type WorkExperience = {
  role: Pair
  company: Pair
  when: Pair
  location: Pair
  desc: Pair
  highlights: Pair[]
  tech: string[]
  current?: boolean
  logo?: string
  mono?: string
}

/** URL slug derived from the English title, e.g. 'Food Waste Stop' -> 'food-waste-stop'. */
export const projectSlug = (p: Project): string =>
  localized(p.title, 'en')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const projects: Project[] = [
  { title: pair('Portfolio Website', 'Situs Portofolio'), status: pair('In progress', 'Sedang dikerjakan'), wip: true, desc: pair('A personal portfolio designed in Figma and built with Next.js, TypeScript, and Tailwind CSS. Showcases my background, experiences, and projects through an interactive interface, with a focus on visual design, responsive layouts, and user experience.', 'Situs portofolio pribadi yang dirancang di Figma dan dikembangkan menggunakan Next.js, TypeScript, dan Tailwind CSS. Menampilkan latar belakang, pengalaman, dan proyek saya melalui antarmuka interaktif dengan fokus pada desain visual, tata letak responsif, dan pengalaman pengguna.'), tags: ['Figma', 'Next.js', 'Tailwind', 'TypeScript'], image: '/portfolio.png', links: [pair('Live site', 'Situs langsung'), 'GitHub'], linkHrefs: ['', 'https://github.com/ghinayantes/portofolio'], slug: 'portfolio-website', date: '2026-08-01', featured: true, tech: ['figma', 'nextjs', 'tailwind', 'typescript'], state: 'in-progress' },
  { title: 'Food Waste Stop', status: pair('In progress', 'Sedang dikerjakan'), wip: true, desc: pair('A web app that connects people with surplus food so less of it is thrown away. Built with a team for a software engineering course.', 'Aplikasi web yang menghubungkan orang dengan makanan berlebih agar lebih sedikit makanan terbuang. Dibuat bersama tim untuk mata kuliah Rekayasa Perangkat Lunak.'), tags: [pair('Web app', 'Aplikasi web'), pair('Use case design', 'Perancangan use case'), pair('Team of 4', 'Tim beranggotakan 4 orang')], links: ['GitHub', pair('Case study', 'Studi kasus')], linkHrefs: ['https://github.com/unadd-rn/IF2150-RPL-K02-G06', ''], slug: 'food-waste-stop', date: '2026-07-01', tech: [], state: 'in-progress' },
  { title: pair('Linear Algebra Calculator', 'Kalkulator Aljabar Linear'), status: pair('Completed', 'Selesai'), desc: pair('A Java-based linear algebra calculator implementing matrix operations, determinants, matrix inversion, systems of linear equations, polynomial interpolation, and spline interpolation. Built with Java and Maven with a focus on numerical methods and algorithmic problem-solving.', 'Kalkulator aljabar linear berbasis Java yang mendukung operasi matriks, determinan, invers matriks, sistem persamaan linear, interpolasi polinomial, dan interpolasi spline. Dibuat dengan Java dan Maven, dengan fokus pada metode numerik dan pemecahan masalah algoritmik.'), tags: [pair('Desktop app', 'Aplikasi desktop'), 'Java', 'JavaFX', 'CSS'], image: '/algeo.png', links: ['GitHub'], linkHrefs: ['https://github.com/ghinayantes/algeo26-tb1-Padang'], slug: 'linear-algebra-calculator', date: '2026-05-01', featured: true, tech: ['java', 'javafx', 'css', 'maven'], state: 'completed' },
  { title: 'sOS', status: pair('In progress', 'Sedang dikerjakan'), wip: true, desc: pair('Developing a custom 32-bit operating system from scratch (sOS) as part of the Operating Systems course at ITB, utilizing C and Assembly languages.', 'Mengembangkan sistem operasi 32-bit kustom bernama sOS dari awal untuk mata kuliah Sistem Operasi di ITB, menggunakan bahasa C dan Assembly.'), tags: [pair('Operating system', 'Sistem operasi'), 'C', 'Assembly'], links: ['GitHub'], linkHrefs: ['https://github.com/ghinayantes/sOS'], slug: 'sos', date: '2026-06-01', tech: ['c', 'assembly'], state: 'in-progress' },
  { title: 'AlproShell', status: pair('Completed', 'Selesai'), desc: pair('Developed a command-line interface (CLI) web browser simulator from scratch using the C programming language, applying core data structures and algorithms learned in Informatics coursework.', 'Membuat simulasi peramban web berbasis command-line interface (CLI) dari awal menggunakan bahasa C, dengan menerapkan struktur data dan algoritma yang dipelajari di perkuliahan Informatika.'), tags: ['C'], image: '/alproshell.png', links: ['GitHub (Private)'], linkHrefs: ['https://github.com/ghinayantes/if1210-tubes-2026-k01-l'], slug: 'alproshell', date: '2026-04-01', tech: ['c'], state: 'completed' },
  { title: pair('UNI - UNO Card Game', 'Permainan Kartu UNI - UNO'), status: pair('Completed', 'Selesai'), desc: pair('Developed a terminal-based Uno card game simulation featuring custom special rules, implemented from scratch using the Prolog programming language for the Computational Logic course at ITB.', 'Membuat simulasi permainan kartu Uno berbasis terminal dengan aturan khusus, dari awal menggunakan bahasa Prolog untuk mata kuliah Logika Komputasional di ITB.'), tags: ['Prolog'], image: '/uni-card.png', links: ['GitHub'], linkHrefs: ['https://github.com/ghinayantes/IF1221_G08_InfokanMabarEpEp'], slug: 'uni-uno-card-game', date: '2026-03-01', tech: ['prolog'], state: 'completed' },
  { title: pair('Consistent Hashing Ring', 'Cincin Consistent Hashing'), status: pair('Completed', 'Selesai'), desc: pair('Applied discrete mathematics concepts, functions, and algorithmic mapping to distribute data nodes efficiently across a hash ring.', 'Menerapkan konsep matematika diskret, fungsi, dan pemetaan algoritmik untuk mendistribusikan node data secara efisien pada hash ring.'), tags: ['Python'], image: '/hashing.png', links: ['GitHub'], linkHrefs: ['https://github.com/ghinayantes/IF1220-Matematika-DIskrit-Makalah'], slug: 'consistent-hashing-ring', date: '2026-02-01', tech: ['python'], state: 'completed' },
  { title: pair('Digital Canteen', 'Kantin Digital'), status: pair('Completed', 'Selesai'), desc: pair('Developed a terminal-based digital canteen ordering system simulation in Python to streamline food browsing, menu selection, and order placement processes.', 'Membuat simulasi sistem pemesanan kantin digital berbasis Python untuk memudahkan penelusuran makanan, pemilihan menu, dan pemesanan.'), tags: ['Python'], image: '/canteen.png', links: ['GitHub'], linkHrefs: ['https://github.com/ghinayantes/Tubes-Berkom-2'], slug: 'digital-canteen', date: '2025-12-01', tech: ['python'], state: 'completed' },
  { title: pair('Elevator Simulation', 'Simulasi Lift'), status: pair('Completed', 'Selesai'), desc: pair('Developed a command-line interface (CLI) elevator simulation program in Python to model real-world elevator movement, floor routing, and passenger request handling.', 'Membuat program simulasi lift berbasis command-line interface (CLI) dengan Python untuk memodelkan pergerakan lift, rute antar lantai, dan permintaan penumpang.'), tags: ['Python'], image: '/elevator.png', links: ['GitHub'], linkHrefs: ['https://github.com/ghinayantes/Tubes-Berkom-1'], slug: 'elevator-simulation', date: '2025-11-01', tech: ['python'], state: 'completed' },
]

export const organizations: Entry[] = [
  { title: pair('Technology Development Staff Intern (Frontend) - HMIF ITB', 'Staf Magang Pengembangan Teknologi (Frontend) — HMIF ITB'), when: pair('Sep 2026 – Present', 'Sep 2026 – Sekarang'), desc: pair('Developed and maintained responsive, user-friendly web interfaces for HMIF ITB platforms using modern frontend technologies.', 'Mengembangkan dan memelihara antarmuka web yang responsif dan mudah digunakan untuk platform HMIF ITB dengan teknologi frontend modern.'), current: true, mono: 'HMIF' },
  { title: pair('Competitive Programming Staff - ARKAVIDIA 11.0', 'Staf Competitive Programming — ARKAVIDIA 11.0'), when: pair('Sep 2026 – Present', 'Sep 2026 – Sekarang'), desc: pair('Designed and curated competitive programming problem sets, test cases, and solutions for national-level programming contests.', 'Merancang dan menyusun kumpulan soal, kasus uji, serta solusi untuk kompetisi pemrograman tingkat nasional.'), current: true, mono: 'ARKA' },
  { title: pair('Wisnight Staff - Wisuda Oktober HMIF ITB 2026', 'Staf Wisnight — Wisuda Oktober HMIF ITB 2026'), when: pair('Sep 2026 – Oct 2026', 'Sep 2026 – Okt 2026'), desc: pair('Designed and conceptualized an engaging, memorable celebration night program dedicated to honoring and celebrating the graduating students of HMIF ITB.', 'Merancang konsep acara malam perayaan yang berkesan untuk menghormati dan merayakan kelulusan mahasiswa HMIF ITB.'), current: true, mono: 'HMIF' },
  { title: pair('Frontend - Aksi Angkatan SPARTA HMIF ITB 2025', 'Frontend — Aksi Angkatan SPARTA HMIF ITB 2025'), when: pair('Aug 2026 – Sep 2026', 'Agu 2026 – Sep 2026'), desc: pair('Developed and maintained responsive frontend interfaces for SPARTA HMIF ITB platforms to support angkatan activities and student engagement.', 'Mengembangkan dan memelihara antarmuka frontend yang responsif untuk platform SPARTA HMIF ITB guna mendukung kegiatan angkatan dan keterlibatan mahasiswa.'), current: false, mono: 'SPARTA' },
  { title: pair('Event Organizer Staff - OSKM ITB 2026', 'Staf Penyelenggara Acara — OSKM ITB 2026'), when: pair('Aug 2026', 'Agu 2026'), desc: pair('Collaborated with the event division team to plan, design, and execute the official student orientation program for incoming undergraduate students at Institut Teknologi Bandung.', 'Berkolaborasi dengan tim divisi acara untuk merencanakan dan menjalankan program orientasi resmi bagi mahasiswa baru Institut Teknologi Bandung.'), current: false, mono: 'OSKM' },
  { title: pair('Web Developer Explorer - Google Developer on Campus ITB', 'Web Developer Explorer — Google Developer on Campus ITB'), when: pair('May 2026 – Present', 'Mei 2026 – Sekarang'), desc: pair('Completed hands-on web development modules and built responsive projects leveraging AI-assisted workflows.', 'Menyelesaikan modul praktik pengembangan web dan membuat proyek responsif dengan dukungan alur kerja berbantuan AI.'), current: true, mono: 'GDGoC' },
  { title: pair('Curriculum Staff - COMPILE 2026', 'Staf Kurikulum — COMPILE 2026'), when: pair('Feb 2026 – Apr 2026', 'Feb 2026 – Apr 2026'), desc: pair('Collaborated with the academic team to coordinate teaching schedules, curriculum delivery, and educational materials to optimize student learning outcomes.', 'Berkolaborasi dengan tim akademik untuk mengatur jadwal pengajaran, pelaksanaan kurikulum, dan materi pembelajaran agar hasil belajar mahasiswa lebih optimal.'), current: false, mono: 'CMPL' },
  { title: pair('Media & Publication - Student Body PSP Excellence ITB', 'Media & Publikasi — Student Body PSP Excellence ITB'), when: pair('Jul 2026 – Present', 'Jul 2026 – Sekarang'), desc: pair('Scholarship and mentorship program by ParagonCorp.', 'Program beasiswa dan pendampingan dari ParagonCorp.'), current: true, mono: 'PSP' },
  { title: pair('Competition Staff (Mathematics) - IMPACT ITB 6.0', 'Staf Kompetisi (Matematika) — IMPACT ITB 6.0'), when: pair('Mar 2026 – Jul 2026', 'Mar 2026 – Jul 2026'), desc: pair('Designed, curated, and reviewed mathematics competition problem sets, solution keys, and comprehensive grading rubrics for the IMPACT ITB 6.0 event.', 'Merancang, menyusun, dan meninjau soal kompetisi matematika, kunci jawaban, serta rubrik penilaian untuk acara IMPACT ITB 6.0.'), current: false, mono: 'IMPACT' },
  { title: pair('IUP Mathematics Class Tutor - IMPACT ITB 6.0', 'Tutor Kelas Matematika IUP — IMPACT ITB 6.0'), when: pair('May 2026', 'Mei 2026'), desc: pair('Delivered engaging and comprehensive mathematics tutoring sessions for IUP students, ensuring clear understanding of advanced mathematical concepts.', 'Mengajar matematika kepada mahasiswa IUP dengan cara yang menarik dan menyeluruh agar mereka memahami konsep matematika tingkat lanjut.'), current: false, mono: 'IMPACT' },
  { title: pair('Member - Unit Kesenian Minangkabau (UKM) ITB', 'Anggota — Unit Kesenian Minangkabau (UKM) ITB'), when: pair('2025 – Present', '2025 – Sekarang'), desc: pair('Student unit on Minangkabau regional arts and culture at ITB.', 'Unit kegiatan mahasiswa ITB yang berfokus pada seni dan budaya Minangkabau.'), current: true, mono: 'UKM' },
  { title: pair('Academic Staff - Badan Pengurus Angkatan STEI-K ITB 2025', 'Staf Akademik — Badan Pengurus Angkatan STEI-K ITB 2025'), when: pair('Oct 2025 – Sep 2026', 'Okt 2025 – Sep 2026'), desc: pair('Managed academic support programs and initiatives to assist first-year students in adapting to coursework within STEI-K ITB.', 'Mengelola program dan kegiatan dukungan akademik untuk membantu mahasiswa tahun pertama beradaptasi dengan perkuliahan di STEI-K ITB.'), current: false, mono: 'BPA' },
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

export const awards: Award[] = [
  { 
    meta: pair('2025', '2025'), 
    date: pair('14 November 2025 - Present', '14 November 2025 - Sekarang'), 
    title: pair('Paragon Scholarship Program Excellence Grantee Batch 2025', 'Penerima Paragon Scholarship Program Excellence Batch 2025'), 
    category: pair('Scholarship', 'Beasiswa'), 
    org: pair('PT Paragon Technology and Innovation', 'PT Paragon Technology and Innovation'), 
    desc: pair('Awarded the highly competitive Paragon Scholarship (top 1% of Indonesian students) for academic excellence and leadership potential.', 'Meraih beasiswa Paragon yang sangat kompetitif (top 1% mahasiswa Indonesia) atas keunggulan akademik dan potensi kepemimpinan.'), 
    bullets: [
      pair('Awarded the highly competitive Paragon Scholarship (top 1% of Indonesian students) for academic excellence and leadership potential.', 'Meraih beasiswa Paragon yang sangat kompetitif (top 1% mahasiswa Indonesia) atas keunggulan akademik dan potensi kepemimpinan.'),
      pair('Participated in 10+ leadership training and community development programs.', 'Berpartisipasi dalam 10+ pelatihan kepemimpinan dan program pengembangan masyarakat.')
    ] 
  },
  { 
    meta: pair('2024', '2024'), 
    date: pair('25-28 April 2024', '25-28 April 2024'), 
    title: pair('Gold Medal Indonesia Mathematics Olympiad (OMI) 2024', 'Medali Emas Olimpiade Matematika Indonesia (OMI) 2024'), 
    category: pair('Competition', 'Kompetisi'), 
    org: pair('INDONESIA SCIENTIFIC SOCIETY (ISS)', 'INDONESIA SCIENTIFIC SOCIETY (ISS)'), 
    desc: pair('Secured the Gold Medal in a prestigious national mathematics competition, demonstrating advanced analytical and problem-solving capabilities.', 'Meraih Medali Emas dalam kompetisi matematika nasional bergengsi, menunjukkan kemampuan analitis dan pemecahan masalah tingkat lanjut.'), 
    bullets: [
      pair('Secured the Gold Medal in a prestigious national mathematics competition, demonstrating advanced analytical and problem-solving capabilities.', 'Meraih Medali Emas dalam kompetisi matematika nasional bergengsi, menunjukkan kemampuan analitis dan pemecahan masalah tingkat lanjut.'),
      pair('Competed against top students nationwide and successfully mastered complex mathematical concepts under tight time constraints.', 'Bersaing dengan siswa-siswi terbaik nasional dan berhasil menguasai konsep matematika kompleks di bawah batasan waktu yang ketat.')
    ] 
  },
  { 
    meta: pair('2024', '2024'), 
    date: pair('06-09 November 2024', '06-09 November 2024'), 
    title: pair('Finalist of Lomba Seni Bermatematika Tingkat SMA - Pekan Seni Bermatematika XXI se-INDONESIA', 'Finalis Lomba Seni Bermatematika Tingkat SMA - Pekan Seni Bermatematika XXI se-INDONESIA'), 
    category: pair('Competition', 'Kompetisi'), 
    org: pair('HIMATIKA FMIPA Universitas Andalas', 'HIMATIKA FMIPA Universitas Andalas'), 
    desc: pair('Competed nationally as a finalist in the Mathematics Art Competition (PSB XXI) organized by HIMATIKA FMIPA Universitas Andalas.', 'Berkompetisi di tingkat nasional sebagai finalis Lomba Seni Bermatematika (PSB XXI) yang diselenggarakan oleh HIMATIKA FMIPA Universitas Andalas.'), 
    bullets: [
      pair('Competed nationally as a finalist in the Mathematics Art Competition (PSB XXI) organized by HIMATIKA FMIPA Universitas Andalas.', 'Berkompetisi di tingkat nasional sebagai finalis Lomba Seni Bermatematika (PSB XXI) yang diselenggarakan oleh HIMATIKA FMIPA Universitas Andalas.'),
      pair('Demonstrated mathematical proficiency and creative problem-solving skills in a competitive national event.', 'Menunjukkan kemampuan matematika dan keterampilan pemecahan masalah yang kreatif dalam ajang kompetisi nasional.')
    ] 
  },
  { 
    meta: pair('2025', '2025'), 
    date: pair('5-12 January 2025', '5-12 Januari 2025'), 
    title: pair('2nd Highest Try Out Score - SITOPLASMA XVII 2025', 'Skor Try Out Tertinggi Kedua - SITOPLASMA XVII 2025'), 
    category: pair('Competition', 'Kompetisi'), 
    org: pair('BEM KM Fakultas Kedokteran Universitas Andalas', 'BEM KM Fakultas Kedokteran Universitas Andalas'), 
    desc: pair('Achieved the second highest try out score in the regional cluster (Rumpun Regio) at SITOPLASMA XVII 2025 held by FK Universitas Andalas.', 'Mencapai skor try out tertinggi kedua di rumpun regio pada ajang SITOPLASMA XVII 2025 yang diadakan oleh FK Universitas Andalas.'), 
    bullets: [
      pair('Achieved the second highest try out score in the regional cluster (Rumpun Regio) at SITOPLASMA XVII 2025 held by FK Universitas Andalas.', 'Mencapai skor try out tertinggi kedua di rumpun regio pada ajang SITOPLASMA XVII 2025 yang diadakan oleh FK Universitas Andalas.'),
      pair('Demonstrated academic excellence and strong preparation performance in SNBT 2025 preparation try out assessments.', 'Menunjukkan keunggulan akademik dan performa persiapan yang kuat dalam penilaian try out kompetitif persiapan SNBT 2025')
    ] 
  },
  { 
    meta: pair('2023', '2023'), 
    date: pair('1, 2 September and 26 September 2023', '1, 2 September dan 26 September 2023'), 
    title: pair('Finalist of 3rd Math Competition West Sumatra', 'Finalis 3rd Math Competition West Sumatra'), 
    category: pair('Competition', 'Kompetisi'), 
    org: pair('MGMP Matematika SMA / SMK Provinsi Sumatera Barat & Dinas Pendidikan Prov. Sumbar with Casio Education Indonesia', 'MGMP Matematika SMA / SMK Provinsi Sumatera Barat & Dinas Pendidikan Prov. Sumbar bersama Casio Education Indonesia'), 
    desc: pair('Competed as a finalist in the 3rd Math Competition West Sumatra organized by MGMP Matematika SMA/SMK Provinsi Sumatera Barat and the Education Office in collaboration with Casio Education Indonesia.', 'Berkompetisi sebagai finalis dalam 3rd Math Competition West Sumatra yang diselenggarakan oleh MGMP Matematika SMA/SMK Provinsi Sumatera Barat dan Dinas Pendidikan bekerja sama dengan Casio Education Indonesia.'), 
    bullets: [
      pair('Competed as a finalist in the 3rd Math Competition West Sumatra organized by MGMP Matematika SMA/SMK Provinsi Sumatera Barat and the Education Office in collaboration with Casio Education Indonesia.', 'Berkompetisi sebagai finalis dalam 3rd Math Competition West Sumatra yang diselenggarakan oleh MGMP Matematika SMA/SMK Provinsi Sumatera Barat dan Dinas Pendidikan bekerja sama dengan Casio Education Indonesia.'),
      pair('Demonstrated mathematical competency and applied technological skills using Classwiz in a regional competitive setting.', 'Menunjukkan kompetensi matematika dan mengaplikasikan keterampilan teknologi menggunakan Classwiz dalam ajang kompetisi regional.')
    ] 
  },
  { 
    meta: pair('2023', '2023'), 
    date: pair('21, 28, and 29 October 2023', '21, 28, dan 29 Oktober 2023'), 
    title: pair('Semifinalist of UNP Mathematics Challenge Tingkat SMA Ke-XXXV Se-Indonesia', 'Semifinalis UNP Mathematics Challenge Tingkat SMA Ke-XXXV Se-Indonesia'), 
    category: pair('Competition', 'Kompetisi'), 
    org: pair('Departemen Matematika FMIPA Universitas Negeri Padang (UNP)', 'Departemen Matematika FMIPA Universitas Negeri Padang (UNP)'), 
    desc: pair('Achieved semifinalist standing in the 35th national-level UNP Mathematics Challenge organized by the Mathematics Department of FMIPA Universitas Negeri Padang.', 'Mencapai tahap semifinalis dalam ajang UNP Mathematics Challenge Tingkat SMA Ke-XXXV se-Indonesia yang diselenggarakan oleh Departemen Matematika FMIPA Universitas Negeri Padang.'), 
    bullets: [
      pair('Achieved semifinalist standing in the 35th national-level UNP Mathematics Challenge organized by the Mathematics Department of FMIPA Universitas Negeri Padang.', 'Mencapai tahap semifinalis dalam ajang UNP Mathematics Challenge Tingkat SMA Ke-XXXV se-Indonesia yang diselenggarakan oleh Departemen Matematika FMIPA Universitas Negeri Padang.'),
      pair('Demonstrated critical, superior, and prominent mathematical problem-solving skills in a competitive national arena.', 'Menunjukkan kemampuan pemecahan masalah matematika yang kritis, unggul, dan menonjol di arena kompetisi tingkat nasional.')
    ] 
  }
]

export const certificates: Certificate[] = [
  { meta: pair('Badan Pengembangan dan Pembinaan Bahasa, 2025', 'Badan Pengembangan dan Pembinaan Bahasa, 2025'), title: pair('Uji Kemahiran Berbahasa Indonesia (UKBI)', 'Uji Kemahiran Berbahasa Indonesia (UKBI)'), desc: pair('Achieved an "Istimewa" (Special) proficiency rank with a score of 729, demonstrating flawless communication skills in Indonesian for personal, social, professional, and academic purposes.', 'Mencapai peringkat kemahiran "Istimewa" dengan skor 729, menunjukkan kemampuan komunikasi berbahasa Indonesia yang sempurna untuk keperluan personal, sosial, keprofesian, dan keilmiahan.'), image: '/ukbi.png' },
  { meta: pair('STEI-K ITB, 2025', 'STEI-K ITB, 2025'), title: pair('Mathematics Tutor - IMPACT 6.0', 'Tutor Matematika - IMPACT 6.0'), desc: pair('Served as a Mathematics Tutor for IMPACT 6.0 organized by the Student Batch Board of STEI-K (School of Electrical Engineering and Informatics - Computation), mentoring participants in high school mathematics.', 'Berperan sebagai Tutor Matematika untuk IMPACT 6.0 yang diselenggarakan oleh Badan Pengurus Angkatan STEI-K (Sekolah Teknik Elektro dan Informatika - Komputasi), membimbing peserta dalam bidang matematika tingkat SMA.'), image: '/tutor.png' },
  { meta: pair('SNPMB / BPPP, 2025', 'SNPMB / BPPP, 2025'), title: pair('UTBK SNBT 2025', 'UTBK SNBT 2025'), desc: pair('Successfully completed the UTBK-SNBT 2025 examination with an average score of 777.56, achieving top scores including 898.45 in Mathematical Reasoning and 830.25 in Quantitative Knowledge.', 'Berhasil menyelesaikan ujian UTBK-SNBT 2025 dengan rata-rata skor 777,56, serta meraih skor tertinggi di antaranya 898,45 pada Penalaran Matematika dan 830,25 pada Pengetahuan Kuantitatif.'), image: '/utbk.png' },
]

export const news: NewsItem[] = [
  //{ meta: pair('Oct 2026', 'Okt 2026'), title: pair('Designing my portfolio in Figma', 'Merancang portofolio di Figma'), desc: pair('Notes on the sitemap, design tokens, and what I would change.', 'Catatan tentang peta situs, token desain, dan hal yang ingin kuubah.') },
  //{ meta: pair('Sep 2026', 'Sep 2026'), title: pair('Wrapping up a team project', 'Menuntaskan proyek tim'), desc: pair('What worked, what slipped, and what I learned.', 'Hal yang berjalan baik, yang tertunda, dan pelajaran yang kudapat.') },
]

export const design: Project[] = [
  //{ title: pair('Portfolio UI', 'UI Portofolio'), desc: pair('Design system, wireframes, and hi-fi screens.', 'Sistem desain, wireframe, dan rancangan antarmuka berfidelitas tinggi.'), tags: ['Figma', pair('Design system', 'Sistem desain')], links: ['https://www.figma.com/design/WfhnKPbIsFHr6SrHxXXu3X/Untitled?node-id=0-1&t=j3K9wj5MYUkHKbZA-1'] },
]

export const writing: Project[] = [
  // { title: pair('Use case and scenario document', 'Dokumen use case dan skenario'), desc: pair('How I describe features so a team can build them.', 'Cara menjelaskan fitur agar dapat diwujudkan oleh tim.'), tags: [pair('Documentation', 'Dokumentasi')], links: [pair('Read', 'Baca')] },
]

/** Life motto shown on the About page (kept in its original wording for both languages). */
export const motto = 'Do the best and let God do the rest'

export const about: [Pair, Localized][] = [
  [pair('University', 'Universitas'), pair('Bandung Institute of Technology', 'Institut Teknologi Bandung')],
  [pair('Major', 'Program studi'), pair('Informatics Engineering', 'Teknik Informatika')],
  [pair('Location', 'Lokasi'), pair('Bandung, Indonesia', 'Bandung, Indonesia')],
  [pair('Email', 'Email'), 'ghnaemeliayantes@gmail.com'],
  [pair('Status', 'Status'), pair('Open to internships', 'Terbuka untuk magang')],
]

export const skills: SkillGroup[] = [
  { title: pair('Languages', 'Bahasa pemrograman'), items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C', 'SQL', 'HTML', 'CSS', 'Assembly', 'Prolog'] },
  { title: pair('Frameworks', 'Framework'), items: ['React', 'Next.js', 'Tailwind', 'JavaFX'] },
  { title: pair('Tools', 'Tools'), items: ['Git', 'GitHub', 'Figma', 'Maven'] },
  { title: pair('Working with people', 'Kolaborasi'), items: [pair('Event planning', 'Perencanaan acara'), pair('Public speaking', 'Berbicara di depan umum'), pair('Documentation', 'Dokumentasi'), pair('Leadership', 'Kepemimpinan')] },
]

/**
 * Work experience entries — replace the placeholder values with your real data.
 * Each entry supports bilingual content (Pair = { en: string, id: string }).
 */
export const work: WorkExperience[] = [
  {
    role: pair('Technology Development Intern', 'Intern Technology Development'),
    company: pair("Executive Department HMIF ITB 'Prisma'", "Departemen Eksekutif HMIF ITB 'Prisma'"),
    when: pair('Sep 2026 – Present', 'Sep 2026 – Sekarang'),
    location: pair('Bandung, Indonesia', 'Bandung, Indonesia'),
    desc: pair(
      "Contributing to frontend development in HMIF super app initiatives within Executive Department HMIF ITB 'Prisma', focusing on building and refining user-facing web interfaces. Collaborating with the technology development team to translate requirements into functional, responsive, and maintainable interfaces while continuing to develop practical software engineering skills.",
      "Berkontribusi dalam pengembangan frontend HMIF super app di Departemen Eksekutif HMIF ITB 'Prisma', dengan fokus pada pembuatan dan penyempurnaan antarmuka web yang digunakan oleh pengguna. Berkolaborasi dengan tim pengembangan teknologi untuk menerjemahkan kebutuhan menjadi antarmuka yang fungsional, responsif, dan mudah dipelihara, sekaligus mengembangkan keterampilan praktis di bidang rekayasa perangkat lunak.",
    ),
    highlights: [
      pair('Developing and refining responsive frontend components for web interfaces.', 'Mengembangkan dan menyempurnakan komponen frontend yang responsif untuk antarmuka web.'),
      pair('Translating design concepts and requirements into functional user experiences.', 'Menerjemahkan konsep desain dan kebutuhan pengguna menjadi antarmuka yang fungsional dan nyaman digunakan.'),
      pair('Collaborating with team members to implement features and maintain code quality.', 'Berkolaborasi dengan anggota tim untuk mengimplementasikan fitur serta menjaga kualitas kode.'),
    ],
    tech: ['React', 'TypeScript'],
    current: true,
    mono: 'HMIF',
  }
]
