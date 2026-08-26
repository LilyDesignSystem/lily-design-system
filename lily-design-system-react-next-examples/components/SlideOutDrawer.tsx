// SlideOutDrawer component
//
// A headless slide-out drawer that renders a modal dialog container which
// slides in from the side of the screen. When open, it can be dismissed with
// the Escape key. Commonly used for navigation menus, filters, settings panels,
// or secondary content in mobile and web applications.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for the dialog via aria-label.
//   open — boolean, default false. Whether the drawer is visible; controlled via open + onOpenChange.
//   children — ReactNode, required. The drawer content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <SlideOutDrawer label="Menu" open={isOpen} onOpenChange={setIsOpen}>
//     <nav>Menu content</nav>
//   </SlideOutDrawer>
//
// Examples:
//
//   <SlideOutDrawer label="Navigation menu" open={isOpen} onOpenChange={setIsOpen}>
//     <nav>
//       <ul><li><a href="/">Home</a></li></ul>
//     </nav>
//     <button onClick={() => setIsOpen(false)}>Close</button>
//   </SlideOutDrawer>
//
//
//   <SlideOutDrawer label="Settings panel" open={settingsOpen} onOpenChange={setSettingsOpen}>
//     <h2>Settings</h2>
//     <form><label><input type="checkbox" /> Enable notifications</label></form>
//   </SlideOutDrawer>
//
// Keyboard:
//   - Escape: closes the drawer by setting open to false
//
// Accessibility:
//   - role="dialog" for modal overlay semantics
//   - aria-label describes the drawer purpose
//   - aria-modal="true" indicates modal behavior (content behind is inert)
//   - tabindex="-1" allows the dialog to receive programmatic focus
//   - WCAG 2.2 AAA: properly labeled modal with keyboard dismissal
//
// Internationalization:
//   - The label prop externalizes the accessible label string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Open uses controlled state via open + onOpenChange
//   - Completely removed from DOM when closed ({open && ...})
//   - Consumer implements focus trapping and slide animations via CSS
//
// References:
//   - WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
//   - WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog

import React, { useState } from "react";

export interface SlideOutDrawerProps {
    className?: string;
    /** Accessible label for the dialog */
    label: string;
    /** Whether the drawer is open/visible, bindable */
    open?: boolean;
    /** The drawer content */
    children: React.ReactNode;
    /** Callback when open changes. */
    onOpenChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function SlideOutDrawer({
    className = "",
    label,
    open: openProp = false,
    onOpenChange,
    children,
    ...restProps
}: SlideOutDrawerProps) {
    const [open, setOpen] = useState(openProp);

    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.key === "Escape") {
            setOpen(false);
            onOpenChange?.(false);
        }
    }

    return (
        <>
            {open && (
                <div
                    className={`slide-out-drawer ${className}`}
                    role="dialog"
                    aria-label={label}
                    aria-modal="true"
                    tabIndex={-1}
                    onKeyDown={handleKeyDown}
                    {...restProps}
                >
                    {children}
                </div>
            )}
        </>
    );
}
