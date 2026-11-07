// ContextualHelp component
//
// A help button that opens a popover with explanatory content. Inspired
// by Adobe Spectrum.
//
// Props:
//   className     — string, optional. CSS class name.
//   label         — string, REQUIRED. aria-label for the help trigger button (its accessible name).
//   triggerLabel  — string, REQUIRED. Visible text of the trigger, such as "?" or "؟". No default:
//                   the glyph is the consumer's, per script and locale; pass "" when CSS draws an icon.
//   expanded      — boolean, default false. Whether the popover is open (initial and controlled value).
//   onChange      — (value: boolean) => void. Called when the panel opens or closes (trigger,
//                   Escape, light dismiss).
//   onClick       — trigger click handler; event.preventDefault() stops the toggle.
//   children      — ReactNode, optional. Popover content.
//   ...restProps  — additional HTML attributes spread onto the root <div>.
//
// Behavior:
//   - Renders a <button> trigger with aria-haspopup="dialog", aria-expanded, aria-controls, and
//     command="toggle-popover" commandfor={panelId} (popovertarget for engines before command/commandfor)
//   - Renders a <div role="dialog" popover="auto"> panel with the panel id from React.useId(): the native
//     Popover API opens it, closes it on Escape and on a click outside (light dismiss), with no script
//   - The panel's toggle event keeps aria-expanded in step
//   - Where the Popover API is missing (jsdom, old engines) the click toggles and the panel uses `hidden`
//
// Headless rules:
//   - No CSS, no inline styles
//   - All user-facing strings are consumer-supplied (i18n)
//
// References:
//   - Adobe Spectrum ContextualHelp: https://spectrum.adobe.com/page/contextual-help/
//   - HTML command and commandfor: https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-command

import React, { useEffect, useId, useRef, useState } from "react";

import { popoverSupported, usePopoverState } from "./Popover";

export interface ContextualHelpProps {
    className?: string;
    /** aria-label for the help trigger button (required) */
    label: string;
    /** Visible text of the trigger, such as "?" (required; no default) */
    triggerLabel: string;
    /** Whether the popover is open */
    expanded?: boolean;
    /** Called when the popover opens or closes */
    onChange?: (value: boolean) => void;
    /** Trigger click handler */
    onClick?: (event: React.MouseEvent) => void;
    /** Popover content */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ContextualHelp({
    className = "",
    label,
    triggerLabel,
    expanded = false,
    onChange = undefined,
    onClick = undefined,
    children = undefined,
    ...restProps
}: ContextualHelpProps) {
    const reactId = useId();
    const panelId = `contextual-help-${reactId}-panel`;
    const panel = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(expanded);
    useEffect(() => setOpen(expanded), [expanded]);

    function change(value: boolean) {
        setOpen(value);
        onChange?.(value);
    }
    usePopoverState(panel, open, change);

    function handleClick(event: React.MouseEvent) {
        onClick?.(event);
        if (event.defaultPrevented) return;
        // With the Popover API the browser toggles the panel and its toggle event calls change().
        if (panel.current && !popoverSupported(panel.current)) change(!open);
    }

    // command and commandfor are not in React's DOM types yet; React 19 renders them as attributes.
    const command = { command: "toggle-popover", commandfor: panelId };
    return (
        <div
            className={`contextual-help ${className}`}
            {...restProps}
        >
            <button
                className="contextual-help-trigger"
                type="button"
                aria-label={label}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={panelId}
                popoverTarget={panelId}
                {...command}
                onClick={handleClick}
            >
                {triggerLabel}
            </button>
            <div
                ref={panel}
                className="contextual-help-panel"
                id={panelId}
                role="dialog"
                aria-label={label}
                popover="auto"
            >
                {children}
            </div>
        </div>
    );
}
