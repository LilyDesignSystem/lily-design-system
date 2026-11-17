// StickyPromoBanner component
//
// A fixed-position promotional banner with an optional dismiss button.
// Renders an <aside role="complementary"> pinned to the top or bottom
// of the viewport via inline `position: fixed`.
//
// Inline styles are required for this component to provide its
// fundamental sticky behavior; consumers can override visual styling.
//
// Props:
//   class    — string, optional. CSS class name appended to root.
//   label        — string, REQUIRED. aria-label for the aside region.
//   open         — boolean, default true. Whether the banner is visible
//                  (uses the native `hidden` attribute when false).
//   position     — "top" | "bottom", default "bottom". Sticky edge of
//                  the viewport (exposed as data-position).
//   dismissLabel — string, REQUIRED. aria-label for the dismiss button.
//   onDismiss    — (event: MouseEvent) => void, optional. When
//                  provided, the dismiss button is rendered.
//   children     — ReactNode, optional. Banner content.
//   ...restProps — additional HTML attributes spread onto the root.
//
// Syntax:
//   <StickyPromoBanner
//     label="Promotional banner"
//     position="bottom"
//     dismissLabel="Dismiss banner"
//     onDismiss={() => setOpen(false)}
//     open={open}
//   >
//     <p>Subscribe to save 20%.</p>
//   </StickyPromoBanner>
//
// Accessibility:
//   - <aside role="complementary"> landmark with aria-label
//   - Dismiss button has its own aria-label
//
// Internationalization:
//   - All user-facing strings are consumer-supplied
//
// Claude rules:
//   - Headless except for the documented sticky positioning style
//   - label and dismissLabel are non-optional in the interface
//   - Dismiss button is rendered only when onDismiss is provided

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
export interface StickyPromoBannerProps {
    class?: string;
    /** aria-label for the aside region */
    label: string;
    /** Whether the banner is visible */
    open?: boolean;
    /** Sticky edge of the viewport */
    position?: "top" | "bottom";
    /** aria-label for the dismiss button */
    dismissLabel: string;
    /** Dismiss click handler. When provided, the dismiss button is rendered. */
    onDismiss?: (event: MouseEvent) => void;
    /** Banner content */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function StickyPromoBanner(props: StickyPromoBannerProps) {
    const p = merge({ class: "" as const, open: true, position: "bottom" as const }, props);
    const restProps = omit(
        p,
        "class",
        "label",
        "open",
        "position",
        "dismissLabel",
        "onDismiss",
        "children",
    );
    const positionStyle = (): JSX.CSSProperties =>
        p.position === "top"
            ? { position: "fixed", top: 0, left: 0, right: 0 }
            : { position: "fixed", bottom: 0, left: 0, right: 0 };

    return (
        <aside
            class={`sticky-promo-banner ${p.class}`}
            role="complementary"
            aria-label={p.label}
            data-position={attr(p.position)}
            hidden={!p.open}
            style={positionStyle()}
            {...restProps}
        >
            <div class="sticky-promo-banner-content">{p.children}</div>
            {p.onDismiss && (
                <button
                    class="sticky-promo-banner-dismiss"
                    type="button"
                    aria-label={p.dismissLabel}
                    onClick={p.onDismiss}
                >
                    ×
                </button>
            )}
        </aside>
    );
}
