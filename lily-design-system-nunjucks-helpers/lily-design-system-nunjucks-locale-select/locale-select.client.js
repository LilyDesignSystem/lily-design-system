// LocaleSelect client-side runtime.
//
// Pairs with locale-select.njk. The macro renders the markup with
// `data-lily-locale-select-*` hooks; this module picks them up in
// the browser and owns the lifecycle:
//
//   1. Set `target.lang = bcp47LocaleTag(code)`.
//   2. Optionally set `target.dir = isRtlLocale(code) ? "rtl" : "ltr"`.
//   3. Optionally persist to localStorage.
//   4. Mirror the active code onto the <select> value (select the option).
//   5. Call opts.onChange(code).
//
// See spec/index.md §4.3 (client.js exports), §5 (behaviour).
//
// `defaultLocaleLabels` and the RTL sets are re-exported from
// `./locales.js` (TypeScript-emitted; vitest / Vite resolves to
// `./locales.ts` at test time). Production-browser consumers who
// don't run through a bundler should compile `locales.ts` → `.js`
// or replace the import with a hand-written `locales.js`.

import {
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
} from "./locales.js";

export { defaultLocaleLabels, RTL_LANGUAGE_TAGS, RTL_SCRIPT_SUBTAGS };

// ---------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------

/** Convert a locale code to its BCP 47 hyphen form. */
export function bcp47LocaleTag(locale) {
    return (locale || "").replace(/_/g, "-");
}

/** Detect whether a locale is right-to-left. See spec/index.md §5.6. */
export function isRtlLocale(locale) {
    if (!locale) return false;
    const parts = locale.split(/[-_]/);
    for (const part of parts) {
        if (RTL_SCRIPT_SUBTAGS.has(part.toLowerCase())) return true;
    }
    const base = (parts[0] || "").toLowerCase();
    return RTL_LANGUAGE_TAGS.has(base);
}

/** Resolve a locale code to its English name via the built-in table. */
export function localeName(locale) {
    return defaultLocaleLabels[locale] || locale;
}

/** Match a navigator preference against a supported-locales list. */
export function matchNavigatorLanguage(navLangs, locales) {
    const lc = (s) => s.toLowerCase().replace(/_/g, "-");
    const localesLc = locales.map(lc);
    for (const raw of navLangs) {
        const nav = lc(raw);

        // 1. Exact match (treating - and _ as equivalent).
        const exactIndex = localesLc.indexOf(nav);
        if (exactIndex !== -1) return locales[exactIndex];

        // 2. Language-only match.
        const navBase = nav.split("-")[0];
        for (let i = 0; i < locales.length; i++) {
            const base = localesLc[i].split("-")[0];
            if (base === navBase) return locales[i];
        }
    }
    return "";
}

// ---------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------

function safeStorageGet(key) {
    try {
        return localStorage.getItem(key);
    } catch (_e) {
        return null;
    }
}

function safeStorageSet(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (_e) {
        // ignore quota / privacy errors
    }
}

function optionValues(select) {
    return Array.from(select.options).map((o) => o.value);
}

// ---------------------------------------------------------------
// Init
// ---------------------------------------------------------------

/**
 * Wire one rendered LocaleSelect fieldset.
 *
 * @param {HTMLSelectElement} root - The <select data-lily-locale-select-root>.
 * @param {{onChange?: (code:string)=>void, target?: HTMLElement|null}=} opts
 * @returns {{setLocale: (code: string) => void, destroy: () => void}}
 */
export function initLocaleSelect(root, opts = {}) {
    if (typeof document === "undefined" || !root) {
        return { setLocale: () => {}, destroy: () => {} };
    }

    const storageKey =
        root.getAttribute("data-lily-locale-select-storage-key") || "";
    const defaultValue =
        root.getAttribute("data-lily-locale-select-default-value") || "";
    const detectFromNavigator =
        root.getAttribute("data-lily-locale-select-detect-from-navigator") ===
        "true";
    const applyDir =
        root.getAttribute("data-lily-locale-select-apply-dir") !== "false";

    function applyLocale(code) {
        if (!code) return;
        const target = opts.target || document.documentElement;
        target.setAttribute("lang", bcp47LocaleTag(code));
        if (applyDir) {
            target.setAttribute("dir", isRtlLocale(code) ? "rtl" : "ltr");
        }
        if (storageKey) safeStorageSet(storageKey, code);
        // Select the option matching the active code.
        root.value = code;
        if (typeof opts.onChange === "function") opts.onChange(code);
    }

    // §5.2 initial value resolution
    const values = optionValues(root);

    let initial = "";

    // 1. value prop — rendered as the `selected` option by the macro.
    // Read `defaultSelected` (reflects the HTML `selected` attribute);
    // `root.value` is unreliable here because a <select> reports its
    // first option as the value even when none is explicitly selected.
    const selectedOption = Array.from(root.options).find(
        (o) => o.defaultSelected,
    );
    if (selectedOption) initial = selectedOption.value;

    // 2. storage
    if (!initial && storageKey) initial = safeStorageGet(storageKey) || "";

    // 3. navigator
    if (
        !initial &&
        detectFromNavigator &&
        typeof navigator !== "undefined"
    ) {
        const navLangs =
            navigator.languages && navigator.languages.length > 0
                ? Array.from(navigator.languages)
                : navigator.language
                  ? [navigator.language]
                  : [];
        initial = matchNavigatorLanguage(navLangs, values);
    }

    // 4. default-value
    if (!initial && defaultValue) initial = defaultValue;

    // 5. "en" if present
    if (!initial && values.includes("en")) initial = "en";

    // 6. first option
    if (!initial && values.length > 0) initial = values[0];

    if (initial) applyLocale(initial);

    function onChange(e) {
        const target = e.target;
        if (
            target &&
            target.tagName === "SELECT" &&
            typeof target.value === "string"
        ) {
            applyLocale(target.value);
        }
    }
    root.addEventListener("change", onChange);

    return {
        setLocale: applyLocale,
        destroy: () => root.removeEventListener("change", onChange),
    };
}

/**
 * Find every [data-lily-locale-select-root] and wire it.
 *
 * @param {{onChange?: (code:string)=>void, target?: HTMLElement|null}=} opts
 * @returns {Array<{setLocale: (code:string)=>void, destroy: ()=>void}>}
 */
export function autoInit(opts = {}) {
    if (typeof document === "undefined") return [];
    const roots = Array.from(
        document.querySelectorAll("[data-lily-locale-select-root]"),
    );
    return roots.map((root) => initLocaleSelect(root, opts));
}
