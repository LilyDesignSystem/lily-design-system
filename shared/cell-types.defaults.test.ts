// Column-type defaults with no locale, and the edge cases of each type's sort, format and export (tasks.md P38-T12).
// cell-types.test.ts pins the locale-aware paths; this file pins what a grid with no `locale` does, which is plain code-unit
// order and ISO text, never a guessed locale, and the empty and malformed values every type must survive.
import { describe, expect, test } from "vitest";

import { resolveColumn, type TypedColumn } from "./cell-types";

const sortWith = (column: TypedColumn, values: unknown[]) => [...values].sort(column.compare!);

describe("without a locale, each type sorts by code unit and formats as ISO text", () => {
    test("link: by label, then href; equal labels compare 0", () => {
        const c = resolveColumn({ id: "l", type: "link" });
        expect(
            sortWith(c, [
                { href: "https://b.example", label: "b" },
                "https://a.example",
                { href: "https://c.example", label: "a" },
            ]),
        ).toEqual([
            { href: "https://c.example", label: "a" },
            { href: "https://b.example", label: "b" },
            "https://a.example",
        ]);
        expect(c.compare!({ href: "/x", label: "same" }, { href: "/y", label: "same" })).toBe(0);
        expect(c.filterText!(null)).toBe("");
    });

    test("time: shown as stored; malformed text shown as given; empty shown as nothing", () => {
        const c = resolveColumn({ id: "t", type: "time" });
        expect(c.format!("09:30", {})).toBe("09:30");
        expect(c.format!("9.30am", {})).toBe("9.30am");
        expect(c.format!(null, {})).toBe("");
    });

    test("time: with a locale, a time with seconds formats without inventing a date", () => {
        const c = resolveColumn(
            { id: "t", type: "time", timeFormat: { timeStyle: "medium" } },
            "en-GB",
        );
        expect(c.format!("09:30:15", {})).toBe("09:30:15");
    });

    test("time-zone: shown as stored with the zone id; malformed shown as given; exported as text, or null", () => {
        const c = resolveColumn({ id: "z", type: "time-zone" });
        expect(c.format!({ time: "09:30", timeZone: "Europe/London" }, {})).toBe(
            "09:30 Europe/London",
        );
        expect(c.format!("noon", {})).toBe("noon");
        expect(c.format!(undefined, {})).toBe("");
        expect(c.exportValue!({ z: { time: "09:30", timeZone: "Asia/Tokyo" } })).toBe(
            "09:30 Asia/Tokyo",
        );
        expect(c.exportValue!({ z: "noon" })).toBeNull();
    });

    test("time-zone: an unparsable value sorts before every real time rather than throwing", () => {
        const c = resolveColumn({ id: "z", type: "time-zone", referenceDate: "2026-06-01" });
        expect(sortWith(c, [{ time: "00:00", timeZone: "UTC" }, "x"])).toEqual([
            "x",
            { time: "00:00", timeZone: "UTC" },
        ]);
    });

    test("person: by first name, then by how many; email export skips the missing", () => {
        const c = resolveColumn({ id: "p", type: "person", exportAs: "email" });
        const one = [{ id: "1", name: "Ada" }];
        const two = [
            { id: "1", name: "Ada" },
            { id: "2", name: "Bea" },
        ];
        expect(c.compare!(two, one)).toBeGreaterThan(0);
        expect(c.compare!([{ id: "3", name: "Cy" }], one)).toBeGreaterThan(0);
        expect(c.compare!(one, [{ id: "3", name: "Cy" }])).toBeLessThan(0);
        expect(c.compare!([], [])).toBe(0);
        expect(c.exportValue!({ p: [{ id: "1", name: "Ada" }] })).toBeNull();
        expect(c.exportValue!({ p: [{ id: "1", email: "a@example.org" }] })).toBe("a@example.org");
    });

    test("file: by first name, then by count; nothing exports as null", () => {
        const c = resolveColumn({ id: "f", type: "file" });
        const a = [{ id: "1", name: "a.pdf" }];
        const b = [{ id: "2", name: "b.pdf" }];
        expect(c.compare!(b, a)).toBeGreaterThan(0);
        expect(c.compare!(a, b)).toBeLessThan(0);
        expect(c.compare!(a, [...a, ...b])).toBeLessThan(0);
        expect(c.exportValue!({ f: [] })).toBeNull();
    });

    test("select: by label in code-unit order; an unknown id shows as itself; export by id or label, empty as null", () => {
        const options = [
            { id: "b", label: "Beta" },
            { id: "a", label: "Alpha" },
        ];
        const c = resolveColumn({ id: "s", type: "select", options });
        expect(sortWith(c, ["b", "a", "b"])).toEqual(["a", "b", "b"]);
        expect(c.format!("zz", {})).toBe("zz");
        expect(c.format!(null, {})).toBe("");
        expect(c.exportValue!({ s: "a" })).toBe("Alpha");
        expect(c.exportValue!({ s: "" })).toBeNull();
        const byId = resolveColumn({ id: "s", type: "select", options, exportAs: "id" });
        expect(byId.exportValue!({ s: "a" })).toBe("a");
        expect(byId.exportValue!({ s: null })).toBeNull();
    });

    test("radio: in option order, an unknown id last", () => {
        const c = resolveColumn({
            id: "r",
            type: "radio",
            options: [
                { id: "high", label: "High" },
                { id: "low", label: "Low" },
            ],
        });
        expect(sortWith(c, ["low", "other", "high"])).toEqual(["high", "low", "other"]);
    });
});

