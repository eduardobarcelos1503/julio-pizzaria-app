import { WA_GENERAL } from "@/lib/pizzaria";

export function MobileOrderBar() {
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
