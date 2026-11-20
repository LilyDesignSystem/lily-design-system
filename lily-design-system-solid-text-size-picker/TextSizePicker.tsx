import { IconButton, Listbox } from "@lilydesignsystem/solid-headless";
import type { JSX } from "@solidjs/web";
import {
    createEffect,
    createSignal,
    createUniqueId,
    For,
    omit,
    onSettled,
    untrack,
} from "solid-js";

/**
 * Default button icon: a bundled SVG (a stroke-drawn "A"), not a
 * Unicode character. Reversed 2026-09-16 from the font-dependent-glyph
 * convention (was the plain letter U+0041, exported as
 * `LATIN_CAPITAL_LETTER_A` — removed, not renamed). "A" itself needed
 * no escaping and had no font-fallback risk, but it still varied in
 * weight and proportions across font stacks; a bundled outline SVG
 * matches the other four picker icons as one consistent visual family
 * regardless of the consumer's fonts.
 */

/** Arguments passed to a custom `children` render prop (the button glyph). */
export type ChildArgs = {
    /** Currently selected size slug. */
    value: string;
    /** Is the listbox open? */
    open: boolean;
    /** Resolve a slug to its display label. */
    labelFor: (size: string) => string;
};

/** Public props for TextSizePicker. See `spec/index.md` §4 for the contract. */
export type Props = Omit<
    JSX.HTMLAttributes<HTMLDivElement>,
    "onChange" | "children" | "defaultValue"
