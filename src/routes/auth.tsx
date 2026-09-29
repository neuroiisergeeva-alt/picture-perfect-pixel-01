import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Btn } from "@/components/landing/Btn";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Вход в админ-панель" },
      { name: "description", content: "Вход для администратора сайта." },
      { property: "og:title", content: "Вход в админ-панель" },
      { property: "og:description", content: "Вход для администратора сайта." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const field =
  "w-full rounded-sm border border-input bg-background px-4 py-3 text-sm focus:border-cognac focus:outline-none";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "up") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        setSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      }
    } catch (err) {
      const m = err instanceof Error ? err.message : "";
      toast.error(
        m.includes("Invalid login") ? "Неверный e-mail или пароль" :
        m.includes("not confirmed") ? "Подтвердите e-mail по ссылке из письма" :
        m || "Ошибка входа",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/60 px-5">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-sm bg-card p-8 shadow-soft">
        <p className="eyebrow">Админ-панель</p>
        <h1 className="font-display text-3xl">{mode === "in" ? "Вход" : "Регистрация"}</h1>
        {sent ? (
          <p className="text-sm text-muted-foreground">
            Мы отправили письмо на {email}. Перейдите по ссылке в нём, затем войдите.
          </p>
        ) : (
          <>
            <input className={field} type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className={field} type="password" required minLength={8} placeholder="Пароль (от 8 символов)" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Btn type="submit" className="w-full">{busy ? "Подождите…" : mode === "in" ? "Войти" : "Создать аккаунт"}</Btn>
          </>
        )}
        <button type="button" onClick={() => { setMode(mode === "in" ? "up" : "in"); setSent(false); }} className="text-sm text-cognac underline">
          {mode === "in" ? "Первый вход? Создать аккаунт" : "Уже есть аккаунт? Войти"}
        </button>
      </form>
    </main>
  );
}
