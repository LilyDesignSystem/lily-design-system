// ThemeSelectOption component
//
// A single <option> element for use inside a ThemeSelect dropdown. Renders a
// native <option> with a theme value and label text. Supports selected and
// disabled states via native HTML attributes. Used as a compound child of
// ThemeSelect to define available theme choices such as light, dark, or
// high-contrast modes.
//
// Props:
//   class — string, optional. CSS class name.
//   value — string, required. The theme identifier submitted when selected.
//   selected — boolean, default false. Whether this option is pre-selected.
//   disabled — boolean, default false. Whether this option is disabled.
//   children — ReactNode, required. The visible label text for the theme option.
//   ...restProps — additional HTML attributes spread onto the <option>.
//
// Syntax:
//   <ThemeSelectOption value="dark">Dark</ThemeSelectOption>
//
// Examples:
//
//   <ThemeSelect label="Theme" value={theme} onChange={setTheme}>
//     <ThemeSelectOption value="light">Light</ThemeSelectOption>
//     <ThemeSelectOption value="dark">Dark</ThemeSelectOption>
//     <ThemeSelectOption value="high-contrast">High Contrast</ThemeSelectOption>
//     <ThemeSelectOption value="system">System Default</ThemeSelectOption>
//   </ThemeSelect>
//
// Keyboard:
//   None directly — keyboard behavior is managed by the parent <select> element
//   (Up/Down arrows, Home/End, type-ahead search).
//
// Accessibility:
//   - Native <option> element provides built-in accessibility via the parent <select>
//   - Screen readers announce the option text and selected state automatically
//
// Internationalization:
//   - Option label text comes through the children prop
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a ThemeSelect component for proper semantics
//   - Do not add ARIA attributes — native <option> provides all accessibility
//
// References:
//   - HTML option element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface ThemeSelectOptionProps {
    class?: string;
    /** The theme value for this option. */
    value: string;
    /** Whether this option is pre-selected. */
    selected?: boolean;
    /** Whether this option is disabled. */
    disabled?: boolean;
    /** The option label content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function ThemeSelectOption(props: ThemeSelectOptionProps) {
    const p = merge({ class: "" as const, selected: false, disabled: false }, props);
    const restProps = omit(p, "class", "value", "selected", "disabled", "children");
    return (
        <option
            class={`theme-select-option ${p.class}`}
            value={p.value}
            selected={p.selected}
            disabled={p.disabled}
            {...restProps}
        >
            {p.children}
        </option>
    );
}
