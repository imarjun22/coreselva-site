-- CoreSelva community schema for Supabase/PostgreSQL.
-- Run this once in the Supabase SQL editor, then enable GitHub in Authentication > Providers.

create extension if not exists citext;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username citext not null unique check (username ~ '^[a-zA-Z0-9_]{3,30}$'),
  full_name text check (char_length(full_name) <= 80),
  avatar_url text check (char_length(avatar_url) <= 500),
  bio text check (char_length(bio) <= 500),
  website text check (char_length(website) <= 300),
  github_url text check (char_length(github_url) <= 300),
  role text not null default 'member' check (role in ('member', 'moderator', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,100}$'),
  author_id uuid not null references public.profiles(id) on delete cascade,
  category text not null check (category in ('Embedded C','RISC-V','FPGA','PCB & electronics','Debugging','Show & tell')),
  title text not null check (char_length(title) between 12 and 120),
  body text not null check (char_length(body) between 40 and 10000),
  tags text[] not null default '{}',
  is_pinned boolean not null default false,
  is_locked boolean not null default false,
  is_hidden boolean not null default false,
  reply_count integer not null default 0 check (reply_count >= 0),
  view_count integer not null default 0 check (view_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.replies(id) on delete cascade,
  body text not null check (char_length(body) between 8 and 10000),
  is_hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,100}$'),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 4 and 100),
  summary text not null check (char_length(summary) between 20 and 220),
  description text not null check (char_length(description) between 50 and 15000),
  repo_url text check (char_length(repo_url) <= 500),
  demo_url text check (char_length(demo_url) <= 500),
  cover_url text check (char_length(cover_url) <= 500),
  technologies text[] not null default '{}',
  status text not null default 'building' check (status in ('idea','building','working','verified')),
  is_hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.project_comments(id) on delete cascade,
  body text not null check (char_length(body) between 8 and 10000),
  is_hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('post','reply','project','project_comment','profile')),
  target_id uuid not null,
  reason text not null check (char_length(reason) between 10 and 500),
  status text not null default 'open' check (status in ('open','reviewed','closed')),
  created_at timestamptz not null default now(),
  unique (reporter_id, target_type, target_id)
);

create index if not exists posts_created_idx on public.posts (is_pinned desc, created_at desc) where not is_hidden;
create index if not exists posts_category_idx on public.posts (category, created_at desc) where not is_hidden;
create index if not exists replies_post_idx on public.replies (post_id, created_at) where not is_hidden;
create index if not exists projects_created_idx on public.projects (created_at desc) where not is_hidden;
create index if not exists projects_author_idx on public.projects (author_id, created_at desc) where not is_hidden;
create index if not exists project_comments_project_idx on public.project_comments (project_id, created_at) where not is_hidden;

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare base_username text;
begin
  base_username := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'user_name', new.raw_user_meta_data->>'preferred_username', split_part(new.email, '@', 1), 'member_' || substr(new.id::text, 1, 8)), '[^a-zA-Z0-9_]', '', 'g'));
  if char_length(base_username) < 3 then base_username := 'member_' || substr(new.id::text, 1, 8); end if;
  insert into public.profiles (id, username, full_name, avatar_url, github_url)
  values (new.id, left(base_username, 30), coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), new.raw_user_meta_data->>'avatar_url', case when new.raw_user_meta_data->>'user_name' is not null then 'https://github.com/' || new.raw_user_meta_data->>'user_name' end)
  on conflict (id) do nothing;
  return new;
exception when unique_violation then
  insert into public.profiles (id, username, full_name, avatar_url)
  values (new.id, left(base_username, 21) || '_' || substr(new.id::text, 1, 8), new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace function public.validate_reply_parent() returns trigger language plpgsql as $$
begin
  if new.parent_id is not null and not exists (select 1 from public.replies r where r.id = new.parent_id and r.post_id = new.post_id) then
    raise exception 'Parent reply must belong to the same post';
  end if;
  return new;
end;
$$;

create or replace function public.refresh_reply_count() returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.posts set reply_count = (select count(*) from public.replies where post_id = coalesce(new.post_id, old.post_id) and not is_hidden) where id = coalesce(new.post_id, old.post_id);
  return coalesce(new, old);
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
drop trigger if exists posts_updated_at on public.posts;
create trigger posts_updated_at before update on public.posts for each row execute procedure public.set_updated_at();
drop trigger if exists replies_updated_at on public.replies;
create trigger replies_updated_at before update on public.replies for each row execute procedure public.set_updated_at();
drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at before update on public.projects for each row execute procedure public.set_updated_at();
drop trigger if exists project_comments_updated_at on public.project_comments;
create trigger project_comments_updated_at before update on public.project_comments for each row execute procedure public.set_updated_at();
drop trigger if exists validate_reply_parent_trigger on public.replies;
create trigger validate_reply_parent_trigger before insert or update of parent_id, post_id on public.replies for each row execute procedure public.validate_reply_parent();
drop trigger if exists replies_refresh_count on public.replies;
create trigger replies_refresh_count after insert or delete or update of is_hidden on public.replies for each row execute procedure public.refresh_reply_count();

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.replies enable row level security;
alter table public.projects enable row level security;
alter table public.project_comments enable row level security;
alter table public.reports enable row level security;

create policy "Profiles are public" on public.profiles for select using (true);
create policy "Members update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

create policy "Visible posts are public" on public.posts for select using (not is_hidden);
create policy "Members create posts" on public.posts for insert to authenticated with check (auth.uid() = author_id and not is_pinned and not is_hidden);
create policy "Authors update own posts" on public.posts for update to authenticated using (auth.uid() = author_id) with check (auth.uid() = author_id and not is_pinned and not is_hidden);
create policy "Authors delete own posts" on public.posts for delete to authenticated using (auth.uid() = author_id);

create policy "Visible replies are public" on public.replies for select using (not is_hidden);
create policy "Members create replies" on public.replies for insert to authenticated with check (auth.uid() = author_id and not is_hidden and exists (select 1 from public.posts where id = post_id and not is_locked and not is_hidden));
create policy "Authors update own replies" on public.replies for update to authenticated using (auth.uid() = author_id) with check (auth.uid() = author_id and not is_hidden);
create policy "Authors delete own replies" on public.replies for delete to authenticated using (auth.uid() = author_id);

create policy "Visible projects are public" on public.projects for select using (not is_hidden);
create policy "Members create projects" on public.projects for insert to authenticated with check (auth.uid() = author_id and not is_hidden);
create policy "Authors update own projects" on public.projects for update to authenticated using (auth.uid() = author_id) with check (auth.uid() = author_id and not is_hidden);
create policy "Authors delete own projects" on public.projects for delete to authenticated using (auth.uid() = author_id);

create policy "Visible project comments are public" on public.project_comments for select using (not is_hidden);
create policy "Members create project comments" on public.project_comments for insert to authenticated with check (auth.uid() = author_id and not is_hidden);
create policy "Authors update own project comments" on public.project_comments for update to authenticated using (auth.uid() = author_id) with check (auth.uid() = author_id and not is_hidden);
create policy "Authors delete own project comments" on public.project_comments for delete to authenticated using (auth.uid() = author_id);

create policy "Members create reports" on public.reports for insert to authenticated with check (auth.uid() = reporter_id);
create policy "Members see own reports" on public.reports for select to authenticated using (auth.uid() = reporter_id or exists (select 1 from public.profiles where id = auth.uid() and role in ('moderator','admin')));
