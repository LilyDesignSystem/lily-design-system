/**
 * Days nobody works or attends — holidays, time off, closures — as dated ranges. Shared by the Gantt chart and the calendar: pure, so it is
 * unit-tested without a browser. Plain data and text: no default kinds, no English, no calendar of its own (the consumer supplies the days;
 * a weekend is `weekends` / `weekendDays`, not an entry here).
 */

/** A closed span of days. `end` defaults to `start` (one day). `kind` is a class hook (`holiday`, `leave`, `closure`); `label` is the visible text. */
export type Unavailable = { start: string; end?: string; kind?: string; label?: string };

/** Days since 1970-01-01 of an ISO `YYYY-MM-DD` date, or NaN when it is not one. Time-zone free. */
export function epochDayOf(iso: string): number {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!m) return Number.NaN;
    const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
    const t = Date.UTC(y, mo - 1, d);
    const check = new Date(t);
    // Reject 2026-02-31 and the like: Date rolls them over.
    if (check.getUTCFullYear() !== y || check.getUTCMonth() !== mo - 1 || check.getUTCDate() !== d) return Number.NaN;
    return t / 86_400_000;
}

const spanOf = (item: Unavailable): [number, number] | null => {
    const start = epochDayOf(item.start);
    const end = epochDayOf(item.end ?? item.start);
    if (Number.isNaN(start) || Number.isNaN(end)) return null;
    return start <= end ? [start, end] : [end, start];
};

/** The entries that cover `isoDate`, in the order given. */
export function unavailableOn(items: readonly Unavailable[] | undefined, isoDate: string): Unavailable[] {
    if (!items?.length) return [];
    const day = epochDayOf(isoDate);
    if (Number.isNaN(day)) return [];
    return items.filter((item) => {
        const span = spanOf(item);
        return span !== null && day >= span[0] && day <= span[1];
    });
}

/** What a column (`start`..`end`, ISO) holds: the entries that touch it, and whether every one of its days is covered. */
export function unavailableIn(items: readonly Unavailable[] | undefined, start: string, end: string): { items: Unavailable[]; all: boolean } {
    if (!items?.length) return { items: [], all: false };
    const from = epochDayOf(start);
    const to = epochDayOf(end);
    if (Number.isNaN(from) || Number.isNaN(to)) return { items: [], all: false };
    const touching = items.filter((item) => {
        const span = spanOf(item);
        return span !== null && span[0] <= to && span[1] >= from;
    });
    if (touching.length === 0) return { items: [], all: false };
    const spans = touching.map((item) => spanOf(item) as [number, number]);
    let all = true;
    for (let day = from; day <= to; day++) {
        if (!spans.some(([a, b]) => day >= a && day <= b)) {
            all = false;
            break;
        }
    }
    return { items: touching, all };
}

/** The kinds of some entries as one space-separated token list for a `data-` attribute (`unavailable` when an entry has no kind), without repeats. */
export function unavailableKinds(items: readonly Unavailable[]): string | undefined {
    if (items.length === 0) return undefined;
    return [...new Set(items.map((item) => item.kind ?? "unavailable"))].join(" ");
}
