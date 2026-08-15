import { useEffect, useState } from "react";
import { quoteDelivery } from "./delivery.functions";

export type DeliveryState =
  | { status: "idle" }
  | { status: "loading" }
  | {
      status: "success";
      fee: number;
      distanceKm: number;
      durationMin?: number | undefined;
      placeName?: string | undefined;
      foraDeArea: boolean;
      maxKm?: number | undefined;
    }
  | { status: "error"; message: string }
  | { status: "blocked"; message: string };

const DEBOUNCE_MS = 1500;

/** Consulta a taxa de entrega no servidor, com debounce para não gastar tokens à toa. */
export function useDeliveryFee(address: string): DeliveryState {
  const [state, setState] = useState<DeliveryState>({ status: "idle" });

  useEffect(() => {
    const clean = address.trim();
    if (clean.length < 8) {
      setState({ status: "idle" });
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setState({ status: "loading" });
      try {
        const result = await quoteDelivery({ data: { address: clean } });
        if (cancelled) return;
        if (!result.ok) {
          const message = result.error ?? "Não foi possível calcular a entrega.";
          setState(
            "blocked" in result && result.blocked
              ? { status: "blocked", message }
              : { status: "error", message },
          );
          return;
        }
        setState({
          status: "success",
          fee: result.fee ?? 0,
          distanceKm: result.distanceKm ?? 0,
          durationMin: result.durationMin,
          placeName: result.placeName,
          foraDeArea: result.foraDeArea === true,
          maxKm: result.maxKm,
        });
      } catch {
        if (!cancelled) {
          setState({ status: "error", message: "Não foi possível calcular a entrega." });
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [address]);

  return state;
}
