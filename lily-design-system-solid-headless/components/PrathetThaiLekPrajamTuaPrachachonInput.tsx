// PrathetThaiLekPrajamTuaPrachachonInput component
//
// A headless input for entering Thailand's National Identification Number (เลขประจำตัวประชาชน).
// Format: Thirteen digits. Digit 1 denotes registration category; digits 2-5 denote the district/province office of registration; digits 6-10 form a serial number; digit 11 is a Modulus-11 check digit computed over the first ten digits; digits 12-13 are further disambiguating digits.
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
//   <PrathetThaiLekPrajamTuaPrachachonInput label="National Identification Number (เลขประจำตัวประชาชน)" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://en.wikipedia.org/wiki/Thai_identity_card

import { merge, omit } from "solid-js";
import { warnMissingName } from "./dev-warning";

export interface PrathetThaiLekPrajamTuaPrachachonInputProps {
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

export default function PrathetThaiLekPrajamTuaPrachachonInput(
    props: PrathetThaiLekPrajamTuaPrachachonInputProps,
) {
    const p = merge(
        { class: "" as const, value: "" as const, required: false, disabled: false },
        props,
    );
    const restProps = omit(p, "class", "label", "value", "required", "disabled", "onChange");
    warnMissingName(
        "PrathetThaiLekPrajamTuaPrachachonInput",
        p.label,
        p["aria-label"],
        p["aria-labelledby"],
    );
    return (
        <input
            class={`prathet-thai-lek-prajam-tua-prachachon-input ${p.class}`}
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
