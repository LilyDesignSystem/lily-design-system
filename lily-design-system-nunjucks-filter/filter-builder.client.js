// FilterBuilder client-side runtime.
//
// Pairs with filter-builder.njk. The macro renders the labelled root, the configuration (fields, starting value, labels)
// and the status region; this module builds the groups, conditions and output inside the root and owns every edit. The
// model (operators, immutable editing, validation and the five outputs) is filter-model.ts, shared with the other ports.
//
// Light DOM, built with document.createElement only. Typing in a value input does not rebuild the markup (that would drop
// focus); every other edit does, and focus is put back on the control that had it (data-focus-key).

import {
    EMPTY_FILTER, addNode, changeField, changeOperator, createGroup, createRule, fieldType, formatFilter, operatorsFor, removeNode, updateNode, valueArity,
} from "./filter-model";

const TEMPLATES = ["rule", "group", "removeRule", "removeGroup", "ruleAdded", "ruleRemoved", "groupAdded", "groupRemoved"];

/** A text field's value, a number input's number (undefined when empty), or a date: what the rule stores for what was typed. */
function parseTyped(type, raw) {
    if (raw === "") return undefined;
    return type === "number" ? Number(raw) : raw;
}

const textOf = (v) => (v === undefined || v === null || (typeof v === "number" && Number.isNaN(v)) ? "" : String(v));

/** The number the user sees for each rule: its place in reading order across the whole filter. */
function numberRules(root) {
    const numbers = new Map();
    let n = 0;
    const walk = (g) => {
        for (const child of g.children) {
            if (child.type === "rule") numbers.set(child.id, ++n);
            else walk(child);
        }
    };
    walk(root);
    return numbers;
}

function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [name, value] of Object.entries(attrs)) {
        if (value === undefined || value === false || value === null) continue;
        node.setAttribute(name, value === true ? "" : value);
    }
    for (const child of children) {
        if (child === null || child === false || child === undefined) continue;
        node.append(typeof child === "string" ? document.createTextNode(child) : child);
    }
    return node;
}

const fill = (template, tokens) => String(template).replace(/\{(\w+)\}/g, (match, name) => (name in tokens ? String(tokens[name]) : match));

/**
 * Wire one rendered filterBuilder root.
 *
 * @param {HTMLElement} root - The `[data-lily-filter-builder-root]`.
 * @param {{ labels?: object, onChange?: (group: object) => void }=} opts
 * @returns {{ getValue: () => object, setValue: (group: object) => void, destroy: () => void }}
 */
