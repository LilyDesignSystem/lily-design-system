// GraphicBlock component
//
// A wrapper for charts and graphics that pairs the visual (in `children`)
// with structural metadata: title, description, and notes/source. Renders a
// <figure role="img"> with an aria-label so the whole graphic announces as
// a single image to assistive tech, and gathers the title + description +
// notes inside a <figcaption> when any of them are present.
//
// Props:
//   className   — string, optional. CSS class name.
//   label       — string, required. Accessible label describing the graphic.
//   title       — string, optional. Title displayed above the graphic.
//   description — string, optional. Description text below the title.
//   notes       — string, optional. Notes/source text below the graphic.
//   children    — ReactNode, required. The graphic/chart content.
//   ...restProps — additional HTML attributes spread onto the <figure>.
//
// Accessibility:
//   - role="img" + aria-label exposes the figure as a single labelled image
//   - The visible title/description/notes give sighted users the same context
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

import React from "react";

export interface GraphicBlockProps {
    className?: string;
    /** Accessible label describing the graphic for screen readers. */
    label: string;
    /** Title displayed above the graphic. */
    title?: string;
    /** Description text below the title. */
    description?: string;
    /** Notes / source text below the graphic. */
    notes?: string;
    /** The graphic / chart content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function GraphicBlock({
    className = "",
    label,
    title = undefined,
    description = undefined,
    notes = undefined,
    children,
    ...restProps
}: GraphicBlockProps) {
    const hasCaption = title !== undefined || description !== undefined || notes !== undefined;
    return (
        <figure
            className={`graphic-block ${className}`}
            role="img"
            aria-label={label}
            {...restProps}
        >
            {hasCaption && (
                <figcaption className="graphic-block-caption">
                    {title !== undefined && (
                        <div className="graphic-block-title">{title}</div>
                    )}
                    {description !== undefined && (
                        <div className="graphic-block-description">{description}</div>
                    )}
                    {notes !== undefined && (
                        <div className="graphic-block-notes">{notes}</div>
                    )}
                </figcaption>
            )}
            <div className="graphic-block-content">{children}</div>
        </figure>
    );
}
