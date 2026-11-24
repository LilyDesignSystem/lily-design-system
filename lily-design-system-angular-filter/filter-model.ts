/**
 * The filter model: a tree of rules and groups over typed fields, and everything that can be done with it that needs no browser —
 * editing it immutably, validating it, and writing it out as JSON, SQL, MongoDB, OData or a predicate. Pure, so it is unit-tested on its own.
 *
 * Plain data and no English: operator names are the stable ids below, and what they are called on screen is the consumer's
 * (`labels.operator`). No default locale: dates are ISO `YYYY-MM-DD` strings, numbers are numbers.
 */
import { foldText } from "./search-text";

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------

/**
 * `partial-date` is a date that may be known only to the year or the month (`2019`, `2019-03`, `2019-03-14`), as openEHR
 * DV_DATE and FHIR allow. Rule values are full dates; a comparison the row's precision cannot decide does not match, in every
 * output and under `not` (spec/lessons/openehr-rust item 5).
 */
export type FilterFieldType = "text" | "number" | "date" | "partial-date" | "select" | "boolean";

export type FilterOperator =
    | "contains"
    | "not-contains"
    | "equals"
    | "not-equals"
    | "starts-with"
    | "ends-with"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "between"
    | "not-between"
    | "in"
    | "not-in"
    | "is-empty"
    | "is-not-empty"
    | "is-true"
    | "is-false";

export type FilterOption = { id: string; label: string };

/** A field the user can filter on. */
export type FilterField = {
    /** The key in the rows a predicate reads, and the key in JSON output. */
    id: string;
    /** Visible name. */
    label: string;
    /** Default `text`. */
    type?: FilterFieldType;
    /** `select`: the choices (`in` / `is` match the option ids). */
    options?: FilterOption[];
    /** The column name in SQL, MongoDB and OData output. Defaults to `id`. SQL accepts only plain identifiers (letters, digits, `_`, dots). */
    column?: string;
    /** Restrict the operators offered (in this order). Defaults to the type's own. */
    operators?: FilterOperator[];
};

export type FilterRule = {
    type: "rule";
    id: string;
    field: string;
    operator: FilterOperator;
    /** The value: text, a number (`null` while empty), an ISO date, an option id, or option ids for `in` / `not-in`. */
    value?: unknown;
    /** The upper end of `between` / `not-between`. */
    value2?: unknown;
};

export type FilterCombinator = "and" | "or";

export type FilterGroup = {
    type: "group";
    id: string;
    combinator: FilterCombinator;
    /** Negates the whole group. */
    not?: boolean;
    children: FilterNode[];
};

export type FilterNode = FilterRule | FilterGroup;

export class FilterError extends Error {}

// ---------------------------------------------------------------------
// Operators
// ---------------------------------------------------------------------

const OPERATORS_BY_TYPE: Record<FilterFieldType, FilterOperator[]> = {
    text: [
        "contains",
        "not-contains",
        "equals",
        "not-equals",
        "starts-with",
        "ends-with",
        "is-empty",
        "is-not-empty",
    ],
    number: [
        "equals",
        "not-equals",
        "gt",
        "gte",
        "lt",
        "lte",
        "between",
        "not-between",
        "is-empty",
        "is-not-empty",
    ],
    date: [
        "equals",
        "not-equals",
        "gt",
        "gte",
        "lt",
        "lte",
        "between",
        "not-between",
        "is-empty",
        "is-not-empty",
    ],
    "partial-date": [
        "equals",
        "not-equals",
        "gt",
        "gte",
        "lt",
        "lte",
        "between",
        "not-between",
        "is-empty",
        "is-not-empty",
    ],
    select: ["equals", "not-equals", "in", "not-in", "is-empty", "is-not-empty"],
    boolean: ["is-true", "is-false", "is-empty", "is-not-empty"],
};

/** Every operator id, so an app can check that its `labels.operatorName` names them all in each language. */
export const ALL_OPERATORS: readonly FilterOperator[] = [
    "contains",
    "not-contains",
    "equals",
    "not-equals",
    "starts-with",
    "ends-with",
    "gt",
    "gte",
    "lt",
    "lte",
    "between",
    "not-between",
    "in",
    "not-in",
    "is-empty",
    "is-not-empty",
    "is-true",
    "is-false",
];

export const fieldType = (field: FilterField | undefined): FilterFieldType => field?.type ?? "text";

/** The operators a field offers, in order. */
export function operatorsFor(field: FilterField | undefined): FilterOperator[] {
    return field?.operators?.length ? field.operators : OPERATORS_BY_TYPE[fieldType(field)];
}

/** How many values an operator takes: none, one, two (a range) or a list. */
export function valueArity(operator: FilterOperator): 0 | 1 | 2 | "many" {
    switch (operator) {
        case "is-empty":
        case "is-not-empty":
        case "is-true":
        case "is-false":
            return 0;
        case "between":
        case "not-between":
            return 2;
        case "in":
        case "not-in":
            return "many";
        default:
            return 1;
    }
}

// ---------------------------------------------------------------------
// Building and editing (immutable)
// ---------------------------------------------------------------------

// Module-level, so ids are unique across every filter on the page but not stable across reloads: `fromJson` always mints fresh ones,
// which is why `toJson` leaves ids out.
let counter = 0;
/** A node id, unique in this page's lifetime. */
export const newId = (prefix = "n"): string => `${prefix}${++counter}`;

export function createRule(fields: readonly FilterField[], fieldId?: string): FilterRule {
    const field = fields.find((f) => f.id === fieldId) ?? fields[0];
    return {
        type: "rule",
        id: newId("r"),
        field: field?.id ?? "",
        operator: operatorsFor(field)[0] ?? "contains",
    };
}

