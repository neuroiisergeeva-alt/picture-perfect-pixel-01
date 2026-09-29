import { projects } from "@/data/catalog";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function Projects() {
  return (
    <section id="projects" className="py-24 md:py-36">
      <div className="mx-auto max-w-[86rem] px-5 md:px-10">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Наше дерево в проектах</p>
          <h2 className="mt-5 font-display text-[2.2rem] leading-tight sm:text-5xl">
            Фасады, интерьеры, террасы, дома, лестницы, заборы и мебель
          </h2>
          <p className="mt-5 text-sm text-muted-foreground">
            {/* TODO: заменить на реальные фотографии выполненных объектов */}
            Фотографии подобраны как примеры применения материалов — их легко заменить
            на снимки ваших объектов.
          </p>
        </Reveal>

        <div className="mt-14 grid auto-rows-[15rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((p, i) => (
            <Reveal
              key={p.category}
              delay={(i % 4) * 80}
              className={cn(
                "group relative overflow-hidden rounded-sm",
                p.wide && "sm:col-span-2 lg:row-span-2",
                p.tall && "lg:row-span-2",
              )}
            >
              <img
                src={p.image}
                alt={p.alt}
                loading="lazy"
                width={1200}
                height={900}
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-veil opacity-70 transition-opacity duration-700 group-hover:opacity-95" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-2xl text-graphite-foreground">{p.category}</h3>
                <p className="mt-1 max-h-0 overflow-hidden text-[0.72rem] uppercase tracking-[0.16em] text-honey opacity-0 transition-all duration-500 group-hover:max-h-10 group-hover:opacity-100">
                  Материал: {p.material}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
