<script lang="ts" module>
    import type { FilterField, FilterGroup, FilterOperator, FilterOutputFormat, FilterRule, SqlDialect } from "./filter-model";

    /**
     * Every string the filter shows. There are no English defaults: the consumer supplies all of it, in its own language.
     * The functions take the ordinal the user sees (1 = first) so a screen reader hears "Condition 2" rather than the same name twice.
     */
    export type FilterLabels = {
        /** Names a condition: "Condition 2". Wraps its controls in a labelled group. */
        rule: (n: number) => string;
        /** Names a group: "Group, level 2" (depth 1 is the whole filter). */
        group: (depth: number) => string;
        /** The field select. */
        field: string;
        /** The operator select. */
        operator: string;
        /** What an operator is called: ("contains", the field it applies to). */
        operatorName: (operator: FilterOperator, field: FilterField) => string;
        /** The single value, and the list of choices for "is one of". */
        value: string;
        /** The two ends of a range ("between"). */
        valueFrom: string;
        valueTo: string;
        /** The and / or select, and its two options. */
        combinator: string;
        and: string;
        or: string;
        /** The checkbox that negates a group. */
        not: string;
        addRule: string;
        addGroup: string;
        /** Remove buttons: (the condition's number) and (the group's depth). */
        removeRule: (n: number) => string;
        removeGroup: (depth: number) => string;
        /** What is offered before a choice is made in a select. */
        choose?: string;
        /** Shown in an empty group. */
        empty?: string;
        /** Names the output. Gates it (with `format`). */
        output?: string;
        /** Announced: after a condition is added or removed (its number), after a group is added or removed. */
        ruleAdded?: (n: number) => string;
        ruleRemoved?: (n: number) => string;
        groupAdded?: (depth: number) => string;
        groupRemoved?: (depth: number) => string;
    };

    export type Props = {
        /** Accessible name of the whole filter. */
        label: string;
        /** What can be filtered on. */
        fields: FilterField[];
        /** The filter: a group of conditions and groups. Two-way bindable; every change is a new object, never a mutation. */
        value?: FilterGroup;
        /** Called with the new filter after every change. */
        onChange?: (group: FilterGroup) => void;
        labels: FilterLabels;
        /** Show the filter written out in this format under the builder (JSON, SQL, MongoDB or OData). Needs `labels.output`. */
        format?: FilterOutputFormat;
        /** SQL dialect for `format="sql"`. Default `ansi`. */
        dialect?: SqlDialect;
        /** The deepest group nesting offered (1 = no nested groups). Default 3. */
        maxDepth?: number;
        /** Show the filter without letting it be edited. */
        readonly?: boolean;
        class?: string;
        [key: string]: unknown;
    };
</script>

