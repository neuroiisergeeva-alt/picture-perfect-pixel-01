import { createContext, useContext, useMemo, type ReactNode } from "react";
import doska from "@/assets/cat-doska.jpg";
import vagonka from "@/assets/cat-vagonka.jpg";
import pol from "@/assets/cat-pol.jpg";
import imitaciya from "@/assets/cat-imitaciya.jpg";
import brus from "@/assets/cat-brus.jpg";
import stupeni from "@/assets/cat-stupeni.jpg";
import shit from "@/assets/cat-shit.jpg";
import planken from "@/assets/cat-planken.jpg";
import bruski from "@/assets/cat-bruski.jpg";
import { site as defaults } from "@/config/site";
import { products as defaultProducts, type Product } from "@/data/catalog";
import type { ProductRow, SiteSettings } from "./site-data.functions";

export const bundledImages: Record<string, string> = {
  doska, vagonka, pol, imitaciya, brus, stupeni, shit, planken, bruski,
};

export function productImage(p: Pick<ProductRow, "image_url" | "image_key">) {
  return p.image_url || (p.image_key ? bundledImages[p.image_key] : undefined) || doska;
}

type Site = {
  expertName: string;
  expertRole: string;
  phone: string;
  phoneLink: string;
  whatsapp: string;
  telegram: string;
  email: string;
  geo: string;
};

type Ctx = {
  site: Site;
  products: Product[];
  waLink: (text?: string) => string;
  tgLink: string;
};

function build(settings: SiteSettings | null, rows: ProductRow[] | null): Ctx {
  const site: Site = settings
    ? {
        expertName: settings.expert_name,
        expertRole: settings.expert_role,
        phone: settings.phone,
        phoneLink: "+" + settings.phone.replace(/\D/g, ""),
        whatsapp: settings.whatsapp.replace(/\D/g, ""),
        telegram: settings.telegram.replace(/^@/, ""),
        email: settings.email,
        geo: settings.geo,
      }
    : { ...defaults };
  const products: Product[] = rows
    ? rows.map((r) => ({ title: r.title, text: r.text, alt: r.alt || r.title, image: productImage(r) }))
    : defaultProducts;
  return {
    site,
    products,
    waLink: (text) => `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`,
    tgLink: `https://t.me/${site.telegram}`,
  };
}

const SiteCtx = createContext<Ctx>(build(null, null));

export function SiteProvider({
  settings,
  products,
  children,
}: {
  settings: SiteSettings | null;
  products: ProductRow[] | null;
  children: ReactNode;
}) {
  const value = useMemo(() => build(settings, products), [settings, products]);
  return <SiteCtx.Provider value={value}>{children}</SiteCtx.Provider>;
}

export const useSite = () => useContext(SiteCtx);
