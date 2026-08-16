/* ============================================================================
 * CARDÁPIO AO VIVO (banco de dados)
 * ----------------------------------------------------------------------------
 * O cardápio agora vive no banco e é editável pelo painel /admin.
 * Os dados estáticos de src/data/menu.ts continuam servindo como FALLBACK
 * (primeira renderização / SSR / falha de rede), garantindo que o site nunca
 * fique sem cardápio.
 * ==========================================================================*/
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BEBIDAS,
  BORDAS,
  BORDA_PRECO_POR_TAMANHO,
  COMBOS,
  PIZZA_CATEGORIES,
  type Combo,
  type Drink,
  type Flavor,
  type PizzaCategory,
  type SizeId,
} from "@/data/menu";

export type MenuData = {
  categories: PizzaCategory[];
  bordas: { id: string; name: string }[];
  bordaPrices: Record<SizeId, number>;
  drinks: Drink[];
  combos: Combo[];
};

export const STATIC_MENU: MenuData = {
  categories: PIZZA_CATEGORIES,
  bordas: BORDAS,
  bordaPrices: BORDA_PRECO_POR_TAMANHO,
  drinks: BEBIDAS,
  combos: COMBOS,
};

const DRINK_IMAGES = Object.fromEntries(BEBIDAS.map((d) => [d.id, d.image]));
const COMBO_IMAGES = Object.fromEntries(COMBOS.map((c) => [c.id, c.image]));

const slug = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const LIST_BY_CATEGORY: Record<string, string> = {
  tradicional: "tradicional",
  promocional: "promocional",
  doce: "doce",
  premium: "tradicional",
};

const CATEGORY_IMAGE = Object.fromEntries(PIZZA_CATEGORIES.map((c) => [c.id, c.image]));

async function fetchMenu(): Promise<MenuData> {
  const sb = supabase as unknown as {
    from: (t: string) => {
      select: (c: string) => Promise<{ data: Record<string, unknown>[] | null }>;
    };
  };

  const [flavors, sizes, promo, borders, borderPrices, drinks, combos] = await Promise.all([
    sb.from("menu_flavors").select("*"),
    sb.from("menu_sizes").select("*"),
    sb.from("promo_prices").select("*"),
    sb.from("border_options").select("*"),
    sb.from("border_prices").select("*"),
    sb.from("drinks").select("*"),
    sb.from("combos").select("*"),
  ]);

  if (!sizes.data?.length || !flavors.data?.length) return STATIC_MENU;

  const num = (v: unknown) => Number(v ?? 0);
  const sortBy = (rows: Record<string, unknown>[]) =>
    [...rows].sort((a, b) => num(a["sort"]) - num(b["sort"]));

  const flavorsByList: Record<string, Flavor[]> = {};
  sortBy(flavors.data)
    .filter((r) => r["active"] !== false)
    .forEach((r) => {
      const list = String(r["list"]);
      (flavorsByList[list] ??= []).push({
        id: slug(String(r["name"])),
        name: String(r["name"]),
        description: String(r["description"] ?? ""),
      });
    });

  const priceByFlavorCount: Record<number, number> = {};
  (promo.data ?? []).forEach((r) => {
    priceByFlavorCount[num(r["flavor_count"])] = num(r["price"]);
  });

  const categoriesMap = new Map<string, PizzaCategory>();
  sortBy(sizes.data).forEach((r) => {
    const id = String(r["category_id"]) as PizzaCategory["id"];
    if (!categoriesMap.has(id)) {
      categoriesMap.set(id, {
        id,
        label: String(r["category_label"]),
        tagline: String(r["category_tagline"] ?? ""),
        image: CATEGORY_IMAGE[id] ?? PIZZA_CATEGORIES[0]!.image,
        sizes: [],
        flavors: flavorsByList[LIST_BY_CATEGORY[id] ?? "tradicional"] ?? [],
        ...(id === "promocional" ? { priceByFlavorCount } : {}),
      });
    }
    categoriesMap.get(id)!.sizes.push({
      id: String(r["size_id"]) as SizeId,
      label: String(r["label"]),
      slices: String(r["slices"] ?? ""),
      maxFlavors: num(r["max_flavors"]),
      price: num(r["price"]),
    });
  });

  const order = ["tradicional", "promocional", "doce", "premium"];
  const categories = [...categoriesMap.values()].sort(
    (a, b) => order.indexOf(a.id) - order.indexOf(b.id),
  );

  const bordaPrices = { ...BORDA_PRECO_POR_TAMANHO };
  (borderPrices.data ?? []).forEach((r) => {
    bordaPrices[String(r["size_id"]) as SizeId] = num(r["price"]);
  });

  return {
    categories,
    bordas: [
      { id: "sem", name: "Sem borda recheada" },
      ...sortBy(borders.data ?? [])
        .filter((r) => r["active"] !== false)
        .map((r) => ({ id: slug(String(r["name"])), name: String(r["name"]) })),
    ],
    bordaPrices,
    drinks: sortBy(drinks.data ?? [])
      .filter((r) => r["active"] !== false)
      .map((r) => ({
        id: String(r["id"]),
        name: String(r["name"]),
        price: num(r["price"]),
        image: DRINK_IMAGES[String(r["image_key"])] ?? BEBIDAS[0]!.image,
      })),
    combos: sortBy(combos.data ?? [])
      .filter((r) => r["active"] !== false)
      .map((r) => ({
        id: String(r["id"]),
        name: String(r["name"]),
        description: String(r["description"] ?? ""),
        price: r["price"] === null || r["price"] === undefined ? null : num(r["price"]),
        ...(r["old_price"] ? { oldPrice: num(r["old_price"]) } : {}),
        image: COMBO_IMAGES[String(r["image_key"])] ?? PIZZA_CATEGORIES[0]!.image,
      })),
  };
}

export function useMenu() {
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["menu"],
    queryFn: fetchMenu,
    initialData: STATIC_MENU,
    staleTime: 30_000,
  });
  return { data, isLoading: isLoading || isFetching, isError };
}

