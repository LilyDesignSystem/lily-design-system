// Unit tests for cell-types (tasks.md P38-T12). The data grid's tests reach this module only through the grid; these
// pin each function and each column type's defaults directly, including the safety rules (links), the empty-value rules
// (an empty value is never invalid, an empty aggregate is null) and the "a column's own props always win" rule.
import { describe, expect, test } from "vitest";

import {
    aggregateValues,
    civilDateToDate,
    filesOf,
    isCivilDate,
    isCivilTime,
    isInvalidForType,
    isValidTimeZone,
    isZonedTime,
    linkLabel,
    linkParts,
    peopleOf,
    personName,
    resolveColumn,
    safeHref,
    zonedMinutes,
    zonedUtcTime,
    type TypedColumn,
} from "./cell-types";

describe("safeHref", () => {
    test("allows http, https, mailto, tel and relative addresses", () => {
        for (const href of [
            "https://example.org/a",
            "HTTP://example.org",
            "mailto:a@example.org",
            "tel:+441234",
            "/path",
            "./here",
            "../up",
            "#frag",
            "?q=1",
        ]) {
            expect(safeHref(href)).toBe(href);
        }
    });

    test("refuses script and data schemes, protocol-relative addresses, and hidden control characters", () => {
        for (const href of [
            "javascript:alert(1)",
            "data:text/html,x",
            "//evil.example",
            "java\tscript:x",
            "https://a\u0000b",
            "vbscript:x",
        ]) {
            expect(safeHref(href)).toBeNull();
        }
    });

    test("trims, and refuses empty or non-string values", () => {
        expect(safeHref("  https://example.org  ")).toBe("https://example.org");
        expect(safeHref("   ")).toBeNull();
        expect(safeHref(undefined)).toBeNull();
        expect(safeHref(42)).toBeNull();
    });
});

describe("links", () => {
    test("linkParts reads a string or an object with an href, else null", () => {
        expect(linkParts("https://a.example")).toEqual({ href: "https://a.example" });
        expect(linkParts({ href: "/x", label: "X" })).toEqual({ href: "/x", label: "X" });
        expect(linkParts({ label: "no href" })).toBeNull();
        expect(linkParts("")).toBeNull();
        expect(linkParts(null)).toBeNull();
    });

    test("linkLabel is the label, else the address, else empty", () => {
        expect(linkLabel({ href: "/x", label: "X" })).toBe("X");
        expect(linkLabel("/x")).toBe("/x");
        expect(linkLabel(undefined)).toBe("");
    });
});

describe("civil dates and times", () => {
    test("isCivilDate accepts real calendar dates only", () => {
        expect(isCivilDate("2024-02-29")).toBe(true);
        expect(isCivilDate("2023-02-29")).toBe(false);
        expect(isCivilDate("2026-13-01")).toBe(false);
        expect(isCivilDate("2026-1-1")).toBe(false);
        expect(isCivilDate(20260101)).toBe(false);
    });

    test("isCivilTime accepts 24-hour HH:mm and HH:mm:ss", () => {
        expect(isCivilTime("00:00")).toBe(true);
        expect(isCivilTime("23:59:59")).toBe(true);
        expect(isCivilTime("24:00")).toBe(false);
        expect(isCivilTime("12:60")).toBe(false);
        expect(isCivilTime("12:00:60")).toBe(false);
        expect(isCivilTime("9:00")).toBe(false);
    });

    test("civilDateToDate gives UTC midnight, passes a valid Date through, and refuses the rest", () => {
        expect(civilDateToDate("2026-11-19")!.toISOString()).toBe("2026-11-19T00:00:00.000Z");
        const d = new Date("2026-01-02T03:04:05Z");
        expect(civilDateToDate(d)).toBe(d);
        expect(civilDateToDate(new Date("nope"))).toBeNull();
        expect(civilDateToDate("2026-02-30")).toBeNull();
    });
});

