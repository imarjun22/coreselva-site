import type { Metadata } from "next";
import Link from "next/link";

import NewDiscussionForm from "@/components/NewDiscussionForm";

export const metadata: Metadata = { title: "Start a discussion" };
export default function NewDiscussionPage() { return <div className="page-shell"><section className="section-space"><div className="site-container max-w-4xl"><Link href="/community" className="text-sm font-bold text-white/45 hover:text-yellow">← Community</Link><p className="eyebrow mt-10">NEW DISCUSSION</p><h1 className="section-title mt-4">Make the question answerable.</h1><p className="body-copy mt-5 max-w-2xl">Include the intended behavior, what actually happened, your environment, and the evidence you already collected. Remove secrets and private code.</p><div className="mt-10"><NewDiscussionForm/></div></div></section></div>; }
