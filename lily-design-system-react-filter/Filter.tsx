import { useEffect, useId, useMemo, useRef, useState, type HTMLAttributes, type ReactElement } from "react";
import {
    EMPTY_FILTER, addNode, changeField, changeOperator, createGroup, createRule, fieldType, formatFilter, operatorsFor, removeNode, updateNode, valueArity,
    type FilterField, type FilterGroup, type FilterOperator, type FilterOutputFormat, type FilterRule, type SqlDialect,
} from "./filter-model";

/**
 * Every string the filter shows. There are no English defaults: the consumer supplies all of it, in its own language.
 * The functions take the ordinal the user sees (1 = first) so a screen reader hears "Condition 2" rather than the same name twice.
 */
export type FilterLabels = {
    /** Names a condition: "Condition 2". Wraps its controls in a labelled group. */
    rule: (n: number) => string;
    /** Names a group: "Group, level 2" (depth 1 is the whole filter). */
    group: (depth: number) => string;
    field: string;
    operator: string;
    /** What an operator is called: ("contains", the field it applies to). */
    operatorName: (operator: FilterOperator, field: FilterField) => string;
    value: string;
    valueFrom: string;
    valueTo: string;
    combinator: string;
    and: string;
    or: string;
    /** The checkbox that negates a group. */
    not: string;
    addRule: string;
    addGroup: string;
    removeRule: (n: number) => string;
    removeGroup: (depth: number) => string;
    /** What is offered before a choice is made in a select. */
    choose?: string;
    /** Shown in an empty group. */
    empty?: string;
    /** Names the output. Gates it (with `format`). */
    output?: string;
    ruleAdded?: (n: number) => string;
    ruleRemoved?: (n: number) => string;
    groupAdded?: (depth: number) => string;
    groupRemoved?: (depth: number) => string;
};

export type FilterProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
    /** Accessible name of the whole filter. */
    label: string;
    /** What can be filtered on. */
    fields: FilterField[];
    /** Controlled filter. Every change is a new object, never a mutation. */
    value?: FilterGroup;
    /** Uncontrolled starting filter. */
    defaultValue?: FilterGroup;
    /** Called with the new filter after every change. */
    onChange?: (group: FilterGroup) => void;
    labels: FilterLabels;
    /** Show the filter written out in this format under the builder. Needs `labels.output`. */
    format?: FilterOutputFormat;
    /** SQL dialect for `format="sql"`. Default `ansi`. */
    dialect?: SqlDialect;
    /** The deepest group nesting offered (1 = no nested groups). Default 3. */
    maxDepth?: number;
    /** Show the filter without letting it be edited. */
    readonly?: boolean;
    className?: string;
};

/** A text field's value, a number input's number (undefined when empty), or a date: what the rule stores for what was typed. */
function parseTyped(type: string, raw: string): unknown {
    if (raw === "") return undefined;
    return type === "number" ? Number(raw) : raw;
}

const textOf = (v: unknown): string => (v === undefined || v === null || (typeof v === "number" && Number.isNaN(v)) ? "" : String(v));

