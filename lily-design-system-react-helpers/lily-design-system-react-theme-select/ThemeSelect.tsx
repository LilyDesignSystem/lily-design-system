import * as React from "react";

/** Default button glyph: U+25D1 CIRCLE WITH RIGHT HALF BLACK. */
export const CIRCLE_WITH_RIGHT_HALF_BLACK = "◑";

/** Arguments passed to a custom `children` render prop (the button glyph). */
export type ChildArgs = {
    /** Currently selected theme slug. */
    value: string;
    /** Is the listbox open? */
    open: boolean;
    /** Resolve a slug to its display label. */
    labelFor: (theme: string) => string;
};

/** Public props for ThemeSelect. See `spec/index.md` §4 for the contract. */
export type Props = Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "children" | "defaultValue"
> & {
    /** Accessible name for the button and the listbox. */
    label: string;
    /** Base URL of the themes directory, e.g. "/assets/themes/". */
    themesUrl: string;
    /** Available theme slugs. */
    themes: string[];
    /** Currently selected theme slug. When supplied, the component is controlled. */
    value?: string;
    /** Initial theme when nothing else is supplied. */
    defaultValue?: string;
    /** If set, persist the selection to localStorage under this key. */
    storageKey?: string;
    /** Resolve `prefers-color-scheme` to a supported theme on first visit. */
    detectFromSystem?: boolean;
    /** Discriminates the managed `<link>`; also the hidden input's `name`. */
    name?: string;
    /** File extension appended to each slug when constructing the URL. */
    extension?: string;
    /** Element that receives `data-theme`. Defaults to document.documentElement. */
    target?: HTMLElement | null;
    /** Optional pretty labels per slug. */
    themeLabels?: Record<string, string>;
    /** Replaces the default half-circle glyph inside the button. */
    children?: (args: ChildArgs) => React.ReactNode;
    /** Called after the control applies a new theme. */
    onChange?: (theme: string) => void;
    /** Extra CSS class on the root. */
    className?: string;
};

/**
 * Resolve a theme slug to its display label: each hyphen-separated
 * word title-cased, so a slug like
 * "united-kingdom-national-health-service-england-for-patients"
 * renders as "United Kingdom National Health Service England For
 * Patients". Mirrors `localeName` in locale-select.
 */
