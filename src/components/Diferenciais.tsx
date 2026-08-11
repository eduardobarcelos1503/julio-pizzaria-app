const blocks = [
  {
    emoji: "🍕",
    title: "Recheio de verdade",
    text: "Pizzas bem recheadas, com ingredientes escolhidos para entregar muito sabor em cada pedaço.",
  },
  {
    emoji: "🥰",
    title: "Feita com capricho",
    text: "Cada pedido é preparado com cuidado para chegar até você do jeito que deve ser.",
  },
  {
    emoji: "🚀",
    title: "Entrega rápida",
    text: "Seu pedido preparado com agilidade para você aproveitar sua pizza quentinha.",
  },
  {
    emoji: "❤️",
    title: "Atendimento próximo",
    text: "Um atendimento elogiado pelos clientes e feito para você se sentir bem atendido.",
  },
];

export function Diferenciais() {
  return (
    <section className="bg-secondary py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-center font-display text-3xl font-extrabold text-wine sm:text-4xl">
          Por que pedir na Julio Pizzaria?
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {blocks.map((b) => (
            <div
              key={b.title}
              className="rounded-3xl border border-border bg-card p-7 shadow-soft transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-2xl">
                {b.emoji}
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-wine">{b.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
