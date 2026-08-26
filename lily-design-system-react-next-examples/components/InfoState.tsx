// InfoState component
//
// A headless composition for empty, info, error, and success state messages.
// Renders a <section role="status"> with optional illustration, a title <h2>,
// optional description <p>, and an optional action area. The `level` prop is
// exposed via data-level for consumer styling. Consumers may alternatively
// supply `children` for fully custom content.
//
// Props:
//   className     — string, optional. CSS class name.
//   level         — "info" | "empty" | "error" | "success", default "info".
//   title         — string, required. Heading text.
//   description   — string, optional. Body text.
//   label         — string, optional. aria-label override (defaults to title).
//   illustration  — ReactNode, optional. Visual element above title.
//   action        — ReactNode, optional. Action area below description.
//   children      — ReactNode, optional. Custom content (replaces title/description/action).
//   ...restProps  — additional HTML attributes spread onto the <section>.
//
// Syntax:
//   <InfoState level="empty" title="No results" description="Try a different search." />
//
// Examples:
//
//   <InfoState
//     level="empty"
//     title="Your inbox is empty"
//     description="When you get a message it will show up here."
//     illustration={<EmptyIllustration />}
//     action={<button onClick={refresh}>Refresh</button>}
//   />
//
//
//   <InfoState level="error" title="Something went wrong">
//     <p>Custom content goes here.</p>
//   </InfoState>
//
// Keyboard: None — display container.
//
// Accessibility:
//   - role="status" announces the state to assistive technologies politely
//   - aria-label defaults to title; override via label prop
//   - data-level exposed for consumer styling
//
// Internationalization:
//   - title, description, and label all consumer-supplied strings
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - When children is provided, it replaces the default title/description/action layout
//
// References:
//   - WAI-ARIA role="status": https://www.w3.org/WAI/ARIA/apg/patterns/alert/

import React from "react";

export interface InfoStateProps {
    className?: string;
    /** Severity / category of the state */
    level?: "info" | "empty" | "error" | "success";
    /** Heading text (required) */
    title: string;
    /** Body text */
    description?: string;
    /** aria-label override; defaults to title */
    label?: string;
    /** Visual element rendered above the title */
    illustration?: React.ReactNode;
    /** Call-to-action area rendered after description */
    action?: React.ReactNode;
    /** Custom content (replaces default title/description/action layout) */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function InfoState({
    className = "",
    level = "info",
    title,
    description = undefined,
    label = undefined,
    illustration = undefined,
    action = undefined,
    children = undefined,
    ...restProps
}: InfoStateProps) {
    return (
        <section
        className={`info-state ${className}`}
        role="status"
        aria-label={label ?? title}
        data-level={level}
        {...restProps}
        >
        {children !== undefined ? (
            children
        ) : (
            <>
                {illustration !== undefined ? illustration : null}
                <h2>{title}</h2>
                {description !== undefined ? <p>{description}</p> : null}
                {action !== undefined ? action : null}
            </>
        )}
        </section>
    );
}
