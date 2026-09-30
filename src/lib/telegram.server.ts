const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const labels: Record<string, string> = {
  name: "Имя", phone: "Телефон", email: "E-mail", region: "Регион",
  material: "Материал", volume: "Объём", purpose: "Цель", notes: "Комментарий",
};

export async function notifyTelegram(lead: Record<string, string | null | undefined>, source: string) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const tgKey = process.env["TELEGRAM_API_KEY"];
  const chatId = process.env["TELEGRAM_ADMIN_CHAT_ID"];
  if (!lovableKey || !tgKey || !chatId) return;
  const lines = Object.entries(labels)
    .filter(([k]) => lead[k])
    .map(([k, l]) => `<b>${l}:</b> ${esc(String(lead[k]))}`);
  const res = await fetch("https://connector-gateway.lovable.dev/telegram/sendMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": tgKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      parse_mode: "HTML",
      text: `🪵 <b>Новая заявка с сайта</b>\n<i>${esc(source)}</i>\n\n${lines.join("\n")}`,
    }),
  });
  if (!res.ok) console.error(`Telegram failed [${res.status}]: ${await res.text()}`);
}
