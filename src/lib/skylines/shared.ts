// Shared types and drawing helpers for the city card artwork.
// Every skyline draws into viewBox 0 0 200 100: ground line at y=92, the strip y=92..100 is
// quay or water. Use s.ink for the foreground silhouette, s.far for background layers and
// s.sky[1] (the light horizon colour) for small highlights such as lit windows or water lines.

export type CityStyle = {
  sky: [string, string];
  ink: string;
  far: string;
  tag: string;
};

/** A destination with hand-drawn artwork in the library */
export type LibraryCity = {
  city: string;
  country: string;
  timezone: string;
  style: CityStyle;
  draw: (s: CityStyle) => string;
};

// Palm tree drawn with strokes; x = trunk base, h = height
export function palm(ink: string, x: number, h: number) {
  const top = 92 - h;
  const tx = x + 3;
  let d =
    "M" + x + ",92 Q" + (x + 4) + "," + (92 - h / 2) + " " + tx + "," + top;
  [
    [-12, 4],
    [-9, -4],
    [0, -7],
    [9, -4],
    [12, 5],
  ].forEach((f) => {
    d +=
      " M" +
      tx +
      "," +
      top +
      " Q" +
      (tx + f[0] / 2) +
      "," +
      (top - 4) +
      " " +
      (tx + f[0]) +
      "," +
      (top + f[1]);
  });
  return (
    '<path d="' +
    d +
    '" stroke="' +
    ink +
    '" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
  );
}

export function spires(
  x0: number,
  x1: number,
  step: number,
  base: number,
  h: number,
) {
  let d = "";
  for (let x = x0; x <= x1; x += step)
    d +=
      "M" +
      (x - 2) +
      "," +
      base +
      "L" +
      x +
      "," +
      (base - h) +
      "L" +
      (x + 2) +
      "," +
      base +
      "Z";
  return d;
}

// Snow-capped Alps in the background (Swiss destinations)
export function alps(s: CityStyle) {
  return (
    '<path fill="' +
    s.far +
    '" d="M0,70 L18,52 L30,60 L52,34 L66,50 L80,42 L104,64 L126,38 L144,54 L160,30 L182,52 L200,44 L200,100 L0,100Z"/>' +
    '<path fill="#fff" opacity=".55" d="M46,41 L52,34 L58,42 L54,40 L50,43Z M120,45 L126,38 L132,46 L128,44 L124,47Z M154,37 L160,30 L167,39 L162,37 L158,40Z M76,46 L80,42 L84,47 L80,45Z"/>'
  );
}
