import { useState } from "react";
import { MENU } from "@/data/menu";
import { whatsappLink } from "@/lib/pizzaria";
import { CtaLink } from "./CtaLink";
import { cn } from "@/lib/utils";

export function MenuSection() {
  const [active, setActive] = useState(MENU[0]!.id);
  const category = MENU.find((c) => c.id === active)!;

  return (
    <section id="cardapio" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Cardápio
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-wine sm:text-4xl lg:text-5xl">
            Nosso Cardápio
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Escolha seu sabor favorito e peça pelo WhatsApp.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Categorias do cardápio"
          className="mx-auto mt-8 flex max-w-full flex-wrap justify-center gap-2"
        >
          {MENU.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={active === c.id}
              onClick={() => setActive(c.id)}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200",
                active === c.id
                  ? "bg-wine text-wine-foreground shadow-soft"
                  : "border border-border bg-card text-foreground/70 hover:border-wine/30 hover:text-wine",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {category.items.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-xl font-bold text-wine">{item.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="font-display text-lg font-extrabold text-foreground">
                    {item.price}
                  </span>
                  <CtaLink
                    href={whatsappLink(`Olá! Gostaria de pedir a pizza ${item.name}.`)}
                    size="sm"
                    aria-label={`Pedir ${item.name} pelo WhatsApp`}
                  >
                    Pedir
                  </CtaLink>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Itens e preços em modo de edição — atualize em <code>src/data/menu.ts</code>.
        </p>
      </div>
    </section>
  );
}
