import hero from "@/assets/hero-pizza.jpg";
import pizza2 from "@/assets/pizza-2.jpg";
import pizza3 from "@/assets/pizza-3.jpg";
import pizza4 from "@/assets/pizza-4.jpg";
import bastidores from "@/assets/bastidores.jpg";
import forno from "@/assets/forno.jpg";
import clientes from "@/assets/clientes.jpg";

/** Substitua estas imagens pelas fotos reais da pizzaria (src/assets). */
const photos = [
  { src: hero, alt: "Pizza artesanal fatiada", tag: "Pizzas", span: "sm:col-span-2 sm:row-span-2" },
  { src: forno, alt: "Pizza saindo do forno", tag: "Bastidores", span: "" },
  { src: pizza2, alt: "Pizza com recheio generoso", tag: "Cardápio", span: "" },
  { src: bastidores, alt: "Preparo artesanal da massa", tag: "Bastidores", span: "" },
  { src: clientes, alt: "Clientes aproveitando a pizza em casa", tag: "Clientes", span: "" },
  { src: pizza3, alt: "Pizza de queijo dourado", tag: "Cardápio", span: "sm:col-span-2" },
  { src: pizza4, alt: "Pizza doce com morango", tag: "Cardápio", span: "sm:col-span-2" },
];

export function Gallery() {
  return (
    <section className="bg-charcoal py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
            Pizzas • Bastidores • Cardápio • Clientes
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-cream sm:text-4xl lg:text-5xl">
            Feita para dar água na boca. 🤤
          </h2>
        </div>

        <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[200px] sm:grid-cols-4">
          {photos.map((p) => (
            <figure
              key={p.alt}
              className={`group relative overflow-hidden rounded-2xl ${p.span}`}
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/85 to-transparent p-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                  {p.tag}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
