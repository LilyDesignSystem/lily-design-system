// Dial component
//
// A circular dial or knob control for adjusting a numeric value within a
// defined range. Renders as a div with role="slider" and full keyboard
// navigation. Common use cases include volume controls, thermostats, and
// audio equipment settings in control panels and configuration interfaces.
//
// Props:
//   className — string, optional. CSS class name.
//   value — number, default 0. Current dial value; bindable.
//   min — number, default 0. Minimum allowed value.
//   max — number, default 100. Maximum allowed value.
//   step — number, default 1. Increment per key press.
//   label — string, required. Accessible name for the dial.
//   disabled — boolean, default false. Whether the dial is disabled.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <Dial label="Volume" value={value} onChange={setValue} min={0} max={100} />
//
// Examples:
//   
//   <Dial label="Brightness" value={brightness} onChange={setBrightness} min={0} max={100} step={5} />
//
//   
//   <Dial label="Disabled control" value={30} disabled />
//
// Keyboard:
//   - ArrowRight/ArrowUp: increase value by one step
//   - ArrowLeft/ArrowDown: decrease value by one step
//   - Shift+Arrow: increase/decrease value by 10 steps
//   - Home: set value to minimum
//   - End: set value to maximum
//
// Accessibility:
//   - role="slider" indicates a range input control
//   - aria-label provides the accessible name
//   - aria-valuenow, aria-valuemin, aria-valuemax communicate current range state
//   - aria-disabled="true" present only when disabled
//   - tabindex="0" when enabled, tabindex="-1" when disabled
//
// Internationalization:
//   - The label prop accepts any string; consumers provide localized text
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Internal clamp() ensures value stays within min/max bounds
//   - No native dial element exists; uses div with role="slider"
//
// References:
//   - WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
//   - WAI-ARIA slider role: https://www.w3.org/TR/wai-aria-1.2/#slider

import React, { useState } from "react";

export interface DialProps {
    className?: string;
    /** Current value. Bindable. */
    value?: number;
    /** Minimum value. */
    min?: number;
    /** Maximum value. */
    max?: number;
    /** Step increment per key press. */
    step?: number;
    /** Accessible label for the dial. */
    label: string;
    /** Whether the dial is disabled. */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: number) => void;
    [key: string]: unknown;
}

export default function Dial({
    className = "",
    value: valueProp = 0,
    min = 0,
    max = 100,
    step = 1,
    label,
    disabled = false,
    onChange,
    ...restProps
}: DialProps) {
    const [value, setValue] = useState(valueProp);

    function clamp(v: number) {
        return Math.min(max, Math.max(min, v));
    }

    function handleKeyDown(event: React.KeyboardEvent) {
        if (disabled) return;
        const multiplier = event.shiftKey ? 10 : 1;
        let newValue = value;
        switch (event.key) {
            case "ArrowRight":
            case "ArrowUp":
                newValue = clamp(value + step * multiplier);
                setValue(newValue);
                onChange?.(newValue);
                event.preventDefault();
                break;
            case "ArrowLeft":
            case "ArrowDown":
                newValue = clamp(value - step * multiplier);
                setValue(newValue);
                onChange?.(newValue);
                event.preventDefault();
                break;
            case "Home":
                setValue(min);
                onChange?.(min);
                event.preventDefault();
                break;
            case "End":
                setValue(max);
                onChange?.(max);
                event.preventDefault();
                break;
        }
    }

    return (
        <div
        className={`dial ${className}`}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-disabled={disabled || undefined}
        onKeyDown={handleKeyDown}
        {...restProps}
        ></div>
    );
}
