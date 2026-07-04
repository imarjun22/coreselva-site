import Link from "next/link";

const groups = [
  { title: "Open IP", links: [["All IP", "/products"], ["RV64 cores", "/products#rv64"], ["RV32 cores", "/products#rv32"], ["Peripherals", "/products#peripherals"]] },
  { title: "Learn & explore", links: [["Academy", "/academy"], ["About", "/about"], ["RISC-V Lab", "/compiler"]] },
];

export default function Footer() {
  return <footer className="border-t border-white/10 bg-[#050505]"><div className="site-container py-16">
    <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-yellow text-[11px] font-black text-black">CS</span><span className="text-xl font-black">CoreSelva</span></div><p className="mt-5 max-w-sm text-sm leading-6 text-white/55">Open educational hardware and careful engineering education for people who want to understand the machine, not merely use it.</p></div>
      {groups.map(group => <div key={group.title}><h2 className="text-sm font-extrabold text-white">{group.title}</h2><ul className="mt-4 space-y-3 text-sm text-white/50">{group.links.map(([label, href]) => <li key={href}><Link href={href} className="hover:text-yellow">{label}</Link></li>)}</ul></div>)}
      <div><h2 className="text-sm font-extrabold text-white">Principle</h2><p className="mt-4 text-sm leading-6 text-white/50">Readable before clever. Measured before claimed. Shared so the next builder can go further.</p></div>
    </div>
    <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between"><span>Copyright 2026 CoreSelva. Apache-2.0 open-source project.</span><span>Built for clarity, learning, and verification.</span></div>
  </div></footer>;
}
