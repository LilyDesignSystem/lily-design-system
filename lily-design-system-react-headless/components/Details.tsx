// Details component
//
// A disclosure widget that reveals or hides additional content on demand.
// Built on the native HTML <details> and <summary> elements, it provides
// progressive disclosure with built-in browser accessibility. Common use
// cases include FAQs, collapsible sections, and supplementary explanations.
//
// Props:
//   className — string, optional. CSS class name.
//   summary — string, required. Text displayed in the clickable summary toggle.
//   open — boolean, default false. Whether the details section is expanded; bindable.
//   children — ReactNode, required. Content revealed when expanded.
//   ...restProps — additional HTML attributes spread onto the <details> element.
//
// Syntax:
//   <Details summary="More info">Content here</Details>
//
// Examples:
//   
//   <Details summary="More information">
//     <p>Additional details shown when expanded.</p>
//   </Details>
//
//   
//   <Details summary="Advanced options" open={showAdvanced} onChange={setShowAdvanced}>
//     <p>Configure advanced settings here.</p>
//   </Details>
//
// Keyboard:
//   - Enter: toggles the disclosure open/closed when <summary> is focused
//   - Space: toggles the disclosure open/closed when <summary> is focused
//
// Accessibility:
//   - Native <details>/<summary> provide built-in ARIA semantics
//   - Browser automatically exposes expanded/collapsed state to assistive technology
//   - No additional ARIA attributes needed
//
// Internationalization:
//   - The summary prop accepts any string; consumers provide localized text
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses controlled on open for two-way state synchronization
//   - Similar to Collapsible but uses a standards-based API
//
// References:
//   - MDN details element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
//   - MDN summary element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary
//   - WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

import React, { useState } from "react";

export interface DetailsProps {
    className?: string;
    /** Text for the summary toggle. */
    summary: string;
    /** Whether the details are expanded. Bindable. */
    open?: boolean;
    /** Content shown when expanded. */
    children: React.ReactNode;
    /** Callback when open changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function Details({
    className = "",
    summary,
    open: openProp = false,
    onChange,
    children,
    ...restProps
}: DetailsProps) {
    const [open, setOpen] = useState(openProp);

    const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
        const newOpen = (e.currentTarget as HTMLDetailsElement).open;
        setOpen(newOpen);
        onChange?.(newOpen);
    };

    return (
        <details
        className={`details ${className}`}
        open={open}
        onToggle={handleToggle}
        {...restProps}
        >
        <summary>{summary}</summary>
        {children}
        </details>
    );
}
