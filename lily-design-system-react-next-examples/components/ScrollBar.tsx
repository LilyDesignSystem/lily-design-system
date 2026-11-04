// ScrollBar component
//
// A headless scrollbar track element that provides the ARIA scrollbar role
// and value attributes for a custom scrollbar control. Renders a focusable
// <div> with orientation, value range, and accessible labeling, and owns the
// keyboard: the keys move the value. The consumer provides the visual thumb
// element as children, scrolls its content to the value, and implements drag
// handling.
//
// Props:
//   className — string, optional. CSS class name.
//   orientation — "vertical" | "horizontal", default "vertical". The scrollbar direction.
//   value — number, optional. The scroll position (controlled when given), reflected in aria-valuenow.
//   defaultValue — number, default 0. The starting position when uncontrolled.
//   min — number, default 0. The start of the range.
//   max — number, default 100. The end of the range.
//   step — number, default 1. The arrow-key increment.
//   pageStep — number, default 10. The Page Up / Page Down increment.
//   controls — string, optional. The id of the scrolled element, via aria-controls.
//   onChange — (value: number) => void, optional. Called with the new value on a key.
//   label — string, required. Accessible name for the scrollbar via aria-label.
//   children — ReactNode, required. ScrollBar content, typically the draggable thumb element.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <ScrollBar orientation="vertical" label="Scroll" controls="messages" value={position} onChange={setPosition}>
//     <div>thumb</div>
//   </ScrollBar>
//
// Examples:
//
//   <ScrollBar orientation="horizontal" label="Timeline scroll">
//     <div class="thumb"></div>
//   </ScrollBar>
//
//
//   <ScrollBar orientation="vertical" label="Page scroll" value={scrollPos} onChange={setScrollPos}>
//     <div class="thumb"></div>
//   </ScrollBar>
//
// Keyboard:
//   - Arrow Up/Left: decrease value by step
//   - Arrow Down/Right: increase value by step
//   - Page Up/Down: decrease/increase value by pageStep
//   - Home: value to min
//   - End: value to max
//   The value is clamped to [min, max].
//
// Accessibility:
//   - role="scrollbar" identifies the element as a scrollbar control
//   - aria-orientation indicates horizontal or vertical direction
//   - aria-valuenow/aria-valuemin/aria-valuemax track scroll position
//   - aria-label provides the accessible name
//
// Internationalization:
//   - The label prop externalizes the accessible label string
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - The component moves the value on keys; the consumer scrolls its content to
//     the value, passes the value back as the content scrolls, and handles drag
//
// References:
//   - WAI-ARIA scrollbar role: https://www.w3.org/TR/wai-aria-1.2/#scrollbar

import React, { useState } from "react";
import { warnMissingName } from "./dev-warning";

export interface ScrollBarProps {
    className?: string;
    /** ScrollBar orientation. */
    orientation?: "vertical" | "horizontal";
    /** Scroll position; controlled when given. */
    value?: number;
    /** Starting position when uncontrolled. */
    defaultValue?: number;
    /** Start of the range. */
    min?: number;
    /** End of the range. */
    max?: number;
    /** Arrow-key increment. */
    step?: number;
    /** Page Up / Page Down increment. */
    pageStep?: number;
    /** Id of the scrolled element. */
    controls?: string;
    /** Called with the new value on a key. */
    onChange?: (value: number) => void;
    /** Accessible label. */
    label: string;
    /** ScrollBar content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function ScrollBar({
    className = "",
    orientation = "vertical",
    value: valueProp,
    defaultValue = 0,
    min = 0,
    max = 100,
    step = 1,
    pageStep = 10,
    controls,
    onChange,
    label,
    children,
    ...restProps
}: ScrollBarProps) {
    warnMissingName("ScrollBar", label, restProps["aria-label"], restProps["aria-labelledby"]);
    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : internalValue;

    function clamp(v: number) {
        return Math.min(max, Math.max(min, v));
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        let next: number;
        switch (event.key) {
            case "ArrowUp":
            case "ArrowLeft":
                next = clamp(value - step);
                break;
            case "ArrowDown":
            case "ArrowRight":
                next = clamp(value + step);
                break;
            case "PageUp":
                next = clamp(value - pageStep);
                break;
            case "PageDown":
                next = clamp(value + pageStep);
                break;
            case "Home":
                next = min;
                break;
            case "End":
                next = max;
                break;
            default:
                return;
        }
        event.preventDefault();
        if (!isControlled) setInternalValue(next);
        onChange?.(next);
    }

    return (
        <div
            className={`scroll-bar ${className}`}
            role="scrollbar"
            aria-label={label}
            aria-orientation={orientation}
            aria-controls={controls}
            aria-valuenow={value}
            aria-valuemin={min}
            aria-valuemax={max}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            {...restProps}
        >
            {children}
        </div>
    );
}
