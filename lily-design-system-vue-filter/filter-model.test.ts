import { describe, expect, test } from "vitest";
import {
    FilterError, addNode, changeField, changeOperator, createGroup, createRule, formatFilter, fromJson, isIsoDate, normalise, operatorsFor, removeNode, ruleIssue, rulesOf,
    toJson, toMongo, toOData, toPredicate, toSql, updateNode, valueArity,
    type FilterField, type FilterGroup, type FilterRule,
} from "./filter-model";

const FIELDS: FilterField[] = [
    { id: "name", label: "Name" },
    { id: "age", label: "Age", type: "number" },
    { id: "joined", label: "Joined", type: "date", column: "joined_on" },
    { id: "team", label: "Team", type: "select", options: [{ id: "red", label: "Red" }, { id: "blue", label: "Blue" }] },
    { id: "active", label: "Active", type: "boolean" },
];

const rule = (field: string, operator: FilterRule["operator"], value?: unknown, value2?: unknown): FilterRule => ({ type: "rule", id: `r-${field}-${operator}`, field, operator, value, value2 });
const group = (combinator: "and" | "or", ...children: FilterGroup["children"]): FilterGroup => ({ type: "group", id: `g-${combinator}-${children.length}`, combinator, children });

describe("operators", () => {
    test("each type offers its own, in order, and a field can restrict them", () => {
        expect(operatorsFor(FIELDS[0])[0]).toBe("contains");
        expect(operatorsFor(FIELDS[1])).toContain("between");
        expect(operatorsFor(FIELDS[3])).toContain("in");
        expect(operatorsFor(FIELDS[4])).toEqual(["is-true", "is-false", "is-empty", "is-not-empty"]);
        expect(operatorsFor({ ...FIELDS[1], operators: ["gte", "lte"] })).toEqual(["gte", "lte"]);
        expect(operatorsFor(undefined)[0]).toBe("contains");
    });
    test("arity", () => {
        expect(valueArity("is-empty")).toBe(0);
        expect(valueArity("contains")).toBe(1);
        expect(valueArity("between")).toBe(2);
        expect(valueArity("in")).toBe("many");
    });
});

describe("building and editing", () => {
    test("createRule starts on the first field with its first operator", () => {
        const r = createRule(FIELDS);
        expect(r).toMatchObject({ type: "rule", field: "name", operator: "contains" });
        expect(createRule(FIELDS, "age")).toMatchObject({ field: "age", operator: "equals" });
        expect(createRule(FIELDS, "nope").field).toBe("name");
    });
    test("addNode / updateNode / removeNode are immutable and share what did not change", () => {
        const a = rule("name", "contains", "x");
        const inner = group("or", a);
        const root = group("and", inner);
        const b = rule("age", "gt", 3);
        const added = addNode(root, inner.id, b);
        expect(rulesOf(added)).toHaveLength(2);
        expect(rulesOf(root)).toHaveLength(1);
        const renamed = updateNode(root, a.id, (n) => ({ ...n, id: a.id, ...(n.type === "rule" ? { value: "y" } : {}) }) as FilterRule);
        expect((rulesOf(renamed)[0] as FilterRule).value).toBe("y");
        expect(removeNode(added, b.id)).toEqual(root);
        expect(removeNode(root, "missing")).toBe(root);
    });
    test("changeField resets values and keeps an operator the new field also offers", () => {
        const r = changeField(rule("name", "equals", "x"), FIELDS, "age");
        expect(r).toMatchObject({ field: "age", operator: "equals", value: undefined });
        expect(changeField(rule("name", "contains", "x"), FIELDS, "age").operator).toBe("equals");
    });
    test("changeOperator drops values the new arity does not need", () => {
        expect(changeOperator(rule("age", "between", 1, 9), "gt")).toMatchObject({ operator: "gt", value: 1, value2: undefined });
        expect(changeOperator(rule("age", "gt", 1), "is-empty")).toMatchObject({ value: undefined });
        expect(changeOperator(rule("team", "in", ["red"]), "equals").value).toBeUndefined();
        expect(changeOperator(rule("team", "in", ["red"]), "not-in").value).toEqual(["red"]);
    });
});

