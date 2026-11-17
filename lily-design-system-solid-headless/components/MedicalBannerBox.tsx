// MedicalBannerBox component
//
// A headless layout component designed to be placed inside a MedicalBanner.
// Renders a <div> with data-context="medical" that the consumer styles with
// flexbox horizontal layout to arrange medical banner content items side by side.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Accessible name via aria-label.
//   children — ReactNode, required. The medical banner box content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <MedicalBannerBox>content</MedicalBannerBox>
//
// Keyboard:
//   - None (passive layout element)
//
// Accessibility:
//   - No additional ARIA required; parent MedicalBanner provides landmark
//   - Optional aria-label via label prop
//   - data-context="medical" for medical context
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface MedicalBannerBoxProps {
    class?: string;
    /** Optional accessible name */
    label?: string;
    /** The medical banner box content */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function MedicalBannerBox(props: MedicalBannerBoxProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <div
            class={`medical-banner-box ${p.class}`}
            role={p.label ? "group" : undefined}
            aria-label={p.label}
            data-context="medical"
            {...restProps}
        >
            {p.children}
        </div>
    );
}
