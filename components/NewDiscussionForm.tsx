"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { categories } from "@/lib/community-data";
import { getSupabaseBrowserClient, isCommunityConfigured } from "@/lib/supabase/client";

function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 72); }

export default function NewDiscussionForm() {
  const router = useRouter();
  const [title, setTitle] = useState(""); const [body, setBody] = useState(""); const [category, setCategory] = useState(categories[0]); const [tags, setTags] = useState(""); const [status, setStatus] = useState("");
  const configured = isCommunityConfigured();

  async function submit(event: React.FormEvent) {
    event.preventDefault(); const supabase = getSupabaseBrowserClient();
    if (!supabase) { setStatus("Community publishing is in preview mode until Supabase is configured."); return; }
    const { data: auth } = await supabase.auth.getUser(); if (!auth.user) { setStatus("Sign in with GitHub before publishing."); return; }
    if (title.trim().length < 12 || body.trim().length < 40) { setStatus("Use a specific title and at least 40 characters of context."); return; }
    const slug = `${slugify(title)}-${Date.now().toString(36)}`;
    const { error } = await supabase.from("posts").insert({ author_id: auth.user.id, slug, title: title.trim(), body: body.trim(), category, tags: tags.split(",").map(tag => tag.trim().toLowerCase()).filter(Boolean).slice(0, 5) });
    if (error) { setStatus(error.message); return; } router.push(`/community/${slug}`); router.refresh();
  }

  return <form onSubmit={submit} className="panel p-6 sm:p-8"><div className="grid gap-6"><label className="grid gap-2"><span className="text-sm font-bold">Title</span><input className="field" maxLength={120} value={title} onChange={event => setTitle(event.target.value)} placeholder="What exactly are you trying to understand?"/></label><div className="grid gap-6 sm:grid-cols-2"><label className="grid gap-2"><span className="text-sm font-bold">Topic</span><select className="field" value={category} onChange={event => setCategory(event.target.value)}>{categories.map(item => <option key={item}>{item}</option>)}</select></label><label className="grid gap-2"><span className="text-sm font-bold">Tags <small className="font-normal text-white/35">comma separated</small></span><input className="field" value={tags} onChange={event => setTags(event.target.value)} placeholder="spi, st7735, debugging"/></label></div><label className="grid gap-2"><span className="text-sm font-bold">Context and evidence</span><textarea className="field min-h-64 resize-y" maxLength={10000} value={body} onChange={event => setBody(event.target.value)} placeholder={'Expected behavior:\n\nObserved behavior:\n\nSmallest relevant code or design:\n\nWhat I measured or tried:'}/></label><div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-5 text-white/40">{configured ? "Posts are public and attached to your profile." : "Preview mode: configure Supabase before publishing."}</p><button className="button-primary" type="submit">Publish discussion</button></div>{status && <p className="rounded-lg border border-yellow/20 bg-yellow/10 px-4 py-3 text-sm text-yellow">{status}</p>}</div></form>;
}
