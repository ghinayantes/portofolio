export interface Achievement {
  title: string;
  category: string;
  desc: string;
}

export const achievements: Achievement[] = [
  {
    title: "Gold Medalist OMI 2024",
    category: "National Olympiad",
    desc: "Meraih medali emas dalam Olimpiade Matematika dan Informatika nasional.",
  },
  {
    title: "UTBK Score: 777.56",
    category: "National College Entrance Exam",
    desc: "Skor ujian seleksi masuk perguruan tinggi negeri peringkat atas nasional ke ITB.",
  },
  {
    title: "Ranked 1st Valedictorian",
    category: "SMAN 1 Padang Panjang",
    desc: "Lulusan terbaik peringkat 1 umum di SMAN 1 Padang Panjang.",
  },
];