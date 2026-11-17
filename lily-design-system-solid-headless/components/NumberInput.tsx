// NumberInput component
//
// A headless numeric input that wraps a native <input type="number"> element
// with accessible labelling and optional min, max, and step constraints. It
// provides a bindable numeric value for two-way data flow. Commonly used for
// quantity selectors, age inputs, price fields, and configuration values.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name for the input via aria-label.
//   value — number | undefined, default undefined. Current numeric value; bindable.
//   min — number, optional. Minimum allowed value.
//   max — number, optional. Maximum allowed value.
//   step — number, optional. Increment/decrement step size.
//   required — boolean, default false. Whether the input is required.
//   disabled — boolean, default false. Whether the input is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <NumberInput label="Quantity" value={value} onChange={setValue} />
//
// Examples:
//
//   <NumberInput label="Quantity" value={value} onChange={setValue} min={0} max={100} step={1} />
//
//
//   <NumberInput label="Age" value={value} onChange={setValue} required />
//
// Keyboard:
//   - Up Arrow: increment value by step (native browser behavior)
//   - Down Arrow: decrement value by step (native browser behavior)
//
// Accessibility:
//   - aria-label provides an accessible name describing the input purpose
//   - Implicit spinbutton role from <input type="number">
//   - Native validation via min, max, and step attributes
//
// Internationalization:
//   - The label prop is the only user-facing text; no hardcoded strings
//   - Consumer can pass placeholder via restProps for localized hint text
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses controlled for value, not controlled
//   - Do not wrap in a <div> — renders a bare <input> element
//
// References:
//   - HTML number input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
//   - WAI-ARIA spinbutton role: https://www.w3.org/TR/wai-aria-1.2/#spinbutton

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface NumberInputProps {
    class?: string;
    label: string;
    value?: number | undefined;
    min?: number;
    max?: number;
    step?: number;
    required?: boolean;
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: number | undefined) => void;
    [key: string]: unknown;
}

export default function NumberInput(props: NumberInputProps) {
    const p = withDefaults({ class: "" as const, required: false, disabled: false }, props);
    const restProps = omit(
        p,
        "class",
        "label",
        "value",
        "min",
        "max",
        "step",
        "required",
        "disabled",
        "onChange",
    );
    return (
        <input
            class={`number-input ${p.class}`}
            type="number"
            aria-label={p.label}
            value={p.value}
            onInput={(e) => p.onChange?.(Number(e.currentTarget.value))}
            min={p.min}
            max={p.max}
            step={p.step}
            required={p.required}
            disabled={p.disabled}
            {...restProps}
        />
    );
}
