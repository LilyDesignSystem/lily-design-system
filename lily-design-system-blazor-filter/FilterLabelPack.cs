// The filter builder's labels from a label pack. See LabelPacks.cs in LilyDesignSystem.Blazor.DataGrid.

using LilyDesignSystem.Blazor.Helpers;

namespace LilyDesignSystem.Blazor.Helpers;

public static class FilterLabelPack
{
    private const string H = "filter";

    /// <summary>
    /// Builds <see cref="FilterLabels"/> from <paramref name="pack"/>. The filter's required labels throw
    /// <see cref="InvalidOperationException"/> when the pack lacks them; the optional ones stay null.
    /// </summary>
    public static FilterLabels ToFilterLabels(this LabelPack pack)
    {
        string Need(string key) => pack.Text(H, key) ?? throw new InvalidOperationException($"The label pack {pack.Locale} has no filter.{key}.");
        Func<int, string> NeedFn(string key, string token) => pack.Fn<int>(H, key, n => new[] { (token, (object?)n) }) ?? throw new InvalidOperationException($"The label pack {pack.Locale} has no filter.{key}.");
        var operators = pack.Group(H, "operators") ?? throw new InvalidOperationException($"The label pack {pack.Locale} has no filter.operators.");
        return new FilterLabels
        {
            Rule = NeedFn("rule", "n"),
            Group = NeedFn("group", "depth"),
            Field = Need("field"),
            Operator = Need("operator"),
            OperatorName = (op, _) => operators.TryGetValue(op, out var name) ? name : "",
            Value = Need("value"),
            ValueFrom = Need("valueFrom"),
            ValueTo = Need("valueTo"),
            Combinator = Need("combinator"),
            And = Need("and"),
            Or = Need("or"),
            Not = Need("not"),
            AddRule = Need("addRule"),
            AddGroup = Need("addGroup"),
            RemoveRule = NeedFn("removeRule", "n"),
            RemoveGroup = NeedFn("removeGroup", "depth"),
            Choose = pack.Text(H, "choose"),
            Empty = pack.Text(H, "empty"),
            Output = pack.Text(H, "output"),
            RuleAdded = pack.Fn<int>(H, "ruleAdded", n => new[] { ("n", (object?)n) }),
            RuleRemoved = pack.Fn<int>(H, "ruleRemoved", n => new[] { ("n", (object?)n) }),
            GroupAdded = pack.Fn<int>(H, "groupAdded", n => new[] { ("depth", (object?)n) }),
            GroupRemoved = pack.Fn<int>(H, "groupRemoved", n => new[] { ("depth", (object?)n) }),
        };
    }
}
