import { MapPin } from "lucide-react";
import heroPizza from "@/assets/hero-pizza.jpg";
import { CtaLink } from "./CtaLink";
import { StarRating } from "./StarRating";
import { BUSINESS, WA_GENERAL } from "@/lib/pizzaria";

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-charcoal">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(120% 80% at 80% 25%, oklch(0.42 0.17 27 / 0.55), transparent 60%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-24 lg:pt-36">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/35 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Pizza artesanal • Iná
          </span>
          <h1 className="mt-5 text-balance-title font-display text-4xl font-extrabold leading-[1.05] text-cream sm:text-5xl lg:text-6xl">
            A pizza que conquistou São José dos Pinhais 🍕
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-cream/75 lg:mx-0">
            Massa leve, recheio generoso e muito sabor em cada pedaço.
          </p>

          <div className="mt-7 inline-flex items-center gap-3 rounded-2xl border border-cream/15 bg-cream/[0.07] px-5 py-3 backdrop-blur">
            <StarRating size={18} />
            <span className="text-sm font-semibold text-cream">
              <strong className="text-gold">{BUSINESS.rating}/5</strong> no Google
              <span className="mx-1.5 text-cream/40">•</span>
              {BUSINESS.reviews} avaliações
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <CtaLink href="#cardapio" variant="ember" size="lg">
              🍕 Ver Cardápio
            </CtaLink>
            <CtaLink href={WA_GENERAL} variant="whatsapp" size="lg">
              📲 Pedir pelo WhatsApp
            </CtaLink>
          </div>

          <p className="mt-5 inline-flex items-center gap-2 text-sm text-cream/60">
            <MapPin className="h-4 w-4 text-gold" />
            Delivery em São José dos Pinhais
          </p>
        </div>

        <div className="relative">
          <div
            className="absolute -inset-6 rounded-full blur-3xl"
            style={{ background: "oklch(0.6 0.2 40 / 0.28)" }}
            aria-hidden="true"
          />
          <img
            src={heroPizza}
            alt="Pizza artesanal da Julio Pizzaria com queijo derretido e recheio generoso"
            width={1408}
            height={1408}
            fetchPriority="high"
            className="relative mx-auto w-full max-w-lg rounded-[2rem] object-cover shadow-lift lg:max-w-none"
          />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-2xl bg-cream px-5 py-3 text-center shadow-lift lg:left-6 lg:translate-x-0">
            <span className="block font-display text-2xl font-extrabold leading-none text-wine">
              {BUSINESS.rating} ⭐
            </span>
            <span className="mt-1 block text-[0.7rem] font-medium uppercase tracking-widest text-muted-foreground">
              {BUSINESS.reviews} avaliações
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
