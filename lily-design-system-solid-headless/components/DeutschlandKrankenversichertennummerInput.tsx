// DeutschlandKrankenversichertennummerInput component
//
// A headless input for entering Germany's Krankenversichertennummer (KVNR).
// Format: a random capital letter followed by eight random digits and a Luhn check digit.
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
//   <DeutschlandKrankenversichertennummerInput label="Health Insurance Number" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://de.wikipedia.org/wiki/Krankenversichertennummer

import { merge, omit } from "solid-js";
import { warnMissingName } from "./dev-warning";

export interface DeutschlandKrankenversichertennummerInputProps {
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

export default function DeutschlandKrankenversichertennummerInput(
    props: DeutschlandKrankenversichertennummerInputProps,
) {
    const p = merge(
        { class: "" as const, value: "" as const, required: false, disabled: false },
        props,
    );
    const restProps = omit(p, "class", "label", "value", "required", "disabled", "onChange");
    warnMissingName(
        "DeutschlandKrankenversichertennummerInput",
        p.label,
        p["aria-label"],
        p["aria-labelledby"],
    );
    return (
        <input
            class={`deutschland-krankenversichertennummer-input ${p.class}`}
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
