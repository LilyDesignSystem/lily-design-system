namespace LilyBlazorWebExamples.Data;

// Plan P6-T5: the /components search's suffix-pattern filter.
//
// A slug's suffix pattern is derived purely from the slug string — no
// generated data file needed. The list below mirrors two canonical
// sources verbatim: the "Suffix → HTML element mapping" table and the
// "Component name patterns" compound families, both in
// AGENTS/components.md. It is ordered longest-suffix-first so e.g.
// "table-head" matches before the bare "head" would (which isn't even
// a listed suffix), and "list-item" matches before "list". Ported
// verbatim from the canonical Svelte reference:
// lily-design-system-svelte-sveltekit-examples/src/lib/data/suffix-pattern.ts
//
// Most of the catalog has NO shared suffix family — Alert, Badge,
// Hero, and 170+ other leaf components are simply named for what they
// are. That's the documented shape of the catalog, not a gap in this
// list, so unmatched slugs fall into an honest "standalone" bucket
// rather than a fabricated one.

public record SuffixPatternInfo(string Id, string Label);

public static class SuffixPattern
{
    public const string StandaloneId = "standalone";
    public const string StandaloneLabel = "Standalone (no suffix pattern)";

    public static readonly List<SuffixPatternInfo> Patterns = new()
    {
        new("table-thead", "Gantt table head (-table-thead)"),
        new("table-tbody", "Gantt table body (-table-tbody)"),
        new("table-tfoot", "Gantt table foot (-table-tfoot)"),
        new("table-tr", "Gantt table row (-table-tr)"),
        new("table-th", "Table header cell (-table-th)"),
        new("table-td", "Table data cell (-table-td)"),
        new("table-head", "Table head (-table-head)"),
        new("table-body", "Table body (-table-body)"),
        new("table-foot", "Table foot (-table-foot)"),
        new("table-row", "Table row (-table-row)"),
        new("list-item", "List item (-list-item)"),
        new("list", "List (-list)"),
        new("picker-button", "Picker button (-picker-button)"),
        new("bar-button", "Bar button (-bar-button)"),
        new("bar", "Bar (-bar)"),
        new("select-option", "Select option (-select-option)"),
        new("option", "Option (-option)"),
        new("group-item", "Group item (-group-item)"),
        new("group", "Group (-group)"),
        new("menu-item", "Menu item (-menu-item)"),
        new("menu", "Menu (-menu)"),
        new("picker", "Picker (-picker)"),
        new("nav", "Nav (-nav)"),
        new("input", "Input (-input)"),
        new("view", "View (-view)"),
        new("link", "Link (-link)"),
        new("select", "Select (-select)"),
        new("button", "Button (-button)"),
        new("dialog", "Dialog (-dialog)"),
        new("fieldset", "Fieldset (-fieldset)"),
        new("figure", "Figure (-figure)"),
        new("footer", "Footer (-footer)"),
        new("header", "Header (-header)"),
        new("aside", "Aside (-aside)"),
        new("main", "Main (-main)"),
        new("meter", "Meter (-meter)"),
        new("progress", "Progress (-progress)"),
        new("kbd", "Kbd (-kbd)"),
        new("span", "Span (-span)"),
        new("div", "Div (-div)"),
        new("article", "Article (-article)"),
        new("table", "Table (-table)"),
    };

    public static readonly Dictionary<string, string> Label = BuildLabels();

    private static Dictionary<string, string> BuildLabels()
    {
        var labels = Patterns.ToDictionary(p => p.Id, p => p.Label);
        labels[StandaloneId] = StandaloneLabel;
        return labels;
    }

    public static string Of(string slug)
    {
        foreach (var pattern in Patterns)
        {
            if (slug == pattern.Id || slug.EndsWith("-" + pattern.Id, StringComparison.Ordinal))
                return pattern.Id;
        }
        return StandaloneId;
    }
}
