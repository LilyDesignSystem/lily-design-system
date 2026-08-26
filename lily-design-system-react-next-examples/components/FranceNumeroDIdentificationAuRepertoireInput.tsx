// FranceNumeroDIdentificationAuRepertoireInput component
//
// A headless input for entering a France numéro d'identification au répertoire
// (NIR), the unique 15-digit French national healthcare identifier printed on
// the Carte Vitale. The standard display format is "X XX XX XX XXX XXX XX".
// The component enforces this pattern, uses a numeric keyboard hint for mobile,
// and disables autocomplete to protect sensitive health information.
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
//   <FranceNumeroDIdentificationAuRepertoireInput label="NIR" value={value} onChange={setValue} />
//
// Examples:
//
//   <FranceNumeroDIdentificationAuRepertoireInput label="NIR" required />
//
//
//   <FranceNumeroDIdentificationAuRepertoireInput label="NIR" disabled />
//
// Keyboard:
//   - Standard text input keyboard behavior
//   - Users type digits and spaces in the format X XX XX XX XXX XXX XX
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - inputmode="numeric" hints mobile devices to show a numeric keyboard
//   - pattern enforces X XX XX XX XXX XXX XX format on form validation
//   - autocomplete="off" protects sensitive health identifiers
//   - required and disabled states are conveyed to assistive technology
//
// Internationalization:
//   - The label prop externalizes user-facing text for translation
//   - No hardcoded strings in the component
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Pattern is defined as a constant for readability
//   - Uses controlled for two-way data binding on value
//
// References:
//   - Ameli.fr: https://www.ameli.fr/assure/droits-demarches/principes/numero-securite-sociale

import React from "react";

export interface FranceNumeroDIdentificationAuRepertoireInputProps {
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

export default function FranceNumeroDIdentificationAuRepertoireInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: FranceNumeroDIdentificationAuRepertoireInputProps) {
    const nirPattern = "[0-9]{1} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{3} [0-9]{3} [0-9]{2}";

    return (
        <input
        className={`france-numero-d-identification-au-repertoire-input ${className}`}
        type="text"
        aria-label={label}
        inputMode="numeric"
        pattern={nirPattern}
        autoComplete="off"
        value={value} onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        {...restProps}
        />
    );
}
