"use client";

import Link from "next/link";
import { CornerDownRight, MessageSquareReply } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import Avatar from "@/components/Avatar";
import { demoPosts, formatRelativeDate } from "@/lib/community-data";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { CommunityPost, Reply } from "@/lib/types";

const demoReplies: Reply[] = [
  { id: "r1", post_id: "demo-1", parent_id: null, body: "volatile makes the accesses observable, but it does not make a multi-instruction read-modify-write indivisible. First check the counter width and generated load/store sequence on your target.", created_at: "2026-07-03T10:10:00Z", author: { id: "p4", username: "register_map", full_name: "Dev M", avatar_url: null, bio: "Firmware and buses." } },
  { id: "r2", post_id: "demo-1", parent_id: "r1", body: "Also name the ownership pattern. If the ISR only increments and foreground only samples, a short critical section around the sample may be enough. If both writers modify it, the invariant is different.", created_at: "2026-07-03T11:20:00Z", author: { id: "p5", username: "latencybudget", full_name: "Sara P", avatar_url: null, bio: "Real-time systems." } },
  { id: "r3", post_id: "demo-1", parent_id: null, body: "Please share the declaration, MCU word width, and whether the foreground resets the counter. That determines whether this is tearing, lost updates, or simply a sampling expectation.", created_at: "2026-07-03T12:00:00Z", author: { id: "p6", username: "scopefirst", full_name: "Nila S", avatar_url: null, bio: "Measure twice, patch once." } },
];

export default function ThreadView({ slug }: { slug: string }) {
  const [post, setPost] = useState<CommunityPost | null>(demoPosts.find(item => item.slug === slug) ?? demoPosts[0]);
  const [replies, setReplies] = useState<Reply[]>(demoReplies);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient(); if (!supabase) return;
    supabase.from("posts").select("*, author:profiles!posts_author_id_fkey(*)").eq("slug", slug).single().then(({ data }) => { if (data) setPost(data as unknown as CommunityPost); });
    supabase.from("replies").select("*, author:profiles!replies_author_id_fkey(*)").eq("post_id", post?.id ?? "").order("created_at").then(({ data }) => { if (data) setReplies(data as unknown as Reply[]); });
  }, [slug, post?.id]);

  const roots = useMemo(() => replies.filter(reply => !reply.parent_id), [replies]);
  const children = (id: string) => replies.filter(reply => reply.parent_id === id);

  async function publishReply(event: React.FormEvent) {
    event.preventDefault(); const supabase = getSupabaseBrowserClient();
    if (!supabase || !post) { setStatus("Replies become live after the community database is configured."); return; }
    const { data: auth } = await supabase.auth.getUser(); if (!auth.user) { setStatus("Sign in with GitHub before replying."); return; }
    if (body.trim().length < 8) { setStatus("Add a little more explanation before publishing."); return; }
    const { data, error } = await supabase.from("replies").insert({ post_id: post.id, author_id: auth.user.id, parent_id: replyTo, body: body.trim() }).select("*, author:profiles!replies_author_id_fkey(*)").single();
    if (error) { setStatus(error.message); return; } if (data) setReplies(current => [...current, data as unknown as Reply]); setBody(""); setReplyTo(null); setStatus("Reply published.");
  }

  if (!post) return <div className="panel p-8">Discussion not found.</div>;
  const ReplyCard = ({ reply, nested = false }: { reply: Reply; nested?: boolean }) => <article className={`${nested ? "ml-5 border-l border-yellow/20 pl-4 sm:ml-14 sm:pl-6" : ""} py-5`}><div className="flex gap-3"><Avatar name={reply.author.username} src={reply.author.avatar_url} size="sm"/><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2 text-xs"><b className="text-white/75">@{reply.author.username}</b><span className="text-white/30">{formatRelativeDate(reply.created_at)}</span></div><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/65">{reply.body}</p><button onClick={() => setReplyTo(reply.id)} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-white/35 hover:text-yellow"><CornerDownRight size={13}/>Reply</button></div></div></article>;

  return <div><Link href="/community" className="text-sm font-bold text-white/40 hover:text-yellow">← All discussions</Link><article className="mt-8 border-b border-white/10 pb-10"><div className="flex flex-wrap items-center gap-2"><span className="tag">{post.category}</span>{post.tags.map(tag => <span key={tag} className="text-xs text-white/35">#{tag}</span>)}</div><h1 className="mt-5 max-w-4xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">{post.title}</h1><div className="mt-6 flex items-center gap-3"><Avatar name={post.author.username} src={post.author.avatar_url}/><div><b className="block text-sm">{post.author.full_name ?? post.author.username}</b><span className="text-xs text-white/35">@{post.author.username} · {formatRelativeDate(post.created_at)}</span></div></div><p className="mt-8 max-w-4xl whitespace-pre-wrap text-base leading-8 text-white/70">{post.body}</p></article><section className="mt-9"><div className="flex items-center gap-2"><MessageSquareReply size={18} className="text-yellow"/><h2 className="text-lg font-black">{replies.length} replies</h2></div><div className="mt-4 divide-y divide-white/10">{roots.map(reply => <div key={reply.id}><ReplyCard reply={reply}/>{children(reply.id).map(child => <ReplyCard key={child.id} reply={child} nested/>)}</div>)}</div></section><form onSubmit={publishReply} className="panel mt-10 p-6"><div className="flex items-center justify-between gap-4"><h2 className="font-black">{replyTo ? "Reply to a member" : "Add to the discussion"}</h2>{replyTo && <button type="button" onClick={() => setReplyTo(null)} className="text-xs text-white/40 hover:text-yellow">Cancel nested reply</button>}</div><textarea className="field mt-4 min-h-36 resize-y" value={body} onChange={event => setBody(event.target.value)} placeholder="Explain the reasoning, assumptions, and next useful measurement…"/><div className="mt-4 flex items-center justify-between gap-4"><p className="text-xs text-white/35">Markdown support can be added after moderation rules are established.</p><button className="button-primary" type="submit">Publish reply</button></div>{status && <p className="mt-4 text-sm text-yellow">{status}</p>}</form></div>;
}
