import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// Starting destinations. Admins add, edit and delete destinations in the app (/admin).
// Each seed version runs only once per database (recorded in AppSetting), so a destination
// an admin deleted is not recreated on the next start. Bump SEED_VERSION when adding cities here.
const SEED_VERSION = "2";

const CH_EMERGENCY = "112 Notruf · 117 Polizei · 144 Sanität · 118 Feuerwehr";
const destinations = [
  { code: "MUC", city: "München", country: "Deutschland", timezone: "Europe/Berlin", currency: "Euro (EUR)", emergency: "112 Feuerwehr/Ambulanz · 110 Polizei" },
  { code: "OSL", city: "Oslo", country: "Norwegen", timezone: "Europe/Oslo", currency: "Norwegische Krone (NOK)", emergency: "112 Polizei · 113 Ambulanz · 110 Feuerwehr" },
  { code: "MXP", city: "Mailand", country: "Italien", timezone: "Europe/Rome", currency: "Euro (EUR)", emergency: "112" },
  { code: "LJU", city: "Ljubljana", country: "Slowenien", timezone: "Europe/Ljubljana", currency: "Euro (EUR)", emergency: "112 Notruf · 113 Polizei" },
  { code: "BUD", city: "Budapest", country: "Ungarn", timezone: "Europe/Budapest", currency: "Forint (HUF)", emergency: "112" },
  { code: "VCE", city: "Venedig", country: "Italien", timezone: "Europe/Rome", currency: "Euro (EUR)", emergency: "112" },
  { code: "FLR", city: "Florenz", country: "Italien", timezone: "Europe/Rome", currency: "Euro (EUR)", emergency: "112" },
  { code: "TLV", city: "Tel Aviv", country: "Israel", timezone: "Asia/Jerusalem", currency: "Schekel (ILS)", emergency: "100 Polizei · 101 Ambulanz · 102 Feuerwehr" },
  { code: "NCE", city: "Nizza", country: "Frankreich", timezone: "Europe/Paris", currency: "Euro (EUR)", emergency: "112 · 15 Ambulanz (SAMU)" },
  { code: "GOT", city: "Göteborg", country: "Schweden", timezone: "Europe/Stockholm", currency: "Schwedische Krone (SEK)", emergency: "112" },
  { code: "ZRH", city: "Zürich", country: "Schweiz", timezone: "Europe/Zurich", currency: "Schweizer Franken (CHF)", emergency: CH_EMERGENCY },
  { code: "BRN", city: "Bern", country: "Schweiz", timezone: "Europe/Zurich", currency: "Schweizer Franken (CHF)", emergency: CH_EMERGENCY },
];

async function main() {
  const done = await db.appSetting.findUnique({ where: { key: "seedVersion" } });
  if (done?.value === SEED_VERSION) {
    console.log(`Seed ${SEED_VERSION} already applied`);
    return;
  }
  const last = await db.destination.aggregate({ _max: { sortOrder: true } });
  let next = (last._max.sortOrder ?? -1) + 1;
  for (const d of destinations) {
    const existing = await db.destination.findUnique({ where: { code: d.code } });
    if (!existing) {
      await db.destination.create({ data: { ...d, sortOrder: next++ } });
      continue;
    }
    // Only fill fields that are still empty, never overwrite edits made in the app
    await db.destination.update({
      where: { code: d.code },
      data: {
        ...(existing.timezone === "Europe/Zurich" ? { timezone: d.timezone } : {}),
        ...(existing.currency ? {} : { currency: d.currency }),
        ...(existing.emergency ? {} : { emergency: d.emergency }),
      },
    });
  }
  await db.appSetting.upsert({ where: { key: "seedVersion" }, update: { value: SEED_VERSION }, create: { key: "seedVersion", value: SEED_VERSION } });
  console.log(`Seed ${SEED_VERSION}: checked ${destinations.length} destinations`);
}

main().finally(() => db.$disconnect());