export function initFilterBuilder(root, opts = {}) {
    const noop = { getValue: () => EMPTY_FILTER(), setValue: () => {}, destroy: () => {} };
    if (typeof document === "undefined" || !root) return noop;

    let config = {};
    try {
        config = JSON.parse(root.getAttribute("data-lily-filter-builder-config") || "{}");
    } catch {
        config = {};
    }
    const fields = Array.isArray(config.fields) ? config.fields : [];
    const format = config.format === "json" || config.format === "sql" || config.format === "mongo" || config.format === "odata" ? config.format : undefined;
    const dialect = config.dialect || "ansi";
    const maxDepth = Number.isFinite(config.maxDepth) ? config.maxDepth : 3;
    const readonly = !!config.readonly;

    // Labels: the client option (functions) wins over the macro's strings and templates.
    const given = { ...(config.labels || {}), ...(opts.labels || {}) };
    const labels = { ...given };
    for (const name of TEMPLATES) {
        if (typeof given[name] === "string") {
            const template = given[name];
            labels[name] = (n) => fill(template, { n, depth: n });
        }
    }
    if (typeof given.operatorName !== "function") {
        const names = given.operatorNames || {};
        labels.operatorName = (operator) => names[operator] ?? operator;
    }

    let value = config.value && config.value.type === "group" ? config.value : EMPTY_FILTER();
    let status = "";
    let focusKey = null;

    function commit(next, rebuild = true) {
        value = next;
        if (typeof opts.onChange === "function") opts.onChange(next);
        root.dispatchEvent(new CustomEvent("filterchange", { detail: next, bubbles: true }));
        if (rebuild) render();
        else renderOutput();
    }

    function setRule(id, change, rebuild = true) {
        if (readonly) return;
        commit(updateNode(value, id, (node) => (node.type === "rule" ? change(node) : node)), rebuild);
    }

    function setGroup(id, change) {
        if (readonly) return;
        commit(updateNode(value, id, (node) => (node.type === "group" ? change(node) : node)));
    }

    function addRule(groupId) {
        if (readonly || fields.length === 0) return;
        const rule = createRule(fields);
        const next = addNode(value, groupId, rule);
        focusKey = `${rule.id}:field`;
        status = labels.ruleAdded ? labels.ruleAdded(numberRules(next).get(rule.id) ?? 0) : status;
        commit(next);
    }

    function addGroup(parentId, depth) {
        if (readonly || depth >= maxDepth) return;
        const group = createGroup("and", fields.length ? [createRule(fields)] : []);
        const first = group.children[0];
        if (first) focusKey = `${first.id}:field`;
        status = labels.groupAdded ? labels.groupAdded(depth + 1) : status;
        commit(addNode(value, parentId, group));
    }

    function removeRule(rule, groupId) {
        if (readonly) return;
        const n = numberRules(value).get(rule.id) ?? 0;
        focusKey = `${groupId}:add-rule`;
        status = labels.ruleRemoved ? labels.ruleRemoved(n) : status;
        commit(removeNode(value, rule.id));
    }

    function removeGroup(group, parentId, depth) {
        if (readonly) return;
        focusKey = `${parentId}:add-rule`;
        status = labels.groupRemoved ? labels.groupRemoved(depth) : status;
        commit(removeNode(value, group.id));
    }

    function toggleOption(rule, optionId, checked) {
        const current = Array.isArray(rule.value) ? rule.value : [];
        const next = checked ? [...current.filter((v) => v !== optionId), optionId] : current.filter((v) => v !== optionId);
        focusKey = `${rule.id}:choice:${optionId}`;
        setRule(rule.id, (r) => ({ ...r, value: next.length ? next : undefined }));
    }

    function outputText() {
        return format && labels.output ? formatFilter(value, fields, format, dialect) : "";
    }

    function renderOutput() {
        const text = root.querySelector(".filter-output-text");
        if (text) text.textContent = outputText();
    }

    function render() {
        const active = document.activeElement;
        const keep = focusKey ?? (active && root.contains(active) ? active.getAttribute("data-focus-key") : null);
        focusKey = null;
        const ruleNumbers = numberRules(value);
        const fieldById = new Map(fields.map((f) => [f.id, f]));

        const valueEditor = (rule, field) => {
            const type = fieldType(field);
            const arity = valueArity(rule.operator);
            if (arity === 1 || arity === 2) {
                if (type === "select") {
                    const select = el("select", { class: "filter-value", "aria-label": labels.value, disabled: readonly, "data-focus-key": `${rule.id}:value` },
                        el("option", { value: "" }, labels.choose ?? ""),
                        ...(field.options ?? []).map((option) => el("option", { value: option.id }, option.label)));
                    select.value = textOf(rule.value);
                    select.addEventListener("change", () => setRule(rule.id, (r) => ({ ...r, value: parseTyped("text", select.value) })));
                    return [select];
                }
                const inputType = type === "number" ? "number" : type === "date" ? "date" : "text";
                const make = (cls, name, stored, key, fk) => {
                    const input = el("input", { class: cls, type: inputType, inputmode: type === "number" ? "decimal" : undefined, "aria-label": name, readonly, "data-focus-key": fk });
                    input.value = textOf(stored);
                    // Typing must not rebuild the markup: that would drop focus. Only the stored value (and the output text) change.
                    input.addEventListener("input", () => setRule(rule.id, (r) => ({ ...r, [key]: parseTyped(type, input.value) }), false));
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
                        box.addEventListener("change", () => toggleOption(rule, option.id, box.checked));
                        return el("label", { class: "filter-choice" }, box, option.label);
                    }))];
            }
            return [];
        };

        const ruleView = (rule, group) => {
            const field = fieldById.get(rule.field);
            const n = ruleNumbers.get(rule.id) ?? 0;
            const fieldSelect = el("select", { class: "filter-field", "data-filter-field": rule.id, "aria-label": labels.field, disabled: readonly, "data-focus-key": `${rule.id}:field` },
                ...fields.map((f) => el("option", { value: f.id }, f.label)));
            fieldSelect.value = rule.field;
            fieldSelect.addEventListener("change", () => setRule(rule.id, (r) => changeField(r, fields, fieldSelect.value)));
            const parts = [fieldSelect];
            if (field) {
                const operatorSelect = el("select", { class: "filter-operator", "aria-label": labels.operator, disabled: readonly, "data-focus-key": `${rule.id}:operator` },
                    ...operatorsFor(field).map((op) => el("option", { value: op }, labels.operatorName(op, field))));
                operatorSelect.value = rule.operator;
                operatorSelect.addEventListener("change", () => setRule(rule.id, (r) => changeOperator(r, operatorSelect.value)));
                parts.push(operatorSelect, ...valueEditor(rule, field));
            }
            if (!readonly) {
                const remove = el("button", { type: "button", class: "filter-remove-rule-button", "data-focus-key": `${rule.id}:remove` }, labels.removeRule(n));
                remove.addEventListener("click", () => removeRule(rule, group.id));
                parts.push(remove);
            }
            return el("div", { class: "filter-rule", role: "group", "aria-label": labels.rule(n), "data-rule-id": rule.id }, ...parts);
        };

        const groupView = (group, depth, parentId) => {
            const combinator = el("select", { class: "filter-combinator", "aria-label": labels.combinator, disabled: readonly, "data-focus-key": `${group.id}:combinator` },
                el("option", { value: "and" }, labels.and), el("option", { value: "or" }, labels.or));
            combinator.value = group.combinator;
            combinator.addEventListener("change", () => setGroup(group.id, (g) => ({ ...g, combinator: combinator.value === "or" ? "or" : "and" })));
            const not = el("input", { type: "checkbox", disabled: readonly, "data-focus-key": `${group.id}:not` });
            not.checked = !!group.not;
            not.addEventListener("change", () => setGroup(group.id, (g) => ({ ...g, not: not.checked || undefined })));
            const header = el("div", { class: "filter-group-header" }, combinator, el("label", { class: "filter-not" }, not, labels.not));
            if (parentId !== null && !readonly) {
                const remove = el("button", { type: "button", class: "filter-remove-group-button", "data-focus-key": `${group.id}:remove` }, labels.removeGroup(depth));
                remove.addEventListener("click", () => removeGroup(group, parentId, depth));
                header.append(remove);
            }
            const list = el("ul", { class: "filter-rules" },
                ...group.children.map((child) => el("li", { class: "filter-item" }, child.type === "group" ? groupView(child, depth + 1, group.id) : ruleView(child, group))));
            const view = el("div", { class: "filter-group", role: "group", "aria-label": labels.group(depth), "data-depth": String(depth), "data-group-id": group.id },
                header, group.children.length === 0 && labels.empty ? el("p", { class: "filter-empty" }, labels.empty) : null, list);
            if (!readonly) {
                const add = el("button", { type: "button", class: "filter-add-rule-button", "data-filter-add-rule": group.id, "data-focus-key": `${group.id}:add-rule` }, labels.addRule);
                add.addEventListener("click", () => addRule(group.id));
                const actions = el("div", { class: "filter-group-actions" }, add);
                if (depth < maxDepth) {
                    const addG = el("button", { type: "button", class: "filter-add-group-button", "data-focus-key": `${group.id}:add-group` }, labels.addGroup);
                    addG.addEventListener("click", () => addGroup(group.id, depth));
                    actions.append(addG);
                }
                view.append(actions);
            }
            return view;
        };

        root.replaceChildren(
            groupView(value, 1, null),
            format && labels.output
                ? el("div", { class: "filter-output", role: "group", "aria-label": labels.output, "data-format": format }, el("pre", { class: "filter-output-text" }, outputText()))
                : null,
            el("p", { class: "filter-status", "aria-live": "polite", "data-lily-filter-builder-status": "" }, status),
        );
        if (keep) root.querySelector(`[data-focus-key="${CSS.escape(keep)}"]`)?.focus();
    }

    render();

    return {
        getValue: () => value,
        setValue: (next) => {
            value = next && next.type === "group" ? next : EMPTY_FILTER();
            render();
        },
        destroy: () => root.replaceChildren(),
    };
}

/**
 * Find every `[data-lily-filter-builder-root]` and wire it.
 *
 * @param {Parameters<typeof initFilterBuilder>[1]=} opts
 */
export function autoInit(opts = {}) {
    if (typeof document === "undefined") return [];
    return Array.from(document.querySelectorAll("[data-lily-filter-builder-root]")).map((root) => initFilterBuilder(root, opts));
}