export const createGroup = (
    combinator: FilterCombinator = "and",
    children: FilterNode[] = [],
): FilterGroup => ({ type: "group", id: newId("g"), combinator, children });

export const EMPTY_FILTER = (): FilterGroup => createGroup("and");

/** Replace the node with `id` by `change(node)` (return `null` to delete it). The rest of the tree is shared, not copied. */
export function updateNode(
    root: FilterGroup,
    id: string,
    change: (node: FilterNode) => FilterNode | null,
): FilterGroup {
    if (root.id === id) {
        // The root can be replaced by another group, but not deleted or turned into a rule: either answer keeps the old root.
        const next = change(root);
        return next && next.type === "group" ? next : root;
    }
    // Structural sharing: a subtree is rebuilt only when something under it changed, so `===` tells a caller whether an edit did anything.
    let changed = false;
    const children: FilterNode[] = [];
    for (const child of root.children) {
        if (child.id === id) {
            const next = change(child);
            changed = true;
            if (next) children.push(next);
        } else if (child.type === "group") {
            const next = updateNode(child, id, change);
            if (next !== child) changed = true;
            children.push(next);
        } else children.push(child);
    }
    return changed ? { ...root, children } : root;
}

export const removeNode = (root: FilterGroup, id: string): FilterGroup =>
    updateNode(root, id, () => null);

/** Add `node` at the end of the group `parentId` (the root when it is not found). */
export function addNode(root: FilterGroup, parentId: string, node: FilterNode): FilterGroup {
    return updateNode(root, parentId, (g) =>
        g.type === "group" ? { ...g, children: [...g.children, node] } : g,
    );
}

/**
 * The filter with every condition and group removed (the filter's "Remove all conditions"): the root keeps its id and its
 * "and" or "or", and loses its "not", so the result is the empty filter the user started from, matching every row.
 */
export const clearFilter = (root: FilterGroup): FilterGroup =>
    root.children.length === 0 && !root.not ? root : { ...root, not: false, children: [] };

/** A rule with another field: its operator resets to that field's first when the old one does not apply, and its values clear. */
export function changeField(
    rule: FilterRule,
    fields: readonly FilterField[],
    fieldId: string,
): FilterRule {
    const field = fields.find((f) => f.id === fieldId);
    const operators = operatorsFor(field);
    return {
        ...rule,
        field: fieldId,
        operator: operators.includes(rule.operator)
            ? rule.operator
            : (operators[0] ?? rule.operator),
        value: undefined,
        value2: undefined,
    };
}

/** A rule with another operator: values it no longer needs are dropped, and a list is kept only for `in`. */
export function changeOperator(rule: FilterRule, operator: FilterOperator): FilterRule {
    const arity = valueArity(operator);
    const wasMany = valueArity(rule.operator) === "many";
    // The value survives only between operators of the same shape: a list stays a list (`in` to `not-in`), a single value stays single,
    // and switching between the two clears it, because `["a"]` is not a text value and `"a"` is not a list.
    return {
        ...rule,
        operator,
        value:
            arity === 0
                ? undefined
                : arity === "many"
                  ? wasMany
                      ? rule.value
                      : undefined
                  : wasMany
                    ? undefined
                    : rule.value,
        value2: arity === 2 ? rule.value2 : undefined,
    };
}

/** Every rule in the tree, depth first. */
export function rulesOf(group: FilterGroup): FilterRule[] {
    return group.children.flatMap((c) => (c.type === "rule" ? [c] : rulesOf(c)));
}

// ---------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
export function isIsoDate(value: unknown): value is string {
    if (typeof value !== "string") return false;
    const m = ISO_DATE.exec(value);
    if (!m) return false;
    const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
    // `Date.UTC` rolls an impossible date over (2026-02-30 becomes 2 March), so a real date is one that reads back unchanged.
    const t = new Date(Date.UTC(y, mo - 1, d));
    return t.getUTCFullYear() === y && t.getUTCMonth() === mo - 1 && t.getUTCDate() === d;
}

const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export type RuleIssue =
    | "unknown-field"
    | "unknown-operator"
    | "missing-value"
    | "invalid-value"
    | "range-order"
    | "unknown-option";

/** Why a rule cannot be applied, or `undefined` when it can. An incomplete rule is a normal state while the user is still typing. */
export function ruleIssue(rule: FilterRule, fields: readonly FilterField[]): RuleIssue | undefined {
    const field = fields.find((f) => f.id === rule.field);
    if (!field) return "unknown-field";
    if (!operatorsFor(field).includes(rule.operator)) return "unknown-operator";
    const type = fieldType(field);
    const arity = valueArity(rule.operator);
    if (arity === 0) return undefined;
    const check = (v: unknown): RuleIssue | undefined => {
        if (v === undefined || v === null || v === "") return "missing-value";
        if (type === "number") return isNumber(v) ? undefined : "invalid-value";
        if (type === "date" || type === "partial-date")
            return isIsoDate(v) ? undefined : "invalid-value";
        if (type === "select")
            return typeof v === "string" && (field.options ?? []).some((o) => o.id === v)
                ? undefined
                : "unknown-option";
        return typeof v === "string" ? undefined : "invalid-value";
    };
    if (arity === "many") {
        if (!Array.isArray(rule.value) || rule.value.length === 0) return "missing-value";
        for (const v of rule.value) {
            const issue = check(v);
            if (issue) return issue;
        }
        return undefined;
    }
    const first = check(rule.value);
    if (first) return first;
    if (arity === 2) {
        const second = check(rule.value2);
        if (second) return second;
        // Numbers compare numerically; ISO dates compare correctly as text, so one comparison serves both field types.
        const [a, b] = [rule.value as number | string, rule.value2 as number | string];
        if (a > b) return "range-order";
    }
    return undefined;
}

