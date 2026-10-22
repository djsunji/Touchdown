import type { CityStyle, LibraryCity } from "./shared";

// Hand-drawn skylines: Czechia, Slovakia, Poland, Romania, Bulgaria, Serbia, Bosnia

const n = (v: number) => v.toFixed(1);

// Water strip below a given line with light reflection lines
function water(s: CityStyle, top = 92, a = "M8,95 L70,95 M104,97 L190,97") {
  return (
    `<rect x="0" y="${top}" width="200" height="${100 - top}" fill="${s.far}"/>` +
    `<path d="${a}" stroke="${s.sky[1]}" stroke-width="1" opacity=".55"/>`
  );
}

// Lit windows: [x, y] list
function windows(s: CityStyle, cells: number[][], w = 1.8, h = 2.4) {
  return cells
    .map(
      ([x, y]) =>
        `<rect x="${n(x)}" y="${n(y)}" width="${w}" height="${h}" fill="${s.sky[1]}" opacity=".6"/>`,
    )
    .join("");
}

// Narrow gabled house: 0 neck, 1 step, 2 bell, 3 triangle
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

// Square tower with a pointed cap: x left, w width, top of the walls, cap height
function capTower(x: number, w: number, top: number, cap: number, base = 92) {
  return `<rect x="${x}" y="${top}" width="${w}" height="${base - top}"/><path d="M${x - 0.6},${top} L${n(x + w / 2)},${top - cap} L${x + w + 0.6},${top}Z"/>`;
}

// Half dome on a drum: centre x, base y, radius
function dome(cx: number, y: number, r: number, drum = 0) {
  return (
    (drum
      ? `<rect x="${n(cx - r * 0.8)}" y="${y}" width="${n(r * 1.6)}" height="${drum}"/>`
      : "") +
    `<path d="M${n(cx - r)},${y} A${r},${r} 0 0 1 ${n(cx + r)},${y}Z"/>`
  );
}

// Orthodox / latin cross: centre x, bottom y, height
function cross(cx: number, y: number, h: number) {
  return `<rect x="${n(cx - 0.5)}" y="${n(y - h)}" width="1" height="${h}"/><rect x="${n(cx - 2)}" y="${n(y - h * 0.75)}" width="4" height="1"/>`;
}

// Slender minaret with balcony and pencil cap
function minaret(x: number, top: number, base = 92) {
  return (
    `<rect x="${x - 2}" y="${top}" width="4" height="${base - top}"/>` +
    `<rect x="${x - 3.2}" y="${top + 10}" width="6.4" height="1.6"/>` +
    `<path d="M${x - 2.2},${top} L${x},${top - 12} L${x + 2.2},${top}Z"/>` +
    `<rect x="${x - 0.3}" y="${top - 15}" width=".6" height="4"/>`
  );
}