export function themeName(theme: string): string {
    return theme
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * Resolve the OS colour-scheme preference to a supported theme slug.
 * Mirrors `matchNavigatorLanguage` in locale-select. Returns "" when
 * the preferred scheme is not in `themes`, or when matchMedia is
 * unavailable (SSR, and jsdom).
 */
export function matchSystemTheme(themes: readonly string[]): string {
    if (
        typeof window === "undefined" ||
        typeof window.matchMedia !== "function"
    ) {
        return "";
    }
    const wanted = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    return themes.includes(wanted) ? wanted : "";
}

/** Normalize the themes directory URL to end with exactly one "/". */
export function normalizeThemesUrl(themesUrl: string): string {
    return themesUrl.endsWith("/") ? themesUrl : themesUrl + "/";
}

/** Construct the href for a given theme slug. */
export function themeHref(
    themesUrl: string,
    slug: string,
    extension: string,
): string {
    return normalizeThemesUrl(themesUrl) + slug + extension;
}

function resolveInitialTheme(
    value: string | undefined,
    storageKey: string | undefined,
    detectFromSystem: boolean,
    defaultValue: string | undefined,
    themes: string[],
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
    if (detectFromSystem) {
        const match = matchSystemTheme(themes);
        if (match) return match;
    }
    if (defaultValue) return defaultValue;
    if (themes.includes("light")) return "light";
    return themes[0] ?? "";
}

/** Milliseconds of inactivity after which the typeahead buffer resets. */
const TYPEAHEAD_RESET_MS = 500;

export function ThemeSelect({
    label,
    themesUrl,
    themes,
    value,
    defaultValue,
    storageKey,
    detectFromSystem = false,
    name = "theme",
    extension = ".css",
    target,
    themeLabels = {},
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
    const baseId = `theme-select-${React.useId()}`;
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

    function labelFor(theme: string): string {
        if (theme in themeLabels) return themeLabels[theme];
        return themeName(theme);
    }

    function getManagedLink(): HTMLLinkElement {
        const selector = `link[data-lily-theme-select="${name}"]`;
        let link = document.head.querySelector<HTMLLinkElement>(selector);
        if (!link) {
            link = document.createElement("link");
            link.rel = "stylesheet";
            link.setAttribute("data-lily-theme-select", name);
            document.head.appendChild(link);
        }
        return link;
    }

    function applyTheme(slug: string): void {
        if (typeof document === "undefined" || !slug) return;
        getManagedLink().href = themeHref(themesUrl, slug, extension);
        (target ?? document.documentElement).setAttribute("data-theme", slug);
        if (storageKey) {
            try {
                localStorage.setItem(storageKey, slug);
            } catch {
                // ignore quota / privacy errors
            }
        }
        onChange?.(slug);
    }

    function setTheme(slug: string): void {
        if (isControlled) {
            // The consumer owns `value`; apply straight away so the DOM
            // stays in step even if they never write the value back.
            applyTheme(slug);
        } else {
            // The value-change effect below runs applyTheme, so the
            // theme is applied exactly once per change.
            setInternalValue(slug);
        }
    }

    // ---------------------------------------------------------------
    // Open / close
    // ---------------------------------------------------------------

    function openList(startIndex?: number): void {
        const selected = themes.indexOf(currentValue ?? "");
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
        const slug = themes[index];
        if (slug) setTheme(slug);
        closeList();
    }

    function scrollActiveIntoView(index: number): void {
        if (index < 0) return;
        const el = listRef.current?.children[index] as HTMLElement | undefined;
        // jsdom does not implement scrollIntoView.
        el?.scrollIntoView?.({ block: "nearest" });
    }

    function moveActive(delta: number): void {
        if (themes.length === 0) return;
        setActiveIndex((prev) =>
            Math.min(Math.max(prev + delta, 0), themes.length - 1),
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
            for (let n = 0; n < themes.length; n++) {
                const i = (from + n) % themes.length;
                if (labelFor(themes[i]).toLowerCase().startsWith(buffer)) {
                    return i;
                }
            }
            return prev;
        });
    }

    function onButtonKeyDown(event: React.KeyboardEvent<HTMLButtonElement>): void {
        switch (event.key) {
            case "ArrowDown":
            case "Enter":
            case " ":
                event.preventDefault();
                openList();
                break;
            case "ArrowUp":
                event.preventDefault();
                openList(themes.length - 1);
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
                setActiveIndex(themes.length - 1);
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

        const initial = resolveInitialTheme(
            currentValue || undefined,
            storageKey,
            detectFromSystem,
            defaultValue,
            themes,
        );
        if (!initial) return;

        if (isControlled) {
            applyTheme(initial);
        } else {
            // setInternalValue triggers another render; the value-change
            // effect below will run applyTheme.
            if (initial !== internalValue) {
                setInternalValue(initial);
            } else {
                applyTheme(initial);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Re-apply whenever the resolved value changes.
    React.useEffect(() => {
        if (!initialisedRef.current) return;
        if (!currentValue) return;
        applyTheme(currentValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentValue]);

    return (
        <div
            ref={rootRef}
            className={`theme-select ${className}`.trim()}
            onBlur={onRootBlur}
            {...restProps}
        >
            <input type="hidden" name={name} value={currentValue ?? ""} />

            <button
                ref={buttonRef}
                type="button"
                className="theme-select-button"
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
                    <span className="theme-select-icon" aria-hidden="true">
                        {CIRCLE_WITH_RIGHT_HALF_BLACK}
                    </span>
                )}
            </button>

            <ul
                ref={listRef}
                className="theme-select-list"
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
                {themes.map((theme, i) => (
                    <li
                        key={theme}
                        className="theme-select-option"
                        id={optionId(i)}
                        role="option"
                        aria-selected={theme === currentValue}
                        data-active={i === activeIndex ? "" : undefined}
                        onClick={() => choose(i)}
                    >
                        {labelFor(theme)}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ThemeSelect;
