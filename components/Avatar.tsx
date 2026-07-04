import Image from "next/image";

export default function Avatar({ src, name, size = "md" }: { src?: string | null; name: string; size?: "sm" | "md" | "lg" }) {
  const classes = size === "sm" ? "h-7 w-7 text-[10px]" : size === "lg" ? "h-20 w-20 text-xl" : "h-10 w-10 text-xs";
  if (src) return <Image src={src} alt="" width={size === "lg" ? 80 : 40} height={size === "lg" ? 80 : 40} className={`${classes} rounded-full border border-yellow/25 object-cover`} />;
  const initials = name.split(/\s|_/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  return <span aria-hidden="true" className={`${classes} grid shrink-0 place-items-center rounded-full border border-yellow/25 bg-yellow/10 font-black text-yellow`}>{initials || "CS"}</span>;
}
