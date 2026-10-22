import type { CityStyle, LibraryCity } from "./shared";

// Hand-drawn skylines: Central and Northern Europe

const n = (v: number) => v.toFixed(1);

// Water strip below the ground line with two light reflection lines
function water(s: CityStyle, a = "M8,95 L70,95 M104,97 L190,97") {
  return (
    `<rect x="0" y="92" width="200" height="8" fill="${s.far}"/>` +
    `<path d="${a}" stroke="${s.sky[1]}" stroke-width="1" opacity=".55"/>`
  );
}

// Narrow canal house with a gable: 0 neck, 1 step, 2 bell, 3 spout (triangle)
function gableHouse(
  x: number,
  w: number,
  top: number,
  kind: number,
  base = 92,
) {
  const m = x + w / 2;
  let roof = "";
  if (kind === 0)
    roof = `M${x},${top} L${x + 2},${top - 3} L${n(m - 2.5)},${top - 3} L${n(m - 2.5)},${top - 9} L${n(m + 2.5)},${top - 9} L${n(m + 2.5)},${top - 3} L${x + w - 2},${top - 3} L${x + w},${top}Z`;
  else if (kind === 1) {
    const st = w / 6;
    roof = `M${x},${top} v-3 h${n(st)} v-3 h${n(st)} v-3 h${n(st * 2)} v3 h${n(st)} v3 h${n(st)} v3Z`;
  } else if (kind === 2)
    roof = `M${x},${top} Q${x + 1},${top - 6} ${n(m - 2)},${top - 7} Q${n(m)},${top - 12} ${n(m + 2)},${top - 7} Q${x + w - 1},${top - 6} ${x + w},${top}Z`;
  else roof = `M${x - 0.5},${top} L${n(m)},${top - 8} L${x + w + 0.5},${top}Z`;
  return `<rect x="${x}" y="${top}" width="${w}" height="${base - top}"/><path d="${roof}"/>`;
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

// The Atomium: a cube standing on a corner, projected from slightly off-axis
function atomium(cx: number, cy: number, size: number) {
  const corners: number[][] = [];
  for (const a of [-1, 1])
    for (const b of [-1, 1]) for (const c of [-1, 1]) corners.push([a, b, c]);
  // rotate so (1,1,1) points up, then turn around the vertical axis
  const up = [1, 1, 1].map((v) => v / Math.sqrt(3));
  const e1 = [1, -1, 0].map((v) => v / Math.sqrt(2));
  const e2 = [1, 1, -2].map((v) => v / Math.sqrt(6));
  const phi = 0.32;
  const dot = (p: number[], q: number[]) =>
    p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
  const proj = (p: number[]) => {
    const u = dot(p, e1);
    const v = dot(p, e2);
    return [
      cx + size * (u * Math.cos(phi) + v * Math.sin(phi)),
      cy - size * dot(p, up),
    ];
  };
  const pts = corners.map(proj);
  let tubes = "";
  for (let i = 0; i < 8; i++) {
    for (let j = i + 1; j < 8; j++) {
      const diff = corners[i].filter((v, k) => v !== corners[j][k]).length;
      if (diff === 1)
        tubes += `M${n(pts[i][0])},${n(pts[i][1])} L${n(pts[j][0])},${n(pts[j][1])} `;
    }
    tubes += `M${cx},${cy} L${n(pts[i][0])},${n(pts[i][1])} `;
  }
  const balls = [...pts, [cx, cy]]
    .map(([x, y]) => `<circle cx="${n(x)}" cy="${n(y)}" r="6"/>`)
    .join("");
  return { tubes, balls, pts };
}

export const CENTRAL: Record<string, LibraryCity> = {
  AMS: {
    city: "Amsterdam",
    country: "Niederlande",
    timezone: "Europe/Amsterdam",
    style: {
      sky: ["#1e2a4f", "#f0a878"],
      ink: "#0f1428",
      far: "#3e4a78",
      tag: "Grachtengordel",
    },
    draw: (s) => {
      // Canal houses with neck, step and bell gables; arched bridge over the gracht
      const row: [number, number, number][] = [
        [0, 13, 1],
        [13, 11, 2],
        [24, 12, 0],
        [36, 14, 3],
        [50, 11, 1],
        [61, 12, 2],
        [73, 13, 0],
        [86, 11, 1],
        [97, 12, 3],
        [109, 13, 2],
        [122, 11, 0],
        [133, 14, 1],
        [147, 12, 2],
        [159, 11, 0],
        [170, 13, 3],
        [183, 17, 1],
      ];
      const tops = [
        38, 32, 36, 42, 30, 36, 32, 40, 34, 30, 38, 34, 40, 32, 36, 38,
      ];
      let houses = "";
      const lit: number[][] = [];
      row.forEach(([x, w, k], i) => {
        houses += gableHouse(x, w, tops[i] - 4, k, 74);
        if (i % 2 === 0) lit.push([x + w / 2 - 0.9, tops[i] + 4]);
        if (i % 3 === 1) lit.push([x + 3, tops[i] + 14]);
      });
      return (
        `<path fill="${s.far}" d="M0,60 L14,60 L14,50 L20,50 L22,36 L24,50 L30,50 L30,58 L150,58 L150,46 L156,46 L158,34 L160,46 L166,46 L166,58 L200,58 L200,100 L0,100Z" opacity=".75"/>` +
        `<g fill="${s.ink}">${houses}<rect x="0" y="70" width="200" height="4"/>` +
        // trees on the quay
        `<circle cx="20" cy="62" r="7"/><circle cx="184" cy="61" r="8"/><circle cx="166" cy="63" r="6"/><rect x="19.2" y="62" width="1.6" height="8"/><rect x="183.2" y="61" width="1.6" height="9"/></g>` +
        windows(s, lit) +
        `<rect x="0" y="74" width="200" height="26" fill="${s.far}"/>` +
        `<path fill="${s.ink}" d="M46,76 L58,64 L142,64 L154,76 L140,76 Q100,58 60,76Z"/>` +
        `<path d="M58,64 L58,59 L142,59 L142,64 M70,59 L70,64 M80,59 L80,64 M90,59 L90,64 M100,59 L100,64 M110,59 L110,64 M120,59 L120,64 M130,59 L130,64" stroke="${s.ink}" stroke-width="1" fill="none"/>` +
        `<path d="M62,80 Q100,90 138,80 M76,74 L124,74" stroke="${s.sky[1]}" stroke-width="1" fill="none" opacity=".45"/>` +
        `<path d="M46,76 L58,64 L142,64 L154,76" stroke="${s.sky[1]}" stroke-width=".7" fill="none" opacity=".45"/>` +
        `<g fill="${s.ink}"><rect x="57" y="50" width="1.4" height="10"/><rect x="141" y="50" width="1.4" height="10"/></g><circle cx="57.7" cy="50" r="1.8" fill="${s.sky[1]}" opacity=".85"/><circle cx="141.7" cy="50" r="1.8" fill="${s.sky[1]}" opacity=".85"/>` +
        `<path d="M8,80 L40,80 M160,84 L194,84 M20,90 L70,90" stroke="${s.sky[1]}" stroke-width="1" opacity=".5"/>` +
        // canal boat
        `<path fill="${s.ink}" d="M156,82 L188,82 L184,86 L160,86Z M164,80 L178,80 L178,82 L164,82Z"/>`
      );
    },
  },

  BER: {
    city: "Berlin",
    country: "Deutschland",
    timezone: "Europe/Berlin",
    style: {
      sky: ["#1a2140", "#d99a8c"],
      ink: "#0b0e1e",
      far: "#3a4170",
      tag: "Fernsehturm & Brandenburger Tor",
    },
    draw: (s) => {
      // Brandenburger Tor with the Quadriga; Fernsehturm behind on the right
      let cols = "";
      for (let i = 0; i < 6; i++)
        cols += `<rect x="${n(32 + i * 11)}" y="58" width="4.4" height="34"/>`;
      return (
        `<path fill="${s.far}" d="M0,72 h12 v-8 h14 v10 h18 v-14 h10 v14 h60 v-10 h16 v-6 h12 v16 h20 v-12 h14 v8 h24 V100 H0Z"/>` +
        `<g fill="${s.ink}">` +
        // Fernsehturm
        `<path d="M141,92 L143.5,40 L146.5,40 L149,92Z"/><circle cx="145" cy="32" r="8"/>` +
        `<rect x="141" y="38" width="8" height="3"/><rect x="143.5" y="12" width="3" height="14"/><rect x="144.4" y="2" width="1.2" height="12"/>` +
        // Tor
        `<rect x="26" y="50" width="70" height="8"/><path d="M28,50 L28,44 L94,44 L94,50Z"/><path d="M44,44 L44,38 L78,38 L78,44Z"/>` +
        cols +
        `<rect x="24" y="64" width="6" height="28"/><rect x="92" y="64" width="6" height="28"/>` +
        // Quadriga
        `<path d="M54,38 L54,34 Q56,30 59,32 L62,30 Q66,28 68,33 L68,38Z"/><rect x="60.4" y="23" width="1.2" height="9"/><path d="M61.6,23 L66,25 L61.6,27Z"/>` +
        // low blocks either side
        `<rect x="0" y="76" width="22" height="16"/><rect x="100" y="78" width="36" height="14"/><rect x="154" y="72" width="46" height="20"/></g>` +
        `<circle cx="145" cy="32" r="8" fill="none" stroke="${s.sky[1]}" stroke-width=".6" opacity=".35"/>` +
        windows(s, [
          [6, 80],
          [14, 84],
          [108, 82],
          [122, 82],
          [160, 77],
          [172, 81],
          [186, 77],
        ]) +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  HAM: {
    city: "Hamburg",
    country: "Deutschland",
    timezone: "Europe/Berlin",
    style: {
      sky: ["#102c45", "#8fc0d6"],
      ink: "#06141f",
      far: "#2a5672",
      tag: "Elbphilharmonie & Michel",
    },
    draw: (s) => {
      // Michel tower on the left, harbour cranes behind, Elbphilharmonie on the Elbe
      let glass = "";
      for (let y = 54; y < 68; y += 4)
        glass += `M${y < 58 ? 112 : 106},${y} L${y < 58 ? 172 : 178},${y} `;
      return (
        `<g stroke="${s.far}" stroke-width="2" fill="none"><path d="M24,92 L24,52 L6,52 M24,52 L40,52 M24,58 L12,52"/><path d="M196,92 L196,56 L180,56 M196,56 L200,56"/></g>` +
        `<path fill="${s.far}" d="M0,78 h20 v-6 h22 v8 h40 v-4 h14 V100 H0Z M180,74 h20 V100 h-20Z"/>` +
        `<g fill="${s.ink}">` +
        // St. Michaelis
        `<rect x="54" y="46" width="16" height="46"/><rect x="52" y="44" width="20" height="4"/>` +
        `<path d="M55,44 L56,34 L68,34 L69,44Z"/><rect x="54" y="32" width="16" height="3"/>` +
        `<path d="M57,32 L58,24 L66,24 L67,32Z"/><path d="M57,24 Q62,16 67,24Z"/><rect x="61" y="10" width="2" height="12"/><path d="M60.2,12 L62,2 L63.8,12Z"/>` +
        `<rect x="40" y="70" width="44" height="22"/><path d="M38,70 L62,60 L86,70Z"/>` +
        // Elbphilharmonie: brick base and glass wave
        `<rect x="102" y="70" width="80" height="22"/>` +
        `<path d="M104,70 L104,54 Q110,44 118,52 Q126,38 138,50 Q148,40 156,48 Q166,36 176,52 Q180,48 180,54 L180,70Z"/>` +
        `<rect x="0" y="86" width="40" height="6"/></g>` +
        `<path d="${glass}" stroke="${s.sky[1]}" stroke-width=".7" opacity=".35"/>` +
        windows(s, [
          [108, 74],
          [118, 78],
          [130, 74],
          [146, 78],
          [160, 74],
          [172, 78],
        ]) +
        `<circle cx="62" cy="40" r="2.6" fill="${s.sky[1]}" opacity=".7"/>` +
        water(s, "M10,95 L80,95 M110,97 L190,97") +
        `<path fill="${s.ink}" d="M14,94 L44,94 L40,97 L18,97Z M24,94 L24,90 L34,90 L34,94Z"/>`
      );
    },
  },

  VIE: {
    city: "Wien",
    country: "Österreich",
    timezone: "Europe/Vienna",
    style: {
      sky: ["#2b1e45", "#e7b38f"],
      ink: "#140d24",
      far: "#54457a",
      tag: "Stephansdom & Riesenrad",
    },
    draw: (s) => {
      // Stephansdom: steep nave roof and the tall south tower; Riesenrad on the right
      const cx = 162;
      const cy = 52;
      const r = 24;
      let gond = "";
      let spokes = "";
      for (let i = 0; i < 10; i++) {
        const a = (i * Math.PI) / 5;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        gond += `<rect x="${n(x - 2.4)}" y="${n(y - 1)}" width="4.8" height="3.4" rx=".8"/>`;
        spokes += `M${cx},${cy} L${n(x)},${n(y)} `;
      }
      return (
        `<path fill="${s.far}" d="M0,70 h10 v-6 h16 v8 h30 v-4 h20 V100 H0Z M118,72 h22 v-6 h14 v10 h46 V100 h-82Z"/>` +
        `<g fill="none" stroke="${s.ink}"><circle cx="${cx}" cy="${cy}" r="${r}" stroke-width="1.6"/><circle cx="${cx}" cy="${cy}" r="${r - 3}" stroke-width=".8"/><path d="${spokes}" stroke-width=".7"/>` +
        `<path d="M${cx - 18},92 L${cx},${cy} L${cx + 18},92 M${cx - 10},72 L${cx + 10},72" stroke-width="2"/></g>` +
        `<g fill="${s.ink}">${gond}<circle cx="${cx}" cy="${cy}" r="2.6"/>` +
        // nave with steep roof
        `<rect x="18" y="62" width="90" height="30"/><path d="M16,63 L28,40 L98,40 L110,63Z"/>` +
        `<path d="M24,62 L26,52 L28,62Z M100,62 L102,52 L104,62Z"/>` +
        // Heidentürme at the west end
        `<rect x="12" y="44" width="8" height="48"/><path d="M11,44 L16,34 L21,44Z"/>` +
        // south tower
        `<path d="M108,92 L108,56 L111,46 L112,32 L114,20 L116,8 L117,2 L118,8 L120,20 L122,32 L123,46 L126,56 L126,92Z"/>` +
        `<path d="M108,56 L106,50 L110,52Z M126,56 L128,50 L124,52Z M111,46 L109,40 L113,42Z M123,46 L125,40 L121,42Z"/>` +
        `<rect x="0" y="80" width="12" height="12"/><rect x="128" y="80" width="18" height="12"/><rect x="186" y="78" width="14" height="14"/></g>` +
        // zig-zag tile pattern on the roof
        `<path d="M34,52 L42,46 L50,52 L58,46 L66,52 L74,46 L82,52 L90,46" stroke="${s.sky[1]}" stroke-width=".8" fill="none" opacity=".4"/>` +
        windows(s, [
          [40, 72],
          [56, 72],
          [72, 72],
          [88, 72],
          [116, 60],
        ]) +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  PRG: {
    city: "Prag",
    country: "Tschechien",
    timezone: "Europe/Prague",
    style: {
      sky: ["#2d1d3c", "#eaa97c"],
      ink: "#160d1e",
      far: "#5a3d5e",
      tag: "Karlův most & Hrad",
    },
    draw: (s) => {
      // Castle and St. Vitus on the hill, Charles Bridge with its tower across the Vltava
      let arches = "";
      for (let x = 30; x < 190; x += 26)
        arches += `M${x},92 L${x},80 Q${x + 11},64 ${x + 22},80 L${x + 22},92Z `;
      let statues = "";
      for (let x = 40; x < 190; x += 18)
        statues += `<rect x="${x}" y="58" width="1.8" height="5"/><circle cx="${x + 0.9}" cy="57.2" r="1.3"/>`;
      return (
        `<path fill="${s.far}" d="M0,62 Q40,50 80,46 Q130,42 170,52 Q190,56 200,60 L200,100 L0,100Z"/>` +
        `<g fill="${s.ink}">` +
        // castle range
        `<rect x="54" y="38" width="96" height="10"/><rect x="58" y="34" width="88" height="5"/>` +
        // St. Vitus: nave, main tower with bulb cap, twin west spires
        `<path d="M84,38 L88,26 L124,26 L128,38Z"/>` +
        `<rect x="104" y="12" width="9" height="16"/><path d="M103,12 Q108.5,2 114,12Z"/><rect x="108" y="-1" width="1.2" height="5"/>` +
        `<rect x="78" y="16" width="5" height="22"/><rect x="87" y="16" width="5" height="22"/>` +
        `<path d="M77.5,16 L80.5,0 L83.5,16Z M86.5,16 L89.5,0 L92.5,16Z"/>` +
        spiresRow(92, 128, 6, 26, 5) +
        // bridge tower (Old Town side)
        `<rect x="4" y="38" width="20" height="54"/><path d="M2,38 L14,18 L26,38Z"/>` +
        `<path d="M2,38 L1,32 L5,36Z M26,38 L27,32 L23,36Z"/>` +
        // bridge deck
        `<rect x="24" y="62" width="176" height="5"/><path d="M24,67 L200,67 L200,92 L24,92Z"/></g>` +
        `<g fill="${s.ink}">${statues}</g>` +
        `<path d="${arches}" fill="${s.far}"/>` +
        `<path d="M10,46 L10,54 M18,46 L18,54" stroke="${s.sky[1]}" stroke-width="1.6" opacity=".55"/>` +
        water(s, "M6,95 L80,95 M110,97 L190,97") +
        `<path d="M36,86 L46,86 M88,84 L98,84 M140,86 L150,86" stroke="${s.sky[1]}" stroke-width="1" opacity=".5"/>`
      );
    },
  },

  CPH: {
    city: "Kopenhagen",
    country: "Dänemark",
    timezone: "Europe/Copenhagen",
    style: {
      sky: ["#123044", "#f2b98a"],
      ink: "#081720",
      far: "#2e5a6c",
      tag: "Nyhavn",
    },
    draw: (s) => {
      // Nyhavn: row of gabled town houses along the quay, old sailing ships with masts in front
      const row: [number, number, number, number][] = [
        [0, 16, 50, 3],
        [16, 14, 44, 3],
        [30, 18, 52, 1],
        [48, 14, 46, 3],
        [62, 16, 54, 3],
        [78, 14, 48, 2],
        [92, 18, 42, 3],
        [110, 14, 50, 3],
        [124, 16, 46, 1],
        [140, 14, 52, 3],
        [154, 18, 44, 3],
        [172, 14, 50, 2],
        [186, 14, 46, 3],
      ];
      const tints = ["#c0603a", "#d9a640", "#3f7a8c", "#b44a4a", "#6f8f4a"];
      let houses = "";
      let fronts = "";
      const lit: number[][] = [];
      row.forEach(([x, w, t0, k], i) => {
        const t = t0 + 6;
        houses += gableHouse(x, w, t, k, 80);
        fronts += `<rect x="${x + 1}" y="${t + 1}" width="${w - 2}" height="${79 - t}" fill="${tints[i % 5]}" opacity=".22"/>`;
        for (let j = 0; j < 3; j++)
          if ((i + j) % 2 === 0) lit.push([x + 3 + j * ((w - 8) / 2), t + 6]);
        if (i % 2) lit.push([x + w / 2 - 1, t + 15]);
      });
      const mast = (x: number, top: number, hull: number) =>
        `<rect x="${x - 0.8}" y="${top}" width="1.6" height="${hull - top}"/>` +
        `<rect x="${x - 7}" y="${top + 8}" width="14" height="1.2"/><rect x="${x - 5}" y="${top + 18}" width="10" height="1.2"/>`;
      return (
        `<path fill="${s.far}" d="M0,52 h30 v-6 h20 v8 h50 v-4 h4 v-10 h4 v10 h4 v4 h40 v-6 h44 V100 H0Z" opacity=".7"/>` +
        `<g fill="${s.ink}">${houses}<rect x="0" y="80" width="200" height="4"/></g>` +
        fronts +
        windows(s, lit) +
        `<rect x="0" y="84" width="200" height="16" fill="${s.far}"/>` +
        `<path d="M6,95 L60,95 M100,97 L194,97" stroke="${s.sky[1]}" stroke-width="1" opacity=".55"/>` +
        // sailing ships with masts and yards rising above the roofs
        `<g fill="${s.ink}"><path d="M12,84 L62,84 L56,90 L18,90Z"/><path d="M118,84 L176,84 L170,90 L124,90Z"/>` +
        mast(28, 14, 84) +
        mast(46, 24, 84) +
        mast(136, 10, 84) +
        mast(158, 22, 84) +
        `</g>` +
        `<path d="M14,84 L28,14 L46,24 L60,84 M120,84 L136,10 L158,22 L174,84" stroke="${s.ink}" stroke-width=".6" fill="none"/>`
      );
    },
  },

  DUB: {
    city: "Dublin",
    country: "Irland",
    timezone: "Europe/Dublin",
    style: {
      sky: ["#123628", "#c9d9a4"],
      ink: "#07190f",
      far: "#2f5a44",
      tag: "Ha'penny Bridge",
    },
    draw: (s) => {
      // Ha'penny Bridge on the left, Samuel Beckett harp bridge on the right, Liffey below
      let rail = "";
      for (let x = 8; x <= 96; x += 4)
        rail += `M${x},${n(railY(x) - 6)} L${x},${n(railY(x))} `;
      rail += "M4,72 Q52,36 100,72";
      let cables = "";
      for (let i = 0; i < 9; i++) {
        const t = i / 8;
        const px = 151 + 20 * t * t;
        const py = 78 - 62 * t;
        cables += `M${n(px)},${n(py)} L${n(118 + i * 4)},78 `;
      }
      return (
        `<path fill="${s.far}" d="M0,66 h18 v-8 h22 v6 h40 v-4 h12 v8 h30 v-4 h20 h12 v-6 h16 v8 h30 V100 H0Z"/>` +
        // Custom House dome in the distance
        `<path fill="${s.far}" d="M100,60 L100,52 Q106,44 112,52 L112,60Z M105,48 L105,42 L107,42 L107,48Z"/>` +
        `<g fill="${s.ink}"><rect x="0" y="76" width="8" height="8"/><rect x="98" y="76" width="16" height="8"/><rect x="194" y="76" width="6" height="8"/>` +
        // Ha'penny: shallow cast-iron arch with three lamp arches
        `<path d="M4,78 Q52,42 100,78 L100,81 Q52,48 4,81Z"/>` +
        `<circle cx="30" cy="50" r="1.8"/><circle cx="52" cy="46" r="1.8"/><circle cx="74" cy="50" r="1.8"/>` +
        // Beckett: deck and curved harp pylon
        `<rect x="114" y="76" width="84" height="3"/>` +
        `<path d="M148,79 Q151,52 170,14 L174,12 Q157,52 154,79Z"/></g>` +
        `<path d="${rail}" stroke="${s.ink}" stroke-width=".8" fill="none"/>` +
        `<path d="M30,52 L30,62 M52,48 L52,60 M74,52 L74,62" stroke="${s.ink}" stroke-width="1.2"/>` +
        `<circle cx="30" cy="50" r=".9" fill="${s.sky[1]}"/><circle cx="52" cy="46" r=".9" fill="${s.sky[1]}"/><circle cx="74" cy="50" r=".9" fill="${s.sky[1]}"/>` +
        `<path d="${cables}" stroke="${s.ink}" stroke-width=".6"/>` +
        `<path d="M172,14 L196,78 M174,16 L188,78" stroke="${s.ink}" stroke-width=".6"/>` +
        `<rect x="0" y="84" width="200" height="16" fill="${s.far}"/>` +
        `<rect x="0" y="79" width="200" height="5" fill="${s.far}" opacity=".6"/>` +
        `<path d="M14,90 L84,90 M116,94 L192,94 M30,86 Q52,82 74,86" stroke="${s.sky[1]}" stroke-width="1" fill="none" opacity=".5"/>`
      );
    },
  },

  BRU: {
    city: "Brüssel",
    country: "Belgien",
    timezone: "Europe/Brussels",
    style: {
      sky: ["#1b2846", "#a6c4e6"],
      ink: "#0b1122",
      far: "#3c5582",
      tag: "Atomium",
    },
    draw: (s) => {
      // Atomium: nine spheres of an iron crystal, standing on its supports
      const a = atomium(100, 44, 22);
      const low = a.pts
        .filter(([, y]) => y > 50 && y < 74)
        .map(([x, y]) => `M${n(x)},${n(y)} L${n(x + (x < 100 ? -6 : 6))},92 `)
        .join("");
      const glints = a.pts
        .map(
          ([x, y]) =>
            `<circle cx="${n(x - 2)}" cy="${n(y - 2)}" r="1.4" fill="${s.sky[1]}" opacity=".55"/>`,
        )
        .join("");
      return (
        `<path fill="${s.far}" d="M0,76 h14 v-10 h12 v6 h20 v-4 h12 v14 h88 v-12 h14 v8 h16 v-6 h24 V100 H0Z"/>` +
        `<g stroke="${s.ink}" fill="none"><path d="${a.tubes}" stroke-width="2.6"/><path d="${low}" stroke-width="2"/></g>` +
        `<g fill="${s.ink}">${a.balls}<path d="M90,92 L92,80 L108,80 L110,92Z"/>` +
        `<path d="M0,92 L0,82 h28 v10Z M168,92 v-8 h32 v8Z"/></g>` +
        glints +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  WAW: {
    city: "Warschau",
    country: "Polen",
    timezone: "Europe/Warsaw",
    style: {
      sky: ["#2a1c3e", "#e9a691"],
      ink: "#140c1f",
      far: "#4f3c6a",
      tag: "Pałac Kultury",
    },
    draw: (s) => {
      // Palace of Culture and Science: stepped wedding-cake tower with pinnacles and spire
      let pin = "";
      [
        [64, 58],
        [136, 58],
        [80, 34],
        [120, 34],
        [86, 22],
        [114, 22],
      ].forEach(([x, y]) => {
        pin += `<path d="M${x - 2},${y} L${x - 2},${y - 4} L${x},${y - 8} L${x + 2},${y - 4} L${x + 2},${y}Z"/>`;
      });
      const lit: number[][] = [];
      for (let y = 38; y < 56; y += 6)
        for (let x = 86; x < 116; x += 6) lit.push([x, y]);
      return (
        // modern towers in the background
        `<g fill="${s.far}"><rect x="4" y="40" width="14" height="60"/><rect x="22" y="52" width="12" height="48"/>` +
        `<path d="M160,100 L160,30 L168,26 L174,30 L174,100Z"/><rect x="166.6" y="10" width="1.2" height="17"/>` +
        `<rect x="178" y="44" width="14" height="56"/><path d="M144,100 V50 L156,44 V100Z"/></g>` +
        `<g fill="${s.ink}">` +
        `<rect x="40" y="72" width="120" height="20"/><rect x="52" y="62" width="96" height="10"/>` +
        `<rect x="66" y="50" width="68" height="12"/><rect x="80" y="34" width="40" height="18"/>` +
        `<rect x="86" y="22" width="28" height="12"/><rect x="91" y="14" width="18" height="8"/>` +
        `<path d="M92,14 L100,6 L108,14Z"/><rect x="99.2" y="-6" width="1.6" height="13"/>` +
        pin +
        `<rect x="0" y="80" width="40" height="12"/><rect x="160" y="78" width="40" height="14"/></g>` +
        windows(s, lit, 1.6, 2.2) +
        `<circle cx="100" cy="27" r="2.6" fill="${s.sky[1]}" opacity=".7"/>` +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  KRK: {
    city: "Krakau",
    country: "Polen",
    timezone: "Europe/Warsaw",
    style: {
      sky: ["#2e2338", "#e3b884"],
      ink: "#161019",
      far: "#5a4860",
      tag: "Mariacki & Sukiennice",
    },
    draw: (s) => {
      // St. Mary's with its two unequal towers, Cloth Hall with its renaissance attic
      let attic = "";
      for (let x = 104; x < 196; x += 6)
        attic += `M${x},57 L${x + 1},51 L${x + 2},54 L${x + 3},49 L${x + 4},54 L${x + 5},51 L${x + 6},57Z `;
      let arcade = "";
      for (let x = 108; x < 192; x += 10)
        arcade += `M${x},92 L${x},78 Q${x + 3.5},71 ${x + 7},78 L${x + 7},92Z `;
      return (
        `<path fill="${s.far}" d="M0,70 h10 v-8 h14 v12 h76 v-6 h18 v-10 l4,-6 l4,6 v10 h40 v-6 h20 v8 h14 V100 H0Z"/>` +
        `<g fill="${s.ink}">` +
        // church body
        `<rect x="26" y="56" width="66" height="36"/><path d="M28,57 L36,42 L84,42 L92,57Z"/>` +
        // taller north tower: gothic helm with crown of turrets
        `<rect x="26" y="26" width="16" height="66"/><path d="M25,26 L34,4 L43,26Z"/>` +
        `<path d="M24,30 L25,20 L27,30Z M41,30 L43,20 L44,30Z M29,27 L30,18 L31,27Z M37,27 L38,18 L39,27Z"/>` +
        `<rect x="33.4" y="-4" width="1.2" height="9"/>` +
        // lower south tower with domed cap
        `<rect x="48" y="36" width="14" height="56"/><path d="M47,36 Q55,22 63,36Z"/>` +
        `<rect x="54" y="20" width="2" height="6"/><circle cx="55" cy="19" r="1.6"/>` +
        // Sukiennice
        `<rect x="102" y="56" width="96" height="36"/><path d="M143,56 L143,44 L157,44 L157,56Z"/>` +
        `<path d="M145,44 L150,34 L155,44Z"/><rect x="149.4" y="28" width="1.2" height="7"/></g>` +
        `<path d="${attic}" fill="${s.ink}"/>` +
        `<path d="${arcade}" fill="${s.far}"/>` +
        `<path d="M32,40 L32,48 M36,40 L36,48 M52,44 L52,50 M58,44 L58,50" stroke="${s.sky[1]}" stroke-width="1.4" opacity=".55"/>` +
        windows(s, [
          [112, 62],
          [130, 62],
          [149, 49],
          [168, 62],
          [186, 62],
        ]) +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },
};

// Small row of pinnacles along a roof ridge
function spiresRow(
  x0: number,
  x1: number,
  step: number,
  base: number,
  h: number,
) {
  let d = "";
  for (let x = x0; x <= x1; x += step)
    d += `M${x - 1.2},${base} L${x},${base - h} L${x + 1.2},${base}Z `;
  return `<path d="${d}"/>`;
}

// Top of the Ha'penny Bridge arch at x
function railY(x: number) {
  const t = (x - 52) / 48;
  return 78 - 18 * (1 - t * t);
}