export function Filter({
    label, fields, value: controlled, defaultValue, onChange, labels, format, dialect = "ansi", maxDepth = 3, readonly = false, className = "", ...rest
}: FilterProps): ReactElement {
    const [inner, setInner] = useState<FilterGroup>(() => defaultValue ?? EMPTY_FILTER());
    const value = controlled ?? inner;
    const [status, setStatus] = useState("");
    const rootRef = useRef<HTMLDivElement>(null);
    const pendingFocus = useRef<string | null>(null);
    const id = useId();

    const fieldById = useMemo(() => new Map(fields.map((f) => [f.id, f])), [fields]);
    const output = format && labels.output ? formatFilter(value, fields, format, dialect) : "";

    const ruleNumbers = useMemo(() => numberRules(value), [value]);

    // Focus moves after the render that creates its target.
    useEffect(() => {
        const selector = pendingFocus.current;
        if (!selector) return;
        pendingFocus.current = null;
        rootRef.current?.querySelector<HTMLElement>(selector)?.focus();
    });

    function commit(next: FilterGroup): void {
        if (controlled === undefined) setInner(next);
        onChange?.(next);
    }

    const announce = (message: string | undefined): void => {
        if (message) setStatus(message);
    };

    function addRule(groupId: string): void {
        if (readonly || fields.length === 0) return;
        const rule = createRule(fields);
        const next = addNode(value, groupId, rule);
        commit(next);
        announce(labels.ruleAdded?.(numberRules(next).get(rule.id) ?? 0));
        pendingFocus.current = `[data-filter-field="${rule.id}"]`;
    }

    function addGroup(parentId: string, depth: number): void {
        if (readonly || depth >= maxDepth) return;
        const group = createGroup("and", fields.length ? [createRule(fields)] : []);
        commit(addNode(value, parentId, group));
        announce(labels.groupAdded?.(depth + 1));
        const first = group.children[0];
        if (first) pendingFocus.current = `[data-filter-field="${first.id}"]`;
    }

    function removeRuleById(rule: FilterRule, groupId: string): void {
        if (readonly) return;
        const n = ruleNumbers.get(rule.id) ?? 0;
        commit(removeNode(value, rule.id));
        announce(labels.ruleRemoved?.(n));
        pendingFocus.current = `[data-filter-add-rule="${groupId}"]`;
    }

    function removeGroupById(group: FilterGroup, parentId: string, depth: number): void {
        if (readonly) return;
        commit(removeNode(value, group.id));
        announce(labels.groupRemoved?.(depth));
        pendingFocus.current = `[data-filter-add-rule="${parentId}"]`;
    }

    const setRule = (ruleId: string, change: (rule: FilterRule) => FilterRule): void => {
        if (readonly) return;
        commit(updateNode(value, ruleId, (node) => (node.type === "rule" ? change(node) : node)));
    };

    const setGroup = (groupId: string, change: (group: FilterGroup) => FilterGroup): void => {
        if (readonly) return;
        commit(updateNode(value, groupId, (node) => (node.type === "group" ? change(node) : node)));
    };

    function toggleOption(rule: FilterRule, optionId: string, checked: boolean): void {
        const current = Array.isArray(rule.value) ? (rule.value as string[]) : [];
        const next = checked ? [...current.filter((v) => v !== optionId), optionId] : current.filter((v) => v !== optionId);
        setRule(rule.id, (r) => ({ ...r, value: next.length ? next : undefined }));
    }

    function valueEditor(rule: FilterRule, field: FilterField): ReactElement | null {
        const type = fieldType(field);
        const arity = valueArity(rule.operator);
        if (arity === 1 || arity === 2) {
            if (type === "select") {
                return (
                    <select className="filter-value" aria-label={labels.value} disabled={readonly} value={textOf(rule.value)} onChange={(e) => setRule(rule.id, (r) => ({ ...r, value: parseTyped("text", e.target.value) }))}>
                        <option value="">{labels.choose ?? ""}</option>
                        {(field.options ?? []).map((option) => (
                            <option key={option.id} value={option.id}>{option.label}</option>
                        ))}
                    </select>
                );
            }
            const inputType = type === "number" ? "number" : type === "date" ? "date" : "text";
            return (
                <>
                    <input
                        className="filter-value"
                        type={inputType}
                        inputMode={type === "number" ? "decimal" : undefined}
                        aria-label={arity === 2 ? labels.valueFrom : labels.value}
                        readOnly={readonly}
                        value={textOf(rule.value)}
                        onChange={(e) => setRule(rule.id, (r) => ({ ...r, value: parseTyped(type, e.target.value) }))}
                    />
                    {arity === 2 && (
                        <input
                            className="filter-value filter-value-to"
                            type={inputType}
                            inputMode={type === "number" ? "decimal" : undefined}
                            aria-label={labels.valueTo}
                            readOnly={readonly}
                            value={textOf(rule.value2)}
                            onChange={(e) => setRule(rule.id, (r) => ({ ...r, value2: parseTyped(type, e.target.value) }))}
                        />
                    )}
                </>
            );
        }
        if (arity === "many") {
            return (
                <div className="filter-choices" role="group" aria-label={labels.value}>
                    {(field.options ?? []).map((option) => (
                        <label key={option.id} className="filter-choice">
                            <input type="checkbox" disabled={readonly} checked={Array.isArray(rule.value) && rule.value.includes(option.id)} onChange={(e) => toggleOption(rule, option.id, e.target.checked)} />
                            {option.label}
                        </label>
                    ))}
                </div>
            );
        }
        return null;
    }

    function groupView(group: FilterGroup, depth: number, parentId: string | null): ReactElement {
        return (
            <div className="filter-group" role="group" aria-label={labels.group(depth)} data-depth={depth} data-group-id={group.id}>
                <div className="filter-group-header">
                    <select className="filter-combinator" aria-label={labels.combinator} disabled={readonly} value={group.combinator} onChange={(e) => setGroup(group.id, (g) => ({ ...g, combinator: e.target.value === "or" ? "or" : "and" }))}>
                        <option value="and">{labels.and}</option>
                        <option value="or">{labels.or}</option>
                    </select>
                    <label className="filter-not">
                        <input type="checkbox" disabled={readonly} checked={!!group.not} onChange={(e) => setGroup(group.id, (g) => ({ ...g, not: e.target.checked || undefined }))} />
                        {labels.not}
                    </label>
                    {parentId !== null && !readonly && (
                        <button type="button" className="filter-remove-group-button" onClick={() => removeGroupById(group, parentId, depth)}>{labels.removeGroup(depth)}</button>
                    )}
                </div>
                {group.children.length === 0 && labels.empty && <p className="filter-empty">{labels.empty}</p>}
                <ul className="filter-rules">
                    {group.children.map((child) => (
                        <li key={child.id} className="filter-item">
                            {child.type === "group" ? groupView(child, depth + 1, group.id) : ruleView(child, group)}
                        </li>
                    ))}
                </ul>
                {!readonly && (
                    <div className="filter-group-actions">
                        <button type="button" className="filter-add-rule-button" data-filter-add-rule={group.id} onClick={() => addRule(group.id)}>{labels.addRule}</button>
                        {depth < maxDepth && (
                            <button type="button" className="filter-add-group-button" onClick={() => addGroup(group.id, depth)}>{labels.addGroup}</button>
                        )}
                    </div>
                )}
            </div>
        );
    }

    function ruleView(rule: FilterRule, group: FilterGroup): ReactElement {
        const field = fieldById.get(rule.field);
        const n = ruleNumbers.get(rule.id) ?? 0;
        return (
            <div className="filter-rule" role="group" aria-label={labels.rule(n)} data-rule-id={rule.id}>
                <select className="filter-field" data-filter-field={rule.id} aria-label={labels.field} disabled={readonly} value={rule.field} onChange={(e) => setRule(rule.id, (r) => changeField(r, fields, e.target.value))}>
                    {fields.map((f) => (
                        <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                </select>
                {field && (
                    <>
                        <select className="filter-operator" aria-label={labels.operator} disabled={readonly} value={rule.operator} onChange={(e) => setRule(rule.id, (r) => changeOperator(r, e.target.value as FilterOperator))}>
                            {operatorsFor(field).map((op) => (
                                <option key={op} value={op}>{labels.operatorName(op, field)}</option>
                            ))}
                        </select>
                        {valueEditor(rule, field)}
                    </>
                )}
                {!readonly && (
                    <button type="button" className="filter-remove-rule-button" onClick={() => removeRuleById(rule, group.id)}>{labels.removeRule(n)}</button>
                )}
            </div>
        );
    }

    return (
        <div ref={rootRef} id={id} className={`filter ${className}`.trim()} role="group" aria-label={label} data-readonly={readonly ? "" : undefined} {...rest}>
            {groupView(value, 1, null)}
            {format && labels.output && (
                <div className="filter-output" role="group" aria-label={labels.output} data-format={format}>
                    <pre className="filter-output-text">{output}</pre>
                </div>
            )}
            <p className="filter-status" aria-live="polite">{status}</p>
        </div>
    );
}

/** The number the user sees for each rule: its place in reading order across the whole filter. */
function numberRules(root: FilterGroup): Map<string, number> {
    const numbers = new Map<string, number>();
    let n = 0;
    const walk = (g: FilterGroup) => {
        for (const child of g.children) {
            if (child.type === "rule") numbers.set(child.id, ++n);
            else walk(child);
        }
    };
    walk(root);
    return numbers;
}

export default Filter;
