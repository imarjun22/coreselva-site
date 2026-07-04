"use client";

import Link from "next/link";
import { Eye, MessageSquareText, Pin, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import Avatar from "@/components/Avatar";
import { categories, demoPosts, formatRelativeDate } from "@/lib/community-data";
import { getSupabaseBrowserClient, isCommunityConfigured } from "@/lib/supabase/client";
import type { CommunityPost } from "@/lib/types";

export default function CommunityFeed() {
  const [posts, setPosts] = useState<CommunityPost[]>(demoPosts);
  const [category, setCategory] = useState("All topics");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(isCommunityConfigured());

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    supabase.from("posts").select("*, author:profiles!posts_author_id_fkey(*)").order("is_pinned", { ascending: false }).order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => { if (data?.length) setPosts(data as unknown as CommunityPost[]); setLoading(false); });
  }, []);

  const visible = useMemo(() => posts.filter(post => {
    const categoryMatches = category === "All topics" || post.category === category;
    const text = `${post.title} ${post.body} ${post.tags.join(" ")}`.toLowerCase();
    return categoryMatches && text.includes(query.toLowerCase());
  }), [posts, category, query]);

  return (
    <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
      <aside>
        <p className="eyebrow">TOPICS</p>
        <div className="mt-4 grid gap-1"><button onClick={() => setCategory("All topics")} className={`rounded-lg px-3 py-2.5 text-left text-sm font-bold ${category === "All topics" ? "bg-yellow text-black" : "text-white/55 hover:bg-white/5 hover:text-white"}`}>All topics</button>{categories.map(item => <button key={item} onClick={() => setCategory(item)} className={`rounded-lg px-3 py-2.5 text-left text-sm font-bold ${category === item ? "bg-yellow text-black" : "text-white/55 hover:bg-white/5 hover:text-white"}`}>{item}</button>)}</div>
        <div className="panel mt-7 p-4"><p className="text-xs font-black text-white">Good questions include</p><ul className="mt-3 space-y-2 text-xs leading-5 text-white/45"><li>• Expected and observed behavior</li><li>• Minimal relevant code</li><li>• Hardware/toolchain context</li><li>• Measurements already taken</li></ul></div>
      </aside>
      <div>
        <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={17}/><input className="field pl-11" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search titles, tags and explanations…"/></div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#090909]">
          {loading && <p className="border-b border-white/10 px-6 py-3 text-xs text-yellow">Loading community discussions…</p>}
          {visible.map(post => (
            <Link key={post.id} href={`/community/${post.slug}`} className="group block border-b border-white/10 p-5 last:border-0 hover:bg-white/[0.025] sm:p-6">
              <div className="flex gap-4"><Avatar name={post.author.username} src={post.author.avatar_url}/><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2">{post.is_pinned && <Pin size={13} className="text-yellow"/>}<span className="tag">{post.category}</span>{post.tags.slice(0,2).map(tag => <span key={tag} className="text-[11px] text-white/35">#{tag}</span>)}</div><h2 className="mt-3 text-lg font-black leading-6 text-white group-hover:text-yellow">{post.title}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-white/45">{post.body}</p><div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/35"><span>by <b className="text-white/55">@{post.author.username}</b> · {formatRelativeDate(post.created_at)}</span><span className="flex items-center gap-1"><MessageSquareText size={13}/>{post.reply_count}</span><span className="flex items-center gap-1"><Eye size={13}/>{post.view_count}</span></div></div></div>
            </Link>
          ))}
          {!visible.length && <div className="p-10 text-center"><p className="font-bold">No matching discussions.</p><p className="mt-2 text-sm text-white/40">Try another topic or start the first one.</p></div>}
        </div>
      </div>
    </div>
  );
}
