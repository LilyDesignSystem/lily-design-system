import * as React from "react";
import { IconButton } from "@lilydesignsystem/react-headless";
// Only the trigger button composes a headless primitive. The list is real `<a>` navigation
// with a roving-focus pattern of its own — not an ARIA listbox or menu: role="menuitem" would
// strip middle-click, open-in-new-tab and copy-link-address from ordinary links. A disclosure
// of real links, like share-picker's. See spec/index.md §3.

/**
 * One destination in the list. The app defines them all: this package ships no routes and no
 * English — `label` is the consumer's text.
 */
export type LinkItem = {
    /** Stable identifier, passed back to `onNavigate`. Defaults to `href`. */
    id?: string;
    /** Visible link text. Consumer-supplied, so it localises. */
    label: string;
    /** Where the link goes: a route ("/about/") or a full URL. */
    href: string;
    /** Marks this link as the current page (`aria-current="page"`). */
    current?: boolean;
    /** Open in a new tab (`target="_blank"` with `rel="noopener noreferrer"`). */
    newTab?: boolean;
};

/** Arguments passed to a custom `children` render prop (the button icon). */
export type ChildArgs = {
    /** Is the list open? */
    open: boolean;
};

/** Public props for LinkPicker. See `spec/index.md` §4 for the contract. */
export type Props = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
    /** Accessible name for the button and the list. */
    label: string;
    /** The page links to offer. Defined by the app. */
    links: LinkItem[];
    /**
     * Client-side navigation hook, e.g. a router's `navigate`. When given, a plain left click on
     * a link calls `navigate(href)` instead of letting the browser load the page; modified
     * clicks (Ctrl/Cmd/Shift/Alt, middle button) and `newTab` links stay native.
     */
    navigate?: (href: string) => void;
    /** Replaces the default home icon inside the button. */
    children?: (args: ChildArgs) => React.ReactNode;
    /** Fires after a link is chosen, with its id and href. */
    onNavigate?: (id: string, href: string) => void;
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

/** The id a link reports: its explicit `id`, else its `href`. */
export function linkId(link: LinkItem): string {
    return link.id ?? link.href;
}

let uid = 0;
/**
 * Stable id prefix; SSR-safe (no Math.random / Date.now). The component itself mints ids with
 * React's `useId`, which is hydration-safe; this is exported for parity with the Svelte helper.
 */
export function nextLinkPickerId(): string {
    uid += 1;
    return `link-picker-${uid}`;
}

