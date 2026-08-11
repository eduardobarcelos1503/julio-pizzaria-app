import { CtaLink } from "./CtaLink";
import { StarRating } from "./StarRating";
import { BUSINESS, WA_GENERAL } from "@/lib/pizzaria";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-gradient-wine py-20 lg:py-28">
      <div
        className="absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, oklch(0.79 0.14 82 / 0.35), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="font-display text-4xl font-extrabold leading-tight text-cream sm:text-5xl lg:text-6xl">
          Bateu aquela fome? 🍕
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-cream/80">
          Uma pizza caprichada está a poucos cliques de distância.
        </p>
        <div className="mt-9">
          <CtaLink href={WA_GENERAL} size="xl" className="w-full sm:w-auto">
            📲 PEDIR AGORA PELO WHATSAPP
          </CtaLink>
        </div>
        <p className="mt-6 inline-flex items-center gap-2 text-sm text-cream/70">
          <StarRating size={15} />
          {BUSINESS.rating}/5 no Google • {BUSINESS.reviews} avaliações
        </p>
      </div>
    </section>
  );
}
