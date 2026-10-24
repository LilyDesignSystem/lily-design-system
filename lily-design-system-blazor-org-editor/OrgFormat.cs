using System.Globalization;
using System.Text.RegularExpressions;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>The text and selection after a tool has been applied.</summary>
public readonly record struct OrgEdit(string Text, int Start, int End);

/// <summary>Options for the heading-relative and dated tools; every member has a default.</summary>
public sealed record OrgOptions
{
    /// <summary>Stars the heading tool writes on a plain line. Default 1.</summary>
    public int HeadingLevel { get; init; } = 1;
    /// <summary>The task keywords the todo tool cycles through. Default TODO, DONE.</summary>
    public IReadOnlyList<string>? TodoKeywords { get; init; }
    /// <summary>The priority letters the priority tool cycles through. Default A, B, C.</summary>
    public IReadOnlyList<string>? Priorities { get; init; }
    /// <summary>Today as <c>YYYY-MM-DD</c>. Default: the local date.</summary>
    public string? Today { get; init; }
    /// <summary>The property the property tool adds. Default ID.</summary>
    public string PropertyKey { get; init; } = "ID";
    /// <summary>The drawer the drawer tool writes. Default LOGBOOK.</summary>
    public string DrawerName { get; init; } = "LOGBOOK";
    /// <summary>The properties a contact entry gets. Default EMAIL, PHONE, ADDRESS, BIRTHDAY.</summary>
    public IReadOnlyList<string>? ContactProperties { get; init; }
}

/// <summary>
/// Pure Emacs Org mode formatting for a plain-text selection: no DOM, no strings of its own.
/// A C# port of <c>shared/org-format.ts</c>; where they disagree, the TypeScript wins.
/// Org's own words (TODO, SCHEDULED:, :PROPERTIES:, #+BEGIN_QUOTE, the English weekday in a timestamp)
/// are syntax, not interface text.
/// </summary>
public static class OrgFormat
{
    /// <summary>The tool ids, in the default toolbar order.</summary>
    public static readonly IReadOnlyList<string> ToolIds = new[]
    {
        "heading", "promote", "demote", "todo", "priority", "scheduled", "deadline", "timestamp",
        "bold", "italic", "underline", "strikethrough", "code", "verbatim", "link",
        "bulletList", "numberedList", "checkbox", "quote", "sourceBlock", "property", "drawer", "contact",
    };

    /// <summary>The group each tool sits in, for a consumer's separators (<c>data-group</c>).</summary>
    public static readonly IReadOnlyDictionary<string, string> ToolGroups = new Dictionary<string, string>
    {
        ["heading"] = "structure", ["promote"] = "structure", ["demote"] = "structure", ["bulletList"] = "structure",
        ["numberedList"] = "structure", ["checkbox"] = "structure", ["quote"] = "structure", ["sourceBlock"] = "structure",
        ["todo"] = "task", ["priority"] = "task", ["scheduled"] = "task", ["deadline"] = "task", ["timestamp"] = "task",
        ["bold"] = "text", ["italic"] = "text", ["underline"] = "text", ["strikethrough"] = "text", ["code"] = "text",
        ["verbatim"] = "text", ["link"] = "text",
        ["property"] = "data", ["drawer"] = "data", ["contact"] = "data",
    };

    /// <summary>The marker each wrap tool puts on both sides of the selection.</summary>
    public static readonly IReadOnlyDictionary<string, string> WrapMarkers = new Dictionary<string, string>
    {
        ["bold"] = "*", ["italic"] = "/", ["underline"] = "_", ["strikethrough"] = "+", ["code"] = "~", ["verbatim"] = "=",
    };

    private static readonly string[] DefaultKeywords = { "TODO", "DONE" };
    private static readonly string[] DefaultPriorities = { "A", "B", "C" };
    private static readonly string[] DefaultContact = { "EMAIL", "PHONE", "ADDRESS", "BIRTHDAY" };
    private static readonly string[] Weekdays = { "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" };

