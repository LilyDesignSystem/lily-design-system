// AsSaudiyahRaqmAlHuwiyahAlWataniyahInput component
//
// A headless input for entering Saudi Arabia's National Identification Number.
// Format: Ten digits. The first digit is 1 for a Saudi citizen and 2 for a resident (the iqama number), and the last digit is a check digit under the Luhn algorithm: counting from the right, every second digit is doubled (subtracting 9 when the result exceeds 9), and the total must be a multiple of 10.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". Bindable input value; supports value + onChange.
//   required — boolean, default false. Whether the input is required for form submission.
//   disabled — boolean, default false. Whether the input is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <AsSaudiyahRaqmAlHuwiyahAlWataniyahInput label="National Identification Number" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://en.wikipedia.org/wiki/National_identity_card

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { warnMissingName } from "./dev-warning";

export interface AsSaudiyahRaqmAlHuwiyahAlWataniyahInputProps {
    class?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The current value of the input, bindable */
    value?: string;
    /** Whether the input is required for form submission */
    required?: boolean;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function AsSaudiyahRaqmAlHuwiyahAlWataniyahInput(
    props: AsSaudiyahRaqmAlHuwiyahAlWataniyahInputProps,
) {
    const p = withDefaults(
        { class: "" as const, value: "" as const, required: false, disabled: false },
        props,
    );
    const restProps = omit(p, "class", "label", "value", "required", "disabled", "onChange");
    warnMissingName(
        "AsSaudiyahRaqmAlHuwiyahAlWataniyahInput",
        p.label,
        p["aria-label"],
        p["aria-labelledby"],
    );
    return (
        <input
            class={`as-saudiyah-raqm-al-huwiyah-al-wataniyah-input ${p.class}`}
            type="text"
            aria-label={p.label}
            autocomplete="off"
            spellcheck="false"
            value={p.value}
            onInput={(e) => p.onChange?.(e.currentTarget.value)}
            required={p.required}
            disabled={p.disabled}
            {...restProps}
        />
    );
}