<script lang="ts">
    import { tick } from "svelte";
    import {
        EMPTY_FILTER, addNode, changeField, changeOperator, createGroup, createRule, fieldType, formatFilter, operatorsFor, removeNode, updateNode, valueArity,
    } from "./filter-model";

    let {
        label,
        fields,
        value = $bindable(EMPTY_FILTER()),
        onChange = undefined,
        labels,
        format = undefined,
        dialect = "ansi",
        maxDepth = 3,
        readonly = false,
        class: className = "",
        ...restProps
    }: Props = $props();

    let statusMessage = $state("");
    let rootEl: HTMLDivElement | undefined = $state();

    const fieldById = $derived(new Map(fields.map((f) => [f.id, f])));
    const output = $derived(format && labels.output ? formatFilter(value, fields, format, dialect) : "");

    function commit(next: FilterGroup): void {
        value = next;
        onChange?.(next);
    }

    function announce(message: string | undefined): void {
        if (message) statusMessage = message;
    }

    /** The number the user sees for a rule: its place in reading order across the whole filter. */
    const ruleNumbers = $derived.by(() => {
        const numbers = new Map<string, number>();
        let n = 0;
        const walk = (g: FilterGroup) => {
            for (const child of g.children) {
                if (child.type === "rule") numbers.set(child.id, ++n);
                else walk(child);
            }
        };
        walk(value);
        return numbers;
    });

    async function focusField(ruleId: string): Promise<void> {
        await tick();
        rootEl?.querySelector<HTMLElement>(`[data-filter-field="${ruleId}"]`)?.focus();
    }

    async function focusButton(selector: string): Promise<void> {
        await tick();
        rootEl?.querySelector<HTMLElement>(selector)?.focus();
    }

    function addRule(groupId: string): void {
        if (readonly || fields.length === 0) return;
        const rule = createRule(fields);
        commit(addNode(value, groupId, rule));
        announce(labels.ruleAdded?.(ruleNumbers.get(rule.id) ?? ruleNumbers.size));
        void focusField(rule.id);
    }

    function addGroup(parentId: string, depth: number): void {
        if (readonly || depth >= maxDepth) return;
        const group = createGroup("and", fields.length ? [createRule(fields)] : []);
        commit(addNode(value, parentId, group));
        announce(labels.groupAdded?.(depth + 1));
        const first = group.children[0];
        if (first) void focusField(first.id);
    }

    function removeRuleById(rule: FilterRule, groupId: string): void {
        if (readonly) return;
        const n = ruleNumbers.get(rule.id) ?? 0;
        commit(removeNode(value, rule.id));
        announce(labels.ruleRemoved?.(n));
        void focusButton(`[data-filter-add-rule="${groupId}"]`);
    }

    function removeGroupById(group: FilterGroup, parentId: string, depth: number): void {
        if (readonly) return;
        commit(removeNode(value, group.id));
        announce(labels.groupRemoved?.(depth));
        void focusButton(`[data-filter-add-rule="${parentId}"]`);
    }

    const setRule = (id: string, change: (rule: FilterRule) => FilterRule): void => {
        if (readonly) return;
        commit(updateNode(value, id, (node) => (node.type === "rule" ? change(node) : node)));
    };

    const setGroup = (id: string, change: (group: FilterGroup) => FilterGroup): void => {
        if (readonly) return;
        commit(updateNode(value, id, (node) => (node.type === "group" ? change(node) : node)));
    };

    /** A text field's value, a number input's number (undefined when empty), or a date: what the rule stores for what was typed. */
    function parseTyped(type: string, raw: string): unknown {
        if (raw === "") return undefined;
        return type === "number" ? Number(raw) : raw;
    }

    const textOf = (v: unknown): string => (v === undefined || v === null || (typeof v === "number" && Number.isNaN(v)) ? "" : String(v));

    function toggleOption(rule: FilterRule, optionId: string, checked: boolean): void {
        const current = Array.isArray(rule.value) ? (rule.value as string[]) : [];
        const next = checked ? [...current.filter((v) => v !== optionId), optionId] : current.filter((v) => v !== optionId);
        setRule(rule.id, (r) => ({ ...r, value: next.length ? next : undefined }));
    }
</script>

