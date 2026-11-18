import { IconButton } from "@lilydesignsystem/solid-headless";
import type { JSX } from "@solidjs/web";
import { createEffect, createSignal, createUniqueId, For, omit, untrack } from "solid-js";
// Only the trigger button composes a headless primitive. The list
// below is real `<a>`/`<button>` navigation with a roving-focus
// pattern of its own — not an ARIA listbox (no role="listbox"), so
// headless `Listbox` (which always renders role="listbox" over
// role="option" children) is the wrong widget for it, not merely an
// unmigrated one.

/**
 * Default button icon: a bundled SVG (outline right arrow), not a
 * Unicode character. Reversed 2026-09-16 from the font-dependent-glyph
 * convention (was U+27A4 BLACK RIGHTWARDS ARROWHEAD, exported as
 * `BLACK_RIGHTWARDS_ARROWHEAD` — removed, not renamed). Maintainer-
 * directed, following the outline-arrow icon already used at
 * https://testingexamples.github.io/. A bundled SVG renders identically
 * across every font stack; the other four picker icons moved to the
 * same bundled-SVG convention the same day.
 */

/**
 * One destination in the share list.
 *
 * `href` is a function, not a string, so the consumer owns the whole URL
 * — this package ships no third-party endpoints and takes no view on
 * which networks exist. See `spec/index.md` §3.
 */
export type ShareTarget = {
    /** Stable identifier, passed back to `onShare`. */
    id: string;
    /** Visible link text. Consumer-supplied, so it localises. */
    label: string;
    /** Build the destination URL from the shared page's metadata. */
    href: (url: string, title: string, text: string) => string;
    /** Overrides the default `target="_blank"` for this destination. */
    newTab?: boolean;
};

/** Arguments passed to a custom `children` render prop (the button glyph). */
export type ChildArgs = {
    /** Is the list open? */
    open: boolean;
    /** The URL that would be shared right now. */
    url: string;
};

/** How the button behaves when activated. */
export type ShareStrategy = "auto" | "native" | "list";

