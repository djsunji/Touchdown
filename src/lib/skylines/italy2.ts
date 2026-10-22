import { alps, palm, spires, type CityStyle, type LibraryCity } from "./shared";

// Hand-drawn skylines: northern Italy, Sardinia and western Sicily

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

// Slim cypress
function cypress(ink: string, x: number, h: number) {
  return `<path fill="${ink}" d="M${x - 3},92 Q${x - 4},${92 - h / 2} ${x},${92 - h} Q${x + 4},${92 - h / 2} ${x + 3},92Z"/>`;
}

// Tower windmill of the Trapani salt pans: x = centre, top = hub height, k = scale
function windmill(ink: string, x: number, top: number, k = 1) {
  const w = 5 * k;
  const l = 20 * k;
  return (
    `<path fill="${ink}" d="M${x - w - 2 * k},92 L${x - w},${top + 2} L${x + w},${top + 2} L${x + w + 2 * k},92Z M${x - w - 1},${top + 3} Q${x},${top - 8 * k} ${x + w + 1},${top + 3}Z"/>` +
    `<path d="M${x - l},${top - l * 0.7} L${x + l},${top + l * 0.7} M${x + l * 0.7},${top - l} L${x - l * 0.7},${top + l}" stroke="${ink}" stroke-width="${2.2 * k}" stroke-linecap="round"/>` +
    `<circle cx="${x}" cy="${top}" r="${1.8 * k}" fill="${ink}"/>`
  );
}

