// ItyopyaFaydaIdentificationNumberInput component
//
// A headless input for entering Ethiopia's Fayda Identification Number (FIN).
// Format: Twelve digits issued by the National ID Program (NIDP). The number encodes no personal attributes and no check-digit algorithm is published, so only the length and digits can be checked. Do not confuse it with the six-digit Fayda alternative number used to link bank accounts.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". Bindable input value; supports value + onChange.
//   required — boolean, default false. Whether the input is required for form submission.
//   disabled — boolean, default false. Whether the input is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <ItyopyaFaydaIdentificationNumberInput label="Fayda Identification Number (FIN)" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://en.wikipedia.org/wiki/Fayda_ID

import React from "react";
import { warnMissingName } from "./dev-warning";

export interface ItyopyaFaydaIdentificationNumberInputProps {
    className?: string;
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

export default function ItyopyaFaydaIdentificationNumberInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: ItyopyaFaydaIdentificationNumberInputProps) {
    warnMissingName(
        "ItyopyaFaydaIdentificationNumberInput",
        label,
        restProps["aria-label"],
        restProps["aria-labelledby"],
    );
    return (
        <input
            className={`ityopya-fayda-identification-number-input ${className}`}
            type="text"
            aria-label={label}
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            required={required}
            disabled={disabled}
            {...restProps}
        />
    );
}
