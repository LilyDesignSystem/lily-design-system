// ToggleGroup component
//
// A headless container for a collection of related toggle buttons. Renders a
// <div> with the ARIA group role and an accessible label to semantically
// associate toggle buttons. Useful for text formatting toolbars (bold, italic,
// underline), view mode selectors, or any interface where multiple options can
// be independently toggled on or off. Each child button should use aria-pressed
// to indicate its toggle state.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the group via aria-label.
//   children — ReactNode, required. Toggle button elements.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <ToggleGroup label="Text formatting">...</ToggleGroup>
//
// Examples:
//   
//   <ToggleGroup label="Text formatting">
//     <button aria-pressed="true">Bold</button>
//     <button aria-pressed="false">Italic</button>
//     <button aria-pressed="false">Underline</button>
//   </ToggleGroup>
//
// Keyboard:
//   - None at the container level; child buttons handle Tab, Enter/Space
//
// Accessibility:
//   - role="group" identifies the container as a semantic grouping
//   - aria-label={label} provides an accessible name describing the toggle collection
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Consumer provides toggle buttons with aria-pressed attributes
//
// References:
//   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
//   - WAI-ARIA Button Pattern (toggle): https://www.w3.org/WAI/ARIA/apg/patterns/button/

import React from "react";

export interface ToggleGroupProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Toggle button elements. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function ToggleGroup({
    className = "",
    label,
    children,
    ...restProps
}: ToggleGroupProps) {
    return (
        <div
        className={`toggle-group ${className}`}
        role="group"
        aria-label={label}
        {...restProps}
        >
        {children}
        </div>
    );
}
