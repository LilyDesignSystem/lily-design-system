// CriticalPath tests — the same cases as the shared TypeScript suite (shared/critical-path.test.ts), so the two stay in step.

using System.Collections.Generic;
using System.Linq;
using LilyDesignSystem.Blazor.Helpers;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class CriticalPathTests
{
    private static GanttTask T(string id, string? start, string? end, string? parent = null, string[]? dependsOn = null, params GanttDependency[] deps)
        => new() { Id = id, Label = id.ToUpperInvariant(), Start = start, End = end, ParentId = parent, DependsOn = dependsOn, Dependencies = deps.Length > 0 ? deps : null };

    private static readonly CriticalPathOptions WorkingDays = new() { LagUnit = CriticalPathLagUnit.WorkingDays };

    [Fact]
    public void A_chain_is_critical_and_a_shorter_branch_has_slack()
    {
        var r = CriticalPath.Compute(new[]
        {
            T("a", "2026-01-01", "2026-01-03"),
            T("b", "2026-01-04", "2026-01-08", dependsOn: new[] { "a" }),
            T("c", "2026-01-04", "2026-01-05", dependsOn: new[] { "a" }),
            T("d", "2026-01-09", "2026-01-10", dependsOn: new[] { "b", "c" }),
        });
        Assert.All(new[] { "a", "b", "d" }, id => Assert.True(r.Tasks[id].Critical));
        Assert.Equal(new CriticalPathTaskResult(false, 3), r.Tasks["c"]);
        Assert.Equal("2026-01-10", r.Finish);
    }

    [Fact]
    public void A_dependency_pushes_a_task_later_than_its_planned_start()
    {
        var r = CriticalPath.Compute(new[] { T("a", "2026-01-01", "2026-01-05"), T("b", "2026-01-02", "2026-01-03", dependsOn: new[] { "a" }) });
        Assert.Equal("2026-01-07", r.Finish);
        Assert.Equal(new CriticalPathTaskResult(true, 0), r.Tasks["b"]);
    }

    [Fact]
    public void Finish_to_start_lag_and_lead()
    {
        var a = T("a", "2026-01-01", "2026-01-02");
        Assert.Equal("2026-01-05", CriticalPath.Compute(new[] { a, T("b", "2026-01-03", "2026-01-03", deps: new GanttDependency("a", null, 2)) }).Finish);
        Assert.Equal("2026-01-04", CriticalPath.Compute(new[] { a, T("b", "2026-01-01", "2026-01-04", deps: new GanttDependency("a", null, -2)) }).Finish);
    }

    [Fact]
    public void Start_to_start_the_successor_starts_lag_days_after_the_predecessor_starts()
    {
        var r = CriticalPath.Compute(new[] { T("a", "2026-01-01", "2026-01-10"), T("b", "2026-01-01", "2026-01-02", deps: new GanttDependency("a", "s2s", 3)) });
        Assert.Equal(new CriticalPathTaskResult(true, 0), r.Tasks["a"]);
        Assert.Equal(new CriticalPathTaskResult(false, 5), r.Tasks["b"]);
    }

    [Fact]
    public void End_to_end_the_successor_ends_lag_days_after_the_predecessor_ends()
    {
        var r = CriticalPath.Compute(new[] { T("a", "2026-01-01", "2026-01-10"), T("b", "2026-01-01", "2026-01-03", deps: new GanttDependency("a", "e2e", 2)) });
        Assert.Equal("2026-01-12", r.Finish);
        Assert.True(r.Tasks["a"].Critical);
        Assert.True(r.Tasks["b"].Critical);
    }

    [Fact]
    public void Start_to_end_the_successor_ends_lag_days_after_the_predecessor_starts()
    {
        var r = CriticalPath.Compute(new[] { T("a", "2026-01-05", "2026-01-06"), T("b", "2026-01-01", "2026-01-03", deps: new GanttDependency("a", "s2e", 4)) });
        Assert.Equal("2026-01-09", r.Finish);
        Assert.Equal(new CriticalPathTaskResult(true, 0), r.Tasks["b"]);
    }

    [Fact]
    public void Mixed_kinds_with_lags_measure_slack_against_the_project_finish()
    {
        var r = CriticalPath.Compute(new[]
        {
            T("a", "2026-01-01", "2026-01-04"),
            T("b", "2026-01-01", "2026-01-02", deps: new GanttDependency("a", "s2s", 1)),
            T("c", "2026-01-01", "2026-01-03", deps: new[] { new GanttDependency("a", "e2s", 1), new GanttDependency("b", "e2e", 5) }),
        });
        Assert.Equal("2026-01-08", r.Finish);
        Assert.True(r.Tasks["c"].Critical);
        Assert.True(r.Tasks["a"].Critical);
        Assert.Equal(0, r.Tasks["b"].Slack);
    }

    private static GanttTask[] Chain(int lag) => new[]
    {
        T("a", "2026-01-05", "2026-01-09"),
        T("b", "2026-01-05", "2026-01-05", deps: new GanttDependency("a", null, lag)),
    };

    [Fact]
    public void Working_day_lag_skips_the_weekend_that_calendar_lag_lands_on()
    {
        Assert.Equal("2026-01-11", CriticalPath.Compute(Chain(1)).Finish);
        Assert.Equal("2026-01-12", CriticalPath.Compute(Chain(1), WorkingDays).Finish);
        Assert.Equal("2026-01-13", CriticalPath.Compute(Chain(2), WorkingDays).Finish);
        Assert.Equal("2026-01-10", CriticalPath.Compute(Chain(0), WorkingDays).Finish);
    }

    [Fact]
    public void Working_day_lag_skips_closures_and_honours_a_custom_weekend()
    {
        Assert.Equal("2026-01-13", CriticalPath.Compute(Chain(1), WorkingDays with { Unavailable = new[] { new CriticalPathClosure("2026-01-12") } }).Finish);
        Assert.Equal("2026-01-11", CriticalPath.Compute(Chain(1), WorkingDays with { Weekends = new int[0] }).Finish);
        Assert.Equal("2026-01-11", CriticalPath.Compute(Chain(1), WorkingDays with { Weekends = new[] { 5, 6 } }).Finish);
    }

    [Fact]
    public void Working_day_backward_pass_agrees_with_the_forward_pass()
    {
        var r = CriticalPath.Compute(new[]
        {
            T("a", "2026-01-05", "2026-01-09"),
            T("b", "2026-01-05", "2026-01-06", deps: new GanttDependency("a", null, 1)),
            T("c", "2026-01-05", "2026-01-05", deps: new GanttDependency("a", null, 1)),
        }, WorkingDays);
        Assert.Equal("2026-01-13", r.Finish);
        Assert.Equal(new CriticalPathTaskResult(true, 0), r.Tasks["a"]);
        Assert.Equal(new CriticalPathTaskResult(true, 0), r.Tasks["b"]);
        Assert.Equal(new CriticalPathTaskResult(false, 1), r.Tasks["c"]);
    }

    [Theory]
    [InlineData("e2s")]
    [InlineData("s2s")]
    [InlineData("e2e")]
    [InlineData("s2e")]
    public void All_four_kinds_stay_consistent_in_working_days(string type)
    {
        var r = CriticalPath.Compute(new[] { T("a", "2026-01-05", "2026-01-09"), T("b", "2026-01-05", "2026-01-07", deps: new GanttDependency("a", type, 3)) }, WorkingDays);
        Assert.All(r.Tasks.Values, v => Assert.True(v.Slack >= 0));
        Assert.Contains(r.Tasks.Values, v => v.Critical);
    }

    [Fact]
    public void Summary_rows_are_ignored_and_their_children_scheduled()
    {
        var r = CriticalPath.Compute(new[]
        {
            T("p", "2026-01-01", "2026-01-10"),
            T("a", "2026-01-01", "2026-01-02", parent: "p"),
            T("b", "2026-01-03", "2026-01-04", parent: "p", dependsOn: new[] { "a" }),
        });
        Assert.False(r.Tasks.ContainsKey("p"));
        Assert.Equal("2026-01-04", r.Finish);
    }

    [Fact]
    public void Unscheduled_tasks_and_unknown_dependencies_are_ignored()
    {
        var r = CriticalPath.Compute(new[] { T("a", "2026-01-01", "2026-01-02", dependsOn: new[] { "ghost", "u" }), T("u", null, null) });
        Assert.Equal(new[] { "a" }, r.Tasks.Keys.ToArray());
        Assert.True(r.Tasks["a"].Critical);
    }

    [Fact]
    public void A_cycle_is_reported_and_left_out()
    {
        var r = CriticalPath.Compute(new[]
        {
            T("a", "2026-01-01", "2026-01-02", dependsOn: new[] { "b" }),
            T("b", "2026-01-03", "2026-01-04", dependsOn: new[] { "a" }),
            T("c", "2026-01-01", "2026-01-01"),
        });
        Assert.Equal(new[] { "a", "b" }, r.Cycle.OrderBy(x => x).ToArray());
        Assert.Equal(new[] { "c" }, r.Tasks.Keys.ToArray());
    }

    [Fact]
    public void Nothing_scheduled_gives_no_result()
    {
        var r = CriticalPath.Compute(new List<GanttTask>());
        Assert.Empty(r.Tasks);
        Assert.Empty(r.Cycle);
        Assert.Null(r.Finish);
    }

    [Fact]
    public void Apply_fills_critical_and_slack_and_leaves_other_fields_alone()
    {
        var input = new[] { T("a", "2026-01-01", "2026-01-02"), T("u", null, null) };
        var out2 = CriticalPath.Apply(input);
        Assert.True(out2[0].Critical);
        Assert.Equal(0, out2[0].Slack);
        Assert.Equal("A", out2[0].Label);
        Assert.Same(input[1], out2[1]);
        Assert.Null(out2[1].Slack);
    }
}
