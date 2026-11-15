// Colors — the pure colour model behind ColorPicker, a C# port of shared/colors.ts.
//
// Colours are held as lowercase "#rrggbb" hex, or the keyword "transparent". Everything here is plain data and
// arithmetic, with no DOM. The TypeScript module is canonical; ColorsTests.cs checks this port against values it
// computed (tests/colors-parity.json, written by `node tests/write-colors-parity.mjs`).
using System.Globalization;
using System.Text.RegularExpressions;

namespace LilyDesignSystem.Blazor.Helpers;

public readonly record struct Rgb(double R, double G, double B);
public readonly record struct Hsl(double H, double S, double L);
public readonly record struct Hsb(double H, double S, double B);
public readonly record struct Cmyk(double C, double M, double Y, double K);

public static partial class Colors
{
    public const string Transparent = "transparent";

    /// <summary>The CSS named colours (CSS Color Module Level 4), lowercase, as "#rrggbb", in alphabetical order.</summary>
    public static readonly IReadOnlyDictionary<string, string> CssNamedColors = new SortedDictionary<string, string>(StringComparer.Ordinal)
    {
        ["aliceblue"] = "#f0f8ff",
        ["antiquewhite"] = "#faebd7",
        ["aqua"] = "#00ffff",
        ["aquamarine"] = "#7fffd4",
        ["azure"] = "#f0ffff",
        ["beige"] = "#f5f5dc",
        ["bisque"] = "#ffe4c4",
        ["black"] = "#000000",
        ["blanchedalmond"] = "#ffebcd",
        ["blue"] = "#0000ff",
        ["blueviolet"] = "#8a2be2",
        ["brown"] = "#a52a2a",
        ["burlywood"] = "#deb887",
        ["cadetblue"] = "#5f9ea0",
        ["chartreuse"] = "#7fff00",
        ["chocolate"] = "#d2691e",
        ["coral"] = "#ff7f50",
        ["cornflowerblue"] = "#6495ed",
        ["cornsilk"] = "#fff8dc",
        ["crimson"] = "#dc143c",
        ["cyan"] = "#00ffff",
        ["darkblue"] = "#00008b",
        ["darkcyan"] = "#008b8b",
        ["darkgoldenrod"] = "#b8860b",
        ["darkgray"] = "#a9a9a9",
        ["darkgreen"] = "#006400",
        ["darkgrey"] = "#a9a9a9",
        ["darkkhaki"] = "#bdb76b",
        ["darkmagenta"] = "#8b008b",
        ["darkolivegreen"] = "#556b2f",
        ["darkorange"] = "#ff8c00",
        ["darkorchid"] = "#9932cc",
        ["darkred"] = "#8b0000",
        ["darksalmon"] = "#e9967a",
        ["darkseagreen"] = "#8fbc8f",
        ["darkslateblue"] = "#483d8b",
        ["darkslategray"] = "#2f4f4f",
        ["darkslategrey"] = "#2f4f4f",
        ["darkturquoise"] = "#00ced1",
        ["darkviolet"] = "#9400d3",
        ["deeppink"] = "#ff1493",
        ["deepskyblue"] = "#00bfff",
        ["dimgray"] = "#696969",
        ["dimgrey"] = "#696969",
        ["dodgerblue"] = "#1e90ff",
        ["firebrick"] = "#b22222",
        ["floralwhite"] = "#fffaf0",
        ["forestgreen"] = "#228b22",
        ["fuchsia"] = "#ff00ff",
        ["gainsboro"] = "#dcdcdc",
        ["ghostwhite"] = "#f8f8ff",
        ["gold"] = "#ffd700",
        ["goldenrod"] = "#daa520",
        ["gray"] = "#808080",
        ["green"] = "#008000",
        ["greenyellow"] = "#adff2f",
        ["grey"] = "#808080",
        ["honeydew"] = "#f0fff0",
        ["hotpink"] = "#ff69b4",
        ["indianred"] = "#cd5c5c",
        ["indigo"] = "#4b0082",
        ["ivory"] = "#fffff0",
        ["khaki"] = "#f0e68c",
        ["lavender"] = "#e6e6fa",
        ["lavenderblush"] = "#fff0f5",
        ["lawngreen"] = "#7cfc00",
        ["lemonchiffon"] = "#fffacd",
        ["lightblue"] = "#add8e6",
        ["lightcoral"] = "#f08080",
        ["lightcyan"] = "#e0ffff",
        ["lightgoldenrodyellow"] = "#fafad2",
        ["lightgray"] = "#d3d3d3",
        ["lightgreen"] = "#90ee90",
        ["lightgrey"] = "#d3d3d3",
        ["lightpink"] = "#ffb6c1",
        ["lightsalmon"] = "#ffa07a",
        ["lightseagreen"] = "#20b2aa",
        ["lightskyblue"] = "#87cefa",
        ["lightslategray"] = "#778899",
        ["lightslategrey"] = "#778899",
        ["lightsteelblue"] = "#b0c4de",
        ["lightyellow"] = "#ffffe0",
        ["lime"] = "#00ff00",
        ["limegreen"] = "#32cd32",
        ["linen"] = "#faf0e6",
        ["magenta"] = "#ff00ff",
        ["maroon"] = "#800000",
        ["mediumaquamarine"] = "#66cdaa",
        ["mediumblue"] = "#0000cd",
        ["mediumorchid"] = "#ba55d3",
        ["mediumpurple"] = "#9370db",
        ["mediumseagreen"] = "#3cb371",
        ["mediumslateblue"] = "#7b68ee",
        ["mediumspringgreen"] = "#00fa9a",
        ["mediumturquoise"] = "#48d1cc",
        ["mediumvioletred"] = "#c71585",
        ["midnightblue"] = "#191970",
        ["mintcream"] = "#f5fffa",
        ["mistyrose"] = "#ffe4e1",
        ["moccasin"] = "#ffe4b5",
        ["navajowhite"] = "#ffdead",
        ["navy"] = "#000080",
        ["oldlace"] = "#fdf5e6",
        ["olive"] = "#808000",
        ["olivedrab"] = "#6b8e23",
        ["orange"] = "#ffa500",
        ["orangered"] = "#ff4500",
        ["orchid"] = "#da70d6",
        ["palegoldenrod"] = "#eee8aa",
        ["palegreen"] = "#98fb98",
        ["paleturquoise"] = "#afeeee",
        ["palevioletred"] = "#db7093",
        ["papayawhip"] = "#ffefd5",
        ["peachpuff"] = "#ffdab9",
        ["peru"] = "#cd853f",
        ["pink"] = "#ffc0cb",
        ["plum"] = "#dda0dd",
        ["powderblue"] = "#b0e0e6",
        ["purple"] = "#800080",
        ["rebeccapurple"] = "#663399",
        ["red"] = "#ff0000",
        ["rosybrown"] = "#bc8f8f",
        ["royalblue"] = "#4169e1",
        ["saddlebrown"] = "#8b4513",
        ["salmon"] = "#fa8072",
        ["sandybrown"] = "#f4a460",
        ["seagreen"] = "#2e8b57",
        ["seashell"] = "#fff5ee",
        ["sienna"] = "#a0522d",
        ["silver"] = "#c0c0c0",
        ["skyblue"] = "#87ceeb",
        ["slateblue"] = "#6a5acd",
        ["slategray"] = "#708090",
        ["slategrey"] = "#708090",
        ["snow"] = "#fffafa",
        ["springgreen"] = "#00ff7f",
        ["steelblue"] = "#4682b4",
        ["tan"] = "#d2b48c",
        ["teal"] = "#008080",
        ["thistle"] = "#d8bfd8",
        ["tomato"] = "#ff6347",
        ["turquoise"] = "#40e0d0",
        ["violet"] = "#ee82ee",
        ["wheat"] = "#f5deb3",
        ["white"] = "#ffffff",
        ["whitesmoke"] = "#f5f5f5",
        ["yellow"] = "#ffff00",
        ["yellowgreen"] = "#9acd32",
    };

