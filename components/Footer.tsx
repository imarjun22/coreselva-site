export default function Footer() {
  return (
    <footer className="bg-black border-t border-yellow/10">
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-yellow mb-4">
              CoreSelva
            </h3>

            <p className="text-sm text-white/70 leading-relaxed">
              Open-source educational hardware IPs for learning computer
              architecture, RISC-V, and FPGA-first system design.
            </p>

            {/* Maintainer (WITH SMALL PHOTO) */}
            <div className="mt-6 flex items-center gap-3 text-sm">
              {/* Small avatar */}
              <img
                src="/karan.jpg"
                alt="Karan Arjun"
                className="w-9 h-9 rounded-full object-cover border border-yellow/30"
                />

              {/* Text */}
              <div className="leading-tight">
                <p className="font-semibold text-white">Maintained by</p>
                <p className="text-white/70">Karan Arjun S</p>
                <a
                  href="mailto:karanarjun432@gmail.com"
                  className="text-yellow hover:underline"
                >
                  karanarjun432@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="text-white/60 hover:text-yellow">
                  Home
                </a>
              </li>
              <li>
                <a href="#csrv64" className="text-white/60 hover:text-yellow">
                  CSRV64
                </a>
              </li>
              <li>
                <a href="#products" className="text-white/60 hover:text-yellow">
                  Products
                </a>
              </li>
              <li>
                <a href="#who-we-serve" className="text-white/60 hover:text-yellow">
                  Who We Serve
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>Documentation</li>
              <li>Getting Started</li>
              <li>Examples</li>
              <li>Community</li>
            </ul>
          </div>

          {/* Philosophy */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Philosophy
            </h4>
            <p className="text-sm text-white/60 leading-relaxed">
              Built for clarity, correctness, education, and not black-box
              performance. Every design is meant to be read, understood,
              and extended.
            </p>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-sm text-white/50">
          <span>© 2026 CoreSelva. Open-source educational project.</span>
          <span className="mt-2 md:mt-0">contact for support</span>
        </div>

      </div>
    </footer>
  );
}