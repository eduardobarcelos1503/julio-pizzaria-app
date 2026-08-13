import { ShoppingBag } from "lucide-react";
import { WA_GENERAL } from "@/lib/pizzaria";
import { formatBRL } from "@/data/menu";
import { useCart } from "@/lib/cart";

export function MobileOrderBar() {
  const { count, total, setOpen } = useCart();

  if (count > 0) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-cream/10 bg-charcoal/95 p-3 backdrop-blur-md lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="flex h-14 w-full items-center justify-between rounded-full bg-whatsapp px-5 text-base font-bold tracking-tight text-cream shadow-lift transition-transform active:scale-[0.98]"
        >
          <span className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {count} {count === 1 ? "item" : "itens"}
          </span>
          <span>Ver pedido · {formatBRL(total)}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-cream/10 bg-charcoal/95 p-3 backdrop-blur-md lg:hidden">
      <a
        href={WA_GENERAL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-full items-center justify-center rounded-full bg-whatsapp text-base font-bold tracking-tight text-cream shadow-lift transition-transform active:scale-[0.98]"
      >
        🍕 PEDIR PELO WHATSAPP
      </a>
    </div>
  );
}
