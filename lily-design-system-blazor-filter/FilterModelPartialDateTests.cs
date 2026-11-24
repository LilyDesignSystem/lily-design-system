// Partial dates in the filter — the C# twin of shared/filter-model.partial-date.test.ts (spec/lessons/openehr-rust item 5).
// The output strings are the TypeScript model's own, so the two ports write the same SQL, OData and MongoDB.

using System.Collections.Generic;
using LilyDesignSystem.Blazor.Helpers;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class FilterModelPartialDateTests
{
    private static readonly IReadOnlyList<FilterField> Fields = new[]
    {
        new FilterField { Id = "onset", Label = "Onset", Type = FilterFieldType.PartialDate },
    };

    private static FilterGroup One(string op, string? value = null, string? value2 = null, bool not = false)
        => new("g", "and", not, new FilterNode[] { new FilterRule("r", "onset", op, value, value2) });

    private static bool Matches(FilterGroup g, object? onset)
        => FilterModel.ToPredicate(g, Fields)(new Dictionary<string, object?> { ["onset"] = onset });

    [Fact]
    public void Offers_the_date_comparisons_and_takes_full_dates_as_rule_values()
    {
        Assert.Contains("between", FilterModel.OperatorsFor(Fields[0]));
        Assert.Null(FilterModel.RuleIssueOf(new FilterRule("r", "onset", "lt", "2019-06-01"), Fields));
        Assert.Equal(RuleIssue.InvalidValue, FilterModel.RuleIssueOf(new FilterRule("r", "onset", "lt", "2019-06"), Fields));
    }

    [Theory]
    [InlineData("2019", true)]
    [InlineData("2019-03", true)]
    [InlineData("2020-02-29", true)]
    [InlineData("19", false)]
    [InlineData("2019-13", false)]
    [InlineData("2019-02-30", false)]
    [InlineData("20190314", false)]
    public void IsPartialDate_accepts_a_year_a_month_or_a_day(string value, bool expected)
        => Assert.Equal(expected, FilterModel.IsPartialDate(value));

    // HC-Q1 (spec/healthcare-ui/requirements.md)
    [Fact]
    public void What_the_precision_cannot_decide_matches_neither_the_rule_nor_its_negation()
    {
        Assert.False(Matches(One("lt", "2019-06-01"), "2019"));
        Assert.False(Matches(One("lt", "2019-06-01", not: true), "2019"));
        Assert.False(Matches(One("equals", "2019-03-14"), "2019-03"));
        Assert.False(Matches(One("not-equals", "2019-03-14"), "2019-03"));
        Assert.False(Matches(One("not-equals", "2019-06-01"), "19"));
    }

    [Fact]
    public void What_the_precision_decides_is_answered_and_a_blank_row_is_as_for_a_date()
    {
        Assert.True(Matches(One("lt", "2019-06-01"), "2019-05"));
        Assert.True(Matches(One("gte", "2019-01-01"), "2019"));
        Assert.True(Matches(One("lte", "2019-12-31"), "2019"));
        Assert.True(Matches(One("between", "2019-01-01", "2019-12-31"), "2019-07"));
        Assert.True(Matches(One("not-between", "2019-01-01", "2019-12-31"), "2020"));
        Assert.True(Matches(One("not-equals", "2019-03-14"), "2019-04"));
        Assert.False(Matches(One("lt", "2019-06-01"), null));
        Assert.True(Matches(One("not-equals", "2019-06-01"), ""));
    }

    [Fact]
    public void Kleene_or_is_true_when_one_side_is()
    {
        var g = new FilterGroup("g", "or", false, new FilterNode[]
        {
            new FilterRule("a", "onset", "lt", "2019-06-01"),
            new FilterRule("b", "onset", "lt", "2020-01-01"),
        });
        Assert.True(Matches(g, "2019"));
    }

    [Fact]
    public void Sql_matches_the_TypeScript_model()
    {
        Assert.Equal(
            "((\"onset\" LIKE '____' AND \"onset\" < '2019') OR (\"onset\" LIKE '____-__' AND \"onset\" < '2019-06') OR (\"onset\" LIKE '____-__-__' AND \"onset\" < '2019-06-01'))",
            FilterModel.ToSql(One("lt", "2019-06-01"), Fields, inline: true).Sql);
        Assert.Equal(
            "((\"onset\" IS NULL OR \"onset\" = '') OR (\"onset\" LIKE '____' AND \"onset\" > '2019') OR (\"onset\" LIKE '____-__' AND \"onset\" >= '2019-06') OR (\"onset\" LIKE '____-__-__' AND \"onset\" >= '2019-06-01'))",
            FilterModel.ToSql(One("lt", "2019-06-01", not: true), Fields, inline: true).Sql);
        Assert.Equal(
            "(((\"onset\" LIKE '____' AND \"onset\" >= '2019') OR (\"onset\" LIKE '____-__' AND \"onset\" >= '2019-01') OR (\"onset\" LIKE '____-__-__' AND \"onset\" >= '2019-01-01')) AND ((\"onset\" LIKE '____' AND \"onset\" <= '2019') OR (\"onset\" LIKE '____-__' AND \"onset\" <= '2019-12') OR (\"onset\" LIKE '____-__-__' AND \"onset\" <= '2019-12-31')))",
            FilterModel.ToSql(One("between", "2019-01-01", "2019-12-31"), Fields, inline: true).Sql);
    }

    [Fact]
    public void Postgres_numbers_only_the_parameters_it_writes()
    {
        var result = FilterModel.ToSql(One("between", "2019-01-01", "2019-12-31", not: true), Fields, SqlDialect.Postgres);
        var count = System.Text.RegularExpressions.Regex.Matches(result.Sql, @"\$\d+").Count;
        Assert.Equal(result.Params.Count, count);
    }

    [Fact]
    public void OData_and_MongoDB_match_the_TypeScript_model()
    {
        Assert.Equal(
            "((onset eq null or onset eq '') or (length(onset) eq 4 and onset ne '2019') or (length(onset) eq 7 and onset ne '2019-03') or (length(onset) eq 10 and onset ne '2019-03-14'))",
            FilterModel.ToOData(One("not-equals", "2019-03-14"), Fields));
        Assert.Equal(
            "{\"$or\":[{\"$and\":[{\"onset\":{\"$regex\":\"^.{4}$\"}},{\"onset\":{\"$lt\":\"2019\"}}]},{\"$and\":[{\"onset\":{\"$regex\":\"^.{7}$\"}},{\"onset\":{\"$lt\":\"2019-06\"}}]},{\"$and\":[{\"onset\":{\"$regex\":\"^.{10}$\"}},{\"onset\":{\"$lt\":\"2019-06-01\"}}]}]}",
            FilterModel.ToMongo(One("lt", "2019-06-01"), Fields).ToJsonString());
    }

    [Fact]
    public void A_filter_without_a_partial_date_comparison_is_written_as_before()
    {
        Assert.Equal("(\"onset\" IS NULL OR \"onset\" = '')", FilterModel.ToSql(One("is-empty"), Fields).Sql);
    }
}
