// Partial dates in the filter (spec/lessons/openehr-rust item 5): a row known only to the year or month is matched only when
// the comparison is certain, in every output and under `not`. The predicate is the reference; SQLite runs the SQL for real.
import { DatabaseSync } from "node:sqlite";
import fc from "fast-check";
import { describe, expect, test } from "vitest";

import {
    isPartialDate,
    operatorsFor,
    ruleIssue,
    toMongo,
    toOData,
    toPredicate,
    toSql,
    type FilterField,
    type FilterGroup,
    type FilterNode,
    type FilterOperator,
    type FilterRule,
} from "./filter-model";

const PARTIAL: FilterField = { id: "onset", label: "Onset", type: "partial-date" };
const FULL: FilterField = { id: "onset", label: "Onset", type: "date" };
const COMPARISONS: FilterOperator[] = [
    "equals",
    "not-equals",
    "gt",
    "gte",
    "lt",
    "lte",
    "between",
    "not-between",
];

const rule = (operator: FilterOperator, value?: string, value2?: string): FilterRule => ({
    type: "rule",
    id: "r",
    field: "onset",
    operator,
    value,
    value2,
});
const group = (
    children: FilterNode[],
    combinator: "and" | "or" = "and",
    not = false,
): FilterGroup => ({
    type: "group",
    id: "g",
    combinator,
    ...(not ? { not: true } : {}),
    children,
});
const matches = (g: FilterGroup, onset: unknown, field = PARTIAL) =>
    toPredicate(g, [field])({ onset });

