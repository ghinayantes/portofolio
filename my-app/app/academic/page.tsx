"use client";

import { useEffect } from "react";
import { CloudsBackground } from "../components/CloudsBackground";
import { education, skills } from "@/lib/data/academic";

export default function AcademicPage() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <div className="content-page-wrapper">
      <div className="clouds-wrapper">
        <CloudsBackground />
      </div>

      <div className="content-layout">
        <header className="content-header">
          <h1>Academic Profile</h1>
          <p>Latar belakang pendidikan dan bidang keahlian teknis.</p>
        </header>

        <div className="content-cards">
          <div id="pendidikan" className="content-card">
            <span className="content-card-eyebrow">Pendidikan Utama</span>
            <h2 className="content-card-title">{education.institution}</h2>
            <p className="content-card-sub">{education.program}</p>
            <p className="content-card-highlight">CGPA: {education.cgpa}</p>
            <p className="content-card-note">{education.note}</p>
          </div>

          <div id="skills" className="content-card">
            <span className="content-card-eyebrow">Tech Stack & Skills</span>
            <div className="skills-grid">
              {skills.map((skill) => (
                <span key={skill} className="tag-badge">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}