/**
 * ЗАМЕНИТЕ НА РЕАЛЬНЫЕ ДАННЫЕ.
 * Все контакты и имя эксперта собраны здесь, чтобы менять их в одном месте.
 */
export const site = {
  // TODO: заменить на реальное имя и подпись
  expertName: "Ваше имя",
  expertRole: "Эксперт по пиломатериалам · собственное производство",
  // TODO: заменить на реальный телефон (в формате для ссылки — без пробелов)
  phone: "+7 000 000-00-00",
  phoneLink: "+70000000000",
  whatsapp: "70000000000",
  telegram: "username",
  email: "mail@example.com",
  geo: "Поставки по России и ЮФО",
} as const;

export const waLink = (text?: string) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const tgLink = `https://t.me/${site.telegram}`;
