// AccordionListItem component
//
// A single expandable section within an AccordionList, using the native
// HTML <details> element for built-in disclosure behavior. The consumer
// provides a <summary> element (the clickable header) and content (the
// expandable body) as children. The open prop is two-way bindable via
// controlled, allowing parent components to programmatically control
// and observe the expanded state.
//
// Props:
//   className — string, optional. CSS class name.
//   open — boolean, default false, bindable. Whether the item is expanded.
//   children — ReactNode, required. A <summary> and content elements.
//   ...restProps — additional HTML attributes spread onto <details>.
//
// Syntax:
//   <AccordionListItem>
//     <summary>Header</summary>
//     <p>Content</p>
//   </AccordionListItem>
//
// Examples:
//   
//   <AccordionListItem>
//     <summary>What is React?</summary>
//     <p>A compiler-based UI framework.</p>
//   </AccordionListItem>
//
//   
//   <AccordionListItem open={isOpen} onChange={setIsOpen}>
//     <summary>Details</summary>
//     <p>Expanded content.</p>
//   </AccordionListItem>
//
// Keyboard:
//   - Tab: Focus the summary element
//   - Enter / Space: Toggle open/close (browser native behavior)
//
// Accessibility:
//   - Native <details> provides implicit disclosure widget semantics
//   - Browser automatically manages expanded/collapsed state announcement
//
// Internationalization:
//   - No hardcoded text; all content comes through children
//
// Claude rules:
//   - Compound component — use inside AccordionList
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Do not replace native <details> with custom ARIA widgets
//   - The open prop must use controlled for two-way binding
//
// References:
//   - HTML details element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details

import React, { useState } from "react";

export interface AccordionListItemProps {
    className?: string;
    /** Whether expanded. Bindable. */
    open?: boolean;
    /** A <summary> and content elements. */
    children: React.ReactNode;
    /** Callback when open changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function AccordionListItem({
    className = "",
    open: openProp = false,
    onChange,
    children,
    ...restProps
}: AccordionListItemProps) {
    const [open, setOpen] = useState(openProp);

    const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
        const newOpen = (e.currentTarget as HTMLDetailsElement).open;
        setOpen(newOpen);
        onChange?.(newOpen);
    };

    return (
        <details
        className={`accordion-list-item ${className}`}
        open={open}
        onToggle={handleToggle}
        {...restProps}
        >
        {children}
        </details>
    );
}
