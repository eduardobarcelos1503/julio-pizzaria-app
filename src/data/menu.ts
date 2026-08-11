import pizza1 from "@/assets/pizza-1.jpg";
import pizza2 from "@/assets/pizza-2.jpg";
import pizza3 from "@/assets/pizza-3.jpg";
import pizza4 from "@/assets/pizza-4.jpg";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
};

export type MenuCategory = {
  id: string;
  label: string;
  items: MenuItem[];
};

/**
 * CARDÁPIO — substitua os placeholders [Sabor] e os preços pelos dados reais.
 * Basta editar este arquivo; o site atualiza automaticamente.
 */
export const MENU: MenuCategory[] = [
  {
    id: "pizzas",
    label: "Pizzas",
    items: [
      {
        id: "p1",
        name: "Pizza de [Sabor]",
        description: "[Descreva os ingredientes deste sabor]",
        price: "R$ [00,00]",
        image: pizza1,
      },
      {
        id: "p2",
        name: "Pizza de [Sabor]",
        description: "[Descreva os ingredientes deste sabor]",
        price: "R$ [00,00]",
        image: pizza2,
      },
      {
        id: "p3",
        name: "Pizza de [Sabor]",
        description: "[Descreva os ingredientes deste sabor]",
        price: "R$ [00,00]",
        image: pizza3,
      },
      {
        id: "p4",
        name: "Pizza de [Sabor]",
        description: "[Descreva os ingredientes deste sabor]",
        price: "R$ [00,00]",
        image: pizza1,
      },
      {
        id: "p5",
        name: "Pizza de [Sabor]",
        description: "[Descreva os ingredientes deste sabor]",
        price: "R$ [00,00]",
        image: pizza2,
      },
      {
        id: "p6",
        name: "Pizza de [Sabor]",
        description: "[Descreva os ingredientes deste sabor]",
        price: "R$ [00,00]",
        image: pizza3,
      },
    ],
  },
  {
    id: "especiais",
    label: "Especiais",
    items: [
      {
        id: "e1",
        name: "Pizza Especial de [Sabor]",
        description: "[Descreva os ingredientes desta especial]",
        price: "R$ [00,00]",
        image: pizza2,
      },
      {
        id: "e2",
        name: "Pizza Especial de [Sabor]",
        description: "[Descreva os ingredientes desta especial]",
        price: "R$ [00,00]",
        image: pizza3,
      },
      {
        id: "e3",
        name: "Pizza Doce de [Sabor]",
        description: "[Descreva os ingredientes desta doce]",
        price: "R$ [00,00]",
        image: pizza4,
      },
    ],
  },
  {
    id: "bebidas",
    label: "Bebidas",
    items: [
      {
        id: "b1",
        name: "[Bebida] — [Tamanho]",
        description: "[Descrição curta da bebida]",
        price: "R$ [00,00]",
        image: pizza1,
      },
      {
        id: "b2",
        name: "[Bebida] — [Tamanho]",
        description: "[Descrição curta da bebida]",
        price: "R$ [00,00]",
        image: pizza3,
      },
      {
        id: "b3",
        name: "[Bebida] — [Tamanho]",
        description: "[Descrição curta da bebida]",
        price: "R$ [00,00]",
        image: pizza2,
      },
    ],
  },
  {
    id: "combos",
    label: "Combos",
    items: [
      {
        id: "c1",
        name: "Combo [Nome]",
        description: "[Ex.: 1 pizza grande + 1 bebida]",
        price: "R$ [00,00]",
        image: pizza2,
      },
      {
        id: "c2",
        name: "Combo [Nome]",
        description: "[Ex.: 2 pizzas grandes + 2 bebidas]",
        price: "R$ [00,00]",
        image: pizza1,
      },
      {
        id: "c3",
        name: "Combo [Nome]",
        description: "[Ex.: pizza salgada + pizza doce]",
        price: "R$ [00,00]",
        image: pizza4,
      },
    ],
  },
];
