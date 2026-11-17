// MeasurementSystemInput component
//
// A headless text input for entering a measurement system name, such as
// "metric", "imperial", or "SI". A measurement system is a collection of
// units and rules for measuring physical quantities. The component renders
// an <input type="text"> with aria-label for accessible naming and a bindable
// value for reactive form integration.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name for the input via aria-label.
//   value — string, default "". Bindable measurement system name via controlled.
//   required — boolean, default false. Whether the field is required.
//   disabled — boolean, default false. Whether the field is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <MeasurementSystemInput label="Measurement system" value={value} onChange={setValue} />
//
// Examples:
//
//   <MeasurementSystemInput label="Measurement system" value={value} onChange={setValue} />
//
//
//   <MeasurementSystemInput label="System" value={value} onChange={setValue} required />
//
// Keyboard:
//   - Native <input type="text"> keyboard behavior (typing, selection, clipboard-copy-button).
//
// Accessibility:
//   - aria-label provides the accessible name from the label prop
//   - Supports required and disabled HTML states
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Part of the Input/View pattern; pairs with MeasurementSystemView
//
// References:
//   - HTML input element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface MeasurementSystemInputProps {
    class?: string;
    /** Accessible name for the measurement system input */
    label: string;
    /** Bindable measurement system name */
    value?: string;
    /** Whether the input is required */
    required?: boolean;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function MeasurementSystemInput(props: MeasurementSystemInputProps) {
    const p = withDefaults(
        { class: "" as const, value: "" as const, required: false, disabled: false },
        props,
    );
    const restProps = omit(p, "class", "label", "value", "required", "disabled", "onChange");
    return (
        <input
            class={`measurement-system-input ${p.class}`}
            type="text"
            aria-label={p.label}
            value={p.value}
            onInput={(e) => p.onChange?.(e.currentTarget.value)}
            required={p.required}
            disabled={p.disabled}
            {...restProps}
        />
    );
}
