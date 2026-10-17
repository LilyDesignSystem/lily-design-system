// FilterBuilder: a headless filter builder (conditions and groups over typed fields). See spec/index.md; ported from the canonical Svelte Filter.

using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>
/// Every string the filter shows. There are no English defaults: the consumer supplies all of it, in its own language.
/// The functions take the ordinal the user sees (1 = first) so a screen reader hears "Condition 2" rather than the same name twice.
/// </summary>
public sealed record FilterLabels
{
    /// <summary>Names a condition: "Condition 2". Wraps its controls in a labelled group.</summary>
    public required Func<int, string> Rule { get; init; }

    /// <summary>Names a group: "Group, level 2" (depth 1 is the whole filter).</summary>
    public required Func<int, string> Group { get; init; }

    public required string Field { get; init; }
    public required string Operator { get; init; }

    /// <summary>What an operator is called: (the operator id, the field it applies to).</summary>
    public required Func<string, FilterField, string> OperatorName { get; init; }

    public required string Value { get; init; }
    public required string ValueFrom { get; init; }
    public required string ValueTo { get; init; }
    public required string Combinator { get; init; }
    public required string And { get; init; }
    public required string Or { get; init; }

    /// <summary>The checkbox that negates a group.</summary>
    public required string Not { get; init; }

    public required string AddRule { get; init; }
    public required string AddGroup { get; init; }
    public required Func<int, string> RemoveRule { get; init; }
    public required Func<int, string> RemoveGroup { get; init; }

    /// <summary>What is offered before a choice is made in a select.</summary>
    public string? Choose { get; init; }

    /// <summary>Shown in an empty group.</summary>
    public string? Empty { get; init; }

    /// <summary>Names the output. Gates it (with <c>Format</c>).</summary>
    public string? Output { get; init; }

    public Func<int, string>? RuleAdded { get; init; }
    public Func<int, string>? RuleRemoved { get; init; }
    public Func<int, string>? GroupAdded { get; init; }
    public Func<int, string>? GroupRemoved { get; init; }
}

public partial class FilterBuilder : ComponentBase
{
    [Inject] private IJSRuntime JS { get; set; } = default!;

    /// <summary>Accessible name of the whole filter.</summary>
    [Parameter, EditorRequired] public string Label { get; set; } = "";

    /// <summary>What can be filtered on.</summary>
    [Parameter, EditorRequired] public IReadOnlyList<FilterField> Fields { get; set; } = Array.Empty<FilterField>();

    /// <summary>Every string the filter shows.</summary>
    [Parameter, EditorRequired] public FilterLabels Labels { get; set; } = default!;

    /// <summary>The filter. Bindable: <c>@bind-Value</c>. Every change is a new object, never a mutation.</summary>
    [Parameter] public FilterGroup Value { get; set; } = FilterModel.EmptyFilter();
    [Parameter] public EventCallback<FilterGroup> ValueChanged { get; set; }

    /// <summary>Show the filter written out in this format under the builder. Needs <c>Labels.Output</c>.</summary>
    [Parameter] public FilterOutputFormat? Format { get; set; }

    /// <summary>SQL dialect for <c>Format="Sql"</c>. Default <c>Ansi</c>.</summary>
    [Parameter] public SqlDialect Dialect { get; set; } = SqlDialect.Ansi;

    /// <summary>The deepest group nesting offered (1 = no nested groups). Default 3.</summary>
    [Parameter] public int MaxDepth { get; set; } = 3;

    /// <summary>Show the filter without letting it be edited.</summary>
    [Parameter] public bool Readonly { get; set; }

    [Parameter] public string CssClass { get; set; } = "";

    /// <summary>Additional HTML attributes spread onto the root.</summary>
    [Parameter(CaptureUnmatchedValues = true)] public Dictionary<string, object>? AdditionalAttributes { get; set; }

    private string _status = "";
    private string? _focusSelector;

    private string RootClass => $"filter {CssClass}".Trim();
    private IReadOnlyDictionary<string, FilterField> FieldById => Fields.ToDictionary(f => f.Id);
    private string Output => Format is { } format && Labels.Output is not null ? FilterModel.FormatFilter(Value, Fields, format, Dialect) : "";

    private static string FormatId(FilterOutputFormat format) => format switch
    {
        FilterOutputFormat.Json => "json",
        FilterOutputFormat.Sql => "sql",
        FilterOutputFormat.Mongo => "mongo",
        _ => "odata",
    };

