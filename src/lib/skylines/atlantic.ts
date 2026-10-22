import { palm, type LibraryCity } from "./shared";

// Hand-drawn skylines: Algarve, Madeira, Azores, Canary Islands and southern/northern Spain

// Battlement merlons along y between x0 and x1 (closed path, append to an ink group)
function crenel(x0: number, x1: number, y: number, step = 4, h = 3) {
  let d = "";
  for (let x = x0; x + step / 2 <= x1; x += step)
    d += `M${x},${y} h${step / 2} v-${h} h-${step / 2}Z`;
  return d;
}

// Water strip below the ground line with two light reflections
function water(
  fill: string,
  glow: string,
  a = "8,95 L70,95",
  b = "110,97 L190,97",
) {
  return (
    `<rect x="0" y="92" width="200" height="8" fill="${fill}"/>` +
    `<path d="M${a} M${b}" stroke="${glow}" stroke-width="1" opacity=".55"/>`
  );
}

// Volcano cone with a shallow crater, centred on x, half-width w, height h above the ground
function cone(x: number, w: number, h: number) {
  const t = 92 - h;
  return (
    `M${x - w},92 Q${x - w * 0.5},${92 - h * 0.45} ${x - w * 0.22},${t} ` +
    `Q${x},${t + 3} ${x + w * 0.22},${t} Q${x + w * 0.5},${92 - h * 0.45} ${x + w},92Z `
  );
}

// Standing white stork (stroke + fill in ink), feet at (x, y)
function stork(ink: string, x: number, y: number) {
  return (
    `<g fill="${ink}"><ellipse cx="${x}" cy="${y - 5}" rx="4.2" ry="2"/><circle cx="${x + 4}" cy="${y - 12.4}" r="1.1"/></g>` +
    `<path d="M${x + 3},${y - 6} Q${x + 4.6},${y - 9} ${x + 4},${y - 12} M${x + 5},${y - 12.2} L${x + 8.4},${y - 11} M${x - 0.6},${y - 3.6} L${x - 0.6},${y} M${x + 1},${y - 3.6} L${x + 1},${y} M${x - 4},${y - 5} L${x - 6},${y - 3.4}" stroke="${ink}" stroke-width=".8" fill="none" stroke-linecap="round"/>`
  );
}

// Slim cypress tree standing on y
function cypress(x: number, y: number, h: number) {
  return `<ellipse cx="${x}" cy="${y - h / 2}" rx="${h / 7}" ry="${h / 2}"/>`;
}

