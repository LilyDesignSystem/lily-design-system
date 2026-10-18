// Critical path for a Gantt chart's tasks (the critical path method, in whole days) — the same pure
// algorithm as the Svelte package's shared/critical-path.ts, ported line for line so both compute the same schedule.
//
// It reads Id, Start, End, ParentId, DependsOn and Dependencies, runs a forward and a backward pass, and returns
// each leaf task's critical flag and slack in days. The chart renders Critical / Slack and computes nothing itself;
// this is the optional helper that fills them (CriticalPath.Apply returns the tasks with both set).
//
// Dates are ISO YYYY-MM-DD, inclusive. Lag is in calendar days unless CriticalPathOptions.LagUnit is WorkingDays.
// A task's own Start is a "not earlier than" floor. Summary rows (a task some other task names as ParentId),
// unscheduled tasks and dependencies on unknown ids take no part. A dependency cycle is reported in Cycle.

using System.Globalization;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>What a dependency's <c>Lag</c> counts.</summary>
public enum CriticalPathLagUnit
{
    Days,
    WorkingDays,
}

/// <summary>A dated closure (holiday, leave) for working-day lag: ISO dates, inclusive; <c>End</c> defaults to <c>Start</c>.</summary>
public sealed record CriticalPathClosure(string Start, string? End = null);

/// <summary>Options for <see cref="CriticalPath"/>.</summary>
public sealed record CriticalPathOptions
{
    /// <summary>What a dependency's lag counts. Default <see cref="CriticalPathLagUnit.Days"/>.</summary>
    public CriticalPathLagUnit LagUnit { get; init; } = CriticalPathLagUnit.Days;

    /// <summary>Working days only: the weekdays nobody works, 0 = Sunday … 6 = Saturday. Default Saturday and Sunday.</summary>
    public IReadOnlyList<int>? Weekends { get; init; }

    /// <summary>Working days only: dated closures (holidays, leave).</summary>
    public IReadOnlyList<CriticalPathClosure>? Unavailable { get; init; }
}

/// <summary>One scheduled leaf task's result.</summary>
public sealed record CriticalPathTaskResult(bool Critical, int Slack);

/// <summary>The outcome of <see cref="CriticalPath.Compute"/>.</summary>
public sealed record CriticalPathResult(
    IReadOnlyDictionary<string, CriticalPathTaskResult> Tasks,
    IReadOnlyList<string> Cycle,
    string? Finish);

/// <summary>The critical path method over <see cref="GanttTask"/> rows.</summary>
public static class CriticalPath
{
    private static readonly DateOnly Epoch = new(1970, 1, 1);

    private sealed record Edge(string From, string To, string Type, int Lag);

    private static long? ToDay(string? iso)
    {
        if (string.IsNullOrEmpty(iso)) return null;
        return DateOnly.TryParseExact(iso, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var d)
            ? d.DayNumber - Epoch.DayNumber
            : null;
    }

