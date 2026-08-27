"use client";

export function Footer() {
  return (
    <footer className="site-footer">
  <div className="footer-clouds">
    {/* Layer 1 - Awan Belakang */}
    <svg className="footer-cloud-layer layer-back" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path d="M0,0 C150,90 350,-40 500,65 C650,140 900,10 1200,40 L1200,120 L0,120 Z"></path>
    </svg>
    {/* Layer 2 - Awan Tengah */}
    <svg className="footer-cloud-layer layer-mid" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path d="M0,30 C200,100 450,10 600,75 C800,120 1000,20 1200,60 L1200,120 L0,120 Z"></path>
    </svg>
    {/* Layer 3 - Awan Depan */}
    <svg className="footer-cloud-layer layer-front" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path d="M0,50 C180,110 380,30 550,85 C750,130 950,40 1200,80 L1200,120 L0,120 Z"></path>
    </svg>
  </div>

  <div className="footer-avatar">👋</div>

      <div className="footer-content">
        <div className="footer-top">
          <div className="newsletter-box">
            <h3>Ghina</h3>
            <p>Keep your ideals high. The sky belongs to no one. ✨</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email..." />
              <button type="submit">→</button>
            </form>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Browse</h4>
              <ul>
                <li><a href="#">Projects</a></li>
                <li><a href="#">Articles</a></li>
                <li><a href="#">Notes</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Socials</h4>
              <ul>
                <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></li>
                <li><a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a></li>
                <li><a href="#">Twitter</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>General</h4>
              <ul>
                <li><a href="#">About Ghina</a></li>
                <li><a href="#">Uses</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Ghina. All Rights Reserved.</p>
          <p>Built with Next.js & React</p>
        </div>
      </div>
    </footer>
  );
}