import { spires, type CityStyle, type LibraryCity } from "./shared";

// Hand-drawn skylines: Germany (Frankfurt, Rhineland, Ruhr, Saxony, the north and the south)

const n = (v: number) => v.toFixed(1);

// Calm water strip below the ground line with two light reflections
function water(s: CityStyle, a = 8, b = 70, c = 110, d = 190) {
  return (
    `<rect x="0" y="92" width="200" height="8" fill="${s.far}"/>` +
    `<path d="M${a},95 L${b},95 M${c},97 L${d},97" stroke="${s.sky[1]}" stroke-width="1" opacity=".55"/>`
  );
}

// Lit windows: [x, y] pairs as small rects in the horizon colour
function lights(s: CityStyle, pts: [number, number][], op = 0.6, w = 2) {
  return pts
    .map(
      ([x, y]) =>
        `<rect x="${n(x)}" y="${n(y)}" width="${w}" height="2.4" fill="${s.sky[1]}" opacity="${op}"/>`,
    )
    .join("");
}

// A loose grid of lit windows; every few cells stay dark so it reads as hand-placed
function grid(
  x0: number,
  y0: number,
  cols: number,
  rows: number,
  dx: number,
  dy: number,
  seed = 0,
) {
  const pts: [number, number][] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if ((c * 7 + r * 3 + seed) % 5 !== 0)
        pts.push([x0 + c * dx, y0 + r * dy]);
  return pts;
}

// Background block buildings: [x, top, width] reaching down to the ground
function blocks(list: number[][]) {
  return list
    .map(
      ([x, top, w]) =>
        `<rect x="${x}" y="${top}" width="${w}" height="${92 - top}"/>`,
    )
    .join("");
}

// Stepped gable house (Frankfurt Römer style): wall top at y=top, gable rising 12 above it
function steppedGable(x: number, w: number, top: number) {
  const st = w / 6;
  return (
    `<rect x="${x}" y="${top}" width="${w}" height="${92 - top}"/>` +
    `<path d="M${x},${top} v-4 h${n(st)} v-4 h${n(st)} v-4 h${n(st * 2)} v4 h${n(st)} v4 h${n(st)} v4Z"/>`
  );
}

