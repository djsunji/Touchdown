import type { CityStyle, LibraryCity } from "./shared";

// Hand-drawn skylines: Nordic and Baltic cities

const n = (v: number) => v.toFixed(1);

// Water strip from y with two light reflection lines
function water(s: CityStyle, y = 92, a = "M8,95 L70,95 M104,97 L190,97") {
  return (
    `<rect x="0" y="${y}" width="200" height="${100 - y}" fill="${s.far}"/>` +
    `<path d="${a}" stroke="${s.sky[1]}" stroke-width="1" opacity=".55"/>`
  );
}

// Lit windows in a grid of cells: [x, y] list
function windows(s: CityStyle, cells: number[][], w = 1.8, h = 2.4) {
  return cells
    .map(
      ([x, y]) =>
        `<rect x="${n(x)}" y="${n(y)}" width="${w}" height="${h}" fill="${s.sky[1]}" opacity=".6"/>`,
    )
    .join("");
}

// Wooden house with a steep triangular gable facing the water, base at y
function gabled(x: number, w: number, top: number, base: number, k = 0.7) {
  return (
    `<rect x="${n(x)}" y="${top}" width="${n(w)}" height="${base - top}"/>` +
    `<path d="M${n(x - 0.6)},${top} L${n(x + w / 2)},${n(top - w * k)} L${n(x + w + 0.6)},${top}Z"/>`
  );
}

// Tint over a gabled house (same outline, translucent colour)
function gabledTint(
  x: number,
  w: number,
  top: number,
  base: number,
  fill: string,
  k = 0.7,
  op = 0.55,
) {
  return (
    `<path fill="${fill}" opacity="${op}" d="M${n(x + 0.8)},${base} L${n(x + 0.8)},${top} L${n(x + w / 2)},${n(top - w * k + 1.6)} L${n(x + w - 0.8)},${top} L${n(x + w - 0.8)},${base}Z"/>` +
    `<path d="M${n(x + 0.4)},${top} L${n(x + w / 2)},${n(top - w * k + 0.8)} L${n(x + w - 0.4)},${top}" stroke="#f3eadb" stroke-width=".5" fill="none" opacity=".5"/>`
  );
}

// Small crown (Tre Kronor) with its base at y
function crown(x: number, y: number) {
  return `M${n(x - 2)},${y} L${n(x - 2.2)},${y - 2.6} L${n(x - 1)},${y - 1.4} L${x},${y - 3.4} L${n(x + 1)},${y - 1.4} L${n(x + 2.2)},${y - 2.6} L${n(x + 2)},${y}Z `;
}

// Small pinnacles along a line: list of [x, base]
function pinnacles(pts: number[][], h = 4) {
  return (
    `<path d="` +
    pts
      .map(([x, b]) => `M${n(x - 1)},${b} L${x},${b - h} L${n(x + 1)},${b}Z `)
      .join("") +
    `"/>`
  );
}

