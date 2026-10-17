import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, test, vi } from "vitest";

import Filter from "./Filter.svelte";
import type { FilterLabels } from "./Filter.svelte";
import { createGroup, createRule, rulesOf, toJson, toPredicate, toSql, type FilterField, type FilterGroup, type FilterRule } from "./filter-model";

const FIELDS: FilterField[] = [
    { id: "name", label: "Name" },
    { id: "age", label: "Age", type: "number" },
    { id: "joined", label: "Joined", type: "date" },
    { id: "team", label: "Team", type: "select", options: [{ id: "red", label: "Red" }, { id: "blue", label: "Blue" }] },
    { id: "active", label: "Active", type: "boolean" },
];

const OPERATOR_NAMES: Record<string, string> = {
    contains: "contains", "not-contains": "does not contain", equals: "is", "not-equals": "is not", "starts-with": "starts with", "ends-with": "ends with",
    gt: "is more than", gte: "is at least", lt: "is less than", lte: "is at most", between: "is between", "not-between": "is not between",
    in: "is one of", "not-in": "is none of", "is-empty": "is empty", "is-not-empty": "is not empty", "is-true": "is yes", "is-false": "is no",
};

const LABELS: FilterLabels = {
    rule: (n) => `Condition ${n}`,
    group: (d) => `Group, level ${d}`,
    field: "Field",
    operator: "Operator",
    operatorName: (op) => OPERATOR_NAMES[op],
    value: "Value",
    valueFrom: "From",
    valueTo: "To",
    combinator: "Match",
    and: "all",
    or: "any",
    not: "Not",
    addRule: "Add condition",
    addGroup: "Add group",
    removeRule: (n) => `Remove condition ${n}`,
    removeGroup: (d) => `Remove group, level ${d}`,
    choose: "Choose…",
    empty: "No conditions",
    output: "Filter as text",
    ruleAdded: (n) => `Condition ${n} added`,
    ruleRemoved: (n) => `Condition ${n} removed`,
    groupAdded: (d) => `Group, level ${d}, added`,
    groupRemoved: (d) => `Group, level ${d}, removed`,
};

const rule = (field: string, operator: FilterRule["operator"], value?: unknown, value2?: unknown): FilterRule => ({ type: "rule", id: `r-${field}-${operator}`, field, operator, value, value2 });
const start = (...children: FilterGroup["children"]): FilterGroup => ({ type: "group", id: "root", combinator: "and", children });
const base = { label: "Filter people", fields: FIELDS, labels: LABELS };
const status = () => document.querySelector(".filter-status")?.textContent;
const tick = () => new Promise((r) => setTimeout(r, 0));

