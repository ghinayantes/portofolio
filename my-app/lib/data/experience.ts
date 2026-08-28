export interface Experience {
  role: string;
  organization: string;
  period: string;
  desc: string;
}

export const experiences: Experience[] = [
  {
    role: "Head of Academic Department",
    organization: "COMPILE 2026",
    period: "2026 - Present",
    desc: "Memimpin departemen akademik dalam penyusunan kurikulum dan materi pelatihan pemrograman.",
  },
  {
    role: "Board of Academic Affairs",
    organization: "BPA STEI-K ITB",
    period: "2025 - Present",
    desc: "Mengelola program akademis dan pendampingan kurikulum mahasiswa STEI Komputasi ITB.",
  },
  {
    role: "Staff IT & Development",
    organization: "IMPACT 6.0",
    period: "2025",
    desc: "Mengembangkan platform digital dan infrastruktur web untuk mendukung operasional acara.",
  },
  {
    role: "Staff Operational & Event",
    organization: "OSKM ITB 2024",
    period: "2024",
    desc: "Berperan dalam perencanaan logistik dan eksekusi lapangan Orientasi Studi Keluarga Mahasiswa ITB.",
  },
];