export const ATLANTIC: Record<string, LibraryCity> = {
  FAO: {
    city: "Faro",
    country: "Portugal",
    timezone: "Europe/Lisbon",
    style: {
      sky: ["#2b2a55", "#f6b98a"],
      ink: "#15132b",
      far: "#4d4a78",
      tag: "Arco da Vila",
    },
    draw: (s) => {
      return (
        // Sé bell tower with a stork nest and old-town roofs behind
        `<g fill="${s.far}"><rect x="22" y="40" width="16" height="52"/><path d="M21,40 L30,30 L39,40Z"/><ellipse cx="30" cy="30" rx="5" ry="1.8"/>` +
        `<rect x="0" y="70" width="20" height="22"/><rect x="40" y="66" width="22" height="26"/><rect x="138" y="68" width="24" height="24"/><rect x="164" y="72" width="36" height="20"/></g>` +
        `<g fill="${s.sky[1]}" opacity=".35"><path d="M27,52 v-5 q3,-3.5 6,0 v5Z"/></g>` +
        `<g fill="${s.ink}">` +
        // town wall
        `<rect x="0" y="80" width="72" height="12"/><rect x="128" y="80" width="72" height="12"/>` +
        // Arco da Vila: gate body, cornice, balustrades with urns, belfry, curved pediment
        `<path fill-rule="evenodd" d="M70,92 L70,52 L130,52 L130,92Z M90,92 L90,68 Q100,57 110,68 L110,92Z"/>` +
        `<rect x="67" y="48" width="66" height="4.4"/>` +
        `<rect x="70" y="43" width="16" height="5"/><rect x="114" y="43" width="16" height="5"/>` +
        `<circle cx="72.5" cy="41.6" r="1.6"/><circle cx="127.5" cy="41.6" r="1.6"/>` +
        `<rect x="86" y="30" width="28" height="18"/><rect x="84" y="29" width="32" height="2.4"/>` +
        `<path d="M84,29.5 Q100,18 116,29.5Z"/>` +
        `<ellipse cx="100" cy="21.5" rx="7.5" ry="2.6"/></g>` +
        // bell niche, pilasters, St Thomas statue niche
        `<g fill="${s.sky[1]}" opacity=".6"><path d="M94,46 v-8 q6,-7 12,0 v8Z"/><path d="M98,62 v-3 q2,-2.6 4,0 v3Z" opacity=".7"/></g>` +
        `<path fill="${s.ink}" d="M98,46 L98,42 Q100,38.6 102,42 L102,46Z"/>` +
        `<path d="M76,56 V90 M84,56 V90 M116,56 V90 M124,56 V90" stroke="${s.sky[1]}" stroke-width=".7" opacity=".3"/>` +
        stork(s.ink, 100, 20.6) +
        stork(s.far, 30, 29) +
        // flying stork
        `<path d="M150,30 Q156,25 162,29 Q168,25 174,28 M162,29 L168,31" stroke="${s.ink}" stroke-width="1.1" fill="none" stroke-linecap="round"/>` +
        palm(s.ink, 146, 30) +
        palm(s.ink, 176, 24) +
        palm(s.ink, 190, 28) +
        // Ria Formosa: lagoon with salt-marsh islets and a fishing boat
        water(s.far, s.sky[1], "6,97 L60,97", "100,95 L190,95") +
        `<path fill="${s.ink}" opacity=".55" d="M30,93.5 Q50,92 70,93.5Z M140,93.4 Q160,92 186,93.4Z"/>` +
        `<path fill="${s.ink}" d="M78,95 L96,95 L93,98 L81,98Z M86,95 L86,88 L87,88 L87,95Z"/>`
      );
    },
  },

  FNC: {
    city: "Funchal",
    country: "Portugal",
    timezone: "Atlantic/Madeira",
    style: {
      sky: ["#163a3c", "#f2c08a"],
      ink: "#0b1e1f",
      far: "#2f6a5a",
      tag: "Sé do Funchal",
    },
    draw: (s) => {
      // houses dotted up the steep green amphitheatre
      let lights = "";
      for (let i = 0; i < 46; i++) {
        const x = (i * 37) % 196;
        const y = 34 + ((i * 23) % 36) + Math.abs(100 - x) / 12;
        if (y < 76)
          lights += `<rect x="${x}" y="${y.toFixed(1)}" width="3" height="2"/>`;
      }
      return (
        `<path fill="${s.far}" opacity=".7" d="M0,34 Q30,14 70,22 Q110,8 150,18 Q180,12 200,20 L200,92 L0,92Z"/>` +
        `<path fill="${s.far}" d="M0,50 Q40,36 80,46 Q120,34 160,40 Q186,36 200,42 L200,92 L0,92Z"/>` +
        `<g fill="${s.sky[1]}" opacity=".5">${lights}</g>` +
        // Monte church up on the hill
        `<g fill="${s.ink}" opacity=".6"><rect x="178" y="18" width="12" height="8"/><rect x="178" y="12" width="3" height="6"/><rect x="187" y="12" width="3" height="6"/><path d="M177.6,12 L179.5,8 L181.4,12Z M186.6,12 L188.5,8 L190.4,12Z M178,18 L184,14 L190,18Z"/></g>` +
        // cable car to Monte
        `<path d="M106,82 L184,24" stroke="${s.ink}" stroke-width=".7"/>` +
        `<path d="M130,64.2 v3 M158,43.4 v3" stroke="${s.ink}" stroke-width=".6"/>` +
        `<g fill="${s.ink}"><rect x="127" y="67" width="6" height="5" rx="1"/><rect x="155" y="46.2" width="6" height="5" rx="1"/></g>` +
        `<g fill="${s.sky[1]}" opacity=".7"><rect x="128.2" y="68.2" width="3.6" height="1.6"/><rect x="156.2" y="47.4" width="3.6" height="1.6"/></g>` +
        `<g fill="${s.ink}">` +
        // Sé: nave and gable, side tower with tiled pyramid spire
        `<rect x="24" y="58" width="44" height="34"/><path d="M22,58 L46,46 L70,58Z"/>` +
        `<rect x="66" y="30" width="16" height="62"/><rect x="65" y="29" width="18" height="2.4"/>` +
        `<path d="M65.6,29 L74,10 L82.4,29Z"/><rect x="73.4" y="4" width="1.2" height="7"/><rect x="71.6" y="5.6" width="4.8" height="1.1"/>` +
        // seafront houses and harbour wall
        `<rect x="0" y="74" width="20" height="18"/><path d="M-1,74 L10,68 L21,74Z"/>` +
        `<rect x="86" y="72" width="16" height="20"/><path d="M85,72 L94,66 L103,72Z"/>` +
        `<rect x="104" y="78" width="96" height="14"/></g>` +
        // azulejo checker on the spire, belfry, rose window
        `<g fill="${s.sky[1]}" opacity=".55"><path d="M74,14 l1.4,2.6 l-1.4,2.6 l-1.4,-2.6Z M71.6,21 l1.4,2.6 l-1.4,2.6 l-1.4,-2.6Z M76.4,21 l1.4,2.6 l-1.4,2.6 l-1.4,-2.6Z"/>` +
        `<path d="M70.5,40 v-5 q3.5,-4 7,0 v5Z"/><circle cx="46" cy="56" r="3"/><path d="M42,92 v-12 q4,-5 8,0 v12Z" opacity=".5"/></g>` +
        palm(s.ink, 12, 22) +
        water(s.far, s.sky[1], "10,95 L90,95", "120,97 L194,97")
      );
    },
  },

  PDL: {
    city: "Ponta Delgada",
    country: "Portugal",
    timezone: "Atlantic/Azores",
    style: {
      sky: ["#2b2f5c", "#e7a9b5"],
      ink: "#141632",
      far: "#4f5486",
      tag: "Portas da Cidade",
    },
    draw: (s) => {
      return (
        // Sete Cidades crater rims and volcanic cones
        `<path fill="${s.far}" opacity=".7" d="M0,60 Q16,44 34,44 L50,44 Q66,44 80,56 Q100,34 120,34 L138,34 Q156,36 170,50 Q186,42 200,44 L200,92 L0,92Z"/>` +
        // Igreja Matriz bell tower and town roofs
        `<g fill="${s.far}"><rect x="164" y="40" width="14" height="52"/><path d="M163,40 Q171,30 179,40Z"/><rect x="170.5" y="26" width="1" height="6"/>` +
        `<rect x="0" y="68" width="40" height="24"/><rect x="156" y="66" width="44" height="26"/></g>` +
        `<g fill="${s.ink}">` +
        // Portas da Cidade: three arches, cornice, attic with crown
        `<path fill-rule="evenodd" d="M46,92 L46,50 L154,50 L154,92Z M87,92 L87,66 Q100,52 113,66 L113,92Z M58,92 L58,72 Q67,62 76,72 L76,92Z M124,92 L124,72 Q133,62 142,72 L142,92Z"/>` +
        `<rect x="43" y="46" width="114" height="4.4"/>` +
        `<rect x="68" y="38" width="64" height="8"/><rect x="66" y="36" width="68" height="2.4"/>` +
        `<rect x="86" y="27" width="28" height="9"/><path d="M84,28 Q100,14 116,28Z"/>` +
        `<path d="M95,16 L95,11 L97.5,13.4 L100,9 L102.5,13.4 L105,11 L105,16Z"/><rect x="99.4" y="5" width="1.2" height="4.4"/>` +
        // pinnacles on the corners
        `<path d="M46,46 L49,37 L52,46Z M148,46 L151,37 L154,46Z M70,36 L72.5,29 L75,36Z M125,36 L127.5,29 L130,36Z"/></g>` +
        // white stucco lines between the black basalt
        `<path d="M52,54 V90 M82,54 V90 M118,54 V90 M148,54 V90 M46,50.5 H154 M68,38.5 H132" stroke="${s.sky[1]}" stroke-width=".8" opacity=".4"/>` +
        `<g fill="${s.sky[1]}" opacity=".6"><circle cx="100" cy="31.5" r="2.6"/><path d="M175,52 v-4 q-2,-3 -4,0 v4Z"/></g>` +
        water(s.far, s.sky[1], "4,95 L40,95", "160,97 L196,97") +
        `<rect x="40" y="92" width="120" height="3" fill="${s.ink}"/>`
      );
    },
  },

  LPA: {
    city: "Las Palmas",
    country: "Spanien",
    timezone: "Atlantic/Canary",
    style: {
      sky: ["#20305e", "#f7b46e"],
      ink: "#0f1630",
      far: "#3e5590",
      tag: "Catedral Santa Ana",
    },
    draw: (s) => {
      return (
        // risco hills with coloured houses
        `<path fill="${s.far}" opacity=".7" d="M0,62 Q30,48 60,56 L140,56 Q170,46 200,54 L200,92 L0,92Z"/>` +
        `<g fill="${s.far}"><rect x="2" y="64" width="12" height="28"/><rect x="16" y="60" width="10" height="32"/><rect x="152" y="58" width="12" height="34"/><rect x="186" y="62" width="14" height="30"/></g>` +
        `<g fill="${s.ink}">` +
        // dome behind the facade
        `<path d="M84,44 Q84,26 100,24 Q116,26 116,44Z"/><rect x="97" y="16" width="6" height="8"/><path d="M97,16 Q100,11 103,16Z"/><rect x="99.5" y="8" width="1" height="4"/>` +
        // facade, pediment, twin towers with lanterns
        `<rect x="74" y="52" width="52" height="40"/><path d="M72,52 L100,40 L128,52Z"/>` +
        `<rect x="56" y="30" width="20" height="62"/><rect x="124" y="30" width="20" height="62"/>` +
        `<rect x="55" y="28" width="22" height="2.6"/><rect x="123" y="28" width="22" height="2.6"/>` +
        `<rect x="59" y="18" width="14" height="10"/><rect x="127" y="18" width="14" height="10"/>` +
        `<path d="M59,18.4 Q66,8 73,18.4Z M127,18.4 Q134,8 141,18.4Z"/>` +
        `<rect x="65.5" y="4" width="1" height="7"/><rect x="133.5" y="4" width="1" height="7"/>` +
        `<rect x="64" y="5.6" width="4" height="1"/><rect x="132" y="5.6" width="4" height="1"/></g>` +
        `<g fill="${s.sky[1]}" opacity=".6"><path d="M63,26 v-5 q3,-3.4 6,0 v5Z M131,26 v-5 q3,-3.4 6,0 v5Z"/>` +
        `<path d="M62,46 v-7 q4,-4.6 8,0 v7Z M130,46 v-7 q4,-4.6 8,0 v7Z"/><circle cx="100" cy="58" r="3.4"/>` +
        `<path d="M94,92 v-14 q6,-7 12,0 v14Z" opacity=".55"/></g>` +
        palm(s.ink, 10, 30) +
        palm(s.ink, 30, 22) +
        palm(s.ink, 160, 28) +
        palm(s.ink, 178, 34) +
        palm(s.ink, 192, 24) +
        // Las Canteras beach and the surf
        `<rect x="0" y="92" width="200" height="8" fill="${s.far}"/>` +
        `<path d="M0,92 L200,92 L200,94 Q100,96.4 0,94Z" fill="${s.sky[1]}" opacity=".4"/>` +
        `<path d="M12,97.5 L80,97.5 M110,98 L190,98" stroke="${s.sky[1]}" stroke-width="1" opacity=".5"/>`
      );
    },
  },

  TFS: {
    city: "Teneriffa",
    country: "Spanien",
    timezone: "Atlantic/Canary",
    style: {
      sky: ["#1d2a4f", "#f5a86a"],
      ink: "#0c1226",
      far: "#46507e",
      tag: "Teide & Auditorio",
    },
    draw: (s) => {
      return (
        // Pico del Teide with Pico Viejo shoulder and snow cap
        `<path fill="${s.far}" d="M0,92 L0,78 Q30,72 50,56 Q58,50 62,52 L72,40 L84,22 Q92,16 100,22 L114,42 Q140,66 200,74 L200,92Z"/>` +
        `<path fill="#fff" opacity=".55" d="M80,28 L84,22 Q92,16 100,22 L105,29 L100,27 L96,31 L91,27 L86,31Z"/>` +
        `<g fill="${s.ink}">` +
        // low city blocks
        `<rect x="0" y="76" width="16" height="16"/><rect x="18" y="70" width="12" height="22"/><rect x="32" y="74" width="20" height="18"/><rect x="54" y="78" width="40" height="14"/>` +
        // Auditorio de Tenerife: shell body and the soaring wave
        `<path d="M104,92 Q106,72 124,66 Q154,58 176,66 Q188,72 190,92Z"/>` +
        `<path d="M118,70 Q114,40 142,24 Q164,12 190,16 Q197,18 194,23 Q172,20 156,30 Q136,44 134,68Z"/></g>` +
        `<path d="M122,64 Q120,42 144,28 Q164,17 188,19" stroke="${s.sky[1]}" stroke-width=".9" fill="none" opacity=".55"/>` +
        `<path d="M128,72 Q152,64 180,72" stroke="${s.sky[1]}" stroke-width=".8" fill="none" opacity=".4"/>` +
        `<g fill="${s.sky[1]}" opacity=".5"><rect x="21" y="74" width="2" height="3"/><rect x="25" y="74" width="2" height="3"/><rect x="21" y="80" width="2" height="3"/><rect x="36" y="78" width="2" height="3"/><rect x="42" y="78" width="2" height="3"/><path d="M146,92 v-12 h20 v12Z" opacity=".6"/></g>` +
        palm(s.ink, 96, 26) +
        palm(s.ink, 196, 20) +
        water(s.far, s.sky[1], "8,95 L84,95", "112,97 L194,97")
      );
    },
  },

  ACE: {
    city: "Lanzarote",
    country: "Spanien",
    timezone: "Atlantic/Canary",
    style: {
      sky: ["#3d1626", "#f59a5b"],
      ink: "#1e0a12",
      far: "#6b2b35",
      tag: "Jardín de Cactus",
    },
    draw: (s) => {
      let houses = "";
      [
        [62, 74, 16],
        [80, 70, 14],
        [96, 76, 18],
        [170, 74, 14],
        [186, 78, 14],
      ].forEach(([x, y, w]) => {
        houses += `<rect x="${x}" y="${y}" width="${w}" height="${92 - y}"/><rect x="${x + w - 4}" y="${y - 4}" width="2.4" height="4"/>`;
      });
      return (
        // Timanfaya volcano cones
        `<path fill="${s.far}" opacity=".7" d="${cone(60, 50, 46) + cone(150, 54, 54)}"/>` +
        `<path fill="${s.far}" d="${cone(20, 34, 32) + cone(104, 40, 38) + cone(190, 30, 30)}"/>` +
        // white Canarian houses with green doors
        `<g fill="#f2ece2" opacity=".9">${houses}</g>` +
        `<g fill="#2f6b4f"><rect x="67" y="84" width="4" height="8"/><rect x="85" y="82" width="4" height="10"/><rect x="104" y="84" width="4" height="8"/><rect x="175" y="84" width="4" height="8"/></g>` +
        `<g fill="${s.ink}">` +
        // Manrique's giant metal cactus at the Jardín de Cactus
        `<rect x="136" y="26" width="10" height="66" rx="5"/></g>` +
        `<path d="M137,66 Q126,66 126,56 L126,42 M145,58 Q156,58 156,48 L156,36" stroke="${s.ink}" stroke-width="7" fill="none" stroke-linecap="round"/>` +
        `<path d="M141,30 V88 M126,44 V56 M156,38 V48" stroke="${s.sky[1]}" stroke-width=".7" opacity=".4"/>` +
        // Molino de Guatiza windmill
        `<g fill="${s.ink}"><path d="M30,92 L33,58 L45,58 L48,92Z"/><path d="M31.4,58 Q39,48 46.6,58Z"/><circle cx="39" cy="54" r="2"/>` +
        // barrel cacti
        `<ellipse cx="120" cy="88" rx="5" ry="4.6"/><ellipse cx="160" cy="89" rx="4" ry="3.6"/><ellipse cx="128" cy="90" rx="3" ry="2.6"/></g>` +
        `<path d="M39,54 L24,38 M39,54 L54,38 M39,54 L24,70 M39,54 L54,70" stroke="${s.ink}" stroke-width="1.6" stroke-linecap="round"/>` +
        `<path d="M24,38 L29,36 L32,46 M54,38 L49,36 L46,46 M24,70 L29,72 L32,62 M54,70 L49,72 L46,62" stroke="${s.ink}" stroke-width=".7" fill="none"/>` +
        `<rect x="37" y="66" width="4" height="6" rx="2" fill="${s.sky[1]}" opacity=".55"/>` +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  GRX: {
    city: "Granada",
    country: "Spanien",
    timezone: "Europe/Madrid",
    style: {
      sky: ["#2a2048", "#f0a77e"],
      ink: "#140f26",
      far: "#57487c",
      tag: "Alhambra",
    },
    draw: (s) => {
      return (
        // Sierra Nevada with snow
        `<path fill="${s.far}" d="M0,48 L22,36 L40,42 L64,22 L84,34 L104,28 L128,38 L150,18 L172,32 L200,26 L200,92 L0,92Z"/>` +
        `<path fill="#fff" opacity=".6" d="M16,39.4 L22,36 L28,38.6 L24,38 L20,40Z M56,29 L64,22 L72,28 L68,27 L64,29 L60,27.6Z M98,30 L104,28 L112,31 L106,30.4Z M142,25 L150,18 L158,24.6 L154,23.6 L150,26 L146,24Z M190,28.4 L200,26 L200,28 L196,28Z"/>` +
        `<g fill="${s.ink}">` +
        // Sabika hill
        `<path d="M0,92 L0,64 Q30,54 60,56 L170,54 Q190,58 200,66 L200,92Z"/>` +
        // curtain wall
        `<rect x="10" y="48" width="180" height="9"/><path d="${crenel(10, 190, 48, 4, 2.4)}"/>` +
        // Torre de la Vela with its bell frame
        `<rect x="14" y="32" width="18" height="18"/><path d="${crenel(14, 32, 32, 3.6, 2.6)}"/>` +
        `<path d="M21,29.4 L21,24 Q23,21 25,24 L25,29.4 L24,29.4 L24,24.6 Q23,23 22,24.6 L22,29.4Z"/>` +
        // Alcazaba towers
        `<rect x="36" y="38" width="10" height="12"/><path d="${crenel(36, 46, 38, 3.3, 2.2)}"/>` +
        // Palacio de Carlos V
        `<rect x="74" y="40" width="36" height="10"/><rect x="72" y="38.6" width="40" height="2"/>` +
        // Torre de Comares
        `<rect x="120" y="26" width="22" height="24"/><path d="${crenel(120, 142, 26, 3.6, 2.6)}"/>` +
        // Partal towers
        `<rect x="152" y="38" width="10" height="12"/><path d="${crenel(152, 162, 38, 3.3, 2.2)}"/>` +
        `<rect x="174" y="42" width="8" height="8"/>` +
        // cypresses
        cypress(52, 49, 16) +
        cypress(58, 49, 20) +
        cypress(66, 49, 14) +
        cypress(146, 49, 14) +
        cypress(168, 49, 18) +
        cypress(188, 49, 12) +
        `</g>` +
        `<g fill="${s.sky[1]}" opacity=".6"><path d="M124,40 v-4 q1.6,-2 3.2,0 v4Z M129.4,40 v-4 q1.6,-2 3.2,0 v4Z M134.8,40 v-4 q1.6,-2 3.2,0 v4Z"/>` +
        `<rect x="22" y="40" width="2" height="4"/><rect x="80" y="43" width="2" height="3"/><rect x="88" y="43" width="2" height="3"/><rect x="96" y="43" width="2" height="3"/><rect x="104" y="43" width="2" height="3"/></g>` +
        // Albaicín lights at the foot of the hill
        `<g fill="${s.sky[1]}" opacity=".4"><rect x="20" y="74" width="2" height="2"/><rect x="44" y="70" width="2" height="2"/><rect x="70" y="76" width="2" height="2"/><rect x="118" y="72" width="2" height="2"/><rect x="150" y="78" width="2" height="2"/><rect x="176" y="72" width="2" height="2"/></g>` +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  IBZ: {
    city: "Ibiza",
    country: "Spanien",
    timezone: "Europe/Madrid",
    style: {
      sky: ["#16335a", "#f6b98f"],
      ink: "#0a1a30",
      far: "#3b5f8e",
      tag: "Dalt Vila",
    },
    draw: (s) => {
      let white = "";
      [
        [26, 70, 8],
        [36, 64, 7],
        [46, 58, 9],
        [58, 54, 7],
        [130, 50, 8],
        [140, 56, 9],
        [152, 64, 8],
        [162, 72, 9],
        [30, 80, 10],
        [148, 76, 10],
      ].forEach(([x, y, w]) => {
        white += `<rect x="${x}" y="${y}" width="${w}" height="${w * 0.7}"/>`;
      });
      return (
        // Formentera and distant hills
        `<path fill="${s.far}" opacity=".7" d="M0,74 Q30,64 60,70 L60,92 L0,92Z M150,70 Q180,60 200,64 L200,92 L150,92Z"/>` +
        `<g fill="${s.ink}">` +
        // Dalt Vila hill with Renaissance bastions
        `<path d="M14,92 L18,76 L26,72 L28,62 L40,58 L44,50 Q70,38 110,38 L132,42 L142,52 L154,56 L158,68 L172,72 L176,92Z"/>` +
        // cathedral nave and square bell tower on the summit
        `<rect x="84" y="28" width="30" height="12"/><path d="M84,28 L99,22 L114,28Z"/>` +
        `<rect x="112" y="10" width="13" height="30"/><rect x="111" y="9" width="15" height="2"/>` +
        `<path d="${crenel(111, 126, 9, 3, 2)}"/>` +
        // harbour quay
        `<rect x="176" y="84" width="24" height="8"/></g>` +
        // bastion edges and white houses
        `<path d="M18,76 L26,72 L28,62 L40,58 L44,50 M142,52 L154,56 L158,68 L172,72" stroke="${s.sky[1]}" stroke-width=".8" fill="none" opacity=".4"/>` +
        `<g fill="#f2ece2" opacity=".75">${white}</g>` +
        `<g fill="${s.sky[1]}" opacity=".6"><path d="M115.5,18 v-4 q3,-3 6,0 v4Z"/><rect x="117" y="26" width="3" height="4"/><circle cx="92" cy="34" r="2"/></g>` +
        water(s.far, s.sky[1], "6,96 L70,96", "100,98 L150,98") +
        // sailing yacht in the harbour
        `<g fill="${s.ink}"><path d="M150,94 L182,94 L178,97.5 L155,97.5Z"/><rect x="164" y="48" width="1" height="46"/></g>` +
        `<path fill="${s.ink}" opacity=".85" d="M166,50 L166,92 L186,92Z M163,54 L163,92 L148,92Z"/>`
      );
    },
  },

  ALC: {
    city: "Alicante",
    country: "Spanien",
    timezone: "Europe/Madrid",
    style: {
      sky: ["#3a2245", "#f7b878"],
      ink: "#1c0f22",
      far: "#66406a",
      tag: "Santa Bárbara",
    },
    draw: (s) => {
      let palms = "";
      [
        [108, 24],
        [124, 30],
        [140, 24],
        [156, 30],
        [172, 24],
        [188, 30],
      ].forEach(([x, h]) => {
        palms += palm(s.ink, x, h);
      });
      return (
        // city blocks behind the Explanada
        `<g fill="${s.far}"><rect x="100" y="56" width="16" height="36"/><rect x="118" y="62" width="20" height="30"/><rect x="140" y="52" width="14" height="40"/><rect x="156" y="60" width="22" height="32"/><rect x="180" y="56" width="20" height="36"/></g>` +
        `<g fill="${s.ink}">` +
        // Mount Benacantil with the Cara del Moro profile
        `<path d="M0,92 L0,62 Q8,50 18,44 L24,34 Q32,26 44,26 L58,28 Q66,32 70,40 L76,42 L74,47 L79,50 L76,54 Q84,62 96,72 L104,92Z"/>` +
        // castle walls and keep on the summit
        `<rect x="26" y="20" width="34" height="8"/><path d="${crenel(26, 60, 20, 4, 2.6)}"/>` +
        `<rect x="38" y="8" width="11" height="13"/><path d="${crenel(38, 49, 8, 3.6, 2.4)}"/><rect x="43" y="-1" width=".8" height="7"/>` +
        `<rect x="10" y="44" width="14" height="5"/><path d="${crenel(10, 24, 44, 3.5, 2.2)}"/>` +
        `<rect x="62" y="32" width="12" height="5"/><path d="${crenel(62, 74, 32, 3, 2)}"/></g>` +
        `<path fill="#c0392b" d="M43.8,-1 L49,1 L43.8,3Z"/>` +
        `<g fill="${s.sky[1]}" opacity=".55"><rect x="42" y="12" width="3" height="4"/><rect x="30" y="23" width="2" height="2.4"/><rect x="52" y="23" width="2" height="2.4"/></g>` +
        `<path d="M70,40 L76,42 L74,47 L79,50 L76,54" stroke="${s.sky[1]}" stroke-width=".7" fill="none" opacity=".35"/>` +
        palms +
        // Explanada de España wave mosaic
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>` +
        `<path d="M0,95 Q5,93 10,95 T20,95 T30,95 T40,95 T50,95 T60,95 T70,95 T80,95 T90,95 T100,95 T110,95 T120,95 T130,95 T140,95 T150,95 T160,95 T170,95 T180,95 T190,95 T200,95" stroke="${s.sky[1]}" stroke-width=".8" fill="none" opacity=".4"/>` +
        `<path d="M0,98 Q5,96 10,98 T20,98 T30,98 T40,98 T50,98 T60,98 T70,98 T80,98 T90,98 T100,98 T110,98 T120,98 T130,98 T140,98 T150,98 T160,98 T170,98 T180,98 T190,98 T200,98" stroke="#c0392b" stroke-width=".8" fill="none" opacity=".45"/>`
      );
    },
  },

  SCQ: {
    city: "Santiago de Compostela",
    country: "Spanien",
    timezone: "Europe/Madrid",
    style: {
      sky: ["#1f2a3e", "#d9b48a"],
      ink: "#0d1320",
      far: "#45546e",
      tag: "Catedral de Santiago",
    },
    draw: (s) => {
      // one Obradoiro tower, centred on x, stacked baroque tiers
      const tower = (x: number) =>
        `<rect x="${x - 11}" y="34" width="22" height="58"/><rect x="${x - 12.5}" y="32" width="25" height="2.6"/>` +
        `<rect x="${x - 8.5}" y="20" width="17" height="12"/><rect x="${x - 9.6}" y="18.4" width="19.2" height="2"/>` +
        `<rect x="${x - 6}" y="11" width="12" height="7.4"/>` +
        `<path d="M${x - 6},11.4 Q${x},2 ${x + 6},11.4Z"/><rect x="${x - 0.5}" y="-2" width="1" height="7"/><rect x="${x - 2}" y="-0.4" width="4" height="1"/>` +
        `<path d="M${x - 12.5},32 l1.2,-4 l1.2,4Z M${x + 10.1},32 l1.2,-4 l1.2,4Z M${x - 9.6},18.4 l1,-3.4 l1,3.4Z M${x + 7.6},18.4 l1,-3.4 l1,3.4Z"/>`;
      const lit = (x: number) =>
        `<path d="M${x - 3},29 v-5 q3,-3.6 6,0 v5Z M${x - 2},16.6 v-3 q2,-2.4 4,0 v3Z M${x - 3.4},48 v-7 q3.4,-4 6.8,0 v7Z"/>`;
      return (
        // Berenguela clock tower and old-town roofs
        `<g fill="${s.far}"><rect x="170" y="36" width="14" height="56"/><path d="M169,36 L177,24 L185,36Z"/><rect x="176.4" y="18" width="1.2" height="6"/>` +
        `<rect x="0" y="66" width="34" height="26"/><path d="M-1,66 L16,58 L35,66Z"/><rect x="150" y="62" width="50" height="30"/></g>` +
        `<circle cx="177" cy="44" r="2.6" fill="${s.sky[1]}" opacity=".5"/>` +
        `<g fill="${s.ink}">` +
        // facade body, central glazed section, stepped pediment with St James
        `<rect x="52" y="56" width="96" height="36"/>` +
        `<rect x="80" y="38" width="40" height="18"/><rect x="78" y="36" width="44" height="2.4"/>` +
        `<rect x="88" y="28" width="24" height="8"/><path d="M86,29 Q100,14 114,29Z"/>` +
        `<rect x="98.6" y="10" width="2.8" height="8"/><circle cx="100" cy="9" r="1.8"/>` +
        `<path d="M80,36 l1.4,-5 l1.4,5Z M117.2,36 l1.4,-5 l1.4,5Z"/>` +
        tower(66) +
        tower(134) +
        // double staircase
        `<path d="M70,92 L84,82 L116,82 L130,92Z"/></g>` +
        `<g fill="${s.sky[1]}" opacity=".6">${lit(66)}${lit(134)}` +
        `<path d="M90,56 v-12 q10,-8 20,0 v12Z"/><circle cx="100" cy="31" r="2.4"/>` +
        `<path d="M94,76 v-12 q6,-6 12,0 v12Z" opacity=".55"/></g>` +
        `<path d="M95,44 V56 M100,40 V56 M105,44 V56 M90,50 H110" stroke="${s.ink}" stroke-width=".8"/>` +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },
};
