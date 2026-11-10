// TextAreaInputWithCharacterCounter component
//
// A headless component that wraps a native <textarea> and a character counter
// caption inside a <div>. The counter displays "[number] of [maximum] characters"
// below the text-area-input and updates reactively as the user types.
//
// Props:
//   className — string, optional. CSS class name.
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

import React, { useEffect, useId, useState } from "react";
import { warnMissingName } from "./dev-warning";

export interface TextAreaInputWithCharacterCounterProps {
    className?: string;
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

export default function TextAreaInputWithCharacterCounter({
    className = "",
    label,
    value = "",
    maxLength,
    counterTemplate = "{count} / {max}",
    announceDelay = 1000,
    rows = undefined,
    placeholder = undefined,
    onChange,
    required = false,
    disabled = false,
    ...restProps
}: TextAreaInputWithCharacterCounterProps) {
    warnMissingName(
        "TextAreaInputWithCharacterCounter",
        label,
        restProps["aria-label"],
        restProps["aria-labelledby"],
    );
    const counterId = useId();
    const counterText = counterTemplate
        .replace("{count}", String(value.length))
        .replace("{max}", String(maxLength));

    // The status takes the text only once typing has paused for announceDelay ms; the visible counter is aria-hidden.
    const [announced, setAnnounced] = useState(counterText);
    useEffect(() => {
        const timer = setTimeout(() => setAnnounced(counterText), announceDelay);
        return () => clearTimeout(timer);
    }, [counterText, announceDelay]);

    return (
        <div
            className={`text-area-input-with-character-counter ${className}`}
            {...restProps}
        >
            <textarea
                aria-label={label}
                aria-describedby={counterId}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                maxLength={maxLength}
                rows={rows}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
            />
            <span id={counterId}>
                <span aria-hidden="true">{counterText}</span>
                <span
                    className="screen-reader-span"
                    role="status"
                >
                    {announced}
                </span>
            </span>
        </div>
    );
}
