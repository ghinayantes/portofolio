export type Pair = { en: string; id: string }
export type Localized = string | Pair
export const localized = (value: Localized, lang: 'en' | 'id') => typeof value === 'string' ? value : value[lang]
export const pair = (en: string, id = en): Pair => ({ en, id })
export type NavItem = { key: string; title: Pair; desc: Pair }
/** `desc` = one-line summary of the group, shown beside its pages in the home index. */
export type NavGroup = { title: Pair; desc: Pair; items: NavItem[] }
const it = (key: string, en: string, id: string, den: string, did: string): NavItem => ({ key, title: pair(en, id), desc: pair(den, did) })

export const NAV: NavGroup[] = [
  { title: pair('Profile', 'Profil'), desc: pair('Who I am, what I know, and what I have earned.', 'Siapa aku, apa yang kukuasai, dan apa yang sudah kuraih.'), items: [
    it('about', 'About', 'Tentang', 'Who I am', 'Siapa aku'),
    it('portfolio', 'Portfolio', 'Portofolio', 'Everything on one page', 'Semua dalam satu halaman'),
    it('skills', 'Skills', 'Keahlian', 'Languages, tools, soft skills', 'Bahasa pemrograman, tools, dan soft skill'),
    it('certificate', 'Certificates', 'Sertifikat', 'Courses and credentials', 'Kursus dan kredensial'),
    it('news', 'News', 'Kabar', 'Updates and notes', 'Pembaruan dan catatan'),
  ] },
  { title: pair('Experience', 'Pengalaman'), desc: pair('Where I have contributed and what I have built.', 'Tempat aku berkontribusi dan apa yang sudah kubangun.'), items: [
    it('work', 'Work', 'Kerja', 'Internships and jobs', 'Magang dan pekerjaan'),
    it('project', 'Projects', 'Proyek', 'What I built', 'Yang sudah kubangun'),
    it('organization', 'Organizations', 'Organisasi', 'Committees and communities', 'Kepanitiaan dan komunitas'),
    it('award', 'Awards', 'Penghargaan', 'Recognition and scholarships', 'Prestasi dan beasiswa'),
    it('hire', 'Hire me', 'Hubungi aku', 'Availability and contact', 'Ketersediaan dan kontak'),
  ] },
  { title: pair('Artwork', 'Karya'), desc: pair('Things I have designed and written.', 'Hal-hal yang kurancang dan kutulis.'), items: [
    it('design', 'Design', 'Desain', 'UI/UX and visual work', 'Karya UI/UX dan visual'),
    it('writing', 'Writing', 'Tulisan', 'Essays and documentation', 'Esai dan dokumentasi'),
  ] },
  { title: pair('Other', 'Lainnya'), desc: pair('My background, my journey, and the full site map.', 'Latar belakang, perjalanan, dan peta situs lengkap.'), items: [
    it('education', 'Education', 'Pendidikan', 'Schools and coursework', 'Sekolah dan mata kuliah'),
    it('timeline', 'Timeline', 'Linimasa', 'My journey by year', 'Perjalananku per tahun'),
    it('sitemap', 'Sitemap', 'Peta situs', 'Every page in one tree', 'Semua halaman dalam satu pohon'),
  ] },
]
export const ALL = NAV.flatMap((g, gi) => g.items.map((i) => ({ ...i, gi })))
