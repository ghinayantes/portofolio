"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Moon, Sun, X } from "lucide-react";

export default function Navbar() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchableItems = [
    { title: "Profile / Bio", link: "#profile", desc: "Informasi pendidikan dan bio Ghina Emelia Yantes" },
    { title: "Location", link: "#profile", desc: "Bandung, Indonesia (Institut Teknologi Bandung)" },
    { title: "Experience", link: "#experience", desc: "OSKM ITB, IMPACT 6.0, COMPILE 2026, BPA STEI-K ITB" },
    { title: "Projects", link: "#projects", desc: "alpro C, UNI-UNO Prolog, Personal Portfolio, Consistent Hashing Ring" },
    { title: "Achievements", link: "#achievements", desc: "Gold Medalist OMI 2024, UTBK ITB 777.56, Ranked 1st SMAN 1 Padang Panjang" },
    { title: "Tech Stack & Skills", link: "#skills", desc: "Python, C, Prolog, React, TypeScript, Next.js, Tailwind CSS" },
  ];

  const filteredResults = searchableItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  return (
    <>
      <header className="header-container">
        <nav className="header-nav">
          <Link href="/" className="header-logo">
            Ghina<span>’</span>
          </Link>

          <div className="header-links">
            <Link href="#profile" className="active">Profile</Link>
            <Link href="#experience">Experience</Link>
            <Link href="#projects">Projects</Link>
            <Link href="#achievements">Achievements</Link>
          </div>

          <div className="header-actions">
            <button
              type="button"
              aria-label="Search"
              className="icon-btn"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={18} />
            </button>

            <button
              type="button"
              aria-label="Toggle Theme"
              className="icon-btn theme-toggle-btn"
              onClick={toggleTheme}
            >
              <div className={`theme-icon-wrapper ${theme === "light" ? "rotate-sun" : "rotate-moon"}`}>
                {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
              </div>
            </button>
          </div>
        </nav>
      </header>

      {isSearchOpen && (
        <div className="search-modal-overlay" onClick={() => setIsSearchOpen(false)}>
          <div className="search-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="search-modal-header">
              <Search size={18} className="search-icon-inside" />
              <input
                type="text"
                placeholder="Cari konten (misal: Projects, Achievements)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                className="close-search-btn"
                onClick={() => setIsSearchOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="search-modal-results">
              {filteredResults.length > 0 ? (
                filteredResults.map((item, index) => (
                  <Link
                    key={index}
                    href={item.link}
                    className="search-result-item"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <strong>{item.title}</strong>
                    <p>{item.desc}</p>
                  </Link>
                ))
              ) : (
                <div className="search-empty">Tidak ada hasil ditemukan</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}