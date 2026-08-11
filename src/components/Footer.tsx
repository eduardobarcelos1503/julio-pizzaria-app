import { MapPin, Phone, MessageCircle, Pizza } from "lucide-react";
import { BUSINESS, WA_GENERAL } from "@/lib/pizzaria";

const links = [
  { href: "#inicio", label: "Início" },
  { href: "#cardapio", label: "Cardápio" },
  { href: "#avaliacoes", label: "Avaliações" },
  { href: "#localizacao", label: "Localização" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal pb-24 pt-16 text-cream/70 lg:pb-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-ember">
              <Pizza className="h-5 w-5 text-primary-foreground" />
            </span>
            <span>
              <span className="block font-display text-lg font-extrabold text-cream">
                {BUSINESS.name}
              </span>
              <span className="block text-xs uppercase tracking-[0.18em] text-gold">
                {BUSINESS.category}
              </span>
            </span>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gold" /> {BUSINESS.city} - {BUSINESS.state}
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-gold" />
            <a href={`tel:+${BUSINESS.whatsappNumber}`} className="hover:text-cream">
              {BUSINESS.phoneDisplay}
            </a>
          </p>
        </div>

        <nav aria-label="Rodapé">
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-cream">
            Navegação
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-colors hover:text-gold">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-cream">
            Peça agora
          </h3>
          <a
            href={WA_GENERAL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-semibold text-cream transition-all hover:brightness-110"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp {BUSINESS.phoneDisplay}
          </a>
          <p className="mt-4 text-sm">{BUSINESS.hours}</p>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-cream/10 px-4 pt-6 text-center text-xs text-cream/45 sm:px-6">
        © {new Date().getFullYear()} {BUSINESS.name}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
