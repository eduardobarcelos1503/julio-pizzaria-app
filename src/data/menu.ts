import pizza1 from "@/assets/pizza-1.jpg";
import pizza2 from "@/assets/pizza-2.jpg";
import pizza3 from "@/assets/pizza-3.jpg";
import pizza4 from "@/assets/pizza-4.jpg";
import bebidaCoca from "@/assets/bebida-coca.jpg";
import bebidaGuarana from "@/assets/bebida-guarana.jpg";
import bebidaSuco from "@/assets/bebida-suco.jpg";

/* ============================================================================
 * CARDÁPIO JULIO PIZZARIA — ARQUIVO CENTRAL DE EDIÇÃO
 * ----------------------------------------------------------------------------
 * TUDO que é preço, sabor, bebida, borda e combo está NESTE arquivo.
 * Para atualizar o site basta mudar os textos/números abaixo.
 *
 * REGRAS DE PREÇO (resumo):
 *  1. Pizza TRADICIONAL: preço fixo por TAMANHO (não muda com o sabor).
 *     Broto = 1 sabor | Média = até 2 sabores | Grande = até 3 sabores.
 *  2. Pizza PROMOCIONAL: linha mais barata, só tamanho Grande (8 fatias),
 *     lista FECHADA de sabores. Preço muda pela QUANTIDADE de sabores
 *     (1 sabor = R$ 28,90 / 2 sabores meio a meio = R$ 32,90).
 *  3. Pizza DOCE: preços próprios por tamanho.
 *  4. MONTE SUA PIZZA PREMIUM: tamanho único (equivale a Grande/8 fatias),
 *     até 4 sabores da lista TRADICIONAL, preço fixo R$ 49,90.
 *  5. BORDA RECHEADA: opcional, acréscimo que varia pelo TAMANHO da pizza.
 *     Padrão sempre "Sem borda recheada" (R$ 0,00).
 *
 * OBS: as descrições de ingredientes dos sabores tradicionais são
 * APROXIMADAS (geradas a partir do nome) — confirmar com o dono.
 * ==========================================================================*/

export type SizeId = "broto" | "media" | "grande" | "unico";

export type Flavor = {
  id: string;
  name: string;
  description: string;
};

export type PizzaSize = {
  id: SizeId;
  label: string; // ex: "Grande"
  slices: string; // ex: "8 pedaços"
  maxFlavors: number; // limite de sabores permitido nesse tamanho
  price: number; // preço em reais (só para tradicional/doce/premium)
};

export type PizzaCategory = {
  id: "tradicional" | "promocional" | "doce" | "premium";
  label: string;
  tagline: string;
  image: string;
  sizes: PizzaSize[];
  flavors: Flavor[];
  /** Usado só na linha PROMOCIONAL: preço por quantidade de sabores. */
  priceByFlavorCount?: Record<number, number>;
};

// helper interno: cria o id a partir do nome (não precisa editar)
const f = (name: string, description: string): Flavor => ({
  id: name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, ""),
  name,
  description,
});

const BASE = "Molho de tomate, muçarela";

/* ---------------------------------------------------------------------------
 * SABORES TRADICIONAIS (mesma lista e mesmo preço para qualquer tamanho)
 * -------------------------------------------------------------------------*/
