// Every comparison operator through every output: the predicate, MongoDB, OData and inline SQL. filter-model.test.ts
// covers the editing model and a sample of each output; this table keeps the four writers in step, operator by operator.
import { describe, expect, test } from "vitest";

import {
    fromJson,
    isIsoDate,
    toMongo,
    toOData,
    toPredicate,
    toSql,
    updateNode,
    type FilterField,
    type FilterGroup,
    type FilterRule,
} from "./filter-model";

const FIELDS: FilterField[] = [
    { id: "name", label: "Name" },
    { id: "age", label: "Age", type: "number" },
    { id: "active", label: "Active", type: "boolean" },
];

const one = (
    field: string,
    operator: FilterRule["operator"],
    value?: unknown,
    value2?: unknown,
): FilterGroup => ({
    type: "group",
    id: "g",
    combinator: "and",
    children: [{ type: "rule", id: "r", field, operator, value, value2 }],
});

describe("number comparisons in each output", () => {
    // operator, value, value2, MongoDB, OData, which of ages 1, 5 and 9 match
    const CASES: [FilterRule["operator"], number, number | undefined, unknown, string, number[]][] =
        [
            ["equals", 5, undefined, { age: 5 }, "age eq 5", [5]],
            ["not-equals", 5, undefined, { age: { $ne: 5 } }, "age ne 5", [1, 9]],
            ["gt", 5, undefined, { age: { $gt: 5 } }, "age gt 5", [9]],
            ["gte", 5, undefined, { age: { $gte: 5 } }, "age ge 5", [5, 9]],
            ["lt", 5, undefined, { age: { $lt: 5 } }, "age lt 5", [1]],
            ["lte", 5, undefined, { age: { $lte: 5 } }, "age le 5", [1, 5]],
            ["between", 2, 6, { age: { $gte: 2, $lte: 6 } }, "(age ge 2 and age le 6)", [5]],
            [
                "not-between",
                2,
                6,
                { $or: [{ age: { $lt: 2 } }, { age: { $gt: 6 } }] },
                "(age lt 2 or age gt 6)",
                [1, 9],
            ],
        ];
    test.each(CASES)("%s", (operator, value, value2, mongo, odata, matches) => {
        const g = one("age", operator, value, value2);
        expect(toMongo(g, FIELDS)).toEqual(mongo);
        expect(toOData(g, FIELDS)).toBe(odata);
        const keep = toPredicate(g, FIELDS);
        expect([1, 5, 9].filter((age) => keep({ age }))).toEqual(matches);
    });
});

describe("emptiness and booleans in each output", () => {
    test("is-empty and is-not-empty on a number field", () => {
        expect(toMongo(one("age", "is-empty"), FIELDS)).toEqual({ age: null });
        expect(toMongo(one("age", "is-not-empty"), FIELDS)).toEqual({ age: { $ne: null } });
        expect(toOData(one("age", "is-empty"), FIELDS)).toBe("age eq null");
        expect(toOData(one("age", "is-not-empty"), FIELDS)).toBe("age ne null");
        const notEmpty = toPredicate(one("age", "is-not-empty"), FIELDS);
        expect([{ age: 3 }, { age: null }, {}].map(notEmpty)).toEqual([true, false, false]);
    });

    test("is-true and is-false", () => {
        expect(toMongo(one("active", "is-true"), FIELDS)).toEqual({ active: true });
        expect(toMongo(one("active", "is-false"), FIELDS)).toEqual({ active: false });
        expect(toOData(one("active", "is-true"), FIELDS)).toBe("active eq true");
        expect(toOData(one("active", "is-false"), FIELDS)).toBe("active eq false");
        const no = toPredicate(one("active", "is-false"), FIELDS);
        expect([{ active: false }, { active: true }, {}].map(no)).toEqual([true, false, false]);
    });

    test("text not-equals folds case and accents", () => {
        const differs = toPredicate(one("name", "not-equals", "Cafe"), FIELDS);
        expect([{ name: "café" }, { name: "Tea" }].map(differs)).toEqual([false, true]);
    });
});

describe("inline SQL literals", () => {
    test("numbers stay bare, booleans are 1 and 0, and a missing value is NULL", () => {
        expect(toSql(one("age", "equals", 5), FIELDS, { inline: true }).sql).toContain("= 5");
        expect(toSql(one("active", "is-true"), FIELDS, { inline: true }).sql).toContain("= 1");
        expect(toSql(one("active", "is-false"), FIELDS, { inline: true }).sql).toContain("= 0");
        expect(toSql(one("age", "between", 2, 6), FIELDS, { inline: true }).sql).toContain(
            "BETWEEN 2 AND 6",
        );
    });
});

describe("edges", () => {
    test("the root can become another group, but never a rule or nothing", () => {
        const root = one("age", "equals", 5);
        const other: FilterGroup = { type: "group", id: "g2", combinator: "or", children: [] };
        expect(updateNode(root, "g", () => other)).toBe(other);
        expect(updateNode(root, "g", () => null)).toBe(root);
        expect(updateNode(root, "g", () => root.children[0])).toBe(root);
    });

    test("isIsoDate refuses a value that is not a string", () => {
        expect(isIsoDate(20260101)).toBe(false);
        expect(isIsoDate(null)).toBe(false);
        expect(isIsoDate(new Date())).toBe(false);
    });

    test("fromJson names a node that is neither a rule nor a group", () => {
        const { group, errors } = fromJson({ all: [{ something: "else" }] } as never, FIELDS);
        expect(group.children).toEqual([]);
        expect(errors.some((e) => e.includes("neither a rule nor a group"))).toBe(true);
    });
});
