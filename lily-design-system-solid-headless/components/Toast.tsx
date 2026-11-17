// Toast component
//
// A headless notification toast that provides a brief, transient message to
// the user via ARIA live regions. Uses role="status" with aria-live="polite"
// by default, or role="alert" with aria-live="assertive" for urgent messages.
// Toasts are typically used for success confirmations, error messages, and
// informational updates without requiring user interaction.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, default undefined. Optional accessible label via aria-label.
//   urgent — boolean, default false. When true, uses role="alert" and aria-live="assertive".
//   children — ReactNode, required. The toast message content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <Toast label="Success">Your changes have been saved.</Toast>
//
// Examples:
//
//   <Toast label="Error" urgent>Something went wrong.</Toast>
//
//
//   <Toast label="Info">
//     <p>3 new messages in your inbox.</p>
//   </Toast>
//
// Keyboard:
//   - None -- passive notification container; announced via live regions
//
// Accessibility:
//   - role="status" (default) for polite announcements at the next graceful opportunity
//   - role="alert" (when urgent) for immediate, time-sensitive announcements
//   - aria-live="polite" (default) waits for a pause before announcing
//   - aria-live="assertive" (when urgent) interrupts current speech
//   - aria-label provides optional descriptive label for the toast region
//
// Internationalization:
//   - The label prop accepts any translated string
//   - All toast content is provided through the children prop
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - The urgent prop controls both role and aria-live simultaneously
//
// References:
//   - WAI-ARIA Alert Role: https://www.w3.org/TR/wai-aria-1.2/#alert
//   - WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status
//   - WAI-ARIA Live Regions: https://www.w3.org/TR/wai-aria-1.2/#aria-live

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
export interface ToastProps {
    class?: string;
    /** Optional accessible label. */
    label?: string;
    /** Whether to use alert role instead of status. */
    urgent?: boolean;
    /** Toast content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function Toast(props: ToastProps) {
    const p = merge({ class: "" as const, urgent: false }, props);
    const restProps = omit(p, "class", "label", "urgent", "children");
    return (
        <div
            class={`toast ${p.class}`}
            role={p.urgent ? "alert" : "status"}
            aria-label={p.label}
            aria-live={attr(p.urgent ? "assertive" : "polite")}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
