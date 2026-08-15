import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

function getClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("cf-connecting-ip") ?? request.headers.get("x-real-ip") ?? "unknown";
}

/** Só aceita chamadas vindas do próprio site (mesma origem) ou de localhost. */
function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // navegação same-origin sem header
  try {
    const url = new URL(origin);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return true;
    const host = request.headers.get("host");
    return !!host && url.host === host;
  } catch {
    return false;
  }
}

export const quoteDelivery = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const d = data as { address?: unknown };
    if (typeof d?.address !== "string") throw new Error("Payload inválido");
    return { address: d.address.slice(0, 200) };
  })
  .handler(async ({ data }) => {
    const request = getRequest();
    if (!isAllowedOrigin(request)) {
      return { ok: false as const, error: "Origem não permitida" };
    }
    const { quoteDeliveryFee } = await import("./delivery-fee.server");
    return quoteDeliveryFee(data.address, getClientIp(request), null);
  });
