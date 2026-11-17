// Hero component
//
// A large box or image section with a title and description.
//
// Props:
//   class — string, optional. CSS class name.
//   label    — string, required. Accessible label via aria-label.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <section>.
//
// Accessibility:
//   - native <section> semantics
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML section element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface HeroProps {
    class?: string;
    /** Accessible label set on aria-label. */
    label: string;
    /** Component content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function Hero(props: HeroProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <section
            class={`hero ${p.class}`}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </section>
    );
}
