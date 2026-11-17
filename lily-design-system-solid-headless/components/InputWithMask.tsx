// InputWithMask component
//
// A text input that displays a format mask placeholder (such as
// "(___) ___-____" for a phone number) which the user fills in. The mask
// is rendered as a decorative <span aria-hidden> next to the input so it
// can be visually overlaid by consumer CSS. Accessibility relies on the
// input's required aria-label; the mask is not part of the accessible name.
//
// Props:
//   class   — string, optional. CSS class name appended to the root.
//   label       — string, REQUIRED. aria-label for the input.
//   mask        — string, REQUIRED. Format mask (e.g., "(___) ___-____").
//   value       — string, default "". Input value.
//   placeholder — string, optional. HTML placeholder.
//   disabled    — boolean, default false.
//   onInput     — (event: Event) => void, optional.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <InputWithMask
//     label="Phone number"
//     mask="(___) ___-____"
//     value={phone}
//     onInput={(e) => setPhone((e.target as HTMLInputElement).value)}
//   />
//
// Accessibility:
//   - aria-label on the <input> is the accessible name (REQUIRED)
//   - The mask span is decorative (aria-hidden="true")
//   - The mask is also exposed as a data-mask attribute on the root for consumer styling/JS
//
// Internationalization:
//   - label is consumer-supplied for localized accessible names
//   - mask string itself is consumer-supplied (varies by locale)
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - label and mask are non-optional in the interface
//   - The mask display is via a hidden span; consumer overlays it via CSS
//
// References:
//   - USWDS Input mask: https://designsystem.digital.gov/components/input-mask/

import { merge, omit } from "solid-js";
import { attr } from "./attr";
export interface InputWithMaskProps {
    class?: string;
    /** aria-label for the input (required for accessibility) */
    label: string;
    /** Format mask, e.g. "(___) ___-____" */
    mask: string;
    /** Input value */
    value?: string;
    /** HTML placeholder */
    placeholder?: string;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Input change handler */
    onInput?: (event: Event) => void;
    [key: string]: unknown;
}

export default function InputWithMask(props: InputWithMaskProps) {
    const p = merge({ class: "" as const, value: "" as const, disabled: false }, props);
    const restProps = omit(
        p,
        "class",
        "label",
        "mask",
        "value",
        "placeholder",
        "disabled",
        "onInput",
    );
    return (
        <div
            class={`input-with-mask ${p.class}`}
            data-mask={attr(p.mask)}
            {...restProps}
        >
            <span
                class="input-with-mask-display"
                aria-hidden="true"
            >
                {p.mask}
            </span>
            <input
                class="input-with-mask-control"
                type="text"
                aria-label={p.label}
                value={p.value}
                placeholder={p.placeholder}
                disabled={p.disabled}
                onInput={p.onInput}
            />
        </div>
    );
}
