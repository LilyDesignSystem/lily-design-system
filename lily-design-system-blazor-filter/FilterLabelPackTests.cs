// Filter label pack tests: the builder against the real pack files in shared/label-packs.

using LilyDesignSystem.Blazor.Helpers;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class FilterLabelPackTests
{
    private static readonly FilterField Field = new() { Id = "name", Label = "Name" };

    [Fact]
    public void English_labels_fill_as_written()
    {
        var l = PackFiles.Load("en-001").ToFilterLabels();
        Assert.Equal("Condition 2", l.Rule(2));
        Assert.Equal("Group, level 3", l.Group(3));
        Assert.Equal("does not contain", l.OperatorName("not-contains", Field));
        Assert.Equal("Remove condition 4", l.RemoveRule(4));
        Assert.Equal("Group, level 2, added", l.GroupAdded!(2));
    }

    [Fact]
    public void A_pack_without_the_required_labels_is_refused_with_a_clear_message()
    {
        var pack = LabelPack.FromJson("""{ "locale": "xx-001", "reviewed": false, "filter": { "field": "F" } }""");
        var e = Assert.Throws<InvalidOperationException>(() => pack.ToFilterLabels());
        Assert.Contains("xx-001", e.Message);
    }

    [Fact]
    public void Every_pack_builds_working_filter_labels_with_no_placeholder_left_over()
    {
        foreach (var locale in PackFiles.Locales())
        {
            var l = PackFiles.Load(locale).ToFilterLabels();
            var outputs = new[]
            {
                l.Rule(1), l.Group(1), l.RemoveRule(1), l.RemoveGroup(1), l.RuleAdded!(1), l.RuleRemoved!(1), l.GroupAdded!(1), l.GroupRemoved!(1),
                l.OperatorName("contains", Field), l.OperatorName("is-false", Field), l.Field, l.Operator, l.Value, l.And, l.Or, l.Not, l.AddRule, l.AddGroup,
            };
            foreach (var o in outputs)
            {
                Assert.False(string.IsNullOrWhiteSpace(o), locale);
                Assert.DoesNotContain("{", o);
            }
        }
    }
}