/**
 * The tree an output is made from: rules with an issue, and groups left empty by that, are dropped, and a group of one child stays a group
 * (its `not` and combinator still mean something). `null` when nothing is left.
 */
export function normalise(group: FilterGroup, fields: readonly FilterField[]): FilterGroup | null {
    const children: FilterNode[] = [];
    for (const child of group.children) {
        if (child.type === "rule") {
            if (!ruleIssue(child, fields)) children.push(child);
        } else {
            const inner = normalise(child, fields);
            if (inner) children.push(inner);
        }
    }
    return children.length ? { ...group, children } : null;
}

// ---------------------------------------------------------------------
// Partial dates: three-valued comparison
// ---------------------------------------------------------------------

/** A row value of a `partial-date` field: `YYYY`, `YYYY-MM` or `YYYY-MM-DD`, each a real year, month or day. */
export function isPartialDate(value: unknown): value is string {
    if (typeof value !== "string") return false;
    if (/^\d{4}$/.test(value)) return true;
    if (/^\d{4}-\d{2}$/.test(value)) {
        const month = Number(value.slice(5, 7));
        return month >= 1 && month <= 12;
    }
    return isIsoDate(value);
}

/** The lengths a partial date's text can have: a year, a month, a day. */
const PARTIAL_LENGTHS = [4, 7, 10] as const;
type PartialLength = (typeof PARTIAL_LENGTHS)[number];

/**
 * One case of a partial-date comparison: the row's text has `length` characters and stands in one of `relations` to `key`, the
 * rule's date cut to that length. A row's text is all the days that begin with it, so a shorter text is before, within or after
 * the rule's date by plain text comparison with the cut date, which every output can write.
 */
export type PartialDateAtom = {
    length: PartialLength;
    relations: ("<" | "=" | ">")[];
    key: string;
};

/** A condition on one row's text: an atom, a blank value, or `any` / `all` of other conditions (`any: []` never holds). */
export type PartialDateCondition =
    | { atom: PartialDateAtom }
    | { blank: true }
    | { any: PartialDateCondition[] }
    | { all: PartialDateCondition[] };

/** When a partial-date rule is definitely true and when definitely false. A row in neither "cannot tell", and never matches. */
export type PartialDateRails = { whenTrue: PartialDateCondition; whenFalse: PartialDateCondition };

const lastDayOfMonth = (year: number, month: number) =>
    new Date(Date.UTC(year, month, 0)).getUTCDate();

type Bound = "lt" | "lte" | "gt" | "gte" | "equals";

function boundRails(op: Bound, date: string): PartialDateRails {
    const year = Number(date.slice(0, 4));
    const month = Number(date.slice(5, 7));
    const day = Number(date.slice(8, 10));
    const whenTrue: PartialDateCondition[] = [];
    // A blank row is false for a comparison, as for every other field type.
    const whenFalse: PartialDateCondition[] = [{ blank: true }];
    for (const length of PARTIAL_LENGTHS) {
        const key = date.slice(0, length);
        // Is the rule's date the first or the last day of the row's year, month or day?
        const first = length === 10 || (length === 7 ? day === 1 : month === 1 && day === 1);
        const last =
            length === 10 ||
            (length === 7 ? day === lastDayOfMonth(year, month) : month === 12 && day === 31);
        const t: ("<" | "=" | ">")[] = [];
        const f: ("<" | "=" | ">")[] = [];
        switch (op) {
            case "lt": // true when every day of the row is before the date, false when none is
                t.push("<");
                f.push(">");
                if (first) f.push("=");
                break;
            case "lte":
                t.push("<");
                if (last) t.push("=");
                f.push(">");
                break;
            case "gt":
                t.push(">");
                f.push("<");
                if (last) f.push("=");
                break;
            case "gte":
                t.push(">");
                if (first) t.push("=");
                f.push("<");
                break;
            case "equals": // only a full date can equal a date
                if (length === 10) t.push("=");
                f.push("<", ">");
                break;
        }
        if (t.length) whenTrue.push({ atom: { length, relations: t, key } });
        // Every operator rules out some row of every length, so f is never empty.
        whenFalse.push({ atom: { length, relations: f, key } });
    }
    return { whenTrue: { any: whenTrue }, whenFalse: { any: whenFalse } };
}

/** The two rails of a comparison rule on a `partial-date` field. Negation swaps them, so "cannot tell" stays "cannot tell". */
export function partialDateRails(rule: FilterRule): PartialDateRails {
    const v = rule.value as string;
    const swap = (r: PartialDateRails): PartialDateRails => ({
        whenTrue: r.whenFalse,
        whenFalse: r.whenTrue,
    });
    const between = (): PartialDateRails => {
        // Kleene "and": true when both bounds are, false when either is.
        const low = boundRails("gte", v);
        const high = boundRails("lte", rule.value2 as string);
        return {
            whenTrue: { all: [low.whenTrue, high.whenTrue] },
            whenFalse: { any: [low.whenFalse, high.whenFalse] },
        };
    };
    switch (rule.operator) {
        case "lt":
        case "lte":
        case "gt":
        case "gte":
        case "equals":
            return boundRails(rule.operator, v);
        case "not-equals":
            return swap(boundRails("equals", v));
        case "between":
            return between();
        case "not-between":
            return swap(between());
        default:
            throw new FilterError("partialDateRails: not a comparison operator");
    }
}

