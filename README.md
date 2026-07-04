# CoreSelva platform

The public website for [www.coreselva.com](https://www.coreselva.com): open
educational hardware, CoreSelva Academy, technical community discussions, member
profiles, and project publishing.

## Information architecture

- `/` — platform homepage and primary calls to action
- `/products` — CSRV64 hardware and public roadmap
- `/academy` — learning tracks and the embedded-C course
- `/academy/embedded-c/index.html` — compatibility redirect to the current roadmap
- `/academy/embedded-c-roadmap/index.html` — 15-phase, 129-topic guided Embedded C and STM32 roadmap
- `/community` — searchable discussions grouped by engineering topic
- `/community/[slug]` — thread with profile-linked nested replies
- `/projects` — filterable public project showcase
- `/projects/[slug]` — technical project page and nested comments
- `/profile/[username]` — public profile, projects, and discussions
- `/compiler` — existing RISC-V compiler interface

## Local development

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Without Supabase variables the community renders
representative preview content, while posting and authentication remain disabled.

## Enable profiles, forums, replies, and projects

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in its SQL editor.
3. In Supabase Authentication, enable GitHub and enter a GitHub OAuth app client
   ID and secret.
4. Add these redirect URLs to the provider configuration:
   - `http://localhost:3000/community`
   - `https://www.coreselva.com/community`
5. Copy the project URL and public anonymous key into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

The browser uses only the public anonymous key. Database row-level security in
the schema ensures members can create and edit only their own public content.
Never expose the Supabase service-role key to the browser or commit it.

## Production checks

```powershell
npm run lint
npm run build
npm audit --omit=dev
```

The repository is designed for Vercel. Configure the two public Supabase
environment variables in the Vercel project, redeploy, and test GitHub sign-in
before publicly announcing community publishing.

## Moderation baseline

The schema includes hidden-content flags, member/moderator/admin roles, reports,
author ownership policies, locked threads, bounded content fields, and public
read-only access. Before launch, designate moderators, publish the community
guidelines, and test report/hidden-content workflows from non-admin accounts.

## License

Apache License 2.0. © 2026 Karan Arjun Selvan — CoreSelva.
