import type {Metadata} from "next";
import ProjectDetail from "@/components/ProjectDetail";
export const metadata:Metadata={title:"CoreSelva project"};
export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;return <div className="page-shell"><section className="section-space"><div className="site-container"><ProjectDetail slug={slug}/></div></section></div>}
