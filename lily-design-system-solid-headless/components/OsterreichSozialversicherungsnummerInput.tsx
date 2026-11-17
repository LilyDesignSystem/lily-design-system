// OsterreichSozialversicherungsnummerInput component
//
// A headless input for entering Austria's Sozialversicherungsnummer (SVNR).
// Format: Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number (the first not zero) followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY). If the Modulus-11 remainder is 10, the serial number is incremented by one and the check digit recalculated.
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
//   <OsterreichSozialversicherungsnummerInput label="Sozialversicherungsnummer (SVNR)" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://de.wikipedia.org/wiki/Sozialversicherungsnummer

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { warnMissingName } from "./dev-warning";

export interface OsterreichSozialversicherungsnummerInputProps {
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

export default function OsterreichSozialversicherungsnummerInput(
    props: OsterreichSozialversicherungsnummerInputProps,
) {
    const p = withDefaults(
        { class: "" as const, value: "" as const, required: false, disabled: false },
        props,
    );
    const restProps = omit(p, "class", "label", "value", "required", "disabled", "onChange");
    warnMissingName(
        "OsterreichSozialversicherungsnummerInput",
        p.label,
        p["aria-label"],
        p["aria-labelledby"],
    );
    return (
        <input
            class={`osterreich-sozialversicherungsnummer-input ${p.class}`}
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
