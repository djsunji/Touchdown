"use client";

import { useActionState, useEffect, useState } from "react";
import { deleteDestination, saveDestination } from "@/app/admin/actions";
import { CITY_STYLE, cityArt, knownCity, newArtSeed } from "@/lib/cityArt";
import type { FormState } from "@/app/actions";

type Dest = {
  code: string;
  city: string;
  country: string;
  timezone: string;
  active: boolean;
  hotelName: string | null;
  hotelAddress: string | null;
  landmark: string;
  artSeed: number;
};

const input = "w-full rounded-md border px-3 py-2";
const INITIAL: FormState = {};

/** Create a destination (no `d`) or edit one. Saving needs no deploy. */
export function DestinationForm({ d }: { d?: Dest }) {
  const mode = d ? "update" : "create";
  const [state, action, pending] = useActionState<FormState, FormData>(
    saveDestination.bind(null, mode),
    INITIAL,
  );
  const saved = !pending && state !== INITIAL && !state.error;
  // Live preview of the city card; the artwork is generated from the IATA code
  const [code, setCode] = useState(d?.code ?? "");
  const [city, setCity] = useState(d?.city ?? "");
  const [country, setCountry] = useState(d?.country ?? "");
  const [timezone, setTimezone] = useState(d?.timezone ?? "Europe/Zurich");
  const [landmark, setLandmark] = useState(d?.landmark ?? "");
  // New destinations start with a random picture (set after hydration); "Neue Grafik" rolls another one
  const [seed, setSeed] = useState(d?.artSeed ?? 0);
  useEffect(() => {
    if (!d) setSeed(newArtSeed());
  }, [d]);
  const previewCode = /^[A-Za-z]{3}$/.test(code) ? code.toUpperCase() : "";
  const handDrawn = !!previewCode && Object.hasOwn(CITY_STYLE, previewCode);
  // A code from the drawn library fills in city, country and time zone (fields the admin left untouched)
  const [autofilled, setAutofilled] = useState({
    city: "",
    country: "",
    timezone: "",
  });
  function changeCode(value: string) {
    setCode(value);
    const known = /^[A-Za-z]{3}$/.test(value)
      ? knownCity(value.toUpperCase())
      : null;
    if (!known) return;
    const untouched = (cur: string, prev: string, dflt = "") =>
      !cur || cur === prev || cur === dflt;
    if (untouched(city, autofilled.city)) setCity(known.city);
    if (untouched(country, autofilled.country)) setCountry(known.country);
    if (untouched(timezone, autofilled.timezone, "Europe/Zurich"))
      setTimezone(known.timezone);
    setAutofilled({
      city: known.city,
      country: known.country,
      timezone: known.timezone,
    });
  }
  return (
    <>
      <form action={action} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">IATA-Code</span>
          {d ? (
            <>
              <input type="hidden" name="code" value={d.code} />
              <input
                value={d.code}
                disabled
                className={`${input} bg-gray-50`}
              />
            </>
          ) : (
            <input
              name="code"
              required
              maxLength={3}
              placeholder="z. B. LIS"
              className={`${input} uppercase`}
              autoCapitalize="characters"
              value={code}
              onChange={(e) => changeCode(e.target.value)}
            />
          )}
        </label>
        <div className="sm:col-start-3 sm:row-span-4 sm:row-start-1">
          <input type="hidden" name="artSeed" value={seed} />
          <TilePreview
            seed={seed}
            code={previewCode}
            city={city}
            country={country}
            landmark={
              landmark || (previewCode && CITY_STYLE[previewCode]?.tag) || ""
            }
          />
          {previewCode && (
            <p className="mt-2 w-[168px] text-xs text-gray-600">
              {handDrawn
                ? `Gezeichnete Grafik mit ${CITY_STYLE[previewCode].tag}`
                : `Für ${previewCode} gibt es noch keine gezeichnete Stadt, die Grafik wird erzeugt.`}
            </p>
          )}
          {previewCode && !handDrawn && (
            <button
              type="button"
              onClick={() => setSeed(newArtSeed())}
              className="mt-2 w-[168px] rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              🎲 Neue Grafik
            </button>
          )}
        </div>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Zeitzone</span>
          <input
            name="timezone"
            required
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            placeholder="z. B. Europe/Lisbon"
            className={input}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Stadt</span>
          <input
            name="city"
            required
            maxLength={80}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={input}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Land</span>
          <input
            name="country"
            required
            maxLength={80}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={input}
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">
            Wahrzeichen (Text auf der Kachel, optional)
          </span>
          <input
            name="landmark"
            maxLength={60}
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            placeholder={
              handDrawn ? CITY_STYLE[previewCode].tag : "z. B. Torre de Belém"
            }
            className={input}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Crew-Hotel</span>
          <input
            name="hotelName"
            maxLength={150}
            defaultValue={d?.hotelName ?? ""}
            placeholder="Name des Hotels"
            className={input}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Hotel-Adresse</span>
          <input
            name="hotelAddress"
            maxLength={300}
            defaultValue={d?.hotelAddress ?? ""}
            className={input}
          />
        </label>
        <label className="flex items-center gap-2 text-sm sm:col-span-3">
          <input
            type="checkbox"
            name="active"
            defaultChecked={d?.active ?? true}
          />
          Aktiv (auf der Startseite sichtbar)
        </label>
        <div className="flex items-center gap-3 sm:col-span-3">
          <button
            disabled={pending}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-contrast disabled:opacity-60"
          >
            {pending ? "Speichere…" : d ? "Speichern" : "Destination anlegen"}
          </button>
          {state.error && (
            <p className="text-sm text-red-600" role="alert">
              {state.error}
            </p>
          )}
          {saved && <p className="text-sm text-green-700">Gespeichert ✓</p>}
        </div>
      </form>
      {d && <DeleteDestination code={d.code} city={d.city} />}
    </>
  );
}

