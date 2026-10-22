import { spires, type CityStyle, type LibraryCity } from "./shared";

// Hand-drawn skylines: United Kingdom, Ireland, Benelux

// Calm water strip below the ground line with two light reflections
function water(s: CityStyle, a = 8, b = 70, c = 110, d = 190) {
  return (
    `<rect x="0" y="92" width="200" height="8" fill="${s.far}"/>` +
    `<path d="M${a},95 L${b},95 M${c},97 L${d},97" stroke="${s.sky[1]}" stroke-width="1" opacity=".55"/>`
  );
}

// Small boat on the water
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

// Battlement merlons along y between x0 and x1 (closed path, append to an ink group)
function crenel(x0: number, x1: number, y: number, step = 4, h = 3) {
  let d = "";
  for (let x = x0; x + step / 2 <= x1; x += step)
    d += `M${x},${y} h${step / 2} v-${h} h-${step / 2}Z`;
  return d;
}

// Row of background blocks: [x, height, width] standing on y=base
function blocks(rows: number[][], base = 92) {
  return rows
    .map(
      ([x, h, w = 12]) =>
        `<rect x="${x}" y="${base - h}" width="${w}" height="${h}"/>`,
    )
    .join("");
}

export const WEST: Record<string, LibraryCity> = {
  MAN: {
    city: "Manchester",
    country: "Grossbritannien",
    timezone: "Europe/London",
    style: {
      sky: ["#2b2447", "#eaa07c"],
      ink: "#150f22",
      far: "#4e406a",
      tag: "Town Hall & Beetham",
    },
    draw: (s) => {
      // Waterhouse's Gothic Town Hall with its clock spire, Beetham Tower with its overhang
      let gables = "";
      for (let x = 22; x <= 112; x += 12)
        gables += `M${x},66 L${x + 4},58 L${x + 8},66Z `;
      return (
        `<g fill="${s.far}">${blocks([
          [0, 30],
          [12, 22, 10],
          [130, 26, 10],
          [176, 52, 9],
          [186, 44, 10],
        ])}<rect x="6" y="40" width="4" height="22"/></g>` +
        lights(s, [
          [3, 70],
          [15, 74],
          [134, 72],
          [179, 50],
          [189, 60],
        ]) +
        `<g fill="${s.ink}">` +
        // Town Hall body, gables, clock tower and spire
        `<rect x="18" y="66" width="104" height="26"/><path d="${gables}"/>` +
        `<rect x="63" y="28" width="14" height="40"/><rect x="61" y="40" width="18" height="2"/>` +
        `<path d="M62,28 L70,4 L78,28Z"/><path d="${spires(62, 78, 16, 28, 6)}"/>` +
        `<rect x="69.5" y="0" width="1" height="5"/>` +
        // Beetham Tower: slim lower shaft, cantilevered upper floors, glass blade
        `<rect x="146" y="38" width="12" height="54"/><rect x="146" y="8" width="17" height="31"/>` +
        `<rect x="161" y="0" width="1.6" height="9"/></g>` +
        `<circle cx="70" cy="34" r="3.2" fill="${s.sky[1]}" opacity=".85"/>` +
        `<path d="M70,34 L70,32 M70,34 L71.6,34.6" stroke="${s.ink}" stroke-width=".6"/>` +
        `<path d="M68,48 v6 M72,48 v6 M30,72 v6 M40,72 v6 M50,72 v6 M90,72 v6 M100,72 v6 M110,72 v6" stroke="${s.sky[1]}" stroke-width="1.6" opacity=".55"/>` +
        `<path d="M149.5,12 V90 M153,12 V90 M156.5,12 V90 M160,12 V37" stroke="${s.sky[1]}" stroke-width=".6" opacity=".35"/>` +
        `<path d="M146,38.5 H163" stroke="${s.sky[1]}" stroke-width=".8" opacity=".6"/>`
      );
    },
  },
  BHX: {
    city: "Birmingham",
    country: "Grossbritannien",
    timezone: "Europe/London",
    style: {
      sky: ["#1b2240", "#e3c08f"],
      ink: "#0f1426",
      far: "#3d4c75",
      tag: "Selfridges & Library",
    },
    draw: (s) => {
      // Selfridges' disc-clad blob, the stacked Library with its gold rotunda, BT Tower
      let discs = "";
      for (let y = 56; y <= 88; y += 4.5)
        for (let x = 22; x <= 84; x += 4.5) {
          const dx = (x - 52) / 30;
          const dy = (y - 72) / 19;
          if (dx * dx + dy * dy < 0.82)
            discs += `<circle cx="${x + ((y / 4.5) % 2) * 2}" cy="${y}" r="1.3"/>`;
        }
      let rings = "";
      for (let x = 104; x <= 150; x += 6)
        rings += `<circle cx="${x}" cy="63" r="3.4"/>`;
      for (let x = 112; x <= 142; x += 6)
        rings += `<circle cx="${x}" cy="47" r="2.8"/>`;
      return (
        `<g fill="${s.far}">${blocks([
          [0, 26, 14],
          [88, 34, 10],
          [156, 28, 12],
          [186, 22, 14],
        ])}</g>` +
        `<g fill="${s.ink}">` +
        `<path d="M18,92 C12,74 20,52 46,50 C70,48 88,58 88,74 C88,84 86,92 86,92Z"/>` +
        // Library of Birmingham tiers and rotunda
        `<rect x="104" y="72" width="46" height="20"/><rect x="98" y="56" width="58" height="16"/>` +
        `<rect x="107" y="41" width="40" height="15"/><rect x="118" y="32" width="18" height="9"/>` +
        `<path d="M118,32 Q127,26 136,32Z"/>` +
        // BT Tower with its antenna drums
        `<rect x="173" y="22" width="8" height="70"/><rect x="171" y="22" width="12" height="5"/>` +
        `<rect x="171" y="29" width="12" height="4"/><rect x="171" y="35" width="12" height="4"/>` +
        `<rect x="176.3" y="6" width="1.4" height="16"/></g>` +
        `<g fill="${s.sky[1]}" opacity=".45">${discs}</g>` +
        `<g fill="none" stroke="${s.sky[1]}" stroke-width=".6" opacity=".45">${rings}</g>` +
        `<rect x="118" y="32" width="18" height="9" fill="#d9a441" opacity=".7"/>` +
        `<path d="M118,32 Q127,26 136,32Z" fill="#d9a441" opacity=".7"/>` +
        lights(s, [
          [176, 46],
          [176, 60],
          [4, 72],
          [92, 66],
          [190, 76],
        ])
      );
    },
  },
  GLA: {
    city: "Glasgow",
    country: "Grossbritannien",
    timezone: "Europe/London",
    style: {
      sky: ["#142846", "#b8b4c4"],
      ink: "#0b1422",
      far: "#3b5675",
      tag: "Clyde Arc & Armadillo",
    },
    draw: (s) => {
      // Squinty Bridge arch over the Clyde, the SEC Armadillo shells, Finnieston Crane
      const archY = (x: number) => {
        const t = (x - 6) / 80;
        return 86 - 160 * t * (1 - t);
      };
      let hangers = "";
      for (let x = 22; x <= 72; x += 6)
        hangers += `M${x},${archY(x).toFixed(1)} V78 `;
      const shells = [
        [128, 152, 60],
        [116, 146, 50],
        [104, 138, 42],
        [96, 126, 40],
      ];
      let shellInk = "";
      let shellEdge = "";
      shells.forEach(([a, b, t]) => {
        const d = `M${a},86 C${a},${t} ${b},${t} ${b},86`;
        shellInk += `<path d="${d}Z"/>`;
        shellEdge += `<path d="${d}"/>`;
      });
      return (
        `<path fill="${s.far}" opacity=".7" d="M0,66 Q40,54 80,62 Q130,52 200,60 L200,92 L0,92Z"/>` +
        `<g fill="${s.far}">${blocks([
          [6, 22],
          [40, 18, 14],
          [184, 30, 14],
        ])}</g>` +
        `<path d="${hangers}" stroke="${s.ink}" stroke-width=".6"/>` +
        `<path d="M6,86 Q46,6 86,86" stroke="${s.ink}" stroke-width="3.6" fill="none"/>` +
        `<g fill="${s.ink}"><rect x="0" y="78" width="94" height="3"/><rect x="0" y="86" width="200" height="6"/>` +
        shellInk +
        // Finnieston Crane: lattice tower, hammerhead jib, counterweight, hook
        `<rect x="164" y="34" width="10" height="58"/><rect x="160" y="20" width="18" height="6"/>` +
        `<rect x="134" y="26" width="66" height="7"/><rect x="184" y="33" width="14" height="7"/>` +
        `<rect x="140" y="52" width="6" height="4"/></g>` +
        `<g fill="none" stroke="${s.sky[1]}" stroke-width=".7" opacity=".55">${shellEdge}</g>` +
        `<path d="M143,33 V52" stroke="${s.ink}" stroke-width=".6"/>` +
        `<path d="M164,34 L174,46 L164,58 L174,70 L164,82 M174,34 L164,46 L174,58 L164,70 L174,82 M134,29.5 H184 M138,26 L144,33 L150,26 L156,33 L162,26" stroke="${s.sky[1]}" stroke-width=".6" fill="none" opacity=".45"/>` +
        water(s, 6, 60, 100, 190)
      );
    },
  },
  BFS: {
    city: "Belfast",
    country: "Grossbritannien",
    timezone: "Europe/London",
    style: {
      sky: ["#12303f", "#dba07a"],
      ink: "#0a1a22",
      far: "#355a66",
      tag: "Titanic & Samson/Goliath",
    },
    draw: (s) => {
      // Titanic Belfast with its four hull-shaped prows, Harland & Wolff's yellow gantry cranes
      const gantry = (x0: number, x1: number, top: number) =>
        `<rect x="${x0 - 3}" y="${top}" width="${x1 - x0 + 6}" height="7"/>` +
        `<path d="M${x0},${top + 7} L${x0 + 5},${top + 7} L${x0 + 3},92 L${x0 - 1},92Z M${x1 - 5},${top + 7} L${x1},${top + 7} L${x1 + 1},92 L${x1 - 3},92Z"/>` +
        `<rect x="${x0 + 4}" y="${top + 7}" width="8" height="5"/>`;
      return (
        `<path fill="${s.far}" opacity=".7" d="M0,70 Q50,58 100,66 Q150,60 200,64 L200,92 L0,92Z"/>` +
        `<g fill="#d6a12b">${gantry(116, 154, 26)}${gantry(162, 196, 20)}</g>` +
        `<g font-family="sans-serif" font-weight="700" font-size="5.5" fill="${s.ink}"><text x="128" y="31.8">H&amp;W</text><text x="172" y="25.8">H&amp;W</text></g>` +
        `<g fill="${s.ink}"><rect x="0" y="86" width="200" height="6"/>` +
        `<path d="M24,92 L28,66 L10,42 L40,52 L58,34 L76,52 L106,42 L90,66 L94,92Z"/></g>` +
        `<path d="M28,66 L40,52 M58,34 L58,92 M90,66 L76,52 M40,52 L44,92 M76,52 L72,92 M10,42 L28,66 L90,66 L106,42" stroke="${s.sky[1]}" stroke-width=".6" fill="none" opacity=".4"/>` +
        lights(s, [
          [48, 60],
          [64, 60],
          [52, 74],
          [62, 78],
        ]) +
        water(s, 6, 60, 110, 192)
      );
    },
  },
  ORK: {
    city: "Cork",
    country: "Irland",
    timezone: "Europe/Dublin",
    style: {
      sky: ["#1d3340", "#cdb48a"],
      ink: "#121826",
      far: "#3f5f66",
      tag: "St Fin Barre's & Shandon",
    },
    draw: (s) => {
      // St Fin Barre's Cathedral with its three spires, Shandon tower and the River Lee
      return (
        `<path fill="${s.far}" d="M0,72 Q40,62 70,70 L120,70 Q160,56 200,62 L200,92 L0,92Z"/>` +
        `<g fill="${s.far}">${blocks(
          [
            [110, 10, 9],
            [122, 12, 8],
            [176, 12, 9],
            [188, 16, 10],
          ],
          72,
        )}</g>` +
        `<g fill="${s.ink}"><rect x="0" y="86" width="200" height="6"/>` +
        // west front towers with spires and the rose-window gable
        `<rect x="22" y="44" width="11" height="44"/><rect x="51" y="44" width="11" height="44"/>` +
        `<path d="M22,44 L27.5,16 L33,44Z M51,44 L56.5,16 L62,44Z"/>` +
        `<path d="${spires(22, 33, 11, 44, 5)}${spires(51, 62, 11, 44, 5)}"/>` +
        `<path d="M33,88 L33,56 L42,46 L51,56 L51,88Z"/>` +
        // nave, crossing tower with the tall spire, apse
        `<path d="M62,88 L62,62 L68,56 L100,56 L104,62 L104,88Z"/>` +
        `<rect x="76" y="38" width="13" height="20"/><path d="M76,38 L82.5,4 L89,38Z"/>` +
        `<path d="${spires(76, 89, 13, 38, 6)}"/>` +
        // Shandon bell tower: stacked tiers, pepperpot dome, salmon weathervane
        `<rect x="146" y="50" width="20" height="38"/><rect x="148" y="38" width="16" height="12"/>` +
        `<rect x="150" y="28" width="12" height="10"/><rect x="152" y="20" width="8" height="8"/>` +
        `<path d="M152,20 Q156,10 160,20Z"/><rect x="155.5" y="7" width="1" height="7"/>` +
        `<ellipse cx="156" cy="7" rx="4" ry="1.2"/><path d="M159.5,7 L162,5 L162,9Z"/>` +
        `<rect x="136" y="66" width="10" height="22"/><path d="M136,66 L141,60 L146,66Z"/></g>` +
        `<circle cx="42" cy="62" r="3.6" fill="${s.sky[1]}" opacity=".7"/>` +
        `<circle cx="156" cy="44" r="2.6" fill="${s.sky[1]}" opacity=".85"/>` +
        `<path d="M26.5,54 v6 M55.5,54 v6 M156,56 v8 M68,66 v8 M76,66 v8 M84,66 v8 M92,66 v8" stroke="${s.sky[1]}" stroke-width="1.4" opacity=".5"/>` +
        water(s, 10, 60, 120, 190) +
        boat(s.ink, 112)
      );
    },
  },
  RTM: {
    city: "Rotterdam",
    country: "Niederlande",
    timezone: "Europe/Amsterdam",
    style: {
      sky: ["#2a1f3d", "#f5955a"],
      ink: "#170f22",
      far: "#5a3f62",
      tag: "Erasmusbrug",
    },
    draw: (s) => {
      // The Swan's kinked pylon with its fan of stays, Potlood and the tilted cube houses
      let stays = "";
      [92, 102, 112, 122, 130].forEach((x, i) => {
        stays += `M${66 - i * 0.3},${12 + i * 3} L${x},76 `;
      });
      [10, 20, 30, 40].forEach((x, i) => {
        stays += `M${63 + i * 0.2},${14 + i * 3} L${x},76 `;
      });
      const cube = (cx: number, cy: number, r: number) =>
        `<path d="M${cx},${cy - r} L${cx + r},${cy} L${cx},${cy + r} L${cx - r},${cy}Z"/>` +
        `<rect x="${cx - 1.6}" y="${cy + r - 1}" width="3.2" height="${92 - cy - r + 1}"/>`;
      return (
        `<g fill="${s.far}">${blocks([
          [86, 50, 10],
          [96, 62, 9],
          [105, 46, 11],
          [118, 36, 10],
        ])}<rect x="95" y="38" width="11" height="12"/></g>` +
        lights(s, [
          [89, 50],
          [99, 40],
          [108, 56],
          [121, 64],
        ]) +
        `<path d="${stays}" stroke="${s.ink}" stroke-width=".55" fill="none"/>` +
        `<g fill="${s.ink}"><rect x="0" y="76" width="136" height="3"/>` +
        `<path d="M58,92 L60,79 L64,48 L61,8 L65,8 L69,48 L66,79 L68,92Z"/>` +
        `<rect x="0" y="86" width="40" height="6"/><rect x="132" y="86" width="68" height="6"/>` +
        // Potlood (pencil) tower and the cube houses on their poles
        `<rect x="138" y="40" width="8" height="52"/><path d="M137,40 L142,20 L147,40Z"/>` +
        cube(158, 64, 8) +
        cube(175, 64, 8) +
        cube(192, 64, 8) +
        `</g>` +
        `<g fill="${s.sky[1]}" opacity=".35"><path d="M158,56 L166,64 L158,72Z M175,56 L183,64 L175,72Z M192,56 L200,64 L192,72Z"/></g>` +
        `<path d="M62,10 L65,48 L63,78" stroke="${s.sky[1]}" stroke-width=".6" fill="none" opacity=".5"/>` +
        water(s, 6, 50, 90, 180) +
        boat(s.ink, 100)
      );
    },
  },
  EIN: {
    city: "Eindhoven",
    country: "Niederlande",
    timezone: "Europe/Amsterdam",
    style: {
      sky: ["#2b1d4a", "#d98fae"],
      ink: "#0f1128",
      far: "#553f78",
      tag: "Evoluon",
    },
    draw: (s) => {
      // Philips' Evoluon flying saucer on its V-shaped concrete legs, Lichttoren behind
      let legs = "";
      [62, 86, 114, 138].forEach((x) => {
        legs += `M${x - 9},70 L${x - 1},92 L${x + 1},92 L${x + 9},70 L${x + 6},70 L${x},86 L${x - 6},70Z `;
      });
      let win = "";
      for (let x = 42; x <= 156; x += 5)
        win += `<rect x="${x}" y="58.4" width="3" height="1.8"/>`;
      return (
        `<g fill="${s.far}">${blocks([
          [0, 24, 14],
          [16, 40, 12],
          [168, 20, 14],
          [184, 30, 16],
        ])}<rect x="17" y="40" width="10" height="12"/><rect x="18" y="34" width="8" height="6"/></g>` +
        `<rect x="18.5" y="35" width="7" height="4" fill="${s.sky[1]}" opacity=".8"/>` +
        lights(s, [
          [4, 74],
          [20, 62],
          [172, 78],
          [190, 70],
        ]) +
        `<g fill="${s.ink}"><rect x="0" y="88" width="200" height="4"/>` +
        `<path d="M34,57 Q100,20 166,57Z"/><rect x="32" y="57" width="136" height="4"/>` +
        `<path d="M36,61 Q100,84 164,61Z"/>` +
        `<path d="${legs}"/></g>` +
        `<g fill="${s.sky[1]}" opacity=".7">${win}</g>` +
        `<path d="M58,47 Q100,30 142,47" stroke="${s.sky[1]}" stroke-width=".7" fill="none" opacity=".35"/>`
      );
    },
  },
  LUX: {
    city: "Luxemburg",
    country: "Luxemburg",
    timezone: "Europe/Luxembourg",
    style: {
      sky: ["#2c2a48", "#f4c47a"],
      ink: "#141428",
      far: "#4a4a74",
      tag: "Pont Adolphe",
    },
    draw: (s) => {
      // Pont Adolphe spanning the Pétrusse valley between the old-town cliffs
      let spandrels = "";
      [38, 43, 154, 159].forEach((x) => {
        spandrels += `M${x},60 v-4 q1.5,-2.5 3,0 v4Z `;
      });
      let parapet = "";
      for (let x = 32; x <= 166; x += 4)
        parapet += `<rect x="${x}" y="45" width="1.2" height="2.6"/>`;
      return (
        `<path fill="${s.far}" d="M0,84 Q50,76 100,82 Q150,76 200,84 L200,92 L0,92Z"/>` +
        `<g fill="${s.far}"><circle cx="70" cy="82" r="6"/><circle cx="84" cy="84" r="5"/><circle cx="120" cy="83" r="6"/><circle cx="132" cy="85" r="4"/></g>` +
        `<g fill="${s.ink}" fill-rule="evenodd">` +
        `<path d="M30,48 L170,48 L170,92 L30,92Z M50,92 L50,80 Q100,30 150,80 L150,92Z ${spandrels}"/></g>` +
        `<g fill="${s.ink}"><rect x="28" y="44" width="144" height="1.6"/>${parapet}` +
        // left cliff: rock, houses, savings-bank tower
        `<path d="M0,92 L0,48 L32,48 L30,60 L34,72 L30,92Z"/>` +
        `<path d="M0,48 L0,38 L6,34 L12,38 L12,48Z M12,48 L12,40 L18,40 L18,48Z"/>` +
        `<rect x="19" y="26" width="7" height="22"/><path d="M18.5,26 L22.5,12 L26.5,26Z"/>` +
        // right cliff: rock, houses, the cathedral's three needle spires
        `<path d="M200,92 L200,46 L168,46 L170,58 L166,72 L170,92Z"/>` +
        `<rect x="170" y="36" width="30" height="10"/>` +
        `<rect x="176" y="22" width="5" height="14"/><path d="M175.5,22 L178.5,4 L181.5,22Z"/>` +
        `<rect x="186" y="28" width="4" height="8"/><path d="M185.5,28 L188,14 L190.5,28Z"/>` +
        `<rect x="194" y="28" width="4" height="8"/><path d="M193.5,28 L196,16 L198.5,28Z"/></g>` +
        `<path d="M50,80 Q100,30 150,80" stroke="${s.sky[1]}" stroke-width=".7" fill="none" opacity=".4"/>` +
        lights(s, [
          [4, 41],
          [14, 43],
          [173, 40],
          [184, 40],
          [192, 40],
          [21.5, 32],
        ])
      );
    },
  },
  ANR: {
    city: "Antwerpen",
    country: "Belgien",
    timezone: "Europe/Brussels",
    style: {
      sky: ["#30203f", "#e8958a"],
      ink: "#14101f",
      far: "#583f62",
      tag: "Kathedraal & Het Steen",
    },
    draw: (s) => {
      // Onze-Lieve-Vrouwekathedraal's lace spire, guild houses, Het Steen on the Scheldt
      let crockets = "";
      for (let y = 8; y <= 22; y += 3.5) {
        const w = 0.4 + (y - 4) * 0.12;
        crockets += `<rect x="${(64 - w - 1).toFixed(1)}" y="${y}" width="${(2 * w + 2).toFixed(1)}" height=".9"/>`;
      }
      let gables = "";
      [
        [100, 16],
        [110, 20],
        [120, 14],
      ].forEach(([x, h]) => {
        const t = 88 - h;
        gables += `M${x},88 L${x},${t} h1.5 v-2 h1.5 v-2 h1.5 v-2 h1 v2 h1.5 v2 h1.5 v2 h1.5 L${x + 10},88Z `;
      });
      return (
        `<path fill="${s.far}" d="${gables}"/>` +
        lights(s, [
          [103, 78],
          [114, 74],
          [123, 80],
        ]) +
        `<g fill="${s.ink}"><rect x="0" y="86" width="200" height="6"/>` +
        // nave and the unfinished south tower
        `<path d="M30,88 L30,64 L40,58 L94,58 L98,64 L98,88Z"/>` +
        `<rect x="74" y="50" width="14" height="38"/><path d="M74,50 L81,44 L88,50Z"/>` +
        // north tower: square base, lantern, crocketed spire
        `<rect x="55" y="40" width="18" height="48"/><path d="${spires(55, 73, 6, 40, 5)}"/>` +
        `<rect x="57.5" y="26" width="13" height="14"/><path d="${spires(57.5, 70.5, 6.5, 26, 4)}"/>` +
        `<path d="M59,26 L64,4 L69,26Z"/><rect x="63.5" y="0" width="1" height="5"/>` +
        crockets +
        // Het Steen: curtain wall, round tower with conical roof, stepped-gable keep
        `<rect x="134" y="70" width="64" height="18"/><path d="${crenel(134, 198, 70, 5, 3)}"/>` +
        `<rect x="146" y="52" width="16" height="36"/><path d="M144,52 L154,36 L164,52Z"/>` +
        `<path d="M170,88 L170,58 h3 v-3 h3 v-3 h3 v-3 h2 v3 h3 v3 h3 v3 h3 L190,88Z"/>` +
        `<rect x="136" y="62" width="6" height="8"/><path d="M135,62 L139,55 L143,62Z"/></g>` +
        `<path d="M61,30 v7 M64,30 v7 M67,30 v7 M59,46 v8 M64,46 v8 M69,46 v8" stroke="${s.sky[1]}" stroke-width="1.2" opacity=".55"/>` +
        `<path d="M154,60 v6 M178,62 v6 M182,62 v6 M36,70 v8 M44,70 v8 M90,66 v8" stroke="${s.sky[1]}" stroke-width="1.4" opacity=".5"/>` +
        water(s, 8, 70, 110, 190) +
        boat(s.ink, 112)
      );
    },
  },
  BRS: {
    city: "Bristol",
    country: "Grossbritannien",
    timezone: "Europe/London",
    style: {
      sky: ["#3a2246", "#f08a6c"],
      ink: "#121226",
      far: "#5c3b66",
      tag: "Clifton Suspension Bridge",
    },
    draw: (s) => {
      // Brunel's bridge across the Avon Gorge, colourful Cliftonwood houses on the slope
      let hangers = "";
      for (let x = 46; x <= 152; x += 7) {
        const t = (x - 37) / 126;
        const y = (1 - t) * (1 - t) * 26 + 2 * t * (1 - t) * 72 + t * t * 26;
        if (y < 49) hangers += `M${x},${y.toFixed(1)} V50 `;
      }
      const tower = (x: number, top: number, base: number) =>
        `<path d="M${x - 6},${base} L${x - 4.5},${top} L${x + 4.5},${top} L${x + 6},${base}Z M${x - 2.4},${base} L${x - 2.4},${base - 12} Q${x},${base - 16} ${x + 2.4},${base - 12} L${x + 2.4},${base}Z"/>` +
        `<rect x="${x - 5.5}" y="${top - 2}" width="11" height="2"/>`;
      const colours = [
        "#e8735f",
        "#f2c14e",
        "#78b9cc",
        "#b28bd0",
        "#86c98f",
        "#f0a3b8",
      ];
      let houses = "";
      [
        [2, 60],
        [9, 61],
        [16, 63],
        [23, 66],
        [4, 69],
        [11, 70],
        [18, 72],
        [172, 62],
        [179, 61],
        [186, 60],
        [193, 61],
      ].forEach(([x, y], i) => {
        houses += `<rect x="${x}" y="${y}" width="6" height="6" fill="${colours[i % colours.length]}"/><path d="M${x - 0.5},${y} L${x + 3},${y - 3} L${x + 6.5},${y}Z" fill="${s.ink}"/>`;
      });
      return (
        `<path fill="${s.far}" opacity=".6" d="M0,60 Q100,70 200,58 L200,92 L0,92Z"/>` +
        `<g fill="${s.far}"><path d="M0,92 L0,54 L36,54 Q38,66 44,74 Q50,84 54,92Z"/>` +
        `<path d="M200,92 L200,50 L162,50 Q160,64 152,76 Q148,86 146,92Z"/></g>` +
        `<g opacity=".9">${houses}</g>` +
        `<path d="${hangers}" stroke="${s.ink}" stroke-width=".5"/>` +
        `<path d="M8,54 L37,26 Q100,72 163,26 L192,50" stroke="${s.ink}" stroke-width="1.4" fill="none"/>` +
        `<g fill="${s.ink}" fill-rule="evenodd"><rect x="30" y="49.5" width="140" height="2.2"/>` +
        tower(37, 26, 54) +
        tower(163, 26, 50) +
        `</g>` +
        `<path d="M0,54 L36,54 M162,50 L200,50" stroke="${s.ink}" stroke-width="1.6"/>` +
        water(s, 60, 90, 120, 150) +
        boat(s.ink, 100)
      );
    },
  },
};