export function LinkPicker({
    className = "",
    label,
    links,
    navigate,
    children,
    onNavigate,
    ...restProps
}: Props): React.ReactElement {
    const baseId = `link-picker-${React.useId()}`;
    const listId = `${baseId}-list`;
    const tooltipId = `${baseId}-tooltip`;

    const [open, setOpen] = React.useState(false);

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    const listRef = React.useRef<HTMLUListElement | null>(null);

    // Which end of the list to focus once an open has been committed.
    const pendingFocusRef = React.useRef<"first" | "last" | null>(null);
    // Set when a close should hand focus back to the trigger.
    const refocusRef = React.useRef(false);

    /** Every focusable link in the list, in DOM order. */
    function items(): HTMLElement[] {
        const list = listRef.current;
        if (!list) return [];
        return Array.from(list.querySelectorAll<HTMLElement>(".link-picker-link"));
    }

    function openList(focusLast = false): void {
        pendingFocusRef.current = focusLast ? "last" : "first";
        setOpen(true);
    }

    function closeList(refocus = true): void {
        setOpen(false);
        pendingFocusRef.current = null;
        // Focus moves in the effect below, after the commit.
        if (refocus) refocusRef.current = true;
    }

    function onButtonClick(): void {
        if (open) closeList();
        else openList();
    }

    function onButtonKeyDown(event: React.KeyboardEvent<HTMLButtonElement>): void {
        // Enter and Space already produce a click; only the arrows need handling here.
        if (event.key === "ArrowDown") {
            event.preventDefault();
            if (!open) openList();
            else items()[0]?.focus({ preventScroll: true });
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) openList(true);
            else {
                const all = items();
                all[all.length - 1]?.focus({ preventScroll: true });
            }
        }
    }

    function moveFocus(delta: number): void {
        const all = items();
        if (all.length === 0) return;
        const i = all.indexOf(document.activeElement as HTMLElement);
        const next = Math.min(Math.max((i < 0 ? 0 : i) + delta, 0), all.length - 1);
        all[next]?.focus({ preventScroll: true });
    }

    function onListKeyDown(event: React.KeyboardEvent<HTMLUListElement>): void {
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                moveFocus(1);
                break;
            case "ArrowUp":
                event.preventDefault();
                moveFocus(-1);
                break;
            case "Home":
                event.preventDefault();
                items()[0]?.focus({ preventScroll: true });
                break;
            case "End": {
                event.preventDefault();
                const all = items();
                all[all.length - 1]?.focus({ preventScroll: true });
                break;
            }
            case "Escape":
                event.preventDefault();
                closeList();
                break;
            case "Tab":
                // Focus goes to the button FIRST, without cancelling the key: hiding the list
                // while a link has focus drops focus to <body>, and the default Tab would
                // restart from the top of the document.
                buttonRef.current?.focus?.({ preventScroll: true });
                closeList(false);
                break;
        }
    }

    /** React's `onBlur` is the delegated `focusout`: it bubbles from any descendant. */
    function onRootBlur(event: React.FocusEvent<HTMLDivElement>): void {
        const next = event.relatedTarget as Node | null;
        if (next && rootRef.current?.contains(next)) return;
        closeList(false);
    }

    function onLinkClick(event: React.MouseEvent<HTMLAnchorElement>, link: LinkItem): void {
        onNavigate?.(linkId(link), link.href);
        const modified =
            event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0;
        if (navigate && !link.newTab && !modified && !event.defaultPrevented) {
            event.preventDefault();
            navigate(link.href);
        }
        closeList();
    }

    // Move focus into the list on open, back to the trigger on close.
    React.useEffect(() => {
        if (open) {
            const wanted = pendingFocusRef.current;
            pendingFocusRef.current = null;
            if (wanted) {
                const all = items();
                (wanted === "last" ? all[all.length - 1] : all[0])?.focus({ preventScroll: true });
            }
        } else if (refocusRef.current) {
            refocusRef.current = false;
            buttonRef.current?.focus({ preventScroll: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // Clicking outside the root closes the list.
    React.useEffect(() => {
        if (!open) return;
        function onDocumentClick(event: MouseEvent) {
            const t = event.target as Node | null;
            if (t && rootRef.current && !rootRef.current.contains(t)) closeList(false);
        }
        document.addEventListener("click", onDocumentClick);
        return () => document.removeEventListener("click", onDocumentClick);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const tip = usePickerTooltip(buttonRef, open);

    return (
        <div
            ref={rootRef}
            className={`link-picker ${className}`.trim()}
            onBlur={onRootBlur}
            {...restProps}
        >
            <IconButton
                ref={buttonRef}
                {...tip.buttonProps}
                baseClass="link-picker-button"
                label={label}
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => {
                    tip.onButtonClick();
                    onButtonClick();
                }}
                onKeyDown={(event) => {
                    tip.onButtonKeyDown(event);
                    onButtonKeyDown(event);
                }}
            >
                {children ? (
                    children({ open })
                ) : (
                    <svg
                        className="link-picker-icon"
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
                        <path d="M2 7.5 8 2.5l6 5" />
                        <path d="M3.5 6.5v7h9v-7" />
                        <path d="M6.5 13.5V10h3v3.5" />
                    </svg>
                )}
            </IconButton>
            {/* Purely visual: the same text is already the button's aria-label, so it is not
                wired with aria-describedby. */}
            <div
                className="link-picker-tooltip"
                role="tooltip"
                id={tooltipId}
                hidden={!tip.visible}
                {...tip.tooltipProps}
            >
                {label}
            </div>

            {/* Named like the sibling pickers' popups: a screen reader entering the list hears
                what it is for. */}
            <ul
                ref={listRef}
                className="link-picker-list"
                id={listId}
                aria-label={label}
                hidden={!open}
                onKeyDown={onListKeyDown}
            >
                {links.map((link) => (
                    <li className="link-picker-list-item" key={linkId(link)}>
                        {/* A real link, not role="menuitem": these ARE navigation. */}
                        <a
                            className="link-picker-link"
                            data-link-id={linkId(link)}
                            href={link.href}
                            aria-current={link.current ? "page" : undefined}
                            target={link.newTab ? "_blank" : undefined}
                            rel={link.newTab ? "noopener noreferrer" : undefined}
                            onClick={(event) => onLinkClick(event, link)}
                        >
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LinkPicker;
