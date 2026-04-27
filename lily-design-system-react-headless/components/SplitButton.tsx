// SplitButton component
//
// A headless split button: a primary action button paired with a related-
// actions menu trigger. Renders a <div role="group"> containing two <button>
// elements (primary + menu trigger) followed by a menu container that holds
// the consumer-supplied menu content. The consumer is expected to wire
// `menuOpen` up to the controlled state and call `onMenuToggle` from the
// trigger to flip it.
//
// Props:
//   className     — string, optional. CSS class name.
//   label         — string, required. aria-label for the group.
//   primaryLabel  — string, required. Text/label for the primary button.
//   menuLabel     — string, required. aria-label for the menu trigger button.
//   menuOpen      — boolean, default false. Whether the dropdown menu is open.
//   disabled      — boolean, default false. Disables both buttons.
//   onPrimaryClick — (event: React.MouseEvent) => void, optional. Primary action handler.
//   onMenuToggle   — (event: React.MouseEvent) => void, optional. Menu toggle handler.
//   children      — ReactNode, optional. The menu content.
//   ...restProps  — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <SplitButton
//     label="Save options"
//     primaryLabel="Save"
//     menuLabel="More save options"
//     menuOpen={open}
//     onPrimaryClick={handleSave}
//     onMenuToggle={() => setOpen(!open)}
//   >
//     <Menu>…</Menu>
//   </SplitButton>
//
// Keyboard:
//   - Tab to focus primary; Tab again to focus the menu trigger
//   - Enter / Space activates either button
//
// Accessibility:
//   - role="group" wraps the pair with aria-label
//   - Menu trigger has aria-haspopup="menu" and aria-expanded reflecting menuOpen
//   - Menu container hidden when not open (via the hidden attribute)
//
// Internationalization:
//   - All visible and aria text consumer-supplied via label, primaryLabel, menuLabel
//
// Claude rules:
//   - Headless: no CSS, no styles, no glyphs (the trigger button has no inner content)
//   - Hook classes split-button-primary, split-button-menu-trigger, split-button-menu
//
// References:
//   - WAI-ARIA Menu Button: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/

import React from "react";

export interface SplitButtonProps {
    className?: string;
    /** aria-label for the group (required) */
    label: string;
    /** Visible text/label for the primary button (required) */
    primaryLabel: string;
    /** aria-label for the menu trigger button (required) */
    menuLabel: string;
    /** Whether the dropdown menu is open */
    menuOpen?: boolean;
    /** Disables both buttons */
    disabled?: boolean;
    /** Primary action click handler */
    onPrimaryClick?: (event: React.MouseEvent) => void;
    /** Menu trigger click handler */
    onMenuToggle?: (event: React.MouseEvent) => void;
    /** The menu content */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function SplitButton({
    className = "",
    label,
    primaryLabel,
    menuLabel,
    menuOpen = false,
    disabled = false,
    onPrimaryClick = undefined,
    onMenuToggle = undefined,
    children = undefined,
    ...restProps
}: SplitButtonProps) {
    return (
        <div
        className={`split-button ${className}`}
        role="group"
        aria-label={label}
        {...restProps}
        >
        <button
            className="split-button-primary"
            type="button"
            disabled={disabled}
            onClick={onPrimaryClick}
        >
            {primaryLabel}
        </button>
        <button
            className="split-button-menu-trigger"
            type="button"
            disabled={disabled}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label={menuLabel}
            onClick={onMenuToggle}
        />
        <div className="split-button-menu" hidden={!menuOpen}>
            {children}
        </div>
        </div>
    );
}
