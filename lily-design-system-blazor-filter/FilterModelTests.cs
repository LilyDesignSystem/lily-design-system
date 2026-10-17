// FilterModel tests — the C# port of the canonical Svelte filter-model.test.ts, vector for vector.

using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Nodes;
using LilyDesignSystem.Blazor.Helpers;
using Xunit;
using Op = LilyDesignSystem.Blazor.Helpers.FilterOperators;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class FilterModelTests
{
    private static readonly IReadOnlyList<FilterField> Fields = new[]
    {
        new FilterField { Id = "name", Label = "Name" },
        new FilterField { Id = "age", Label = "Age", Type = FilterFieldType.Number },
        new FilterField { Id = "joined", Label = "Joined", Type = FilterFieldType.Date, Column = "joined_on" },
        new FilterField { Id = "team", Label = "Team", Type = FilterFieldType.Select, Options = new[] { new FilterOption("red", "Red"), new FilterOption("blue", "Blue") } },
        new FilterField { Id = "active", Label = "Active", Type = FilterFieldType.Boolean },
    };

    private static FilterRule Rule(string field, string op, object? value = null, object? value2 = null) => new($"r-{field}-{op}", field, op, value, value2);
    private static FilterGroup Group(string combinator, params FilterNode[] children) => new($"g-{combinator}-{children.Length}", combinator, false, children);
    private static FilterGroup Not(FilterGroup g) => g with { Not = true };
    private static string[] L(params string[] v) => v;

    // ---- operators ----

    [Fact]
    public void Each_type_offers_its_own_operators_in_order_and_a_field_can_restrict_them()
    {
        Assert.Equal("contains", FilterModel.OperatorsFor(Fields[0])[0]);
        Assert.Contains("between", FilterModel.OperatorsFor(Fields[1]));
        Assert.Contains("in", FilterModel.OperatorsFor(Fields[3]));
        Assert.Equal(new[] { "is-true", "is-false", "is-empty", "is-not-empty" }, FilterModel.OperatorsFor(Fields[4]));
        Assert.Equal(new[] { "gte", "lte" }, FilterModel.OperatorsFor(Fields[1] with { Operators = new[] { "gte", "lte" } }));
        Assert.Equal("contains", FilterModel.OperatorsFor(null)[0]);
    }

    [Fact]
    public void Arity()
    {
        Assert.Equal(ValueArity.None, FilterModel.ArityOf("is-empty"));
        Assert.Equal(ValueArity.One, FilterModel.ArityOf("contains"));
        Assert.Equal(ValueArity.Two, FilterModel.ArityOf("between"));
        Assert.Equal(ValueArity.Many, FilterModel.ArityOf("in"));
    }

    // ---- building and editing ----

    [Fact]
    public void CreateRule_starts_on_the_first_field_with_its_first_operator()
    {
        var r = FilterModel.CreateRule(Fields);
        Assert.Equal(("name", "contains"), (r.Field, r.Operator));
        Assert.Equal("equals", FilterModel.CreateRule(Fields, "age").Operator);
        Assert.Equal("name", FilterModel.CreateRule(Fields, "nope").Field);
    }

    [Fact]
    public void AddNode_UpdateNode_RemoveNode_are_immutable_and_share_what_did_not_change()
    {
        var a = Rule("name", "contains", "x");
        var inner = Group("or", a);
        var root = Group("and", inner);
        var b = Rule("age", "gt", 3d);
        var added = FilterModel.AddNode(root, inner.Id, b);
        Assert.Equal(2, FilterModel.RulesOf(added).Count);
        Assert.Single(FilterModel.RulesOf(root));
        var renamed = FilterModel.UpdateNode(root, a.Id, n => n is FilterRule r ? r with { Value = "y" } : n);
        Assert.Equal("y", FilterModel.RulesOf(renamed)[0].Value);
        Assert.Equal(1, FilterModel.RulesOf(FilterModel.RemoveNode(added, b.Id)).Count);
        Assert.Same(root, FilterModel.RemoveNode(root, "missing"));
        var untouched = Group("and", Rule("name", "contains", "q"), Rule("age", "gt", 1d));
        var changed = FilterModel.UpdateNode(untouched, untouched.Children[0].Id, n => ((FilterRule)n) with { Value = "z" });
        Assert.Same(untouched.Children[1], changed.Children[1]);
    }

    [Fact]
    public void ChangeField_resets_values_and_keeps_an_operator_the_new_field_also_offers()
    {
        var r = FilterModel.ChangeField(Rule("name", "equals", "x"), Fields, "age");
        Assert.Equal(("age", "equals", null), (r.Field, r.Operator, r.Value));
        Assert.Equal("equals", FilterModel.ChangeField(Rule("name", "contains", "x"), Fields, "age").Operator);
    }

    [Fact]
    public void ChangeOperator_drops_values_the_new_arity_does_not_need()
    {
        var a = FilterModel.ChangeOperator(Rule("age", "between", 1d, 9d), "gt");
        Assert.Equal(("gt", 1d, null), (a.Operator, a.Value, a.Value2));
        Assert.Null(FilterModel.ChangeOperator(Rule("age", "gt", 1d), "is-empty").Value);
        Assert.Null(FilterModel.ChangeOperator(Rule("team", "in", L("red")), "equals").Value);
        Assert.Equal(L("red"), FilterModel.ChangeOperator(Rule("team", "in", L("red")), "not-in").Value);
    }

    // ---- validation ----

    [Fact]
    public void Dates()
    {
        Assert.True(FilterModel.IsIsoDate("2026-02-28"));
        Assert.False(FilterModel.IsIsoDate("2026-02-31"));
        Assert.False(FilterModel.IsIsoDate("26-02-28"));
    }

    [Fact]
    public void Issues()
    {
        RuleIssue? I(FilterRule r) => FilterModel.RuleIssueOf(r, Fields);
        Assert.Equal(RuleIssue.UnknownField, I(Rule("nope", "equals", 1d)));
        Assert.Equal(RuleIssue.UnknownOperator, I(Rule("name", "gt", "a")));
        Assert.Equal(RuleIssue.MissingValue, I(Rule("name", "contains")));
        Assert.Equal(RuleIssue.MissingValue, I(Rule("name", "contains", "")));
        Assert.Equal(RuleIssue.InvalidValue, I(Rule("age", "gt", "x")));
        Assert.Equal(RuleIssue.InvalidValue, I(Rule("age", "gt", double.NaN)));
        Assert.Equal(RuleIssue.InvalidValue, I(Rule("joined", "gt", "tomorrow")));
        Assert.Equal(RuleIssue.UnknownOption, I(Rule("team", "equals", "green")));
        Assert.Equal(RuleIssue.RangeOrder, I(Rule("age", "between", 5d, 1d)));
        Assert.Equal(RuleIssue.MissingValue, I(Rule("age", "between", 1d)));
        Assert.Equal(RuleIssue.MissingValue, I(Rule("team", "in", new List<string>())));
        Assert.Equal(RuleIssue.UnknownOption, I(Rule("team", "in", L("red", "green"))));
    }

    [Fact]
    public void Complete_rules_have_no_issue()
    {
        RuleIssue? I(FilterRule r) => FilterModel.RuleIssueOf(r, Fields);
        Assert.Null(I(Rule("name", "contains", "a")));
        Assert.Null(I(Rule("age", "between", 1d, 5d)));
        Assert.Null(I(Rule("joined", "between", "2026-01-01", "2026-12-31")));
        Assert.Null(I(Rule("team", "in", L("red", "blue"))));
        Assert.Null(I(Rule("active", "is-true")));
        Assert.Null(I(Rule("name", "is-empty")));
    }

    [Fact]
    public void Normalise_drops_incomplete_rules_and_groups_left_empty()
    {
        var g = Group("and", Rule("name", "contains", "a"), Rule("age", "gt"), Group("or", Rule("age", "lt")));
        Assert.Single(FilterModel.RulesOf(FilterModel.Normalise(g, Fields)!));
        Assert.Null(FilterModel.Normalise(Group("and", Rule("age", "gt")), Fields));
        Assert.Null(FilterModel.Normalise(Group("and"), Fields));
    }

    // ---- predicate ----

    private static readonly IReadOnlyList<Dictionary<string, object?>> Rows = new[]
    {
        new Dictionary<string, object?> { ["name"] = "Zoë Müller", ["age"] = 30d, ["joined"] = "2026-03-01", ["team"] = "red", ["active"] = true },
        new Dictionary<string, object?> { ["name"] = "Bob", ["age"] = 41d, ["joined"] = "2025-12-31", ["team"] = "blue", ["active"] = false },
        new Dictionary<string, object?> { ["name"] = "Cara", ["age"] = null, ["joined"] = "", ["team"] = "red", ["active"] = true },
    };

    private static string[] Run(FilterGroup g)
    {
        var predicate = FilterModel.ToPredicate(g, Fields);
        return Rows.Where(r => predicate(r)).Select(r => (string)r["name"]!).ToArray();
    }

    [Fact]
    public void An_empty_or_all_incomplete_filter_passes_everything()
    {
        Assert.Equal(3, Run(Group("and")).Length);
        Assert.Equal(3, Run(Group("and", Rule("age", "gt"))).Length);
    }

    [Fact]
    public void Predicate_text_is_case_and_diacritic_blind()
    {
        Assert.Equal(L("Zoë Müller"), Run(Group("and", Rule("name", "contains", "MULLER"))));
        Assert.Equal(L("Zoë Müller"), Run(Group("and", Rule("name", "starts-with", "zo"))));
        Assert.Equal(L("Bob"), Run(Group("and", Rule("name", "ends-with", "OB"))));
        Assert.Equal(L("Cara"), Run(Group("and", Rule("name", "not-contains", "o"))));
        Assert.Equal(L("Bob"), Run(Group("and", Rule("name", "equals", "bob"))));
    }

    [Fact]
    public void Predicate_numbers_limits_ranges_and_a_missing_value_is_not_a_match()
    {
        Assert.Equal(L("Zoë Müller", "Bob"), Run(Group("and", Rule("age", "gte", 30d))));
        Assert.Equal(L("Zoë Müller"), Run(Group("and", Rule("age", "lte", 30d))));
        Assert.Equal(L("Bob"), Run(Group("and", Rule("age", "between", 31d, 50d))));
        Assert.Equal(L("Zoë Müller", "Cara"), Run(Group("and", Rule("age", "not-between", 31d, 50d))));
        Assert.Equal(L("Cara"), Run(Group("and", Rule("age", "is-empty"))));
    }

    [Fact]
    public void Predicate_dates_compare_as_ISO_text()
    {
        Assert.Equal(L("Zoë Müller"), Run(Group("and", Rule("joined", "between", "2026-01-01", "2026-12-31"))));
        Assert.Equal(L("Bob"), Run(Group("and", Rule("joined", "lt", "2026-01-01"))));
    }

    [Fact]
    public void Predicate_choices_and_booleans()
    {
        Assert.Equal(L("Bob"), Run(Group("and", Rule("team", "in", L("blue")))));
        Assert.Equal(3, Run(Group("and", Rule("team", "in", L("blue", "green")))).Length); // an unknown option makes the rule incomplete, so it is not applied
        Assert.Equal(L("Zoë Müller", "Cara"), Run(Group("and", Rule("team", "not-in", L("blue")))));
        Assert.Equal(L("Bob"), Run(Group("and", Rule("active", "is-false"))));
        Assert.Equal(L("Zoë Müller", "Cara"), Run(Group("and", Rule("active", "is-true"))));
    }

    [Fact]
    public void Predicate_and_or_nested_groups_and_not()
    {
        Assert.Equal(L("Zoë Müller"), Run(Group("and", Rule("team", "equals", "red"), Rule("age", "gt", 20d))));
        Assert.Equal(L("Bob", "Cara"), Run(Group("or", Rule("name", "equals", "bob"), Rule("name", "equals", "cara"))));
        Assert.Equal(L("Zoë Müller"), Run(Group("and", Rule("team", "equals", "red"), Group("or", Rule("age", "gt", 100d), Rule("name", "contains", "z")))));
        Assert.Equal(L("Bob"), Run(Not(Group("and", Rule("team", "equals", "red")))));
    }

    // ---- JSON ----

    private static readonly FilterGroup Sample = Group("and", Rule("name", "contains", "a"), Not(Group("or", Rule("age", "between", 1d, 9d), Rule("active", "is-true"))));

    [Fact]
    public void Json_is_plain_id_free_and_leaves_incomplete_rules_out()
    {
        var withJunk = Group("and", Sample.Children.Append(Rule("age", "gt")).ToArray());
        var expected = JsonNode.Parse("""
            { "combinator": "and", "rules": [
                { "field": "name", "operator": "contains", "value": "a" },
                { "combinator": "or", "not": true, "rules": [ { "field": "age", "operator": "between", "value": 1, "value2": 9 }, { "field": "active", "operator": "is-true" } ] } ] }
            """);
        Assert.True(JsonNode.DeepEquals(expected, FilterModel.ToJson(withJunk, Fields)));
        Assert.Null(FilterModel.ToJson(Group("and"), Fields));
    }

    [Fact]
    public void Json_round_trips_through_FromJson_with_fresh_ids()
    {
        var json = FilterModel.ToJson(Sample, Fields);
        var back = FilterModel.FromJson(json, Fields);
        Assert.Empty(back.Errors);
        Assert.True(JsonNode.DeepEquals(json, FilterModel.ToJson(back.Group, Fields)));
        Assert.NotEqual(Sample.Id, back.Group.Id);
    }

    [Fact]
    public void FromJson_reports_what_it_cannot_read_instead_of_guessing()
    {
        var bad = FilterModel.FromJson(JsonNode.Parse("""
            { "combinator": "and", "rules": [ { "field": "nope", "operator": "equals", "value": 1 }, { "field": "age", "operator": "gt", "value": "x" }, 5, { "combinator": "xor", "rules": [] }, { "field": "name", "operator": "contains", "value": "ok" } ] }
            """), Fields);
        Assert.Equal(new[] { "$.rules[0]: unknown-field", "$.rules[1]: invalid-value", "$.rules[2]: not an object", "$.rules[3]: unknown combinator" }, bad.Errors);
        Assert.Single(FilterModel.RulesOf(bad.Group));
        Assert.Empty(FilterModel.FromJson(JsonValue.Create("x"), Fields).Group.Children);
        Assert.Single(FilterModel.FromJson(JsonNode.Parse("""{ "field": "name", "operator": "contains", "value": "a" }"""), Fields).Group.Children);
    }

    // ---- SQL ----

    [Fact]
    public void Sql_parameterises_every_value_ansi_by_default()
    {
        var r = FilterModel.ToSql(Group("and", Rule("name", "contains", "o'brien"), Rule("age", "between", 18d, 65d)), Fields);
        Assert.Equal("LOWER(\"name\") LIKE LOWER(?) ESCAPE '\\' AND \"age\" BETWEEN ? AND ?", r.Sql);
        Assert.Equal(new object?[] { "%o'brien%", 18d, 65d }, r.Params);
    }

    [Fact]
    public void Sql_an_empty_filter_is_an_empty_condition()
    {
        var r = FilterModel.ToSql(Group("and"), Fields);
        Assert.Equal("", r.Sql);
        Assert.Empty(r.Params);
    }

    [Fact]
    public void Sql_dialects_quoting_placeholders_case_insensitive_match_booleans()
    {
        var g = Group("and", Rule("name", "starts-with", "a"), Rule("active", "is-true"));
        var pg = FilterModel.ToSql(g, Fields, SqlDialect.Postgres);
        Assert.Equal("\"name\" ILIKE $1 ESCAPE '\\' AND \"active\" = $2", pg.Sql);
        Assert.Equal(new object?[] { "a%", true }, pg.Params);
        var my = FilterModel.ToSql(g, Fields, SqlDialect.MySql);
        Assert.Equal("LOWER(`name`) LIKE LOWER(?) ESCAPE '\\\\' AND `active` = ?", my.Sql);
        Assert.Equal(new object?[] { "a%", true }, my.Params);
        var ms = FilterModel.ToSql(g, Fields, SqlDialect.MsSql);
        Assert.Equal("LOWER([name]) LIKE LOWER(@p1) ESCAPE '\\' AND [active] = @p2", ms.Sql);
        Assert.Equal(new object?[] { "a%", 1 }, ms.Params);
        Assert.Equal(new object?[] { "a%", 1 }, FilterModel.ToSql(g, Fields, SqlDialect.Sqlite).Params);
    }

    [Fact]
    public void Sql_LIKE_wildcards_in_the_value_are_escaped()
        => Assert.Equal(new object?[] { "%50\\%\\_off\\\\%" }, FilterModel.ToSql(Group("and", Rule("name", "contains", "50%_off\\")), Fields).Params);

    [Fact]
    public void Sql_operators()
    {
        string Sql(FilterRule r) => FilterModel.ToSql(Group("and", r), Fields).Sql;
        Assert.Equal("\"age\" >= ?", Sql(Rule("age", "gte", 5d)));
        Assert.Equal("\"age\" <= ?", Sql(Rule("age", "lte", 5d)));
        Assert.Equal("\"age\" > ?", Sql(Rule("age", "gt", 5d)));
        Assert.Equal("\"age\" < ?", Sql(Rule("age", "lt", 5d)));
        Assert.Equal("\"age\" = ?", Sql(Rule("age", "equals", 5d)));
        Assert.Equal("\"age\" <> ?", Sql(Rule("age", "not-equals", 5d)));
        Assert.Equal("\"age\" NOT BETWEEN ? AND ?", Sql(Rule("age", "not-between", 1d, 5d)));
        Assert.Equal("LOWER(\"name\") = LOWER(?)", Sql(Rule("name", "equals", "x")));
        Assert.Equal("LOWER(\"name\") <> LOWER(?)", Sql(Rule("name", "not-equals", "x")));
        Assert.Equal("LOWER(\"name\") LIKE LOWER(?) ESCAPE '\\'", Sql(Rule("name", "ends-with", "x")));
        Assert.Equal("LOWER(\"name\") NOT LIKE LOWER(?) ESCAPE '\\'", Sql(Rule("name", "not-contains", "x")));
        Assert.Equal("\"team\" IN (?, ?)", Sql(Rule("team", "in", L("red", "blue"))));
        Assert.Equal("\"team\" NOT IN (?)", Sql(Rule("team", "not-in", L("red"))));
        Assert.Equal("(\"name\" IS NULL OR \"name\" = '')", Sql(Rule("name", "is-empty")));
        Assert.Equal("(\"name\" IS NOT NULL AND \"name\" <> '')", Sql(Rule("name", "is-not-empty")));
        Assert.Equal("\"age\" IS NULL", Sql(Rule("age", "is-empty")));
        Assert.Equal("\"age\" IS NOT NULL", Sql(Rule("age", "is-not-empty")));
        Assert.Equal("\"active\" = ?", Sql(Rule("active", "is-false")));
    }

    [Fact]
    public void Sql_uses_the_declared_column_name()
        => Assert.Equal("\"joined_on\" > ?", FilterModel.ToSql(Group("and", Rule("joined", "gt", "2026-01-01")), Fields).Sql);

    [Fact]
    public void Sql_nested_groups_are_parenthesised_and_not_negates_the_group()
    {
        var g = Group("and", Rule("age", "gt", 1d), Not(Group("or", Rule("name", "contains", "a"), Rule("name", "contains", "b"))), Group("or", Rule("age", "lt", 9d), Rule("age", "gt", 20d)));
        Assert.Equal("\"age\" > ? AND NOT (LOWER(\"name\") LIKE LOWER(?) ESCAPE '\\' OR LOWER(\"name\") LIKE LOWER(?) ESCAPE '\\') AND (\"age\" < ? OR \"age\" > ?)", FilterModel.ToSql(g, Fields).Sql);
    }

    [Fact]
    public void Sql_a_column_that_is_not_a_plain_identifier_is_refused()
    {
        var evil = new[] { new FilterField { Id = "x", Label = "X", Column = "a\"; DROP TABLE users; --" } };
        Assert.Throws<FilterException>(() => FilterModel.ToSql(Group("and", Rule("x", "contains", "a")), evil));
    }

    [Fact]
    public void Sql_a_value_is_never_part_of_the_text_unless_inline_and_inline_doubles_quotes()
    {
        var g = Group("and", Rule("name", "equals", "Robert'); DROP TABLE x;--"));
        Assert.DoesNotContain("DROP", FilterModel.ToSql(g, Fields).Sql);
        var inline = FilterModel.ToSql(g, Fields, inline: true);
        Assert.Contains("'Robert''); DROP TABLE x;--'", inline.Sql);
        Assert.Empty(inline.Params);
    }

    // ---- MongoDB ----

    private static bool Same(JsonNode? expected, JsonNode? actual) => JsonNode.DeepEquals(expected, actual);

    [Fact]
    public void Mongo_rules_and_groups()
    {
        var g = Group("and", Rule("name", "contains", "a.b"), Rule("age", "between", 1d, 5d), Group("or", Rule("team", "in", L("red")), Rule("active", "is-false")));
        var expected = JsonNode.Parse("""
            { "$and": [ { "name": { "$regex": "a\\.b", "$options": "i" } }, { "age": { "$gte": 1, "$lte": 5 } }, { "$or": [ { "team": { "$in": ["red"] } }, { "active": false } ] } ] }
            """);
        Assert.True(Same(expected, FilterModel.ToMongo(g, Fields)));
    }

    [Fact]
    public void Mongo_a_lone_rule_is_not_wrapped_not_becomes_nor_empty_is_braces_columns_are_honoured()
    {
        Assert.True(Same(JsonNode.Parse("""{ "age": { "$gte": 3 } }"""), FilterModel.ToMongo(Group("and", Rule("age", "gte", 3d)), Fields)));
        Assert.True(Same(JsonNode.Parse("""{ "$nor": [ { "age": { "$gte": 3 } } ] }"""), FilterModel.ToMongo(Not(Group("and", Rule("age", "gte", 3d))), Fields)));
        Assert.True(Same(JsonNode.Parse("{}"), FilterModel.ToMongo(Group("and"), Fields)));
        Assert.True(Same(JsonNode.Parse("""{ "joined_on": { "$lt": "2026-01-01" } }"""), FilterModel.ToMongo(Group("and", Rule("joined", "lt", "2026-01-01")), Fields)));
    }

    [Fact]
    public void Mongo_the_other_operators()
    {
        JsonNode? M(FilterRule r) => FilterModel.ToMongo(Group("and", r), Fields);
        Assert.True(Same(JsonNode.Parse("""{ "name": { "$regex": "^a", "$options": "i" } }"""), M(Rule("name", "starts-with", "a"))));
        Assert.True(Same(JsonNode.Parse("""{ "name": { "$regex": "a$", "$options": "i" } }"""), M(Rule("name", "ends-with", "a"))));
        Assert.True(Same(JsonNode.Parse("""{ "name": { "$not": { "$regex": "a", "$options": "i" } } }"""), M(Rule("name", "not-contains", "a"))));
        Assert.True(Same(JsonNode.Parse("""{ "$or": [ { "name": null }, { "name": "" } ] }"""), M(Rule("name", "is-empty"))));
        Assert.True(Same(JsonNode.Parse("""{ "age": null }"""), M(Rule("age", "is-empty"))));
        Assert.True(Same(JsonNode.Parse("""{ "$or": [ { "age": { "$lt": 1 } }, { "age": { "$gt": 5 } } ] }"""), M(Rule("age", "not-between", 1d, 5d))));
        Assert.True(Same(JsonNode.Parse("""{ "team": { "$nin": ["red"] } }"""), M(Rule("team", "not-in", L("red")))));
        Assert.True(Same(JsonNode.Parse("""{ "age": { "$ne": 5 } }"""), M(Rule("age", "not-equals", 5d))));
        Assert.True(Same(JsonNode.Parse("""{ "age": { "$ne": null } }"""), M(Rule("age", "is-not-empty"))));
    }

    // ---- OData ----

    [Fact]
    public void OData_rules_and_groups()
    {
        var g = Group("and", Rule("name", "contains", "o'b"), Rule("age", "between", 1d, 5d), Group("or", Rule("team", "in", L("red", "blue")), Rule("joined", "gte", "2026-01-01")));
        Assert.Equal("contains(tolower(name),tolower('o''b')) and (age ge 1 and age le 5) and (team in ('red','blue') or joined_on ge 2026-01-01)", FilterModel.ToOData(g, Fields));
    }

    [Fact]
    public void OData_not_empty_and_the_other_operators()
    {
        Assert.Equal("not (age lt 3)", FilterModel.ToOData(Not(Group("and", Rule("age", "lt", 3d))), Fields));
        Assert.Equal("", FilterModel.ToOData(Group("and"), Fields));
        string O(FilterRule r) => FilterModel.ToOData(Group("and", r), Fields);
        Assert.Equal("(name eq null or name eq '')", O(Rule("name", "is-empty")));
        Assert.Equal("(age lt 1 or age gt 5)", O(Rule("age", "not-between", 1d, 5d)));
        Assert.Equal("not (team in ('red'))", O(Rule("team", "not-in", L("red"))));
        Assert.Equal("active eq true", O(Rule("active", "is-true")));
        Assert.Equal("startswith(tolower(name),tolower('a'))", O(Rule("name", "starts-with", "a")));
        Assert.Equal("endswith(tolower(name),tolower('a'))", O(Rule("name", "ends-with", "a")));
        Assert.Equal("not contains(tolower(name),tolower('a'))", O(Rule("name", "not-contains", "a")));
        Assert.Equal("age ne 5", O(Rule("age", "not-equals", 5d)));
        Assert.Equal("age ne null", O(Rule("age", "is-not-empty")));
    }

    // ---- formatFilter ----

    [Fact]
    public void FormatFilter_each_format()
    {
        var g = Group("and", Rule("name", "contains", "a"));
        Assert.Contains("\"operator\": \"contains\"", FilterModel.FormatFilter(g, Fields, FilterOutputFormat.Json));
        Assert.Equal("LOWER(\"name\") LIKE LOWER('%a%') ESCAPE '\\'", FilterModel.FormatFilter(g, Fields, FilterOutputFormat.Sql));
        Assert.Equal("\"name\" ILIKE '%a%' ESCAPE '\\'", FilterModel.FormatFilter(g, Fields, FilterOutputFormat.Sql, SqlDialect.Postgres));
        Assert.Contains("$regex", FilterModel.FormatFilter(g, Fields, FilterOutputFormat.Mongo));
        Assert.Equal("contains(tolower(name),tolower('a'))", FilterModel.FormatFilter(g, Fields, FilterOutputFormat.OData));
    }

    [Fact]
    public void CreateGroup_defaults_to_and()
    {
        var g = FilterModel.CreateGroup();
        Assert.Equal(("and", 0), (g.Combinator, g.Children.Count));
        Assert.Equal("or", FilterModel.CreateGroup("or").Combinator);
    }
}