/** Whether a row's value satisfies a condition. */
export function partialDateHolds(condition: PartialDateCondition, raw: unknown): boolean {
    if ("blank" in condition) return isBlank(raw);
    if ("any" in condition) return condition.any.some((c) => partialDateHolds(c, raw));
    if ("all" in condition) return condition.all.every((c) => partialDateHolds(c, raw));
    const { length, relations, key } = condition.atom;
    if (!isPartialDate(raw) || raw.length !== length) return false;
    const relation = raw < key ? "<" : raw > key ? ">" : "=";
    return relations.includes(relation);
}

/** Whether a rule needs the three-valued rails: a comparison on a `partial-date` field. */
const isPartialComparison = (rule: FilterRule, field: FilterField | undefined): boolean =>
    fieldType(field) === "partial-date" &&
    rule.operator !== "is-empty" &&
    rule.operator !== "is-not-empty";

// ---------------------------------------------------------------------
// Predicate (filter rows in memory)
// ---------------------------------------------------------------------

const asText = (v: unknown): string => (v === null || v === undefined ? "" : String(v));
const isBlank = (v: unknown): boolean =>
    v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0);

function ruleMatches(rule: FilterRule, field: FilterField, row: Record<string, unknown>): boolean {
    const raw = row[field.id];
    const type = fieldType(field);
    const { operator, value, value2 } = rule;
    switch (operator) {
        case "is-empty":
            return isBlank(raw);
        case "is-not-empty":
            return !isBlank(raw);
        case "is-true":
            return raw === true;
        case "is-false":
            return raw === false;
        case "contains":
            return foldText(asText(raw)).includes(foldText(asText(value)));
        case "not-contains":
            return !foldText(asText(raw)).includes(foldText(asText(value)));
        case "starts-with":
            return foldText(asText(raw)).startsWith(foldText(asText(value)));
        case "ends-with":
            return foldText(asText(raw)).endsWith(foldText(asText(value)));
        case "in":
            return Array.isArray(value) && value.some((v) => asText(raw) === asText(v));
        case "not-in":
            return !(Array.isArray(value) && value.some((v) => asText(raw) === asText(v)));
        default:
            break;
    }
    // Comparisons: numbers numerically, dates and everything else as text (ISO dates sort as text).
    // A missing or non-numeric cell can satisfy only the negated comparisons: it is never `gt` or `between` anything, but it is not equal either.
    const left: number | string = type === "number" ? Number(raw) : asText(raw);
    const a: number | string = type === "number" ? Number(value) : asText(value);
    const b: number | string = type === "number" ? Number(value2) : asText(value2);
    if (isBlank(raw) || (typeof left === "number" && Number.isNaN(left)))
        return operator === "not-equals" || operator === "not-between";
    switch (operator) {
        case "equals":
            return type === "text"
                ? foldText(left as string) === foldText(a as string)
                : left === a;
        case "not-equals":
            return type === "text"
                ? foldText(left as string) !== foldText(a as string)
                : left !== a;
        case "gt":
            return left > a;
        case "gte":
            return left >= a;
        case "lt":
            return left < a;
        case "lte":
            return left <= a;
        case "between":
            return left >= a && left <= b;
        case "not-between":
            return left < a || left > b;
        default:
            return false;
    }
}

/** A function that says whether a row (a record by field id) passes. An empty filter passes every row. */
export function toPredicate(
    group: FilterGroup,
    fields: readonly FilterField[],
): (row: Record<string, unknown>) => boolean {
    const tree = normalise(group, fields);
    if (!tree) return () => true;
    const byId = new Map(fields.map((f) => [f.id, f]));
    // Three-valued: a partial-date comparison can be "cannot tell" (null), which `and`, `or` and `not` keep (Kleene logic), and a
    // row matches only when the whole filter is true. Every other rule is true or false, so a filter without one is unchanged.
    const test = (node: FilterNode, row: Record<string, unknown>): boolean | null => {
        if (node.type === "rule") {
            // The `!` is safe: `normalise` has already dropped every rule whose field is not declared.
            const field = byId.get(node.field)!;
            if (!isPartialComparison(node, field)) return ruleMatches(node, field, row);
            const rails = partialDateRails(node);
            const raw = row[field.id];
            if (partialDateHolds(rails.whenTrue, raw)) return true;
            return partialDateHolds(rails.whenFalse, raw) ? false : null;
        }
        // Every child is evaluated (no short-circuit), which is harmless: matching has no side effects and a group is small.
        const results = node.children.map((c) => test(c, row));
        const ok =
            node.combinator === "and"
                ? results.includes(false)
                    ? false
                    : results.includes(null)
                      ? null
                      : true
                : results.includes(true)
                  ? true
                  : results.includes(null)
                    ? null
                    : false;
        return node.not && ok !== null ? !ok : ok;
    };
    return (row) => test(tree, row) === true;
}

// ---------------------------------------------------------------------
// JSON
// ---------------------------------------------------------------------

export type FilterJson =
    | { field: string; operator: FilterOperator; value?: unknown; value2?: unknown }
    | { combinator: FilterCombinator; not?: true; rules: FilterJson[] };

/** The filter as plain, id-free JSON that `fromJson` reads back. Incomplete rules are left out. `null` when nothing is left. */
export function toJson(group: FilterGroup, fields: readonly FilterField[]): FilterJson | null {
    const tree = normalise(group, fields);
    if (!tree) return null;
    const write = (g: FilterGroup): FilterJson => ({
        combinator: g.combinator,
        ...(g.not ? { not: true as const } : {}),
        rules: g.children.map((c): FilterJson => {
            if (c.type === "group") return write(c);
            const out: {
                field: string;
                operator: FilterOperator;
                value?: unknown;
                value2?: unknown;
            } = { field: c.field, operator: c.operator };
            const arity = valueArity(c.operator);
            if (arity !== 0) out.value = c.value;
            if (arity === 2) out.value2 = c.value2;
            return out;
        }),
    });
    return write(tree);
}

