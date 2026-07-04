import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";

import { demoProjects, formatRelativeDate } from "@/lib/community-data";

export default function ProjectDetail({slug}:{slug:string}) {
  const project = demoProjects.find(item => item.slug === slug);
  if (!project) return <div className="panel p-8">Project not found.</div>;
  return <div>
    <Link href="/projects" className="text-sm font-bold text-white/40 hover:text-yellow">Back to all projects</Link>
    <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_300px]"><article><span className="tag capitalize">{project.status}</span><h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">{project.title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-white/60">{project.summary}</p><div className="mt-8 flex flex-wrap gap-2">{project.technologies.map(item => <span key={item} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/55">{item}</span>)}</div><div className="mt-12 border-t border-white/10 pt-10"><h2 className="text-2xl font-black">Technical story</h2><p className="mt-5 whitespace-pre-wrap text-base leading-8 text-white/65">{project.description}</p></div></article><aside><div className="panel p-6"><p className="eyebrow">PROJECT RECORD</p><b className="mt-4 block text-sm">Maintained by CoreSelva</b><p className="mt-3 text-xs text-white/35">Published {formatRelativeDate(project.created_at)}</p><div className="mt-6 grid gap-3">{project.repo_url&&<a className="button-primary" href={project.repo_url} target="_blank" rel="noreferrer"><Github size={16}/>View source</a>}{project.demo_url&&<a className="button-secondary" href={project.demo_url} target="_blank" rel="noreferrer">Open demo <ArrowUpRight size={15}/></a>}</div></div><div className="panel mt-4 p-6"><p className="eyebrow">DOCUMENTATION GOAL</p><p className="mt-3 text-sm leading-6 text-white/50">Record the architecture, verification scope, known limitations, and the next engineering milestone.</p></div></aside></div>
  </div>;
}
