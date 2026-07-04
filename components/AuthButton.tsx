"use client";

import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

import Avatar from "@/components/Avatar";
import { getSupabaseBrowserClient, isCommunityConfigured } from "@/lib/supabase/client";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const configured = isCommunityConfigured();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  async function signIn() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({ provider: "github", options: { redirectTo: `${window.location.origin}/community` } });
  }

  async function signOut() { await getSupabaseBrowserClient()?.auth.signOut(); }

  if (!configured) return <Link className="button-secondary" href="/community#setup"><LogIn size={16}/>Community preview</Link>;
  if (!user) return <button className="button-primary" onClick={signIn}><LogIn size={16}/>Sign in with GitHub</button>;

  const name = user.user_metadata.user_name ?? user.user_metadata.preferred_username ?? user.email ?? "Member";
  return (
    <div className="flex items-center gap-2">
      <Link href={`/profile/${name}`} className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-bold text-white/75 hover:text-yellow"><Avatar src={user.user_metadata.avatar_url} name={name} size="sm"/><span className="max-w-28 truncate">{name}</span></Link>
      <button onClick={signOut} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/50 hover:text-yellow" aria-label="Sign out"><LogOut size={15}/></button>
    </div>
  );
}
