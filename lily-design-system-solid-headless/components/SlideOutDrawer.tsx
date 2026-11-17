// SlideOutDrawer component
//
// A headless slide-out drawer that renders a modal <dialog> (opened with showModal()) which
// slides in from the side of the screen. When open, it can be dismissed with
// the Escape key. Commonly used for navigation menus, filters, settings panels,
// or secondary content in mobile and web applications.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible label for the dialog via aria-label.
//   open — boolean, default false. Whether the drawer is visible; controlled via open + onOpenChange.
//   children — ReactNode, required. The drawer content.
//   ...restProps — additional HTML attributes spread onto the <dialog>.
//
// Syntax:
//   <SlideOutDrawer label="Menu" open={isOpen} onOpenChange={setIsOpen}>
//     <nav>Menu content</nav>
//   </SlideOutDrawer>
//
// Examples:
//
//   <SlideOutDrawer label="Navigation menu" open={isOpen} onOpenChange={setIsOpen}>
//     <nav>
//       <ul><li><a href="/">Home</a></li></ul>
//     </nav>
//     <button onClick={() => setIsOpen(false)}>Close</button>
//   </SlideOutDrawer>
//
//
//   <SlideOutDrawer label="Settings panel" open={settingsOpen} onOpenChange={setSettingsOpen}>
//     <h2>Settings</h2>
//     <form><label><input type="checkbox" /> Enable notifications</label></form>
//   </SlideOutDrawer>
//
// Keyboard:
//   - Escape: closes the drawer (keydown or the native cancel event)
//   - Tab: stays inside while open (showModal())
//
// Accessibility:
//   - role="dialog" provided natively by the <dialog> element
//   - aria-label describes the drawer purpose
//   - aria-modal="true" is true: showModal() makes the page behind inert and traps Tab
//   - focus moves inside on open and returns to the opener on close
//   - tabindex="-1" allows the dialog to receive programmatic focus
//   - WCAG 2.2 AAA: properly labeled modal with keyboard dismissal
//
// Internationalization:
//   - The label prop externalizes the accessible label string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Open uses controlled state via open + onOpenChange
//   - Completely removed from DOM when closed ({open && ...})
//   - Focus trapping comes from showModal() (open-attribute fallback where it is missing, e.g. jsdom);
//     consumer implements slide animations via CSS
//
// References:
//   - WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
//   - WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog

import type { JSX } from "@solidjs/web";
import { omit, createEffect, createSignal, untrack } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import { warnMissingName } from "./dev-warning";

export interface SlideOutDrawerProps {
    class?: string;
    /** Accessible label for the dialog. */
    label: string;
    /** Whether the panel is open. Bindable. */
    open?: boolean;
    /** Panel content. */
    children: JSX.Element;
    /** Callback when open changes. */
    onOpenChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function SlideOutDrawer(props: SlideOutDrawerProps) {
    const p = withDefaults({ class: "" as const, open: false }, props);
    const restProps = omit(p, "class", "label", "open", "onOpenChange", "children");
    warnMissingName("SlideOutDrawer", p.label, p["aria-label"], p["aria-labelledby"]);
    const [open, setOpen] = createSignal(() => p.open);
    const ref: { current: HTMLDialogElement | null } = { current: null };

    // Sync internal state when the prop changes externally.

    // A real modal: showModal() puts the <dialog> in the top layer, makes the page behind it inert and traps Tab.
    // Where showModal is missing (jsdom) fall back to the open() attribute. Focus moves inside on open() and returns to
    // the element that had it when the panel opened, once it closes.
    createEffect(
        () => [open()],
        () =>
            untrack(() => {
                const node = ref.current;
                if (!open() || !node) return;
                const opener = document.activeElement as HTMLElement | null;
                if (!node.open) {
                    if (typeof node.showModal === "function") node.showModal();
                    else node.setAttribute("open", "");
                }
                if (!node.contains(document.activeElement)) node.focus();
                return () => {
                    if (node.open) {
                        if (typeof node.close === "function") node.close();
                        else node.removeAttribute("open");
                    }
                    if (opener && opener !== document.body && opener.isConnected) opener.focus();
                };
            }),
    );

    function dismiss() {
        setOpen(false);
        p.onOpenChange?.(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape" && !event.defaultPrevented) {
            event.preventDefault();
            dismiss();
        }
    }

    function handleCancel(event: Event) {
        event.preventDefault();
        dismiss();
    }

    return (
        <>
            {open() && (
                <dialog
                    ref={(el) => (ref.current = el)}
                    class={`slide-out-drawer ${p.class}`}
                    aria-label={p.label}
                    aria-modal="true"
                    tabindex={attr(-1)}
                    onKeyDown={handleKeyDown}
                    onCancel={handleCancel}
                    onClose={dismiss}
                    {...restProps}
                >
                    {p.children}
                </dialog>
            )}
        </>
    );
}
