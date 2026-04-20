// TabGroup component
//
// A headless tab list container that provides the ARIA tablist role and
// built-in keyboard navigation for tabbed interfaces. It manages arrow key
// navigation between tab elements, allowing users to cycle through tabs
// with Left/Right arrow keys and jump to first/last with Home/End keys.
// The consumer provides tab buttons as children and manages selection state.
//
// Functionally equivalent to TabGroup; emits its own `tab-group` class so
// consumers can target either container independently.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the tab list via aria-label.
//   children — ReactNode, required. Tab button elements to render inside the tablist.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <TabGroup label="Settings">...</TabGroup>
//
// Examples:
//   
//   <TabGroup label="Settings">
//     <button role="tab" aria-selected="true">General</button>
//     <button role="tab" aria-selected="false">Advanced</button>
//   </TabGroup>
//
// Keyboard:
//   - ArrowRight: moves focus to the next tab (wraps to first)
//   - ArrowLeft: moves focus to the previous tab (wraps to last)
//   - Home: moves focus to the first tab
//   - End: moves focus to the last tab
//   - Tab: moves focus into and out of the tab list
//
// Accessibility:
//   - role="tablist" identifies the container as a list of tabs
//   - aria-label={label} provides an accessible name for the tab list
//   - Child tabs should have role="tab" and aria-selected attributes
//   - Associated tab panels should have role="tabpanel" with aria-labelledby
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Queries child [role='tab'] elements for keyboard navigation
//   - Uses useState() for the internal DOM reference
//
// References:
//   - WAI-ARIA Tabs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
//   - WAI-ARIA Authoring Practices - Tabs: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-automatic/

import React, { useRef } from "react";

export interface TabGroupProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Tab elements. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function TabGroup({
    className = "",
    label,
    children,
    ...restProps
}: TabGroupProps) {
    const tablistRef = useRef<HTMLElement>(null);

    function handleKeyDown(event: React.KeyboardEvent) {
        if (!tablistRef.current) return;
        const tabs = Array.from(
            tablistRef.current.querySelectorAll<HTMLElement>("[role='tab']"),
        );
        const current = document.activeElement as HTMLElement;
        const index = tabs.indexOf(current);
        switch (event.key) {
            case "ArrowRight": {
                event.preventDefault();
                const next = index < tabs.length - 1 ? index + 1 : 0;
                tabs[next]?.focus();
                break;
            }
            case "ArrowLeft": {
                event.preventDefault();
                const prev = index > 0 ? index - 1 : tabs.length - 1;
                tabs[prev]?.focus();
                break;
            }
            case "Home": {
                event.preventDefault();
                tabs[0]?.focus();
                break;
            }
            case "End": {
                event.preventDefault();
                tabs[tabs.length - 1]?.focus();
                break;
            }
        }
    }

    return (
        <div
        className={`tab-group ${className}`}
        role="tablist"
        aria-label={label}
        ref={tablistRef}
        onKeyDown={handleKeyDown}
        {...restProps}
        >
        {children}
        </div>
    );
}
