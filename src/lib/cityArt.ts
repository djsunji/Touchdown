// Landmark silhouettes per destination, viewBox 0 0 200 100 (ground at y=100).
type CityStyle = { sky: [string, string]; ink: string; far: string; tag: string };

export const CITY_STYLE: Record<string, CityStyle> = {
  MUC: { sky: ["#1b3b6f", "#7fb0de"], ink: "#0c1a31", far: "#2c4f80", tag: "Frauenkirche" },
  OSL: { sky: ["#0d3442", "#83c9c8"], ink: "#071c24", far: "#1f5560", tag: "Operahuset" },
  MXP: { sky: ["#36203d", "#e48b6a"], ink: "#1c0e1f", far: "#5a3550", tag: "Duomo di Milano" },
  LJU: { sky: ["#1c3a2a", "#a9d08f"], ink: "#0d1d14", far: "#2f5a40", tag: "Ljubljanski grad" },
  BUD: { sky: ["#3a2810", "#ecb95c"], ink: "#1d1308", far: "#5e4420", tag: "Országház" },
  VCE: { sky: ["#123a4e", "#f2b07a"], ink: "#0a1d27", far: "#2a5466", tag: "Campanile di San Marco" },
  FLR: { sky: ["#471c13", "#f29d6c"], ink: "#250f09", far: "#6a3020", tag: "Duomo di Firenze" },
  TLV: { sky: ["#163a5a", "#f5c27c"], ink: "#0a1b2a", far: "#2d6c86", tag: "Azrieli & Strand" },
  NCE: { sky: ["#1f2d63", "#f2a7a0"], ink: "#120f2e", far: "#3a5a9a", tag: "Promenade des Anglais" },
  GOT: { sky: ["#132639", "#86abc6"], ink: "#08131d", far: "#2b4a63", tag: "Läppstiftet & Älvsborgsbron" },
};

// Palm tree drawn with strokes; x = trunk base, h = height
function palm(ink: string, x: number, h: number) {
  const top = 92 - h;
  const tx = x + 3;
  let d = "M" + x + ",92 Q" + (x + 4) + "," + (92 - h / 2) + " " + tx + "," + top;
  [[-12, 4], [-9, -4], [0, -7], [9, -4], [12, 5]].forEach((f) => {
    d += " M" + tx + "," + top + " Q" + (tx + f[0] / 2) + "," + (top - 4) + " " + (tx + f[0]) + "," + (top + f[1]);
  });
  return '<path d="' + d + '" stroke="' + ink + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
}

function spires(x0: number, x1: number, step: number, base: number, h: number) {
  let d = "";
  for (let x = x0; x <= x1; x += step) d += "M" + (x - 2) + "," + base + "L" + x + "," + (base - h) + "L" + (x + 2) + "," + base + "Z";
  return d;
}

