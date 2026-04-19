// ToggleButton component
//
// A headless binary on/off toggle button using role="switch". Renders a
// <button> with aria-checked to communicate state. Supports click and
// keyboard (Space key) interaction. The pressed state is bindable for
// two-way data flow. Commonly used for settings like dark mode,
// notifications, or feature flags.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   pressed — boolean, default false. Whether the toggle is on. Bindable.
//   disabled — boolean, default false. Whether the toggle is disabled.
//   children — ReactNode, optional. Button content.
//   ...restProps — additional HTML attributes spread onto the <button>.
//
// Syntax:
//   <ToggleButton label="Dark mode" pressed={pressed} onChange={setPressed} />
//
// Examples:
//
//   <ToggleButton label="Dark mode" pressed={pressed} onChange={setPressed} />
//
//
//   <ToggleButton label="Mute audio" pressed={muted} onChange={setMuted} disabled={locked} />
//
// Keyboard:
//   - Space: toggles between on and off states
//   - Enter: activates the button (native button behavior)
//
// Accessibility:
//   - role="switch" identifies the element as a two-state toggle
//   - aria-checked={pressed} communicates the current state
//   - aria-label={label} provides the accessible name
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses controlled for two-way data binding on pressed
//   - type="button" prevents accidental form submission
//
// References:
//   - WAI-ARIA Switch Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/switch/
//   - WAI-ARIA Switch Role: https://www.w3.org/TR/wai-aria-1.2/#switch

import React, { useState } from "react";

export interface ToggleButtonProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Whether the toggle is on. Bindable. */
    pressed?: boolean;
    /** Whether the toggle is disabled. */
    disabled?: boolean;
    /** Optional button content. */
    children?: React.ReactNode;
    /** Callback when pressed changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function ToggleButton({
    className = "",
    label,
    pressed: pressedProp = false,
    disabled = false,
    onChange,
    children,
    ...restProps
}: ToggleButtonProps) {
    const [pressed, setPressed] = useState(pressedProp);

    function toggle() {
        if (!disabled) {
            const newPressed = !pressed;
            setPressed(newPressed);
            onChange?.(newPressed);
        }
    }

    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.key === " ") {
            event.preventDefault();
            toggle();
        }
    }

    return (
        <button
        className={`toggle-button ${className}`}
        type="button"
        role="switch"
        aria-checked={pressed}
        aria-label={label}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        {...restProps}
        >
        {children && (<>{children}</>)}
        </button>
    );
}
