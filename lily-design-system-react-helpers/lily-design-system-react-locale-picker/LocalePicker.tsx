import * as React from "react";
import {
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
} from "./locales.js";

/**
 * Default button glyph: U+1F310 GLOBE WITH MERIDIANS followed by
 * U+FE0E VARIATION SELECTOR-15.
 *
 * VS15 requests *text* presentation. Without it the browser picks the
 * colour-emoji font and the globe renders blue, which does not match
 * theme-picker's monochrome ◑ — the two controls sit next to each
 * other in a page header and should read as one set.
 */
export const GLOBE_WITH_MERIDIANS = "\u{1F310}\uFE0E";

/** Arguments passed to a custom `children` render prop (the button glyph). */
export type ChildArgs = {
    /** Currently selected locale code (consumer form, not BCP 47-normalised). */
    value: string;
    /** Is the listbox open? */
    open: boolean;
    /** Resolve a locale code to its display label. */
    labelFor: (locale: string) => string;
};

/** Public props for LocalePicker. See `spec/index.md` §4 for the contract. */
export type Props = Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "children" | "defaultValue"
> & {
    /** Accessible name for the button and the listbox. */
    label: string;
    /** Available locale codes. */
    locales: string[];
    /** Currently selected locale code. When supplied, the component is controlled. */
    value?: string;
    /** Initial locale when nothing else is supplied. */
    defaultValue?: string;
    /** If set, persist the selection to localStorage under this key. */
    storageKey?: string;
    /** Resolve `navigator.languages` to a supported locale on first visit. */
    detectFromNavigator?: boolean;
    /** `name` of the hidden input that carries the value in a form. */
    name?: string;
    /** Element that receives `lang` and `dir`. Defaults to document.documentElement. */
    target?: HTMLElement | null;
    /** If false, the control only writes `lang` and never touches `dir`. */
    applyDir?: boolean;
    /** Optional pretty labels per locale code. */
    localeLabels?: Record<string, string>;
    /** Replaces the default globe glyph inside the button. */
    children?: (args: ChildArgs) => React.ReactNode;
    /** Called after the control applies a new locale. */
    onChange?: (locale: string) => void;
    /** Extra CSS class on the root. */
    className?: string;
};

// ------------------------------------------------------------------
// Pure helpers (exported so consumers can reuse them)
// ------------------------------------------------------------------

/** Convert a locale code to its BCP 47 hyphen form. */
export function bcp47LocaleTag(locale: string): string {
    return locale.replace(/_/g, "-");
}

/** Detect whether a locale is right-to-left. See spec/index.md §5.6. */
export function isRtlLocale(locale: string): boolean {
    if (!locale) return false;
    const parts = locale.split(/[-_]/);
    for (const part of parts) {
        if (RTL_SCRIPT_SUBTAGS.has(part.toLowerCase())) return true;
    }
    const base = parts[0]?.toLowerCase() ?? "";
    return RTL_LANGUAGE_TAGS.has(base);
}

/** Resolve a locale code to its English name via the built-in table. */
export function localeName(locale: string): string {
    return defaultLocaleLabels[locale] ?? locale;
}

/**
 * The language's own name for itself — "de" → "Deutsch", "cy" →
 * "Cymraeg" — from `Intl.DisplayNames` asked *in that language*.
 *
 * Endonyms are the right default for a language menu: the user who
 * needs it most is the one lost in a UI that is not in their
 * language, and they recognise "Cymraeg" where "Welsh" means
 * nothing to them. Deterministic (no `navigator` dependency), so
 * the server and the client render the same label. Returns "" when
 * the runtime has no data — some runtimes echo the tag back instead
 * of failing, and an echo is not a name.
 */
export function localeEndonym(locale: string): string {
    try {
        const tag = bcp47LocaleTag(locale);
        const dn = new Intl.DisplayNames([tag], { type: "language" });
        const found = dn.of(tag) ?? "";
        return found && found.toLowerCase() !== tag.toLowerCase()
            ? found
            : "";
    } catch {
        return "";
    }
}

/** Re-export the built-in label table and RTL sets for convenience. */
export { defaultLocaleLabels, RTL_LANGUAGE_TAGS, RTL_SCRIPT_SUBTAGS };

