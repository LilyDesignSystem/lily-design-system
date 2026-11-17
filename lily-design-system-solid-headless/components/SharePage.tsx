import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { warnMissingName } from "./dev-warning";
// SharePage component
//
// A group of controls for sharing the current page. Renders a <div> with the `share-page` hook; it
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name, rendered as aria-label on the root.
//   children — JSX.Element, required. The sharing links or buttons.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <SharePage label="…">…</SharePage>
//
// Examples:
//   <SharePage label="Share this page"><a href="…">Email</a></SharePage>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - aria-label comes from `label` when given
//   - role="group" on the root, so the label is valid
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

export interface SharePageProps {
    class?: string;
    label: string;
    children: JSX.Element;
    [key: string]: unknown;
}

export default function SharePage(props: SharePageProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    warnMissingName("SharePage", p.label, p["aria-label"], p["aria-labelledby"]);
    return (
        <div
            class={`share-page ${p.class}`}
            role="group"
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
