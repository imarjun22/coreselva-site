import type { Metadata } from "next";

import ThreadView from "@/components/ThreadView";

export const metadata: Metadata = { title: "Community discussion" };
export default async function DiscussionPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <div className="page-shell"><section className="section-space"><div className="site-container max-w-5xl"><ThreadView slug={slug}/></div></section></div>; }
