// Landmark silhouettes per destination, viewBox 0 0 200 100 (ground at y=100).
// The first twelve cities are drawn here; many more come from the library in ./skylines,
// so a destination added in the admin area gets its real landmark when its IATA code is known.
import { alps, palm, spires, type CityStyle } from "./skylines/shared";
import { LIBRARY } from "./skylines";

export type { CityStyle };

const BUILTIN_STYLE: Record<string, CityStyle> = {
  MUC: {
    sky: ["#1b3b6f", "#7fb0de"],
    ink: "#0c1a31",
    far: "#2c4f80",
    tag: "Frauenkirche",
  },
  OSL: {
    sky: ["#0d3442", "#83c9c8"],
    ink: "#071c24",
    far: "#1f5560",
    tag: "Operahuset",
  },
  MXP: {
    sky: ["#36203d", "#e48b6a"],
    ink: "#1c0e1f",
    far: "#5a3550",
    tag: "Duomo di Milano",
  },
  LJU: {
    sky: ["#1c3a2a", "#a9d08f"],
    ink: "#0d1d14",
    far: "#2f5a40",
    tag: "Ljubljanski grad",
  },
  BUD: {
    sky: ["#3a2810", "#ecb95c"],
    ink: "#1d1308",
    far: "#5e4420",
    tag: "Országház",
  },
  VCE: {
    sky: ["#123a4e", "#f2b07a"],
    ink: "#0a1d27",
    far: "#2a5466",
    tag: "Campanile di San Marco",
  },
  FLR: {
    sky: ["#471c13", "#f29d6c"],
    ink: "#250f09",
    far: "#6a3020",
    tag: "Duomo di Firenze",
  },
  TLV: {
    sky: ["#163a5a", "#f5c27c"],
    ink: "#0a1b2a",
    far: "#2d6c86",
    tag: "Azrieli & Strand",
  },
  NCE: {
    sky: ["#1f2d63", "#f2a7a0"],
    ink: "#120f2e",
    far: "#3a5a9a",
    tag: "Promenade des Anglais",
  },
  GOT: {
    sky: ["#132639", "#86abc6"],
    ink: "#08131d",
    far: "#2b4a63",
    tag: "Läppstiftet & Älvsborgsbron",
  },
  ZRH: {
    sky: ["#14304f", "#9cc3e4"],
    ink: "#0a1626",
    far: "#3d6488",
    tag: "Grossmünster & Zürichsee",
  },
  BRN: {
    sky: ["#2a1f45", "#d9a3a8"],
    ink: "#140f24",
    far: "#54487a",
    tag: "Zytglogge & Bundeshaus",
  },
};

