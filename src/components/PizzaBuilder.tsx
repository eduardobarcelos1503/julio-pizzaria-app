import { useEffect, useMemo, useState } from "react";
import { Check, Minus, Plus, Search, X } from "lucide-react";
import {
  BORDAS,
  BORDA_PRECO_POR_TAMANHO,
  PIZZA_CATEGORIES,
  formatBRL,
  type PizzaCategory,
} from "@/data/menu";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

const CART_LABEL: Record<PizzaCategory["id"], string> = {
  tradicional: "Pizza Tradicional",
  promocional: "Pizza Promocional",
  doce: "Pizza Doce",
  premium: "Pizza Premium (até 4 sabores)",
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialCategoryId?: PizzaCategory["id"];
};

export function PizzaBuilder({ open, onOpenChange, initialCategoryId }: Props) {
  const { add, setOpen: setCartOpen } = useCart();

  const [categoryId, setCategoryId] = useState<PizzaCategory["id"]>(
    initialCategoryId ?? "tradicional",
  );
  const [sizeId, setSizeId] = useState<string>("");
  const [flavors, setFlavors] = useState<string[]>([]);
  const [borda, setBorda] = useState("sem");
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");

  const category = PIZZA_CATEGORIES.find((c) => c.id === categoryId)!;
  const size = category.sizes.find((s) => s.id === sizeId) ?? category.sizes[0]!;

  // reset ao abrir / trocar categoria
  useEffect(() => {
    if (open) {
      setCategoryId(initialCategoryId ?? "tradicional");
    }
  }, [open, initialCategoryId]);

  useEffect(() => {
    setSizeId(category.sizes[0]!.id);
    setFlavors([]);
    setBorda("sem");
    setQty(1);
    setNote("");
    setSearch("");
  }, [categoryId]);

  useEffect(() => {
    setFlavors((prev) => prev.slice(0, size.maxFlavors));
  }, [sizeId]);

  const bordaPrice = borda === "sem" ? 0 : BORDA_PRECO_POR_TAMANHO[size.id];

  const basePrice = useMemo(() => {
    if (category.priceByFlavorCount) {
      const n = Math.max(1, flavors.length) as 1 | 2;
      return category.priceByFlavorCount[n] ?? size.price;
    }
    return size.price;
  }, [category, flavors.length, size]);

  const unitPrice = basePrice + bordaPrice;
  const total = unitPrice * qty;

  const filtered = useMemo(() => {
    const q = search
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (!q) return category.flavors;
    return category.flavors.filter((fl) =>
      fl.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(q),
    );
  }, [category, search]);

  const toggleFlavor = (id: string) => {
    setFlavors((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= size.maxFlavors) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  if (!open) return null;

  const flavorNames = flavors.map(
    (id) => category.flavors.find((fl) => fl.id === id)?.name ?? id,
  );
  const bordaName = BORDAS.find((b) => b.id === borda)!.name;

  const handleAdd = () => {
    if (flavors.length === 0) return;
    add({
      name: `${CART_LABEL[category.id]} — ${flavorNames.join(" / ")}`,
      details: [
        `Tamanho: ${size.label} (${size.slices})`,
        `Sabores: ${flavorNames.join(", ")}`,
        borda === "sem"
          ? "Sem borda recheada"
          : `Borda: ${bordaName} (+${formatBRL(bordaPrice)})`,
      ],
      note: note.trim() || undefined,
      unitPrice,
      qty,
    });
    onOpenChange(false);
    setCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <button
        aria-label="Fechar"
        className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-card shadow-lift sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="font-display text-xl font-extrabold text-wine">Monte sua pizza</h3>
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Fechar"
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground/70 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          {/* 1. Categoria */}
          <Step n={1} title="Escolha a linha">
            <div className="flex flex-wrap gap-2">
              {PIZZA_CATEGORIES.map((c) => (
                <Chip
                  key={c.id}
                  active={c.id === categoryId}
                  onClick={() => setCategoryId(c.id)}
                >
                  {c.label}
                </Chip>
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{category.tagline}</p>
          </Step>

          {/* 2. Tamanho */}
          <Step n={2} title="Tamanho">
            <div className="flex flex-wrap gap-2">
              {category.sizes.map((s) => (
                <Chip key={s.id} active={s.id === size.id} onClick={() => setSizeId(s.id)}>
                  {s.label} · {s.slices} · até {s.maxFlavors}{" "}
                  {s.maxFlavors > 1 ? "sabores" : "sabor"}
                </Chip>
              ))}
            </div>
          </Step>

          {/* 3. Sabores */}
          <Step
            n={3}
            title={`Sabores (${flavors.length}/${size.maxFlavors})`}
          >
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar sabor..."
                className="h-11 w-full rounded-full border border-border bg-background pl-9 pr-4 text-sm outline-none focus:border-wine/40"
              />
            </div>
            <div className="grid max-h-64 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
              {filtered.map((fl) => {
                const active = flavors.includes(fl.id);
                return (
                  <button
                    key={fl.id}
                    onClick={() => toggleFlavor(fl.id)}
                    className={cn(
                      "rounded-2xl border p-3 text-left transition-colors",
                      active
                        ? "border-wine bg-wine/5"
                        : "border-border hover:border-wine/30",
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground">{fl.name}</span>
                      {active && <Check className="h-4 w-4 shrink-0 text-wine" />}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                      {fl.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </Step>

          {/* 4. Borda */}
          <Step n={4} title="Borda recheada (opcional)">
            <div className="flex flex-wrap gap-2">
              {BORDAS.map((b) => (
                <Chip key={b.id} active={b.id === borda} onClick={() => setBorda(b.id)}>
                  {b.name}
                  {b.id !== "sem" && ` +${formatBRL(BORDA_PRECO_POR_TAMANHO[size.id])}`}
                </Chip>
              ))}
            </div>
          </Step>

          {/* 5. Quantidade + 6. Observação */}
          <Step n={5} title="Quantidade e observação">
            <div className="flex items-center gap-3">
              <QtyControl value={qty} onChange={setQty} />
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Observação (ex: sem cebola, bem assada...)"
              className="mt-3 w-full rounded-2xl border border-border bg-background p-3 text-sm outline-none focus:border-wine/40"
            />
          </Step>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border bg-card px-5 py-4">
          <div>
            <span className="block text-xs uppercase tracking-wider text-muted-foreground">
              Total
            </span>
            <span className="font-display text-2xl font-extrabold text-wine">
              {formatBRL(total)}
            </span>
          </div>
          <button
            onClick={handleAdd}
            disabled={flavors.length === 0}
            className="h-12 flex-1 rounded-full bg-gradient-ember px-6 font-semibold text-primary-foreground shadow-soft transition-all hover:shadow-lift disabled:opacity-50 sm:flex-none sm:px-10"
          >
            {flavors.length === 0 ? "Escolha o sabor" : "Adicionar ao carrinho"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 flex items-center gap-2 font-display text-base font-bold text-foreground">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-wine text-xs text-wine-foreground">
          {n}
        </span>
        {title}
      </h4>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-semibold transition-all",
        active
          ? "bg-wine text-wine-foreground shadow-soft"
          : "border border-border bg-background text-foreground/70 hover:border-wine/30 hover:text-wine",
      )}
    >
      {children}
    </button>
  );
}

export function QtyControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border p-1">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label="Diminuir"
        className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center text-sm font-bold">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        aria-label="Aumentar"
        className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
