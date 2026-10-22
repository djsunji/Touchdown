// Map tiles. Default: OpenStreetMap's free tile server (fine for light use; for heavy use
// run your own or use a provider and set MAP_TILE_URL). MAP_TILE_URL="off" hides all maps.
export type MapConfig = { tileUrl: string; attribution: string } | null;

export function mapConfig(): MapConfig {
  const tileUrl = process.env.MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
  if (tileUrl === "off") return null;
  return {
    tileUrl,
    attribution:
      process.env.MAP_ATTRIBUTION || '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>-Mitwirkende',
  };
}