/** The city card as it will appear on the home page */
function TilePreview({
  seed,
  code,
  city,
  country,
  landmark,
}: {
  seed: number;
  code: string;
  city: string;
  country: string;
  landmark: string;
}) {
  return (
    <div>
      <span className="mb-1 block text-sm font-medium">Kachel</span>
      <div
        className="dest pointer-events-none"
        style={{ width: 168 }}
        aria-hidden
      >
        {code ? (
          // Artwork is generated from the 3-letter code only (validated above), no free text
          <span
            className="art-wrap"
            dangerouslySetInnerHTML={{ __html: cityArt(code, seed) }}
          />
        ) : (
          <span className="art-wrap bg-gray-300" />
        )}
        <span className="top-txt">
          <span className="code">{code || "???"}</span>
          <span className="city">{city || "Stadt"}</span>
          <span className="country">{country || "Land"}</span>
        </span>
        <span className="bottom-txt">
          <span className="pill">0 Tipps</span>
          <span className="landmark">{landmark}</span>
          <span className="go">→</span>
        </span>
      </div>
    </div>
  );
}

function DeleteDestination({ code, city }: { code: string; city: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    deleteDestination.bind(null, code),
    INITIAL,
  );
  return (
    <details className="mt-4 rounded-md border border-red-200 p-3">
      <summary className="cursor-pointer text-sm font-medium text-red-700">
        🗑 Destination entfernen…
      </summary>
      <form action={action} className="mt-2 space-y-2 text-sm">
        <p className="text-gray-700">
          Löscht {city} mit{" "}
          <b>
            allen Tipps, Fotos, Kommentaren, Chat-Nachrichten und Treffpunkten
          </b>
          . Das lässt sich nicht rückgängig machen. Zum Ausblenden reicht es,
          «Aktiv» auszuschalten.
        </p>
        <label className="block">
          Zum Bestätigen <b>{code}</b> eintippen:
          <input
            name="confirm"
            autoComplete="off"
            className="ml-2 w-24 rounded-md border px-2 py-1 uppercase"
          />
        </label>
        <button
          disabled={pending}
          className="rounded-md bg-red-600 px-3 py-1.5 text-white hover:bg-red-700 disabled:opacity-60"
        >
          {pending ? "Lösche…" : `${code} endgültig löschen`}
        </button>
        {state.error && (
          <p className="text-red-600" role="alert">
            {state.error}
          </p>
        )}
      </form>
    </details>
  );
}
