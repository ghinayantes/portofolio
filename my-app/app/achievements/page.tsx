"use client";

import { useEffect } from "react";
import { CloudsBackground } from "../components/CloudsBackground";
import { achievements } from "@/lib/data/achievements";
import { slugify } from "@/lib/slugify";

export default function AchievementsPage() {
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
          <h1>Achievements</h1>
          <p>Penghargaan akademis dan pencapaian kompetisi.</p>
        </header>

        <div className="content-cards">
          {achievements.map((item) => (
            <div key={item.title} id={slugify(item.title)} className="content-card">
              <span className="content-card-eyebrow">{item.category}</span>
              <h2 className="content-card-title">{item.title}</h2>
              <p className="content-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}