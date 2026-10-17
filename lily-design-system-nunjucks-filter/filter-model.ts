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

export type FilterFieldType = "text" | "number" | "date" | "select" | "boolean";

export type FilterOperator =
    | "contains" | "not-contains" | "equals" | "not-equals" | "starts-with" | "ends-with"
    | "gt" | "gte" | "lt" | "lte" | "between" | "not-between"
    | "in" | "not-in"
    | "is-empty" | "is-not-empty"
    | "is-true" | "is-false";

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
    text: ["contains", "not-contains", "equals", "not-equals", "starts-with", "ends-with", "is-empty", "is-not-empty"],
    number: ["equals", "not-equals", "gt", "gte", "lt", "lte", "between", "not-between", "is-empty", "is-not-empty"],
    date: ["equals", "not-equals", "gt", "gte", "lt", "lte", "between", "not-between", "is-empty", "is-not-empty"],
    select: ["equals", "not-equals", "in", "not-in", "is-empty", "is-not-empty"],
    boolean: ["is-true", "is-false", "is-empty", "is-not-empty"],
};

/** Every operator id, so an app can check that its `labels.operatorName` names them all in each language. */
export const ALL_OPERATORS: readonly FilterOperator[] = [
    "contains", "not-contains", "equals", "not-equals", "starts-with", "ends-with",
    "gt", "gte", "lt", "lte", "between", "not-between", "in", "not-in",
    "is-empty", "is-not-empty", "is-true", "is-false",
];

export const fieldType = (field: FilterField | undefined): FilterFieldType => field?.type ?? "text";

/** The operators a field offers, in order. */
export function operatorsFor(field: FilterField | undefined): FilterOperator[] {
    return field?.operators?.length ? field.operators : OPERATORS_BY_TYPE[fieldType(field)];
}

/** How many values an operator takes: none, one, two (a range) or a list. */
export function valueArity(operator: FilterOperator): 0 | 1 | 2 | "many" {
    switch (operator) {
        case "is-empty": case "is-not-empty": case "is-true": case "is-false":
            return 0;
        case "between": case "not-between":
            return 2;
        case "in": case "not-in":
            return "many";
        default:
            return 1;
    }
}

// ---------------------------------------------------------------------
// Building and editing (immutable)
// ---------------------------------------------------------------------

let counter = 0;
/** A node id, unique in this page's lifetime. */
export const newId = (prefix = "n"): string => `${prefix}${++counter}`;

export function createRule(fields: readonly FilterField[], fieldId?: string): FilterRule {
    const field = fields.find((f) => f.id === fieldId) ?? fields[0];
    return { type: "rule", id: newId("r"), field: field?.id ?? "", operator: operatorsFor(field)[0] ?? "contains" };
}

export const createGroup = (combinator: FilterCombinator = "and", children: FilterNode[] = []): FilterGroup => ({ type: "group", id: newId("g"), combinator, children });

export const EMPTY_FILTER = (): FilterGroup => createGroup("and");

