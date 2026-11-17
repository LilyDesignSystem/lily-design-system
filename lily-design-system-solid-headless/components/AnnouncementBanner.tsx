// AnnouncementBanner component
//
// A banner announcing news or a service notice. Renders a <div> with the `announcement-banner` hook;
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Accessible name, rendered as aria-label on the root.
//   children — JSX.Element, required. The announcement.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <AnnouncementBanner label="…">…</AnnouncementBanner>
//
// Examples:
//   <AnnouncementBanner label="Service notice">The service is closed on Monday.</AnnouncementBanner>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - aria-label comes from `label` when given
//   - role="region" on the root, so the label is valid
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface AnnouncementBannerProps {
    class?: string;
    label?: string;
    children: JSX.Element;
    [key: string]: unknown;
}

export default function AnnouncementBanner(props: AnnouncementBannerProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <div
            class={`announcement-banner ${p.class}`}
            role="region"
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