const SKYLINE: Record<string, (s: CityStyle) => string> = {
  MUC: (s) => {
    return '<path fill="' + s.far + '" d="M0,72 L22,52 L38,64 L58,40 L80,62 L100,47 L122,63 L142,42 L166,60 L186,50 L200,58 L200,100 L0,100Z"/>' +
      '<g fill="' + s.ink + '"><rect x="64" y="66" width="72" height="34"/><path d="M84,66 L100,54 L116,66Z"/>' +
      '<rect x="68" y="34" width="18" height="66"/><rect x="114" y="34" width="18" height="66"/>' +
      '<ellipse cx="77" cy="32" rx="10" ry="11"/><ellipse cx="123" cy="32" rx="10" ry="11"/>' +
      '<rect x="76" y="14" width="2" height="10"/><rect x="122" y="14" width="2" height="10"/>' +
      '<rect x="0" y="88" width="64" height="12"/><rect x="136" y="84" width="64" height="16"/>' +
      '<rect x="10" y="80" width="22" height="20"/><rect x="160" y="76" width="18" height="24"/></g>';
  },
  OSL: (s) => {
    let bars = "";
    const hs = [30, 44, 26, 52, 38, 46, 30, 40];
    for (let i = 0; i < hs.length; i++) bars += '<rect x="' + (128 + i * 9) + '" y="' + (92 - hs[i]) + '" width="7" height="' + hs[i] + '"/>';
    return '<path fill="' + s.far + '" d="M0,70 Q40,58 80,66 Q130,74 200,60 L200,100 L0,100Z"/>' +
      '<g fill="' + s.ink + '">' + bars +
      '<path d="M4,92 L34,74 L86,70 L112,58 L124,92Z"/><rect x="92" y="46" width="24" height="16"/></g>' +
      '<rect x="0" y="92" width="200" height="8" fill="' + s.ink + '" opacity=".85"/>' +
      '<path d="M8,95 L60,95 M90,97 L150,97" stroke="' + s.sky[1] + '" stroke-width="1" opacity=".5"/>';
  },
  MXP: (s) => {
    return '<path fill="' + s.far + '" d="M0,80 L30,80 L30,70 L46,70 L46,78 L154,78 L154,66 L172,66 L172,76 L200,76 L200,100 L0,100Z"/>' +
      '<g fill="' + s.ink + '"><path d="M38,100 L38,66 L100,50 L162,66 L162,100Z"/>' +
      '<path d="' + spires(42, 158, 9, 66, 16) + '"/>' +
      '<path d="M96,50 L96,30 L104,30 L104,50Z M97,30 L100,8 L103,30Z"/><circle cx="100" cy="7" r="1.8"/>' +
      '<path d="M86,52 L88,36 L90,52Z M110,52 L112,36 L114,52Z"/></g>' +
      '<path d="M92,100 L92,84 Q100,74 108,84 L108,100Z" fill="' + s.far + '"/>';
  },
  LJU: (s) => {
    return '<path fill="' + s.far + '" d="M0,78 L30,62 L52,72 L78,54 L104,70 L140,50 L172,66 L200,58 L200,100 L0,100Z" opacity=".7"/>' +
      '<g fill="' + s.ink + '"><path d="M0,100 L0,78 Q50,46 104,52 Q156,58 200,82 L200,100Z"/>' +
      '<rect x="66" y="40" width="58" height="14"/><rect x="88" y="16" width="16" height="26"/>' +
      '<path d="M86,16 h4 v-4 h4 v4 h4 v-4 h4 v4 h4 v4 h-20Z"/>' +
      '<path d="M66,40 h5 v-4 h5 v4 h5 v-4 h5 v4 h38 v2 h-58Z"/>' +
      '<rect x="96" y="2" width="1.4" height="12"/><path d="M97.4,2 L106,5 L97.4,8Z"/></g>';
  },
  BUD: (s) => {
    let towers = "";
    [24, 44, 64, 136, 156, 176].forEach((x) => { towers += '<rect x="' + (x - 3) + '" y="62" width="6" height="12"/><path d="M' + (x - 3) + ',62 L' + x + ',50 L' + (x + 3) + ',62Z"/>'; });
    return '<g fill="' + s.ink + '"><rect x="10" y="72" width="180" height="20"/>' + towers +
      '<rect x="82" y="56" width="36" height="18"/><path d="M80,58 Q80,30 100,28 Q120,30 120,58Z"/>' +
      '<rect x="98" y="12" width="4" height="18"/><path d="M98,12 L100,2 L102,12Z"/>' +
      '<path d="M52,72 L52,64 L56,58 L60,64 L60,72Z M140,72 L140,64 L144,58 L148,64 L148,72Z"/></g>' +
      '<rect x="0" y="92" width="200" height="8" fill="' + s.far + '"/>' +
      '<path d="M14,95 L90,95 M110,97 L186,97" stroke="' + s.sky[1] + '" stroke-width="1" opacity=".6"/>';
  },
  VCE: (s) => {
    return '<g fill="' + s.ink + '"><rect x="0" y="74" width="40" height="18"/><rect x="40" y="68" width="30" height="24"/>' +
      '<rect x="70" y="72" width="66" height="20"/><path d="M76,72 Q76,60 84,60 Q92,60 92,72Z M95,72 Q95,56 104,56 Q113,56 113,72Z M116,72 Q116,60 124,60 Q132,60 132,72Z"/><rect x="103" y="50" width="2" height="7"/><rect x="83" y="55" width="2" height="6"/><rect x="123" y="55" width="2" height="6"/>' +
      '<rect x="138" y="26" width="16" height="66"/><rect x="136" y="22" width="20" height="6"/><path d="M137,22 L146,4 L155,22Z"/>' +
      '<rect x="156" y="70" width="44" height="22"/></g>' +
      '<rect x="0" y="92" width="200" height="8" fill="' + s.far + '"/>' +
      '<path fill="' + s.ink + '" d="M10,93 Q48,101 92,94 L98,87 Q94,99 50,99 Q22,99 10,93Z"/>' +
      '<path d="M78,95 L72,76" stroke="' + s.ink + '" stroke-width="1.6"/><circle cx="72" cy="74" r="2.4" fill="' + s.ink + '"/><rect x="70.5" y="76" width="3" height="9" fill="' + s.ink + '"/>';
  },
  TLV: (s) => {
    let blocks = "";
    [[54, 30], [66, 22], [78, 40], [92, 34], [104, 46], [178, 36], [190, 26]].forEach((b) => { blocks += '<rect x="' + b[0] + '" y="' + (92 - b[1]) + '" width="11" height="' + b[1] + '"/>'; });
    return '<g fill="' + s.ink + '">' + blocks +
      '<rect x="118" y="22" width="16" height="70"/><ellipse cx="126" cy="22" rx="8" ry="3"/>' +
      '<path d="M138,92 L138,26 L156,32 L156,92Z"/><rect x="160" y="18" width="15" height="74"/></g>' +
      palm(s.ink, 12, 30) + palm(s.ink, 30, 22) + palm(s.ink, 44, 34) +
      '<rect x="0" y="92" width="200" height="8" fill="' + s.far + '"/>' +
      '<path d="M6,95 L70,95 M100,97 L190,97" stroke="' + s.sky[1] + '" stroke-width="1" opacity=".6"/>';
  },
  NCE: (s) => {
    let houses = "";
    [[56, 20], [70, 26], [84, 22], [98, 28], [164, 24], [178, 20], [190, 26]].forEach((b) => { houses += '<rect x="' + b[0] + '" y="' + (92 - b[1]) + '" width="13" height="' + b[1] + '"/>'; });
    return '<g fill="' + s.ink + '"><path d="M0,92 L0,54 Q18,44 34,58 Q44,66 52,92Z"/>' + houses +
      '<rect x="114" y="58" width="46" height="34"/><path d="M124,58 Q124,38 137,36 Q150,38 150,58Z"/><rect x="136" y="26" width="2" height="11"/>' +
      '<circle cx="137" cy="25" r="1.6"/></g>' +
      palm(s.ink, 62, 26) + palm(s.ink, 104, 30) + palm(s.ink, 170, 28) +
      '<rect x="0" y="92" width="200" height="8" fill="' + s.far + '"/>' +
      '<path d="M10,95 L80,95 M120,97 L196,97" stroke="' + s.sky[1] + '" stroke-width="1" opacity=".6"/>';
  },
  GOT: (s) => {
    return '<g fill="' + s.ink + '"><rect x="0" y="78" width="30" height="14"/><rect x="58" y="80" width="40" height="12"/>' +
      '<rect x="34" y="20" width="18" height="72"/><rect x="34" y="20" width="18" height="12" fill="#b8323b"/>' +
      '<rect x="112" y="36" width="4" height="56"/><rect x="172" y="36" width="4" height="56"/>' +
      '<rect x="96" y="76" width="104" height="3"/></g>' +
      '<path d="M98,76 Q114,36 114,36 Q144,70 174,36 Q190,60 200,72" stroke="' + s.ink + '" stroke-width="1.2" fill="none"/>' +
      '<path d="M66,80 L66,44 L92,44 M66,52 L82,44 M86,44 L86,56" stroke="' + s.ink + '" stroke-width="2" fill="none"/>' +
      '<rect x="0" y="92" width="200" height="8" fill="' + s.far + '"/>' +
      '<path d="M8,95 L60,95 M120,97 L190,97" stroke="' + s.sky[1] + '" stroke-width="1" opacity=".5"/>';
  },
  FLR: (s) => {
    return '<path fill="' + s.far + '" d="M0,74 Q40,56 84,66 Q130,52 200,68 L200,100 L0,100Z"/>' +
      '<g fill="' + s.ink + '"><rect x="0" y="78" width="200" height="22"/>' +
      '<rect x="22" y="22" width="10" height="56"/><rect x="19" y="18" width="16" height="6"/><rect x="25" y="8" width="4" height="10"/>' +
      '<rect x="62" y="62" width="64" height="16"/><path d="M68,62 Q68,30 94,28 Q120,30 120,62Z"/>' +
      '<rect x="91" y="18" width="6" height="11"/><path d="M91,18 L94,10 L97,18Z"/>' +
      '<rect x="140" y="26" width="15" height="52"/><rect x="138" y="22" width="19" height="5"/></g>' +
      '<path d="M76,60 Q78,40 94,34 M112,60 Q110,40 94,34" stroke="' + s.sky[1] + '" stroke-width=".8" fill="none" opacity=".35"/>';
  }
};

