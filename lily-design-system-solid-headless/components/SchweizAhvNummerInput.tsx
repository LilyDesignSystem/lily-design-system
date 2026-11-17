// SchweizAhvNummerInput component
//
// A headless input for entering Switzerland's AHV-Nummer / Numéro AVS.
// Format: Thirteen digits, displayed as 756.NNNN.NNNN.NN, always beginning with the country prefix 756. It is a valid EAN-13 barcode number: the final digit is an EAN-13 check digit computed over the twelve preceding digits (alternating-position weights of 1 and 3). Replaced the old 11-digit AHV card number on 1 July 2008.
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
//   <SchweizAhvNummerInput label="AHV-Nummer / Numéro AVS" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://en.wikipedia.org/wiki/Data_codes_for_Switzerland

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { warnMissingName } from "./dev-warning";

export interface SchweizAhvNummerInputProps {
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

export default function SchweizAhvNummerInput(props: SchweizAhvNummerInputProps) {
    const p = withDefaults(
        { class: "" as const, value: "" as const, required: false, disabled: false },
        props,
    );
    const restProps = omit(p, "class", "label", "value", "required", "disabled", "onChange");
    warnMissingName("SchweizAhvNummerInput", p.label, p["aria-label"], p["aria-labelledby"]);
    return (
        <input
            class={`schweiz-ahv-nummer-input ${p.class}`}
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
