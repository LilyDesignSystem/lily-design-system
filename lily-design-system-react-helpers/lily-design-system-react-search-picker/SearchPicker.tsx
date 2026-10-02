import * as React from "react";
import { IconButton } from "@lilydesignsystem/react-headless";
// Only the trigger button composes a headless primitive. The panel is a
// real <form role="search"> with a real search field and a real submit
// button — a disclosure, not a listbox or a menu — so headless `Listbox`
// is the wrong widget for it, not merely an unmigrated one.

/**
 * The submit button's visible content: U+23CE RETURN SYMBOL, a bare
 * literal character (never an escape — see `bin/test`'s glyph check).
 * It is the button's visible label only; the accessible name comes from
 * the required `submitLabel` prop, so assistive technology never has to
 * announce a symbol.
 */
export const RETURN_SYMBOL = "⏎";

/** Arguments passed to a custom `children` render prop (the button icon). */
export type ChildArgs = {
    /** Is the search panel open? */
    open: boolean;
    /** The current text in the search field. */
    query: string;
};

/** Public props for SearchPicker. See `spec/index.md` §4 for the contract. */
export type Props = Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "onChange" | "defaultValue"
> & {
    /** Accessible name for the icon button and the search landmark. */
    label: string;
    /** Accessible name for the search text field. */
    inputLabel: string;
    /** Accessible name for the ⏎ submit button. */
    submitLabel: string;
    /** Placeholder text for the search field. No default. */
    placeholder?: string;
    /**
     * The search text. When supplied, the component is controlled: pair
     * it with `onChange` and write each new value back.
     */
    value?: string;
    /** Initial search text when uncontrolled. */
    defaultValue?: string;
    /** Fires with the field's new text on every edit. */
    onChange?: (value: string) => void;
    /**
     * Path the query is appended to. The search for `foo` navigates to
     * `${action}?foo`; the default `"/"` gives `/?foo`.
     */
    action?: string;
    /**
     * Performs the navigation. Defaults to `location.assign(href)` — a
     * real GET request. Pass a client-side router's navigate function
     * (e.g. Next.js's `router.push`) to keep the navigation in-app.
     */
    navigate?: (href: string) => void;
    /** Fires with the trimmed query and the destination, before navigating. */
    onSearch?: (query: string, href: string) => void;
    /** Replaces the default magnifying-glass icon inside the button. */
    children?: (args: ChildArgs) => React.ReactNode;
    /** Extra CSS class on the root. */
    className?: string;
};

/**
 * The destination for a query: `action` + `?` + the URI-encoded,
 * trimmed query. `searchHref("foo")` is `"/?foo"`;
 * `searchHref("foo bar")` is `"/?foo%20bar"`.
 */
