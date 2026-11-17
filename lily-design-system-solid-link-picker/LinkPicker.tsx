import { IconButton } from "@lilydesignsystem/solid-headless";
import type { JSX } from "@solidjs/web";
import { createEffect, createSignal, createUniqueId, For, omit, untrack } from "solid-js";
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
export type Props = Omit<JSX.HTMLAttributes<HTMLDivElement>, "children"> & {
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
    children?: (args: ChildArgs) => JSX.Element;
    /** Fires after a link is chosen, with its id and href. */
    onNavigate?: (id: string, href: string) => void;
    /** Is the popup open? Controlled when given; the popup starts as `defaultOpen` otherwise. */
    open?: boolean;
    /** Initial open state of an uncontrolled picker. */
    defaultOpen?: boolean;
    /** Called with the new open state whenever the user (or `disabled`) changes it. In controlled mode the parent applies it. */
    onOpenChange?: (open: boolean) => void;
    /** Disables the button; an open popup closes. */
    disabled?: boolean;
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

/** The id a link reports: its explicit `id`, else its `href`. */
export function linkId(link: LinkItem): string {
    return link.id ?? link.href;
}

let uid = 0;
/**
 * Stable id prefix; SSR-safe (no Math.random / Date.now). The component itself mints ids with
 * Solid's `createUniqueId`, which is hydration-safe; this is exported for parity with the Svelte helper.
 */
export function nextLinkPickerId(): string {
    uid += 1;
    return `link-picker-${uid}`;
}

export function LinkPicker(props: Props): JSX.Element {
    const rest = omit(
        props,
        "class",
        "label",
        "links",
        "navigate",
        "children",
        "onNavigate",
        "open",
        "defaultOpen",
        "onOpenChange",
        "disabled",
    );
    const baseId = `link-picker-${createUniqueId()}`;
    const listId = `${baseId}-list`;
    const tooltipId = `${baseId}-tooltip`;

    // `open` is controlled when the prop is given. `onOpenChange` is called once for each change the
    // component makes (the user's, or `disabled` closing it); mounting open is not a change.
    const [openInner, setOpenInner] = createSignal(untrack(() => props.defaultOpen ?? false));
    const openRaw = () => props.open ?? openInner();
    const open = () => openRaw() && !props.disabled;
    function setOpen(next: boolean): void {
        if (next === untrack(open)) return;
        if (props.open === undefined) setOpenInner(next);
        props.onOpenChange?.(next);
    }
    createEffect(
        () => [props.disabled, openRaw()] as const,
        ([disabled, raw]) => {
            if (disabled && raw) {
                if (props.open === undefined) setOpenInner(false);
                props.onOpenChange?.(false);
            }
        },
    );

    let root: HTMLDivElement | undefined;
    let button: HTMLButtonElement | undefined;
    let list: HTMLUListElement | undefined;

    // Which end of the list to focus once an open has been committed.
    let pendingFocus: "first" | "last" | null = null;
    // Set when a close should hand focus back to the trigger.
    let refocus = false;

    /** Every focusable link in the list, in DOM order. */
    function items(): HTMLElement[] {
        if (!list) return [];
        return Array.from(list.querySelectorAll<HTMLElement>(".link-picker-link"));
    }

    function openList(focusLast = false): void {
        pendingFocus = focusLast ? "last" : "first";
        setOpen(true);
    }

    function closeList(refocusButton = true): void {
        pendingFocus = null;
        // Focus moves in the effect below, once the list is hidden.
        if (refocusButton && untrack(open)) refocus = true;
        setOpen(false);
    }

    function onButtonClick(): void {
        if (untrack(open)) closeList();
        else openList();
    }

    function onButtonKeyDown(event: KeyboardEvent): void {
        // Enter and Space already produce a click; only the arrows need handling here.
        if (event.key === "ArrowDown") {
            event.preventDefault();
            if (!untrack(open)) openList();
            else items()[0]?.focus({ preventScroll: true });
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (!untrack(open)) openList(true);
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

    function onListKeyDown(event: KeyboardEvent): void {
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
                button?.focus?.({ preventScroll: true });
                closeList(false);
                break;
        }
    }

    /** focusout bubbles from any descendant, so the root hears every blur inside it. */
    function onRootFocusOut(event: FocusEvent): void {
        const next = event.relatedTarget as Node | null;
        if (next && root?.contains(next)) return;
        closeList(false);
    }

    function onLinkClick(event: MouseEvent, link: LinkItem): void {
        props.onNavigate?.(linkId(link), link.href);
        const modified =
            event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0;
        if (props.navigate && !link.newTab && !modified && !event.defaultPrevented) {
            event.preventDefault();
            props.navigate(link.href);
        }
        closeList();
    }

    // Move focus into the list on open, back to the trigger on close.
    createEffect(open, (isOpen) => {
        if (isOpen) {
            const wanted = pendingFocus;
            pendingFocus = null;
            if (wanted) {
                const all = items();
                (wanted === "last" ? all[all.length - 1] : all[0])?.focus({ preventScroll: true });
            }
        } else if (refocus) {
            refocus = false;
            button?.focus({ preventScroll: true });
        }
    });

    // Clicking outside the root closes the list.
    createEffect(open, (isOpen) => {
        if (!isOpen) return;
        function onDocumentClick(event: MouseEvent) {
            const t = event.target as Node | null;
            if (t && root && !root.contains(t)) closeList(false);
        }
        document.addEventListener("click", onDocumentClick);
        return () => document.removeEventListener("click", onDocumentClick);
    });

    const tip = createPickerTooltip(() => button, open);

    return (
        <div
            ref={(el) => (root = el)}
            class={`link-picker ${props.class ?? ""}`.trim()}
            onFocusOut={onRootFocusOut}
            {...rest}
        >
            <IconButton
                disabled={props.disabled ?? false}
                ref={(el: HTMLButtonElement) => (button = el)}
                {...tip.buttonProps}
                baseClass="link-picker-button"
                label={props.label}
                aria-expanded={open() ? "true" : "false"}
                aria-controls={listId}
                onClick={() => {
                    tip.onButtonClick();
                    onButtonClick();
                }}
                onKeyDown={(event: KeyboardEvent) => {
                    tip.onButtonKeyDown(event);
                    onButtonKeyDown(event);
                }}
            >
                {props.children ? (
                    props.children({
                        get open() {
                            return open();
                        },
                    })
                ) : (
                    <svg
                        class="link-picker-icon"
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
                        <path d="M1 8 8 1.5l7 6.5" />
                        <path d="M2.5 7v7.5h11V7" />
                        <path d="M6.5 14.5v-4h3v4" />
                    </svg>
                )}
            </IconButton>
            {/* Purely visual: the same text is already the button's aria-label, so it is not
                wired with aria-describedby. */}
            <div
                class="link-picker-tooltip"
                role="tooltip"
                id={tooltipId}
                hidden={!tip.visible()}
                {...tip.tooltipProps}
            >
                {props.label}
            </div>

            {/* Named like the sibling pickers' popups: a screen reader entering the list hears
                what it is for. */}
            <ul
                ref={(el) => (list = el)}
                class="link-picker-list"
                id={listId}
                aria-label={props.label}
                hidden={!open()}
                onKeyDown={onListKeyDown}
            >
                <For
                    each={props.links}
                    keyed={linkId}
                >
                    {(link) => (
                        <li class="link-picker-list-item">
                            {/* A real link, not role="menuitem": these ARE navigation. */}
                            <a
                                class="link-picker-link"
                                data-link-id={linkId(link())}
                                href={link().href}
                                aria-current={link().current ? "page" : undefined}
                                target={link().newTab ? "_blank" : undefined}
                                rel={link().newTab ? "noopener noreferrer" : undefined}
                                onClick={(event) => onLinkClick(event, link())}
                            >
                                {link().label}
                            </a>
                        </li>
                    )}
                </For>
            </ul>
        </div>
    );
}

export default LinkPicker;
