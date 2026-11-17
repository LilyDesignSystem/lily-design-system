// HeroHeadline component
//
// HeroHeadline for the Reuters-graphics-style article layout family. Renders a
// <div> that consumers style; this component is a structural
// wrapper only.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Sets the hero-headline class as the styling hook

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface HeroHeadlineProps {
    class?: string;
    /** Accessible label set on aria-label. */
    label: string;
    /** Background media (image or video). */
    media: JSX.Element;
    /** Component content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function HeroHeadline(props: HeroHeadlineProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "media", "children");
    return (
        <div
            class={`hero-headline ${p.class}`}
            role={p.label ? "group" : undefined}
            aria-label={p.label}
            {...restProps}
        >
            {p.media}
            {p.children}
        </div>
    );
}
