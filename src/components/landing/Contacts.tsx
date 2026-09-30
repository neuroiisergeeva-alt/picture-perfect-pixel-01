import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useSite } from "@/lib/site-data";
import { submitLead } from "@/lib/leads.functions";
import { Btn } from "./Btn";
import { Reveal } from "./Reveal";

const fieldCls =
  "w-full rounded-sm border border-input bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-cognac focus:outline-none";

export function CtaBand() {
  return (
    <section className="bg-secondary/70 py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-5 text-center md:px-10">
        <Reveal>
          <h2 className="font-display text-[2rem] leading-tight sm:text-[2.9rem]">
            Есть идея? Давайте подберем дерево, которое поможет ее реализовать.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
            Расскажите, что вы строите или хотите создать. Я помогу подобрать материал,
            рассчитать необходимый объем и стоимость.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Btn href="#contacts">Получить консультацию</Btn>
            <Btn href="#contacts" variant="outline">
              Рассчитать заказ
            </Btn>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ContactForm() {
  const { site, waLink, tgLink } = useSite();
  const send = useServerFn(submitLead);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");
  const [comment, setComment] = useState("");
  const [fileName, setFileName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [sending, setSending] = useState(false);

  const message = [
    "Заявка с сайта",
    name && `Имя: ${name}`,
    phone && `Телефон: ${phone}`,
    interest && `Интересует: ${interest}`,
    comment && `Комментарий: ${comment}`,
    fileName && `Файл: ${fileName} (отправлю в чате)`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <section id="contacts" className="py-24 md:py-36">
      <div className="mx-auto grid max-w-[86rem] gap-14 px-5 md:px-10 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow">Заявка</p>
          <h2 className="mt-5 font-display text-[2.2rem] leading-tight sm:text-5xl">
            Напишите мне — помогу разобраться
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Можно просто оставить номер телефона — я свяжусь с вами и помогу разобраться с
            выбором.
          </p>

          <form
            className="mt-10 grid gap-4 sm:grid-cols-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!agreed) {
                toast.error("Примите политику конфиденциальности");
                return;
              }
              setSending(true);
              try {
                await send({
                  data: {
                    name,
                    phone,
                    material: interest,
                    notes: [comment, fileName && `Файл: ${fileName} (пришлёт в мессенджере)`]
                      .filter(Boolean)
                      .join("\n"),
                    consent: true,
                  },
                });
                toast.success("Спасибо! Заявка отправлена, я скоро свяжусь с Вами.");
                setName(""); setPhone(""); setInterest(""); setComment(""); setFileName("");
                if (fileName) window.open(waLink(message), "_blank", "noopener,noreferrer");
              } catch {
                toast.error("Не удалось отправить. Проверьте телефон и попробуйте ещё раз.");
              } finally {
                setSending(false);
              }
            }}
          >
            <label className="sm:col-span-1">
              <span className="mb-2 block text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                Имя
              </span>
              <input
                className={fieldCls}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Как к вам обращаться"
                autoComplete="name"
              />
            </label>
            <label className="sm:col-span-1">
              <span className="mb-2 block text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                Телефон
              </span>
              <input
                className={fieldCls}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 ___ ___-__-__"
                inputMode="tel"
                autoComplete="tel"
                required
              />
            </label>
            <label className="sm:col-span-2">
              <span className="mb-2 block text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                Что вас интересует?
              </span>
              <input
                className={fieldCls}
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                placeholder="Например: планкен на фасад, доска пола, ступени"
              />
            </label>
            <label className="sm:col-span-2">
              <span className="mb-2 block text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                Комментарий
              </span>
              <textarea
                className={`${fieldCls} min-h-28 resize-y`}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Объем, размеры, сроки, задача"
              />
            </label>
            <label className="sm:col-span-2">
              <span className="mb-2 block text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                Фото, проект или чертеж
              </span>
              <input
                type="file"
                className={`${fieldCls} file:mr-4 file:rounded-sm file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:uppercase file:tracking-widest file:text-secondary-foreground`}
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              />
              <span className="mt-2 block text-xs text-muted-foreground">
                После отправки откроется WhatsApp, чтобы прикрепить файл.
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm text-muted-foreground sm:col-span-2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 accent-[var(--color-cognac)]"
              />
              <span>
                Я принимаю{" "}
                <Link to="/privacy" target="_blank" className="text-cognac underline">
                  политику конфиденциальности
                </Link>{" "}
                и даю согласие на обработку персональных данных.
              </span>
            </label>
            <div className="sm:col-span-2">
              <Btn type="submit" className="w-full py-5 sm:w-auto sm:px-12">
                {sending ? "Отправляю…" : "Отправить заявку"}
              </Btn>
            </div>
          </form>
        </Reveal>

        <Reveal delay={150}>
          <div className="rounded-sm bg-graphite p-9 text-graphite-foreground lg:p-11">
            <p className="eyebrow text-honey">Связаться напрямую</p>
            <h3 className="mt-5 font-display text-3xl">{site.expertName}</h3>
            <p className="mt-2 text-sm text-graphite-foreground/70">{site.expertRole}</p>

            <div className="mt-9 space-y-4">
              <a
                href={`tel:${site.phoneLink}`}
                className="block border-b border-graphite-foreground/15 pb-4 font-display text-2xl transition-colors hover:text-honey"
              >
                {site.phone}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="block border-b border-graphite-foreground/15 pb-4 text-sm transition-colors hover:text-honey"
              >
                {site.email}
              </a>
              <p className="text-sm text-graphite-foreground/70">{site.geo}</p>
            </div>

            <div className="mt-9 flex flex-col gap-3">
              <Btn href={waLink("Здравствуйте! Хочу подобрать пиломатериалы.")} variant="light">
                WhatsApp
              </Btn>
              <Btn href={tgLink} variant="light">
                Telegram
              </Btn>
            </div>

            <p className="mt-8 text-xs leading-relaxed text-graphite-foreground/50">
              {/* TODO: заменить контакты в src/config/site.ts */}
              Контакты указаны как placeholder — замените их на реальные.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const { site, waLink, tgLink, products } = useSite();
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto flex max-w-[86rem] flex-col items-start justify-between gap-6 px-5 text-sm text-muted-foreground md:flex-row md:items-center md:px-10">
        <p className="font-display text-xl text-foreground">{site.expertName}</p>
        <p className="max-w-md text-xs leading-relaxed">
          Пиломатериалы и изделия из натурального дерева. Собственное производство. Опт и
          розница.
        </p>
        <div className="flex gap-6 text-xs uppercase tracking-[0.14em]">
          <a href="#catalog" className="transition-colors hover:text-cognac">
            Каталог
          </a>
          <a href="#contacts" className="transition-colors hover:text-cognac">
            Контакты
          </a>
        </div>
      </div>
    </footer>
  );
}

export function MobileBar() {
  const { site, waLink, tgLink, products } = useSite();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-border bg-background/95 p-3 backdrop-blur-xl sm:hidden">
      <a
        href={`tel:${site.phoneLink}`}
        className="flex flex-1 items-center justify-center rounded-sm border border-input py-3.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em]"
      >
        Позвонить
      </a>
      <a
        href="#contacts"
        className="flex flex-[1.4] items-center justify-center rounded-sm bg-cognac py-3.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
      >
        Рассчитать заказ
      </a>
    </div>
  );
}
