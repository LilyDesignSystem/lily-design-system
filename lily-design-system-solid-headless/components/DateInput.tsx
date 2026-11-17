// DateInput component
//
// A headless native date input wrapping <input type="date"> with accessible
// labelling via aria-label and a bindable value. The value is stored in ISO 8601
// YYYY-MM-DD format. It supports min and max constraints to restrict the allowable
// date range. Useful in forms where users need to enter a calendar date with the
// browser's built-in date picker.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name applied via aria-label.
//   value — string, default "". Bindable date string in YYYY-MM-DD format.
//   min — string, default undefined. Minimum allowed date in YYYY-MM-DD format.
//   max — string, default undefined. Maximum allowed date in YYYY-MM-DD format.
//   required — boolean, default false. Whether the input is required for form submission.
//   disabled — boolean, default false. Whether the input is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <DateInput label="Birth date" value={value} onChange={setValue} />
//
// Examples:
//
//   <DateInput label="Deadline" value={value} onChange={setValue} min="2024-01-01" max="2024-12-31" />
//
//   <DateInput label="Start date" value={value} onChange={setValue} required disabled={isLocked} />
//
// Keyboard:
//   - Tab: Move focus to and from the date input (native browser behavior)
//   - Arrow keys: Navigate within the date picker fields (native browser behavior)
//   - Enter: Open or confirm the date picker (native browser behavior)
//
// Accessibility:
//   - aria-label provides an accessible name since there is no visible <label> element
//
// Internationalization:
//   - The label prop provides the accessible name; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Renders a bare <input type="date"> with no wrapper element
//   - Uses controlled for two-way binding on the value prop
//
// References:
//   - MDN date input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date

import { merge, omit } from "solid-js";
import { warnMissingName } from "./dev-warning";

export interface DateInputProps {
    class?: string;
    /** Accessible label for the date input. */
    label: string;
    /** Current date value (YYYY-MM-DD). Bindable. */
    value?: string;
    /** Minimum date. */
    min?: string;
    /** Maximum date. */
    max?: string;
    /** Whether the input is required. */
    required?: boolean;
    /** Whether the input is disabled. */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function DateInput(props: DateInputProps) {
    const p = merge(
        { class: "" as const, value: "" as const, required: false, disabled: false },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "label",
        "value",
        "min",
        "max",
        "required",
        "disabled",
        "onChange",
    );
    warnMissingName("DateInput", p.label, p["aria-label"], p["aria-labelledby"]);
    return (
        <input
            class={`date-input ${p.class}`}
            type="date"
            aria-label={p.label}
            value={p.value}
            onInput={(e) => p.onChange?.(e.currentTarget.value)}
            min={p.min}
            max={p.max}
            required={p.required}
            disabled={p.disabled}
            {...restProps}
        />
    );
}