describe("rollup and formula results with no locale", () => {
    test("a number result shows as plain digits, a non-number as text, an empty one as nothing", () => {
        const c = resolveColumn({
            id: "r",
            type: "rollup",
            resultType: "number",
            reduce: (v) => v[0],
        });
        expect(c.format!(c.accessor!({ r: [1234.5] }), {})).toBe("1234.5");
        expect(c.format!(c.accessor!({ r: ["n/a"] }), {})).toBe("n/a");
        expect(c.format!(c.accessor!({ r: [] }), {})).toBe("");
    });

    test("a date result shows as ISO; a non-date as itself; exports a Date", () => {
        const c = resolveColumn({
            id: "r",
            type: "rollup",
            resultType: "date",
            reduce: (v) => v[0],
        });
        const row = { r: ["2026-11-26"] };
        expect(c.format!(c.accessor!(row), row)).toBe("2026-11-26");
        expect(c.format!("soon", {})).toBe("soon");
        expect(c.format!(null, {})).toBe("");
        expect(c.exportValue!(row)).toEqual(new Date("2026-11-26T00:00:00Z"));
    });

    test("a rollup whose relation is not an array reduces nothing", () => {
        const c = resolveColumn({ id: "r", type: "rollup" });
        expect(c.accessor!({ r: "not a list" })).toBe(0);
        expect(c.align).toBe("start");
    });

    test("a formula engine that throws a non-Error still gives the row a message", () => {
        const c = resolveColumn({
            id: "f",
            type: "formula",
            evaluate: () => {
                throw "no";
            },
        });
        expect(c.errorOf!({ f: "=1" })).toBe("no");
    });

    test("a formula's text result exports as itself, an empty one as null, and a date result as a Date", () => {
        const text = resolveColumn({
            id: "f",
            type: "formula",
            evaluate: (e) => ({ value: e === "" ? null : e }),
        });
        expect(text.exportValue!({ f: "=x" })).toBe("=x");
        expect(text.exportValue!({ f: "" })).toBeNull();
        const date = resolveColumn({
            id: "f",
            type: "formula",
            resultType: "date",
            align: "center",
            evaluate: () => ({ value: "2026-01-02" }),
        });
        expect(date.exportValue!({ f: "=d" })).toEqual(new Date("2026-01-02T00:00:00Z"));
        expect(date.align).toBe("center");
        expect(date.filterText!("2026-01-02", { f: "=d" })).toBe("2026-01-02");
    });
});
