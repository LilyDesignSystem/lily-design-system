// Slider component
//
// A headless range slider using the native HTML <input type="range"> element.
// Allows users to select a numeric value by dragging a handle along a track.
// Commonly used for adjusting settings like volume, brightness, price ranges,
// or timelines. Provides two-way binding and configurable min/max/step values.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   value — number, default 50. Current slider value; bindable with value + onChange.
//   min — number, default 0. Minimum allowed value.
//   max — number, default 100. Maximum allowed value.
//   step — number, default 1. Increment between allowed values.
//   disabled — boolean, default false. Whether the slider is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <Slider label="Volume" value={value} onChange={setValue} min={0} max={100} step={5} />
//
// Examples:
//
//   <Slider label="Brightness" value={brightness} onChange={setBrightness} min={0} max={100} />
//
//
//   <Slider label="Max price" value={maxPrice} onChange={setMaxPrice} min={0} max={1000} step={10} />
//
// Keyboard:
//   - Left Arrow/Down Arrow: decrease value by one step (native behavior)
//   - Right Arrow/Up Arrow: increase value by one step (native behavior)
//   - Home: set to minimum value (native behavior)
//   - End: set to maximum value (native behavior)
//   - Page Up/Down: increase/decrease by a larger step (browser-dependent)
//
// Accessibility:
//   - aria-label provides the accessible name for the slider
//   - Native <input type="range"> has implicit slider role
//   - min, max, step attributes communicate range to assistive technology
//
// Internationalization:
//   - The label prop externalizes the accessible name for localization
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Value uses controlled for two-way binding with value + onChange
//   - Relies entirely on native <input type="range"> behavior
//
// References:
//   - WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
//   - MDN input type="range": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range

import React from "react";

export interface SliderProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Current value. Bindable. */
    value?: number;
    /** Minimum value. */
    min?: number;
    /** Maximum value. */
    max?: number;
    /** Step increment. */
    step?: number;
    /** Whether disabled. */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: number) => void;
    [key: string]: unknown;
}

export default function Slider({
    className = "",
    label,
    value = 50,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    onChange,
    ...restProps
}: SliderProps) {
    return (
        <input
        className={`slider ${className}`}
        type="range"
        aria-label={label}
        value={value} onChange={(e) => onChange?.(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        {...restProps}
        />
    );
}
