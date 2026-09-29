import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm px-7 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.16em] transition-all duration-500 ease-out disabled:opacity-60";

const variants = {
  solid:
    "bg-cognac text-primary-foreground hover:bg-chocolate hover:shadow-lift hover:-translate-y-0.5",
  outline:
    "border border-graphite/25 text-foreground hover:border-cognac hover:text-cognac hover:-translate-y-0.5",
  light:
    "border border-graphite-foreground/40 text-graphite-foreground hover:bg-graphite-foreground hover:text-graphite",
  ghost: "text-cognac hover:text-chocolate px-0 py-1",
} as const;

type Props = {
  children: ReactNode;
  href?: string;
  variant?: keyof typeof variants;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

export function Btn({ children, href, variant = "solid", className, type, onClick }: Props) {
  const cls = cn(base, variants[variant], className);
  if (href) {
    const external = href.startsWith("http") || href.startsWith("tel:");
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button type={type ?? "button"} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