export const SABORES_TRADICIONAIS: Flavor[] = [
  f("Chedabresa", `${BASE}, calabresa, cheddar cremoso e orégano`),
  f("Calabresa Bacon", `${BASE}, calabresa, bacon crocante e orégano`),
  f("Calabresa Especial", `${BASE}, calabresa, cebola, azeitona e orégano`),
  f("Calabresa Suprema", `${BASE}, calabresa, bacon, cebola e requeijão cremoso`),
  f("Catubresa Bacon", `${BASE}, calabresa, requeijão cremoso e bacon`),
  f("Catubresa Cheddar", `${BASE}, calabresa, requeijão cremoso e cheddar`),
  f("Bacon Cheddar", `${BASE}, bacon crocante e cheddar cremoso`),
  f("Bacon Cremoso", `${BASE}, bacon crocante e requeijão cremoso`),
  f("Bacon Catupiry", `${BASE}, bacon crocante e catupiry`),
  f("Bacon com Milho", `${BASE}, bacon crocante, milho verde e orégano`),
  f("Brócolis com Bacon Especial", `${BASE}, brócolis, bacon, alho frito e requeijão`),
  f("Frango Cheddar", `${BASE}, frango desfiado e cheddar cremoso`),
  f("Frango com Bacon", `${BASE}, frango desfiado e bacon crocante`),
  f("Frango com Milho e Bacon", `${BASE}, frango desfiado, milho verde e bacon`),
  f("Frango com Brócolis", `${BASE}, frango desfiado, brócolis e alho`),
  f("Frango com Palmito", `${BASE}, frango desfiado e palmito`),
  f("Frango Especial", `${BASE}, frango desfiado, requeijão cremoso e azeitona`),
  f("Palmito Cremoso", `${BASE}, palmito e requeijão cremoso`),
  f("Palmito com Brócolis", `${BASE}, palmito, brócolis e alho frito`),
  f("Brócolis Cheddar", `${BASE}, brócolis, alho e cheddar cremoso`),
  f("Brócolis Cremoso", `${BASE}, brócolis, alho e requeijão cremoso`),
  f("Brócolis Catupiry", `${BASE}, brócolis, alho e catupiry`),
  f("Milho Cheddar", `${BASE}, milho verde e cheddar cremoso`),
  f("Milho Cremoso", `${BASE}, milho verde e requeijão cremoso`),
  f("Milho Catupiry", `${BASE}, milho verde e catupiry`),
  f("Napolitana Bacon", `${BASE}, tomate, parmesão, bacon e orégano`),
  f("Napolitana Cremosa", `${BASE}, tomate, parmesão e requeijão cremoso`),
  f("Portuguesa Especial", `${BASE}, presunto, ovo, cebola, ervilha e azeitona`),
  f("Portuguesa Cheddar", `${BASE}, presunto, ovo, cebola, azeitona e cheddar`),
  f("Romana Bacon", `${BASE}, presunto, tomate, bacon e orégano`),
  f("Romana Cheddar", `${BASE}, presunto, tomate e cheddar cremoso`),
  f("Mexicana Cheddar", `${BASE}, carne temperada, pimenta e cheddar cremoso`),
  f("Mexicana Catupiry", `${BASE}, carne temperada, pimenta e catupiry`),
  f("Mexicana Suprema", `${BASE}, carne temperada, pimenta, bacon e cheddar`),
  f("Frango Supremo", `${BASE}, frango desfiado, bacon, cheddar e requeijão`),
  f("Lombo Cheddar", `${BASE}, lombo canadense e cheddar cremoso`),
  f("Lombo com Bacon", `${BASE}, lombo canadense e bacon crocante`),
  f("Lombo Cremoso", `${BASE}, lombo canadense e requeijão cremoso`),
  f("Lombo Especial", `${BASE}, lombo canadense, cebola, azeitona e orégano`),
  f("Lombo com Milho", `${BASE}, lombo canadense e milho verde`),
  f("Toscana Bacon", `${BASE}, linguiça toscana e bacon crocante`),
  f("Toscana Catupiry", `${BASE}, linguiça toscana e catupiry`),
  f("Toscana Cheddar", `${BASE}, linguiça toscana e cheddar cremoso`),
  f("Toscana Especial", `${BASE}, linguiça toscana, cebola e requeijão cremoso`),
  f("Pepper Cheddar", `${BASE}, pepperoni e cheddar cremoso`),
  f("Pepper Bacon", `${BASE}, pepperoni e bacon crocante`),
  f("Pepper Cremoso", `${BASE}, pepperoni e requeijão cremoso`),
  f("Pepper Catupiry", `${BASE}, pepperoni e catupiry`),
  f("Palmito com Bacon", `${BASE}, palmito e bacon crocante`),
  f("Palmito Cheddar", `${BASE}, palmito e cheddar cremoso`),
];

/* ---------------------------------------------------------------------------
 * SABORES DA LINHA PROMOCIONAL (lista fechada, mais barata)
 * -------------------------------------------------------------------------*/
export const SABORES_PROMOCIONAIS: Flavor[] = [
  f("Calabresa", `${BASE}, calabresa e orégano`),
  f("Calabresa com Cebola", `${BASE}, calabresa, cebola e orégano`),
  f("Calabresa com Requeijão Cremoso", `${BASE}, calabresa e requeijão cremoso`),
  f("Calabresa com Cheddar", `${BASE}, calabresa e cheddar cremoso`),
  f("Frango", `${BASE}, frango desfiado e orégano`),
  f("Frango com Requeijão Cremoso", `${BASE}, frango desfiado e requeijão cremoso`),
  f("Frango com Cheddar", `${BASE}, frango desfiado e cheddar cremoso`),
  f("Romana", `${BASE}, presunto, tomate e orégano`),
  f("Bauru", `${BASE}, presunto, tomate e orégano`),
  f("Bacon", `${BASE}, bacon crocante e orégano`),
  f("Milho", `${BASE}, milho verde e orégano`),
  f("Alho e Óleo", `${BASE}, alho frito, azeite e orégano`),
];

