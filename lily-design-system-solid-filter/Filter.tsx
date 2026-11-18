import type { JSX } from "@solidjs/web";
import {
    createMemo,
    createSignal,
    createUniqueId,
    flush,
    For,
    omit,
    onSettled,
    Show,
    untrack,
} from "solid-js";
import {
    EMPTY_FILTER,
    addNode,
    changeField,
    changeOperator,
    createGroup,
    createRule,
    fieldType,
    formatFilter,
    operatorsFor,
    removeNode,
    updateNode,
    valueArity,
    type FilterField,
    type FilterGroup,
    type FilterOperator,
    type FilterOutputFormat,
    type FilterRule,
    type SqlDialect,
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

export type FilterProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
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
    class?: string;
};

/** A text field's value, a number input's number (undefined when empty), or a date: what the rule stores for what was typed. */
function parseTyped(type: string, raw: string): unknown {
    if (raw === "") return undefined;
    return type === "number" ? Number(raw) : raw;
}

const textOf = (v: unknown): string =>
    v === undefined || v === null || (typeof v === "number" && Number.isNaN(v)) ? "" : String(v);

export function Filter(props: FilterProps): JSX.Element {
    const rest = omit(
        props,
        "label",
        "fields",
        "value",
        "defaultValue",
        "onChange",
        "labels",
        "format",
        "dialect",
        "maxDepth",
        "readonly",
        "class",
    );
    const [inner, setInner] = createSignal<FilterGroup>(
        untrack(() => props.defaultValue ?? EMPTY_FILTER()),
    );
    const value = () => props.value ?? inner();
    const [status, setStatus] = createSignal("");
    // Bumped by a form reset: the browser has just put every field back to its value attribute, which Solid never
    // writes (it sets the property), so the controls are rebuilt from the filter.
    const [generation, setGeneration] = createSignal(0);
    let root: HTMLDivElement | undefined;
    const id = `filter-${createUniqueId()}`;

    const readonly = () => props.readonly ?? false;
    const maxDepth = () => props.maxDepth ?? 3;
    const fieldById = createMemo(() => new Map(props.fields.map((f) => [f.id, f])));
    const output = () =>
        props.format && props.labels.output
            ? formatFilter(value(), props.fields, props.format, props.dialect ?? "ansi")
            : "";
    const ruleNumbers = createMemo(() => numberRules(value()));

    // Focus moves once the DOM holds its target: apply the update first, then look it up.
    function focusAfter(selector: string): void {
        flush();
        root?.querySelector<HTMLElement>(selector)?.focus();
    }

    function commit(next: FilterGroup): void {
        if (props.value === undefined) setInner(next);
        props.onChange?.(next);
    }

    // Form reset (tasks.md P10-T9): the fields are bound to the filter, so inside a <form> the browser's reset only
    // clears them.
    // Put back the filter it started with, one tick after the reset and not when a listener cancelled it, and tell
    // the consumer, as an edit would. Same as the Svelte reference.
    const initialValue = untrack(value);
    onSettled(() => {
        const form = root?.closest("form");
        if (!form) return;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const onReset = (event: Event) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (event.defaultPrevented) return;
                commit(initialValue);
                setGeneration((g) => g + 1);
            }, 0);
        };
        form.addEventListener("reset", onReset);
        return () => {
            clearTimeout(timer);
            form.removeEventListener("reset", onReset);
        };
    });

    const announce = (message: string | undefined): void => {
        if (message) setStatus(message);
    };

    function addRule(groupId: string): void {
        if (readonly() || props.fields.length === 0) return;
        const rule = createRule(props.fields);
        const next = addNode(untrack(value), groupId, rule);
        commit(next);
        announce(props.labels.ruleAdded?.(numberRules(next).get(rule.id) ?? 0));
        focusAfter(`[data-filter-field="${rule.id}"]`);
    }

    function addGroup(parentId: string, depth: number): void {
        if (readonly() || depth >= maxDepth()) return;
        const group = createGroup("and", props.fields.length ? [createRule(props.fields)] : []);
        commit(addNode(untrack(value), parentId, group));
        announce(props.labels.groupAdded?.(depth + 1));
        const first = group.children[0];
        if (first) focusAfter(`[data-filter-field="${first.id}"]`);
    }

    function removeRuleById(rule: FilterRule, groupId: string): void {
        if (readonly()) return;
        const n = untrack(ruleNumbers).get(rule.id) ?? 0;
        commit(removeNode(untrack(value), rule.id));
        announce(props.labels.ruleRemoved?.(n));
        focusAfter(`[data-filter-add-rule="${groupId}"]`);
    }

    function removeGroupById(group: FilterGroup, parentId: string, depth: number): void {
        if (readonly()) return;
        commit(removeNode(untrack(value), group.id));
        announce(props.labels.groupRemoved?.(depth));
        focusAfter(`[data-filter-add-rule="${parentId}"]`);
    }

    const setRule = (ruleId: string, change: (rule: FilterRule) => FilterRule): void => {
        if (readonly()) return;
        commit(
            updateNode(untrack(value), ruleId, (node) =>
                node.type === "rule" ? change(node) : node,
            ),
        );
    };

    const setGroup = (groupId: string, change: (group: FilterGroup) => FilterGroup): void => {
        if (readonly()) return;
        commit(
            updateNode(untrack(value), groupId, (node) =>
                node.type === "group" ? change(node) : node,
            ),
        );
    };

    function toggleOption(rule: FilterRule, optionId: string, checked: boolean): void {
        const current = Array.isArray(rule.value) ? (rule.value as string[]) : [];
        const next = checked
            ? [...current.filter((v) => v !== optionId), optionId]
            : current.filter((v) => v !== optionId);
        setRule(rule.id, (r) => ({ ...r, value: next.length ? next : undefined }));
    }

    /**
     * The value editor for a rule. Every edit makes a new rule object, so the editor is rebuilt only when its shape
     * changes (the field's type or the operator's arity), never while the user types; the inputs read the rule.
     */
    function valueEditor(rule: () => FilterRule, field: () => FilterField): JSX.Element {
        const shape = createMemo(() => `${fieldType(field())}|${valueArity(rule().operator)}`);
        return (
            <>
                {(() => {
                    shape();
                    return untrack(() => {
                        const type = fieldType(field());
                        const arity = valueArity(rule().operator);
                        if (arity === 1 || arity === 2) {
                            if (type === "select") {
                                return (
                                    <select
                                        class="filter-value"
                                        aria-label={props.labels.value}
                                        disabled={readonly()}
                                        value={textOf(rule().value)}
                                        onChange={(e) =>
                                            setRule(rule().id, (r) => ({
                                                ...r,
                                                value: parseTyped("text", e.currentTarget.value),
                                            }))
                                        }
                                    >
                                        <option value="">{props.labels.choose ?? ""}</option>
                                        <For each={field().options ?? []}>
                                            {(option) => (
                                                <option value={option.id}>{option.label}</option>
                                            )}
                                        </For>
                                    </select>
                                );
                            }
                            const inputType =
                                type === "number" ? "number" : type === "date" ? "date" : "text";
                            return (
                                <>
                                    <input
                                        class="filter-value"
                                        type={inputType}
                                        inputmode={type === "number" ? "decimal" : undefined}
                                        aria-label={
                                            arity === 2
                                                ? props.labels.valueFrom
                                                : props.labels.value
                                        }
                                        readonly={readonly()}
                                        value={textOf(rule().value)}
                                        defaultValue={textOf(rule().value)}
                                        onInput={(e) =>
                                            setRule(rule().id, (r) => ({
                                                ...r,
                                                value: parseTyped(type, e.currentTarget.value),
                                            }))
                                        }
                                    />
                                    {arity === 2 && (
                                        <input
                                            class="filter-value filter-value-to"
                                            type={inputType}
                                            inputmode={type === "number" ? "decimal" : undefined}
                                            aria-label={props.labels.valueTo}
                                            readonly={readonly()}
                                            value={textOf(rule().value2)}
                                            defaultValue={textOf(rule().value2)}
                                            onInput={(e) =>
                                                setRule(rule().id, (r) => ({
                                                    ...r,
                                                    value2: parseTyped(type, e.currentTarget.value),
                                                }))
                                            }
                                        />
                                    )}
                                </>
                            );
                        }
                        if (arity === "many") {
                            return (
                                <div
                                    class="filter-choices"
                                    role="group"
                                    aria-label={props.labels.value}
                                >
                                    <For each={field().options ?? []}>
                                        {(option) => (
                                            <label class="filter-choice">
                                                <input
                                                    type="checkbox"
                                                    disabled={readonly()}
                                                    checked={
                                                        Array.isArray(rule().value) &&
                                                        (rule().value as string[]).includes(
                                                            option.id,
                                                        )
                                                    }
                                                    defaultChecked={
                                                        Array.isArray(rule().value) &&
                                                        (rule().value as string[]).includes(
                                                            option.id,
                                                        )
                                                    }
                                                    onChange={(e) =>
                                                        toggleOption(
                                                            rule(),
                                                            option.id,
                                                            e.currentTarget.checked,
                                                        )
                                                    }
                                                />
                                                {option.label}
                                            </label>
                                        )}
                                    </For>
                                </div>
                            );
                        }
                        return null;
                    });
                })()}
            </>
        );
    }

    function groupView(
        group: () => FilterGroup,
        depth: number,
        parentId: string | null,
    ): JSX.Element {
        return (
            <div
                class="filter-group"
                role="group"
                aria-label={props.labels.group(depth)}
                data-depth={depth}
                data-group-id={group().id}
            >
                <div class="filter-group-header">
                    <select
                        class="filter-combinator"
                        aria-label={props.labels.combinator}
                        disabled={readonly()}
                        value={group().combinator}
                        onChange={(e) =>
                            setGroup(group().id, (g) => ({
                                ...g,
                                combinator: e.currentTarget.value === "or" ? "or" : "and",
                            }))
                        }
                    >
                        <option value="and">{props.labels.and}</option>
                        <option value="or">{props.labels.or}</option>
                    </select>
                    <label class="filter-not">
                        <input
                            type="checkbox"
                            disabled={readonly()}
                            checked={!!group().not}
                            defaultChecked={!!group().not}
                            onChange={(e) =>
                                setGroup(group().id, (g) => ({
                                    ...g,
                                    not: e.currentTarget.checked || undefined,
                                }))
                            }
                        />
                        {props.labels.not}
                    </label>
                    <Show when={parentId !== null && !readonly()}>
                        <button
                            type="button"
                            class="filter-remove-group-button"
                            onClick={() => removeGroupById(group(), parentId as string, depth)}
                        >
                            {props.labels.removeGroup(depth)}
                        </button>
                    </Show>
                </div>
                <Show when={group().children.length === 0 && props.labels.empty}>
                    <p class="filter-empty">{props.labels.empty}</p>
                </Show>
                <ul class="filter-rules">
                    {/* Keyed by id: an edit replaces the node object, and its controls must stay (with focus). */}
                    <For
                        each={group().children}
                        keyed={(child) => child.id}
                    >
                        {(child) => (
                            <li class="filter-item">
                                {untrack(child).type === "group"
                                    ? groupView(
                                          () => child() as FilterGroup,
                                          depth + 1,
                                          untrack(group).id,
                                      )
                                    : ruleView(() => child() as FilterRule, group)}
                            </li>
                        )}
                    </For>
                </ul>
                <Show when={!readonly()}>
                    <div class="filter-group-actions">
                        <button
                            type="button"
                            class="filter-add-rule-button"
                            data-filter-add-rule={group().id}
                            onClick={() => addRule(group().id)}
                        >
                            {props.labels.addRule}
                        </button>
                        <Show when={depth < maxDepth()}>
                            <button
                                type="button"
                                class="filter-add-group-button"
                                onClick={() => addGroup(group().id, depth)}
                            >
                                {props.labels.addGroup}
                            </button>
                        </Show>
                    </div>
                </Show>
            </div>
        );
    }

    function ruleView(rule: () => FilterRule, group: () => FilterGroup): JSX.Element {
        const field = createMemo(() => fieldById().get(rule().field));
        const n = () => ruleNumbers().get(rule().id) ?? 0;
        return (
            <div
                class="filter-rule"
                role="group"
                aria-label={props.labels.rule(n())}
                data-rule-id={rule().id}
            >
                <select
                    class="filter-field"
                    data-filter-field={rule().id}
                    aria-label={props.labels.field}
                    disabled={readonly()}
                    value={rule().field}
                    onChange={(e) =>
                        setRule(rule().id, (r) =>
                            changeField(r, props.fields, e.currentTarget.value),
                        )
                    }
                >
                    <For each={props.fields}>{(f) => <option value={f.id}>{f.label}</option>}</For>
                </select>
                <Show when={field()}>
                    {(f) => (
                        <>
                            <select
                                class="filter-operator"
                                aria-label={props.labels.operator}
                                disabled={readonly()}
                                value={rule().operator}
                                onChange={(e) =>
                                    setRule(rule().id, (r) =>
                                        changeOperator(r, e.currentTarget.value as FilterOperator),
                                    )
                                }
                            >
                                <For each={operatorsFor(f())}>
                                    {(op) => (
                                        <option value={op}>
                                            {props.labels.operatorName(op, f())}
                                        </option>
                                    )}
                                </For>
                            </select>
                            {valueEditor(rule, f)}
                        </>
                    )}
                </Show>
                <Show when={!readonly()}>
                    <button
                        type="button"
                        class="filter-remove-rule-button"
                        onClick={() => removeRuleById(rule(), untrack(group).id)}
                    >
                        {props.labels.removeRule(n())}
                    </button>
                </Show>
            </div>
        );
    }

    return (
        <div
            ref={(el) => (root = el)}
            id={id}
            class={`filter ${props.class ?? ""}`.trim()}
            role="group"
            aria-label={props.label}
            data-readonly={readonly() ? "" : undefined}
            {...rest}
        >
            {(() => {
                generation();
                return untrack(() => groupView(value, 1, null));
            })()}
            <Show when={props.format && props.labels.output}>
                <div
                    class="filter-output"
                    role="group"
                    aria-label={props.labels.output}
                    data-format={props.format}
                >
                    <pre class="filter-output-text">{output()}</pre>
                </div>
            </Show>
            <p
                class="filter-status"
                aria-live="polite"
            >
                {status()}
            </p>
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