    private static readonly Regex HeadingRx = new(@"^(\*+) ");
    private static readonly Regex PriorityRx = new(@"^\[#([A-Z])\](?: |$)");
    private static readonly Regex BulletRx = new(@"^[-+] (?:\[[ X-]\] )?");
    private static readonly Regex NumberedRx = new(@"^\d+[.)] ");
    private static readonly Regex CheckboxRx = new(@"^([-+] )\[([ X-])\] ");
    private static readonly Regex PlanningRx = new(@"^\s*(?:SCHEDULED|DEADLINE|CLOSED):");

    // ---- lines ----------------------------------------------------------------------------

    private static int LineStartOf(string text, int pos) => pos <= 0 ? 0 : text.LastIndexOf('\n', pos - 1) + 1;

    private static int LineEndOf(string text, int pos)
    {
        var nl = text.IndexOf('\n', pos);
        return nl == -1 ? text.Length : nl;
    }

    private static (int From, int To) LineBounds(string text, int start, int end)
    {
        var from = LineStartOf(text, start);
        var effectiveEnd = end > start && text[end - 1] == '\n' ? end - 1 : end;
        return (from, LineEndOf(text, effectiveEnd));
    }

    private static OrgEdit Unchanged(string text, int start, int end) => new(text, start, end);

    private static OrgEdit ReplaceLines(string text, int start, int end, int from, int to, IReadOnlyList<string> nextLines, int? firstDelta = null)
    {
        var block = string.Join("\n", nextLines);
        var delta = block.Length - (to - from);
        var first = firstDelta ?? (nextLines.Count > 0 ? nextLines[0].Length - text[from..LineEndOf(text, from)].Length : 0);
        return new OrgEdit(text[..from] + block + text[to..], Math.Max(from, start + first), Math.Max(from, end + delta));
    }

    // ---- headings -------------------------------------------------------------------------

    private sealed record Heading(int Stars, string Keyword, string Priority, string Title);

    private static Heading? ParseHeading(string line, IReadOnlyList<string> keywords)
    {
        var m = HeadingRx.Match(line);
        if (!m.Success) return null;
        var rest = line[m.Length..];
        var keyword = "";
        foreach (var k in keywords)
        {
            if (rest == k || rest.StartsWith(k + " ", StringComparison.Ordinal))
            {
                keyword = k;
                rest = rest.Length > k.Length ? rest[(k.Length + 1)..] : "";
                break;
            }
        }
        var priority = "";
        var p = PriorityRx.Match(rest);
        if (p.Success)
        {
            priority = p.Groups[1].Value;
            rest = rest[p.Length..];
        }
        return new Heading(m.Groups[1].Length, keyword, priority, rest);
    }

    private static string FormatHeading(Heading h)
    {
        var parts = new[] { h.Keyword, h.Priority != "" ? $"[#{h.Priority}]" : "", h.Title }.Where(p => p != "");
        return new string('*', h.Stars) + " " + string.Join(" ", parts);
    }

    private static string StripPrefix(string line) =>
        NumberedRx.Replace(BulletRx.Replace(HeadingRx.Replace(line, "", 1), "", 1), "", 1);

    private static (int From, int To, Heading Heading)? HeadingAbove(string text, int pos, IReadOnlyList<string> keywords)
    {
        var from = LineStartOf(text, pos);
        for (;;)
        {
            var to = LineEndOf(text, from);
            var heading = ParseHeading(text[from..to], keywords);
            if (heading is not null) return (from, to, heading);
            if (from == 0) return null;
            from = LineStartOf(text, from - 1);
        }
    }

    // ---- wrap and link --------------------------------------------------------------------

    /// <summary>Wrap the selection in <paramref name="marker"/>, or take it off when already wrapped.</summary>
    public static OrgEdit ToggleWrap(string text, int start, int end, string marker)
    {
        var m = marker.Length;
        var before = text[..start];
        var selected = text[start..end];
        var after = text[end..];
        if (before.EndsWith(marker, StringComparison.Ordinal) && after.StartsWith(marker, StringComparison.Ordinal))
            return new OrgEdit(before[..^m] + selected + after[m..], start - m, end - m);
        if (selected.Length >= 2 * m && selected.StartsWith(marker, StringComparison.Ordinal) && selected.EndsWith(marker, StringComparison.Ordinal))
        {
            var inner = selected.Substring(m, selected.Length - 2 * m);
            return new OrgEdit(before + inner + after, start, start + inner.Length);
        }
        return new OrgEdit(before + marker + selected + marker + after, start + m, end + m);
    }

