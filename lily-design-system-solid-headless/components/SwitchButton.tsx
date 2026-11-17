// SwitchButton component
//
// A headless toggle switch that provides a binary on/off control using
// role="switch" with aria-checked. It renders as a <button> element and
// supports both click and keyboard (Space key) activation. Commonly used
// for settings, preferences, and feature toggles where users need to
// enable or disable a single option without submitting a form.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   checked — boolean, default false. Whether the switch is on; controlled via checked + onChange.
//   disabled — boolean, default false. Whether the switch is disabled.
//   ...restProps — additional HTML attributes spread onto the <button>.
//
// Syntax:
//   <SwitchButton label="Enable notifications" checked={checked} onChange={setChecked} />
//
// Examples:
//
//   <SwitchButton label="Dark mode" checked={darkMode} onChange={setDarkMode} disabled={locked} />
//
// Keyboard:
//   - Space: toggles the switch between on and off states (custom handler with preventDefault)
//   - Enter: activates the button (native button behavior)
//
// Accessibility:
//   - role="switch" identifies the element as a two-state toggle switch
//   - aria-checked={checked} communicates whether the switch is on or off
//   - aria-label={label} provides the accessible name for the switch control
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Uses controlled for two-way data binding on checked prop
//   - type="button" prevents accidental form submission
//
// References:
//   - WAI-ARIA Switch Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/switch/
//   - WAI-ARIA Switch Role: https://www.w3.org/TR/wai-aria-1.2/#switch

import { merge, omit, createSignal } from "solid-js";
import { attr } from "./attr";
import { warnMissingName } from "./dev-warning";

export interface SwitchButtonProps {
    class?: string;
    /** Accessible label. */
    label: string;
    /** Whether the switch is on. Bindable. */
    checked?: boolean;
    /** Whether disabled. */
    disabled?: boolean;
    /** Callback when checked changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function SwitchButton(props: SwitchButtonProps) {
    const p = merge({ class: "" as const, checked: false, disabled: false }, props);
    const restProps = omit(p, "class", "label", "checked", "disabled", "onChange");
    warnMissingName("SwitchButton", p.label, p["aria-label"], p["aria-labelledby"]);
    const [checked, setChecked] = createSignal(() => p.checked);

    // Sync internal state when the prop changes externally.

    function toggle() {
        if (!p.disabled) {
            const next = !checked();
            setChecked(next);
            p.onChange?.(next);
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === " " && !p.disabled) {
            event.preventDefault();
            toggle();
        }
    }

    return (
        <button
            class={`switch-button ${p.class}`}
            type="button"
            role="switch"
            aria-checked={attr(checked())}
            aria-label={p.label}
            disabled={p.disabled}
            onClick={toggle}
            onKeyDown={handleKeydown}
            {...restProps}
        ></button>
    );
}