describe("time zones", () => {
    test("isValidTimeZone knows IANA ids and bare offsets", () => {
        expect(isValidTimeZone("Europe/London")).toBe(true);
        expect(isValidTimeZone("+05:30")).toBe(true);
        expect(isValidTimeZone("-0800")).toBe(true);
        expect(isValidTimeZone("Not/AZone")).toBe(false);
        expect(isValidTimeZone("")).toBe(false);
    });

    test("isZonedTime needs a real time and a known zone", () => {
        expect(isZonedTime({ time: "09:30", timeZone: "Asia/Tokyo" })).toBe(true);
        expect(isZonedTime({ time: "25:00", timeZone: "Asia/Tokyo" })).toBe(false);
        expect(isZonedTime({ time: "09:30", timeZone: "Nowhere/City" })).toBe(false);
        expect(isZonedTime("09:30")).toBe(false);
    });

    test("zonedMinutes without a reference date is the stated local time", () => {
        expect(zonedMinutes({ time: "09:30", timeZone: "Asia/Tokyo" })).toBe(570);
        expect(zonedMinutes({ time: "09:30:30", timeZone: "+01:00" })).toBe(570.5);
        expect(zonedMinutes("09:30")).toBeNull();
    });

    test("with a reference date, equal instants in different zones compare equal", () => {
        const london = zonedMinutes({ time: "09:00", timeZone: "Europe/London" }, "2026-01-15");
        const newYork = zonedMinutes({ time: "04:00", timeZone: "America/New_York" }, "2026-01-15");
        expect(london).toBe(newYork);
        const offset = zonedMinutes({ time: "10:00", timeZone: "+01:00" }, "2026-01-15");
        expect(offset).toBe(london);
    });

    test("zonedUtcTime follows daylight saving and wraps past midnight", () => {
        expect(zonedUtcTime({ time: "09:00", timeZone: "Europe/London" }, "2026-01-15")).toBe(
            "09:00",
        );
        expect(zonedUtcTime({ time: "09:00", timeZone: "Europe/London" }, "2026-07-15")).toBe(
            "08:00",
        );
        expect(zonedUtcTime({ time: "01:00", timeZone: "+05:00" }, "2026-01-15")).toBe("20:00");
        expect(zonedUtcTime({ time: "09:00", timeZone: "Europe/London" })).toBeNull();
        expect(zonedUtcTime({ time: "09:00", timeZone: "Europe/London" }, "not-a-date")).toBeNull();
    });
});

describe("people and files", () => {
    test("peopleOf takes one person or many, each with a string id", () => {
        expect(peopleOf({ id: "a" })).toEqual([{ id: "a" }]);
        expect(peopleOf([{ id: "a" }, { name: "no id" }, null, { id: "b" }])).toEqual([
            { id: "a" },
            { id: "b" },
        ]);
        expect(peopleOf("")).toEqual([]);
        expect(peopleOf(undefined)).toEqual([]);
    });

    test("personName is the name, or the id, never blank", () => {
        expect(personName({ id: "u1", name: "Ada" })).toBe("Ada");
        expect(personName({ id: "u1", name: "" })).toBe("u1");
        expect(personName({ id: "u1" })).toBe("u1");
    });

    test("filesOf keeps files with a string id and name", () => {
        expect(filesOf([{ id: "f1", name: "a.pdf" }, { id: "f2" }, "x"])).toEqual([
            { id: "f1", name: "a.pdf" },
        ]);
        expect(filesOf({ id: "f1", name: "a.pdf" })).toEqual([]);
    });
});

