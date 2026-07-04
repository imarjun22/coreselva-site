import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";

import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import { productGroups, products } from "@/lib/products";

export const metadata: Metadata = { title: "Open IP", description: "CoreSelva RV64 and RV32 educational RISC-V cores and SoC peripherals." };

export default function ProductsPage() {
  return <div className="page-shell">
    <section className="section-space border-b border-white/10"><div className="site-container"><SectionHeading eyebrow="CORESELVA OPEN IP" title="Six processor profiles. Three essential peripherals." copy="Explore the complete architecture roadmap without hiding families inside a carousel. Every card states whether it is implemented, planned, or research work."/><div className="mt-12 flex flex-wrap gap-3"><a href="https://github.com/imarjun22" target="_blank" rel="noreferrer" className="button-primary">Explore GitHub <ArrowRight size={16}/></a><Link href="/compiler" className="button-secondary"><FlaskConical size={16}/>Open RISC-V Lab</Link></div></div></section>
    {productGroups.map((group, index) => <section key={group.key} id={group.key.toLowerCase()} className={`section-space scroll-mt-24 ${index % 2 ? "border-y border-white/10 bg-white/[0.018]" : ""}`}><div className="site-container"><SectionHeading eyebrow={group.key} title={group.title} copy={group.copy}/><div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{products.filter(product => product.group === group.key).map(product => <ProductCard key={product.slug} product={product}/>)}</div></div></section>)}
    <section className="pb-24"><div className="site-container"><div className="panel p-7 sm:p-10"><p className="eyebrow">STATUS LANGUAGE</p><div className="mt-6 grid gap-6 md:grid-cols-3"><div><b>Stable</b><p className="mt-2 text-sm leading-6 text-white/50">Implemented and exercised on its stated target. Read the repository for exact verification scope.</p></div><div><b>Planned</b><p className="mt-2 text-sm leading-6 text-white/50">A defined teaching direction, not yet a release claim.</p></div><div><b>Research</b><p className="mt-2 text-sm leading-6 text-white/50">Longer-term architecture work whose interfaces and goals may change.</p></div></div></div></div></section>
  </div>;
}
