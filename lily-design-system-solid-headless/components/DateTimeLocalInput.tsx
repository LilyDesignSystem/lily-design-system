// DateTimeLocalInput component
//
// A headless native datetime-local input wrapping <input type="datetime-local">
// with accessible labelling via aria-label and a bindable value. The value follows
// the format YYYY-MM-DDThh:mm, and the browser provides the native date-time picker
// UI. Useful for scheduling interfaces, event creation forms, appointment booking,
// and any scenario where both date and time must be captured in a single field.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name applied via aria-label.
//   value — string, default "". Bindable datetime string (format: YYYY-MM-DDThh:mm).
//   min — string, default undefined. Minimum allowed datetime.
//   max — string, default undefined. Maximum allowed datetime.
//   required — boolean, default false. Whether the input is required for form submission.
//   disabled — boolean, default false. Whether the input is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <DateTimeLocalInput label="Event start" value={value} onChange={setValue} />
//
// Examples:
//
//   <DateTimeLocalInput label="Appointment" value={value} onChange={setValue} min="2024-01-01T08:00" max="2024-12-31T18:00" />
//
//   <DateTimeLocalInput label="Departure time" value={value} onChange={setValue} required disabled={isLocked} />
//
// Keyboard:
//   - Tab: Move focus to and from the datetime input (native browser behavior)
//   - Arrow keys: Navigate within the datetime picker fields (native browser behavior)
//   - Enter: Open or confirm the datetime picker (native browser behavior)
//
// Accessibility:
//   - aria-label provides an accessible name since there is no visible <label> element
//
// Internationalization:
//   - The label prop provides the accessible name; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Renders a bare <input type="datetime-local"> with no wrapper element
//   - Uses controlled for two-way binding on the value prop
//
// References:
//   - MDN datetime-local input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { warnMissingName } from "./dev-warning";

export interface DateTimeLocalInputProps {
    class?: string;
    /** Accessible label for the input. */
    label: string;
    /** Current datetime value. Bindable. */
    value?: string;
    /** Minimum datetime. */
    min?: string;
    /** Maximum datetime. */
    max?: string;
    /** Whether the input is required. */
    required?: boolean;
    /** Whether the input is disabled. */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function DateTimeLocalInput(props: DateTimeLocalInputProps) {
    const p = withDefaults(
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
    warnMissingName("DateTimeLocalInput", p.label, p["aria-label"], p["aria-labelledby"]);
    return (
        <input
            class={`date-time-local-input ${p.class}`}
            type="datetime-local"
            aria-label={p.label}
            value={p.value}
            defaultValue={p.value}
            onInput={(e) => p.onChange?.(e.currentTarget.value)}
            min={p.min}
            max={p.max}
            required={p.required}
            disabled={p.disabled}
            {...restProps}
        />
    );
}
