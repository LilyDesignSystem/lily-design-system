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
//   class — string, optional. CSS class name.
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
//   - Each input is named by `digitLabel(position, length)` when given (e.g. "Digit 2 of 4"), else by `label`
//   - inputmode="numeric" ensures numeric keyboard on mobile devices
//   - maxlength="1" restricts each input to a single character
//
// Internationalization:
//   - The label prop is consumer-provided for the group name
//   - Each digit's name comes from the consumer's `digitLabel`; without it the group `label` is used. No English default
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Only accepts numeric characters (0-9); non-numeric input is rejected
//   - The length prop is captured at initialization; do not change dynamically
//
// References:
//   - WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group

import { merge, omit, createEffect, createSignal, onSettled, untrack } from "solid-js";
import { warnMissingName } from "./dev-warning";

export interface PinInputDivProps {
    class?: string;
    /** Accessible label for the group of inputs */
    label: string;
    /** Number of digit inputs to render */
    length?: number;
    /**
     * Each digit input's accessible name, e.g. (n, of) => `Digit ${n} of ${of}`.
     * Without it each input is named by `label`: no English default.
     */
    digitLabel?: (position: number, length: number) => string;
    /** Combined string of all entered digits */
    value?: string;
    /** Whether all inputs are disabled */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function PinInputDiv(props: PinInputDivProps) {
    const p = merge({ class: "" as const, length: 4, value: "" as const, disabled: false }, props);
    const restProps = omit(
        p,
        "class",
        "label",
        "length",
        "digitLabel",
        "value",
        "disabled",
        "onChange",
    );
    warnMissingName("PinInputDiv", p.label, p["aria-label"], p["aria-labelledby"]);
    // Seeded from the initial `value`, which used to be ignored.
    const initialDigits = {
        current: Array.from({ length: p.length }, (_, i) =>
            /^[0-9]$/.test(p.value[i] ?? "") ? p.value[i] : "",
        ),
    };
    const [digits, setDigits] = createSignal<string[]>(() => [...initialDigits.current]);
    const inputRefs: { current: (HTMLInputElement | null)[] } = { current: [] };

    // Form reset: the inputs are controlled, so a reset changes the DOM without
    // telling React, and the component would keep a p.value the form no longer
    // submits. Restore the initial p.value instead — one tick later, after the
    // browser has reset the DOM, and not when the reset was cancelled.
    const rootRef: { current: HTMLDivElement | null } = { current: null };
    onSettled(() =>
        untrack(() => {
            const root = rootRef.current;
            const form = root?.closest("form");
            if (!root || !form) return;
            let timer: ReturnType<typeof setTimeout> | undefined;
            const onReset = (event: Event) => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    if (event.defaultPrevented) return;
                    setDigits([...initialDigits.current]);
                    inputRefs.current.forEach((input, i) => {
                        if (input) input.value = initialDigits.current[i];
                    });
                }, 0);
            };
            form.addEventListener("reset", onReset);
            return () => {
                clearTimeout(timer);
                form.removeEventListener("reset", onReset);
            };
        }),
    );

    // Sync combined p.value to parent
    createEffect(
        () => [digits()],
        () =>
            untrack(() => {
                const combined = digits().join("");
                if (combined !== p.value) {
                    p.onChange?.(combined);
                }
            }),
    );

    function handleInput(index: number, event: Event & { currentTarget: HTMLInputElement }): void {
        const target = event.currentTarget;
        const inputValue = target.value;

        if (inputValue && !/^[0-9]$/.test(inputValue)) {
            target.value = digits()[index];
            return;
        }

        const newDigits = [...digits()];
        newDigits[index] = inputValue;
        setDigits(newDigits);

        if (inputValue && index < p.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handleKeyDown(
        index: number,
        event: KeyboardEvent & { currentTarget: HTMLInputElement },
    ): void {
        const target = event.currentTarget;

        if (event.key === "Backspace") {
            if (!target.value && index > 0) {
                inputRefs.current[index - 1]?.focus();
                const newDigits = [...digits()];
                newDigits[index - 1] = "";
                setDigits(newDigits);
            } else {
                const newDigits = [...digits()];
                newDigits[index] = "";
                setDigits(newDigits);
            }
        } else if (event.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (event.key === "ArrowRight" && index < p.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    return (
        <div
            ref={(el) => (rootRef.current = el)}
            class={`pin-input-div ${p.class}`}
            role="group"
            aria-label={p.label}
            {...restProps}
        >
            {Array.from({ length: p.length }, (_, index) => (
                <input
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputmode="numeric"
                    maxlength={1}
                    aria-label={p.digitLabel ? p.digitLabel(index + 1, p.length) : p.label}
                    value={digits()[index]}
                    disabled={p.disabled}
                    onInput={(e) => handleInput(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                />
            ))}
        </div>
    );
}