    /// <summary>Link: <c>[[https://][selection]]</c> with the address selected; with no selection <c>[[https://]]</c>.</summary>
    public static OrgEdit InsertLink(string text, int start, int end)
    {
        const string url = "https://";
        var selected = text[start..end];
        var body = selected == "" ? $"[[{url}]]" : $"[[{url}][{selected}]]";
        return new OrgEdit(text[..start] + body + text[end..], start + 2, start + 2 + url.Length);
    }

    // ---- line prefixes --------------------------------------------------------------------

    /// <summary>Stars on every selected line, or off when every non-empty line is already a heading.</summary>
    public static OrgEdit ToggleHeading(string text, int start, int end, int level = 1)
    {
        var (from, to) = LineBounds(text, start, end);
        var lines = text[from..to].Split('\n');
        var nonEmpty = lines.Where(l => l.Trim() != "").ToList();
        var all = nonEmpty.Count > 0 && nonEmpty.All(l => HeadingRx.IsMatch(l));
        var next = lines.Select(l => all ? HeadingRx.Replace(l, "", 1) : l.Trim() == "" ? l : new string('*', level) + " " + StripPrefix(l)).ToList();
        return ReplaceLines(text, start, end, from, to, next);
    }

    /// <summary>Promote (-1, never below one star) or demote (+1) every selected heading.</summary>
    public static OrgEdit ShiftHeadings(string text, int start, int end, int direction)
    {
        var (from, to) = LineBounds(text, start, end);
        var lines = text[from..to].Split('\n');
        var touched = false;
        var next = lines.Select(l =>
        {
            var m = HeadingRx.Match(l);
            if (!m.Success) return l;
            if (direction == -1 && m.Groups[1].Length == 1) return l;
            touched = true;
            return direction == 1 ? "*" + l : l[1..];
        }).ToList();
        return touched ? ReplaceLines(text, start, end, from, to, next) : Unchanged(text, start, end);
    }

    /// <summary>Bulleted or numbered list on every selected line, or off when every non-empty line has it.</summary>
    public static OrgEdit ToggleList(string text, int start, int end, string tool)
    {
        var (from, to) = LineBounds(text, start, end);
        var lines = text[from..to].Split('\n');
        var matcher = tool == "bulletList" ? BulletRx : NumberedRx;
        var nonEmpty = lines.Where(l => l.Trim() != "").ToList();
        var all = nonEmpty.Count > 0 && nonEmpty.All(l => matcher.IsMatch(l));
        var n = 0;
        var next = lines.Select(l =>
        {
            if (all) return matcher.Replace(l, "", 1);
            if (l.Trim() == "") return l;
            var prefix = tool == "bulletList" ? "- " : $"{n + 1}. ";
            n++;
            return prefix + StripPrefix(l);
        }).ToList();
        return ReplaceLines(text, start, end, from, to, next);
    }

    /// <summary>Checkbox on the selected lines: none → [ ] → [X] → none, by the first non-empty line.</summary>
    public static OrgEdit CycleCheckbox(string text, int start, int end)
    {
        var (from, to) = LineBounds(text, start, end);
        var lines = text[from..to].Split('\n');
        var first = lines.FirstOrDefault(l => l.Trim() != "");
        if (first is null) return Unchanged(text, start, end);
        var m = CheckboxRx.Match(first);
        var state = m.Success ? (m.Groups[2].Value == " " ? "open" : "done") : "none";
        var next = lines.Select(l =>
        {
            if (l.Trim() == "") return l;
            var body = HeadingRx.Replace(NumberedRx.Replace(BulletRx.Replace(l, "", 1), "", 1), "", 1);
            return state switch { "none" => "- [ ] " + body, "open" => "- [X] " + body, _ => body };
        }).ToList();
        return ReplaceLines(text, start, end, from, to, next);
    }

    // ---- blocks ---------------------------------------------------------------------------

