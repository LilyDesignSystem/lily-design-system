// MultiSelectWithExtras component
//
// A wrapper <div> with optional before/after content around a native
// <select multiple>. The accessible name sits on the select, not the wrapper.
//
// Props:
//   class -- string, optional. CSS class name (wrapper).
//   label -- string, required. aria-label on the <select>.
//   value -- string[], default []. Selected values; onChange receives the array.
//   size -- number, optional. Visible rows.
//   required, disabled -- standard form props (on the select).
//   before, after -- ReactNode, optional. Content around the select.
//   children -- Option elements.
//   ...restProps -- spread onto the wrapper <div>.
//
// Keyboard: native <select multiple>.

import type { JSX } from "@solidjs/web";
import { omit, createEffect, createSignal, untrack } from "solid-js";
import { withDefaults } from "./defaults";
import { useFormReset } from "./form-reset";
import { warnMissingName } from "./dev-warning";

export interface MultiSelectWithExtrasProps {
    class?: string;
    /** Accessible label (on the select). */
    label: string;
    /** Selected values. Bindable. */
    value?: string[];
    /** Visible rows. */
    size?: number;
    /** Whether required. */
    required?: boolean;
    /** Whether disabled. */
    disabled?: boolean;
    /** Option elements. */
    children?: JSX.Element;
    /** Content before the select. */
    before?: JSX.Element;
    /** Content after the select. */
    after?: JSX.Element;
    /** Callback when the selection changes. */
    onChange?: (value: string[]) => void;
    [key: string]: unknown;
}

export default function MultiSelectWithExtras(props: MultiSelectWithExtrasProps) {
    const p = withDefaults(
        {
            class: "" as const,
            value: [] as NonNullable<MultiSelectWithExtrasProps["value"]>,
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
        "before",
        "after",
        "onChange",
        "children",
    );
    warnMissingName("MultiSelectWithExtras", p.label, p["aria-label"], p["aria-labelledby"]);
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
        <div
            class={`multi-select-with-extras ${p.class}`}
            {...restProps}
        >
            {p.before && p.before}
            <select
                ref={(el) => (selectRef.current = el)}
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
            >
                {p.children}
            </select>
            {p.after && p.after}
        </div>
    );
}
