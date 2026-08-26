// PinInputDiv component
//
// A headless PIN input that renders a group of single-character numeric inputs
// for entering PINs, verification codes, or one-time passwords (OTPs). Each
// digit occupies its own input field, creating a segmented entry experience that
// communicates the expected code length. Focus auto-advances on digit entry and
// retreats on Backspace. Commonly used in two-factor authentication, SMS
// verification, and secure PIN entry interfaces.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for the group of inputs via aria-label.
//   length — number, default 4. Number of digit inputs to render.
//   value — string, default "". Combined string of all entered digits.
//   disabled — boolean, default false. Whether all inputs are disabled.
//   onChange — callback, optional. Called with the combined digit string when value changes.
//   ...restProps — additional HTML attributes spread onto the group <div>.
//
// Syntax:
//   <PinInputDiv label="Enter PIN" value={pin} onChange={setPin} />
//
// Examples:
//   <PinInputDiv label="Enter PIN" value={pin} onChange={setPin} />
//   <PinInputDiv label="Verification Code" length={6} value={code} onChange={setCode} />
//   <PinInputDiv label="Locked PIN" disabled />
//
// Keyboard:
//   - Digit entry: enters value and auto-focuses next input
//   - Backspace: clears current digit or moves to previous input if empty
//   - ArrowLeft: focuses previous input
//   - ArrowRight: focuses next input
//   - Tab: standard tab navigation in/out of the group
//
// Accessibility:
//   - role="group" with aria-label on the container identifies the PIN group
//   - Each input has aria-label="Digit X of Y" for positional context
//   - inputmode="numeric" ensures numeric keyboard on mobile devices
//   - maxlength="1" restricts each input to a single character
//
// Internationalization:
//   - The label prop is consumer-provided for the group name
//   - Individual "Digit X of Y" labels are currently hardcoded in English
//   - No other hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Only accepts numeric characters (0-9); non-numeric input is rejected
//   - The length prop is captured at initialization; do not change dynamically
//
// References:
//   - WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group

import React, { useState, useRef, useEffect } from "react";

export interface PinInputDivProps {
    className?: string;
    /** Accessible label for the group of inputs */
    label: string;
    /** Number of digit inputs to render */
    length?: number;
    /** Combined string of all entered digits */
    value?: string;
    /** Whether all inputs are disabled */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function PinInputDiv({
    className = "",
    label,
    length = 4,
    value = "",
    disabled = false,
    onChange,
    ...restProps
}: PinInputDivProps) {
    const [digits, setDigits] = useState<string[]>(() => Array.from({ length }, () => ""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Sync combined value to parent
    useEffect(() => {
        const combined = digits.join("");
        if (combined !== value) {
            onChange?.(combined);
        }
    }, [digits]);

    function handleInput(index: number, event: React.FormEvent<HTMLInputElement>): void {
        const target = event.currentTarget;
        const inputValue = target.value;

        if (inputValue && !/^[0-9]$/.test(inputValue)) {
            target.value = digits[index];
            return;
        }

        const newDigits = [...digits];
        newDigits[index] = inputValue;
        setDigits(newDigits);

        if (inputValue && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>): void {
        const target = event.currentTarget;

        if (event.key === "Backspace") {
            if (!target.value && index > 0) {
                inputRefs.current[index - 1]?.focus();
                const newDigits = [...digits];
                newDigits[index - 1] = "";
                setDigits(newDigits);
            } else {
                const newDigits = [...digits];
                newDigits[index] = "";
                setDigits(newDigits);
            }
        } else if (event.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (event.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    return (
        <div
            className={`pin-input-div ${className}`}
            role="group"
            aria-label={label}
            {...restProps}
        >
            {Array.from({ length }, (_, index) => (
                <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    aria-label={`Digit ${index + 1} of ${length}`}
                    value={digits[index]}
                    disabled={disabled}
                    onInput={(e) => handleInput(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                />
            ))}
        </div>
    );
}