const FALLBACK: CityStyle = { sky: ["#0a2a66", "#4a7fc4"], ink: "#06162a", far: "#2a4a6e", tag: "" };

// Generic skyline for destinations without their own artwork.
function genericSkyline(s: CityStyle) {
  const hs = [22, 34, 18, 46, 28, 38, 24, 52, 30, 20, 40, 26];
  let bars = "";
  hs.forEach((h, i) => { bars += '<rect x="' + (6 + i * 16) + '" y="' + (100 - h) + '" width="13" height="' + h + '"/>'; });
  return '<path fill="' + s.far + '" d="M0,76 Q60,62 120,70 Q160,74 200,66 L200,100 L0,100Z"/><g fill="' + s.ink + '">' + bars + "</g>";
}

/** Static SVG artwork (sky + landmark silhouette) for a destination card. */
export function cityArt(code: string): string {
  const s = CITY_STYLE[code] ?? FALLBACK;
  const draw = SKYLINE[code] ?? genericSkyline;
  const id = "g" + code;
  let stars = "";
  let seed = code.charCodeAt(0) * 7 + code.charCodeAt(1) * 3 + code.charCodeAt(2);
  for (let i = 0; i < 14; i++) { seed = (seed * 9301 + 49297) % 233280; const x = seed / 233280 * 200; seed = (seed * 9301 + 49297) % 233280; const y = seed / 233280 * 45; stars += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (i % 3 === 0 ? 0.9 : 0.5) + '" fill="#fff" opacity="' + (0.4 + (i % 4) * 0.15) + '"/>'; }
  return '<svg class="art" viewBox="0 0 200 250" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
    '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + s.sky[0] + '"/><stop offset="1" stop-color="' + s.sky[1] + '"/></linearGradient></defs>' +
    '<rect width="200" height="250" fill="url(#' + id + ')"/>' +
    '<g>' + stars + '</g><mask id="m' + code + '"><rect width="200" height="250" fill="#fff"/><circle cx="166" cy="37" r="10" fill="#000"/></mask><circle cx="160" cy="42" r="11" fill="#fff6dc" opacity=".92" mask="url(#m' + code + ')"/>' +
    '<g class="sil" transform="translate(0,150)">' + draw(s) + '</g></svg>';
}
