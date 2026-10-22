import { palm, type CityStyle, type LibraryCity } from "./shared";

// Hand-drawn skylines: Montenegro, North Macedonia, Bulgaria, Greek islands, Cyprus

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

// Row of battlements on top of a wall at height y
function merlons(x0: number, x1: number, y: number, step = 5, w = 3, h = 3) {
  let d = "";
  for (let x = x0; x <= x1 + 0.01; x += step)
    d += `<rect x="${x.toFixed(1)}" y="${y - h}" width="${w}" height="${h}"/>`;
  return d;
}

// Small arched opening (window or arcade) with its foot at y
function arch(x: number, y: number, w: number, h: number) {
  return `M${x},${y} L${x},${y - h + w / 2} Q${x + w / 2},${y - h - w / 4} ${x + w},${y - h + w / 2} L${x + w},${y}Z`;
}

// Cycladic windmill: round body standing on y=92-ish base, conical cap, four sails
function windmill(x: number, top: number, base: number, sail = 12) {
  const cy = top - 2;
  let d = `M${x - 5},${base} L${x - 4.5},${top} L${x + 4.5},${top} L${x + 5},${base}Z M${x - 5.5},${top} L${x},${top - 6} L${x + 5.5},${top}Z`;
  const ang = [20, 110, 200, 290];
  ang.forEach((a) => {
    const r = (a * Math.PI) / 180;
    const ex = x + Math.cos(r) * sail;
    const ey = cy + Math.sin(r) * sail;
    d += ` M${x},${cy} L${ex.toFixed(1)},${ey.toFixed(1)}`;
  });
  return d;
}

// Deer statue (Rhodes) standing on a column top at (x, y), facing right
function deer(x: number, y: number) {
  return (
    `<path d="M${x - 5},${y} L${x - 4.5},${y - 4} Q${x - 5},${y - 7} ${x - 2},${y - 7} L${x + 2},${y - 7} L${x + 3},${y - 12} L${x + 6},${y - 11.5} L${x + 5},${y - 10} L${x + 4},${y - 6} L${x + 4.5},${y} L${x + 3},${y} L${x + 2.5},${y - 4} L${x - 2.5},${y - 4} L${x - 3.4},${y}Z"/>` +
    `<path d="M${x + 3.5},${y - 12} L${x + 2},${y - 17} M${x + 2.6},${y - 15} L${x + 0.5},${y - 16} M${x + 4.5},${y - 12} L${x + 6},${y - 16.5} M${x + 5.4},${y - 15} L${x + 7.5},${y - 15.5}" stroke="currentColor" stroke-width=".8" fill="none"/>`
  );
}

