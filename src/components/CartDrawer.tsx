import { ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/data/menu";
import { QtyControl } from "./PizzaBuilder";

export function CartDrawer() {
  const { open, setOpen, items, total, setQty, remove, clear, checkoutUrl } = useCart();

  if (!open) return null;

  const finalizar = () => {
    if (items.length === 0) return;
    window.open(checkoutUrl(), "_blank", "noopener,noreferrer");
    clear();
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <button
        aria-label="Fechar carrinho"
        className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-card shadow-lift">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="flex items-center gap-2 font-display text-xl font-extrabold text-wine">
            <ShoppingBag className="h-5 w-5" /> Seu pedido
          </h3>
          <button
            onClick={() => setOpen(false)}
            aria-label="Fechar"
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground/70 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="mt-16 text-center text-sm text-muted-foreground">
              Seu carrinho está vazio. Monte sua pizza no cardápio 🍕
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((i) => (
                <li key={i.id} className="rounded-2xl border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground">{i.name}</p>
                      <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                        {i.details.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                        {i.note && <li>Obs: {i.note}</li>}
                      </ul>
                    </div>
                    <button
                      onClick={() => remove(i.id)}
                      aria-label={`Remover ${i.name}`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <QtyControl value={i.qty} onChange={(v) => setQty(i.id, v)} />
                    <span className="font-display text-lg font-extrabold text-wine">
                      {formatBRL(i.unitPrice * i.qty)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-3 border-t border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total</span>
            <span className="font-display text-2xl font-extrabold text-wine">
              {formatBRL(total)}
            </span>
          </div>
          <button
            onClick={finalizar}
            disabled={items.length === 0}
            className="h-14 w-full rounded-full bg-whatsapp text-base font-bold text-cream shadow-soft transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            Finalizar Pedido pelo WhatsApp
          </button>
          {items.length > 0 && (
            <button
              onClick={clear}
              className="w-full text-center text-xs text-muted-foreground underline"
            >
              Limpar carrinho
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
