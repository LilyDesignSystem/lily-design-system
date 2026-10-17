/**
 * Critical path for a Gantt chart's tasks (the critical path method, in whole days).
 *
 * Pure and framework-neutral: it reads `{ id, start, end, parentId, dependsOn }`, runs a forward and a
 * backward pass, and returns each task's `critical` flag and `slack` in days, ready to spread onto
 * `GanttTask`. Lily's chart renders `critical` / `slack` and computes nothing itself; this is the
 * optional helper that fills them.
 *
 * - Dates are ISO `YYYY-MM-DD`, inclusive: a task from the 1st to the 3rd lasts 3 days. `end === start` is
 *   a one-day task (a milestone to the chart).
 * - The four dependency kinds, with `lag` in calendar days (negative = lead; default 0):
 *   `e2s` (default) the successor starts the day after the predecessor ends, plus lag;
 *   `s2s` it starts `lag` days after the predecessor starts;
 *   `e2e` it ends `lag` days after the predecessor ends;
 *   `s2e` it ends `lag` days after the predecessor starts.
 * - A task's own `start` is a "not earlier than" floor, so a task with no predecessors starts where it is
 *   planned and a dependency can only push a task later, never earlier.
 * - Summary rows (a task some other task names as `parentId`) take no part: only leaf tasks are scheduled.
 *   Unscheduled tasks (no dates) and dependencies on unknown ids are ignored.
 * - Lag is in calendar days unless `options.lagUnit` is `"working-days"`: then a lag of N moves N working days, skipping
 *   `options.weekends` (weekday numbers, 0 = Sunday; default Saturday and Sunday) and the dated `options.unavailable`
 *   ranges (holidays, time off; the chart's `unavailable` prop). Task spans stay as dated; only the gap between tasks changes.
 * - Slack is `latest start - earliest start` against the project's last finish. Critical means slack 0.
 * - A dependency cycle has no schedule: the tasks on or behind it are reported in `cycle` and left out of `tasks`.
 */

export type CriticalPathDependencyType = "e2s" | "s2s" | "s2e" | "e2e";
export type CriticalPathDependency = { id: string; type?: CriticalPathDependencyType; lag?: number };

export type CriticalPathTask = {
    id: string;
    start?: string;
    end?: string;
    parentId?: string;
    dependsOn?: (string | CriticalPathDependency)[];
};

export type CriticalPathOptions = {
    /** What a dependency's `lag` counts. Default `"days"`. */
    lagUnit?: "days" | "working-days";
    /** `"working-days"`: the weekdays nobody works, 0 = Sunday … 6 = Saturday. Default `[0, 6]`. */
    weekends?: number[];
    /** `"working-days"`: dated closures (holidays, leave): `{ start, end? }`, ISO dates, inclusive. */
    unavailable?: readonly { start: string; end?: string }[];
};

export type CriticalPathResult = {
    /** Per leaf task: on the critical path, and slack in days (0 on the critical path). */
    tasks: Map<string, { critical: boolean; slack: number }>;
    /** Ids that could not be scheduled because they sit on, or behind, a dependency cycle. */
    cycle: string[];
    /** The project's last finish (ISO date), or `null` when nothing is scheduled. */
    finish: string | null;
};

const DAY = 86_400_000;

function toDay(iso: string | undefined): number | null {
    if (!iso) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!m) return null;
    const t = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return Number.isNaN(t) ? null : Math.round(t / DAY);
}

function fromDay(day: number): string {
    return new Date(day * DAY).toISOString().slice(0, 10);
}

type Edge = { from: string; to: string; type: CriticalPathDependencyType; lag: number };

/** A function moving `n` working days from `day` (a calendar-day shift when lag counts days). */
function lagShifter(options: CriticalPathOptions | undefined): { shift: (day: number, n: number) => number; working: (day: number) => boolean } {
    if (options?.lagUnit !== "working-days") return { shift: (day, n) => day + n, working: () => true };
    const weekend = new Set(options.weekends ?? [0, 6]);
    const closed = new Set<number>();
    for (const range of options.unavailable ?? []) {
        const a = toDay(range.start);
        const b = toDay(range.end ?? range.start);
        if (a === null || b === null) continue;
        for (let d = Math.min(a, b); d <= Math.max(a, b); d++) closed.add(d);
    }
    // 1970-01-01 was a Thursday.
    const working = (d: number) => !weekend.has((((d + 4) % 7) + 7) % 7) && !closed.has(d);
    return {
        working,
        shift: (day, n) => {
            let d = day;
            const step = n < 0 ? -1 : 1;
            for (let left = Math.abs(n); left > 0; ) {
                d += step;
                if (working(d)) left--;
            }
            return d;
        },
    };
}

