import { palm, spires, type CityStyle, type LibraryCity } from "./shared";

// Hand-drawn skylines: Italy, Malta and Croatia

// Round-topped arch opening of width w and height h, top-left at x,y
function arch(x: number, y: number, w: number, h: number) {
  const r = w / 2;
  return `M${x},${y + h} V${y + r} A${r},${r} 0 0 1 ${x + w},${y + r} V${y + h}Z`;
}

// A row of arches from x0 to x1
function arches(
  x0: number,
  x1: number,
  step: number,
  y: number,
  w: number,
  h: number,
) {
  let d = "";
  for (let x = x0; x + w <= x1; x += step) d += arch(x, y, w, h);
  return d;
}

// Square crenellations along y from x0 to x1 (tooth width 3, height 3)
function crenels(x0: number, x1: number, y: number) {
  let d = "";
  for (let x = x0; x + 3 <= x1; x += 6) d += `M${x},${y} v-3 h3 v3Z`;
  return d;
}

// Simple lit windows: [x, y] pairs
function windows(s: CityStyle, pts: [number, number][]) {
  return pts
    .map(
      ([x, y]) =>
        `<rect x="${x}" y="${y}" width="2" height="2.6" fill="${s.sky[1]}" opacity=".55"/>`,
    )
    .join("");
}

// Water strip below the ground line with two reflection lines
function water(s: CityStyle, a = "8,95 L70,95", b = "110,97 L190,97") {
  return (
    `<rect x="0" y="92" width="200" height="8" fill="${s.far}"/>` +
    `<path d="M${a} M${b}" stroke="${s.sky[1]}" stroke-width="1" opacity=".55"/>`
  );
}

// Small boat with a triangular sail
function sailboat(ink: string, x: number, k = 1) {
  return `<path fill="${ink}" d="M${x - 8 * k},93 L${x + 8 * k},93 L${x + 5 * k},96.5 L${x - 5 * k},96.5Z M${x},92 L${x},${92 - 16 * k} L${x + 7 * k},91Z M${x - 1},${92 - 13 * k} L${x - 6 * k},91 L${x - 1},91Z"/>`;
}

// Umbrella pine
function pine(ink: string, x: number, h: number) {
  const top = 92 - h;
  return `<path d="M${x},92 Q${x + 1},${top + h / 2} ${x + 2},${top + 2}" stroke="${ink}" stroke-width="1.8" fill="none"/><path fill="${ink}" d="M${x - 10},${top + 3} Q${x - 8},${top - 4} ${x + 2},${top - 4} Q${x + 13},${top - 4} ${x + 14},${top + 3}Z"/>`;
}

