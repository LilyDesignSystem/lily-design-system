// RadioInput component
//
// A headless bare <input type="radio"> element without a wrapping label, designed
// for custom radio group layouts where labels are provided separately or by a
// parent component. It uses aria-label for accessible naming. Useful in custom
// card selection interfaces, segmented controls, and layouts where the radio
// button and its label need independent positioning or styling.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   name — string, optional. Radio group name for mutual exclusion.
//   value — string, optional. The value representing this radio option.
//   checked — boolean, default false. Whether this radio button is selected.
//   disabled — boolean, default false. Whether the radio button is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <RadioInput label="Option A" name="choice" value="a" />
//
// Examples:
//   
//   <RadioInput label="Option A" name="choice" value="a" />
//
//   
//   <RadioInput label="Small" name="size" value="small" checked />
//   <RadioInput label="Medium" name="size" value="medium" />
//   <RadioInput label="Large" name="size" value="large" />
//
// Keyboard:
//   - Tab: moves focus to the selected radio in the group (or first if none selected)
//   - Arrow Up / Arrow Left: moves selection to the previous radio in the group
//   - Arrow Down / Arrow Right: moves selection to the next radio in the group
//   - Space: selects the focused radio button if not already selected
//
// Accessibility:
//   - aria-label provides an accessible name since no visible <label> is included
//   - Native radio input provides built-in role="radio" semantics
//
// Internationalization:
//   - The label prop is the only user-facing text; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Do not wrap in a <div> or <label> — renders a bare <input> element
//   - Does not use controlled for checked; consumers use event handlers or bind directly
//
// References:
//   - WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton/
//   - MDN input type="radio": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio

import React, { useState } from "react";

export interface RadioInputProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Radio group name. */
    name?: string;
    /** Value for this option. */
    value?: string;
    /** Whether checked. */
    checked?: boolean;
    /** Whether disabled. */
    disabled?: boolean;
    /** Callback when checked changes. */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    [key: string]: unknown;
}

export default function RadioInput({
    className = "",
    label,
    name = undefined,
    value = undefined,
    checked: checkedProp = false,
    disabled = false,
    onChange,
    ...restProps
}: RadioInputProps) {
    const [checked, setChecked] = useState(checkedProp);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(e.target.checked);
        onChange?.(e);
    };

    return (
        <input
        className={`radio-input ${className}`}
        type="radio"
        aria-label={label}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        {...restProps}
        />
    );
}
