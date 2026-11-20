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

    /// <summary>
    /// The move a physical key makes, or null when it does not move the wheel. Vertical wheels move with ArrowUp / ArrowDown,
    /// horizontal ones with ArrowLeft / ArrowRight, swapped when <paramref name="rtl"/>; Home, End, PageUp and PageDown move
    /// either. A port of <c>wheelMoveKey</c> in shared/wheel-picker.ts.
    /// </summary>
    public static string? MoveKey(string key, string orientation = "vertical", bool rtl = false)
    {
        if (key is "Home" or "End" or "PageUp" or "PageDown") return key;
        if (orientation == "horizontal")
            return key switch
            {
                "ArrowRight" => rtl ? "ArrowUp" : "ArrowDown",
                "ArrowLeft" => rtl ? "ArrowDown" : "ArrowUp",
                _ => null,
            };
        return key is "ArrowDown" or "ArrowUp" ? key : null;
    }

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
    public static bool IsTypeaheadKey(string key, bool ctrl, bool alt, bool meta)
    {
        if (key.Length == 0 || ctrl || alt || meta) return false;
        var normalized = key.Normalize(NormalizationForm.FormC);
        return Rune.TryGetRuneAt(normalized, 0, out var initial)
            && initial.Utf16SequenceLength == normalized.Length
            && initial.Value != ' '
            && Rune.GetUnicodeCategory(initial) is not (UnicodeCategory.Control or UnicodeCategory.Format);
    }

    /// <summary>The prefix after <paramref name="key"/> at <paramref name="nowMs"/>: it grows within the reset time, else starts over.</summary>
    public static (string Prefix, long At) NextPrefix((string Prefix, long At) previous, string key, long nowMs) =>
        ((previous.Prefix != "" && nowMs - previous.At <= TypeaheadResetMs ? previous.Prefix : "") + key, nowMs);

    /// <summary>The enabled option to move to for <paramref name="prefix"/>, or -1. A prefix of one repeated letter counts as that letter.</summary>
    public static int TypeaheadIndex(IReadOnlyList<WheelPickerOption> options, int current, string prefix)
    {
        var initials = prefix.Normalize(NormalizationForm.FormC).EnumerateRunes()
            .Select(initial => Fold(initial.ToString())).Where(initial => initial.Length > 0).ToArray();
        if (initials.Length == 0 || options.Count == 0) return -1;
        var cycle = initials.All(initial => initial == initials[0]);
        var needle = cycle ? initials[0] : Fold(prefix);
        var startOffset = cycle ? 1 : 0;
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
