import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { Filter, type FilterLabels } from "./Filter";
import { ALL_OPERATORS, createGroup, createRule, rulesOf, toJson, toPredicate, toSql, type FilterField, type FilterGroup, type FilterRule } from "./filter-model";

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
        render(<Filter {...({ ...base, defaultValue: start(rule("name", "contains", "a"), createGroup("or", [rule("age", "gt", 3)])) } )} />);
        expect(screen.getByRole("group", { name: "Filter people" })).toBeTruthy();
        expect(screen.getByRole("group", { name: "Group, level 1" })).toBeTruthy();
        expect(screen.getByRole("group", { name: "Group, level 2" })).toBeTruthy();
    });

    test("§8.2 each condition is a group named by its number, with a field, an operator and a value, all named", () => {
        render(<Filter {...({ ...base, defaultValue: start(rule("name", "contains", "a"), rule("age", "gt", 3)) } )} />);
        const second = screen.getByRole("group", { name: "Condition 2" });
        expect(second.querySelector(".filter-field")?.getAttribute("aria-label")).toBe("Field");
        expect(second.querySelector(".filter-operator")?.getAttribute("aria-label")).toBe("Operator");
        expect((second.querySelector(".filter-value") as HTMLInputElement).type).toBe("number");
        expect(second.querySelector(".filter-value")?.getAttribute("aria-label")).toBe("Value");
    });

    test("§8.3 operators are those of the field's type, named by labels.operatorName", () => {
        render(<Filter {...({ ...base, defaultValue: start(rule("age", "gt", 3)) } )} />);
        const names = Array.from(document.querySelectorAll(".filter-operator option")).map((o) => o.textContent);
        expect(names).toContain("is at least");
        expect(names).toContain("is at most");
        expect(names).toContain("is between");
        expect(names).not.toContain("contains");
    });

    test("§8.4 the value editor follows the type: text, number, date, a select, a checkbox list, none", () => {
        render(<Filter {...({ ...base, defaultValue: start(rule("name", "contains"), rule("age", "gt"), rule("joined", "gt"), rule("team", "equals"), rule("team", "in"), rule("active", "is-true")) } )} />);
        const rules = Array.from(document.querySelectorAll(".filter-rule"));
        expect((rules[0].querySelector(".filter-value") as HTMLInputElement).type).toBe("text");
        expect((rules[1].querySelector(".filter-value") as HTMLInputElement).type).toBe("number");
        expect((rules[2].querySelector(".filter-value") as HTMLInputElement).type).toBe("date");
        expect(rules[3].querySelector("select.filter-value")).toBeTruthy();
        expect(rules[4].querySelectorAll(".filter-choice input[type=checkbox]")).toHaveLength(2);
        expect(rules[5].querySelector(".filter-value, .filter-choices")).toBeNull();
    });

    test("§8.5 between shows two inputs, named From and To", () => {
        render(<Filter {...({ ...base, defaultValue: start(rule("age", "between")) } )} />);
        expect(screen.getByLabelText("From")).toBeTruthy();
        expect(screen.getByLabelText("To")).toBeTruthy();
    });

    test("§8.6 an empty group shows labels.empty, a populated one does not", () => {
        render(<Filter {...(base )} />);
        expect(document.querySelector(".filter-empty")?.textContent).toBe("No conditions");
        document.body.innerHTML = "";
        render(<Filter {...({ ...base, defaultValue: start(rule("name", "contains")) } )} />);
        expect(document.querySelector(".filter-empty")).toBeNull();
    });

    test("§8.7 rest props and the class hook land on the root", () => {
        render(<Filter {...({ ...base, className: "mine", "data-testid": "f" } )} />);
        const root = screen.getByTestId("f");
        expect(root.classList.contains("filter")).toBe(true);
        expect(root.classList.contains("mine")).toBe(true);
    });
});

