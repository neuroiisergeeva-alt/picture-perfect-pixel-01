import { createFileRoute, Link } from "@tanstack/react-router";
import { site } from "@/config/site";

const title = "Политика конфиденциальности — пиломатериалы Виктории Сергеевой";
const description =
  "Как обрабатываются персональные данные, которые Вы оставляете на сайте и в чате с помощником.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-20 md:py-28">
      <Link to="/" className="eyebrow text-cognac">← На главную</Link>
      <h1 className="mt-6 font-display text-4xl sm:text-5xl">Политика конфиденциальности</h1>
      <p className="mt-4 rounded-sm border border-dashed border-cognac/50 p-4 text-sm text-muted-foreground">
        Шаблон: замените данные в [скобках] на реальные реквизиты оператора персональных данных.
      </p>
      <div className="mt-10 space-y-6 text-[0.95rem] leading-relaxed text-muted-foreground">
        <p>
          1. Оператор персональных данных — [ФИО / ИП / наименование организации, ИНН, адрес].
          Контакт для обращений: {site.email}.
        </p>
        <p>
          2. Мы обрабатываем данные, которые Вы сообщаете сами в форме заявки или в чате с
          помощником: имя, телефон, e-mail, регион, сведения о потребности в материалах.
        </p>
        <p>
          3. Цель обработки — ответ на Ваш запрос, расчёт стоимости, консультация и исполнение
          заказа. Данные не передаются третьим лицам, кроме случаев, предусмотренных законом.
        </p>
        <p>
          4. Обработка осуществляется в соответствии с Федеральным законом № 152-ФЗ «О персональных
          данных». Данные хранятся не дольше, чем требуется для достижения целей обработки.
        </p>
        <p>
          5. Вы можете отозвать согласие и потребовать удаления своих данных, направив запрос на
          {" "}{site.email}.
        </p>
        <p>6. Сообщения в чате обрабатываются с помощью сервиса искусственного интеллекта.</p>
      </div>
    </main>
  );
}
