import { Pizza, Star, Rocket, Heart } from "lucide-react";

const items = [
  { icon: Pizza, label: "Recheio generoso" },
  { icon: Star, label: "4,9 estrelas no Google" },
  { icon: Rocket, label: "Entrega rápida" },
  { icon: Heart, label: "Feita com capricho" },
];

export function Highlights() {
  return (
    <section className="bg-wine">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-4 py-6 sm:px-6 lg:grid-cols-4 lg:py-7">
        {items.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center justify-center gap-3 px-2 py-3 text-center">
            <Icon className="h-5 w-5 shrink-0 text-gold" strokeWidth={2} />
            <span className="text-sm font-semibold text-cream sm:text-base">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
