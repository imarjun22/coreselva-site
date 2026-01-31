import { Cpu, ChevronDown } from "lucide-react";

import Navbar from "@/components/Navbar";
import ProductSlider from "@/components/ProductSlider";
import WhoWeServe from "@/components/WhoWeServe";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section
        id="home"
        className="relative min-h-screen bg-core flex items-center justify-center pt-20"
      >
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">

          {/* Icon */}
          <div className="mb-10 flex justify-center">
            <div className="rounded-full border border-yellow/30 p-5 shadow-[0_0_45px_rgba(250,204,21,0.45)]">
              <Cpu className="h-7 w-7 text-yellow" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-7xl font-black tracking-tight text-white">
            CoreSelva
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-2xl font-semibold text-yellow">
            Educational Hardware IP Design
          </p>

          {/* Description */}
          <p className="mt-6 text-lg leading-relaxed text-muted max-w-xl mx-auto">
            Small, readable, and verified hardware IPs for education, research,
            and FPGA experimentation
          </p>

          {/* CTA */}
          <div className="mt-12 flex justify-center">
            <a
              href="#csrv64"
              className="inline-flex items-center justify-center bg-yellow text-black font-bold text-lg px-10 py-4 rounded-lg shadow-[0_0_35px_rgba(250,204,21,0.6)] hover:brightness-110 transition"
            >
              Explore CSRV64
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 flex justify-center text-yellow opacity-80">
            <ChevronDown className="h-6 w-6 animate-bounce" />
          </div>
        </div>
      </section>

      {/* PRODUCTS / CSRV64 */}
      <section id="csrv64">
        <ProductSlider />
      </section>

      {/* WHO WE SERVE */}
      <section id="who-we-serve">
        <WhoWeServe />
      </section>

      {/* FOOTER / CONTACT */}
      <section id="contact">
        <Footer />
      </section>
    </>
  );
}