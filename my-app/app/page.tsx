import { RevealCountProvider, RevealCounter, Reveal } from "./components/Reveal";
import { CloudsBackground } from "./components/CloudsBackground";
import { HeroBackground } from "./components/HeroBackground";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <RevealCountProvider>
      {/* Dynamic Slideshow Background & Waves */}
      <HeroBackground />
      <CloudsBackground />
      <RevealCounter />

      <main id="profile">
        {/* Section 1: Hero / Deskripsi Diri (Latar Gambar Gelap) */}
        <section className="hero-section">
          <p className="bio">
            Hi! Im <Reveal trigger="Ghina"> Emelia Yantes </Reveal>, studying Informatics Engineering at{" "}
            <Reveal trigger="STEI-K ITB">School of Electrical Engineering and Informatics - Computing. I’m naturally curious{" "}
            <Reveal trigger="about">software, design, and everything in between. Between managing coursework and chasing my curiosity, I spend{" "}
            <Reveal trigger="my time">turning abstract concepts into functional tools and building my way through the web</Reveal></Reveal></Reveal>.
          </p>
        </section>

        {/* Section 2: Bento Grid & Content (Latar Belakang Polos Mengikuti Tema) */}
        <section className="content-section">
          <div className="bento-grid">
            <div className="bento-card col-span-2">
              <h3>Location</h3>
              <p>I'm from Sumater Barat, Indonesia. Currently studying at Institut Teknologi Bandung.</p>
            </div>

            <div className="bento-card">
              <h3>Pronouns</h3>
              <p>she/her</p>
            </div>

            <div className="bento-card row-span-2">
              <h3>Interactive Tools</h3>
              <p>I enjoy building cool and weird stuff with code to explore web fundamentals.</p>
            </div>

            <div className="bento-card">
              <h3>Tech Stack</h3>
              <p>Next.js, React, TypeScript, Tailwind CSS.</p>
            </div>

            <div className="bento-card col-span-2">
              <h3>Workspace</h3>
              <p>Where concepts get turned into functional tools.</p>
            </div>
          </div>

          {/* Section Experience */}
          <section id="experience" style={{ marginTop: "6rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>Experience</h2>
            <div className="bento-card">
              <p style={{ color: "var(--card-desc)" }}>Bagian pengalaman organisasi/kepanitiaan akan ditampilkan di sini.</p>
            </div>
          </section>

          {/* Section Projects */}
          <section id="projects" style={{ marginTop: "6rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>Projects</h2>
            <div className="bento-card">
              <p style={{ color: "var(--card-desc)" }}>Kumpulan project web & tools akan dimasukkan di sini.</p>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </RevealCountProvider>
  );
}