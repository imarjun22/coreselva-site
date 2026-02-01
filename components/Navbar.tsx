"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-yellow/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* Logo */}
        <Link href="#home" className="text-lg font-bold text-yellow">
          CoreSelva
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <Link href="#home" className="hover:text-yellow">Home</Link>
          <Link href="#csrv64" className="hover:text-yellow">CSRV64</Link>
          <Link href="#products" className="hover:text-yellow">Products</Link>
          <Link href="#who-we-serve" className="hover:text-yellow">Who We Serve</Link>

          <Link
            href="#contact"
            className="rounded-md bg-yellow px-4 py-2 font-semibold text-black hover:brightness-110"
          >
            Contact
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-yellow"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden border-t border-yellow/10 bg-black">
          <nav className="flex flex-col px-6 py-4 space-y-4 text-sm text-white/80">
            <Link href="#home" onClick={() => setOpen(false)}>Home</Link>
            <Link href="#csrv64" onClick={() => setOpen(false)}>CSRV64</Link>
            <Link href="#products" onClick={() => setOpen(false)}>Products</Link>
            <Link href="#who-we-serve" onClick={() => setOpen(false)}>Who We Serve</Link>
            <Link
              href="#contact"
              onClick={() => setOpen(false)}
              className="rounded-md bg-yellow px-4 py-2 font-semibold text-black text-center"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}