export const EASTERN: Record<string, LibraryCity> = {
  BRQ: {
    city: "Brünn",
    country: "Tschechien",
    timezone: "Europe/Prague",
    style: {
      sky: ["#24203f", "#e7a27c"],
      ink: "#120f22",
      far: "#433d6a",
      tag: "Petrov & Špilberk",
    },
    draw: (s) => {
      // Petrov cathedral with its twin needle spires on the left hill, Špilberk fortress on the right
      return (
        `<path fill="${s.far}" d="M0,78 h10 v-6 h12 v8 h16 v-10 h10 v10 h70 v-8 h14 v-6 h10 v14 h24 v-10 h14 v8 h20 V100 H0Z" opacity=".8"/>` +
        `<g fill="${s.ink}">` +
        `<path d="M0,92 L0,74 Q34,62 72,64 Q100,66 114,78 Q132,60 168,56 Q190,56 200,60 L200,92Z"/>` +
        // Petrov nave, choir and twin towers
        `<rect x="44" y="50" width="54" height="16"/><path d="M44,50 L50,40 L96,40 L100,50Z"/>` +
        `<path d="M98,66 L98,48 Q106,48 108,58 L108,66Z"/>` +
        `<rect x="48" y="28" width="8" height="38"/><rect x="62" y="28" width="8" height="38"/>` +
        `<path d="M47,28 L52,2 L57,28Z M61,28 L66,2 L71,28Z"/>` +
        `<path d="M46,28 L47,23 L48,28Z M56,28 L57,23 L58,28Z M60,28 L61,23 L62,28Z M70,28 L71,23 L72,28Z"/>` +
        `<rect x="45" y="27" width="28" height="2"/>` +
        // Špilberk: bastions, long wings and the square keep
        `<path d="M136,60 L142,46 L196,46 L200,52 L200,60Z"/>` +
        `<rect x="144" y="38" width="50" height="9"/>` +
        `<rect x="162" y="24" width="12" height="16"/><path d="M161,24 L163,19 L173,19 L175,24Z"/><rect x="167.4" y="12" width="1.2" height="8"/><path d="M168.6,12 L174,14 L168.6,16Z"/>` +
        `<path d="M144,38 h3 v-2 h3 v2 h3 v-2 h3 v2 h3 v-2 h3 v2 M175,38 h3 v-2 h3 v2 h3 v-2 h3 v2 h3 v-2 h3 v2 v1 h-19Z M144,38 v1 h18 v-1Z"/>` +
        `</g>` +
        `<path d="M52,34 L52,38 M66,34 L66,38" stroke="${s.sky[1]}" stroke-width="1" opacity=".5"/>` +
        windows(s, [
          [148, 41],
          [154, 41],
          [180, 41],
          [186, 41],
          [166.5, 28],
          [76, 54],
          [84, 54],
          [20, 78],
          [120, 82],
          [180, 80],
        ]) +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  BTS: {
    city: "Bratislava",
    country: "Slowakei",
    timezone: "Europe/Bratislava",
    style: {
      sky: ["#1b2b44", "#f3b884"],
      ink: "#0b1220",
      far: "#34507a",
      tag: "Hrad & UFO-Brücke",
    },
    draw: (s) => {
      // Castle with four corner towers on the hill, UFO bridge over the Danube
      let cables = "";
      for (let i = 0; i < 6; i++)
        cables += `M159,${36 + i * 2} L${104 + i * 9},73 `;
      return (
        `<path fill="${s.far}" d="M0,74 L18,64 L40,70 L70,60 L100,68 L130,62 L200,70 L200,100 L0,100Z" opacity=".7"/>` +
        water(s, 76, "M120,82 L190,82 M100,88 L160,88 M10,96 L80,96") +
        `<g fill="${s.ink}">` +
        `<path d="M0,92 L0,64 Q30,52 64,52 Q92,54 104,70 L112,92Z"/>` +
        // back towers
        `${capTower(40, 8, 24, 7, 40)}${capTower(72, 8, 24, 7, 40)}` +
        // main block with parapet
        `<rect x="30" y="32" width="60" height="22"/><path d="M30,32 L34,28 L86,28 L90,32Z"/>` +
        // front towers
        `${capTower(26, 11, 24, 9, 54)}${capTower(83, 11, 24, 9, 54)}` +
        // bridge deck and pylon with the UFO
        `<rect x="96" y="72" width="104" height="2.6"/>` +
        `<path d="M150,82 L157,34 L161,34 L172,82 L169,82 L159,40 L153,82Z"/>` +
        `<ellipse cx="159" cy="30" rx="14" ry="4"/><path d="M150,28 Q159,20 168,28Z"/><path d="M152,32 L166,32 L163,35 L155,35Z"/>` +
        `<rect x="158.4" y="14" width="1.2" height="8"/>` +
        `<rect x="150" y="74" width="23" height="8"/>` +
        `</g>` +
        `<path d="${cables}" stroke="${s.ink}" stroke-width=".6" fill="none"/>` +
        `<path d="M147,30 L171,30" stroke="${s.sky[1]}" stroke-width=".8" opacity=".7"/>` +
        windows(s, [
          [36, 36],
          [44, 36],
          [52, 36],
          [60, 36],
          [68, 36],
          [76, 36],
          [44, 44],
          [60, 44],
          [76, 44],
        ])
      );
    },
  },

  GDN: {
    city: "Danzig",
    country: "Polen",
    timezone: "Europe/Warsaw",
    style: {
      sky: ["#2b1e3a", "#f0a070"],
      ink: "#170f1e",
      far: "#4c3a5c",
      tag: "Żuraw an der Mottlau",
    },
    draw: (s) => {
      // The Żuraw crane gate on the left, gabled merchant houses along the Motława
      const row: [number, number, number, number][] = [
        [72, 11, 1, 46],
        [83, 10, 3, 42],
        [93, 12, 2, 48],
        [105, 10, 0, 44],
        [115, 12, 1, 40],
        [127, 11, 3, 46],
        [138, 12, 2, 42],
        [150, 10, 0, 48],
        [160, 12, 1, 44],
        [172, 11, 2, 40],
        [183, 17, 3, 46],
      ];
      let houses = "";
      const lit: number[][] = [];
      row.forEach(([x, w, k, t], i) => {
        houses += gableHouse(x, w, t, k, 76);
        lit.push([x + w / 2 - 0.9, t + 5]);
        if (i % 2 === 0) lit.push([x + 2.5, t + 14]);
      });
      return (
        // St. Mary's church tower in the background
        `<path fill="${s.far}" d="M0,76 L0,60 L60,60 L60,76Z M118,76 L118,40 L130,40 L130,22 L134,16 L135,22 L141,22 L142,16 L143,22 L146,22 L146,40 L190,40 L196,46 L196,76Z" opacity=".85"/>` +
        `<g fill="${s.ink}">` +
        houses +
        // Żuraw: twin brick towers and the timber crane housing with its high roof
        `<rect x="20" y="38" width="18" height="38"/><rect x="40" y="38" width="20" height="38"/>` +
        `<path d="M20,38 v-3 h3 v3 h3 v-3 h3 v3 h3 v-3 h6 v3Z M40,38 v-3 h4 v3 h4 v-3 h4 v3 h4 v-3 h4 v3Z"/>` +
        `<rect x="26" y="26" width="44" height="18"/>` +
        `<path d="M24,26 L45,4 L72,26Z"/>` +
        `<rect x="0" y="74" width="200" height="3"/>` +
        `</g>` +
        `<path d="M30,30 L30,40 M38,30 L38,40 M46,30 L46,40 M54,30 L54,40 M62,30 L62,40 M26,35 L70,35" stroke="${s.sky[1]}" stroke-width=".5" opacity=".35"/>` +
        windows(s, [...lit, [24, 50], [42, 50], [24, 62], [42, 62]]) +
        water(
          s,
          77,
          "M8,84 L60,84 M90,82 L160,82 M40,90 L120,90 M150,95 L196,95",
        ) +
        // reflection of the crane
        `<path fill="${s.ink}" opacity=".35" d="M20,77 L60,77 L58,86 L22,86Z"/>`
      );
    },
  },

  WRO: {
    city: "Breslau",
    country: "Polen",
    timezone: "Europe/Warsaw",
    style: {
      sky: ["#1d2a3a", "#e8b48a"],
      ink: "#0d141e",
      far: "#384f68",
      tag: "Ratusz & Ostrów Tumski",
    },
    draw: (s) => {
      // Gothic town hall with its pinnacled gable and tower; cathedral twin spires on the right
      return (
        `<path fill="${s.far}" d="M0,76 h8 v-8 h12 v8 h80 v-10 h10 v10 h12 v-6 h10 v6 h68 V100 H0Z" opacity=".8"/>` +
        `<g fill="${s.ink}">` +
        // Rathaus hall and steep roof
        `<rect x="14" y="52" width="80" height="40"/><path d="M14,52 L24,36 L84,36 L94,52Z"/>` +
        // ornate east gable with pinnacles
        `<path d="M30,52 L30,40 L42,24 L54,40 L54,52Z"/>` +
        `<path d="M29,40 L30,32 L31,40Z M41,24 L42,14 L43,24Z M53,40 L54,32 L55,40Z M35,34 L36,26 L37,34Z M47,34 L48,26 L49,34Z"/>` +
        // tower with stacked lanterns
        `<rect x="68" y="30" width="10" height="22"/><rect x="69.5" y="22" width="7" height="8"/>` +
        `<path d="M68,30 L73,26 L78,30Z"/><ellipse cx="73" cy="20" rx="4.5" ry="3"/>` +
        `<rect x="71" y="12" width="4" height="7"/><path d="M70,12 Q73,6 76,12Z"/><path d="M72.4,8 L73,0 L73.6,8Z"/>` +
        // cathedral on the island
        `<rect x="128" y="56" width="58" height="22"/><path d="M128,56 L136,46 L180,46 L186,56Z"/>` +
        `<rect x="132" y="30" width="10" height="48"/><rect x="152" y="30" width="10" height="48"/>` +
        `<path d="M131,30 L137,4 L143,30Z M151,30 L157,4 L163,30Z"/>` +
        `<path d="M186,78 L186,58 Q194,60 196,70 L196,78Z"/>` +
        // Odra and the Tumski bridge
        `<rect x="100" y="78" width="100" height="14"/>` +
        `</g>` +
        `<path d="M136,40 L136,46 M138,40 L138,46 M156,40 L156,46 M158,40 L158,46" stroke="${s.sky[1]}" stroke-width=".6" opacity=".5"/>` +
        `<path d="M42,32 L42,46" stroke="${s.sky[1]}" stroke-width="1" opacity=".45"/>` +
        windows(s, [
          [20, 58],
          [26, 58],
          [58, 58],
          [64, 58],
          [80, 58],
          [86, 58],
          [72, 36],
          [146, 62],
          [170, 62],
        ]) +
        water(s, 86, "M104,90 L160,90 M20,96 L90,96 M120,97 L190,97") +
        `<path d="M100,86 Q118,78 136,86 M136,86 Q154,78 172,86" stroke="${s.ink}" stroke-width="2" fill="none"/>`
      );
    },
  },

  POZ: {
    city: "Posen",
    country: "Polen",
    timezone: "Europe/Warsaw",
    style: {
      sky: ["#2a1f45", "#f2b37c"],
      ink: "#140f24",
      far: "#463a6a",
      tag: "Ratusz & Stary Rynek",
    },
    draw: (s) => {
      // Renaissance town hall with loggias, attic turrets and tall tower; coloured market houses
      const tints = [
        "#d9805a",
        "#e2b04a",
        "#7fa77a",
        "#c86a7a",
        "#6f8fc0",
        "#e09a5a",
        "#9c7ab8",
        "#d4c070",
      ];
      const left: [number, number, number][] = [
        [0, 12, 50],
        [12, 11, 46],
        [23, 12, 52],
        [35, 11, 48],
        [46, 10, 54],
      ];
      const right: [number, number, number][] = [
        [146, 11, 52],
        [157, 12, 46],
        [169, 10, 50],
        [179, 11, 48],
        [190, 10, 54],
      ];
      let houses = "";
      let fronts = "";
      [...left, ...right].forEach(([x, w, t], i) => {
        houses += gableHouse(x, w, t, i % 2 ? 2 : 1);
        fronts += `<rect x="${x + 1.2}" y="${t + 1}" width="${w - 2.4}" height="${70 - t}" fill="${tints[i % tints.length]}" opacity=".32"/>`;
      });
      let arches = "";
      for (let row = 0; row < 3; row++)
        for (let i = 0; i < 6; i++) {
          const x = 68 + i * 11;
          const y = 52 + row * 11;
          arches += `M${x},${y + 8} L${x},${y + 3} Q${x + 3.5},${y} ${x + 7},${y + 3} L${x + 7},${y + 8} `;
        }
      return (
        `<path fill="${s.far}" d="M0,70 L0,58 L60,58 L60,70Z M140,70 L140,60 L200,60 L200,70Z" opacity=".7"/>` +
        `<g fill="${s.ink}">` +
        houses +
        // Rathaus body and attic with three turrets
        `<rect x="62" y="46" width="72" height="46"/><rect x="62" y="38" width="72" height="9"/>` +
        `${capTower(64, 6, 34, 8, 40)}${capTower(126, 6, 34, 8, 40)}` +
        // tower: shaft, two lantern stages and the eagle
        `<rect x="91" y="22" width="14" height="18"/><rect x="93" y="12" width="10" height="10"/>` +
        `<path d="M90,22 Q98,15 106,22Z"/><path d="M92.5,12 Q98,4 103.5,12Z"/>` +
        `<rect x="97.4" y="0" width="1.2" height="8"/><path d="M94,1.5 L98,3 L102,1.5 L100,4 L96,4Z"/>` +
        `</g>` +
        fronts +
        `<path d="${arches}" stroke="${s.sky[1]}" stroke-width=".6" fill="none" opacity=".5"/>` +
        `<path d="M62,46 L134,46" stroke="${s.sky[1]}" stroke-width=".6" opacity=".4"/>` +
        `<circle cx="98" cy="30" r="2.6" fill="${s.sky[1]}" opacity=".7"/>` +
        windows(s, [
          [5, 58],
          [17, 60],
          [28, 62],
          [40, 58],
          [150, 62],
          [162, 56],
          [173, 60],
          [184, 58],
        ]) +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  OTP: {
    city: "Bukarest",
    country: "Rumänien",
    timezone: "Europe/Bucharest",
    style: {
      sky: ["#1f2a4a", "#f0c080"],
      ink: "#0e1426",
      far: "#3a4a78",
      tag: "Palatul Parlamentului",
    },
    draw: (s) => {
      // Arcul de Triumf on the left, the stepped mass of the Parliament Palace on the right
      let cols = "";
      for (let x = 82; x <= 184; x += 6) cols += `M${x},60 L${x},66 `;
      for (let x = 102; x <= 166; x += 5) cols += `M${x},50 L${x},56 `;
      return (
        `<path fill="${s.far}" d="M0,80 h20 v-10 h14 v10 h30 v-14 h12 v14 h124 V100 H0Z" opacity=".75"/>` +
        `<g fill="${s.ink}">` +
        // arch with a cut-out passage
        `<path fill-rule="evenodd" d="M10,92 L10,44 L54,44 L54,92Z M23,92 L23,60 Q32,48 41,60 L41,92Z"/>` +
        `<rect x="8" y="40" width="48" height="4"/><rect x="14" y="32" width="36" height="8"/>` +
        `<path d="M24,32 L32,26 L40,32Z"/>` +
        // Parliament Palace tiers and central tower
        `<rect x="64" y="66" width="136" height="26"/>` +
        `<rect x="76" y="56" width="114" height="10"/>` +
        `<rect x="96" y="46" width="76" height="10"/>` +
        `<rect x="114" y="36" width="40" height="10"/>` +
        `<rect x="124" y="24" width="20" height="12"/><rect x="128" y="18" width="12" height="6"/>` +
        `<rect x="133.4" y="6" width="1.2" height="12"/><path d="M134.6,6 L141,8 L134.6,10Z"/>` +
        `</g>` +
        `<path d="${cols}" stroke="${s.sky[1]}" stroke-width=".7" opacity=".45"/>` +
        `<path d="M16,48 L48,48 M118,40 L150,40 M128,28 L140,28" stroke="${s.sky[1]}" stroke-width=".6" opacity=".45"/>` +
        windows(s, [
          [70, 72],
          [90, 72],
          [110, 72],
          [130, 72],
          [150, 72],
          [170, 72],
          [190, 72],
        ]) +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  CLJ: {
    city: "Klausenburg",
    country: "Rumänien",
    timezone: "Europe/Bucharest",
    style: {
      sky: ["#2c2340", "#e8a888"],
      ink: "#150f20",
      far: "#4a3c62",
      tag: "Biserica Sf. Mihail",
    },
    draw: (s) => {
      // St. Michael's hall church with its neo-Gothic tower, Matthias Corvinus statue in front
      return (
        `<path fill="${s.far}" d="M0,64 Q40,50 80,58 Q120,64 150,52 Q176,44 200,54 L200,100 L0,100Z" opacity=".7"/>` +
        `<g fill="${s.ink}">` +
        // nave, roof and polygonal choir
        `<rect x="66" y="46" width="84" height="46"/><path d="M66,46 L76,26 L148,26 L156,46Z"/>` +
        `<path d="M150,92 L150,48 L160,52 L166,62 L166,92Z"/>` +
        `<path d="M86,46 L86,40 L88,36 L90,40 L90,46Z M112,46 L112,40 L114,36 L116,40 L116,46Z M138,46 L138,40 L140,36 L142,40 L142,46Z"/>` +
        // tower with corner pinnacles and spire
        `<rect x="48" y="26" width="18" height="66"/>` +
        `<path d="M46,26 L47,18 L48,26Z M66,26 L67,18 L68,26Z M51,26 L57,0 L63,26Z"/>` +
        `<rect x="46" y="25" width="22" height="2"/>` +
        // equestrian statue on its plinth
        `<rect x="166" y="64" width="26" height="28"/><rect x="164" y="61" width="30" height="3"/>` +
        `<path d="M169,61 L170,52 Q173,48 181,48 L187,46 L189,40 L192,42 L191,48 L188,52 L187,61 L185,61 L184,54 L175,54 L173,61Z"/>` +
        `<path d="M177,48 L177,40 Q179,36 181,40 L182,48Z"/><circle cx="179" cy="35" r="2.2"/><path d="M180.5,40 L187,33 L188,34 L182,41.5Z"/>` +
        `</g>` +
        `<path d="M53,32 L53,42 M57,32 L57,42 M61,32 L61,42 M80,52 L80,62 M98,52 L98,62 M124,52 L124,62" stroke="${s.sky[1]}" stroke-width="1" opacity=".45"/>` +
        windows(s, [
          [20, 76],
          [30, 80],
          [8, 84],
        ]) +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  SOF: {
    city: "Sofia",
    country: "Bulgarien",
    timezone: "Europe/Sofia",
    style: {
      sky: ["#2a2a50", "#f2bf8a"],
      ink: "#121226",
      far: "#4a4a7a",
      tag: "Alexander-Newski & Witoscha",
    },
    draw: (s) => {
      // Vitosha massif behind, Alexander Nevsky cathedral with bell tower and gilded domes
      const gold = "#e9c46a";
      return (
        `<path fill="${s.far}" d="M0,66 Q30,50 60,44 Q96,30 122,34 Q160,40 200,58 L200,100 L0,100Z" opacity=".85"/>` +
        `<path d="M86,36 Q104,30 122,34 Q134,36 140,40" stroke="#fff" stroke-width="1.2" fill="none" opacity=".35"/>` +
        `<g fill="${s.ink}">` +
        `<rect x="34" y="62" width="150" height="30"/>` +
        `<rect x="56" y="54" width="114" height="8"/>` +
        // side domes and half-domes
        `${dome(74, 54, 9, 0)}${dome(152, 54, 9, 0)}` +
        `${dome(84, 46, 6, 8)}${dome(142, 46, 6, 8)}` +
        // central drum and great dome
        `<rect x="98" y="38" width="30" height="16"/>${dome(113, 38, 15, 0)}` +
        `<rect x="110" y="20" width="6" height="5"/>${dome(113, 20, 3.6, 0)}${cross(113, 16.4, 10)}` +
        `${cross(84, 40, 6)}${cross(142, 40, 6)}` +
        // bell tower
        `<rect x="34" y="30" width="16" height="32"/><rect x="36" y="22" width="12" height="8"/>` +
        `${dome(42, 22, 6, 0)}<rect x="40.5" y="12" width="3" height="4"/>${dome(42, 12, 2.4, 0)}${cross(42, 9.6, 8)}` +
        `</g>` +
        `<path d="M99,37 A14,14 0 0 1 106,26 M80,45 A5,5 0 0 1 84,40.5 M138,45 A5,5 0 0 1 142,40.5 M37,21 A5,5 0 0 1 42,16.5 M66,53 A8,8 0 0 1 72,45.5 M144,53 A8,8 0 0 1 150,45.5" stroke="${gold}" stroke-width="1" fill="none" opacity=".75"/>` +
        `<path d="M40,40 L40,48 M44,40 L44,48 M104,42 L104,50 M110,42 L110,50 M116,42 L116,50 M122,42 L122,50" stroke="${s.sky[1]}" stroke-width="1" opacity=".5"/>` +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  BEG: {
    city: "Belgrad",
    country: "Serbien",
    timezone: "Europe/Belgrade",
    style: {
      sky: ["#182a3c", "#e9b07c"],
      ink: "#0a1420",
      far: "#33506a",
      tag: "Hram Svetog Save",
    },
    draw: (s) => {
      // Kalemegdan walls with the Pobednik column on the left; St. Sava temple on the right
      return (
        `<path fill="${s.far}" d="M60,78 h10 v-8 h14 v8 h12 v-12 h8 v12 h96 V100 H60Z" opacity=".75"/>` +
        `<g fill="${s.ink}">` +
        // fortress walls with crenels and a bastion
        `<path d="M0,92 L0,66 L56,66 L66,92Z"/>` +
        `<path d="M0,66 v-3 h4 v3 h4 v-3 h4 v3 h4 v-3 h4 v3 h4 v-3 h4 v3 h4 v-3 h4 v3 h4 v-3 h4 v3 h4 v-3 h4 v3Z"/>` +
        `<rect x="6" y="54" width="10" height="12"/><path d="M5,54 L11,48 L17,54Z"/>` +
        // Pobednik column and statue
        `<rect x="32" y="60" width="10" height="6"/><rect x="34.6" y="26" width="4.8" height="34"/><rect x="33.4" y="24" width="7.2" height="2.4"/>` +
        `<path d="M35.4,24 L36,16 L35,13 L37,10 L39,13 L38.6,24Z"/><circle cx="37" cy="8.4" r="1.6"/>` +
        `<path d="M38.4,12 L42,8 L42.6,8.6 L39,13Z M35.4,14 L33,20 L33.8,20.2 L36,15Z"/>` +
        // St. Sava: base, arms with half domes, corner turrets, great dome
        `<rect x="90" y="56" width="96" height="36"/>` +
        `<rect x="104" y="46" width="68" height="10"/>` +
        `${dome(104, 56, 10, 0)}${dome(172, 56, 10, 0)}` +
        `${dome(96, 50, 4, 6)}${dome(180, 50, 4, 6)}` +
        `<rect x="124" y="32" width="28" height="14"/>${dome(138, 32, 17, 0)}` +
        `<rect x="135" y="12" width="6" height="4"/>${dome(138, 12, 3.2, 0)}${cross(138, 8.8, 8)}` +
        `${cross(96, 46, 5)}${cross(180, 46, 5)}` +
        `</g>` +
        `<path d="M123,30 A16,16 0 0 1 132,17.5 M128,36 L128,44 M134,36 L134,44 M140,36 L140,44 M146,36 L146,44" stroke="${s.sky[1]}" stroke-width=".9" fill="none" opacity=".5"/>` +
        `<path d="M110,60 L110,70 M122,60 L122,70 M154,60 L154,70 M166,60 L166,70" stroke="${s.sky[1]}" stroke-width="1" opacity=".4"/>` +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  SJJ: {
    city: "Sarajevo",
    country: "Bosnien und Herzegowina",
    timezone: "Europe/Sarajevo",
    style: {
      sky: ["#2a1c30", "#eba06a"],
      ink: "#160d18",
      far: "#4e3448",
      tag: "Sebilj & Baščaršija",
    },
    draw: (s) => {
      // Hills with houses, mosque domes and minarets, the Sebilj fountain in the middle
      const lit: number[][] = [
        [14, 58],
        [26, 54],
        [40, 52],
        [150, 50],
        [164, 46],
        [178, 48],
        [190, 52],
        [60, 56],
        [128, 54],
      ];
      return (
        `<path fill="${s.far}" d="M0,62 Q30,40 70,48 Q100,54 120,46 Q160,30 200,44 L200,100 L0,100Z"/>` +
        windows(s, lit, 1.4, 1.6) +
        `<g fill="${s.ink}">` +
        // mosque domes and minarets
        `<rect x="6" y="66" width="44" height="26"/>${dome(28, 66, 14, 0)}${dome(12, 66, 5, 0)}` +
        `<rect x="27.5" y="46" width="1" height="7"/>` +
        minaret(56, 24) +
        `<rect x="148" y="68" width="40" height="24"/>${dome(166, 68, 12, 0)}<rect x="165.5" y="50" width="1" height="7"/>` +
        minaret(144, 28) +
        `<rect x="0" y="80" width="200" height="12"/>` +
        // Sebilj: platform, octagonal body, wide eave, green dome and finial
        `<rect x="76" y="86" width="48" height="6"/><rect x="82" y="56" width="36" height="30"/>` +
        `<path d="M76,58 L124,58 L118,52 L82,52Z"/>` +
        `<path d="M82,52 Q82,30 100,26 Q118,30 118,52Z"/>` +
        `<rect x="98.8" y="16" width="2.4" height="11"/><circle cx="100" cy="17" r="2"/><path d="M99.4,15 L100,8 L100.6,15Z"/>` +
        `</g>` +
        `<path d="M88,62 L88,80 M94,62 L94,80 M100,62 L100,80 M106,62 L106,80 M112,62 L112,80 M84,70 L116,70" stroke="${s.sky[1]}" stroke-width=".8" opacity=".7"/>` +
        `<path d="M76,58 L124,58" stroke="${s.sky[1]}" stroke-width=".8" opacity=".6"/>` +
        `<path d="M86,48 Q88,34 100,30" stroke="${s.sky[1]}" stroke-width=".8" fill="none" opacity=".45"/>` +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },
};
