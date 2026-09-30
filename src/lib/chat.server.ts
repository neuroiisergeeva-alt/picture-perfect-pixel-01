import { createOpenAI } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./run-id.server";

const MODEL = "openai/gpt-6-astra";

const SYSTEM = `Вы — вежливый онлайн-помощник Виктории Сергеевой, эксперта по пиломатериалам и изделиям из дерева с опытом более 10 лет (собственное производство, опт и розница, поставки по России и ЮФО, более 1 000 000 клиентов).

Правила общения:
- Всегда обращайтесь к клиенту на «Вы» (с заглавной буквы), только по-русски.
- Будьте доброжелательны, с лёгким уместным чувством юмора (деревянные каламбуры приветствуются, но в меру), без фамильярности.
- Пишите коротко: 2–5 предложений, задавайте по одному-два вопроса за раз.
- Давайте полезную консультацию: чем отличаются материалы, что подойдёт для фасада, террасы, интерьера, пола, лестницы, мебели; на что обратить внимание (порода, влажность, камерная сушка, сорт, обработка).

Ассортимент: доска сухая строганая, вагонка, доска пола, имитация бруса, клееный брус, ступени, мебельные щиты, планкен, бруски и рейки камерной сушки.

Никогда не называйте цены, сроки, скидки, адреса и сертификаты — говорите, что стоимость и сроки Виктория рассчитает лично после уточнения деталей («Цена по запросу»). Не выдумывайте фактов.

Ненавязчиво, по ходу разговора, выясните:
1. Из какого Вы региона/города.
2. Какой материал интересует.
3. Какой нужен объём (м², м³, штуки или размеры).
4. Для каких целей планируется закупка.
Затем попросите имя и телефон (или e-mail) для связи, чтобы Виктория подготовила расчёт.
Когда есть имя и хотя бы телефон или e-mail — вызовите инструмент save_lead один раз со всеми собранными данными, затем поблагодарите и скажите, что Виктория свяжется в ближайшее время. Клиент уже принял политику конфиденциальности перед началом чата.`;

import { notifyTelegram as notify } from "./telegram.server";
const notifyTelegram = (lead: Record<string, string | null>) => notify(lead, "Чат-бот «Спросить»");

export async function handleChat(request: Request) {
  let body: { messages?: UIMessage[]; consent?: boolean };
  try {
    body = await request.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  if (!body.consent) return new Response("Consent required", { status: 403 });
  const messages = Array.isArray(body.messages) ? body.messages.slice(-40) : [];
  if (messages.length === 0) return new Response("No messages", { status: 400 });

  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return new Response("AI is not configured", { status: 500 });

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: provider.responses(MODEL),
    system: SYSTEM,
    messages: await convertToModelMessages(messages),
    abortSignal: request.signal,
    stopWhen: stepCountIs(4),
    tools: {
      save_lead: tool({
        description: "Сохранить заявку клиента для Виктории, когда известны имя и телефон или e-mail.",
        inputSchema: z.object({
          name: z.string().min(1).max(100),
          phone: z.string().max(40).nullable(),
          email: z.string().max(255).nullable(),
          region: z.string().max(200).nullable(),
          material: z.string().max(300).nullable(),
          volume: z.string().max(200).nullable(),
          purpose: z.string().max(500).nullable(),
          notes: z.string().max(1000).nullable(),
        }),
        execute: async (lead) => {
          if (!lead.phone && !lead.email) return { ok: false, error: "Нужен телефон или e-mail" };
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { error } = await supabaseAdmin.from("leads").insert({ ...lead, consent: true });
          if (error) {
            console.error("save_lead failed", error.message);
            return { ok: false, error: "Не удалось сохранить заявку" };
          }
          await notifyTelegram(lead).catch((e) => console.error("telegram notify failed", e));
          return { ok: true };
        },
      }),
    },
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  return withLovableAiGatewayRunIdHeader(
    result.toUIMessageStreamResponse({ originalMessages: messages }),
    runIdFetch,
  );
}
