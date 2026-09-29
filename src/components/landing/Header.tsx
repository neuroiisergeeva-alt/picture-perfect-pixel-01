import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { site } from "@/config/site";
import { Btn } from "./Btn";

const nav = [
  { label: "Обо мне", href: "#about" },
  { label: "Каталог", href: "#catalog" },
  { label: "Преимущества", href: "#advantages" },
  { label: "Проекты", href: "#projects" },
  { label: "Как заказать", href: "#process" },
  { label: "Контакты", href: "#contacts" },
];

export function Header() {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        compact
          ? "border-b border-border/70 bg-background/85 py-2 backdrop-blur-xl"
          : "py-5 md:py-7",
      )}
    >
      <div className="mx-auto flex max-w-[86rem] items-center justify-between px-5 md:px-10">
        <a href="#top" className="flex items-baseline gap-2.5" aria-label="На главную">
          <span
            className={cn(
              "font-display leading-none transition-all duration-500",
              compact ? "text-xl" : "text-2xl md:text-[1.7rem]",
            )}
          >
            {site.expertName}
          </span>
          <span className="hidden text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:inline">
            дерево
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[0.8rem] font-medium tracking-wide text-muted-foreground transition-colors hover:text-cognac"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Btn href="#contacts" className="hidden px-6 py-3 sm:inline-flex">
            Рассчитать заказ
          </Btn>
          <button
            type="button"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-[6px] rounded-sm border border-border lg:hidden"
          >
            <span
              className={cn(
                "h-px w-5 bg-foreground transition-transform duration-300",
                open && "translate-y-[3.5px] rotate-45",
              )}
            />
            <span
              className={cn(
                "h-px w-5 bg-foreground transition-transform duration-300",
                open && "-translate-y-[3.5px] -rotate-45",
              )}
            />
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      <div
        className={cn(
          "fixed inset-0 top-0 z-40 flex flex-col justify-center bg-background px-8 transition-all duration-500 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <nav className="flex flex-col gap-6">
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display text-4xl transition-colors hover:text-cognac"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mt-12 flex flex-col gap-3">
          <Btn href={`tel:${site.phoneLink}`} variant="outline">
            {site.phone}
          </Btn>
          <Btn href="#contacts" onClick={() => setOpen(false)}>
            Рассчитать заказ
          </Btn>
        </div>
      </div>
    </header>
  );
}
