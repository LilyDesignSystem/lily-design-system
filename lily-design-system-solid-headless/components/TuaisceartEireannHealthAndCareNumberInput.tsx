// TuaisceartEireannHealthAndCareNumberInput component
//
// A headless input for entering a Tuaisceart Eireann Health and Care (H&C)
// Number, a 10-digit identifier displayed as XXX XXX XXXX, used by HSC
// Tuaisceart Eireann to uniquely identify patients.
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
//   <TuaisceartEireannHealthAndCareNumberInput label="H&C Number" value={value} onChange={setValue} />
//
// Examples:
//
//   <TuaisceartEireannHealthAndCareNumberInput label="H&C Number" required />
//
//
//   <TuaisceartEireannHealthAndCareNumberInput label="H&C Number" disabled />
//
// Keyboard:
//   - Standard text input keyboard behavior
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - inputMode="numeric" hints mobile devices to show numeric keyboard
//   - pattern="[0-9]{3} [0-9]{3} [0-9]{4}" validates 3-3-4 digit format
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
//   - HSC NI: https://online.hscni.net/

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { warnMissingName } from "./dev-warning";

export interface TuaisceartEireannHealthAndCareNumberInputProps {
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

export default function TuaisceartEireannHealthAndCareNumberInput(
    props: TuaisceartEireannHealthAndCareNumberInputProps,
) {
    const p = withDefaults(
        { class: "" as const, value: "" as const, required: false, disabled: false },
        props,
    );
    const restProps = omit(p, "class", "label", "value", "required", "disabled", "onChange");
    warnMissingName(
        "TuaisceartEireannHealthAndCareNumberInput",
        p.label,
        p["aria-label"],
        p["aria-labelledby"],
    );
    const hcPattern = () => "[0-9]{3} [0-9]{3} [0-9]{4}";

    return (
        <input
            class={`tuaisceart-eireann-health-and-care-number-input ${p.class}`}
            type="text"
            aria-label={p.label}
            inputmode="numeric"
            pattern={hcPattern()}
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
