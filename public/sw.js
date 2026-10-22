// Touchdown service worker: makes the app installable and keeps visited / saved pages
// available without network (roaming off, flight mode). Logging out deletes all caches.
const VERSION = "v1";
const PAGES = `pages-${VERSION}`;
const ASSETS = `assets-${VERSION}`;
const OFFLINE_HTML =
  '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline · Touchdown</title>' +
  '<body style="font-family:system-ui,sans-serif;background:#0a2148;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0;text-align:center;padding:24px">' +
  '<div><h1 style="margin:0 0 8px">Du bist offline</h1><p style="opacity:.8;max-width:32ch">Diese Seite ist nicht gespeichert. Tipp: Auf der Seite einer Destination «Für offline speichern» wählen, solange du Netz hast.</p>' +
  '<p><a href="/" style="color:#d4a017">Zur Startseite</a></p></div></body>';

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) if (![PAGES, ASSETS].includes(key)) await caches.delete(key);
      await self.clients.claim();
    })(),
  );
});

const isAsset = (url) =>
  url.pathname.startsWith("/_next/static/") ||
  url.pathname.startsWith("/_next/image") ||
  url.pathname.startsWith("/api/photos/") ||
  /\.(png|svg|ico|webmanifest|woff2?)$/.test(url.pathname);

// Live data and login must never come from the cache
const isNoCache = (url) =>
  (url.pathname.startsWith("/api/") && !url.pathname.startsWith("/api/photos/")) || url.pathname.includes("hot-update");

function pageKey(url) {
  const u = new URL(url);
  u.searchParams.delete("_rsc");
  return u.toString();
}

async function cacheAssetsOf(html, cache) {
  const urls = [...new Set(html.match(/\/_next\/static\/[^"'\\\s)]+/g) || [])];
  await Promise.all(urls.map((u) => cache.match(u).then((hit) => hit || cache.add(u).catch(() => {}))));
}

async function savePage(url) {
  const res = await fetch(url, { credentials: "same-origin", redirect: "follow" });
  // A redirect to /login means the session expired: do not store the login page as this page
  if (!res.ok || res.redirected) throw new Error("not stored");
  const html = await res.clone().text();
  await (await caches.open(PAGES)).put(pageKey(url), res);
  await cacheAssetsOf(html, await caches.open(ASSETS));
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || isNoCache(url)) return;

  // React Server Component requests (client-side navigation): network only. When offline the
  // request fails and Next.js falls back to a full page load, which is answered from the cache.
  if (req.headers.get("RSC") === "1" || url.searchParams.has("_rsc")) return;

  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          if (res.ok && !res.redirected && !url.pathname.startsWith("/login")) {
            const copy = res.clone();
            caches.open(PAGES).then((c) => c.put(pageKey(req.url), copy));
          }
          return res;
        } catch {
          const cache = await caches.open(PAGES);
          const hit = (await cache.match(pageKey(req.url))) || (await cache.match(pageKey(req.url), { ignoreSearch: true }));
          return hit || new Response(OFFLINE_HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });
        }
      })(),
    );
    return;
  }

  if (isAsset(url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(ASSETS);
        const hit = await cache.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      })(),
    );
  }
});

// "Für offline speichern": store a list of same-origin pages / photos and report back
self.addEventListener("message", (event) => {
  const data = event.data || {};
  const port = event.ports && event.ports[0];
  if (data.type !== "cache-urls" || !Array.isArray(data.urls) || !port) return;
  event.waitUntil(
    (async () => {
      let ok = 0;
      let failed = 0;
      const assets = await caches.open(ASSETS);
      for (const raw of data.urls.slice(0, 300)) {
        try {
          const url = new URL(raw, self.location.origin);
          if (url.origin !== self.location.origin) throw new Error("foreign");
          if (url.pathname.startsWith("/api/photos/")) await assets.add(url.toString());
          else await savePage(url.toString());
          ok++;
        } catch {
          failed++;
        }
      }
      port.postMessage({ ok, failed });
    })(),
  );
});
