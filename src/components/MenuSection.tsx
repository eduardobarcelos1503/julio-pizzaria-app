import { useState } from "react";
import { Plus } from "lucide-react";
import {
  BEBIDAS,
  COMBOS,
  PIZZA_CATEGORIES,
  formatBRL,
  type PizzaCategory,
} from "@/data/menu";
import { useCart } from "@/lib/cart";
import { PizzaBuilder } from "./PizzaBuilder";
import { cn } from "@/lib/utils";

type TabId = PizzaCategory["id"] | "bebidas" | "combos";

const TABS: { id: TabId; label: string }[] = [
  ...PIZZA_CATEGORIES.map((c) => ({ id: c.id as TabId, label: c.label })),
  { id: "bebidas", label: "Bebidas" },
  { id: "combos", label: "Combos" },
];

export function MenuSection() {
  const [active, setActive] = useState<TabId>("tradicional");
  const [builderOpen, setBuilderOpen] = useState(false);
  const [builderCategory, setBuilderCategory] =
    useState<PizzaCategory["id"]>("tradicional");
  const { add, setOpen: setCartOpen } = useCart();

  const openBuilder = (id: PizzaCategory["id"]) => {
    setBuilderCategory(id);
    setBuilderOpen(true);
  };

  const pizzaCategory = PIZZA_CATEGORIES.find((c) => c.id === active);

  return (
    <section id="cardapio" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Cardápio interativo
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-wine sm:text-4xl lg:text-5xl">
            Monte seu pedido
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Escolha tamanho, sabores e borda, junte tudo no carrinho e finalize pelo
            WhatsApp.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Categorias do cardápio"
          className="mx-auto mt-8 flex max-w-full flex-wrap justify-center gap-2"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={active === t.id}
              onClick={() => setActive(t.id)}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200",
                active === t.id
                  ? "bg-wine text-wine-foreground shadow-soft"
                  : "border border-border bg-card text-foreground/70 hover:border-wine/30 hover:text-wine",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* PIZZAS */}
        {pizzaCategory && (
          <div className="mt-10">
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft lg:grid lg:grid-cols-[1fr_1.2fr]">
              <img
                src={pizzaCategory.image}
                alt={pizzaCategory.label}
                loading="lazy"
                className="h-56 w-full object-cover lg:h-full"
              />
              <div className="p-6 sm:p-8">
                <h3 className="font-display text-2xl font-extrabold text-wine">
                  {pizzaCategory.label}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {pizzaCategory.tagline}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {pizzaCategory.sizes.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-2xl border border-border p-4 transition-colors hover:border-wine/30"
                    >
                      <p className="font-display text-lg font-bold text-foreground">
                        {s.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {s.slices} · até {s.maxFlavors}{" "}
                        {s.maxFlavors > 1 ? "sabores" : "sabor"}
                      </p>
                      <p className="mt-2 font-display text-xl font-extrabold text-wine">
                        {pizzaCategory.priceByFlavorCount
                          ? `${formatBRL(pizzaCategory.priceByFlavorCount[1]!)} (1 sabor) · ${formatBRL(pizzaCategory.priceByFlavorCount[2]!)} (2 sabores)`
                          : formatBRL(s.price)}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => openBuilder(pizzaCategory.id)}
                  className="mt-6 h-14 w-full rounded-full bg-gradient-ember text-base font-bold text-primary-foreground shadow-soft transition-all hover:shadow-lift"
                >
                  🍕 Montar minha pizza
                </button>

                <p className="mt-4 text-xs text-muted-foreground">
                  {pizzaCategory.flavors.length} sabores disponíveis · borda recheada
                  opcional a partir de R$ 10,00
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pizzaCategory.flavors.map((fl) => (
                <button
                  key={fl.id}
                  onClick={() => openBuilder(pizzaCategory.id)}
                  className="rounded-2xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-wine/30 hover:shadow-soft"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-display text-base font-bold text-wine">
                      {fl.name}
                    </span>
                    <Plus className="h-4 w-4 shrink-0 text-primary" />
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    {fl.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* BEBIDAS */}
        {active === "bebidas" && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BEBIDAS.map((d) => (
              <article
                key={d.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={d.image}
                    alt={d.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl font-bold text-wine">{d.name}</h3>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="font-display text-lg font-extrabold text-foreground">
                      {formatBRL(d.price)}
                    </span>
                    <button
                      onClick={() => {
                        add({ name: d.name, details: [], unitPrice: d.price, qty: 1 });
                        setCartOpen(true);
                      }}
                      className="h-10 rounded-full bg-whatsapp px-4 text-sm font-semibold text-cream shadow-soft"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* COMBOS */}
        {active === "combos" && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {COMBOS.map((c) => (
              <article
                key={c.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl font-bold text-wine">{c.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="font-display text-lg font-extrabold text-foreground">
                      {c.oldPrice && (
                        <span className="mr-2 text-sm font-medium text-muted-foreground line-through">
                          {formatBRL(c.oldPrice)}
                        </span>
                      )}
                      {c.price === null ? "Promoção" : formatBRL(c.price)}
                    </span>
                    <button
                      onClick={() => {
                        add({
                          name: c.name,
                          details: [c.description],
                          unitPrice: c.price ?? 0,
                          qty: 1,
                        });
                        setCartOpen(true);
                      }}
                      className="h-10 rounded-full bg-whatsapp px-4 text-sm font-semibold text-cream shadow-soft"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Sabores e preços podem ser atualizados em <code>src/data/menu.ts</code>.
        </p>
      </div>

      <PizzaBuilder
        open={builderOpen}
        onOpenChange={setBuilderOpen}
        initialCategoryId={builderCategory}
      />
    </section>
  );
}
