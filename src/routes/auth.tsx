import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Acesso restrito — Julio Pizzaria" },
      { name: "description", content: "Área administrativa da Julio Pizzaria." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Acesso restrito — Julio Pizzaria" },
      { property: "og:description", content: "Área administrativa da Julio Pizzaria." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setMsg("E-mail ou senha inválidos.");
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setLoading(false);
      if (error) return setMsg(error.message);
      setMsg("Conta criada. Se pedir confirmação, verifique seu e-mail e depois faça login.");
      setMode("login");
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-border bg-card p-7 shadow-soft"
      >
        <h1 className="font-display text-2xl font-extrabold text-wine">
          Painel Julio Pizzaria
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login" ? "Entre com seu e-mail e senha." : "Cadastro único do dono."}
        </p>

        <label className="mt-5 block text-sm font-semibold" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-wine/40"
        />

        <label className="mt-4 block text-sm font-semibold" htmlFor="password">
          Senha
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-wine/40"
        />

        {msg && <p aria-live="polite" className="mt-3 text-sm text-destructive">{msg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 h-12 w-full rounded-full bg-gradient-ember font-bold text-primary-foreground shadow-soft disabled:opacity-60"
        >
          {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-3 w-full text-center text-xs text-muted-foreground underline"
        >
          {mode === "login" ? "Primeiro acesso? Criar conta" : "Já tenho conta"}
        </button>
      </form>
    </main>
  );
}
