import { useEffect, useState } from "react";
import heroHouse from "@/assets/hero-house.jpg";
import { Btn } from "./Btn";
import { Reveal } from "./Reveal";

const stats = [
  { value: "10+", label: "лет в пиломатериалах" },
  { value: "1 000 000+", label: "довольных клиентов" },
  { value: "Своё", label: "производство" },
  { value: "Опт", label: "и розница" },
  { value: "РФ", label: "поставки по России" },
];

export function Hero() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(Math.min(window.scrollY, 700) * 0.12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroHouse}
          alt="Современный дом с фасадом из натурального дерева в вечернем свете"
          width={1920}
          height={1280}
          className="h-full w-full object-cover"
          style={{ transform: `translate3d(0,${offset}px,0) scale(1.06)` }}
        />
        <div className="absolute inset-0 bg-graphite/45" />
        <div className="absolute inset-0 bg-veil" />
      </div>

      <div className="mx-auto flex min-h-[100svh] max-w-[86rem] flex-col justify-end px-5 pb-12 pt-32 md:px-10 md:pb-16">
        <Reveal className="max-w-3xl">
          <p className="mb-6 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-graphite-foreground/70">
            Пиломатериалы и изделия из дерева · собственное производство
          </p>
          <h1 className="font-display text-[2.6rem] leading-[1.05] text-graphite-foreground sm:text-6xl lg:text-[4.6rem]">
            Дерево, из которого создают пространство для жизни
          </h1>
          <p className="mt-7 max-w-xl text-[0.98rem] leading-relaxed text-graphite-foreground/85">
            Более 10 лет помогаю выбирать пиломатериалы для строительства, отделки и интерьера.
            Собственное производство. Оптовые и розничные поставки по России.
          </p>
          <p className="mt-4 font-display text-xl text-honey">
            От одной детали интерьера — до комплектации целого объекта.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Btn href="#contacts">Подобрать материал</Btn>
            <Btn href="#catalog" variant="light">
              Смотреть каталог
            </Btn>
          </div>
        </Reveal>

        <Reveal delay={200} className="mt-14 md:mt-20">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-7 border-t border-graphite-foreground/15 pt-8 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-2xl text-graphite-foreground lg:text-[1.8rem]">
                  {s.value}
                </dt>
                <dd className="mt-1 text-[0.72rem] uppercase tracking-[0.14em] text-graphite-foreground/60">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