export const ITALY2: Record<string, LibraryCity> = {
  TRN: {
    city: "Turin",
    country: "Italien",
    timezone: "Europe/Rome",
    style: {
      sky: ["#26314f", "#f0b48a"],
      ink: "#121829",
      far: "#4d5a80",
      tag: "Mole Antonelliana",
    },
    draw: (s) =>
      // The Alps behind the Mole: square base, tall concave dome, colonnaded lantern and needle spire
      alps(s) +
      `<g fill="${s.ink}">` +
      `<rect x="0" y="72" width="40" height="20"/><path d="M-1,72 L20,64 L41,72Z"/>` +
      `<rect x="40" y="78" width="36" height="14"/><rect x="50" y="70" width="18" height="8"/>` +
      `<rect x="124" y="76" width="24" height="16"/><rect x="148" y="70" width="26" height="22"/><path d="M147,70 L161,62 L175,70Z"/>` +
      `<rect x="174" y="76" width="26" height="16"/>` +
      `<rect x="80" y="62" width="40" height="30"/><rect x="78" y="59" width="44" height="3.5"/>` +
      `<path d="M81,59 Q85,41 93,30 L107,30 Q115,41 119,59Z"/>` +
      `<rect x="91" y="27" width="18" height="3"/><rect x="93" y="18" width="14" height="9"/>` +
      `<rect x="92" y="16" width="16" height="2.5"/><path d="M94,16 Q100,9 106,16Z"/>` +
      `<path d="M98,12 L100,1 L102,12Z"/>` +
      `<path d="M78,59 L79,55 L80,59Z M120,59 L121,55 L122,59Z"/></g>` +
      `<path d="M90,58 Q93,42 97.5,31 M110,58 Q107,42 102.5,31" stroke="${s.far}" stroke-width=".8" fill="none" opacity=".9"/>` +
      `<path fill="${s.sky[1]}" opacity=".55" d="${arches(94.5, 106, 4, 19.5, 2, 6)}"/>` +
      `<path fill="${s.far}" d="${arches(83, 118, 6, 66, 3, 7)}${arch(95, 78, 10, 14)}"/>` +
      windows(s, [
        [8, 78],
        [26, 78],
        [56, 73],
        [130, 80],
        [154, 75],
        [166, 75],
        [184, 80],
      ]) +
      `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`,
  },
  BLQ: {
    city: "Bologna",
    country: "Italien",
    timezone: "Europe/Rome",
    style: {
      sky: ["#4a1f1a", "#f3a265"],
      ink: "#240d09",
      far: "#7a3a2a",
      tag: "Due Torri",
    },
    draw: (s) =>
      // Asinelli (tall, slender) and the short, heavily leaning Garisenda above arcaded streets
      `<path fill="${s.far}" d="M0,72 Q40,60 80,66 L200,62 L200,92 L0,92Z"/>` +
      `<path fill="${s.far}" d="M14,92 L14,52 L40,40 L66,52 L66,92Z M146,92 L146,40 L153,40 L153,92Z M164,92 L164,50 L172,50 L172,92Z M28,40 h4 v-6 h-4Z"/>` +
      `<path fill="${s.far}" d="${crenels(146, 153, 40)}${crenels(164, 172, 50)}"/>` +
      `<g fill="${s.ink}">` +
      `<path d="M88,92 L89.5,15 L100.5,15 L102,92Z"/><rect x="86.5" y="11" width="17" height="4"/>` +
      `<rect x="91" y="5" width="8" height="6"/><path d="${crenels(91, 100, 5)}"/>` +
      `<g transform="rotate(5 110 92)"><rect x="104" y="40" width="12" height="52"/><path d="${crenels(104, 116, 40)}"/></g>` +
      `<rect x="0" y="66" width="58" height="26"/><path d="M-1,66 L29,58 L59,66Z"/>` +
      `<rect x="58" y="72" width="28" height="20"/><path d="M57,72 L72,66 L87,72Z"/>` +
      `<rect x="122" y="70" width="38" height="22"/><path d="M121,70 L141,63 L161,70Z"/>` +
      `<rect x="160" y="64" width="40" height="28"/><path d="M159,64 L180,56 L201,64Z"/></g>` +
      `<path fill="${s.far}" d="${arches(3, 58, 7, 80, 5, 12)}${arches(60, 86, 7, 82, 5, 10)}${arches(124, 160, 7, 82, 5, 10)}${arches(163, 200, 7, 80, 5, 12)}"/>` +
      `<path d="M95,24 V30 M95,44 V50 M95,64 V70" stroke="${s.sky[1]}" stroke-width="1.4" opacity=".55"/>` +
      windows(s, [
        [8, 70],
        [22, 70],
        [38, 70],
        [128, 74],
        [146, 74],
        [168, 68],
        [184, 68],
      ]) +
      `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`,
  },
  GOA: {
    city: "Genua",
    country: "Italien",
    timezone: "Europe/Rome",
    style: {
      sky: ["#132e4a", "#f2b98a"],
      ink: "#081624",
      far: "#2f5578",
      tag: "Lanterna",
    },
    draw: (s) =>
      // The Lanterna: two stacked crenellated towers on a rock, beam sweeping out; cranes and steep city behind
      `<path fill="${s.far}" d="M0,56 Q24,38 50,46 Q76,32 104,50 L118,60 L118,92 L0,92Z M160,92 L166,74 Q184,66 200,68 L200,92Z"/>` +
      `<path fill="${s.sky[1]}" opacity=".22" d="M143,18.5 L200,6 L200,30Z"/>` +
      `<g fill="${s.ink}">` +
      `<rect x="0" y="84" width="118" height="8"/>` +
      `<path d="M118,92 L124,84 L156,84 L162,92Z"/><rect x="126" y="78" width="28" height="6"/>` +
      `<rect x="133" y="51" width="14" height="27"/><rect x="132.5" y="48" width="15" height="3"/><path d="${crenels(132.5, 147.5, 48)}"/>` +
      `<rect x="135" y="27" width="10" height="21"/><rect x="132.5" y="24.5" width="15" height="3"/><path d="${crenels(132.5, 147.5, 24.5)}"/>` +
      `<rect x="137" y="14" width="6" height="8"/><path d="M136,14.5 Q140,8 144,14.5Z"/><rect x="139.5" y="5" width="1" height="5"/>` +
      `<rect x="168" y="80" width="26" height="6"/><rect x="172" y="76" width="12" height="4"/></g>` +
      `<path d="M24,84 L24,52 L52,46 M24,54 L14,58 M20,84 L24,70 L28,84 M70,84 L70,58 L94,52 M70,60 L62,63 M66,84 L70,72 L74,84" stroke="${s.ink}" stroke-width="1.6" fill="none"/>` +
      `<path d="M52,46 L52,60 M94,52 L94,64" stroke="${s.ink}" stroke-width=".6"/>` +
      `<rect x="137.8" y="15.5" width="4.4" height="6" fill="#ffe3a6" opacity=".9"/>` +
      `<path fill="${s.sky[1]}" opacity=".5" d="${arch(138, 32, 4, 6)}${arch(138, 58, 4, 7)}"/>` +
      windows(s, [
        [8, 66],
        [18, 60],
        [38, 56],
        [46, 64],
        [82, 54],
        [100, 62],
        [108, 70],
      ]) +
      water(s, "6,95 L80,95", "166,97 L196,97"),
  },
  PSA: {
    city: "Pisa",
    country: "Italien",
    timezone: "Europe/Rome",
    style: {
      sky: ["#2a3a5a", "#f6cf98"],
      ink: "#141c2e",
      far: "#4f6488",
      tag: "Torre pendente & Duomo",
    },
    draw: (s) => {
      // Baptistery, Duomo with its arcaded façade and dome, and the leaning tower on the Campo dei Miracoli
      let bands = "";
      let rings = "";
      for (let y = 25; y < 90; y += 9.5) {
        bands += arches(141.5, 157, 4, y, 2, 5.5);
        rings += `M140,${y + 7.5} h18 `;
      }
      return (
        `<path fill="${s.far}" d="M0,80 Q50,72 100,78 Q150,70 200,76 L200,92 L0,92Z"/>` +
        `<g fill="${s.ink}">` +
        `<rect x="8" y="62" width="30" height="30"/><rect x="6" y="59" width="34" height="3"/>` +
        `<path d="M10,59 Q12,42 23,37 Q34,42 36,59Z"/><rect x="21" y="31" width="4" height="7"/><path d="M20.5,31 Q23,27 25.5,31Z"/>` +
        `<rect x="48" y="52" width="18" height="40"/><path d="M47,52 L57,42 L67,52Z"/><rect x="56" y="38" width="2" height="5"/>` +
        `<rect x="66" y="62" width="58" height="30"/><path d="M66,62 L95,55 L124,62Z"/>` +
        `<rect x="85" y="50" width="16" height="10"/><path d="M83,51 Q83,37 93,35 Q103,37 103,51Z"/><rect x="91.5" y="29" width="3" height="7"/>` +
        `<path d="M124,92 L124,68 Q134,68 134,80 L134,92Z"/>` +
        `<g transform="rotate(5.5 149 92)"><rect x="140" y="23" width="18" height="69"/><rect x="139" y="21.5" width="20" height="2"/>` +
        `<rect x="142.5" y="14" width="13" height="8"/><rect x="142" y="13" width="14" height="1.5"/></g></g>` +
        `<g transform="rotate(5.5 149 92)"><path d="${rings}" stroke="${s.far}" stroke-width=".7"/>` +
        `<path fill="${s.sky[1]}" opacity=".45" d="${bands}${arches(144, 155, 3.5, 15.5, 2, 4.5)}"/></g>` +
        `<path fill="${s.sky[1]}" opacity=".45" d="${arches(49.5, 65, 4, 54, 2, 6)}${arches(49.5, 65, 4, 64, 2, 6)}${arches(69, 122, 6, 66, 3, 6)}${arches(13, 36, 6, 64, 3, 7)}"/>` +
        `<path fill="${s.far}" d="${arch(53, 78, 8, 14)}"/>` +
        cypress(s.ink, 176, 30) +
        cypress(s.ink, 186, 24) +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },
  VRN: {
    city: "Verona",
    country: "Italien",
    timezone: "Europe/Rome",
    style: {
      sky: ["#3c1f33", "#f4a989"],
      ink: "#1d0e19",
      far: "#68405a",
      tag: "Arena & Torre dei Lamberti",
    },
    draw: (s) =>
      // The Arena's arcaded ring with the surviving "Ala" fragment, Torre dei Lamberti and the hills behind
      `<path fill="${s.far}" d="M100,92 L100,70 Q130,50 160,54 Q182,46 200,50 L200,92Z"/>` +
      `<path fill="${s.far}" d="M164,54 L164,46 L184,46 L184,50Z"/>` +
      `<g fill="${s.ink}">` +
      `<path d="M4,92 L4,64 Q60,58 116,64 L116,92Z"/>` +
      `<path d="M20,64 L20,38 L46,38 L46,42 L50,45 L50,64Z"/>` +
      `<rect x="116" y="70" width="20" height="22"/><path d="M115,70 L126,64 L137,70Z"/>` +
      `<rect x="136" y="30" width="14" height="62"/><rect x="134.5" y="28" width="17" height="2"/>` +
      `<rect x="135" y="19" width="16" height="9"/><rect x="134.5" y="17.5" width="17" height="2"/>` +
      `<rect x="138" y="9" width="10" height="9"/><path d="M137.5,9.5 Q143,2 148.5,9.5Z"/><rect x="142.4" y="1" width="1.2" height="3"/>` +
      `<rect x="150" y="66" width="22" height="26"/><path d="M149,66 L161,59 L173,66Z"/>` +
      `<rect x="172" y="72" width="28" height="20"/></g>` +
      `<path fill="${s.far}" d="${arches(9, 114, 8, 65, 5, 8)}${arches(23, 49, 8, 42, 5, 8)}${arches(23, 49, 8, 53, 5, 8)}"/>` +
      `<path fill="${s.sky[1]}" opacity=".45" d="${arches(9, 114, 8, 76, 5, 16)}${arches(137, 151, 5, 20, 3, 6)}${arch(140.5, 11, 5, 5)}"/>` +
      `<circle cx="143" cy="36" r="2.4" fill="${s.sky[1]}" opacity=".5"/>` +
      cypress(s.ink, 180, 34) +
      cypress(s.ink, 192, 26) +
      windows(s, [
        [122, 76],
        [156, 72],
        [164, 72],
        [178, 78],
      ]) +
      `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`,
  },
  BGY: {
    city: "Bergamo",
    country: "Italien",
    timezone: "Europe/Rome",
    style: {
      sky: ["#1f2b48", "#e9b38f"],
      ink: "#0f1526",
      far: "#3f4f78",
      tag: "Città Alta",
    },
    draw: (s) =>
      // The walled upper town on its hill: Campanone, Duomo dome, Colleoni chapel and Santa Maria Maggiore's bell tower
      `<path fill="${s.far}" d="M0,50 L22,36 L40,44 L64,28 L84,40 L104,32 L130,42 L156,26 L180,38 L200,32 L200,92 L0,92Z" opacity=".75"/>` +
      `<g fill="${s.ink}">` +
      `<path d="M0,92 L0,84 Q18,80 28,70 L36,58 L164,58 L172,70 Q184,80 200,84 L200,92Z"/>` +
      `<rect x="38" y="50" width="22" height="8"/><path d="M37,50 L49,45 L61,50Z"/><rect x="60" y="46" width="10" height="12"/>` +
      `<rect x="72" y="20" width="10" height="38"/><rect x="71" y="27" width="12" height="2"/>` +
      `<rect x="73" y="13" width="8" height="7"/><path d="M72.5,13.5 Q77,7 81.5,13.5Z"/><rect x="76.4" y="4" width="1.2" height="5"/>` +
      `<rect x="86" y="40" width="24" height="18"/><path d="M88,42 Q88,26 99,25 Q110,26 110,42Z"/><rect x="97.5" y="19" width="3" height="7"/><circle cx="99" cy="17.5" r="1.6"/>` +
      `<rect x="112" y="44" width="18" height="14"/><path d="M114,45 Q114,34 121,33 Q128,34 128,45Z"/><rect x="120.2" y="27" width="1.6" height="7"/>` +
      `<rect x="133" y="28" width="8" height="30"/><path d="M132.5,28 L137,15 L141.5,28Z"/>` +
      `<rect x="144" y="46" width="20" height="12"/><path d="${crenels(144, 164, 46)}"/><rect x="152" y="38" width="9" height="8"/><path d="${crenels(152, 161, 38)}"/></g>` +
      `<path d="M38,60 L162,60 M34,64 L166,64" stroke="${s.far}" stroke-width=".8" opacity=".9"/>` +
      `<circle cx="77" cy="32" r="2" fill="${s.sky[1]}" opacity=".6"/>` +
      `<path fill="${s.sky[1]}" opacity=".5" d="${arch(74.5, 21, 5, 5)}${arch(135.5, 32, 3, 6)}${arches(90, 108, 5, 46, 2.5, 5)}"/>` +
      windows(s, [
        [42, 53],
        [52, 53],
        [64, 50],
        [116, 50],
        [124, 50],
        [148, 50],
        [20, 82],
        [30, 76],
        [170, 76],
        [182, 82],
      ]) +
      `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`,
  },
  TRS: {
    city: "Triest",
    country: "Italien",
    timezone: "Europe/Rome",
    style: {
      sky: ["#183552", "#f1c0a0"],
      ink: "#0a1828",
      far: "#36597e",
      tag: "Piazza Unità & Miramare",
    },
    draw: (s) =>
      // Grand palazzi of Piazza Unità opening to the sea, town hall clock tower; Miramare castle on its point
      `<path fill="${s.far}" d="M0,56 Q50,46 100,52 Q150,44 200,52 L200,92 L0,92Z" opacity=".8"/>` +
      `<g fill="${s.ink}">` +
      `<rect x="4" y="54" width="44" height="32"/><rect x="2" y="52" width="48" height="2.5"/>` +
      `<path d="${spires(8, 46, 9.5, 52, 4)}"/>` +
      `<rect x="54" y="46" width="52" height="40"/><rect x="52" y="44" width="56" height="2.5"/>` +
      `<rect x="73" y="26" width="14" height="18"/><rect x="72" y="24" width="16" height="2"/>` +
      `<path d="M73,24 Q80,15 87,24Z"/><rect x="79.4" y="10" width="1.2" height="7"/>` +
      `<rect x="112" y="52" width="36" height="34"/><rect x="110" y="50" width="40" height="2.5"/><rect x="124" y="44" width="12" height="6"/>` +
      `<rect x="0" y="86" width="152" height="6"/>` +
      `<path d="M150,92 L152,84 Q160,80 168,80 L200,78 L200,92Z"/>` +
      `<rect x="164" y="64" width="22" height="16"/><path d="${crenels(164, 186, 64)}"/>` +
      `<rect x="184" y="48" width="12" height="32"/><path d="${crenels(184, 196, 48)}"/>` +
      `<circle cx="158" cy="76" r="5"/><circle cx="152" cy="80" r="4"/></g>` +
      `<path d="M50,86 V56 M110,86 V56" stroke="${s.ink}" stroke-width="1"/>` +
      `<path fill="${s.ink}" d="M50,56 l6,2 l-6,2Z M110,56 l6,2 l-6,2Z"/>` +
      `<circle cx="80" cy="34" r="2.6" fill="${s.sky[1]}" opacity=".6"/>` +
      `<path fill="${s.sky[1]}" opacity=".5" d="${arches(58, 104, 6, 50, 3, 6)}${arches(8, 48, 6, 58, 3, 6)}${arches(115, 148, 6, 56, 3, 6)}${arch(188, 54, 4, 6)}"/>` +
      windows(s, [
        [9, 70],
        [21, 70],
        [33, 70],
        [61, 62],
        [73, 62],
        [85, 62],
        [97, 62],
        [118, 68],
        [130, 68],
        [142, 68],
        [170, 70],
        [178, 70],
      ]) +
      water(s, "6,95 L90,95", "110,97 L170,97") +
      sailboat(s.ink, 130, 0.8),
  },
  CAG: {
    city: "Cagliari",
    country: "Italien",
    timezone: "Europe/Rome",
    style: {
      sky: ["#3f2318", "#f5c27f"],
      ink: "#20110a",
      far: "#734a32",
      tag: "Bastione di Saint Remy",
    },
    draw: (s) =>
      // The terraced Bastione with its triumphal loggia, Torre dell'Elefante open on its inner face, Castello on the hill
      `<path fill="${s.far}" d="M0,70 Q30,60 60,62 L200,54 L200,92 L0,92Z"/>` +
      `<g fill="${s.ink}">` +
      `<path d="M0,92 L0,72 Q20,66 32,62 L130,58 L146,52 L182,50 Q194,54 200,58 L200,92Z"/>` +
      `<path d="M30,92 L34,44 L126,44 L130,92Z"/><rect x="32" y="40" width="96" height="4"/>` +
      `<rect x="62" y="24" width="36" height="16"/><rect x="60" y="21.5" width="40" height="3"/><path d="M68,21.5 L80,15 L92,21.5Z"/>` +
      `<rect x="150" y="16" width="16" height="38"/><path d="${crenels(150, 166, 16)}"/>` +
      `<rect x="168" y="40" width="22" height="12"/><path d="M170,41 Q170,31 179,30 Q188,31 188,41Z"/><rect x="178.2" y="24" width="1.6" height="7"/></g>` +
      `<path d="M34,37 h26 M100,37 h26" stroke="${s.ink}" stroke-width="1.2"/>` +
      `<path d="${spires(36, 58, 4, 40, 3)}${spires(102, 124, 4, 40, 3)}" fill="${s.ink}"/>` +
      `<path fill="${s.far}" d="${arch(71, 27, 18, 13)}${arches(38, 62, 6, 48, 3, 8)}${arches(98, 124, 6, 48, 3, 8)}${arch(70, 62, 20, 30)}"/>` +
      `<path fill="${s.sky[1]}" opacity=".45" d="${arches(65, 72, 4, 28, 2, 8)}${arches(90, 97, 4, 28, 2, 8)}"/>` +
      `<rect x="153" y="21" width="10" height="29" fill="${s.far}"/>` +
      `<path d="M153,28.5 h10 M153,36 h10 M153,43.5 h10" stroke="${s.ink}" stroke-width="1.2"/>` +
      `<rect x="155.5" y="23" width="3" height="4" fill="${s.sky[1]}" opacity=".5"/>` +
      palm(s.ink, 12, 34) +
      palm(s.ink, 138, 26) +
      windows(s, [
        [174, 44],
        [184, 44],
        [192, 60],
        [16, 76],
      ]) +
      `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`,
  },
  AHO: {
    city: "Alghero",
    country: "Italien",
    timezone: "Europe/Rome",
    style: {
      sky: ["#1c2a52", "#f7a98a"],
      ink: "#0d1329",
      far: "#3d4f86",
      tag: "Bastioni & Capo Caccia",
    },
    draw: (s) =>
      // Crenellated sea walls with Torre di Sulis, the cathedral's spired campanile; Capo Caccia's cliff across the bay
      `<path fill="${s.far}" d="M112,92 L114,62 L122,48 Q138,42 156,50 Q178,58 200,62 L200,92Z"/>` +
      `<circle cx="141" cy="44" r="1.3" fill="${s.sky[1]}" opacity=".9"/>` +
      `<g fill="${s.ink}">` +
      `<rect x="26" y="58" width="12" height="12"/><path d="M25,58 L32,53 L39,58Z"/>` +
      `<rect x="54" y="56" width="20" height="14"/><path d="M53,56 L64,50 L75,56Z"/>` +
      `<rect x="40" y="28" width="10" height="42"/><rect x="39" y="26" width="12" height="2.5"/>` +
      `<path d="M39.5,26 L45,6 L50.5,26Z"/><path d="${spires(40, 50, 10, 26, 6)}"/>` +
      `<path d="M0,92 L0,70 L104,70 L110,92Z"/><path d="${crenels(0, 76, 70)}"/>` +
      `<rect x="6" y="54" width="18" height="16"/><path d="${crenels(6, 24, 54)}"/>` +
      `<rect x="78" y="46" width="24" height="46" rx="3"/><rect x="76" y="44" width="28" height="3"/><path d="${crenels(76, 104, 44)}"/></g>` +
      `<path fill="${s.sky[1]}" opacity=".5" d="${arch(43, 30, 4, 7)}${arch(87, 52, 6, 9)}"/>` +
      `<path d="M78,60 h24 M2,80 h102" stroke="${s.far}" stroke-width=".8" opacity=".8"/>` +
      windows(s, [
        [30, 62],
        [60, 60],
        [68, 60],
        [12, 60],
        [18, 60],
      ]) +
      palm(s.ink, 112, 30) +
      water(s, "112,95 L160,95", "150,97 L196,97") +
      sailboat(s.ink, 150, 0.9) +
      sailboat(s.ink, 182, 0.6),
  },
  TPS: {
    city: "Trapani",
    country: "Italien",
    timezone: "Europe/Rome",
    style: {
      sky: ["#45203a", "#f9b582"],
      ink: "#22101d",
      far: "#734264",
      tag: "Saline & Erice",
    },
    draw: (s) =>
      // Windmills over the salt pans with white salt heaps; Erice and its castle crowning Monte San Giuliano
      `<path fill="${s.far}" d="M0,92 L0,72 Q18,62 30,42 Q40,26 56,24 Q72,24 80,38 Q94,60 124,74 L134,92Z"/>` +
      `<g fill="${s.ink}">` +
      `<rect x="51" y="18" width="13" height="7"/><path d="${crenels(52, 64, 18)}"/>` +
      `<rect x="45" y="13" width="6" height="12"/><path d="${crenels(45, 51, 13)}"/>` +
      `<rect x="66" y="21" width="5" height="4"/><path d="M65,21 L68.5,18 L72,21Z"/></g>` +
      `<rect x="0" y="84" width="200" height="8" fill="${s.far}"/>` +
      `<path d="M4,88 h40 M60,88 h50 M126,88 h40 M178,88 h20" stroke="${s.sky[1]}" stroke-width="1" opacity=".5"/>` +
      `<path d="M50,84 V92 M118,84 V92 M172,84 V92 M0,84 H200" stroke="${s.ink}" stroke-width="1.2"/>` +
      `<path fill="${s.sky[1]}" opacity=".85" d="M14,84 Q22,72 30,84Z M100,84 Q110,70 120,84Z M118,84 Q126,74 134,84Z"/>` +
      `<path d="M16,80 h12 M103,78 h14 M120,80 h12" stroke="${s.ink}" stroke-width=".8" opacity=".5"/>` +
      windmill(s.ink, 152, 48) +
      windmill(s.ink, 82, 64, 0.65) +
      `<rect x="168" y="74" width="26" height="10" fill="${s.ink}"/><path fill="${s.ink}" d="M167,74 L181,68 L195,74Z"/>` +
      windows(s, [
        [36, 50],
        [62, 34],
        [74, 44],
        [174, 77],
        [186, 77],
      ]) +
      water(s, "6,95 L80,95", "110,97 L190,97"),
  },
};
