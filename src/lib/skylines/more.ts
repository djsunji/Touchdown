import { palm, type CityStyle, type LibraryCity } from "./shared";

// Hand-drawn skylines: Turkish Riviera, Croatian coast, UK regional cities, Stavanger, Katowice

// Calm water strip below the ground line with two light reflections
function water(s: CityStyle, a = 8, b = 70, c = 110, d = 190) {
  return (
    `<rect x="0" y="92" width="200" height="8" fill="${s.far}"/>` +
    `<path d="M${a},95 L${b},95 M${c},97 L${d},97" stroke="${s.sky[1]}" stroke-width="1" opacity=".55"/>`
  );
}

// Small sailing boat on the water
function boat(ink: string, x: number) {
  return `<path fill="${ink}" d="M${x - 7},94 L${x + 7},94 L${x + 4},97 L${x - 4},97Z M${x},94 L${x},85 L${x + 5},93Z"/>`;
}

// Lit windows: [x, y] pairs as small rects in the horizon colour
function lights(s: CityStyle, pts: [number, number][], op = 0.6) {
  return pts
    .map(
      ([x, y]) =>
        `<rect x="${x}" y="${y}" width="2" height="2.4" fill="${s.sky[1]}" opacity="${op}"/>`,
    )
    .join("");
}

// Row of battlement merlons sitting on y (their bottom edge)
function merlons(x0: number, x1: number, y: number, step = 4, w = 2.4, h = 3) {
  let d = "";
  for (let x = x0; x <= x1 - w + 0.01; x += step)
    d += `<rect x="${x.toFixed(1)}" y="${y - h}" width="${w}" height="${h}"/>`;
  return d;
}

// Row of round-headed arch openings (top of the round head at y, height h)
function arches(
  fill: string,
  x0: number,
  x1: number,
  step: number,
  w: number,
  y: number,
  h: number,
  op = 1,
) {
  let d = "";
  for (let x = x0; x <= x1 - w + 0.01; x += step)
    d += `M${x.toFixed(1)},${y + h} L${x.toFixed(1)},${y + w / 2} A${w / 2},${w / 2} 0 0 1 ${(x + w).toFixed(1)},${y + w / 2} L${(x + w).toFixed(1)},${y + h}Z `;
  return `<path fill="${fill}" opacity="${op}" d="${d}"/>`;
}

// Gabled house: wall rect from top y down to 92, roof triangle above
function house(x: number, w: number, y: number, roof: number, wall: string) {
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${92 - y}" fill="${wall}"/>` +
    `<path d="M${x - 1},${y} L${x + w / 2},${y - roof} L${x + w + 1},${y}Z"/>`
  );
}

// Liver bird perched on a dome, wings raised (x centre, y feet)
function liverBird(x: number, y: number) {
  return `<path d="M${x - 4},${y - 8} L${x - 1},${y - 4} L${x},${y - 7} L${x + 1},${y - 4} L${x + 4},${y - 8} L${x + 2},${y - 2} L${x + 1.2},${y} L${x - 1.2},${y} L${x - 2},${y - 2}Z"/>`;
}

