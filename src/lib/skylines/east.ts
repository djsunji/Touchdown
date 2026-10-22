import { alps, palm, spires, type CityStyle, type LibraryCity } from "./shared";

// Hand-drawn skylines: Greece, Cyprus, Turkey, Albania, France, UK, Switzerland

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

// Slender minaret standing on y=base, top of shaft at y=top
function minaret(x: number, top: number, base: number, w = 3) {
  return (
    `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${base - top}"/>` +
    `<rect x="${x - w / 2 - 1.2}" y="${top + (base - top) * 0.28}" width="${w + 2.4}" height="1.8"/>` +
    `<path d="M${x - w / 2},${top} L${x},${top - 11} L${x + w / 2},${top}Z"/>`
  );
}

export const EAST: Record<string, LibraryCity> = {
  ATH: {
    city: "Athen",
    country: "Griechenland",
    timezone: "Europe/Athens",
    style: {
      sky: ["#2a2350", "#f2b880"],
      ink: "#150f26",
      far: "#4a3d6b",
      tag: "Akropolis",
    },
    draw: (s) => {
      // Parthenon on the Acropolis rock, Lycabettus hill behind, city below
      let cols = "";
      for (let i = 0; i < 12; i++)
        cols += `<rect x="${(64 + i * 6.4).toFixed(1)}" y="38" width="2.8" height="20"/>`;
      return (
        `<path fill="${s.far}" d="M0,82 Q40,76 80,80 L136,80 Q156,70 164,52 L168,45 L172,45 L176,52 Q184,68 200,74 L200,100 L0,100Z"/>` +
        `<rect x="167.5" y="40" width="5" height="5" fill="${s.far}"/>` +
        lights(s, [
          [10, 86],
          [24, 84],
          [184, 82],
          [194, 86],
        ]) +
        `<rect x="63" y="38" width="74" height="20" fill="${s.sky[1]}" opacity=".3"/>` +
        `<g fill="${s.ink}"><path d="M0,92 L0,88 L16,86 L30,78 Q36,72 44,70 L50,64 L152,64 L158,70 Q170,74 180,84 L200,88 L200,92Z"/>` +
        `<rect x="60" y="58" width="80" height="3"/><rect x="58" y="61" width="84" height="3"/>` +
        cols +
        `<rect x="61" y="32" width="78" height="6"/><path d="M60,32 L100,21 L140,32Z"/>` +
        `<rect x="144" y="54" width="12" height="10"/><rect x="142" y="52" width="16" height="2.4"/>` +
        `<rect x="40" y="58" width="16" height="6"/><rect x="38" y="56" width="20" height="2.4"/></g>`
      );
    },
  },
  SKG: {
    city: "Thessaloniki",
    country: "Griechenland",
    timezone: "Europe/Athens",
    style: {
      sky: ["#1a3352", "#f0a98a"],
      ink: "#0b1626",
      far: "#35587a",
      tag: "Lefkos Pyrgos",
    },
    draw: (s) => {
      // White Tower on the seafront promenade, the Umbrellas, Olympus across the gulf
      let blocks = "";
      [
        [0, 18],
        [12, 26],
        [26, 20],
        [40, 30],
        [54, 22],
        [66, 16],
        [124, 20],
        [136, 14],
      ].forEach(([x, h]) => {
        blocks += `<rect x="${x}" y="${84 - h}" width="11" height="${h}"/>`;
      });
      let merlons = "";
      for (let x = 86; x <= 111; x += 4.2)
        merlons += `<rect x="${x.toFixed(1)}" y="28" width="2.4" height="3"/>`;
      let umbrellas = "";
      [
        [166, 54],
        [176, 60],
        [186, 50],
      ].forEach(([x, y]) => {
        umbrellas += `<rect x="${x - 0.5}" y="${y}" width="1" height="${84 - y}"/><path d="M${x - 7},${y + 4} Q${x},${y - 4} ${x + 7},${y + 4} Q${x},${y + 1} ${x - 7},${y + 4}Z"/>`;
      });
      return (
        `<path fill="${s.far}" opacity=".6" d="M120,80 L146,68 L162,58 L170,61 L184,54 L200,60 L200,84 L120,84Z"/>` +
        `<g fill="${s.far}">${blocks}</g>` +
        lights(s, [
          [4, 74],
          [16, 66],
          [44, 62],
          [58, 70],
        ]) +
        `<g fill="${s.ink}"><rect x="0" y="84" width="200" height="8"/>` +
        `<path d="M87,86 L89,36 L111,36 L113,86Z"/><rect x="86" y="31" width="28" height="5"/>` +
        merlons +
        `<rect x="94" y="17" width="12" height="14"/><path d="M93,17 L100,10 L107,17Z"/><rect x="99.4" y="3" width="1.2" height="8"/>` +
        umbrellas +
        `</g>` +
        lights(s, [
          [99, 22],
          [99, 44],
          [93, 56],
          [105, 56],
          [99, 68],
        ]) +
        water(s, 8, 70, 120, 190) +
        boat(s.ink, 44)
      );
    },
  },
  HER: {
    city: "Heraklion",
    country: "Griechenland",
    timezone: "Europe/Athens",
    style: {
      sky: ["#0f3446", "#e8b77c"],
      ink: "#071a22",
      far: "#2a5a68",
      tag: "Koules",
    },
    draw: (s) => {
      // Venetian Koules fortress at the end of the harbour mole, Mount Juktas behind
      let merlons = "";
      for (let x = 62; x <= 146; x += 6)
        merlons += `<rect x="${x}" y="46" width="3.5" height="3.5"/>`;
      return (
        `<path fill="${s.far}" d="M0,80 Q30,70 50,72 Q80,56 112,64 Q150,54 176,66 Q190,70 200,70 L200,100 L0,100Z"/>` +
        lights(s, [
          [12, 80],
          [30, 78],
          [180, 76],
        ]) +
        `<g fill="${s.ink}"><rect x="0" y="86" width="200" height="6"/>` +
        `<path d="M54,86 L58,49 L149,49 L152,86Z"/>` +
        merlons +
        `<rect x="68" y="34" width="16" height="15"/><path d="M68,34 h3 v-3 h3 v3 h4 v-3 h3 v3 h3 v2 h-16Z"/>` +
        `<rect x="75.4" y="18" width="1.2" height="13"/><path d="M76.6,18 L84,20.5 L76.6,23Z"/>` +
        `<path d="M146,86 L148,46 Q160,44 166,52 L168,86Z"/>` +
        `<rect x="182" y="68" width="5" height="18"/><path d="M181,68 L184.5,62 L188,68Z"/></g>` +
        `<rect x="183" y="70" width="3" height="3" fill="${s.sky[1]}" opacity=".85"/>` +
        `<path d="M96,86 L96,73 Q103,65 110,73 L110,86Z" fill="${s.far}"/>` +
        lights(s, [
          [120, 60],
          [132, 60],
          [86, 60],
          [75, 40],
        ]) +
        water(s, 6, 50, 100, 176) +
        boat(s.ink, 30)
      );
    },
  },
  LCA: {
    city: "Larnaka",
    country: "Zypern",
    timezone: "Asia/Nicosia",
    style: {
      sky: ["#213a5c", "#f7c48f"],
      ink: "#0e1a2c",
      far: "#3f6487",
      tag: "Finikoudes & Agios Lazaros",
    },
    draw: (s) => {
      // Agios Lazaros church with its stacked bell tower behind the palm promenade
      let blocks = "";
      [
        [0, 14],
        [14, 20],
        [30, 12],
        [46, 18],
        [62, 14],
        [160, 16],
        [174, 22],
        [188, 14],
      ].forEach(([x, h]) => {
        blocks += `<rect x="${x}" y="${86 - h}" width="13" height="${h}"/>`;
      });
      const arch = (x: number, y: number) =>
        `<path d="M${x},${y + 6} L${x},${y + 2} Q${x + 1.5},${y} ${x + 3},${y + 2} L${x + 3},${y + 6}Z" fill="${s.sky[1]}" opacity=".55"/>`;
      return (
        `<g fill="${s.far}">${blocks}</g>` +
        `<g fill="${s.ink}"><rect x="0" y="86" width="200" height="6"/>` +
        `<rect x="118" y="66" width="40" height="20"/><path d="M118,66 L138,58 L158,66Z"/>` +
        `<path d="M124,62 Q128,54 132,62Z M134,60 Q138,50 142,60Z M144,62 Q148,54 152,62Z"/>` +
        `<rect x="102" y="44" width="16" height="42"/><rect x="100" y="42" width="20" height="3"/>` +
        `<rect x="104" y="30" width="12" height="12"/><rect x="103" y="28" width="14" height="2.4"/>` +
        `<path d="M105,28 Q110,17 115,28Z"/><rect x="109.4" y="10" width="1.2" height="9"/><rect x="107.5" y="12.5" width="5" height="1.2"/></g>` +
        arch(103.5, 46) +
        arch(108.5, 46) +
        arch(113.5, 46) +
        arch(106, 32) +
        arch(111, 32) +
        lights(s, [
          [126, 74],
          [137, 74],
          [148, 74],
        ]) +
        palm(s.ink, 8, 30) +
        palm(s.ink, 26, 24) +
        palm(s.ink, 44, 34) +
        palm(s.ink, 62, 26) +
        palm(s.ink, 80, 32) +
        palm(s.ink, 170, 30) +
        palm(s.ink, 188, 24) +
        water(s, 6, 80, 112, 192)
      );
    },
  },
  TIA: {
    city: "Tirana",
    country: "Albanien",
    timezone: "Europe/Tirane",
    style: {
      sky: ["#2d2046", "#e9a07c"],
      ink: "#170f25",
      far: "#584272",
      tag: "Xhamia e Et'hem Beut",
    },
    draw: (s) => {
      // Et'hem Bey mosque and minaret, the clock tower, painted blocks and Mount Dajti
      const paint = ["#d9784f", "#e3b94f", "#6fa3a8", "#b5617a", "#8fb36a"];
      let blocks = "";
      [
        [0, 30, 0],
        [16, 40, 1],
        [30, 24, 2],
        [140, 36, 3],
        [156, 26, 4],
        [170, 44, 0],
        [186, 32, 2],
      ].forEach(([x, h, c], i) => {
        const y = 92 - h;
        blocks +=
          `<rect x="${x}" y="${y}" width="14" height="${h}" fill="${s.far}"/>` +
          `<rect x="${x}" y="${y}" width="14" height="${h}" fill="${paint[c]}" opacity=".45"/>` +
          (i % 2
            ? `<path d="M${x},${y + 8} L${x + 14},${y + 2} L${x + 14},${y + 7} L${x},${y + 13}Z" fill="${paint[(c + 2) % 5]}" opacity=".55"/>`
            : `<rect x="${x + 3}" y="${y + 4}" width="8" height="${Math.min(10, h - 12)}" fill="${paint[(c + 1) % 5]}" opacity=".5"/>`);
      });
      return (
        `<path fill="${s.far}" opacity=".75" d="M0,72 Q40,48 84,58 Q120,40 160,52 Q182,56 200,62 L200,100 L0,100Z"/>` +
        blocks +
        `<g fill="${s.ink}"><rect x="0" y="86" width="200" height="6"/>` +
        `<rect x="54" y="64" width="34" height="22"/><path d="M60,64 Q71,46 82,64Z"/><rect x="70.4" y="46" width="1.2" height="6"/><circle cx="71" cy="45" r="1.3"/>` +
        `<rect x="48" y="70" width="44" height="3"/>` +
        minaret(96, 26, 86, 4.4) +
        `<rect x="114" y="32" width="13" height="54"/><rect x="112" y="27" width="17" height="5"/>` +
        `<path d="M113,27 L113,24 h2 v2 h3 v-2 h2 v2 h3 v-2 h2 v2 h3 v-2 h2 v3Z"/><path d="M115,24 Q120.5,13 126,24Z"/><rect x="119.9" y="9" width="1.2" height="6"/></g>` +
        `<path d="M52,86 L52,78 Q55,74 58,78 L58,86Z M62,86 L62,78 Q65,74 68,78 L68,86Z M74,86 L74,78 Q77,74 80,78 L80,86Z M84,86 L84,78 Q87,74 90,78 L90,86Z" fill="${s.far}"/>` +
        `<circle cx="120.5" cy="38" r="3.4" fill="${s.sky[1]}" opacity=".8"/>` +
        `<path d="M120.5,38 L120.5,35.8 M120.5,38 L122.3,38.8" stroke="${s.ink}" stroke-width=".7"/>` +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },
  IST: {
    city: "Istanbul",
    country: "Türkei",
    timezone: "Europe/Istanbul",
    style: {
      sky: ["#3a1f3d", "#f3a86b"],
      ink: "#1d0e1f",
      far: "#62395b",
      tag: "Ayasofya & Boğaziçi",
    },
    draw: (s) => {
      // Hagia Sophia with four minarets, the Blue Mosque, Bosphorus bridge across the water
      return (
        `<path fill="${s.far}" d="M0,82 Q50,74 100,78 Q150,70 200,76 L200,100 L0,100Z"/>` +
        `<g fill="${s.far}"><rect x="146" y="50" width="3" height="28"/><rect x="186" y="50" width="3" height="28"/><rect x="120" y="70" width="80" height="2"/></g>` +
        `<path d="M120,70 Q134,70 147.5,51 Q167,70 187.5,51 Q194,62 200,64" stroke="${s.far}" stroke-width="1" fill="none"/>` +
        `<g fill="${s.ink}"><path d="M0,92 L0,80 L150,80 Q166,82 178,92Z"/>` +
        `<rect x="48" y="62" width="64" height="18"/>` +
        `<path d="M52,62 Q52,50 65,50 L65,62Z M95,62 L95,50 Q108,50 108,62Z"/>` +
        `<rect x="63" y="47" width="34" height="9"/><path d="M61,48 Q80,24 99,48Z"/><rect x="79.3" y="22" width="1.4" height="8"/>` +
        minaret(42, 32, 80) +
        minaret(50, 36, 80) +
        minaret(110, 36, 80) +
        minaret(118, 32, 80) +
        `<rect x="128" y="68" width="30" height="12"/><path d="M131,68 Q143,52 155,68Z M126,72 Q129,66 132,72Z M154,72 Q157,66 160,72Z"/><rect x="142.4" y="52" width="1.2" height="5"/>` +
        minaret(124, 46, 80, 2.4) +
        minaret(162, 46, 80, 2.4) +
        `</g>` +
        lights(s, [
          [66, 50],
          [71, 50],
          [76, 50],
          [83, 50],
          [88, 50],
          [93, 50],
        ]) +
        water(s, 10, 70, 120, 196) +
        `<path fill="${s.ink}" d="M150,95 L176,95 L172,98 L154,98Z M156,95 L156,91 L168,91 L168,95Z"/>` +
        `<rect x="160" y="88" width="2" height="3" fill="${s.ink}"/>`
      );
    },
  },
  LYS: {
    city: "Lyon",
    country: "Frankreich",
    timezone: "Europe/Paris",
    style: {
      sky: ["#2c1d3b", "#e6967f"],
      ink: "#160e1f",
      far: "#55385f",
      tag: "Basilique de Fourvière",
    },
    draw: (s) => {
      // Fourvière basilica with its four towers and the metal tower on the hill, Vieux Lyon on the Saône
      const tower = (x: number, w: number, top: number) => {
        let m = "";
        for (let i = 0; i < w; i += 2.6)
          m += `<rect x="${(x + i).toFixed(1)}" y="${top - 2.4}" width="1.6" height="2.4"/>`;
        return `<rect x="${x}" y="${top}" width="${w}" height="${52 - top}"/>${m}`;
      };
      let houses = "";
      [
        [98, 16],
        [110, 20],
        [122, 14],
        [134, 22],
        [148, 18],
        [160, 24],
        [174, 16],
        [186, 20],
      ].forEach(([x, h]) => {
        houses += `<rect x="${x}" y="${86 - h}" width="11" height="${h}"/><path d="M${x - 0.5},${86 - h} L${x + 5.5},${82 - h} L${x + 11.5},${86 - h}Z"/>`;
      });
      return (
        `<path fill="${s.far}" d="M0,64 Q60,46 120,58 Q160,52 200,60 L200,100 L0,100Z"/>` +
        `<g fill="${s.ink}"><path d="M0,92 L0,58 Q30,50 56,50 Q90,50 108,64 L108,92Z"/>` +
        `<rect x="34" y="34" width="44" height="18"/><path d="M36,34 L56,26 L76,34Z"/>` +
        tower(30, 8, 22) +
        tower(41, 6, 27) +
        tower(66, 6, 27) +
        tower(74, 8, 22) +
        `<rect x="12" y="36" width="8" height="16"/><path d="M12,36 L16,32 L20,36Z"/>` +
        `<path d="M90,52 L93.4,14 L94.6,14 L98,52 L96,52 L94,30 L92,52Z"/><rect x="91" y="34" width="6" height="1.4"/><rect x="92.6" y="8" width="0.8" height="6"/>` +
        houses +
        `<rect x="0" y="86" width="200" height="6"/></g>` +
        `<circle cx="16" cy="30" r="1.8" fill="#f2c86a"/><rect x="15.2" y="31" width="1.6" height="2" fill="#f2c86a"/>` +
        lights(s, [
          [52, 40],
          [58, 40],
          [102, 74],
          [127, 76],
          [138, 70],
          [165, 68],
          [178, 76],
        ]) +
        water(s, 10, 60, 120, 186) +
        `<path d="M66,92 Q90,84 114,92" stroke="${s.ink}" stroke-width="1.4" fill="none"/>`
      );
    },
  },
  GVA: {
    city: "Genf",
    country: "Schweiz",
    timezone: "Europe/Zurich",
    style: {
      sky: ["#123049", "#a9cfe6"],
      ink: "#091827",
      far: "#3a6487",
      tag: "Jet d'eau",
    },
    draw: (s) => {
      // Jet d'eau rising from the lake, St-Pierre cathedral in the old town, Alps behind
      return (
        alps(s) +
        `<g fill="${s.ink}"><path d="M0,86 L0,72 L64,72 L84,80 L84,86Z"/>` +
        `<rect x="4" y="62" width="12" height="10"/><path d="M3,62 L10,56 L17,62Z"/>` +
        `<rect x="18" y="46" width="10" height="26"/><rect x="40" y="46" width="10" height="26"/>` +
        `<rect x="28" y="56" width="12" height="16"/><path d="M30,56 L34,30 L38,56Z"/>` +
        `<rect x="52" y="62" width="12" height="10"/><path d="M51,62 L58,56 L65,62Z"/>` +
        `<rect x="160" y="70" width="40" height="16"/><rect x="166" y="62" width="10" height="8"/><rect x="182" y="64" width="12" height="6"/>` +
        `<rect x="112" y="84" width="34" height="2"/><rect x="146" y="78" width="2.6" height="8"/></g>` +
        `<rect x="146.3" y="79" width="2" height="2" fill="${s.sky[1]}" opacity=".9"/>` +
        lights(s, [
          [21, 54],
          [43, 54],
          [8, 66],
          [170, 76],
          [188, 76],
        ]) +
        `<rect x="0" y="86" width="200" height="14" fill="${s.ink}" opacity=".55"/>` +
        `<path fill="#fff" opacity=".85" d="M136.4,85 L137.2,12 Q138.4,4 139.8,12 L139.4,85Z"/>` +
        `<path fill="#fff" opacity=".35" d="M139.6,12 Q148,14 153,30 Q155,44 150,60 Q147,42 140,24Z"/>` +
        `<ellipse cx="138.2" cy="85" rx="5" ry="1.6" fill="#fff" opacity=".5"/>` +
        `<path d="M8,92 L60,92 M90,96 L130,96 M150,93 L196,93" stroke="${s.sky[1]}" stroke-width="1" opacity=".5"/>`
      );
    },
  },
  EDI: {
    city: "Edinburgh",
    country: "Grossbritannien",
    timezone: "Europe/London",
    style: {
      sky: ["#1e2a3e", "#b8a9c9"],
      ink: "#0c121d",
      far: "#3d4b66",
      tag: "Edinburgh Castle",
    },
    draw: (s) => {
      // The castle on its volcanic rock, the Gothic Scott Monument, Arthur's Seat behind
      return (
        `<path fill="${s.far}" d="M100,84 Q130,72 150,62 L166,48 L174,52 Q186,62 200,66 L200,100 L100,100Z"/>` +
        `<g fill="${s.far}"><rect x="104" y="72" width="12" height="16"/><rect x="118" y="68" width="10" height="20"/><path d="M118,68 L123,62 L128,68Z"/></g>` +
        `<g fill="${s.ink}"><path d="M0,92 L0,72 Q10,68 16,62 L22,58 L28,60 L32,54 L78,54 L82,60 Q90,68 96,78 L104,88 L200,86 L200,92Z"/>` +
        `<rect x="30" y="40" width="44" height="14"/>` +
        `<path d="M30,40 h3 v-3 h3 v3 h3 v-3 h3 v3 h3 v-3 h3 v3 h2 v2 h-20Z"/>` +
        `<rect x="38" y="28" width="9" height="12"/><path d="M37,28 h2.5 v-2.5 h2.5 v2.5 h2 v-2.5 h2.5 v2.5 h1.5 v2 h-11Z"/>` +
        `<rect x="52" y="34" width="20" height="6"/><path d="M52,34 L56,29 L60,34 L64,29 L68,34Z"/>` +
        `<path d="M70,54 L70,46 Q78,44 82,50 L82,54Z"/>` +
        `<rect x="42.2" y="14" width="1" height="12"/><path d="M43.2,14 L49,16 L43.2,18Z"/>` +
        `<rect x="164" y="70" width="36" height="16"/><path d="M164,70 L172,64 L180,70Z"/>` +
        `<rect x="141" y="64" width="18" height="22"/>` +
        `<path d="M143,64 L145,44 L155,44 L157,64Z M146,44 L147.5,28 L152.5,28 L154,44Z M148,28 L150,4 L152,28Z"/>` +
        `<path d="${spires(141, 159, 18, 66, 10)}${spires(144, 156, 12, 46, 9)}${spires(146, 154, 8, 30, 7)}"/></g>` +
        `<path d="M146,86 L146,74 Q150,68 154,74 L154,86Z" fill="${s.sky[1]}" opacity=".4"/>` +
        `<path d="M148.5,62 L148.5,52 Q150,49 151.5,52 L151.5,62Z" fill="${s.sky[1]}" opacity=".45"/>` +
        lights(s, [
          [34, 46],
          [40, 46],
          [56, 46],
          [62, 46],
          [42, 32],
          [170, 76],
          [186, 76],
        ]) +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },
  LHR: {
    city: "London",
    country: "Grossbritannien",
    timezone: "Europe/London",
    style: {
      sky: ["#1c2440", "#e9a78a"],
      ink: "#0d1121",
      far: "#3c4770",
      tag: "Big Ben & Tower Bridge",
    },
    draw: (s) => {
      // Big Ben and the Houses of Parliament, Tower Bridge on the Thames, the Shard behind
      const bridgeTower = (x: number) =>
        `<rect x="${x}" y="36" width="14" height="56"/>` +
        `<path d="M${x - 1},36 L${x + 1.5},28 L${x + 4},36Z M${x + 10},36 L${x + 12.5},28 L${x + 15},36Z M${x + 3},36 L${x + 7},24 L${x + 11},36Z"/>`;
      const towerArches = (x: number) =>
        `<path d="M${x + 4},60 L${x + 4},52 Q${x + 7},48 ${x + 10},52 L${x + 10},60Z" fill="${s.sky[1]}" opacity=".45"/>`;
      return (
        `<g fill="${s.far}"><path d="M84,92 L94,24 L96,24 L106,92Z"/><rect x="62" y="70" width="14" height="22"/><rect x="104" y="64" width="12" height="28"/>` +
        `<rect x="150" y="62" width="10" height="30"/><path d="M164,68 Q170,56 176,68Z"/></g>` +
        `<g fill="${s.ink}"><rect x="0" y="68" width="62" height="24"/>` +
        `<path d="${spires(4, 60, 6, 68, 6)}"/>` +
        `<rect x="4" y="46" width="12" height="22"/><path d="M4,46 h2 v-3 h2 v3 h4 v-3 h2 v3 h2 v2 h-12Z"/>` +
        `<rect x="36" y="44" width="12" height="48"/><rect x="35" y="30" width="14" height="14"/>` +
        `<rect x="37" y="22" width="10" height="8"/><path d="M36,22 L42,6 L48,22Z"/><rect x="41.5" y="2" width="1" height="5"/>` +
        bridgeTower(118) +
        bridgeTower(164) +
        `<rect x="132" y="40" width="32" height="3"/><rect x="132" y="45" width="32" height="1.6"/>` +
        `<rect x="96" y="72" width="104" height="4"/></g>` +
        `<path d="M96,70 Q108,68 119,44 M132,50 Q148,72 164,50 M177,44 Q188,68 200,70" stroke="${s.ink}" stroke-width="1.4" fill="none"/>` +
        towerArches(118) +
        towerArches(164) +
        `<circle cx="42" cy="37" r="4.6" fill="${s.sky[1]}" opacity=".85"/>` +
        `<path d="M42,37 L42,34 M42,37 L44.2,38" stroke="${s.ink}" stroke-width=".8"/>` +
        lights(s, [
          [10, 54],
          [10, 76],
          [22, 78],
          [28, 76],
          [54, 78],
        ]) +
        water(s, 6, 60, 100, 190)
      );
    },
  },
};
