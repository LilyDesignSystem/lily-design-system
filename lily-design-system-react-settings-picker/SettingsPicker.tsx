import * as React from "react";
import { IconButton } from "@lilydesignsystem/react-headless";
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

/** Public props for SettingsPicker. See `spec/index.md` §4 for the contract. */
export type Props = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
    /** Accessible name for the button, the panel and the tooltip. */
    label: string;
    /** Controlled open state. Omit for an uncontrolled picker. */
    open?: boolean;
    /** Initial open state of an uncontrolled picker. Default `false`. */
    defaultOpen?: boolean;
    /**
     * Close the panel when a link, button or `[role="menuitem"]` inside it is activated. Add
     * `data-settings-picker-keep-open` to an element (or an ancestor) to opt it out. Default `true`.
     */
    closeOnSelect?: boolean;
    /** Fires whenever the open state changes. */
    onOpenChange?: (open: boolean) => void;
    /** The panel's content: whatever the app provides. */
    children?: React.ReactNode | ((args: ChildArgs) => React.ReactNode);
    /** Replaces the default cog icon inside the button. */
    icon?: (args: ChildArgs) => React.ReactNode;
    /** Extra CSS class on the root. */
    className?: string;
};

/**
 * Tooltip state for the icon button. Shown while the pointer is over the
 * button or over the tooltip itself (hoverable, WCAG 1.4.13) or while the
 * button has keyboard focus; Escape dismisses it without moving focus;
 * never shown while the popup is open, since the popup then explains the
 * control. Purely visual: the text is the button's own aria-label, so it
 * is deliberately not linked with aria-describedby.
 */
