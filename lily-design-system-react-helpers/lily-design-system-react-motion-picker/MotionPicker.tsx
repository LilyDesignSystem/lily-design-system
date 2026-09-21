import * as React from "react";
import { IconButton, Listbox } from "@lilydesignsystem/react-headless";

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
    React.HTMLAttributes<HTMLDivElement>,
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
    children?: (args: ChildArgs) => React.ReactNode;
    /** Called after the control applies a new motion preference. */
    onChange?: (motion: string) => void;
    /** Extra CSS class on the root. */
    className?: string;
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
            if (stored) return stored;
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

export function MotionPicker({
    label,
    motions,
    value,
    defaultValue,
    storageKey,
    name = "motion",
    target,
    motionLabels = {},
    children,
    onChange,
    className = "",
    ...restProps
}: Props): React.ReactElement {
    const isControlled = value !== undefined;

    // Internal state for uncontrolled mode. Starts empty; resolved
    // in the first effect after mount (SSR-safe).
    const [internalValue, setInternalValue] = React.useState<string>(
        isControlled ? value : "",
    );

    // Mirror the controlled prop into a single read path so the render
    // branch is uniform.
    const currentValue = isControlled ? value : internalValue;

    // `useId` is stable across server and client render, so the option
    // ids survive hydration. No Math.random / Date.now.
    const baseId = `motion-picker-${React.useId()}`;
    const listId = `${baseId}-list`;
    const optionId = (i: number) => `${baseId}-option-${i}`;

    const [open, setOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(-1);

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    const listRef = React.useRef<HTMLElement | null>(null);

    // Set when a close should hand focus back to the button.
    const refocusRef = React.useRef(false);

    function labelFor(motion: string): string {
        if (motion in motionLabels) return motionLabels[motion];
        return motionName(motion);
    }

    // The motion the DOM currently carries. Applying is idempotent: in
    // controlled mode `setMotion` applies straight away and the consumer's
    // `onChange` writes the value back, which re-runs the apply effect —
    // without this, every selection fired `onChange` (and rewrote storage)
    // twice.
    const appliedRef = React.useRef("");

    function applyMotion(slug: string): void {
        if (typeof document === "undefined" || !slug) return;
        if (slug === appliedRef.current) return;
        appliedRef.current = slug;
        (target ?? document.documentElement).setAttribute(
            "data-motion",
            slug,
        );
        if (storageKey) {
            try {
                localStorage.setItem(storageKey, slug);
            } catch {
                // ignore quota / privacy errors
            }
        }
        onChange?.(slug);
    }

    function setMotion(slug: string): void {
        if (isControlled) {
            // The consumer owns `value`; apply straight away so the DOM
            // stays in step even if they never write the value back.
            applyMotion(slug);
        } else {
            // The value-change effect below runs applyMotion, so the
            // motion is applied exactly once per change.
            setInternalValue(slug);
        }
    }

    // ---------------------------------------------------------------
    // Open / close
    // ---------------------------------------------------------------

    function openList(startIndex?: number): void {
        const selected = motions.indexOf(currentValue ?? "");
        // An empty list has no option to activate; -1 keeps
        // aria-activedescendant off rather than pointing at an id that
        // does not exist.
        setActiveIndex(
            motions.length === 0
                ? -1
                : (startIndex ?? (selected >= 0 ? selected : 0)),
        );
        setOpen(true);
    }

    function closeList(refocus = true): void {
        if (!open) return;
        setOpen(false);
        setActiveIndex(-1);
        // Focus moves in the effect below, after the commit.
        if (refocus) refocusRef.current = true;
    }

    function choose(index: number): void {
        const slug = motions[index];
        if (slug) setMotion(slug);
        closeList();
    }

    function scrollActiveIntoView(index: number): void {
        if (index < 0) return;
        const el = listRef.current?.children[index] as HTMLElement | undefined;
        // jsdom does not implement scrollIntoView.
        el?.scrollIntoView?.({ block: "nearest" });
    }

    function handleTabOut(): void {
        // Tab moves on — but focus goes to the button FIRST, without
        // cancelling the key (Listbox's onTabOut never preventDefaults
        // Tab). Hiding the focused list drops focus to <body>, and the
        // browser then computes the default Tab move from the top of the
        // document, so tabbing out of an open picker teleported the user to
        // the page's first tab stop. From the button, the default Tab
        // lands exactly where leaving the picker should.
        buttonRef.current?.focus?.({ preventScroll: true });
        closeList(false);
    }

    function onButtonKeyDown(
        event: React.KeyboardEvent<HTMLButtonElement>,
    ): void {
        switch (event.key) {
            case "ArrowDown":
            case "Enter":
            case " ":
                event.preventDefault();
                openList();
                break;
            case "ArrowUp":
                event.preventDefault();
                openList(motions.length - 1);
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

    // Move focus to the listbox on open, back to the button on close.
    React.useEffect(() => {
        if (open) {
            listRef.current?.focus({ preventScroll: true });
        } else if (refocusRef.current) {
            refocusRef.current = false;
            buttonRef.current?.focus({ preventScroll: true });
        }
    }, [open]);

    // Keep the active option in view as it moves.
    React.useEffect(() => {
        if (open) scrollActiveIntoView(activeIndex);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, activeIndex]);

    // Clicking outside the root closes the listbox.
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

    // ---------------------------------------------------------------
    // Initial value resolution + apply
    // ---------------------------------------------------------------

    const initialisedRef = React.useRef(false);
    React.useEffect(() => {
        if (initialisedRef.current) return;
        initialisedRef.current = true;

        const initial = resolveInitialMotion(
            currentValue || undefined,
            storageKey,
            defaultValue,
            motions,
        );
        if (!initial) return;

        if (isControlled) {
            applyMotion(initial);
        } else {
            // setInternalValue triggers another render; the value-change
            // effect below will run applyMotion.
            if (initial !== internalValue) {
                setInternalValue(initial);
            } else {
                applyMotion(initial);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Re-apply whenever the resolved value changes.
    React.useEffect(() => {
        if (!initialisedRef.current) return;
        if (!currentValue) return;
        applyMotion(currentValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentValue]);

    return (
        <div
            ref={rootRef}
            className={`motion-picker ${className}`.trim()}
            onBlur={onRootBlur}
            {...restProps}
        >
            <input type="hidden" name={name} value={currentValue ?? ""} />

            <IconButton
                ref={buttonRef}
                baseClass="motion-picker-button"
                label={label}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => (open ? closeList() : openList())}
                onKeyDown={onButtonKeyDown}
            >
                {children ? (
                    children({ value: currentValue ?? "", open, labelFor })
                ) : (
                    <svg
                        className="motion-picker-icon"
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
                        <path d="M5 3v10M11 3v10" />
                    </svg>
                )}
            </IconButton>

            <Listbox
                ref={listRef}
                as="ul"
                baseClass="motion-picker-list"
                id={listId}
                label={label}
                navigation="active-descendant"
                clamp
                typeahead
                pageSize={10}
                activeIndex={activeIndex}
                onActiveIndexChange={setActiveIndex}
                hidden={!open}
                onActivate={choose}
                onEscape={() => closeList()}
                onTabOut={handleTabOut}
            >
                {motions.map((motion, i) => (
                    <li
                        key={motion}
                        className="motion-picker-option"
                        id={optionId(i)}
                        role="option"
                        aria-selected={motion === currentValue}
                        data-active={i === activeIndex ? "" : undefined}
                        onClick={() => choose(i)}
                    >
                        {labelFor(motion)}
                    </li>
                ))}
            </Listbox>
        </div>
    );
}

export default MotionPicker;
