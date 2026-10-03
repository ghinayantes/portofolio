export type Pair = { en: string; id: string }
export const pair = (en: string, id = en): Pair => ({ en, id })
export type NavItem = { key: string; title: Pair; desc: Pair }
export type NavGroup = { title: Pair; items: NavItem[] }
const it = (key: string, en: string, id: string, den: string, did: string): NavItem => ({ key, title: pair(en, id), desc: pair(den, did) })

export const NAV: NavGroup[] = [
  { title: pair('Profile', 'Profil'), items: [
    it('about', 'About', 'Tentang', 'Who I am', 'Siapa aku'),
    it('portfolio', 'Portfolio', 'Portofolio', 'Everything on one page', 'Semua dalam satu halaman'),
    it('skills', 'Skills', 'Skill', 'Languages, tools, soft skills', 'Bahasa, tools, soft skill'),
    it('certificate', 'Certificates', 'Sertifikat', 'Courses and credentials', 'Kursus dan kredensial'),
    it('news', 'News', 'Kabar', 'Updates and notes', 'Pembaruan dan catatan'),
  ] },
  { title: pair('Experience', 'Pengalaman'), items: [
    it('work', 'Work', 'Kerja', 'Internships and jobs', 'Magang dan pekerjaan'),
    it('project', 'Projects', 'Proyek', 'What I built', 'Yang sudah kubangun'),
    it('organization', 'Organizations', 'Organisasi', 'Committees and communities', 'Kepanitiaan dan komunitas'),
    it('award', 'Awards', 'Penghargaan', 'Recognition and scholarships', 'Prestasi dan beasiswa'),
    it('hire', 'Hire me', 'Hubungi aku', 'Availability and contact', 'Ketersediaan dan kontak'),
  ] },
  { title: pair('Artwork', 'Karya'), items: [
    it('design', 'Design', 'Desain', 'UI/UX and visual work', 'Karya UI/UX dan visual'),
    it('writing', 'Writing', 'Tulisan', 'Essays and documentation', 'Esai dan dokumentasi'),
  ] },
  { title: pair('Other', 'Lainnya'), items: [
    it('education', 'Education', 'Pendidikan', 'Schools and coursework', 'Sekolah dan mata kuliah'),
    it('timeline', 'Timeline', 'Linimasa', 'My journey by year', 'Perjalananku per tahun'),
    it('sitemap', 'Sitemap', 'Peta situs', 'Every page in one tree', 'Semua halaman dalam satu pohon'),
  ] },
]
export const ALL = NAV.flatMap((g, gi) => g.items.map((i) => ({ ...i, gi })))
