import * as React from "react";

/**
 * Default button glyph: U+21AA RIGHTWARDS ARROW WITH HOOK.
 *
 * An in-font arrow rather than a pictograph, matching the other helpers'
 * rule: it renders in the page's own font on every platform and stays
 * monochrome alongside theme-select's ◑, locale-select's 🌐 and
 * text-size-select's "A".
 */
export const RIGHTWARDS_ARROW_WITH_HOOK = "↪";

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

/** Public props for ShareButton. See `spec/index.md` §4 for the contract. */
export type Props = Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "title" | "onCopy"
> & {
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
    /** Replaces the default ↪ glyph inside the button. */
    children?: (args: ChildArgs) => React.ReactNode;
    /** Fires after a destination is chosen, with its `id`. */
    onShare?: (targetId: string, url: string) => void;
    /** Fires after the URL is copied. */
    onCopy?: (url: string) => void;
    /** Fires when the native share sheet is used, instead of the list. */
    onNativeShare?: (url: string) => void;
    /** Extra CSS class on the root. */
    className?: string;
};

/** Is a native share sheet available? SSR-safe. */
export function canShareNatively(): boolean {
    return (
        typeof navigator !== "undefined" && typeof navigator.share === "function"
    );
}

/** Is an async clipboard available? SSR-safe. */
export function canCopy(): boolean {
    return (
        typeof navigator !== "undefined" &&
        typeof navigator.clipboard?.writeText === "function"
    );
}

let uid = 0;
/**
 * Stable id prefix; SSR-safe (no Math.random / Date.now).
 *
 * The component itself mints ids with React's `useId`, which is
 * hydration-safe in a way a module counter cannot be. This function is
 * exported for parity with the canonical Svelte helper and for consumers
 * who need to label a control from outside the component tree.
 */
export function nextShareButtonId(): string {
    uid += 1;
    return `share-button-${uid}`;
}

