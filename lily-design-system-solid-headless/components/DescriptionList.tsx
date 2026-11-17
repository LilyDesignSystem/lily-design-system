// DescriptionList component
//
// A list of terms and their descriptions. Renders a <dl> with the `description-list` hook; items are
// DescriptionListItem.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Accepted for API symmetry but not rendered by this component.
//   children — JSX.Element, required. The DescriptionListItem children.
//   ...restProps — additional HTML attributes spread onto the root <dl>.
//
// Syntax:
//   <DescriptionList>…</DescriptionList>
//
// Examples:
//   <DescriptionList><DescriptionListItem><dt>Term</dt><dd>Description</dd></DescriptionListItem></DescriptionList>
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
//   - MDN <dl>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface DescriptionListProps {
    class?: string;
    label?: string;
    children: JSX.Element;
    [key: string]: unknown;
}

export default function DescriptionList(props: DescriptionListProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <dl
            class={`description-list ${p.class}`}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </dl>
    );
}
