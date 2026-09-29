import texture from "@/assets/texture-wood.jpg";
import emotion from "@/assets/emotion-interior.jpg";
import production1 from "@/assets/production-1.jpg";
import production2 from "@/assets/production-2.jpg";
import victoriaPortrait from "@/assets/victoria-portrait.jpg";
import { useEffect, useState } from "react";
import { Btn } from "./Btn";
import { Reveal } from "./Reveal";
import { AskBot } from "./AskBot";
import { site } from "@/config/site";

export function About() {
  return (
    <section id="about" className="py-24 md:py-36">
      <div className="mx-auto grid max-w-[86rem] items-center gap-14 px-5 md:px-10 lg:grid-cols-2 lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <p className="eyebrow">Обо мне</p>
          <h2 className="mt-5 font-display text-[2.2rem] leading-tight sm:text-5xl">
            Дерево — это больше, чем материал
          </h2>
          <div className="mt-8 space-y-5 text-[0.95rem] leading-relaxed text-muted-foreground">
            <p>
              Более 10 лет я занимаюсь продажей пиломатериалов оптом и в розницу и знаю этот
              рынок не только по каталогам и прайс-листам.
            </p>
            <p>
              Я знаю дерево, производство и особенности применения разных материалов. Поэтому моя
              задача — не просто продать доску, а помочь подобрать решение, которое действительно
              подойдет для вашего дома, строительства, отделки или проекта.
            </p>
            <p className="text-foreground">
              За годы работы нашей продукцией воспользовались более 1 000 000 клиентов.
            </p>
            <p>
              Мы работаем с частными покупателями, строительными организациями, мастерами,
              дизайнерами и бизнесом.
            </p>
            <p>
              В основе нашей работы — собственное производство, контроль качества и любовь к
              натуральному дереву.
            </p>
          </div>
          <div className="mt-9">
            <Btn href="#contacts" variant="outline">
              Задать вопрос лично
            </Btn>
          </div>
        </Reveal>

        <Reveal delay={150} className="order-1 lg:order-2">
          <div className="relative">
            <img
              src={victoriaPortrait}
              alt="Виктория Сергеева — эксперт по пиломатериалам и изделиям из дерева"
              loading="lazy"
              width={1200}
              height={1500}
              className="aspect-[4/5] w-full rounded-sm object-cover object-center shadow-soft"
            />
          </div>
          <AskBot />
        </Reveal>
      </div>
    </section>
  );
}

const advantages = [
  {
    title: "Более 10 лет опыта",
    text: "Я знаю особенности древесины и помогу подобрать материал под конкретную задачу.",
  },
  {
    title: "Собственное производство",
    text: "Контролируем путь продукции от производства до готового изделия.",
  },
  {
    title: "Помогаю выбрать, а не просто продаю",
    text: "Объясню разницу между материалами и помогу избежать лишних расходов.",
  },
  {
    title: "Опт и розница",
    text: "Работаем как с частными заказами, так и с крупными объемами.",
  },
  {
    title: "Большой ассортимент",
    text: "Материалы для строительства, фасада, внутренней отделки, террас, лестниц и мебели.",
  },
  {
    title: "Работаем по России",
    text: "Организуем поставки продукции в регионы России и ЮФО.",
  },
  {
    title: "Более 1 000 000 клиентов",
    text: "Опыт, сформированный большим количеством выполненных заказов.",
  },
];