export const ITALY: Record<string, LibraryCity> = {
  FCO: {
    city: "Rom",
    country: "Italien",
    timezone: "Europe/Rome",
    style: {
      sky: ["#3a1d2e", "#f0a46a"],
      ink: "#1e0d17",
      far: "#5c3446",
      tag: "Colosseo & San Pietro",
    },
    draw: (s) =>
      // Colosseum with its broken outer ring on the left, St Peter's dome on the right, pines between
      `<path fill="${s.far}" d="M0,78 Q50,68 100,74 Q150,66 200,72 L200,100 L0,100Z"/>` +
      `<g fill="${s.ink}">` +
      `<path d="M6,92 L6,38 Q34,31 62,32 L65,38 L70,39 L74,47 L82,50 L114,53 L114,92Z"/>` +
      `<rect x="128" y="70" width="68" height="22"/><path d="M150,70 L162,62 L174,70Z"/>` +
      `<rect x="150" y="50" width="24" height="16"/><path d="M147,52 Q147,29 162,27 Q177,29 177,52Z"/>` +
      `<rect x="159.5" y="19" width="5" height="9"/><path d="M158.5,19 Q162,14 165.5,19Z"/>` +
      `<rect x="161.4" y="8" width="1.2" height="8"/><rect x="159.8" y="10" width="4.4" height="1.2"/>` +
      `<path d="M131,70 Q131,61 136,60 Q141,61 141,70Z M183,70 Q183,61 188,60 Q193,61 193,70Z"/>` +
      `<rect x="0" y="92" width="200" height="8"/></g>` +
      `<path fill="${s.far}" d="${arches(10, 112, 9, 64, 5, 9)}${arches(10, 70, 9, 49, 5, 8)}${arches(84, 112, 9, 56, 5, 4)}"/>` +
      `<path fill="${s.sky[1]}" opacity=".5" d="${arches(10, 112, 9, 78, 5, 11)}"/>` +
      `<path fill="${s.far}" d="M10,40 h50 v1.5 h-50Z"/>` +
      pine(s.ink, 120, 34) +
      pine(s.ink, 138, 26) +
      windows(s, [
        [134, 78],
        [146, 78],
        [178, 78],
        [190, 78],
      ]),
  },
  NAP: {
    city: "Neapel",
    country: "Italien",
    timezone: "Europe/Rome",
    style: {
      sky: ["#1b2c4f", "#f2a07b"],
      ink: "#0d1428",
      far: "#3d4f7c",
      tag: "Vesuvio & Castel dell'Ovo",
    },
    draw: (s) =>
      // Vesuvius (Somma ridge and cone) across the bay, Castel dell'Ovo on its islet
      `<path fill="${s.far}" d="M40,92 Q80,78 104,50 L112,42 L118,46 L124,44 L136,30 L156,29 L166,40 Q184,58 200,63 L200,92Z"/>` +
      `<path fill="${s.sky[1]}" opacity=".25" d="M136,30 L156,29 L154,32 L138,33Z"/>` +
      `<g fill="${s.ink}">` +
      `<path d="M0,92 L0,50 L8,50 L8,44 L18,44 L18,56 L26,56 L26,66 L34,66 L34,92Z"/>` +
      `<rect x="34" y="86" width="20" height="6"/>` +
      `<path d="M48,92 L52,80 L112,80 L118,92Z"/>` +
      `<rect x="56" y="58" width="50" height="22"/><rect x="72" y="46" width="24" height="12"/>` +
      `<path d="${crenels(56, 106, 58)}${crenels(72, 96, 46)}"/>` +
      `<path d="M98,80 L98,62 Q105,57 112,62 L112,80Z"/></g>` +
      windows(s, [
        [4, 56],
        [12, 50],
        [20, 62],
        [28, 72],
        [64, 66],
        [82, 52],
        [104, 68],
      ]) +
      water(s, "6,95 L48,95", "120,97 L194,97") +
      sailboat(s.ink, 150, 1.3) +
      sailboat(s.ink, 180, 0.9),
  },
  OLB: {
    city: "Olbia",
    country: "Italien",
    timezone: "Europe/Rome",
    style: {
      sky: ["#0e3550", "#7fd0d6"],
      ink: "#06192a",
      far: "#2a6380",
      tag: "Tavolara & Costa Smeralda",
    },
    draw: (s) =>
      // Tavolara island offshore, granite boulders and a wind-bent juniper, yachts in the bay
      `<path fill="${s.far}" d="M84,84 L98,66 L108,46 Q114,38 126,38 L150,40 Q160,42 166,56 L182,84Z"/>` +
      `<rect x="0" y="80" width="200" height="20" fill="${s.far}" opacity=".55"/>` +
      `<path d="M74,86 L120,86 M150,88 L196,88" stroke="${s.sky[1]}" stroke-width="1" opacity=".45"/>` +
      `<g fill="${s.ink}">` +
      `<path d="M0,92 L0,50 Q4,40 14,44 Q16,34 24,34 Q20,26 28,20 Q38,14 48,20 Q54,26 48,32 Q42,32 40,36 Q46,40 46,46 Q56,46 58,58 Q68,62 66,74 Q74,80 72,92Z"/>` +
      `<path d="M166,92 Q168,76 178,74 Q184,64 194,66 Q200,66 200,68 L200,92Z"/>` +
      `<ellipse cx="55" cy="45" rx="6" ry="4.5"/></g>` +
      `<path d="M8,52 Q16,48 22,54 M30,24 Q38,22 42,28 M50,60 Q56,60 58,66" stroke="${s.far}" stroke-width=".8" fill="none" opacity=".8"/>` +
      water(s, "74,95 L130,95", "140,97 L196,97") +
      sailboat(s.ink, 96, 1.5) +
      sailboat(s.ink, 136, 1.1) +
      sailboat(s.ink, 186, 0.8),
  },
  CTA: {
    city: "Catania",
    country: "Italien",
    timezone: "Europe/Rome",
    style: {
      sky: ["#3d1410", "#f58f5a"],
      ink: "#1f0906",
      far: "#6b2a1c",
      tag: "Etna & Duomo",
    },
    draw: (s) =>
      // Smoking Etna behind the baroque Duomo and the elephant fountain (Liotru)
      `<path fill="${s.far}" d="M0,82 Q50,68 84,44 L94,34 L108,34 Q140,60 200,74 L200,100 L0,100Z"/>` +
      `<path fill="${s.far}" opacity=".7" d="M96,33 Q90,24 100,20 Q106,11 120,14 Q132,6 146,12 Q160,9 164,16 Q150,21 136,19 Q124,24 112,23 Q104,27 106,33Z"/>` +
      `<path fill="#ff8a4c" opacity=".8" d="M95,34 L107,34 L105,36 L97,36Z"/>` +
      `<g fill="${s.ink}">` +
      `<rect x="0" y="74" width="16" height="18"/><rect x="186" y="72" width="14" height="20"/>` +
      `<rect x="122" y="60" width="26" height="32"/><rect x="126" y="52" width="18" height="9"/>` +
      `<path d="M124,53 Q124,36 135,35 Q146,36 146,53Z"/><rect x="133.5" y="27" width="3" height="9"/><circle cx="135" cy="26" r="1.6"/>` +
      `<rect x="154" y="36" width="12" height="56"/><rect x="152" y="34" width="16" height="4"/><path d="M154,34 Q160,24 166,34Z"/><rect x="159.4" y="18" width="1.2" height="8"/>` +
      `<rect x="70" y="66" width="56" height="26"/><path d="M80,66 L80,50 L116,50 L116,66 L122,66 Q116,60 116,58 L80,58 Q80,60 74,66Z"/>` +
      `<path d="M78,50 L98,40 L118,50Z"/><rect x="97" y="34" width="2" height="7"/>` +
      `<rect x="22" y="84" width="22" height="8"/><ellipse cx="32" cy="78" rx="9" ry="5"/>` +
      `<rect x="25" y="80" width="3" height="5"/><rect x="36" y="80" width="3" height="5"/>` +
      `<circle cx="41" cy="75" r="3.4"/><path d="M43,76 Q46,80 44,84" stroke="${s.ink}" stroke-width="1.6" fill="none"/>` +
      `<rect x="29" y="70" width="6" height="4"/><path d="M30,70 L31,44 L33,44 L34,70Z"/><circle cx="32" cy="42" r="1.4"/></g>` +
      `<path fill="${s.far}" d="${arch(94, 74, 8, 18)}${arch(80, 78, 6, 14)}${arch(114, 78, 6, 14)}"/>` +
      `<path fill="${s.sky[1]}" opacity=".5" d="${arch(94, 54, 8, 9)}${arch(132, 66, 6, 8)}"/>` +
      `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`,
  },
  PMO: {
    city: "Palermo",
    country: "Italien",
    timezone: "Europe/Rome",
    style: {
      sky: ["#2c2045", "#f4b77a"],
      ink: "#150f24",
      far: "#53447a",
      tag: "Cattedrale di Palermo",
    },
    draw: (s) =>
      // Arab-Norman cathedral with corner turrets, central dome and arched bell tower; Monte Pellegrino behind
      `<path fill="${s.far}" d="M96,92 L112,70 Q124,46 146,38 Q164,33 176,44 L188,60 Q196,70 200,72 L200,92Z"/>` +
      `<path fill="${s.far}" opacity=".6" d="M0,76 Q40,70 96,76 L96,92 L0,92Z"/>` +
      `<g fill="${s.ink}">` +
      `<rect x="6" y="34" width="16" height="58"/><path d="M5,34 L14,22 L23,34Z"/>` +
      `<path d="${spires(7, 21, 5, 36, 4)}"/>` +
      `<path d="M22,56 L38,56 L38,92 L22,92Z"/>` +
      `<rect x="38" y="62" width="88" height="30"/>` +
      `<path d="${spires(42, 122, 4, 62, 3)}"/>` +
      `<rect x="38" y="42" width="7" height="22"/><rect x="119" y="42" width="7" height="22"/>` +
      `<path d="M37,42 Q41.5,32 46,42Z M118,42 Q122.5,32 127,42Z"/>` +
      `<rect x="72" y="50" width="22" height="12"/><path d="M70,51 Q70,32 83,30 Q96,32 96,51Z"/><rect x="82.2" y="22" width="1.6" height="9"/>` +
      `<path d="M52,62 Q52,54 57,53 Q62,54 62,62Z M104,62 Q104,54 109,53 Q114,54 114,62Z"/></g>` +
      `<path fill="${s.far}" d="${arch(25, 64, 10, 28)}"/>` +
      `<path fill="${s.sky[1]}" opacity=".45" d="${arches(48, 118, 10, 72, 4, 10)}${arch(11, 44, 6, 10)}"/>` +
      palm(s.ink, 136, 32) +
      palm(s.ink, 160, 24) +
      palm(s.ink, 182, 34) +
      `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`,
  },
  BRI: {
    city: "Bari",
    country: "Italien",
    timezone: "Europe/Rome",
    style: {
      sky: ["#183a4f", "#f3cf9a"],
      ink: "#0a1c28",
      far: "#356a82",
      tag: "Basilica di San Nicola",
    },
    draw: (s) =>
      // Romanesque basilica with its two unequal square towers above the seafront promenade
      `<path fill="${s.far}" d="M0,92 L0,72 L14,72 L14,66 L30,66 L30,74 L44,74 L44,92Z M156,92 L156,70 L170,70 L170,62 L184,62 L184,72 L200,72 L200,92Z"/>` +
      `<g fill="${s.ink}">` +
      `<rect x="46" y="28" width="18" height="60"/><path d="M45,28 h20 v3 h-20Z"/>` +
      `<rect x="136" y="42" width="16" height="46"/><path d="M135,42 h18 v3 h-18Z"/>` +
      `<path d="M64,88 L64,54 L100,34 L136,54 L136,88Z"/>` +
      `<rect x="0" y="86" width="200" height="6"/>` +
      `<path d="M14,86 L14,72 M34,86 L34,72 M166,86 L166,72 M186,86 L186,72" stroke="${s.ink}" stroke-width="1.2"/>` +
      `<circle cx="14" cy="71" r="1.6"/><circle cx="34" cy="71" r="1.6"/><circle cx="166" cy="71" r="1.6"/><circle cx="186" cy="71" r="1.6"/></g>` +
      `<circle cx="100" cy="54" r="4.5" fill="${s.sky[1]}" opacity=".55"/>` +
      `<path fill="${s.far}" d="${arch(95, 70, 10, 16)}${arch(74, 74, 7, 12)}${arch(119, 74, 7, 12)}"/>` +
      `<path fill="${s.sky[1]}" opacity=".45" d="${arch(52, 36, 6, 9)}${arch(141, 50, 6, 8)}"/>` +
      palm(s.ink, 24, 30) +
      water(s, "6,95 L60,95", "100,97 L180,97") +
      sailboat(s.ink, 164, 0.7),
  },
  MLA: {
    city: "Valletta",
    country: "Malta",
    timezone: "Europe/Malta",
    style: {
      sky: ["#4a2a1a", "#f6c983"],
      ink: "#24130a",
      far: "#7a4c2e",
      tag: "Grand Harbour",
    },
    draw: (s) =>
      // Bastion walls rising from the harbour, Carmelite dome and St Paul's spire on top
      `<path fill="${s.far}" d="M0,64 L20,64 L20,58 L40,58 L40,62 L150,62 L150,56 L176,56 L176,60 L200,60 L200,80 L0,80Z"/>` +
      `<g fill="${s.ink}">` +
      `<path d="M0,92 L4,72 L44,72 L48,66 L148,66 L152,74 L196,74 L200,92Z"/>` +
      `<rect x="54" y="56" width="22" height="10"/><rect x="104" y="58" width="14" height="8"/><rect x="132" y="54" width="14" height="12"/>` +
      `<rect x="78" y="44" width="24" height="22"/><path d="M76,46 Q76,20 90,18 Q104,20 104,46Z"/>` +
      `<rect x="88" y="10" width="4" height="9"/><path d="M87.5,10 Q90,6 92.5,10Z"/><rect x="89.4" y="2" width="1.2" height="5"/>` +
      `<rect x="120" y="34" width="9" height="32"/><path d="M119,34 L124.5,4 L130,34Z"/>` +
      `<rect x="10" y="62" width="14" height="10"/><rect x="164" y="64" width="12" height="10"/></g>` +
      `<path d="M8,78 L196,78 M6,84 L198,84" stroke="${s.far}" stroke-width=".7" opacity=".7"/>` +
      windows(s, [
        [58, 60],
        [70, 60],
        [108, 61],
        [136, 58],
        [14, 66],
        [168, 68],
      ]) +
      water(s, "6,95 L60,95", "110,97 L188,97") +
      `<path fill="${s.ink}" d="M150,93 Q162,97 176,93 L174,91 Q162,94 152,91Z"/>`,
  },
  SPU: {
    city: "Split",
    country: "Kroatien",
    timezone: "Europe/Zagreb",
    style: {
      sky: ["#1f3352", "#e9b48c"],
      ink: "#0e1828",
      far: "#41577e",
      tag: "Dioklecijanova palača",
    },
    draw: (s) =>
      // Diocletian's Palace waterfront with its arcade, St Domnius bell tower, palms on the Riva
      `<path fill="${s.far}" d="M0,66 L26,52 L52,60 L82,44 L110,58 L140,46 L170,58 L200,50 L200,100 L0,100Z"/>` +
      `<g fill="${s.ink}">` +
      `<rect x="0" y="68" width="200" height="24"/>` +
      `<rect x="2" y="60" width="18" height="10"/><rect x="180" y="60" width="18" height="10"/>` +
      `<rect x="94" y="44" width="20" height="26"/><rect x="96" y="30" width="16" height="15"/><rect x="98" y="20" width="12" height="11"/>` +
      `<path d="M97,20 L104,4 L111,20Z"/><rect x="103.4" y="0" width="1.2" height="5"/>` +
      `<rect x="60" y="56" width="14" height="12"/><path d="M58,56 L67,50 L76,56Z"/>` +
      `<rect x="134" y="58" width="18" height="10"/><path d="M132,58 L143,52 L154,58Z"/></g>` +
      `<path fill="${s.far}" d="${arches(6, 196, 7, 72, 4, 7)}"/>` +
      `<path fill="${s.sky[1]}" opacity=".5" d="${arch(101, 34, 6, 8)}${arch(100, 48, 3, 8)}${arch(105, 48, 3, 8)}"/>` +
      palm(s.ink, 22, 38) +
      palm(s.ink, 46, 32) +
      palm(s.ink, 150, 34) +
      palm(s.ink, 176, 40) +
      water(s, "8,95 L80,95", "120,97 L192,97"),
  },
  DBV: {
    city: "Dubrovnik",
    country: "Kroatien",
    timezone: "Europe/Zagreb",
    style: {
      sky: ["#3b1c3a", "#f09a7a"],
      ink: "#1d0c1c",
      far: "#663a5e",
      tag: "Gradske zidine",
    },
    draw: (s) =>
      // City walls stepping down from the round Minčeta tower to the sea, bell tower and cathedral dome inside
      `<path fill="${s.far}" d="M0,52 Q60,30 120,40 Q160,46 200,36 L200,100 L0,100Z"/>` +
      `<g fill="${s.ink}">` +
      `<path d="M0,92 L0,58 L16,54 L46,56 Q80,62 110,70 L176,74 L200,74 L200,92Z"/>` +
      `<rect x="14" y="30" width="30" height="28" rx="2"/><path d="${crenels(14, 44, 30)}"/>` +
      `<rect x="22" y="20" width="14" height="8"/><path d="${crenels(22, 36, 20)}"/>` +
      `<path d="${crenels(46, 108, 59)}"/>` +
      `<rect x="56" y="58" width="14" height="10"/><path d="M55,58 L63,52 L71,58Z"/>` +
      `<rect x="74" y="60" width="16" height="8"/><path d="M73,60 L82,55 L91,60Z"/>` +
      `<rect x="98" y="38" width="9" height="32"/><path d="M97,38 Q102.5,28 108,38Z"/><rect x="101.9" y="24" width="1.2" height="6"/>` +
      `<rect x="114" y="62" width="14" height="10"/><path d="M113,62 L121,57 L129,62Z"/>` +
      `<rect x="132" y="58" width="22" height="14"/><path d="M135,58 Q135,48 143,47 Q151,48 151,58Z"/><rect x="142.4" y="42" width="1.2" height="6"/>` +
      `<rect x="158" y="64" width="14" height="10"/><path d="M157,64 L165,58 L173,64Z"/>` +
      `<rect x="178" y="56" width="20" height="36" rx="2"/><path d="${crenels(178, 198, 56)}"/></g>` +
      windows(s, [
        [28, 40],
        [62, 62],
        [82, 63],
        [101, 44],
        [120, 66],
        [164, 68],
        [187, 64],
      ]) +
      water(s, "8,95 L70,95", "110,97 L170,97") +
      sailboat(s.ink, 150, 0.7),
  },
  ZAG: {
    city: "Zagreb",
    country: "Kroatien",
    timezone: "Europe/Zagreb",
    style: {
      sky: ["#1c3340", "#c9d3a8"],
      ink: "#0b181f",
      far: "#3b5a66",
      tag: "Zagrebačka katedrala",
    },
    draw: (s) =>
      // Neo-gothic cathedral with twin openwork spires, Medvednica hills behind, Kaptol houses around
      `<path fill="${s.far}" d="M0,68 Q60,52 120,62 Q170,50 200,58 L200,100 L0,100Z"/>` +
      `<g fill="${s.ink}">` +
      `<rect x="0" y="72" width="22" height="20"/><path d="M-1,72 L11,64 L23,72Z"/>` +
      `<rect x="24" y="76" width="18" height="16"/><path d="M23,76 L33,69 L43,76Z"/>` +
      `<rect x="150" y="74" width="20" height="18"/><path d="M149,74 L160,66 L171,74Z"/>` +
      `<rect x="172" y="70" width="28" height="22"/><path d="M171,70 L186,62 L201,70Z"/>` +
      `<rect x="74" y="58" width="52" height="34"/><path d="M84,58 L100,46 L116,58Z"/>` +
      `<rect x="72" y="34" width="16" height="58"/><rect x="112" y="34" width="16" height="58"/>` +
      `<path d="M72,34 L80,2 L88,34Z M112,34 L120,2 L128,34Z"/>` +
      `<path d="${spires(72, 88, 16, 36, 6)}${spires(112, 128, 16, 36, 6)}"/>` +
      `<rect x="52" y="78" width="20" height="14"/><rect x="128" y="78" width="20" height="14"/></g>` +
      `<path d="M80,30 L80,10 M120,30 L120,10" stroke="${s.sky[1]}" stroke-width=".7" opacity=".45"/>` +
      `<path fill="${s.sky[1]}" opacity=".5" d="${arch(77, 42, 6, 14)}${arch(117, 42, 6, 14)}"/>` +
      `<circle cx="100" cy="66" r="4.5" fill="${s.sky[1]}" opacity=".5"/>` +
      `<path fill="${s.far}" d="${arch(95, 76, 10, 16)}"/>` +
      windows(s, [
        [8, 78],
        [32, 82],
        [158, 80],
        [180, 76],
        [190, 82],
      ]) +
      `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`,
  },
};