describe("validation", () => {
    test("dates", () => {
        expect(isIsoDate("2026-02-28")).toBe(true);
        expect(isIsoDate("2026-02-31")).toBe(false);
        expect(isIsoDate("26-02-28")).toBe(false);
    });
    test("issues", () => {
        expect(ruleIssue(rule("nope", "equals", 1), FIELDS)).toBe("unknown-field");
        expect(ruleIssue(rule("name", "gt", "a"), FIELDS)).toBe("unknown-operator");
        expect(ruleIssue(rule("name", "contains"), FIELDS)).toBe("missing-value");
        expect(ruleIssue(rule("name", "contains", ""), FIELDS)).toBe("missing-value");
        expect(ruleIssue(rule("age", "gt", "x"), FIELDS)).toBe("invalid-value");
        expect(ruleIssue(rule("age", "gt", Number.NaN), FIELDS)).toBe("invalid-value");
        expect(ruleIssue(rule("joined", "gt", "tomorrow"), FIELDS)).toBe("invalid-value");
        expect(ruleIssue(rule("team", "equals", "green"), FIELDS)).toBe("unknown-option");
        expect(ruleIssue(rule("age", "between", 5, 1), FIELDS)).toBe("range-order");
        expect(ruleIssue(rule("age", "between", 1), FIELDS)).toBe("missing-value");
        expect(ruleIssue(rule("team", "in", []), FIELDS)).toBe("missing-value");
        expect(ruleIssue(rule("team", "in", ["red", "green"]), FIELDS)).toBe("unknown-option");
    });
    test("complete rules have none", () => {
        expect(ruleIssue(rule("name", "contains", "a"), FIELDS)).toBeUndefined();
        expect(ruleIssue(rule("age", "between", 1, 5), FIELDS)).toBeUndefined();
        expect(ruleIssue(rule("joined", "between", "2026-01-01", "2026-12-31"), FIELDS)).toBeUndefined();
        expect(ruleIssue(rule("team", "in", ["red", "blue"]), FIELDS)).toBeUndefined();
        expect(ruleIssue(rule("active", "is-true"), FIELDS)).toBeUndefined();
        expect(ruleIssue(rule("name", "is-empty"), FIELDS)).toBeUndefined();
    });
    test("normalise drops incomplete rules and groups left empty", () => {
        const g = group("and", rule("name", "contains", "a"), rule("age", "gt"), group("or", rule("age", "lt")));
        expect(rulesOf(normalise(g, FIELDS)!)).toHaveLength(1);
        expect(normalise(group("and", rule("age", "gt")), FIELDS)).toBeNull();
        expect(normalise(group("and"), FIELDS)).toBeNull();
    });
});

describe("predicate", () => {
    const rows = [
        { name: "Zoë Müller", age: 30, joined: "2026-03-01", team: "red", active: true },
        { name: "Bob", age: 41, joined: "2025-12-31", team: "blue", active: false },
        { name: "Cara", age: null, joined: "", team: "red", active: true },
    ];
    const run = (g: FilterGroup) => rows.filter(toPredicate(g, FIELDS)).map((r) => r.name);

    test("an empty or all-incomplete filter passes everything", () => {
        expect(run(group("and"))).toHaveLength(3);
        expect(run(group("and", rule("age", "gt")))).toHaveLength(3);
    });
    test("text: case- and diacritic-blind", () => {
        expect(run(group("and", rule("name", "contains", "MULLER")))).toEqual(["Zoë Müller"]);
        expect(run(group("and", rule("name", "starts-with", "zo")))).toEqual(["Zoë Müller"]);
        expect(run(group("and", rule("name", "ends-with", "OB")))).toEqual(["Bob"]);
        expect(run(group("and", rule("name", "not-contains", "o")))).toEqual(["Cara"]);
        expect(run(group("and", rule("name", "equals", "bob")))).toEqual(["Bob"]);
    });
    test("numbers: upper and lower limits and ranges, and a missing value is not a match", () => {
        expect(run(group("and", rule("age", "gte", 30)))).toEqual(["Zoë Müller", "Bob"]);
        expect(run(group("and", rule("age", "lte", 30)))).toEqual(["Zoë Müller"]);
        expect(run(group("and", rule("age", "between", 31, 50)))).toEqual(["Bob"]);
        expect(run(group("and", rule("age", "not-between", 31, 50)))).toEqual(["Zoë Müller", "Cara"]);
        expect(run(group("and", rule("age", "is-empty")))).toEqual(["Cara"]);
    });
    test("dates compare as ISO text", () => {
        expect(run(group("and", rule("joined", "between", "2026-01-01", "2026-12-31")))).toEqual(["Zoë Müller"]);
        expect(run(group("and", rule("joined", "lt", "2026-01-01")))).toEqual(["Bob"]);
    });
    test("choices and booleans", () => {
        expect(run(group("and", rule("team", "in", ["blue"])))).toEqual(["Bob"]);
        expect(run(group("and", rule("team", "in", ["blue", "green"])))).toHaveLength(3); // an unknown option makes the rule incomplete, so it is not applied
        expect(run(group("and", rule("team", "not-in", ["blue"])))).toEqual(["Zoë Müller", "Cara"]);
        expect(run(group("and", rule("active", "is-false")))).toEqual(["Bob"]);
        expect(run(group("and", rule("active", "is-true")))).toEqual(["Zoë Müller", "Cara"]);
    });
    test("and, or, nested groups and not", () => {
        expect(run(group("and", rule("team", "equals", "red"), rule("age", "gt", 20)))).toEqual(["Zoë Müller"]);
        expect(run(group("or", rule("name", "equals", "bob"), rule("name", "equals", "cara")))).toEqual(["Bob", "Cara"]);
        expect(run(group("and", rule("team", "equals", "red"), group("or", rule("age", "gt", 100), rule("name", "contains", "z"))))).toEqual(["Zoë Müller"]);
        expect({ ...group("and", rule("team", "equals", "red")), not: true }).toBeTruthy();
        expect(run({ ...group("and", rule("team", "equals", "red")), not: true })).toEqual(["Bob"]);
    });
});

