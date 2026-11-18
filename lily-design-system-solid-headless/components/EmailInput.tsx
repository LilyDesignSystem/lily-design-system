// EmailInput component
//
// A headless email input wrapping a native <input type="email"> with accessible
// labeling. Provides a streamlined API for basic email collection with required
// and disabled state support.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   value — string, default "". Current email value; bindable.
//   required — boolean, default false. Whether the field is required.
//   disabled — boolean, default false. Whether the field is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <EmailInput label="Your email" value={value} onChange={setValue} />
//
// Examples:
//
//   <EmailInput label="Your email" value={value} onChange={setValue} />
//
//
//   <EmailInput label="Contact email" value={value} onChange={setValue} required />
//
// Keyboard:
//   - None custom — keyboard behavior provided by the browser-native email input
//
// Accessibility:
//   - aria-label provides the accessible name since no visible <label> is included
//   - Native <input type="email"> provides built-in validation
//
// Internationalization:
//   - The label prop accepts any string; consumers provide localized text
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses controlled on value for two-way binding
//
// References:
//   - MDN input type="email": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface EmailInputProps {
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

export default function EmailInput(props: EmailInputProps) {
    const p = withDefaults(
        { class: "" as const, value: "" as const, required: false, disabled: false },
        props,
    );
    const restProps = omit(p, "class", "label", "value", "required", "disabled", "onChange");
    return (
        <input
            class={`email-input ${p.class}`}
            type="email"
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
