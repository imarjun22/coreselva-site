export type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website?: string | null;
  github_url?: string | null;
};

export type CommunityPost = {
  id: string;
  slug: string;
  title: string;
  body: string;
  category: string;
  tags: string[];
  created_at: string;
  reply_count: number;
  view_count: number;
  is_pinned: boolean;
  author: Profile;
};

export type Reply = {
  id: string;
  post_id: string;
  parent_id: string | null;
  body: string;
  created_at: string;
  author: Profile;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  repo_url: string | null;
  demo_url: string | null;
  cover_url: string | null;
  technologies: string[];
  status: "idea" | "building" | "working" | "verified";
  created_at: string;
  author: Profile;
};
