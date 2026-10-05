import { pair, type Pair } from './nav'

const contacts = [
       { key: 'email', label: pair('Email me', 'Kirim email'), href: 'mailto:ghinayantes2006@gmail.com' },
       { key: 'linkedin', label: pair('LinkedIn'), href: 'https://www.linkedin.com/in/ghina-emelia-yantes-3162592a7/' },
       { key: 'github', label: pair('GitHub'), href: 'https://github.com/ghinayantes' },
       { key: 'instagram', label: pair('Instagram'), href: 'https://www.instagram.com/ghinayantes' },
       { key: 'whatsapp', label: pair('WhatsApp'), href: 'https://wa.me/62maintain' },
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
  email: 'nama@email.com',
   photos: [
       { src: '/photo.jpg', alt: pair('Portrait of Ghina', 'Potret Ghina') },
       { src: '/photo2.jpg', alt: pair('Inaugurate the assocoation', 'Lantik himpunan') },
     ] as { src: string; alt: Pair; pos?: string }[],
  cv: '#',
  greeting: pair('Hello, my name is', 'Halo, namaku'),
  role: pair('Informatics student at ITB', 'Mahasiswa Informatika ITB'),
  roles: {
    en: ['Informatics Student', 'Web Developer', 'UI/UX Designer', 'Problem Solver'],
    id: ['Mahasiswa Informatika', 'Web Developer', 'UI/UX Designer', 'Pemecah Masalah'],
  },
  lead: pair(
    'I build web apps and design the interfaces people actually use, from first sketch to shipped code.',
    'Aku membuat aplikasi web dan mendesain antarmuka yang benar-benar dipakai, dari sketsa awal sampai jadi kode.',
  ),
  contacts,
  hello,
  socials: contacts.map((c) => [c.label, c.href] as [Pair, string]),
}
