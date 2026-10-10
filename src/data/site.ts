import { pair, type Pair } from './nav'

const contacts = [
       { key: 'email', label: pair('Email me', 'Kirim email'), href: 'mailto:ghnaemeliayantes@gmail.com' },
       { key: 'linkedin', label: pair('LinkedIn'), href: 'https://www.linkedin.com/in/ghina-emelia-yantes-3162592a7/' },
       { key: 'github', label: pair('GitHub'), href: 'https://github.com/ghinayantes' },
       { key: 'instagram', label: pair('Instagram'), href: 'https://www.instagram.com/ghinayantes' },
       { key: 'whatsapp', label: pair('WhatsApp'), href: 'https://wa.me/6282173733818' },
     ]

export type Hello = { text: Pair; cta?: Pair; to?: string; action?: 'flip' | 'dial' }

/** Soft pop-up messages next to the contact button. `to` = internal page, `action` = flip the photo / open contacts. */
const hello: Hello[] = [
  { text: pair('Hi, glad you stopped by!', 'Hai, senang kamu mampir!') },
  { text: pair('Curious what I have been building?', 'Penasaran apa yang sedang kubangun?'), cta: pair('See projects', 'Lihat proyek'), to: '/project' },
  { text: pair('Looking for an intern?', 'Lagi cari mahasiswa magang?'), cta: pair("Let's talk", 'Ngobrol yuk'), to: '/hire' },
  { text: pair('There are more photos. Tap mine!', 'Ada foto lain lho. Klik fotoku!'), cta: pair('Flip it', 'Putar'), action: 'flip' },
  { text: pair('Wondering about my stack?', 'Penasaran stack yang kupakai?'), cta: pair('See skills', 'Lihat skill'), to: '/skills' },
  { text: pair('I like graphs, matrices, and data structures.', 'Aku suka graf, matriks, dan struktur data.') },
  { text: pair('Want to know me better?', 'Mau kenalan lebih jauh?'), cta: pair('About me', 'Tentang aku'), to: '/about' },
  { text: pair('Need me? Quick contacts are here.', 'Butuh aku? Kontak cepat ada di sini.'), cta: pair('Open', 'Buka'), action: 'dial' },
  { text: pair('Hope your day is full rank.', 'Semoga harimu full rank.') },
]