describe("Filter — markup", () => {
    test("§8.1 a labelled group wraps one group per level, each named by labels.group", () => {
        render(Filter, { props: { ...base, value: start(rule("name", "contains", "a"), createGroup("or", [rule("age", "gt", 3)])) } });
        expect(screen.getByRole("group", { name: "Filter people" })).toBeTruthy();
        expect(screen.getByRole("group", { name: "Group, level 1" })).toBeTruthy();
        expect(screen.getByRole("group", { name: "Group, level 2" })).toBeTruthy();
    });

    test("§8.2 each condition is a group named by its number, with a field, an operator and a value, all named", () => {
        render(Filter, { props: { ...base, value: start(rule("name", "contains", "a"), rule("age", "gt", 3)) } });
        const second = screen.getByRole("group", { name: "Condition 2" });
        expect(second.querySelector(".filter-field")?.getAttribute("aria-label")).toBe("Field");
        expect(second.querySelector(".filter-operator")?.getAttribute("aria-label")).toBe("Operator");
        expect((second.querySelector(".filter-value") as HTMLInputElement).type).toBe("number");
        expect(second.querySelector(".filter-value")?.getAttribute("aria-label")).toBe("Value");
    });

    test("§8.3 operators are those of the field's type, named by labels.operatorName", () => {
        render(Filter, { props: { ...base, value: start(rule("age", "gt", 3)) } });
        const names = Array.from(document.querySelectorAll(".filter-operator option")).map((o) => o.textContent);
        expect(names).toContain("is at least");
        expect(names).toContain("is at most");
        expect(names).toContain("is between");
        expect(names).not.toContain("contains");
    });

    test("§8.4 the value editor follows the type: text, number, date, a select, a checkbox list, none", () => {
        render(Filter, { props: { ...base, value: start(rule("name", "contains"), rule("age", "gt"), rule("joined", "gt"), rule("team", "equals"), rule("team", "in"), rule("active", "is-true")) } });
        const rules = Array.from(document.querySelectorAll(".filter-rule"));
        expect((rules[0].querySelector(".filter-value") as HTMLInputElement).type).toBe("text");
        expect((rules[1].querySelector(".filter-value") as HTMLInputElement).type).toBe("number");
        expect((rules[2].querySelector(".filter-value") as HTMLInputElement).type).toBe("date");
        expect(rules[3].querySelector("select.filter-value")).toBeTruthy();
        expect(rules[4].querySelectorAll(".filter-choice input[type=checkbox]")).toHaveLength(2);
        expect(rules[5].querySelector(".filter-value, .filter-choices")).toBeNull();
    });

    test("§8.5 between shows two inputs, named From and To", () => {
        render(Filter, { props: { ...base, value: start(rule("age", "between")) } });
        expect(screen.getByLabelText("From")).toBeTruthy();
        expect(screen.getByLabelText("To")).toBeTruthy();
    });

    test("§8.6 an empty group shows labels.empty, a populated one does not", () => {
        render(Filter, { props: base });
        expect(document.querySelector(".filter-empty")?.textContent).toBe("No conditions");
        document.body.innerHTML = "";
        render(Filter, { props: { ...base, value: start(rule("name", "contains")) } });
        expect(document.querySelector(".filter-empty")).toBeNull();
    });

    test("§8.7 rest props and the class hook land on the root", () => {
        render(Filter, { props: { ...base, class: "mine", "data-testid": "f" } });
        const root = screen.getByTestId("f");
        expect(root.classList.contains("filter")).toBe(true);
        expect(root.classList.contains("mine")).toBe(true);
    });
});

