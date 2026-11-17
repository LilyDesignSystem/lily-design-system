// GraphicBlock component
//
// A wrapper for charts and graphics that pairs the visual (in `children`)
// with structural metadata: title, description, and notes/source. Renders a
// <figure role="img"> with an aria-label so the whole graphic announces as
// a single image to assistive tech, and gathers the title + description +
// notes inside a <figcaption> when any of them are present.
//
// Props:
//   class   — string, optional. CSS class name.
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

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface GraphicBlockProps {
    class?: string;
    /** Accessible label describing the graphic for screen readers. */
    label: string;
    /** Title displayed above the graphic. */
    title?: string;
    /** Description text below the title. */
    description?: string;
    /** Notes / source text below the graphic. */
    notes?: string;
    /** The graphic / chart content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function GraphicBlock(props: GraphicBlockProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "title", "description", "notes", "children");
    const hasCaption = () =>
        p.title !== undefined || p.description !== undefined || p.notes !== undefined;
    return (
        <figure
            class={`graphic-block ${p.class}`}
            role="img"
            aria-label={p.label}
            {...restProps}
        >
            {hasCaption() && (
                <figcaption class="graphic-block-caption">
                    {p.title !== undefined && <div class="graphic-block-title">{p.title}</div>}
                    {p.description !== undefined && (
                        <div class="graphic-block-description">{p.description}</div>
                    )}
                    {p.notes !== undefined && <div class="graphic-block-notes">{p.notes}</div>}
                </figcaption>
            )}
            <div class="graphic-block-content">{p.children}</div>
        </figure>
    );
}
