"use client";

import { ChevronLeft, ChevronRight, Github } from "lucide-react";
import { useRef } from "react";

export default function CSRV64Section() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.clientWidth;
    sliderRef.current.scrollBy({
        left: dir === "left" ? -width : width,
        behavior: "smooth",
    });
    };

  return (
    <section className="relative bg-black py-32 overflow-hidden">
      {/* ===== HEADER ===== */}
      <div className="mx-auto max-w-4xl px-6 text-center">
        <span className="inline-block rounded-full bg-yellow px-4 py-1 text-xs font-semibold text-black">
          FLAGSHIP PRODUCT LINE
        </span>

        <h2 className="mt-6 text-5xl font-bold text-white">CSRV64</h2>

        <p className="mt-3 text-yellow font-medium">
          Our Flagship RISC-V 64-bit Family
        </p>

        <p className="mt-6 text-sm text-muted">
          CoreSelva’s top-of-the-line RISC-V 64-bit cores, designed for education
          through advanced research
        </p>
      </div>

      {/* ===== ARROWS ===== */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 rounded-full border border-yellow p-3 text-yellow hover:bg-yellow hover:text-black transition"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 rounded-full border border-yellow p-3 text-yellow hover:bg-yellow hover:text-black transition"
      >
        <ChevronRight />
      </button>

      {/* ===== SLIDER ===== */}
      <div
        ref={sliderRef}
        className="
            mt-20
            flex
            gap-10
            overflow-x-auto
            scroll-smooth
            px-24
            snap-x
            snap-mandatory
            scrollbar-hide
        "
        >
        <Slide
          title="CSRV64-I"
          subtitle="Base Educational Core"
          badge="Implemented / Stable"
          badgeColor="bg-green-600"
          features={[
            "RV64I ISA",
            "In-order execution",
            "Non-pipelined (multi-cycle)",
            "Machine mode only",
            "No MMU, No caches",
            "FPGA-first design",
          ]}
          purpose="Teaching RISC-V fundamentals, verification baseline, architecture research starting point"
        />

        <Slide
          title="CSRV64-IM-P5"
          subtitle="Embedded / MCU Profile"
          badge="Planned / In Progress"
          badgeColor="bg-blue-600"
          features={[
            "RV64IM ISA",
            "5-stage in-order pipeline",
            "Hazard detection & forwarding",
            "Deterministic behavior",
            "Optional cache",
            "Interrupt & timer support",
          ]}
          purpose="Teaching pipelined CPU design, embedded workloads, FPGA SoC integration"
        />

        <Slide
          title="CSRV64-GS-LX"
          subtitle="Linux / Research Profile"
          badge="Long-term Research Goal"
          badgeColor="bg-purple-600"
          features={[
            "RV64G ISA",
            "Machine & Supervisor modes",
            "Full CSR implementation",
            "MMU (Sv39)",
            "Linux kernel boot",
            "OpenSBI compatibility",
          ]}
          purpose="Advanced architecture research, OS-hardware interaction, Linux-capable RISC-V exploration"
        />
      </div>
    </section>
  );
}

/* ===== SLIDE CARD ===== */

function Slide({
  title,
  subtitle,
  badge,
  badgeColor,
  features,
  purpose,
}: {
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  features: string[];
  purpose: string;
}) {
  return (
    <div className="min-w-[420px] max-w-[420px] snap-center rounded-xl bg-gradient-to-b from-[#0b1220] to-black border border-border p-6 flex flex-col">
      <h3 className="text-xl font-semibold text-yellow">{title}</h3>
      <p className="text-sm text-muted mt-1">{subtitle}</p>

      <span
        className={`mt-3 inline-block w-fit rounded-full px-3 py-1 text-xs text-white ${badgeColor}`}
      >
        {badge}
      </span>

      <div className="mt-6">
        <p className="text-xs uppercase tracking-wide text-muted">Features</p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {features.map((f) => (
            <li key={f}>• {f}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <p className="text-xs uppercase tracking-wide text-muted">Purpose</p>
        <p className="mt-2 text-sm text-muted">{purpose}</p>
      </div>

      <button className="mt-auto flex items-center justify-center gap-2 bg-yellow text-black font-semibold text-sm py-3 rounded-md shadow-yellow hover:brightness-110 transition">
        <Github className="h-4 w-4" />
        View on GitHub
      </button>
    </div>
  );
}