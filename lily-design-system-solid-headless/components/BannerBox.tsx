// BannerBox component
//
// A headless layout component designed to be placed inside a Banner component.
// Renders a <div> that the consumer styles with flexbox horizontal layout
// (display: flex; flex-direction: row) to arrange banner content items side by
// side, such as a message and action buttons.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Accessible name via aria-label.
//   children — ReactNode, required. The banner box content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <BannerBox>content</BannerBox>
//
// Examples:
//   <Banner>
//     <BannerBox>
//       <span>Important announcement</span>
//       <button>Learn more</button>
//     </BannerBox>
//   </Banner>
//
// Keyboard:
//   - None (passive layout element)
//
// Accessibility:
//   - No additional ARIA required; parent Banner provides landmark and aria-live
//   - Optional aria-label via label prop
//
// Internationalization:
//   - All text comes through children; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Consumer applies display: flex; flex-direction: row; to .banner-box
//
// References:
//   - CSS Flexbox: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface BannerBoxProps {
    class?: string;
    /** Optional accessible name */
    label?: string;
    /** The banner box content */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function BannerBox(props: BannerBoxProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <div
            class={`banner-box ${p.class}`}
            role={p.label ? "group" : undefined}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
