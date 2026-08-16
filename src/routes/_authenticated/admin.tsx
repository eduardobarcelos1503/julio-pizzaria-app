import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { claimFirstAdmin } from "@/lib/admin.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Painel administrativo — Julio Pizzaria" },
      {
        name: "description",
        content: "Edite cardápio, preços, bordas, bebidas, combos e taxa de entrega.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Painel administrativo — Julio Pizzaria" },
      {
        property: "og:description",
        content: "Área restrita de gestão do cardápio da Julio Pizzaria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Field = { key: string; label: string; type: "text" | "number" | "bool" };

type TableDef = {
  id: string;
  label: string;
  table: string;
  pk: string;
  fields: Field[];
  canCreate?: boolean;
  orderBy?: string;
};

const TABLES: TableDef[] = [
  {
    id: "flavors",
    label: "Sabores",
    table: "menu_flavors",
    pk: "id",
    orderBy: "sort",
    canCreate: true,
    fields: [
      { key: "list", label: "Lista (tradicional/promocional/doce)", type: "text" },
      { key: "name", label: "Nome", type: "text" },
      { key: "description", label: "Descrição", type: "text" },
      { key: "sort", label: "Ordem", type: "number" },
      { key: "active", label: "Ativo", type: "bool" },
    ],
  },
  {
    id: "sizes",
    label: "Tamanhos e preços",
    table: "menu_sizes",
    pk: "id",
    orderBy: "sort",
    canCreate: true,
    fields: [
      { key: "category_id", label: "Linha (id)", type: "text" },
      { key: "category_label", label: "Linha (nome)", type: "text" },
      { key: "category_tagline", label: "Descrição da linha", type: "text" },
      { key: "size_id", label: "Tamanho (id)", type: "text" },
      { key: "label", label: "Tamanho (nome)", type: "text" },
      { key: "slices", label: "Fatias", type: "text" },
      { key: "max_flavors", label: "Máx. sabores", type: "number" },
      { key: "price", label: "Preço", type: "number" },
      { key: "sort", label: "Ordem", type: "number" },
    ],
  },
  {
    id: "promo",
    label: "Preços promocionais",
    table: "promo_prices",
    pk: "flavor_count",
    orderBy: "flavor_count",
    fields: [
      { key: "flavor_count", label: "Qtd. sabores", type: "number" },
      { key: "price", label: "Preço", type: "number" },
    ],
  },
  {
    id: "borders",
    label: "Bordas recheadas",
    table: "border_options",
    pk: "id",
    orderBy: "sort",
    canCreate: true,
    fields: [
      { key: "name", label: "Nome", type: "text" },
      { key: "sort", label: "Ordem", type: "number" },
      { key: "active", label: "Ativa", type: "bool" },
    ],
  },
  {
    id: "border_prices",
    label: "Preço da borda por tamanho",
    table: "border_prices",
    pk: "size_id",
    orderBy: "size_id",
    fields: [
      { key: "size_id", label: "Tamanho", type: "text" },
      { key: "price", label: "Acréscimo", type: "number" },
    ],
  },
  {
    id: "drinks",
    label: "Bebidas",
    table: "drinks",
    pk: "id",
    orderBy: "sort",
    canCreate: true,
    fields: [
      { key: "name", label: "Nome", type: "text" },
      { key: "price", label: "Preço", type: "number" },
      { key: "image_key", label: "Imagem (chave)", type: "text" },
      { key: "sort", label: "Ordem", type: "number" },
      { key: "active", label: "Ativa", type: "bool" },
    ],
  },
  {
    id: "combos",
    label: "Combos",
    table: "combos",
    pk: "id",
    orderBy: "sort",
    canCreate: true,
    fields: [
      { key: "name", label: "Nome", type: "text" },
      { key: "description", label: "Descrição", type: "text" },
      { key: "price", label: "Preço", type: "number" },
      { key: "old_price", label: "Preço antigo", type: "number" },
      { key: "image_key", label: "Imagem (chave)", type: "text" },
      { key: "sort", label: "Ordem", type: "number" },
      { key: "active", label: "Ativo", type: "bool" },
    ],
  },
  {
    id: "delivery_settings",
    label: "Entrega — regras",
    table: "delivery_settings",
    pk: "id",
    fields: [
      { key: "mode", label: "Modo (tiers ou per_km)", type: "text" },
      { key: "base_fee", label: "Taxa base (R$)", type: "number" },
      { key: "per_km", label: "R$ por km", type: "number" },
      { key: "max_km", label: "Raio máximo (km)", type: "number" },
    ],
  },
  {
    id: "delivery_tiers",
    label: "Entrega — faixas de km",
    table: "delivery_tiers",
    pk: "id",
    orderBy: "up_to_km",
    canCreate: true,
    fields: [
      { key: "up_to_km", label: "Até (km)", type: "number" },
      { key: "fee", label: "Taxa (R$)", type: "number" },
    ],
  },
];

type Row = Record<string, unknown>;

const db = supabase as unknown as {
  from: (t: string) => any;
};

function AdminPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [claimMsg, setClaimMsg] = useState<string | null>(null);
  const [tab, setTab] = useState(TABLES[0]!.id);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("role", "admin");
      setIsAdmin((data?.length ?? 0) > 0);
    })();
  }, []);

  const sair = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (isAdmin === null) {
    return <p className="p-10 text-center text-muted-foreground">Carregando painel...</p>;
  }

  if (!isAdmin) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-4">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-7 text-center shadow-soft">
          <h1 className="font-display text-2xl font-extrabold text-wine">Acesso restrito</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sua conta ainda não é administradora. Se este é o primeiro acesso do dono, use o
            botão abaixo (funciona uma única vez).
          </p>
          <button
            onClick={async () => {
              const res = await claimFirstAdmin({ data: undefined } as never);
              if (res.ok) window.location.reload();
              else setClaimMsg(res.error);
            }}
            className="mt-5 h-12 w-full rounded-full bg-gradient-ember font-bold text-primary-foreground"
          >
            Tornar esta conta administradora
          </button>
          {claimMsg && <p className="mt-3 text-sm text-destructive">{claimMsg}</p>}
          <button onClick={sair} className="mt-4 text-xs text-muted-foreground underline">
            Sair
          </button>
        </div>
      </main>
    );
  }

  const current = TABLES.find((t) => t.id === tab)!;

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-extrabold text-wine">
            Painel do cardápio
          </h1>
          <button
            onClick={sair}
            className="h-10 rounded-full border border-border px-4 text-sm font-semibold hover:bg-muted"
          >
            Sair
          </button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          As alterações aparecem no site em até 30 segundos, sem novo deploy. Valores de
          entrega são <strong>exemplos</strong> — confirme com o dono.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {TABLES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold",
                t.id === tab
                  ? "bg-wine text-wine-foreground"
                  : "border border-border bg-card text-foreground/70 hover:border-wine/30",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <TableEditor key={current.id} def={current} />
      </div>
    </main>
  );
}

