"use client";

import React, { useState, useEffect } from "react";

// Masukkan path 2 foto kamu di sini
const images = [
  "/me.jpeg",
  "/me2.jpeg", // ganti dengan nama foto kedua kamu di folder public
];

export function HeroBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Berganti foto setiap 8 detik (8000 ms)
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-bg-wrapper">
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`Background ${index + 1}`}
          className={`page-bg-photo ${index === currentIndex ? "active" : ""}`}
        />
      ))}
    </div>
  );
}