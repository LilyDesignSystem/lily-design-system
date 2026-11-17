// SectionList component
//
// A list of sections. Renders a <ul> with the `section-list` hook; items are SectionListItem.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Accepted for API symmetry but not rendered by this component.
//   children — JSX.Element, required. The SectionListItem children.
//   ...restProps — additional HTML attributes spread onto the root <ul>.
//
// Syntax:
//   <SectionList>…</SectionList>
//
// Examples:
//   <SectionList><SectionListItem><a href="#one">One</a></SectionListItem></SectionList>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - aria-label comes from `label` when given (the Svelte port accepts but does not render it)
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Port gap: the Svelte catalog renders no aria-label; this React component does not (the Svelte one is canonical)
//
// References:
//   - MDN <ul>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface SectionListProps {
    class?: string;
    label?: string;
    children: JSX.Element;
    [key: string]: unknown;
}

export default function SectionList(props: SectionListProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <ul
            class={`section-list ${p.class}`}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </ul>
    );
}
