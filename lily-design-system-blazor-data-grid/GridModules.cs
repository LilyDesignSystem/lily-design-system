// Pure modules for the grid-like Blazor helpers (data grid, kanban board, Gantt chart, calendar): search matching,
// type-ahead, undo / redo history and cursor movement.
//
// Ported from the canonical Svelte package's shared/ modules (search-text, typeahead, edit-history, grid-navigation,
// direction). Blazor re-implements them in C# rather than copying the TypeScript; the unit tests carry the same vectors,
// so the two stay in step. The other three Blazor helpers reference this package, so they use these classes directly.

using System.Globalization;
using System.Text;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>A run of text, marked when a search term matched it.</summary>
public sealed record SearchSegment(string Text, bool Match);

/// <summary>
/// Search matching: a query is split on whitespace into terms; every term must appear (AND), in any order, ignoring case and
/// diacritics ("cafe" finds "Café"). An empty query matches everything.
/// </summary>
public static class SearchText
{
    /// <summary>Lower-case and strip combining marks, so matching ignores case and diacritics.</summary>
    public static string Fold(string text)
    {
        var decomposed = text.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder(decomposed.Length);
        foreach (var c in decomposed)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(c) is UnicodeCategory.NonSpacingMark or UnicodeCategory.SpacingCombiningMark or UnicodeCategory.EnclosingMark) continue;
            sb.Append(char.ToLowerInvariant(c));
        }
        return sb.ToString();
    }

    /// <summary>The terms of a query, folded; empty when the query is blank.</summary>
    public static IReadOnlyList<string> Terms(string? query)
        => string.IsNullOrWhiteSpace(query) ? Array.Empty<string>() : Fold(query).Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries);

    /// <summary>True when every term of <paramref name="query"/> appears in <paramref name="text"/>.</summary>
    public static bool Matches(string text, string? query)
    {
        var terms = Terms(query);
        if (terms.Count == 0) return true;
        var folded = Fold(text);
        return terms.All(term => folded.Contains(term, StringComparison.Ordinal));
    }

    /// <summary>The same test over text already folded (a search index folds each cell once).</summary>
    public static bool MatchesFolded(string foldedText, IReadOnlyList<string> terms)
        => terms.Count == 0 || terms.All(term => foldedText.Contains(term, StringComparison.Ordinal));

    /// <summary>
    /// <paramref name="text"/> cut into runs, marking the parts any term matches (for <c>&lt;mark&gt;</c>). Works per text element
    /// and falls back to one unmarked run if folding would change a character's length.
    /// </summary>
    public static IReadOnlyList<SearchSegment> Highlight(string text, string? query)
    {
        var terms = Terms(query);
        if (terms.Count == 0 || text.Length == 0) return new[] { new SearchSegment(text, false) };
        var elements = new List<string>();
        var e = StringInfo.GetTextElementEnumerator(text);
        while (e.MoveNext()) elements.Add((string)e.Current);
        var folded = elements.Select(Fold).ToList();
        if (folded.Any(f => f.Length != 1)) return new[] { new SearchSegment(text, false) };
        var flat = string.Concat(folded);
        var marked = new bool[elements.Count];
        foreach (var term in terms)
            for (var at = flat.IndexOf(term, StringComparison.Ordinal); at != -1; at = flat.IndexOf(term, at + 1, StringComparison.Ordinal))
                for (var i = at; i < at + term.Length; i++) marked[i] = true;
        var runs = new List<(StringBuilder Text, bool Match)>();
        for (var i = 0; i < elements.Count; i++)
        {
            if (runs.Count > 0 && runs[^1].Match == marked[i]) runs[^1].Text.Append(elements[i]);
            else runs.Add((new StringBuilder(elements[i]), marked[i]));
        }
        return runs.Select(r => new SearchSegment(r.Text.ToString(), r.Match)).ToList();
    }
}

/// <summary>Type-ahead for grids: typing letters moves to the next row whose label starts with them (the WAI-ARIA APG listbox model).</summary>
public static class Typeahead
{
    /// <summary>The prefix resets after this long a pause.</summary>
    public const int ResetMs = 700;

    /// <summary>The letters typed so far and when the last one was typed.</summary>
    public readonly record struct State(string Prefix, long At);

    /// <summary>Whether a key is a type-ahead character: one printable character, not a space, no Ctrl, Alt or Meta.</summary>
    public static bool IsKey(string key, bool ctrl = false, bool alt = false, bool meta = false)
        => new StringInfo(key).LengthInTextElements == 1 && key != " " && !ctrl && !alt && !meta;

    /// <summary>The prefix after <paramref name="key"/> at time <paramref name="now"/>: it grows while presses are within <paramref name="resetMs"/>, else starts over.</summary>
    public static State Next(State previous, string key, long now, int resetMs = ResetMs)
    {
        var continuing = previous.Prefix != "" && now - previous.At <= resetMs;
        return new State((continuing ? previous.Prefix : "") + key, now);
    }