    /// <summary>The number the user sees for each rule: its place in reading order across the whole filter.</summary>
    private static Dictionary<string, int> NumberRules(FilterGroup root)
    {
        var numbers = new Dictionary<string, int>();
        var n = 0;
        void Walk(FilterGroup g)
        {
            foreach (var child in g.Children)
            {
                if (child is FilterRule r) numbers[r.Id] = ++n;
                else Walk((FilterGroup)child);
            }
        }
        Walk(root);
        return numbers;
    }

    private async Task CommitAsync(FilterGroup next)
    {
        Value = next;
        await ValueChanged.InvokeAsync(next);
    }

    private void Announce(string? message)
    {
        if (!string.IsNullOrEmpty(message)) _status = message;
    }

    private async Task SetRuleAsync(string id, Func<FilterRule, FilterRule> change)
    {
        if (Readonly) return;
        await CommitAsync(FilterModel.UpdateNode(Value, id, node => node is FilterRule r ? change(r) : node));
    }

    private async Task SetGroupAsync(string id, Func<FilterGroup, FilterGroup> change)
    {
        if (Readonly) return;
        await CommitAsync(FilterModel.UpdateNode(Value, id, node => node is FilterGroup g ? change(g) : node));
    }

    private async Task AddRuleAsync(string groupId)
    {
        if (Readonly || Fields.Count == 0) return;
        var rule = FilterModel.CreateRule(Fields);
        var next = FilterModel.AddNode(Value, groupId, rule);
        await CommitAsync(next);
        Announce(Labels.RuleAdded?.Invoke(NumberRules(next).GetValueOrDefault(rule.Id)));
        _focusSelector = $"[data-filter-field=\"{rule.Id}\"]";
    }

    private async Task AddGroupAsync(string parentId, int depth)
    {
        if (Readonly || depth >= MaxDepth) return;
        var group = FilterModel.CreateGroup("and", Fields.Count > 0 ? new FilterNode[] { FilterModel.CreateRule(Fields) } : Array.Empty<FilterNode>());
        await CommitAsync(FilterModel.AddNode(Value, parentId, group));
        Announce(Labels.GroupAdded?.Invoke(depth + 1));
        if (group.Children.FirstOrDefault() is { } first) _focusSelector = $"[data-filter-field=\"{first.Id}\"]";
    }

    private async Task RemoveRuleAsync(FilterRule rule, string groupId)
    {
        if (Readonly) return;
        var n = NumberRules(Value).GetValueOrDefault(rule.Id);
        await CommitAsync(FilterModel.RemoveNode(Value, rule.Id));
        Announce(Labels.RuleRemoved?.Invoke(n));
        _focusSelector = $"[data-filter-add-rule=\"{groupId}\"]";
    }

    private async Task RemoveGroupAsync(FilterGroup group, string parentId, int depth)
    {
        if (Readonly) return;
        await CommitAsync(FilterModel.RemoveNode(Value, group.Id));
        Announce(Labels.GroupRemoved?.Invoke(depth));
        _focusSelector = $"[data-filter-add-rule=\"{parentId}\"]";
    }

    /// <summary>A number input's number (null when empty or unreadable), or the text of a text, date or select field: what the rule stores for what was typed.</summary>
    private static object? ParseTyped(FilterFieldType type, string? raw)
    {
        if (string.IsNullOrEmpty(raw)) return null;
        if (type != FilterFieldType.Number) return raw;
        return double.TryParse(raw, System.Globalization.NumberStyles.Float, System.Globalization.CultureInfo.InvariantCulture, out var d) ? d : null;
    }

    private static string TextOf(object? v) => v switch
    {
        null => "",
        double d when double.IsNaN(d) => "",
        IFormattable f => f.ToString(null, System.Globalization.CultureInfo.InvariantCulture),
        _ => v.ToString() ?? "",
    };

    private bool IsChosen(FilterRule rule, string optionId) => rule.Value is IEnumerable<string> list && list.Contains(optionId);

    private async Task ToggleOptionAsync(FilterRule rule, string optionId, bool checkedNow)
    {
        var current = rule.Value is IEnumerable<string> l ? l.ToList() : new List<string>();
        var next = checkedNow ? current.Where(v => v != optionId).Append(optionId).ToList() : current.Where(v => v != optionId).ToList();
        await SetRuleAsync(rule.Id, r => r with { Value = next.Count > 0 ? next : null });
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (_focusSelector is not { } selector) return;
        _focusSelector = null;
        try
        {
            await JS.InvokeVoidAsync("eval", $"document.querySelector({System.Text.Json.JsonSerializer.Serialize(selector)})?.focus()");
        }
        catch
        {
            // ignore prerender / interop failure
        }
    }
}