export function criticalPath(tasks: readonly CriticalPathTask[], options?: CriticalPathOptions): CriticalPathResult {
    const { shift, working } = lagShifter(options);
    // The largest x whose shifted value does not pass `limit` (the shift never decreases as x grows). `anchor` is the
    // predecessor day that x stands for (x itself, or the day before it for finish-to-start): a predecessor does not
    // start or finish on a day nobody works, so x steps back to a working one.
    const latest = (lag: number, limit: number, anchor = 0): number => {
        let x = limit - lag + Math.abs(lag) * 2 + 7;
        while (shift(x, lag) > limit) x--;
        while (!working(x + anchor)) x--;
        return x;
    };
    const parents = new Set<string>();
    for (const t of tasks) if (t.parentId) parents.add(t.parentId);

    const nodes = new Map<string, { start: number; dur: number }>();
    for (const t of tasks) {
        if (parents.has(t.id)) continue;
        const s = toDay(t.start);
        const e = toDay(t.end);
        if (s === null || e === null || e < s) continue;
        nodes.set(t.id, { start: s, dur: e - s + 1 });
    }

    const edges: Edge[] = [];
    for (const t of tasks) {
        if (!nodes.has(t.id)) continue;
        for (const dep of t.dependsOn ?? []) {
            const d = typeof dep === "string" ? { id: dep } : dep;
            if (!nodes.has(d.id) || d.id === t.id) continue;
            edges.push({ from: d.id, to: t.id, type: d.type ?? "e2s", lag: d.lag ?? 0 });
        }
    }

    // Topological order (Kahn). Whatever is left over sits on, or behind, a cycle.
    const indegree = new Map<string, number>([...nodes.keys()].map((id) => [id, 0]));
    const outgoing = new Map<string, Edge[]>([...nodes.keys()].map((id) => [id, []]));
    const incoming = new Map<string, Edge[]>([...nodes.keys()].map((id) => [id, []]));
    for (const e of edges) {
        indegree.set(e.to, indegree.get(e.to)! + 1);
        outgoing.get(e.from)!.push(e);
        incoming.get(e.to)!.push(e);
    }
    const order: string[] = [];
    const queue = [...nodes.keys()].filter((id) => indegree.get(id) === 0);
    while (queue.length > 0) {
        const id = queue.shift()!;
        order.push(id);
        for (const e of outgoing.get(id)!) {
            const n = indegree.get(e.to)! - 1;
            indegree.set(e.to, n);
            if (n === 0) queue.push(e.to);
        }
    }
    const cycle = [...nodes.keys()].filter((id) => !order.includes(id));
    const result: CriticalPathResult = { tasks: new Map(), cycle, finish: null };
    if (order.length === 0) return result;

    // Forward pass: earliest start (never before the task's own start).
    const es = new Map<string, number>();
    for (const id of order) {
        const { start, dur } = nodes.get(id)!;
        let earliest = start;
        for (const e of incoming.get(id)!) {
            if (!es.has(e.from)) continue;
            const p = es.get(e.from)!;
            const pd = nodes.get(e.from)!.dur;
            const bound =
                e.type === "e2s" ? shift(p + pd, e.lag)
                : e.type === "s2s" ? shift(p, e.lag)
                : e.type === "e2e" ? shift(p + pd - 1, e.lag) - dur + 1
                : shift(p, e.lag) - dur + 1;
            if (bound > earliest) earliest = bound;
        }
        es.set(id, earliest);
    }
    let end = -Infinity;
    for (const id of order) end = Math.max(end, es.get(id)! + nodes.get(id)!.dur - 1);

    // Backward pass: latest start that still finishes the project on time.
    const ls = new Map<string, number>();
    for (const id of [...order].reverse()) {
        const { dur } = nodes.get(id)!;
        let latestStart = end - dur + 1;
        for (const e of outgoing.get(id)!) {
            if (!ls.has(e.to)) continue;
            const s = ls.get(e.to)!;
            const sd = nodes.get(e.to)!.dur;
            const bound =
                e.type === "e2s" ? latest(e.lag, s, -1) - dur
                : e.type === "s2s" ? latest(e.lag, s)
                : e.type === "e2e" ? latest(e.lag, s + sd - 1) - dur + 1
                : latest(e.lag, s + sd - 1);
            if (bound < latestStart) latestStart = bound;
        }
        ls.set(id, latestStart);
    }

    for (const id of order) {
        const slack = Math.max(0, ls.get(id)! - es.get(id)!);
        result.tasks.set(id, { critical: slack === 0, slack });
    }
    result.finish = fromDay(end);
    return result;
}

/** The tasks with `critical` and `slack` filled in for every scheduled leaf task; all else is returned unchanged. */
export function applyCriticalPath<T extends CriticalPathTask>(tasks: readonly T[], options?: CriticalPathOptions): (T & { critical?: boolean; slack?: number })[] {
    const { tasks: found } = criticalPath(tasks, options);
    return tasks.map((t) => {
        const r = found.get(t.id);
        return r ? { ...t, critical: r.critical, slack: r.slack } : { ...t };
    });
}