export const GERMANY: Record<string, LibraryCity> = {
  FRA: {
    city: "Frankfurt",
    country: "Deutschland",
    timezone: "Europe/Berlin",
    style: {
      sky: ["#1e2a52", "#f0a46e"],
      ink: "#0d1229",
      far: "#3a4878",
      tag: "Skyline & Römer",
    },
    draw: (s) => {
      // Messeturm pencil, Commerzbank with its mast and the round Main Tower behind the Römer gables
      return (
        `<g fill="${s.far}">` +
        blocks([
          [0, 62, 14],
          [15, 50, 11],
          [50, 46, 10],
          [62, 56, 12],
          [88, 40, 9],
          [146, 48, 12],
          [160, 36, 10],
          [172, 54, 14],
          [188, 64, 12],
        ]) +
        `<path d="M160,36 L165,30 L170,36Z"/></g>` +
        lights(
          s,
          [...grid(52, 50, 2, 4, 4, 7), ...grid(162, 42, 2, 5, 4, 7, 2)],
          0.4,
        ) +
        `<g fill="${s.ink}">` +
        // Messeturm
        `<rect x="30" y="38" width="14" height="54"/><rect x="29" y="36" width="16" height="2.4"/>` +
        `<rect x="31.5" y="22" width="11" height="14"/><path d="M31.5,22 L37,5 L42.5,22Z"/>` +
        // Commerzbank
        `<rect x="100" y="16" width="18" height="76"/><path d="M100,16 L103,10 L118,10 L118,16Z"/>` +
        `<rect x="108.4" y="0" width="1.2" height="10"/>` +
        // Main Tower
        `<path d="M124,92 L124,25 Q130,20 136,25 L136,92Z"/><rect x="129.4" y="5" width="1.2" height="17"/>` +
        `<rect x="136" y="46" width="9" height="46"/>` +
        // Römer gables
        steppedGable(56, 12, 66) +
        steppedGable(69, 12, 66) +
        steppedGable(82, 12, 66) +
        `<rect x="0" y="84" width="30" height="8"/><rect x="44" y="80" width="12" height="12"/><rect x="145" y="82" width="55" height="10"/></g>` +
        lights(s, [
          ...grid(102.5, 20, 3, 8, 5, 7, 1),
          ...grid(126, 30, 2, 7, 6, 7, 3),
          ...grid(33, 42, 2, 6, 6, 7),
          [61, 58],
          [74, 58],
          [87, 58],
          [58, 70],
          [64, 70],
          [71, 70],
          [77, 70],
          [84, 70],
          [90, 70],
        ]) +
        water(s, 6, 60, 100, 190)
      );
    },
  },
  DUS: {
    city: "Düsseldorf",
    country: "Deutschland",
    timezone: "Europe/Berlin",
    style: {
      sky: ["#16304f", "#e7957a"],
      ink: "#0a1626",
      far: "#34557a",
      tag: "Rheinturm & Medienhafen",
    },
    draw: (s) => {
      // Rheinturm with its light clock, the three wavy Gehry buildings of the Neuer Zollhof
      let clock = "";
      for (let y = 40; y <= 84; y += 4)
        clock += `<circle cx="50" cy="${y}" r="0.7" fill="${s.sky[1]}" opacity=".85"/>`;
      return (
        `<g fill="${s.far}">` +
        blocks([
          [0, 70, 16],
          [14, 62, 14],
          [64, 64, 12],
          [76, 58, 14],
          [178, 66, 22],
        ]) +
        `</g>` +
        `<g fill="${s.ink}">` +
        // Rheinturm
        `<path d="M46.5,92 L48.6,30 L51.4,30 L53.5,92Z"/>` +
        `<path d="M42.5,26 Q50,18 57.5,26 L58,28 L42,28Z"/><rect x="44.5" y="28" width="11" height="3" rx="1"/>` +
        `<rect x="49.2" y="6" width="1.6" height="14"/><rect x="49.7" y="-2" width="0.6" height="8"/>` +
        // Neuer Zollhof
        `<path d="M98,92 L98,52 Q104,45 110,50 Q118,43 126,49 L126,92Z"/>` +
        `<path d="M131,92 Q127,62 133,40 Q143,32 153,38 Q160,60 156,92Z"/>` +
        `<path d="M161,92 L162,57 Q169,50 176,56 Q183,48 190,55 L189,92Z"/>` +
        `<rect x="0" y="86" width="200" height="6"/></g>` +
        clock +
        `<rect x="44" y="24" width="12" height="1.4" fill="${s.sky[1]}" opacity=".7"/>` +
        lights(
          s,
          [
            ...grid(101, 56, 5, 4, 5, 7),
            ...grid(134, 44, 4, 6, 5, 7, 2),
            ...grid(165, 61, 5, 3, 5, 7, 1),
          ],
          0.55,
          1.8,
        ) +
        water(s, 6, 40, 70, 190)
      );
    },
  },
  CGN: {
    city: "Köln",
    country: "Deutschland",
    timezone: "Europe/Berlin",
    style: {
      sky: ["#2a2140", "#e9a37f"],
      ink: "#120d1f",
      far: "#4a3a62",
      tag: "Kölner Dom",
    },
    draw: (s) => {
      // Cathedral twin spires behind the bowstring arches of the Hohenzollernbrücke
      let hangers = "";
      for (let x = 4; x < 92; x += 4) {
        const span = Math.floor(x / 30.67);
        const t = (x - span * 30.67) / 30.67;
        const top = 82 - 72 * t * (1 - t);
        hangers += `M${n(x)},82 L${n(x)},${n(top)} `;
      }
      return (
        `<g fill="${s.far}">` +
        blocks([
          [0, 70, 20],
          [176, 62, 24],
        ]) +
        // Groß St. Martin
        `<rect x="180" y="40" width="14" height="52"/><path d="M180,40 L187,26 L194,40Z"/>` +
        `<rect x="178" y="36" width="3" height="10"/><rect x="193" y="36" width="3" height="10"/></g>` +
        `<g fill="${s.ink}">` +
        // Dom: west towers with spires and pinnacles
        `<rect x="98" y="34" width="14" height="58"/><rect x="118" y="34" width="14" height="58"/>` +
        `<path d="M98.5,34 L105,0 L111.5,34Z M118.5,34 L125,0 L131.5,34Z"/>` +
        `<path d="${spires(98, 112, 14, 34, 8) + spires(118, 132, 14, 34, 8)}"/>` +
        `<rect x="112" y="48" width="6" height="44"/><path d="M110,48 L115,36 L120,48Z"/>` +
        // nave, crossing turret and buttress pinnacles
        `<path d="M132,92 L132,58 L136,49 L178,49 L182,58 L182,92Z"/>` +
        `<path d="M156,49 L158,28 L160,49Z"/><path d="${spires(138, 178, 8, 58, 6)}"/></g>` +
        // tall tracery windows
        `<g fill="${s.far}"><path d="M102,72 L102,46 L105,42 L108,46 L108,72Z M122,72 L122,46 L125,42 L128,46 L128,72Z"/>` +
        `<path d="M103.5,40 L105,24 L106.5,40Z M123.5,40 L125,24 L126.5,40Z" opacity=".7"/></g>` +
        lights(s, [
          [141, 64],
          [149, 64],
          [165, 64],
          [173, 64],
          [114, 60],
        ]) +
        water(s, 6, 60, 110, 190) +
        // Hohenzollernbrücke
        `<path d="M-1,82 Q15,46 30.7,82 Q46,46 61.3,82 Q77,46 92,82" stroke="${s.ink}" stroke-width="2.2" fill="none"/>` +
        `<path d="${hangers}" stroke="${s.ink}" stroke-width=".7"/>` +
        `<g fill="${s.ink}"><rect x="-1" y="81" width="96" height="3.4"/>` +
        `<rect x="28.7" y="84" width="4" height="10"/><rect x="59.3" y="84" width="4" height="10"/><rect x="90" y="84" width="4" height="10"/></g>`
      );
    },
  },
  STR: {
    city: "Stuttgart",
    country: "Deutschland",
    timezone: "Europe/Berlin",
    style: {
      sky: ["#1f3340", "#e8b06c"],
      ink: "#0c1820",
      far: "#3a5664",
      tag: "Fernsehturm & Schloss",
    },
    draw: (s) => {
      // Fernsehturm above the vineyard hills, Jubiläumssäule and the Neues Schloss
      let win = "";
      for (let x = 90; x <= 192; x += 6)
        if (x < 128 || x > 152) win += `${x},70 `;
      return (
        `<path fill="${s.far}" d="M0,66 Q30,50 62,58 Q100,44 140,56 Q170,48 200,58 L200,100 L0,100Z"/>` +
        `<path d="M70,60 L118,52 M76,64 L132,56 M150,58 L196,58" stroke="${s.sky[1]}" stroke-width=".6" stroke-dasharray="1.5 2" opacity=".35"/>` +
        `<g fill="${s.ink}">` +
        // Fernsehturm
        `<path d="M32,92 L34.6,34 L37.4,34 L40,92Z"/>` +
        `<path d="M30,18 L42,18 L42,30 L40.5,34 L31.5,34 L30,30Z"/><rect x="28.5" y="16.5" width="15" height="2"/>` +
        `<rect x="35.2" y="2" width="1.6" height="15"/><rect x="35.6" y="-4" width="0.8" height="6"/>` +
        // Jubiläumssäule with Concordia
        `<rect x="64" y="84" width="8" height="8"/><rect x="66.5" y="46" width="3" height="38"/><rect x="65.5" y="44" width="5" height="2"/>` +
        `<path d="M66.6,44 L67.4,37 Q67.4,33.5 68,33.5 Q68.6,33.5 68.6,37 L69.4,44Z"/><circle cx="68" cy="32.5" r="1.2"/>` +
        `<path d="M68.6,36 L71.5,32 L72,33Z"/>` +
        // Neues Schloss: wings, corps de logis, central pavilion with crown
        `<rect x="86" y="66" width="106" height="26"/><path d="M84,66 L89,59 L189,59 L194,66Z"/>` +
        `<rect x="126" y="56" width="28" height="36"/><path d="M124,56 L129,46 L151,46 L156,56Z"/>` +
        `<rect x="0" y="88" width="200" height="4"/>` +
        `<ellipse cx="10" cy="86" rx="8" ry="6"/><ellipse cx="22" cy="87" rx="6" ry="5"/><ellipse cx="54" cy="87" rx="7" ry="5"/></g>` +
        `<path fill="${s.sky[1]}" d="M134.5,46 L134.5,40 L137,42.5 L140,37 L143,42.5 L145.5,40 L145.5,46Z" opacity=".95"/>` +
        `<rect x="30.5" y="23" width="11" height="1.4" fill="${s.sky[1]}" opacity=".7"/>` +
        lights(
          s,
          win
            .trim()
            .split(" ")
            .map((p) => p.split(",").map(Number) as [number, number])
            .flatMap(([x, y]) => [
              [x, y],
              [x, y + 8],
            ]) as [number, number][],
          0.5,
          1.8,
        ) +
        lights(s, [
          [130, 60],
          [139, 60],
          [148, 60],
          [130, 70],
          [148, 70],
        ]) +
        `<path fill="${s.far}" d="M136,92 L136,78 Q140,73 144,78 L144,92Z"/>`
      );
    },
  },
  HAJ: {
    city: "Hannover",
    country: "Deutschland",
    timezone: "Europe/Berlin",
    style: {
      sky: ["#183846", "#d9b98a"],
      ink: "#0a1b22",
      far: "#2f5b66",
      tag: "Neues Rathaus",
    },
    draw: (s) => {
      // Neues Rathaus with its tall green dome above the Maschteich
      let arches = "";
      for (let x = 40; x <= 156; x += 8)
        if (x < 84 || x > 112)
          arches += `M${x},76 L${x},70 Q${x + 1.5},67.5 ${x + 3},70 L${x + 3},76Z `;
      return (
        `<path fill="${s.far}" d="M0,80 Q6,72 14,76 Q20,68 28,74 L28,92 L0,92Z M172,74 Q180,66 188,72 Q196,68 200,72 L200,92 L172,92Z"/>` +
        `<g fill="${s.ink}">` +
        `<rect x="30" y="86" width="140" height="6"/><rect x="36" y="58" width="128" height="28"/>` +
        `<path d="M34,58 L40,51 L160,51 L166,58Z"/>` +
        // corner pavilions with small domes
        `<rect x="36" y="46" width="18" height="12"/><rect x="146" y="46" width="18" height="12"/>` +
        `<path d="M36,46 Q45,36 54,46Z M146,46 Q155,36 164,46Z"/><rect x="44.4" y="35" width="1.2" height="5"/><rect x="154.4" y="35" width="1.2" height="5"/>` +
        // central block, drum, dome and lantern
        `<rect x="84" y="40" width="32" height="20"/><rect x="82" y="38" width="36" height="2.4"/>` +
        `<rect x="80" y="28" width="5" height="30"/><rect x="115" y="28" width="5" height="30"/><path d="M80,28 Q82.5,22 85,28Z M115,28 Q117.5,22 120,28Z"/>` +
        `<rect x="88" y="28" width="24" height="10"/>` +
        `<path d="M86,30 C86,16 93,9 100,7 C107,9 114,16 114,30Z"/>` +
        `<rect x="97" y="-1" width="6" height="9"/><path d="M96.5,-1 Q100,-6 103.5,-1Z"/><rect x="99.5" y="-11" width="1" height="7"/></g>` +
        `<g fill="${s.far}" opacity=".9"><rect x="90" y="30" width="2" height="6"/><rect x="95" y="30" width="2" height="6"/><rect x="103" y="30" width="2" height="6"/><rect x="108" y="30" width="2" height="6"/></g>` +
        `<path d="M92,28 C92,18 96,12 100,10" stroke="${s.sky[1]}" stroke-width=".8" fill="none" opacity=".4"/>` +
        `<path d="${arches}" fill="${s.sky[1]}" opacity=".5"/>` +
        lights(s, [
          [90, 46],
          [96, 46],
          [102, 46],
          [108, 46],
          [99, 2],
        ]) +
        `<path fill="${s.far}" d="M94,86 L94,74 Q100,66 106,74 L106,86Z"/>` +
        water(s, 6, 60, 120, 194) +
        `<path d="M92,94 L108,94 M96,96.5 L104,96.5" stroke="${s.sky[1]}" stroke-width="1" opacity=".5"/>`
      );
    },
  },
  LEJ: {
    city: "Leipzig",
    country: "Deutschland",
    timezone: "Europe/Berlin",
    style: {
      sky: ["#2b2440", "#e2a36a"],
      ink: "#141024",
      far: "#4b4068",
      tag: "Völkerschlachtdenkmal",
    },
    draw: (s) => {
      // City-Hochhaus with its book-shaped crown, the massive Völkerschlachtdenkmal behind its pool
      let guards = "";
      for (let x = 125; x <= 163; x += 5.4)
        guards += `<rect x="${n(x)}" y="30" width="3" height="6"/><circle cx="${n(x + 1.5)}" cy="29.4" r="1.7"/>`;
      return (
        `<g fill="${s.far}">` +
        blocks([
          [0, 64, 14],
          [46, 58, 12],
          [58, 66, 14],
          [72, 50, 10],
          [186, 66, 14],
        ]) +
        // Nikolaikirche spire
        `<rect x="84" y="56" width="8" height="36"/><path d="M84,56 L88,38 L92,56Z"/></g>` +
        `<g fill="${s.ink}">` +
        // City-Hochhaus
        `<path d="M20,92 L20,22 Q32,10 44,20 L44,92Z"/>` +
        `<rect x="27" y="2" width="1.2" height="14"/><rect x="35" y="5" width="1" height="11"/>` +
        // Völkerschlachtdenkmal
        `<rect x="96" y="86" width="98" height="6"/><rect x="104" y="80" width="82" height="6"/>` +
        `<path d="M114,80 L122,46 L168,46 L176,80Z"/><rect x="122" y="36" width="46" height="10"/>` +
        guards +
        `<path d="M127,30 Q129,13 145,11 Q161,13 163,30Z"/><rect x="142.5" y="6" width="5" height="6"/></g>` +
        `<path fill="${s.far}" d="M139,80 L139,64 Q145,55 151,64 L151,80Z"/>` +
        `<path d="M141,54 L145,50 L149,54" stroke="${s.far}" stroke-width="1.2" fill="none"/>` +
        `<path d="M122,46 L168,46" stroke="${s.sky[1]}" stroke-width=".8" opacity=".35"/>` +
        lights(s, grid(23, 26, 4, 8, 5, 8), 0.55, 2) +
        water(s, 6, 60, 110, 190) +
        `<path d="M132,94.5 L158,94.5" stroke="${s.sky[1]}" stroke-width="1" opacity=".45"/>`
      );
    },
  },
  DRS: {
    city: "Dresden",
    country: "Deutschland",
    timezone: "Europe/Berlin",
    style: {
      sky: ["#22304f", "#efb27c"],
      ink: "#0e1528",
      far: "#3d4c74",
      tag: "Frauenkirche & Semperoper",
    },
    draw: (s) => {
      // Frauenkirche's stone bell, the Hofkirche tower and the curved Semperoper on the Elbe
      let opera = "";
      for (let x = 126; x <= 192; x += 6)
        if (x < 146 || x > 170)
          opera += `M${x},78 L${x},72 Q${x + 1},70 ${x + 2},72 L${x + 2},78Z `;
      return (
        `<path fill="${s.far}" d="M0,78 Q40,70 90,76 L200,74 L200,92 L0,92Z"/>` +
        `<g fill="${s.ink}">` +
        // Frauenkirche
        `<rect x="38" y="50" width="34" height="42"/>` +
        `<rect x="33" y="42" width="7" height="50"/><rect x="70" y="42" width="7" height="50"/>` +
        `<path d="M33,42 Q36.5,33 40,42Z M70,42 Q73.5,33 77,42Z"/><rect x="36" y="31" width="1" height="5"/><rect x="73" y="31" width="1" height="5"/>` +
        `<path d="M35,51 Q44,47 45,36 Q46,21 55,19 Q64,21 65,36 Q66,47 75,51Z"/>` +
        `<rect x="52" y="9" width="6" height="11"/><path d="M51.5,9 Q55,3 58.5,9Z"/><rect x="54.6" y="-3" width="0.8" height="8"/><rect x="53" y="-0.5" width="4" height="0.8"/>` +
        // Hofkirche
        `<rect x="100" y="62" width="22" height="30"/>${`<path d="${spires(102, 120, 6, 62, 4)}"/>`}` +
        `<rect x="92" y="46" width="9" height="46"/><rect x="93" y="35" width="7" height="11"/><rect x="94.2" y="26" width="4.6" height="9"/>` +
        `<path d="M94.2,26 Q96.5,15 98.8,26Z"/><rect x="96.1" y="9" width="0.8" height="8"/>` +
        // Semperoper
        `<path d="M136,60 Q159,47 182,60Z"/>` +
        `<path d="M124,92 L124,66 Q159,58 194,66 L194,92Z"/>` +
        `<rect x="146" y="50" width="26" height="42"/><rect x="145" y="49" width="28" height="2"/>` +
        `<path d="M150,49 L151.5,45 L154,46 L155,42 L157,44.5 L159,41 L161,44.5 L163,42 L164,46 L166.5,45 L168,49Z"/></g>` +
        `<path fill="${s.far}" d="M152,72 L152,62 Q159,53 166,62 L166,72Z"/>` +
        `<path d="${opera}" fill="${s.sky[1]}" opacity=".5"/>` +
        lights(s, [
          [42, 58],
          [66, 58],
          [54, 30],
          [42, 70],
          [66, 70],
          [104, 70],
          [116, 70],
        ]) +
        water(s, 6, 50, 100, 190) +
        // Elbe paddle steamer
        `<g fill="${s.ink}"><path d="M14,92.5 L44,92.5 L41,97 L17,97Z"/><rect x="20" y="89" width="18" height="3.5"/><rect x="30" y="84" width="2.4" height="5"/></g>`
      );
    },
  },
  NUE: {
    city: "Nürnberg",
    country: "Deutschland",
    timezone: "Europe/Berlin",
    style: {
      sky: ["#2a1f3a", "#e7a06f"],
      ink: "#150f1f",
      far: "#4a3a5e",
      tag: "Kaiserburg",
    },
    draw: (s) => {
      // Kaiserburg on its sandstone rock above steep half-timbered roofs of the old town
      let houses = "";
      let timber = "";
      const win: [number, number][] = [];
      [
        [0, 16, 68],
        [16, 14, 64],
        [30, 18, 62],
        [48, 14, 66],
        [62, 16, 70],
      ].forEach(([x, w, top]) => {
        const peak = top - w * 0.95;
        houses += `<rect x="${x}" y="${top}" width="${w}" height="${92 - top}"/><path d="M${x - 1},${top} L${x + w / 2},${n(peak)} L${x + w + 1},${top}Z"/>`;
        timber += `M${x + 1},${top + 6} L${x + w - 1},${top + 6} M${x + 1},${top + 14} L${x + w - 1},${top + 14} M${x + w / 2},${top} L${x + w / 2},${top + 14} M${x + 1},${top} L${x + w / 2},${top + 6} M${x + w - 1},${top} L${x + w / 2},${top + 6} `;
        win.push(
          [x + w / 2 - 1, top - w * 0.4],
          [x + 3, top + 8],
          [x + w - 5, top + 8],
        );
      });
      return (
        `<g fill="${s.far}">` +
        blocks([[180, 72, 20]]) +
        `<path d="M70,92 L70,74 L78,66 L86,74 L86,92Z"/></g>` +
        `<g fill="${s.ink}">` +
        // rock and castle
        `<path d="M76,92 L82,72 Q90,64 100,62 L194,60 Q200,64 200,70 L200,92Z"/>` +
        `<rect x="96" y="52" width="98" height="10"/>` +
        `<rect x="100" y="30" width="10" height="24"/><path d="M99,30 L105,17 L111,30Z"/>` +
        `<rect x="114" y="40" width="30" height="14"/><path d="M112,40 L129,22 L146,40Z"/>` +
        `<rect x="156" y="22" width="12" height="32"/><path d="M154.5,23 Q162,4 169.5,23Z"/><rect x="161.6" y="0" width="0.8" height="9"/>` +
        `<rect x="172" y="42" width="24" height="12"/><path d="M171,42 L176,33 L196,33 L197,42Z"/>` +
        `<path d="${spires(176, 194, 6, 33, 0)}"/>` +
        houses +
        `</g>` +
        `<path d="${timber}" stroke="${s.sky[1]}" stroke-width=".6" opacity=".35" fill="none"/>` +
        `<path d="M86,78 Q96,74 110,76 M120,72 Q140,70 160,72" stroke="${s.far}" stroke-width="1" fill="none"/>` +
        lights(s, [
          ...win,
          [104, 38],
          [120, 46],
          [126, 46],
          [132, 46],
          [138, 46],
          [161, 30],
          [161, 40],
          [180, 46],
          [188, 46],
        ])
      );
    },
  },
  BRE: {
    city: "Bremen",
    country: "Deutschland",
    timezone: "Europe/Berlin",
    style: {
      sky: ["#1b3046", "#dfa88a"],
      ink: "#0b1622",
      far: "#335070",
      tag: "Rathaus & Stadtmusikanten",
    },
    draw: (s) => {
      // St. Petri Dom spires, the Renaissance Rathaus gables and the Town Musicians
      let arcade = "";
      for (let x = 74; x <= 150; x += 9.4)
        arcade += `M${n(x)},92 L${n(x)},83 Q${n(x + 3)},78 ${n(x + 6)},83 L${n(x + 6)},92Z `;
      return (
        `<g fill="${s.far}">` +
        blocks([
          [0, 66, 22],
          [160, 70, 10],
        ]) +
        `</g>` +
        `<g fill="${s.ink}">` +
        // Dom St. Petri
        `<rect x="26" y="30" width="12" height="62"/><rect x="48" y="30" width="12" height="62"/>` +
        `<path d="M25,30 L32,2 L39,30Z M47,30 L54,2 L61,30Z"/>` +
        `<rect x="38" y="46" width="10" height="46"/><path d="M37,46 L43,38 L49,46Z"/>` +
        // Rathaus
        `<path d="M72,58 L80,42 L148,42 L156,58Z"/><rect x="70" y="58" width="88" height="34"/>` +
        `<path d="M100,58 L100,50 Q103,50 104,46 L106,46 L106,40 Q109,40 110,36 L112,36 L112,30 L116,30 L116,36 L118,36 Q119,40 122,40 L122,46 L124,46 Q125,50 128,50 L128,58Z"/>` +
        `<rect x="113.4" y="22" width="1.2" height="8"/>` +
        `<path d="M78,58 L78,52 L81,52 L81,47 L84,43 L87,47 L87,52 L90,52 L90,58Z M138,58 L138,52 L141,52 L141,47 L144,43 L147,47 L147,52 L150,52 L150,58Z"/>` +
        // Stadtmusikanten: donkey, dog, cat and rooster
        `<rect x="169" y="86" width="24" height="6"/>` +
        `<g transform="translate(181,86) scale(1.25) translate(-181,-86)"><ellipse cx="180" cy="76" rx="9" ry="4.5"/>` +
        `<rect x="172.5" y="77" width="1.8" height="9"/><rect x="175.5" y="77" width="1.8" height="9"/><rect x="183.5" y="77" width="1.8" height="9"/><rect x="186.5" y="77" width="1.8" height="9"/>` +
        `<path d="M185,73 L191,65 L195.5,67.5 L190,77Z"/><path d="M191,66 L190.5,59.5 L192.8,65.5Z M193,66.4 L194.4,60.5 L194.8,67Z"/>` +
        `<path d="M171.5,75 Q168,78 169,83" stroke="${s.ink}" stroke-width="1" fill="none"/>` +
        `<ellipse cx="179" cy="69" rx="6" ry="3.2"/><circle cx="185.5" cy="66" r="2.3"/><path d="M187,65 L190,66.5 L187.2,67.5Z"/><path d="M184,64.5 L183,61.5 L185.5,64Z"/>` +
        `<path d="M173.4,68 Q171,66 172,63" stroke="${s.ink}" stroke-width="1" fill="none"/>` +
        `<ellipse cx="178.5" cy="63" rx="3.8" ry="2.6"/><circle cx="182" cy="60" r="1.9"/><path d="M180.6,59 L180.8,56.6 L182,58.4Z M182.4,58.3 L183.6,56.6 L183.6,59Z"/>` +
        `<path d="M175,63 Q172,61 173.5,57.5" stroke="${s.ink}" stroke-width=".9" fill="none"/>` +
        `<ellipse cx="178.6" cy="56.4" rx="3" ry="2.3"/><circle cx="181" cy="53" r="1.4"/><path d="M182.2,52.6 L184,53.4 L182.2,53.8Z M180.2,51.8 L181,49.8 L182,51.8Z"/>` +
        `<path d="M176,56.5 Q172.5,52 174.5,48.5 Q176,53 177.6,55Z"/>` +
        `<rect x="177.4" y="58" width=".8" height="3"/><rect x="179.2" y="58" width=".8" height="3"/></g></g>` +
        `<rect x="41" y="52" width="4" height="4" rx="2" fill="${s.far}"/>` +
        `<path d="${arcade}" fill="${s.far}"/>` +
        lights(s, [
          ...grid(74, 62, 9, 1, 9.4, 0, 1),
          [112.5, 38],
          [109, 46],
          [117, 46],
          [83, 51],
          [143, 51],
          [31, 40],
          [53, 40],
        ])
      );
    },
  },
  DTM: {
    city: "Dortmund",
    country: "Deutschland",
    timezone: "Europe/Berlin",
    style: {
      sky: ["#2a2238", "#eaa55e"],
      ink: "#140f1d",
      far: "#463b5c",
      tag: "Dortmunder U",
    },
    draw: (s) => {
      // Former Union brewery with the glowing U, the Florianturm and a pit headframe behind
      return (
        `<g fill="${s.far}">` +
        blocks([
          [0, 66, 18],
          [20, 58, 12],
          [126, 70, 18],
        ]) +
        // headframe
        `<path d="M184,92 L187,48 L190,48 L193,92Z M178,92 L189,56 L190,58 L181,92Z"/><rect x="183" y="44" width="11" height="5"/>` +
        `<circle cx="186" cy="42" r="3.5" fill="none" stroke="${s.far}" stroke-width="1.4"/>` +
        // chimneys
        `<rect x="40" y="38" width="4" height="54"/></g>` +
        `<g fill="${s.ink}">` +
        // Dortmunder U
        `<rect x="62" y="38" width="50" height="54"/><rect x="66" y="30" width="42" height="8"/><rect x="60" y="36" width="54" height="2.4"/>` +
        `<rect x="112" y="64" width="18" height="28"/>` +
        `<path d="M75,30 L75,3 L101,3 L101,30" stroke="${s.ink}" stroke-width="1.4" fill="none"/>` +
        `<path d="M75,3 L101,30 M101,3 L75,30" stroke="${s.ink}" stroke-width=".6" fill="none"/>` +
        // Florianturm
        `<path d="M156.8,92 L158.8,30 L161.2,30 L163.2,92Z"/>` +
        `<path d="M149,30 L171,30 L167,24 L153,24Z"/><rect x="153" y="20" width="14" height="4"/><path d="M151,20 L169,20 L165,15 L155,15Z"/>` +
        `<rect x="159.3" y="-1" width="1.4" height="16"/><rect x="159.7" y="-8" width=".6" height="7"/>` +
        `<rect x="0" y="88" width="200" height="4"/>` +
        `<ellipse cx="140" cy="86" rx="8" ry="6"/><ellipse cx="174" cy="87" rx="7" ry="5"/><ellipse cx="150" cy="88" rx="6" ry="4"/></g>` +
        `<circle cx="88" cy="16" r="15" fill="${s.sky[1]}" opacity=".18"/>` +
        `<path d="M80.5,6 L80.5,17 Q80.5,26 88,26 Q95.5,26 95.5,17 L95.5,6" stroke="${s.sky[1]}" stroke-width="4.4" fill="none" stroke-linecap="square"/>` +
        `<rect x="152" y="26" width="16" height="1.3" fill="${s.sky[1]}" opacity=".7"/>` +
        lights(s, grid(66, 42, 8, 5, 5.6, 8), 0.45, 1.6)
      );
    },
  },
};