    /// <summary>The CSS names in alphabetical order.</summary>
    public static readonly IReadOnlyList<string> CssNames = CssNamedColors.Keys.ToList();

    // JavaScript's Math.round: halves round up, toward positive infinity (C#'s default rounds them to even).
    private static double JsRound(double n) => Math.Floor(n + 0.5);
    private static double Clamp(double n, double lo, double hi) => Math.Min(hi, Math.Max(lo, n));
    private static double Mod(double a, double n) => a % n;

    [GeneratedRegex("^#?([0-9a-f]{3}|[0-9a-f]{6})$", RegexOptions.IgnoreCase)]
    private static partial Regex HexPattern();

    /// <summary>"#abc", "#aabbcc", "abc" or "aabbcc" (any case) as "#aabbcc"; anything else is null.</summary>
    public static string? NormalizeHex(string? input)
    {
        var m = HexPattern().Match((input ?? "").Trim());
        if (!m.Success) return null;
        var hex = m.Groups[1].Value.ToLowerInvariant();
        if (hex.Length == 3) hex = string.Concat(hex.Select(c => $"{c}{c}"));
        return "#" + hex;
    }

    public static Rgb? HexToRgb(string? hex)
    {
        var h = NormalizeHex(hex);
        if (h is null) return null;
        int Part(int i) => int.Parse(h.AsSpan(i, 2), NumberStyles.HexNumber, CultureInfo.InvariantCulture);
        return new Rgb(Part(1), Part(3), Part(5));
    }

