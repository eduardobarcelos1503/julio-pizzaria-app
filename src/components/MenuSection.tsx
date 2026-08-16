import { useMemo, useState } from "react";
import { AlertTriangle, Loader2, Plus } from "lucide-react";
import { formatBRL, type PizzaCategory } from "@/data/menu";
import { useMenu } from "@/lib/menu-live";
import { useCart } from "@/lib/cart";
import { PizzaBuilder } from "./PizzaBuilder";
import { cn } from "@/lib/utils";

type TabId = string;

export function MenuSection() {
  const { data: menu, isLoading, isError } = useMenu();
  const [active, setActive] = useState<TabId>("tradicional");
  const [builderOpen, setBuilderOpen] = useState(false);
  const [builderCategory, setBuilderCategory] =
    useState<PizzaCategory["id"]>("tradicional");
  const { add, setOpen: setCartOpen } = useCart();

  const tabs = useMemo(
    () => [
      ...menu.categories.map((c) => ({ id: c.id as TabId, label: c.label })),
      { id: "bebidas", label: "Bebidas" },
      { id: "combos", label: "Combos" },
    ],
    [menu.categories],
  );

  const openBuilder = (id: PizzaCategory["id"]) => {
    setBuilderCategory(id);
    setBuilderOpen(true);
  };

  const pizzaCategory = menu.categories.find((c) => c.id === active);

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

        <div aria-live="polite">
          {isLoading && (
            <p className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Atualizando cardápio e preços...
            </p>
          )}
          {isError && (
            <p className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" /> Preços podem estar desatualizados.
              Recarregue em instantes.
            </p>
          )}
        </div>

        <div
          role="tablist"
          aria-label="Categorias do cardápio"
          className="mx-auto mt-8 flex max-w-full flex-wrap justify-center gap-2"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={active === t.id}
              onClick={() => setActive(t.id)}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine",
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
                  className="mt-6 h-14 w-full rounded-full bg-gradient-ember text-base font-bold text-primary-foreground shadow-soft transition-all hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
                >
                  🍕 Montar minha pizza
                </button>

                <p className="mt-4 text-xs text-muted-foreground">
                  {pizzaCategory.flavors.length} sabores disponíveis · borda recheada
                  opcional a partir de {formatBRL(menu.bordaPrices.broto)}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pizzaCategory.flavors.map((fl) => (
                <button
                  key={fl.id}
                  onClick={() => openBuilder(pizzaCategory.id)}
                  className="rounded-2xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-wine/30 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
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
            {menu.drinks.map((d) => (
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
                      className="h-11 rounded-full bg-whatsapp px-5 text-sm font-semibold text-cream shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
                    >
                      Adicionar ao carrinho
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
            {menu.combos.map((c) => (
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
                      {c.price === null ? (
                        <span className="text-base font-semibold text-muted-foreground">
                          Consulte no WhatsApp
                        </span>
                      ) : (
                        formatBRL(c.price)
                      )}
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
                      className="h-11 shrink-0 rounded-full bg-whatsapp px-5 text-sm font-semibold text-cream shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
                    >
                      Adicionar ao carrinho
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <PizzaBuilder
        open={builderOpen}
        onOpenChange={setBuilderOpen}
        initialCategoryId={builderCategory}
      />
    </section>
  );
}
