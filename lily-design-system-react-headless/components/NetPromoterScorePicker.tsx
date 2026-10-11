// NetPromoterScorePicker component
//
// A headless Net Promoter Score (NPS) rating input that renders a fieldset
// with role="radiogroup" containing 11 radio buttons (0-10). NPS is a widely
// used customer loyalty metric where scores are categorized as Detractors (0-6),
// Passives (7-8), and Promoters (9-10). The value prop is bindable for reactive
// form integration.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for the radiogroup via aria-label.
//   value — string, default "". Currently selected NPS score ("0"-"10"); bindable via controlled.
//   name — string, default "nps". Name attribute for the radio input group.
//   ...restProps — additional HTML attributes spread onto the <fieldset>.
//
// Syntax:
//   <NetPromoterScorePicker label="How likely are you to recommend us?" value={score} onChange={setScore} />
//
// Examples:
//
//   <NetPromoterScorePicker
//     label="How likely are you to recommend us?"
//     value={score} onChange={setScore}
//   />
//
//
//   <NetPromoterScorePicker
//     label="Rate our service"
//     value={score} onChange={setScore}
//     name="service-nps"
//   />
//
// Keyboard:
//   - Arrow keys: navigate between radio buttons (native radio group behavior)
//   - Space: select the focused radio button
//   - Tab: move focus into/out of the radio group
//
// Accessibility:
//   - role="radiogroup" on the fieldset
//   - aria-label on the fieldset from the label prop
//   - Each radio button has aria-label with its numeric value
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Radio values are strings ("0" through "10")
//   - Part of the Input/View pattern; pairs with NetPromoterScoreView
//
// References:
//   - Net Promoter Score: https://en.wikipedia.org/wiki/Net_promoter_score
//   - WAI-ARIA Radiogroup Role: https://www.w3.org/TR/wai-aria-1.2/#radiogroup

import React, { useEffect, useRef } from "react";

export interface NetPromoterScorePickerProps {
    className?: string;
    /** Accessible label describing the rating input purpose */
    label: string;
    /** Currently selected NPS score value (0-10), bindable */
    value?: string;
    /** Name attribute for the radio input group */
    name?: string;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function NetPromoterScorePicker({
    className = "",
    label,
    value = "",
    name = "nps",
    onChange,
    ...restProps
}: NetPromoterScorePickerProps) {
    const initialValue = useRef(value);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    // Form reset: the inputs are controlled, so a reset changes the DOM without
    // telling React, and the component would keep a value the form no longer
    // submits. Restore the initial value instead — one tick later, after the
    // browser has reset the DOM, and not when the reset was cancelled.
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
                // Controlled: tell the consumer, as a user's choice would.
                if (value !== initialValue.current) onChangeRef.current?.(initialValue.current);
                for (const input of root.querySelectorAll<HTMLInputElement>('input[type="radio"]')) {
                    input.checked = input.value === String(initialValue.current);
                }
            }, 0);
        };
        form.addEventListener("reset", onReset);
        return () => {
            clearTimeout(timer);
            form.removeEventListener("reset", onReset);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    return (
        <fieldset
            ref={rootRef}
            className={`net-promoter-score-picker ${className}`}
            role="radiogroup"
            aria-label={label}
            {...restProps}
        >
            {Array.from({ length: 11 }, (_, i) => i).map((score) => (
                <label key={score}>
                    <input
                        type="radio"
                        name={name}
                        value={String(score)}
                        checked={value === String(score)}
                        aria-label={String(score)}
                        onChange={() => {
                            onChange?.(String(score));
                        }}
                    />
                    {score}
                </label>
            ))}
        </fieldset>
    );
}
