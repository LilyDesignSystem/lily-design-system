// OneTimePasswordInput component
//
// A headless one-time-password (OTP / verification code) field: ONE native
// <input type="text"> (not segmented boxes) so SMS autofill, paste and the
// platform numeric keypad all work. Length is capped natively via maxLength.
//
// Props:
//   class -- string, optional. CSS class name.
//   label -- string, required. Accessible name via aria-label.
//   length -- number, required. Characters in the code. No default.
//   value -- string, default "". Controlled; supports value + onChange.
//   inputMode -- string, default "numeric". Virtual keyboard hint.
//   pattern -- string, default "[0-9]*". Allowed characters.
//   name, required, disabled -- standard form props.
//   ...restProps -- spread onto the <input>.
//
// Keyboard: none beyond native text editing.
// Accessibility: aria-label={label}; autocomplete="one-time-code".
// Internationalization: label is consumer-supplied; no hardcoded strings.

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
import { warnMissingName } from "./dev-warning";

export interface OneTimePasswordInputProps {
    class?: string;
    /** Accessible label. */
    label: string;
    /** Number of characters in the code. */
    length: number;
    /** Current value. Bindable. */
    value?: string;
    /** Virtual keyboard hint. */
    inputMode?: string;
    /** Allowed characters pattern. */
    pattern?: string;
    /** Form field name. */
    name?: string;
    /** Whether required. */
    required?: boolean;
    /** Whether disabled. */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function OneTimePasswordInput(props: OneTimePasswordInputProps) {
    const p = merge(
        {
            class: "" as const,
            value: "" as const,
            inputMode: "numeric" as const,
            pattern: "[0-9]*" as const,
            required: false,
            disabled: false,
        },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "label",
        "length",
        "value",
        "inputMode",
        "pattern",
        "name",
        "required",
        "disabled",
        "onChange",
    );
    warnMissingName("OneTimePasswordInput", p.label, p["aria-label"], p["aria-labelledby"]);
    return (
        <input
            class={`one-time-password-input ${p.class}`}
            type="text"
            inputmode={p.inputMode as JSX.InputHTMLAttributes<HTMLInputElement>["inputmode"]}
            autocomplete="one-time-code"
            maxlength={p.length}
            pattern={p.pattern}
            spellcheck="false"
            autocapitalize="off"
            aria-label={p.label}
            data-length={attr(p.length)}
            name={p.name}
            value={p.value}
            onInput={(e) => p.onChange?.(e.currentTarget.value)}
            required={p.required}
            disabled={p.disabled}
            {...restProps}
        />
    );
}
