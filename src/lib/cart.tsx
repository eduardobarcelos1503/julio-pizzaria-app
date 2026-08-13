import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { BUSINESS } from "@/lib/pizzaria";
import { formatBRL } from "@/data/menu";

export type CartItem = {
  id: string;
  name: string;
  /** Linhas de personalização (tamanho, sabores, borda) */
  details: string[];
  note?: string;
  unitPrice: number;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: Omit<CartItem, "id">) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  checkoutUrl: () => string;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

    const checkoutUrl = () => {
      const lines: string[] = ["*NOVO PEDIDO — Julio Pizzaria* 🍕", ""];
      items.forEach((i, idx) => {
        lines.push(`*${idx + 1}. ${i.name}* (x${i.qty}) — ${formatBRL(i.unitPrice * i.qty)}`);
        i.details.forEach((d) => lines.push(`   • ${d}`));
        if (i.note) lines.push(`   • Obs: ${i.note}`);
      });
      lines.push("", `*TOTAL: ${formatBRL(total)}*`, "", "Endereço para entrega: ");
      return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
    };

    return {
      items,
      count,
      total,
      open,
      setOpen,
      add: (item) =>
        setItems((prev) => [
          ...prev,
          { ...item, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
        ]),
      setQty: (id, qty) =>
        setItems((prev) =>
          prev.flatMap((i) => (i.id === id ? (qty <= 0 ? [] : [{ ...i, qty }]) : [i])),
        ),
      remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      clear: () => setItems([]),
      checkoutUrl,
    };
  }, [items, open]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}
