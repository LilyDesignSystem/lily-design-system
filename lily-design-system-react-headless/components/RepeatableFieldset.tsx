// RepeatableFieldset: the "add another" pattern (tasks.md P29-T10): a <fieldset> holding one <fieldset> per item, each with a
// legend and a remove button, and an add button. The items are the consumer's; legends and labels come from functions of the
// item's number. Focus moves to the new item's first field on add, to the add button on remove. Props: RepeatableFieldset.md.
import React, { useEffect, useRef, useState } from "react";
import { warnMissingProp } from "./dev-warning";

export interface RepeatableFieldsetProps<T> {
    className?: string;
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
    renderItem: (item: T, index: number) => React.ReactNode;
    /** A stable key for an item; defaults to its index. */
    itemKey?: (item: T, index: number) => React.Key;
    [key: string]: unknown;
}

export default function RepeatableFieldset<T>({
    className = "",
    legend,
    items,
    onItemsChange,
    newItem,
    itemLegend,
    addLabel,
    removeLabel,
    min = 0,
    max,
    addedLabel,
    removedLabel,
    renderItem,
    itemKey = (_item, index) => index,
    ...restProps
}: RepeatableFieldsetProps<T>) {
    warnMissingProp("RepeatableFieldset", "legend", legend, "the group needs a name.");
    warnMissingProp("RepeatableFieldset", "addLabel", addLabel, "the add button needs words.");
    const root = useRef<HTMLFieldSetElement>(null);
    const addButton = useRef<HTMLButtonElement>(null);
    const [status, setStatus] = useState("");
    const [focus, setFocus] = useState<{ to: "item"; index: number } | { to: "add" } | null>(null);
    const canAdd = max === undefined || items.length < max;
    const canRemove = items.length > min;

    useEffect(() => {
        if (!focus) return;
        if (focus.to === "add") addButton.current?.focus();
        else
            root.current
                ?.querySelectorAll<HTMLFieldSetElement>(":scope > .repeatable-fieldset-item")
                [focus.index]?.querySelector<HTMLElement>(
                    "input, select, textarea, button, [tabindex]:not([tabindex='-1'])",
                )
                ?.focus();
        setFocus(null);
    }, [focus, items.length]);

    function add() {
        if (!canAdd) return;
        onItemsChange([...items, newItem()]);
        setStatus(addedLabel?.(items.length + 1) ?? "");
        setFocus({ to: "item", index: items.length });
    }

    function remove(index: number) {
        if (!canRemove) return;
        onItemsChange(items.filter((_, i) => i !== index));
        setStatus(removedLabel?.(index + 1) ?? "");
        setFocus({ to: "add" });
    }

    return (
        <fieldset
            ref={root}
            className={`repeatable-fieldset ${className}`}
            data-count={items.length}
            {...restProps}
        >
            <legend>{legend}</legend>
            {items.map((entry, index) => (
                <fieldset
                    key={itemKey(entry, index)}
                    className="repeatable-fieldset-item"
                    data-index={index}
                >
                    <legend className="repeatable-fieldset-item-legend">
                        {itemLegend(index + 1)}
                    </legend>
                    {renderItem(entry, index)}
                    {canRemove ? (
                        <button
                            type="button"
                            className="repeatable-fieldset-remove"
                            onClick={() => remove(index)}
                        >
                            {removeLabel(index + 1)}
                        </button>
                    ) : null}
                </fieldset>
            ))}
            <button
                ref={addButton}
                type="button"
                className="repeatable-fieldset-add"
                disabled={!canAdd}
                onClick={add}
            >
                {addLabel}
            </button>
            {addedLabel || removedLabel ? (
                <p
                    className="repeatable-fieldset-status"
                    role="status"
                >
                    {status}
                </p>
            ) : null}
        </fieldset>
    );
}