/** Read `toJson` output back into a tree with fresh ids. Anything that is not a valid rule for `fields` is reported, not guessed at. */
export function fromJson(
    json: unknown,
    fields: readonly FilterField[],
): { group: FilterGroup; errors: string[] } {
    const errors: string[] = [];
    const read = (node: unknown, path: string): FilterNode | null => {
        if (typeof node !== "object" || node === null) {
            errors.push(`${path}: not an object`);
            return null;
        }
        const o = node as {
            rules?: unknown;
            combinator?: unknown;
            not?: unknown;
            field?: unknown;
            operator?: unknown;
            value?: unknown;
            value2?: unknown;
        };
        // A node with a `rules` array is a group; a missing combinator means `and`, any other word is an error rather than a guess.
        if (Array.isArray(o.rules)) {
            const combinator =
                o.combinator === "or"
                    ? "or"
                    : o.combinator === "and" || o.combinator === undefined
                      ? "and"
                      : null;
            if (!combinator) {
                errors.push(`${path}: unknown combinator`);
                return null;
            }
            const children = o.rules
                .map((r, i) => read(r, `${path}.rules[${i}]`))
                .filter((c): c is FilterNode => c !== null);
            return {
                ...createGroup(combinator, children),
                ...(o.not === true ? { not: true } : {}),
            };
        }
        if (typeof o.field === "string" && typeof o.operator === "string") {
            const rule: FilterRule = {
                type: "rule",
                id: newId("r"),
                field: o.field,
                operator: o.operator as FilterOperator,
                value: o.value,
                value2: o.value2,
            };
            // Imported rules are held to the same checks as typed ones, so a hand-edited file cannot smuggle in an undeclared field or operator.
            const issue = ruleIssue(rule, fields);
            if (issue) {
                errors.push(`${path}: ${issue}`);
                return null;
            }
            return rule;
        }
        errors.push(`${path}: neither a rule nor a group`);
        return null;
    };
    // A bare rule at the top is wrapped in a group; a failed read gives an empty filter and the errors say why.
    const root = read(json, "$");
    if (root && root.type === "group") return { group: root, errors };
    return { group: root ? createGroup("and", [root]) : EMPTY_FILTER(), errors };
}

// ---------------------------------------------------------------------
// SQL
// ---------------------------------------------------------------------

export type SqlDialect = "ansi" | "postgres" | "mysql" | "sqlite" | "mssql";

export type SqlOptions = {
    /** Default `ansi`. Sets identifier quoting, the placeholder style, case-insensitive matching and boolean literals. */
    dialect?: SqlDialect;
    /** Put the values into the text instead of returning them as parameters. For showing, logging and debugging — never for running against a database. */
    inline?: boolean;
};

export type SqlResult = { sql: string; params: unknown[] };

/** Whether any rule under `node` is a partial-date comparison, so the node needs both rails written. */
function hasPartialComparison(node: FilterNode, byId: Map<string, FilterField>): boolean {
    return node.type === "rule"
        ? isPartialComparison(node, byId.get(node.field))
        : node.children.some((c) => hasPartialComparison(c, byId));
}

/**
 * Both rails of a node, lazily: `whenTrue()` and `whenFalse()` write the condition that the node is definitely true or
 * definitely false. Each is called at most once, so an output that numbers its parameters binds only what it writes. A group
 * joins its children's rails (Kleene logic: "and" is true when all are and false when any is); `not` swaps them. A rule that is
 * not a partial-date comparison is two-valued, so its false rail is its own negation.
 */
type Rails<T> = { whenTrue: () => T; whenFalse: () => T };

function writeRails<T>(
    node: FilterNode,
    byId: Map<string, FilterField>,
    out: {
        plainRule: (r: FilterRule) => T;
        plainGroup: (g: FilterGroup) => T;
        negate: (x: T) => T;
        join: (parts: T[], combinator: FilterCombinator) => T;
        condition: (c: PartialDateCondition, field: FilterField) => T;
    },
): Rails<T> {
    if (node.type === "rule") {
        const field = byId.get(node.field)!;
        if (isPartialComparison(node, field)) {
            const rails = partialDateRails(node);
            return {
                whenTrue: () => out.condition(rails.whenTrue, field),
                whenFalse: () => out.condition(rails.whenFalse, field),
            };
        }
        return {
            whenTrue: () => out.plainRule(node),
            whenFalse: () => out.negate(out.plainRule(node)),
        };
    }
    if (!hasPartialComparison(node, byId))
        return {
            whenTrue: () => out.plainGroup(node),
            whenFalse: () => out.negate(out.plainGroup(node)),
        };
    const children = node.children.map((c) => writeRails(c, byId, out));
    const other: FilterCombinator = node.combinator === "and" ? "or" : "and";
    const rails: Rails<T> = {
        whenTrue: () =>
            out.join(
                children.map((c) => c.whenTrue()),
                node.combinator,
            ),
        whenFalse: () =>
            out.join(
                children.map((c) => c.whenFalse()),
                other,
            ),
    };
    return node.not ? { whenTrue: rails.whenFalse, whenFalse: rails.whenTrue } : rails;
}

/**
 * The comparison a set of relations makes. `boundRails` gives an atom one or two relations, never all three, and every list
 * it builds has at least one member, so the writers below need no case for "any text of that length" or for an empty list.
 */
function relationOperator(relations: ("<" | "=" | ">")[]): "<" | "=" | ">" | "<=" | ">=" | "<>" {
    const has = (r: "<" | "=" | ">") => relations.includes(r);
    if (has("<") && has("=")) return "<=";
    if (has(">") && has("=")) return ">=";
    if (has("<") && has(">")) return "<>";
    return has("<") ? "<" : has(">") ? ">" : "=";
}

