// Pictogram component
//
// An icon-based component pairing an icon with a title and description in
// a centered or side layout. Renders a semantic <figure> with the icon
// in an aria-hidden wrapper and the heading/description inside a
// <figcaption>.
//
// Props:
//   className   — string, optional. CSS class name appended to root.
//   layout      — "centered" | "side", default "centered". Icon position
//                 relative to content (exposed via data-layout).
//   heading     — string, optional. Title text (rendered as <h3>).
//   description — string, optional. Body text (rendered as <p>).
//   icon        — ReactNode, REQUIRED. The icon/illustration node.
//   label       — string, optional. aria-label override.
//   children    — ReactNode, optional. Additional content (overrides
//                 description if provided).
//   ...restProps — additional HTML attributes spread onto the root.
//
// Syntax:
//   <Pictogram
//     icon={<MyIcon />}
//     heading="Privacy"
//     description="We respect your data."
//   />
//
// Accessibility:
//   - Uses a semantic <figure> with optional aria-label
//   - Icon wrapper is aria-hidden (decorative)
//   - Accessible name comes from heading or label
//
// Internationalization:
//   - All user-facing strings are consumer-supplied
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - icon is non-optional in the interface
//   - icon is a ReactNode prop, NOT children

import React from "react";

export interface PictogramProps {
    className?: string;
    /** Icon position relative to content */
    layout?: "centered" | "side";
    /** Title text */
    heading?: string;
    /** Body text */
    description?: string;
    /** Icon node (required) */
    icon: React.ReactNode;
    /** aria-label override */
    label?: string;
    /** Additional content (overrides description if provided) */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function Pictogram({
    className = "",
    layout = "centered",
    heading = undefined,
    description = undefined,
    icon,
    label = undefined,
    children,
    ...restProps
}: PictogramProps) {
    return (
        <figure
            className={`pictogram ${className}`}
            data-layout={layout}
            aria-label={label}
            {...restProps}
        >
            <div className="pictogram-icon" aria-hidden="true">
                {icon}
            </div>
            <figcaption className="pictogram-caption">
                {heading && (
                    <h3 className="pictogram-heading">{heading}</h3>
                )}
                {children
                    ? children
                    : description && (
                          <p className="pictogram-description">{description}</p>
                      )}
            </figcaption>
        </figure>
    );
}
