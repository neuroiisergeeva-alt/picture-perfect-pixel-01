import { products } from "@/data/catalog";
import { Btn } from "./Btn";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";
import { waLink } from "@/config/site";

export function Catalog() {
  return (
    <section id="catalog" className="bg-secondary/60 py-24 md:py-36">
      <div className="mx-auto max-w-[86rem] px-5 md:px-10">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Мини-каталог</p>
          <h2 className="mt-5 font-display text-[2.2rem] leading-tight sm:text-5xl">
            Дерево для ваших идей
          </h2>
          <p className="mt-5 text-muted-foreground">
            От строительства дома до последней детали интерьера.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {products.map((p, i) => {
            // Асимметричная сетка на desktop
            const span = [0, 5].includes(i) ? "lg:col-span-4" : i === 1 ? "lg:col-span-2" : "lg:col-span-2";
            const tall = [0, 5].includes(i);
            return (
              <Reveal
                key={p.title}
                delay={(i % 3) * 90}
                className={cn("group", span)}
              >
                <article className="flex h-full flex-col overflow-hidden rounded-sm bg-card shadow-soft transition-shadow duration-500 hover:shadow-lift">
                  <div className={cn("overflow-hidden", tall ? "aspect-[16/10]" : "aspect-[4/3]")}>
                    <img
                      src={p.image}
                      alt={p.alt}
                      loading="lazy"
                      width={1200}
                      height={900}
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="font-display text-2xl leading-snug">{p.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {p.text}
                    </p>
                    <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-5">
                      <span className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                        Цена по запросу
                      </span>
                      <Btn
                        href={waLink(`Здравствуйте! Интересует «${p.title}». Подскажите цену и наличие.`)}
                        variant="ghost"
                      >
                        Узнать цену →
                      </Btn>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-12 text-center">
          <Btn href="#contacts">Рассчитать заказ</Btn>
        </Reveal>
      </div>
    </section>
  );
}
