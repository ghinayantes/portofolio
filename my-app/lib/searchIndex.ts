import { slugify } from "./slugify";
import { skills } from "./data/academic";
import { experiences } from "./data/experience";
import { achievements } from "./data/achievements";
import { projectsData } from "./data/projects";

export type SearchDocType = "Profile" | "Academic" | "Experience" | "Projects" | "Achievements";

export interface SearchDoc {
  title: string;
  type: SearchDocType;
  href: string;
  keywords?: string[];
}

/** Dipakai saat search box masih kosong — cuma tampilkan kategori utama */
export const quickLinks: SearchDoc[] = [
  { title: "Profile", type: "Profile", href: "/profile" },
  { title: "Academic", type: "Academic", href: "/academic" },
  { title: "Experience", type: "Experience", href: "/experience" },
  { title: "Projects", type: "Projects", href: "/projects" },
  { title: "Achievements", type: "Achievements", href: "/achievements" },
];

/** Index lengkap untuk fuzzy search — mencakup konten asli tiap halaman */
export const searchIndex: SearchDoc[] = [
  {
    title: "Profile",
    type: "Profile",
    href: "/profile",
    keywords: ["about", "bio", "tentang", "profil"],
  },
  {
    title: "Academic Profile",
    type: "Academic",
    href: "/academic#pendidikan",
    keywords: ["akademik", "kuliah", "itb", "cgpa"],
  },
  {
    title: "Tech Stack & Skills",
    type: "Academic",
    href: "/academic#skills",
    keywords: skills,
  },
  ...experiences.map((exp) => ({
    title: exp.role,
    type: "Experience" as const,
    href: `/experience#${slugify(exp.organization)}`,
    keywords: [exp.organization],
  })),
  ...projectsData.map((p) => ({
    title: p.title,
    type: "Projects" as const,
    href: `/projects#${p.id}`,
    keywords: [...p.tags, p.techStack],
  })),
  ...achievements.map((a) => ({
    title: a.title,
    type: "Achievements" as const,
    href: `/achievements#${slugify(a.title)}`,
    keywords: [a.category],
  })),
];