describe("Filter — editing", () => {
    test("§8.8 Add condition appends a rule on the first field and operator, reports it, announces and focuses its field", async () => {
        const onChange = vi.fn();
        render(Filter, { props: { ...base, onChange } });
        await fireEvent.click(screen.getByText("Add condition"));
        await tick();
        const added = onChange.mock.calls[0][0] as FilterGroup;
        expect(rulesOf(added)).toHaveLength(1);
        expect(rulesOf(added)[0]).toMatchObject({ field: "name", operator: "contains" });
        expect(status()).toBe("Condition 1 added");
        expect(document.activeElement).toBe(document.querySelector(".filter-field"));
    });

    test("§8.9 typing a value updates only that rule, as a new object", async () => {
        const onChange = vi.fn();
        const initial = start(rule("name", "contains"), rule("age", "gt"));
        render(Filter, { props: { ...base, value: initial, onChange } });
        await fireEvent.input(document.querySelectorAll(".filter-value")[0], { target: { value: "ann" } });
        const next = onChange.mock.calls[0][0] as FilterGroup;
        expect(next).not.toBe(initial);
        expect((next.children[0] as FilterRule).value).toBe("ann");
        expect(next.children[1]).toBe(initial.children[1]);
        expect((initial.children[0] as FilterRule).value).toBeUndefined();
    });

    test("§8.10 a number input stores a number, and clearing it stores nothing", async () => {
        const onChange = vi.fn();
        render(Filter, { props: { ...base, value: start(rule("age", "gt")), onChange } });
        const input = document.querySelector(".filter-value") as HTMLInputElement;
        await fireEvent.input(input, { target: { value: "42" } });
        expect((onChange.mock.calls.at(-1)![0].children[0] as FilterRule).value).toBe(42);
        await fireEvent.input(input, { target: { value: "" } });
        expect((onChange.mock.calls.at(-1)![0].children[0] as FilterRule).value).toBeUndefined();
    });

    test("§8.11 changing the field resets the value and keeps an operator the new field offers", async () => {
        const onChange = vi.fn();
        render(Filter, { props: { ...base, value: start(rule("name", "equals", "x")), onChange } });
        await fireEvent.change(document.querySelector(".filter-field")!, { target: { value: "age" } });
        expect(onChange.mock.calls[0][0].children[0]).toMatchObject({ field: "age", operator: "equals", value: undefined });
    });

    test("§8.12 changing the operator to between shows a second input, and back drops it", async () => {
        const onChange = vi.fn();
        const { rerender } = render(Filter, { props: { ...base, value: start(rule("age", "gt", 5)), onChange } });
        await fireEvent.change(document.querySelector(".filter-operator")!, { target: { value: "between" } });
        const next = onChange.mock.calls[0][0] as FilterGroup;
        expect(next.children[0]).toMatchObject({ operator: "between", value: 5 });
        await rerender({ ...base, value: next, onChange });
        expect(screen.getByLabelText("To")).toBeTruthy();
        await fireEvent.change(document.querySelector(".filter-operator")!, { target: { value: "gt" } });
        expect(onChange.mock.calls.at(-1)![0].children[0]).toMatchObject({ operator: "gt", value2: undefined });
    });

    test("§8.13 checkboxes build the list for is one of", async () => {
        const onChange = vi.fn();
        const { rerender } = render(Filter, { props: { ...base, value: start(rule("team", "in")), onChange } });
        await fireEvent.click(screen.getByLabelText("Blue"));
        const one = onChange.mock.calls[0][0] as FilterGroup;
        expect((one.children[0] as FilterRule).value).toEqual(["blue"]);
        await rerender({ ...base, value: one, onChange });
        await fireEvent.click(screen.getByLabelText("Red"));
        expect((onChange.mock.calls.at(-1)![0].children[0] as FilterRule).value).toEqual(["blue", "red"]);
        await fireEvent.click(screen.getByLabelText("Blue"));
        expect((onChange.mock.calls.at(-1)![0].children[0] as FilterRule).value).toEqual(["red"]);
    });

    test("§8.14 the and / or select and the Not box edit the group", async () => {
        const onChange = vi.fn();
        render(Filter, { props: { ...base, value: start(rule("name", "contains", "a")), onChange } });
        await fireEvent.change(screen.getByLabelText("Match"), { target: { value: "or" } });
        expect(onChange.mock.calls[0][0].combinator).toBe("or");
        await fireEvent.click(screen.getByLabelText("Not"));
        expect(onChange.mock.calls.at(-1)![0].not).toBe(true);
    });

    test("§8.15 Remove removes that condition, announces, and returns focus to the group's Add condition", async () => {
        const onChange = vi.fn();
        render(Filter, { props: { ...base, value: start(rule("name", "contains", "a"), rule("age", "gt", 3)), onChange } });
        await fireEvent.click(screen.getByText("Remove condition 1"));
        await tick();
        expect(rulesOf(onChange.mock.calls[0][0])).toHaveLength(1);
        expect(status()).toBe("Condition 1 removed");
        expect(document.activeElement).toBe(screen.getByText("Add condition"));
    });

    test("§8.16 Add group adds a nested group with one condition and focuses it; Remove group takes it out", async () => {
        const onChange = vi.fn();
        const { rerender } = render(Filter, { props: { ...base, onChange } });
        await fireEvent.click(screen.getByText("Add group"));
        await tick();
        const next = onChange.mock.calls[0][0] as FilterGroup;
        expect(next.children[0]).toMatchObject({ type: "group" });
        expect(status()).toBe("Group, level 2, added");
        await rerender({ ...base, value: next, onChange });
        await fireEvent.click(screen.getByText("Remove group, level 2"));
        expect(onChange.mock.calls.at(-1)![0].children).toHaveLength(0);
    });

    test("§8.17 maxDepth stops nesting: no Add group at the deepest level, and none at all with maxDepth 1", () => {
        render(Filter, { props: { ...base, value: start(createGroup("and", [rule("name", "contains")])), maxDepth: 2 } });
        expect(screen.getAllByText("Add group")).toHaveLength(1);
        document.body.innerHTML = "";
        render(Filter, { props: { ...base, maxDepth: 1 } });
        expect(screen.queryByText("Add group")).toBeNull();
    });

    test("§8.18 readonly shows the filter and offers no way to change it", () => {
        render(Filter, { props: { ...base, readonly: true, value: start(rule("name", "contains", "a")) } });
        expect(screen.queryByText("Add condition")).toBeNull();
        expect(screen.queryByText("Remove condition 1")).toBeNull();
        expect((document.querySelector(".filter-field") as HTMLSelectElement).disabled).toBe(true);
        expect((document.querySelector(".filter-value") as HTMLInputElement).readOnly).toBe(true);
    });

    test("§8.19 with no fields there is nothing to add", async () => {
        const onChange = vi.fn();
        render(Filter, { props: { ...base, fields: [], onChange } });
        await fireEvent.click(screen.getByText("Add condition"));
        expect(onChange).not.toHaveBeenCalled();
    });
});

