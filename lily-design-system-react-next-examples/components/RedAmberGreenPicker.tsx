// RedAmberGreenPicker component
//
// A picker for a red/amber/green (RAG) status: a <fieldset role="radiogroup"> of native radios, one per status (red, amber, green), as
// five-star-rating-picker is. The radios give the keys, form submission and form reset natively.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the group via aria-label.
//   statusLabel — (status: string) => string, required. Each option's visible text; without it the option shows its
//     value, so a consumer always supplies the words.
//   value — string, default "". The checked status ("" = none).
//   name — string, default "status". Radio group name for form submission.
//   disabled — boolean, default false.
//   onChange — (value: string) => void, optional. Called when the checked status changes.
//   ...restProps — additional HTML attributes spread onto the fieldset.
//
// Keyboard: native radios. Tab focuses the checked radio; the arrows move and check; Space checks.
//
// References:
//   - WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/

import React, { useEffect, useRef, useState } from "react";
import { warnMissingName } from "./dev-warning";

export interface RedAmberGreenPickerProps {
    className?: string;
    /** Accessible name for the group via aria-label. */
    label: string;
    /** The checked status ("" = none). */
    value?: string;
    /** Radio group name for form submission. */
    name?: string;
    /** Each option's visible text, e.g. (status) => labels[status]. No English default. */
    statusLabel: (status: string) => string;
    /** Whether the entire group is disabled. */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

const STATUSES = ["red", "amber", "green"];

export default function RedAmberGreenPicker({
    className = "",
    label,
    value: valueProp = "",
    name = "status",
    statusLabel,
    disabled = false,
    onChange,
    ...restProps
}: RedAmberGreenPickerProps) {
    warnMissingName(
        "RedAmberGreenPicker",
        label,
        restProps["aria-label"] as string | undefined,
        restProps["aria-labelledby"] as string | undefined,
    );
    const [value, setValue] = useState(valueProp);
    const initialValue = useRef(valueProp);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    // Form reset: the inputs are controlled, so a reset changes the DOM without telling React. Restore the initial
    // value one tick later, after the browser has reset the DOM, and not when the reset was cancelled.
    const rootRef = useRef<HTMLFieldSetElement>(null);
    useEffect(() => {
        const root = rootRef.current;
        const form = root?.closest("form");
        if (!root || !form) return;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const onReset = (event: Event) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (event.defaultPrevented) return;
                setValue((current) => {
                    if (current !== initialValue.current)
                        onChangeRef.current?.(initialValue.current);
                    return initialValue.current;
                });
                for (const input of root.querySelectorAll<HTMLInputElement>(
                    'input[type="radio"]',
                )) {
                    input.checked = input.value === initialValue.current;
                }
            }, 0);
        };
        form.addEventListener("reset", onReset);
        return () => {
            clearTimeout(timer);
            form.removeEventListener("reset", onReset);
        };
    }, []);

    const handleChange = (status: string) => {
        setValue(status);
        onChange?.(status);
    };

    return (
        <fieldset
            ref={rootRef}
            className={`red-amber-green-picker ${className}`}
            role="radiogroup"
            aria-label={label}
            disabled={disabled}
            {...restProps}
        >
            {STATUSES.map((status) => (
                <label key={status}>
                    <input
                        type="radio"
                        name={name}
                        value={status}
                        checked={value === status}
                        onChange={() => handleChange(status)}
                    />
                    {statusLabel ? statusLabel(status) : status}
                </label>
            ))}
        </fieldset>
    );
}
