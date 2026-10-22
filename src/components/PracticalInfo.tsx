import { updateDestinationInfo } from "@/app/actions";

type Info = {
  code: string;
  info: string;
  transferInfo: string;
  currency: string;
  tipping: string;
  pharmacy: string;
  doctor: string;
  emergency: string;
};

const FIELDS: { key: keyof Info; label: string; icon: string; placeholder: string }[] = [
  { key: "transferInfo", label: "Transfer vom Flughafen", icon: "🚐", placeholder: "z. B. Shuttle ab Ausgang 3, ca. 25 Min." },
  { key: "currency", label: "Währung", icon: "💶", placeholder: "z. B. Euro (EUR)" },
  { key: "tipping", label: "Trinkgeld", icon: "🪙", placeholder: "z. B. aufrunden, ca. 5–10 %" },
  { key: "pharmacy", label: "Apotheke in Hotelnähe", icon: "💊", placeholder: "Name, Adresse, Öffnungszeiten" },
  { key: "doctor", label: "Arzt / Spital", icon: "🏥", placeholder: "Notfallaufnahme, Adresse" },
  { key: "emergency", label: "Notfallnummern", icon: "🚨", placeholder: "z. B. 112" },
];

export function PracticalInfo({ d, isAdmin }: { d: Info; isAdmin: boolean }) {
  const filled = FIELDS.filter((f) => d[f.key]);
  if (!filled.length && !d.info && !isAdmin) return null;
  return (
    <section className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-black/5" aria-labelledby="info-h">
      <h2 id="info-h" className="mb-3 font-semibold">
        ℹ️ Praktische Infos
      </h2>
      {filled.length > 0 && (
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {filled.map((f) => (
            <div key={f.key} className="flex gap-3">
              <dt className="text-xl leading-6" aria-hidden>
                {f.icon}
              </dt>
              <dd className="min-w-0">
                <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">{f.label}</div>
                <div className="text-sm break-words whitespace-pre-line text-gray-800">{d[f.key]}</div>
              </dd>
            </div>
          ))}
        </dl>
      )}
      {d.info && <p className="mt-3 border-t pt-3 text-sm whitespace-pre-line text-gray-700">{d.info}</p>}
      {!filled.length && !d.info && <p className="text-sm text-gray-500">Noch keine Infos erfasst.</p>}
      {isAdmin && (
        <details className="mt-3">
          <summary className="cursor-pointer text-sm text-brand underline">Infos bearbeiten (Admin)</summary>
          <form action={updateDestinationInfo.bind(null, d.code)} className="mt-3 grid gap-3 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <label key={f.key} className="block text-sm">
                <span className="mb-1 block font-medium">
                  {f.icon} {f.label}
                </span>
                <textarea name={f.key} defaultValue={d[f.key]} rows={2} maxLength={1000} placeholder={f.placeholder} className="w-full rounded-md border p-2" />
              </label>
            ))}
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block font-medium">📝 Weitere Hinweise</span>
              <textarea name="info" defaultValue={d.info} rows={3} maxLength={5000} placeholder="Besonderheiten der Destination" className="w-full rounded-md border p-2" />
            </label>
            <div className="sm:col-span-2">
              <button className="rounded-md bg-brand px-3 py-1.5 text-sm text-brand-contrast">Speichern</button>
            </div>
          </form>
        </details>
      )}
    </section>
  );
}
