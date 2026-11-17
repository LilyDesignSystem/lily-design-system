// ElladaDematerialisedSecuritiesSystemInput component
//
// A headless input for entering Greece's Dematerialised Securities System (DSS).
// Format: 10 digits linked to the investor's personal details (name, ID number, passport number, tax registration number) and managed by the Central Securities Depository of Greece.
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
//   <ElladaDematerialisedSecuritiesSystemInput label="Dematerialised Securities System" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://en.wikipedia.org/wiki/Central_Securities_Depository

import { merge, omit } from "solid-js";
import { warnMissingName } from "./dev-warning";

export interface ElladaDematerialisedSecuritiesSystemInputProps {
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

export default function ElladaDematerialisedSecuritiesSystemInput(
    props: ElladaDematerialisedSecuritiesSystemInputProps,
) {
    const p = merge(
        { class: "" as const, value: "" as const, required: false, disabled: false },
        props,
    );
    const restProps = omit(p, "class", "label", "value", "required", "disabled", "onChange");
    warnMissingName(
        "ElladaDematerialisedSecuritiesSystemInput",
        p.label,
        p["aria-label"],
        p["aria-labelledby"],
    );
    return (
        <input
            class={`ellada-dematerialised-securities-system-input ${p.class}`}
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
