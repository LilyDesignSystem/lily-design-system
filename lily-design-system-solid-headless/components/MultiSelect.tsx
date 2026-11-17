// MultiSelect component
//
// A headless multiple-selection list wrapping the native <select multiple>.
// Native keyboard and pointer behaviour only; value is a string array.
//
// Props:
//   class -- string, optional. CSS class name.
//   label -- string, required. Accessible name via aria-label.
//   value -- string[], default []. Selected option values; onChange receives the array.
//   size -- number, optional. Visible rows.
//   required, disabled -- standard form props.
//   children -- Option elements.
//   ...restProps -- spread onto the <select>.
//
// Keyboard: native <select multiple> (arrows, Shift/Ctrl+click, Space).
// Accessibility: native listbox role; aria-label={label}.
// Internationalization: label is consumer-supplied.

import type { JSX } from "@solidjs/web";
import { merge, omit, createEffect, createSignal, untrack } from "solid-js";
import { useFormReset } from "./form-reset";
import { warnMissingName } from "./dev-warning";

export interface MultiSelectProps {
    class?: string;
    /** Accessible label. */
    label: string;
    /** Selected values. Bindable. */
    value?: string[];
    /** Visible rows. */
    size?: number;
    /** Whether required. */
    required?: boolean;
    /** Whether disabled. */
    disabled?: boolean;
    /** Option elements to render inside. */
    children?: JSX.Element;
    /** Callback when the selection changes. */
    onChange?: (value: string[]) => void;
    [key: string]: unknown;
}

export default function MultiSelect(props: MultiSelectProps) {
    const p = merge(
        {
            class: "" as const,
            value: [] as NonNullable<MultiSelectProps["value"]>,
            required: false,
            disabled: false,
        },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "label",
        "value",
        "size",
        "required",
        "disabled",
        "onChange",
        "children",
    );
    warnMissingName("MultiSelect", p.label, p["aria-label"], p["aria-labelledby"]);
    const [value, setValue] = createSignal<string[]>(untrack(() => p.value));
    const key = () => p.value.join("\u0000");
    const selectRef: { current: HTMLSelectElement | null } = { current: null };
    const initialValue = { current: p.value };

    // Form reset: restore the initial selection and tell the consumer.
    useFormReset(
        () => selectRef.current,
        () => {
            setValue(initialValue.current);
            p.onChange?.(initialValue.current);
        },
    );
    createEffect(
        () => [key()],
        () =>
            untrack(() => {
                setValue(p.value);
            }),
    );

    // A multiple <select> takes its selection from its options, not from a value: mark each one.
    createEffect(value, (selected) => {
        const el = selectRef.current;
        if (!el) return;
        for (const option of Array.from(el.options))
            option.selected = selected.includes(option.value);
    });

    return (
        <select
            ref={(el) => (selectRef.current = el)}
            class={`multi-select ${p.class}`}
            multiple
            aria-label={p.label}
            size={p.size}
            onChange={(e) => {
                const next = Array.from(e.target.selectedOptions).map((o) => o.value);
                setValue(next);
                p.onChange?.(next);
            }}
            required={p.required}
            disabled={p.disabled}
            {...restProps}
        >
            {p.children}
        </select>
    );
}