describe("JSON", () => {
    const g = group("and", rule("name", "contains", "a"), { ...group("or", rule("age", "between", 1, 9), rule("active", "is-true")), not: true });
    test("writes plain id-free JSON and leaves incomplete rules out", () => {
        const withJunk = group("and", ...g.children, rule("age", "gt"));
        expect(toJson(withJunk, FIELDS)).toEqual({
            combinator: "and",
            rules: [
                { field: "name", operator: "contains", value: "a" },
                { combinator: "or", not: true, rules: [{ field: "age", operator: "between", value: 1, value2: 9 }, { field: "active", operator: "is-true" }] },
            ],
        });
        expect(toJson(group("and"), FIELDS)).toBeNull();
    });
    test("round-trips through fromJson with fresh ids", () => {
        const json = toJson(g, FIELDS);
        const back = fromJson(json, FIELDS);
        expect(back.errors).toEqual([]);
        expect(toJson(back.group, FIELDS)).toEqual(json);
        expect(back.group.id).not.toBe(g.id);
    });
    test("fromJson reports what it cannot read instead of guessing", () => {
        const bad = fromJson({ combinator: "and", rules: [{ field: "nope", operator: "equals", value: 1 }, { field: "age", operator: "gt", value: "x" }, 5, { combinator: "xor", rules: [] }, { field: "name", operator: "contains", value: "ok" }] }, FIELDS);
        expect(bad.errors).toEqual([
            "$.rules[0]: unknown-field",
            "$.rules[1]: invalid-value",
            "$.rules[2]: not an object",
            "$.rules[3]: unknown combinator",
        ]);
        expect(rulesOf(bad.group)).toHaveLength(1);
        expect(fromJson("x", FIELDS).group.children).toEqual([]);
        expect(fromJson({ field: "name", operator: "contains", value: "a" }, FIELDS).group.children).toHaveLength(1);
    });
});

