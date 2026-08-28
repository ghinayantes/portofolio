"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Moon,
  Sun,
  X,
  ChevronDown,
  User,
  FolderGit2,
  Briefcase,
  Trophy,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { fuzzySearchList } from "@/lib/fuzzySearch";
import { searchIndex, quickLinks, type SearchDoc } from "@/lib/searchIndex";

const navMenuData = [
  { title: "Profile", sectionHref: "/#profile", detailHref: "/profile", icon: User },
  { title: "Academic", sectionHref: "/#academic", detailHref: "/academic", icon: GraduationCap },
  { title: "Experience", sectionHref: "/#experience", detailHref: "/experience", icon: Briefcase },
  { title: "Projects", sectionHref: "/#projects", detailHref: "/projects", icon: FolderGit2 },
  { title: "Achievements", sectionHref: "/#achievements", detailHref: "/achievements", icon: Trophy },
];

const typeIcon: Record<SearchDoc["type"], typeof User> = {
  Profile: User,
  Academic: GraduationCap,
  Experience: Briefcase,
  Projects: FolderGit2,
  Achievements: Trophy,
};

/** Render teks dengan karakter hasil fuzzy match di-highlight */
function HighlightedText({ text, matches }: { text: string; matches: number[] }) {
  if (matches.length === 0) return <>{text}</>;

  const matchSet = new Set(matches);
  const parts: { text: string; highlighted: boolean }[] = [];
  let current = "";
  let currentHighlighted = false;

  for (let i = 0; i < text.length; i++) {
    const isHighlighted = matchSet.has(i);
    if (i === 0) {
      current = text[i];
      currentHighlighted = isHighlighted;
      continue;
    }
    if (isHighlighted === currentHighlighted) {
      current += text[i];
    } else {
      parts.push({ text: current, highlighted: currentHighlighted });
      current = text[i];
      currentHighlighted = isHighlighted;
    }
  }
  parts.push({ text: current, highlighted: currentHighlighted });

  return (
    <>
      {parts.map((part, i) =>
        part.highlighted ? (
          <mark key={i} className="search-match">
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navRef = useRef<HTMLDivElement>(null);
  const resultRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  // Query kosong -> tampilkan quick links saja. Ada query -> fuzzy search ke seluruh konten.
  const searchResults = useMemo(() => {
    if (searchQuery.trim().length === 0) {
      return quickLinks.map((item) => ({ item, score: 0, titleMatches: [] as number[] }));
    }
    return fuzzySearchList(searchIndex, searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setActiveIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    resultRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        closeSearch();
        setOpenDropdown(null);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const toggleDropdown = (title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdown((prev) => (prev === title ? null : title));
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setActiveIndex(0);
  };

  const goToResult = (index: number) => {
    const result = searchResults[index];
    if (!result) return;
    closeSearch();
    router.push(result.item.href);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      goToResult(activeIndex);
    }
  };

  return (
    <>
      <header className="header-container">
        <nav className="header-nav" ref={navRef}>
          <Link href="/" className="header-logo">
            Ghina<span>'</span>
          </Link>

          <div className="header-links">
            {navMenuData.map((menu) => {
              const MainIcon = menu.icon;
              const isActive = pathname === menu.detailHref;
              const isOpen = openDropdown === menu.title;

              return (
                <div key={menu.title} className="nav-item-wrapper">
                  <div className="nav-link-group">
                    <Link
                      href={menu.sectionHref}
                      className={`nav-link-btn ${isActive ? "active" : ""}`}
                      onClick={() => setOpenDropdown(null)}
                    >
                      <MainIcon size={18} />
                      <span>{menu.title}</span>
                    </Link>

                    <button
                      type="button"
                      className="chevron-btn"
                      onClick={(e) => toggleDropdown(menu.title, e)}
                      aria-label={`Toggle ${menu.title} menu`}
                    >
                      <ChevronDown size={14} className={`chevron-icon ${isOpen ? "rotate" : ""}`} />
                    </button>
                  </div>

                  {isOpen && (
                    <div className="custom-dropdown-card">
                      <Link
                        href={menu.detailHref}
                        className="custom-dropdown-item"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <div className="dropdown-label">
                          <span>Lihat Detail {menu.title}</span>
                        </div>
                        <ArrowRight size={16} className="arrow-icon" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="header-actions">
            <button type="button" aria-label="Search" className="icon-btn" onClick={() => setIsSearchOpen(true)}>
              <Search size={18} />
            </button>

            <button type="button" aria-label="Toggle Theme" className="icon-btn theme-toggle-btn" onClick={toggleTheme}>
              <div className={`theme-icon-wrapper ${theme === "light" ? "rotate-sun" : "rotate-moon"}`}>
                {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
              </div>
            </button>
          </div>
        </nav>
      </header>

      {isSearchOpen && (
        <div className="search-modal-overlay" onClick={closeSearch}>
          <div className="search-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="search-modal-header">
              <Search size={18} className="search-icon-inside" />
              <input
                type="text"
                placeholder="Cari halaman, project, atau pengalaman..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                autoFocus
              />
              <button type="button" className="close-search-btn" onClick={closeSearch}>
                <X size={18} />
              </button>
            </div>

            <div className="search-modal-results" role="listbox">
              {searchResults.map((result, index) => {
                const ItemIcon = typeIcon[result.item.type];
                return (
                  <Link
                    key={result.item.href}
                    ref={(el) => {
                      resultRefs.current[index] = el;
                    }}
                    href={result.item.href}
                    className={`search-result-item ${index === activeIndex ? "active" : ""}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={closeSearch}
                  >
                    <div className="search-result-label">
                      <ItemIcon size={16} className="search-result-icon" />
                      <div className="search-result-text">
                        <strong>
                          <HighlightedText text={result.item.title} matches={result.titleMatches} />
                        </strong>
                        <span className="search-result-type">{result.item.type}</span>
                      </div>
                    </div>
                    <ArrowRight size={14} className="arrow-icon" />
                  </Link>
                );
              })}

              {searchResults.length === 0 && (
                <p style={{ padding: "0.75rem 1rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  Tidak ada hasil untuk &quot;{searchQuery}&quot;
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}