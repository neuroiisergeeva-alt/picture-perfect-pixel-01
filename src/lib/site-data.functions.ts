import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
export type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export const getSiteData = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return { settings: null, products: null };
  const sb = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
  const [s, p] = await Promise.all([
    sb.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    sb.from("products").select("*").eq("visible", true).order("sort_order"),
  ]);
  if (s.error) console.error("settings", s.error.message);
  if (p.error) console.error("products", p.error.message);
  return { settings: s.data ?? null, products: p.error ? null : (p.data ?? []) };
});
