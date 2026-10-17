// FilterBuilder tests — the C# port of the canonical Svelte Filter.test.ts (§8.1–§8.29). Selectors are read from the rendered markup.
// What Blazor cannot do is not tested (no conditional preventDefault; focus moves by JS eval, which bUnit only records).

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AngleSharp.Dom;
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class FilterBuilderTests : TestContext
{
    private static readonly IReadOnlyList<FilterField> Fields = new[]
    {
        new FilterField { Id = "name", Label = "Name" },
        new FilterField { Id = "age", Label = "Age", Type = FilterFieldType.Number },
        new FilterField { Id = "joined", Label = "Joined", Type = FilterFieldType.Date },
        new FilterField { Id = "team", Label = "Team", Type = FilterFieldType.Select, Options = new[] { new FilterOption("red", "Red"), new FilterOption("blue", "Blue") } },
        new FilterField { Id = "active", Label = "Active", Type = FilterFieldType.Boolean },
    };

    private static readonly Dictionary<string, string> OperatorNames = new()
    {
        ["contains"] = "contains", ["not-contains"] = "does not contain", ["equals"] = "is", ["not-equals"] = "is not", ["starts-with"] = "starts with", ["ends-with"] = "ends with",
        ["gt"] = "is more than", ["gte"] = "is at least", ["lt"] = "is less than", ["lte"] = "is at most", ["between"] = "is between", ["not-between"] = "is not between",
        ["in"] = "is one of", ["not-in"] = "is none of", ["is-empty"] = "is empty", ["is-not-empty"] = "is not empty", ["is-true"] = "is yes", ["is-false"] = "is no",
    };

    private static readonly FilterLabels Labels = new()
    {
        Rule = n => $"Condition {n}", Group = d => $"Group, level {d}", Field = "Field", Operator = "Operator", OperatorName = (op, _) => OperatorNames[op],
        Value = "Value", ValueFrom = "From", ValueTo = "To", Combinator = "Match", And = "all", Or = "any", Not = "Not", AddRule = "Add condition", AddGroup = "Add group",
        RemoveRule = n => $"Remove condition {n}", RemoveGroup = d => $"Remove group, level {d}", Choose = "Choose…", Empty = "No conditions", Output = "Filter as text",
        RuleAdded = n => $"Condition {n} added", RuleRemoved = n => $"Condition {n} removed", GroupAdded = d => $"Group, level {d}, added", GroupRemoved = d => $"Group, level {d}, removed",
    };

    private static FilterRule Rule(string field, string op, object? value = null, object? value2 = null) => new($"r-{field}-{op}", field, op, value, value2);
    private static FilterGroup Start(params FilterNode[] children) => new("root", "and", false, children);

    public FilterBuilderTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
    }

    private IRenderedComponent<FilterBuilder> Render(FilterGroup? value = null, Action<ComponentParameterCollectionBuilder<FilterBuilder>>? configure = null, List<FilterGroup>? changes = null, IReadOnlyList<FilterField>? fields = null, FilterLabels? labels = null)
        => RenderComponent<FilterBuilder>(p =>
        {
            p.Add(x => x.Label, "Filter people");
            p.Add(x => x.Fields, fields ?? Fields);
            p.Add(x => x.Labels, labels ?? Labels);
            if (value is not null) p.Add(x => x.Value, value);
            if (changes is not null) p.Add(x => x.ValueChanged, EventCallback.Factory.Create<FilterGroup>(this, g => changes.Add(g)));
            configure?.Invoke(p);
        });

    private static string Status(IRenderedComponent<FilterBuilder> cut) => cut.Find(".filter-status").TextContent;
    private static IElement ByName(IRenderedComponent<FilterBuilder> cut, string name) => cut.Find($"[role=group][aria-label='{name}']");
    private static IElement ByText(IRenderedComponent<FilterBuilder> cut, string text) => cut.FindAll("button").First(b => b.TextContent.Trim() == text);
    private static string[] Names(IElement select) => select.QuerySelectorAll("option").Select(o => o.TextContent.Trim()).ToArray();

    // ---- markup ----

    [Fact]
    public void Section_8_1_A_labelled_group_wraps_one_group_per_level_each_named_by_Labels_Group()
    {
        var cut = Render(Start(Rule("name", "contains", "a"), FilterModel.CreateGroup("or", new FilterNode[] { Rule("age", "gt", 3d) })));
        Assert.Equal("Filter people", cut.Find("div.filter").GetAttribute("aria-label"));
        Assert.NotNull(ByName(cut, "Group, level 1"));
        Assert.NotNull(ByName(cut, "Group, level 2"));
    }

    [Fact]
    public void Section_8_2_Each_condition_is_a_group_named_by_its_number_with_a_named_field_operator_and_value()
    {
        var cut = Render(Start(Rule("name", "contains", "a"), Rule("age", "gt", 3d)));
        var second = ByName(cut, "Condition 2");
        Assert.Equal("Field", second.QuerySelector(".filter-field")!.GetAttribute("aria-label"));
        Assert.Equal("Operator", second.QuerySelector(".filter-operator")!.GetAttribute("aria-label"));
        Assert.Equal("number", second.QuerySelector(".filter-value")!.GetAttribute("type"));
        Assert.Equal("Value", second.QuerySelector(".filter-value")!.GetAttribute("aria-label"));
    }

    [Fact]
    public void Section_8_3_Operators_are_those_of_the_fields_type_named_by_Labels_OperatorName()
    {
        var names = Names(Render(Start(Rule("age", "gt", 3d))).Find(".filter-operator"));
        Assert.Contains("is at least", names);
        Assert.Contains("is at most", names);
        Assert.Contains("is between", names);
        Assert.DoesNotContain("contains", names);
    }

    [Fact]
    public void Section_8_4_The_value_editor_follows_the_type()
    {
        var cut = Render(Start(Rule("name", "contains"), Rule("age", "gt"), Rule("joined", "gt"), Rule("team", "equals"), Rule("team", "in"), Rule("active", "is-true")));
        var rules = cut.FindAll(".filter-rule");
        Assert.Equal("text", rules[0].QuerySelector(".filter-value")!.GetAttribute("type"));
        Assert.Equal("number", rules[1].QuerySelector(".filter-value")!.GetAttribute("type"));
        Assert.Equal("date", rules[2].QuerySelector(".filter-value")!.GetAttribute("type"));
        Assert.NotNull(rules[3].QuerySelector("select.filter-value"));
        Assert.Equal(2, rules[4].QuerySelectorAll(".filter-choice input[type=checkbox]").Length);
        Assert.Null(rules[5].QuerySelector(".filter-value, .filter-choices"));
    }

    [Fact]
    public void Section_8_5_Between_shows_two_inputs_named_From_and_To()
    {
        var cut = Render(Start(Rule("age", "between")));
        Assert.NotNull(cut.Find("[aria-label='From']"));
        Assert.NotNull(cut.Find("[aria-label='To']"));
    }

    [Fact]
    public void Section_8_6_An_empty_group_shows_Labels_Empty_a_populated_one_does_not()
    {
        Assert.Equal("No conditions", Render().Find(".filter-empty").TextContent);
        Assert.Empty(Render(Start(Rule("name", "contains"))).FindAll(".filter-empty"));
    }

    [Fact]
    public void Section_8_7_Rest_attributes_and_the_class_hook_land_on_the_root()
    {
        var cut = Render(configure: p => { p.Add(x => x.CssClass, "mine"); p.AddUnmatched("data-testid", "f"); });
        var root = cut.Find("[data-testid=f]");
        Assert.Contains("filter", root.ClassList);
        Assert.Contains("mine", root.ClassList);
    }

    // ---- editing ----

    [Fact]
    public void Section_8_8_Add_condition_appends_a_rule_on_the_first_field_and_operator_reports_it_and_announces()
    {
        var changes = new List<FilterGroup>();
        var cut = Render(changes: changes);
        ByText(cut, "Add condition").Click();
        var added = FilterModel.RulesOf(changes[0]);
        Assert.Single(added);
        Assert.Equal(("name", "contains"), (added[0].Field, added[0].Operator));
        Assert.Equal("Condition 1 added", Status(cut));
        Assert.Contains(JSInterop.Invocations, i => i.Identifier == "eval" && i.Arguments[0]!.ToString()!.Contains("data-filter-field"));
    }

    [Fact]
    public void Section_8_9_Typing_a_value_updates_only_that_rule_as_a_new_object()
    {
        var changes = new List<FilterGroup>();
        var initial = Start(Rule("name", "contains"), Rule("age", "gt"));
        var cut = Render(initial, changes: changes);
        cut.FindAll(".filter-value")[0].Input("ann");
        var next = changes[0];
        Assert.NotSame(initial, next);
        Assert.Equal("ann", ((FilterRule)next.Children[0]).Value);
        Assert.Same(initial.Children[1], next.Children[1]);
        Assert.Null(((FilterRule)initial.Children[0]).Value);
    }

    [Fact]
    public void Section_8_10_A_number_input_stores_a_number_and_clearing_it_stores_nothing()
    {
        var changes = new List<FilterGroup>();
        var cut = Render(Start(Rule("age", "gt")), changes: changes);
        cut.Find(".filter-value").Input("42");
        Assert.Equal(42d, ((FilterRule)changes.Last().Children[0]).Value);
        cut.Find(".filter-value").Input("");
        Assert.Null(((FilterRule)changes.Last().Children[0]).Value);
    }

    [Fact]
    public void Section_8_11_Changing_the_field_resets_the_value_and_keeps_an_operator_the_new_field_offers()
    {
        var changes = new List<FilterGroup>();
        var cut = Render(Start(Rule("name", "equals", "x")), changes: changes);
        cut.Find(".filter-field").Change("age");
        var r = (FilterRule)changes[0].Children[0];
        Assert.Equal(("age", "equals", null), (r.Field, r.Operator, r.Value));
    }

    [Fact]
    public void Section_8_12_Changing_the_operator_to_between_shows_a_second_input_and_back_drops_it()
    {
        var changes = new List<FilterGroup>();
        var cut = Render(Start(Rule("age", "gt", 5d)), changes: changes);
        cut.Find(".filter-operator").Change("between");
        var between = (FilterRule)changes[0].Children[0];
        Assert.Equal(("between", 5d), (between.Operator, between.Value));
        Assert.NotNull(cut.Find("[aria-label='To']"));
        cut.Find(".filter-operator").Change("gt");
        var back = (FilterRule)changes.Last().Children[0];
        Assert.Equal(("gt", null), (back.Operator, back.Value2));
    }

    [Fact]
    public void Section_8_13_Checkboxes_build_the_list_for_is_one_of()
    {
        var changes = new List<FilterGroup>();
        var cut = Render(Start(Rule("team", "in")), changes: changes);
        cut.FindAll(".filter-choice input")[1].Change(true);
        Assert.Equal(new[] { "blue" }, ((FilterRule)changes.Last().Children[0]).Value);
        cut.FindAll(".filter-choice input")[0].Change(true);
        Assert.Equal(new[] { "blue", "red" }, ((FilterRule)changes.Last().Children[0]).Value);
        cut.FindAll(".filter-choice input")[1].Change(false);
        Assert.Equal(new[] { "red" }, ((FilterRule)changes.Last().Children[0]).Value);
    }

    [Fact]
    public void Section_8_14_The_and_or_select_and_the_Not_box_edit_the_group()
    {
        var changes = new List<FilterGroup>();
        var cut = Render(Start(Rule("name", "contains", "a")), changes: changes);
        cut.Find(".filter-combinator").Change("or");
        Assert.Equal("or", changes[0].Combinator);
        cut.Find(".filter-not input").Change(true);
        Assert.True(changes.Last().Not);
    }

    [Fact]
    public void Section_8_15_Remove_removes_that_condition_announces_and_returns_focus_to_the_groups_Add_condition()
    {
        var changes = new List<FilterGroup>();
        var cut = Render(Start(Rule("name", "contains", "a"), Rule("age", "gt", 3d)), changes: changes);
        ByText(cut, "Remove condition 1").Click();
        Assert.Single(FilterModel.RulesOf(changes[0]));
        Assert.Equal("Condition 1 removed", Status(cut));
        Assert.Contains(JSInterop.Invocations, i => i.Identifier == "eval" && i.Arguments[0]!.ToString()!.Contains("data-filter-add-rule"));
    }

    [Fact]
    public void Section_8_16_Add_group_adds_a_nested_group_with_one_condition_and_Remove_group_takes_it_out()
    {
        var changes = new List<FilterGroup>();
        var cut = Render(changes: changes);
        ByText(cut, "Add group").Click();
        Assert.IsType<FilterGroup>(changes[0].Children[0]);
        Assert.Single(FilterModel.RulesOf(changes[0]));
        Assert.Equal("Group, level 2, added", Status(cut));
        ByText(cut, "Remove group, level 2").Click();
        Assert.Empty(changes.Last().Children);
    }

    [Fact]
    public void Section_8_17_MaxDepth_stops_nesting_no_Add_group_at_the_deepest_level_and_none_with_MaxDepth_1()
    {
        var two = Render(Start(FilterModel.CreateGroup("and", new FilterNode[] { Rule("name", "contains") })), p => p.Add(x => x.MaxDepth, 2));
        Assert.Single(two.FindAll("button.filter-add-group-button"));
        var one = Render(configure: p => p.Add(x => x.MaxDepth, 1));
        Assert.Empty(one.FindAll("button.filter-add-group-button"));
    }

    [Fact]
    public void Section_8_18_Readonly_shows_the_filter_and_offers_no_way_to_change_it()
    {
        var cut = Render(Start(Rule("name", "contains", "a")), p => p.Add(x => x.Readonly, true));
        Assert.Empty(cut.FindAll("button"));
        Assert.True(cut.Find(".filter-field").HasAttribute("disabled"));
        Assert.True(cut.Find(".filter-value").HasAttribute("readonly"));
    }

    [Fact]
    public void Section_8_19_With_no_fields_there_is_nothing_to_add()
    {
        var changes = new List<FilterGroup>();
        var cut = Render(changes: changes, fields: Array.Empty<FilterField>());
        ByText(cut, "Add condition").Click();
        Assert.Empty(changes);
    }

    // ---- output and use ----

    private static readonly FilterGroup Output = Start(Rule("name", "contains", "ann"), Rule("age", "between", 18d, 65d));

    [Fact]
    public void Section_8_20_Format_shows_the_filter_as_text()
    {
        var cut = Render(Output, p => p.Add(x => x.Format, FilterOutputFormat.Sql));
        Assert.Equal("LOWER(\"name\") LIKE LOWER('%ann%') ESCAPE '\\' AND \"age\" BETWEEN 18 AND 65", cut.Find(".filter-output-text").TextContent);
        Assert.Equal("Filter as text", cut.Find(".filter-output").GetAttribute("aria-label"));
    }

    [Theory]
    [InlineData(FilterOutputFormat.Json, "\"between\"")]
    [InlineData(FilterOutputFormat.Mongo, "$gte")]
    [InlineData(FilterOutputFormat.OData, "ge 18")]
    public void Section_8_21_Each_format(FilterOutputFormat format, string needle)
        => Assert.Contains(needle, Render(Output, p => p.Add(x => x.Format, format)).Find(".filter-output-text").TextContent);

    [Fact]
    public void Section_8_22_The_dialect_applies_to_SQL_output()
        => Assert.Contains("`name`", Render(Output, p => { p.Add(x => x.Format, FilterOutputFormat.Sql); p.Add(x => x.Dialect, SqlDialect.MySql); }).Find(".filter-output-text").TextContent);

    [Fact]
    public void Section_8_23_No_output_without_a_format_or_without_Labels_Output()
    {
        Assert.Empty(Render(Output).FindAll(".filter-output"));
        Assert.Empty(Render(Output, p => p.Add(x => x.Format, FilterOutputFormat.Sql), labels: Labels with { Output = null }).FindAll(".filter-output"));
    }

    [Fact]
    public void Section_8_24_An_incomplete_condition_is_left_out_of_the_output_until_it_is_finished()
        => Assert.Equal("contains(tolower(name),tolower('ann'))", Render(Start(Rule("name", "contains", "ann"), Rule("age", "gt")), p => p.Add(x => x.Format, FilterOutputFormat.OData)).Find(".filter-output-text").TextContent);

    // ---- another language and right-to-left ----

    private static readonly IReadOnlyList<FilterField> ZhFields = new[]
    {
        new FilterField { Id = "name", Label = "姓名" },
        new FilterField { Id = "age", Label = "年龄", Type = FilterFieldType.Number },
        new FilterField { Id = "team", Label = "团队", Type = FilterFieldType.Select, Options = new[] { new FilterOption("red", "红队"), new FilterOption("blue", "蓝队") } },
    };

    private static readonly Dictionary<string, string> ZhOperators = new()
    {
        ["contains"] = "包含", ["not-contains"] = "不包含", ["equals"] = "等于", ["not-equals"] = "不等于", ["starts-with"] = "开头是", ["ends-with"] = "结尾是",
        ["gt"] = "大于", ["gte"] = "至少", ["lt"] = "小于", ["lte"] = "至多", ["between"] = "介于", ["not-between"] = "不介于", ["in"] = "属于其中之一", ["not-in"] = "不属于其中任何一个",
        ["is-empty"] = "为空", ["is-not-empty"] = "不为空", ["is-true"] = "为是", ["is-false"] = "为否",
    };

    private static readonly FilterLabels Zh = new()
    {
        Rule = n => $"条件 {n}", Group = d => $"第 {d} 层分组", Field = "字段", Operator = "运算符", OperatorName = (op, _) => ZhOperators.GetValueOrDefault(op, op),
        Value = "值", ValueFrom = "从", ValueTo = "到", Combinator = "匹配", And = "全部", Or = "任一", Not = "非", AddRule = "添加条件", AddGroup = "添加分组",
        RemoveRule = n => $"删除条件 {n}", RemoveGroup = d => $"删除第 {d} 层分组", Choose = "请选择…", Empty = "没有条件", Output = "筛选文本",
        RuleAdded = n => $"已添加条件 {n}", RuleRemoved = n => $"已删除条件 {n}", GroupAdded = d => $"已添加第 {d} 层分组", GroupRemoved = d => $"已删除第 {d} 层分组",
    };

    [Fact]
    public void Section_8_25b_The_bundle_names_every_operator_which_FilterOperators_All_lets_an_app_assert()
    {
        foreach (var op in FilterOperators.All) Assert.True(ZhOperators.ContainsKey(op), op);
    }

    [Fact]
    public void Section_8_26_Every_operator_the_fields_offer_is_named_by_the_bundle_so_the_builder_reads_as_Chinese_only()
    {
        var value = Start(Rule("name", "contains", "王"), Rule("age", "between", 18d, 65d), Rule("team", "in", new[] { "red" }), FilterModel.CreateGroup("or", new FilterNode[] { Rule("age", "gt", 30d) }));
        var cut = RenderComponent<FilterBuilder>(p =>
        {
            p.Add(x => x.Label, "筛选人员"); p.Add(x => x.Fields, ZhFields); p.Add(x => x.Labels, Zh); p.Add(x => x.Value, value);
        });
        var texts = new List<string>();
        foreach (var node in cut.Nodes.SelectMany(n => n.GetDescendants().Prepend(n)))
        {
            if (node is IText t) texts.Add(t.Data.Trim());
            if (node is IElement e && e.GetAttribute("aria-label") is { } label) texts.Add(label);
        }
        Assert.Empty(texts.Where(t => System.Text.RegularExpressions.Regex.IsMatch(t, "[A-Za-z]{3,}")));
    }

    [Fact]
    public void Section_8_27_Announcements_are_the_bundles_own_words()
    {
        var cut = RenderComponent<FilterBuilder>(p => { p.Add(x => x.Label, "筛选人员"); p.Add(x => x.Fields, ZhFields); p.Add(x => x.Labels, Zh); });
        ByText(cut, "添加条件").Click();
        Assert.Equal("已添加条件 1", Status(cut));
        ByText(cut, "删除条件 1").Click();
        Assert.Equal("已删除条件 1", Status(cut));
    }

    [Fact]
    public void Section_8_28_The_controls_come_in_the_same_order_whatever_the_direction()
    {
        var cut = RenderComponent<FilterBuilder>(p => { p.Add(x => x.Label, "筛选人员"); p.Add(x => x.Fields, ZhFields); p.Add(x => x.Labels, Zh); p.AddUnmatched("dir", "rtl"); });
        ByText(cut, "添加条件").Click();
        var order = cut.Find(".filter-rule").Children.Select(c => c.ClassList.First()).Take(3).ToArray();
        Assert.Equal(new[] { "filter-field", "filter-operator", "filter-value" }, order);
    }

    [Fact]
    public void Section_8_29_The_builder_sets_no_physical_left_or_right_in_an_inline_style()
    {
        var cut = Render(Start(Rule("name", "contains", "a")));
        var styled = cut.FindAll("[style]").Select(e => e.GetAttribute("style")!);
        Assert.Empty(styled.Where(s => System.Text.RegularExpressions.Regex.IsMatch(s, @"(^|;|\s)(left|right|margin-left|margin-right|padding-left|padding-right|text-align)\s*:")));
    }

    // ---- the pure functions with the value the component edits ----

    [Fact]
    public void Section_8_25_The_value_the_component_edits_works_with_the_pure_functions()
    {
        var changes = new List<FilterGroup>();
        var cut = Render(Start(Rule("age", "gte", 18d)), changes: changes);
        ByText(cut, "Add condition").Click();
        var g = changes[0];
        var last = FilterModel.RulesOf(g)[1];
        var done = g with { Children = new FilterNode[] { g.Children[0], last with { Value = "ann" } } };
        var predicate = FilterModel.ToPredicate(done, Fields);
        var rows = new[]
        {
            new Dictionary<string, object?> { ["name"] = "Ann", ["age"] = 20d },
            new Dictionary<string, object?> { ["name"] = "Bob", ["age"] = 20d },
            new Dictionary<string, object?> { ["name"] = "Ann", ["age"] = 3d },
        };
        Assert.Equal(new[] { "Ann" }, rows.Where(r => predicate(r)).Select(r => (string)r["name"]!));
        Assert.Equal(new object?[] { 18d, "%ann%" }, FilterModel.ToSql(done, Fields).Params);
    }
}
