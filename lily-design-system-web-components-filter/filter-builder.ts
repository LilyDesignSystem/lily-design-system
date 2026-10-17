/**
 * `<lily-filter-builder>` — Lily Design System HTML helper.
 *
 * See `./spec/index.md` for the contract; it ports the canonical Svelte filter. This file implements the custom-element
 * class but does NOT register it; the `index.ts` barrel registers it on import.
 *
 * A headless filter builder: the user composes conditions (a field, an operator, a value) into groups joined by and / or,
 * and the result is written out as JSON, SQL, MongoDB, OData or a predicate by the pure functions in `filter-model.ts`.
 * Light DOM, built with `document.createElement` only (never `innerHTML`). Typing in a value input does not rebuild the
 * markup (that would drop focus); every other edit does, and focus is put back on the control that had it.
 */
import {
    EMPTY_FILTER, addNode, changeField, changeOperator, createGroup, createRule, fieldType, formatFilter, operatorsFor, removeNode, updateNode, valueArity,
    type FilterField, type FilterGroup, type FilterNode, type FilterOperator, type FilterOutputFormat, type FilterRule, type SqlDialect,
} from "./filter-model.js";

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

/** A text field's value, a number input's number (undefined when empty), or a date: what the rule stores for what was typed. */
function parseTyped(type: string, raw: string): unknown {
    if (raw === "") return undefined;
    return type === "number" ? Number(raw) : raw;
}

const textOf = (v: unknown): string => (v === undefined || v === null || (typeof v === "number" && Number.isNaN(v)) ? "" : String(v));

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

type Attrs = Record<string, string | boolean | undefined>;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Attrs = {}, ...children: Array<Node | string | null | false>): HTMLElementTagNameMap[K] {
    const node = document.createElement(tag);
    for (const [name, value] of Object.entries(attrs)) {
        if (value === undefined || value === false) continue;
        node.setAttribute(name, value === true ? "" : value);
    }
    for (const child of children) {
        if (child === null || child === false) continue;
        node.append(typeof child === "string" ? document.createTextNode(child) : child);
    }
    return node;
}

