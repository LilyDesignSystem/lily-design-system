// LocaleChooser client-side runtime.
//
// Pairs with locale-chooser.njk. The macro renders the markup with
// `data-lily-locale-chooser-*` hooks; this module picks them up in the
// browser and owns two things:
//
// A. The listbox INTERACTION (new in the icon-button release): open /
//    close, focus movement, the APG listbox keyboard contract, and
//    typeahead. None of this exists in the server markup — the button
//    is inert until this module runs. See docs/ssr.md.
//
// B. The locale LIFECYCLE (unchanged):
//   0. Read the consumer's `value` prop from
//      `data-lily-locale-chooser-value`. This is still the only channel
//      by which `opts.value` reaches the client, and it is still what
//      keeps the pre-hydration paint honest.
//   1. Set `target.lang = bcp47LocaleTag(code)`.
//   2. Optionally set `target.dir = isRtlLocale(code) ? "rtl" : "ltr"`.
//   3. Optionally persist to localStorage.
//   4. Mirror the active code into the hidden input (form participation)
//      and onto the options' aria-selected state.
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

/**
 * Default button glyph: U+1F310 GLOBE WITH MERIDIANS followed by
 * U+FE0E VARIATION SELECTOR-15, which requests the TEXT presentation.
 * Without VS15 browsers pick the colour-emoji font and the globe
 * renders blue, which does not match theme-chooser's monochrome ◑
 * (U+25D1 is not an emoji codepoint, so it needs no selector).
 */
export const GLOBE_WITH_MERIDIANS = "\u{1F310}︎";

/** How long the typeahead buffer survives between keystrokes, in ms. */
const TYPEAHEAD_RESET_MS = 500;

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

/** jsdom and older browsers do not always implement scrollIntoView. */
function scrollIntoViewIfPossible(el) {
    if (el && typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ block: "nearest" });
    }
}

// ---------------------------------------------------------------
// Init
// ---------------------------------------------------------------

/**
 * Wire one rendered LocaleChooser root.
 *
 * @param {HTMLElement} root - The <div data-lily-locale-chooser-root>.
 * @param {{onChange?: (code:string)=>void, target?: HTMLElement|null}=} opts
 * @returns {{setLocale: (code: string) => void, destroy: () => void}}
 */