describe("SQL", () => {
    test("parameterises every value, ansi by default", () => {
        const g = group("and", rule("name", "contains", "o'brien"), rule("age", "between", 18, 65));
        expect(toSql(g, FIELDS)).toEqual({
            sql: `LOWER("name") LIKE LOWER(?) ESCAPE '\\' AND "age" BETWEEN ? AND ?`,
            params: ["%o'brien%", 18, 65],
        });
    });
    test("an empty filter is an empty condition", () => {
        expect(toSql(group("and"), FIELDS)).toEqual({ sql: "", params: [] });
    });
    test("dialects: quoting, placeholders, case-insensitive match, booleans", () => {
        const g = group("and", rule("name", "starts-with", "a"), rule("active", "is-true"));
        expect(toSql(g, FIELDS, { dialect: "postgres" })).toEqual({ sql: `"name" ILIKE $1 ESCAPE '\\' AND "active" = $2`, params: ["a%", true] });
        expect(toSql(g, FIELDS, { dialect: "mysql" })).toEqual({ sql: "LOWER(`name`) LIKE LOWER(?) ESCAPE '\\\\' AND `active` = ?", params: ["a%", true] });
        expect(toSql(g, FIELDS, { dialect: "mssql" })).toEqual({ sql: `LOWER([name]) LIKE LOWER(@p1) ESCAPE '\\' AND [active] = @p2`, params: ["a%", 1] });
        expect(toSql(g, FIELDS, { dialect: "sqlite" }).params).toEqual(["a%", 1]);
    });
    test("LIKE wildcards in the value are escaped", () => {
        expect(toSql(group("and", rule("name", "contains", "50%_off\\")), FIELDS).params).toEqual(["%50\\%\\_off\\\\%"]);
    });
    test("operators", () => {
        const sql = (r: FilterRule) => toSql(group("and", r), FIELDS).sql;
        expect(sql(rule("age", "gte", 5))).toBe('"age" >= ?');
        expect(sql(rule("age", "lte", 5))).toBe('"age" <= ?');
        expect(sql(rule("age", "gt", 5))).toBe('"age" > ?');
        expect(sql(rule("age", "lt", 5))).toBe('"age" < ?');
        expect(sql(rule("age", "equals", 5))).toBe('"age" = ?');
        expect(sql(rule("age", "not-equals", 5))).toBe('"age" <> ?');
        expect(sql(rule("age", "not-between", 1, 5))).toBe('"age" NOT BETWEEN ? AND ?');
        expect(sql(rule("name", "equals", "x"))).toBe('LOWER("name") = LOWER(?)');
        expect(sql(rule("name", "not-equals", "x"))).toBe('LOWER("name") <> LOWER(?)');
        expect(sql(rule("name", "ends-with", "x"))).toBe(`LOWER("name") LIKE LOWER(?) ESCAPE '\\'`);
        expect(sql(rule("name", "not-contains", "x"))).toBe(`LOWER("name") NOT LIKE LOWER(?) ESCAPE '\\'`);
        expect(sql(rule("team", "in", ["red", "blue"]))).toBe('"team" IN (?, ?)');
        expect(sql(rule("team", "not-in", ["red"]))).toBe('"team" NOT IN (?)');
        expect(sql(rule("name", "is-empty"))).toBe(`("name" IS NULL OR "name" = '')`);
        expect(sql(rule("name", "is-not-empty"))).toBe(`("name" IS NOT NULL AND "name" <> '')`);
        expect(sql(rule("age", "is-empty"))).toBe('"age" IS NULL');
        expect(sql(rule("age", "is-not-empty"))).toBe('"age" IS NOT NULL');
        expect(sql(rule("active", "is-false"))).toBe('"active" = ?');
    });
    test("uses the declared column name", () => {
        expect(toSql(group("and", rule("joined", "gt", "2026-01-01")), FIELDS).sql).toBe('"joined_on" > ?');
    });
    test("nested groups are parenthesised, not negates the group", () => {
        const g = group("and", rule("age", "gt", 1), { ...group("or", rule("name", "contains", "a"), rule("name", "contains", "b")), not: true }, group("or", rule("age", "lt", 9), rule("age", "gt", 20)));
        expect(toSql(g, FIELDS).sql).toBe(`"age" > ? AND NOT (LOWER("name") LIKE LOWER(?) ESCAPE '\\' OR LOWER("name") LIKE LOWER(?) ESCAPE '\\') AND ("age" < ? OR "age" > ?)`);
    });
    test("a column that is not a plain identifier is refused, never quoted around", () => {
        const evil: FilterField[] = [{ id: "x", label: "X", column: 'a"; DROP TABLE users; --' }];
        expect(() => toSql(group("and", rule("x", "contains", "a")), evil)).toThrow(FilterError);
    });
    test("a value is never part of the text unless inline, and inline doubles quotes", () => {
        const g = group("and", rule("name", "equals", "Robert'); DROP TABLE x;--"));
        expect(toSql(g, FIELDS).sql).not.toContain("DROP");
        expect(toSql(g, FIELDS, { inline: true }).sql).toContain("'Robert''); DROP TABLE x;--'");
        expect(toSql(g, FIELDS, { inline: true }).params).toEqual([]);
    });
});