    private static string FromDay(long day) => Epoch.AddDays((int)day).ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);

    private static (Func<long, int, long> Shift, Func<long, bool> Working) LagShifter(CriticalPathOptions? options)
    {
        if (options is null || options.LagUnit != CriticalPathLagUnit.WorkingDays)
            return ((day, n) => day + n, _ => true);
        var weekend = new HashSet<int>(options.Weekends ?? new[] { 0, 6 });
        var closed = new HashSet<long>();
        foreach (var range in options.Unavailable ?? Array.Empty<CriticalPathClosure>())
        {
            var a = ToDay(range.Start);
            var b = ToDay(range.End ?? range.Start);
            if (a is null || b is null) continue;
            for (var d = Math.Min(a.Value, b.Value); d <= Math.Max(a.Value, b.Value); d++) closed.Add(d);
        }
        // 1970-01-01 was a Thursday.
        bool Working(long d) => !weekend.Contains((int)((((d + 4) % 7) + 7) % 7)) && !closed.Contains(d);
        long Shift(long day, int n)
        {
            var d = day;
            var step = n < 0 ? -1 : 1;
            for (var left = Math.Abs(n); left > 0;)
            {
                d += step;
                if (Working(d)) left--;
            }
            return d;
        }
        return (Shift, Working);
    }

    private static IEnumerable<GanttDependency> DependenciesOf(GanttTask t)
    {
        foreach (var id in t.DependsOn ?? Array.Empty<string>()) yield return new GanttDependency(id);
        foreach (var d in t.Dependencies ?? Array.Empty<GanttDependency>()) yield return d;
    }

    /// <summary>Runs the forward and backward pass. Scheduled leaf tasks get a result; a cycle's tasks are listed in <see cref="CriticalPathResult.Cycle"/>.</summary>
    public static CriticalPathResult Compute(IReadOnlyList<GanttTask> tasks, CriticalPathOptions? options = null)
    {
        var (shift, working) = LagShifter(options);
        // The largest x whose shifted value does not pass `limit`; `anchor` is the predecessor day x stands for.
        long Latest(int lag, long limit, long anchor = 0)
        {
            var x = limit - lag + Math.Abs(lag) * 2L + 7;
            while (shift(x, lag) > limit) x--;
            while (!working(x + anchor)) x--;
            return x;
        }

        var parents = new HashSet<string>(tasks.Where(t => !string.IsNullOrEmpty(t.ParentId)).Select(t => t.ParentId!));
        var nodes = new Dictionary<string, (long Start, long Dur)>();
        var ids = new List<string>();
        foreach (var t in tasks)
        {
            if (parents.Contains(t.Id)) continue;
            var s = ToDay(t.Start);
            var e = ToDay(t.End);
            if (s is null || e is null || e < s) continue;
            nodes[t.Id] = (s.Value, e.Value - s.Value + 1);
            ids.Add(t.Id);
        }

        var edges = new List<Edge>();
        foreach (var t in tasks)
        {
            if (!nodes.ContainsKey(t.Id)) continue;
            foreach (var dep in DependenciesOf(t))
            {
                if (!nodes.ContainsKey(dep.Id) || dep.Id == t.Id) continue;
                edges.Add(new Edge(dep.Id, t.Id, dep.Type ?? "e2s", dep.Lag));
            }
        }

        // Topological order (Kahn). Whatever is left over sits on, or behind, a cycle.
        var indegree = ids.ToDictionary(id => id, _ => 0);
        var outgoing = ids.ToDictionary(id => id, _ => new List<Edge>());
        var incoming = ids.ToDictionary(id => id, _ => new List<Edge>());
        foreach (var e in edges)
        {
            indegree[e.To]++;
            outgoing[e.From].Add(e);
            incoming[e.To].Add(e);
        }
        var order = new List<string>();
        var queue = new Queue<string>(ids.Where(id => indegree[id] == 0));
        while (queue.Count > 0)
        {
            var id = queue.Dequeue();
            order.Add(id);
            foreach (var e in outgoing[id])
            {
                if (--indegree[e.To] == 0) queue.Enqueue(e.To);
            }
        }
        var cycle = ids.Where(id => !order.Contains(id)).ToList();
        if (order.Count == 0) return new CriticalPathResult(new Dictionary<string, CriticalPathTaskResult>(), cycle, null);

        // Forward pass: earliest start (never before the task's own start).
        var es = new Dictionary<string, long>();
        foreach (var id in order)
        {
            var (start, dur) = nodes[id];
            var earliest = start;
            foreach (var e in incoming[id])
            {
                if (!es.TryGetValue(e.From, out var p)) continue;
                var pd = nodes[e.From].Dur;
                var bound = e.Type switch
                {
                    "s2s" => shift(p, e.Lag),
                    "e2e" => shift(p + pd - 1, e.Lag) - dur + 1,
                    "s2e" => shift(p, e.Lag) - dur + 1,
                    _ => shift(p + pd, e.Lag),
                };
                if (bound > earliest) earliest = bound;
            }
            es[id] = earliest;
        }
        var end = long.MinValue;
        foreach (var id in order) end = Math.Max(end, es[id] + nodes[id].Dur - 1);

        // Backward pass: latest start that still finishes the project on time.
        var ls = new Dictionary<string, long>();
        for (var i = order.Count - 1; i >= 0; i--)
        {
            var id = order[i];
            var dur = nodes[id].Dur;
            var latestStart = end - dur + 1;
            foreach (var e in outgoing[id])
            {
                if (!ls.TryGetValue(e.To, out var s)) continue;
                var sd = nodes[e.To].Dur;
                var bound = e.Type switch
                {
                    "s2s" => Latest(e.Lag, s),
                    "e2e" => Latest(e.Lag, s + sd - 1) - dur + 1,
                    "s2e" => Latest(e.Lag, s + sd - 1),
                    _ => Latest(e.Lag, s, -1) - dur,
                };
                if (bound < latestStart) latestStart = bound;
            }
            ls[id] = latestStart;
        }

        var results = new Dictionary<string, CriticalPathTaskResult>();
        foreach (var id in order)
        {
            var slack = (int)Math.Max(0, ls[id] - es[id]);
            results[id] = new CriticalPathTaskResult(slack == 0, slack);
        }
        return new CriticalPathResult(results, cycle, FromDay(end));
    }

    /// <summary>The tasks with <c>Critical</c> and <c>Slack</c> filled in for every scheduled leaf task; every other task is returned unchanged.</summary>
    public static IReadOnlyList<GanttTask> Apply(IReadOnlyList<GanttTask> tasks, CriticalPathOptions? options = null)
    {
        var found = Compute(tasks, options).Tasks;
        return tasks.Select(t => found.TryGetValue(t.Id, out var r) ? Copy(t, r) : t).ToList();
    }

    private static GanttTask Copy(GanttTask t, CriticalPathTaskResult r) => new()
    {
        Id = t.Id,
        Label = t.Label,
        Start = t.Start,
        End = t.End,
        PercentComplete = t.PercentComplete,
        ParentId = t.ParentId,
        DependsOn = t.DependsOn,
        Dependencies = t.Dependencies,
        Baseline = t.Baseline,
        Type = t.Type,
        Critical = r.Critical,
        Slack = r.Slack,
        Values = t.Values,
    };
}
