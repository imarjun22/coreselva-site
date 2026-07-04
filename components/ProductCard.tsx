import { ArrowUpRight, Check } from "lucide-react";

import type { products } from "@/lib/products";

type Product = (typeof products)[number];

export default function ProductCard({ product }: { product: Product }) {
  const tone = product.statusTone === "green" ? "border-green-500/25 bg-green-500/10 text-green-300" : product.statusTone === "purple" ? "border-purple-500/25 bg-purple-500/10 text-purple-300" : "border-blue-500/25 bg-blue-500/10 text-blue-300";
  return (
    <article className="panel panel-hover flex h-full flex-col p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">{product.family}</p><h3 className="mt-3 text-2xl font-black tracking-tight text-white">{product.name}</h3><p className="mt-1 text-sm font-semibold text-yellow">{product.role}</p></div><span className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${tone}`}>{product.status}</span></div>
      <p className="mt-5 text-sm leading-6 text-white/55">{product.summary}</p>
      <ul className="mt-6 grid gap-2 text-sm text-white/70">{product.features.map(feature => <li key={feature} className="flex items-center gap-2"><Check size={14} className="shrink-0 text-yellow"/>{feature}</li>)}</ul>
      <div className="mt-auto pt-7">{product.repo ? <a className="button-secondary w-full" href={product.repo} target="_blank" rel="noreferrer">View source <ArrowUpRight size={15}/></a> : <span className="flex w-full justify-center rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white/30">Roadmap</span>}</div>
    </article>
  );
}
