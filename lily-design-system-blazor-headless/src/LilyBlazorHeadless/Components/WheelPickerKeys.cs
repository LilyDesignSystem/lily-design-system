using System.Globalization;
using System.Text;

namespace LilyBlazorHeadless.Components;

/// <summary>
/// The keyboard model of <see cref="WheelPicker"/>: a single-select listbox where the selection follows the cursor. A port of
/// shared/wheel-picker.ts. Disabled options are skipped by every move; arrows wrap only with <c>loop</c>; Home, End, PageUp and
/// PageDown never wrap.
/// </summary>
public static class WheelPickerKeys
{
    public static readonly string[] MoveKeys = ["ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"];

    public const int TypeaheadResetMs = 700;

    /// <summary>The index to select after <paramref name="key"/>, or -1 when no option can be selected. <paramref name="current"/> is -1 for none.</summary>
    public static int NextIndex(IReadOnlyList<WheelPickerOption> options, int current, string key, bool loop = false, int pageSize = 5)
    {
        var enabled = new List<int>();
        for (var i = 0; i < options.Count; i++) if (!options[i].Disabled) enabled.Add(i);
        if (enabled.Count == 0) return -1;
        var first = enabled[0];
        var last = enabled[^1];
        var position = enabled.IndexOf(current);
        pageSize = Math.Max(1, pageSize);

        if (key == "Home") return first;
        if (key == "End") return last;
        if (position == -1) return key is "ArrowDown" or "PageDown" ? first : last;

        return key switch
        {
            "ArrowDown" => position + 1 < enabled.Count ? enabled[position + 1] : loop ? first : current,
            "ArrowUp" => position > 0 ? enabled[position - 1] : loop ? last : current,
            "PageDown" => enabled[Math.Min(enabled.Count - 1, position + pageSize)],
            "PageUp" => enabled[Math.Max(0, position - pageSize)],
            _ => current,
        };
    }

    /// <summary>Whether a key is a type-ahead character: one printable character other than space, no Ctrl, Alt or Meta.</summary>
    public static bool IsTypeaheadKey(string key, bool ctrl, bool alt, bool meta) =>
        key.Length == 1 && key != " " && !ctrl && !alt && !meta;

    /// <summary>The prefix after <paramref name="key"/> at <paramref name="nowMs"/>: it grows within the reset time, else starts over.</summary>
    public static (string Prefix, long At) NextPrefix((string Prefix, long At) previous, string key, long nowMs) =>
        ((previous.Prefix != "" && nowMs - previous.At <= TypeaheadResetMs ? previous.Prefix : "") + key, nowMs);

    /// <summary>The enabled option to move to for <paramref name="prefix"/>, or -1. A prefix of one repeated letter counts as that letter.</summary>
    public static int TypeaheadIndex(IReadOnlyList<WheelPickerOption> options, int current, string prefix)
    {
        var folded = Fold(prefix);
        if (folded == "" || options.Count == 0) return -1;
        var repeated = folded.Length > 1 && folded.All(c => c == folded[0]);
        var needle = repeated ? folded[0].ToString() : folded;
        var startOffset = needle.Length > 1 ? 0 : 1;
        var from = current < 0 ? -startOffset : current;
        for (var step = 0; step < options.Count; step++)
        {
            var index = ((from + startOffset + step) % options.Count + options.Count) % options.Count;
            if (!options[index].Disabled && Fold(options[index].Label).StartsWith(needle, StringComparison.Ordinal)) return index;
        }
        return -1;
    }

    /// <summary>Lower-case and strip diacritics so "é" is typed with "e".</summary>
    private static string Fold(string text)
    {
        var sb = new StringBuilder();
        foreach (var c in text.Normalize(NormalizationForm.FormD))
            if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark) sb.Append(c);
        return sb.ToString().ToLowerInvariant();
    }
}