export const BALKAN: Record<string, LibraryCity> = {
  TIV: {
    city: "Kotor",
    country: "Montenegro",
    timezone: "Europe/Podgorica",
    style: {
      sky: ["#1f2a48", "#e9a77e"],
      ink: "#0d1322",
      far: "#3c4a6c",
      tag: "Stadtmauern von Kotor",
    },
    draw: (s) => {
      // Lovćen massif with the lit town walls zig-zagging up to San Giovanni, St Tryphon below
      const wall =
        "M44,80 L58,70 L84,66 L66,58 L92,52 L76,44 L100,38 L88,31 L108,25";
      let houses = "";
      [
        [0, 12],
        [10, 16],
        [22, 10],
        [70, 14],
        [82, 10],
        [94, 16],
        [108, 12],
        [120, 9],
      ].forEach(([x, h]) => {
        houses += `<rect x="${x}" y="${84 - h}" width="11" height="${h}"/><path d="M${x - 1},${84 - h} L${x + 5.5},${80 - h} L${x + 12},${84 - h}Z"/>`;
      });
      return (
        `<path fill="${s.far}" opacity=".55" d="M120,60 L150,44 L172,52 L190,40 L200,44 L200,92 L120,92Z"/>` +
        `<path fill="${s.far}" d="M0,92 L0,66 L22,58 L50,44 L74,30 L96,22 L112,17 L122,20 L136,32 L150,46 L168,62 L186,74 L200,78 L200,92Z"/>` +
        `<path d="${wall}" stroke="${s.ink}" stroke-width="2.2" fill="none" stroke-linejoin="round"/>` +
        `<path d="${wall}" stroke="${s.sky[1]}" stroke-width=".8" fill="none" stroke-dasharray="1.6 1.4" opacity=".85"/>` +
        `<g fill="${s.ink}"><rect x="104" y="20" width="10" height="6"/>` +
        merlons(104, 112, 20, 3, 2, 2) +
        `<rect x="108.6" y="11" width=".9" height="7"/><path d="M109.5,11 L114,12.5 L109.5,14Z"/>` +
        `<rect x="0" y="84" width="200" height="8"/>` +
        houses +
        `<rect x="36" y="58" width="9" height="26"/><path d="M35,58 L40.5,48 L46,58Z"/>` +
        `<rect x="55" y="58" width="9" height="26"/><path d="M54,58 L59.5,48 L65,58Z"/>` +
        `<rect x="45" y="64" width="10" height="20"/><path d="M45,64 L50,60 L55,64Z"/>` +
        `<rect x="148" y="76" width="44" height="8"/><path d="M150,76 L152,70 L188,70 L190,76Z"/><rect x="160" y="64" width="2" height="6"/></g>` +
        `<circle cx="50" cy="69" r="2.2" fill="${s.sky[1]}" opacity=".75"/>` +
        `<path d="${arch(39, 64, 3, 5)} ${arch(58, 64, 3, 5)}" fill="${s.sky[1]}" opacity=".55"/>` +
        lights(s, [
          [4, 77],
          [14, 74],
          [74, 75],
          [98, 73],
          [112, 77],
          [156, 72],
          [170, 72],
          [182, 72],
        ]) +
        water(s, 6, 60, 100, 180) +
        boat(s.ink, 134)
      );
    },
  },
  OHD: {
    city: "Ohrid",
    country: "Nordmazedonien",
    timezone: "Europe/Skopje",
    style: {
      sky: ["#1b3247", "#eab48a"],
      ink: "#0a1520",
      far: "#38586f",
      tag: "Sveti Jovan Kaneo",
    },
    draw: (s) => {
      // St John at Kaneo on its rocky cliff above Lake Ohrid, Galičica across the water
      return (
        `<path fill="${s.far}" opacity=".6" d="M0,74 Q24,60 46,66 Q70,54 96,62 L110,64 L110,80 L0,80Z"/>` +
        `<rect x="0" y="80" width="120" height="12" fill="${s.far}"/>` +
        `<path d="M8,84 L50,84 M30,88 L90,88" stroke="${s.sky[1]}" stroke-width="1" opacity=".5"/>` +
        `<g fill="${s.ink}"><path d="M88,92 L92,82 L96,76 L100,64 L106,58 L112,56 L190,54 L200,52 L200,92Z"/>` +
        // church: apse on the lake side, nave with gable roofs, central drum and cone
        `<path d="M114,56 L114,46 Q108,46 108,51 L108,56Z"/>` +
        `<rect x="114" y="40" width="40" height="16"/>` +
        `<path d="M112,41 L124,34 L136,41Z M132,41 L144,34 L156,41Z"/>` +
        `<rect x="126" y="26" width="16" height="15"/><path d="M125,26 L134,16 L143,26Z"/>` +
        `<rect x="133.4" y="9" width="1.2" height="8"/><rect x="131.5" y="11" width="5" height="1.1"/>` +
        // cypresses and pines on the cliff
        `<path d="M162,54 Q164,38 166,54Z M170,54 Q172.5,34 175,54Z M182,52 Q185,40 188,52Z"/>` +
        `<path d="M94,78 Q97,70 100,78Z"/></g>` +
        `<path d="${arch(129, 38, 2, 6)} ${arch(133, 38, 2, 6)} ${arch(137, 38, 2, 6)}" fill="${s.sky[1]}" opacity=".7"/>` +
        `<path d="${arch(118, 54, 2.4, 6)} ${arch(146, 54, 2.4, 6)}" fill="${s.sky[1]}" opacity=".45"/>` +
        water(s, 6, 60, 70, 150) +
        boat(s.ink, 40)
      );
    },
  },
  SKP: {
    city: "Skopje",
    country: "Nordmazedonien",
    timezone: "Europe/Skopje",
    style: {
      sky: ["#2b2142", "#eaa77f"],
      ink: "#140e22",
      far: "#4d3f69",
      tag: "Kamen Most & Kale",
    },
    draw: (s) => {
      // Millennium Cross on Vodno, Kale fortress on its hill, the Stone Bridge over the Vardar
      let arches = "";
      [64, 86, 108, 130, 152, 174].forEach((x) => {
        arches += `M${x},86 L${x},80 Q${x + 9},68 ${x + 18},80 L${x + 18},86Z `;
      });
      return (
        `<path fill="${s.far}" d="M60,80 L84,62 L108,46 L124,36 L136,36 L152,48 L176,60 L200,64 L200,92 L60,92Z"/>` +
        // illuminated Millennium Cross on the summit
        `<g fill="${s.sky[1]}" opacity=".9"><rect x="128.6" y="10" width="2.8" height="27"/><rect x="123" y="16" width="14" height="2.6"/></g>` +
        `<path d="M129,12 L131,14 M129,16 L131,20 M129,22 L131,26 M129,28 L131,32" stroke="${s.far}" stroke-width=".5"/>` +
        `<g fill="${s.ink}"><path d="M0,92 L0,56 Q20,48 40,50 Q58,54 70,70 L76,92Z"/>` +
        // Kale walls with towers
        `<rect x="4" y="40" width="50" height="12"/>` +
        merlons(4, 52, 40, 4.5, 2.6, 2.6) +
        `<rect x="8" y="30" width="9" height="12"/>` +
        merlons(8, 15, 30, 3.2, 1.8, 2.2) +
        `<rect x="40" y="32" width="10" height="10"/>` +
        merlons(40, 48, 32, 3.2, 1.8, 2.2) +
        `<path d="M24,40 L24,34 Q29,30 34,34 L34,40Z"/>` +
        // Stone Bridge
        `<rect x="56" y="64" width="144" height="6"/><rect x="56" y="62" width="144" height="2" opacity=".85"/>` +
        `<rect x="56" y="70" width="144" height="16"/>` +
        `<rect x="94" y="54" width="2" height="8"/><rect x="138" y="54" width="2" height="8"/>` +
        `<rect x="114" y="58" width="6" height="4"/><path d="M113,58 L117,54 L121,58Z"/></g>` +
        `<path d="${arches}" fill="${s.far}"/>` +
        `<path d="M66,86 L198,86" stroke="${s.sky[1]}" stroke-width=".8" opacity=".45"/>` +
        lights(s, [
          [12, 46],
          [28, 44],
          [46, 46],
          [94, 52],
          [138, 52],
        ]) +
        `<rect x="56" y="86" width="144" height="6" fill="${s.far}"/>` +
        `<rect x="0" y="92" width="200" height="8" fill="${s.far}"/>` +
        `<path d="M70,90 L120,90 M10,96 L60,96 M130,96 L190,96" stroke="${s.sky[1]}" stroke-width="1" opacity=".5"/>`
      );
    },
  },
  VAR: {
    city: "Varna",
    country: "Bulgarien",
    timezone: "Europe/Sofia",
    style: {
      sky: ["#232848", "#f0b583"],
      ink: "#0f1224",
      far: "#3f4670",
      tag: "Uspenie-Kathedrale",
    },
    draw: (s) => {
      // Dormition Cathedral: gilded central dome, four small domes, tall bell tower; Black Sea right
      const helmet = (x: number, y: number, w: number) =>
        `<path d="M${x - w},${y} Q${x - w},${y - w * 1.2} ${x},${y - w * 1.9} Q${x + w},${y - w * 1.2} ${x + w},${y}Z"/><rect x="${x - 0.5}" y="${y - w * 1.9 - 6}" width="1" height="6"/><rect x="${x - 2}" y="${y - w * 1.9 - 4.5}" width="4" height="1"/>`;
      return (
        `<path fill="${s.far}" d="M150,80 L200,80 L200,92 L150,92Z"/>` +
        `<path d="M156,84 L196,84 M164,88 L188,88" stroke="${s.sky[1]}" stroke-width="1" opacity=".5"/>` +
        `<g fill="${s.far}"><circle cx="8" cy="76" r="9"/><circle cx="22" cy="72" r="10"/><circle cx="38" cy="78" r="8"/></g>` +
        `<g fill="${s.ink}"><rect x="0" y="84" width="150" height="8"/>` +
        // bell tower
        `<rect x="56" y="40" width="16" height="44"/><rect x="54" y="38" width="20" height="3"/>` +
        `<rect x="58" y="26" width="12" height="12"/><rect x="57" y="24" width="14" height="2.4"/>` +
        helmet(64, 24, 5) +
        // cathedral body and domes
        `<rect x="76" y="54" width="68" height="30"/><path d="M74,56 L110,46 L146,56Z"/>` +
        `<rect x="100" y="38" width="20" height="12"/>` +
        helmet(110, 38, 11) +
        `<rect x="82" y="44" width="10" height="10"/>` +
        helmet(87, 44, 5) +
        `<rect x="128" y="44" width="10" height="10"/>` +
        helmet(133, 44, 5) +
        `</g>` +
        `<path d="M101,37 Q103,26 110,18" stroke="${s.sky[1]}" stroke-width="1.2" fill="none" opacity=".7"/>` +
        `<path d="${arch(103, 48, 3, 6)} ${arch(108.5, 48, 3, 6)} ${arch(114, 48, 3, 6)} ${arch(61, 36, 2.4, 7)} ${arch(65, 36, 2.4, 7)} ${arch(84, 72, 4, 10)} ${arch(132, 72, 4, 10)}" fill="${s.sky[1]}" opacity=".6"/>` +
        `<circle cx="110" cy="64" r="4" fill="${s.sky[1]}" opacity=".55"/>` +
        water(s, 8, 70, 150, 196) +
        boat(s.ink, 176)
      );
    },
  },
  CFU: {
    city: "Korfu",
    country: "Griechenland",
    timezone: "Europe/Athens",
    style: {
      sky: ["#203852", "#f0a77e"],
      ink: "#0c1828",
      far: "#3e5f7d",
      tag: "Palaio Frourio & Liston",
    },
    draw: (s) => {
      // Liston arcades, the Agios Spyridon bell tower, the twin-peaked Old Fortress on the sea
      let arcade = "";
      for (let x = 2; x < 66; x += 8) arcade += arch(x, 86, 5, 12) + " ";
      let win = "";
      for (let x = 4; x < 66; x += 8) win += `M${x},64 h3 v5 h-3Z `;
      return (
        `<g fill="${s.far}"><rect x="70" y="60" width="30" height="26"/><path d="M68,60 L84,54 L100,60Z"/></g>` +
        `<g fill="${s.ink}"><rect x="0" y="86" width="200" height="6"/>` +
        // Liston
        `<rect x="0" y="56" width="68" height="30"/><path d="M0,56 L0,52 L68,52 L68,56Z"/>` +
        // Agios Spyridon bell tower
        `<rect x="80" y="30" width="10" height="56"/><rect x="78.5" y="28" width="13" height="2.4"/>` +
        `<rect x="81" y="20" width="8" height="8"/><path d="M80,20 Q85,12 90,20Z"/>` +
        `<rect x="84.4" y="7" width="1.2" height="7"/><rect x="82.5" y="9" width="5" height="1"/>` +
        // Old Fortress rock with two peaks, walls, lighthouse
        `<path d="M112,86 L118,72 L126,62 L136,44 L144,40 L150,48 L160,56 L170,50 L178,52 L188,64 L196,78 L200,86Z"/>` +
        `<rect x="136" y="34" width="12" height="8"/>` +
        merlons(136, 146, 34, 3.4, 2, 2) +
        `<rect x="140" y="24" width="4" height="10"/><rect x="139" y="22" width="6" height="2"/>` +
        `<rect x="165" y="44" width="10" height="8"/>` +
        merlons(165, 173, 44, 2.9, 1.8, 2) +
        // St George temple at the foot
        `<rect x="150" y="70" width="28" height="16"/><path d="M148,70 L164,63 L180,70Z"/></g>` +
        `<rect x="140.6" y="26" width="2.8" height="3.5" fill="${s.sky[1]}" opacity=".9"/>` +
        `<path d="${arcade}" fill="${s.sky[1]}" opacity=".55"/>` +
        `<path d="${win}" fill="${s.sky[1]}" opacity=".35"/>` +
        `<path d="${arch(82, 27, 2.2, 5)} ${arch(85.8, 27, 2.2, 5)}" fill="${s.sky[1]}" opacity=".6"/>` +
        `<g fill="${s.far}">${[153, 158, 163, 168, 173].map((x) => `<rect x="${x}" y="72" width="2.2" height="14"/>`).join("")}</g>` +
        water(s, 6, 60, 110, 190) +
        boat(s.ink, 100)
      );
    },
  },
  RHO: {
    city: "Rhodos",
    country: "Griechenland",
    timezone: "Europe/Athens",
    style: {
      sky: ["#2e2244", "#efb07a"],
      ink: "#160f22",
      far: "#54426e",
      tag: "Großmeisterpalast",
    },
    draw: (s) => {
      // Palace of the Grand Master with its round gate towers; Mandraki windmills and deer columns
      return (
        `<g fill="${s.far}"><rect x="0" y="62" width="14" height="24"/><rect x="104" y="66" width="14" height="20"/></g>` +
        `<g fill="${s.ink}" color="${s.ink}"><rect x="0" y="86" width="200" height="6"/>` +
        // palace
        `<rect x="12" y="52" width="94" height="34"/>` +
        merlons(12, 103, 52, 5, 3, 3) +
        `<rect x="40" y="36" width="12" height="50"/><path d="M40,36 Q46,33 52,36Z"/>` +
        merlons(40, 50, 36, 3.6, 2.2, 3) +
        `<rect x="66" y="36" width="12" height="50"/><path d="M66,36 Q72,33 78,36Z"/>` +
        merlons(66, 76, 36, 3.6, 2.2, 3) +
        `<rect x="88" y="40" width="10" height="12"/>` +
        merlons(88, 96, 40, 3, 2, 2.4) +
        // mole with windmills
        `<rect x="128" y="80" width="72" height="6"/>` +
        `<g stroke="${s.ink}" stroke-width="1">` +
        `<path d="${windmill(148, 66, 80, 10)} ${windmill(166, 64, 80, 10)} ${windmill(184, 66, 80, 10)}"/></g>` +
        // deer columns at the harbour entrance
        `<rect x="120" y="44" width="5" height="42"/><rect x="119" y="42" width="7" height="2.4"/>` +
        deer(122.5, 42) +
        `</g>` +
        `<path d="M53,86 L53,72 Q59,64 65,72 L65,86Z" fill="${s.far}"/>` +
        `<path d="${arch(44, 50, 3, 5)} ${arch(70, 50, 3, 5)} ${arch(22, 70, 3, 6)} ${arch(30, 70, 3, 6)} ${arch(84, 70, 3, 6)} ${arch(94, 70, 3, 6)}" fill="${s.sky[1]}" opacity=".6"/>` +
        water(s, 6, 70, 120, 190) +
        boat(s.ink, 136)
      );
    },
  },
  JTR: {
    city: "Santorin",
    country: "Griechenland",
    timezone: "Europe/Athens",
    style: {
      sky: ["#2b2a55", "#f6a77d"],
      ink: "#161430",
      far: "#4c4a7c",
      tag: "Oia & Caldera",
    },
    draw: (s) => {
      // White houses and blue domes on the caldera rim, Nea Kameni out in the sea
      const white = "#f3ece2";
      const blue = "#2f63b8";
      let cubes = "";
      [
        [4, 46, 10, 8],
        [16, 44, 8, 10],
        [26, 48, 12, 7],
        [56, 50, 10, 6],
        [70, 46, 9, 10],
        [104, 48, 11, 8],
        [118, 52, 10, 7],
        [10, 58, 9, 6],
        [32, 60, 10, 6],
        [48, 62, 8, 5],
        [64, 60, 12, 6],
        [82, 64, 10, 5],
        [100, 62, 9, 6],
        [116, 66, 10, 5],
        [130, 62, 8, 7],
      ].forEach(([x, y, w, h]) => {
        cubes += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx=".8"/>`;
      });
      return (
        `<path fill="${s.far}" opacity=".7" d="M150,86 Q170,78 186,82 Q194,82 200,84 L200,92 L150,92Z"/>` +
        `<g fill="${s.ink}"><path d="M0,92 L0,54 L40,54 L60,56 L100,56 L140,60 L148,68 L156,80 L162,92Z"/>` +
        `<path d="M42,54 L42,40 L46,40 L46,54Z"/>` +
        `<path stroke="${s.ink}" stroke-width="1" d="${windmill(142, 48, 61, 9)}"/></g>` +
        `<g fill="${white}" opacity=".9">${cubes}` +
        // churches with bell gable
        `<rect x="38" y="44" width="16" height="10"/><path d="M40,44 L40,36 L44,36 L44,32 L48,32 L48,36 L52,36 L52,44Z"/>` +
        `<rect x="86" y="46" width="14" height="10"/></g>` +
        `<path d="${arch(41.2, 41, 1.8, 3)} ${arch(45.2, 37, 1.6, 3)} ${arch(49, 41, 1.8, 3)}" fill="${s.ink}"/>` +
        `<g fill="${blue}"><path d="M55,50 Q61,37 67,50Z"/><path d="M85,46 Q93,28 101,46Z"/><path d="M116,52 Q123,40 130,52Z"/><path d="M30,60 Q36,49 42,60Z"/></g>` +
        `<g fill="${white}"><rect x="92.5" y="30" width="1" height="5"/><rect x="91.3" y="31.2" width="3.4" height="1"/></g>` +
        `<rect x="0" y="92" width="200" height="8" fill="${s.far}"/>` +
        `<path d="M164,95 L196,95 M150,98 L180,98" stroke="${s.sky[1]}" stroke-width="1" opacity=".55"/>` +
        boat(s.ink, 176)
      );
    },
  },
  JMK: {
    city: "Mykonos",
    country: "Griechenland",
    timezone: "Europe/Athens",
    style: {
      sky: ["#183a55", "#f2b989"],
      ink: "#091a28",
      far: "#36607e",
      tag: "Kato Mili",
    },
    draw: (s) => {
      // The Kato Mili windmills on their ridge above Little Venice
      let houses = "";
      [
        [118, 54, 18],
        [136, 58, 14],
        [150, 52, 16],
        [166, 60, 14],
        [180, 56, 20],
      ].forEach(([x, y, w]) => {
        houses += `<rect x="${x}" y="${y}" width="${w}" height="${86 - y}"/><rect x="${x - 2}" y="${y + 10}" width="${w + 4}" height="1.4"/><rect x="${x + 2}" y="${y + 11}" width="${w - 4}" height="4" opacity=".6"/>`;
      });
      return (
        `<g fill="${s.ink}"><path d="M0,92 L0,68 Q20,60 40,56 Q70,52 96,58 L112,66 L118,86 L118,92Z"/>` +
        `<g stroke="${s.ink}" stroke-width="1.2">` +
        `<path d="${windmill(18, 46, 62, 13)} ${windmill(46, 40, 56, 13)} ${windmill(74, 40, 56, 13)} ${windmill(100, 46, 62, 13)}"/></g>` +
        houses +
        `<rect x="112" y="86" width="88" height="6"/></g>` +
        lights(s, [
          [122, 58],
          [128, 70],
          [140, 64],
          [154, 58],
          [160, 72],
          [170, 66],
          [184, 62],
          [192, 74],
        ]) +
        `<path d="${arch(16, 60, 4, 6)} ${arch(44, 54, 4, 6)} ${arch(72, 54, 4, 6)} ${arch(98, 60, 4, 6)}" fill="${s.sky[1]}" opacity=".5"/>` +
        water(s, 4, 60, 116, 196)
      );
    },
  },
  CHQ: {
    city: "Chania",
    country: "Griechenland",
    timezone: "Europe/Athens",
    style: {
      sky: ["#2a2648", "#f1ad7c"],
      ink: "#141228",
      far: "#4b4672",
      tag: "Venezianischer Hafen",
    },
    draw: (s) => {
      // Küçük Hasan mosque on the harbour, Venetian lighthouse on the mole, the White Mountains behind
      let blocks = "";
      [
        [0, 22],
        [12, 30],
        [96, 26],
        [108, 20],
        [120, 28],
      ].forEach(([x, h]) => {
        blocks += `<rect x="${x}" y="${86 - h}" width="11" height="${h}"/>`;
      });
      return (
        `<path fill="${s.far}" opacity=".6" d="M0,66 L24,52 L44,58 L70,40 L96,54 L120,46 L140,60 L140,86 L0,86Z"/>` +
        `<path fill="#fff" opacity=".35" d="M66,43 L70,40 L74,44 L71,43Z M116,49 L120,46 L124,50 L121,49Z"/>` +
        `<g fill="${s.far}">${blocks}</g>` +
        `<g fill="${s.ink}"><rect x="0" y="86" width="140" height="6"/>` +
        // mosque: square hall, big dome, row of small domes on the arcade
        `<rect x="34" y="60" width="54" height="26"/>` +
        `<rect x="45" y="52" width="32" height="8"/><path d="M44,53 Q61,26 78,53Z"/>` +
        `<path d="M34,61 Q38,54 42,61Z M44,61 Q48,54 52,61Z M70,61 Q74,54 78,61Z M80,61 Q84,54 88,61Z"/>` +
        // mole and lighthouse
        `<rect x="140" y="86" width="60" height="6"/>` +
        `<path d="M156,86 L158,76 L172,76 L174,86Z"/>` +
        `<path d="M160,76 L161,36 L169,36 L170,76Z"/><rect x="158" y="34" width="14" height="2.4"/>` +
        `<rect x="161" y="26" width="8" height="8"/><path d="M160,26 L165,20 L170,26Z"/></g>` +
        `<rect x="162.5" y="28" width="5" height="4" fill="${s.sky[1]}"/>` +
        `<path d="M162,30 L138,26 L138,34Z M168,30 L196,25 L196,35Z" fill="${s.sky[1]}" opacity=".18"/>` +
        `<path d="${arch(36, 84, 4, 12)} ${arch(44, 84, 4, 12)} ${arch(52, 84, 4, 12)} ${arch(66, 84, 4, 12)} ${arch(74, 84, 4, 12)} ${arch(82, 84, 4, 12)}" fill="${s.sky[1]}" opacity=".45"/>` +
        palm(s.ink, 96, 30) +
        palm(s.ink, 112, 24) +
        lights(s, [
          [4, 70],
          [16, 62],
          [100, 66],
          [124, 64],
        ]) +
        water(s, 6, 60, 100, 196) +
        boat(s.ink, 130)
      );
    },
  },
  PFO: {
    city: "Paphos",
    country: "Zypern",
    timezone: "Asia/Nicosia",
    style: {
      sky: ["#1d3654", "#f5bb87"],
      ink: "#0b1828",
      far: "#3a5c7e",
      tag: "Kastell von Paphos",
    },
    draw: (s) => {
      // Medieval castle at the end of the harbour pier, palm promenade, Ktima on the hill
      return (
        `<path fill="${s.far}" d="M0,76 Q30,62 60,66 L60,86 L0,86Z M140,86 L140,66 Q170,58 200,64 L200,86Z"/>` +
        lights(s, [
          [10, 74],
          [26, 70],
          [44, 72],
          [150, 70],
          [168, 66],
          [186, 70],
        ]) +
        `<g fill="${s.ink}"><rect x="0" y="86" width="200" height="6"/>` +
        `<rect x="80" y="44" width="40" height="42"/>` +
        merlons(80, 117, 44, 4.6, 2.8, 3.4) +
        `<rect x="92" y="32" width="16" height="12"/>` +
        merlons(92, 105, 32, 4.3, 2.4, 3) +
        `<rect x="99.4" y="20" width="1.2" height="9"/><path d="M100.6,20 L107,22 L100.6,24Z"/>` +
        `<path d="M66,86 L80,76 L80,80 L72,86Z"/></g>` +
        `<path d="${arch(97, 86, 6, 12)}" fill="${s.far}"/>` +
        `<path d="M86,58 h3 v6 h-3Z M111,58 h3 v6 h-3Z M98.5,50 h3 v6 h-3Z" fill="${s.sky[1]}" opacity=".6"/>` +
        palm(s.ink, 14, 30) +
        palm(s.ink, 34, 38) +
        palm(s.ink, 54, 28) +
        palm(s.ink, 140, 30) +
        palm(s.ink, 160, 38) +
        palm(s.ink, 182, 30) +
        water(s, 6, 70, 110, 190) +
        boat(s.ink, 124)
      );
    },
  },
};
