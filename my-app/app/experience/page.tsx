"use client";

import { useEffect } from "react";
import { CloudsBackground } from "../components/CloudsBackground";
import { experiences } from "@/lib/data/experience";
import { slugify } from "@/lib/slugify";

export default function ExperiencePage() {
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
          <h1>Experience</h1>
          <p>Pengalaman organisasi, kepanitiaan, dan kepemimpinan di ITB.</p>
        </header>

        <div className="content-cards">
          {experiences.map((exp) => (
            <div key={exp.organization} id={slugify(exp.organization)} className="content-card experience-card">
              <div>
                <h2 className="content-card-title">{exp.role}</h2>
                <p className="content-card-sub">{exp.organization}</p>
                <p className="content-card-desc">{exp.desc}</p>
              </div>
              <span className="content-card-period">{exp.period}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}