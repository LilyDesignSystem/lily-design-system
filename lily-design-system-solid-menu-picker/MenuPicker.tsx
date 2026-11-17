import { IconButton } from "@lilydesignsystem/solid-headless";
import type { JSX } from "@solidjs/web";
import { createEffect, createSignal, createUniqueId, omit, untrack } from "solid-js";
// Only the trigger button composes a headless primitive. The panel is a disclosure of whatever
// the app puts in it — links, buttons, forms — so it carries no ARIA menu roles (role="menu"
// would promise a roving-focus menuitem widget that arbitrary content is not). See spec/index.md §3.

/** Arguments passed to the `children` (panel content) and `icon` render props. */
export type ChildArgs = {
    /** Is the panel open? */
    open: boolean;
    /** Close the panel and return focus to the button. */
    close: () => void;
};

/** Public props for MenuPicker. See `spec/index.md` §4 for the contract. */
export type Props = Omit<JSX.HTMLAttributes<HTMLDivElement>, "children"> & {
    /** Accessible name for the button, the panel and the tooltip. */
    label: string;
    /** Controlled open state. Omit for an uncontrolled picker. */
    open?: boolean;
    /** Initial open state of an uncontrolled picker. Default `false`. */
    defaultOpen?: boolean;
    /**
     * Close the panel when a link, button or `[role="menuitem"]` inside it is activated. Add
     * `data-menu-picker-keep-open` to an element (or an ancestor) to opt it out. Default `true`.
     */
    closeOnSelect?: boolean;
    /** Fires whenever the open state changes. */
    onOpenChange?: (open: boolean) => void;
    /** The panel's content: whatever the app provides. */
    children?: JSX.Element | ((args: ChildArgs) => JSX.Element);
    /** Replaces the default hamburger icon inside the button. */
    icon?: (args: ChildArgs) => JSX.Element;
    /** Extra CSS class on the root. */
    class?: string;
};

/**
 * Tooltip state for the icon button. Shown while the pointer is over the
 * button or over the tooltip itself (hoverable, WCAG 1.4.13) or while the
 * button has keyboard focus; Escape dismisses it without moving focus;
 * never shown while the popup is open, since the popup then explains the
 * control. Purely visual: the text is the button's own aria-label, so it
 * is deliberately not linked with aria-describedby.
 */
export function createPickerTooltip(
    button: () => HTMLButtonElement | undefined,
    open: () => boolean,
) {
    const [hoverButton, setHoverButton] = createSignal(false);
    const [hoverTooltip, setHoverTooltip] = createSignal(false);
    const [focusButton, setFocusButton] = createSignal(false);
    const [dismissed, setDismissed] = createSignal(false);
    const visible = () =>
        !open() && !dismissed() && (hoverButton() || hoverTooltip() || focusButton());
    // WCAG 1.4.13 "dismissable": Escape must work wherever focus is while
    // the tooltip is visible (pointer hover alone leaves focus elsewhere).
    // The document listener exists only while visible; never prevents
    // default, stops propagation, or moves focus.
    createEffect(visible, (isVisible) => {
        if (!isVisible) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setDismissed(true);
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    });
    return {
        visible,
        buttonProps: {
            onMouseEnter: () => {
                setHoverButton(true);
                setDismissed(false);
            },
            onMouseLeave: () => setHoverButton(false),
            onFocus: () => {
                // Keyboard focus only: a mouse click also focuses the
                // button in Chromium, and the tooltip should not stick.
                try {
                    setFocusButton(button()?.matches(":focus-visible") ?? false);
                } catch {
                    setFocusButton(true); // no :focus-visible — err towards showing
                }
            },
            onBlur: () => {
                setFocusButton(false);
                setDismissed(false);
            },
        },
        /** Call from the button's click handler. */
        onButtonClick: () => setHoverButton(false),
        /** Call first in the button's keydown handler; never prevents default. */
        onButtonKeyDown: (event: KeyboardEvent) => {
            if (event.key === "Escape" && untrack(visible)) setDismissed(true);
        },
        tooltipProps: {
            onMouseEnter: () => setHoverTooltip(true),
            onMouseLeave: () => setHoverTooltip(false),
        },
    };
}

let uid = 0;
/**
 * Stable id prefix; SSR-safe (no Math.random / Date.now). The component itself mints ids with
 * Solid's `createUniqueId`, which is hydration-safe; this is exported for parity with the Svelte helper.
 */
export function nextMenuPickerId(): string {
    uid += 1;
    return `menu-picker-${uid}`;
}

