// ToggleButton component
//
// A headless toggle button: a native <button> with aria-pressed, the WAI-ARIA
// toggle button pattern. Supports click and
// keyboard (Space key) interaction. The pressed state is bindable for
// two-way data flow. For actions that stay on, such as Bold, Mute or
// Favourite; for a setting that turns on or off, use SwitchButton (role="switch").
//
// Props:
//   class — string, optional. CSS class name.
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
//   - A native <button>: no role is needed; a screen reader says "toggle button"
//   - aria-pressed={pressed} communicates the current state ("pressed" / "not pressed")
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
//   - WAI-ARIA Button Pattern (toggle button): https://www.w3.org/WAI/ARIA/apg/patterns/button/
//   - aria-pressed: https://www.w3.org/TR/wai-aria-1.2/#aria-pressed

import type { JSX } from "@solidjs/web";
import { merge, omit, createSignal, untrack } from "solid-js";
import { attr } from "./attr";
export interface ToggleButtonProps {
    class?: string;
    /** Accessible label. */
    label: string;
    /** Whether the toggle is on. Bindable. */
    pressed?: boolean;
    /** Whether the toggle is disabled. */
    disabled?: boolean;
    /** Optional button content. */
    children?: JSX.Element;
    /** Callback when pressed changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function ToggleButton(props: ToggleButtonProps) {
    const p = merge({ class: "" as const, pressed: false, disabled: false }, props);
    const restProps = omit(p, "class", "label", "pressed", "disabled", "onChange", "children");
    const [pressed, setPressed] = createSignal(untrack(() => p.pressed));

    function toggle() {
        if (!p.disabled) {
            const newPressed = !pressed();
            setPressed(newPressed);
            p.onChange?.(newPressed);
        }
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === " ") {
            event.preventDefault();
            toggle();
        }
    }

    return (
        <button
            class={`toggle-button ${p.class}`}
            type="button"
            aria-pressed={attr(pressed())}
            aria-label={p.label}
            disabled={p.disabled}
            onClick={toggle}
            onKeyDown={handleKeyDown}
            {...restProps}
        >
            {p.children && <>{p.children}</>}
        </button>
    );
}
