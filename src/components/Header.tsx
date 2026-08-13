import { useEffect, useState } from "react";
import { Menu, X, Pizza, ShoppingBag } from "lucide-react";
import { CtaLink } from "./CtaLink";
import { WA_GENERAL } from "@/lib/pizzaria";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/data/menu";
import { cn } from "@/lib/utils";


const links = [
  { href: "#inicio", label: "Início" },
  { href: "#cardapio", label: "Cardápio" },
  { href: "#sobre", label: "Sobre" },
  { href: "#avaliacoes", label: "Avaliações" },
  { href: "#localizacao", label: "Localização" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count, total, setOpen: setCartOpen } = useCart();


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "bg-wine/95 shadow-soft backdrop-blur-md" : "bg-gradient-to-b from-charcoal/70 to-transparent",
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:py-4">
        <a href="#inicio" className="flex min-w-0 items-center gap-2.5">
          {/* ESPAÇO RESERVADO PARA A LOGO OFICIAL:
              anexe a arte no chat e troque este bloco por
              <img src={logo} alt="Julio Pizzaria" className="h-11 w-11 rounded-full object-contain" /> */}
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-ember shadow-soft">
            <Pizza className="h-5 w-5 text-primary-foreground" strokeWidth={2.2} />
          </span>

          <span className="min-w-0">
            <span className="block truncate font-display text-lg font-extrabold leading-none text-cream">
              Julio Pizzaria
            </span>
            <span className="mt-0.5 block truncate text-[0.68rem] uppercase tracking-[0.18em] text-gold">
              Delivery de Pizza
            </span>
          </span>
        </a>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-cream/85 transition-colors hover:bg-cream/10 hover:text-cream"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <CtaLink href={WA_GENERAL} size="sm" className="hidden md:inline-flex">
            🍕 Pedir pelo WhatsApp
          </CtaLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream/10 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-cream/10 bg-wine/98 px-4 pb-5 pt-2 backdrop-blur-md lg:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-3 text-base font-medium text-cream/90 transition-colors hover:bg-cream/10"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