describe("Filter — editing", () => {
    test("§8.8 Add condition appends a rule on the first field and operator, reports it, announces and focuses its field", async () => {
        const onChange = vi.fn();
        render(<Filter {...({ ...base, onChange } )} />);
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
        render(<Filter {...({ ...base, defaultValue: initial, onChange } )} />);
        await fireEvent.input(document.querySelectorAll(".filter-value")[0], { target: { value: "ann" } });
        const next = onChange.mock.calls[0][0] as FilterGroup;
        expect(next).not.toBe(initial);
        expect((next.children[0] as FilterRule).value).toBe("ann");
        expect(next.children[1]).toBe(initial.children[1]);
        expect((initial.children[0] as FilterRule).value).toBeUndefined();
    });

    test("§8.10 a number input stores a number, and clearing it stores nothing", async () => {
        const onChange = vi.fn();
        render(<Filter {...({ ...base, defaultValue: start(rule("age", "gt")), onChange } )} />);
        const input = document.querySelector(".filter-value") as HTMLInputElement;
        await fireEvent.input(input, { target: { value: "42" } });
        expect((onChange.mock.calls.at(-1)![0].children[0] as FilterRule).value).toBe(42);
        await fireEvent.input(input, { target: { value: "" } });
        expect((onChange.mock.calls.at(-1)![0].children[0] as FilterRule).value).toBeUndefined();
    });

    test("§8.11 changing the field resets the value and keeps an operator the new field offers", async () => {
        const onChange = vi.fn();
        render(<Filter {...({ ...base, defaultValue: start(rule("name", "equals", "x")), onChange } )} />);
        await fireEvent.change(document.querySelector(".filter-field")!, { target: { value: "age" } });
        expect(onChange.mock.calls[0][0].children[0]).toMatchObject({ field: "age", operator: "equals", value: undefined });
    });

    test("§8.12 changing the operator to between shows a second input, and back drops it", async () => {
        const onChange = vi.fn();
        render(<Filter {...({ ...base, defaultValue: start(rule("age", "gt", 5)), onChange } )} />);
        await fireEvent.change(document.querySelector(".filter-operator")!, { target: { value: "between" } });
        const next = onChange.mock.calls[0][0] as FilterGroup;
        expect(next.children[0]).toMatchObject({ operator: "between", value: 5 });
        expect(screen.getByLabelText("To")).toBeTruthy();
        await fireEvent.change(document.querySelector(".filter-operator")!, { target: { value: "gt" } });
        expect(onChange.mock.calls.at(-1)![0].children[0]).toMatchObject({ operator: "gt", value2: undefined });
    });

    test("§8.13 checkboxes build the list for is one of", async () => {
        const onChange = vi.fn();
        render(<Filter {...({ ...base, defaultValue: start(rule("team", "in")), onChange } )} />);
        await fireEvent.click(screen.getByLabelText("Blue"));
        const one = onChange.mock.calls[0][0] as FilterGroup;
        expect((one.children[0] as FilterRule).value).toEqual(["blue"]);
        await fireEvent.click(screen.getByLabelText("Red"));
        expect((onChange.mock.calls.at(-1)![0].children[0] as FilterRule).value).toEqual(["blue", "red"]);
        await fireEvent.click(screen.getByLabelText("Blue"));
        expect((onChange.mock.calls.at(-1)![0].children[0] as FilterRule).value).toEqual(["red"]);
    });

    test("§8.14 the and / or select and the Not box edit the group", async () => {
        const onChange = vi.fn();
        render(<Filter {...({ ...base, defaultValue: start(rule("name", "contains", "a")), onChange } )} />);
        await fireEvent.change(screen.getByLabelText("Match"), { target: { value: "or" } });
        expect(onChange.mock.calls[0][0].combinator).toBe("or");
        await fireEvent.click(screen.getByLabelText("Not"));
        expect(onChange.mock.calls.at(-1)![0].not).toBe(true);
    });

    test("§8.15 Remove removes that condition, announces, and returns focus to the group's Add condition", async () => {
        const onChange = vi.fn();
        render(<Filter {...({ ...base, defaultValue: start(rule("name", "contains", "a"), rule("age", "gt", 3)), onChange } )} />);
        await fireEvent.click(screen.getByText("Remove condition 1"));
        await tick();
        expect(rulesOf(onChange.mock.calls[0][0])).toHaveLength(1);
        expect(status()).toBe("Condition 1 removed");
        expect(document.activeElement).toBe(screen.getByText("Add condition"));
    });

    test("§8.16 Add group adds a nested group with one condition and focuses it; Remove group takes it out", async () => {
        const onChange = vi.fn();
        render(<Filter {...({ ...base, onChange } )} />);
        await fireEvent.click(screen.getByText("Add group"));
        await tick();
        const next = onChange.mock.calls[0][0] as FilterGroup;
        expect(next.children[0]).toMatchObject({ type: "group" });
        expect(status()).toBe("Group, level 2, added");
        await fireEvent.click(screen.getByText("Remove group, level 2"));
        expect(onChange.mock.calls.at(-1)![0].children).toHaveLength(0);
    });

    test("§8.17 maxDepth stops nesting: no Add group at the deepest level, and none at all with maxDepth 1", () => {
        render(<Filter {...({ ...base, defaultValue: start(createGroup("and", [rule("name", "contains")])), maxDepth: 2 } )} />);
        expect(screen.getAllByText("Add group")).toHaveLength(1);
        document.body.innerHTML = "";
        render(<Filter {...({ ...base, maxDepth: 1 } )} />);
        expect(screen.queryByText("Add group")).toBeNull();
    });

    test("§8.18 readonly shows the filter and offers no way to change it", () => {
        render(<Filter {...({ ...base, readonly: true, defaultValue: start(rule("name", "contains", "a")) } )} />);
        expect(screen.queryByText("Add condition")).toBeNull();
        expect(screen.queryByText("Remove condition 1")).toBeNull();
        expect((document.querySelector(".filter-field") as HTMLSelectElement).disabled).toBe(true);
        expect((document.querySelector(".filter-value") as HTMLInputElement).readOnly).toBe(true);
    });

    test("§8.19 with no fields there is nothing to add", async () => {
        const onChange = vi.fn();
        render(<Filter {...({ ...base, fields: [], onChange } )} />);
        await fireEvent.click(screen.getByText("Add condition"));
        expect(onChange).not.toHaveBeenCalled();
    });
});

