export type Category = { slug: string; label: string; icon: string; featured?: boolean; hint?: string };

// Order here is the order shown in the sidebar. The `featured` ones are the
// main categories and are shown large on the destination page.
export const CATEGORIES: Category[] = [
  { slug: "bars-restaurants", label: "Bars & Restaurants", icon: "🍽️", featured: true, hint: "Essen, Drinks, Rooftops" },
  { slug: "shopping", label: "Shopping", icon: "🛍️", featured: true, hint: "Märkte, Malls, Outlets" },
  { slug: "wellness", label: "Wellness", icon: "💆", featured: true, hint: "Spa, Thermen, Massage" },
  { slug: "touren-oepnv", label: "Touren & ÖPNV", icon: "🚌", featured: true, hint: "Ausflüge, Tickets, Mietwagen" },
  { slug: "sport", label: "Sport", icon: "🏃" },
  { slug: "sehenswuerdigkeiten", label: "Sehenswürdigkeiten", icon: "🏛️" },
  { slug: "airport-fb", label: "Airport F&B", icon: "✈️" },
  { slug: "lebensmittel", label: "Lebensmittel", icon: "🛒" },
  { slug: "hilfsorganisationen", label: "Hilfsorganisationen", icon: "🤝" },
  { slug: "sprachtipps", label: "Sprachtipps", icon: "💬" },
  { slug: "geld-atm", label: "Geld & ATM", icon: "💶" },
  { slug: "informationen", label: "Informationen", icon: "ℹ️" },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
