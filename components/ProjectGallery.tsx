"use client";

import Link from "next/link";
import { ArrowRight, Github, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { demoProjects } from "@/lib/community-data";

const states = ["all", "idea", "building", "working", "verified"];

export default function ProjectGallery() {
  const [state, setState] = useState("all");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => demoProjects.filter(project => (state === "all" || project.status === state) && `${project.title} ${project.summary} ${project.technologies.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [state, query]);

  return <div>
    <div className="flex flex-col gap-4 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={17}/><input className="field pl-11" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search projects and technologies..."/></div><div className="flex gap-1 overflow-x-auto rounded-xl border border-white/10 bg-[#090909] p-1">{states.map(item => <button key={item} onClick={() => setState(item)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-extrabold capitalize ${state === item ? "bg-yellow text-black" : "text-white/45 hover:text-white"}`}>{item}</button>)}</div></div>
    <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{visible.map(project => <article key={project.id} className="panel panel-hover flex flex-col overflow-hidden"><Link href={`/projects/${project.slug}`} className="grid h-44 place-items-center border-b border-white/10 bg-[radial-gradient(circle_at_center,rgba(255,210,10,.15),transparent_68%)]"><span className="text-5xl font-black text-yellow/80">{project.title.slice(0,2).toUpperCase()}</span></Link><div className="flex flex-1 flex-col p-6"><span className="tag w-fit capitalize">{project.status}</span><Link href={`/projects/${project.slug}`}><h2 className="mt-5 text-xl font-black hover:text-yellow">{project.title}</h2></Link><p className="mt-3 text-sm leading-6 text-white/50">{project.summary}</p><div className="mt-5 flex flex-wrap gap-2">{project.technologies.map(tech => <span key={tech} className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-white/45">{tech}</span>)}</div><div className="mt-auto flex items-center gap-3 pt-6">{project.repo_url && <a href={project.repo_url} target="_blank" rel="noreferrer" className="button-quiet"><Github size={14}/>Source</a>}<Link href={`/projects/${project.slug}`} className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-yellow">Details <ArrowRight size={13}/></Link></div></div></article>)}</div>
    {!visible.length && <div className="panel mt-8 p-10 text-center text-white/45">No project matches those filters.</div>}
  </div>;
}