describe("Filter — output and use", () => {
    const value = start(rule("name", "contains", "ann"), rule("age", "between", 18, 65));

    test("§8.20 format shows the filter as text, and updates as it changes", async () => {
        render(<Filter {...({ ...base, defaultValue: value, format: "sql" } )} />);
        expect(document.querySelector(".filter-output-text")?.textContent).toBe(`LOWER("name") LIKE LOWER('%ann%') ESCAPE '\\' AND "age" BETWEEN 18 AND 65`);
        expect(document.querySelector(".filter-output")?.getAttribute("aria-label")).toBe("Filter as text");
    });

    test("§8.21 each format", () => {
        for (const [format, needle] of [["json", '"between"'], ["mongo", "$gte"], ["odata", "ge 18"]] as const) {
            document.body.innerHTML = "";
            render(<Filter {...({ ...base, defaultValue: value, format } )} />);
            expect(document.querySelector(".filter-output-text")?.textContent).toContain(needle);
        }
    });

    test("§8.22 the dialect applies to SQL output", () => {
        render(<Filter {...({ ...base, defaultValue: value, format: "sql", dialect: "mysql" } )} />);
        expect(document.querySelector(".filter-output-text")?.textContent).toContain("`name`");
    });

    test("§8.23 no output without a format or without labels.output", () => {
        render(<Filter {...({ ...base, defaultValue: value } )} />);
        expect(document.querySelector(".filter-output")).toBeNull();
        document.body.innerHTML = "";
        render(<Filter {...({ ...base, defaultValue: value, format: "sql", labels: { ...LABELS, output: undefined } } )} />);
        expect(document.querySelector(".filter-output")).toBeNull();
    });

    test("§8.24 an incomplete condition is left out of the output until it is finished", () => {
        render(<Filter {...({ ...base, defaultValue: start(rule("name", "contains", "ann"), rule("age", "gt")), format: "odata" } )} />);
        expect(document.querySelector(".filter-output-text")?.textContent).toBe("contains(tolower(name),tolower('ann'))");
    });

    test("§8.25 the value the component edits works with the pure functions: predicate, SQL and JSON", async () => {
        const onChange = vi.fn();
        render(<Filter {...({ ...base, defaultValue: start(rule("age", "gte", 18)), onChange } )} />);
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

describe("Filter — another language and right-to-left (§8.26–§8.29)", () => {
    const ZH_FIELDS: FilterField[] = [
        { id: "name", label: "姓名" },
        { id: "age", label: "年龄", type: "number" },
        { id: "team", label: "团队", type: "select", options: [{ id: "red", label: "红队" }, { id: "blue", label: "蓝队" }] },
    ];
    const ZH_OPERATORS: Record<string, string> = {
        contains: "包含", "not-contains": "不包含", equals: "等于", "not-equals": "不等于", "starts-with": "开头是", "ends-with": "结尾是",
        gt: "大于", gte: "至少", lt: "小于", lte: "至多", between: "介于", "not-between": "不介于", in: "属于其中之一", "not-in": "不属于其中任何一个",
        "is-empty": "为空", "is-not-empty": "不为空", "is-true": "为是", "is-false": "为否",
    };
    const ZH: FilterLabels = {
        rule: (n) => `条件 ${n}`, group: (d) => `第 ${d} 层分组`, field: "字段", operator: "运算符",
        operatorName: (op) => ZH_OPERATORS[op] ?? op, value: "值", valueFrom: "从", valueTo: "到",
        combinator: "匹配", and: "全部", or: "任一", not: "非", addRule: "添加条件", addGroup: "添加分组",
        removeRule: (n) => `删除条件 ${n}`, removeGroup: (d) => `删除第 ${d} 层分组`, choose: "请选择…", empty: "没有条件", output: "筛选文本",
        ruleAdded: (n) => `已添加条件 ${n}`, ruleRemoved: (n) => `已删除条件 ${n}`, groupAdded: (d) => `已添加第 ${d} 层分组`, groupRemoved: (d) => `已删除第 ${d} 层分组`,
    };
    function readable(root: Element): string[] {
        const out: string[] = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) out.push(n.textContent ?? "");
        for (const el of root.querySelectorAll("*")) for (const a of ["aria-label", "title", "placeholder", "alt"]) if (el.hasAttribute(a)) out.push(el.getAttribute(a)!);
        return out.map((t) => t.trim()).filter(Boolean);
    }

    test("§8.25b the bundle names every operator, which ALL_OPERATORS lets an app assert", () => {
        for (const op of ALL_OPERATORS) expect(ZH_OPERATORS[op], op).toBeTruthy();
    });

    test("§8.26 every operator the fields offer is named by the bundle, so the builder reads as Chinese only", () => {
        const value = start(rule("name", "contains", "王"), rule("age", "between", 18, 65), rule("team", "in", ["red"]), createGroup("or", [rule("age", "gt", 30)]));
        const { container } = render(<Filter {...({ label: "筛选人员", fields: ZH_FIELDS, labels: ZH, defaultValue: value, format: "sql" } )} />);
        // The SQL output is code; everything else a user reads or hears must have no English word in it.
        const texts = readable(container).filter((t) => !container.querySelector(".filter-output-text")?.textContent?.includes(t) || t.length < 3);
        expect(texts.filter((t) => /[A-Za-z]{3,}/.test(t))).toEqual([]);
    });

    test("§8.27 announcements are the bundle's own words", async () => {
        render(<Filter {...({ label: "筛选人员", fields: ZH_FIELDS, labels: ZH } )} />);
        await fireEvent.click(screen.getByText("添加条件"));
        await tick();
        expect(status()).toBe("已添加条件 1");
        await fireEvent.click(screen.getByText("删除条件 1"));
        await tick();
        expect(status()).toBe("已删除条件 1");
    });

    test("§8.28 in right-to-left the builder still works with the same controls in the same order (no arrow-key model to flip)", async () => {
        document.body.setAttribute("dir", "rtl");
        try {
            const onChange = vi.fn();
            render(<Filter {...({ label: "筛选人员", fields: ZH_FIELDS, labels: ZH, onChange } )} />);
            await fireEvent.click(screen.getByText("添加条件"));
            expect(rulesOf(onChange.mock.calls[0][0])).toHaveLength(1);
            const order = Array.from(document.querySelectorAll(".filter-rule > *")).map((e) => e.className.split(" ")[0]);
            expect(order.slice(0, 3)).toEqual(["filter-field", "filter-operator", "filter-value"]);
        } finally {
            document.body.removeAttribute("dir");
        }
    });

    test("§8.29 the builder sets no physical left or right in an inline style, so it mirrors with the page", () => {
        render(<Filter {...({ ...base, defaultValue: start(rule("name", "contains", "a")) } )} />);
        const styled = Array.from(document.querySelectorAll<HTMLElement>("[style]")).map((e) => e.getAttribute("style")!);
        expect(styled.filter((s) => /(^|;|\s)(left|right|margin-left|margin-right|padding-left|padding-right|text-align)\s*:/.test(s))).toEqual([]);
    });
});

