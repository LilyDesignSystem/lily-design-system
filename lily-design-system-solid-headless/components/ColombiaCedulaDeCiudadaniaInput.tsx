// ColombiaCedulaDeCiudadaniaInput component
//
// A headless input for entering Colombia's Cedula de Ciudadania Number.
// Format: Six to ten digits, usually written with dots as thousands separators (1.020.304.050). Newer cards carry the ten-digit Número Único de Identificación Personal (NUIP). There is no check digit.
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
//   <ColombiaCedulaDeCiudadaniaInput label="Cedula de Ciudadania Number" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://en.wikipedia.org/wiki/Colombian_identity_card

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { warnMissingName } from "./dev-warning";

export interface ColombiaCedulaDeCiudadaniaInputProps {
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

export default function ColombiaCedulaDeCiudadaniaInput(
    props: ColombiaCedulaDeCiudadaniaInputProps,
) {
    const p = withDefaults(
        { class: "" as const, value: "" as const, required: false, disabled: false },
        props,
    );
    const restProps = omit(p, "class", "label", "value", "required", "disabled", "onChange");
    warnMissingName(
        "ColombiaCedulaDeCiudadaniaInput",
        p.label,
        p["aria-label"],
        p["aria-labelledby"],
    );
    return (
        <input
            class={`colombia-cedula-de-ciudadania-input ${p.class}`}
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
