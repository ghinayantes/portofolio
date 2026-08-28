export interface Project {
  id: string;
  title: string;
  date: string;
  tags: string[];
  techStack: string;
  description: string[];
  image: string;
}

export const projectsData: Project[] = [
  {
    id: "alproshell",
    title: "AlproShell",
    date: "2026 — Present",
    tags: ["Systems", "CLI"],
    techStack: "C, CLI, Data Structures",
    description: [
      "Built a terminal-based browser simulation for Algorithms and Programming I project in pure C.",
      "Implemented custom CLI data structures to efficiently manage navigation history and process rendering.",
      "Designed a light-weight command parser tailored for low-level systems execution.",
    ],
    image: "/projects/alpro.png",
  },
  {
    id: "uni-uno",
    title: "UNI–UNO Card Game Engine",
    date: "2026",
    tags: ["Game Dev", "Logic"],
    techStack: "GNU Prolog, Logic Programming",
    description: [
      "Engineered a 2–4 player UNO engine in GNU Prolog featuring 2v2 tournament modes.",
      "Implemented custom game mechanics, rule verification, and bot AI logic entirely in Prolog.",
      "Provided an interactive turn-based console interface for match state management.",
    ],
    image: "/projects/uni.png",
  },
  {
    id: "personal-portfolio",
    title: "Personal Portfolio",
    date: "2026",
    tags: ["Web Dev", "Frontend"],
    techStack: "Next.js, TypeScript, Tailwind CSS, React",
    description: [
      "Developed an interactive portfolio website built as part of Next.js & Web Dev Path.",
      "Features seamless dark/light theme switching, responsive layouts, and modern UI transitions.",
      "Optimized component architecture using Next.js App Router and dynamic state handling.",
    ],
    image: "/projects/web.png",
  },
  {
    id: "consistent-hashing",
    title: "Consistent Hashing Ring",
    date: "2026",
    tags: ["Distributed Systems", "Math"],
    techStack: "Python, Distributed Systems",
    description: [
      "Python implementation of consistent hashing with weighted virtual nodes for Discrete Mathematics paper.",
      "Simulated real-time server node joins, leaves, and load distribution balance dynamics.",
      "Visualized node ring topology and key allocation metrics for performance evaluation.",
    ],
    image: "/projects/hashing.png",
  },
  {
    id: "digital-canteen",
    title: "Digital Canteen",
    date: "2025",
    tags: ["CLI", "Simulation"],
    techStack: "Python, CLI",
    description: [
      "CLI food-ordering simulation featuring vendor/menu browsing, cart management, and payment methods.",
      "Integrated simulated cash & QRIS payment flows with real-time order queue updates.",
      "Structured data layer to handle concurrent customer orders and menu dynamic updates.",
    ],
    image: "/projects/canteen.png",
  },
];