<script lang="ts" module>
    import type { Snippet } from "svelte";
    import {
        defaultLocaleLabels,
        RTL_LANGUAGE_TAGS,
        RTL_SCRIPT_SUBTAGS,
    } from "./locales.js";

    /** Arguments passed to a custom `children` snippet. */
    export type ChildArgs = {
        /** The locale codes to render as `<option>` elements. */
        locales: string[];
        /** Currently selected locale code (consumer form, not BCP 47-normalised). */
        value: string;
        /** Apply a locale imperatively (also writes back to `value`). */
        setLocale: (locale: string) => void;
        /** `name` attribute of the `<select>`. */
        name: string;
        /** Resolve a locale code to its display label. */
        labelFor: (locale: string) => string;
        /** BCP 47 hyphen-form of a locale code (`en_US` → `en-US`). */
        tagFor: (locale: string) => string;
        /** Is the locale right-to-left? */
        isRtl: (locale: string) => boolean;
    };

    /** Public props for LocaleSelect. See `spec/index.md` §4 for the contract. */
    export type Props = {
        /** Accessible label for the `<select>`. */
        label: string;
        /** Available locale codes. */
        locales: string[];
        /** Currently selected locale code. Two-way bindable. */
        value?: string;
        /** Initial locale when nothing else is supplied. */
        defaultValue?: string;
        /** If set, persist the selection to localStorage under this key. */
        storageKey?: string;
        /** Resolve `navigator.languages` to a supported locale on first visit. */
        detectFromNavigator?: boolean;
        /** `name` attribute of the `<select>`. */
        name?: string;
        /** Element that receives `lang` and `dir`. Defaults to document.documentElement. */
        target?: HTMLElement | null;
        /** If false, the select only writes `lang` and never touches `dir`. */
        applyDir?: boolean;
        /** Optional pretty labels per locale code. */
        localeLabels?: Record<string, string>;
        /** Custom rendering of the `<option>` elements. */
        children?: Snippet<[ChildArgs]>;
        /** Called after the select applies a new locale. */
        onChange?: (locale: string) => void;
        /** Extra CSS class on the `<select>` root. */
        class?: string;
        /** Spread props onto the root `<select>`. */
        [key: string]: unknown;
    };

    // ---------------------------------------------------------------
    // Pure helpers (exported so consumers can reuse them)
    // ---------------------------------------------------------------

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
</script>

<script lang="ts">
    let {
        class: className = "",
        label,
        locales,
        value = $bindable(""),
        defaultValue,
        storageKey,
        detectFromNavigator = false,
        name = "locale",
        target,
        applyDir = true,
        localeLabels = {},
        children,
        onChange,
        ...restProps
    }: Props = $props();

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
        value = code;
    }

    let initialised = false;

    $effect(() => {
        const current = value;

        if (!initialised) {
            initialised = true;
            let initial = current;

            if (!initial && storageKey) {
                try {
                    initial = localStorage.getItem(storageKey) ?? "";
                } catch {
                    // ignore privacy errors
                }
            }

            if (!initial && detectFromNavigator && typeof navigator !== "undefined") {
                const navLangs =
                    navigator.languages && navigator.languages.length > 0
                        ? Array.from(navigator.languages)
                        : navigator.language
                          ? [navigator.language]
                          : [];
                initial = matchNavigatorLanguage(navLangs, locales);
            }

            if (!initial) {
                initial =
                    defaultValue ??
                    (locales.includes("en") ? "en" : locales[0]) ??
                    "";
            }

            if (initial && initial !== current) {
                value = initial;
                return;
            }
        }

        if (current) applyLocale(current);
    });
</script>

<select
    class={`locale-select ${className}`.trim()}
    aria-label={label}
    {name}
    bind:value
    {...restProps}
>
    {#if children}
        {@render children({
            locales,
            value: value ?? "",
            setLocale,
            name,
            labelFor,
            tagFor,
            isRtl: isRtlLocale,
        })}
    {:else}
        {#each locales as locale (locale)}
            <option class="locale-select-option" value={locale} lang={tagFor(locale)}
                >{labelFor(locale)}</option
            >
        {/each}
    {/if}
</select>
