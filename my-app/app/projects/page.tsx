"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CloudsBackground } from "../components/CloudsBackground";

interface Project {
  id: string;
  title: string;
  date: string;
  tags: string[];
  techStack: string;
  description: string[];
  image: string;
}

const projectsData: Project[] = [
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

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project>(projectsData[0]);
  const cardRefs = useRef<{ [key: string]: HTMLElement | null }>({});

 {/* // Auto-update kolom kanan saat kartu masuk area tengah layar (scroll-sync)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-id");
            const found = projectsData.find((p) => p.id === id);
            if (found) {
              setSelectedProject(found);
            }
          }
        });
      },
      {
        rootMargin: "-30% 0px -40% 0px", // Memastikan deteksi fokus tepat di tengah layar
        threshold: 0.2,
      }
    );

    Object.values(cardRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []); */}

  return (
    <div className="projects-page-wrapper">
      <div className="clouds-wrapper">
        <CloudsBackground />
      </div>

      <div className="projects-layout">
        {/* KOLOM KIRI */}
        <div className="projects-list-column">
          <header className="projects-header">
            <h1>Projects</h1>
            <p>Daftar proyek perangkat lunak dan eksperimen yang telah diselesaikan.</p>
          </header>

          <div className="projects-cards-wrapper">
            {projectsData.map((project) => {
              const isSelected = selectedProject.id === project.id;

              return (
                <motion.article
                  key={project.id}
                  data-id={project.id}
                  ref={(el) => {
                    cardRefs.current[project.id] = el as HTMLElement | null;
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`project-card ${isSelected ? "selected" : ""}`}
                  onMouseEnter={() => setSelectedProject(project)}
                  onClick={() => setSelectedProject(project)}
                >
                  <span className="project-date">{project.date}</span>

                  <div className="project-title-row">
                    <h2>{project.title}</h2>
                    <div className="project-tags">
                      {project.tags.map((tag) => (
                        <span key={tag} className="tag-badge">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="project-tech">{project.techStack}</p>

                  <ul className="project-bullet-list">
                    {project.description.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* KOLOM KANAN */}
        <div className="projects-preview-column">
          <div className="preview-sticky-box">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedProject.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="preview-content-card"
              >
                <div className="preview-image-wrapper">
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    width={700}
                    height={500}
                    className="preview-image"
                    priority
                  />
                </div>

                <div className="preview-info">
                  <h2>{selectedProject.title}</h2>
                  <div className="preview-tags">
                    {selectedProject.tags.map((tag) => (
                      <span key={tag} className="tag-badge">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="preview-tech">{selectedProject.techStack}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}