export const SITE = {
  name: 'Ghina Emelia Yantes',
  email: 'ghnaemeliayantes@gmail.com',
   photos: [
       { src: '/photo.jpg', alt: pair('Portrait of Ghina Emelia Yantes', 'Potret Ghina Emelia Yantes') },
       { src: '/photo2.jpg', alt: pair('Ghina Emelia Yantes at the association inauguration', 'Ghina Emelia Yantes saat pelantikan himpunan') },
     ] as { src: string; alt: Pair; pos?: string }[],
  cv: '/cv.pdf',
  /** One sentence from the About bio, shown word by word on the home page. */
  statement: pair(
    'I enjoy approaching problems analytically, understanding how things work beneath the surface, and exploring different ways to build effective solutions.',
    'Saya senang menganalisis permasalahan, memahami cara kerja suatu sistem secara mendalam, dan mengeksplorasi berbagai pendekatan untuk menemukan solusi yang efektif.',
  ),
  /** Home gallery (campus life and activities). Put the image in /public and add one line here; the grid grows on its own. */
  gallery: [
    { src: '/photo.jpg', caption: pair('Portrait of Ghina', 'Potret Ghina') },
    { src: '/photo2.jpg', caption: pair('Inaugurate the association', 'Lantik himpunan') },
  ] as { src: string; caption: Pair }[],
  /**
   * Home "History": one or more timelines; with more than one, tabs appear above the strip.
   * Each timeline has a tab `label`, an opening `title`, and `chapters` read left to right (oldest first).
   * A chapter's `photo` is optional (put the image in /public); without one a placeholder is shown.
   */
  histories: [
    {
      label: pair('School to campus', 'SMA ke kampus'),
      title: pair('From Padang Panjang to Bandung, one step at a time.', 'Dari Padang Panjang ke Bandung, satu langkah setiap kali.'),
      chapters: [
        { when: pair('2022 – 2025'), title: 'SMAN 1 Padang Panjang', text: pair('Three years in the science track, where mathematics became the subject I kept coming back to.', 'Tiga tahun di jurusan IPA, tempat matematika menjadi pelajaran yang paling sering saya tekuni.') },
        { when: pair('2024'), title: pair('Gold Medal, Indonesia Mathematics Olympiad', 'Medali Emas, Olimpiade Matematika Indonesia'), text: pair('Secured the Gold Medal in a national mathematics competition, the result of years of problem solving.', 'Meraih Medali Emas dalam kompetisi matematika nasional, hasil dari bertahun-tahun berlatih memecahkan soal.') },
        { when: pair('2025'), title: pair('Informatics at ITB', 'Informatika di ITB'), text: pair('Started studying Informatics at Institut Teknologi Bandung, turning an analytical habit into software.', 'Memulai studi Informatika di Institut Teknologi Bandung, mengubah kebiasaan berpikir analitis menjadi perangkat lunak.'), photo: { src: '/photo.jpg', caption: pair('Portrait of Ghina', 'Potret Ghina') } },
        { when: pair('2025'), title: pair('Paragon Scholarship Program Excellence', 'Paragon Scholarship Program Excellence'), text: pair('Joined the scholarship and mentorship program as a Batch 2025 grantee.', 'Bergabung dalam program beasiswa dan pendampingan sebagai penerima Batch 2025.') },
        { when: pair('2026 – Present', '2026 – Sekarang'), title: pair('Building with HMIF ITB', 'Berkarya bersama HMIF ITB'), text: pair('Working on frontend for HMIF platforms as a Technology Development Intern, alongside committee roles.', 'Mengerjakan frontend untuk platform HMIF sebagai Intern Technology Development, sambil aktif di kepanitiaan.'), photo: { src: '/photo2.jpg', caption: pair('Inaugurate the association', 'Lantik himpunan') } },
      ],
    },
    {
      label: pair('Campus years', 'Masa kuliah'),
      title: pair('Learning by building, inside and outside class.', 'Belajar sambil membangun, di dalam dan di luar kelas.'),
      chapters: [
        { when: pair('Aug – Sep 2026', 'Agu – Sep 2026'), title: pair('Frontend, Aksi Angkatan SPARTA', 'Frontend, Aksi Angkatan SPARTA'), text: pair('Developed and maintained responsive frontend interfaces for SPARTA HMIF ITB platforms.', 'Mengembangkan dan memelihara antarmuka frontend yang responsif untuk platform SPARTA HMIF ITB.') },
        { when: pair('Sep – Oct 2026', 'Sep – Okt 2026'), title: pair('Wisnight Staff, Wisuda Oktober', 'Staf Wisnight, Wisuda Oktober'), text: pair('Designed the celebration night program honoring the graduating students of HMIF ITB.', 'Merancang konsep acara malam perayaan untuk para wisudawan HMIF ITB.') },
        { when: pair('Sep 2026 – Present', 'Sep 2026 – Sekarang'), title: pair('Competitive Programming Staff, ARKAVIDIA 11.0', 'Staf Competitive Programming, ARKAVIDIA 11.0'), text: pair('Designed and curated problem sets, test cases, and solutions for national-level programming contests.', 'Merancang dan menyusun soal, kasus uji, serta solusi untuk kompetisi pemrograman tingkat nasional.') },
        { when: pair('Sep 2026 – Present', 'Sep 2026 – Sekarang'), title: pair('Technology Development Intern, HMIF ITB', 'Intern Technology Development, HMIF ITB'), text: pair('Building and refining user-facing web interfaces for the HMIF super app.', 'Membangun dan menyempurnakan antarmuka web untuk HMIF super app.') },
      ],
    },
  ] as { label: Pair; title: Pair; chapters: { when: Pair; title: Pair | string; text: Pair; photo?: { src: string; caption: Pair } }[] }[],
  greeting: pair('Hello, my name is', 'Halo, namaku'),
  role: pair('Informatics student at ITB', 'Mahasiswa Informatika ITB'),
  roles: {
    en: ['Informatics Student', 'Web Developer', 'UI/UX Designer', 'Problem Solver'],
    id: ['Mahasiswa Informatika', 'Web Developer', 'UI/UX Designer', 'Pemecah Masalah'],
  },
  lead: pair(
    "I'm an Informatics student at Institut Teknologi Bandung, interested in software engineering and AI. I approach problems analytically, enjoy understanding how things work, and am driven to turn ideas into well-crafted software.",
    'Saya adalah mahasiswa Informatika di Institut Teknologi Bandung yang tertarik pada bidang rekayasa perangkat lunak dan kecerdasan buatan. Saya terbiasa mendekati permasalahan secara analitis, senang memahami cara kerja berbagai sistem, dan termotivasi untuk mengubah ide menjadi perangkat lunak yang dirancang dengan baik.',
  ),
  contacts,
  hello,
}
