// ColorPicker component
//
// A headless 2D area selector for choosing colors by saturation (X axis, 0-100)
// and brightness (Y axis, 0-100). Users navigate the board with keyboard arrow
// keys, with Shift held for larger steps (10 instead of 1). The component exposes
// data-x and data-y attributes for CSS-based cursor positioning. Useful for
// advanced color pickers requiring fine-grained 2D color property selection.
//
// Props:
//   className — string, optional. CSS class name.
//   x — number, default 0. Horizontal position (0-100, saturation); controlled via x + onChangeX.
//   y — number, default 0. Vertical position (0-100, brightness); controlled via y + onChangeY.
//   label — string, required. Accessible name via aria-label.
//   disabled — boolean, default false. Whether the control is disabled.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <ColorPicker label="Color saturation and brightness" x={x} onChangeX={setX} y={y} onChangeY={setY} />
//
// Examples:
//
//   <ColorPicker label="Select color" x={x} onChangeX={setX} y={y} onChangeY={setY} disabled />
//
// Keyboard:
//   - ArrowRight: Increase X by 1 (Shift: by 10)
//   - ArrowLeft: Decrease X by 1 (Shift: by 10)
//   - ArrowUp: Decrease Y by 1 (Shift: by 10)
//   - ArrowDown: Increase Y by 1 (Shift: by 10)
//   - Home: Set X to 0
//   - End: Set X to 100
//
// Accessibility:
//   - role="slider" identifies the element as a slider control
//   - aria-label provides an accessible name
//   - aria-valuenow reflects the current X value (0-100)
//   - aria-valuemin="0" and aria-valuemax="100" define the range
//   - aria-disabled is set when the control is disabled
//
// Internationalization:
//   - The label prop provides the accessible name; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Consumer uses data-x and data-y attributes for visual cursor positioning
//   - Both x and y use controlled for two-way binding
//
// References:
//   - WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/

import React, { useState } from "react";

export interface ColorPickerProps {
    className?: string;
    x?: number;
    y?: number;
    label: string;
    disabled?: boolean;
    /** Callback when x changes. */
    onChangeX?: (value: number) => void;
    /** Callback when y changes. */
    onChangeY?: (value: number) => void;
    [key: string]: unknown;
}

export default function ColorPicker({
    className = "",
    x: xProp = 0,
    y: yProp = 0,
    label,
    disabled = false,
    onChangeX,
    onChangeY,
    ...restProps
}: ColorPickerProps) {
    const [x, setX] = useState(xProp);
    const [y, setY] = useState(yProp);

    function handleKeyDown(event: React.KeyboardEvent) {
        if (disabled) return;
        const step = event.shiftKey ? 10 : 1;
        switch (event.key) {
            case "ArrowRight": {
                const newX = Math.min(100, x + step);
                setX(newX);
                onChangeX?.(newX);
                event.preventDefault();
                break;
            }
            case "ArrowLeft": {
                const newX = Math.max(0, x - step);
                setX(newX);
                onChangeX?.(newX);
                event.preventDefault();
                break;
            }
            case "ArrowUp": {
                const newY = Math.max(0, y - step);
                setY(newY);
                onChangeY?.(newY);
                event.preventDefault();
                break;
            }
            case "ArrowDown": {
                const newY = Math.min(100, y + step);
                setY(newY);
                onChangeY?.(newY);
                event.preventDefault();
                break;
            }
            case "Home":
                setX(0);
                onChangeX?.(0);
                event.preventDefault();
                break;
            case "End":
                setX(100);
                onChangeX?.(100);
                event.preventDefault();
                break;
        }
    }

    return (
        <div
        className={`color-picker ${className}`}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuenow={x}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-disabled={disabled || undefined}
        data-x={x}
        data-y={y}
        onKeyDown={handleKeyDown}
        {...restProps}
        ></div>
    );
}
