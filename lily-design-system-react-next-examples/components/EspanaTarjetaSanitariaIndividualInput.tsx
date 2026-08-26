// EspanaTarjetaSanitariaIndividualInput component
//
// A headless input for entering a España Tarjeta Sanitaria Individual (TSI),
// the unique Spanish national healthcare identifier (CIP-SNS). The format
// varies by Autonomous Community but typically starts with 4 region digits
// followed by alphanumeric characters.
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
//   <EspanaTarjetaSanitariaIndividualInput label="TSI" value={value} onChange={setValue} />
//
// Examples:
//
//   <EspanaTarjetaSanitariaIndividualInput label="TSI" required />
//
//
//   <EspanaTarjetaSanitariaIndividualInput label="TSI" disabled />
//
// Keyboard:
//   - Standard text input keyboard behavior
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autocomplete="off" protects sensitive health identifiers
//   - required and disabled states are conveyed to assistive technology
//
// Internationalization:
//   - The label prop externalizes user-facing text for translation
//   - No hardcoded strings in the component
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Uses controlled for two-way data binding on value
//
// References:
//   - Ministerio de Sanidad: https://www.sanidad.gob.es/

import React from "react";

export interface EspanaTarjetaSanitariaIndividualInputProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The current value of the input, bindable */
    value?: string;
    /** Whether the input is required for form submission */
    required?: boolean;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Additional HTML attributes */
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function EspanaTarjetaSanitariaIndividualInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: EspanaTarjetaSanitariaIndividualInputProps) {
    return (
        <input
        className={`espana-tarjeta-sanitaria-individual-input ${className}`}
        type="text"
        aria-label={label}
        autoComplete="off"
        value={value} onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        {...restProps}
        />
    );
}