describe("aggregateValues", () => {
    const values = [3, 1, "", null, 4, 1, undefined, 5];

    test("count counts every value, empty ones too", () => {
        expect(aggregateValues("count", values)).toBe(8);
        expect(aggregateValues("count", [])).toBe(0);
    });

    test("numeric aggregates ignore empty values, and an empty set is null, not 0", () => {
        expect(aggregateValues("sum", values)).toBe(14);
        expect(aggregateValues("avg", values)).toBe(2.8);
        expect(aggregateValues("median", values)).toBe(3);
        expect(aggregateValues("median", [1, 2, 3, 4])).toBe(2.5);
        expect(aggregateValues("range", values)).toBe(4);
        for (const kind of [
            "sum",
            "avg",
            "median",
            "range",
            "min",
            "max",
            "countUnique",
        ] as const) {
            expect(aggregateValues(kind, [null, ""])).toBeNull();
        }
    });

    test("min and max compare numbers, or strings when the values are not all numbers", () => {
        expect(aggregateValues("min", values)).toBe(1);
        expect(aggregateValues("max", values)).toBe(5);
        expect(aggregateValues("min", ["pear", "apple", 3])).toBe("apple");
        expect(aggregateValues("max", ["pear", "apple"])).toBe("pear");
    });

    test("countUnique compares objects by content", () => {
        expect(aggregateValues("countUnique", [1, 1, "1", { a: 1 }, { a: 1 }, null])).toBe(2);
    });

    test("percentTrue counts booleans only; percentEmpty counts empty values", () => {
        expect(aggregateValues("percentTrue", [true, false, true, true, "x"])).toBe(75);
        expect(aggregateValues("percentTrue", ["x"])).toBeNull();
        expect(aggregateValues("percentEmpty", [1, "", null, 2])).toBe(50);
        expect(aggregateValues("percentEmpty", [])).toBeNull();
    });
});

describe("isInvalidForType", () => {
    const col = (type: TypedColumn["type"], extra: Partial<TypedColumn> = {}): TypedColumn => ({
        id: "c",
        type,
        ...extra,
    });

    test("an empty value is never invalid", () => {
        for (const type of [
            "number",
            "link",
            "date",
            "time",
            "time-zone",
            "select",
            "person",
        ] as const) {
            expect(isInvalidForType(col(type), "")).toBe(false);
            expect(isInvalidForType(col(type), null)).toBe(false);
        }
    });

    test("each type refuses what it cannot hold", () => {
        expect(isInvalidForType(col("number"), "3")).toBe(true);
        expect(isInvalidForType(col("number"), Infinity)).toBe(true);
        expect(isInvalidForType(col("number"), 3)).toBe(false);
        expect(isInvalidForType(col("link"), "javascript:alert(1)")).toBe(true);
        expect(isInvalidForType(col("link"), { href: "https://example.org" })).toBe(false);
        expect(isInvalidForType(col("date"), "2026-02-30")).toBe(true);
        expect(isInvalidForType(col("time"), "7pm")).toBe(true);
        expect(isInvalidForType(col("time-zone"), { time: "09:00", timeZone: "Nowhere" })).toBe(
            true,
        );
        expect(isInvalidForType(col("select", { options: [{ id: "a", label: "A" }] }), "b")).toBe(
            true,
        );
        expect(isInvalidForType(col("radio", { options: [{ id: "a", label: "A" }] }), "a")).toBe(
            false,
        );
        expect(isInvalidForType(col("person"), { name: "no id" })).toBe(true);
        expect(isInvalidForType(col("text"), { anything: true })).toBe(false);
    });
});