export function ShareButton({
    className = "",
    label,
    targets = [],
    url,
    title = "",
    text = "",
    copyLabel,
    copiedLabel,
    copyFailedLabel,
    strategy = "auto",
    children,
    onShare,
    onCopy,
    onNativeShare,
    ...restProps
}: Props): React.ReactElement {
    // `useId` is stable across server and client render, so the list id
    // survives hydration. No Math.random / Date.now.
    const listId = `share-button-${React.useId()}-list`;

    const [open, setOpen] = React.useState(false);
    const [status, setStatus] = React.useState("");

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    const listRef = React.useRef<HTMLUListElement | null>(null);

    // Which end of the list to focus once an open has been committed.
    const pendingFocusRef = React.useRef<"first" | "last" | null>(null);
    // Set when a close should hand focus back to the trigger.
    const refocusRef = React.useRef(false);

    /**
     * The URL to share. Resolved lazily so the default works without the
     * consumer threading `location.href` through, and so SSR never
     * touches `location`.
     */
    function currentUrl(): string {
        if (url) return url;
        return typeof location !== "undefined" ? location.href : "";
    }

    /** Every focusable item in the list, in DOM order. */
    function items(): HTMLElement[] {
        const list = listRef.current;
        if (!list) return [];
        return Array.from(
            list.querySelectorAll<HTMLElement>(
                ".share-button-target, .share-button-copy",
            ),
        );
    }

    function openList(focusLast = false): void {
        pendingFocusRef.current = focusLast ? "last" : "first";
        setStatus("");
        setOpen(true);
    }

    function closeList(refocus = true): void {
        setOpen(false);
        pendingFocusRef.current = null;
        // Focus moves in the effect below, after the commit.
        if (refocus) refocusRef.current = true;
    }

    async function shareNatively(): Promise<boolean> {
        if (!canShareNatively()) return false;
        const shareUrl = currentUrl();
        try {
            await navigator.share({ url: shareUrl, title, text });
            onNativeShare?.(shareUrl);
            return true;
        } catch {
            // A rejected promise here is almost always the user dismissing
            // the sheet, which is not an error and must not fall through to
            // the list — that would reopen UI they just dismissed.
            return true;
        }
    }

    async function onButtonClick(): Promise<void> {
        if (open) {
            closeList();
            return;
        }
        if (strategy === "native" || (strategy === "auto" && canShareNatively())) {
            if (await shareNatively()) return;
        }
        openList();
    }

    function onButtonKeyDown(event: React.KeyboardEvent<HTMLButtonElement>): void {
        // Enter and Space are the button's own activation keys and already
        // produce a click; only the arrows need handling here.
        if (event.key === "ArrowDown") {
            event.preventDefault();
            if (!open) openList();
            else items()[0]?.focus();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) openList(true);
            else {
                const all = items();
                all[all.length - 1]?.focus();
            }
        }
    }

    function moveFocus(delta: number): void {
        const all = items();
        if (all.length === 0) return;
        const i = all.indexOf(document.activeElement as HTMLElement);
        const next = Math.min(
            Math.max((i < 0 ? 0 : i) + delta, 0),
            all.length - 1,
        );
        all[next]?.focus();
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
            case "Home": {
                event.preventDefault();
                items()[0]?.focus();
                break;
            }
            case "End": {
                event.preventDefault();
                const all = items();
                all[all.length - 1]?.focus();
                break;
            }
            case "Escape":
                event.preventDefault();
                closeList();
                break;
            case "Tab":
                // Tab leaves the control: close, but let focus go where the
                // browser was sending it.
                closeList(false);
                break;
        }
    }

    /**
     * React's `onBlur` is the delegated equivalent of the native
     * `focusout` event: unlike the DOM's own `blur`, it bubbles, so the
     * root sees focus leaving any descendant.
     */
    function onRootBlur(event: React.FocusEvent<HTMLDivElement>): void {
        const next = event.relatedTarget as Node | null;
        if (next && rootRef.current?.contains(next)) return;
        closeList(false);
    }

    function chooseTarget(target: ShareTarget): void {
        onShare?.(target.id, currentUrl());
        closeList();
    }

    async function copyUrl(): Promise<void> {
        const shareUrl = currentUrl();
        try {
            if (!canCopy()) throw new Error("clipboard unavailable");
            await navigator.clipboard.writeText(shareUrl);
            onCopy?.(shareUrl);
            if (copiedLabel) setStatus(copiedLabel);
        } catch {
            if (copyFailedLabel) setStatus(copyFailedLabel);
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
                (wanted === "last" ? all[all.length - 1] : all[0])?.focus();
            }
        } else if (refocusRef.current) {
            refocusRef.current = false;
            buttonRef.current?.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // Clicking outside the root closes the list.
    React.useEffect(() => {
        if (!open) return;
        function onDocumentClick(event: MouseEvent) {
            const t = event.target as Node | null;
            if (t && rootRef.current && !rootRef.current.contains(t)) {
                closeList(false);
            }
        }
        document.addEventListener("click", onDocumentClick);
        return () => document.removeEventListener("click", onDocumentClick);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    return (
        <div
            ref={rootRef}
            className={`share-button ${className}`.trim()}
            onBlur={onRootBlur}
            {...restProps}
        >
            <button
                ref={buttonRef}
                type="button"
                className="share-button-trigger"
                aria-label={label}
                aria-expanded={open}
                aria-controls={listId}
                onClick={onButtonClick}
                onKeyDown={onButtonKeyDown}
            >
                {children ? (
                    children({ open, url: currentUrl() })
                ) : (
                    <span className="share-button-icon" aria-hidden="true">
                        {RIGHTWARDS_ARROW_WITH_HOOK}
                    </span>
                )}
            </button>

            <ul
                ref={listRef}
                className="share-button-list"
                id={listId}
                hidden={!open}
                onKeyDown={onListKeyDown}
            >
                {targets.map((target) => (
                    <li className="share-button-list-item" key={target.id}>
                        {/* A real link, not role="menuitem": these ARE
                            navigation, and menuitem would strip middle-click,
                            open-in-new-tab and copy-link-address. */}
                        <a
                            className="share-button-target"
                            data-target-id={target.id}
                            href={target.href(currentUrl(), title, text)}
                            target={target.newTab === false ? undefined : "_blank"}
                            rel="noopener noreferrer"
                            onClick={() => chooseTarget(target)}
                        >
                            {target.label}
                        </a>
                    </li>
                ))}

                {copyLabel ? (
                    <li className="share-button-list-item">
                        <button
                            type="button"
                            className="share-button-copy"
                            onClick={copyUrl}
                        >
                            {copyLabel}
                        </button>
                    </li>
                ) : null}
            </ul>

            {/* Copying gives no visual feedback of its own, so the outcome is
                announced. Empty until something happens, so it stays silent on
                load; aria-live announces mutations only. */}
            <p className="share-button-status" aria-live="polite">
                {status}
            </p>
        </div>
    );
}

export default ShareButton;
