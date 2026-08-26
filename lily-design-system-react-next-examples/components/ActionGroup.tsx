// ActionGroup component
//
// A group of action buttons that can collapse to an overflow menu when
// space is constrained. The visible action buttons are passed via
// `children`; the overflow menu content is passed via the `overflow`
// prop (NOT children). Inspired by Adobe Spectrum.
//
// Props:
//   className         — string, optional. CSS class name.
//   label             — string, REQUIRED. aria-label for the group.
//   overflowOpen      — boolean, default false. Whether the overflow menu is open.
//   overflowLabel     — string, optional. aria-label for the overflow trigger button.
//   onOverflowToggle  — overflow trigger click handler.
//   children          — ReactNode, optional. The visible action buttons.
//   overflow          — ReactNode, optional. Content for the overflow menu.
//   ...restProps      — additional HTML attributes spread onto the root <div>.
//
// Behavior:
//   The overflow trigger and overflow menu only render when `overflow` is provided.
//
// Headless rules:
//   - No CSS, no inline styles
//   - All user-facing strings are consumer-supplied (i18n)
//
// References:
//   - Adobe Spectrum ActionGroup: https://spectrum.adobe.com/page/action-group/

import React from "react";

export interface ActionGroupProps {
    className?: string;
    /** aria-label for the group (required) */
    label: string;
    /** Whether the overflow menu is open */
    overflowOpen?: boolean;
    /** aria-label for the overflow trigger button */
    overflowLabel?: string;
    /** Overflow trigger click handler */
    onOverflowToggle?: (event: React.MouseEvent) => void;
    /** The visible action buttons */
    children?: React.ReactNode;
    /** Content for the overflow menu */
    overflow?: React.ReactNode;
    [key: string]: unknown;
}

export default function ActionGroup({
    className = "",
    label,
    overflowOpen = false,
    overflowLabel = undefined,
    onOverflowToggle = undefined,
    children = undefined,
    overflow = undefined,
    ...restProps
}: ActionGroupProps) {
    const showOverflow = overflow !== undefined;
    return (
        <div
        className={`action-group ${className}`}
        role="group"
        aria-label={label}
        {...restProps}
        >
            {children}
            {showOverflow && (
                <>
                    <button
                    className="action-group-overflow-trigger"
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={overflowOpen}
                    aria-label={overflowLabel}
                    onClick={onOverflowToggle}
                    >
                        …
                    </button>
                    <div className="action-group-overflow-menu" hidden={!overflowOpen}>
                        {overflow}
                    </div>
                </>
            )}
        </div>
    );
}
