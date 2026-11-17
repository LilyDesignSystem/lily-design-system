// HoverCard component
//
// A hover card that displays supplementary content when triggered, typically by a
// hover or focus interaction on a trigger element. It conditionally renders a container
// with role="tooltip" when the open prop is true. Useful for user profile previews,
// link previews, contextual help, or any popover-style content.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name for the hover card via aria-label.
//   open — boolean, default false. Whether the hover card is visible; controlled via open + onChange.
//   children — ReactNode, required. Content to display inside the hover card.
//   ...restProps — additional HTML attributes spread onto the container div.
//
// Syntax:
//   <HoverCard label="User info" open={open} onChange={setOpen}>{children}</HoverCard>
//
// Examples:
//
//   <button
//     onMouseEnter={() => setOpen(true)}
//     onMouseLeave={() => setOpen(false)}
//     onFocus={() => setOpen(true)}
//     onBlur={() => setOpen(false)}
//   >Hover me</button>
//   <HoverCard label="User info" open={open} onChange={setOpen}>
//     <p>Profile details here</p>
//   </HoverCard>
//
// Keyboard:
//   - None at the component level — consumer manages focus-based visibility on the trigger element
//
// Accessibility:
//   - role="tooltip" identifies the hover card as supplementary descriptive content
//   - aria-label provides an accessible name describing the hover card content
//   - Consumer should link the trigger to the tooltip via aria-describedby
//
// Internationalization:
//   - The label prop allows localized accessible names; no hardcoded user-facing strings
//   - All content comes through the children prop
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling and positioning
//   - Uses controlled for two-way binding on the open prop
//   - Consumer is responsible for managing hover/focus events on the trigger element
//   - Fully removed from DOM when closed via {open && ...}
//
// References:
//   - WAI-ARIA tooltip role: https://www.w3.org/TR/wai-aria-1.2/#tooltip
//   - WAI-ARIA Tooltip Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { usePopoverState } from "./Popover";

export interface HoverCardProps {
    class?: string;
    label: string;
    open?: boolean;
    children: JSX.Element;
    /** Callback when open changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function HoverCard(props: HoverCardProps) {
    const p = merge({ class: "" as const, open: false }, props);
    const restProps = omit(p, "class", "label", "open", "onChange", "children");
    const panelRef: { current: HTMLDivElement | null } = { current: null };
    usePopoverState(panelRef, () => p.open);
    return (
        <div
            class={`hover-card ${p.class}`}
            ref={(el) => (panelRef.current = el)}
            role="tooltip"
            popover="manual"
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
