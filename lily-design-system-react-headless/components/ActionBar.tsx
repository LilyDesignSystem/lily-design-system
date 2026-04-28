// ActionBar component
//
// A contextual action bar that appears when items are selected. It shows
// the selection count, bulk action buttons, and an optional clear-selection
// button. Inspired by Adobe Spectrum.
//
// Props:
//   className           — string, optional. CSS class name.
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

import React from "react";

export interface ActionBarProps {
    className?: string;
    /** aria-label for the toolbar (required) */
    label: string;
    /** Count of currently selected items */
    selectedCount: number;
    /** Pre-formatted display of the count (e.g., "3 selected") */
    selectedCountLabel: string;
    /** Accessible label for the clear-selection button */
    clearSelectionLabel?: string;
    /** Clear-selection click handler */
    onClearSelection?: (event: React.MouseEvent) => void;
    /** Action buttons inside the toolbar */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ActionBar({
    className = "",
    label,
    selectedCount,
    selectedCountLabel,
    clearSelectionLabel = undefined,
    onClearSelection = undefined,
    children = undefined,
    ...restProps
}: ActionBarProps) {
    const showClearButton = onClearSelection !== undefined && clearSelectionLabel !== undefined;
    return (
        <div
        className={`action-bar ${className}`}
        role="toolbar"
        aria-label={label}
        data-selected-count={selectedCount}
        {...restProps}
        >
            <span className="action-bar-count">{selectedCountLabel}</span>
            {children}
            {showClearButton && (
                <button
                className="action-bar-clear"
                type="button"
                aria-label={clearSelectionLabel}
                onClick={onClearSelection}
                >
                    ×
                </button>
            )}
        </div>
    );
}
