import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Btn } from "@/components/landing/Btn";
import { productImage } from "@/lib/site-data";

type Lead = Database["public"]["Tables"]["leads"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];
type Settings = Database["public"]["Tables"]["site_settings"]["Row"];

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Админ-панель — заявки, товары, контакты" },
      { name: "description", content: "Управление заявками, товарами и информацией на сайте." },
      { property: "og:title", content: "Админ-панель" },
      { property: "og:description", content: "Управление сайтом." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const field =
  "w-full rounded-sm border border-input bg-background px-3 py-2 text-sm focus:border-cognac focus:outline-none";

function AdminPage() {
  const navigate = useNavigate();
  const admin = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("claim_admin");
      if (error) throw error;
      return data === true;
    },
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Админ-панель</p>
          <h1 className="mt-2 font-display text-4xl">Управление сайтом</h1>
        </div>
        <div className="flex gap-3">
          <Link to="/" className="text-sm text-cognac underline">Открыть сайт</Link>
          <button onClick={signOut} className="text-sm text-muted-foreground underline">Выйти</button>
        </div>
      </div>

      {admin.isLoading ? (
        <p className="mt-10 text-muted-foreground">Проверяем доступ…</p>
      ) : !admin.data ? (
        <p className="mt-10 text-muted-foreground">
          У этого аккаунта нет доступа к админ-панели.
        </p>
      ) : (
        <Tabs defaultValue="leads" className="mt-8">
          <TabsList>
            <TabsTrigger value="leads">Заявки</TabsTrigger>
            <TabsTrigger value="products">Товары</TabsTrigger>
            <TabsTrigger value="settings">Информация на сайте</TabsTrigger>
          </TabsList>
          <TabsContent value="leads"><Leads /></TabsContent>
          <TabsContent value="products"><Products /></TabsContent>
          <TabsContent value="settings"><SettingsForm /></TabsContent>
        </Tabs>
      )}
    </main>
  );
}

const statuses: Record<string, string> = { new: "Новая", work: "В работе", done: "Завершена" };

function Leads() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Lead[];
    },
  });
  const update = async (id: string, status: string) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) return void toast.error("Не удалось сохранить");
    qc.invalidateQueries({ queryKey: ["leads"] });
  };
  const remove = async (id: string) => {
    if (!confirm("Удалить заявку?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) return void toast.error("Не удалось удалить");
    qc.invalidateQueries({ queryKey: ["leads"] });
  };

  if (q.isLoading) return <p className="mt-6 text-muted-foreground">Загрузка…</p>;
  if (q.error) return <p className="mt-6 text-destructive">Ошибка загрузки заявок</p>;
  if (!q.data?.length) return <p className="mt-6 text-muted-foreground">Заявок пока нет.</p>;

  return (
    <div className="mt-6 space-y-4">
      {q.data.map((l) => (
        <div key={l.id} className="rounded-sm border border-border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-2xl">{l.name}</p>
              <p className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString("ru-RU")}</p>
            </div>
            <div className="flex items-center gap-3">
              <select className={field + " w-auto"} value={l.status} onChange={(e) => update(l.id, e.target.value)}>
                {Object.entries(statuses).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <button onClick={() => remove(l.id)} className="text-sm text-destructive underline">Удалить</button>
            </div>
          </div>
          <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            {l.phone && <Row k="Телефон" v={<a className="text-cognac" href={`tel:${l.phone}`}>{l.phone}</a>} />}
            {l.email && <Row k="E-mail" v={<a className="text-cognac" href={`mailto:${l.email}`}>{l.email}</a>} />}
            {l.region && <Row k="Регион" v={l.region} />}
            {l.material && <Row k="Материал" v={l.material} />}
            {l.volume && <Row k="Объём" v={l.volume} />}
            {l.purpose && <Row k="Цель" v={l.purpose} />}
            {l.notes && <Row k="Комментарий" v={l.notes} />}
          </dl>
        </div>
      ))}
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div><dt className="inline text-muted-foreground">{k}: </dt><dd className="inline">{v}</dd></div>
  );
}

function Products() {
  const q = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("sort_order");
      if (error) throw error;
      return data as Product[];
    },
  });
  const qc = useQueryClient();
  const add = async () => {
    const max = Math.max(0, ...(q.data ?? []).map((p) => p.sort_order));
    const { error } = await supabase.from("products").insert({ title: "Новый товар", sort_order: max + 1, visible: false });
    if (error) return void toast.error("Не удалось добавить");
    qc.invalidateQueries({ queryKey: ["admin-products"] });
  };
  if (q.isLoading) return <p className="mt-6 text-muted-foreground">Загрузка…</p>;
  if (q.error) return <p className="mt-6 text-destructive">Ошибка загрузки товаров</p>;
  return (
    <div className="mt-6 space-y-4">
      <Btn onClick={add}>+ Добавить товар</Btn>
      {q.data?.map((p) => <ProductEditor key={p.id} p={p} />)}
    </div>
  );
}