/** Replace the node with `id` by `change(node)` (return `null` to delete it). The rest of the tree is shared, not copied. */
export function updateNode(root: FilterGroup, id: string, change: (node: FilterNode) => FilterNode | null): FilterGroup {
    if (root.id === id) {
        const next = change(root);
        return next && next.type === "group" ? next : root;
    }
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

export const removeNode = (root: FilterGroup, id: string): FilterGroup => updateNode(root, id, () => null);

/** Add `node` at the end of the group `parentId` (the root when it is not found). */
export function addNode(root: FilterGroup, parentId: string, node: FilterNode): FilterGroup {
    return updateNode(root, parentId, (g) => (g.type === "group" ? { ...g, children: [...g.children, node] } : g));
}

/** A rule with another field: its operator resets to that field's first when the old one does not apply, and its values clear. */
export function changeField(rule: FilterRule, fields: readonly FilterField[], fieldId: string): FilterRule {
    const field = fields.find((f) => f.id === fieldId);
    const operators = operatorsFor(field);
    return { ...rule, field: fieldId, operator: operators.includes(rule.operator) ? rule.operator : (operators[0] ?? rule.operator), value: undefined, value2: undefined };
}

/** A rule with another operator: values it no longer needs are dropped, and a list is kept only for `in`. */
export function changeOperator(rule: FilterRule, operator: FilterOperator): FilterRule {
    const arity = valueArity(operator);
    const wasMany = valueArity(rule.operator) === "many";
    return {
        ...rule,
        operator,
        value: arity === 0 ? undefined : arity === "many" ? (wasMany ? rule.value : undefined) : wasMany ? undefined : rule.value,
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
    const t = new Date(Date.UTC(y, mo - 1, d));
    return t.getUTCFullYear() === y && t.getUTCMonth() === mo - 1 && t.getUTCDate() === d;
}

const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export type RuleIssue = "unknown-field" | "unknown-operator" | "missing-value" | "invalid-value" | "range-order" | "unknown-option";

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
        if (type === "date") return isIsoDate(v) ? undefined : "invalid-value";
        if (type === "select") return typeof v === "string" && (field.options ?? []).some((o) => o.id === v) ? undefined : "unknown-option";
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
// Predicate (filter rows in memory)
// ---------------------------------------------------------------------

const asText = (v: unknown): string => (v === null || v === undefined ? "" : String(v));
const isBlank = (v: unknown): boolean => v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0);

function ruleMatches(rule: FilterRule, field: FilterField, row: Record<string, unknown>): boolean {
    const raw = row[field.id];
    const type = fieldType(field);
    const { operator, value, value2 } = rule;
    switch (operator) {
        case "is-empty": return isBlank(raw);
        case "is-not-empty": return !isBlank(raw);
        case "is-true": return raw === true;
        case "is-false": return raw === false;
        case "contains": return foldText(asText(raw)).includes(foldText(asText(value)));
        case "not-contains": return !foldText(asText(raw)).includes(foldText(asText(value)));
        case "starts-with": return foldText(asText(raw)).startsWith(foldText(asText(value)));
        case "ends-with": return foldText(asText(raw)).endsWith(foldText(asText(value)));
        case "in": return Array.isArray(value) && value.some((v) => asText(raw) === asText(v));
        case "not-in": return !(Array.isArray(value) && value.some((v) => asText(raw) === asText(v)));
        default: break;
    }
    // Comparisons: numbers numerically, dates and everything else as text (ISO dates sort as text).
    const left: number | string = type === "number" ? Number(raw) : asText(raw);
    const a: number | string = type === "number" ? Number(value) : asText(value);
    const b: number | string = type === "number" ? Number(value2) : asText(value2);
    if (isBlank(raw) || (typeof left === "number" && Number.isNaN(left))) return operator === "not-equals" || operator === "not-between";
    switch (operator) {
        case "equals": return type === "text" ? foldText(left as string) === foldText(a as string) : left === a;
        case "not-equals": return type === "text" ? foldText(left as string) !== foldText(a as string) : left !== a;
        case "gt": return left > a;
        case "gte": return left >= a;
        case "lt": return left < a;
        case "lte": return left <= a;
        case "between": return left >= a && left <= b;
        case "not-between": return left < a || left > b;
        default: return false;
    }
}

/** A function that says whether a row (a record by field id) passes. An empty filter passes every row. */
export function toPredicate(group: FilterGroup, fields: readonly FilterField[]): (row: Record<string, unknown>) => boolean {
    const tree = normalise(group, fields);
    if (!tree) return () => true;
    const byId = new Map(fields.map((f) => [f.id, f]));
    const test = (node: FilterNode, row: Record<string, unknown>): boolean => {
        if (node.type === "rule") return ruleMatches(node, byId.get(node.field)!, row);
        const results = node.children.map((c) => test(c, row));
        const ok = node.combinator === "and" ? results.every(Boolean) : results.some(Boolean);
        return node.not ? !ok : ok;
    };
    return (row) => test(tree, row);
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
            const out: { field: string; operator: FilterOperator; value?: unknown; value2?: unknown } = { field: c.field, operator: c.operator };
            const arity = valueArity(c.operator);
            if (arity !== 0) out.value = c.value;
            if (arity === 2) out.value2 = c.value2;
            return out;
        }),
    });
    return write(tree);
}

