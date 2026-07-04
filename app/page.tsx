import Link from "next/link";
import { ArrowRight, BookOpen, CircuitBoard, Cpu, Layers3 } from "lucide-react";

import SectionHeading from "@/components/SectionHeading";
import { productGroups } from "@/lib/products";

const work = [
  { icon: CircuitBoard, title: "Open processor IP", copy: "Readable RV64 and RV32 RISC-V cores for education, FPGA experiments, verification, and architecture research." },
  { icon: Layers3, title: "Reusable SoC blocks", copy: "UART, GPIO, Timer, and future peripheral IP designed to make complete systems understandable." },
  { icon: BookOpen, title: "Engineering education", copy: "Long-form learning that starts from first principles and grows into embedded C, digital logic, RISC-V, FPGA, and verification." },
];

export default function Home() {
  return <div className="page-shell">
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden border-b border-white/10">
      <div className="grid-noise absolute inset-0 opacity-80"/><div className="absolute left-1/2 top-12 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-yellow/[0.055] blur-3xl"/>
      <div className="site-container relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center py-24 text-center">
        <div className="yellow-orb grid h-16 w-16 place-items-center rounded-full border border-yellow/25 bg-black"><Cpu className="text-yellow" size={27}/></div>
        <p className="eyebrow mt-10">RISC-V CORES · OPEN IP · EMBEDDED PERIPHERALS</p>
        <h1 className="mt-5 max-w-5xl text-5xl font-black tracking-[-0.06em] text-white sm:text-7xl lg:text-[82px] lg:leading-[0.98]">Embedded systems deserve<br/><span className="text-yellow">open enough to build on.</span></h1>
        <p className="mt-7 max-w-3xl text-base leading-7 text-white/60 sm:text-lg">CoreSelva builds open RISC-V cores, IP blocks, and peripherals — so engineers can read the silicon, not just trust it.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row"><Link className="button-primary px-7 py-4" href="/products">Explore Open IP <ArrowRight size={17}/></Link><Link className="button-secondary px-7 py-4" href="/academy">Start Learning</Link></div>
      </div>
    </section>

    <section className="section-space"><div className="site-container"><SectionHeading eyebrow="WHAT CORESELVA DOES" title="Hardware you can inspect. Knowledge you can build on." copy="The work is focused on the layers that are often treated as black boxes."/><div className="mt-12 grid gap-5 md:grid-cols-3">{work.map(({icon: Icon, ...item}) => <article key={item.title} className="panel p-7"><span className="grid h-11 w-11 place-items-center rounded-xl border border-yellow/20 bg-yellow/10 text-yellow"><Icon size={20}/></span><h2 className="mt-6 text-xl font-black">{item.title}</h2><p className="mt-3 text-sm leading-6 text-white/55">{item.copy}</p></article>)}</div></div></section>

    <section className="section-space border-y border-white/10 bg-white/[0.018]"><div className="site-container"><div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><SectionHeading eyebrow="OPEN IP" title="One catalogue. Three clear families." copy="See the complete roadmap once, then open the family you need. Product cards, maturity, features, and source live in the catalogue."/><Link href="/products" className="button-quiet shrink-0">View all open IP <ArrowRight size={15}/></Link></div><div className="mt-12 grid gap-5 lg:grid-cols-3">{productGroups.map((group, index) => <Link key={group.key} href={`/products#${group.key.toLowerCase()}`} className="panel panel-hover p-7"><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl border border-yellow/20 bg-yellow/10 text-yellow">{index === 2 ? <Layers3 size={20}/> : <Cpu size={20}/>}</span><span className="font-mono text-xs text-white/30">0{index + 1}</span></div><h2 className="mt-6 text-2xl font-black">{group.title}</h2><p className="mt-3 text-sm leading-6 text-white/55">{group.copy}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-yellow">Explore {group.key} <ArrowRight size={14}/></span></Link>)}</div></div></section>

    <section className="section-space"><div className="site-container grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]"><div><p className="eyebrow">CORESELVA ACADEMY</p><h2 className="display-title mt-4">Learn the software and the hardware as one system.</h2><p className="body-copy mt-6 max-w-2xl">The Academy begins with no assumed programming or microcontroller experience, then develops the exact mental models needed for memory, registers, interrupts, buses, real-time firmware, processor architecture, and verification.</p><div className="mt-8 flex flex-wrap gap-3"><Link className="button-primary" href="/academy">Explore Academy <ArrowRight size={16}/></Link><a className="button-secondary" href="/academy/embedded-c-roadmap/index.html">Open Embedded C guide</a></div></div><div className="panel overflow-hidden"><div className="border-b border-white/10 px-6 py-4"><span className="eyebrow">FROM CODE TO SILICON</span></div><ol className="divide-y divide-white/10">{[["01","Programming","C, data, control flow, functions, and debugging"],["02","Embedded systems","Memory, registers, interrupts, timing, and buses"],["03","Computer architecture","Digital logic, RISC-V, pipelines, and SoCs"],["04","Engineering proof","Simulation, verification, FPGA testing, and measurement"]].map(([n,title,copy]) => <li key={n} className="flex gap-5 px-6 py-5"><span className="font-mono text-xs text-yellow">{n}</span><div><b className="text-sm text-white">{title}</b><p className="mt-1 text-xs leading-5 text-white/45">{copy}</p></div></li>)}</ol></div></div></section>

    <section className="pb-24"><div className="site-container"><div className="relative overflow-hidden rounded-3xl border border-yellow/25 bg-yellow px-7 py-12 text-black sm:px-12 lg:flex lg:items-center lg:justify-between"><div className="absolute -right-10 -top-20 h-56 w-56 rounded-full border-[32px] border-black/5"/><div className="relative"><p className="text-xs font-black uppercase tracking-[0.2em]">WHY CORESELVA</p><h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">Make advanced hardware knowledge easier to enter, inspect, and extend.</h2><p className="mt-4 max-w-xl text-sm leading-6 text-black/65">Read the story, the principles behind the work, and the long-term goal.</p></div><Link href="/about" className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-extrabold text-white lg:mt-0">About CoreSelva <ArrowRight size={16}/></Link></div></div></section>
  </div>;
}
