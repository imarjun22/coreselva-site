import type { Metadata } from "next";
import Link from "next/link";
import NewProjectForm from "@/components/NewProjectForm";
export const metadata:Metadata={title:"Add a project"};
export default function NewProjectPage(){return <div className="page-shell"><section className="section-space"><div className="site-container max-w-4xl"><Link href="/projects" className="text-sm font-bold text-white/45 hover:text-yellow">← Project showcase</Link><p className="eyebrow mt-10">SHARE YOUR WORK</p><h1 className="section-title mt-4">Publish something another builder can learn from.</h1><p className="body-copy mt-5 max-w-2xl">Working, unfinished and even failed projects are welcome when the description is honest. Do not upload private source or credentials.</p><div className="mt-10"><NewProjectForm/></div></div></section></div>}