export function searchHref(query: string, action = "/"): string {
    return `${action}?${encodeURIComponent(query.trim())}`;
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
export function nextSearchPickerId(): string {
    uid += 1;
    return `search-picker-${uid}`;
}

export function SearchPicker({
    className = "",
    label,
    inputLabel,
    submitLabel,
    placeholder,
    value,
    defaultValue = "",
    onChange,
    action = "/",
    navigate,
    onSearch,
    children,
    ...restProps
}: Props): React.ReactElement {
    // `useId` is stable across server and client render, so the panel id
    // survives hydration. No Math.random / Date.now.
    const panelId = `search-picker-${React.useId()}-panel`;

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const query = isControlled ? (value as string) : internalValue;

    const [open, setOpen] = React.useState(false);

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    // Set when an open should move focus into the field.
    const focusInputRef = React.useRef(false);
    // Set when a close should hand focus back to the trigger.
    const refocusRef = React.useRef(false);

    function openPanel(): void {
        focusInputRef.current = true;
        setOpen(true);
    }

    function closePanel(refocus = true): void {
        setOpen(false);
        focusInputRef.current = false;
        // Focus moves in the effect below, after the commit.
        if (refocus) refocusRef.current = true;
    }

    function onButtonClick(): void {
        if (open) closePanel();
        else openPanel();
    }

    function onPanelKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
        if (event.key === "Escape") {
            event.preventDefault();
            closePanel();
        }
    }

    /**
     * React's `onBlur` is the delegated equivalent of the native
     * `focusout` event: unlike the DOM's own `blur`, it bubbles, so the
     * root sees focus leaving any descendant.
     *
     * Close only when focus moves to a known element outside the picker.
     * A focusout with no relatedTarget is not "focus left": Safari does
     * not focus a <button> on click, so pressing ⏎ (or the icon button)
     * blurs the field with relatedTarget = null. Closing there hid the
     * panel before the click landed, so ⏎ never searched and the icon
     * button re-opened instead of closing. Clicks outside the picker are
     * handled by the document click listener below.
     */
    function onRootBlur(event: React.FocusEvent<HTMLDivElement>): void {
        const next = event.relatedTarget as Node | null;
        if (!next || rootRef.current?.contains(next)) return;
        if (open) closePanel(false);
    }

    function onInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const next = event.target.value;
        if (!isControlled) setInternalValue(next);
        onChange?.(next);
    }

    function onSubmit(event: React.FormEvent<HTMLFormElement>): void {
        // The form's native GET would send `/?name=value`; the contract is
        // the bare query (`/?foo`), so navigation is done here instead.
        event.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;
        const href = searchHref(trimmed, action);
        onSearch?.(trimmed, href);
        closePanel(false);
        if (navigate) navigate(href);
        else if (typeof location !== "undefined") location.assign(href);
    }

    // Move focus into the field on open, back to the trigger on close.
    // preventScroll: the panel is positioned by consumer CSS, and focusing
    // a field rendered partly off-screen would otherwise scroll the whole
    // page — the same fix the sibling pickers carry.
    React.useEffect(() => {
        if (open) {
            if (focusInputRef.current) {
                focusInputRef.current = false;
                inputRef.current?.focus({ preventScroll: true });
            }
        } else if (refocusRef.current) {
            refocusRef.current = false;
            buttonRef.current?.focus({ preventScroll: true });
        }
    }, [open]);

    // Clicking outside the root closes the panel.
    React.useEffect(() => {
        if (!open) return;
        function onDocumentClick(event: MouseEvent) {
            const t = event.target as Node | null;
            if (t && rootRef.current && !rootRef.current.contains(t)) {
                closePanel(false);
            }
        }
        document.addEventListener("click", onDocumentClick);
        return () => document.removeEventListener("click", onDocumentClick);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    return (
        <div
            ref={rootRef}
            className={`search-picker ${className}`.trim()}
            onBlur={onRootBlur}
            {...restProps}
        >
            <IconButton
                ref={buttonRef}
                baseClass="search-picker-button"
                label={label}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={onButtonClick}
            >
                {children ? (
                    children({ open, query })
                ) : (
                    <svg
                        className="search-picker-icon"
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
                        <circle cx="7" cy="7" r="4.5" />
                        <path d="M10.5 10.5 14 14" />
                    </svg>
                )}
            </IconButton>

            {/* The keydown handler only listens for Escape bubbling up from
                the field and the submit button inside; the panel itself
                takes no focus. */}
            <div
                className="search-picker-panel"
                id={panelId}
                hidden={!open}
                onKeyDown={onPanelKeyDown}
            >
                <form
                    className="search-picker-form"
                    role="search"
                    aria-label={label}
                    action={action}
                    method="get"
                    onSubmit={onSubmit}
                >
                    <input
                        ref={inputRef}
                        className="search-picker-input"
                        type="search"
                        aria-label={inputLabel}
                        placeholder={placeholder}
                        enterKeyHint="search"
                        value={query}
                        onChange={onInputChange}
                    />
                    <button
                        type="submit"
                        className="search-picker-submit"
                        aria-label={submitLabel}
                    >
                        <span className="search-picker-submit-symbol" aria-hidden="true">
                            {RETURN_SYMBOL}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SearchPicker;
