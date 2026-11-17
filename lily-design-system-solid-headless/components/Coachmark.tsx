// Coachmark component
//
// An anchored popover that spotlights and explains a single feature.
// Inspired by Adobe Spectrum.
//
// Props:
//   class     — string, optional. CSS class name.
//   open          — boolean, default false. Whether the coachmark is visible.
//   title         — string, REQUIRED. Heading text.
//   description   — string, optional. Body text.
//   dismissLabel  — string, REQUIRED. Accessible label for the dismiss button.
//   onDismiss     — dismiss click handler.
//   ...restProps  — additional HTML attributes spread onto the root <div>.
//
// Behavior:
//   - Renders <div role="dialog" aria-modal="false">
//   - Generates stable ids with useId() for aria-labelledby and aria-describedby
//   - aria-describedby is only set when `description` is provided
//
// Headless rules:
//   - No CSS, no inline styles
//   - All user-facing strings are consumer-supplied (i18n)
//
// References:
//   - Adobe Spectrum Coachmark: https://spectrum.adobe.com/page/coach-mark/
//   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

import { merge, omit, createUniqueId } from "solid-js";
import { usePopoverState } from "./Popover";

export interface CoachmarkProps {
    class?: string;
    /** Whether the coachmark is visible */
    open?: boolean;
    /** Heading text (required) */
    title: string;
    /** Body text */
    description?: string;
    /** Accessible label for the dismiss button (required) */
    dismissLabel: string;
    /** Dismiss click handler */
    onDismiss?: (event: MouseEvent) => void;
    [key: string]: unknown;
}

export default function Coachmark(props: CoachmarkProps) {
    const p = merge({ class: "" as const, open: false }, props);
    const restProps = omit(p, "class", "open", "title", "description", "dismissLabel", "onDismiss");
    const panelRef: { current: HTMLDivElement | null } = { current: null };
    usePopoverState(panelRef, () => p.open);
    const reactId = createUniqueId();
    const titleId = () => `coachmark-${reactId}-title`;
    const descId = () => `coachmark-${reactId}-desc`;
    return (
        <div
            class={`coachmark ${p.class}`}
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId()}
            aria-describedby={p.description !== undefined ? descId() : undefined}
            ref={(el) => (panelRef.current = el)}
            popover="manual"
            {...restProps}
        >
            <h2
                class="coachmark-title"
                id={titleId()}
            >
                {p.title}
            </h2>
            {p.description !== undefined && (
                <p
                    class="coachmark-description"
                    id={descId()}
                >
                    {p.description}
                </p>
            )}
            <button
                class="coachmark-dismiss"
                type="button"
                aria-label={p.dismissLabel}
                onClick={p.onDismiss}
            >
                ×
            </button>
        </div>
    );
}
