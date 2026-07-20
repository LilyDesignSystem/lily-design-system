import * as React from "react";

/**
 * Default button glyph: U+0041 LATIN CAPITAL LETTER A.
 *
 * A plain letter rather than a pictograph, deliberately. The obvious
 * candidate — U+1F5DB DECREASE FONT SIZE SYMBOL — has no real glyph in
 * common font stacks and falls back to a crude bitmap shape, and it
 * means *decrease* rather than *size*. "A" renders in the page's own
 * font on every platform, stays monochrome like theme-select's ◑, and
 * is the conventional text-size affordance.
 */
export const LATIN_CAPITAL_LETTER_A = "A";

/** Arguments passed to a custom `children` render prop (the button glyph). */
export type ChildArgs = {
    /** Currently selected size slug. */
    value: string;
    /** Is the listbox open? */
    open: boolean;
    /** Resolve a slug to its display label. */
    labelFor: (size: string) => string;
};

/** Public props for TextSizeSelect. See `spec/index.md` §4 for the contract. */
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
    /** Replaces the default "A" glyph inside the button. */
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
 * in theme-select and `localeName` in locale-select. The word "default"
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

/** Milliseconds of inactivity after which the typeahead buffer resets. */
const TYPEAHEAD_RESET_MS = 500;

export function TextSizeSelect({
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
    const baseId = `text-size-select-${React.useId()}`;
    const listId = `${baseId}-list`;
    const optionId = (i: number) => `${baseId}-option-${i}`;

    const [open, setOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(-1);

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    const listRef = React.useRef<HTMLUListElement | null>(null);

    // Set when a close should hand focus back to the button.
    const refocusRef = React.useRef(false);

    // Typeahead buffer: APG listbox behaviour. Reset after a pause.
    const typeaheadRef = React.useRef("");
    const typeaheadTimerRef = React.useRef<ReturnType<typeof setTimeout>>(
        undefined as unknown as ReturnType<typeof setTimeout>,
    );

    function labelFor(size: string): string {
        if (size in sizeLabels) return sizeLabels[size];
        return sizeName(size);
    }

    function applySize(slug: string): void {
        if (typeof document === "undefined" || !slug) return;
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
        setActiveIndex(startIndex ?? (selected >= 0 ? selected : 0));
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

    function moveActive(delta: number): void {
        if (sizes.length === 0) return;
        setActiveIndex((prev) =>
            Math.min(Math.max(prev + delta, 0), sizes.length - 1),
        );
    }

    function runTypeahead(char: string): void {
        typeaheadRef.current += char.toLowerCase();
        clearTimeout(typeaheadTimerRef.current);
        typeaheadTimerRef.current = setTimeout(() => {
            typeaheadRef.current = "";
        }, TYPEAHEAD_RESET_MS);
        const buffer = typeaheadRef.current;
        setActiveIndex((prev) => {
            const from = prev < 0 ? 0 : prev;
            // Search forward from the active option, wrapping once.
            for (let n = 0; n < sizes.length; n++) {
                const i = (from + n) % sizes.length;
                if (labelFor(sizes[i]).toLowerCase().startsWith(buffer)) {
                    return i;
                }
            }
            return prev;
        });
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

    function onListKeyDown(event: React.KeyboardEvent<HTMLUListElement>): void {
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                moveActive(1);
                break;
            case "ArrowUp":
                event.preventDefault();
                moveActive(-1);
                break;
            case "Home":
                event.preventDefault();
                setActiveIndex(0);
                break;
            case "End":
                event.preventDefault();
                setActiveIndex(sizes.length - 1);
                break;
            case "Enter":
            case " ":
                event.preventDefault();
                if (activeIndex >= 0) choose(activeIndex);
                break;
            case "Escape":
                event.preventDefault();
                closeList();
                break;
            case "Tab":
                // Tab moves on: close without stealing focus back.
                closeList(false);
                break;
            default:
                if (
                    event.key.length === 1 &&
                    !event.ctrlKey &&
                    !event.metaKey &&
                    !event.altKey
                ) {
                    runTypeahead(event.key);
                }
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
            listRef.current?.focus();
        } else if (refocusRef.current) {
            refocusRef.current = false;
            buttonRef.current?.focus();
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

    // Drop any pending typeahead timer on unmount.
    React.useEffect(() => {
        return () => clearTimeout(typeaheadTimerRef.current);
    }, []);

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
            className={`text-size-select ${className}`.trim()}
            onBlur={onRootBlur}
            {...restProps}
        >
            <input type="hidden" name={name} value={currentValue ?? ""} />

            <button
                ref={buttonRef}
                type="button"
                className="text-size-select-button"
                aria-label={label}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => (open ? closeList() : openList())}
                onKeyDown={onButtonKeyDown}
            >
                {children ? (
                    children({ value: currentValue ?? "", open, labelFor })
                ) : (
                    <span className="text-size-select-icon" aria-hidden="true">
                        {LATIN_CAPITAL_LETTER_A}
                    </span>
                )}
            </button>

            <ul
                ref={listRef}
                className="text-size-select-list"
                id={listId}
                role="listbox"
                aria-label={label}
                aria-activedescendant={
                    open && activeIndex >= 0 ? optionId(activeIndex) : undefined
                }
                tabIndex={-1}
                hidden={!open}
                onKeyDown={onListKeyDown}
            >
                {sizes.map((size, i) => (
                    <li
                        key={size}
                        className="text-size-select-option"
                        id={optionId(i)}
                        role="option"
                        aria-selected={size === currentValue}
                        data-active={i === activeIndex ? "" : undefined}
                        onClick={() => choose(i)}
                    >
                        {labelFor(size)}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TextSizeSelect;