/** Read `toJson` output back into a tree with fresh ids. Anything that is not a valid rule for `fields` is reported, not guessed at. */
export function fromJson(json: unknown, fields: readonly FilterField[]): { group: FilterGroup; errors: string[] } {
    const errors: string[] = [];
    const read = (node: unknown, path: string): FilterNode | null => {
        if (typeof node !== "object" || node === null) {
            errors.push(`${path}: not an object`);
            return null;
        }
        const o = node as { rules?: unknown; combinator?: unknown; not?: unknown; field?: unknown; operator?: unknown; value?: unknown; value2?: unknown };
        if (Array.isArray(o.rules)) {
            const combinator = o.combinator === "or" ? "or" : o.combinator === "and" || o.combinator === undefined ? "and" : null;
            if (!combinator) {
                errors.push(`${path}: unknown combinator`);
                return null;
            }
            const children = o.rules.map((r, i) => read(r, `${path}.rules[${i}]`)).filter((c): c is FilterNode => c !== null);
            return { ...createGroup(combinator, children), ...(o.not === true ? { not: true } : {}) };
        }
        if (typeof o.field === "string" && typeof o.operator === "string") {
            const rule: FilterRule = { type: "rule", id: newId("r"), field: o.field, operator: o.operator as FilterOperator, value: o.value, value2: o.value2 };
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

const IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*$/;

function quoteIdentifier(name: string, dialect: SqlDialect): string {
    if (!IDENTIFIER.test(name)) throw new FilterError(`not a plain SQL identifier: ${JSON.stringify(name)}`);
    const open = dialect === "mysql" ? "`" : dialect === "mssql" ? "[" : '"';
    const close = dialect === "mysql" ? "`" : dialect === "mssql" ? "]" : '"';
    return name.split(".").map((part) => open + part + close).join(".");
}

const escapeLike = (text: string): string => text.replace(/[\\%_]/g, (c) => `\\${c}`);

function sqlLiteral(value: unknown): string {
    if (value === null || value === undefined) return "NULL";
    if (typeof value === "number") return String(value);
    if (typeof value === "boolean") return value ? "1" : "0";
    return `'${String(value).replace(/'/g, "''")}'`;
}

/**
 * The filter as the condition of a SQL `WHERE` clause (without the word) and its parameters. Values are always parameters unless
 * `inline`; column names come only from the declared fields and must be plain identifiers; `LIKE` text is escaped. An empty filter is `{ sql: "", params: [] }`.
 */
export function toSql(group: FilterGroup, fields: readonly FilterField[], options: SqlOptions = {}): SqlResult {
    const { dialect = "ansi", inline = false } = options;
    const tree = normalise(group, fields);
    if (!tree) return { sql: "", params: [] };
    const byId = new Map(fields.map((f) => [f.id, f]));
    const params: unknown[] = [];
    const bind = (value: unknown): string => {
        if (inline) return sqlLiteral(value);
        params.push(typeof value === "boolean" && (dialect === "mssql" || dialect === "sqlite") ? (value ? 1 : 0) : value);
        return dialect === "postgres" ? `$${params.length}` : dialect === "mssql" ? `@p${params.length}` : "?";
    };
    // MySQL reads a backslash in a string literal as an escape itself, so its ESCAPE character is written twice.
    const escapeClause = dialect === "mysql" ? "ESCAPE '\\\\'" : "ESCAPE '\\'";
    const like = (column: string, pattern: string, negate: boolean): string => {
        const op = negate ? "NOT LIKE" : "LIKE";
        if (dialect === "postgres") return `${column} ${negate ? "NOT ILIKE" : "ILIKE"} ${bind(pattern)} ${escapeClause}`;
        return `LOWER(${column}) ${op} LOWER(${bind(pattern)}) ${escapeClause}`;
    };
    const rule = (r: FilterRule): string => {
        const field = byId.get(r.field)!;
        const column = quoteIdentifier(field.column ?? field.id, dialect);
        const type = fieldType(field);
        const v = r.value;
        switch (r.operator) {
            case "contains": return like(column, `%${escapeLike(String(v))}%`, false);
            case "not-contains": return like(column, `%${escapeLike(String(v))}%`, true);
            case "starts-with": return like(column, `${escapeLike(String(v))}%`, false);
            case "ends-with": return like(column, `%${escapeLike(String(v))}`, false);
            case "equals": return type === "text" ? `LOWER(${column}) = LOWER(${bind(v)})` : `${column} = ${bind(v)}`;
            case "not-equals": return type === "text" ? `LOWER(${column}) <> LOWER(${bind(v)})` : `${column} <> ${bind(v)}`;
            case "gt": return `${column} > ${bind(v)}`;
            case "gte": return `${column} >= ${bind(v)}`;
            case "lt": return `${column} < ${bind(v)}`;
            case "lte": return `${column} <= ${bind(v)}`;
            case "between": return `${column} BETWEEN ${bind(v)} AND ${bind(r.value2)}`;
            case "not-between": return `${column} NOT BETWEEN ${bind(v)} AND ${bind(r.value2)}`;
            case "in": return `${column} IN (${(v as unknown[]).map(bind).join(", ")})`;
            case "not-in": return `${column} NOT IN (${(v as unknown[]).map(bind).join(", ")})`;
            case "is-empty": return type === "text" ? `(${column} IS NULL OR ${column} = '')` : `${column} IS NULL`;
            case "is-not-empty": return type === "text" ? `(${column} IS NOT NULL AND ${column} <> '')` : `${column} IS NOT NULL`;
            case "is-true": return `${column} = ${bind(true)}`;
            case "is-false": return `${column} = ${bind(false)}`;
        }
    };
    const write = (g: FilterGroup, top: boolean): string => {
        const parts = g.children.map((c) => (c.type === "rule" ? rule(c) : write(c, false)));
        const joined = parts.join(g.combinator === "and" ? " AND " : " OR ");
        if (g.not) return `NOT (${joined})`;
        return parts.length > 1 && !top ? `(${joined})` : joined;
    };
    return { sql: write(tree, true), params };
}

// ---------------------------------------------------------------------
// MongoDB
// ---------------------------------------------------------------------

const escapeRegex = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The filter as a MongoDB query document. An empty filter is `{}`. */
export function toMongo(group: FilterGroup, fields: readonly FilterField[]): Record<string, unknown> {
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
            case "contains": return { [key]: regex(escapeRegex(String(v))) };
            case "not-contains": return { [key]: { $not: new RegExp(escapeRegex(String(v)), "i") } };
            case "starts-with": return { [key]: regex(`^${escapeRegex(String(v))}`) };
            case "ends-with": return { [key]: regex(`${escapeRegex(String(v))}$`) };
            case "equals": return { [key]: v };
            case "not-equals": return { [key]: { $ne: v } };
            case "gt": return { [key]: { $gt: v } };
            case "gte": return { [key]: { $gte: v } };
            case "lt": return { [key]: { $lt: v } };
            case "lte": return { [key]: { $lte: v } };
            case "between": return { [key]: { $gte: v, $lte: r.value2 } };
            case "not-between": return { $or: [{ [key]: { $lt: v } }, { [key]: { $gt: r.value2 } }] };
            case "in": return { [key]: { $in: v } };
            case "not-in": return { [key]: { $nin: v } };
            case "is-empty": return type === "text" ? { $or: [{ [key]: null }, { [key]: "" }] } : { [key]: null };
            case "is-not-empty": return type === "text" ? { $and: [{ [key]: { $ne: null } }, { [key]: { $ne: "" } }] } : { [key]: { $ne: null } };
            case "is-true": return { [key]: true };
            case "is-false": return { [key]: false };
        }
    };
    const write = (g: FilterGroup): Record<string, unknown> => {
        const parts = g.children.map((c) => (c.type === "rule" ? rule(c) : write(c)));
        const body = parts.length === 1 ? parts[0] : { [g.combinator === "and" ? "$and" : "$or"]: parts };
        return g.not ? { $nor: [body] } : body;
    };
    return write(tree);
}

// ---------------------------------------------------------------------
// OData
// ---------------------------------------------------------------------

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
        const lit = (v: unknown): string => (type === "number" ? String(v) : type === "date" ? String(v) : odataString(v));
        const v = r.value;
        switch (r.operator) {
            case "contains": return `contains(tolower(${name}),tolower(${odataString(v)}))`;
            case "not-contains": return `not contains(tolower(${name}),tolower(${odataString(v)}))`;
            case "starts-with": return `startswith(tolower(${name}),tolower(${odataString(v)}))`;
            case "ends-with": return `endswith(tolower(${name}),tolower(${odataString(v)}))`;
            case "equals": return `${name} eq ${lit(v)}`;
            case "not-equals": return `${name} ne ${lit(v)}`;
            case "gt": return `${name} gt ${lit(v)}`;
            case "gte": return `${name} ge ${lit(v)}`;
            case "lt": return `${name} lt ${lit(v)}`;
            case "lte": return `${name} le ${lit(v)}`;
            case "between": return `(${name} ge ${lit(v)} and ${name} le ${lit(r.value2)})`;
            case "not-between": return `(${name} lt ${lit(v)} or ${name} gt ${lit(r.value2)})`;
            case "in": return `${name} in (${(v as unknown[]).map(lit).join(",")})`;
            case "not-in": return `not (${name} in (${(v as unknown[]).map(lit).join(",")}))`;
            case "is-empty": return type === "text" ? `(${name} eq null or ${name} eq '')` : `${name} eq null`;
            case "is-not-empty": return type === "text" ? `(${name} ne null and ${name} ne '')` : `${name} ne null`;
            case "is-true": return `${name} eq true`;
            case "is-false": return `${name} eq false`;
        }
    };
    const write = (g: FilterGroup, top: boolean): string => {
        const parts = g.children.map((c) => (c.type === "rule" ? rule(c) : write(c, false)));
        const joined = parts.join(g.combinator === "and" ? " and " : " or ");
        if (g.not) return `not (${joined})`;
        return parts.length > 1 && !top ? `(${joined})` : joined;
    };
    return write(tree, true);
}

// ---------------------------------------------------------------------
// One call for display
// ---------------------------------------------------------------------

export type FilterOutputFormat = "json" | "sql" | "mongo" | "odata";

/** The filter as text in `format`, for showing or copying. SQL shows its values inline (display only). */
export function formatFilter(group: FilterGroup, fields: readonly FilterField[], format: FilterOutputFormat, dialect: SqlDialect = "ansi"): string {
    switch (format) {
        case "json": return JSON.stringify(toJson(group, fields), null, 2);
        case "sql": return toSql(group, fields, { dialect, inline: true }).sql;
        case "mongo": return JSON.stringify(toMongo(group, fields), null, 2);
        case "odata": return toOData(group, fields);
    }
}
