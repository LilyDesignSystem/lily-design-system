// colors.ts — the pure colour model behind ColorPicker.
//
// Colours are held as lowercase "#rrggbb" hex, or the keyword "transparent". Everything here is
// plain data and arithmetic, with no DOM, so it is SSR-safe and testable on its own.

/** The CSS named colours (CSS Color Module Level 4), lowercase, as "#rrggbb". The list began as the X11 colour names. */
export const CSS_NAMED_COLORS: Readonly<Record<string, string>> = Object.freeze({
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    gold: "#ffd700",
    goldenrod: "#daa520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavender: "#e6e6fa",
    lavenderblush: "#fff0f5",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32",
});

export const TRANSPARENT = "transparent";

export interface Rgb {
    r: number;
    g: number;
    b: number;
}

export interface Hsl {
    /** Hue in degrees, 0 to 360. */
    h: number;
    /** Saturation, 0 to 100. */
    s: number;
    /** Lightness, 0 to 100. */
    l: number;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** "#abc", "#aabbcc", "abc" or "aabbcc" (any case) as "#aabbcc"; anything else is null. */
export function normalizeHex(input: string): string | null {
    const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(input.trim());
    if (!m) return null;
    let hex = m[1].toLowerCase();
    if (hex.length === 3) hex = [...hex].map((c) => c + c).join("");
    return "#" + hex;
}

export function hexToRgb(hex: string): Rgb | null {
    const h = normalizeHex(hex);
    if (!h) return null;
    return {
        r: parseInt(h.slice(1, 3), 16),
        g: parseInt(h.slice(3, 5), 16),
        b: parseInt(h.slice(5, 7), 16),
    };
}

export function rgbToHex({ r, g, b }: Rgb): string {
    const part = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
    return "#" + part(r) + part(g) + part(b);
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
    const rr = r / 255;
    const gg = g / 255;
    const bb = b / 255;
    const max = Math.max(rr, gg, bb);
    const min = Math.min(rr, gg, bb);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === rr) h = (gg - bb) / d + (gg < bb ? 6 : 0);
        else if (max === gg) h = (bb - rr) / d + 2;
        else h = (rr - gg) / d + 4;
        h *= 60;
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
    const hh = (((h % 360) + 360) % 360) / 360;
    const ss = clamp(s, 0, 100) / 100;
    const ll = clamp(l, 0, 100) / 100;
    if (ss === 0) {
        const v = ll * 255;
        return { r: v, g: v, b: v };
    }
    const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
    const p = 2 * ll - q;
    const channel = (t: number) => {
        let tt = t;
        if (tt < 0) tt += 1;
        if (tt > 1) tt -= 1;
        if (tt < 1 / 6) return p + (q - p) * 6 * tt;
        if (tt < 1 / 2) return q;
        if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
        return p;
    };
    return { r: channel(hh + 1 / 3) * 255, g: channel(hh) * 255, b: channel(hh - 1 / 3) * 255 };
}

export const hexToHsl = (hex: string): Hsl | null => {
    const rgb = hexToRgb(hex);
    return rgb ? rgbToHsl(rgb) : null;
};

export const hslToHex = (hsl: Hsl): string => rgbToHex(hslToRgb(hsl));

/** The CSS name for a colour, when one has exactly this value (the first in alphabetical order, so "aqua" before "cyan"). */
export function nameOfColor(hex: string): string | null {
    const h = normalizeHex(hex);
    if (!h) return null;
    for (const [name, value] of Object.entries(CSS_NAMED_COLORS)) if (value === h) return name;
    return null;
}

/**
 * Read what a person typed: a hex value, a CSS colour name, rgb(r g b) / rgb(r, g, b), hsl(h s% l%) / hsl(h, s%, l%), or
 * "transparent". Returns "#rrggbb", "transparent", or null when it is not a colour.
 */
export function parseColor(input: string): string | null {
    const text = input.trim().toLowerCase();
    if (text === TRANSPARENT) return TRANSPARENT;
    if (CSS_NAMED_COLORS[text]) return CSS_NAMED_COLORS[text];
    const hex = normalizeHex(text);
    if (hex) return hex;
    const fn =
        /^(rgb|hsl)a?\(\s*([-\d.]+)(?:deg)?[\s,]+([-\d.]+)(%?)[\s,]+([-\d.]+)(%?)\s*(?:[,/]\s*[\d.]+%?\s*)?\)$/.exec(
            text,
        );
    if (!fn) return null;
    const [, kind, a, b, bPct, c, cPct] = fn;
    const [x, y, z] = [Number(a), Number(b), Number(c)];
    if (![x, y, z].every(Number.isFinite)) return null;
    if (kind === "rgb") {
        if (bPct || cPct) return null;
        if ([x, y, z].some((n) => n < 0 || n > 255)) return null;
        return rgbToHex({ r: x, g: y, b: z });
    }
    if (y < 0 || y > 100 || z < 0 || z > 100) return null;
    return hslToHex({ h: x, s: y, l: z });
}

/**
 * The default palette: 8 rows of 10. A row of greys from black to white, a row of strong hues, then six rows of the
 * same ten hues from light to dark. The values are Lily's own, computed here; pass `palette` for an organisation's.
 */
export function defaultPalette(): string[] {
    const hues = [0, 15, 35, 55, 100, 175, 210, 235, 270, 310];
    const greys = Array.from({ length: 10 }, (_, i) => {
        const v = Math.round((255 * i) / 9);
        return rgbToHex({ r: v, g: v, b: v });
    });
    const strong = hues.map((h) => hslToHex({ h, s: 90, l: 50 }));
    const steps: Array<[number, number]> = [
        [70, 90],
        [65, 80],
        [60, 68],
        [55, 52],
        [60, 38],
        [65, 24],
    ];
    const tints = steps.flatMap(([s, l]) => hues.map((h) => hslToHex({ h, s, l })));
    return [...greys, ...strong, ...tints];
}

/** Put `color` first in `recent`, without repeats, keeping at most `max`. */
export function pushRecent(recent: readonly string[], color: string, max = 10): string[] {
    return [color, ...recent.filter((c) => c !== color)].slice(0, Math.max(0, max));
}