> & {
    /** Accessible name for the button and the listbox. */
    label: string;
    /** Available size slugs, e.g. ["small","medium","large","x-large"]. */
    sizes: string[];
    /** Currently selected size slug. When supplied, the component is controlled. */
    value?: string;
    /** Initial size when nothing else is supplied. */
    defaultValue?: string;
    /** If set, persist the selection to localStorage under this key. */
    storageKey?: string;
    /** `name` of the hidden input that carries the value in a form. */
    name?: string;
    /** Element that receives `data-text-size`. Defaults to document.documentElement. */
    target?: HTMLElement | null;
    /** Optional pretty labels per slug. */
    sizeLabels?: Record<string, string>;
    /** Replaces the default "A" icon inside the button. */
    children?: (args: ChildArgs) => JSX.Element;
    /** Called after the control applies a new size. */
    onChange?: (size: string) => void;
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

// ------------------------------------------------------------------
// Pure helpers (exported so consumers can reuse them)
// ------------------------------------------------------------------

/**
 * Resolve a size slug to its display label: each hyphen-separated word
 * title-cased, so "x-large" renders as "X Large". Mirrors `themeName`
 * in theme-picker and `localeName` in locale-picker. The word "default"
 * is never emitted.
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

export function sizeName(size: string): string {
    return size
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function resolveInitialSize(
    value: string | undefined,
    storageKey: string | undefined,
    defaultValue: string | undefined,
    sizes: string[],
): string {
    if (value) return value;
    if (storageKey) {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored && sizes.includes(stored)) return stored;
        } catch {
            // ignore privacy errors
        }
    }
    if (defaultValue) return defaultValue;
    if (sizes.includes("medium")) return "medium";
    return sizes[0] ?? "";
}

export function TextSizePicker(props: Props): JSX.Element {
    const rest = omit(
        props,
        "label",
        "sizes",
        "value",
        "defaultValue",
        "storageKey",
        "name",
        "target",
        "sizeLabels",
        "children",
        "onChange",
        "class",
        "open",
        "defaultOpen",
        "onOpenChange",
        "disabled",
    );
    const isControlled = () => props.value !== undefined;
    const [internalValue, setInternalValue] = createSignal("");
    const currentValue = () => (isControlled() ? (props.value as string) : internalValue());

    // `createUniqueId` is stable across server and client render, so the option ids survive hydration.
    const baseId = `text-size-picker-${createUniqueId()}`;
    const listId = `${baseId}-list`;
    const tooltipId = `${baseId}-tooltip`;
    const optionId = (i: number) => `${baseId}-option-${i}`;

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
    const [activeIndex, setActiveIndex] = createSignal(-1);

    let root: HTMLDivElement | undefined;
    let button: HTMLButtonElement | undefined;
    let list: HTMLElement | undefined;

    // Set when a close should hand focus back to the button.
    let refocus = false;

    function labelFor(size: string): string {
        const labels = props.sizeLabels ?? {};
        if (size in labels) return labels[size];
        return sizeName(size);
    }

    // The size the DOM currently carries. Applying is idempotent: a controlled consumer's `onChange` writes the value
    // back, which re-runs the apply effect; without this guard every selection would fire `onChange` twice.
    let applied = "";

    function applySize(slug: string): void {
        if (typeof document === "undefined" || !slug) return;
        if (slug === applied) return;
        applied = slug;
        (props.target ?? document.documentElement).setAttribute("data-text-size", slug);
        if (props.storageKey) {
            try {
                localStorage.setItem(props.storageKey, slug);
            } catch {
                // ignore quota / privacy errors
            }
        }
        props.onChange?.(slug);
    }

    function setSize(slug: string): void {
        if (untrack(isControlled)) {
            // The consumer owns `value`; apply straight away so the DOM stays in step even if they never write it back.
            applySize(slug);
        } else {
            // The value effect below applies it, exactly once per change.
            setInternalValue(slug);
        }
    }

    // ---------------------------------------------------------------
    // Open / close
    // ---------------------------------------------------------------

    function openList(startIndex?: number): void {
        const sizes = props.sizes;
        const selected = sizes.indexOf(untrack(currentValue) ?? "");
        // An empty list has no option to activate; -1 keeps aria-activedescendant off rather than pointing at an id
        // that does not exist.
        setActiveIndex(sizes.length === 0 ? -1 : (startIndex ?? (selected >= 0 ? selected : 0)));
        setOpen(true);
    }

    function closeList(refocusButton = true): void {
        if (!untrack(open)) return;
        setActiveIndex(-1);
        // Focus moves in the effect below, once the list is hidden.
        if (refocusButton) refocus = true;
        setOpen(false);
    }

    function choose(index: number): void {
        const slug = props.sizes[index];
        if (slug) setSize(slug);
        closeList();
    }

    function scrollActiveIntoView(index: number): void {
        if (index < 0) return;
        const el = list?.children[index] as HTMLElement | undefined;
        // jsdom does not implement scrollIntoView.
        el?.scrollIntoView?.({ block: "nearest" });
    }

    function handleTabOut(): void {
        // Tab moves on, but focus goes to the button FIRST, without cancelling the key (Listbox's onTabOut never
        // prevents Tab): hiding the focused list drops focus to <body>, and the default Tab move would then start
        // from the top of the document. From the button, the default Tab lands where leaving the picker should.
        button?.focus?.({ preventScroll: true });
        closeList(false);
    }

    function onButtonKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case "ArrowDown":
            case "Enter":
            case " ":
                event.preventDefault();
                openList();
                break;
            case "ArrowUp":
                event.preventDefault();
                openList(props.sizes.length - 1);
                break;
        }
    }

    /** focusout bubbles, so the root hears focus leaving any descendant. */
    function onRootFocusOut(event: FocusEvent): void {
        const next = event.relatedTarget as Node | null;
        if (next && root?.contains(next)) return;
        closeList(false);
    }

    // Move focus to the listbox on open, back to the button on close. preventScroll stops the browser scrolling the
    // page when a list positioned partly off-screen takes focus.
    createEffect(open, (isOpen) => {
        if (isOpen) {
            list?.focus({ preventScroll: true });
        } else if (refocus) {
            refocus = false;
            button?.focus({ preventScroll: true });
        }
    });

    // Keep the active option in view as it moves.
    createEffect(
        () => [open(), activeIndex()] as const,
        ([isOpen, index]) => {
            if (isOpen) scrollActiveIntoView(index);
        },
    );

    // Clicking outside the root closes the listbox.
    createEffect(open, (isOpen) => {
        if (!isOpen) return;
        function onDocumentClick(event: MouseEvent) {
            const t = event.target as Node | null;
            if (t && root && !root.contains(t)) closeList(false);
        }
        document.addEventListener("click", onDocumentClick);
        return () => document.removeEventListener("click", onDocumentClick);
    });

    // ---------------------------------------------------------------
    // Initial value resolution, after mount, then apply on every change
    // ---------------------------------------------------------------

    let initialised = false;
    onSettled(() => {
        untrack(() => {
            const initial = resolveInitialSize(
                currentValue() || undefined,
                props.storageKey,
                props.defaultValue,
                props.sizes,
            );
            initialised = true;
            if (!initial) return;
            if (isControlled() || initial === internalValue()) applySize(initial);
            else setInternalValue(initial);
        });
    });

    // Re-apply whenever the value changes (a controlled prop from outside, or internal state after mount).
    createEffect(currentValue, (slug) => {
        if (!initialised || !slug) return;
        applySize(slug);
    });

    const tip = createPickerTooltip(() => button, open);

    return (
        <div
            ref={(el) => (root = el)}
            class={`text-size-picker ${props.class ?? ""}`.trim()}
            onFocusOut={onRootFocusOut}
            {...rest}
        >
            <input
                type="hidden"
                name={props.name ?? "text-size"}
                value={currentValue() ?? ""}
            />

            <IconButton
                disabled={props.disabled ?? false}
                ref={(el: HTMLButtonElement) => (button = el)}
                {...tip.buttonProps}
                baseClass="text-size-picker-button"
                label={props.label}
                aria-haspopup="listbox"
                aria-expanded={open() ? "true" : "false"}
                aria-controls={listId}
                onClick={() => {
                    tip.onButtonClick();
                    if (untrack(open)) closeList();
                    else openList();
                }}
                onKeyDown={(event: KeyboardEvent) => {
                    tip.onButtonKeyDown(event);
                    onButtonKeyDown(event);
                }}
            >
                {props.children ? (
                    props.children({
                        get value() {
                            return currentValue() ?? "";
                        },
                        get open() {
                            return open();
                        },
                        labelFor,
                    })
                ) : (
                    <svg
                        class="text-size-picker-icon"
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
                        <path d="M4 13 7.2 3h1.6L12 13M5.4 9.5h5.2" />
                    </svg>
                )}
            </IconButton>
            {/* Purely visual: the same text is already the button's aria-label,
                so it is not wired with aria-describedby. */}
            <div
                class="text-size-picker-tooltip"
                role="tooltip"
                id={tooltipId}
                hidden={!tip.visible()}
                {...tip.tooltipProps}
            >
                {props.label}
            </div>

            <Listbox
                ref={(el: HTMLElement) => (list = el)}
                as="ul"
                baseClass="text-size-picker-list"
                id={listId}
                label={props.label}
                navigation="active-descendant"
                clamp
                typeahead
                pageSize={10}
                activeIndex={activeIndex()}
                onActiveIndexChange={setActiveIndex}
                hidden={!open()}
                onActivate={choose}
                onEscape={() => closeList()}
                onTabOut={handleTabOut}
            >
                <For
                    each={props.sizes}
                    keyed={false}
                >
                    {(size, i) => (
                        <li
                            class="text-size-picker-option"
                            id={optionId(i)}
                            role="option"
                            aria-selected={size() === currentValue() ? "true" : "false"}
                            data-active={i === activeIndex() ? "" : undefined}
                            onClick={() => choose(i)}
                        >
                            {labelFor(size())}
                        </li>
                    )}
                </For>
            </Listbox>
        </div>
    );
}

export default TextSizePicker;