function usePickerTooltip(
    buttonRef: React.RefObject<HTMLButtonElement | null>,
    open: boolean,
) {
    const [hoverButton, setHoverButton] = React.useState(false);
    const [hoverTooltip, setHoverTooltip] = React.useState(false);
    const [focusButton, setFocusButton] = React.useState(false);
    const [dismissed, setDismissed] = React.useState(false);
    const visible = !open && !dismissed && (hoverButton || hoverTooltip || focusButton);
    // WCAG 1.4.13 "dismissable": Escape must work wherever focus is while
    // the tooltip is visible (pointer hover alone leaves focus elsewhere).
    // The document listener exists only while visible; never prevents
    // default, stops propagation, or moves focus.
    React.useEffect(() => {
        if (!visible) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setDismissed(true);
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [visible]);
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
                    setFocusButton(buttonRef.current?.matches(":focus-visible") ?? false);
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
        onButtonKeyDown: (event: React.KeyboardEvent) => {
            if (event.key === "Escape" && visible) setDismissed(true);
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
 * React's `useId`, which is hydration-safe; this is exported for parity with the Svelte helper.
 */
export function nextSettingsPickerId(): string {
    uid += 1;
    return `settings-picker-${uid}`;
}

/** The selector for focusable things inside the panel. */
export const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function SettingsPicker({
    className = "",
    label,
    open: openProp,
    defaultOpen = false,
    closeOnSelect = true,
    onOpenChange,
    children,
    icon,
    ...restProps
}: Props): React.ReactElement {
    const baseId = `settings-picker-${React.useId()}`;
    const panelId = `${baseId}-panel`;
    const tooltipId = `${baseId}-tooltip`;

    const controlled = openProp !== undefined;
    const [openState, setOpenState] = React.useState(defaultOpen);
    const open = controlled ? (openProp as boolean) : openState;

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    const panelRef = React.useRef<HTMLDivElement | null>(null);

    // Which end of the panel to focus once an open has been committed.
    const pendingFocusRef = React.useRef<"first" | "last" | null>(null);
    // Set when a close should hand focus back to the trigger.
    const refocusRef = React.useRef(false);
    const openRef = React.useRef(open);
    openRef.current = open;

    function setOpen(next: boolean): void {
        if (openRef.current === next) return;
        openRef.current = next;
        if (!controlled) setOpenState(next);
        onOpenChange?.(next);
    }

    function focusables(): HTMLElement[] {
        const panel = panelRef.current;
        return panel ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];
    }

    function openPanel(focus: "none" | "first" | "last" = "none"): void {
        pendingFocusRef.current = focus === "none" ? null : focus;
        setOpen(true);
    }

    function closePanel(refocus = true): void {
        if (!openRef.current) return;
        setOpen(false);
        pendingFocusRef.current = null;
        // Focus moves in the effect below, after the commit.
        if (refocus) refocusRef.current = true;
    }

    function onButtonClick(): void {
        if (openRef.current) closePanel();
        else openPanel();
    }

    function onButtonKeyDown(event: React.KeyboardEvent<HTMLButtonElement>): void {
        if (event.key === "Escape" && openRef.current) {
            event.preventDefault();
            closePanel();
        } else if (event.key === "ArrowDown") {
            // Enter and Space already produce a click; the arrows open and move into the panel.
            event.preventDefault();
            if (!openRef.current) openPanel("first");
            else focusables()[0]?.focus({ preventScroll: true });
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (!openRef.current) openPanel("last");
            else {
                const all = focusables();
                all[all.length - 1]?.focus({ preventScroll: true });
            }
        }
    }

    function onPanelKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
        if (event.key === "Escape") {
            event.preventDefault();
            closePanel();
        } else if (event.key === "Tab") {
            // Focus goes to the button FIRST, without cancelling the key, so the browser
            // continues from the picker's position rather than from <body>.
            buttonRef.current?.focus?.({ preventScroll: true });
            closePanel(false);
        }
    }

    /** React's `onBlur` is the delegated `focusout`: it bubbles from any descendant. */
    function onRootBlur(event: React.FocusEvent<HTMLDivElement>): void {
        const next = event.relatedTarget as Node | null;
        if (next && rootRef.current?.contains(next)) return;
        closePanel(false);
    }

    function onPanelClick(event: React.MouseEvent<HTMLDivElement>): void {
        if (!closeOnSelect) return;
        const target = event.target as Element | null;
        const hit = target?.closest?.('a[href], button, [role="menuitem"]');
        if (!hit || !panelRef.current?.contains(hit)) return;
        if (hit.closest("[data-settings-picker-keep-open]")) return;
        closePanel();
    }

    // Move focus into the panel on a keyboard open, back to the trigger on close.
    React.useEffect(() => {
        if (open) {
            const wanted = pendingFocusRef.current;
            pendingFocusRef.current = null;
            if (wanted) {
                const all = focusables();
                (wanted === "last" ? all[all.length - 1] : all[0])?.focus({ preventScroll: true });
            }
        } else if (refocusRef.current) {
            refocusRef.current = false;
            buttonRef.current?.focus({ preventScroll: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // Clicking outside the root closes the panel.
    React.useEffect(() => {
        if (!open) return;
        function onDocumentClick(event: MouseEvent) {
            const t = event.target as Node | null;
            if (t && rootRef.current && !rootRef.current.contains(t)) closePanel(false);
        }
        document.addEventListener("click", onDocumentClick);
        return () => document.removeEventListener("click", onDocumentClick);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const tip = usePickerTooltip(buttonRef, open);
    const api: ChildArgs = { open, close: () => closePanel() };

    return (
        <div
            ref={rootRef}
            className={`settings-picker ${className}`.trim()}
            onBlur={onRootBlur}
            {...restProps}
        >
            <IconButton
                ref={buttonRef}
                {...tip.buttonProps}
                baseClass="settings-picker-button"
                label={label}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => {
                    tip.onButtonClick();
                    onButtonClick();
                }}
                onKeyDown={(event) => {
                    tip.onButtonKeyDown(event);
                    onButtonKeyDown(event);
                }}
            >
                {icon ? (
                    icon(api)
                ) : (
                    <svg
                        className="settings-picker-icon"
                        viewBox="0 0 16 16"
                        width="1.05rem"
                        height="1.05rem"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M6.7 3.3L7.0 1.4L9.0 1.4L9.3 3.3L10.5 3.8L11.9 2.6L13.4 4.1L12.2 5.6L12.7 6.7L14.6 7.0L14.6 9.0L12.7 9.3L12.2 10.4L13.4 11.9L11.9 13.4L10.5 12.2L9.3 12.7L9.0 14.6L7.0 14.6L6.7 12.7L5.6 12.2L4.1 13.4L2.6 11.9L3.8 10.4L3.3 9.3L1.4 9.0L1.4 7.0L3.3 6.7L3.8 5.5L2.6 4.1L4.1 2.6L5.5 3.8Z" /><circle cx="8" cy="8" r="2.2" />
                    </svg>
                )}
            </IconButton>
            {/* Purely visual: the same text is already the button's aria-label, so it is not
                wired with aria-describedby. */}
            <div
                className="settings-picker-tooltip"
                role="tooltip"
                id={tooltipId}
                hidden={!tip.visible}
                {...tip.tooltipProps}
            >
                {label}
            </div>

            {/* A named group, not a menu: the content is the app's. The handlers are pure
                delegation for whatever focusable content the app puts inside. */}
            <div
                ref={panelRef}
                className="settings-picker-panel"
                id={panelId}
                role="group"
                aria-label={label}
                hidden={!open}
                onKeyDown={onPanelKeyDown}
                onClick={onPanelClick}
            >
                {typeof children === "function" ? children(api) : children}
            </div>
        </div>
    );
}

export default SettingsPicker;