    public static string RgbToHex(Rgb rgb)
    {
        string Part(double n) => ((int)Clamp(JsRound(n), 0, 255)).ToString("x2", CultureInfo.InvariantCulture);
        return "#" + Part(rgb.R) + Part(rgb.G) + Part(rgb.B);
    }

    public static Hsl RgbToHsl(Rgb rgb)
    {
        double rr = rgb.R / 255, gg = rgb.G / 255, bb = rgb.B / 255;
        var max = Math.Max(rr, Math.Max(gg, bb));
        var min = Math.Min(rr, Math.Min(gg, bb));
        var l = (max + min) / 2;
        double h = 0, s = 0;
        if (max != min)
        {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            if (max == rr) h = (gg - bb) / d + (gg < bb ? 6 : 0);
            else if (max == gg) h = (bb - rr) / d + 2;
            else h = (rr - gg) / d + 4;
            h *= 60;
        }
        return new Hsl(JsRound(h), JsRound(s * 100), JsRound(l * 100));
    }

    public static Rgb HslToRgb(Hsl hsl)
    {
        var hh = Mod(Mod(hsl.H, 360) + 360, 360) / 360;
        var ss = Clamp(hsl.S, 0, 100) / 100;
        var ll = Clamp(hsl.L, 0, 100) / 100;
        if (ss == 0)
        {
            var v = ll * 255;
            return new Rgb(v, v, v);
        }
        var q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
        var p = 2 * ll - q;
        double Channel(double t)
        {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1.0 / 6) return p + (q - p) * 6 * t;
            if (t < 1.0 / 2) return q;
            if (t < 2.0 / 3) return p + (q - p) * (2.0 / 3 - t) * 6;
            return p;
        }
        return new Rgb(Channel(hh + 1.0 / 3) * 255, Channel(hh) * 255, Channel(hh - 1.0 / 3) * 255);
    }

    public static Hsl? HexToHsl(string? hex) => HexToRgb(hex) is { } rgb ? RgbToHsl(rgb) : null;
    public static string HslToHex(Hsl hsl) => RgbToHex(HslToRgb(hsl));

    public static Hsb RgbToHsb(Rgb rgb)
    {
        double rr = rgb.R / 255, gg = rgb.G / 255, bb = rgb.B / 255;
        var max = Math.Max(rr, Math.Max(gg, bb));
        var d = max - Math.Min(rr, Math.Min(gg, bb));
        double h = 0;
        if (d != 0)
        {
            if (max == rr) h = Mod((gg - bb) / d, 6);
            else if (max == gg) h = (bb - rr) / d + 2;
            else h = (rr - gg) / d + 4;
            h = Mod(h * 60 + 360, 360);
        }
        return new Hsb(JsRound(h), JsRound(max == 0 ? 0 : d / max * 100), JsRound(max * 100));
    }

    public static Rgb HsbToRgb(Hsb hsb)
    {
        var ss = Clamp(hsb.S, 0, 100) / 100;
        var v = Clamp(hsb.B, 0, 100) / 100;
        var hh = Mod(Mod(hsb.H, 360) + 360, 360) / 60;
        var c = v * ss;
        var x = c * (1 - Math.Abs(Mod(hh, 2) - 1));
        var m = v - c;
        var (r1, g1, b1) = hh < 1 ? (c, x, 0.0)
            : hh < 2 ? (x, c, 0.0)
            : hh < 3 ? (0.0, c, x)
            : hh < 4 ? (0.0, x, c)
            : hh < 5 ? (x, 0.0, c)
            : (c, 0.0, x);
        return new Rgb((r1 + m) * 255, (g1 + m) * 255, (b1 + m) * 255);
    }

    /// <summary>RGB to CMYK by the simple device-independent formula. Printing uses colour profiles; this is not a print conversion.</summary>
    public static Cmyk RgbToCmyk(Rgb rgb)
    {
        double rr = rgb.R / 255, gg = rgb.G / 255, bb = rgb.B / 255;
        var k = 1 - Math.Max(rr, Math.Max(gg, bb));
        if (k >= 1) return new Cmyk(0, 0, 0, 100);
        double Part(double n) => JsRound((1 - n - k) / (1 - k) * 100);
        return new Cmyk(Part(rr), Part(gg), Part(bb), JsRound(k * 100));
    }

    public static Rgb CmykToRgb(Cmyk cmyk)
    {
        var kk = 1 - Clamp(cmyk.K, 0, 100) / 100;
        double Ch(double n) => 255 * (1 - Clamp(n, 0, 100) / 100) * kk;
        return new Rgb(Ch(cmyk.C), Ch(cmyk.M), Ch(cmyk.Y));
    }

    public static Hsb? HexToHsb(string? hex) => HexToRgb(hex) is { } rgb ? RgbToHsb(rgb) : null;
    public static string HsbToHex(Hsb hsb) => RgbToHex(HsbToRgb(hsb));
    public static Cmyk? HexToCmyk(string? hex) => HexToRgb(hex) is { } rgb ? RgbToCmyk(rgb) : null;
    public static string CmykToHex(Cmyk cmyk) => RgbToHex(CmykToRgb(cmyk));

    /// <summary>The CSS name for a colour, when one has exactly this value (the first in alphabetical order, so "aqua" before "cyan").</summary>
    public static string? NameOfColor(string? hex)
    {
        var h = NormalizeHex(hex);
        if (h is null) return null;
        foreach (var (name, value) in CssNamedColors) if (value == h) return name;
        return null;
    }

    /// <summary>
    /// The default palette: 8 rows of 10. A row of greys from black to white, a row of strong hues, then six rows of
    /// the same ten hues from light to dark.
    /// </summary>
    public static IReadOnlyList<string> DefaultPalette()
    {
        int[] hues = [0, 15, 35, 55, 100, 175, 210, 235, 270, 310];
        var greys = Enumerable.Range(0, 10).Select(i =>
        {
            var v = JsRound(255.0 * i / 9);
            return RgbToHex(new Rgb(v, v, v));
        });
        var strong = hues.Select(h => HslToHex(new Hsl(h, 90, 50)));
        (double S, double L)[] steps = [(70, 90), (65, 80), (60, 68), (55, 52), (60, 38), (65, 24)];
        var tints = steps.SelectMany(step => hues.Select(h => HslToHex(new Hsl(h, step.S, step.L))));
        return greys.Concat(strong).Concat(tints).ToList();
    }

    /// <summary>Put <paramref name="color"/> first in <paramref name="recent"/>, without repeats, keeping at most <paramref name="max"/>.</summary>
    public static IReadOnlyList<string> PushRecent(IEnumerable<string> recent, string color, int max = 10) =>
        new[] { color }.Concat(recent.Where(c => c != color)).Take(Math.Max(0, max)).ToList();
}
