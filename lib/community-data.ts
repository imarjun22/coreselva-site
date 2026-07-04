import type { CommunityPost, Project } from "@/lib/types";

export const categories = ["Embedded C", "RISC-V", "FPGA", "PCB & electronics", "Debugging", "Show & tell"];

export const demoPosts: CommunityPost[] = [
  {
    id: "demo-1", slug: "why-does-volatile-not-fix-my-counter", title: "Why does volatile not fix my interrupt counter?",
    body: "I can see the ISR update the counter, but the foreground sometimes reads an unexpected value. I want to understand the atomicity issue rather than hide it.",
    category: "Embedded C", tags: ["volatile", "interrupts", "atomicity"], created_at: "2026-07-03T09:30:00Z", reply_count: 7, view_count: 184, is_pinned: true,
    author: { id: "demo-profile-1", username: "logicleaf", full_name: "Maya R", avatar_url: null, bio: "Learning firmware from the register level." },
  },
  {
    id: "demo-2", slug: "five-stage-core-hazard-unit-review", title: "Review request: hazard unit for a five-stage RV64I core",
    body: "The forwarding paths work for ALU dependencies. I am unsure whether my load-use stall and branch flush can collide in the same cycle.",
    category: "RISC-V", tags: ["rv64i", "pipeline", "verification"], created_at: "2026-07-02T14:15:00Z", reply_count: 12, view_count: 326, is_pinned: false,
    author: { id: "demo-profile-2", username: "bitbybit", full_name: "Arun K", avatar_url: null, bio: "Digital design student." },
  },
  {
    id: "demo-3", slug: "st7735-first-pixel-checklist", title: "ST7735 powers up, but no pixels: my measurement checklist",
    body: "I documented power, reset timing, SPI mode, command/data polarity and the first initialization bytes. What would you measure next?",
    category: "Debugging", tags: ["spi", "tft", "logic-analyzer"], created_at: "2026-06-30T18:05:00Z", reply_count: 5, view_count: 211, is_pinned: false,
    author: { id: "demo-profile-3", username: "scopefirst", full_name: "Nila S", avatar_url: null, bio: "Measure twice, patch once." },
  },
];

export const demoProjects: Project[] = [
  {
    id: "project-1", slug: "csrv64i-five-stage", title: "CSRV64I five-stage core", summary: "A readable RV64I pipeline with forwarding, hazard detection and FPGA validation.",
    description: "An educational processor designed so each stage, control decision and verification result can be inspected.", repo_url: "https://github.com/KaranArjunS/CoreSelva-RV64I-5-Stage-ArtyA7", demo_url: null, cover_url: null,
    technologies: ["SystemVerilog", "RV64I", "Artix-7"], status: "verified", created_at: "2026-05-14T10:00:00Z",
    author: { id: "karan", username: "karanarjun", full_name: "Karan Arjun Selvan", avatar_url: "/karan.jpg", bio: "CoreSelva maintainer." },
  },
];

export function formatRelativeDate(value: string) {
  const days = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}
