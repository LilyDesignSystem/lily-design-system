// EireIndividualHealthIdentifierInput component
//
// A headless input for entering an Eire Individual Health Identifier (IHI),
// a 10-digit clinical identifier used by the HSE to safely match patients
// with their medical records across different hospitals and GPs.
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
//   <EireIndividualHealthIdentifierInput label="IHI" value={value} onChange={setValue} />
//
// Examples:
//
//   <EireIndividualHealthIdentifierInput label="IHI" required />
//
//
//   <EireIndividualHealthIdentifierInput label="IHI" disabled />
//
// Keyboard:
//   - Standard text input keyboard behavior
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - inputMode="numeric" hints mobile devices to show numeric keyboard
//   - pattern="[0-9]{10}" validates 10-digit format
//   - autoComplete="off" protects sensitive health identifiers
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
//   - HSE: https://www.hse.ie/

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { warnMissingName } from "./dev-warning";

export interface EireIndividualHealthIdentifierInputProps {
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

export default function EireIndividualHealthIdentifierInput(
    props: EireIndividualHealthIdentifierInputProps,
) {
    const p = withDefaults(
        { class: "" as const, value: "" as const, required: false, disabled: false },
        props,
    );
    const restProps = omit(p, "class", "label", "value", "required", "disabled", "onChange");
    warnMissingName(
        "EireIndividualHealthIdentifierInput",
        p.label,
        p["aria-label"],
        p["aria-labelledby"],
    );
    const ihiPattern = () => "[0-9]{10}";

    return (
        <input
            class={`eire-individual-health-identifier-input ${p.class}`}
            type="text"
            aria-label={p.label}
            inputmode="numeric"
            pattern={ihiPattern()}
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