{#snippet valueEditor(rule: FilterRule, field: FilterField)}
    {@const type = fieldType(field)}
    {@const arity = valueArity(rule.operator)}
    {#if arity === 1 || arity === 2}
        {#if type === "select"}
            <select class="filter-value" aria-label={labels.value} disabled={readonly} value={textOf(rule.value)} onchange={(e) => setRule(rule.id, (r) => ({ ...r, value: parseTyped("text", e.currentTarget.value) }))}>
                <option value="">{labels.choose ?? ""}</option>
                {#each field.options ?? [] as option (option.id)}
                    <option value={option.id}>{option.label}</option>
                {/each}
            </select>
        {:else}
            <input
                class="filter-value"
                type={type === "number" ? "number" : type === "date" ? "date" : "text"}
                inputmode={type === "number" ? "decimal" : undefined}
                aria-label={arity === 2 ? labels.valueFrom : labels.value}
                readonly={readonly}
                value={textOf(rule.value)}
                oninput={(e) => setRule(rule.id, (r) => ({ ...r, value: parseTyped(type, e.currentTarget.value) }))}
            />
            {#if arity === 2}
                <input
                    class="filter-value filter-value-to"
                    type={type === "number" ? "number" : type === "date" ? "date" : "text"}
                    inputmode={type === "number" ? "decimal" : undefined}
                    aria-label={labels.valueTo}
                    readonly={readonly}
                    value={textOf(rule.value2)}
                    oninput={(e) => setRule(rule.id, (r) => ({ ...r, value2: parseTyped(type, e.currentTarget.value) }))}
                />
            {/if}
        {/if}
    {:else if arity === "many"}
        <div class="filter-choices" role="group" aria-label={labels.value}>
            {#each field.options ?? [] as option (option.id)}
                <label class="filter-choice">
                    <input type="checkbox" disabled={readonly} checked={Array.isArray(rule.value) && rule.value.includes(option.id)} onchange={(e) => toggleOption(rule, option.id, e.currentTarget.checked)} />
                    {option.label}
                </label>
            {/each}
        </div>
    {/if}
{/snippet}

{#snippet groupView(group: FilterGroup, depth: number, parentId: string | null)}
    <div class="filter-group" role="group" aria-label={labels.group(depth)} data-depth={depth} data-group-id={group.id}>
        <div class="filter-group-header">
            <select class="filter-combinator" aria-label={labels.combinator} disabled={readonly} value={group.combinator} onchange={(e) => setGroup(group.id, (g) => ({ ...g, combinator: e.currentTarget.value === "or" ? "or" : "and" }))}>
                <option value="and">{labels.and}</option>
                <option value="or">{labels.or}</option>
            </select>
            <label class="filter-not">
                <input type="checkbox" disabled={readonly} checked={!!group.not} onchange={(e) => setGroup(group.id, (g) => ({ ...g, not: e.currentTarget.checked || undefined }))} />
                {labels.not}
            </label>
            {#if parentId !== null && !readonly}
                <button type="button" class="filter-remove-group-button" onclick={() => removeGroupById(group, parentId, depth)}>{labels.removeGroup(depth)}</button>
            {/if}
        </div>
        {#if group.children.length === 0 && labels.empty}
            <p class="filter-empty">{labels.empty}</p>
        {/if}
        <ul class="filter-rules">
            {#each group.children as child (child.id)}
                <li class="filter-item">
                    {#if child.type === "group"}
                        {@render groupView(child, depth + 1, group.id)}
                    {:else}
                        {@const field = fieldById.get(child.field)}
                        {@const n = ruleNumbers.get(child.id) ?? 0}
                        <div class="filter-rule" role="group" aria-label={labels.rule(n)} data-rule-id={child.id}>
                            <select class="filter-field" data-filter-field={child.id} aria-label={labels.field} disabled={readonly} value={child.field} onchange={(e) => setRule(child.id, (r) => changeField(r, fields, e.currentTarget.value))}>
                                {#each fields as f (f.id)}
                                    <option value={f.id}>{f.label}</option>
                                {/each}
                            </select>
                            {#if field}
                                <select class="filter-operator" aria-label={labels.operator} disabled={readonly} value={child.operator} onchange={(e) => setRule(child.id, (r) => changeOperator(r, e.currentTarget.value as FilterOperator))}>
                                    {#each operatorsFor(field) as op (op)}
                                        <option value={op}>{labels.operatorName(op, field)}</option>
                                    {/each}
                                </select>
                                {@render valueEditor(child, field)}
                            {/if}
                            {#if !readonly}
                                <button type="button" class="filter-remove-rule-button" onclick={() => removeRuleById(child, group.id)}>{labels.removeRule(n)}</button>
                            {/if}
                        </div>
                    {/if}
                </li>
            {/each}
        </ul>
        {#if !readonly}
            <div class="filter-group-actions">
                <button type="button" class="filter-add-rule-button" data-filter-add-rule={group.id} onclick={() => addRule(group.id)}>{labels.addRule}</button>
                {#if depth < maxDepth}
                    <button type="button" class="filter-add-group-button" onclick={() => addGroup(group.id, depth)}>{labels.addGroup}</button>
                {/if}
            </div>
        {/if}
    </div>
{/snippet}

<div bind:this={rootEl} class={`filter ${className}`.trim()} role="group" aria-label={label} data-readonly={readonly ? "" : undefined} {...restProps}>
    {@render groupView(value, 1, null)}
    {#if format && labels.output}
        <div class="filter-output" role="group" aria-label={labels.output} data-format={format}>
            <pre class="filter-output-text">{output}</pre>
        </div>
    {/if}
    <p class="filter-status" aria-live="polite">{statusMessage}</p>
</div>