describe("MongoDB", () => {
    test("rules and groups", () => {
        const g = group("and", rule("name", "contains", "a.b"), rule("age", "between", 1, 5), group("or", rule("team", "in", ["red"]), rule("active", "is-false")));
        expect(toMongo(g, FIELDS)).toEqual({
            $and: [
                { name: { $regex: "a\\.b", $options: "i" } },
                { age: { $gte: 1, $lte: 5 } },
                { $or: [{ team: { $in: ["red"] } }, { active: false }] },
            ],
        });
    });
    test("a lone rule is not wrapped, not becomes $nor, empty is {}, columns are honoured", () => {
        expect(toMongo(group("and", rule("age", "gte", 3)), FIELDS)).toEqual({ age: { $gte: 3 } });
        expect(toMongo({ ...group("and", rule("age", "gte", 3)), not: true }, FIELDS)).toEqual({ $nor: [{ age: { $gte: 3 } }] });
        expect(toMongo(group("and"), FIELDS)).toEqual({});
        expect(toMongo(group("and", rule("joined", "lt", "2026-01-01")), FIELDS)).toEqual({ joined_on: { $lt: "2026-01-01" } });
    });
    test("the other operators", () => {
        const m = (r: FilterRule) => toMongo(group("and", r), FIELDS);
        expect(m(rule("name", "starts-with", "a"))).toEqual({ name: { $regex: "^a", $options: "i" } });
        expect(m(rule("name", "ends-with", "a"))).toEqual({ name: { $regex: "a$", $options: "i" } });
        expect(m(rule("name", "not-contains", "a"))).toEqual({ name: { $not: /a/i } });
        expect(m(rule("name", "is-empty"))).toEqual({ $or: [{ name: null }, { name: "" }] });
        expect(m(rule("age", "is-empty"))).toEqual({ age: null });
        expect(m(rule("age", "not-between", 1, 5))).toEqual({ $or: [{ age: { $lt: 1 } }, { age: { $gt: 5 } }] });
        expect(m(rule("team", "not-in", ["red"]))).toEqual({ team: { $nin: ["red"] } });
        expect(m(rule("age", "not-equals", 5))).toEqual({ age: { $ne: 5 } });
        expect(m(rule("age", "is-not-empty"))).toEqual({ age: { $ne: null } });
    });
});

describe("OData", () => {
    test("rules and groups", () => {
        const g = group("and", rule("name", "contains", "o'b"), rule("age", "between", 1, 5), group("or", rule("team", "in", ["red", "blue"]), rule("joined", "gte", "2026-01-01")));
        expect(toOData(g, FIELDS)).toBe("contains(tolower(name),tolower('o''b')) and (age ge 1 and age le 5) and (team in ('red','blue') or joined_on ge 2026-01-01)");
    });
    test("not, empty, and the other operators", () => {
        expect(toOData({ ...group("and", rule("age", "lt", 3)), not: true }, FIELDS)).toBe("not (age lt 3)");
        expect(toOData(group("and"), FIELDS)).toBe("");
        const o = (r: FilterRule) => toOData(group("and", r), FIELDS);
        expect(o(rule("name", "is-empty"))).toBe("(name eq null or name eq '')");
        expect(o(rule("age", "not-between", 1, 5))).toBe("(age lt 1 or age gt 5)");
        expect(o(rule("team", "not-in", ["red"]))).toBe("not (team in ('red'))");
        expect(o(rule("active", "is-true"))).toBe("active eq true");
        expect(o(rule("name", "starts-with", "a"))).toBe("startswith(tolower(name),tolower('a'))");
        expect(o(rule("name", "ends-with", "a"))).toBe("endswith(tolower(name),tolower('a'))");
        expect(o(rule("name", "not-contains", "a"))).toBe("not contains(tolower(name),tolower('a'))");
        expect(o(rule("age", "not-equals", 5))).toBe("age ne 5");
        expect(o(rule("age", "is-not-empty"))).toBe("age ne null");
    });
});

describe("formatFilter", () => {
    const g = group("and", rule("name", "contains", "a"));
    test("each format", () => {
        expect(formatFilter(g, FIELDS, "json")).toContain('"operator": "contains"');
        expect(formatFilter(g, FIELDS, "sql")).toBe(`LOWER("name") LIKE LOWER('%a%') ESCAPE '\\'`);
        expect(formatFilter(g, FIELDS, "sql", "postgres")).toBe(`"name" ILIKE '%a%' ESCAPE '\\'`);
        expect(formatFilter(g, FIELDS, "mongo")).toContain("$regex");
        expect(formatFilter(g, FIELDS, "odata")).toBe("contains(tolower(name),tolower('a'))");
    });
});

describe("createGroup", () => {
    test("defaults to and", () => {
        expect(createGroup()).toMatchObject({ type: "group", combinator: "and", children: [] });
        expect(createGroup("or").combinator).toBe("or");
    });
});
