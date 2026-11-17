// SliderButton component
//
// A "slide to confirm" button. The user moves an internal slider to 100%
// to activate the action; if they release before reaching the end, the
// slider snaps back to 0%. Keyboard users can use Arrow Right / Arrow
// Left to adjust the slider position and Enter to activate immediately
// (an accessibility fallback). The component is a single <button> with
// aria-valuenow exposing the current slider position percentage. The
// consumer styles the slider track and thumb in CSS — this component
// only models the state and events.
//
// Props:
//   class — string, optional. CSS class name.
//   label    — string, required. Accessible label describing the action.
//   step     — number, default 10. Percent step per Arrow press.
//   disabled — boolean, default false.
//   onConfirm — callback, optional. Called when the slider reaches 100%.
//   children — ReactNode, optional. Visible label content.
//   ...restProps — additional HTML attributes spread onto the <button>.
//
// Accessibility:
//   - Implicit button role from <button>
//   - aria-label describes the confirmation action
//   - aria-valuenow / aria-valuemin / aria-valuemax expose the position
//   - role="slider" on the button so assistive tech announces it as one
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Drag-to-confirm pointer behaviour is left to the consumer; this
//     component models the keyboard fallback only

import type { JSX } from "@solidjs/web";
import { merge, omit, createSignal } from "solid-js";
import { attr } from "./attr";
import { warnMissingName } from "./dev-warning";

export interface SliderButtonProps {
    class?: string;
    /** Accessible label describing the confirmation action. */
    label: string;
    /** Percent step per Arrow Right / Arrow Left press. */
    step?: number;
    /** Whether the button is disabled. */
    disabled?: boolean;
    /** Called when the slider reaches 100%. */
    onConfirm?: () => void;
    /** Visible label content. */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function SliderButton(props: SliderButtonProps) {
    const p = merge({ class: "" as const, step: 10, disabled: false }, props);
    const restProps = omit(p, "class", "label", "step", "disabled", "onConfirm", "children");
    warnMissingName("SliderButton", p.label, p["aria-label"], p["aria-labelledby"]);
    const [position, setPosition] = createSignal(0);

    const fireIfComplete = (next: number) => {
        if (next >= 100) {
            setPosition(0);
            p.onConfirm?.();
        } else {
            setPosition(next);
        }
    };

    const handleKeyDown = (event: KeyboardEvent & { currentTarget: HTMLButtonElement }) => {
        if (p.disabled) return;
        switch (event.key) {
            case "ArrowRight":
                event.preventDefault();
                fireIfComplete(Math.min(100, position() + p.step));
                break;
            case "ArrowLeft":
                event.preventDefault();
                setPosition(Math.max(0, position() - p.step));
                break;
            case "Home":
                event.preventDefault();
                setPosition(0);
                break;
            case "End":
                event.preventDefault();
                fireIfComplete(100);
                break;
            case "Enter":
            case " ":
                event.preventDefault();
                fireIfComplete(100);
                break;
        }
    };

    return (
        <button
            type="button"
            role="slider"
            class={`slider-button ${p.class}`}
            aria-label={p.label}
            aria-valuenow={attr(position())}
            aria-valuemin={attr(0)}
            aria-valuemax={attr(100)}
            disabled={p.disabled}
            onKeyDown={handleKeyDown}
            {...restProps}
        >
            {p.children}
        </button>
    );
}
