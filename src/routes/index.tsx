import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { MenuSection } from "@/components/MenuSection";
import { Diferenciais } from "@/components/Diferenciais";
import { Reviews } from "@/components/Reviews";
import { Gallery } from "@/components/Gallery";
import { Sobre } from "@/components/Sobre";
import { Localizacao } from "@/components/Localizacao";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { MobileOrderBar } from "@/components/MobileOrderBar";
import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider } from "@/lib/cart";
import { BUSINESS } from "@/lib/pizzaria";


const title = "Julio Pizzaria — Delivery de Pizza em São José dos Pinhais";
const description =
  "Pizza artesanal com massa leve e recheio generoso. 4,9★ no Google. Delivery de pizza no Iná, São José dos Pinhais - PR. Peça pelo WhatsApp.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "pizzaria em São José dos Pinhais, pizza São José dos Pinhais, delivery de pizza São José dos Pinhais, pizzaria no Iná, pizza no Iná",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "restaurant.restaurant" },
      { property: "og:url", content: "/" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: BUSINESS.name,
          servesCuisine: "Pizza",
          image: "/favicon.ico",
          url: "/",
          telephone: "+5541996316373",
          priceRange: "R$ 20-40",
          address: {
            "@type": "PostalAddress",
            streetAddress: BUSINESS.street,
            addressLocality: BUSINESS.city,
            addressRegion: BUSINESS.state,
            postalCode: BUSINESS.zip,
            addressCountry: "BR",
          },
          areaServed: {
            "@type": "City",
            name: "São José dos Pinhais",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: BUSINESS.reviews,
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
              opens: "18:00",
              closes: "23:00",
            },
          ],
          hasMenu: "/#cardapio",
          potentialAction: {
            "@type": "OrderAction",
            target: `https://wa.me/${BUSINESS.whatsappNumber}`,
          },
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <Highlights />
          <MenuSection />
          <Diferenciais />
          <Reviews />
          <Gallery />
          <Sobre />
          <Localizacao />
          <FinalCta />
        </main>
        <Footer />
        <MobileOrderBar />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}