export class FilterBuilder extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "format", "dialect", "max-depth", "readonly"];
    }

    #fields: FilterField[] = [];
    #labels: FilterLabels | undefined;
    #value: FilterGroup = EMPTY_FILTER();
    #onChange: ((group: FilterGroup) => void) | undefined;
    #status = "";
    #focusKey: string | null = null;

    // ---- Properties ----

    /** What can be filtered on. */
    get fields(): FilterField[] {
        return [...this.#fields];
    }
    set fields(v: FilterField[]) {
        this.#fields = Array.isArray(v) ? v.slice() : [];
        this.#render();
    }

    /** Every string the filter shows. Required: with none, nothing is rendered. */
    get labels(): FilterLabels | undefined {
        return this.#labels;
    }
    set labels(v: FilterLabels | undefined) {
        this.#labels = v;
        this.#render();
    }

    /** The filter. Every change is a new object, never a mutation. */
    get value(): FilterGroup {
        return this.#value;
    }
    set value(v: FilterGroup) {
        this.#value = v ?? EMPTY_FILTER();
        this.#render();
    }

    /** Called with the new filter after every change (the `filterchange` event carries it too). */
    get onChange(): ((group: FilterGroup) => void) | undefined {
        return this.#onChange;
    }
    set onChange(fn: ((group: FilterGroup) => void) | undefined) {
        this.#onChange = typeof fn === "function" ? fn : undefined;
    }

    /** Accessible name of the whole filter. */
    get label(): string {
        return this.getAttribute("label") ?? "";
    }
    set label(v: string) {
        this.setAttribute("label", v);
    }

    /** Show the filter written out in this format under the builder. Needs `labels.output`. */
    get format(): FilterOutputFormat | undefined {
        const f = this.getAttribute("format");
        return f === "json" || f === "sql" || f === "mongo" || f === "odata" ? f : undefined;
    }
    set format(v: FilterOutputFormat | undefined) {
        if (v) this.setAttribute("format", v);
        else this.removeAttribute("format");
    }

    /** SQL dialect for `format="sql"`. Default `ansi`. */
    get dialect(): SqlDialect {
        const d = this.getAttribute("dialect");
        return d === "postgres" || d === "mysql" || d === "sqlite" || d === "mssql" ? d : "ansi";
    }
    set dialect(v: SqlDialect) {
        this.setAttribute("dialect", v);
    }

    /** The deepest group nesting offered (1 = no nested groups). Default 3. */
    get maxDepth(): number {
        const n = Number(this.getAttribute("max-depth"));
        return this.hasAttribute("max-depth") && Number.isFinite(n) ? n : 3;
    }
    set maxDepth(v: number) {
        this.setAttribute("max-depth", String(v));
    }

    /** Show the filter without letting it be edited. */
    get readonly(): boolean {
        return this.hasAttribute("readonly");
    }
    set readonly(v: boolean) {
        this.toggleAttribute("readonly", !!v);
    }

    // ---- Lifecycle ----

    connectedCallback(): void {
        this.#render();
    }

    attributeChangedCallback(): void {
        this.#render();
    }

    // ---- Editing ----

    #commit(next: FilterGroup, rebuild = true): void {
        this.#value = next;
        this.#onChange?.(next);
        this.dispatchEvent(new CustomEvent<FilterGroup>("filterchange", { detail: next, bubbles: true, composed: true }));
        if (rebuild) this.#render();
        else this.#renderOutput();
    }

    #setRule(id: string, change: (rule: FilterRule) => FilterRule, rebuild = true): void {
        if (this.readonly) return;
        this.#commit(updateNode(this.#value, id, (node) => (node.type === "rule" ? change(node) : node)), rebuild);
    }

    #setGroup(id: string, change: (group: FilterGroup) => FilterGroup): void {
        if (this.readonly) return;
        this.#commit(updateNode(this.#value, id, (node) => (node.type === "group" ? change(node) : node)));
    }

    #addRule(groupId: string): void {
        if (this.readonly || this.#fields.length === 0 || !this.#labels) return;
        const rule = createRule(this.#fields);
        const next = addNode(this.#value, groupId, rule);
        this.#focusKey = `${rule.id}:field`;
        this.#status = this.#labels.ruleAdded?.(numberRules(next).get(rule.id) ?? 0) ?? this.#status;
        this.#commit(next);
    }

    #addGroup(parentId: string, depth: number): void {
        if (this.readonly || depth >= this.maxDepth || !this.#labels) return;
        const group = createGroup("and", this.#fields.length ? [createRule(this.#fields)] : []);
        const first = group.children[0];
        if (first) this.#focusKey = `${first.id}:field`;
        this.#status = this.#labels.groupAdded?.(depth + 1) ?? this.#status;
        this.#commit(addNode(this.#value, parentId, group));
    }

    #removeRule(rule: FilterRule, groupId: string): void {
        if (this.readonly || !this.#labels) return;
        const n = numberRules(this.#value).get(rule.id) ?? 0;
        this.#focusKey = `${groupId}:add-rule`;
        this.#status = this.#labels.ruleRemoved?.(n) ?? this.#status;
        this.#commit(removeNode(this.#value, rule.id));
    }

    #removeGroup(group: FilterGroup, parentId: string, depth: number): void {
        if (this.readonly || !this.#labels) return;
        this.#focusKey = `${parentId}:add-rule`;
        this.#status = this.#labels.groupRemoved?.(depth) ?? this.#status;
        this.#commit(removeNode(this.#value, group.id));
    }

    #toggleOption(rule: FilterRule, optionId: string, checked: boolean): void {
        const current = Array.isArray(rule.value) ? (rule.value as string[]) : [];
        const next = checked ? [...current.filter((v) => v !== optionId), optionId] : current.filter((v) => v !== optionId);
        this.#focusKey = `${rule.id}:choice:${optionId}`;
        this.#setRule(rule.id, (r) => ({ ...r, value: next.length ? next : undefined }));
    }

    // ---- Rendering ----

    /** The focus key of the control that has focus now, so a rebuild can give it back. */
    #activeKey(): string | null {
        const active = document.activeElement;
        return active && this.contains(active) ? active.getAttribute("data-focus-key") : null;
    }

    #render(): void {
        if (!this.isConnected) return;
        const labels = this.#labels;
        const keep = this.#focusKey ?? this.#activeKey();
        this.#focusKey = null;
        if (!labels) {
            this.replaceChildren();
            return;
        }
        const ruleNumbers = numberRules(this.#value);
        const fieldById = new Map(this.#fields.map((f) => [f.id, f]));
        const readonly = this.readonly;
        const maxDepth = this.maxDepth;

        const valueEditor = (rule: FilterRule, field: FilterField): Node[] => {
            const type = fieldType(field);
            const arity = valueArity(rule.operator);
            if (arity === 1 || arity === 2) {
                if (type === "select") {
                    const select = el("select", { class: "filter-value", "aria-label": labels.value, disabled: readonly, "data-focus-key": `${rule.id}:value` },
                        el("option", { value: "" }, labels.choose ?? ""),
                        ...(field.options ?? []).map((option) => el("option", { value: option.id }, option.label)));
                    select.value = textOf(rule.value);
                    select.addEventListener("change", () => this.#setRule(rule.id, (r) => ({ ...r, value: parseTyped("text", select.value) })));
                    return [select];
                }
                const inputType = type === "number" ? "number" : type === "date" ? "date" : "text";
                const make = (cls: string, name: string, stored: unknown, key: "value" | "value2", focusKey: string): HTMLInputElement => {
                    const input = el("input", { class: cls, type: inputType, inputmode: type === "number" ? "decimal" : undefined, "aria-label": name, readonly, "data-focus-key": focusKey });
                    input.value = textOf(stored);
                    // Typing must not rebuild the markup: that would drop focus. Only the stored value (and the output text) change.
                    input.addEventListener("input", () => this.#setRule(rule.id, (r) => ({ ...r, [key]: parseTyped(type, input.value) }), false));
                    return input;
                };
                const first = make("filter-value", arity === 2 ? labels.valueFrom : labels.value, rule.value, "value", `${rule.id}:value`);
                return arity === 2 ? [first, make("filter-value filter-value-to", labels.valueTo, rule.value2, "value2", `${rule.id}:value2`)] : [first];
            }
            if (arity === "many") {
                return [el("div", { class: "filter-choices", role: "group", "aria-label": labels.value },
                    ...(field.options ?? []).map((option) => {
                        const box = el("input", { type: "checkbox", disabled: readonly, "data-focus-key": `${rule.id}:choice:${option.id}` });
                        box.checked = Array.isArray(rule.value) && rule.value.includes(option.id);
                        box.addEventListener("change", () => this.#toggleOption(rule, option.id, box.checked));
                        return el("label", { class: "filter-choice" }, box, option.label);
                    }))];
            }
            return [];
        };

        const ruleView = (rule: FilterRule, group: FilterGroup): HTMLElement => {
            const field = fieldById.get(rule.field);
            const n = ruleNumbers.get(rule.id) ?? 0;
            const fieldSelect = el("select", { class: "filter-field", "data-filter-field": rule.id, "aria-label": labels.field, disabled: readonly, "data-focus-key": `${rule.id}:field` },
                ...this.#fields.map((f) => el("option", { value: f.id }, f.label)));
            fieldSelect.value = rule.field;
            fieldSelect.addEventListener("change", () => this.#setRule(rule.id, (r) => changeField(r, this.#fields, fieldSelect.value)));
            const parts: Node[] = [fieldSelect];
            if (field) {
                const operatorSelect = el("select", { class: "filter-operator", "aria-label": labels.operator, disabled: readonly, "data-focus-key": `${rule.id}:operator` },
                    ...operatorsFor(field).map((op) => el("option", { value: op }, labels.operatorName(op, field))));
                operatorSelect.value = rule.operator;
                operatorSelect.addEventListener("change", () => this.#setRule(rule.id, (r) => changeOperator(r, operatorSelect.value as FilterOperator)));
                parts.push(operatorSelect, ...valueEditor(rule, field));
            }
            if (!readonly) {
                const remove = el("button", { type: "button", class: "filter-remove-rule-button", "data-focus-key": `${rule.id}:remove` }, labels.removeRule(n));
                remove.addEventListener("click", () => this.#removeRule(rule, group.id));
                parts.push(remove);
            }
            return el("div", { class: "filter-rule", role: "group", "aria-label": labels.rule(n), "data-rule-id": rule.id }, ...parts);
        };

        const groupView = (group: FilterGroup, depth: number, parentId: string | null): HTMLElement => {
            const combinator = el("select", { class: "filter-combinator", "aria-label": labels.combinator, disabled: readonly, "data-focus-key": `${group.id}:combinator` },
                el("option", { value: "and" }, labels.and), el("option", { value: "or" }, labels.or));
            combinator.value = group.combinator;
            combinator.addEventListener("change", () => this.#setGroup(group.id, (g) => ({ ...g, combinator: combinator.value === "or" ? "or" : "and" })));
            const not = el("input", { type: "checkbox", disabled: readonly, "data-focus-key": `${group.id}:not` });
            not.checked = !!group.not;
            not.addEventListener("change", () => this.#setGroup(group.id, (g) => ({ ...g, not: not.checked || undefined })));
            const header = el("div", { class: "filter-group-header" }, combinator, el("label", { class: "filter-not" }, not, labels.not));
            if (parentId !== null && !readonly) {
                const remove = el("button", { type: "button", class: "filter-remove-group-button", "data-focus-key": `${group.id}:remove` }, labels.removeGroup(depth));
                remove.addEventListener("click", () => this.#removeGroup(group, parentId, depth));
                header.append(remove);
            }
            const list = el("ul", { class: "filter-rules" },
                ...group.children.map((child: FilterNode) => el("li", { class: "filter-item" }, child.type === "group" ? groupView(child, depth + 1, group.id) : ruleView(child, group))));
            const view = el("div", { class: "filter-group", role: "group", "aria-label": labels.group(depth), "data-depth": String(depth), "data-group-id": group.id },
                header, group.children.length === 0 && labels.empty ? el("p", { class: "filter-empty" }, labels.empty) : null, list);
            if (!readonly) {
                const addRule = el("button", { type: "button", class: "filter-add-rule-button", "data-filter-add-rule": group.id, "data-focus-key": `${group.id}:add-rule` }, labels.addRule);
                addRule.addEventListener("click", () => this.#addRule(group.id));
                const actions = el("div", { class: "filter-group-actions" }, addRule);
                if (depth < maxDepth) {
                    const addGroup = el("button", { type: "button", class: "filter-add-group-button", "data-focus-key": `${group.id}:add-group` }, labels.addGroup);
                    addGroup.addEventListener("click", () => this.#addGroup(group.id, depth));
                    actions.append(addGroup);
                }
                view.append(actions);
            }
            return view;
        };

        const format = this.format;
        const root = el("div", { class: `filter ${this.getAttribute("class") ?? ""}`.trim(), role: "group", "aria-label": this.label, "data-readonly": readonly || undefined },
            groupView(this.#value, 1, null),
            format && labels.output
                ? el("div", { class: "filter-output", role: "group", "aria-label": labels.output, "data-format": format }, el("pre", { class: "filter-output-text" }, this.#outputText()))
                : null,
            el("p", { class: "filter-status", "aria-live": "polite" }, this.#status));
        this.replaceChildren(root);
        if (keep) this.querySelector<HTMLElement>(`[data-focus-key="${CSS.escape(keep)}"]`)?.focus();
    }

    #outputText(): string {
        const format = this.format;
        return format && this.#labels?.output ? formatFilter(this.#value, this.#fields, format, this.dialect) : "";
    }

    #renderOutput(): void {
        const text = this.querySelector(".filter-output-text");
        if (text) text.textContent = this.#outputText();
    }
}