// The LIKE pattern for a partial date's text length: `_` is any one character, so it needs no escape clause.
const LENGTH_PATTERN: Record<PartialLength, string> = { 4: "____", 7: "____-__", 10: "____-__-__" };

// The only text that is ever written into SQL besides operators: a column name, so it must be a plain (optionally dotted) identifier.
// With that rule the quote character can never appear inside the name, so no escaping of the quotes is needed.
const IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*$/;

function quoteIdentifier(name: string, dialect: SqlDialect): string {
    if (!IDENTIFIER.test(name))
        throw new FilterError(`not a plain SQL identifier: ${JSON.stringify(name)}`);
    const open = dialect === "mysql" ? "`" : dialect === "mssql" ? "[" : '"';
    const close = dialect === "mysql" ? "`" : dialect === "mssql" ? "]" : '"';
    return name
        .split(".")
        .map((part) => open + part + close)
        .join(".");
}

// `%` and `_` are LIKE wildcards and `\` is the escape character itself, so a user's "50%" matches a literal percent sign.
const escapeLike = (text: string): string => text.replace(/[\\%_]/g, (c) => `\\${c}`);

function sqlLiteral(value: unknown): string {
    if (value === null || value === undefined) return "NULL";
    if (typeof value === "number") return String(value);
    // Booleans are written 1/0 in every dialect (SQL Server has no `TRUE` literal). Inline text is for display only, so a PostgreSQL boolean column is not accommodated.
    if (typeof value === "boolean") return value ? "1" : "0";
    return `'${String(value).replace(/'/g, "''")}'`;
}

/**
 * The filter as the condition of a SQL `WHERE` clause (without the word) and its parameters. Values are always parameters unless
 * `inline`; column names come only from the declared fields and must be plain identifiers; `LIKE` text is escaped. An empty filter is `{ sql: "", params: [] }`.
 */
export function toSql(
    group: FilterGroup,
    fields: readonly FilterField[],
    options: SqlOptions = {},
): SqlResult {
    const { dialect = "ansi", inline = false } = options;
    const tree = normalise(group, fields);
    if (!tree) return { sql: "", params: [] };
    const byId = new Map(fields.map((f) => [f.id, f]));
    const params: unknown[] = [];
    const bind = (value: unknown): string => {
        if (inline) return sqlLiteral(value);
        // SQLite and SQL Server have no boolean parameter type, so a boolean is sent as 1 or 0.
        params.push(
            typeof value === "boolean" && (dialect === "mssql" || dialect === "sqlite")
                ? value
                    ? 1
                    : 0
                : value,
        );
        // The placeholder is numbered after the push, so it is the parameter's 1-based position.
        return dialect === "postgres"
            ? `$${params.length}`
            : dialect === "mssql"
              ? `@p${params.length}`
              : "?";
    };
    // MySQL reads a backslash in a string literal as an escape itself, so its ESCAPE character is written twice.
    const escapeClause = dialect === "mysql" ? "ESCAPE '\\\\'" : "ESCAPE '\\'";
    // Case-insensitive match: PostgreSQL has ILIKE; the others lower-case both sides, which also works wherever the collation is case-sensitive.
    const like = (column: string, pattern: string, negate: boolean): string => {
        const op = negate ? "NOT LIKE" : "LIKE";
        if (dialect === "postgres")
            return `${column} ${negate ? "NOT ILIKE" : "ILIKE"} ${bind(pattern)} ${escapeClause}`;
        return `LOWER(${column}) ${op} LOWER(${bind(pattern)}) ${escapeClause}`;
    };
    const rule = (r: FilterRule): string => {
        const field = byId.get(r.field)!;
        const column = quoteIdentifier(field.column ?? field.id, dialect);
        const type = fieldType(field);
        const v = r.value;
        switch (r.operator) {
            case "contains":
                return like(column, `%${escapeLike(String(v))}%`, false);
            case "not-contains":
                return like(column, `%${escapeLike(String(v))}%`, true);
            case "starts-with":
                return like(column, `${escapeLike(String(v))}%`, false);
            case "ends-with":
                return like(column, `%${escapeLike(String(v))}`, false);
            // Text equality ignores case, to agree with the in-memory predicate; other types compare exactly.
            case "equals":
                return type === "text"
                    ? `LOWER(${column}) = LOWER(${bind(v)})`
                    : `${column} = ${bind(v)}`;
            case "not-equals":
                return type === "text"
                    ? `LOWER(${column}) <> LOWER(${bind(v)})`
                    : `${column} <> ${bind(v)}`;
            case "gt":
                return `${column} > ${bind(v)}`;
            case "gte":
                return `${column} >= ${bind(v)}`;
            case "lt":
                return `${column} < ${bind(v)}`;
            case "lte":
                return `${column} <= ${bind(v)}`;
            case "between":
                return `${column} BETWEEN ${bind(v)} AND ${bind(r.value2)}`;
            case "not-between":
                return `${column} NOT BETWEEN ${bind(v)} AND ${bind(r.value2)}`;
            case "in":
                return `${column} IN (${(v as unknown[]).map(bind).join(", ")})`;
            case "not-in":
                return `${column} NOT IN (${(v as unknown[]).map(bind).join(", ")})`;
            // For text, "empty" means null or the empty string, as in the predicate; for other types only null can be empty.
            case "is-empty":
                return type === "text" || type === "partial-date"
                    ? `(${column} IS NULL OR ${column} = '')`
                    : `${column} IS NULL`;
            case "is-not-empty":
                return type === "text" || type === "partial-date"
                    ? `(${column} IS NOT NULL AND ${column} <> '')`
                    : `${column} IS NOT NULL`;
            case "is-true":
                return `${column} = ${bind(true)}`;
            case "is-false":
                return `${column} = ${bind(false)}`;
        }
    };
    const write = (g: FilterGroup, top: boolean): string => {
        const parts = g.children.map((c) => (c.type === "rule" ? rule(c) : write(c, false)));
        const joined = parts.join(g.combinator === "and" ? " AND " : " OR ");
        // Parentheses only where precedence needs them: a negated group always, a nested group of several parts, never the top level.
        if (g.not) return `NOT (${joined})`;
        return parts.length > 1 && !top ? `(${joined})` : joined;
    };
    if (!hasPartialComparison(tree, byId)) return { sql: write(tree, true), params };
    const condition = (c: PartialDateCondition, field: FilterField): string => {
        const column = quoteIdentifier(field.column ?? field.id, dialect);
        if ("blank" in c) return `(${column} IS NULL OR ${column} = '')`;
        if ("atom" in c) {
            const op = relationOperator(c.atom.relations);
            const shape = `${column} LIKE '${LENGTH_PATTERN[c.atom.length]}'`;
            return `(${shape} AND ${column} ${op} ${bind(c.atom.key)})`;
        }
        const list = "any" in c ? c.any : c.all;
        const parts = list.map((x) => condition(x, field));
        return parts.length === 1 ? parts[0] : `(${parts.join("any" in c ? " OR " : " AND ")})`;
    };
    const rails = writeRails<string>(tree, byId, {
        plainRule: rule,
        plainGroup: (g) => write(g, false),
        negate: (x) => `NOT (${x})`,
        join: (parts, combinator) =>
            parts.length === 1
                ? parts[0]
                : `(${parts.join(combinator === "and" ? " AND " : " OR ")})`,
        condition,
    });
    return { sql: rails.whenTrue(), params };
}

