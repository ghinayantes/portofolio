import React from "react";

export function CloudsBackground() {
  return (
    <div className="clouds-container" aria-hidden="true">
      {/* Lapisan Awan 1 (Paling Belakang / Transparan) */}
      <svg className="cloud-layer layer-1" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="var(--cloud-layer-1)" d="M0,224 C120,200 240,180 360,200 C480,220 600,280 720,270 C840,260 960,180 1080,180 C1200,180 1320,240 1440,224 L1440,320 L0,320 Z"></path>
      </svg>

      {/* Lapisan Awan 2 (Tengah) */}
      <svg className="cloud-layer layer-2" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="var(--cloud-layer-2)" d="M0,256 C180,210 320,230 480,260 C640,290 800,220 960,220 C1120,220 1280,270 1440,240 L1440,320 L0,320 Z"></path>
      </svg>

      {/* Lapisan Awan 3 (Depan - Gradasi Smooth) */}
      <svg className="cloud-layer layer-3" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--cloud-grad-top)" stopOpacity="0.85" />
            <stop offset="60%" stopColor="var(--cloud-grad-mid)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--bg-color)" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path fill="url(#cloudGrad)" d="M0,288 C150,260 300,240 450,270 C600,300 750,270 900,260 C1050,250 1200,280 1440,270 L1440,320 L0,320 Z"></path>
      </svg>
    </div>
  );
}