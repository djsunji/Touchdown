import { palm, type CityStyle, type LibraryCity } from "./shared";

// Hand-drawn skylines: Austrian, Swiss, Bavarian-Swabian and South Tyrolean Alpine cities

// Calm water strip below the ground line with two light reflections
function water(s: CityStyle, a = 8, b = 70, c = 110, d = 190) {
  return (
    `<rect x="0" y="92" width="200" height="8" fill="${s.far}"/>` +
    `<path d="M${a},95 L${b},95 M${c},97 L${d},97" stroke="${s.sky[1]}" stroke-width="1" opacity=".55"/>`
  );
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

// Mountain ridge through the given peaks, closed down to the bottom edge
function ridge(fill: string, pts: [number, number][], op = 1) {
  const d = pts.map(([x, y], i) => (i ? "L" : "M") + x + "," + y).join(" ");
  const last = pts[pts.length - 1][0];
  const first = pts[0][0];
  return `<path fill="${fill}" opacity="${op}" d="${d} L${last},100 L${first},100Z"/>`;
}

// Snow caps: small white triangles hanging from each peak [x, y, size]
function snow(peaks: [number, number, number][], op = 0.55) {
  const d = peaks
    .map(
      ([x, y, w]) =>
        `M${x - w},${y + w * 1.2} L${x},${y} L${x + w},${y + w * 1.2} L${x + w * 0.4},${y + w * 0.9} L${x - w * 0.3},${y + w * 1.3}Z`,
    )
    .join(" ");
  return `<path fill="#fff" opacity="${op}" d="${d}"/>`;
}

// Baroque onion cap sitting on a tower top: centre x, top of tower y, half width w
function onion(x: number, y: number, w: number) {
  return (
    `<path d="M${x - w},${y} Q${x - w - 1},${y - w * 1.1} ${x},${y - w * 2} Q${x + w + 1},${y - w * 1.1} ${x + w},${y}Z"/>` +
    `<rect x="${x - 0.6}" y="${y - w * 2 - 5}" width="1.2" height="5"/><circle cx="${x}" cy="${y - w * 2 - 5}" r="1"/>`
  );
}

// Battlements along a wall top
function merlons(x0: number, x1: number, y: number, step = 4) {
  let r = "";
  for (let x = x0; x <= x1; x += step)
    r += `<rect x="${x}" y="${y - 2.4}" width="2.2" height="2.4"/>`;
  return r;
}

export const ALPINE: Record<string, LibraryCity> = {
  SZG: {
    city: "Salzburg",
    country: "Österreich",
    timezone: "Europe/Vienna",
    style: {
      sky: ["#2b2445", "#e6a77e"],
      ink: "#140f22",
      far: "#4b3f63",
      tag: "Festung Hohensalzburg",
    },
    draw: (s) => {
      // Fortress on the Festungsberg, Untersberg massif behind, cathedral domes by the Salzach
      return (
        ridge(s.far, [
          [100, 74],
          [118, 56],
          [134, 44],
          [150, 40],
          [170, 42],
          [186, 48],
          [200, 54],
        ]) +
        ridge(
          s.far,
          [
            [0, 64],
            [20, 58],
            [40, 62],
          ],
          0.7,
        ) +
        `<g fill="${s.ink}"><path d="M0,92 L0,72 Q18,66 30,58 L42,50 L104,50 Q114,54 120,64 Q128,76 140,82 L200,82 L200,92Z"/>` +
        // fortress walls, palace and keep
        `<rect x="42" y="42" width="62" height="8"/>` +
        merlons(42, 102, 42) +
        `<rect x="54" y="28" width="34" height="14"/><path d="M52,28 L58,22 L84,22 L90,28Z"/>` +
        `<rect x="68" y="12" width="8" height="12"/><path d="M67,12 L72,5 L77,12Z"/>` +
        `<rect x="44" y="32" width="7" height="10"/><path d="M43,32 L47.5,26 L52,32Z"/>` +
        `<rect x="92" y="34" width="10" height="8"/><path d="M91,34 L97,29 L103,34Z"/>` +
        `<rect x="30" y="54" width="14" height="6"/>` +
        // cathedral: nave, twin towers and crossing dome
        `<rect x="138" y="62" width="40" height="22"/>` +
        `<rect x="138" y="46" width="9" height="18"/><rect x="169" y="46" width="9" height="18"/>` +
        onion(142.5, 46, 4.5) +
        onion(173.5, 46, 4.5) +
        `<rect x="151" y="52" width="14" height="10"/><path d="M150,52 Q150,42 158,40 Q166,42 166,52Z"/>` +
        `<rect x="156.5" y="34" width="3" height="6"/><path d="M156,34 L158,29 L160,34Z"/>` +
        `<rect x="182" y="68" width="18" height="16"/><path d="M181,68 L190,62 L199,68Z"/>` +
        `<rect x="122" y="70" width="14" height="14"/></g>` +
        lights(s, [
          [60, 32],
          [66, 32],
          [80, 32],
          [71, 16],
          [141, 54],
          [172, 54],
          [157, 56],
          [186, 72],
        ]) +
        water(s, 6, 60, 104, 186)
      );
    },
  },
  INN: {
    city: "Innsbruck",
    country: "Österreich",
    timezone: "Europe/Vienna",
    style: {
      sky: ["#1d2f4f", "#f0b98c"],
      ink: "#0d1424",
      far: "#43577a",
      tag: "Goldenes Dachl",
    },
    draw: (s) => {
      // Nordkette wall right behind the town, Stadtturm, Goldenes Dachl, colourful houses on the Inn
      const houses: [number, number, string][] = [
        [104, 26, "#d9874c"],
        [116, 30, "#e3c36a"],
        [128, 24, "#8fb39a"],
        [140, 28, "#c56b6b"],
        [152, 22, "#9fb6d6"],
        [164, 27, "#e3a25f"],
        [176, 24, "#b98bb0"],
        [188, 28, "#d9c27a"],
      ];
      let fronts = "";
      let tints = "";
      houses.forEach(([x, h, c]) => {
        const top = 84 - h;
        fronts += `<rect x="${x}" y="${top}" width="11" height="${h}"/><path d="M${x - 0.5},${top} L${x + 5.5},${top - 6} L${x + 11.5},${top}Z"/>`;
        tints += `<rect x="${x + 1}" y="${top + 1}" width="9" height="${h - 3}" fill="${c}" opacity=".55"/>`;
      });
      return (
        ridge(s.far, [
          [0, 56],
          [12, 44],
          [22, 50],
          [36, 30],
          [48, 40],
          [60, 26],
          [74, 38],
          [88, 22],
          [102, 34],
          [118, 26],
          [134, 40],
          [150, 24],
          [166, 36],
          [182, 28],
          [200, 40],
        ]) +
        snow([
          [36, 30, 5],
          [60, 26, 5],
          [88, 22, 6],
          [118, 26, 5],
          [150, 24, 6],
          [182, 28, 5],
        ]) +
        `<path fill="${s.far}" opacity=".7" d="M0,70 Q50,58 100,64 Q150,70 200,60 L200,100 L0,100Z"/>` +
        `<g fill="${s.ink}"><rect x="0" y="84" width="200" height="8"/>` +
        // Stadtturm with gallery and onion cap
        `<rect x="30" y="30" width="11" height="54"/><rect x="28" y="40" width="15" height="2.4"/>` +
        `<rect x="31" y="24" width="9" height="6"/>` +
        onion(35.5, 24, 5) +
        // Goldenes Dachl house with its oriel
        `<rect x="48" y="52" width="34" height="32"/><path d="M47,52 L65,42 L83,52Z"/>` +
        `<rect x="57" y="60" width="16" height="14" fill="${s.far}"/>` +
        `<rect x="8" y="58" width="18" height="26"/><path d="M7,58 L17,50 L27,58Z"/>` +
        `<rect x="86" y="62" width="14" height="22"/><path d="M85,62 L93,55 L101,62Z"/>` +
        fronts +
        `</g>` +
        `<path fill="#f2c14e" d="M56,61 L65,50 L74,61Z"/>` +
        `<path d="M58,66 L72,66 M58,70 L72,70" stroke="#f2c14e" stroke-width=".8" opacity=".7"/>` +
        tints +
        lights(s, [
          [34, 46],
          [34, 56],
          [12, 64],
          [20, 70],
          [90, 68],
        ]) +
        water(s, 6, 64, 100, 192)
      );
    },
  },
  GRZ: {
    city: "Graz",
    country: "Österreich",
    timezone: "Europe/Vienna",
    style: {
      sky: ["#3a2340", "#eb9a7a"],
      ink: "#1b0f1e",
      far: "#5c3e5e",
      tag: "Uhrturm & Murinsel",
    },
    draw: (s) => {
      // Clock tower on the wooded Schlossberg, the Murinsel shell in the river, Kunsthaus bubble
      let trees = "";
      [
        [22, 66, 6],
        [32, 58, 7],
        [44, 52, 6],
        [86, 50, 6],
        [96, 56, 7],
        [108, 64, 6],
      ].forEach(([x, y, r]) => {
        trees += `<circle cx="${x}" cy="${y}" r="${r}"/>`;
      });
      return (
        `<path fill="${s.far}" d="M0,66 Q30,54 60,60 Q100,50 140,58 Q170,52 200,60 L200,100 L0,100Z"/>` +
        `<g fill="${s.ink}"><path d="M0,92 L0,74 Q16,70 26,60 Q40,46 56,44 L80,44 Q96,46 106,60 Q114,72 124,76 L200,80 L200,92Z"/>` +
        trees +
        // Uhrturm: stone base, wooden gallery, hipped roof with lantern
        `<rect x="58" y="30" width="18" height="16"/><rect x="55" y="27" width="24" height="3"/>` +
        `<rect x="57" y="20" width="20" height="7"/><path d="M55,20 L61,12 L73,12 L79,20Z"/>` +
        `<rect x="64.5" y="6" width="5" height="6"/><path d="M64,6 L67,1 L70,6Z"/>` +
        // Kunsthaus bubble with nozzles
        `<path d="M132,80 Q132,62 150,60 Q170,60 172,80Z"/>` +
        `<path d="M146,62 L144,55 L148,55Z M156,61 L157,54 L160,56Z M164,64 L168,58 L170,61Z"/>` +
        `<rect x="174" y="66" width="14" height="14"/><path d="M173,66 L181,60 L189,66Z"/>` +
        `<rect x="190" y="70" width="10" height="10"/></g>` +
        `<circle cx="67" cy="38" r="4.2" fill="${s.sky[1]}" opacity=".85"/>` +
        `<path d="M67,38 L67,35 M67,38 L69.4,38.6" stroke="${s.ink}" stroke-width=".9"/>` +
        `<path d="M138,72 Q150,66 166,72" stroke="#8fc1e3" stroke-width="1.2" fill="none" opacity=".5"/>` +
        lights(s, [
          [60, 22],
          [72, 22],
          [178, 70],
          [192, 74],
        ]) +
        water(s, 6, 50, 150, 194) +
        // Murinsel: steel shell and bowl on the river, footbridges to both banks
        `<g fill="${s.ink}"><path d="M76,92 Q80,74 100,72 Q116,72 120,84 L120,92Z"/>` +
        `<path d="M98,93 Q100,82 112,80 Q126,80 130,88 Q124,94 98,93Z" opacity=".85"/>` +
        `<rect x="56" y="90" width="22" height="1.6"/><rect x="128" y="88" width="24" height="1.6"/></g>` +
        `<path d="M84,86 Q88,78 100,76 M90,90 Q94,82 104,80" stroke="${s.sky[1]}" stroke-width=".8" fill="none" opacity=".6"/>`
      );
    },
  },
  LNZ: {
    city: "Linz",
    country: "Österreich",
    timezone: "Europe/Vienna",
    style: {
      sky: ["#0f2b3f", "#7fc3cf"],
      ink: "#06141e",
      far: "#2b5266",
      tag: "Ars Electronica Center",
    },
    draw: (s) => {
      // Pöstlingberg basilica on its hill, glowing Ars Electronica wedge, bridge over the Danube
      const glow = [
        "#4fd1e8",
        "#7b8cff",
        "#e86fd0",
        "#4fd1e8",
        "#9be86f",
        "#7b8cff",
      ];
      let bands = "";
      glow.forEach((c, i) => {
        bands += `<path fill="${c}" opacity=".7" d="M${130 + i * 0.4},${52 + i * 5} L${172 - i * 0.2},${47 + i * 5.4} L${172.4 - i * 0.2},${50 + i * 5.4} L${130.4 + i * 0.4},${55 + i * 5}Z"/>`;
      });
      return (
        `<path fill="${s.far}" d="M0,60 Q30,40 56,40 Q84,42 110,62 Q140,64 200,58 L200,100 L0,100Z"/>` +
        // Pöstlingberg church: twin towers with onion caps on the hilltop
        `<g fill="${s.far}"><rect x="36" y="30" width="22" height="12"/>` +
        `<rect x="34" y="24" width="6" height="16"/><rect x="54" y="24" width="6" height="16"/></g>` +
        `<g fill="${s.ink}"><path d="M0,92 L0,62 Q22,48 40,44 Q60,40 80,50 Q100,62 112,76 L112,92Z" opacity=".55"/></g>` +
        `<g fill="${s.ink}"><rect x="36" y="32" width="22" height="12"/><path d="M35,32 L47,26 L59,32Z"/>` +
        `<rect x="33" y="22" width="7" height="20"/><rect x="54" y="22" width="7" height="20"/>` +
        onion(36.5, 22, 3.8) +
        onion(57.5, 22, 3.8) +
        // Ars Electronica Center wedge and riverfront
        `<path d="M128,84 L130,48 L172,42 L176,84Z"/>` +
        `<rect x="176" y="70" width="24" height="14"/><rect x="0" y="80" width="128" height="4"/>` +
        `<rect x="112" y="70" width="14" height="14"/><rect x="0" y="84" width="200" height="8"/></g>` +
        bands +
        lights(s, [
          [44, 36],
          [180, 74],
          [188, 74],
          [116, 74],
        ]) +
        water(s, 6, 60, 110, 194) +
        // Nibelungenbrücke deck and piers
        `<g fill="${s.ink}"><rect x="0" y="88" width="110" height="2.4"/>` +
        `<rect x="22" y="88" width="3" height="10"/><rect x="56" y="88" width="3" height="10"/><rect x="90" y="88" width="3" height="10"/></g>`
      );
    },
  },
  KLU: {
    city: "Klagenfurt",
    country: "Österreich",
    timezone: "Europe/Vienna",
    style: {
      sky: ["#163a45", "#e9c58a"],
      ink: "#0a1c22",
      far: "#3d6670",
      tag: "Lindwurmbrunnen",
    },
    draw: (s) => {
      // Lindwurm dragon fountain on the Neuer Platz, Wörthersee and the Karawanken behind
      return (
        ridge(s.far, [
          [0, 56],
          [14, 48],
          [26, 52],
          [42, 36],
          [56, 46],
          [70, 40],
          [84, 50],
          [104, 44],
          [124, 52],
          [140, 34],
          [156, 46],
          [172, 38],
          [188, 48],
          [200, 44],
        ]) +
        snow([
          [42, 36, 4],
          [140, 34, 5],
          [172, 38, 4],
        ]) +
        `<rect x="0" y="62" width="200" height="8" fill="${s.sky[1]}" opacity=".45"/>` +
        `<path d="M10,66 L60,66 M130,65 L190,65" stroke="#fff" stroke-width=".8" opacity=".4"/>` +
        `<g fill="${s.ink}"><rect x="0" y="80" width="200" height="12"/>` +
        `<rect x="0" y="64" width="22" height="16"/><path d="M-1,64 L11,57 L23,64Z"/>` +
        `<rect x="160" y="62" width="20" height="18"/><path d="M159,62 L170,55 L181,62Z"/><rect x="180" y="68" width="20" height="12"/>` +
        // basin and rock
        `<rect x="70" y="76" width="64" height="8"/><rect x="67" y="74" width="70" height="3"/>` +
        `<path d="M80,74 Q82,66 92,64 L114,64 Q124,66 124,74Z"/>` +
        // dragon: body, raised neck and head, spiked wing, curled tail, legs
        `<path d="M86,64 Q88,52 102,50 Q118,50 122,60 L120,64Z"/>` +
        `<path d="M95,58 Q87,48 87,40 Q87,32 79,31 L66,33 L72,36 L66,39 L76,40 Q79,46 83,52 Q86,57 89,60Z"/>` +
        `<path d="M76,32 L78,27 L80,32 M80,33 L84,29 L84,35" />` +
        `<path d="M98,54 L102,40 L112,24 Q113,32 119,33 Q118,39 125,42 Q120,46 123,51 L114,56Z"/>` +
        `<rect x="90" y="60" width="4" height="6"/><rect x="112" y="60" width="4" height="6"/></g>` +
        `<path d="M120,60 Q134,62 134,52 Q134,44 127,46 Q124,48 127,51" stroke="${s.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>` +
        `<path d="M76,32 L78,27 L80,32Z M80,33 L84,29 L84,35Z" fill="${s.ink}"/>` +
        `<circle cx="76" cy="35" r=".9" fill="${s.sky[1]}"/>` +
        `<path d="M66,37 Q60,40 58,46" stroke="#cfe8ee" stroke-width="1" fill="none" opacity=".6"/>` +
        lights(s, [
          [6, 70],
          [14, 70],
          [166, 68],
          [186, 72],
        ])
      );
    },
  },
  BSL: {
    city: "Basel",
    country: "Schweiz",
    timezone: "Europe/Zurich",
    style: {
      sky: ["#2e1f3a", "#e7a38c"],
      ink: "#1a0d14",
      far: "#55405e",
      tag: "Basler Münster",
    },
    draw: (s) => {
      // Red sandstone Münster with its two towers and patterned roof above the Rhine, ferry on its cable
      const red = "#6e2a2a";
      let tiles = "";
      for (let x = 92; x <= 112; x += 5)
        for (let y = 50; y <= 60; y += 5)
          tiles += `M${x},${y} L${x + 2.5},${y - 2.5} L${x + 5},${y} L${x + 2.5},${y + 2.5}Z `;
      return (
        `<path fill="${s.far}" d="M0,66 Q50,58 100,64 Q150,58 200,64 L200,100 L0,100Z"/>` +
        `<g fill="${s.ink}"><path d="M0,92 L0,74 L200,74 L200,92Z"/>` +
        `<rect x="0" y="62" width="16" height="12"/><path d="M-1,62 L8,55 L17,62Z"/>` +
        `<rect x="18" y="58" width="14" height="16"/><path d="M17,58 L25,50 L33,58Z"/>` +
        `<rect x="34" y="64" width="18" height="10"/><path d="M33,64 L43,58 L53,64Z"/>` +
        `<rect x="140" y="60" width="16" height="14"/><path d="M139,60 L148,52 L157,60Z"/>` +
        `<rect x="158" y="56" width="14" height="18"/><path d="M157,56 L165,48 L173,56Z"/>` +
        `<rect x="174" y="62" width="26" height="12"/></g>` +
        // Münster: nave with tiled roof and the two Gothic towers
        `<g fill="${red}"><rect x="56" y="70" width="84" height="6"/>` +
        `<rect x="88" y="56" width="28" height="18"/><path d="M86,56 L102,40 L118,56Z"/>` +
        `<rect x="70" y="30" width="14" height="44"/><rect x="120" y="30" width="14" height="44"/>` +
        `<rect x="68" y="28" width="18" height="3"/><rect x="118" y="28" width="18" height="3"/>` +
        `<path d="M70,28 L77,6 L84,28Z M120,28 L127,8 L134,28Z"/>` +
        `<rect x="76.4" y="1" width="1.2" height="6"/><rect x="126.4" y="3" width="1.2" height="6"/></g>` +
        `<path fill="#e2b04a" opacity=".55" d="${tiles}"/>` +
        `<path fill="${s.sky[1]}" opacity=".5" d="M75.5,24 L77,16 L78.5,24Z M125.5,24 L127,17 L128.5,24Z"/>` +
        `<path d="M74,40 L74,48 M80,40 L80,48 M124,40 L124,48 M130,40 L130,48" stroke="${s.sky[1]}" stroke-width="1.4" opacity=".55"/>` +
        `<circle cx="102" cy="62" r="3" fill="${s.sky[1]}" opacity=".6"/>` +
        lights(s, [
          [6, 66],
          [24, 64],
          [44, 67],
          [146, 64],
          [164, 62],
          [184, 66],
        ]) +
        `<rect x="0" y="80" width="200" height="20" fill="${s.far}"/>` +
        `<path d="M8,86 L60,86 M100,96 L150,96 M170,88 L196,88" stroke="${s.sky[1]}" stroke-width="1" opacity=".55"/>` +
        // ferry hanging from the cable across the Rhine
        `<path d="M0,74 L200,78 M150,77 L146,86" stroke="${s.ink}" stroke-width=".7"/>` +
        `<g fill="${s.ink}"><path d="M132,86 L160,86 L156,90 L136,90Z"/><rect x="141" y="81" width="10" height="5"/><path d="M140,81 L146,78 L152,81Z"/></g>`
      );
    },
  },
  LUG: {
    city: "Lugano",
    country: "Schweiz",
    timezone: "Europe/Zurich",
    style: {
      sky: ["#123c52", "#f2c58f"],
      ink: "#081c27",
      far: "#2f6178",
      tag: "Monte San Salvatore",
    },
    draw: (s) => {
      // Sugarloaf of Monte San Salvatore across the lake, Monte Brè on the left, palm promenade
      return (
        `<path fill="${s.far}" opacity=".7" d="M0,64 Q20,50 40,46 Q58,48 76,60 L90,68 L0,68Z"/>` +
        `<path fill="${s.far}" d="M78,68 Q98,62 112,46 Q122,28 132,22 Q140,20 146,30 Q156,48 172,60 Q186,66 200,64 L200,68Z"/>` +
        `<rect x="137" y="12" width="1.2" height="10" fill="${s.far}"/><rect x="134" y="18" width="5" height="4" fill="${s.far}"/>` +
        `<rect x="0" y="68" width="200" height="16" fill="${s.sky[1]}" opacity=".35"/>` +
        `<path d="M20,72 L70,72 M110,76 L180,76 M40,80 L90,80" stroke="#fff" stroke-width=".8" opacity=".45"/>` +
        `<g fill="${s.ink}"><rect x="0" y="84" width="200" height="8"/>` +
        `<rect x="4" y="60" width="26" height="24"/><path d="M3,60 L17,52 L31,60Z"/>` +
        `<rect x="34" y="48" width="7" height="36"/><path d="M33,48 L37.5,40 L42,48Z"/><rect x="42" y="66" width="16" height="18"/>` +
        `<rect x="176" y="66" width="24" height="18"/>` +
        `<rect x="70" y="78" width="1.2" height="6"/><rect x="120" y="78" width="1.2" height="6"/><rect x="160" y="78" width="1.2" height="6"/></g>` +
        `<circle cx="70.6" cy="77.6" r="1.4" fill="${s.sky[1]}"/><circle cx="120.6" cy="77.6" r="1.4" fill="${s.sky[1]}"/><circle cx="160.6" cy="77.6" r="1.4" fill="${s.sky[1]}"/>` +
        palm(s.ink, 84, 30) +
        palm(s.ink, 100, 24) +
        palm(s.ink, 144, 28) +
        palm(s.ink, 186, 30) +
        lights(s, [
          [8, 66],
          [16, 66],
          [24, 72],
          [46, 72],
          [182, 72],
        ]) +
        water(s, 6, 60, 110, 190)
      );
    },
  },
  SIR: {
    city: "Sion",
    country: "Schweiz",
    timezone: "Europe/Zurich",
    style: {
      sky: ["#33263f", "#f0b582"],
      ink: "#170f1d",
      far: "#5d4a6c",
      tag: "Valère & Tourbillon",
    },
    draw: (s) => {
      // The twin rock hills: Valère basilica on the left, Tourbillon castle ruin higher on the right
      return (
        ridge(s.far, [
          [0, 50],
          [16, 38],
          [30, 46],
          [48, 30],
          [62, 44],
          [80, 52],
          [96, 46],
          [120, 56],
          [150, 40],
          [170, 28],
          [186, 40],
          [200, 36],
        ]) +
        snow([
          [16, 38, 4],
          [48, 30, 5],
          [170, 28, 5],
        ]) +
        `<g fill="${s.ink}"><path d="M0,92 L0,78 Q14,74 24,66 Q34,54 44,50 L74,50 Q82,54 88,62 Q96,70 104,66 Q112,58 120,48 Q128,38 136,36 L162,36 Q170,40 176,52 Q184,68 200,74 L200,92Z"/>` +
        // Valère: walls, nave and square tower
        `<rect x="40" y="44" width="38" height="7"/>` +
        merlons(40, 76, 44) +
        `<rect x="48" y="32" width="22" height="12"/><path d="M47,32 L59,24 L71,32Z"/>` +
        `<rect x="58" y="18" width="9" height="16"/><path d="M57,18 L62.5,10 L68,18Z"/>` +
        // Tourbillon: ruined curtain wall and keep
        `<rect x="130" y="28" width="34" height="9"/>` +
        merlons(130, 162, 28) +
        `<rect x="140" y="14" width="10" height="16"/>` +
        merlons(140, 148, 14, 3.6) +
        `<rect x="156" y="20" width="6" height="10"/>` +
        `<rect x="10" y="78" width="14" height="10"/><path d="M9,78 L17,72 L25,78Z"/>` +
        `<rect x="176" y="76" width="16" height="12"/><path d="M175,76 L184,70 L193,76Z"/></g>` +
        `<path d="M96,82 L120,74 M100,86 L128,78 M108,88 L136,82" stroke="${s.far}" stroke-width="1" opacity=".7"/>` +
        lights(s, [
          [62, 24],
          [52, 36],
          [143, 20],
          [14, 82],
          [184, 80],
        ]) +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },
  FDH: {
    city: "Friedrichshafen",
    country: "Deutschland",
    timezone: "Europe/Berlin",
    style: {
      sky: ["#1a3a5c", "#f3c89a"],
      ink: "#0b1a2b",
      far: "#4a6c8c",
      tag: "Zeppelin & Bodensee",
    },
    draw: (s) => {
      // A Zeppelin over Lake Constance, Swiss Alps across the water, Schlosskirche twin towers
      return (
        ridge(
          s.far,
          [
            [0, 66],
            [14, 58],
            [26, 62],
            [42, 52],
            [56, 60],
            [70, 56],
            [86, 64],
            [104, 60],
            [120, 66],
            [200, 66],
          ],
          0.8,
        ) +
        snow([
          [42, 52, 3.5],
          [70, 56, 3],
          [14, 58, 3],
        ]) +
        `<rect x="0" y="66" width="200" height="26" fill="${s.sky[1]}" opacity=".3"/>` +
        `<path d="M10,72 L60,72 M30,80 L90,80 M70,76 L110,76" stroke="#fff" stroke-width=".8" opacity=".45"/>` +
        // Zeppelin
        `<g fill="${s.ink}"><ellipse cx="66" cy="24" rx="36" ry="8.5"/>` +
        `<path d="M96,22 L108,14 L108,22Z M96,26 L108,34 L108,26Z"/>` +
        `<rect x="56" y="32" width="12" height="3.4" rx="1.4"/></g>` +
        `<path d="M36,21 Q66,15 96,21" stroke="${s.sky[1]}" stroke-width="1" fill="none" opacity=".55"/>` +
        // Schlosskirche with onion-capped towers and the palace wing
        `<g fill="${s.ink}"><rect x="0" y="84" width="200" height="8"/>` +
        `<rect x="128" y="58" width="44" height="26"/><path d="M127,58 L150,48 L173,58Z"/>` +
        `<rect x="132" y="30" width="10" height="30"/><rect x="158" y="30" width="10" height="30"/>` +
        `<rect x="131" y="40" width="12" height="2"/><rect x="157" y="40" width="12" height="2"/>` +
        onion(137, 30, 5) +
        onion(163, 30, 5) +
        `<rect x="172" y="64" width="28" height="20"/><path d="M171,64 L178,58 L200,58 L200,64Z"/>` +
        `<rect x="116" y="74" width="12" height="10"/>` +
        `<rect x="10" y="80" width="40" height="4"/><rect x="48" y="70" width="3" height="10"/><path d="M47,70 L49.5,66 L52,70Z"/></g>` +
        lights(s, [
          [136, 46],
          [162, 46],
          [148, 64],
          [178, 70],
          [190, 70],
        ]) +
        water(s, 6, 60, 110, 194)
      );
    },
  },
  BZO: {
    city: "Bozen",
    country: "Italien",
    timezone: "Europe/Rome",
    style: {
      sky: ["#3b2147", "#f2a07e"],
      ink: "#1a0e1f",
      far: "#5e3f63",
      tag: "Rosengarten & Dom",
    },
    draw: (s) => {
      // Rosengarten glowing in the alpenglow, the cathedral with its diamond-tiled roof and openwork spire
      let tiles = "";
      for (let x = 70; x <= 120; x += 6)
        for (let y = 50; y <= 62; y += 6) {
          const c = (x + y) % 12 === 0 ? "#d8b44a" : "#4f8a5c";
          tiles += `<path fill="${c}" opacity=".75" d="M${x},${y} L${x + 3},${y - 3} L${x + 6},${y} L${x + 3},${y + 3}Z"/>`;
        }
      return (
        `<path fill="${s.far}" d="M0,40 L10,24 L14,30 L20,14 L24,22 L28,10 L33,26 L38,18 L42,30 L50,20 L56,34 L66,26 L74,38 L90,34 L104,46 L120,40 L130,26 L134,18 L138,28 L144,12 L148,24 L156,20 L162,34 L176,28 L188,38 L200,32 L200,100 L0,100Z"/>` +
        `<path fill="#ff8f7a" opacity=".7" d="M0,40 L10,24 L14,30 L20,14 L24,22 L28,10 L33,26 L38,18 L42,30 L50,20 L56,34 L52,40 L40,38 L26,42 L12,40Z M120,40 L130,26 L134,18 L138,28 L144,12 L148,24 L156,20 L162,34 L150,38 L136,36Z"/>` +
        `<path fill="${s.far}" d="M0,66 Q40,54 80,60 Q120,66 160,56 Q180,52 200,58 L200,100 L0,100Z"/>` +
        `<path fill="${s.ink}" opacity=".35" d="M0,66 Q40,54 80,60 Q120,66 160,56 Q180,52 200,58 L200,100 L0,100Z"/>` +
        `<g fill="${s.ink}"><rect x="0" y="84" width="200" height="8"/>` +
        // Dom: nave with steep tiled roof, openwork tower and spire
        `<rect x="66" y="62" width="62" height="22"/><path d="M64,62 L72,44 L122,44 L130,62Z"/>` +
        `<rect x="132" y="34" width="14" height="50"/><rect x="130" y="32" width="18" height="3"/>` +
        `<path d="M132,32 L139,8 L146,32Z"/><rect x="138.4" y="2" width="1.2" height="7"/>` +
        `<rect x="10" y="64" width="20" height="20"/><path d="M9,64 L20,56 L31,64Z"/>` +
        `<rect x="34" y="68" width="22" height="16"/><path d="M33,68 L45,61 L57,68Z"/>` +
        `<rect x="156" y="66" width="20" height="18"/><path d="M155,66 L166,58 L177,66Z"/><rect x="178" y="70" width="22" height="14"/></g>` +
        tiles +
        `<path fill="${s.sky[1]}" opacity=".5" d="M137.5,28 L139,18 L140.5,28Z M135,40 L135,50 L137,50 L137,40Z M141,40 L141,50 L143,50 L143,40Z"/>` +
        lights(s, [
          [14, 70],
          [24, 70],
          [42, 74],
          [76, 68],
          [92, 68],
          [108, 68],
          [162, 72],
          [186, 76],
        ]) +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },
};