const BUILTIN_SKYLINE: Record<string, (s: CityStyle) => string> = {
  MUC: (s) => {
    return (
      '<path fill="' +
      s.far +
      '" d="M0,72 L22,52 L38,64 L58,40 L80,62 L100,47 L122,63 L142,42 L166,60 L186,50 L200,58 L200,100 L0,100Z"/>' +
      '<g fill="' +
      s.ink +
      '"><rect x="64" y="66" width="72" height="34"/><path d="M84,66 L100,54 L116,66Z"/>' +
      '<rect x="68" y="34" width="18" height="66"/><rect x="114" y="34" width="18" height="66"/>' +
      '<ellipse cx="77" cy="32" rx="10" ry="11"/><ellipse cx="123" cy="32" rx="10" ry="11"/>' +
      '<rect x="76" y="14" width="2" height="10"/><rect x="122" y="14" width="2" height="10"/>' +
      '<rect x="0" y="88" width="64" height="12"/><rect x="136" y="84" width="64" height="16"/>' +
      '<rect x="10" y="80" width="22" height="20"/><rect x="160" y="76" width="18" height="24"/></g>'
    );
  },
  OSL: (s) => {
    let bars = "";
    const hs = [30, 44, 26, 52, 38, 46, 30, 40];
    for (let i = 0; i < hs.length; i++)
      bars +=
        '<rect x="' +
        (128 + i * 9) +
        '" y="' +
        (92 - hs[i]) +
        '" width="7" height="' +
        hs[i] +
        '"/>';
    return (
      '<path fill="' +
      s.far +
      '" d="M0,70 Q40,58 80,66 Q130,74 200,60 L200,100 L0,100Z"/>' +
      '<g fill="' +
      s.ink +
      '">' +
      bars +
      '<path d="M4,92 L34,74 L86,70 L112,58 L124,92Z"/><rect x="92" y="46" width="24" height="16"/></g>' +
      '<rect x="0" y="92" width="200" height="8" fill="' +
      s.ink +
      '" opacity=".85"/>' +
      '<path d="M8,95 L60,95 M90,97 L150,97" stroke="' +
      s.sky[1] +
      '" stroke-width="1" opacity=".5"/>'
    );
  },
  MXP: (s) => {
    return (
      '<path fill="' +
      s.far +
      '" d="M0,80 L30,80 L30,70 L46,70 L46,78 L154,78 L154,66 L172,66 L172,76 L200,76 L200,100 L0,100Z"/>' +
      '<g fill="' +
      s.ink +
      '"><path d="M38,100 L38,66 L100,50 L162,66 L162,100Z"/>' +
      '<path d="' +
      spires(42, 158, 9, 66, 16) +
      '"/>' +
      '<path d="M96,50 L96,30 L104,30 L104,50Z M97,30 L100,8 L103,30Z"/><circle cx="100" cy="7" r="1.8"/>' +
      '<path d="M86,52 L88,36 L90,52Z M110,52 L112,36 L114,52Z"/></g>' +
      '<path d="M92,100 L92,84 Q100,74 108,84 L108,100Z" fill="' +
      s.far +
      '"/>'
    );
  },
  LJU: (s) => {
    return (
      '<path fill="' +
      s.far +
      '" d="M0,78 L30,62 L52,72 L78,54 L104,70 L140,50 L172,66 L200,58 L200,100 L0,100Z" opacity=".7"/>' +
      '<g fill="' +
      s.ink +
      '"><path d="M0,100 L0,78 Q50,46 104,52 Q156,58 200,82 L200,100Z"/>' +
      '<rect x="66" y="40" width="58" height="14"/><rect x="88" y="16" width="16" height="26"/>' +
      '<path d="M86,16 h4 v-4 h4 v4 h4 v-4 h4 v4 h4 v4 h-20Z"/>' +
      '<path d="M66,40 h5 v-4 h5 v4 h5 v-4 h5 v4 h38 v2 h-58Z"/>' +
      '<rect x="96" y="2" width="1.4" height="12"/><path d="M97.4,2 L106,5 L97.4,8Z"/></g>'
    );
  },
  BUD: (s) => {
    let towers = "";
    [24, 44, 64, 136, 156, 176].forEach((x) => {
      towers +=
        '<rect x="' +
        (x - 3) +
        '" y="62" width="6" height="12"/><path d="M' +
        (x - 3) +
        ",62 L" +
        x +
        ",50 L" +
        (x + 3) +
        ',62Z"/>';
    });
    return (
      '<g fill="' +
      s.ink +
      '"><rect x="10" y="72" width="180" height="20"/>' +
      towers +
      '<rect x="82" y="56" width="36" height="18"/><path d="M80,58 Q80,30 100,28 Q120,30 120,58Z"/>' +
      '<rect x="98" y="12" width="4" height="18"/><path d="M98,12 L100,2 L102,12Z"/>' +
      '<path d="M52,72 L52,64 L56,58 L60,64 L60,72Z M140,72 L140,64 L144,58 L148,64 L148,72Z"/></g>' +
      '<rect x="0" y="92" width="200" height="8" fill="' +
      s.far +
      '"/>' +
      '<path d="M14,95 L90,95 M110,97 L186,97" stroke="' +
      s.sky[1] +
      '" stroke-width="1" opacity=".6"/>'
    );
  },
  VCE: (s) => {
    return (
      '<g fill="' +
      s.ink +
      '"><rect x="0" y="74" width="40" height="18"/><rect x="40" y="68" width="30" height="24"/>' +
      '<rect x="70" y="72" width="66" height="20"/><path d="M76,72 Q76,60 84,60 Q92,60 92,72Z M95,72 Q95,56 104,56 Q113,56 113,72Z M116,72 Q116,60 124,60 Q132,60 132,72Z"/><rect x="103" y="50" width="2" height="7"/><rect x="83" y="55" width="2" height="6"/><rect x="123" y="55" width="2" height="6"/>' +
      '<rect x="138" y="26" width="16" height="66"/><rect x="136" y="22" width="20" height="6"/><path d="M137,22 L146,4 L155,22Z"/>' +
      '<rect x="156" y="70" width="44" height="22"/></g>' +
      '<rect x="0" y="92" width="200" height="8" fill="' +
      s.far +
      '"/>' +
      '<path fill="' +
      s.ink +
      '" d="M10,93 Q48,101 92,94 L98,87 Q94,99 50,99 Q22,99 10,93Z"/>' +
      '<path d="M78,95 L72,76" stroke="' +
      s.ink +
      '" stroke-width="1.6"/><circle cx="72" cy="74" r="2.4" fill="' +
      s.ink +
      '"/><rect x="70.5" y="76" width="3" height="9" fill="' +
      s.ink +
      '"/>'
    );
  },
  TLV: (s) => {
    let blocks = "";
    [
      [54, 30],
      [66, 22],
      [78, 40],
      [92, 34],
      [104, 46],
      [178, 36],
      [190, 26],
    ].forEach((b) => {
      blocks +=
        '<rect x="' +
        b[0] +
        '" y="' +
        (92 - b[1]) +
        '" width="11" height="' +
        b[1] +
        '"/>';
    });
    return (
      '<g fill="' +
      s.ink +
      '">' +
      blocks +
      '<rect x="118" y="22" width="16" height="70"/><ellipse cx="126" cy="22" rx="8" ry="3"/>' +
      '<path d="M138,92 L138,26 L156,32 L156,92Z"/><rect x="160" y="18" width="15" height="74"/></g>' +
      palm(s.ink, 12, 30) +
      palm(s.ink, 30, 22) +
      palm(s.ink, 44, 34) +
      '<rect x="0" y="92" width="200" height="8" fill="' +
      s.far +
      '"/>' +
      '<path d="M6,95 L70,95 M100,97 L190,97" stroke="' +
      s.sky[1] +
      '" stroke-width="1" opacity=".6"/>'
    );
  },
  NCE: (s) => {
    let houses = "";
    [
      [56, 20],
      [70, 26],
      [84, 22],
      [98, 28],
      [164, 24],
      [178, 20],
      [190, 26],
    ].forEach((b) => {
      houses +=
        '<rect x="' +
        b[0] +
        '" y="' +
        (92 - b[1]) +
        '" width="13" height="' +
        b[1] +
        '"/>';
    });
    return (
      '<g fill="' +
      s.ink +
      '"><path d="M0,92 L0,54 Q18,44 34,58 Q44,66 52,92Z"/>' +
      houses +
      '<rect x="114" y="58" width="46" height="34"/><path d="M124,58 Q124,38 137,36 Q150,38 150,58Z"/><rect x="136" y="26" width="2" height="11"/>' +
      '<circle cx="137" cy="25" r="1.6"/></g>' +
      palm(s.ink, 62, 26) +
      palm(s.ink, 104, 30) +
      palm(s.ink, 170, 28) +
      '<rect x="0" y="92" width="200" height="8" fill="' +
      s.far +
      '"/>' +
      '<path d="M10,95 L80,95 M120,97 L196,97" stroke="' +
      s.sky[1] +
      '" stroke-width="1" opacity=".6"/>'
    );
  },
  GOT: (s) => {
    return (
      '<g fill="' +
      s.ink +
      '"><rect x="0" y="78" width="30" height="14"/><rect x="58" y="80" width="40" height="12"/>' +
      '<rect x="34" y="20" width="18" height="72"/><rect x="34" y="20" width="18" height="12" fill="#b8323b"/>' +
      '<rect x="112" y="36" width="4" height="56"/><rect x="172" y="36" width="4" height="56"/>' +
      '<rect x="96" y="76" width="104" height="3"/></g>' +
      '<path d="M98,76 Q114,36 114,36 Q144,70 174,36 Q190,60 200,72" stroke="' +
      s.ink +
      '" stroke-width="1.2" fill="none"/>' +
      '<path d="M66,80 L66,44 L92,44 M66,52 L82,44 M86,44 L86,56" stroke="' +
      s.ink +
      '" stroke-width="2" fill="none"/>' +
      '<rect x="0" y="92" width="200" height="8" fill="' +
      s.far +
      '"/>' +
      '<path d="M8,95 L60,95 M120,97 L190,97" stroke="' +
      s.sky[1] +
      '" stroke-width="1" opacity=".5"/>'
    );
  },
  FLR: (s) => {
    return (
      '<path fill="' +
      s.far +
      '" d="M0,74 Q40,56 84,66 Q130,52 200,68 L200,100 L0,100Z"/>' +
      '<g fill="' +
      s.ink +
      '"><rect x="0" y="78" width="200" height="22"/>' +
      '<rect x="22" y="22" width="10" height="56"/><rect x="19" y="18" width="16" height="6"/><rect x="25" y="8" width="4" height="10"/>' +
      '<rect x="62" y="62" width="64" height="16"/><path d="M68,62 Q68,30 94,28 Q120,30 120,62Z"/>' +
      '<rect x="91" y="18" width="6" height="11"/><path d="M91,18 L94,10 L97,18Z"/>' +
      '<rect x="140" y="26" width="15" height="52"/><rect x="138" y="22" width="19" height="5"/></g>' +
      '<path d="M76,60 Q78,40 94,34 M112,60 Q110,40 94,34" stroke="' +
      s.sky[1] +
      '" stroke-width=".8" fill="none" opacity=".35"/>'
    );
  },
  ZRH: (s) => {
    // Grossmünster twin towers, Fraumünster spire, St. Peter clock tower, lake in front
    return (
      alps(s) +
      '<g fill="' +
      s.ink +
      '"><rect x="0" y="76" width="200" height="16"/>' +
      '<rect x="6" y="66" width="14" height="12"/><path d="M5,66 L13,58 L21,66Z"/><rect x="22" y="70" width="12" height="8"/><path d="M21,70 L28,63 L35,70Z"/>' +
      '<rect x="40" y="38" width="8" height="40"/><path d="M39,38 L44,10 L49,38Z"/><rect x="48" y="58" width="20" height="20"/><path d="M47,58 L58,50 L69,58Z"/>' +
      '<rect x="88" y="56" width="34" height="22"/><path d="M87,56 L105,46 L123,56Z"/>' +
      '<rect x="84" y="28" width="11" height="50"/><rect x="115" y="28" width="11" height="50"/>' +
      '<path d="M83,28 Q89.5,16 96,28Z M114,28 Q120.5,16 127,28Z"/><rect x="89" y="13" width="1.2" height="7"/><rect x="120" y="13" width="1.2" height="7"/>' +
      '<rect x="146" y="40" width="12" height="38"/><path d="M145,40 L152,16 L159,40Z"/>' +
      '<rect x="160" y="64" width="16" height="14"/><path d="M159,64 L168,56 L177,64Z"/><rect x="178" y="68" width="22" height="10"/></g>' +
      '<circle cx="152" cy="47" r="3.2" fill="' +
      s.sky[1] +
      '" opacity=".75"/>' +
      '<rect x="0" y="88" width="200" height="12" fill="' +
      s.far +
      '"/>' +
      '<path d="M8,93 L64,93 M96,96 L150,96 M168,92 L196,92" stroke="' +
      s.sky[1] +
      '" stroke-width="1" opacity=".55"/>'
    );
  },
  BRN: (s) => {
    // Zytglogge clock tower, Bundeshaus with its dome, Münster spire, Aare below
    return (
      alps(s) +
      '<g fill="' +
      s.ink +
      '"><path d="M0,100 L0,78 Q100,70 200,80 L200,100Z"/>' +
      '<rect x="14" y="40" width="16" height="42"/><path d="M12,40 L22,22 L32,40Z"/><rect x="21.4" y="14" width="1.2" height="9"/>' +
      '<rect x="0" y="68" width="14" height="14"/><rect x="30" y="66" width="18" height="16"/><path d="M29,66 L39,58 L49,66Z"/>' +
      '<rect x="56" y="58" width="70" height="22"/><rect x="80" y="48" width="22" height="12"/>' +
      '<path d="M78,49 Q78,30 91,28 Q104,30 104,49Z"/><rect x="90" y="20" width="2" height="9"/><circle cx="91" cy="19" r="1.6"/>' +
      '<path d="M56,58 Q56,50 62,50 Q68,50 68,58Z M114,58 Q114,50 120,50 Q126,50 126,58Z"/>' +
      '<rect x="138" y="62" width="34" height="18"/><path d="M137,62 L155,52 L173,62Z"/>' +
      '<rect x="156" y="30" width="12" height="34"/><rect x="155" y="26" width="14" height="5"/><path d="M156,26 L162,6 L168,26Z"/>' +
      '<rect x="176" y="68" width="24" height="12"/></g>' +
      '<circle cx="22" cy="47" r="4" fill="' +
      s.sky[1] +
      '" opacity=".8"/><path d="M22,47 L22,44.5 M22,47 L24,48" stroke="' +
      s.ink +
      '" stroke-width=".8"/>' +
      '<path d="M0,94 Q60,86 110,92 Q160,98 200,90 L200,100 L0,100Z" fill="' +
      s.far +
      '"/>' +
      '<path d="M14,95 Q50,90 90,93 M130,96 Q160,95 186,92" stroke="' +
      s.sky[1] +
      '" stroke-width="1" fill="none" opacity=".55"/>'
    );
  },
};

