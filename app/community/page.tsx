import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquarePlus } from "lucide-react";

import CommunityFeed from "@/components/CommunityFeed";

export const metadata: Metadata = { title: "Community", description: "Technical discussions, design reviews and evidence-led help from CoreSelva builders." };

export default function CommunityPage() {
  return <div className="page-shell"><section className="border-b border-white/10 py-16 sm:py-20"><div className="site-container flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">CORESELVA COMMUNITY</p><h1 className="display-title mt-4">A workshop, not a comment section.</h1><p className="body-copy mt-5 max-w-2xl">Ask with context. Reply with reasoning. Disagree with the idea without diminishing the person. Leave a thread more useful than you found it.</p></div><Link href="/community/new" className="button-primary shrink-0"><MessageSquarePlus size={17}/>Start a discussion</Link></div></section><section className="section-space"><div className="site-container"><CommunityFeed/><div id="setup" className="panel mt-12 border-yellow/20 p-6"><p className="eyebrow">LIVE COMMUNITY SETUP</p><p className="mt-3 text-sm leading-6 text-white/55">Until Supabase environment variables are added, this page displays representative discussions in preview mode. The database schema, GitHub authentication, profile policies, post/reply policies and project policies are included in <code className="text-yellow">supabase/schema.sql</code>.</p></div></div></section></div>;
}
