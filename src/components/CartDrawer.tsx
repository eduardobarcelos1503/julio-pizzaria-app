import { useEffect, useState } from "react";
import { Loader2, MapPin, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/data/menu";
import { QtyControl } from "./PizzaBuilder";
import { useDeliveryFee } from "@/lib/use-delivery-fee";

export function CartDrawer() {
  const { open, setOpen, items, total, setQty, remove, clear, checkoutUrl } = useCart();
  const [address, setAddress] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const delivery = useDeliveryFee(address);

  // Fecha com Escape (confirmação primeiro, depois o carrinho)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (confirmOpen) setConfirmOpen(false);
      else setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, confirmOpen, setOpen]);

  if (!open) return null;

  const fee = delivery.status === "success" && !delivery.foraDeArea ? delivery.fee : null;
  const foraDeArea = delivery.status === "success" && delivery.foraDeArea;
  const grandTotal = total + (fee ?? 0);
  const podeFinalizar = items.length > 0 && !foraDeArea && delivery.status !== "loading";

  const finalizar = () => {
    if (!podeFinalizar) return;
    setConfirmOpen(true); // não limpa o carrinho ainda
  };

  const confirmarPedido = () => {
    window.open(checkoutUrl({ address, fee }), "_blank", "noopener,noreferrer");
    clear();
    setAddress("");
    setConfirmOpen(false);
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <button
        aria-label="Fechar carrinho"
        className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <aside
        role="dialog"
        aria-label="Seu pedido"
        className="relative flex h-full w-full max-w-md flex-col bg-card shadow-lift"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="flex items-center gap-2 font-display text-xl font-extrabold text-wine">
            <ShoppingBag className="h-5 w-5" /> Seu pedido
          </h3>
          <button
            onClick={() => setOpen(false)}
            aria-label="Fechar"
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground/70 hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
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
            <>
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
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-destructive focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
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

              {/* Endereço de entrega + taxa */}
              <div className="mt-6 rounded-2xl border border-border p-4">
                <label
                  htmlFor="endereco-entrega"
                  className="flex items-center gap-2 text-sm font-semibold text-foreground"
                >
                  <MapPin className="h-4 w-4 text-primary" /> Endereço de entrega
                </label>
                <input
                  id="endereco-entrega"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, número, bairro"
                  autoComplete="street-address"
                  className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-wine/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
                />
                <div aria-live="polite" className="mt-2 min-h-5 text-xs">
                  {delivery.status === "idle" && (
                    <span className="text-muted-foreground">
                      Informe o endereço para calcularmos a taxa de entrega.
                    </span>
                  )}
                  {delivery.status === "loading" && (
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Calculando entrega...
                    </span>
                  )}
                  {delivery.status === "success" && !delivery.foraDeArea && (
                    <span className="font-semibold text-whatsapp">
                      Entregamos aí! {delivery.distanceKm.toFixed(1)} km
                      {delivery.durationMin ? ` · ~${delivery.durationMin} min de trajeto` : ""} ·
                      Frete {formatBRL(delivery.fee)}
                    </span>
                  )}
                  {foraDeArea && (
                    <span className="font-semibold text-destructive">
                      🛑 Não entregamos nesse endereço (acima de{" "}
                      {delivery.status === "success" ? delivery.maxKm : ""} km). Fale conosco no
                      WhatsApp.
                    </span>
                  )}
                  {(delivery.status === "error" || delivery.status === "blocked") && (
                    <span className="text-destructive">{delivery.message}</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="space-y-2 border-t border-border px-5 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-semibold text-foreground">{formatBRL(total)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Taxa de entrega</span>
            <span className="font-semibold text-foreground">
              {fee === null ? "a calcular" : formatBRL(fee)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-medium text-muted-foreground">Total</span>
            <span className="font-display text-2xl font-extrabold text-wine">
              {formatBRL(grandTotal)}
            </span>
          </div>
          <button
            onClick={finalizar}
            disabled={!podeFinalizar}
            className="h-14 w-full rounded-full bg-whatsapp text-base font-bold text-cream shadow-soft transition-transform active:scale-[0.98] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
          >
            {foraDeArea ? "Fora da área de entrega" : "Finalizar Pedido pelo WhatsApp"}
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

      {confirmOpen && (
        <div className="absolute inset-0 z-[90] grid place-items-center p-4">
          <button
            aria-label="Fechar confirmação"
            className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm"
            onClick={() => setConfirmOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Confirmar pedido"
            className="relative w-full max-w-sm rounded-3xl bg-card p-6 shadow-lift"
          >
            <h4 className="font-display text-xl font-extrabold text-wine">Confirmar pedido?</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Vamos abrir o WhatsApp com seu pedido pronto. Envie a mensagem para concluir.
            </p>
            <ul className="mt-4 max-h-40 space-y-1 overflow-y-auto text-sm text-foreground">
              {items.map((i) => (
                <li key={i.id} className="flex justify-between gap-3">
                  <span className="truncate">
                    {i.qty}× {i.name}
                  </span>
                  <span className="shrink-0 font-semibold">
                    {formatBRL(i.unitPrice * i.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Taxa de entrega</span>
                <span>{fee === null ? "a combinar" : formatBRL(fee)}</span>
              </div>
              <div className="flex justify-between font-display text-lg font-extrabold text-wine">
                <span>Total</span>
                <span>{formatBRL(grandTotal)}</span>
              </div>
              {address.trim() && (
                <p className="pt-1 text-xs text-muted-foreground">Entrega em: {address}</p>
              )}
            </div>
            <div className="mt-5 space-y-2">
              <button
                onClick={confirmarPedido}
                className="h-12 w-full rounded-full bg-whatsapp font-bold text-cream shadow-soft"
              >
                Confirmar pedido
              </button>
              <button
                onClick={() => setConfirmOpen(false)}
                className="h-11 w-full rounded-full border border-border font-semibold text-foreground/80 hover:bg-muted"
              >
                Continuar comprando
              </button>
            </div>
            <p className="mt-3 text-center text-[0.7rem] text-muted-foreground">
              Seu carrinho só é limpo depois que você confirmar.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