export function initLocaleChooser(root, opts = {}) {
    const noop = { setLocale: () => {}, destroy: () => {} };
    if (typeof document === "undefined" || !root) return noop;

    const button = root.querySelector("[data-lily-locale-chooser-button]");
    const list = root.querySelector("[data-lily-locale-chooser-list]");
    const input = root.querySelector("[data-lily-locale-chooser-input]");
    if (!button || !list) return noop;

    const options = Array.from(list.querySelectorAll('[role="option"]'));
    const values = options.map((o) => o.getAttribute("data-value") || "");
    const labels = options.map((o) => (o.textContent || "").trim());

    const storageKey =
        root.getAttribute("data-lily-locale-chooser-storage-key") || "";
    const defaultValue =
        root.getAttribute("data-lily-locale-chooser-default-value") || "";
    const detectFromNavigator =
        root.getAttribute("data-lily-locale-chooser-detect-from-navigator") ===
        "true";
    const applyDir =
        root.getAttribute("data-lily-locale-chooser-apply-dir") !== "false";
    // The consumer's `value` prop. The macro emits it as a data
    // attribute rather than baking it into a control the browser would
    // paint before hydration.
    const valueAttr = root.getAttribute("data-lily-locale-chooser-value") || "";

    let current = "";
    let open = false;
    let activeIndex = -1;
    let typeahead = "";
    let typeaheadTimer;

    // -----------------------------------------------------------------
    // Applying a locale
    // -----------------------------------------------------------------

    function applyLocale(code) {
        if (!code) return;
        current = code;
        const target = opts.target || document.documentElement;
        target.setAttribute("lang", bcp47LocaleTag(code));
        if (applyDir) {
            target.setAttribute("dir", isRtlLocale(code) ? "rtl" : "ltr");
        }
        if (storageKey) safeStorageSet(storageKey, code);
        // The hidden input carries the value into any enclosing form.
        if (input) input.value = code;
        // Keep the listbox's selected state in sync with the applied locale.
        options.forEach((o, i) => {
            o.setAttribute("aria-selected", values[i] === code ? "true" : "false");
        });
        if (typeof opts.onChange === "function") opts.onChange(code);
    }

    // -----------------------------------------------------------------
    // Open / close / active-option movement
    // -----------------------------------------------------------------

    function setActive(index) {
        activeIndex = index;
        options.forEach((o, i) => {
            if (i === index) o.setAttribute("data-active", "");
            else o.removeAttribute("data-active");
        });
        if (index >= 0 && options[index]) {
            list.setAttribute("aria-activedescendant", options[index].id);
            scrollIntoViewIfPossible(options[index]);
        } else {
            list.removeAttribute("aria-activedescendant");
        }
    }

    function openList(startIndex) {
        const selected = values.indexOf(current);
        const start =
            typeof startIndex === "number"
                ? startIndex
                : selected >= 0
                  ? selected
                  : 0;
        open = true;
        list.hidden = false;
        button.setAttribute("aria-expanded", "true");
        setActive(start);
        // Focus moves to the listbox; the active option is conveyed via
        // aria-activedescendant, per the APG listbox pattern.
        list.focus();
    }

    function closeList(refocus = true) {
        if (!open) return;
        open = false;
        list.hidden = true;
        button.setAttribute("aria-expanded", "false");
        setActive(-1);
        if (refocus) button.focus();
    }

    function choose(index) {
        const code = values[index];
        if (code) applyLocale(code);
        closeList();
    }

    function moveActive(delta) {
        if (options.length === 0) return;
        // Clamp rather than wrap, matching the canonical Svelte helper.
        const next = Math.min(
            Math.max(activeIndex + delta, 0),
            options.length - 1,
        );
        setActive(next);
    }

    function runTypeahead(char) {
        typeahead += char.toLowerCase();
        clearTimeout(typeaheadTimer);
        typeaheadTimer = setTimeout(() => {
            typeahead = "";
        }, TYPEAHEAD_RESET_MS);
        const from = activeIndex < 0 ? 0 : activeIndex;
        // Search forward from the active option, wrapping once.
        for (let n = 0; n < options.length; n++) {
            const i = (from + n) % options.length;
            if (labels[i].toLowerCase().startsWith(typeahead)) {
                setActive(i);
                return;
            }
        }
    }

    // -----------------------------------------------------------------
    // Event handlers
    // -----------------------------------------------------------------

    function onButtonClick() {
        if (open) closeList();
        else openList();
    }

    function onButtonKeydown(event) {
        switch (event.key) {
            case "ArrowDown":
            case "Enter":
            case " ":
                event.preventDefault();
                openList();
                break;
            case "ArrowUp":
                event.preventDefault();
                openList(options.length - 1);
                break;
            default:
                break;
        }
    }

    function onListKeydown(event) {
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
                setActive(0);
                break;
            case "End":
                event.preventDefault();
                setActive(options.length - 1);
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

    function onListClick(event) {
        const li = event.target && event.target.closest
            ? event.target.closest('[role="option"]')
            : null;
        if (!li) return;
        const index = options.indexOf(li);
        if (index >= 0) choose(index);
    }

    function onRootFocusOut(event) {
        const next = event.relatedTarget;
        if (next && root.contains(next)) return;
        closeList(false);
    }

    function onDocumentClick(event) {
        if (!open) return;
        const t = event.target;
        if (t && !root.contains(t)) closeList(false);
    }

    button.addEventListener("click", onButtonClick);
    button.addEventListener("keydown", onButtonKeydown);
    list.addEventListener("keydown", onListKeydown);
    list.addEventListener("click", onListClick);
    root.addEventListener("focusout", onRootFocusOut);
    document.addEventListener("click", onDocumentClick);

    // -----------------------------------------------------------------
    // §5.2 initial value resolution
    // value attribute > storage > navigator > default > "en" > first
    // -----------------------------------------------------------------

    let initial = "";

    // 1. value prop — read from `data-lily-locale-chooser-value`.
    initial = valueAttr;

    // 2. storage
    if (!initial && storageKey) initial = safeStorageGet(storageKey) || "";

    // 3. navigator
    if (!initial && detectFromNavigator && typeof navigator !== "undefined") {
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

    return {
        setLocale: applyLocale,
        destroy: () => {
            clearTimeout(typeaheadTimer);
            button.removeEventListener("click", onButtonClick);
            button.removeEventListener("keydown", onButtonKeydown);
            list.removeEventListener("keydown", onListKeydown);
            list.removeEventListener("click", onListClick);
            root.removeEventListener("focusout", onRootFocusOut);
            document.removeEventListener("click", onDocumentClick);
        },
    };
}

/**
 * Find every [data-lily-locale-chooser-root] and wire it.
 *
 * @param {{onChange?: (code:string)=>void, target?: HTMLElement|null}=} opts
 * @returns {Array<{setLocale: (code:string)=>void, destroy: ()=>void}>}
 */
export function autoInit(opts = {}) {
    if (typeof document === "undefined") return [];
    const roots = Array.from(
        document.querySelectorAll("[data-lily-locale-chooser-root]"),
    );
    return roots.map((root) => initLocaleChooser(root, opts));
}
