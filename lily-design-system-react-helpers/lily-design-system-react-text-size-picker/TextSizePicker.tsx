import * as React from "react";
import { IconButton, Listbox } from "@lilydesignsystem/react-headless";

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
    React.HTMLAttributes<HTMLDivElement>,
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
    children?: (args: ChildArgs) => React.ReactNode;
    /** Called after the control applies a new size. */
    onChange?: (size: string) => void;
    /** Extra CSS class on the root. */
    className?: string;
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
            if (stored) return stored;
        } catch {
            // ignore privacy errors
        }
    }
    if (defaultValue) return defaultValue;
    if (sizes.includes("medium")) return "medium";
    return sizes[0] ?? "";
}

export function TextSizePicker({
    label,
    sizes,
    value,
    defaultValue,
    storageKey,
    name = "text-size",
    target,
    sizeLabels = {},
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
    const baseId = `text-size-picker-${React.useId()}`;
    const listId = `${baseId}-list`;
    const optionId = (i: number) => `${baseId}-option-${i}`;

    const [open, setOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(-1);

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    const listRef = React.useRef<HTMLElement | null>(null);

    // Set when a close should hand focus back to the button.
    const refocusRef = React.useRef(false);

    function labelFor(size: string): string {
        if (size in sizeLabels) return sizeLabels[size];
        return sizeName(size);
    }

    // The size the DOM currently carries. Applying is idempotent: in
    // controlled mode `setSize` applies straight away and the consumer's
    // `onChange` writes the value back, which re-runs the apply effect —
    // without this, every selection fired `onChange` (and rewrote storage)
    // twice.
    const appliedRef = React.useRef("");

    function applySize(slug: string): void {
        if (typeof document === "undefined" || !slug) return;
        if (slug === appliedRef.current) return;
        appliedRef.current = slug;
        (target ?? document.documentElement).setAttribute(
            "data-text-size",
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

    function setSize(slug: string): void {
        if (isControlled) {
            // The consumer owns `value`; apply straight away so the DOM
            // stays in step even if they never write the value back.
            applySize(slug);
        } else {
            // The value-change effect below runs applySize, so the size
            // is applied exactly once per change.
            setInternalValue(slug);
        }
    }

    // ---------------------------------------------------------------
    // Open / close
    // ---------------------------------------------------------------

    function openList(startIndex?: number): void {
        const selected = sizes.indexOf(currentValue ?? "");
        // An empty list has no option to activate; -1 keeps
        // aria-activedescendant off rather than pointing at an id that
        // does not exist.
        setActiveIndex(
            sizes.length === 0
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
        const slug = sizes[index];
        if (slug) setSize(slug);
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
                openList(sizes.length - 1);
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
    // Initial value resolution + apply (unchanged from the select era)
    // ---------------------------------------------------------------

    const initialisedRef = React.useRef(false);
    React.useEffect(() => {
        if (initialisedRef.current) return;
        initialisedRef.current = true;

        const initial = resolveInitialSize(
            currentValue || undefined,
            storageKey,
            defaultValue,
            sizes,
        );
        if (!initial) return;

        if (isControlled) {
            applySize(initial);
        } else {
            // setInternalValue triggers another render; the value-change
            // effect below will run applySize.
            if (initial !== internalValue) {
                setInternalValue(initial);
            } else {
                applySize(initial);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Re-apply whenever the resolved value changes.
    React.useEffect(() => {
        if (!initialisedRef.current) return;
        if (!currentValue) return;
        applySize(currentValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentValue]);

    return (
        <div
            ref={rootRef}
            className={`text-size-picker ${className}`.trim()}
            onBlur={onRootBlur}
            {...restProps}
        >
            <input type="hidden" name={name} value={currentValue ?? ""} />

            <IconButton
                ref={buttonRef}
                baseClass="text-size-picker-button"
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
                        className="text-size-picker-icon"
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
                        <path d="M4 13 7.2 3h1.6L12 13M5.4 9.5h5.2" />
                    </svg>
                )}
            </IconButton>

            <Listbox
                ref={listRef}
                as="ul"
                baseClass="text-size-picker-list"
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
                {sizes.map((size, i) => (
                    <li
                        key={size}
                        className="text-size-picker-option"
                        id={optionId(i)}
                        role="option"
                        aria-selected={size === currentValue}
                        data-active={i === activeIndex ? "" : undefined}
                        onClick={() => choose(i)}
                    >
                        {labelFor(size)}
                    </li>
                ))}
            </Listbox>
        </div>
    );
}

export default TextSizePicker;