    /// <summary>The index of the row to move to, or -1. Searches from the row after <paramref name="from"/> and wraps; a repeated single letter cycles.</summary>
    public static int FindMatch(IReadOnlyList<string> labels, int from, string prefix)
    {
        var folded = SearchText.Fold(prefix);
        if (folded.Length == 0 || labels.Count == 0) return -1;
        var repeated = folded.Length > 1 && folded.All(c => c == folded[0]);
        var needle = repeated ? folded[0].ToString() : folded;
        var startOffset = needle.Length > 1 ? 0 : 1;
        for (var step = 0; step < labels.Count; step++)
        {
            var index = (((from + startOffset + step) % labels.Count) + labels.Count) % labels.Count;
            if (SearchText.Fold(labels[index]).StartsWith(needle, StringComparison.Ordinal)) return index;
        }
        return -1;
    }
}

/// <summary>One accepted edit: which record and field, the value it took and the value it replaced.</summary>
public sealed record EditRecord(string OwnerId, string FieldId, object? Value, object? Previous);

/// <summary>Undo / redo stacks for edits. The component owns nothing else: the consumer owns the data, so an undo is reported like an edit.</summary>
public sealed record EditHistory(IReadOnlyList<EditRecord> Undo, IReadOnlyList<EditRecord> Redo)
{
    /// <summary>Most steps kept; the oldest fall off.</summary>
    public const int Limit = 100;

    /// <summary>No history.</summary>
    public static EditHistory Empty { get; } = new(Array.Empty<EditRecord>(), Array.Empty<EditRecord>());

    /// <summary>A new edit goes on the undo stack and ends any redo chain.</summary>
    public EditHistory Record(EditRecord record, int limit = Limit)
    {
        var undo = Undo.Append(record).ToList();
        if (undo.Count > limit) undo = undo.Skip(undo.Count - limit).ToList();
        return new EditHistory(undo, Array.Empty<EditRecord>());
    }

    /// <summary>Step back: the record to reverse (apply its <c>Previous</c>), and the history with it moved to the redo stack.</summary>
    public (EditHistory History, EditRecord? Record) UndoStep()
    {
        if (Undo.Count == 0) return (this, null);
        var record = Undo[^1];
        return (new EditHistory(Undo.Take(Undo.Count - 1).ToList(), Redo.Append(record).ToList()), record);
    }

    /// <summary>Step forward: the record to re-apply (apply its <c>Value</c>), and the history with it moved back to the undo stack.</summary>
    public (EditHistory History, EditRecord? Record) RedoStep()
    {
        if (Redo.Count == 0) return (this, null);
        var record = Redo[^1];
        return (new EditHistory(Undo.Append(record).ToList(), Redo.Take(Redo.Count - 1).ToList()), record);
    }

    /// <summary>"undo" for Ctrl/Cmd+Z, "redo" for Ctrl/Cmd+Shift+Z or Ctrl+Y, else null.</summary>
    public static string? KeyAction(string key, bool ctrl, bool meta, bool shift, bool alt)
    {
        if (alt || !(ctrl || meta)) return null;
        var k = key.ToLowerInvariant();
        if (k == "z") return shift ? "redo" : "undo";
        if (k == "y" && !shift) return "redo";
        return null;
    }
}

/// <summary>Where a grid cursor stands.</summary>
public readonly record struct GridPosition(int Row, int Col);

/// <summary>The limits and options of one cursor move.</summary>
public sealed record GridNavigation(int FirstRow, int LastRow, int LastCol, int PageStep, bool HomeEndMovesColumn = false, bool Rtl = false);

/// <summary>Cursor movement: the arrows, Home / End (with Ctrl or Cmd for the corners), PageUp / PageDown, and the right-to-left swap of the horizontal arrows.</summary>
public static class GridMotion
{
    /// <summary>In a right-to-left layout ArrowLeft and ArrowRight swap; everything else is unchanged.</summary>
    public static string LogicalKey(string key, bool rtl)
        => !rtl ? key : key == "ArrowLeft" ? "ArrowRight" : key == "ArrowRight" ? "ArrowLeft" : key;

    /// <summary>The position the key moves to, kept inside the grid, or null when the key is not a movement key.</summary>
    public static GridPosition? Move(string key, bool ctrlOrMeta, GridPosition at, GridNavigation nav)
    {
        int row = at.Row, col = at.Col;
        switch (LogicalKey(key, nav.Rtl))
        {
            case "ArrowRight": col += 1; break;
            case "ArrowLeft": col -= 1; break;
            case "ArrowDown": row += 1; break;
            case "ArrowUp": row -= 1; break;
            case "PageDown": row += nav.PageStep; break;
            case "PageUp": row -= nav.PageStep; break;
            case "Home":
                if (ctrlOrMeta) (row, col) = (nav.FirstRow, 0);
                else if (nav.HomeEndMovesColumn) row = nav.FirstRow;
                else col = 0;
                break;
            case "End":
                if (ctrlOrMeta) (row, col) = (nav.LastRow, nav.LastCol);
                else if (nav.HomeEndMovesColumn) row = nav.LastRow;
                else col = nav.LastCol;
                break;
            default: return null;
        }
        return new GridPosition(Math.Clamp(row, nav.FirstRow, Math.Max(nav.FirstRow, nav.LastRow)), Math.Clamp(col, 0, Math.Max(0, nav.LastCol)));
    }
}
