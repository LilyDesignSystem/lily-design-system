// ContextMenu component
//
// A headless context menu that displays a list of actions relevant to the current
// context, typically triggered by a right-click or long-press. When opened, focus
// moves to the first menu item automatically. Arrow keys navigate between items
// with wrapping, and Escape closes the menu. Consumers trigger opening externally
// and provide role="menuitem" children. Used with ContextMenuItem children.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name for the context menu via aria-label.
//   open — boolean, default false. Whether the menu is visible; bindable for two-way control.
//   children — ReactNode, required. Menu item content (should include role="menuitem" elements).
//   ...restProps — additional HTML attributes spread onto the menu <div>.
//
// Syntax:
//   <ContextMenu label="Actions" open={open} onChange={setOpen}>
//     <ContextMenuItem>Cut</ContextMenuItem>
//   </ContextMenu>
//
// Examples:
//
//   <ContextMenu label="Actions" open={open} onChange={setOpen}>
//     <li role="menuitem" tabindex="-1">Cut</li>
//     <li role="menuitem" tabindex="-1">Copy</li>
//     <li role="menuitem" tabindex="-1">Paste</li>
//   </ContextMenu>
//
// Keyboard:
//   - ArrowDown: Move focus to the next menu item (wraps to first)
//   - ArrowUp: Move focus to the previous menu item (wraps to last)
//   - Home: Move focus to the first menu item
//   - End: Move focus to the last menu item
//   - Escape: Close the menu
//
// Accessibility:
//   - role="menu" identifies the container as a menu widget
//   - aria-label provides an accessible name for the menu
//   - Focus is automatically moved to the first menuitem when opened via useEffect
//
// Internationalization:
//   - The label prop provides the accessible name; no hardcoded strings
//   - All menu item content is provided by consumers through children
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Compound component: use with ContextMenuItem for individual entries
//   - Consumer triggers opening externally (e.g., via contextmenu event handler)
//
// References:
//   - WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/

import type { JSX } from "@solidjs/web";
import { merge, omit, createUniqueId } from "solid-js";
import { usePopoverState } from "./Popover";
import { warnMissingName } from "./dev-warning";

export interface ContextMenuProps {
    class?: string;
    /** Accessible name for the context menu. */
    label: string;
    /** Whose record or what the menu acts on, in the consumer's words: a non-interactive first part, .context-menu-subject, that names the menu (aria-labelledby). */
    subjectLabel?: string;
    /** Whether the menu is visible. Bindable for two-way control. */
    open?: boolean;
    /** Menu item content rendered inside the menu list. */
    children: JSX.Element;
    /** Callback when open changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function ContextMenu(props: ContextMenuProps) {
    const p = merge({ class: "" as const, open: false }, props);
    const restProps = omit(p, "class", "label", "subjectLabel", "open", "onChange", "children");
    const subjectId = `context-menu-subject-${createUniqueId()}`;
    warnMissingName(
        "ContextMenu",
        p.label || p.subjectLabel,
        p["aria-label"],
        p["aria-labelledby"],
    );
    const menuRef: { current: HTMLDivElement | null } = { current: null };
    // popover="auto" with no declarative trigger (a right-click or long-press opens it): `open` shows it with
    // showPopover() in the top layer; Escape and light dismiss come from the browser and are reported through
    // p.onChange. Positioning at the pointer stays the consumer's CSS.
    usePopoverState(
        menuRef,
        () => p.open,
        () => p.onChange,
    );

    function handleKeyDown(event: KeyboardEvent) {
        if (!menuRef.current) return;
        const items = Array.from(
            menuRef.current.querySelectorAll<HTMLElement>("[role='menuitem']"),
        );
        const current = document.activeElement as HTMLElement;
        const index = items.indexOf(current);

        switch (event.key) {
            case "ArrowDown": {
                event.preventDefault();
                const next = index < items.length - 1 ? index + 1 : 0;
                items[next]?.focus();
                break;
            }
            case "ArrowUp": {
                event.preventDefault();
                const prev = index > 0 ? index - 1 : items.length - 1;
                items[prev]?.focus();
                break;
            }
            case "Home": {
                event.preventDefault();
                items[0]?.focus();
                break;
            }
            case "End": {
                event.preventDefault();
                items[items.length - 1]?.focus();
                break;
            }
            case "Escape": {
                event.preventDefault();
                p.onChange?.(false);
                break;
            }
        }
    }

    return (
        <div
            class={`context-menu ${p.class}`}
            role="menu"
            aria-label={p.subjectLabel ? undefined : p.label}
            aria-labelledby={p.subjectLabel ? subjectId : undefined}
            popover="auto"
            ref={(el) => (menuRef.current = el)}
            onKeyDown={handleKeyDown}
            {...restProps}
        >
            {p.subjectLabel ? (
                <div
                    class="context-menu-subject"
                    id={subjectId}
                    role="none"
                >
                    {p.subjectLabel}
                </div>
            ) : null}
            {p.children}
        </div>
    );
}
