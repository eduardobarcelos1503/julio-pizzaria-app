// SOMENTE SERVIDOR. Cálculo de frete com cache + rate limit antes de qualquer
// chamada paga ao Mapbox.
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  hashRoute,
  mapboxDirectionsUrl,
  mapboxGeocodeUrl,
  normalizeAddress,
} from "./mapbox.server";

const RATE_LIMIT_WINDOW_MIN = 60; // janela de 1h
const RATE_LIMIT_MAX = 20; // máx 20 consultas por IP/hora
const CACHE_TTL_DAYS = 30;

/** Endereço fixo da pizzaria (origem das entregas). */
export const ORIGIN_ADDRESS =
  "R. Cláudio Pereira da Cruz, 505 - Iná, São José dos Pinhais - PR, 83065-020";
/** Coordenada de fallback caso a geocodificação da origem falhe. */
const ORIGIN_FALLBACK: [number, number] = [-49.1962, -25.5392];

export type FeeResult = {
  ok: boolean;
  distanceKm?: number;
  durationMin?: number;
  fee?: number;
  cached?: boolean;
  placeName?: string;
  foraDeArea?: boolean;
  maxKm?: number;
  error?: string;
  blocked?: boolean;
};

type Settings = {
  mode: string;
  base_fee: number;
  per_km: number;
  max_km: number;
};

async function loadSettings(): Promise<{ settings: Settings; tiers: { up_to_km: number; fee: number }[] }> {
  const [{ data: s }, { data: t }] = await Promise.all([
    supabaseAdmin.from("delivery_settings").select("*").limit(1).maybeSingle(),
    supabaseAdmin.from("delivery_tiers").select("up_to_km, fee").order("up_to_km"),
  ]);
  return {
    settings: {
      mode: String(s?.["mode"] ?? "tiers"),
      base_fee: Number(s?.["base_fee"] ?? 5),
      per_km: Number(s?.["per_km"] ?? 1.5),
      max_km: Number(s?.["max_km"] ?? 12),
    },
    tiers: (t ?? []).map((r) => ({ up_to_km: Number(r.up_to_km), fee: Number(r.fee) })),
  };
}

function computeFee(
  distanceKm: number,
  settings: Settings,
  tiers: { up_to_km: number; fee: number }[],
): number {
  if (settings.mode === "tiers" && tiers.length > 0) {
    const tier = tiers.find((t) => distanceKm <= t.up_to_km);
    if (tier) return Math.round(tier.fee * 100) / 100;
    return Math.round(tiers[tiers.length - 1]!.fee * 100) / 100;
  }
  return Math.round((settings.base_fee + distanceKm * settings.per_km) * 100) / 100;
}

async function geocode(address: string): Promise<{ coords: [number, number]; placeName: string } | null> {
  const key = normalizeAddress(address);
  const { data: cached } = await supabaseAdmin
    .from("geocode_cache")
    .select("lon, lat, place_name")
    .eq("address_hash", key)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (cached) {
    return {
      coords: [Number(cached.lon), Number(cached.lat)],
      placeName: String(cached.place_name ?? ""),
    };
  }

  const res = await fetch(mapboxGeocodeUrl(address), {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    features?: { center?: number[]; place_name?: string }[];
  };
  const feature = json.features?.[0];
  const center = feature?.center;
  if (!center || center.length < 2) return null;

  const coords: [number, number] = [Number(center[0]), Number(center[1])];
  const placeName = String(feature?.place_name ?? address);

  await supabaseAdmin.from("geocode_cache").upsert(
    {
      address_hash: key,
      lon: coords[0],
      lat: coords[1],
      place_name: placeName,
      expires_at: new Date(Date.now() + CACHE_TTL_DAYS * 864e5).toISOString(),
    },
    { onConflict: "address_hash" },
  );

  return { coords, placeName };
}

export async function quoteDeliveryFee(
  address: string,
  ip: string,
  userId: string | null,
): Promise<FeeResult> {
  try {
    const clean = address.trim();
    if (clean.length < 8 || clean.length > 200) {
      return { ok: false, error: "Informe o endereço completo (rua, número e bairro)." };
    }

    // ---------- RATE LIMIT (antes de custar qualquer token) ----------
    const key = userId ? `ip:${ip}:user:${userId}` : `ip:${ip}`;
    const { data: allowed } = await supabaseAdmin.rpc("bump_rate_limit", {
      p_key: key,
      p_window_minutes: RATE_LIMIT_WINDOW_MIN,
      p_max: RATE_LIMIT_MAX,
    });
    if (allowed === false) {
      return {
        ok: false,
        blocked: true,
        error: "Limite de consultas atingido. Tente novamente mais tarde ou peça pelo WhatsApp.",
      };
    }

    const { settings, tiers } = await loadSettings();

    // ---------- GEOCODIFICAÇÃO (com cache) ----------
    const dest = await geocode(clean);
    if (!dest) {
      return {
        ok: false,
        error: "Não encontramos esse endereço. Confira rua, número e bairro.",
      };
    }
    const originGeo = await geocode(ORIGIN_ADDRESS);
    const origin = originGeo?.coords ?? ORIGIN_FALLBACK;

    // ---------- CACHE DE ROTA ----------
    const { originHash, destHash } = hashRoute(origin, dest.coords);
    const { data: cached } = await supabaseAdmin
      .from("delivery_cache")
      .select("distance_km, duration_min, fee")
      .eq("origin_hash", originHash)
      .eq("dest_hash", destHash)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (cached) {
      const distanceKm = Number(cached.distance_km);
      return {
        ok: true,
        distanceKm,
        durationMin: Number(cached.duration_min),
        fee: computeFee(distanceKm, settings, tiers),
        cached: true,
        placeName: dest.placeName,
        maxKm: settings.max_km,
        foraDeArea: distanceKm > settings.max_km,
      };
    }

    // ---------- MAPBOX (só chega aqui sem cache) ----------
    const res = await fetch(mapboxDirectionsUrl(origin, dest.coords), {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      return { ok: false, error: "Não foi possível calcular a entrega agora." };
    }
    const json = (await res.json()) as {
      routes?: { distance: number; duration: number }[];
    };
    const route = json.routes?.[0];
    if (!route) return { ok: false, error: "Rota não encontrada para esse endereço." };

    const distanceKm = Math.round((route.distance / 1000) * 100) / 100;
    const durationMin = Math.round(route.duration / 60);
    const fee = computeFee(distanceKm, settings, tiers);

    await supabaseAdmin.from("delivery_cache").upsert(
      {
        origin_hash: originHash,
        dest_hash: destHash,
        distance_km: distanceKm,
        duration_min: durationMin,
        fee,
        expires_at: new Date(Date.now() + CACHE_TTL_DAYS * 864e5).toISOString(),
      },
      { onConflict: "origin_hash,dest_hash" },
    );

    return {
      ok: true,
      distanceKm,
      durationMin,
      fee,
      cached: false,
      placeName: dest.placeName,
      maxKm: settings.max_km,
      foraDeArea: distanceKm > settings.max_km,
    };
  } catch (err) {
    console.error("[delivery-fee] erro:", err);
    return { ok: false, error: "Erro interno ao calcular a taxa de entrega." };
  }
}
