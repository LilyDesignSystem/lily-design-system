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
//   class — string, optional. CSS class name.
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

import type { JSX } from "@solidjs/web";
import { omit, createEffect, createSignal, untrack } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import { warnMissingName } from "./dev-warning";

export interface TimerButtonProps {
    class?: string;
    /** Accessible label describing the action. */
    label: string;
    /** Countdown duration in seconds. */
    duration: number;
    /** Called when the button activates manually or via timer. */
    onClick?: () => void;
    /** Whether the button is disabled. */
    disabled?: boolean;
    /** Button content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function TimerButton(props: TimerButtonProps) {
    const p = withDefaults({ class: "" as const, disabled: false }, props);
    const restProps = omit(p, "class", "label", "duration", "onClick", "disabled", "children");
    warnMissingName("TimerButton", p.label, p["aria-label"], p["aria-labelledby"]);
    const [remainingSeconds, setRemainingSeconds] = createSignal(untrack(() => p.duration));
    const firedRef = { current: false };

    createEffect(
        () => [p.duration, p.disabled, p.onClick],
        () =>
            untrack(() => {
                if (p.disabled) return;
                const start = Date.now();
                const interval = setInterval(() => {
                    const elapsed = (Date.now() - start) / 1000;
                    const remaining = Math.max(0, p.duration - Math.floor(elapsed));
                    setRemainingSeconds(remaining);
                    if (remaining === 0 && !firedRef.current) {
                        firedRef.current = true;
                        clearInterval(interval);
                        p.onClick?.();
                    }
                }, 250);
                return () => clearInterval(interval);
            }),
    );

    const handleClick = () => {
        if (firedRef.current || p.disabled) return;
        firedRef.current = true;
        p.onClick?.();
    };

    return (
        <button
            type="button"
            class={`timer-button ${p.class}`}
            aria-label={p.label}
            aria-live="polite"
            data-remaining-seconds={attr(remainingSeconds())}
            disabled={p.disabled}
            onClick={handleClick}
            {...restProps}
        >
            {p.children}
        </button>
    );
}
