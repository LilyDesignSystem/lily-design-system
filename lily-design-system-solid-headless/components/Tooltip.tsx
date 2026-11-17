// Tooltip component
//
// A headless tooltip that displays brief, contextual information when made
// visible. Uses role="tooltip" for semantic identification and is designed
// to be linked to a trigger element via aria-describedby, providing
// supplementary text that screen readers can announce. Tooltips are used to
// clarify the function or meaning of elements without cluttering the interface.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. The tooltip text content.
//   visible — boolean, default false. Controls visibility; consumer manages via trigger events.
//   id — string, default undefined. Optional id for aria-describedby linking to trigger element.
//   ...restProps — additional HTML attributes spread onto the tooltip <div>.
//
// Syntax:
//   <Tooltip id="tip" label="Additional info" visible={showTip} />
//
// Examples:
//
//   <button aria-describedby="tip"
//     onMouseEnter={() => setShowTip(true)}
//     onMouseLeave={() => setShowTip(false)}>Hover me</button>
//   <Tooltip id="tip" label="Additional info" visible={showTip} />
//
// Keyboard:
//   - Escape: consumer should hide the tooltip (not built into the component)
//   - Tooltip itself does not receive focus; it describes another element
//
// Accessibility:
//   - role="tooltip" identifies the element as a tooltip popup
//   - id enables aria-describedby linking to the trigger element
//   - Conditionally rendered: fully removed from DOM when not visible
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Uses {visible && ...} for conditional rendering
//   - Consumer manages visibility (hover, focus, etc.)
//
// References:
//   - WAI-ARIA Tooltip Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
//   - MDN aria-describedby: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby

import { merge, omit } from "solid-js";
import { usePopoverState } from "./Popover";
import { warnMissingName } from "./dev-warning";

export interface TooltipProps {
    class?: string;
    /** Tooltip text content. */
    label: string;
    /** Whether the tooltip is visible. Consumer controls via trigger events. */
    visible?: boolean;
    /** Optional id for aria-describedby linking. */
    id?: string;
    [key: string]: unknown;
}

export default function Tooltip(props: TooltipProps) {
    const p = merge({ class: "" as const, visible: false }, props);
    const restProps = omit(p, "class", "label", "visible", "id");
    warnMissingName("Tooltip", p.label, p["aria-label"], p["aria-labelledby"]);
    const panelRef: { current: HTMLDivElement | null } = { current: null };
    usePopoverState(panelRef, () => p.visible);
    return (
        <div
            class={`tooltip ${p.class}`}
            ref={(el) => (panelRef.current = el)}
            role="tooltip"
            popover="manual"
            id={p.id}
            {...restProps}
        >
            {p.label}
        </div>
    );
}
