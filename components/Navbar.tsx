"use client";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur border-b border-yellow/10">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center">

        {/* LEFT: Logo */}
        <a
          href="#home"
          className="text-yellow font-bold text-lg"
        >
          CoreSelva
        </a>

        {/* PUSH EVERYTHING ELSE TO RIGHT */}
        <div className="ml-auto flex items-center gap-8">

          {/* NAV LINKS */}
          <nav className="flex items-center gap-6 text-sm text-white/80">
            <a href="#home" className="hover:text-white">
              Home
            </a>
            <a href="#csrv64" className="hover:text-white">
              CSRV64
            </a>
            <a href="#products" className="hover:text-white">
              Products
            </a>
            <a href="#who-we-serve" className="hover:text-white">
              Who We Serve
            </a>
          </nav>

          {/* CONTACT */}
          <a
            href="#contact"
            className="
              bg-yellow text-black font-semibold
              px-4 py-2 rounded-md
              shadow-[0_0_20px_rgba(250,204,21,0.5)]
              hover:brightness-110 transition
            "
          >
            Contact
          </a>

        </div>
      </div>
    </header>
  );
}