import React from 'react';

interface CloudsWaveProps {
  className?: string;
}

export const CloudsWave: React.FC<CloudsWaveProps> = ({ className = "" }) => {
  return (
    <div className={`clouds-container ${className}`}>
      <svg
        className="clouds-wrapper"
        viewBox="0 0 1440 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0 60C240 100 480 20 720 50C960 80 1200 30 1440 60V180H0V60Z"
          fill="var(--bg-main)"
          opacity="0.5"
        />
        <path
          d="M0 90C360 40 720 120 1080 70C1260 45 1380 75 1440 90V180H0V90Z"
          fill="var(--bg-main)"
        />
      </svg>
    </div>
  );
};