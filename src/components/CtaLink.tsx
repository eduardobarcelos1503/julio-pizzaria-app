import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cta = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        whatsapp:
          "bg-whatsapp text-wine-foreground shadow-soft hover:brightness-105 hover:shadow-lift",
        ember: "bg-gradient-ember text-primary-foreground shadow-soft hover:shadow-lift",
        outline:
          "border border-wine/25 bg-transparent text-wine hover:bg-wine hover:text-wine-foreground",
        ghostLight:
          "border border-cream/30 bg-cream/10 text-cream backdrop-blur hover:bg-cream/20",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-[0.95rem]",
        lg: "h-14 px-8 text-base sm:text-lg",
        xl: "h-16 px-8 text-base sm:h-[4.25rem] sm:px-12 sm:text-xl",
      },
    },
    defaultVariants: { variant: "whatsapp", size: "md" },
  },
);

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps<typeof cta>;

export function CtaLink({ className, variant, size, ...props }: Props) {
  const external = props.href?.startsWith("http");
  return (
    <a
      className={cn(cta({ variant, size }), className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    />
  );
}