/** The selector for focusable things inside the panel. */
export const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MenuPicker(props: Props): JSX.Element {
    const rest = omit(
        props,
        "class",
        "label",
        "open",
        "defaultOpen",
        "closeOnSelect",
        "onOpenChange",
        "children",
        "icon",
    );
    const baseId = `menu-picker-${createUniqueId()}`;
    const panelId = `${baseId}-panel`;
    const tooltipId = `${baseId}-tooltip`;

    const controlled = () => props.open !== undefined;
    const [openState, setOpenState] = createSignal(untrack(() => props.defaultOpen ?? false));
    const open = () => (controlled() ? (props.open as boolean) : openState());

    let root: HTMLDivElement | undefined;
    let button: HTMLButtonElement | undefined;
    let panel: HTMLDivElement | undefined;

    // Which end of the panel to focus once an open has been committed.
    let pendingFocus: "first" | "last" | null = null;
    // Set when a close should hand focus back to the trigger.
    let refocus = false;

    function setOpen(next: boolean): void {
        if (untrack(open) === next) return;
        if (!untrack(controlled)) setOpenState(next);
        props.onOpenChange?.(next);
    }

    function focusables(): HTMLElement[] {
        return panel ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];
    }

    function openPanel(focus: "none" | "first" | "last" = "none"): void {
        pendingFocus = focus === "none" ? null : focus;
        setOpen(true);
    }

    function closePanel(refocusButton = true): void {
        if (!untrack(open)) return;
        pendingFocus = null;
        // Focus moves in the effect below, once the panel is hidden.
        if (refocusButton) refocus = true;
        setOpen(false);
    }

    function onButtonClick(): void {
        if (untrack(open)) closePanel();
        else openPanel();
    }

    function onButtonKeyDown(event: KeyboardEvent): void {
        if (event.key === "Escape" && untrack(open)) {
            event.preventDefault();
            closePanel();
        } else if (event.key === "ArrowDown") {
            // Enter and Space already produce a click; the arrows open and move into the panel.
            event.preventDefault();
            if (!untrack(open)) openPanel("first");
            else focusables()[0]?.focus({ preventScroll: true });
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (!untrack(open)) openPanel("last");
            else {
                const all = focusables();
                all[all.length - 1]?.focus({ preventScroll: true });
            }
        }
    }

    function onPanelKeyDown(event: KeyboardEvent): void {
        if (event.key === "Escape") {
            event.preventDefault();
            closePanel();
        } else if (event.key === "Tab") {
            // Focus goes to the button FIRST, without cancelling the key, so the browser
            // continues from the picker's position rather than from <body>.
            button?.focus?.({ preventScroll: true });
            closePanel(false);
        }
    }

    /** focusout bubbles from any descendant, so the root hears every blur inside it. */
    function onRootFocusOut(event: FocusEvent): void {
        const next = event.relatedTarget as Node | null;
        if (next && root?.contains(next)) return;
        closePanel(false);
    }

    function onPanelClick(event: MouseEvent): void {
        if (props.closeOnSelect === false) return;
        const target = event.target as Element | null;
        const hit = target?.closest?.('a[href], button, [role="menuitem"]');
        if (!hit || !panel?.contains(hit)) return;
        if (hit.closest("[data-menu-picker-keep-open]")) return;
        closePanel();
    }

    // Move focus into the panel on a keyboard open, back to the trigger on close.
    createEffect(open, (isOpen) => {
        if (isOpen) {
            const wanted = pendingFocus;
            pendingFocus = null;
            if (wanted) {
                const all = focusables();
                (wanted === "last" ? all[all.length - 1] : all[0])?.focus({ preventScroll: true });
            }
        } else if (refocus) {
            refocus = false;
            button?.focus({ preventScroll: true });
        }
    });

    // Clicking outside the root closes the panel.
    createEffect(open, (isOpen) => {
        if (!isOpen) return;
        function onDocumentClick(event: MouseEvent) {
            const t = event.target as Node | null;
            if (t && root && !root.contains(t)) closePanel(false);
        }
        document.addEventListener("click", onDocumentClick);
        return () => document.removeEventListener("click", onDocumentClick);
    });

    const tip = createPickerTooltip(() => button, open);
    const api: ChildArgs = {
        get open() {
            return open();
        },
        close: () => closePanel(),
    };

    return (
        <div
            ref={(el) => (root = el)}
            class={`menu-picker ${props.class ?? ""}`.trim()}
            onFocusOut={onRootFocusOut}
            {...rest}
        >
            <IconButton
                ref={(el: HTMLButtonElement) => (button = el)}
                {...tip.buttonProps}
                baseClass="menu-picker-button"
                label={props.label}
                aria-expanded={open() ? "true" : "false"}
                aria-controls={panelId}
                onClick={() => {
                    tip.onButtonClick();
                    onButtonClick();
                }}
                onKeyDown={(event: KeyboardEvent) => {
                    tip.onButtonKeyDown(event);
                    onButtonKeyDown(event);
                }}
            >
                {props.icon ? (
                    props.icon(api)
                ) : (
                    <svg
                        class="menu-picker-icon"
                        viewBox="0 0 16 16"
                        width="1.05rem"
                        height="1.05rem"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M1.5 3.5h13M1.5 8h13M1.5 12.5h13" />
                    </svg>
                )}
            </IconButton>
            {/* Purely visual: the same text is already the button's aria-label, so it is not
                wired with aria-describedby. */}
            <div
                class="menu-picker-tooltip"
                role="tooltip"
                id={tooltipId}
                hidden={!tip.visible()}
                {...tip.tooltipProps}
            >
                {props.label}
            </div>

            {/* A named group, not a menu: the content is the app's. The handlers are pure
                delegation for whatever focusable content the app puts inside. */}
            <div
                ref={(el) => (panel = el)}
                class="menu-picker-panel"
                id={panelId}
                role="group"
                aria-label={props.label}
                hidden={!open()}
                onKeyDown={onPanelKeyDown}
                onClick={onPanelClick}
            >
                {typeof props.children === "function" ? props.children(api) : props.children}
            </div>
        </div>
    );
}

export default MenuPicker;