    /// <summary>Wrap the selected lines in begin and end lines, or take the wrapper off when already wrapped.</summary>
    public static OrgEdit ToggleBlock(string text, int start, int end, string begin, string endLine, Func<string, bool> isBegin, Func<string, bool> isEnd)
    {
        var (from, to) = LineBounds(text, start, end);
        var lines = text[from..to].Split('\n');
        if (lines.Length >= 2 && isBegin(lines[0]) && isEnd(lines[^1]))
        {
            var block = string.Join("\n", lines[1..^1]);
            return new OrgEdit(text[..from] + block + text[to..], from, from + block.Length);
        }
        if (from > 0 && to < text.Length)
        {
            var prevFrom = LineStartOf(text, from - 1);
            var nextTo = LineEndOf(text, to + 1);
            if (isBegin(text[prevFrom..(from - 1)]) && isEnd(text[(to + 1)..nextTo]))
            {
                var block = text[from..to];
                return new OrgEdit(text[..prevFrom] + block + text[nextTo..], prevFrom, prevFrom + block.Length);
            }
        }
        var inner = string.Join("\n", lines);
        var innerStart = from + begin.Length + 1;
        return new OrgEdit(text[..from] + begin + "\n" + inner + "\n" + endLine + text[to..], innerStart, innerStart + inner.Length);
    }

    private static Func<string, bool> IsBeginBlock(string name) =>
        l => Regex.IsMatch(l.Trim(), $@"^#\+begin_{name}(\s|$)", RegexOptions.IgnoreCase);

    private static Func<string, bool> IsEndBlock(string name) =>
        l => Regex.IsMatch(l.Trim(), $@"^#\+end_{name}\s*$", RegexOptions.IgnoreCase);

    private static bool IsBeginDrawer(string l) => Regex.IsMatch(l.Trim(), @"^:[^\s:]+:\s*$") && !Regex.IsMatch(l.Trim(), @"^:END:\s*$", RegexOptions.IgnoreCase);

    private static bool IsEndDrawer(string l) => Regex.IsMatch(l.Trim(), @"^:END:\s*$", RegexOptions.IgnoreCase);

    // ---- dates ----------------------------------------------------------------------------

