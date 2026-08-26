// Collapsible component
//
// A headless collapsible disclosure component built on native HTML <details> and
// <summary> elements. Users click the summary text to expand or collapse the
// content section. The open prop is bindable, enabling parent components to
// programmatically control or observe the expanded/collapsed state. Commonly used
// for FAQ sections, advanced settings, and progressive disclosure patterns.
//
// Props:
//   className — string, optional. CSS class name.
//   summary — string, required. The clickable summary text shown as the toggle trigger.
//   open — boolean, default false. Whether the content is expanded; bindable for two-way control.
//   children — ReactNode, required. The collapsible content revealed when expanded.
//   ...restProps — additional HTML attributes spread onto the <details>.
//
// Syntax:
//   <Collapsible summary="More info">Content here</Collapsible>
//
// Examples:
//   
//   <Collapsible summary="Advanced settings" open={showAdvanced} onChange={setShowAdvanced}>
//     <p>Advanced configuration options here.</p>
//   </Collapsible>
//
// Keyboard:
//   - Enter: Toggle the disclosure open/closed (handled natively by <summary>)
//   - Space: Toggle the disclosure open/closed (handled natively by <summary>)
//
// Accessibility:
//   - Native <details>/<summary> elements provide built-in expanded/collapsed state announcements
//   - No custom ARIA attributes needed; the browser handles all screen reader semantics
//
// Internationalization:
//   - The summary prop provides the toggle label; no hardcoded strings
//   - All content is provided through the children prop
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses native <details>/<summary> — do not replace with custom ARIA disclosure
//   - The open prop uses controlled state via open + onChange
//
// References:
//   - WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

import React, { useState } from "react";

export interface CollapsibleProps {
    className?: string;
    /** The clickable summary text */
    summary: string;
    /** Whether the content is expanded */
    open?: boolean;
    /** The collapsible content */
    children: React.ReactNode;
    /** Callback when open changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function Collapsible({
    className = "",
    summary,
    open: openProp = false,
    onChange,
    children,
    ...restProps
}: CollapsibleProps) {
    const [open, setOpen] = useState(openProp);

    const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
        const newOpen = (e.currentTarget as HTMLDetailsElement).open;
        setOpen(newOpen);
        onChange?.(newOpen);
    };

    return (
        <details
        className={`collapsible ${className}`}
        open={open}
        onToggle={handleToggle}
        {...restProps}
        >
        <summary>{summary}</summary>
        {children}
        </details>
    );
}