/** Opportunistic Intl.DisplayNames lookup; never throws. */
function intlDisplayName(locale: string): string {
    try {
        const env =
            typeof navigator !== "undefined" && navigator.language
                ? navigator.language
                : "en";
        const dn = new Intl.DisplayNames([env], { type: "language" });
        return dn.of(bcp47LocaleTag(locale)) ?? "";
    } catch {
        return "";
    }
}

/** Match a navigator preference against a supported-locales list. */
export function matchNavigatorLanguage(
    navLangs: readonly string[],
    locales: readonly string[],
): string | "" {
    const lc = (s: string) => s.toLowerCase().replace(/_/g, "-");
    const localesLc = locales.map(lc);
    for (const raw of navLangs) {
        const nav = lc(raw);

        // 1. Exact match (treating - and _ as equivalent).
        const exactIndex = localesLc.indexOf(nav);
        if (exactIndex !== -1) return locales[exactIndex];

        // 2. Language-only match: pick the first locale whose
        //    base language matches the navigator's base language.
        const navBase = nav.split("-")[0];
        for (let i = 0; i < locales.length; i++) {
            const base = localesLc[i].split("-")[0];
            if (base === navBase) return locales[i];
        }
    }
    return "";
}

function resolveInitialLocale(
    value: string | undefined,
    storageKey: string | undefined,
    detectFromNavigator: boolean,
    defaultValue: string | undefined,
    locales: string[],
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
    if (detectFromNavigator && typeof navigator !== "undefined") {
        const navLangs =
            navigator.languages && navigator.languages.length > 0
                ? Array.from(navigator.languages)
                : navigator.language
                  ? [navigator.language]
                  : [];
        const match = matchNavigatorLanguage(navLangs, locales);
        if (match) return match;
    }
    if (defaultValue) return defaultValue;
    if (locales.includes("en")) return "en";
    return locales[0] ?? "";
}

/** Milliseconds of inactivity after which the typeahead buffer resets. */
const TYPEAHEAD_RESET_MS = 500;

