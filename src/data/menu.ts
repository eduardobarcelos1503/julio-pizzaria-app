import pizza1 from "@/assets/pizza-1.jpg";
import pizza2 from "@/assets/pizza-2.jpg";
import pizza3 from "@/assets/pizza-3.jpg";
import pizza4 from "@/assets/pizza-4.jpg";
import bebidaCoca from "@/assets/bebida-coca.jpg";
import bebidaGuarana from "@/assets/bebida-guarana.jpg";
import bebidaSuco from "@/assets/bebida-suco.jpg";

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
        name: "Coca-Cola 2L",
        description: "Refrigerante gelado, perfeito para acompanhar a pizza.",
        price: "R$ 12,00",
        image: bebidaCoca,
      },
      {
        id: "b2",
        name: "Guaraná Antarctica 2L",
        description: "Refrigerante brasileiro gelado, sabor autêntico.",
        price: "R$ 11,00",
        image: bebidaGuarana,
      },
      {
        id: "b3",
        name: "Suco Natural de Laranja 500ml",
        description: "Suco natural e refrescante, feito na hora.",
        price: "R$ 9,00",
        image: bebidaSuco,
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
