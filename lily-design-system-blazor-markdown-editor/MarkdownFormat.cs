using System.Text.RegularExpressions;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>The text and selection after a tool has been applied.</summary>
public readonly record struct MarkdownEdit(string Text, int Start, int End);

/// <summary>
/// Pure Markdown formatting for a plain-text selection: no DOM, no strings of its own.
/// A C# port of <c>shared/markdown-format.ts</c>; where they disagree, the TypeScript wins.
/// </summary>
public static class MarkdownFormat
{
    /// <summary>The tool ids, in the default toolbar order.</summary>
    public static readonly IReadOnlyList<string> ToolIds = new[]
    {
        "heading", "bold", "italic", "strikethrough", "code", "link", "quote", "bulletList", "numberedList",
    };

    /// <summary>The marker each wrap tool puts on both sides of the selection.</summary>
    public static readonly IReadOnlyDictionary<string, string> WrapMarkers = new Dictionary<string, string>
    {
        ["bold"] = "**",
        ["italic"] = "*",
        ["strikethrough"] = "~~",
        ["code"] = "`",
    };

    private static readonly Regex Bullet = new(@"^([-*+]) ");
    private static readonly Regex Numbered = new(@"^\d+\. ");
    private static readonly Regex Quote = new(@"^> ?");
    private static readonly Regex Heading = new(@"^#{1,6} ");

    private static int TrailingAsterisks(string s)
    {
        var n = 0;
        while (n < s.Length && s[s.Length - 1 - n] == '*') n++;
        return n;
    }

    private static int LeadingAsterisks(string s)
    {
        var n = 0;
        while (n < s.Length && s[n] == '*') n++;
        return n;
    }

    /// <summary>
    /// Wrap the selection in <paramref name="marker"/>, or take it off when the selection is already
    /// wrapped. An empty selection inserts a pair and leaves the caret between them.
    /// </summary>
    public static MarkdownEdit ToggleWrap(string text, int start, int end, string marker)
    {
        var m = marker.Length;
        var before = text[..start];
        var selected = text[start..end];
        var after = text[end..];
        var asterisk = marker == "*" || marker == "**";

        bool Present(string closing, string opening)
        {
            if (!asterisk) return closing.EndsWith(marker, StringComparison.Ordinal) && opening.StartsWith(marker, StringComparison.Ordinal);
            var run = Math.Min(TrailingAsterisks(closing), LeadingAsterisks(opening));
            return marker == "*" ? run % 2 == 1 : run >= 2;
        }

        if (Present(before, after))
        {
            return new MarkdownEdit(before[..^m] + selected + after[m..], start - m, end - m);
        }

        var lead = LeadingAsterisks(selected);
        var trail = TrailingAsterisks(selected);
        var insidePresent = asterisk
            ? selected.Length > lead && (marker == "*" ? Math.Min(lead, trail) % 2 == 1 : Math.Min(lead, trail) >= 2)
            : selected.Length >= 2 * m && selected.StartsWith(marker, StringComparison.Ordinal) && selected.EndsWith(marker, StringComparison.Ordinal);
        if (insidePresent)
        {
            var inner = selected.Substring(m, selected.Length - 2 * m);
            return new MarkdownEdit(before + inner + after, start, start + inner.Length);
        }

        return new MarkdownEdit(before + marker + selected + marker + after, start + m, end + m);
    }

    /// <summary>Link: <c>[selection](https://)</c> with the address selected, ready to be typed over.</summary>
    public static MarkdownEdit InsertLink(string text, int start, int end)
    {
        const string url = "https://";
        var selected = text[start..end];
        var output = text[..start] + "[" + selected + "](" + url + ")" + text[end..];
        var urlStart = start + 1 + selected.Length + 2;
        if (selected.Length == 0) return new MarkdownEdit(output, start + 1, start + 1);
        return new MarkdownEdit(output, urlStart, urlStart + url.Length);
    }

    private static (int From, int To) LineBounds(string text, int start, int end)
    {
        var from = start == 0 ? 0 : text.LastIndexOf('\n', start - 1) + 1;
        var effectiveEnd = end > start && text[end - 1] == '\n' ? end - 1 : end;
        var nl = text.IndexOf('\n', effectiveEnd);
        return (from, nl == -1 ? text.Length : nl);
    }

    /// <summary>
    /// Put a prefix on every selected line, or take it off when every non-empty selected line already
    /// has it. Numbered lists count from 1; a competing prefix is replaced, not stacked.
    /// </summary>
    public static MarkdownEdit ToggleLines(string text, int start, int end, string tool, int headingLevel = 2)
    {
        var (from, to) = LineBounds(text, start, end);
        var lines = text[from..to].Split('\n');
        var matcher = tool switch
        {
            "heading" => Heading,
            "quote" => Quote,
            "bulletList" => Bullet,
            "numberedList" => Numbered,
            _ => throw new ArgumentException($"Not a line tool: {tool}", nameof(tool)),
        };
        string PrefixFor(int i) => tool switch
        {
            "heading" => new string('#', headingLevel) + " ",
            "quote" => "> ",
            "bulletList" => "- ",
            _ => $"{i + 1}. ",
        };
        var nonEmpty = lines.Where(l => l.Trim() != "").ToList();
        var alreadyAll = nonEmpty.Count > 0 && nonEmpty.All(l => matcher.IsMatch(l));
        string Strip(string l) => Quote.Replace(Numbered.Replace(Bullet.Replace(Heading.Replace(l, "", 1), "", 1), "", 1), "", 1);
        var n = 0;
        var next = lines.Select(l =>
        {
            if (alreadyAll) return matcher.Replace(l, "", 1);
            if (l.Trim() == "") return l;
            var output = PrefixFor(n) + (tool == "quote" && Quote.IsMatch(l) ? l : Strip(l));
            n++;
            return output;
        }).ToArray();
        var block = string.Join("\n", next);
        var delta = block.Length - (to - from);
        return new MarkdownEdit(
            text[..from] + block + text[to..],
            Math.Max(from, start + (next[0].Length - lines[0].Length)),
            Math.Max(from, end + delta));
    }

    /// <summary>Apply one tool to the text and selection.</summary>
    public static MarkdownEdit ApplyTool(string tool, string text, int start, int end, int headingLevel = 2)
    {
        if (WrapMarkers.TryGetValue(tool, out var marker)) return ToggleWrap(text, start, end, marker);
        if (tool == "link") return InsertLink(text, start, end);
        return ToggleLines(text, start, end, tool, headingLevel);
    }
}