/* ---------------------------------------------------------------------------
 * SABORES DOCES
 * -------------------------------------------------------------------------*/
export const SABORES_DOCES: Flavor[] = [
  f("Dois Amores", "Creme de leite, mussarela, chocolate branco e chocolate preto"),
  f(
    "Sensação",
    "Creme de leite, mussarela, chocolate preto, morangos e leite condensado",
  ),
  f(
    "Prestígio",
    "Creme de leite, mussarela, chocolate preto, coco ralado e leite condensado",
  ),
  f(
    "Beijinho",
    "Creme de leite, mussarela, chocolate branco, coco ralado e leite condensado",
  ),
  f(
    "Amendoim",
    "Creme de leite, mussarela, creme de amendoim, chocolate e amendoim triturado",
  ),
  f("Sonho de Valsa", "Creme de leite, mussarela, chocolate e pedaços de Sonho de Valsa"),
  f("Ouro Branco", "Creme de leite, mussarela, chocolate branco e pedaços de Ouro Branco"),
  f(
    "Abacaxi Flambado com Chocolate Branco",
    "Creme de leite, mussarela, abacaxi flambado, chocolate branco e leite condensado",
  ),
  f(
    "Paçoca",
    "Creme de leite, mussarela, chocolate branco, paçoca triturada e leite condensado",
  ),
];

/* ---------------------------------------------------------------------------
 * CATEGORIAS DE PIZZA + TAMANHOS E PREÇOS
 * -------------------------------------------------------------------------*/
export const PIZZA_CATEGORIES: PizzaCategory[] = [
  {
    id: "tradicional",
    label: "Pizzas Tradicionais",
    tagline: "Preço fixo por tamanho — escolha até 3 sabores na Grande.",
    image: pizza1,
    sizes: [
      { id: "broto", label: "Broto", slices: "4 pedaços", maxFlavors: 1, price: 22.9 },
      { id: "media", label: "Média", slices: "6 pedaços", maxFlavors: 2, price: 30.9 },
      { id: "grande", label: "Grande", slices: "8 pedaços", maxFlavors: 3, price: 38.9 },
    ],
    flavors: SABORES_TRADICIONAIS,
  },
  {
    id: "promocional",
    label: "Pizzas Promocionais",
    tagline: "Só Grande (8 fatias) — lista de sabores selecionados, preço menor.",
    image: pizza2,
    sizes: [
      // preço base = 1 sabor; com 2 sabores usa priceByFlavorCount
      { id: "grande", label: "Grande", slices: "8 pedaços", maxFlavors: 2, price: 28.9 },
    ],
    priceByFlavorCount: { 1: 28.9, 2: 32.9 },
    flavors: SABORES_PROMOCIONAIS,
  },
  {
    id: "doce",
    label: "Pizzas Doces",
    tagline: "Sobremesa em forma de pizza — preços próprios por tamanho.",
    image: pizza4,
    sizes: [
      { id: "broto", label: "Broto", slices: "4 pedaços", maxFlavors: 1, price: 24.9 },
      { id: "media", label: "Média", slices: "6 pedaços", maxFlavors: 2, price: 34.9 },
      { id: "grande", label: "Grande", slices: "8 pedaços", maxFlavors: 3, price: 44.9 },
    ],
    flavors: SABORES_DOCES,
  },
  {
    id: "premium",
    label: "Monte Sua Pizza Premium",
    tagline: "Até 4 sabores tradicionais numa pizza só — tamanho único (8 fatias).",
    image: pizza3,
    sizes: [
      { id: "unico", label: "Única", slices: "8 pedaços", maxFlavors: 4, price: 49.9 },
    ],
    flavors: SABORES_TRADICIONAIS,
  },
];

/* ---------------------------------------------------------------------------
 * BORDA RECHEADA — acréscimo varia pelo TAMANHO da pizza
 * -------------------------------------------------------------------------*/
export const BORDA_PRECO_POR_TAMANHO: Record<SizeId, number> = {
  broto: 10,
  media: 12,
  grande: 15,
  unico: 15, // Monte Sua Pizza Premium
};

