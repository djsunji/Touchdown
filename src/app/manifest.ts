import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Touchdown",
    short_name: "Touchdown",
    description: "Nightstop-Tipps von Kolleg:innen",
    lang: "de",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0a2148",
    theme_color: "#0a2148",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
