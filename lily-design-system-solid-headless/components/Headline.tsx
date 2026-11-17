// Headline component
//
// A page or article headline composition: a heading at a configurable level
// (default <h1>), with optional `subtitle` (the dek) and `byline` slots
// rendered below it. Wraps everything in a <div class="headline"> so consumer
// CSS can target the whole composition.
//
// Props:
//   class — string, optional. CSS class name.
//   level    — 1 | 2 | 3 | 4 | 5 | 6, default 1. Heading level.
//   children — ReactNode, required. Heading text.
//   subtitle — ReactNode, optional. Subtitle/dek content.
//   byline   — ReactNode, optional. Byline area.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Accessibility:
//   - The chosen heading level appears in the page outline; pick the
//     correct level for where the headline sits in the document
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

import { dynamic, type JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface HeadlineProps {
    class?: string;
    /** Heading level 1-6. */
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    /** Heading text. */
    children: JSX.Element;
    /** Subtitle / dek content. */
    subtitle?: JSX.Element;
    /** Byline area. */
    byline?: JSX.Element;
    [key: string]: unknown;
}

export default function Headline(props: HeadlineProps) {
    const p = merge({ class: "" as const, level: 1 }, props);
    const restProps = omit(p, "class", "level", "children", "subtitle", "byline");
    const Heading = dynamic(() => `h${p.level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6");
    return (
        <div
            class={`headline ${p.class}`}
            {...restProps}
        >
            <Heading class="headline-heading">{p.children}</Heading>
            {p.subtitle !== undefined && <div class="headline-subtitle">{p.subtitle}</div>}
            {p.byline !== undefined && <div class="headline-byline">{p.byline}</div>}
        </div>
    );
}
