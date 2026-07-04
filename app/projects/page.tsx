import type { Metadata } from "next";

import ProjectGallery from "@/components/ProjectGallery";

export const metadata: Metadata = { title: "Projects", description: "Hardware and embedded projects curated by CoreSelva." };

export default function ProjectsPage() {
  return <div className="page-shell">
    <section className="border-b border-white/10 py-16 sm:py-20"><div className="site-container"><p className="eyebrow">CORESELVA PROJECTS</p><h1 className="display-title mt-4">Architecture, evidence, and honest engineering notes.</h1><p className="body-copy mt-5 max-w-2xl">A curated record of CoreSelva work: what each project does, how it is structured, what was measured, what failed, and what comes next.</p></div></section>
    <section className="section-space"><div className="site-container"><ProjectGallery/></div></section>
  </div>;
}