describe("Filter — output and use", () => {
    const value = start(rule("name", "contains", "ann"), rule("age", "between", 18, 65));

    test("§8.20 format shows the filter as text, and updates as it changes", async () => {
        render(Filter, { props: { ...base, value, format: "sql" } });
        expect(document.querySelector(".filter-output-text")?.textContent).toBe(`LOWER("name") LIKE LOWER('%ann%') ESCAPE '\\' AND "age" BETWEEN 18 AND 65`);
        expect(document.querySelector(".filter-output")?.getAttribute("aria-label")).toBe("Filter as text");
    });

    test("§8.21 each format", () => {
        for (const [format, needle] of [["json", '"between"'], ["mongo", "$gte"], ["odata", "ge 18"]] as const) {
            document.body.innerHTML = "";
            render(Filter, { props: { ...base, value, format } });
            expect(document.querySelector(".filter-output-text")?.textContent).toContain(needle);
        }
    });

    test("§8.22 the dialect applies to SQL output", () => {
        render(Filter, { props: { ...base, value, format: "sql", dialect: "mysql" } });
        expect(document.querySelector(".filter-output-text")?.textContent).toContain("`name`");
    });

    test("§8.23 no output without a format or without labels.output", () => {
        render(Filter, { props: { ...base, value } });
        expect(document.querySelector(".filter-output")).toBeNull();
        document.body.innerHTML = "";
        render(Filter, { props: { ...base, value, format: "sql", labels: { ...LABELS, output: undefined } } });
        expect(document.querySelector(".filter-output")).toBeNull();
    });

    test("§8.24 an incomplete condition is left out of the output until it is finished", () => {
        render(Filter, { props: { ...base, value: start(rule("name", "contains", "ann"), rule("age", "gt")), format: "odata" } });
        expect(document.querySelector(".filter-output-text")?.textContent).toBe("contains(tolower(name),tolower('ann'))");
    });

    test("§8.25 the value the component edits works with the pure functions: predicate, SQL and JSON", async () => {
        const onChange = vi.fn();
        render(Filter, { props: { ...base, value: start(rule("age", "gte", 18)), onChange } });
        await fireEvent.click(screen.getByText("Add condition"));
        const g = onChange.mock.calls[0][0] as FilterGroup;
        const last = rulesOf(g)[1];
        const done = { ...g, children: [g.children[0], { ...last, value: "ann" }] } as FilterGroup;
        expect([{ name: "Ann", age: 20 }, { name: "Bob", age: 20 }, { name: "Ann", age: 3 }].filter(toPredicate(done, FIELDS))).toEqual([{ name: "Ann", age: 20 }]);
        expect(toSql(done, FIELDS).params).toEqual([18, "%ann%"]);
        expect(toJson(done, FIELDS)).toMatchObject({ combinator: "and" });
        expect(createRule(FIELDS).type).toBe("rule");
    });
});
