// MedicalBannerBoxForAdvice component
//
// A headless component for displaying routine medical record advice information
// such as contacts, contexts, care plans, and other advice-level clinical data.
// Renders a <div> with role="region", aria-label, and data-type="advice".
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   children — ReactNode, required. The advice banner box content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <MedicalBannerBoxForAdvice label="Care contacts">content</MedicalBannerBoxForAdvice>
//
// Keyboard:
//   - None (passive layout element)
//
// Accessibility:
//   - role="region" for landmark identification
//   - aria-label provides accessible name
//   - data-type="advice" for consumer CSS targeting
//
// Internationalization:
//   - label prop is the only user-facing string; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface MedicalBannerBoxForAdviceProps {
    class?: string;
    /** Accessible name for the advice box */
    label: string;
    /** The advice banner box content */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function MedicalBannerBoxForAdvice(props: MedicalBannerBoxForAdviceProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <div
            class={`medical-banner-box-for-advice ${p.class}`}
            role="region"
            aria-label={p.label}
            data-type="advice"
            {...restProps}
        >
            {p.children}
        </div>
    );
}
