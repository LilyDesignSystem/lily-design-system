// ActionBar component
//
// A contextual action bar that appears when items are selected. It shows
// the selection count, bulk action buttons, and an optional clear-selection
// button. Inspired by Adobe Spectrum.
//
// Props:
//   class           — string, optional. CSS class name.
//   label               — string, REQUIRED. aria-label for the toolbar.
//   selectedCount       — number, REQUIRED. Count of currently selected items.
//   selectedCountLabel  — string, REQUIRED. Pre-formatted count display (e.g., "3 selected").
//   clearSelectionLabel — string, optional. aria-label for the clear-selection button.
//   onClearSelection    — () => void, optional. Clear-selection click handler.
//   children            — ReactNode, optional. Action buttons inside the toolbar.
//   ...restProps        — additional HTML attributes spread onto the root <div>.
//
// Behavior:
//   The clear button only renders when both `onClearSelection` and
//   `clearSelectionLabel` are provided.
//
// Accessibility:
//   - role="toolbar" with aria-label
//   - data-selected-count exposed for consumer styling
//
// Headless rules:
//   - No CSS, no inline styles
//   - All user-facing strings are consumer-supplied (i18n)
//
// References:
//   - Adobe Spectrum ActionBar: https://spectrum.adobe.com/page/action-bar/
//   - WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/

import type { JSX } from "@solidjs/web";
import { merge, omit, onSettled, untrack } from "solid-js";
import { attr } from "./attr";
import { attachToolbar } from "./widget-keys";

export interface ActionBarProps {
    class?: string;
    /** aria-label for the toolbar (required) */
    label: string;
    /** Count of currently selected items */
    selectedCount: number;
    /** Pre-formatted display of the count (e.g., "3 selected") */
    selectedCountLabel: string;
    /** Accessible label for the clear-selection button */
    clearSelectionLabel?: string;
    /** Clear-selection click handler */
    onClearSelection?: (event: MouseEvent) => void;
    /** Action buttons inside the toolbar */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function ActionBar(props: ActionBarProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(
        p,
        "class",
        "label",
        "selectedCount",
        "selectedCountLabel",
        "clearSelectionLabel",
        "onClearSelection",
        "children",
    );
    const showClearButton = () =>
        p.onClearSelection !== undefined && p.clearSelectionLabel !== undefined;
    const rootRef: { current: HTMLDivElement | null } = { current: null };
    onSettled(() =>
        untrack(() => attachToolbar(rootRef.current!, { dismiss: ".action-bar-clear" })),
    );

    return (
        <div
            ref={(el) => (rootRef.current = el)}
            class={`action-bar ${p.class}`}
            role="toolbar"
            aria-label={p.label}
            data-selected-count={attr(p.selectedCount)}
            {...restProps}
        >
            <span class="action-bar-count">{p.selectedCountLabel}</span>
            {p.children}
            {showClearButton() && (
                <button
                    class="action-bar-clear"
                    type="button"
                    aria-label={p.clearSelectionLabel}
                    onClick={p.onClearSelection}
                >
                    ×
                </button>
            )}
        </div>
    );
}
