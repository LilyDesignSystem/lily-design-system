// TextAreaInputWithCharacterCounter component
//
// A headless component that wraps a native <textarea> and a character counter
// caption inside a <div>. The counter displays "[number] of [maximum] characters"
// below the text-area-input and updates reactively as the user types.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name for the text-area-input via aria-label.
//   value — string, default "". Current text-area-input value.
//   maxLength — number, required. Maximum number of characters allowed.
//   counterTemplate — string, default "{count} / {max}": the numbers alone, no English. Counter text template.
//   announceDelay — number, default 1000. Milliseconds of quiet before the counter's status takes the new count.
//   rows — number, optional. Number of visible text rows.
//   placeholder — string, optional. Placeholder text for the text-area-input.
//   onChange — (value: string) => void, optional. Callback when value changes.
//   required — boolean, default false. Whether the text-area-input is required.
//   disabled — boolean, default false. Whether the text-area-input is disabled.
//   ...restProps — additional HTML attributes spread onto the wrapper <div>.
//
// Syntax:
//   <TextAreaInputWithCharacterCounter label="Feedback" maxLength={500} value={value} onChange={setValue} />
//
// Keyboard:
//   - Tab: Focus the text-area-input (native browser behavior)
//   - Standard text-area-input keyboard interactions
//
// Accessibility:
//   - aria-label on the text-area-input provides accessible name
//   - aria-describedby links text-area-input to the counter
//   - the visible counter is aria-hidden; a visually hidden role="status" takes the same text announceDelay ms after
//     typing pauses, so a run of keystrokes is announced once
//
// Internationalization:
//   - counterTemplate prop allows full customization of counter text
//   - {count} and {max} placeholders are replaced with actual values
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - restProps spread onto the wrapper <div>, not the text-area-input
//
// References:
//   - MDN text-area-input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/text-area-input

import { merge, omit, createEffect, createSignal, createUniqueId, untrack } from "solid-js";
import { warnMissingName } from "./dev-warning";

export interface TextAreaInputWithCharacterCounterProps {
    class?: string;
    /** Accessible name for the text-area-input */
    label: string;
    /** Current text-area-input value */
    value?: string;
    /** Maximum number of characters allowed */
    maxLength: number;
    /** Counter text template with {count} and {max} placeholders */
    counterTemplate?: string;
    /** Milliseconds of quiet before the counter's status takes the new count */
    announceDelay?: number;
    /** Number of visible text rows */
    rows?: number;
    /** Placeholder text for the text-area-input */
    placeholder?: string;
    /** Callback when value changes */
    onChange?: (value: string) => void;
    /** Whether the text-area-input is required */
    required?: boolean;
    /** Whether the text-area-input is disabled */
    disabled?: boolean;
    [key: string]: unknown;
}

export default function TextAreaInputWithCharacterCounter(
    props: TextAreaInputWithCharacterCounterProps,
) {
    const p = merge(
        {
            class: "" as const,
            value: "" as const,
            counterTemplate: "{count} / {max}" as const,
            announceDelay: 1000,
            required: false,
            disabled: false,
        },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "label",
        "value",
        "maxLength",
        "counterTemplate",
        "announceDelay",
        "rows",
        "placeholder",
        "onChange",
        "required",
        "disabled",
    );
    warnMissingName(
        "TextAreaInputWithCharacterCounter",
        p.label,
        p["aria-label"],
        p["aria-labelledby"],
    );
    const counterId = createUniqueId();
    const counterText = () =>
        p.counterTemplate
            .replace("{count}", String(p.value.length))
            .replace("{max}", String(p.maxLength));

    // The status takes the text only once typing has paused for p.announceDelay ms; the visible counter is aria-hidden.
    const [announced, setAnnounced] = createSignal(counterText());
    createEffect(
        () => [counterText(), p.announceDelay],
        () =>
            untrack(() => {
                const timer = setTimeout(() => setAnnounced(counterText()), p.announceDelay);
                return () => clearTimeout(timer);
            }),
    );

    return (
        <div
            class={`text-area-input-with-character-counter ${p.class}`}
            {...restProps}
        >
            <textarea
                aria-label={p.label}
                aria-describedby={counterId}
                value={p.value}
                onInput={(e) => p.onChange?.(e.currentTarget.value)}
                maxlength={p.maxLength}
                rows={p.rows}
                placeholder={p.placeholder}
                required={p.required}
                disabled={p.disabled}
            />
            <span id={counterId}>
                <span aria-hidden="true">{counterText()}</span>
                <span
                    class="screen-reader-span"
                    role="status"
                >
                    {announced()}
                </span>
            </span>
        </div>
    );
}
