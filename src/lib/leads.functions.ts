import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().max(100).optional(),
  phone: z.string().trim().min(5).max(40),
  material: z.string().trim().max(300).optional(),
  notes: z.string().trim().max(1500).optional(),
  consent: z.literal(true),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((d) => schema.parse(d))
  .handler(async ({ data }) => {
    const lead = {
      name: data.name || "Без имени",
      phone: data.phone,
      material: data.material || null,
      notes: data.notes || null,
    };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("leads").insert({ ...lead, consent: true });
    if (error) {
      console.error("lead insert failed", error.message);
      throw new Error("Не удалось отправить заявку");
    }
    const { notifyTelegram } = await import("./telegram.server");
    await notifyTelegram(lead, "Форма заявки на сайте").catch((e) => console.error(e));
    return { ok: true };
  });
