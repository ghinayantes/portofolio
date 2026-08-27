export interface ProjectItem {
  id: string;
  year: string;
  date: string;
  title: string;
  tags: string[];
  techStack: string;
  bullets: string[];
  image: string;
  link: string;
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "alpro-shell",
    year: "2026",
    date: "2026",
    title: "AlproShell",
    tags: ["Systems", "CLI", "Algorithms"],
    techStack: "Pure C",
    bullets: [
      "Built a terminal-based browser simulation for Algorithms and Programming I final project.",
      "Implemented custom tab navigation, history management, and page editing features.",
    ],
    image: "/projects/alpro.png",
    link: "https://drive.google.com/file/d/14qMrzcoD6yUtVaezmsRmfyYFBR_01j8a/view?usp=sharing",
  },
  {
    id: "uni-uno",
    year: "2026",
    date: "2026",
    title: "UNI-UNO Card Game Engine",
    tags: ["Game Dev", "Logic", "Declarative"],
    techStack: "GNU Prolog",
    bullets: [
      "Developed a 2-4 player UNO card game engine entirely in GNU Prolog.",
      "Features a 2v2 tournament mode, rule validation, and custom mechanics.",
    ],
    image: "/projects/uni.png",
    link: "https://github.com/ghinayantes/IF1221_G08_InfokanMabarEpEp",
  },
  {
    id: "hashing-ring",
    year: "2026",
    date: "2026",
    title: "Consistent Hashing Ring",
    tags: ["Discrete Math", "Distributed Systems"],
    techStack: "Python",
    bullets: [
      "Python implementation of consistent hashing with weighted virtual nodes.",
      "Written for Discrete Mathematics research paper on load distribution.",
    ],
    image: "/projects/hashing.png",
    link: "https://github.com/ghinayantes/IF1220-Matematika-DIskrit-Makalah",
  },
  {
    id: "digital-canteen",
    year: "2025",
    date: "2025",
    title: "Digital Canteen System",
    tags: ["CLI", "Simulation"],
    techStack: "Python",
    bullets: [
      "CLI food-ordering simulation with multi-vendor & menu browsing.",
      "Supports cart management, cash/QRIS payment options, and queue status.",
    ],
    image: "/projects/canteen.png",
    link: "https://github.com/ghinayantes/Tubes-Berkom-2",
  },
];