export function LocalePicker({
    label,
    locales,
    value,
    defaultValue,
    storageKey,
    detectFromNavigator = false,
    name = "locale",
    target,
    applyDir = true,
    localeLabels = {},
    children,
    onChange,
    className = "",
    ...restProps
}: Props): React.ReactElement {
    const isControlled = value !== undefined;

    const [internalValue, setInternalValue] = React.useState<string>(
        isControlled ? value : "",
    );

    const currentValue = isControlled ? value : internalValue;

    // `useId` is stable across server and client render, so the option
    // ids survive hydration. No Math.random / Date.now.
    const baseId = `locale-picker-${React.useId()}`;
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

    function labelFor(locale: string): string {
        if (locale in localeLabels) return localeLabels[locale];
        // Endonym first: a language menu names each language in itself,
        // because the user who needs the menu is the one who cannot read
        // the page's language. The English table and the environment
        // lookup are fallbacks for runtimes without DisplayNames data.
        const endonym = localeEndonym(locale);
        if (endonym) return endonym;
        if (locale in defaultLocaleLabels) return defaultLocaleLabels[locale];
        const intl = intlDisplayName(locale);
        if (intl) return intl;
        return locale;
    }

    /**
     * The `lang` attribute for one option — a claim about the language
     * of the option's TEXT, made only when the text is the endonym we
     * derived ourselves. A consumer label or the English fallback is in
     * whatever language the consumer's UI speaks, and claiming otherwise
     * sends a screen reader's speech engine to the wrong voice: the
     * English word "Arabic" read out by an Arabic synthesizer.
     */
    function optionLang(locale: string): string | undefined {
        if (locale in localeLabels) return undefined;
        return localeEndonym(locale) ? bcp47LocaleTag(locale) : undefined;
    }

    function applyLocale(code: string): void {
        if (typeof document === "undefined" || !code) return;
        const root = target ?? document.documentElement;
        root.setAttribute("lang", bcp47LocaleTag(code));
        if (applyDir) {
            root.setAttribute("dir", isRtlLocale(code) ? "rtl" : "ltr");
        }
        if (storageKey) {
            try {
                localStorage.setItem(storageKey, code);
            } catch {
                // ignore quota / privacy errors
            }
        }
        onChange?.(code);
    }

    function setLocale(code: string): void {
        if (isControlled) {
            // The consumer owns `value`; apply straight away so the DOM
            // stays in step even if they never write the value back.
            applyLocale(code);
        } else {
            // The value-change effect below runs applyLocale, so the
            // locale is applied exactly once per change.
            setInternalValue(code);
        }
    }

    // ---------------------------------------------------------------
    // Open / close
    // ---------------------------------------------------------------

    function openList(startIndex?: number): void {
        const selected = locales.indexOf(currentValue ?? "");
        // An empty list has no option to activate; -1 keeps
        // aria-activedescendant off rather than pointing at an id that
        // does not exist.
        setActiveIndex(
            locales.length === 0
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
        const code = locales[index];
        if (code) setLocale(code);
        closeList();
    }

    function scrollActiveIntoView(index: number): void {
        if (index < 0) return;
        const el = listRef.current?.children[index] as HTMLElement | undefined;
        // jsdom does not implement scrollIntoView.
        el?.scrollIntoView?.({ block: "nearest" });
    }

    function moveActive(delta: number): void {
        if (locales.length === 0) return;
        setActiveIndex((prev) =>
            Math.min(Math.max(prev + delta, 0), locales.length - 1),
        );
    }

    function runTypeahead(char: string): void {
        const lower = char.toLowerCase();
        // APG listbox typeahead: a single character moves to the NEXT
        // option starting with it, and repeating that character keeps
        // cycling. Only a buffer of differing characters refines the
        // match, and that buffer stays anchored on the active option.
        const sameCharRun =
            typeaheadRef.current === "" ||
            [...typeaheadRef.current].every((c) => c === lower);
        typeaheadRef.current += lower;
        clearTimeout(typeaheadTimerRef.current);
        typeaheadTimerRef.current = setTimeout(() => {
            typeaheadRef.current = "";
        }, TYPEAHEAD_RESET_MS);
        const query = sameCharRun ? lower : typeaheadRef.current;
        setActiveIndex((prev) => {
            const anchor = prev < 0 ? 0 : prev;
            const start = sameCharRun ? anchor + 1 : anchor;
            // Search forward, wrapping once — typeahead wraps even though
            // the arrows clamp, or options above the cursor would be
            // untypable.
            for (let n = 0; n < locales.length; n++) {
                const i = (start + n) % locales.length;
                if (labelFor(locales[i]).toLowerCase().startsWith(query)) {
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
                openList(locales.length - 1);
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
                setActiveIndex(locales.length - 1);
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
            case "PageUp":
                event.preventDefault();
                moveActive(-10);
                break;
            case "PageDown":
                // ±10, clamped: an APG-optional key for long locale lists.
                event.preventDefault();
                moveActive(10);
                break;
            case "Tab":
                // Tab moves on — but focus goes to the button FIRST,
                // without cancelling the key. Hiding the focused list
                // drops focus to <body>, and the browser then computes
                // the default Tab move from the top of the document, so
                // tabbing out of an open picker teleported the user to
                // the page's first tab stop. From the button, the default
                // Tab lands exactly where leaving the picker should.
                buttonRef.current?.focus?.();
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

        const initial = resolveInitialLocale(
            currentValue || undefined,
            storageKey,
            detectFromNavigator,
            defaultValue,
            locales,
        );
        if (!initial) return;

        if (isControlled) {
            applyLocale(initial);
        } else {
            if (initial !== internalValue) {
                setInternalValue(initial);
            } else {
                applyLocale(initial);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Re-apply whenever the resolved value changes (controlled prop
    // changes from outside, or internal state changes after mount).
    React.useEffect(() => {
        if (!initialisedRef.current) return;
        if (!currentValue) return;
        applyLocale(currentValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentValue]);

    return (
        <div
            ref={rootRef}
            className={`locale-picker ${className}`.trim()}
            onBlur={onRootBlur}
            {...restProps}
        >
            <input type="hidden" name={name} value={currentValue ?? ""} />

            <button
                ref={buttonRef}
                type="button"
                className="locale-picker-button"
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
                    <span className="locale-picker-icon" aria-hidden="true">
                        {GLOBE_WITH_MERIDIANS}
                    </span>
                )}
            </button>

            <ul
                ref={listRef}
                className="locale-picker-list"
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
                {locales.map((locale, i) => (
                    <li
                        key={locale}
                        className="locale-picker-option"
                        id={optionId(i)}
                        role="option"
                        aria-selected={locale === currentValue}
                        data-active={i === activeIndex ? "" : undefined}
                        lang={optionLang(locale)}
                        onClick={() => choose(i)}
                    >
                        {labelFor(locale)}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LocalePicker;