describe("resolveColumn", () => {
    test("a column with no type is returned as is", () => {
        const column = { id: "c" };
        expect(resolveColumn(column)).toBe(column);
    });

    test("a column's own props win over its type's defaults, and undefined props do not erase them", () => {
        const format = () => "mine";
        const r = resolveColumn({ id: "n", type: "number", format, align: undefined }, "en-GB");
        expect(r.format).toBe(format);
        expect(r.align).toBe("end");
        expect(r.editor).toBe("number");
    });

    test("number formats with the locale, and shows the raw value with none", () => {
        const withLocale = resolveColumn({ id: "n", type: "number" }, "de-DE");
        expect(withLocale.format!(1234.5, {})).toBe(new Intl.NumberFormat("de-DE").format(1234.5));
        expect(withLocale.format!(NaN, {})).toBe("");
        expect(resolveColumn({ id: "n", type: "number" }).format).toBeUndefined();
    });

    test("date formats in UTC with a locale, as stored without one, and exports a real Date", () => {
        const withLocale = resolveColumn({ id: "d", type: "date", locale: "en-GB" });
        expect(withLocale.format!("2026-11-19", {})).toBe(
            new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" }).format(
                new Date("2026-11-19T00:00:00Z"),
            ),
        );
        const plain = resolveColumn({ id: "d", type: "date" });
        expect(plain.format!("2026-11-19", {})).toBe("2026-11-19");
        expect(plain.format!("not a date", {})).toBe("not a date");
        expect(plain.exportValue!({ d: "2026-11-19" })).toEqual(new Date("2026-11-19T00:00:00Z"));
    });

    test("time shows as stored without a locale", () => {
        const r = resolveColumn({ id: "t", type: "time" });
        expect(r.format!("09:30", {})).toBe("09:30");
        expect(r.format!("", {})).toBe("");
    });

    test("time-zone shows the time and the zone, sorts by instant with a reference date, and exports both", () => {
        const r = resolveColumn({ id: "z", type: "time-zone", referenceDate: "2026-01-15" });
        const london = { time: "09:00", timeZone: "Europe/London" };
        const tokyo = { time: "09:00", timeZone: "Asia/Tokyo" };
        expect(r.format!(london, {})).toBe("09:00 Europe/London");
        expect(r.compare!(tokyo, london)).toBeLessThan(0);
        expect(r.exportValue!({ z: london })).toBe("09:00 Europe/London");
        expect(r.exportValue!({ z: "x" })).toBeNull();
    });

    test("link shows its label, filters on label and address, and keeps the label when the address is edited", () => {
        const r = resolveColumn({ id: "l", type: "link" });
        const value = { href: "https://a.example", label: "A", external: true };
        expect(r.format!(value, {})).toBe("A");
        expect(r.filterText!(value, {})).toBe("A https://a.example");
        expect(r.parse!("  https://b.example ", { l: value })).toEqual({
            ...value,
            href: "https://b.example",
        });
        expect(r.parse!("https://b.example", { l: "https://a.example" })).toBe("https://b.example");
        expect(r.parse!("   ", { l: value })).toBeNull();
        expect(
            r.compare!({ href: "/b", label: "Beta" }, { href: "/a", label: "Alpha" }),
        ).toBeGreaterThan(0);
    });

    test("select shows labels and sorts by label; radio sorts by option order", () => {
        const options = [
            { id: "z", label: "Alpha" },
            { id: "a", label: "Zulu" },
        ];
        const select = resolveColumn({ id: "s", type: "select", options });
        expect(select.format!("a", {})).toBe("Zulu");
        expect(select.format!("missing", {})).toBe("missing");
        expect(select.compare!("z", "a")).toBeLessThan(0);
        expect(select.exportValue!({ s: "a" })).toBe("Zulu");
        expect(
            resolveColumn({ id: "s", type: "select", options, exportAs: "id" }).exportValue!({
                s: "a",
            }),
        ).toBe("a");
        const radio = resolveColumn({ id: "r", type: "radio", options });
        expect(radio.compare!("a", "z")).toBeGreaterThan(0);
        expect(radio.editor).toBe("radio");
    });

    test("person lists names, filters on emails too, and exports names or emails", () => {
        const people = [
            { id: "u1", name: "Ada", email: "ada@example.org" },
            { id: "u2", email: "bo@example.org" },
        ];
        const r = resolveColumn({ id: "p", type: "person" });
        expect(r.format!(people, {})).toBe("Ada; u2");
        expect(r.filterText!(people, {})).toBe("Ada ada@example.org u2 bo@example.org");
        expect(r.exportValue!({ p: people })).toBe("Ada; u2");
        expect(
            resolveColumn({ id: "p", type: "person", exportAs: "email" }).exportValue!({
                p: people,
            }),
        ).toBe("ada@example.org; bo@example.org");
        expect(r.exportValue!({ p: [] })).toBeNull();
    });

    test("file lists file names and exports them", () => {
        const r = resolveColumn({ id: "f", type: "file" });
        const files = [
            { id: "1", name: "b.pdf" },
            { id: "2", name: "a.png" },
        ];
        expect(r.format!(files, {})).toBe("b.pdf; a.png");
        expect(r.exportValue!({ f: files })).toBe("b.pdf; a.png");
        expect(r.exportValue!({ f: [] })).toBeNull();
    });

    test("rollup reduces related values once per row and is not editable", () => {
        let calls = 0;
        const r = resolveColumn({
            id: "total",
            type: "rollup",
            aggregate: "sum",
            resultType: "number",
            relation: (row) => {
                calls++;
                return row.items as unknown[];
            },
        });
        const row = { items: [2, 3, null] };
        expect(r.accessor!(row)).toBe(5);
        expect(r.accessor!(row)).toBe(5);
        expect(calls).toBe(1);
        expect(r.editable).toBe(false);
        expect(r.align).toBe("end");
        expect(r.exportValue!({ items: [] })).toBeNull();
    });

    test("formula: no engine shows the expression as stored; an engine's result is the value; a throw is that row's error", () => {
        const stored = resolveColumn({ id: "f", type: "formula" });
        expect(stored.accessor!({ f: "=1+1" })).toBe("=1+1");
        const engine = resolveColumn({
            id: "f",
            type: "formula",
            resultType: "number",
            evaluate: (expression) => {
                if (expression === "boom") throw new Error("Bad formula");
                return { value: expression.length };
            },
        });
        const ok = { f: "abc" };
        const bad = { f: "boom" };
        expect(engine.accessor!(ok)).toBe(3);
        expect(engine.errorOf!(ok)).toBeUndefined();
        expect(engine.accessor!(bad)).toBeNull();
        expect(engine.errorOf!(bad)).toBe("Bad formula");
        expect(engine.format!(null, bad)).toBe("Bad formula");
        expect(engine.exportValue!(bad)).toBe("Bad formula");
        expect(engine.source!(ok)).toBe("abc");
    });

    describe("formatting with a locale, and the empty and invalid cases", () => {
        test("text sorts with the locale's collation", () => {
            const r = resolveColumn({ id: "t", type: "text" }, "sv-SE");
            expect(r.compare!("ö", "z")).toBe(new Intl.Collator("sv-SE").compare("ö", "z"));
            expect(r.editor).toBe("text");
        });

        test("time formats with the locale; empty and invalid values show as they are", () => {
            const r = resolveColumn({ id: "t", type: "time", locale: "en-US" });
            expect(r.format!("13:05", {})).toBe(
                new Intl.DateTimeFormat("en-US", { timeStyle: "short", timeZone: "UTC" }).format(
                    new Date("1970-01-01T13:05:00Z"),
                ),
            );
            expect(r.format!("7pm", {})).toBe("7pm");
            expect(resolveColumn({ id: "d", type: "date" }).format!("", {})).toBe("");
        });

        test("time-zone names the zone with a locale and reference date; offsets and bad values stay as given", () => {
            const r = resolveColumn({
                id: "z",
                type: "time-zone",
                locale: "en-GB",
                referenceDate: "2026-07-15",
            });
            const summer = r.format!({ time: "09:00", timeZone: "Europe/London" }, {});
            const zoneName = new Intl.DateTimeFormat("en-GB", {
                timeZone: "Europe/London",
                timeZoneName: "short",
            })
                .formatToParts(new Date("2026-07-15T12:00:00Z"))
                .find((p) => p.type === "timeZoneName")!.value;
            expect(summer.endsWith(zoneName)).toBe(true);
            expect(r.format!({ time: "09:00", timeZone: "+02:00" }, {}).endsWith("+02:00")).toBe(
                true,
            );
            expect(r.format!("", {})).toBe("");
            expect(r.format!("not zoned", {})).toBe("not zoned");
        });

        test("person and file columns sort with the locale, then by count", () => {
            const person = resolveColumn({ id: "p", type: "person" }, "en");
            expect(
                person.compare!([{ id: "1", name: "Ann" }], [{ id: "2", name: "Bea" }]),
            ).toBeLessThan(0);
            expect(
                person.compare!(
                    [{ id: "1", name: "Ann" }],
                    [
                        { id: "1", name: "Ann" },
                        { id: "2", name: "Bea" },
                    ],
                ),
            ).toBeLessThan(0);
            const file = resolveColumn({ id: "f", type: "file" }, "en");
            const one = [{ id: "1", name: "a.pdf" }];
            const two = [...one, { id: "2", name: "b.pdf" }];
            expect(file.filterText!(two, {})).toBe("a.pdf b.pdf");
            expect(file.compare!(one, two)).toBeLessThan(0);
            expect(resolveColumn({ id: "f", type: "file" }).compare!(two, one)).toBeGreaterThan(0);
        });

        test("a link column exports its label, read through the accessor when there is one", () => {
            const r = resolveColumn({ id: "l", type: "link", accessor: (row) => row.nested });
            expect(r.exportValue!({ nested: { href: "/x", label: "X" } })).toBe("X");
        });

        test("select exports nothing for an empty value, by id or by label", () => {
            const options = [{ id: "a", label: "A" }];
            expect(
                resolveColumn({ id: "s", type: "select", options }).exportValue!({ s: "" }),
            ).toBeNull();
            expect(
                resolveColumn({ id: "s", type: "select", options, exportAs: "id" }).exportValue!({
                    s: null,
                }),
            ).toBeNull();
        });
    });

    describe("rollup and formula results by type", () => {
        test("a rollup reads its own array through the accessor and formats a number result with the locale", () => {
            const r = resolveColumn(
                {
                    id: "t",
                    type: "rollup",
                    aggregate: "sum",
                    resultType: "number",
                    accessor: (row) => row.values as unknown[],
                },
                "de-DE",
            );
            expect(r.accessor!({ values: [1000, 234.5] })).toBe(1234.5);
            expect(r.format!(1234.5, {})).toBe(new Intl.NumberFormat("de-DE").format(1234.5));
            expect(r.format!(null, {})).toBe("");
            expect(r.format!("n/a", {})).toBe("n/a");
        });

        test("a rollup's default reduction is count, and a custom reduce wins", () => {
            const counted = resolveColumn({ id: "c", type: "rollup" });
            expect(counted.accessor!({ c: [1, 2, 3] })).toBe(3);
            expect(counted.accessor!({ c: "not a list" })).toBe(0);
            const custom = resolveColumn({
                id: "c",
                type: "rollup",
                reduce: (values) => values.join("+"),
            });
            expect(custom.accessor!({ c: [1, 2] })).toBe("1+2");
            expect(custom.format!("1+2", {})).toBe("1+2");
        });

        test("a date result formats as a date and exports as a Date", () => {
            const r = resolveColumn({
                id: "d",
                type: "formula",
                resultType: "date",
                locale: "en-GB",
                evaluate: () => ({ value: "2026-11-19" }),
            });
            const row = { d: "=TODAY()" };
            expect(r.format!(r.accessor!(row), row)).toBe(
                new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" }).format(
                    new Date("2026-11-19T00:00:00Z"),
                ),
            );
            expect(r.exportValue!(row)).toEqual(new Date("2026-11-19T00:00:00Z"));
            expect(r.filterText!(r.accessor!(row), row)).toBe(r.format!(r.accessor!(row), row));
            const plainDate = resolveColumn({
                id: "d",
                type: "rollup",
                resultType: "date",
                reduce: () => "2026-01-02",
            });
            expect(plainDate.format!("2026-01-02", {})).toBe("2026-01-02");
            expect(plainDate.format!("soon", {})).toBe("soon");
            expect(plainDate.format!("", {})).toBe("");
        });

        test("an empty formula is an empty value, never sent to the engine", () => {
            let called = false;
            const r = resolveColumn({
                id: "f",
                type: "formula",
                evaluate: () => {
                    called = true;
                    return { value: 1 };
                },
            });
            expect(r.accessor!({ f: "" })).toBeNull();
            expect(r.exportValue!({ f: "" })).toBeNull();
            expect(called).toBe(false);
        });
    });

    // spec/lessons/openehr-rust item 4: a time cell cannot yet hold a leap second (the native time editor has no second 60),
    // so it is flagged, and shown exactly as written; it is never rounded to 23:59:59 or 00:00.
    test("a leap second in a time cell is shown as written, never changed", () => {
        expect(isCivilTime("23:59:60")).toBe(false);
        const column = resolveColumn({ id: "t", type: "time" } as never) as {
            format: (v: unknown) => string;
        };
        expect(column.format("23:59:60")).toBe("23:59:60");
    });
});
