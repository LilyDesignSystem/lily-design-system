// TimeInput component
//
// A headless time input using the native HTML <input type="time"> element.
// Renders a time picker control appropriate to the user's browser and OS,
// allowing users to enter hours and minutes in a localized format. Commonly
// used for scheduling interfaces, appointment forms, event planners, and any
// form requiring time-of-day entry. The value uses HH:MM format (24-hour).
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   value — string, default "". Bindable time value in HH:MM format; supports value + onChange.
//   required — boolean, default false. Whether the field is required.
//   disabled — boolean, default false. Whether the field is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <TimeInput label="Start time" value={value} onChange={setValue} />
//
// Examples:
//
//   <TimeInput label="Deadline" value={deadline} onChange={setDeadline} min="09:00" max="17:00" />
//
// Keyboard:
//   - Arrow keys: adjust hours/minutes, Tab between segments (native behavior)
//
// Accessibility:
//   - aria-label={label} provides an accessible name since no visible <label> is included
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Uses controlled for two-way data binding on value
//   - Consumer can add min, max, step via restProps
//
// References:
//   - MDN input type="time": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface TimeInputProps {
    class?: string;
    /** Accessible label. */
    label: string;
    /** Current value. Bindable. */
    value?: string;
    /** Whether required. */
    required?: boolean;
    /** Whether disabled. */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function TimeInput(props: TimeInputProps) {
    const p = withDefaults(
        { class: "" as const, value: "" as const, required: false, disabled: false },
        props,
    );
    const restProps = omit(p, "class", "label", "value", "required", "disabled", "onChange");
    return (
        <input
            class={`time-input ${p.class}`}
            type="time"
            aria-label={p.label}
            value={p.value}
            defaultValue={p.value}
            onInput={(e) => p.onChange?.(e.currentTarget.value)}
            required={p.required}
            disabled={p.disabled}
            {...restProps}
        />
    );
}