/** Public props for SharePicker. See `spec/index.md` §4 for the contract. */
export type Props = Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "title" | "onCopy"> & {
    /** Accessible name for the button and the list. */
    label: string;
    /** Destinations to offer. Empty is valid if `copyLabel` is set. */
    targets?: ShareTarget[];
    /** URL to share. Defaults to the current page URL, read at share time. */
    url?: string;
    /** Title passed to `href(...)` and to the native share sheet. */
    title?: string;
    /** Longer text passed to `href(...)` and to the native share sheet. */
    text?: string;
    /**
     * Label for the built-in copy-to-clipboard item. The item renders
     * only when this is supplied — there is no default, because a
     * default would be a hardcoded English string.
     */
    copyLabel?: string;
    /** Announced in the status region after a successful copy. */
    copiedLabel?: string;
    /** Announced in the status region when the clipboard write fails. */
    copyFailedLabel?: string;
    /**
     * `"auto"` (default) uses the native share sheet when the browser
     * provides one and falls back to the list; `"native"` always tries
     * the sheet; `"list"` always shows the list.
     */
    strategy?: ShareStrategy;
    /** Replaces the default arrow icon inside the button. */
    children?: (args: ChildArgs) => JSX.Element;
    /** Fires after a destination is chosen, with its `id`. */
    onShare?: (targetId: string, url: string) => void;
    /** Fires after the URL is copied. */
    onCopy?: (url: string) => void;
    /** Fires when the native share sheet is used, instead of the list. */
    onNativeShare?: (url: string) => void;
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

/** Is a native share sheet available? SSR-safe. */
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

/** Is a native share sheet available? SSR-safe. */
export function canShareNatively(): boolean {
    return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

/** Is an async clipboard available? SSR-safe. */
export function canCopy(): boolean {
    return typeof navigator !== "undefined" && typeof navigator.clipboard?.writeText === "function";
}

let uid = 0;
/**
 * Stable id prefix; SSR-safe (no Math.random / Date.now).
 *
 * The component itself mints ids with Solid's `createUniqueId`, which is
 * hydration-safe in a way a module counter cannot be. This function is
 * exported for parity with the canonical Svelte helper and for consumers
 * who need to label a control from outside the component tree.
 */
export function nextSharePickerId(): string {
    uid += 1;
    return `share-picker-${uid}`;
}

export function SharePicker(props: Props): JSX.Element {
    const rest = omit(
        props,
        "class",
        "label",
        "targets",
        "url",
        "title",
        "text",
        "copyLabel",
        "copiedLabel",
        "copyFailedLabel",
        "strategy",
        "children",
        "onShare",
        "onCopy",
        "onNativeShare",
        "open",
        "defaultOpen",
        "onOpenChange",
        "disabled",
    );
    // `createUniqueId` is stable across server and client render, so the list id survives hydration.
    const baseId = `share-picker-${createUniqueId()}`;
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
    const [status, setStatus] = createSignal("");

    let root: HTMLDivElement | undefined;
    let button: HTMLButtonElement | undefined;
    let list: HTMLUListElement | undefined;

    // Which end of the list to focus once an open has been committed.
    let pendingFocus: "first" | "last" | null = null;
    // Set when a close should hand focus back to the trigger.
    let refocus = false;

    /**
     * The URL to share. Resolved lazily so the default works without the consumer threading `location.href` through,
     * and so SSR never touches `location`.
     */
    function currentUrl(): string {
        if (props.url) return props.url;
        return typeof location !== "undefined" ? location.href : "";
    }

    /** Every focusable item in the list, in DOM order. */
    function items(): HTMLElement[] {
        if (!list) return [];
        return Array.from(
            list.querySelectorAll<HTMLElement>(".share-picker-target, .share-picker-copy"),
        );
    }

    function openList(focusLast = false): void {
        pendingFocus = focusLast ? "last" : "first";
        setStatus("");
        setOpen(true);
    }

    function closeList(refocusButton = true): void {
        pendingFocus = null;
        // Focus moves in the effect below, once the list is hidden.
        if (refocusButton && untrack(open)) refocus = true;
        setOpen(false);
    }

    async function shareNatively(): Promise<boolean> {
        if (!canShareNatively()) return false;
        const shareUrl = currentUrl();
        try {
            await navigator.share({
                url: shareUrl,
                title: props.title ?? "",
                text: props.text ?? "",
            });
            props.onNativeShare?.(shareUrl);
            return true;
        } catch {
            // A rejected promise here is almost always the user dismissing the sheet, which is not an error and must
            // not fall through to the list: that would reopen UI they just dismissed.
            return true;
        }
    }

    async function onButtonClick(): Promise<void> {
        if (untrack(open)) {
            closeList();
            return;
        }
        const strategy = props.strategy ?? "auto";
        if (strategy === "native" || (strategy === "auto" && canShareNatively())) {
            if (await shareNatively()) return;
        }
        openList();
    }

    function onButtonKeyDown(event: KeyboardEvent): void {
        // Enter and Space are the button's own activation keys and already produce a click; only the arrows need
        // handling here.
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
                // Tab leaves the control, but focus goes to the button FIRST, without cancelling the key: hiding the
                // list while one of its items has focus drops focus to <body>, and the default Tab would restart from
                // the top of the document. From the button, the default Tab lands where leaving the picker should.
                button?.focus?.({ preventScroll: true });
                closeList(false);
                break;
        }
    }

    /** focusout bubbles, so the root hears focus leaving any descendant. */
    function onRootFocusOut(event: FocusEvent): void {
        const next = event.relatedTarget as Node | null;
        if (next && root?.contains(next)) return;
        closeList(false);
    }

    function chooseTarget(target: ShareTarget): void {
        props.onShare?.(target.id, currentUrl());
        closeList();
    }

    async function copyUrl(): Promise<void> {
        const shareUrl = currentUrl();
        try {
            if (!canCopy()) throw new Error("clipboard unavailable");
            await navigator.clipboard.writeText(shareUrl);
            props.onCopy?.(shareUrl);
            if (props.copiedLabel) setStatus(props.copiedLabel);
        } catch {
            if (props.copyFailedLabel) setStatus(props.copyFailedLabel);
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
            class={`share-picker ${props.class ?? ""}`.trim()}
            onFocusOut={onRootFocusOut}
            {...rest}
        >
            <IconButton
                disabled={props.disabled ?? false}
                ref={(el: HTMLButtonElement) => (button = el)}
                {...tip.buttonProps}
                baseClass="share-picker-button"
                label={props.label}
                aria-expanded={open() ? "true" : "false"}
                aria-controls={listId}
                onClick={() => {
                    tip.onButtonClick();
                    void onButtonClick();
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
                        get url() {
                            return currentUrl();
                        },
                    })
                ) : (
                    <svg
                        class="share-picker-icon"
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
                        <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
                    </svg>
                )}
            </IconButton>
            {/* Purely visual: the same text is already the button's aria-label,
                so it is not wired with aria-describedby. */}
            <div
                class="share-picker-tooltip"
                role="tooltip"
                id={tooltipId}
                hidden={!tip.visible()}
                {...tip.tooltipProps}
            >
                {props.label}
            </div>

            {/* Named like the sibling pickers' listboxes: a screen reader entering the list hears what the list is for,
                not just "list, three items". */}
            <ul
                ref={(el) => (list = el)}
                class="share-picker-list"
                id={listId}
                aria-label={props.label}
                hidden={!open()}
                onKeyDown={onListKeyDown}
            >
                <For
                    each={props.targets ?? []}
                    keyed={(target) => target.id}
                >
                    {(target) => (
                        <li class="share-picker-list-item">
                            {/* A real link, not role="menuitem": these ARE navigation, and menuitem would strip
                                middle-click, open-in-new-tab and copy-link-address. */}
                            <a
                                class="share-picker-target"
                                data-target-id={target().id}
                                href={target().href(
                                    currentUrl(),
                                    props.title ?? "",
                                    props.text ?? "",
                                )}
                                target={target().newTab === false ? undefined : "_blank"}
                                rel="noopener noreferrer"
                                onClick={() => chooseTarget(target())}
                            >
                                {target().label}
                            </a>
                        </li>
                    )}
                </For>

                {props.copyLabel ? (
                    <li class="share-picker-list-item">
                        <button
                            type="button"
                            class="share-picker-copy"
                            onClick={() => void copyUrl()}
                        >
                            {props.copyLabel}
                        </button>
                    </li>
                ) : null}
            </ul>

            {/* Copying gives no visual feedback of its own, so the outcome is announced. Empty until something
                happens, so it stays silent on load; aria-live announces mutations only. */}
            <p
                class="share-picker-status"
                aria-live="polite"
            >
                {status()}
            </p>
        </div>
    );
}

export default SharePicker;
