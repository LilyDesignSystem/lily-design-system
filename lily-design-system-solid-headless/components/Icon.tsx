// Icon component
//
// An icon wrapper that provides proper accessibility semantics for icon content.
// Supports both meaningful icons (with accessible labels announced by screen readers)
// and decorative icons (hidden from assistive technology). The consumer provides the
// actual icon content (text characters, SVG, or any markup) as children.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, default undefined. Accessible name for meaningful icons via aria-label.
//   decorative — boolean, default false. When true, hides the icon from assistive technology.
//   children — ReactNode, required. The icon content (text, SVG, or other markup).
//   ...restProps — additional HTML attributes spread onto the span element.
//
// Syntax:
//   <Icon label="Close">x</Icon>
//
// Examples:
//
//   <Icon label="Close">x</Icon>
//
//
//   <Icon decorative>*</Icon>
//
//
//   <Icon label="Search" data-testid="search-icon">Q</Icon>
//
// Keyboard:
//   - None — this is a passive container; keyboard behavior depends on the parent interactive element
//
// Accessibility:
//   - role="img" applied to meaningful icons so assistive technology treats the span as an image
//   - aria-label provides the accessible name for meaningful icons
//   - aria-hidden="true" applied when decorative is true, hiding the icon from the accessibility tree
//   - When decorative is true, role is omitted entirely
//
// Internationalization:
//   - The label prop allows localized accessible names; no hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Consumer provides the icon content; this component only handles semantics
//   - Mutually exclusive modes: meaningful (label) vs decorative (aria-hidden)
//
// References:
//   - WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img
//   - WAI-ARIA Images Tutorial: https://www.w3.org/WAI/tutorials/images/decorative/

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
export interface IconProps {
    class?: string;
    label?: string;
    decorative?: boolean;
    children: JSX.Element;
    [key: string]: unknown;
}

export default function Icon(props: IconProps) {
    const p = merge({ class: "" as const, decorative: false }, props);
    const restProps = omit(p, "class", "label", "decorative", "children");
    return (
        <span
            class={`icon ${p.class}`}
            role={p.decorative ? undefined : "img"}
            aria-label={p.label}
            aria-hidden={attr(p.decorative || undefined)}
            {...restProps}
        >
            {p.children}
        </span>
    );
}