function ProductEditor({ p }: { p: Product }) {
  const qc = useQueryClient();
  const [f, setF] = useState(p);
  const [uploading, setUploading] = useState(false);
  useEffect(() => setF(p), [p]);
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-products"] });

  const save = async () => {
    if (!f.title.trim()) return void toast.error("Введите название");
    const { error } = await supabase.from("products").update({
      title: f.title.trim().slice(0, 120),
      text: f.text.trim().slice(0, 500),
      alt: f.alt.trim().slice(0, 200),
      sort_order: Number(f.sort_order) || 0,
      visible: f.visible,
      image_url: f.image_url,
    }).eq("id", p.id);
    if (error) return void toast.error("Не удалось сохранить");
    toast.success("Сохранено");
    refresh();
  };
  const remove = async () => {
    if (!confirm(`Удалить «${p.title}»?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) return void toast.error("Не удалось удалить");
    refresh();
  };
  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) return void toast.error("Выберите изображение");
    setUploading(true);
    const path = `${p.id}/${Date.now()}.${file.name.split(".").pop() || "jpg"}`;
    const up = await supabase.storage.from("product-images").upload(path, file);
    if (up.error) { setUploading(false); return void toast.error("Не удалось загрузить фото"); }
    const signed = await supabase.storage.from("product-images").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    setUploading(false);
    if (signed.error) return void toast.error("Не удалось получить ссылку на фото");
    setF((v) => ({ ...v, image_url: signed.data.signedUrl }));
    toast.success("Фото загружено — нажмите «Сохранить»");
  };

  return (
    <div className="grid gap-5 rounded-sm border border-border bg-card p-5 md:grid-cols-[180px_1fr]">
      <div className="space-y-2">
        <img src={productImage(f)} alt={f.alt} className="aspect-[4/3] w-full rounded-sm object-cover" />
        <label className="block cursor-pointer text-center text-xs text-cognac underline">
          {uploading ? "Загрузка…" : "Заменить фото"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        </label>
      </div>
      <div className="space-y-3">
        <input className={field} value={f.title} maxLength={120} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Название" />
        <textarea className={field} rows={2} value={f.text} maxLength={500} onChange={(e) => setF({ ...f, text: e.target.value })} placeholder="Описание" />
        <input className={field} value={f.alt} maxLength={200} onChange={(e) => setF({ ...f, alt: e.target.value })} placeholder="Подпись к фото (для поисковиков)" />
        <div className="flex flex-wrap items-center gap-5 text-sm">
          <label className="flex items-center gap-2">Порядок
            <input type="number" className={field + " w-20"} value={f.sort_order} onChange={(e) => setF({ ...f, sort_order: Number(e.target.value) })} />
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={f.visible} onChange={(e) => setF({ ...f, visible: e.target.checked })} />
            Показывать на сайте
          </label>
          <div className="ml-auto flex items-center gap-4">
            <button onClick={remove} className="text-destructive underline">Удалить</button>
            <Btn onClick={save} className="px-5 py-2.5">Сохранить</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

const settingFields: { key: keyof Settings; label: string; hint?: string }[] = [
  { key: "expert_name", label: "Имя в шапке и контактах" },
  { key: "expert_role", label: "Подпись под именем" },
  { key: "phone", label: "Телефон", hint: "Например: +7 918 123-45-67" },
  { key: "whatsapp", label: "Номер WhatsApp", hint: "Только цифры, например 79181234567" },
  { key: "telegram", label: "Telegram", hint: "Имя пользователя без @" },
  { key: "email", label: "E-mail" },
  { key: "geo", label: "География поставок" },
];

function SettingsForm() {
  const q = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
      if (error) throw error;
      return data as Settings;
    },
  });
  const [f, setF] = useState<Settings | null>(null);
  useEffect(() => { if (q.data) setF(q.data); }, [q.data]);
  if (!f) return <p className="mt-6 text-muted-foreground">Загрузка…</p>;

  const save = async () => {
    const { id: _id, updated_at: _u, ...rest } = f;
    const clean = Object.fromEntries(Object.entries(rest).map(([k, v]) => [k, String(v).trim().slice(0, 200)])) as Partial<Settings>;
    const { error } = await supabase.from("site_settings").update(clean).eq("id", 1);
    if (error) return void toast.error("Не удалось сохранить");
    toast.success("Сохранено — изменения уже на сайте");
  };

  return (
    <div className="mt-6 max-w-xl space-y-4 rounded-sm border border-border bg-card p-6">
      {settingFields.map((s) => (
        <label key={s.key} className="block space-y-1 text-sm">
          <span>{s.label}</span>
          <input className={field} value={String(f[s.key] ?? "")} onChange={(e) => setF({ ...f, [s.key]: e.target.value })} />
          {s.hint && <span className="text-xs text-muted-foreground">{s.hint}</span>}
        </label>
      ))}
      <Btn onClick={save}>Сохранить</Btn>
    </div>
  );
}
