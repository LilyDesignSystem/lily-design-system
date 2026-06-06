import * as React from "react";
import {
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
} from "./locales.js";

/** Arguments passed to a custom `children` render prop. */
export type ChildArgs = {
    /** The locale codes to render as options. */
    locales: string[];
    /** Currently selected locale code (consumer form, not BCP 47-normalised). */
    value: string;
    /** Apply a locale imperatively (also updates internal state / triggers onChange). */
    setLocale: (locale: string) => void;
    /** Shared `name` attribute for the radio inputs. */
    name: string;
    /** Resolve a locale code to its display label. */
    labelFor: (locale: string) => string;
    /** BCP 47 hyphen-form of a locale code (`en_US` → `en-US`). */
    tagFor: (locale: string) => string;
    /** Is the locale right-to-left? */
    isRtl: (locale: string) => boolean;
};

/** Public props for LocalePicker. See `spec.md` §4 for the contract. */
export type Props = Omit<
    React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
    "onChange" | "children"
> & {
    /** Accessible label for the radiogroup. */
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
    /** `name` attribute shared by the radio inputs. */
    name?: string;
    /** Element that receives `lang` and `dir`. Defaults to document.documentElement. */
    target?: HTMLElement | null;
    /** If false, the picker only writes `lang` and never touches `dir`. */
    applyDir?: boolean;
    /** Optional pretty labels per locale code. */
    localeLabels?: Record<string, string>;
    /** Custom render prop for the options. */
    children?: (args: ChildArgs) => React.ReactNode;
    /** Called after the picker applies a new locale. */
    onChange?: (locale: string) => void;
    /** Extra CSS class on the <fieldset> root. */
    className?: string;
};

// ------------------------------------------------------------------
// Pure helpers (exported so consumers can reuse them)
// ------------------------------------------------------------------

/** Convert a locale code to its BCP 47 hyphen form. */
export function bcp47LocaleTag(locale: string): string {
    return locale.replace(/_/g, "-");
}

/** Detect whether a locale is right-to-left. See spec.md §5.6. */
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

    function labelFor(locale: string): string {
        if (locale in localeLabels) return localeLabels[locale];
        if (locale in defaultLocaleLabels) return defaultLocaleLabels[locale];
        const intl = intlDisplayName(locale);
        if (intl) return intl;
        return locale;
    }

    function tagFor(locale: string): string {
        return bcp47LocaleTag(locale);
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
        if (!isControlled) setInternalValue(code);
        applyLocale(code);
    }

    // Resolve initial value on mount.
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

    function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setLocale(e.target.value);
    }

    return (
        <fieldset
            className={`locale-picker ${className}`.trim()}
            role="radiogroup"
            aria-label={label}
            {...restProps}
        >
            {children
                ? children({
                      locales,
                      value: currentValue ?? "",
                      setLocale,
                      name,
                      labelFor,
                      tagFor,
                      isRtl: isRtlLocale,
                  })
                : locales.map((locale) => (
                      <label
                          key={locale}
                          className="locale-picker-option"
                          lang={tagFor(locale)}
                      >
                          <input
                              type="radio"
                              name={name}
                              value={locale}
                              checked={currentValue === locale}
                              onChange={onInputChange}
                          />
                          <span className="locale-picker-option-label">
                              {labelFor(locale)}
                          </span>
                      </label>
                  ))}
        </fieldset>
    );
}

export default LocalePicker;