export const NORDIC: Record<string, LibraryCity> = {
  ARN: {
    city: "Stockholm",
    country: "Schweden",
    timezone: "Europe/Stockholm",
    style: {
      sky: ["#1b2a52", "#f3a96b"],
      ink: "#0c1226",
      far: "#3b4a7a",
      tag: "Stadshuset",
    },
    draw: (s) => {
      // Gamla stan spires on the left, Stadshuset with its tower and three crowns on the water
      let arcade = "";
      for (let x = 112; x < 164; x += 7)
        arcade += `M${x},80 L${x},72 Q${x + 2.5},68 ${x + 5},72 L${x + 5},80Z `;
      return (
        `<path fill="${s.far}" d="M0,66 Q30,58 60,62 Q100,54 140,62 Q170,58 200,62 V100 H0Z" opacity=".8"/>` +
        `<g fill="${s.ink}">` +
        // Gamla stan: houses, Riddarholmskyrkan open spire, Storkyrkan tower
        `<path d="M0,80 V64 l6,-4 l6,4 V60 h10 v20Z M36,80 V62 l5,-5 l5,5 h8 V58 l6,-4 l6,4 v2 h12 l4,-4 l4,4 V80Z"/>` +
        `<rect x="24" y="40" width="10" height="40"/><path d="M23.5,40 L29,10 L34.5,40Z"/>` +
        `<rect x="60" y="36" width="9" height="24"/><path d="M59.5,36 Q64.5,26 69.5,36Z"/><rect x="63.8" y="18" width="1.4" height="12"/>` +
        // Stadshuset: long hall, small west cupola, tall corner tower
        `<rect x="100" y="56" width="98" height="24"/><path d="M98,57 L102,52 L196,52 L200,57Z"/>` +
        `<rect x="112" y="44" width="8" height="10"/><path d="M111,44 Q116,36 121,44Z"/><rect x="115.4" y="32" width="1.2" height="6"/>` +
        `<rect x="166" y="24" width="18" height="56"/><rect x="164" y="21" width="22" height="3.4"/>` +
        `<rect x="169" y="13" width="12" height="8"/>` +
        `<path d="M168,21 L168.5,15 L170,21Z M180,21 L181.5,15 L182,21Z"/>` +
        `<path d="M169,13 L175,8 L181,13Z"/><rect x="174.4" y="5" width="1.2" height="4"/>` +
        `<rect x="0" y="80" width="200" height="4"/></g>` +
        `<path d="${arcade}" fill="${s.far}"/>` +
        `<path fill="#f5c84c" d="${crown(171.6, 6.5)}${crown(175, 5)}${crown(178.4, 6.5)}"/>` +
        `<path d="M171,15 v4 M175,15 v4 M179,15 v4" stroke="${s.sky[1]}" stroke-width="1.4" opacity=".6"/>` +
        `<path d="M24.5,38 L29,14 L33.5,38 M26,30 L32,30 M27,22 L31,22" stroke="${s.far}" stroke-width=".5" fill="none"/>` +
        windows(s, [
          [172, 30],
          [176, 30],
          [172, 40],
          [176, 40],
          [128, 60],
          [140, 60],
          [152, 60],
          [188, 60],
          [8, 68],
          [44, 66],
          [80, 66],
        ]) +
        water(
          s,
          84,
          "M6,90 L70,90 M100,94 L160,94 M166,88 L186,88 M20,97 L90,97",
        ) +
        `<path d="M175,86 L175,99" stroke="${s.sky[1]}" stroke-width="1.6" opacity=".3"/>`
      );
    },
  },

  HEL: {
    city: "Helsinki",
    country: "Finnland",
    timezone: "Europe/Helsinki",
    style: {
      sky: ["#16304f", "#e9b9a0"],
      ink: "#0b1626",
      far: "#33506e",
      tag: "Tuomiokirkko",
    },
    draw: (s) => {
      // White cathedral with green domes on top of the wide Senate Square steps
      const W = "#eef2f0";
      const G = "#5c9c86";
      let steps = "";
      for (let y = 76; y < 92; y += 3) {
        const dx = ((y - 72) / 20) * 16;
        steps += `M${n(56 - dx)},${y} L${n(144 + dx)},${y} `;
      }
      let cols = "";
      for (let x = 83; x <= 117; x += 5) cols += `M${x},50 L${x},72 `;
      let drum = "";
      for (let x = 90; x <= 110; x += 4) drum += `M${x},32 L${x},40 `;
      return (
        `<path fill="${s.far}" d="M0,64 h20 v-6 h26 v14 h108 v-14 h26 v6 h20 V100 H0Z"/>` +
        `<g fill="${s.ink}"><path d="M40,92 L56,72 L144,72 L160,92Z"/>` +
        `<rect x="0" y="70" width="38" height="22"/><rect x="162" y="70" width="38" height="22"/></g>` +
        `<path d="${steps}" stroke="${s.sky[1]}" stroke-width=".6" opacity=".35"/>` +
        // cathedral body, portico, corner towers, drum
        `<g fill="${W}"><rect x="64" y="46" width="72" height="26"/><path d="M78,47 L100,36 L122,47Z"/>` +
        `<rect x="64" y="38" width="11" height="9"/><rect x="125" y="38" width="11" height="9"/>` +
        `<rect x="87" y="30" width="26" height="11"/><rect x="85" y="40" width="30" height="2"/></g>` +
        `<rect x="78" y="46" width="44" height="2" fill="${s.ink}" opacity=".25"/>` +
        `<path d="${cols}" stroke="${s.ink}" stroke-width="1" opacity=".3"/>` +
        `<path d="${drum}" stroke="${s.ink}" stroke-width=".8" opacity=".3"/>` +
        `<rect x="122" y="46" width="14" height="26" fill="${s.ink}" opacity=".12"/>` +
        // green domes and gold crosses
        `<g fill="${G}"><path d="M85.5,31 Q85.5,14 100,13 Q114.5,14 114.5,31Z"/>` +
        `<rect x="97.5" y="7" width="5" height="7"/><path d="M97,7.5 Q100,3.5 103,7.5Z"/>` +
        `<path d="M64,38.5 Q64,30 69.5,29 Q75,30 75,38.5Z M125,38.5 Q125,30 130.5,29 Q136,30 136,38.5Z"/>` +
        `<rect x="68.5" y="26" width="2" height="3.5"/><rect x="129.5" y="26" width="2" height="3.5"/></g>` +
        `<path d="M100,0.8 V4 M98.6,1.9 H101.4 M69.5,22.5 V26 M68.3,23.6 H70.7 M130.5,22.5 V26 M129.3,23.6 H131.7" stroke="#f2c766" stroke-width=".8"/>` +
        `<path d="M92,20 Q96,15 100,15" stroke="#fff" stroke-width=".8" fill="none" opacity=".35"/>` +
        // apostle statues on the pediment
        `<g fill="${s.ink}"><rect x="99.3" y="31.8" width="1.4" height="4"/><rect x="77.3" y="43" width="1.4" height="4"/><rect x="121.3" y="43" width="1.4" height="4"/></g>` +
        `<g fill="${s.ink}" opacity=".55"><path d="M68,62 v-5 q1.5,-2 3,0 v5Z M129,62 v-5 q1.5,-2 3,0 v5Z M68,52 v-4 q1.5,-2 3,0 v4Z M129,52 v-4 q1.5,-2 3,0 v4Z"/></g>` +
        windows(s, [
          [6, 76],
          [16, 80],
          [28, 76],
          [168, 76],
          [180, 80],
          [190, 76],
        ]) +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  BGO: {
    city: "Bergen",
    country: "Norwegen",
    timezone: "Europe/Oslo",
    style: {
      sky: ["#22314a", "#e0a99c"],
      ink: "#0e1520",
      far: "#3c4c66",
      tag: "Bryggen",
    },
    draw: (s) => {
      // Fløyen rising behind the row of colourful Bryggen wharf houses
      const row: [number, number, number][] = [
        [-2, 16, 52],
        [14, 15, 48],
        [29, 17, 54],
        [46, 14, 50],
        [60, 16, 46],
        [76, 15, 52],
        [91, 17, 48],
        [108, 14, 54],
        [122, 16, 50],
        [138, 15, 46],
        [153, 17, 52],
        [170, 14, 48],
        [184, 18, 54],
      ];
      const tints = ["#b0432e", "#d6a640", "#e6dcc8", "#8a2e24", "#d7b552"];
      let houses = "";
      let tint = "";
      const lit: number[][] = [];
      row.forEach(([x, w, t], i) => {
        houses += gabled(x, w, t, 80, 0.75);
        tint += gabledTint(x, w, t, 80, tints[i % 5], 0.75);
        lit.push([x + w / 2 - 0.9, t - 6]);
        if (i % 2) lit.push([x + 3, t + 8], [x + w - 5, t + 8]);
        else lit.push([x + w / 2 - 0.9, t + 14]);
      });
      const lights = [
        [14, 50],
        [30, 42],
        [44, 36],
        [58, 33],
        [72, 30],
        [88, 26],
        [120, 32],
        [140, 40],
        [160, 44],
        [178, 46],
        [52, 44],
        [104, 34],
      ]
        .map(
          ([x, y]) =>
            `<circle cx="${x}" cy="${y}" r=".7" fill="${s.sky[1]}" opacity=".8"/>`,
        )
        .join("");
      return (
        `<path fill="${s.far}" d="M0,56 Q24,34 60,26 Q86,18 104,20 Q124,22 146,34 Q172,44 200,44 V100 H0Z"/>` +
        `<path d="M0,64 Q40,54 80,58 Q130,62 200,54 V100 H0Z" fill="${s.ink}" opacity=".35"/>` +
        lights +
        // Fløibanen funicular line up to the top station
        `<path d="M62,56 L100,22" stroke="${s.sky[1]}" stroke-width=".6" stroke-dasharray="1.5 1.5" opacity=".6"/>` +
        `<rect x="97" y="18" width="7" height="4" fill="${s.ink}"/>` +
        `<g fill="${s.ink}">${houses}<rect x="0" y="80" width="200" height="4"/></g>` +
        tint +
        windows(s, lit, 1.8, 2.4) +
        water(s, 84, "M6,90 L60,90 M100,94 L194,94 M30,97 L90,97") +
        `<path fill="${s.ink}" d="M126,88 L162,88 L158,92 L130,92Z M136,88 L136,84 L150,84 L150,88Z"/>`
      );
    },
  },

  TRD: {
    city: "Trondheim",
    country: "Norwegen",
    timezone: "Europe/Oslo",
    style: {
      sky: ["#1a2a40", "#efb27a"],
      ink: "#0d1420",
      far: "#36506a",
      tag: "Nidarosdomen",
    },
    draw: (s) => {
      // Nidarosdomen on the bank, colourful wharf warehouses on stilts along the Nidelva
      const row: [number, number, number][] = [
        [-2, 16, 54],
        [14, 18, 48],
        [32, 15, 56],
        [47, 17, 50],
        [64, 15, 54],
        [79, 18, 47],
        [97, 14, 55],
      ];
      const tints = ["#b8402e", "#e2c25a", "#e9e2d2", "#c9772f", "#5f8a5a"];
      let houses = "";
      let tint = "";
      let stilts = "";
      const lit: number[][] = [];
      row.forEach(([x, w, t], i) => {
        houses += gabled(x, w, t, 74, 0.55);
        tint += gabledTint(x, w, t, 74, tints[i % 5], 0.55);
        for (let sx = x + 1; sx < x + w; sx += 4)
          stilts += `<rect x="${n(sx)}" y="74" width="1.2" height="16"/>`;
        lit.push([x + w / 2 - 0.9, t - 4], [x + 3, t + 8], [x + w - 5, t + 8]);
      });
      let niches = "";
      for (let x = 119; x < 149; x += 3) niches += `M${x},58 L${x},64 `;
      return (
        `<path fill="${s.far}" d="M0,60 Q40,50 90,54 Q140,46 200,52 V100 H0Z" opacity=".8"/>` +
        `<g fill="${s.ink}">` +
        // cathedral: west front with twin towers, nave, crossing tower and spire
        `<rect x="112" y="40" width="40" height="40"/>` +
        `<rect x="112" y="28" width="9" height="52"/><rect x="143" y="28" width="9" height="52"/>` +
        `<path d="M111.5,28 L116.5,16 L121.5,28Z M142.5,28 L147.5,16 L152.5,28Z M121,40 L132,28 L143,40Z"/>` +
        `<rect x="152" y="50" width="48" height="30"/><path d="M152,50 L155,42 L200,42 L200,50Z"/>` +
        `<rect x="166" y="28" width="12" height="16"/><path d="M165.5,28 L172,4 L178.5,28Z"/>` +
        `<rect x="104" y="80" width="96" height="12"/>` +
        houses +
        stilts +
        `</g>` +
        `<path d="M165.5,28 L172,4 L178.5,28Z" fill="#5b9a84" opacity=".55"/>` +
        `<path d="M111.5,28 L116.5,16 L121.5,28Z M142.5,28 L147.5,16 L152.5,28Z" fill="#5b9a84" opacity=".4"/>` +
        `<circle cx="132" cy="48" r="5" fill="${s.sky[1]}" opacity=".6"/>` +
        `<path d="M127,48 H137 M132,43 V53 M128.5,44.5 L135.5,51.5 M135.5,44.5 L128.5,51.5" stroke="${s.ink}" stroke-width=".6"/>` +
        `<path d="${niches}" stroke="${s.sky[1]}" stroke-width=".9" opacity=".35"/>` +
        `<path d="M170,32 v6 M174,32 v6" stroke="${s.sky[1]}" stroke-width="1.2" opacity=".55"/>` +
        tint +
        windows(s, lit, 1.6, 2.2) +
        water(s, 84, "M4,88 L100,88 M10,93 L80,93 M110,96 L194,96") +
        `<g fill="${s.ink}">${stilts}</g>` +
        `<rect x="104" y="84" width="96" height="8" fill="${s.ink}"/>`
      );
    },
  },

  KEF: {
    city: "Reykjavík",
    country: "Island",
    timezone: "Atlantic/Reykjavik",
    style: {
      sky: ["#1e2147", "#e8a6b8"],
      ink: "#0e0f24",
      far: "#3d4170",
      tag: "Hallgrímskirkja",
    },
    draw: (s) => {
      // Hallgrímskirkja with its stepped basalt-column wings, Harpa on the harbour, Esja behind
      let wings = "";
      for (let i = 0; i < 8; i++) {
        const top = 26 + i * 6;
        wings += `<rect x="${n(63.6 - (i + 1) * 3.4)}" y="${top}" width="3" height="${92 - top}"/>`;
        wings += `<rect x="${n(76.8 + i * 3.4)}" y="${top}" width="3" height="${92 - top}"/>`;
      }
      let glass = "";
      for (let x = 124; x < 200; x += 6)
        glass += `M${x},92 L${x + 10},52 M${x},92 L${x - 10},52 `;
      return (
        `<path fill="${s.far}" d="M0,62 Q16,52 40,50 L120,46 Q150,44 168,52 Q186,58 200,56 V100 H0Z"/>` +
        `<path d="M50,52 L58,50 M88,49 L100,48 M136,47 L146,48" stroke="#fff" stroke-width="1" opacity=".3"/>` +
        `<g fill="${s.ink}">` +
        // central tower and spire
        `<rect x="64" y="20" width="12" height="72"/><path d="M63.6,20.5 L70,3 L76.4,20.5Z"/>` +
        wings +
        // Harpa
        `<path d="M118,92 L118,62 L140,50 L166,56 L198,44 L198,92Z"/>` +
        // houses with pitched roofs
        `<path d="M0,92 V74 l6,-5 l6,5 v-2 l6,-5 l6,5 V92Z M94,92 V76 l6,-5 l6,5 v-2 l5,-4 l5,4 V92Z"/></g>` +
        `<circle cx="70" cy="27" r="2.2" fill="${s.sky[1]}" opacity=".75"/>` +
        `<path d="M68,34 v6 M72,34 v6" stroke="${s.sky[1]}" stroke-width="1.1" opacity=".5"/>` +
        `<path d="M66,92 V84 Q70,78 74,84 V92Z" fill="${s.sky[1]}" opacity=".35"/>` +
        `<clipPath id="kef-harpa"><path d="M118,92 L118,62 L140,50 L166,56 L198,44 L198,92Z"/></clipPath>` +
        `<path clip-path="url(#kef-harpa)" d="${glass}" stroke="${s.sky[1]}" stroke-width=".5" opacity=".35"/>` +
        `<g opacity=".7"><rect x="130" y="62" width="4" height="4" fill="#7fd1e8"/><rect x="152" y="66" width="4" height="4" fill="#e08ab8"/><rect x="176" y="56" width="4" height="4" fill="#7fd1e8"/><rect x="186" y="66" width="4" height="4" fill="#f2c766"/><rect x="142" y="58" width="4" height="4" fill="#9fe0b0"/></g>` +
        windows(s, [
          [4, 80],
          [16, 78],
          [98, 82],
          [110, 80],
        ]) +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  RIX: {
    city: "Riga",
    country: "Lettland",
    timezone: "Europe/Riga",
    style: {
      sky: ["#2a2142", "#eab07e"],
      ink: "#130f22",
      far: "#4a4270",
      tag: "Pēterbaznīca",
    },
    draw: (s) => {
      // St. Peter's tiered baroque spire, House of the Blackheads with its stepped gable
      const gable =
        "M104,52 L104,46 L109,46 L109,40 L114,40 L114,34 L119,34 L119,28 L122,28 L122,22 L130,22 L130,28 L133,28 L133,34 L138,34 L138,40 L143,40 L143,46 L148,46 L148,52Z";
      const lit: number[][] = [];
      for (let y = 56; y < 72; y += 8)
        for (let x = 108; x < 146; x += 6) lit.push([x, y]);
      lit.push([116, 44], [134, 44], [151, 54], [159, 54]);
      return (
        `<g fill="${s.far}"><path d="M0,70 h14 V60 h60 v6 h20 v-6 h80 v4 h26 V100 H0Z"/>` +
        // Dome cathedral and St. Jacob's in the distance
        `<rect x="164" y="34" width="10" height="30"/><path d="M163,34 Q169,24 175,34Z"/><rect x="168.4" y="18" width="1.2" height="10"/>` +
        `<rect x="186" y="40" width="7" height="24"/><path d="M185.5,40 L189.5,18 L193.5,40Z"/></g>` +
        `<g fill="${s.ink}">` +
        // St. Peter's: nave, square tower, two galleried tiers, needle spire
        `<rect x="14" y="58" width="32" height="34"/><path d="M12,59 L20,48 L46,48 L46,59Z"/>` +
        `<rect x="44" y="44" width="16" height="48"/><rect x="43" y="42" width="18" height="3"/>` +
        `<rect x="46.5" y="30" width="11" height="12"/><rect x="45.5" y="28.5" width="13" height="2"/>` +
        `<path d="M46.5,28.5 Q52,22 57.5,28.5Z"/>` +
        `<rect x="49.5" y="17" width="5" height="8"/><rect x="48.5" y="15.6" width="7" height="1.6"/>` +
        `<path d="M49.5,15.6 Q52,12 54.5,15.6Z"/><path d="M51,13 L52,2 L53,13Z"/>` +
        `<path d="M52,2.4 L54.2,1.6 L53.4,3.2Z"/>` +
        // House of the Blackheads and Schwab House
        `<rect x="104" y="52" width="44" height="40"/><path d="${gable}"/>` +
        pinnacles([
          [104, 46],
          [109, 40],
          [114, 34],
          [119, 28],
          [133, 28],
          [138, 34],
          [143, 40],
          [148, 46],
        ]) +
        `<rect x="125.4" y="12" width="1.2" height="10"/><circle cx="126" cy="11" r="1.8"/>` +
        `<rect x="148" y="50" width="18" height="42"/><path d="M148,50 V44 h3 v-5 h3 v-5 h6 v5 h3 v5 h3 v6Z"/>` +
        `<rect x="76" y="66" width="28" height="26"/><path d="M75,66 L90,56 L105,66Z"/>` +
        `<rect x="166" y="64" width="34" height="28"/></g>` +
        `<circle cx="126" cy="34" r="3" fill="${s.sky[1]}" opacity=".75"/>` +
        `<path d="M126,34 L126,32 M126,34 L127.5,34.6" stroke="${s.ink}" stroke-width=".5"/>` +
        `<circle cx="52" cy="52" r="2.4" fill="${s.sky[1]}" opacity=".7"/>` +
        `<path d="M50,34 v5 M54,34 v5" stroke="${s.sky[1]}" stroke-width="1.1" opacity=".5"/>` +
        `<path d="M104,52 H148 M104,62 H148" stroke="${s.sky[1]}" stroke-width=".5" opacity=".35"/>` +
        windows(s, lit, 1.6, 3) +
        windows(s, [
          [20, 66],
          [30, 66],
          [84, 72],
          [94, 72],
          [174, 70],
          [188, 70],
        ]) +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  TLL: {
    city: "Tallinn",
    country: "Estland",
    timezone: "Europe/Tallinn",
    style: {
      sky: ["#1b2d45", "#f0b68e"],
      ink: "#0c1522",
      far: "#38506b",
      tag: "Oleviste & Toompea",
    },
    draw: (s) => {
      // Toompea hill with Tall Hermann, the town wall with round towers, Oleviste's needle spire
      const red = "#a8483a";
      const round = (x: number, top: number, r = 5.5) =>
        `<rect x="${x - r}" y="${top}" width="${r * 2}" height="${92 - top}"/>` +
        `<path d="M${x - r - 1},${top} L${x},${top - 15} L${x + r + 1},${top}Z"/>`;
      const cone = (x: number, top: number, r = 5.5) =>
        `M${x - r},${top - 0.6} L${x},${top - 14} L${x + r},${top - 0.6}Z `;
      let houses = "";
      [
        [90, 10, 58],
        [100, 9, 56],
        [128, 10, 58],
        [138, 10, 55],
        [168, 9, 57],
        [177, 10, 59],
      ].forEach(([x, w, t]) => {
        houses += gabled(x, w, t, 70, 0.8);
      });
      return (
        `<path fill="${s.far}" d="M0,66 Q60,56 120,60 Q170,56 200,60 V100 H0Z" opacity=".8"/>` +
        `<g fill="${s.ink}">` +
        // Toompea: hill, castle wall, Tall Hermann, Toomkirik
        `<path d="M0,92 V56 Q36,50 72,56 Q80,70 82,92Z"/>` +
        `<rect x="0" y="48" width="70" height="9"/>` +
        pinnacles(
          [4, 10, 16, 28, 34, 40, 58, 64].map((x) => [x, 48]),
          2,
        ) +
        `<rect x="12" y="24" width="11" height="26"/><rect x="11" y="22" width="13" height="3"/>` +
        `<path d="M11,22 v-2.5 h2 v2 h2 v-2 h2 v2 h2 v-2 h2 v2 h2 v2.5Z"/><rect x="17" y="6" width="1" height="14"/>` +
        `<rect x="44" y="34" width="8" height="16"/><path d="M43.5,34 Q48,26 52.5,34Z"/><path d="M47.3,30 L48,14 L48.7,30Z"/>` +
        // lower town: houses, town hall, Oleviste, wall with round towers
        houses +
        `<rect x="114" y="36" width="5" height="32"/><path d="M113.5,36 L116.5,14 L119.5,36Z"/>` +
        `<rect x="155" y="38" width="10" height="34"/><rect x="154" y="36" width="12" height="3"/>` +
        `<path d="M154.5,36 L157,30 L163,30 L165.5,36Z"/><path d="M157,30 L160,2 L163,30Z"/>` +
        `<rect x="80" y="68" width="120" height="24"/>` +
        pinnacles(
          [84, 104, 112, 120, 134, 142, 150, 172, 180, 188].map((x) => [x, 68]),
          2,
        ) +
        round(94, 52) +
        round(126, 50, 6.5) +
        round(160, 54) +
        round(194, 52) +
        `</g>` +
        `<path fill="${red}" opacity=".5" d="${cone(94, 52)}${cone(126, 50, 6.5)}${cone(160, 54)}${cone(194, 52)}"/>` +
        `<path fill="#e8eae6" opacity=".9" d="M17.5,7 L23,9 L17.5,11Z"/>` +
        `<path fill="#2d6fc2" d="M17.5,7 L23,7.7 L23,8.4 L17.5,8.2Z"/>` +
        windows(s, [
          [14.5, 30],
          [19, 30],
          [92, 60],
          [125, 58],
          [159, 46],
          [102, 62],
          [140, 62],
          [170, 62],
          [24, 60],
          [50, 62],
        ]) +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  VNO: {
    city: "Vilnius",
    country: "Litauen",
    timezone: "Europe/Vilnius",
    style: {
      sky: ["#2b2347", "#f0c27f"],
      ink: "#140f22",
      far: "#4b4470",
      tag: "Gedimino pilis",
    },
    draw: (s) => {
      // Gediminas tower on its wooded hill, the white cathedral and its free-standing bell tower
      const trees = [
        [6, 62, 4],
        [14, 56, 4.5],
        [64, 54, 4],
        [72, 60, 4.5],
        [80, 68, 5],
        [24, 52, 3.5],
      ]
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`)
        .join("");
      let cols = "";
      for (let x = 109; x <= 145; x += 6) cols += `M${x},54 L${x},74 `;
      return (
        `<path fill="${s.far}" d="M90,70 h10 v-8 h56 v-4 h8 l4,-8 l4,8 h28 V100 H90Z M178,58 L180,40 L182,58Z"/>` +
        `<g fill="${s.ink}">` +
        // hill and castle tower with flag
        `<path d="M0,92 V60 Q18,48 38,46 Q58,44 74,52 Q90,62 96,92Z"/>` +
        trees +
        `<path d="M36,48 L37,26 L53,26 L54,48Z"/><rect x="35" y="22" width="20" height="4"/>` +
        pinnacles(
          [36, 40, 44, 48, 52, 55].map((x) => [x, 22]),
          2,
        ) +
        `<rect x="44.6" y="6" width="1" height="16"/><rect x="30" y="44" width="30" height="4"/>` +
        // cathedral
        `<rect x="104" y="52" width="46" height="40"/><path d="M101,53 L127,38 L153,53Z"/>` +
        `<rect x="150" y="60" width="10" height="32"/><rect x="94" y="62" width="10" height="30"/>` +
        `<path d="M126,38 v-5 h2 v5Z M103,47 v-5 h2 v5Z M149,47 v-5 h2 v5Z"/>` +
        `<circle cx="127" cy="32" r="1.2"/><circle cx="104" cy="41" r="1.1"/><circle cx="150" cy="41" r="1.1"/>` +
        // bell tower
        `<rect x="164" y="50" width="16" height="42"/><rect x="166" y="36" width="12" height="14"/>` +
        `<rect x="167.5" y="26" width="9" height="10"/><path d="M167.5,26.5 Q172,18 176.5,26.5Z"/>` +
        `<rect x="171.4" y="10" width="1.2" height="12"/><path d="M169.6,13 h4.8 v1 h-4.8Z"/>` +
        `<rect x="0" y="88" width="200" height="4"/></g>` +
        `<path fill="#f6c343" d="M45.6,6 h6 v1.4 h-6Z"/><path fill="#2a8a4a" d="M45.6,7.4 h6 v1.4 h-6Z"/><path fill="#c8323c" d="M45.6,8.8 h6 v1.4 h-6Z"/>` +
        `<path d="${cols}" stroke="${s.sky[1]}" stroke-width="1.2" opacity=".35"/>` +
        `<path d="M108,53 L127,42 L146,53" stroke="${s.sky[1]}" stroke-width=".6" fill="none" opacity=".45"/>` +
        `<circle cx="172" cy="31" r="2.2" fill="${s.sky[1]}" opacity=".75"/>` +
        `<path d="M170,40 v6 M174,40 v6 M169,56 v6 M175,56 v6" stroke="${s.sky[1]}" stroke-width="1.2" opacity=".5"/>` +
        `<path d="M42,32 v5 M48,32 v5" stroke="${s.sky[1]}" stroke-width="1.2" opacity=".6"/>` +
        windows(s, [
          [97, 70],
          [153, 68],
          [124, 78],
        ]) +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  TOS: {
    city: "Tromsø",
    country: "Norwegen",
    timezone: "Europe/Oslo",
    style: {
      sky: ["#06182c", "#4f9a98"],
      ink: "#040c16",
      far: "#1d3c50",
      tag: "Ishavskatedralen",
    },
    draw: (s) => {
      // Northern lights over the mountains, Tromsø bridge and the Arctic Cathedral's stacked triangles
      const stars = [
        [12, 8],
        [34, 4],
        [58, 12],
        [92, 5],
        [120, 14],
        [146, 6],
        [188, 10],
        [8, 24],
      ]
        .map(
          ([x, y]) =>
            `<circle cx="${x}" cy="${y}" r=".5" fill="#fff" opacity=".7"/>`,
        )
        .join("");
      let piers = "";
      for (const x of [22, 44, 66, 88, 108, 124])
        piers += `<rect x="${x - 1}" y="${n(deckY(x) + 1)}" width="2" height="${n(92 - deckY(x) - 1)}"/>`;
      let lamps = "";
      for (let x = 10; x < 134; x += 12)
        lamps += `<circle cx="${x}" cy="${n(deckY(x) - 2.4)}" r=".7" fill="#f6d58a" opacity=".85"/>`;
      // Arctic Cathedral: triangles stepping down towards the back, white panels with dark gaps
      let tri = "";
      for (let i = 4; i >= 0; i--) {
        const ax = 162 + i * 7;
        const ay = 28 + i * 8;
        tri += `<path d="M${140 + i * 9},84 L${ax},${ay} L${Math.min(200, 190 + i * 4)},84Z" fill="${i ? "#c9d7df" : "#eef4f6"}" opacity="${1 - i * 0.08}" stroke="${s.ink}" stroke-width=".9"/>`;
      }
      let mull = "";
      for (let x = 152; x <= 172; x += 4)
        mull += `M${x},84 L${x},${n(36 + Math.abs(x - 162) * 2.2)} `;
      return (
        stars +
        `<g fill="none" stroke-linecap="round">` +
        `<path d="M-4,30 Q30,6 64,20 Q100,34 132,12 Q160,-2 204,18" stroke="#6ef0a8" stroke-width="9" opacity=".18"/>` +
        `<path d="M-4,30 Q30,6 64,20 Q100,34 132,12 Q160,-2 204,18" stroke="#9cf7c4" stroke-width="2" opacity=".5"/>` +
        `<path d="M10,42 Q46,22 84,32 Q120,42 150,26 Q176,14 204,28" stroke="#6ef0a8" stroke-width="6" opacity=".16"/>` +
        `<path d="M40,16 Q80,0 120,8" stroke="#b48cff" stroke-width="6" opacity=".14"/></g>` +
        `<path fill="${s.far}" d="M0,62 L18,44 L32,52 L56,32 L78,48 L102,38 L126,54 L150,40 L172,30 L200,46 V100 H0Z"/>` +
        `<path fill="#fff" opacity=".45" d="M50,38 L56,32 L62,38 L58,37 L54,39Z M166,35 L172,30 L178,35 L174,34 L170,36Z M98,41 L102,38 L106,41 L102,40Z M14,48 L18,44 L22,47 L18,46Z"/>` +
        `<g fill="${s.ink}">${piers}<path d="M0,${n(deckY(0))} ${deckPath()} L134,${n(deckY(134) + 2.4)} ${deckPath(true)}Z"/>` +
        `<rect x="132" y="84" width="68" height="8"/></g>` +
        lamps +
        tri +
        `<path d="M150,84 L162,34 L174,84Z" fill="#f3d79a" opacity=".85"/>` +
        `<path d="${mull}M150,60 H174" stroke="${s.ink}" stroke-width=".6"/>` +
        `<path d="M162,44 V56 M158.5,48 H165.5" stroke="${s.ink}" stroke-width="1.4"/>` +
        `<rect x="172.6" y="74" width="1" height="10" fill="${s.ink}"/>` +
        water(s, 92, "M6,95 L60,95 M90,97 L190,97 M150,94 L174,94")
      );
    },
  },

  AAR: {
    city: "Aarhus",
    country: "Dänemark",
    timezone: "Europe/Copenhagen",
    style: {
      sky: ["#191f3e", "#d6b8dc"],
      ink: "#0b0e1f",
      far: "#363d6c",
      tag: "ARoS",
    },
    draw: (s) => {
      // ARoS cube with the circular rainbow panorama on its roof, Domkirken spire on the left
      const cols = [
        "#e8463c",
        "#f28c38",
        "#f5d547",
        "#4dbd6b",
        "#3d8de0",
        "#5a5ad6",
        "#a35bd0",
      ];
      const cx = 112;
      const cy = 38;
      const rx = 34;
      const ry = 7;
      const N = 42;
      let back = "";
      let front = "";
      for (let i = 0; i < N; i++) {
        const a0 = (i / N) * Math.PI * 2;
        const a1 = ((i + 1) / N) * Math.PI * 2;
        const seg = `<path d="M${n(cx + rx * Math.cos(a0))},${n(cy + ry * Math.sin(a0))} L${n(cx + rx * Math.cos(a1))},${n(cy + ry * Math.sin(a1))}" stroke="${cols[Math.floor((i * 7) / N)]}"/>`;
        if (Math.sin((a0 + a1) / 2) < 0) back += seg;
        else front += seg;
      }
      let posts = "";
      for (let i = 1; i < 8; i++) {
        const x = cx - rx * Math.cos((i / 8) * Math.PI);
        posts += `<rect x="${n(x - 0.5)}" y="${n(cy + ry * Math.sin((i / 8) * Math.PI) + 2)}" width="1" height="${n(48 - cy - ry * Math.sin((i / 8) * Math.PI) - 2)}"/>`;
      }
      return (
        `<path fill="${s.far}" d="M0,70 h8 v-8 h40 v6 h20 V100 H0Z M156,70 l8,-14 l6,8 l8,-18 l8,14 l6,-6 l8,10 V100 h-44Z"/>` +
        `<g fill="none" stroke-width="3.6" opacity=".55" stroke-linecap="round">${back}</g>` +
        `<g fill="${s.ink}">` +
        // Domkirken
        `<rect x="0" y="60" width="22" height="32"/><path d="M-2,61 L4,52 L22,52 L22,61Z"/>` +
        `<rect x="22" y="36" width="12" height="56"/><path d="M21.5,36 L28,6 L34.5,36Z"/>` +
        // ARoS cube and its roof pavilion
        `<rect x="70" y="48" width="84" height="44"/><rect x="68" y="46" width="88" height="3"/>` +
        posts +
        `<rect x="34" y="72" width="36" height="20"/><rect x="154" y="70" width="46" height="22"/></g>` +
        `<path d="M21.5,36 L28,6 L34.5,36Z" fill="#5b9a84" opacity=".5"/>` +
        `<g fill="none" stroke-width="5" stroke-linecap="round">${front}</g>` +
        `<path d="M${cx - rx + 4},${cy + 5} Q${cx},${cy + ry + 4} ${cx + rx - 4},${cy + 5}" stroke="#fff" stroke-width=".6" fill="none" opacity=".45"/>` +
        `<path d="M70,60 H154 M70,74 H154" stroke="${s.sky[1]}" stroke-width=".5" opacity=".3"/>` +
        `<path d="M26,42 v6 M30,42 v6" stroke="${s.sky[1]}" stroke-width="1.2" opacity=".55"/>` +
        windows(s, [
          [80, 52],
          [96, 64],
          [120, 52],
          [140, 64],
          [40, 76],
          [58, 80],
          [162, 76],
          [182, 78],
        ]) +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },
};

// Tromsø bridge deck: rises from the island to a high middle, then drops to the mainland
function deckY(x: number) {
  const t = (x - 70) / 70;
  return 58 + 22 * t * t + (x > 70 ? 4 * t : 0);
}

function deckPath(under = false) {
  const xs: number[] = [];
  for (let x = 0; x <= 134; x += 6) xs.push(x);
  if (under) xs.reverse();
  return xs.map((x) => `L${x},${n(deckY(x) + (under ? 2.4 : 0))}`).join(" ");
}
