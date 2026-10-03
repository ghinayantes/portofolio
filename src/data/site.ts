import { pair } from './nav'

/** Edit your identity here. Set `photo` to '/photo.jpg' (file in /public) to replace the placeholder. */
export const SITE = {
  name: 'Ghina Emelia Yantes',
  email: 'nama@email.com',
  photo: '',
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
  socials: [['Email', 'mailto:nama@email.com'], ['LinkedIn', '#'], ['GitHub', '#'], ['Instagram', '#']] as [string, string][],
}