// Every day a partial date may stand for.
function daysOf(partial: string): string[] {
    if (partial.length === 10) return [partial];
    const year = Number(partial.slice(0, 4));
    const months =
        partial.length === 7
            ? [Number(partial.slice(5, 7))]
            : [...Array(12).keys()].map((m) => m + 1);
    const days: string[] = [];
    for (const month of months) {
        const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
        for (let d = 1; d <= last; d++)
            days.push(
                `${partial.slice(0, 4)}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
            );
    }
    return days;
}

// Dates near the edges that matter: year and month boundaries, a leap day.
const fullDate = fc
    .record({
        year: fc.constantFrom(2018, 2019, 2020),
        month: fc.integer({ min: 1, max: 12 }),
        day: fc.integer({ min: 1, max: 31 }),
    })
    .map(({ year, month, day }) => {
        const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
        return `${year}-${String(month).padStart(2, "0")}-${String(Math.min(day, last)).padStart(2, "0")}`;
    });
const partialDate = fc.oneof(
    fullDate,
    fullDate.map((d) => d.slice(0, 7)),
    fullDate.map((d) => d.slice(0, 4)),
);
const comparison: fc.Arbitrary<FilterRule> = fc
    .record({ op: fc.constantFrom(...COMPARISONS), a: fullDate, b: fullDate })
    .map(({ op, a, b }) => {
        const [low, high] = a <= b ? [a, b] : [b, a];
        return rule(op, low, op === "between" || op === "not-between" ? high : undefined);
    });
const tree: fc.Arbitrary<FilterGroup> = fc.letrec<{ node: FilterNode; group: FilterGroup }>(
    (tie) => ({
        node: fc.oneof({ depthSize: "small", withCrossShrink: true }, comparison, tie("group")),
        group: fc
            .record({
                children: fc.array(tie("node"), { minLength: 1, maxLength: 3 }),
                combinator: fc.constantFrom("and" as const, "or" as const),
                not: fc.boolean(),
            })
            .map(({ children, combinator, not }) => group(children, combinator, not)),
    }),
).group;

describe("partial-date field type", () => {
    test("offers the date comparisons and takes full dates as rule values", () => {
        expect(operatorsFor(PARTIAL)).toEqual(operatorsFor(FULL));
        expect(ruleIssue(rule("lt", "2019-06-01"), [PARTIAL])).toBeUndefined();
        expect(ruleIssue(rule("lt", "2019-06"), [PARTIAL])).toBe("invalid-value");
    });
    test("isPartialDate accepts a year, a month or a day, and nothing else", () => {
        for (const ok of ["2019", "2019-03", "2019-03-14", "2020-02-29"])
            expect(isPartialDate(ok)).toBe(true);
        for (const bad of ["19", "2019-13", "2019-3", "2019-02-30", "20190314", "", null, 2019])
            expect(isPartialDate(bad)).toBe(false);
    });
});

describe("the predicate: certain, or no match", () => {
    test("HC-Q1: a year that may or may not be before the date matches neither the rule nor its negation", () => {
        expect(matches(group([rule("lt", "2019-06-01")]), "2019")).toBe(false);
        expect(matches(group([rule("lt", "2019-06-01")], "and", true), "2019")).toBe(false);
        expect(matches(group([rule("gte", "2019-06-01")]), "2019")).toBe(false);
    });
    test("what the precision does decide is answered", () => {
        expect(matches(group([rule("lt", "2019-06-01")]), "2019-05")).toBe(true);
        expect(matches(group([rule("lt", "2019-06-01")]), "2018")).toBe(true);
        expect(matches(group([rule("gte", "2019-01-01")]), "2019")).toBe(true); // every day of 2019 is on or after 1 January
        expect(matches(group([rule("lte", "2019-12-31")]), "2019")).toBe(true);
        expect(matches(group([rule("gt", "2019-12-31")]), "2019")).toBe(false);
        expect(matches(group([rule("between", "2019-01-01", "2019-12-31")]), "2019-07")).toBe(true);
        expect(matches(group([rule("not-between", "2019-01-01", "2019-12-31")]), "2020")).toBe(
            true,
        );
    });
    test("a partial date never equals a date, and is not unequal to one inside it", () => {
        expect(matches(group([rule("equals", "2019-03-14")]), "2019-03")).toBe(false);
        expect(matches(group([rule("not-equals", "2019-03-14")]), "2019-03")).toBe(false);
        expect(matches(group([rule("not-equals", "2019-03-14")]), "2019-04")).toBe(true);
    });
    test("a blank row is false for a comparison and true for its negation, as for a date field", () => {
        for (const blank of [null, undefined, ""]) {
            expect(matches(group([rule("lt", "2019-06-01")]), blank)).toBe(false);
            expect(matches(group([rule("not-equals", "2019-06-01")]), blank)).toBe(true);
        }
    });
    test("a value that is not a partial date matches nothing, not even a negation", () => {
        expect(matches(group([rule("lt", "2019-06-01")]), "19")).toBe(false);
        expect(matches(group([rule("not-equals", "2019-06-01")]), "19")).toBe(false);
    });
    test("Kleene logic: or is true when one side is, and is false when one side is", () => {
        const unknown = rule("lt", "2019-06-01");
        expect(matches(group([unknown, rule("lt", "2020-01-01")], "or"), "2019")).toBe(true);
        expect(matches(group([unknown, rule("gt", "2020-01-01")], "and", true), "2019")).toBe(true);
    });

    test("HC-Q2: soundness: a match means every day the row may stand for matches the ordinary date filter", () => {
        fc.assert(
            fc.property(tree, partialDate, (g, onset) => {
                if (!matches(g, onset)) return true;
                return daysOf(onset).every((day) => matches(g, day, FULL));
            }),
            { numRuns: 400 },
        );
    });
    test("and the same for a non-match being certain: a full date behaves exactly as a date field", () => {
        fc.assert(
            fc.property(
                tree,
                fullDate,
                (g, onset) => matches(g, onset) === matches(g, onset, FULL),
            ),
            { numRuns: 400 },
        );
    });
});

describe("SQL, run in SQLite, agrees with the predicate", () => {
    const db = new DatabaseSync(":memory:");
    db.exec("CREATE TABLE t (id INTEGER PRIMARY KEY, onset TEXT)");
    const rows = [
        "2018",
        "2019",
        "2019-05",
        "2019-06",
        "2019-06-01",
        "2019-12",
        "2019-12-31",
        "2020",
        null,
        "",
        "19",
    ];
    const insert = db.prepare("INSERT INTO t (onset) VALUES (?)");
    for (const onset of rows) insert.run(onset);
    const all = db.prepare("SELECT id, onset FROM t ORDER BY id").all() as {
        id: number;
        onset: string | null;
    }[];

    test.each(["sqlite", "ansi"] as const)("parameters and inline literals (%s)", (dialect) => {
        fc.assert(
            fc.property(tree, fc.boolean(), (g, inline) => {
                const { sql, params } = toSql(g, [PARTIAL], { dialect, inline });
                const found = (
                    db
                        .prepare(`SELECT id FROM t WHERE ${sql} ORDER BY id`)
                        .all(...(params as string[])) as {
                        id: number;
                    }[]
                ).map((r) => r.id);
                const expected = all.filter((r) => matches(g, r.onset)).map((r) => r.id);
                expect(found).toEqual(expected);
            }),
            { numRuns: 200 },
        );
    });
    test("a filter without a partial-date comparison is written exactly as before", () => {
        expect(toSql(group([rule("is-empty")]), [PARTIAL]).sql).toBe(
            `("onset" IS NULL OR "onset" = '')`,
        );
        const date = group([rule("lt", "2019-06-01")], "and", true);
        expect(toSql(date, [FULL]).sql).toBe(`NOT ("onset" < ?)`);
    });
    test("PostgreSQL numbers only the parameters it writes", () => {
        const { sql, params } = toSql(
            group([rule("between", "2019-01-01", "2019-12-31")], "and", true),
            [PARTIAL],
            {
                dialect: "postgres",
            },
        );
        const placeholders = sql.match(/\$\d+/g) ?? [];
        expect(placeholders.length).toBe(params.length);
        expect(placeholders).toEqual(params.map((_, i) => `$${i + 1}`));
    });
});

// The subset of MongoDB's query language toMongo writes, enough to check its meaning against the predicate.
function mongoMatches(query: Record<string, unknown>, doc: Record<string, unknown>): boolean {
    return Object.entries(query).every(([key, cond]) => {
        if (key === "$and")
            return (cond as Record<string, unknown>[]).every((q) => mongoMatches(q, doc));
        if (key === "$or")
            return (cond as Record<string, unknown>[]).some((q) => mongoMatches(q, doc));
        if (key === "$nor")
            return !(cond as Record<string, unknown>[]).some((q) => mongoMatches(q, doc));
        if (key === "$expr") return cond === true;
        const value = doc[key];
        if (cond === null) return value === null || value === undefined;
        if (typeof cond !== "object") return value === cond;
        return Object.entries(cond as Record<string, unknown>).every(([op, arg]) => {
            const s = typeof value === "string" ? value : null;
            switch (op) {
                case "$regex":
                    return s !== null && new RegExp(arg as string).test(s);
                case "$lt":
                    return s !== null && s < (arg as string);
                case "$lte":
                    return s !== null && s <= (arg as string);
                case "$gt":
                    return s !== null && s > (arg as string);
                case "$gte":
                    return s !== null && s >= (arg as string);
                case "$ne":
                    return value !== arg;
                default:
                    throw new Error(`mongoMatches: ${op} not modelled`);
            }
        });
    });
}

describe("MongoDB agrees with the predicate", () => {
    const rows = ["2018", "2019", "2019-05", "2019-06-01", "2019-12-31", "2020", null, "", "19"];
    test("on random trees", () => {
        fc.assert(
            fc.property(tree, (g) => {
                const query = toMongo(g, [PARTIAL]);
                for (const onset of rows)
                    expect(mongoMatches(query, { onset })).toBe(matches(g, onset));
            }),
            { numRuns: 300 },
        );
    });
});

describe("OData", () => {
    test("writes the length and the cut date, and swaps the rails under not", () => {
        expect(toOData(group([rule("lt", "2019-06-01")]), [PARTIAL])).toBe(
            "((length(onset) eq 4 and onset lt '2019') or (length(onset) eq 7 and onset lt '2019-06') or (length(onset) eq 10 and onset lt '2019-06-01'))",
        );
        expect(toOData(group([rule("lt", "2019-06-01")], "and", true), [PARTIAL])).toBe(
            "((onset eq null or onset eq '') or (length(onset) eq 4 and onset gt '2019') or (length(onset) eq 7 and onset ge '2019-06') or (length(onset) eq 10 and onset ge '2019-06-01'))",
        );
    });
    test("a filter without a partial-date comparison is unchanged", () => {
        expect(toOData(group([rule("lt", "2019-06-01")]), [FULL])).toBe("onset lt 2019-06-01");
    });
});