function TableEditor({ def }: { def: TableDef }) {
  const qc = useQueryClient();
  const [status, setStatus] = useState<string | null>(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", def.table],
    queryFn: async () => {
      let q = db.from(def.table).select("*");
      if (def.orderBy) q = q.order(def.orderBy);
      const { data } = await q;
      return (data ?? []) as Row[];
    },
  });

  const refresh = async () => {
    await qc.invalidateQueries({ queryKey: ["admin", def.table] });
    await qc.invalidateQueries({ queryKey: ["menu"] });
  };

  const save = async (row: Row, patch: Row) => {
    setStatus("Salvando...");
    const { error } = await db
      .from(def.table)
      .update(patch)
      .eq(def.pk, row[def.pk] as string | number);
    setStatus(error ? `Erro: ${error.message}` : "Salvo ✓");
    await refresh();
  };

  const remove = async (row: Row) => {
    if (!confirm("Remover este item?")) return;
    const { error } = await db
      .from(def.table)
      .delete()
      .eq(def.pk, row[def.pk] as string | number);
    setStatus(error ? `Erro: ${error.message}` : "Removido ✓");
    await refresh();
  };

  const create = async () => {
    const blank: Row = {};
    def.fields.forEach((f) => {
      if (f.key === def.pk) return;
      blank[f.key] = f.type === "number" ? 0 : f.type === "bool" ? true : "Novo";
    });
    const { error } = await db.from(def.table).insert(blank);
    setStatus(error ? `Erro: ${error.message}` : "Criado ✓");
    await refresh();
  };

  return (
    <section className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-wine">{def.label}</h2>
        <div className="flex items-center gap-3">
          <span aria-live="polite" className="text-xs text-muted-foreground">
            {status}
          </span>
          {def.canCreate && (
            <button
              onClick={create}
              className="h-10 rounded-full bg-gradient-ember px-4 text-sm font-bold text-primary-foreground"
            >
              + Adicionar
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <p className="mt-5 text-sm text-muted-foreground">Carregando...</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {rows.map((row, idx) => (
            <RowEditor
              key={String(row[def.pk] ?? idx)}
              def={def}
              row={row}
              onSave={(patch) => save(row, patch)}
              onDelete={() => remove(row)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function RowEditor({
  def,
  row,
  onSave,
  onDelete,
}: {
  def: TableDef;
  row: Row;
  onSave: (patch: Row) => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState<Row>(row);
  useEffect(() => setDraft(row), [row]);

  return (
    <li className="rounded-2xl border border-border p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {def.fields.map((f) => (
          <label key={f.key} className="block text-xs font-semibold text-muted-foreground">
            {f.label}
            {f.type === "bool" ? (
              <input
                type="checkbox"
                checked={draft[f.key] !== false}
                onChange={(e) => setDraft({ ...draft, [f.key]: e.target.checked })}
                className="ml-2 h-4 w-4 align-middle"
              />
            ) : (
              <input
                type={f.type === "number" ? "number" : "text"}
                step="0.01"
                value={String(draft[f.key] ?? "")}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    [f.key]:
                      f.type === "number"
                        ? e.target.value === ""
                          ? null
                          : Number(e.target.value)
                        : e.target.value,
                  })
                }
                className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-normal text-foreground outline-none focus:border-wine/40"
              />
            )}
          </label>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => {
            const patch: Row = {};
            def.fields.forEach((f) => {
              if (f.key !== def.pk) patch[f.key] = draft[f.key];
            });
            onSave(patch);
          }}
          className="h-10 rounded-full bg-wine px-5 text-sm font-semibold text-wine-foreground"
        >
          Salvar
        </button>
        {def.canCreate && (
          <button
            onClick={onDelete}
            className="h-10 rounded-full border border-destructive/40 px-5 text-sm font-semibold text-destructive"
          >
            Remover
          </button>
        )}
      </div>
    </li>
  );
}
