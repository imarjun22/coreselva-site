"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Check, Github } from "lucide-react";

/* ---------------- DATA ---------------- */

const PRODUCTS = [
  {
    tag: "My Recent Build",
    title: "CSRV64",
    subtitle:
      "Top-of-the-line 64-bit RISC-V cores designed for education and research",
    cards: [
      {
        title: "CSRV64I_SC",
        role: "Base Educational Core",
        badge: "Implemented / Stable",
        badgeClass: "bg-green-600/20 text-green-400 border-green-500/30",
        features: [
          "RV64I ISA",
          "In-order execution",
          "Non-pipelined (Single-cycle)",
          "Machine mode only",
          "No MMU, No caches",
        ],
        purpose:
          "Teaching RISC-V fundamentals, verification baseline, architecture research starting point",
        github: "https://github.com/KaranArjunS/CSRV64I_SC",
      },
      {
        title: "CSRV64-IM-P5",
        role: "Embedded / MCU Profile",
        badge: "Planned / In Progress",
        badgeClass: "bg-blue-600/20 text-blue-400 border-blue-500/30",
        features: [
          "RV64IM ISA",
          "5-stage in-order pipeline",
          "Hazard detection and forwarding",
          "Optional cache",
          "Interrupt & timer support",
        ],
        purpose:
          "Teaching pipelined CPU design, embedded workloads, FPGA SoC integration",
      },
      {
        title: "CSRV64-GS-LX",
        role: "Linux / Research Profile",
        badge: "Long-term Research Goal",
        badgeClass: "bg-purple-600/20 text-purple-400 border-purple-500/30",
        features: [
          "RV64G ISA",
          "Machine & Supervisor modes",
          "MMU (Sv39)",
          "OpenSBI compatibility",
          "Linux kernel boot",
        ],
        purpose:
          "Advanced architecture research, OS-hardware interaction, Linux-capable RISC-V exploration",
      },
    ],
  },
  {
    tag: "MCU PRODUCT LINE",
    title: "CSRV32",
    subtitle: "32-bit RISC-V cores for MCU-class systems",
    cards: [
      {
        title: "CSRV32-I",
        role: "Educational MCU Core",
        badge: "Planned",
        badgeClass: "bg-blue-600/20 text-blue-400 border-blue-500/30",
        features: [
          "RV32I ISA",
          "Single-cycle",
          "Machine mode",
          "FPGA-first design",
        ],
        purpose: "Teaching MCU-class RISC-V fundamentals",
      },
      {
        title: "CSRV32-IM",
        role: "Pipelined MCU Core",
        badge: "Planned",
        badgeClass: "bg-blue-600/20 text-blue-400 border-blue-500/30",
        features: [
          "RV32IM ISA",
          "Basic pipeline",
          "Interrupt support",
          "ASIC-ready",
        ],
        purpose: "Embedded CPU pipeline learning",
      },
    ],
  },
  {
    tag: "EXPERIMENTAL LINE",
    title: "CSRB16",
    subtitle: "Retro & experimental 16-bit CPU cores",
    cards: [
      {
        title: "CSRB16",
        role: "Retro / Educational CPU",
        badge: "Planned",
        badgeClass: "bg-blue-600/20 text-blue-400 border-blue-500/30",
        features: [
          "16-bit ISA",
          "Simple pipeline",
          "Game & retro experimentation",
        ],
        purpose: "Learning classic CPU architecture",
      },
    ],
  },
  {
    tag: "PERIPHERALS",
    title: "SoC Components",
    subtitle: "Reusable IP blocks for RISC-V SoCs",
    cards: [
      {
        title: "UART / GPIO / TIMER",
        role: "Peripherals",
        badge: "Coming Soon",
        badgeClass: "bg-gray-600/20 text-gray-400 border-gray-500/30",
        features: [
          "AXI / APB style interfaces",
          "Educational quality",
          "Simulation-first",
        ],
        purpose: "Complete SoC building blocks",
      },
    ],
  },
];

/* ---------------- COMPONENT ---------------- */

const SWIPE_THRESHOLD = 60; // px

export default function ProductSlider() {
  const [index, setIndex] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const current = PRODUCTS[index];

  const prev = () =>
    setIndex((i) => (i === 0 ? PRODUCTS.length - 1 : i - 1));

  const next = () =>
    setIndex((i) => (i === PRODUCTS.length - 1 ? 0 : i + 1));

  /* -------- Touch handlers (mobile swipe) -------- */

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const diff = touchStartX.current - touchEndX.current;

    if (diff > SWIPE_THRESHOLD) next();
    else if (diff < -SWIPE_THRESHOLD) prev();

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      id="products"
      className="relative bg-black py-28"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative mx-auto max-w-6xl px-6">

        {/* Desktop arrows */}
        <button
          onClick={prev}
          className="absolute -left-12 top-1/2 -translate-y-1/2 hidden md:flex
                     rounded-full border border-yellow/30 p-2
                     text-yellow/70 hover:text-yellow hover:border-yellow transition"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={next}
          className="absolute -right-12 top-1/2 -translate-y-1/2 hidden md:flex
                     rounded-full border border-yellow/30 p-2
                     text-yellow/70 hover:text-yellow hover:border-yellow transition"
        >
          <ChevronRight />
        </button>

        {/* Header */}
        <div className="text-center">
          <span className="inline-block rounded-full bg-yellow px-4 py-1 text-xs font-semibold text-black">
            {current.tag}
          </span>

          <h2 className="mt-5 text-4xl font-bold text-white">
            {current.title}
          </h2>

          <p className="mt-3 text-sm text-muted">
            {current.subtitle}
          </p>

          <p className="mt-3 text-xs text-white/40 md:hidden">
            Swipe left or right to explore →
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {current.cards.map((card) => (
            <div
              key={card.title}
              className="flex h-full flex-col rounded-2xl
                         border border-yellow/20
                         bg-gradient-to-b from-[#0b1220] to-black p-6"
            >
              <h3 className="text-lg font-semibold text-yellow">
                {card.title}
              </h3>

              <p className="mt-1 text-sm text-muted">{card.role}</p>

              <span
                className={`mt-3 inline-block rounded-full border px-3 py-1 text-xs ${card.badgeClass}`}
              >
                {card.badge}
              </span>

              <div className="mt-6">
                <h4 className="mb-3 text-xs font-semibold text-white/70">
                  FEATURES
                </h4>
                <ul className="space-y-2 text-sm text-white/80">
                  {card.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="h-4 w-4 text-yellow" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4">
                <h4 className="mb-2 text-xs font-semibold text-white/70">
                  PURPOSE
                </h4>
                <p className="text-sm text-muted">{card.purpose}</p>
              </div>

              {card.github ? (
                <a
                  href={card.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex w-full items-center justify-center gap-2
                             rounded-md bg-yellow py-3 text-sm font-semibold text-black
                             hover:brightness-110 transition"
                >
                  <Github size={16} />
                  View on GitHub
                </a>
              ) : (
                <div
                  className="mt-6 flex w-full items-center justify-center gap-2
                             rounded-md bg-white/10 py-3 text-sm font-semibold text-white/50
                             cursor-not-allowed"
                >
                  <Github size={16} />
                  Coming Soon
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}