// ---------------------------------------------------------------------
// MongoDB
// ---------------------------------------------------------------------

// Escape every regex metacharacter, so user text is matched literally.
const escapeRegex = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The filter as a MongoDB query document. An empty filter is `{}`. */
export function toMongo(
    group: FilterGroup,
    fields: readonly FilterField[],
): Record<string, unknown> {
    const tree = normalise(group, fields);
    if (!tree) return {};
    const byId = new Map(fields.map((f) => [f.id, f]));
    const rule = (r: FilterRule): Record<string, unknown> => {
        const field = byId.get(r.field)!;
        const key = field.column ?? field.id;
        const type = fieldType(field);
        const v = r.value;
        const regex = (source: string) => ({ $regex: source, $options: "i" });
        switch (r.operator) {
            case "contains":
                return { [key]: regex(escapeRegex(String(v))) };
            // `$not` wraps an operator expression or a RegExp, not the `$regex` / `$options` pair, so the case-insensitive flag goes on a RegExp here.
            case "not-contains":
                return { [key]: { $not: new RegExp(escapeRegex(String(v)), "i") } };
            case "starts-with":
                return { [key]: regex(`^${escapeRegex(String(v))}`) };
            case "ends-with":
                return { [key]: regex(`${escapeRegex(String(v))}$`) };
            case "equals":
                return { [key]: v };
            case "not-equals":
                return { [key]: { $ne: v } };
            case "gt":
                return { [key]: { $gt: v } };
            case "gte":
                return { [key]: { $gte: v } };
            case "lt":
                return { [key]: { $lt: v } };
            case "lte":
                return { [key]: { $lte: v } };
            case "between":
                return { [key]: { $gte: v, $lte: r.value2 } };
            // No single operator means "outside a range", so it is two comparisons joined by `$or`.
            case "not-between":
                return { $or: [{ [key]: { $lt: v } }, { [key]: { $gt: r.value2 } }] };
            case "in":
                return { [key]: { $in: v } };
            case "not-in":
                return { [key]: { $nin: v } };
            case "is-empty":
                return type === "text" || type === "partial-date"
                    ? { $or: [{ [key]: null }, { [key]: "" }] }
                    : { [key]: null };
            case "is-not-empty":
                return type === "text" || type === "partial-date"
                    ? { $and: [{ [key]: { $ne: null } }, { [key]: { $ne: "" } }] }
                    : { [key]: { $ne: null } };
            case "is-true":
                return { [key]: true };
            case "is-false":
                return { [key]: false };
        }
    };
    const write = (g: FilterGroup): Record<string, unknown> => {
        const parts = g.children.map((c) => (c.type === "rule" ? rule(c) : write(c)));
        // A lone child needs no `$and` / `$or` wrapper. MongoDB has no top-level `$not`, so a negated group is `$nor` of one document.
        const body =
            parts.length === 1 ? parts[0] : { [g.combinator === "and" ? "$and" : "$or"]: parts };
        return g.not ? { $nor: [body] } : body;
    };
    if (!hasPartialComparison(tree, byId)) return write(tree);
    const MONGO_OP = { "<": "$lt", ">": "$gt", "<=": "$lte", ">=": "$gte", "<>": "$ne" } as const;
    const condition = (c: PartialDateCondition, field: FilterField): Record<string, unknown> => {
        const key = field.column ?? field.id;
        if ("blank" in c) return { $or: [{ [key]: null }, { [key]: "" }] };
        if ("atom" in c) {
            const op = relationOperator(c.atom.relations);
            const shape = { [key]: { $regex: `^.{${c.atom.length}}$` } };
            const compare =
                op === "=" ? { [key]: c.atom.key } : { [key]: { [MONGO_OP[op]]: c.atom.key } };
            return { $and: [shape, compare] };
        }
        const list = "any" in c ? c.any : c.all;
        const parts = list.map((x) => condition(x, field));
        return parts.length === 1 ? parts[0] : { ["any" in c ? "$or" : "$and"]: parts };
    };
    const rails = writeRails<Record<string, unknown>>(tree, byId, {
        plainRule: rule,
        plainGroup: write,
        negate: (x) => ({ $nor: [x] }),
        join: (parts, combinator) =>
            parts.length === 1 ? parts[0] : { [combinator === "and" ? "$and" : "$or"]: parts },
        condition,
    });
    return rails.whenTrue();
}

