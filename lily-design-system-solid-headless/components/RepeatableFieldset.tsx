// RepeatableFieldset: the "add another" pattern (tasks.md P29-T10): a <fieldset> holding one <fieldset> per item, each with a
// legend and a remove button, and an add button. The items are the consumer's; legends and labels come from functions of the
// item's number. Focus moves to the new item's first field on add, to the add button on remove. Props: RepeatableFieldset.md.
import type { JSX } from "@solidjs/web";
import { createEffect, createSignal, For, omit, untrack } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import { warnMissingProp } from "./dev-warning";

export interface RepeatableFieldsetProps<T> {
    class?: string;
    legend: string;
    items: T[];
    onItemsChange: (items: T[]) => void;
    newItem: () => T;
    itemLegend: (number: number) => string;
    addLabel: string;
    removeLabel: (number: number) => string;
    min?: number;
    max?: number;
    addedLabel?: (number: number) => string;
    removedLabel?: (number: number) => string;
    /** One item's fields, given the item and its index. */
    renderItem: (item: T, index: number) => JSX.Element;
    /** A stable key for an item; defaults to its index. */
    itemKey?: (item: T, index: number) => string | number;
    [key: string]: unknown;
}

// Each row is created once per key (itemKey), so its controls keep focus while the consumer replaces the item object
// on every keystroke. renderItem receives a read-through view of an object item, so the consumer's JSX reads the
// current values (value={item.name} follows the latest item); a non-object item is passed as it was.
function live<T>(item: () => T): T {
    const first = untrack(item);
    if (first === null || typeof first !== "object") return first;
    return new Proxy(first as object, {
        get: (_target, key) => Reflect.get(item() as object, key),
        has: (_target, key) => Reflect.has(item() as object, key),
        ownKeys: () => Reflect.ownKeys(item() as object),
        getOwnPropertyDescriptor: (_target, key) =>
            Reflect.getOwnPropertyDescriptor(item() as object, key),
    }) as T;
}

export default function RepeatableFieldset<T>(props: RepeatableFieldsetProps<T>) {
    const p = withDefaults({ class: "" as const, min: 0 }, props);
    const restProps = omit(
        p,
        "class",
        "legend",
        "items",
        "onItemsChange",
        "newItem",
        "itemLegend",
        "addLabel",
        "removeLabel",
        "min",
        "max",
        "addedLabel",
        "removedLabel",
        "renderItem",
        "itemKey",
    );
    warnMissingProp("RepeatableFieldset", "legend", p.legend, "the group needs a name.");
    warnMissingProp("RepeatableFieldset", "addLabel", p.addLabel, "the add button needs words.");
    let root: HTMLFieldSetElement | undefined;
    let addButton: HTMLButtonElement | undefined;
    const [status, setStatus] = createSignal("");
    // Where focus goes once the consumer has applied an add or a remove.
    let pending: { to: "item"; index: number } | { to: "add" } | null = null;
    const canAdd = () => p.max === undefined || p.items.length < p.max;
    const canRemove = () => p.items.length > p.min;
    const keyOf = (item: T) =>
        p.itemKey ? p.itemKey(item, p.items.indexOf(item)) : p.items.indexOf(item);

    createEffect(
        () => p.items.length,
        () => {
            const target = pending;
            pending = null;
            if (!target) return;
            if (target.to === "add") addButton?.focus();
            else
                root?.querySelectorAll<HTMLFieldSetElement>(":scope > .repeatable-fieldset-item")
                    [target.index]?.querySelector<HTMLElement>(
                        "input, select, textarea, button, [tabindex]:not([tabindex='-1'])",
                    )
                    ?.focus();
        },
    );

    function add() {
        if (!canAdd()) return;
        pending = { to: "item", index: p.items.length };
        setStatus(p.addedLabel?.(p.items.length + 1) ?? "");
        p.onItemsChange([...p.items, p.newItem()]);
    }

    function remove(index: number) {
        if (!canRemove()) return;
        pending = { to: "add" };
        setStatus(p.removedLabel?.(index + 1) ?? "");
        p.onItemsChange(p.items.filter((_, i) => i !== index));
    }

    return (
        <fieldset
            ref={(el) => (root = el)}
            class={`repeatable-fieldset ${p.class}`}
            data-count={attr(p.items.length)}
            {...restProps}
        >
            <legend>{p.legend}</legend>
            <For
                each={p.items}
                keyed={keyOf}
            >
                {(entry, index) => (
                    <fieldset
                        class="repeatable-fieldset-item"
                        data-index={attr(index())}
                    >
                        <legend class="repeatable-fieldset-item-legend">
                            {p.itemLegend(index() + 1)}
                        </legend>
                        {untrack(() => p.renderItem(live(entry), index()))}
                        {canRemove() ? (
                            <button
                                type="button"
                                class="repeatable-fieldset-remove"
                                onClick={() => remove(index())}
                            >
                                {p.removeLabel(index() + 1)}
                            </button>
                        ) : null}
                    </fieldset>
                )}
            </For>
            <button
                ref={(el) => (addButton = el)}
                type="button"
                class="repeatable-fieldset-add"
                disabled={!canAdd()}
                onClick={add}
            >
                {p.addLabel}
            </button>
            {p.addedLabel || p.removedLabel ? (
                <p
                    class="repeatable-fieldset-status"
                    role="status"
                >
                    {status()}
                </p>
            ) : null}
        </fieldset>
    );
}