export function Advantages() {
  return (
    <section id="advantages" className="border-y border-border bg-card py-24 md:py-36">
      <div className="mx-auto max-w-[86rem] px-5 md:px-10">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Почему работают со мной</p>
          <h2 className="mt-5 font-display text-[2.2rem] leading-tight sm:text-5xl">
            Спокойная работа и понятный результат
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-sm bg-border sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map((a, i) => (
            <Reveal key={a.title} delay={(i % 3) * 90} className="bg-card">
              <div className="group h-full p-8 transition-colors duration-500 hover:bg-secondary/70 lg:p-10">
                <span className="font-display text-3xl text-oak transition-colors duration-500 group-hover:text-cognac">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-display text-2xl leading-snug">{a.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.text}</p>
              </div>
            </Reveal>
          ))}
          {/* Заполняем пустые ячейки сетки, чтобы не было «дыр» */}
          <div className="hidden bg-card sm:block lg:col-span-2" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

export function Emotion() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById("emotion");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setOffset((rect.top / window.innerHeight) * -40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="emotion" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={emotion}
          alt="Интерьер современного дома с деревянной отделкой и теплым светом"
          loading="lazy"
          width={1920}
          height={1088}
          className="h-full w-full object-cover"
          style={{ transform: `translate3d(0,${offset}px,0) scale(1.12)` }}
        />
        <div className="absolute inset-0 bg-graphite/55" />
      </div>
      <div className="mx-auto max-w-[86rem] px-5 py-32 md:px-10 md:py-48">
        <Reveal className="max-w-3xl">
          <h2 className="font-display text-[1.9rem] leading-snug text-graphite-foreground sm:text-4xl lg:text-[3.2rem]">
            У дерева нет двух одинаковых рисунков. Именно поэтому пространство, созданное из
            дерева, всегда получается особенным.
          </h2>
          <p className="mt-8 text-[0.72rem] uppercase tracking-[0.22em] text-honey">
            Тепло. Фактура. Характер. Материал, который не выходит из моды.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

const steps = [
  {
    n: "01",
    title: "Расскажите, что вам нужно",
    text: "Можно прислать размеры, фотографию, проект, чертеж или просто описать задачу.",
  },
  {
    n: "02",
    title: "Помогу подобрать материал",
    text: "Подберем вид продукции, размеры, сорт, объем и подходящий вариант под ваш бюджет.",
  },
  {
    n: "03",
    title: "Рассчитаем заказ",
    text: "Уточним стоимость продукции, наличие, сроки производства и доставки.",
  },
  {
    n: "04",
    title: "Производство и отгрузка",
    text: "Комплектуем заказ и организуем его получение или доставку.",
  },
];

export function Process() {
  return (
    <section id="process" className="py-24 md:py-36">
      <div className="mx-auto max-w-[86rem] px-5 md:px-10">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Как со мной работать</p>
          <h2 className="mt-5 font-display text-[2.2rem] leading-tight sm:text-5xl">
            От идеи до готового заказа
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 110}>
              <div className="border-t border-cognac/30 pt-6">
                <span className="font-display text-4xl text-cognac">{s.n}</span>
                <h3 className="mt-4 font-display text-2xl leading-snug">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16">
          <Btn href="#contacts" className="w-full py-5 sm:w-auto sm:px-14">
            Обсудить мой проект
          </Btn>
        </Reveal>
      </div>
    </section>
  );
}

const audience = [
  "Частные клиенты",
  "Строители и подрядчики",
  "Дизайнеры и архитекторы",
  "Мебельные производства",
  "Строительные компании",
  "Магазины и торговые организации",
  "Оптовые покупатели",
];

export function Audience() {
  return (
    <section className="bg-graphite py-24 text-graphite-foreground md:py-32">
      <div className="mx-auto grid max-w-[86rem] gap-12 px-5 md:px-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="eyebrow text-honey">Для кого мы работаем</p>
          <h2 className="mt-5 font-display text-[2.1rem] leading-tight sm:text-4xl">
            Небольшой частный заказ и крупная оптовая поставка — одинаково важны
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <ul className="grid gap-x-10 gap-y-0 sm:grid-cols-2">
            {audience.map((a) => (
              <li
                key={a}
                className="border-b border-graphite-foreground/15 py-5 text-[0.95rem] text-graphite-foreground/85"
              >
                {a}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

export function Production() {
  return (
    <section className="py-24 md:py-36">
      <div className="mx-auto grid max-w-[86rem] items-center gap-14 px-5 md:px-10 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="grid grid-cols-2 gap-4">
            <img
              src={production1}
              alt="Штабели качественной древесины и камера сушки на производстве"
              loading="lazy"
              width={1408}
              height={1008}
              className="col-span-2 aspect-[16/10] w-full rounded-sm object-cover shadow-soft"
            />
            <img
              src={production2}
              alt="Мастер проверяет поверхность строганой доски в цехе"
              loading="lazy"
              width={1200}
              height={912}
              className="aspect-[4/3] w-full rounded-sm object-cover shadow-soft"
            />
            <img
              src={texture}
              alt="Текстура древесины крупным планом"
              loading="lazy"
              width={1200}
              height={1600}
              className="aspect-[4/3] w-full rounded-sm object-cover shadow-soft"
            />
          </div>
        </Reveal>
        <Reveal delay={150}>
          <p className="eyebrow">Производство</p>
          <h2 className="mt-5 font-display text-[2.2rem] leading-tight sm:text-5xl">
            От производства — к вашему проекту
          </h2>
          <div className="mt-8 space-y-5 text-[0.95rem] leading-relaxed text-muted-foreground">
            <p>
              Собственное производство позволяет контролировать качество продукции и предлагать
              большой выбор изделий из натурального дерева.
            </p>
            <p>
              Мы работаем как со стандартными позициями, так и с заказами под конкретные задачи
              клиента.
            </p>
          </div>
          <p className="mt-8 text-[0.72rem] uppercase tracking-[0.18em] text-cognac">
            {site.geo}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
