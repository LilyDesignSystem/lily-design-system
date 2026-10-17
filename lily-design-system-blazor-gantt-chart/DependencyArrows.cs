// Geometry for the dependency-arrow overlay — the same pure function as the Svelte
// package's dependency-arrows.ts, ported line for line so the two draw the same arrow.

using System.Globalization;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>A task bar's span in the chart's own coordinates (the cells that hold it).</summary>
internal readonly record struct ArrowBox(double Left, double Right, double Top, double Bottom)
{
    public double MidY => (Top + Bottom) / 2;
}

internal static class DependencyArrowGeometry
{
    /// <summary>How far an arrow runs clear of a bar before turning, in px.</summary>
    internal const double Gap = 8;

    private static string N(double v) => v.ToString("0.##", CultureInfo.InvariantCulture);

    /// <summary>
    /// An orthogonal path from the predecessor's bar to the successor's. <paramref name="kind"/> names the edges
    /// joined: <c>e2s</c> the predecessor's end to the successor's start, <c>s2s</c>, <c>s2e</c>, <c>e2e</c> likewise.
    /// The arrow always arrives horizontally, so the arrowhead points into the bar.
    /// </summary>
    internal static string Path(string kind, ArrowBox from, ArrowBox to, double gap = Gap)
    {
        var fromEnd = kind is "e2s" or "e2e";
        var toStart = kind is "e2s" or "s2s";
        var sx = fromEnd ? from.Right : from.Left;
        var tx = toStart ? to.Left : to.Right;
        var sy = from.MidY;
        var ty = to.MidY;
        var x1 = fromEnd ? sx + gap : sx - gap;
        var x2 = toStart ? tx - gap : tx + gap;
        var direct = fromEnd == toStart && (fromEnd ? x1 <= x2 : x1 >= x2);
        if (direct) return $"M{N(sx)} {N(sy)}H{N(x1)}V{N(ty)}H{N(tx)}";
        if (sy == ty) return $"M{N(sx)} {N(sy)}H{N(tx)}";
        var ym = ty > sy ? to.Top - 1 : to.Bottom + 1;
        return $"M{N(sx)} {N(sy)}H{N(x1)}V{N(ym)}H{N(x2)}V{N(ty)}H{N(tx)}";
    }

    /// <summary>The weekday (0 = Sunday … 6 = Saturday) of an epoch day.</summary>
    internal static int WeekdayOfEpochDay(long epochDay) => (int)((((epochDay + 4) % 7) + 7) % 7);
}
