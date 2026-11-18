import { IconButton } from "@lilydesignsystem/solid-headless";
import type { JSX } from "@solidjs/web";
import { createEffect, createSignal, createUniqueId, omit, untrack } from "solid-js";
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
    JSX.HTMLAttributes<HTMLDivElement>,
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
     * (e.g. Solid Router's `navigate`) to keep the navigation in-app.
     */
    navigate?: (href: string) => void;
    /** Fires with the trimmed query and the destination, before navigating. */
    onSearch?: (query: string, href: string) => void;
    /** Replaces the default magnifying-glass icon inside the button. */
    children?: (args: ChildArgs) => JSX.Element;
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
 * The destination for a query: `action` + `?` + the URI-encoded,
 * trimmed query. `searchHref("foo")` is `"/?foo"`;
 * `searchHref("foo bar")` is `"/?foo%20bar"`.
 */
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

export function searchHref(query: string, action = "/"): string {
    return `${action}?${encodeURIComponent(query.trim())}`;
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
export function nextSearchPickerId(): string {
    uid += 1;
    return `search-picker-${uid}`;
}

export function SearchPicker(props: Props): JSX.Element {
    const rest = omit(
        props,
        "class",
        "label",
        "inputLabel",
        "submitLabel",
        "placeholder",
        "value",
        "defaultValue",
        "onChange",
        "action",
        "navigate",
        "onSearch",
        "children",
        "open",
        "defaultOpen",
        "onOpenChange",
        "disabled",
    );
    const baseId = `search-picker-${createUniqueId()}`;
    const panelId = `${baseId}-panel`;
    const tooltipId = `${baseId}-tooltip`;

    const isControlled = () => props.value !== undefined;
    const [internalValue, setInternalValue] = createSignal(untrack(() => props.defaultValue ?? ""));
    const query = () => (isControlled() ? (props.value as string) : internalValue());

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
    let input: HTMLInputElement | undefined;

    // Set when an open should move focus into the field, and when a close should hand focus back to the button.
    let focusInput = false;
    let refocus = false;

    function openPanel(): void {
        focusInput = true;
        setOpen(true);
    }

    function closePanel(refocusButton = true): void {
        focusInput = false;
        if (refocusButton && untrack(open)) refocus = true;
        setOpen(false);
    }

    function onButtonClick(): void {
        if (untrack(open)) closePanel();
        else openPanel();
    }

    function onPanelKeyDown(event: KeyboardEvent): void {
        if (event.key === "Escape") {
            event.preventDefault();
            closePanel();
        }
    }

    /**
     * focusout bubbles, so the root hears focus leaving any descendant. Close only when focus moves to a known element
     * outside the picker: a focusout with no relatedTarget is not "focus left". Safari does not focus a <button> on
     * click, so pressing ⏎ (or the icon button) blurs the field with relatedTarget = null; closing there would hide the
     * panel before the click landed. Clicks outside the picker are handled by the document click listener below.
     */
    function onRootFocusOut(event: FocusEvent): void {
        const next = event.relatedTarget as Node | null;
        if (!next || root?.contains(next)) return;
        if (untrack(open)) closePanel(false);
    }

    function onInput(event: InputEvent & { currentTarget: HTMLInputElement }): void {
        const next = event.currentTarget.value;
        if (!untrack(isControlled)) setInternalValue(next);
        props.onChange?.(next);
    }

    function onSubmit(event: SubmitEvent): void {
        event.preventDefault();
        const trimmed = untrack(query).trim();
        if (!trimmed) return;
        const href = searchHref(trimmed, props.action ?? "/");
        props.onSearch?.(trimmed, href);
        closePanel(false);
        if (props.navigate) props.navigate(href);
        else if (typeof location !== "undefined") location.assign(href);
    }

    // Move focus into the field on open, back to the button on close.
    createEffect(open, (isOpen) => {
        if (isOpen) {
            if (focusInput) {
                focusInput = false;
                input?.focus({ preventScroll: true });
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

    return (
        <div
            ref={(el) => (root = el)}
            class={`search-picker ${props.class ?? ""}`.trim()}
            onFocusOut={onRootFocusOut}
            {...rest}
        >
            <IconButton
                disabled={props.disabled ?? false}
                ref={(el: HTMLButtonElement) => (button = el)}
                {...tip.buttonProps}
                baseClass="search-picker-button"
                label={props.label}
                aria-expanded={open() ? "true" : "false"}
                aria-controls={panelId}
                onClick={() => {
                    tip.onButtonClick();
                    onButtonClick();
                }}
                onKeyDown={tip.onButtonKeyDown}
            >
                {props.children ? (
                    props.children({
                        get open() {
                            return open();
                        },
                        get query() {
                            return query();
                        },
                    })
                ) : (
                    <svg
                        class="search-picker-icon"
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
                        <circle
                            cx="7"
                            cy="7"
                            r="4.5"
                        />
                        <path d="M10.5 10.5 14 14" />
                    </svg>
                )}
            </IconButton>
            {/* Purely visual: the same text is already the button's aria-label,
                so it is not wired with aria-describedby. */}
            <div
                class="search-picker-tooltip"
                role="tooltip"
                id={tooltipId}
                hidden={!tip.visible()}
                {...tip.tooltipProps}
            >
                {props.label}
            </div>

            {/* The keydown handler only listens for Escape bubbling up from the field and the submit button inside;
                the panel itself takes no focus. */}
            <div
                class="search-picker-panel"
                id={panelId}
                hidden={!open()}
                onKeyDown={onPanelKeyDown}
            >
                <form
                    class="search-picker-form"
                    role="search"
                    aria-label={props.label}
                    action={props.action ?? "/"}
                    method="get"
                    onSubmit={onSubmit}
                >
                    <input
                        ref={(el) => (input = el)}
                        class="search-picker-input"
                        type="search"
                        aria-label={props.inputLabel}
                        placeholder={props.placeholder}
                        enterkeyhint="search"
                        value={query()}
                        onInput={onInput}
                    />
                    <button
                        type="submit"
                        class="search-picker-submit"
                        aria-label={props.submitLabel}
                    >
                        <span
                            class="search-picker-submit-symbol"
                            aria-hidden="true"
                        >
                            {RETURN_SYMBOL}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SearchPicker;
