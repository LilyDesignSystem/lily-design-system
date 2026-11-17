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
//   class     — string, optional. CSS class name.
//   label         — string, required. aria-label for the group.
//   primaryLabel  — string, required. Text/label for the primary button.
//   menuLabel     — string, required. aria-label for the menu trigger button.
//   menuOpen      — boolean, default false. Whether the dropdown menu is open.
//   disabled      — boolean, default false. Disables both buttons.
//   onPrimaryClick — (event: MouseEvent) => void, optional. Primary action handler.
//   onMenuToggle   — (event: MouseEvent) => void, optional. Menu toggle handler.
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

import type { JSX } from "@solidjs/web";
import { merge, omit, createSignal, createUniqueId } from "solid-js";
import { attr } from "./attr";
import { popoverSupported, usePopoverState } from "./Popover";
import { warnMissingName } from "./dev-warning";

export interface SplitButtonProps {
    class?: string;
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
    onPrimaryClick?: (event: MouseEvent) => void;
    /** Menu trigger click handler; call preventDefault() to keep the menu as it is */
    onMenuToggle?: (event: MouseEvent) => void;
    /** Called when the menu opens or closes, including Escape and light dismiss */
    onChange?: (value: boolean) => void;
    /** The menu content */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function SplitButton(props: SplitButtonProps) {
    const p = merge({ class: "" as const, menuOpen: false, disabled: false }, props);
    const restProps = omit(
        p,
        "class",
        "label",
        "primaryLabel",
        "menuLabel",
        "menuOpen",
        "disabled",
        "onPrimaryClick",
        "onMenuToggle",
        "onChange",
        "children",
    );
    warnMissingName("SplitButton", p.label, p["aria-label"], p["aria-labelledby"]);
    const reactId = createUniqueId();
    const menuId = () => `split-button-${reactId}-menu`;
    const menu: { current: HTMLDivElement | null } = { current: null };
    const [open, setOpen] = createSignal(() => p.menuOpen);

    function change(value: boolean) {
        setOpen(value);
        p.onChange?.(value);
    }
    // popover="auto": the trigger's command="toggle-popover" opens and closes the menu; without the API the click
    // toggles and `hidden` shows or hides it.
    usePopoverState(menu, open, () => change);

    function handleToggle(event: MouseEvent) {
        p.onMenuToggle?.(event);
        if (event.defaultPrevented) return;
        if (menu.current && !popoverSupported(menu.current)) change(!open());
    }

    return (
        <div
            class={`split-button ${p.class}`}
            role="group"
            aria-label={p.label}
            {...restProps}
        >
            <button
                class="split-button-primary"
                type="button"
                disabled={p.disabled}
                onClick={p.onPrimaryClick}
            >
                {p.primaryLabel}
            </button>
            <button
                class="split-button-menu-trigger"
                type="button"
                disabled={p.disabled}
                aria-haspopup="menu"
                aria-expanded={attr(open())}
                aria-label={p.menuLabel}
                aria-controls={menuId()}
                popovertarget={menuId()}
                {...{ command: "toggle-popover", commandfor: menuId() }}
                onClick={handleToggle}
            />
            <div
                ref={(el) => (menu.current = el)}
                class="split-button-menu"
                id={menuId()}
                popover="auto"
            >
                {p.children}
            </div>
        </div>
    );
}
