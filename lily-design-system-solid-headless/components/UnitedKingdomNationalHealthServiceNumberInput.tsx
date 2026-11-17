// UnitedKingdomNationalHealthServiceNumberInput component
//
// A headless input for entering a United Kingdom National Health Service (NHS)
// number. The NHS number is a 10-digit identifier assigned to every patient
// registered with the NHS in England, Wales, and the Isle of Man. The standard
// display format is "XXX XXX XXXX" (three groups separated by spaces). The
// component enforces this pattern, uses a numeric keyboard hint for mobile,
// and disables autocomplete to protect sensitive health information.
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
//   <UnitedKingdomNationalHealthServiceNumberInput label="NHS Number" value={value} onChange={setValue} />
//
// Examples:
//
//   <UnitedKingdomNationalHealthServiceNumberInput label="NHS Number" required />
//
//
//   <UnitedKingdomNationalHealthServiceNumberInput label="NHS Number" disabled />
//
// Keyboard:
//   - Standard text input keyboard behavior
//   - Users type digits and spaces in the format XXX XXX XXXX
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - inputmode="numeric" hints mobile devices to show a numeric keyboard
//   - pattern enforces XXX XXX XXXX format on form validation
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
//   - NHS Number format: https://www.nhs.uk/nhs-services/online-services/find-nhs-number/

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface UnitedKingdomNationalHealthServiceNumberInputProps {
    class?: string;
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

export default function UnitedKingdomNationalHealthServiceNumberInput(
    props: UnitedKingdomNationalHealthServiceNumberInputProps,
) {
    const p = withDefaults(
        { class: "" as const, value: "" as const, required: false, disabled: false },
        props,
    );
    const restProps = omit(p, "class", "label", "value", "required", "disabled", "onChange");
    const nhsPattern = () => "[0-9]{3} [0-9]{3} [0-9]{4}";

    return (
        <input
            class={`united-kingdom-national-health-service-number-input ${p.class}`}
            type="text"
            aria-label={p.label}
            inputmode="numeric"
            pattern={nhsPattern()}
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
