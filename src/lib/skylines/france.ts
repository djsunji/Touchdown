import { palm, type CityStyle, type LibraryCity } from "./shared";

// Hand-drawn skylines: France

// Battlement merlons along y between x0 and x1 (closed path, append to an ink group)
function crenel(x0: number, x1: number, y: number, step = 4, h = 3) {
  let d = "";
  for (let x = x0; x + step / 2 <= x1; x += step)
    d += `M${x},${y} h${step / 2} v-${h} h-${step / 2}Z`;
  return d;
}

// Calm water strip below the ground line with two light reflections
function water(s: CityStyle, a = 8, b = 70, c = 110, d = 190) {
  return (
    `<rect x="0" y="92" width="200" height="8" fill="${s.far}"/>` +
    `<path d="M${a},95 L${b},95 M${c},97 L${d},97" stroke="${s.sky[1]}" stroke-width="1" opacity=".55"/>`
  );
}

// Moored sailing boat: hull on the water and a tall bare mast
function mast(ink: string, x: number, h: number) {
  return (
    `<path fill="${ink}" d="M${x - 6},93 L${x + 6},93 L${x + 4},96 L${x - 4},96Z"/>` +
    `<path d="M${x},93 L${x},${93 - h} M${x},${93 - h + 2} L${x + 5},${91}" stroke="${ink}" stroke-width=".7" fill="none"/>`
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

export const FRANCE: Record<string, LibraryCity> = {
  CDG: {
    city: "Paris",
    country: "Frankreich",
    timezone: "Europe/Paris",
    style: {
      sky: ["#1f2350", "#f4a6a0"],
      ink: "#0f1029",
      far: "#4b4f86",
      tag: "Eiffelturm & Sacré-Cœur",
    },
    draw: (s) => {
      // Montmartre with Sacré-Cœur on the left, Haussmann roofs, the Eiffel Tower
      let roofs = "";
      [
        [0, 80, 22],
        [24, 82, 20],
        [150, 80, 24],
        [176, 78, 24],
      ].forEach(([x, y, w]) => {
        roofs += `<rect x="${x}" y="${y}" width="${w}" height="${92 - y}"/><path d="M${x},${y} L${x + 3},${y - 5} L${x + w - 3},${y - 5} L${x + w},${y}Z"/>`;
        for (let cx = x + 4; cx < x + w - 3; cx += 6)
          roofs += `<rect x="${cx}" y="${y - 8}" width="2" height="3.4"/>`;
      });
      let lattice = "";
      for (let y = 30; y < 66; y += 6) {
        const half = 3 + (y - 22) * 0.18;
        lattice += `M${120 - half},${y} L${120 + half},${y + 6} M${120 + half},${y} L${120 - half},${y + 6} `;
      }
      return (
        `<path fill="${s.far}" d="M0,92 L0,62 Q22,52 46,54 Q70,58 92,74 L96,92Z"/>` +
        `<g fill="${s.ink}">` +
        // Sacré-Cœur: nave, main dome on its drum, side domes, campanile
        `<rect x="18" y="44" width="38" height="12"/>` +
        `<rect x="30" y="36" width="14" height="8"/><path d="M29,37 Q29,22 37,20 Q45,22 45,37Z"/>` +
        `<rect x="36.2" y="14" width="1.6" height="7"/><circle cx="37" cy="13.5" r="1.3"/>` +
        `<path d="M18,45 Q18,37 22,36 Q26,37 26,45Z M48,45 Q48,37 52,36 Q56,37 56,45Z"/>` +
        `<rect x="57" y="30" width="6" height="26"/><path d="M56.5,30.5 Q60,23 63.5,30.5Z"/><rect x="59.5" y="21" width="1" height="4"/>` +
        roofs +
        // Eiffel Tower: curved legs with the arch, three platforms, antenna
        `<path d="M94,92 Q108,74 113,52 L116,24 L118.4,7 L121.6,7 L124,24 L127,52 Q132,74 146,92 L137,92 Q130,72 120,72 Q110,72 103,92Z"/>` +
        `<rect x="100" y="66" width="40" height="3.4"/><rect x="110" y="48" width="20" height="2.6"/>` +
        `<rect x="114.5" y="22" width="11" height="2.2"/><rect x="117.6" y="3" width="4.8" height="4.4"/>` +
        `<rect x="119.4" y="-4" width="1.2" height="7.4"/></g>` +
        `<path d="${lattice}" stroke="${s.sky[1]}" stroke-width=".5" opacity=".35" fill="none"/>` +
        `<path d="M108,66 Q120,58 132,66" stroke="${s.sky[1]}" stroke-width=".6" opacity=".35" fill="none"/>` +
        `<circle cx="120" cy="5" r="1" fill="${s.sky[1]}" opacity=".8"/>` +
        lights(s, [
          [4, 84],
          [12, 86],
          [30, 86],
          [156, 84],
          [166, 86],
          [182, 82],
          [192, 86],
        ]) +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  MRS: {
    city: "Marseille",
    country: "Frankreich",
    timezone: "Europe/Paris",
    style: {
      sky: ["#123049", "#f6b46a"],
      ink: "#08182a",
      far: "#3a5a78",
      tag: "Notre-Dame de la Garde",
    },
    draw: (s) => {
      // The basilica on its rock above the Vieux-Port, Fort Saint-Jean far left
      let quay = "";
      [
        [0, 70, 10],
        [10, 74, 12],
        [22, 68, 9],
        [31, 76, 14],
        [45, 72, 10],
      ].forEach(([x, y, w]) => {
        quay += `<rect x="${x}" y="${y}" width="${w}" height="${92 - y}"/>`;
      });
      return (
        `<g fill="${s.far}">${quay}<rect x="56" y="80" width="40" height="12"/></g>` +
        `<g fill="${s.ink}">` +
        // the hill (La Garde) with retaining walls
        `<path d="M92,92 L96,80 Q112,66 124,60 L130,54 L176,54 Q186,62 200,68 L200,92Z"/>` +
        `<rect x="126" y="50" width="54" height="5"/>` +
        // basilica: nave with domes, bell tower, belfry, statue of the Virgin
        `<rect x="130" y="38" width="30" height="12"/>` +
        `<path d="M132,38 Q132,30 137,29 Q142,30 142,38Z M144,38 Q144,31 148,30 Q152,31 152,38Z"/>` +
        `<rect x="136.4" y="25" width="1.2" height="4"/><rect x="147.4" y="26" width="1.2" height="4"/>` +
        `<rect x="160" y="20" width="10" height="30"/><rect x="158.5" y="18" width="13" height="3"/>` +
        `<rect x="161" y="11" width="8" height="7"/><rect x="160" y="9.6" width="10" height="1.6"/>` +
        `<rect x="163" y="4" width="4" height="6"/>` +
        `<path d="M165,-6 Q163,-5.4 163.4,-3 L162.6,4 L167.4,4 L166.6,-3 Q167,-5.4 165,-6Z"/></g>` +
        `<g fill="${s.sky[1]}" opacity=".65"><path d="M162,48 v-6 q3,-4 6,0 v6Z M163,30 v-4 q2,-3 4,0 v4Z"/>` +
        `<rect x="163" y="13" width="1.4" height="4"/><rect x="165.6" y="13" width="1.4" height="4"/></g>` +
        `<path d="M165,-6 L165,4" stroke="#f6d27a" stroke-width=".8" opacity=".8"/>` +
        `<g fill="${s.sky[1]}" opacity=".5"><rect x="133" y="42" width="2" height="4"/><rect x="139" y="42" width="2" height="4"/><rect x="145" y="42" width="2" height="4"/><rect x="151" y="42" width="2" height="4"/></g>` +
        water(s, 4, 50, 100, 190) +
        mast(s.ink, 14, 30) +
        mast(s.ink, 30, 36) +
        mast(s.ink, 46, 28) +
        mast(s.ink, 62, 34) +
        mast(s.ink, 78, 26)
      );
    },
  },

  BOD: {
    city: "Bordeaux",
    country: "Frankreich",
    timezone: "Europe/Paris",
    style: {
      sky: ["#2c1838", "#e9a77f"],
      ink: "#170a1d",
      far: "#5a3a63",
      tag: "Place de la Bourse",
    },
    draw: (s) => {
      // Flèche Saint-Michel and Pont de pierre behind, the Bourse with its water mirror
      let arches = "";
      for (let x = 132; x < 200; x += 12)
        arches += `M${x},92 L${x},84 Q${x + 5},76 ${x + 10},84 L${x + 10},92Z `;
      let win = "";
      for (const x of [16, 24, 32, 40, 48, 100, 108, 116, 124, 132])
        win += `<path d="M${x},70 v-5 q1.5,-2.5 3,0 v5Z M${x},84 v-5 q1.5,-2.5 3,0 v5Z"/>`;
      let dormers = "";
      for (const x of [18, 30, 42, 104, 116, 128])
        dormers += `<rect x="${x}" y="46" width="4" height="4"/><path d="M${x - 0.6},46 L${x + 2},43 L${x + 4.6},46Z"/>`;
      return (
        `<g fill="${s.far}">` +
        `<rect x="176" y="20" width="9" height="52"/><path d="M176,20 L180.5,-2 L185,20Z"/>` +
        `<rect x="128" y="74" width="72" height="4"/><path fill-rule="evenodd" d="M128,92 L128,77 L200,77 L200,92Z ${arches}"/></g>` +
        `<g fill="${s.ink}">` +
        // wings with mansard roofs
        `<rect x="8" y="56" width="134" height="36"/>` +
        `<path d="M6,57 L11,48 L139,48 L144,57Z"/>${dormers}` +
        // central pavilion with curved roof and pediment
        `<rect x="58" y="48" width="34" height="44"/>` +
        `<path d="M55,49 L60,34 Q75,26 90,34 L95,49Z"/>` +
        `<path d="M62,56 L75,48 L88,56Z"/><rect x="73.6" y="22" width="2.8" height="6"/>` +
        // Fontaine des Trois Grâces
        `<rect x="66" y="84" width="18" height="8"/><rect x="73" y="70" width="4" height="14"/><circle cx="75" cy="68.6" r="2.2"/></g>` +
        `<g fill="${s.sky[1]}" opacity=".6">${win}<path d="M64,72 v-7 q2,-3 4,0 v7Z M82,72 v-7 q2,-3 4,0 v7Z"/></g>` +
        `<rect x="72" y="38" width="6" height="6" rx="3" fill="${s.sky[1]}" opacity=".55"/>` +
        // Miroir d'eau: a thin water film reflecting the facade
        `<rect x="0" y="92" width="200" height="8" fill="${s.far}"/>` +
        `<rect x="8" y="92" width="134" height="6" fill="${s.ink}" opacity=".4"/>` +
        `<path d="M14,94.5 L56,94.5 M94,94.5 L140,94.5 M60,97 L90,97" stroke="${s.sky[1]}" stroke-width=".8" opacity=".55"/>`
      );
    },
  },

  TLS: {
    city: "Toulouse",
    country: "Frankreich",
    timezone: "Europe/Paris",
    style: {
      sky: ["#3a1e3c", "#f2a093"],
      ink: "#1d0d1f",
      far: "#6b3a5c",
      tag: "Saint-Sernin & Pont Neuf",
    },
    draw: (s) => {
      // Capitole far left, the octagonal tiered spire of Saint-Sernin, Pont Neuf in front
      const tiers: [number, number, number][] = [
        [120, 40, 56],
        [123, 34, 46],
        [125.5, 29, 37],
        [127.5, 25, 29],
        [129.5, 21, 22],
      ];
      let tower = "";
      let arc = "";
      tiers.forEach(([x, w, y], i) => {
        const h = i === 0 ? 10 : tiers[i - 1][2] - y;
        tower += `<rect x="${x}" y="${y}" width="${w}" height="${h}"/><rect x="${x - 1}" y="${y + h - 1.4}" width="${w + 2}" height="1.4"/>`;
        const n = i < 2 ? 4 : 3;
        for (let k = 0; k < n; k++) {
          const ax = x + (w / n) * (k + 0.5) - 1.2;
          arc += `<path d="M${ax.toFixed(1)},${y + h - 2.6} v-${Math.max(2.4, h - 6)} q1.2,-1.6 2.4,0 v${Math.max(2.4, h - 6)}Z"/>`;
        }
      });
      let bridge = "";
      [
        [6, 22],
        [40, 28],
        [80, 32],
        [124, 28],
        [164, 22],
      ].forEach(([x, w]) => {
        bridge += `M${x},92 L${x},86 Q${x + w / 2},${86 - w / 3} ${x + w},86 L${x + w},92Z `;
      });
      let oculi = "";
      for (const x of [33, 73, 117, 157])
        oculi += `<circle cx="${x}" cy="80" r="2.6"/>`;
      return (
        `<g fill="${s.far}"><rect x="0" y="58" width="96" height="16"/><rect x="0" y="55" width="96" height="3"/>` +
        `<path d="M34,55 L48,48 L62,55Z"/><rect x="164" y="60" width="36" height="14"/><path d="M164,60 L182,52 L200,60Z"/></g>` +
        `<g fill="${s.sky[1]}" opacity=".35">${lights(s, [
          [6, 62],
          [14, 62],
          [22, 62],
          [70, 62],
          [78, 62],
          [86, 62],
        ])}</g>` +
        `<g fill="${s.ink}">` +
        // basilica body and choir
        `<rect x="98" y="60" width="66" height="14"/><path d="M96,61 L104,54 L158,54 L166,61Z"/>` +
        `<path d="M160,74 L160,62 Q170,56 180,62 L180,74Z"/>` +
        tower +
        `<path d="M130.5,21 L140,-2 L149.5,21Z"/><rect x="139.4" y="-6" width="1.2" height="5"/><rect x="138" y="-4.4" width="4" height="1"/>` +
        // Pont Neuf deck
        `<path fill-rule="evenodd" d="M0,72 L200,72 L200,92 L0,92Z ${bridge}"/>` +
        `<rect x="0" y="70" width="200" height="2.6"/></g>` +
        `<g fill="${s.far}">${oculi}</g>` +
        `<g fill="${s.sky[1]}" opacity=".55">${arc}</g>` +
        water(s, 10, 30, 84, 110)
      );
    },
  },

  NTE: {
    city: "Nantes",
    country: "Frankreich",
    timezone: "Europe/Paris",
    style: {
      sky: ["#1a2f3a", "#9fd0c2"],
      ink: "#0b1a21",
      far: "#3f6370",
      tag: "Château & Grand Éléphant",
    },
    draw: (s) => {
      // Château des ducs de Bretagne on the left, the Machines de l'île elephant on the right
      const tower = (x: number, top: number) =>
        `<rect x="${x}" y="${top}" width="14" height="${92 - top}"/><rect x="${x - 1.5}" y="${top - 1}" width="17" height="3"/>` +
        `<path d="${crenel(x - 1.5, x + 15.5, top - 1, 3.4, 2.6)}"/>`;
      let dormers = "";
      for (const x of [44, 56, 68])
        dormers += `<rect x="${x}" y="40" width="6" height="8"/><path d="M${x - 1},40 L${x + 3},31 L${x + 7},40Z"/><rect x="${x + 2.6}" y="27" width=".8" height="5"/>`;
      return (
        // cathedral towers far behind
        `<g fill="${s.far}"><rect x="84" y="34" width="9" height="40"/><rect x="96" y="34" width="9" height="40"/><rect x="84" y="50" width="21" height="24"/></g>` +
        `<g fill="${s.ink}">` +
        // Grand Gouvernement with its steep roof and gothic dormers
        `<rect x="38" y="48" width="42" height="20"/><path d="M36,49 L44,38 L74,38 L82,49Z"/>${dormers}` +
        `<rect x="0" y="66" width="96" height="26"/><path d="${crenel(0, 96, 66, 4, 3)}"/>` +
        tower(4, 54) +
        tower(28, 58) +
        tower(82, 56) +
        // the Grand Éléphant: body, head, ear, trunk, tusk, legs, howdah
        `<path d="M134,46 Q140,32 162,32 Q188,32 192,50 Q194,64 184,70 L140,70 Q130,64 134,46Z"/>` +
        `<path d="M138,44 Q126,40 122,50 Q120,60 124,70 Q122,80 118,84 Q117,87 120,86 Q127,80 129,70 Q132,62 136,58Z"/>` +
        `<path d="M136,40 Q146,38 148,50 Q146,60 138,58Z" fill="${s.far}"/>` +
        `<rect x="141" y="66" width="6" height="26"/><rect x="152" y="66" width="6" height="26"/>` +
        `<rect x="170" y="66" width="6" height="26"/><rect x="181" y="64" width="6" height="28"/>` +
        `<rect x="139.5" y="78" width="9" height="2"/><rect x="150.5" y="78" width="9" height="2"/><rect x="168.5" y="78" width="9" height="2"/><rect x="179.5" y="78" width="9" height="2"/>` +
        `<path d="M191,48 Q198,56 196,68" stroke="${s.ink}" stroke-width="1.4" fill="none"/>` +
        `<rect x="152" y="22" width="30" height="10"/><path d="M148,23 Q167,10 186,23Z"/>` +
        `<rect x="150" y="22" width="1.2" height="10"/><rect x="183" y="22" width="1.2" height="10"/></g>` +
        `<path d="M128,58 Q122,62 120,58" stroke="${s.sky[1]}" stroke-width="1.2" fill="none" opacity=".7"/>` +
        `<circle cx="131" cy="46" r="1" fill="${s.sky[1]}" opacity=".8"/>` +
        `<g fill="${s.sky[1]}" opacity=".55"><rect x="155" y="25" width="3" height="4"/><rect x="162" y="25" width="3" height="4"/><rect x="169" y="25" width="3" height="4"/><rect x="176" y="25" width="3" height="4"/></g>` +
        `<path d="M146,40 Q162,36 184,42 M150,58 L182,58" stroke="${s.sky[1]}" stroke-width=".6" fill="none" opacity=".35"/>` +
        lights(s, [
          [9, 62],
          [33, 66],
          [87, 64],
          [48, 54],
          [60, 54],
          [72, 54],
        ]) +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  SXB: {
    city: "Strassburg",
    country: "Frankreich",
    timezone: "Europe/Paris",
    style: {
      sky: ["#26203f", "#e8b6c8"],
      ink: "#120f22",
      far: "#4f4775",
      tag: "Cathédrale & Petite France",
    },
    draw: (s) => {
      // The cathedral's single north spire behind the half-timbered houses of Petite France
      let houses = "";
      let timber = "";
      [
        [0, 62, 18],
        [19, 58, 16],
        [36, 66, 14],
        [124, 60, 18],
        [143, 54, 20],
        [164, 62, 16],
        [181, 58, 19],
      ].forEach(([x, y, w]) => {
        houses += `<rect x="${x}" y="${y}" width="${w}" height="${92 - y}"/><path d="M${x - 1},${y} L${x + w / 2},${y - w * 0.85} L${x + w + 1},${y}Z"/>`;
        timber += `M${x + 1},${y + 8} L${x + w - 1},${y + 8} M${x + 1},${y + 16} L${x + w - 1},${y + 16} M${x + 2},${y} L${x + w / 2},${y + 8} L${x + w - 2},${y} M${x + 2},${y + 8} L${x + w / 2},${y + 16} L${x + w - 2},${y + 8} M${x + w / 2 - 2},${y - w * 0.4} h4 `;
      });
      return (
        `<g fill="${s.far}"><rect x="100" y="52" width="40" height="30"/><path d="M98,53 L104,42 L136,42 L142,53Z"/></g>` +
        `<g fill="${s.ink}">` +
        // west facade with the north tower, octagon and openwork spire
        `<rect x="56" y="30" width="48" height="62"/><rect x="54" y="28" width="52" height="3"/>` +
        `<rect x="88" y="24" width="16" height="5"/>` +
        `<rect x="60" y="6" width="18" height="23"/><rect x="58.5" y="5" width="21" height="2"/>` +
        `<path d="M58.6,6 L60.4,-6 L62.2,6Z M75.8,6 L77.6,-6 L79.4,6Z"/>` +
        `<path d="M61,6 L64,-6 L69,-28 L74,-6 L77,6Z"/><rect x="68.5" y="-33" width="1" height="6"/><rect x="67.2" y="-31.2" width="3.6" height=".9"/>` +
        houses +
        `</g>` +
        `<g fill="${s.sky[1]}" opacity=".55">` +
        `<circle cx="80" cy="44" r="6"/>` +
        `<path d="M64,26 v-14 l1.5,-2.5 l1.5,2.5 v14Z M71,26 v-14 l1.5,-2.5 l1.5,2.5 v14Z M61,38 v-6 l1.5,-2 l1.5,2 v6Z M97,38 v-6 l1.5,-2 l1.5,2 v6Z"/>` +
        `<path d="M74,80 v-12 l6,-7 l6,7 v12Z"/></g>` +
        `<circle cx="80" cy="44" r="2.4" fill="${s.ink}"/>` +
        `<path d="M64,2 L69,-20 L74,2 M65,-6 L73,-6 M66.4,-14 L71.6,-14" stroke="${s.sky[1]}" stroke-width=".5" opacity=".4" fill="none"/>` +
        `<path d="${timber}" stroke="${s.far}" stroke-width=".9" fill="none"/>` +
        lights(s, [
          [5, 74],
          [24, 70],
          [40, 76],
          [130, 72],
          [150, 66],
          [170, 74],
          [187, 70],
        ]) +
        water(s, 6, 54, 112, 196)
      );
    },
  },

  LIL: {
    city: "Lille",
    country: "Frankreich",
    timezone: "Europe/Paris",
    style: {
      sky: ["#2a1a14", "#e7a25c"],
      ink: "#160c08",
      far: "#5e3a26",
      tag: "Beffroi & Vieille Bourse",
    },
    draw: (s) => {
      // Vieille Bourse with its belfry and Flemish gables, the town hall belfry on the right
      let gables = "";
      for (let x = 4; x < 108; x += 13)
        gables += `<path d="M${x},62 L${x},56 h2 v-3 h2 v-3 h2 v-3 h1 v3 h2 v3 h2 v3 h2 v6Z"/>`;
      let win = "";
      for (let x = 6; x < 108; x += 13)
        for (const y of [68, 78])
          win += `<rect x="${x}" y="${y}" width="2" height="5"/><rect x="${x + 5}" y="${y}" width="2" height="5"/>`;
      let ribs = "";
      for (const x of [146, 150, 154])
        ribs += `<rect x="${x}" y="44" width="1" height="40"/>`;
      return (
        `<g fill="${s.far}"><rect x="112" y="70" width="88" height="22"/><path d="M110,71 L118,62 L198,62 L200,64 L200,71Z"/></g>` +
        `<g fill="${s.ink}">` +
        `<rect x="0" y="62" width="110" height="30"/><rect x="0" y="60" width="110" height="2.4"/>${gables}` +
        // Vieille Bourse lantern tower with bulb and spire
        `<rect x="50" y="36" width="10" height="24"/><rect x="48.5" y="34" width="13" height="2.4"/>` +
        `<path d="M50,34 Q50,26 55,24 Q60,26 60,34Z"/><rect x="54.4" y="14" width="1.2" height="10"/><circle cx="55" cy="18" r="1.4"/>` +
        // Beffroi: brick shaft, setbacks, pinnacles, lantern and spire
        `<rect x="141" y="38" width="18" height="54"/><rect x="139" y="36" width="22" height="3"/>` +
        `<rect x="143" y="22" width="14" height="14"/><rect x="141" y="20" width="18" height="2.4"/>` +
        `<path d="M139.6,36 L140.8,26 L142,36Z M158,36 L159.2,26 L160.4,36Z M141.6,20 L142.6,12 L143.6,20Z M156.4,20 L157.4,12 L158.4,20Z"/>` +
        `<rect x="145.5" y="10" width="9" height="10"/><path d="M145,10 Q150,0 155,10Z"/>` +
        `<path d="M149,4 L150,-8 L151,4Z"/><circle cx="150" cy="-9" r="1"/></g>` +
        `<g fill="${s.sky[1]}" opacity=".55">${win}<circle cx="150" cy="30" r="3.2"/>` +
        `<path d="M147,18 v-5 q1,-1.6 2,0 v5Z M151,18 v-5 q1,-1.6 2,0 v5Z M52.5,48 v-6 q2.5,-3 5,0 v6Z"/></g>` +
        `<g fill="${s.sky[1]}" opacity=".18">${ribs}</g>` +
        lights(s, [
          [118, 76],
          [126, 76],
          [170, 76],
          [178, 76],
          [186, 76],
          [194, 76],
        ]) +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  MPL: {
    city: "Montpellier",
    country: "Frankreich",
    timezone: "Europe/Paris",
    style: {
      sky: ["#1d2c55", "#f7c98b"],
      ink: "#0d1530",
      far: "#47578a",
      tag: "Arc de Triomphe & Peyrou",
    },
    draw: (s) => {
      // Porte du Peyrou on the left, the Château d'eau on its aqueduct on the right
      let aq = "";
      for (let x = 168; x < 204; x += 10)
        aq += `M${x},92 L${x},76 Q${x + 3.5},71 ${x + 7},76 L${x + 7},92Z M${x + 1},68 L${x + 1},61 Q${x + 3.5},58 ${x + 6},61 L${x + 6},68Z `;
      let cols = "";
      for (const x of [128, 136, 144, 152, 160])
        cols += `<rect x="${x}" y="38" width="2.6" height="20"/>`;
      return (
        `<path fill="${s.far}" fill-rule="evenodd" d="M164,92 L164,58 L200,58 L200,92Z ${aq}"/>` +
        `<path fill="${s.far}" d="M86,92 L86,70 Q92,58 100,68 Q108,60 112,72 L112,92Z"/>` +
        `<g fill="${s.ink}">` +
        // triumphal arch: body with one opening, cornice, attic
        `<path fill-rule="evenodd" d="M14,92 L14,42 L78,42 L78,92Z M36,92 L36,64 Q46,52 56,64 L56,92Z"/>` +
        `<rect x="11" y="38" width="70" height="4.4"/><rect x="18" y="26" width="56" height="12"/><rect x="16" y="24" width="60" height="2.6"/>` +
        `<rect x="40" y="18" width="12" height="6"/>` +
        // Château d'eau: stepped base, columns, entablature, crown
        `<rect x="118" y="58" width="52" height="34"/><rect x="114" y="56" width="58" height="3"/>` +
        cols +
        `<rect x="124" y="33" width="42" height="5"/><path d="M124,33 Q145,20 166,33Z"/>` +
        `<rect x="142" y="18" width="6" height="8"/><path d="M141,18 Q145,12 149,18Z"/></g>` +
        `<g fill="${s.sky[1]}" opacity=".5"><rect x="20" y="46" width="2" height="16"/><rect x="28" y="46" width="2" height="16"/><rect x="62" y="46" width="2" height="16"/><rect x="70" y="46" width="2" height="16"/>` +
        `<rect x="26" y="30" width="40" height="1.4"/><rect x="131" y="40" width="4" height="16"/><rect x="155" y="40" width="4" height="16"/></g>` +
        `<path d="M38,64 Q46,54 54,64" stroke="${s.sky[1]}" stroke-width=".7" fill="none" opacity=".45"/>` +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  BIA: {
    city: "Biarritz",
    country: "Frankreich",
    timezone: "Europe/Paris",
    style: {
      sky: ["#0e3550", "#f5b38a"],
      ink: "#061a28",
      far: "#2f6683",
      tag: "Rocher de la Vierge",
    },
    draw: (s) => {
      // Lighthouse on the far headland, the cliff, Eiffel's footbridge, the rock with the Virgin
      let truss = "";
      for (let x = 82; x < 124; x += 6)
        truss += `M${x},58 L${x + 3},64 L${x + 6},58 `;
      return (
        // far headland with the Phare de Biarritz
        `<path fill="${s.far}" d="M0,92 L0,60 Q14,56 32,58 Q48,62 58,72 L64,92Z"/>` +
        `<g fill="${s.far}"><rect x="18" y="26" width="7" height="32"/><rect x="16.5" y="24" width="10" height="2.4"/><rect x="18.5" y="18" width="6" height="6"/><path d="M18,18 Q21.5,13 25,18Z"/></g>` +
        `<circle cx="21.5" cy="21" r="2" fill="${s.sky[1]}" opacity=".9"/>` +
        `<path d="M24,21 L60,15 L60,27Z" fill="${s.sky[1]}" opacity=".18"/>` +
        `<g fill="${s.ink}">` +
        // cliff on the mainland
        `<path d="M0,92 L0,72 Q30,64 56,62 Q70,58 82,58 L84,66 Q78,80 74,92Z"/>` +
        // footbridge: deck and arched truss
        `<rect x="80" y="56" width="46" height="2.4"/>` +
        `<path d="M82,64 Q103,52 124,64 L124,66 Q103,56 82,66Z"/>` +
        // the rock with its tunnel, pedestal and statue
        `<path fill-rule="evenodd" d="M118,92 L121,78 L117,70 L123,62 L126,54 L134,52 L138,46 L150,44 L156,50 L164,52 L168,62 L174,68 L172,78 L178,92Z M138,92 L138,84 Q146,74 154,84 L154,92Z"/>` +
        `<rect x="142" y="38" width="8" height="9"/><rect x="141" y="36.4" width="10" height="1.8"/>` +
        `</g>` +
        `<path d="${truss}" stroke="${s.ink}" stroke-width=".7" fill="none"/>` +
        `<path fill="${s.sky[1]}" d="M146,22 Q143.6,22.4 144,25 L143,36 L149,36 L148,25 Q148.4,22.4 146,22Z"/>` +
        `<circle cx="146" cy="21" r="1.4" fill="${s.sky[1]}"/>` +
        `<path d="M144.5,18.6 Q146,17.4 147.5,18.6" stroke="${s.sky[1]}" stroke-width=".5" fill="none"/>` +
        // sea with surf around the rock
        `<rect x="0" y="92" width="200" height="8" fill="${s.far}"/>` +
        `<path d="M70,92 q4,-3 8,0 q4,-3 8,0 M116,92 q4,-3 8,0 M170,92 q4,-3 8,0 q4,-3 8,0" stroke="${s.sky[1]}" stroke-width="1" fill="none" opacity=".7"/>` +
        `<path d="M6,96 L60,96 M96,98 L190,98" stroke="${s.sky[1]}" stroke-width="1" opacity=".5"/>`
      );
    },
  },

  AJA: {
    city: "Ajaccio",
    country: "Frankreich",
    timezone: "Europe/Paris",
    style: {
      sky: ["#33224e", "#f28c5e"],
      ink: "#180f26",
      far: "#5c4580",
      tag: "Citadelle d'Ajaccio",
    },
    draw: (s) => {
      // Corsican mountains, palms on the quay, the citadel on its point
      let houses = "";
      [
        [0, 70, 12],
        [13, 66, 10],
        [24, 72, 12],
        [62, 68, 10],
        [73, 74, 12],
      ].forEach(([x, y, w]) => {
        houses += `<rect x="${x}" y="${y}" width="${w}" height="${92 - y}"/><path d="M${x - 0.5},${y} L${x + w / 2},${y - 3} L${x + w + 0.5},${y}Z"/>`;
      });
      return (
        `<path fill="${s.far}" d="M0,58 L14,40 L22,46 L40,22 L52,36 L62,30 L78,48 L96,26 L108,38 L124,18 L140,36 L156,28 L172,44 L188,32 L200,40 L200,92 L0,92Z" opacity=".85"/>` +
        `<path fill="#fff" opacity=".4" d="M36,27 L40,22 L44,28 L41,26 L38,29Z M120,23 L124,18 L128,24 L125,22 L122,25Z M93,30 L96,26 L99,31 L96,29Z"/>` +
        `<g fill="${s.ink}">${houses}` +
        // citadel: sloping bastion walls, keep, sentry boxes, flag
        `<path d="M104,92 L110,62 L196,62 L200,92Z"/>` +
        `<path d="M106,62 L106,58 L120,58 L120,62Z M186,62 L186,58 L200,58 L200,62Z"/>` +
        `<rect x="130" y="44" width="38" height="18"/><path d="${crenel(130, 168, 44, 4, 3)}"/>` +
        `<rect x="140" y="30" width="16" height="14"/><path d="${crenel(140, 156, 30, 4, 3)}"/>` +
        `<rect x="108" y="54" width="5" height="5"/><path d="M107,54 Q110.5,49 114,54Z"/>` +
        `<rect x="190" y="54" width="5" height="5"/><path d="M189,54 Q192.5,49 196,54Z"/>` +
        `<rect x="147.4" y="12" width="1.2" height="16"/><path d="M148.6,12 L156,14.5 L148.6,17Z"/></g>` +
        `<g fill="${s.sky[1]}" opacity=".55"><rect x="146" y="35" width="4" height="5"/><rect x="136" y="50" width="2" height="4"/><rect x="160" y="50" width="2" height="4"/>` +
        `<path d="M110,62 L196,62" stroke="${s.sky[1]}" stroke-width=".6"/></g>` +
        lights(s, [
          [4, 76],
          [16, 72],
          [28, 78],
          [66, 74],
          [78, 80],
        ]) +
        palm(s.ink, 40, 36) +
        palm(s.ink, 52, 28) +
        palm(s.ink, 92, 34) +
        water(s, 6, 60, 120, 194) +
        `<path fill="${s.ink}" d="M70,94 L86,94 L83,97 L73,97Z M78,94 L78,84 L83,92Z"/>`
      );
    },
  },
};
