// Dados centrais da pizzaria — edite aqui para atualizar o site inteiro.
export const BUSINESS = {
  name: "Julio Pizzaria",
  category: "Delivery de Pizza",
  phoneDisplay: "(41) 99631-6373",
  whatsappNumber: "5541996316373",
  street: "R. Cláudio Pereira da Cruz, 505",
  district: "Iná",
  city: "São José dos Pinhais",
  state: "PR",
  zip: "83065-020",
  hours: "Todos os dias, 18:00 às 23:00",
  /** Horário de funcionamento (24h) — confirmar com o dono se há dia de fechamento. */
  openHour: 18,
  closeHour: 23,
  deliveryArea: "Entregamos em São José dos Pinhais e região — tempo médio de 30 a 50 min",
  rating: "4,9",
  reviews: 62,
  priceRange: "R$ 20–40 por pessoa",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=R.+Cl%C3%A1udio+Pereira+da+Cruz,+505+-+In%C3%A1,+S%C3%A3o+Jos%C3%A9+dos+Pinhais+-+PR,+83065-020",
  mapsEmbed:
    "https://www.google.com/maps?q=R.+Cl%C3%A1udio+Pereira+da+Cruz,+505+-+In%C3%A1,+S%C3%A3o+Jos%C3%A9+dos+Pinhais+-+PR,+83065-020&output=embed",
} as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const WA_GENERAL = whatsappLink(
  "Olá! Vim pelo site e gostaria de fazer um pedido na Julio Pizzaria.",
);

/** Status ao vivo do funcionamento (usar apenas no cliente, após hidratação). */
export function isOpenNow(now: Date = new Date()): boolean {
  const h = now.getHours() + now.getMinutes() / 60;
  return h >= BUSINESS.openHour && h < BUSINESS.closeHour;
}
