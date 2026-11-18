// QazaqstanZhekeSaikestendiruNomiriInput component
//
// A headless input for entering Kazakhstan's Individual Identification Number (IIN).
// Format: Twelve digits: the date of birth as YYMMDD, a digit for century and sex, a four-digit serial and a check digit. The check digit is the sum of the first eleven digits times the weights 1 to 11, modulo 11; if that is 10, repeat with the weights 3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2, and if it is 10 again the number is not issued.
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
//   <QazaqstanZhekeSaikestendiruNomiriInput label="Individual Identification Number (IIN)" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/Kazakhstan-TIN.pdf

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { warnMissingName } from "./dev-warning";

export interface QazaqstanZhekeSaikestendiruNomiriInputProps {
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

export default function QazaqstanZhekeSaikestendiruNomiriInput(
    props: QazaqstanZhekeSaikestendiruNomiriInputProps,
) {
    const p = withDefaults(
        { class: "" as const, value: "" as const, required: false, disabled: false },
        props,
    );
    const restProps = omit(p, "class", "label", "value", "required", "disabled", "onChange");
    warnMissingName(
        "QazaqstanZhekeSaikestendiruNomiriInput",
        p.label,
        p["aria-label"],
        p["aria-labelledby"],
    );
    return (
        <input
            class={`qazaqstan-zheke-saikestendiru-nomiri-input ${p.class}`}
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