export const CITY_STYLE: Record<string, CityStyle> = {
  ...Object.fromEntries(
    Object.entries(LIBRARY).map(([code, c]) => [code, c.style]),
  ),
  ...BUILTIN_STYLE,
};
const SKYLINE: Record<string, (s: CityStyle) => string> = {
  ...Object.fromEntries(
    Object.entries(LIBRARY).map(([code, c]) => [code, c.draw]),
  ),
  ...BUILTIN_SKYLINE,
};

/** City data for a known IATA code (used to fill the admin form), or null */
export function knownCity(code: string) {
  const c = Object.hasOwn(LIBRARY, code) ? LIBRARY[code] : null;
  return c
    ? {
        city: c.city,
        country: c.country,
        timezone: c.timezone,
        tag: c.style.tag,
      }
    : null;
}

// ---------- Generated artwork for destinations added in the app ----------
// A random "art seed" (stored per destination, re-rollable in the admin area) picks the evening
// palette, the background, the old town, one or two landmarks, water, trees and the moon.

function rng(key: string) {
  // string hash -> mulberry32
  let h = 1779033703 ^ key.length;
  for (let i = 0; i < key.length; i++) {
    h = Math.imul(h ^ key.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A new random art seed (1 … 999999) */
export function newArtSeed() {
  return 1 + Math.floor(Math.random() * 999999);
}

// Evening palettes in the style of the built-in cities (sky top, sky bottom, silhouette, background)
const PALETTES: [string, string, string, string][] = [
  ["#1d2f5c", "#e9a27a", "#0e1430", "#3b4f86"],
  ["#2b1a3f", "#e58f8f", "#150c22", "#56386e"],
  ["#0f3a48", "#9fd3c7", "#06191f", "#2a6170"],
  ["#3b1f12", "#f0b26a", "#1f0f08", "#6e3e22"],
  ["#1a2a4a", "#a8b8e8", "#0a1226", "#3c5488"],
  ["#401a2c", "#f39c8b", "#220c17", "#6f3049"],
  ["#13324a", "#f4c98a", "#08182a", "#2e5f7e"],
  ["#22323a", "#c5d6c0", "#0e171b", "#4a6266"],
  ["#2e1d52", "#c79ae0", "#160d2c", "#5a3f8a"],
  ["#173d33", "#e7c37f", "#0a1e19", "#356a58"],
  ["#0b2440", "#5fa8d3", "#04101d", "#22507a"],
  ["#3d1530", "#f6b26b", "#1d0917", "#6b2f52"],
  ["#1c3b2a", "#d8e2a0", "#0b1a12", "#3e6b4c"],
  ["#2a2a48", "#f2d0a4", "#121224", "#4d4d7a"],
];

const key = (code: string, seed: number) => `${code}:${seed}`;

/** Colours for a destination: hand-picked for the built-in ones, generated otherwise. */
export function styleFor(code: string, seed = 0, tag = ""): CityStyle {
  if (Object.hasOwn(CITY_STYLE, code)) return CITY_STYLE[code];
  const p = PALETTES[Math.floor(rng(key(code, seed))() * PALETTES.length)];
  return { sky: [p[0], p[1]], ink: p[2], far: p[3], tag };
}

const n = (v: number) => v.toFixed(1);
const LANDMARKS = 14;

/** One landmark centred at x, standing on the ground line y=92 */
function landmark(kind: number, x: number, s: CityStyle) {
  const ink = s.ink;
  const glow = s.sky[1];
  switch (kind) {
    case 0: // cathedral with a dome
      return `<rect x="${x - 22}" y="62" width="44" height="30"/><path d="M${x - 16},63 Q${x - 16},38 ${x},36 Q${x + 16},38 ${x + 16},63Z"/><rect x="${x - 1}" y="24" width="2" height="13"/><circle cx="${x}" cy="23" r="1.8"/>`;
    case 1: // church with a tall spire
      return `<rect x="${x - 18}" y="64" width="30" height="28"/><path d="M${x - 19},64 L${x - 3},54 L${x + 13},64Z"/><rect x="${x + 10}" y="36" width="12" height="56"/><path d="M${x + 9},36 L${x + 16},8 L${x + 23},36Z"/>`;
    case 2: // twin towers
      return `<rect x="${x - 16}" y="60" width="32" height="32"/><rect x="${x - 20}" y="30" width="11" height="62"/><rect x="${x + 9}" y="30" width="11" height="62"/><path d="M${x - 21},30 L${x - 14.5},16 L${x - 8},30Z M${x + 8},30 L${x + 14.5},16 L${x + 21},30Z"/>`;
    case 3: // clock tower
      return `<rect x="${x - 8}" y="34" width="16" height="58"/><path d="M${x - 10},34 L${x},14 L${x + 10},34Z"/><circle cx="${x}" cy="44" r="4" fill="${glow}" opacity=".8"/><path d="M${x},44 L${x},41 M${x},44 L${x + 2},45" stroke="${ink}" stroke-width=".8"/>`;
    case 4: // modern towers
      return `<rect x="${x - 20}" y="30" width="13" height="62"/><path d="M${x - 4},92 L${x - 4},18 L${x + 10},26 L${x + 10},92Z"/><rect x="${x + 13}" y="40" width="11" height="52"/><rect x="${x + 2}" y="10" width="1.2" height="10"/>`;
    case 5: // castle on a hill
      return `<path d="M${x - 36},92 Q${x},58 ${x + 36},92Z"/><rect x="${x - 18}" y="56" width="36" height="14"/><rect x="${x - 6}" y="38" width="12" height="20"/><path d="M${x - 18},56 h4 v-4 h4 v4 h4 v-4 h4 v4 h4 v-4 h4 v4 h4 v-4 h4 v4Z M${x - 7},38 h3 v-3 h3 v3 h2 v-3 h3 v3 h2 v2 h-13Z"/>`;
    case 6: // lighthouse
      return `<path d="M${x - 7},92 L${x - 4},34 L${x + 4},34 L${x + 7},92Z"/><rect x="${x - 6}" y="30" width="12" height="4"/><rect x="${x - 4}" y="22" width="8" height="8" fill="${glow}" opacity=".85"/><path d="M${x - 5},22 L${x},15 L${x + 5},22Z"/><path d="M${x + 4},26 L${x + 40},18 L${x + 40},32Z" fill="${glow}" opacity=".18"/>`;
    case 7: // TV tower
      return `<path d="M${x - 5},92 L${x - 2},20 L${x + 2},20 L${x + 5},92Z"/><circle cx="${x}" cy="30" r="7"/><rect x="${x - 0.6}" y="2" width="1.2" height="20"/><rect x="${x - 4}" y="40" width="8" height="2"/>`;
    case 8: // ferris wheel
      return `<g fill="none" stroke="${ink}" stroke-width="1.6"><circle cx="${x}" cy="50" r="30"/><path d="M${x - 30},50 L${x + 30},50 M${x},20 L${x},80 M${x - 21},29 L${x + 21},71 M${x + 21},29 L${x - 21},71"/></g><path d="M${x - 14},92 L${x},50 L${x + 14},92Z"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<circle cx="${n(x + 30 * Math.cos((i * Math.PI) / 4))}" cy="${n(50 + 30 * Math.sin((i * Math.PI) / 4))}" r="2.4"/>`).join("")}`;
    case 9: // triumphal arch / city gate
      return `<path d="M${x - 24},92 L${x - 24},44 L${x + 24},44 L${x + 24},92 L${x + 10},92 L${x + 10},70 Q${x},58 ${x - 10},70 L${x - 10},92Z"/><rect x="${x - 27}" y="38" width="54" height="7"/><rect x="${x - 10}" y="30" width="20" height="8"/>`;
    case 10: // basilica with minarets
      return `<rect x="${x - 20}" y="64" width="40" height="28"/><path d="M${x - 15},65 Q${x - 15},40 ${x},38 Q${x + 15},40 ${x + 15},65Z"/><rect x="${x - 0.8}" y="28" width="1.6" height="10"/><rect x="${x - 32}" y="30" width="5" height="62"/><rect x="${x + 27}" y="30" width="5" height="62"/><path d="M${x - 33},30 L${x - 29.5},20 L${x - 26},30Z M${x + 26},30 L${x + 29.5},20 L${x + 33},30Z"/>`;
    case 11: // windmill
      return `<path d="M${x - 9},92 L${x - 6},50 L${x + 6},50 L${x + 9},92Z"/><path d="M${x - 7},50 L${x},42 L${x + 7},50Z"/><g stroke="${ink}" stroke-width="3"><path d="M${x - 20},26 L${x + 20},66 M${x + 20},26 L${x - 20},66"/></g>`;
    case 12: // suspension bridge over water
      return `<rect x="${x - 50}" y="74" width="100" height="3"/><rect x="${x - 30}" y="40" width="4" height="52"/><rect x="${x + 26}" y="40" width="4" height="52"/><path d="M${x - 50},70 Q${x - 40},70 ${x - 28},42 Q${x},72 ${x + 28},42 Q${x + 40},70 ${x + 50},70" stroke="${ink}" stroke-width="1.2" fill="none"/>`;
    default: // fortress with round towers
      return `<rect x="${x - 26}" y="58" width="52" height="34"/><rect x="${x - 32}" y="46" width="14" height="46" rx="2"/><rect x="${x + 18}" y="46" width="14" height="46" rx="2"/><path d="M${x - 33},46 L${x - 25},34 L${x - 17},46Z M${x + 17},46 L${x + 25},34 L${x + 33},46Z"/><path d="M${x - 26},58 h4 v-4 h4 v4 h4 v-4 h4 v4 h4 v-4 h4 v4 h4 v-4 h4 v4 h4 v-4 h4 v4 h4 v-4 h4v4Z"/>`;
  }
}

function tree(x: number, h: number, ink: string) {
  return `<rect x="${x - 0.8}" y="${92 - h}" width="1.6" height="${h}" fill="${ink}"/><circle cx="${x}" cy="${92 - h}" r="${n(h / 2.4)}" fill="${ink}"/>`;
}

function generatedSkyline(code: string, seed: number) {
  return (s: CityStyle) => {
    const r = rng(key(code, seed) + "/sky");
    // Background: 0 mountains, 1 snowy alps, 2 hills with distant town, 3 sea horizon, 4 distant skyline
    const bg = Math.floor(r() * 5);
    let far = "";
    if (bg === 0 || bg === 1) {
      let d = "M0,74";
      const peaks: [number, number][] = [];
      for (let x = 0; x <= 200; x += 22 + Math.floor(r() * 12)) {
        const py = 26 + r() * 28;
        peaks.push([x + 11, py]);
        d += ` L${x + 11},${n(py)} L${x + 22},${n(52 + r() * 14)}`;
      }
      far = `<path fill="${s.far}" d="${d} L200,100 L0,100Z"/>`;
      if (bg === 1)
        for (const [px, py] of peaks)
          far += `<path fill="#fff" opacity=".5" d="M${px - 5},${n(py + 6)} L${px},${n(py)} L${px + 5},${n(py + 6)} L${px + 2},${n(py + 4.5)} L${px - 2},${n(py + 6.5)}Z"/>`;
    } else if (bg === 2) {
      far = `<path fill="${s.far}" d="M0,${n(58 + r() * 10)} Q50,${n(40 + r() * 14)} 100,${n(54 + r() * 10)} Q150,${n(44 + r() * 14)} 200,${n(52 + r() * 10)} L200,100 L0,100Z"/>`;
      for (let i = 0; i < 7; i++) {
        const x = Math.floor(r() * 190);
        const h = 8 + Math.floor(r() * 14);
        far += `<rect x="${x}" y="${78 - h}" width="${6 + Math.floor(r() * 6)}" height="${h + 14}" fill="${s.far}"/>`;
      }
    } else if (bg === 3) {
      far = `<rect x="0" y="${n(66 + r() * 8)}" width="200" height="40" fill="${s.far}" opacity=".7"/>`;
      if (r() < 0.6)
        far += `<path fill="${s.far}" d="M${n(120 + r() * 40)},74 Q170,${n(54 + r() * 10)} 200,${n(60 + r() * 8)} L200,80 L120,80Z"/>`;
    } else {
      for (let x = 0; x < 200; x += 6 + Math.floor(r() * 6)) {
        const h = 10 + Math.floor(r() * 34);
        far += `<rect x="${x}" y="${84 - h}" width="${5 + Math.floor(r() * 5)}" height="${h + 16}" fill="${s.far}"/>`;
      }
    }

    // Landmarks: one main, sometimes a second smaller one
    const main = Math.floor(r() * LANDMARKS);
    const lx = 60 + Math.floor(r() * 80);
    const second = r() < 0.45 ? Math.floor(r() * LANDMARKS) : -1;
    const sx =
      lx < 100 ? 150 + Math.floor(r() * 30) : 25 + Math.floor(r() * 25);
    const gaps: [number, number][] = [[lx - 36, lx + 36]];
    if (second >= 0) gaps.push([sx - 26, sx + 26]);

    // Old town: gabled, flat, stepped or domed roofs
    const roofStyle = Math.floor(r() * 4);
    const minH = 10 + Math.floor(r() * 8);
    const varH = 14 + Math.floor(r() * 22);
    let houses = "";
    for (let x = 0; x < 200; ) {
      const w = 8 + Math.floor(r() * 14);
      const h = minH + Math.floor(r() * varH);
      const gap = gaps.find(([a, b]) => x + w > a && x < b);
      if (gap) {
        x = gap[1];
        continue;
      }
      const top = 92 - h;
      houses += `<rect x="${x}" y="${top}" width="${w}" height="${h}"/>`;
      const roll = r();
      if (roofStyle === 0 && roll < 0.7)
        houses += `<path d="M${x - 1},${top} L${n(x + w / 2)},${n(top - 5 - r() * 5)} L${x + w + 1},${top}Z"/>`;
      if (roofStyle === 2 && roll < 0.6)
        houses += `<path d="M${x},${top} h${n(w / 4)} v-3 h${n(w / 4)} v-3 h${n(w / 4)} v3 h${n(w / 4)} v3Z"/>`;
      if (roofStyle === 3 && roll < 0.35)
        houses += `<path d="M${x},${top} Q${n(x + w / 2)},${n(top - w * 0.7)} ${x + w},${top}Z"/>`;
      // a few lit windows
      if (r() < 0.5)
        houses += `<rect x="${n(x + w / 2 - 1)}" y="${n(top + 4 + r() * (h - 10))}" width="2" height="2.4" fill="${s.sky[1]}" opacity=".55"/>`;
      x += w + Math.floor(r() * 3);
    }

    const scale = 1.1 + r() * 0.3;
    const lm = (kind: number, x: number, k: number) =>
      `<g transform="translate(${x},92) scale(${n(k)}) translate(${-x},-92)">${landmark(kind, x, s)}</g>`;

    // Trees or palms in front
    let greens = "";
    const greenKind = Math.floor(r() * 3); // 0 none, 1 trees, 2 palms
    if (greenKind) {
      for (let i = 0; i < 2 + Math.floor(r() * 3); i++) {
        const x = Math.floor(r() * 196) + 2;
        greens +=
          greenKind === 1
            ? tree(x, 8 + Math.floor(r() * 8), s.ink)
            : palm(s.ink, x, 18 + Math.floor(r() * 14));
      }
    }

    // Ground: water with reflections and boats, or a solid quay
    const water = bg === 3 || main === 12 || r() < 0.4;
    let ground = `<rect x="0" y="92" width="200" height="8" fill="${water ? s.far : s.ink}"/>`;
    if (water) {
      ground += `<path d="M${6 + Math.floor(r() * 20)},95 L${60 + Math.floor(r() * 30)},95 M${100 + Math.floor(r() * 20)},97 L${170 + Math.floor(r() * 25)},97" stroke="${s.sky[1]}" stroke-width="1" opacity=".55"/>`;
      if (r() < 0.6) {
        const bx = 20 + Math.floor(r() * 160);
        ground += `<path fill="${s.ink}" d="M${bx - 8},94 L${bx + 8},94 L${bx + 5},97 L${bx - 5},97Z M${bx},94 L${bx},84 L${bx + 6},92Z"/>`;
      }
    }

    return (
      far +
      `<g fill="${s.ink}">${houses}${lm(main, lx, scale)}${second >= 0 ? lm(second, sx, 0.8) : ""}</g>` +
      greens +
      ground
    );
  };
}

/** Static SVG artwork (sky + landmark silhouette) for a destination card. */
export function cityArt(code: string, seed = 0): string {
  const s = styleFor(code, seed);
  const custom: ((s: CityStyle) => string) | undefined = Object.hasOwn(
    SKYLINE,
    code,
  )
    ? SKYLINE[code]
    : undefined;
  const draw = custom ?? generatedSkyline(code, seed);
  const id = `${code}${custom ? "" : seed}`;
  const r = rng(key(code, custom ? 0 : seed) + "/stars");
  let stars = "";
  for (let i = 0; i < 10 + Math.floor(r() * 10); i++) {
    stars += `<circle cx="${n(r() * 200)}" cy="${n(r() * 45)}" r="${i % 3 === 0 ? 0.9 : 0.5}" fill="#fff" opacity="${n(0.4 + (i % 4) * 0.15)}"/>`;
  }
  // Moon: crescent top right for the built-in cities, varying for generated ones
  const mx = custom ? 160 : 145 + Math.floor(r() * 35);
  const my = custom ? 42 : 112 + Math.floor(r() * 22);
  const full = !custom && r() < 0.25;
  const moon = full
    ? `<circle cx="${mx}" cy="${my}" r="9" fill="#fff6dc" opacity=".9"/>`
    : `<mask id="m${id}"><rect width="200" height="250" fill="#fff"/><circle cx="${mx + 6}" cy="${my - 5}" r="10" fill="#000"/></mask><circle cx="${mx}" cy="${my}" r="11" fill="#fff6dc" opacity=".92" mask="url(#m${id})"/>`;
  return (
    '<svg class="art" viewBox="0 0 200 250" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
    `<defs><linearGradient id="g${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.sky[0]}"/><stop offset="1" stop-color="${s.sky[1]}"/></linearGradient></defs>` +
    `<rect width="200" height="250" fill="url(#g${id})"/>` +
    `<g>${stars}</g>${moon}` +
    `<g class="sil" transform="translate(0,150)">${draw(s)}</g></svg>`
  );
}
