// Expander component
//
// An expander that shows or hides additional content with a toggle button.
// Similar to native <details>/<summary> but uses a <button> trigger with
// aria-expanded and aria-controls for full control over behavior. Useful for
// FAQ sections, collapsible panels, settings groups, and progressive disclosure.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Button text and accessible name for both the button and content region.
//   expanded — boolean, default false. Whether the content is visible; bindable.
//   children — ReactNode, required. Expandable content rendered when expanded is true.
//   ...restProps — additional HTML attributes spread onto the outer <div> wrapper.
//
// Syntax:
//   <Expander label="Show details" expanded={expanded} onChange={setExpanded}>Content</Expander>
//
// Examples:
//
//   <Expander label="Show details" expanded={expanded} onChange={setExpanded}>
//     <p>Details here...</p>
//   </Expander>
//
//
//   <Expander label="Advanced settings" expanded={showAdvanced} onChange={setShowAdvanced}>
//     <form>...</form>
//   </Expander>
//
// Keyboard:
//   - Enter: toggles the expander open/closed (native button behavior)
//   - Space: toggles the expander open/closed (native button behavior)
//   - Tab: moves focus to/from the toggle button
//
// Accessibility:
//   - aria-expanded on the button indicates whether content is visible
//   - aria-controls references the ID of the expandable content region
//   - role="region" on the content container identifies the expandable area
//   - aria-label on the content region provides an accessible name
//
// Internationalization:
//   - The label prop accepts any string; consumers provide localized text
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Generates unique contentId via Math.random() for aria-controls/id link
//   - Content removed from DOM when collapsed (not just hidden)
//   - Uses controlled on expanded for two-way state binding
//
// References:
//   - WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

import React, { useState, useId } from "react";

export interface ExpanderProps {
    className?: string;
    /** Button label / accessible name. */
    label: string;
    /** Whether the content is expanded. Bindable. */
    expanded?: boolean;
    /** Expandable content. */
    children: React.ReactNode;
    /** Callback when expanded changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function Expander({
    className = "",
    label,
    expanded: expandedProp = false,
    onChange,
    children,
    ...restProps
}: ExpanderProps) {
    const [expanded, setExpanded] = useState(expandedProp);
    const contentId = useId();

    const handleClick = () => {
        const newExpanded = !expanded;
        setExpanded(newExpanded);
        onChange?.(newExpanded);
    };

    return (
        <div
        className={`expander ${className}`}
        {...restProps}
        >
        <button
        type="button"
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={handleClick}
        >
        {label}
        </button>
        {expanded && (
        <div
        id={contentId}
        role="region"
        aria-label={label}
        >
        {children}
        </div>
        )}
        </div>
    );
}