export const BORDAS: { id: string; name: string }[] = [
  { id: "sem", name: "Sem borda recheada" }, // padrão, sem custo
  { id: "requeijao", name: "Requeijão Cremoso" },
  { id: "cheddar", name: "Cheddar" },
  { id: "choco-preto", name: "Chocolate Preto" },
  { id: "choco-branco", name: "Chocolate Branco" },
  { id: "dois-amores", name: "Dois Amores (branco + preto)" },
  { id: "tres-amores", name: "Três Amores (branco + preto + doce de leite)" },
  { id: "mozzarella", name: "Mozzarella" },
];

/* ---------------------------------------------------------------------------
 * BEBIDAS — 2 litros, salvo indicação no nome
 * -------------------------------------------------------------------------*/
export type Drink = { id: string; name: string; price: number; image: string };

export const BEBIDAS: Drink[] = [
  { id: "cini-guarana", name: "Cini Guaraná 2L", price: 8, image: bebidaGuarana },
  { id: "cini-laranjinha", name: "Cini Laranjinha 2L", price: 8, image: bebidaSuco },
  { id: "cini-abacaxi", name: "Cini Abacaxi 2L", price: 8, image: bebidaSuco },
  { id: "wimy", name: "Wimy 2L", price: 8, image: bebidaGuarana },
  { id: "sukita", name: "Sukita Laranja 2L", price: 8, image: bebidaSuco },
  { id: "coca", name: "Coca-Cola 2L", price: 16, image: bebidaCoca },
  { id: "coca-zero", name: "Coca-Cola Zero 2L", price: 16, image: bebidaCoca },
  { id: "coca-lata", name: "Coca-Cola lata 350ml", price: 6, image: bebidaCoca },
  { id: "sprite", name: "Sprite 2L", price: 14, image: bebidaSuco },
  { id: "sprite-zero", name: "Sprite Zero 2L", price: 14, image: bebidaSuco },
  { id: "guarana", name: "Guaraná Antarctica 2L", price: 14, image: bebidaGuarana },
  { id: "kuat", name: "Kuat 2L", price: 14, image: bebidaGuarana },
  { id: "fanta-laranja", name: "Fanta Laranja 2L", price: 14, image: bebidaSuco },
  { id: "fanta-uva", name: "Fanta Uva 2L", price: 14, image: bebidaSuco },
];

/* ---------------------------------------------------------------------------
 * COMBOS / PROMOÇÕES
 * price = null quando não há valor fechado (ex.: leva o refri grátis).
 * -------------------------------------------------------------------------*/
export type Combo = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  oldPrice?: number;
  image: string;
};

export const COMBOS: Combo[] = [
  {
    id: "combo-borda-gratis",
    name: "Pizza Grande + Borda Grátis",
    description:
      "Pizza Grande (qualquer sabor tradicional) + borda recheada grátis (Requeijão, Cheddar, Chocolate Preto ou Branco) + sobremesa 150g grátis.",
    price: 38.9,
    image: pizza1,
  },
  {
    id: "combo-crocante",
    name: "Pizza Tradicional Sabor Crocante",
    description: "Promoção especial: pizza tradicional crocante + sobremesa 150g grátis.",
    price: 28.9,
    oldPrice: 38.9,
    image: pizza3,
  },
  {
    id: "combo-especial",
    name: "Combo Especial",
    description:
      "Pizza Grande 8 fatias (1 sabor da linha promocional) + Refrigerante 2L + sobremesa 150g grátis.",
    price: 38.9,
    image: pizza2,
  },
  {
    id: "combo-toscana",
    name: "Pizza de Linguiça Toscana",
    description:
      "Muito queijo, linguiça suculenta e massa fofinha + sobremesa 150g grátis.",
    price: 38.9,
    image: pizza1,
  },
  {
    id: "combo-2-pizzas",
    name: "Duas Pizzas Tradicionais + Refri Grátis",
    description:
      "Na compra de 2 pizzas tradicionais, você ganha 1 refrigerante 2L de graça. (Monte as 2 pizzas no cardápio e nós enviamos o refri.)",
    price: null,
    image: pizza2,
  },
  {
    id: "combo-meio-doce",
    name: "Metade Salgada, Metade Doce",
    description: "Pizza meio salgada, meio doce + sobremesa 150g grátis.",
    price: 38.9,
    image: pizza4,
  },
];

/** Formata número em Real: 38.9 -> "R$ 38,90" */
export function formatBRL(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}
