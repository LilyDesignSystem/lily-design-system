// TelInput component
//
// A headless telephone input using the native HTML <input type="tel"> element.
// Provides accessible labeling via aria-label and browser autofill support via
// autocomplete="tel". Commonly used in contact forms, registration flows, and
// profile editors. Supports two-way data binding through a bindable value prop.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name for the input via aria-label.
//   value — string, default "". Bindable telephone number value.
//   required — boolean, default false. Whether the field is required for form submission.
//   disabled — boolean, default false. Whether the field is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <TelInput label="Phone number" value={value} onChange={setValue} />
//
// Examples:
//
//   <TelInput label="Mobile" value={value} onChange={setValue} required />
//
// Keyboard:
//   - Native <input type="tel"> keyboard behavior (Tab to focus, type to enter digits)
//
// Accessibility:
//   - aria-label provides the accessible name for the input
//   - autocomplete="tel" enables browser and password manager autofill
//   - required and disabled states are conveyed to assistive technology
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Uses controlled for two-way data binding on value
//   - Consumer can add placeholder, pattern, maxlength via restProps
//
// References:
//   - HTML tel input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/tel

import { merge, omit } from "solid-js";
export interface TelInputProps {
    class?: string;
    /** Accessible name for the telephone input */
    label: string;
    /** Bindable telephone number value */
    value?: string;
    /** Whether the input is required */
    required?: boolean;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function TelInput(props: TelInputProps) {
    const p = merge(
        { class: "" as const, value: "" as const, required: false, disabled: false },
        props,
    );
    const restProps = omit(p, "class", "label", "value", "required", "disabled", "onChange");
    return (
        <input
            class={`tel-input ${p.class}`}
            type="tel"
            aria-label={p.label}
            value={p.value}
            onInput={(e) => p.onChange?.(e.currentTarget.value)}
            autocomplete="tel"
            required={p.required}
            disabled={p.disabled}
            {...restProps}
        />
    );
}
