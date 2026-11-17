// ThemeView component
//
// A headless display component that shows the current theme name as inline
// text. Renders the theme value in a <span> element with an accessible label.
// Commonly paired with ThemeSelect in an Input/View pattern: ThemeSelect
// allows selection while ThemeView displays the active theme. Useful in
// settings panels, status bars, or anywhere the current theme needs to be
// communicated visually and programmatically.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, required. The current theme name to display as text content.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <ThemeView label="Current theme" value="dark" />
//
// Examples:
//
//   <ThemeView label="Active theme" value={currentTheme} />
//
// Keyboard:
//   - None -- passive display element with no interactive behavior
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// Internationalization:
//   - The label prop accepts any translated string
//   - The value prop should contain translated theme names
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Read-only display; pairs with ThemeSelect for editing
//
// References:
//   - WAI-ARIA Accessible Name: https://www.w3.org/TR/accname-1.2/

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface ThemeViewProps {
    class?: string;
    /** Accessible label. */
    label?: string;
    /** Theme value to display. */
    value: string;
    [key: string]: unknown;
}

export default function ThemeView(props: ThemeViewProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "value");
    return (
        <span
            class={`theme-view ${p.class}`}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.value}
        </span>
    );
}
