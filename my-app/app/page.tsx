import Image from "next/image";
import { RevealCountProvider, RevealCounter, Reveal } from "./components/Reveal";
import { CloudsBackground } from "./components/CloudsBackground";
import { HeroBackground } from "./components/HeroBackground";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <RevealCountProvider>
      <HeroBackground />
      <RevealCounter />

      <main id="profile">
        {/* Hero Section */}
        <section className="hero-section">
          <p className="bio">
            Hi! Im <Reveal trigger="Ghina"> Emelia Yantes </Reveal>, studying Informatics Engineering at{" "}
            <Reveal trigger="STEI-K ITB">Institut Teknologi Bandung. I’m naturally curious{" "}
            <Reveal trigger="about">software, design, and everything in between. Between managing coursework and chasing my curiosity, I spend{" "}
            <Reveal trigger="my time">turning abstract concepts into functional tools and building my way through the web</Reveal></Reveal></Reveal>.
          </p>

          {/* Wave/Clouds dimasukkan tepat di dasar Hero Section */}
          <CloudsBackground />
        </section>

        {/* Bento Grid */}
        <section className="content-section">
          <div className="bento-grid">
            <div className="bento-card col-span-2">
              <h3>Education & Location</h3>
              <p>B.Sc. in Informatics at Institut Teknologi Bandung (CGPA 3.89/4.00). Awardee of Paragon Scholarship Program Excellence. Originally from Sumatera Barat, currently based in Bandung.</p>
            </div>

            <div className="bento-card">
              <h3>Pronouns</h3>
              <p>she/her</p>
            </div>

            <div className="bento-card row-span-2">
              <h3>Interactive Tools</h3>
              <p>I enjoy building cool and functional stuff—from low-level terminal browsers in C to discrete math hashing algorithms in Python.</p>
            </div>

            <div className="bento-card" id="skills">
              <h3>Tech Stack</h3>
              <p>Python, C, Prolog, Assembly (x86-64), React, Next.js, TypeScript, Tailwind CSS, Zustand.</p>
            </div>

            <div className="bento-card col-span-2">
              <h3>Workspace & Tools</h3>
              <p>Git, GitHub, VS Code, WSL2 (Ubuntu), NumPy, pandas. Where concepts get turned into functional tools.</p>
            </div>
          </div>

          {/* Section: Experience */}
          <section id="experience" style={{ marginTop: "6rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>Experience</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className="bento-card">
                <h3>Event Organizer Staff OSKM ITB 2026<span style={{ fontSize: "0.85rem", color: "var(--card-desc)", float: "right" }}>Jul 2026 - Present</span></h3>
                <p>Official orientation program for incoming undergraduate students at Institut Teknologi Bandung.</p>
              </div>

              <div className="bento-card">
                <h3>Competition Staff & Math Tutor IMPACT 6.0<span style={{ fontSize: "0.85rem", color: "var(--card-desc)", float: "right" }}>Mar 2026 - Jul 2026</span></h3>
                <p>Served as Problem Setter and official invigilator for high school Informatics, Math, Physics, and Logics competitions. Gave math lessons to IUP students for SNBT preparation.</p>
              </div>

              <div className="bento-card">
                <h3>Curriculum QA Staff COMPILE 2026<span style={{ fontSize: "0.85rem", color: "var(--card-desc)", float: "right" }}>Feb 2026 - Apr 2026</span></h3>
                <p>Reviewed and audited educational modules drafted by the development team to ensure pedagogical quality and technical accuracy.</p>
              </div>

              <div className="bento-card">
                <h3>Academic Staff BPA STEI-K ITB 2025<span style={{ fontSize: "0.85rem", color: "var(--card-desc)", float: "right" }}>Oct 2025 - Jul 2026</span></h3>
                <p>Designed peer-tutoring networks, curated study materials, and facilitated mentorship for STEI-K 2025 peers.</p>
              </div>

            </div>
          </section>

          {/* Section: Projects (Interactive Image Grid with Links) */}
          <section id="projects" style={{ marginTop: "6rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>Projects</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
              
              {/* Project 1 */}
              <a href="https://drive.google.com/file/d/14qMrzcoD6yUtVaezmsRmfyYFBR_01j8a/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="project-card-link">
                <div className="bento-card project-card">
                  <Image src="/projects/alpro.png" alt="AlproShell" width={600} height={400} className="project-img" />
                  <div className="project-overlay">
                    <h3>AlproShell <span>2026</span></h3>
                    <p>Built a terminal-based browser simulation for Algorithms and Programming I project in pure C.</p>
                  </div>
                </div>
              </a>

              {/* Project 2 */}
              <a href="https://github.com/ghinayantes/IF1221_G08_InfokanMabarEpEp" target="_blank" rel="noopener noreferrer" className="project-card-link">
                <div className="bento-card project-card">
                  <Image src="/projects/uni.png" alt="UNI-UNO Card Game Engine" width={600} height={400} className="project-img" />
                  <div className="project-overlay">
                    <h3>UNI-UNO Card Game Engine <span>2026</span></h3>
                    <p>2-4 player UNO engine in GNU Prolog with 2v2 tournament mode and custom mechanics.</p>
                  </div>
                </div>
              </a>

              {/* Project 3 */}
              <a href="https://github.com/ghinayantes/Web-Development-GDOCITB" target="_blank" rel="noopener noreferrer" className="project-card-link">
                <div className="bento-card project-card">
                  <Image src="/projects/web.png" alt="Personal Portfolio (GDoC ITB)" width={600} height={400} className="project-img" />
                  <div className="project-overlay">
                    <h3>Personal Portfolio (GDoC ITB) <span>2026</span></h3>
                    <p>Personal portfolio website built as part of GDGOC ITB Web Dev Path (React, TS, Tailwind CSS).</p>
                  </div>
                </div>
              </a>

              {/* Project 4 */}
              <a href="https://github.com/ghinayantes/IF1220-Matematika-DIskrit-Makalah" target="_blank" rel="noopener noreferrer" className="project-card-link">
                <div className="bento-card project-card">
                  <Image src="/projects/hashing.png" alt="Consistent Hashing Ring" width={600} height={400} className="project-img" />
                  <div className="project-overlay">
                    <h3>Consistent Hashing Ring <span>2026</span></h3>
                    <p>Python implementation of consistent hashing with weighted virtual nodes for Discrete Mathematics paper.</p>
                  </div>
                </div>
              </a>

              {/* Project 5 */}
              <a href="https://github.com/ghinayantes/Tubes-Berkom-1" target="_blank" rel="noopener noreferrer" className="project-card-link">
                <div className="bento-card project-card">
                  <Image src="/projects/elevator.png" alt="Elevator Simulation" width={600} height={400} className="project-img" />
                  <div className="project-overlay">
                    <h3>Elevator Simulation <span>2025</span></h3>
                    <p>Terminal-based elevator control in Python handling multi-floor requests, capacity limits, and movement optimization.</p>
                  </div>
                </div>
              </a>

              {/* Project 6 */}
              <a href="https://github.com/ghinayantes/Tubes-Berkom-2" target="_blank" rel="noopener noreferrer" className="project-card-link">
                <div className="bento-card project-card">
                  <Image src="/projects/canteen.png" alt="Digital Canteen Ordering System" width={600} height={400} className="project-img" />
                  <div className="project-overlay">
                    <h3>Digital Canteen <span>2025</span></h3>
                    <p>CLI food-ordering simulation with vendor/menu browsing, cart, cash/QRIS payment, and real-time queue status.</p>
                  </div>
                </div>
              </a>

            </div>
          </section>

          {/* Section: Achievements */}
          <section id="achievements" style={{ marginTop: "6rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>Achievements & Awards</h2>
            <div className="bento-card">
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <li style={{ borderBottom: "1px solid var(--card-border)", paddingBottom: "0.75rem" }}>
                  <strong style={{ color: "var(--card-title)", fontSize: "1.05rem" }}>🥇 Gold Medalist — National Mathematics Olympiad (OMI)</strong>
                  <p style={{ margin: "0.2rem 0 0", color: "var(--card-desc)" }}>National Level Winner (2024).</p>
                </li>
                <li style={{ borderBottom: "1px solid var(--card-border)", paddingBottom: "0.75rem" }}>
                  <strong style={{ color: "var(--card-title)", fontSize: "1.05rem" }}>🎓 State University Entrance (SNBT ITB)</strong>
                  <p style={{ margin: "0.2rem 0 0", color: "var(--card-desc)" }}>Admitted to ITB via SNBT with UTBK score of 777.56 (2025).</p>
                </li>
                <li style={{ borderBottom: "1px solid var(--card-border)", paddingBottom: "0.75rem" }}>
                  <strong style={{ color: "var(--card-title)", fontSize: "1.05rem" }}>🏆 Academic Excellence — Ranked 1st in Class</strong>
                  <p style={{ margin: "0.2rem 0 0", color: "var(--card-desc)" }}>Ranked 1st in Class for Academic Years 2023/2024 and 2024/2025 at SMAN 1 Padang Panjang.</p>
                </li>
                <li style={{ borderBottom: "1px solid var(--card-border)", paddingBottom: "0.75rem" }}>
                  <strong style={{ color: "var(--card-title)", fontSize: "1.05rem" }}>🏅 KSM Matematika</strong>
                  <p style={{ margin: "0.2rem 0 0", color: "var(--card-desc)" }}>4th Place, City/Regional Level (2024).</p>
                </li>
                <li>
                  <strong style={{ color: "var(--card-title)", fontSize: "1.05rem" }}>⭐ Regional & Early Math Competitions</strong>
                  <p style={{ margin: "0.2rem 0 0", color: "var(--card-desc)" }}>Finalist GENTSOFIC, TENSAI & CASIO (2024); Semifinalist UMC UNP & UIN Bukittinggi (2023); Selected Participant Malaysia-Singapore Study Tour (2018).</p>
                </li>
              </ul>
            </div>
          </section>

        </section>
      </main>

      <Footer />
    </RevealCountProvider>
  );
}