// ContextualHelp component
//
// A help button that opens a popover with explanatory content. Inspired
// by Adobe Spectrum.
//
// Props:
//   className     — string, optional. CSS class name.
//   label         — string, REQUIRED. aria-label for the help trigger button.
//   expanded      — boolean, default false. Whether the popover is open.
//   onClick       — trigger click handler.
//   children      — ReactNode, optional. Popover content.
//   ...restProps  — additional HTML attributes spread onto the root <div>.
//
// Behavior:
//   - Renders a <button> trigger with aria-haspopup="dialog", aria-expanded, aria-controls
//   - Renders a <div role="dialog"> panel with the panel id from React.useId()
//   - The `hidden` attribute on the panel reflects !expanded
//
// Headless rules:
//   - No CSS, no inline styles
//   - All user-facing strings are consumer-supplied (i18n)
//
// References:
//   - Adobe Spectrum ContextualHelp: https://spectrum.adobe.com/page/contextual-help/

import React, { useId } from "react";

export interface ContextualHelpProps {
    className?: string;
    /** aria-label for the help trigger button (required) */
    label: string;
    /** Whether the popover is open */
    expanded?: boolean;
    /** Trigger click handler */
    onClick?: (event: React.MouseEvent) => void;
    /** Popover content */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ContextualHelp({
    className = "",
    label,
    expanded = false,
    onClick = undefined,
    children = undefined,
    ...restProps
}: ContextualHelpProps) {
    const reactId = useId();
    const panelId = `contextual-help-${reactId}-panel`;
    return (
        <div className={`contextual-help ${className}`} {...restProps}>
            <button
            className="contextual-help-trigger"
            type="button"
            aria-label={label}
            aria-haspopup="dialog"
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={onClick}
            >
                ?
            </button>
            <div
            className="contextual-help-panel"
            id={panelId}
            role="dialog"
            hidden={!expanded}
            >
                {children}
            </div>
        </div>
    );
}
