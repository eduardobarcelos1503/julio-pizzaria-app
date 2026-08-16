import { useEffect, useState } from "react";
import { MapPin, Phone, Clock, Truck } from "lucide-react";
import { CtaLink } from "./CtaLink";
import { BUSINESS, isOpenNow } from "@/lib/pizzaria";

export function Localizacao() {
  const [openNow, setOpenNow] = useState<boolean | null>(null);

  useEffect(() => {
    const tick = () => setOpenNow(isOpenNow());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="localizacao" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Delivery em São José dos Pinhais
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-wine sm:text-4xl lg:text-5xl">
            Onde estamos
          </h2>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
            <ul className="space-y-6">
              <li className="flex gap-4">
                <MapPin className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
                <address className="not-italic leading-relaxed">
                  <span className="block font-semibold text-foreground">{BUSINESS.street}</span>
                  <span className="block text-muted-foreground">
                    {BUSINESS.district} — {BUSINESS.city} - {BUSINESS.state}
                  </span>
                  <span className="block text-muted-foreground">CEP {BUSINESS.zip}</span>
                </address>
              </li>
              <li className="flex gap-4">
                <Phone className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
                <a
                  href={`tel:+${BUSINESS.whatsappNumber}`}
                  className="font-semibold text-foreground transition-colors hover:text-primary"
                >
                  {BUSINESS.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-4">
                <Clock className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
                <span>
                  <span className="block font-semibold text-foreground">{BUSINESS.hours}</span>
                  {openNow !== null && (
                    <span
                      className={
                        openNow
                          ? "mt-1 inline-block rounded-full bg-whatsapp/15 px-3 py-1 text-xs font-bold text-whatsapp"
                          : "mt-1 inline-block rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground"
                      }
                    >
                      {openNow
                        ? `Aberto agora · fecha ${BUSINESS.closeHour}:00`
                        : `Fechado — abrimos às ${BUSINESS.openHour}:00`}
                    </span>
                  )}
                </span>
              </li>
              <li className="flex gap-4">
                <Truck className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
                <span className="font-semibold text-foreground">{BUSINESS.deliveryArea}</span>
              </li>
            </ul>
            <CtaLink href={BUSINESS.mapsUrl} variant="ember" size="lg" className="mt-8 w-full">
              📍 Ver rota
            </CtaLink>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border shadow-soft">
            <iframe
              title="Mapa da Julio Pizzaria"
              src={BUSINESS.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[360px] w-full lg:h-full lg:min-h-[420px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
