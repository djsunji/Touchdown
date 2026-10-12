import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const destinations = [
  { code: "MUC", city: "München", country: "Deutschland" },
  { code: "OSL", city: "Oslo", country: "Norwegen" },
  { code: "MXP", city: "Mailand", country: "Italien" },
  { code: "LJU", city: "Ljubljana", country: "Slowenien" },
  { code: "BUD", city: "Budapest", country: "Ungarn" },
  { code: "VCE", city: "Venedig", country: "Italien" },
  { code: "FLR", city: "Florenz", country: "Italien" },
  { code: "TLV", city: "Tel Aviv", country: "Israel" },
  { code: "NCE", city: "Nizza", country: "Frankreich" },
  { code: "GOT", city: "Göteborg", country: "Schweden" },
];

async function main() {
  for (const [i, d] of destinations.entries()) {
    // Only city/country/order are overwritten; edited info texts are kept.
    await db.destination.upsert({
      where: { code: d.code },
      update: { city: d.city, country: d.country, sortOrder: i },
      create: { ...d, sortOrder: i },
    });
  }
  console.log(`Seeded ${destinations.length} destinations`);
}

main().finally(() => db.$disconnect());
