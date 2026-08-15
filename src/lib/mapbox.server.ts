// SOMENTE SERVIDOR. Nunca importe este arquivo de código de cliente.
// A chave do Mapbox fica em Secrets do projeto (MAPBOX_SECRET_TOKEN ou MAPBOX_TOKEN).

export function getMapboxToken(): string {
  const token =
    process.env["MAPBOX_SECRET_TOKEN"] ?? process.env["MAPBOX_TOKEN"] ?? "";
  if (!token) throw new Error("Mapbox token ausente");
  return token;
}

/** Arredonda coordenada para ~0.01 grau (~1km) para agrupar bairros no cache. */
export function roundCoord(coord: number): number {
  return Math.round(coord * 100) / 100;
}

export function hashRoute(
  origin: [number, number],
  dest: [number, number],
): { originHash: string; destHash: string } {
  return {
    originHash: `${roundCoord(origin[0])},${roundCoord(origin[1])}`,
    destHash: `${roundCoord(dest[0])},${roundCoord(dest[1])}`,
  };
}

export function normalizeAddress(address: string): string {
  return address
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Directions API — perfil de carro. */
export function mapboxDirectionsUrl(
  origin: [number, number],
  dest: [number, number],
): string {
  const [olon, olat] = origin;
  const [dlon, dlat] = dest;
  return `https://api.mapbox.com/directions/v5/mapbox/driving/${olon},${olat};${dlon},${dlat}?geometries=geojson&overview=false&access_token=${getMapboxToken()}`;
}

/** Geocoding API restrito ao Brasil e à região de Curitiba/São José dos Pinhais. */
export function mapboxGeocodeUrl(text: string): string {
  return `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    text,
  )}.json?country=br&language=pt&limit=1&proximity=-49.2064,-25.5307&access_token=${getMapboxToken()}`;
}