    /// <summary>The local date as <c>YYYY-MM-DD</c>.</summary>
    public static string LocalToday(DateTime? now = null) => (now ?? DateTime.Now).ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);

    /// <summary><c>2026-10-24</c> → <c>2026-10-24 Sat</c>, by date arithmetic (no culture).</summary>
    public static string DayStamp(string iso)
    {
        var p = iso.Split('-').Select(int.Parse).ToArray();
        var weekday = (int)new DateTime(p[0], p[1], p[2], 0, 0, 0, DateTimeKind.Utc).DayOfWeek;
        return $"{iso} {Weekdays[weekday]}";
    }

    /// <summary>Insert an active timestamp over the selection, with the date selected.</summary>
    public static OrgEdit InsertTimestamp(string text, int start, int end, string today)
    {
        var stamp = DayStamp(today);
        return new OrgEdit(text[..start] + $"<{stamp}>" + text[end..], start + 1, start + 1 + stamp.Length);
    }

    // ---- tasks ----------------------------------------------------------------------------

    /// <summary>The line at the caret moves one step along none → keyword 1 → … → last keyword → none.</summary>
    public static OrgEdit CycleTodo(string text, int start, int end, IReadOnlyList<string>? keywords = null, int level = 1)
    {
        keywords ??= DefaultKeywords;
        var from = LineStartOf(text, start);
        var to = LineEndOf(text, from);
        var line = text[from..to];
        var h = ParseHeading(line, keywords);
        string next;
        if (h is not null)
        {
            var at = h.Keyword == "" ? -1 : keywords.ToList().IndexOf(h.Keyword);
            var keyword = h.Keyword == "" ? (keywords.Count > 0 ? keywords[0] : "") : at + 1 < keywords.Count ? keywords[at + 1] : "";
            next = FormatHeading(h with { Keyword = keyword });
        }
        else
        {
            next = FormatHeading(new Heading(level, keywords.Count > 0 ? keywords[0] : "", "", StripPrefix(line)));
        }
        return ReplaceLines(text, start, end, from, to, new[] { next }, next.Length - line.Length);
    }

    /// <summary>The line at the caret moves one step along none → A → B → C → none.</summary>
    public static OrgEdit CyclePriority(string text, int start, int end, IReadOnlyList<string>? priorities = null, IReadOnlyList<string>? keywords = null, int level = 1)
    {
        priorities ??= DefaultPriorities;
        keywords ??= DefaultKeywords;
        var from = LineStartOf(text, start);
        var to = LineEndOf(text, from);
        var line = text[from..to];
        var h = ParseHeading(line, keywords) ?? new Heading(level, "", "", StripPrefix(line));
        var at = h.Priority == "" ? -1 : priorities.ToList().IndexOf(h.Priority);
        var priority = h.Priority == "" ? (priorities.Count > 0 ? priorities[0] : "") : at + 1 < priorities.Count ? priorities[at + 1] : "";
        var next = FormatHeading(h with { Priority = priority });
        return ReplaceLines(text, start, end, from, to, new[] { next }, next.Length - line.Length);
    }

    private static int AfterPlanning(string text, int headingTo)
    {
        if (headingTo >= text.Length) return text.Length;
        var nextFrom = headingTo + 1;
        var nextTo = LineEndOf(text, nextFrom);
        return PlanningRx.IsMatch(text[nextFrom..nextTo]) ? nextTo : headingTo;
    }

    /// <summary>Put <c>SCHEDULED: &lt;date&gt;</c> or <c>DEADLINE: …</c> on the heading's planning line, or take it off.</summary>
    public static OrgEdit TogglePlanning(string text, int start, int end, string keyword, string today, IReadOnlyList<string>? keywords = null)
    {
        keywords ??= DefaultKeywords;
        var found = HeadingAbove(text, start, keywords);
        if (found is null) return Unchanged(text, start, end);
        var (_, headingTo, _) = found.Value;
        var planFrom = headingTo + 1;
        var hasPlan = headingTo < text.Length && PlanningRx.IsMatch(text[planFrom..LineEndOf(text, planFrom)]);
        var day = DayStamp(today);
        var stamp = $"{keyword}: <{day}>";

        if (!hasPlan)
        {
            var at = headingTo + 1 + keyword.Length + 3;
            return new OrgEdit(text[..headingTo] + "\n" + stamp + text[headingTo..], at, at + day.Length);
        }
        var planTo = LineEndOf(text, planFrom);
        var plan = text[planFrom..planTo];
        var existing = Regex.Match(plan, $@"\s*{keyword}: [<\[][^>\]]*[>\]]");
        if (existing.Success)
        {
            var remaining = (plan[..existing.Index] + plan[(existing.Index + existing.Length)..]).Trim();
            if (remaining == "") return new OrgEdit(text[..headingTo] + text[planTo..], headingTo, headingTo);
            return new OrgEdit(text[..planFrom] + remaining + text[planTo..], planFrom, planFrom);
        }
        var selAt = planTo + 1 + keyword.Length + 3;
        return new OrgEdit(text[..planTo] + " " + stamp + text[planTo..], selAt, selAt + day.Length);
    }

    // ---- properties, drawers, contacts ----------------------------------------------------

    /// <summary>Add <c>:KEY: </c> to the heading's property drawer, creating it; a key already there is not added again.</summary>
    public static OrgEdit AddProperty(string text, int start, int end, string key = "ID", IReadOnlyList<string>? keywords = null)
    {
        keywords ??= DefaultKeywords;
        var found = HeadingAbove(text, start, keywords);
        if (found is null)
        {
            var top = $":PROPERTIES:\n:{key}: \n:END:\n" + text;
            var caret = ":PROPERTIES:\n".Length + $":{key}: ".Length;
            return new OrgEdit(top, caret, caret);
        }
        var anchor = AfterPlanning(text, found.Value.To);
        var dFrom = anchor + 1;
        var dTo = anchor < text.Length ? LineEndOf(text, dFrom) : text.Length;
        if (anchor < text.Length && Regex.IsMatch(text[dFrom..dTo], @"^\s*:PROPERTIES:\s*$", RegexOptions.IgnoreCase))
        {
            var cur = dTo + 1;
            while (cur <= text.Length)
            {
                var curTo = LineEndOf(text, cur);
                if (Regex.IsMatch(text[cur..curTo], @"^\s*:END:\s*$", RegexOptions.IgnoreCase))
                {
                    var body = text[(dTo + 1)..cur];
                    var m = Regex.Match(body, $@"^\s*:{Regex.Escape(key)}:", RegexOptions.IgnoreCase | RegexOptions.Multiline);
                    if (m.Success)
                    {
                        var lineEnd = dTo + 1 + LineEndOf(body, m.Index);
                        return new OrgEdit(text, lineEnd, lineEnd);
                    }
                    var add = $":{key}: ";
                    return new OrgEdit(text[..cur] + add + "\n" + text[cur..], cur + add.Length, cur + add.Length);
                }
                if (curTo >= text.Length) break;
                cur = curTo + 1;
            }
        }
        var drawer = $"\n:PROPERTIES:\n:{key}: \n:END:";
        var at = anchor + "\n:PROPERTIES:\n".Length + $":{key}: ".Length;
        return new OrgEdit(text[..anchor] + drawer + text[anchor..], at, at);
    }

    /// <summary>A contact entry: a heading one level under the heading above, holding a property drawer.</summary>
    public static OrgEdit InsertContact(string text, int start, int end, IReadOnlyList<string>? properties = null, int level = 1, IReadOnlyList<string>? keywords = null)
    {
        properties ??= DefaultContact;
        keywords ??= DefaultKeywords;
        var above = HeadingAbove(text, start, keywords);
        var stars = above is null ? level : above.Value.Heading.Stars + 1;
        var name = text[start..end];
        var atLineStart = start == 0 || text[start - 1] == '\n';
        var lead = atLineStart ? "" : "\n";
        var head = $"{new string('*', stars)} {name}\n:PROPERTIES:\n";
        var rows = string.Join("\n", properties.Select(p => $":{p}: "));
        var entry = lead + head + rows + (rows != "" ? "\n" : "") + ":END:";
        var firstRow = start + lead.Length + head.Length;
        var caret = firstRow + (properties.Count > 0 ? $":{properties[0]}: ".Length : 0);
        return new OrgEdit(text[..start] + entry + text[end..], caret, caret);
    }

    // ---- dispatch -------------------------------------------------------------------------

    /// <summary>Apply one tool to the text and selection.</summary>
    public static OrgEdit ApplyTool(string tool, string text, int start, int end, OrgOptions? options = null)
    {
        options ??= new OrgOptions();
        var keywords = options.TodoKeywords ?? DefaultKeywords;
        var today = options.Today ?? LocalToday();
        if (WrapMarkers.TryGetValue(tool, out var marker)) return ToggleWrap(text, start, end, marker);
        switch (tool)
        {
            case "link": return InsertLink(text, start, end);
            case "heading": return ToggleHeading(text, start, end, options.HeadingLevel);
            case "promote": return ShiftHeadings(text, start, end, -1);
            case "demote": return ShiftHeadings(text, start, end, 1);
            case "bulletList":
            case "numberedList": return ToggleList(text, start, end, tool);
            case "checkbox": return CycleCheckbox(text, start, end);
            case "quote": return ToggleBlock(text, start, end, "#+BEGIN_QUOTE", "#+END_QUOTE", IsBeginBlock("quote"), IsEndBlock("quote"));
            case "sourceBlock": return ToggleBlock(text, start, end, "#+BEGIN_SRC", "#+END_SRC", IsBeginBlock("src"), IsEndBlock("src"));
            case "drawer": return ToggleBlock(text, start, end, $":{options.DrawerName}:", ":END:", IsBeginDrawer, IsEndDrawer);
            case "todo": return CycleTodo(text, start, end, keywords, options.HeadingLevel);
            case "priority": return CyclePriority(text, start, end, options.Priorities ?? DefaultPriorities, keywords, options.HeadingLevel);
            case "scheduled": return TogglePlanning(text, start, end, "SCHEDULED", today, keywords);
            case "deadline": return TogglePlanning(text, start, end, "DEADLINE", today, keywords);
            case "timestamp": return InsertTimestamp(text, start, end, today);
            case "property": return AddProperty(text, start, end, options.PropertyKey, keywords);
            case "contact": return InsertContact(text, start, end, options.ContactProperties ?? DefaultContact, options.HeadingLevel, keywords);
            default: return Unchanged(text, start, end);
        }
    }
}
