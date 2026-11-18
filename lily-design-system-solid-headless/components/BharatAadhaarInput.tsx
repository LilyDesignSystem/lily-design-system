// BharatAadhaarInput component
//
// A headless input for entering India's Aadhaar (आधार).
// Format: Twelve digits, the first of which is never 0 or 1. The twelfth digit is a check digit computed with the Verhoeff algorithm, a checksum that detects every single-digit error and every adjacent-digit transposition. Issued by the Unique Identification Authority of India (UIDAI).
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
//   <BharatAadhaarInput label="Aadhaar (आधार)" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://en.wikipedia.org/wiki/Aadhaar

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { warnMissingName } from "./dev-warning";

export interface BharatAadhaarInputProps {
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

export default function BharatAadhaarInput(props: BharatAadhaarInputProps) {
    const p = withDefaults(
        { class: "" as const, value: "" as const, required: false, disabled: false },
        props,
    );
    const restProps = omit(p, "class", "label", "value", "required", "disabled", "onChange");
    warnMissingName("BharatAadhaarInput", p.label, p["aria-label"], p["aria-labelledby"]);
    return (
        <input
            class={`bharat-aadhaar-input ${p.class}`}
            type="text"
            aria-label={p.label}
            autocomplete="off"
            spellcheck="false"
            value={p.value}
            defaultValue={p.value}
            onInput={(e) => p.onChange?.(e.currentTarget.value)}
            required={p.required}
            disabled={p.disabled}
            {...restProps}
        />
    );
}
