// UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput component
//
// A headless input for entering Ukraine's Реєстраційний номер платника податків (РНОКПП).
// Format: Ten digits. The first five encode date of birth as the number of days elapsed since 1 January 1900; the next four are a registration sequence number, whose own last digit's parity encodes sex (odd male, even female); the tenth digit is a check digit computed with a weighted-sum algorithm over the first nine digits.
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
//   <UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput label="Реєстраційний номер платника податків (РНОКПП)" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://en.wikipedia.org/wiki/Taxpayer_Identification_Number

import { merge, omit } from "solid-js";
import { warnMissingName } from "./dev-warning";

export interface UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInputProps {
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

export default function UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput(
    props: UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInputProps,
) {
    const p = merge(
        { class: "" as const, value: "" as const, required: false, disabled: false },
        props,
    );
    const restProps = omit(p, "class", "label", "value", "required", "disabled", "onChange");
    warnMissingName(
        "UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput",
        p.label,
        p["aria-label"],
        p["aria-labelledby"],
    );
    return (
        <input
            class={`ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input ${p.class}`}
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
