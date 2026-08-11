import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className="fill-gold text-gold" strokeWidth={1} />
      ))}
    </span>
  );
}
