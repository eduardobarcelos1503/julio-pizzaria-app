import bastidores from "@/assets/bastidores.jpg";
import { CtaLink } from "./CtaLink";
import { StarRating } from "./StarRating";
import { BUSINESS, WA_GENERAL } from "@/lib/pizzaria";

export function Sobre() {
  return (
    <section id="sobre" className="bg-secondary py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <img
            src={bastidores}
            alt="Massa de pizza sendo preparada artesanalmente na Julio Pizzaria"
            loading="lazy"
            width={800}
            height={800}
            className="w-full rounded-[2rem] object-cover shadow-lift"
          />
          <div className="absolute -bottom-5 right-5 flex items-center gap-3 rounded-2xl bg-card px-5 py-4 shadow-lift">
            <span className="font-display text-3xl font-extrabold leading-none text-wine">
              {BUSINESS.rating}
            </span>
            <span>
              <StarRating size={13} />
              <span className="mt-1 block text-[0.68rem] font-medium uppercase tracking-widest text-muted-foreground">
                no Google
              </span>
            </span>
          </div>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Sobre a pizzaria
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-wine sm:text-4xl lg:text-[2.75rem]">
            Mais que uma pizza, um sabor para lembrar.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground/80">
            Na Julio Pizzaria, cada pizza é preparada com cuidado para entregar uma experiência
            que vai muito além da fome. Massa saborosa, recheio generoso e aquele capricho que
            faz nossos clientes voltarem.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CtaLink href={WA_GENERAL} size="lg">
              📲 Pedir pelo WhatsApp
            </CtaLink>
            <CtaLink href="#cardapio" variant="outline" size="lg">
              Ver cardápio
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}