// ---------------------------------------------------------------------
// OData
// ---------------------------------------------------------------------

// An OData string literal is single-quoted, with a quote inside doubled.
const odataString = (v: unknown): string => `'${String(v).replace(/'/g, "''")}'`;

/** The filter as an OData `$filter` expression. An empty filter is `""`. */
export function toOData(group: FilterGroup, fields: readonly FilterField[]): string {
    const tree = normalise(group, fields);
    if (!tree) return "";
    const byId = new Map(fields.map((f) => [f.id, f]));
    const rule = (r: FilterRule): string => {
        const field = byId.get(r.field)!;
        const name = field.column ?? field.id;
        const type = fieldType(field);
        // Numbers and dates are written bare (a date is the ISO `YYYY-MM-DD` literal, Edm.Date); everything else, option ids included, is a quoted string.
        const lit = (v: unknown): string =>
            type === "number" ? String(v) : type === "date" ? String(v) : odataString(v);
        const v = r.value;
        switch (r.operator) {
            case "contains":
                return `contains(tolower(${name}),tolower(${odataString(v)}))`;
            case "not-contains":
                return `not contains(tolower(${name}),tolower(${odataString(v)}))`;
            case "starts-with":
                return `startswith(tolower(${name}),tolower(${odataString(v)}))`;
            case "ends-with":
                return `endswith(tolower(${name}),tolower(${odataString(v)}))`;
            case "equals":
                return `${name} eq ${lit(v)}`;
            case "not-equals":
                return `${name} ne ${lit(v)}`;
            case "gt":
                return `${name} gt ${lit(v)}`;
            case "gte":
                return `${name} ge ${lit(v)}`;
            case "lt":
                return `${name} lt ${lit(v)}`;
            case "lte":
                return `${name} le ${lit(v)}`;
            case "between":
                return `(${name} ge ${lit(v)} and ${name} le ${lit(r.value2)})`;
            case "not-between":
                return `(${name} lt ${lit(v)} or ${name} gt ${lit(r.value2)})`;
            // The `in` operator needs OData 4.01 or later; a 4.0 service would need an `or` chain instead.
            case "in":
                return `${name} in (${(v as unknown[]).map(lit).join(",")})`;
            case "not-in":
                return `not (${name} in (${(v as unknown[]).map(lit).join(",")}))`;
            case "is-empty":
                return type === "text" || type === "partial-date"
                    ? `(${name} eq null or ${name} eq '')`
                    : `${name} eq null`;
            case "is-not-empty":
                return type === "text" || type === "partial-date"
                    ? `(${name} ne null and ${name} ne '')`
                    : `${name} ne null`;
            case "is-true":
                return `${name} eq true`;
            case "is-false":
                return `${name} eq false`;
        }
    };
    const write = (g: FilterGroup, top: boolean): string => {
        const parts = g.children.map((c) => (c.type === "rule" ? rule(c) : write(c, false)));
        const joined = parts.join(g.combinator === "and" ? " and " : " or ");
        if (g.not) return `not (${joined})`;
        return parts.length > 1 && !top ? `(${joined})` : joined;
    };
    if (!hasPartialComparison(tree, byId)) return write(tree, true);
    const ODATA_OP = {
        "<": "lt",
        ">": "gt",
        "=": "eq",
        "<=": "le",
        ">=": "ge",
        "<>": "ne",
    } as const;
    const condition = (c: PartialDateCondition, field: FilterField): string => {
        const name = field.column ?? field.id;
        if ("blank" in c) return `(${name} eq null or ${name} eq '')`;
        if ("atom" in c) {
            const op = relationOperator(c.atom.relations);
            const shape = `length(${name}) eq ${c.atom.length}`;
            return `(${shape} and ${name} ${ODATA_OP[op]} ${odataString(c.atom.key)})`;
        }
        const list = "any" in c ? c.any : c.all;
        const parts = list.map((x) => condition(x, field));
        return parts.length === 1 ? parts[0] : `(${parts.join("any" in c ? " or " : " and ")})`;
    };
    const rails = writeRails<string>(tree, byId, {
        plainRule: rule,
        plainGroup: (g) => write(g, false),
        negate: (x) => `not (${x})`,
        join: (parts, combinator) =>
            parts.length === 1
                ? parts[0]
                : `(${parts.join(combinator === "and" ? " and " : " or ")})`,
        condition,
    });
    return rails.whenTrue();
}

// ---------------------------------------------------------------------
// One call for display
// ---------------------------------------------------------------------

export type FilterOutputFormat = "json" | "sql" | "mongo" | "odata";

/** The filter as text in `format`, for showing or copying. SQL shows its values inline (display only). */
export function formatFilter(
    group: FilterGroup,
    fields: readonly FilterField[],
    format: FilterOutputFormat,
    dialect: SqlDialect = "ansi",
): string {
    // Inline SQL is what makes the text readable on screen; it is never the form to send to a database, hence `toSql` defaults to parameters.
    switch (format) {
        case "json":
            return JSON.stringify(toJson(group, fields), null, 2);
        case "sql":
            return toSql(group, fields, { dialect, inline: true }).sql;
        case "mongo":
            return JSON.stringify(toMongo(group, fields), null, 2);
        case "odata":
            return toOData(group, fields);
    }
}
