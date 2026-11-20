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
 * Default button icon: a bundled SVG (two pause bars), not a Unicode
 * character. Reversed 2026-09-16 from the font-dependent-glyph
 * convention (was U+23F8 PAUSE SIGN + U+FE0E, exported as
 * `PAUSE_SIGN` — removed, not renamed). "Stop the moving parts" still
 * reads directly from two bars; a bundled outline SVG matches the
 * other four picker icons as one consistent visual family regardless
 * of the consumer's fonts, where the old glyph depended on the
 * platform's media-transport symbols defaulting to text presentation.
 */

/** Arguments passed to a custom `children` render prop (the button glyph). */
export type ChildArgs = {
    /** Currently selected motion slug. */
    value: string;
    /** Is the listbox open? */
    open: boolean;
    /** Resolve a slug to its display label. */
    labelFor: (motion: string) => string;
};

/** Public props for MotionPicker. See `spec/index.md` §4 for the contract. */
export type Props = Omit<
    JSX.HTMLAttributes<HTMLDivElement>,
    "onChange" | "children" | "defaultValue"
> & {
    /** Accessible name for the button and the listbox. */
    label: string;
    /** Available motion slugs, e.g. ["no-preference","reduce"]. */
    motions: string[];
    /** Currently selected motion slug. When supplied, the component is controlled. */
    value?: string;
    /** Initial motion when nothing else is supplied. */
    defaultValue?: string;
    /** If set, persist the selection to localStorage under this key. */
    storageKey?: string;
    /** `name` of the hidden input that carries the value in a form. */
    name?: string;
    /** Element that receives `data-motion`. Defaults to document.documentElement. */
    target?: HTMLElement | null;
    /** Optional pretty labels per slug. */
    motionLabels?: Record<string, string>;
    /** Replaces the default pause-bars icon inside the button. */
    children?: (args: ChildArgs) => JSX.Element;
    /** Called after the control applies a new motion preference. */
    onChange?: (motion: string) => void;
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
 * Resolve a motion slug to its display label: each hyphen-separated
 * word title-cased, so "no-preference" renders as "No Preference".
 * Mirrors `sizeName` in text-size-picker and `themeName` in
 * theme-picker.
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

export function motionName(motion: string): string {
    return motion
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * True when the platform reports a preference for reduced motion.
 * SSR-safe: `window`/`matchMedia` are absent on the server, so this
 * resolves to `false` there and the client re-derives it on mount.
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return false;
    }
    try {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
        return false;
    }
}

function resolveInitialMotion(
    value: string | undefined,
    storageKey: string | undefined,
    defaultValue: string | undefined,
    motions: string[],
): string {
    if (value) return value;
    if (storageKey) {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored && motions.includes(stored)) return stored;
        } catch {
            // ignore privacy errors
        }
    }
    if (defaultValue) return defaultValue;
    // Unlike text-size-picker's "medium" default, motion has a real
    // external signal to defer to: the platform's own
    // (prefers-reduced-motion: reduce) media query.
    const osPreferred = prefersReducedMotion() ? "reduce" : "no-preference";
    if (motions.includes(osPreferred)) return osPreferred;
    return motions[0] ?? "";
}

export function MotionPicker(props: Props): JSX.Element {
    const rest = omit(
        props,
        "label",
        "motions",
        "value",
        "defaultValue",
        "storageKey",
        "name",
        "target",
        "motionLabels",
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
    const baseId = `motion-picker-${createUniqueId()}`;
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

    function labelFor(motion: string): string {
        const labels = props.motionLabels ?? {};
        if (motion in labels) return labels[motion];
        return motionName(motion);
    }

    // The motion preference the DOM currently carries. Applying is idempotent: a controlled consumer's `onChange` writes the value
    // back, which re-runs the apply effect; without this guard every selection would fire `onChange` twice.
    let applied = "";

    function applyMotion(slug: string): void {
        if (typeof document === "undefined" || !slug) return;
        if (slug === applied) return;
        applied = slug;
        (props.target ?? document.documentElement).setAttribute("data-motion", slug);
        if (props.storageKey) {
            try {
                localStorage.setItem(props.storageKey, slug);
            } catch {
                // ignore quota / privacy errors
            }
        }
        props.onChange?.(slug);
    }

    function setMotion(slug: string): void {
        if (untrack(isControlled)) {
            // The consumer owns `value`; apply straight away so the DOM stays in step even if they never write it back.
            applyMotion(slug);
        } else {
            // The value effect below applies it, exactly once per change.
            setInternalValue(slug);
        }
    }

    // ---------------------------------------------------------------
    // Open / close
    // ---------------------------------------------------------------

    function openList(startIndex?: number): void {
        const motions = props.motions;
        const selected = motions.indexOf(untrack(currentValue) ?? "");
        // An empty list has no option to activate; -1 keeps aria-activedescendant off rather than pointing at an id
        // that does not exist.
        setActiveIndex(motions.length === 0 ? -1 : (startIndex ?? (selected >= 0 ? selected : 0)));
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
        const slug = props.motions[index];
        if (slug) setMotion(slug);
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
                openList(props.motions.length - 1);
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
            const initial = resolveInitialMotion(
                currentValue() || undefined,
                props.storageKey,
                props.defaultValue,
                props.motions,
            );
            initialised = true;
            if (!initial) return;
            if (isControlled() || initial === internalValue()) applyMotion(initial);
            else setInternalValue(initial);
        });
    });

    // Re-apply whenever the value changes (a controlled prop from outside, or internal state after mount).
    createEffect(currentValue, (slug) => {
        if (!initialised || !slug) return;
        applyMotion(slug);
    });

    const tip = createPickerTooltip(() => button, open);

    return (
        <div
            ref={(el) => (root = el)}
            class={`motion-picker ${props.class ?? ""}`.trim()}
            onFocusOut={onRootFocusOut}
            {...rest}
        >
            <input
                type="hidden"
                name={props.name ?? "motion"}
                value={currentValue() ?? ""}
            />

            <IconButton
                disabled={props.disabled ?? false}
                ref={(el: HTMLButtonElement) => (button = el)}
                {...tip.buttonProps}
                baseClass="motion-picker-button"
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
                        class="motion-picker-icon"
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
                        <path d="M5 3v10M11 3v10" />
                    </svg>
                )}
            </IconButton>
            {/* Purely visual: the same text is already the button's aria-label,
                so it is not wired with aria-describedby. */}
            <div
                class="motion-picker-tooltip"
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
                baseClass="motion-picker-list"
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
                    each={props.motions}
                    keyed={false}
                >
                    {(motion, i) => (
                        <li
                            class="motion-picker-option"
                            id={optionId(i)}
                            role="option"
                            aria-selected={motion() === currentValue() ? "true" : "false"}
                            data-active={i === activeIndex() ? "" : undefined}
                            onClick={() => choose(i)}
                        >
                            {labelFor(motion())}
                        </li>
                    )}
                </For>
            </Listbox>
        </div>
    );
}

export default MotionPicker;