export const MORE: Record<string, LibraryCity> = {
  AYT: {
    city: "Antalya",
    country: "Türkei",
    timezone: "Europe/Istanbul",
    style: {
      sky: ["#2b2452", "#f4a26b"],
      ink: "#170f24",
      far: "#4c4170",
      tag: "Yivli Minare",
    },
    draw: (s) => {
      // Fluted Yivli Minaret above Kaleiçi, the old harbour below the cliff, Taurus mountains behind
      let flutes = "";
      for (let x = 66.8; x <= 73.4; x += 1.6)
        flutes += `M${x.toFixed(1)},31 L${x.toFixed(1)},64 `;
      return (
        `<path fill="${s.far}" d="M0,62 L12,50 L22,56 L38,34 L50,46 L62,30 L78,46 L94,36 L110,50 L128,28 L144,42 L160,30 L178,46 L200,36 L200,100 L0,100Z"/>` +
        `<path fill="#fff" opacity=".4" d="M34,39 L38,34 L42,40 L38,38Z M58,35 L62,30 L66,36 L62,34Z M124,33 L128,28 L132,34 L128,32Z M156,35 L160,30 L164,36 L160,34Z"/>` +
        lights(s, [
          [10, 82],
          [24, 80],
          [100, 78],
        ]) +
        `<g fill="${s.ink}"><path d="M0,92 L0,82 L20,80 L44,76 L56,72 L84,72 L98,76 L110,80 L118,80 L120,76 L132,72 L200,70 L200,92Z"/>` +
        // Yivli Minare on its square base
        `<rect x="61" y="62" width="18" height="12"/><rect x="65.5" y="30" width="9" height="34"/>` +
        `<rect x="63" y="27" width="14" height="3"/><rect x="66.8" y="19" width="6.4" height="8"/>` +
        `<path d="M66.3,19 L70,8 L73.7,19Z"/><rect x="69.6" y="3" width=".8" height="6"/>` +
        // Small domed mosque beside it
        `<path d="M80,72 L80,66 Q90,56 100,66 L100,76Z"/><rect x="89.5" y="56" width="1" height="3"/>` +
        // Kaleiçi houses on the cliff, clock tower
        `<rect x="134" y="62" width="10" height="10"/><path d="M133,62 L139,57 L145,62Z"/>` +
        `<rect x="146" y="60" width="12" height="11"/><path d="M145,60 L152,55 L159,60Z"/>` +
        `<rect x="160" y="64" width="9" height="7"/><path d="M159,64 L164.5,60 L170,64Z"/>` +
        `<rect x="172" y="50" width="8" height="21"/>` +
        merlons(171.5, 180.5, 50, 3, 2) +
        `<rect x="182" y="61" width="12" height="10"/><path d="M181,61 L188,56 L195,61Z"/></g>` +
        `<path stroke="${s.far}" stroke-width=".7" opacity=".9" d="${flutes}"/>` +
        `<rect x="174.5" y="54" width="3" height="3" fill="${s.sky[1]}" opacity=".8"/>` +
        lights(s, [
          [137, 65],
          [150, 63],
          [186, 64],
          [163, 66],
        ]) +
        water(s, 6, 60, 96, 176) +
        boat(s.ink, 112) +
        boat(s.ink, 30)
      );
    },
  },
  ADB: {
    city: "Izmir",
    country: "Türkei",
    timezone: "Europe/Istanbul",
    style: {
      sky: ["#1d3557", "#f0b48c"],
      ink: "#0d1a2c",
      far: "#3d5f82",
      tag: "Saat Kulesi",
    },
    draw: (s) => {
      // Konak clock tower on the square, Yalı mosque and palms, hills across the bay
      return (
        `<path fill="${s.far}" d="M0,74 Q24,62 52,68 Q84,56 116,64 Q150,54 176,62 Q190,64 200,62 L200,86 L0,86Z"/>` +
        lights(s, [
          [10, 76],
          [34, 72],
          [62, 74],
          [150, 70],
          [182, 70],
        ]) +
        `<g fill="${s.ink}"><rect x="0" y="86" width="200" height="6"/>` +
        // Clock tower: fountain base, three tapering storeys, cupola
        `<rect x="82" y="80" width="36" height="6"/><rect x="85" y="77" width="30" height="3"/>` +
        `<rect x="89" y="60" width="22" height="17"/><rect x="87" y="58" width="26" height="2.4"/>` +
        `<rect x="91.5" y="44" width="17" height="14"/><rect x="89.5" y="42" width="21" height="2.4"/>` +
        `<rect x="93.5" y="30" width="13" height="12"/><rect x="92" y="28" width="16" height="2.4"/>` +
        `<rect x="95.5" y="21" width="9" height="7"/><path d="M94.5,21 Q100,10 105.5,21Z"/>` +
        `<rect x="99.4" y="6" width="1.2" height="7"/><circle cx="100" cy="6" r="1.4"/>` +
        // Yalı mosque, octagonal with a dome
        `<path d="M132,86 L132,72 L152,72 L152,86Z M131,72 Q142,58 153,72Z"/><rect x="141.4" y="58" width="1.2" height="4"/></g>` +
        arches(s.far, 91.5, 109, 6, 3.5, 63, 11) +
        arches(s.far, 94, 107, 5, 3, 47, 8) +
        `<circle cx="100" cy="36" r="3.6" fill="${s.sky[1]}" opacity=".9"/>` +
        `<path d="M100,36 L100,33.6 M100,36 L101.8,36" stroke="${s.ink}" stroke-width=".6"/>` +
        arches(s.sky[1], 97.5, 103, 4, 2, 23, 4, 0.7) +
        palm(s.ink, 30, 34) +
        palm(s.ink, 52, 28) +
        palm(s.ink, 166, 36) +
        palm(s.ink, 186, 30) +
        water(s, 6, 60, 120, 190)
      );
    },
  },
  ZAD: {
    city: "Zadar",
    country: "Kroatien",
    timezone: "Europe/Zagreb",
    style: {
      sky: ["#2d2a5e", "#f6a46c"],
      ink: "#15122b",
      far: "#4d4a7e",
      tag: "Sv. Donat",
    },
    draw: (s) => {
      // Round church of St. Donatus, St. Anastasia's bell tower, sea organ steps, islands
      let lesenes = "";
      for (let x = 54; x <= 88; x += 5) lesenes += `M${x},58 L${x},84 `;
      return (
        `<circle cx="176" cy="62" r="7" fill="${s.sky[1]}" opacity=".7"/>` +
        `<path fill="${s.far}" d="M0,80 Q30,74 60,78 L130,78 Q160,72 200,76 L200,92 L0,92Z"/>` +
        `<g fill="${s.ink}"><rect x="0" y="84" width="200" height="8"/>` +
        // St. Donatus: low drum with lean-to roof, tall central drum with conical roof
        `<rect x="50" y="56" width="42" height="28"/><path d="M48,57 L60,49 L82,49 L94,57Z"/>` +
        `<rect x="60" y="34" width="22" height="16"/><path d="M58,35 L71,25 L84,35Z"/>` +
        `<path d="M92,84 L92,66 Q100,66 100,74 L100,84Z"/>` +
        // Bell tower of St. Anastasia
        `<rect x="116" y="24" width="16" height="60"/><rect x="114.5" y="22" width="19" height="2.4"/>` +
        `<rect x="119" y="14" width="10" height="8"/><path d="M118,14 L124,5 L130,14Z"/><rect x="123.5" y="1" width="1" height="5"/>` +
        // Cathedral facade with gable
        `<path d="M134,84 L134,54 L150,44 L166,54 L166,84Z"/>` +
        // Sea organ steps descending into the water
        `<path d="M150,92 L150,88 L200,88 L200,92Z"/></g>` +
        `<path stroke="${s.far}" stroke-width=".8" d="${lesenes}"/>` +
        arches(s.sky[1], 64, 80, 6, 2.6, 38, 5, 0.6) +
        arches(s.far, 118.5, 131, 6, 3.4, 30, 8) +
        arches(s.far, 118.5, 131, 6, 3.4, 44, 8) +
        arches(s.far, 118.5, 131, 6, 3.4, 58, 8) +
        arches(s.sky[1], 122, 127, 4, 2.4, 16, 4, 0.7) +
        `<circle cx="150" cy="58" r="4" fill="${s.far}"/>` +
        arches(s.far, 138, 162, 6, 2.4, 64, 7) +
        `<path d="M150,90 L200,90 M160,88 L160,92 M172,88 L172,92 M184,88 L184,92" stroke="${s.far}" stroke-width=".7"/>` +
        water(s, 6, 70, 100, 140) +
        boat(s.ink, 26)
      );
    },
  },
  PUY: {
    city: "Pula",
    country: "Kroatien",
    timezone: "Europe/Zagreb",
    style: {
      sky: ["#203a5a", "#f3b27c"],
      ink: "#0f1b2b",
      far: "#3e5d7d",
      tag: "Arena",
    },
    draw: (s) => {
      // Roman amphitheatre with two arcades and its four towers, shipyard cranes behind
      let windows = "";
      for (let x = 30; x <= 166; x += 8)
        windows += `<rect x="${x}" y="40" width="3.2" height="3.4"/>`;
      return (
        `<path fill="${s.far}" d="M0,72 Q30,64 60,70 L140,70 Q170,62 200,68 L200,92 L0,92Z"/>` +
        `<path stroke="${s.far}" stroke-width="2" fill="none" d="M8,72 L8,34 L30,34 M14,34 L14,44 M190,72 L190,30 L168,30 M176,30 L176,40"/>` +
        `<g fill="${s.ink}"><rect x="0" y="86" width="200" height="6"/>` +
        `<rect x="22" y="36" width="156" height="50"/><rect x="21" y="34" width="158" height="3"/>` +
        `<rect x="20" y="60" width="160" height="2.4"/><rect x="20" y="46" width="160" height="2"/>` +
        // Four stair towers
        `<rect x="18" y="30" width="12" height="56"/><rect x="72" y="32" width="10" height="54"/>` +
        `<rect x="118" y="32" width="10" height="54"/><rect x="170" y="30" width="12" height="56"/></g>` +
        `<g fill="${s.sky[1]}" opacity=".7">${windows}</g>` +
        arches(s.sky[1], 33, 70, 7.5, 5, 49, 11, 0.7) +
        arches(s.sky[1], 85, 116, 7.5, 5, 49, 11, 0.7) +
        arches(s.sky[1], 131, 168, 7.5, 5, 49, 11, 0.7) +
        arches(s.sky[1], 33, 70, 7.5, 5, 64, 22, 0.5) +
        arches(s.sky[1], 85, 116, 7.5, 5, 64, 22, 0.5) +
        arches(s.sky[1], 131, 168, 7.5, 5, 64, 22, 0.5) +
        lights(s, [
          [23, 38],
          [75, 40],
          [121, 40],
          [175, 38],
        ]) +
        water(s, 6, 60, 120, 190)
      );
    },
  },
  NCL: {
    city: "Newcastle",
    country: "Grossbritannien",
    timezone: "Europe/London",
    style: {
      sky: ["#232b4f", "#e9a487"],
      ink: "#10142a",
      far: "#434c75",
      tag: "Tyne Bridge",
    },
    draw: (s) => {
      // Tyne Bridge arch with its granite towers, the tilting Millennium Bridge and Sage behind
      const ay = (x: number) => {
        const t = (x - 34) / 82;
        return (1 - t) * (1 - t) * 88 + 2 * t * (1 - t) * -40 + t * t * 88;
      };
      let hangers = "";
      for (let x = 46; x <= 104; x += 6)
        if (ay(x) < 55) hangers += `M${x},${ay(x).toFixed(1)} L${x},56 `;
      let cables = "";
      for (let x = 148; x <= 192; x += 6) {
        const t = (x - 140) / 58;
        const top = (1 - t) * (1 - t) * 80 + 2 * t * (1 - t) * 26 + t * t * 80;
        const deck = (1 - t) * (1 - t) * 80 + 2 * t * (1 - t) * 70 + t * t * 80;
        cables += `M${x},${top.toFixed(1)} L${x},${deck.toFixed(1)} `;
      }
      return (
        `<path fill="${s.far}" d="M132,80 L132,64 Q142,50 156,56 Q166,44 180,52 Q192,46 200,54 L200,80Z"/>` +
        `<path fill="${s.far}" d="M0,80 L0,60 L8,60 L8,52 L16,52 L16,80Z M150,80 L150,58 L154,40 L158,58 L158,80Z"/>` +
        lights(s, [
          [4, 64],
          [10, 56],
          [170, 60],
          [186, 58],
        ]) +
        `<g fill="${s.ink}"><rect x="0" y="80" width="200" height="12"/>` +
        `<rect x="0" y="54" width="140" height="3"/>` +
        `<rect x="18" y="38" width="12" height="54"/><rect x="17" y="36" width="14" height="2.4"/>` +
        `<rect x="120" y="38" width="12" height="54"/><rect x="119" y="36" width="14" height="2.4"/>` +
        `<path d="M136,80 L140,80 L141,84 L135,84Z M196,80 L200,80 L200,84 L195,84Z"/></g>` +
        `<path stroke="${s.ink}" stroke-width="3" fill="none" d="M34,88 Q75,-40 116,88"/>` +
        `<path stroke="${s.ink}" stroke-width="1.4" fill="none" d="M38,88 Q75,-28 112,88"/>` +
        `<path stroke="${s.ink}" stroke-width=".7" d="${hangers}"/>` +
        `<path stroke="${s.ink}" stroke-width="2.4" fill="none" d="M140,80 Q169,26 198,80"/>` +
        `<path stroke="${s.ink}" stroke-width="2" fill="none" d="M140,80 Q169,70 198,80"/>` +
        `<path stroke="${s.ink}" stroke-width=".5" d="${cables}"/>` +
        lights(s, [
          [22, 44],
          [124, 44],
        ]) +
        water(s, 6, 60, 100, 180)
      );
    },
  },
  LPL: {
    city: "Liverpool",
    country: "Grossbritannien",
    timezone: "Europe/London",
    style: {
      sky: ["#1c2f4e", "#e6ad7e"],
      ink: "#0b1424",
      far: "#3a5476",
      tag: "Royal Liver Building",
    },
    draw: (s) => {
      // Royal Liver Building with its two clock towers and Liver birds, Cunard and Port buildings,
      // the Anglican Cathedral tower behind
      const tower = (x: number) =>
        `<rect x="${x}" y="34" width="16" height="22"/><rect x="${x - 1}" y="32" width="18" height="2.4"/>` +
        `<rect x="${x + 2}" y="24" width="12" height="8"/><path d="M${x + 1.5},24 Q${x + 8},13 ${x + 14.5},24Z"/>` +
        liverBird(x + 8, 16);
      const clock = (x: number) =>
        `<circle cx="${x + 8}" cy="42" r="4" fill="${s.sky[1]}" opacity=".9"/>` +
        `<path d="M${x + 8},42 L${x + 8},39.4 M${x + 8},42 L${x + 10},42" stroke="${s.ink}" stroke-width=".6"/>`;
      let win = "";
      for (let y = 60; y <= 80; y += 6)
        for (let x = 26; x <= 98; x += 6)
          win += `<rect x="${x}" y="${y}" width="2" height="2.6"/>`;
      return (
        `<path fill="${s.far}" d="M140,86 L140,40 L146,40 L146,30 L150,30 L150,22 L154,22 L154,16 L162,16 L162,22 L166,22 L166,30 L170,30 L170,40 L176,40 L176,86Z"/>` +
        `<path fill="${s.far}" d="M154,16 L154,12 L156,14 L158,12 L160,14 L162,12 L162,16Z"/>` +
        `<g fill="${s.ink}"><rect x="0" y="86" width="200" height="6"/>` +
        `<rect x="20" y="54" width="86" height="32"/><rect x="18" y="52" width="90" height="3"/>` +
        tower(24) +
        tower(82) +
        `<rect x="108" y="64" width="34" height="22"/><rect x="107" y="62" width="36" height="2.4"/>` +
        `<rect x="150" y="66" width="46" height="20"/><rect x="164" y="58" width="18" height="8"/>` +
        `<path d="M164,58 Q173,40 182,58Z"/><rect x="172.4" y="42" width="1.2" height="5"/>` +
        `<rect x="150" y="60" width="5" height="6"/><rect x="191" y="60" width="5" height="6"/></g>` +
        clock(24) +
        clock(82) +
        `<g fill="${s.sky[1]}" opacity=".45">${win}</g>` +
        lights(s, [
          [114, 68],
          [124, 68],
          [134, 68],
          [158, 70],
          [186, 70],
          [156, 34],
        ]) +
        water(s, 6, 80, 110, 190)
      );
    },
  },
  CWL: {
    city: "Cardiff",
    country: "Grossbritannien",
    timezone: "Europe/London",
    style: {
      sky: ["#24304f", "#d9a77a"],
      ink: "#111726",
      far: "#465372",
      tag: "Cardiff Castle",
    },
    draw: (s) => {
      // Norman shell keep on its motte, the castle clock tower, Millennium Centre roof
      let ribs = "";
      for (let i = 0; i < 5; i++)
        ribs += `M148,${60 + i * 4} Q168,${42 + i * 4} 200,${46 + i * 4} `;
      return (
        `<path fill="${s.far}" d="M0,74 Q40,64 80,70 Q120,62 160,68 Q180,62 200,66 L200,92 L0,92Z"/>` +
        lights(s, [
          [8, 74],
          [92, 72],
          [140, 72],
        ]) +
        `<g fill="${s.ink}"><rect x="0" y="86" width="200" height="6"/>` +
        // Motte and polygonal shell keep with gate tower
        `<path d="M8,86 Q22,68 38,64 L82,64 Q98,68 112,86Z"/>` +
        `<path d="M36,64 L38,46 L82,46 L84,64Z"/>` +
        merlons(37, 83, 46, 4, 2.4, 3) +
        `<rect x="52" y="36" width="14" height="10"/>` +
        merlons(52, 66, 36, 3.5, 2, 3) +
        // Curtain wall and clock tower
        `<rect x="104" y="68" width="16" height="18"/>` +
        merlons(104, 120, 68, 4, 2.4, 3) +
        `<rect x="120" y="28" width="16" height="58"/><rect x="118.5" y="26" width="19" height="2.4"/>` +
        `<rect x="118" y="26" width="3" height="4"/><rect x="133" y="26" width="3" height="4"/>` +
        `<path d="M121,26 L128,8 L135,26Z"/><rect x="127.5" y="3" width="1" height="6"/>` +
        // Wales Millennium Centre: curved shell roof
        `<path d="M146,86 L146,62 Q166,40 200,44 L200,86Z"/></g>` +
        `<path stroke="${s.sky[1]}" stroke-width=".6" fill="none" opacity=".45" d="${ribs}"/>` +
        `<path stroke="${s.sky[1]}" stroke-width="1.6" fill="none" opacity=".75" stroke-dasharray="2 1.2" d="M154,68 L196,68 M154,74 L196,74"/>` +
        `<path fill="${s.far}" d="M56,64 L56,57 Q59,53 62,57 L62,64Z"/>` +
        `<circle cx="128" cy="36" r="3.6" fill="${s.sky[1]}" opacity=".9"/>` +
        `<path d="M128,36 L128,33.4 M128,36 L130,36" stroke="${s.ink}" stroke-width=".6"/>` +
        lights(s, [
          [42, 52],
          [72, 52],
          [126, 50],
          [126, 60],
        ]) +
        water(s, 6, 70, 110, 190)
      );
    },
  },
  SVG: {
    city: "Stavanger",
    country: "Norwegen",
    timezone: "Europe/Oslo",
    style: {
      sky: ["#183049", "#e9b48e"],
      ink: "#0a1622",
      far: "#2f5168",
      tag: "Preikestolen",
    },
    draw: (s) => {
      // Preikestolen's flat-topped pulpit with its sheer face above the fjord, white wooden houses
      // of Gamle Stavanger on the shore
      const wall = "#ece4d6";
      return (
        `<path fill="${s.far}" opacity=".55" d="M0,70 L22,58 L40,62 L64,44 L84,50 L104,30 L124,24 L150,30 L172,20 L200,26 L200,86 L0,86Z"/>` +
        `<path fill="${s.far}" d="M84,86 L92,70 L100,64 L104,50 L118,40 L126,40 L130,30 L150,26 L170,30 L200,24 L200,86Z"/>` +
        `<g fill="${s.ink}"><path d="M110,86 L113,46 L111,43 L148,41 L151,46 L158,50 L168,46 L182,36 L200,30 L200,86Z"/>` +
        `<rect x="130" y="38" width="1.2" height="3"/><circle cx="130.6" cy="37.3" r=".8"/></g>` +
        `<path stroke="${s.sky[1]}" stroke-width="1" opacity=".75" fill="none" d="M111,43 L148,41"/>` +
        `<path stroke="${s.far}" stroke-width=".7" fill="none" d="M116,46 L116,84 M121,45 L122,80 M136,42 L136,48"/>` +
        `<g fill="${s.ink}"><rect x="0" y="86" width="200" height="6"/>` +
        house(4, 14, 58, 7, wall) +
        house(20, 12, 54, 7, wall) +
        house(34, 14, 60, 8, wall) +
        house(50, 12, 56, 7, wall) +
        house(64, 14, 62, 7, wall) +
        house(80, 12, 64, 6, wall) +
        `<rect x="25.5" y="42" width="1" height="6"/></g>` +
        `<g fill="${s.ink}" opacity=".7">` +
        [
          [7, 63],
          [13, 63],
          [23, 59],
          [28, 59],
          [37, 65],
          [43, 65],
          [53, 61],
          [58, 61],
          [67, 67],
          [73, 67],
          [83, 69],
          [88, 69],
          [7, 74],
          [23, 70],
          [43, 76],
          [58, 72],
          [73, 78],
        ]
          .map(([x, y]) => `<rect x="${x}" y="${y}" width="2.4" height="3"/>`)
          .join("") +
        `</g>` +
        water(s, 6, 60, 100, 190) +
        boat(s.ink, 104)
      );
    },
  },
  KTW: {
    city: "Kattowitz",
    country: "Polen",
    timezone: "Europe/Warsaw",
    style: {
      sky: ["#2a2547", "#e59b7a"],
      ink: "#141022",
      far: "#4a4370",
      tag: "Spodek",
    },
    draw: (s) => {
      // Spodek "flying saucer" arena, Superjednostka slab, Altus tower and a mine headframe
      let ribs = "";
      for (let i = 0; i <= 12; i++) {
        const x0 = 48 + i * (104 / 12);
        const x1 = 80 + i * (40 / 12);
        ribs += `M${x0.toFixed(1)},52 L${x1.toFixed(1)},76 `;
      }
      let slab = "";
      for (let y = 50; y <= 78; y += 4)
        for (let x = 3; x <= 37; x += 5)
          slab += `<rect x="${x}" y="${y}" width="2" height="1.6"/>`;
      return (
        `<g fill="${s.far}"><rect x="0" y="46" width="42" height="40"/>` +
        `<rect x="164" y="14" width="14" height="72"/><path d="M164,14 L178,20 L178,14Z"/>` +
        `<rect x="150" y="50" width="12" height="36"/></g>` +
        `<g fill="${s.sky[1]}" opacity=".45">${slab}</g>` +
        lights(s, [
          [168, 24],
          [172, 36],
          [168, 48],
          [172, 60],
          [154, 56],
        ]) +
        `<g fill="${s.ink}"><rect x="0" y="86" width="200" height="6"/>` +
        `<ellipse cx="100" cy="48" rx="56" ry="7"/>` +
        `<path d="M44,48 L80,77 L120,77 L156,48Z"/>` +
        `<path d="M80,77 L84,86 L116,86 L120,77Z"/>` +
        `<path d="M60,86 L70,80 L130,80 L140,86Z"/></g>` +
        `<path stroke="${s.far}" stroke-width=".7" d="${ribs}"/>` +
        `<path stroke="${s.sky[1]}" stroke-width=".8" fill="none" opacity=".7" d="M46,49 Q100,58 154,49"/>` +
        `<g stroke="${s.ink}" stroke-width="1.4" fill="none"><path d="M178,86 L186,46 L194,86 M181,72 L191,72 M183,60 L189,60 M186,46 L176,86"/>` +
        `<circle cx="186" cy="44" r="3.2"/></g>` +
        `<rect x="88" y="81" width="24" height="3" fill="${s.sky[1]}" opacity=".5"/>` +
        water(s, 6, 70, 110, 190)
      );
    },
  },
  INV: {
    city: "Inverness",
    country: "Grossbritannien",
    timezone: "Europe/London",
    style: {
      sky: ["#1f3346", "#d8b088"],
      ink: "#0c1720",
      far: "#3c5a6a",
      tag: "Inverness Castle",
    },
    draw: (s) => {
      // Red sandstone castle on its hill above the River Ness, St Andrew's Cathedral, Highlands
      return (
        `<path fill="${s.far}" opacity=".55" d="M0,56 Q20,40 42,48 Q66,30 92,44 Q120,26 148,40 Q174,30 200,42 L200,86 L0,86Z"/>` +
        `<path fill="${s.far}" d="M0,72 Q30,62 60,68 L140,68 Q170,60 200,66 L200,88 L0,88Z"/>` +
        `<g fill="${s.far}"><rect x="152" y="56" width="8" height="20"/><rect x="172" y="56" width="8" height="20"/>` +
        `<rect x="160" y="62" width="12" height="14"/><path d="M160,62 L166,56 L172,62Z"/>` +
        merlons(151.5, 160.5, 56, 3, 2, 2.4) +
        merlons(171.5, 180.5, 56, 3, 2, 2.4) +
        `</g>` +
        `<g fill="${s.ink}"><rect x="0" y="86" width="200" height="6"/>` +
        `<path d="M14,86 Q30,70 52,66 L120,66 Q138,70 150,86Z"/>` +
        // Castle: main block, round tower left, square tower right with turret
        `<rect x="58" y="44" width="50" height="22"/>` +
        merlons(58, 108, 44, 4, 2.4, 3) +
        `<rect x="48" y="36" width="12" height="30"/>` +
        merlons(48, 60, 36, 3.2, 2, 3) +
        `<rect x="104" y="30" width="14" height="36"/>` +
        merlons(104, 118, 30, 3.6, 2, 3) +
        `<rect x="115" y="22" width="5" height="8"/><path d="M114.5,22 L117.5,16 L120.5,22Z"/>` +
        `<rect x="80" y="30" width="1" height="14"/><path d="M81,30 L88,32.5 L81,35Z"/>` +
        // Ness bridge
        `<rect x="150" y="82" width="50" height="2.4"/><path d="M160,86 L162,84 L164,86Z M180,86 L182,84 L184,86Z"/></g>` +
        arches(s.sky[1], 64, 104, 8, 2.4, 50, 5, 0.6) +
        arches(s.sky[1], 52, 57, 4, 2.4, 42, 5, 0.6) +
        arches(s.sky[1], 108, 116, 5, 2.4, 36, 5, 0.6) +
        lights(s, [
          [30, 76],
          [140, 74],
          [190, 72],
        ]) +
        water(s, 6, 60, 110, 190)
      );
    },
  },
};
