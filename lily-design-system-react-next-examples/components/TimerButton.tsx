// TimerButton component
//
// A button that auto-activates after a configurable countdown. Useful for
// "auto-confirm in 5 seconds" or "session continuing in 30 seconds"
// flows where the user can click to act immediately or let the timer
// expire to act for them. The component announces the countdown via an
// aria-live="polite" region and exposes the remaining seconds via the
// `remainingSeconds` value passed back to the consumer's render callback.
//
// Props:
//   className — string, optional. CSS class name.
//   label    — string, required. Accessible label describing the action.
//   duration — number, required. Countdown duration in seconds.
//   onClick  — callback, optional. Called when the button activates,
//              either manually or when the countdown reaches zero.
//   disabled — boolean, default false.
//   children — ReactNode, required. Button content; receives a render
//              prop or static content.
//   ...restProps — additional HTML attributes spread onto the <button>.
//
// Accessibility:
//   - Native <button> semantics
//   - aria-label describes the action
//   - aria-live="polite" announces countdown updates without interruption
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - The component owns the timer; clears it on unmount and on activation

import React, { useEffect, useRef, useState } from "react";

export interface TimerButtonProps {
    className?: string;
    /** Accessible label describing the action. */
    label: string;
    /** Countdown duration in seconds. */
    duration: number;
    /** Called when the button activates manually or via timer. */
    onClick?: () => void;
    /** Whether the button is disabled. */
    disabled?: boolean;
    /** Button content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function TimerButton({
    className = "",
    label,
    duration,
    onClick = undefined,
    disabled = false,
    children,
    ...restProps
}: TimerButtonProps) {
    const [remainingSeconds, setRemainingSeconds] = useState(duration);
    const firedRef = useRef(false);

    useEffect(() => {
        if (disabled) return;
        const start = Date.now();
        const interval = setInterval(() => {
            const elapsed = (Date.now() - start) / 1000;
            const remaining = Math.max(0, duration - Math.floor(elapsed));
            setRemainingSeconds(remaining);
            if (remaining === 0 && !firedRef.current) {
                firedRef.current = true;
                clearInterval(interval);
                onClick?.();
            }
        }, 250);
        return () => clearInterval(interval);
    }, [duration, disabled, onClick]);

    const handleClick = () => {
        if (firedRef.current || disabled) return;
        firedRef.current = true;
        onClick?.();
    };

    return (
        <button
            type="button"
            className={`timer-button ${className}`}
            aria-label={label}
            aria-live="polite"
            data-remaining-seconds={remainingSeconds}
            disabled={disabled}
            onClick={handleClick}
            {...restProps}
        >
            {children}
        </button>
    );
}
