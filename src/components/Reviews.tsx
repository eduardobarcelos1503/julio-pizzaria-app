import { Quote } from "lucide-react";
import { StarRating } from "./StarRating";
import { CtaLink } from "./CtaLink";
import { BUSINESS } from "@/lib/pizzaria";

const reviews = [
  "Atendimento nota 10, ambiente tranquilo e entrega rápida, continuem assim 👏👏👏",
  "Pizza maravilhosa... massa perfeita... tudo com muito capricho 😋😋",
  "Gostei muito da pizza, foi a primeira vez que comprei e é muito boa. Recomendo.",
  "A verdade já sou cliente fiel faz tempo e nunca me decepcionam. Para mim são a melhor pizzaria de São José dos Pinhais.",
  "A massa é muito boa, os ingredientes são gostosos e a pizza veio quentinha.",
  "Na minha opinião, é a pizza mais gostosa de São José! O recheio é sempre generoso e gostoso e a massa é uma delícia.",
];

export function Reviews() {
  return (
    <section id="avaliacoes" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            O sabor que os clientes aprovam
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-wine sm:text-4xl lg:text-5xl">
            Quem prova, recomenda. ❤️
          </h2>

          <div className="mx-auto mt-8 inline-flex flex-col items-center gap-2 rounded-3xl border border-border bg-card px-10 py-6 shadow-soft">
            <span className="font-display text-5xl font-extrabold leading-none text-wine">
              {BUSINESS.rating} <span className="text-2xl text-muted-foreground">/ 5</span>
            </span>
            <StarRating size={20} />
            <span className="text-sm font-medium text-muted-foreground">
              {BUSINESS.reviews} avaliações no Google
            </span>
          </div>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <li
              key={r}
              className="relative rounded-3xl border border-border bg-card p-7 shadow-soft transition-transform duration-300 hover:-translate-y-1"
            >
              <Quote className="h-7 w-7 text-gold" strokeWidth={1.6} aria-hidden="true" />
              <p className="mt-4 text-[0.95rem] leading-relaxed text-foreground/85">“{r}”</p>
              <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
                <StarRating size={14} />
                <span className="text-xs font-medium text-muted-foreground">
                  Avaliação no Google
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <CtaLink href={BUSINESS.mapsUrl} variant="outline" size="md">
            ⭐ Ver todas as avaliações
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
