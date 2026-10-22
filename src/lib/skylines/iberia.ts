import { palm, spires, type LibraryCity } from "./shared";

// Hand-drawn skylines: Portugal and Spain

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

// Tall Gaudí spire: tapered, slightly bulbous, with a small finial
function gaudi(x: number, top: number, base: number, w = 3.2) {
  return (
    `M${x - w},${base} L${x - w * 0.8},${top + 10} Q${x - w * 0.9},${top + 2} ${x},${top} ` +
    `Q${x + w * 0.9},${top + 2} ${x + w * 0.8},${top + 10} L${x + w},${base}Z ` +
    `M${x - 1.2},${top} a1.2,1.2 0 1,0 2.4,0 a1.2,1.2 0 1,0 -2.4,0Z`
  );
}

export const IBERIA: Record<string, LibraryCity> = {
  LIS: {
    city: "Lissabon",
    country: "Portugal",
    timezone: "Europe/Lisbon",
    style: {
      sky: ["#2a2350", "#f3a46b"],
      ink: "#140f26",
      far: "#4a3d6e",
      tag: "Torre de Belém & Ponte 25 de Abril",
    },
    draw: (s) => {
      // Almada hills with Cristo Rei, the suspension bridge, Belém tower in front
      return (
        `<path fill="${s.far}" d="M92,92 L92,76 Q124,64 158,68 Q180,58 200,62 L200,92Z"/>` +
        `<g fill="${s.far}"><rect x="183" y="46" width="5" height="15"/><rect x="181" y="58" width="9" height="4"/><rect x="184.5" y="38" width="2" height="8"/><rect x="180" y="40" width="11" height="1.6"/><circle cx="185.5" cy="37" r="1.4"/></g>` +
        `<g fill="${s.ink}"><rect x="84" y="70" width="116" height="3"/>` +
        `<rect x="114" y="32" width="4" height="60"/><rect x="168" y="32" width="4" height="60"/>` +
        `<rect x="113" y="44" width="6" height="1.5"/><rect x="113" y="58" width="6" height="1.5"/><rect x="167" y="44" width="6" height="1.5"/><rect x="167" y="58" width="6" height="1.5"/></g>` +
        `<path d="M84,70 Q104,66 116,33 Q143,72 170,33 Q184,62 200,64" stroke="${s.ink}" stroke-width="1.3" fill="none"/>` +
        `<path d="M124,49 v21 M132,59 v11 M143,64 v6 M154,59 v11 M162,49 v21 M100,62 v8 M108,52 v18 M178,52 v18 M188,60 v10" stroke="${s.ink}" stroke-width=".5" opacity=".8"/>` +
        `<g fill="${s.ink}">` +
        // bastion with merlons and corner turrets
        `<rect x="18" y="72" width="62" height="20"/>` +
        `<path d="${crenel(22, 76, 72, 5, 3)}"/>` +
        `<rect x="16" y="64" width="5" height="9"/><path d="M15.5,64 Q18.5,58 21.5,64Z"/><rect x="18.2" y="56" width=".8" height="3"/>` +
        `<rect x="77" y="64" width="5" height="9"/><path d="M76.5,64 Q79.5,58 82.5,64Z"/><rect x="79.2" y="56" width=".8" height="3"/>` +
        // tower
        `<rect x="26" y="32" width="24" height="40"/><path d="${crenel(26, 50, 32, 4, 3)}"/>` +
        `<rect x="31" y="22" width="14" height="10"/><path d="${crenel(31, 45, 22, 3.5, 2.5)}"/>` +
        `<rect x="23" y="27" width="5" height="8"/><path d="M22.5,27 Q25.5,21 28.5,27Z"/>` +
        `<rect x="48" y="27" width="5" height="8"/><path d="M47.5,27 Q50.5,21 53.5,27Z"/></g>` +
        // loggia arches and windows
        `<g fill="${s.sky[1]}" opacity=".7"><path d="M30,52 v-4 q2,-3 4,0 v4Z M36,52 v-4 q2,-3 4,0 v4Z M42,52 v-4 q2,-3 4,0 v4Z"/>` +
        `<rect x="36.5" y="38" width="3" height="5"/><rect x="37" y="25" width="2" height="4"/></g>` +
        `<rect x="28" y="52" width="20" height="1.4" fill="${s.ink}"/>` +
        water(s.far, s.sky[1], "10,95 L74,95", "100,97 L188,97")
      );
    },
  },

  OPO: {
    city: "Porto",
    country: "Portugal",
    timezone: "Europe/Lisbon",
    style: {
      sky: ["#1d2b45", "#e7b27a"],
      ink: "#0c1322",
      far: "#3c4c6c",
      tag: "Ponte Dom Luís I & Torre dos Clérigos",
    },
    draw: (s) => {
      let houses = "";
      [
        [0, 58, 9],
        [10, 62, 8],
        [36, 66, 9],
        [46, 72, 8],
        [55, 78, 9],
      ].forEach(([x, y, w]) => {
        houses += `<rect x="${x}" y="${y}" width="${w}" height="${92 - y}"/><path d="M${x - 0.5},${y} L${x + w / 2},${y - 4} L${x + w + 0.5},${y}Z"/>`;
      });
      let truss = "";
      for (let x = 76; x <= 152; x += 8) {
        const t = (x - 50) / 128;
        const yArch =
          (1 - t) * (1 - t) * 92 + 2 * (1 - t) * t * -4 + t * t * 92;
        truss += `M${x},42 L${x},${yArch.toFixed(1)} `;
      }
      return (
        // Vila Nova de Gaia across the river
        `<path fill="${s.far}" d="M150,92 L150,66 Q174,56 200,58 L200,92Z"/>` +
        `<g fill="${s.far}"><rect x="176" y="62" width="10" height="10"/><rect x="188" y="60" width="9" height="12"/></g>` +
        `<g fill="${s.ink}"><path d="M0,92 L0,60 Q22,50 36,64 Q52,78 66,92Z"/>${houses}` +
        // Torre dos Clérigos on the hill
        `<rect x="18" y="20" width="9" height="40"/><rect x="17" y="34" width="11" height="2"/>` +
        `<rect x="19.2" y="12" width="6.6" height="8"/><rect x="18.4" y="18" width="8.2" height="2"/>` +
        `<path d="M19.2,12 Q22.5,4 25.8,12Z"/><rect x="22" y="1" width="1" height="6"/><rect x="20.8" y="2.6" width="3.4" height=".9"/>` +
        // Ponte Dom Luís I: iron arch, upper deck on the crown, pylons, lower deck
        `<path d="M50,92 Q114,-4 178,92 L170,92 Q114,10 58,92Z"/>` +
        `<rect x="30" y="40" width="170" height="3"/>` +
        `<path d="M54,92 L56,43 L62,43 L64,92Z M164,92 L166,43 L172,43 L174,92Z"/>` +
        `<rect x="50" y="80" width="128" height="2.4"/></g>` +
        `<path d="${truss}" stroke="${s.ink}" stroke-width=".8"/>` +
        `<rect x="20.5" y="24" width="4" height="5" rx="2" fill="${s.sky[1]}" opacity=".7"/>` +
        water(s.far, s.sky[1], "8,96 L60,96", "96,95 L160,95") +
        // rabelo boat
        `<path fill="${s.ink}" d="M126,94 L144,94 L141,97 L129,97Z M134,94 L134,84 L139,84 L139,90 L134,90Z"/>`
      );
    },
  },

  MAD: {
    city: "Madrid",
    country: "Spanien",
    timezone: "Europe/Madrid",
    style: {
      sky: ["#3a1c2c", "#f0a35e"],
      ink: "#1c0c15",
      far: "#653047",
      tag: "Puerta de Alcalá & Metrópolis",
    },
    draw: (s) => {
      let far = "";
      [
        [0, 22, 12],
        [14, 30, 10],
        [96, 26, 12],
        [108, 34, 8],
        [186, 30, 14],
      ].forEach(([x, h, w]) => {
        far += `<rect x="${x}" y="${92 - h}" width="${w}" height="${h}"/>`;
      });
      let win = "";
      for (const x of [123, 129, 171, 177])
        for (const y of [62, 72, 82])
          win += `<rect x="${x}" y="${y}" width="2" height="3"/>`;
      return (
        `<g fill="${s.far}">${far}</g>` +
        `<g fill="${s.ink}">` +
        // Puerta de Alcalá: five openings, cornice, attic with pediment
        `<path fill-rule="evenodd" d="M22,92 L22,58 L98,58 L98,92Z M27,92 L27,72 L35,72 L35,92Z M85,92 L85,72 L93,72 L93,92Z M41,92 L41,70 Q46,63 51,70 L51,92Z M55,92 L55,68 Q60,61 65,68 L65,92Z M69,92 L69,70 Q74,63 79,70 L79,92Z"/>` +
        `<rect x="19" y="54" width="82" height="5"/><rect x="42" y="44" width="36" height="10"/>` +
        `<path d="M40,44 L60,34 L80,44Z"/>` +
        `<path d="M26,54 v-4 h3 v4Z M91,54 v-4 h3 v4Z M47,44 v-4 h2.4 v4Z M71,44 v-4 h2.4 v4Z"/>` +
        // Metrópolis: wings, round corner tower, dome with winged Victoria
        `<rect x="118" y="56" width="20" height="36"/><rect x="164" y="56" width="22" height="36"/>` +
        `<rect x="137" y="42" width="28" height="50"/><rect x="135" y="38" width="32" height="5"/>` +
        `<rect x="139" y="33" width="24" height="5"/>` +
        `<path d="M139,34 Q139,16 151,14 Q163,16 163,34Z"/><rect x="149" y="9" width="4" height="6"/>` +
        `<path d="M150.2,9 L150.2,2 L151.8,2 L151.8,9Z M151,2.6 Q146,-1 144,4 Q148,3 151,5Z M151,2.6 Q156,-1 158,4 Q154,3 151,5Z"/>` +
        `<circle cx="151" cy="1.4" r="1"/></g>` +
        `<g fill="${s.sky[1]}" opacity=".55">${win}<rect x="142" y="48" width="2" height="38"/><rect x="150" y="48" width="2" height="38"/><rect x="158" y="48" width="2" height="38"/></g>` +
        `<path d="M145,33 Q146,22 151,16 M157,33 Q156,22 151,16" stroke="${s.sky[1]}" stroke-width=".7" fill="none" opacity=".45"/>` +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  BCN: {
    city: "Barcelona",
    country: "Spanien",
    timezone: "Europe/Madrid",
    style: {
      sky: ["#1e2457", "#f19c79"],
      ink: "#0e1029",
      far: "#414a8a",
      tag: "Sagrada Família",
    },
    draw: (s) => {
      // Tibidabo ridge and Torre Glòries behind, the basilica's spires in front
      const towers =
        gaudi(48, 26, 70) +
        gaudi(56, 18, 70) +
        gaudi(64, 18, 70) +
        gaudi(72, 26, 70) +
        gaudi(128, 26, 70) +
        gaudi(136, 18, 70) +
        gaudi(144, 18, 70) +
        gaudi(152, 26, 70) +
        gaudi(86, 14, 66, 4) +
        gaudi(114, 14, 66, 4) +
        gaudi(100, 4, 66, 5.4);
      return (
        `<path fill="${s.far}" d="M0,70 Q30,58 56,64 Q90,52 120,62 Q160,56 200,66 L200,92 L0,92Z" opacity=".75"/>` +
        `<path fill="${s.far}" d="M178,92 L178,52 Q178,34 185,32 Q192,34 192,52 L192,92Z"/>` +
        `<g fill="${s.ink}"><path d="M40,92 L40,70 L60,62 L100,58 L140,62 L160,70 L160,92Z"/>` +
        `<path d="${towers}"/>` +
        `<rect x="99" y="0" width="2" height="4"/><rect x="97.6" y="1" width="4.8" height="1.2"/>` +
        `<rect x="0" y="80" width="30" height="12"/><rect x="170" y="78" width="30" height="14"/></g>` +
        `<g fill="${s.sky[1]}" opacity=".55"><rect x="55.4" y="34" width="1.2" height="3"/><rect x="63.4" y="34" width="1.2" height="3"/><rect x="135.4" y="34" width="1.2" height="3"/><rect x="143.4" y="34" width="1.2" height="3"/>` +
        `<rect x="99.3" y="22" width="1.4" height="4"/><rect x="99.3" y="32" width="1.4" height="4"/><circle cx="100" cy="72" r="3"/></g>` +
        `<rect x="0" y="92" width="200" height="8" fill="${s.ink}"/>`
      );
    },
  },

  VLC: {
    city: "Valencia",
    country: "Spanien",
    timezone: "Europe/Madrid",
    style: {
      sky: ["#0f3b4f", "#b7e3dc"],
      ink: "#06202b",
      far: "#2e6c80",
      tag: "Ciutat de les Arts i les Ciències",
    },
    draw: (s) => {
      let ribs = "";
      for (let x = 10; x <= 52; x += 7)
        ribs += `M${x},92 L${x},76 Q${x + 3.5},68 ${x + 7},76 `;
      return (
        // L'Umbracle arches behind, the Hemisfèric eye, the Palau de les Arts helmet
        `<path d="${ribs}" stroke="${s.far}" stroke-width="2" fill="none"/>` +
        `<g fill="${s.ink}">` +
        `<path d="M14,82 Q58,60 102,82 Q58,94 14,82Z"/>` +
        `<path d="M8,78 Q58,34 108,78 L104,79 Q58,48 12,79Z"/>` +
        `<path d="M122,92 Q118,56 148,46 Q178,40 190,62 L194,92Z"/>` +
        `<path d="M112,62 Q140,20 198,16 Q198,20 192,21 Q148,28 118,62Z"/>` +
        `<rect x="126" y="78" width="60" height="14"/></g>` +
        `<circle cx="58" cy="81" r="6" fill="${s.sky[1]}" opacity=".6"/><circle cx="58" cy="81" r="3" fill="${s.ink}"/>` +
        `<path d="M24,82 Q58,68 92,82" stroke="${s.sky[1]}" stroke-width=".8" fill="none" opacity=".5"/>` +
        `<path d="M128,62 Q150,48 182,56 M130,74 L184,74" stroke="${s.sky[1]}" stroke-width=".8" fill="none" opacity=".45"/>` +
        palm(s.ink, 6, 24) +
        palm(s.ink, 22, 18) +
        water(s.far, s.sky[1], "40,95 L112,95", "126,97 L192,97")
      );
    },
  },

  SVQ: {
    city: "Sevilla",
    country: "Spanien",
    timezone: "Europe/Madrid",
    style: {
      sky: ["#4a1f17", "#f6c26b"],
      ink: "#24100b",
      far: "#7a3b26",
      tag: "La Giralda & Torre del Oro",
    },
    draw: (s) => {
      return (
        `<path fill="${s.far}" d="M0,80 L20,80 L20,74 L34,74 L34,92 L0,92Z M104,92 L104,72 L118,72 L118,92Z"/>` +
        `<g fill="${s.ink}">` +
        // Cathedral with pinnacles
        `<rect x="66" y="62" width="74" height="30"/><path d="${spires(72, 136, 8, 62, 10)}"/>` +
        `<rect x="96" y="52" width="16" height="10"/><path d="M96,52 Q104,42 112,52Z"/>` +
        // La Giralda
        `<rect x="44" y="30" width="18" height="62"/><rect x="43" y="28" width="20" height="3"/>` +
        `<rect x="46" y="17" width="14" height="11"/><rect x="45" y="15" width="16" height="2.4"/>` +
        `<rect x="48" y="9" width="10" height="6"/><rect x="49.5" y="5" width="7" height="4"/>` +
        `<path d="M50,5 Q53,0 56,5Z"/><rect x="52.5" y="-3" width="1" height="5"/>` +
        `<path d="M53,-6 L51.4,-1.6 L54.6,-1.6Z M53.6,-5 L57,-6 L55,-3Z"/>` +
        // Torre del Oro: three tiers by the river
        `<rect x="156" y="58" width="26" height="34"/><path d="${crenel(156, 182, 58, 4, 3)}"/>` +
        `<rect x="162" y="44" width="14" height="14"/><path d="${crenel(162, 176, 44, 3.5, 2.5)}"/>` +
        `<rect x="165" y="36" width="8" height="8"/><path d="M164.6,36 Q169,27 173.4,36Z"/><rect x="168.5" y="24" width="1" height="5"/></g>` +
        `<g fill="${s.sky[1]}" opacity=".65"><path d="M48,26 v-5 q2,-2.4 4,0 v5Z M54,26 v-5 q2,-2.4 4,0 v5Z"/>` +
        `<rect x="51.5" y="40" width="3" height="5"/><rect x="51.5" y="56" width="3" height="5"/><rect x="51.5" y="72" width="3" height="5"/>` +
        `<rect x="167.5" y="49" width="3" height="5"/><circle cx="104" cy="72" r="3.2"/></g>` +
        palm(s.ink, 10, 26) +
        palm(s.ink, 28, 20) +
        palm(s.ink, 192, 22) +
        water(s.far, s.sky[1], "6,95 L80,95", "130,97 L196,97")
      );
    },
  },

  AGP: {
    city: "Málaga",
    country: "Spanien",
    timezone: "Europe/Madrid",
    style: {
      sky: ["#3a1d3f", "#f6b07a"],
      ink: "#1d0d20",
      far: "#64355e",
      tag: "Alcazaba & Catedral",
    },
    draw: (s) => {
      return (
        `<path fill="${s.far}" d="M0,60 L24,40 L44,50 L70,36 L96,54 L120,46 L150,58 L176,48 L200,56 L200,92 L0,92Z" opacity=".8"/>` +
        `<g fill="${s.ink}">` +
        // Gibralfaro hill with the Alcazaba walls and towers
        `<path d="M0,92 L0,58 Q24,44 50,52 Q78,62 96,92Z"/>` +
        `<rect x="10" y="44" width="46" height="9"/><path d="${crenel(10, 56, 44, 4, 2.6)}"/>` +
        `<rect x="18" y="34" width="9" height="12"/><path d="${crenel(18, 27, 34, 3, 2.4)}"/>` +
        `<rect x="40" y="38" width="8" height="8"/><path d="${crenel(40, 48, 38, 2.8, 2.2)}"/>` +
        `<rect x="56" y="54" width="22" height="7"/><path d="${crenel(56, 78, 54, 4, 2.4)}"/>` +
        // Cathedral "La Manquita": nave, one finished tower, the stump of the other
        `<rect x="106" y="58" width="58" height="34"/><path d="M118,58 L134,48 L150,58Z"/>` +
        `<rect x="106" y="48" width="12" height="12"/>` +
        `<rect x="150" y="26" width="14" height="34"/><rect x="149" y="24" width="16" height="3"/>` +
        `<rect x="152" y="14" width="10" height="10"/><path d="M152,14 Q157,4 162,14Z"/><rect x="156.5" y="1" width="1" height="6"/></g>` +
        `<g fill="${s.sky[1]}" opacity=".65"><path d="M154.5,22 v-5 q2.5,-3 5,0 v5Z"/><rect x="155.5" y="34" width="3" height="6"/><path d="M130,92 v-14 q4,-6 8,0 v14Z" opacity=".5"/><rect x="21" y="38" width="2.4" height="3"/></g>` +
        palm(s.ink, 92, 24) +
        palm(s.ink, 176, 28) +
        palm(s.ink, 192, 20) +
        water(s.far, s.sky[1], "10,95 L84,95", "112,97 L190,97")
      );
    },
  },

  PMI: {
    city: "Palma de Mallorca",
    country: "Spanien",
    timezone: "Europe/Madrid",
    style: {
      sky: ["#173459", "#f4c79a"],
      ink: "#0a1a2f",
      far: "#3b6290",
      tag: "Catedral La Seu",
    },
    draw: (s) => {
      let pins = "";
      for (let x = 56; x <= 150; x += 9)
        pins += `M${x - 2},62 L${x - 2},36 L${x},27 L${x + 2},36 L${x + 2},62Z `;
      return (
        `<path fill="${s.far}" d="M0,80 Q40,70 70,78 L70,92 L0,92Z M170,74 Q186,66 200,70 L200,92 L170,92Z" opacity=".8"/>` +
        `<g fill="${s.ink}">` +
        // sea wall with merlons
        `<rect x="0" y="80" width="200" height="12"/><path d="${crenel(0, 200, 80, 6, 2.5)}"/>` +
        // La Seu: high nave, buttress pinnacles, west towers, bell tower, apse
        `<rect x="44" y="46" width="118" height="34"/><path d="M44,46 L52,40 L156,40 L162,46Z"/>` +
        `<path d="${pins}"/>` +
        `<rect x="38" y="34" width="9" height="46"/><path d="M37.6,34 L42.5,24 L47.4,34Z"/>` +
        `<rect x="152" y="24" width="14" height="56"/><path d="${crenel(152, 166, 24, 3.5, 2.4)}"/>` +
        `<rect x="162" y="56" width="18" height="24"/><path d="M162,56 Q171,48 180,56Z"/></g>` +
        `<g fill="${s.sky[1]}" opacity=".6"><circle cx="54" cy="56" r="3.6"/><rect x="157.5" y="32" width="3" height="6"/>` +
        `<rect x="66" y="64" width="2" height="9"/><rect x="84" y="64" width="2" height="9"/><rect x="102" y="64" width="2" height="9"/><rect x="120" y="64" width="2" height="9"/><rect x="138" y="64" width="2" height="9"/></g>` +
        palm(s.ink, 12, 26) +
        palm(s.ink, 26, 20) +
        palm(s.ink, 190, 24) +
        water(s.far, s.sky[1], "6,95 L90,95", "120,97 L194,97")
      );
    },
  },

  BIO: {
    city: "Bilbao",
    country: "Spanien",
    timezone: "Europe/Madrid",
    style: {
      sky: ["#26313a", "#d9b99a"],
      ink: "#10161b",
      far: "#4b5a63",
      tag: "Guggenheim Bilbao",
    },
    draw: (s) => {
      return (
        // Iberdrola tower and hills behind, the Guggenheim's titanium curves, La Salve bridge
        `<path fill="${s.far}" d="M0,66 Q40,52 80,62 Q130,50 200,60 L200,92 L0,92Z" opacity=".75"/>` +
        `<path fill="${s.far}" d="M20,92 L20,16 Q27,8 34,16 L34,92Z"/>` +
        `<g fill="${s.ink}">` +
        // low gallery, then titanium sails rising towards La Salve bridge
        `<path d="M40,92 L40,78 Q54,72 72,76 L76,58 Q82,48 94,52 Q96,36 110,28 Q114,40 118,48 Q128,36 146,40 Q138,52 150,60 Q162,62 164,78 L166,92Z"/>` +
        `<path d="M96,52 Q90,42 82,40 Q92,38 100,44Z M146,40 Q154,32 162,34 Q152,38 150,46Z"/>` +
        `<rect x="150" y="70" width="50" height="3"/><rect x="182" y="30" width="7" height="62"/>` +
        // Maman spider
        `<ellipse cx="24" cy="50" rx="5" ry="4"/><circle cx="24" cy="45" r="2.4"/></g>` +
        `<path d="M21,51 Q10,44 6,92 M22,52 Q14,56 12,92 M27,51 Q38,44 42,92 M26,52 Q34,56 36,92 M23,53 Q20,70 19,92 M25,53 Q28,70 29,92" stroke="${s.ink}" stroke-width="1.1" fill="none"/>` +
        `<path d="M156,71 Q166,54 176,71" stroke="#c0392b" stroke-width="2.4" fill="none"/>` +
        `<path d="M44,82 Q58,77 72,80 M80,60 Q90,54 100,58 M78,70 Q96,60 116,64 M100,44 Q108,38 112,34 M118,56 Q132,46 144,46 M120,68 Q140,58 160,70 M128,80 Q146,72 162,82" stroke="${s.sky[1]}" stroke-width=".8" fill="none" opacity=".55"/>` +
        `<path d="M106,92 L106,70 M112,92 L112,68 M118,92 L118,70" stroke="${s.sky[1]}" stroke-width=".7" opacity=".4"/>` +
        water(s.far, s.sky[1], "10,95 L80,95", "100,97 L186,97")
      );
    },
  },
};
