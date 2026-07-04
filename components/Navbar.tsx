"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/products", label: "Open IP" },
  { href: "/academy", label: "Academy" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/88 backdrop-blur-xl">
      <div className="site-container flex h-20 items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="yellow-orb grid h-9 w-9 place-items-center rounded-full bg-yellow text-[11px] font-black text-black">CS</span>
          <span className="text-lg font-black tracking-tight text-white">CoreSelva</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {links.map(link => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link key={link.href} href={link.href} className={`text-sm font-semibold transition ${active ? "text-yellow" : "text-white/60 hover:text-white"}`}>
                {link.label}
              </Link>
            );
          })}
          <Link href="/compiler" className="text-sm font-semibold text-white/60 transition hover:text-white">RISC-V Lab</Link>
        </nav>

        <button className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 text-yellow lg:hidden" onClick={() => setOpen(value => !value)} aria-label="Toggle navigation" aria-expanded={open}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-black lg:hidden">
          <nav className="site-container flex flex-col gap-1 py-4" aria-label="Mobile navigation">
            {links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-semibold text-white/75 hover:bg-white/5 hover:text-yellow">{link.label}</Link>)}
            <Link href="/compiler" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-semibold text-white/75 hover:bg-white/5 hover:text-yellow">RISC-V Lab</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
