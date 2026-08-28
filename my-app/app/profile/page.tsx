import Image from "next/image";
import { CloudsBackground } from "../components/CloudsBackground";
import { profile, profileHighlights, profileSocials } from "@/lib/data/profile";

export default function ProfilePage() {
  return (
    <div className="content-page-wrapper">
      <div className="clouds-wrapper">
        <CloudsBackground />
      </div>

      <div className="content-layout">
        <header className="content-header">
          <h1>Profile</h1>
          <p>Perkenalan singkat, latar belakang, dan cara menghubungi saya.</p>
        </header>

        <div className="profile-hero">
          <div className="profile-avatar-wrapper">
            <Image src={profile.avatar} alt={profile.name} width={160} height={160} className="profile-avatar" priority />
          </div>
          <div>
            <h2 className="profile-name">{profile.name}</h2>
            <p className="profile-tagline">{profile.tagline}</p>
            <div className="profile-socials">
              {profileSocials.map((s) => (
                <a key={s.label} href={s.href} className="tag-badge">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="content-card profile-bio-card">
          <span className="content-card-eyebrow">Tentang Saya</span>
          <p className="content-card-desc">{profile.bio}</p>
        </div>

        <div className="content-cards">
          {profileHighlights.map((h) => (
            <div key={h.label} className="content-card highlight-row">
              <span className="content-card-eyebrow">{h.label}</span>
              <span className="content-card-title">{h.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}