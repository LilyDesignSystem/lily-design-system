// ThemeChooser client-side runtime.
//
// Pairs with theme-chooser.njk. The macro renders the markup with
// `data-lily-theme-chooser-*` hooks; this module picks them up in the
// browser and owns two things:
//
// A. The listbox INTERACTION (new in the icon-button release): open /
//    close, focus movement, the APG listbox keyboard contract, and
//    typeahead. None of this exists in the server markup — the button
//    is inert until this module runs. See docs/ssr.md.
//
// B. The theme LIFECYCLE (unchanged):
//   0. Read the consumer's `value` prop from
//      `data-lily-theme-chooser-value`. This is still the only channel
//      by which `opts.value` reaches the client, and it is still what
//      keeps the pre-hydration paint honest.
//   1. Inject/update a managed <link rel="stylesheet"> in <head>.
//   2. Set data-theme="<slug>" on the resolved target (default <html>).
//   3. Optionally persist to localStorage.
//   4. Mirror the active slug into the hidden input (form participation)
//      and onto the options' aria-selected state.
//   5. Call opts.onChange(slug).
//
// See spec/index.md §4.3 (client.js exports), §5 (behaviour).

/** Default button glyph: U+25D1 CIRCLE WITH RIGHT HALF BLACK. */
export const CIRCLE_WITH_RIGHT_HALF_BLACK = "\u25D1";

/** How long the typeahead buffer survives between keystrokes, in ms. */
const TYPEAHEAD_RESET_MS = 500;

/**
 * Resolve a theme slug to its display label: each hyphen-separated word
 * title-cased, so a slug like
 * "united-kingdom-national-health-service-england-for-patients" renders
 * as "United Kingdom National Health Service England For Patients".
 *
 * Mirrors `localeName` in locale-chooser. This is the JS statement of the
 * rule the macro applies with `| replace(r/-/g, " ") | title`; a Nunjucks
 * macro cannot call into this module, so the two are kept in agreement by
 * a test rather than by delegation.
 */
export function themeName(theme) {
    return String(theme || "")
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * Resolve the OS colour-scheme preference to a supported theme slug.
 * Mirrors `matchNavigatorLanguage` in locale-chooser. Returns "" when the
 * preferred scheme is not in `themes`, or when matchMedia is unavailable
 * (SSR, and jsdom, which does not implement it either).
 */
export function matchSystemTheme(themes) {
    if (
        typeof window === "undefined" ||
        typeof window.matchMedia !== "function"
    ) {
        return "";
    }
    const wanted = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    return (themes || []).includes(wanted) ? wanted : "";
}

/** Normalise a themes-directory URL to end with exactly one "/". */
export function normaliseThemesUrl(themesUrl) {
    if (!themesUrl) return "/";
    return themesUrl.endsWith("/") ? themesUrl : themesUrl + "/";
}

/** Construct the href for a given theme slug. */
export function themeHref(themesUrl, slug, extension) {
    return normaliseThemesUrl(themesUrl) + slug + (extension || ".css");
}

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

function getManagedLink(name) {
    const selector = `link[data-lily-theme-chooser="${name}"]`;
    let link = document.head.querySelector(selector);
    if (!link) {
        link = document.createElement("link");
        link.rel = "stylesheet";
        link.setAttribute("data-lily-theme-chooser", name);
        document.head.appendChild(link);
    }
    return link;
}

/** jsdom and older browsers do not always implement scrollIntoView. */
function scrollIntoViewIfPossible(el) {
    if (el && typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ block: "nearest" });
    }
}

/**
 * Wire one rendered ThemeChooser root.
 *
 * @param {HTMLElement} root - The <div data-lily-theme-chooser-root>.
 * @param {{onChange?: (slug:string)=>void, target?: HTMLElement|null}=} opts
 * @returns {{setTheme: (slug: string) => void, destroy: () => void}}
 */
export function initThemeChooser(root, opts = {}) {
    const noop = { setTheme: () => {}, destroy: () => {} };
    if (typeof document === "undefined" || !root) return noop;

    const button = root.querySelector("[data-lily-theme-chooser-button]");
    const list = root.querySelector("[data-lily-theme-chooser-list]");
    const input = root.querySelector("[data-lily-theme-chooser-input]");
    if (!button || !list) return noop;

    const options = Array.from(list.querySelectorAll('[role="option"]'));
    const values = options.map((o) => o.getAttribute("data-value") || "");
    const labels = options.map((o) => (o.textContent || "").trim());

    const name = root.getAttribute("data-lily-theme-chooser-name") || "theme";
    const themesUrl =
        root.getAttribute("data-lily-theme-chooser-themes-url") || "";
    const extension =
        root.getAttribute("data-lily-theme-chooser-extension") || ".css";
    const storageKey =
        root.getAttribute("data-lily-theme-chooser-storage-key") || "";
    const defaultValue =
        root.getAttribute("data-lily-theme-chooser-default-value") || "";
    const detectFromSystem =
        root.getAttribute("data-lily-theme-chooser-detect-from-system") ===
        "true";
    // The consumer's `value` prop. The macro emits it as a data
    // attribute rather than baking it into a control the browser would
    // paint before hydration.
    const valueAttr = root.getAttribute("data-lily-theme-chooser-value") || "";

    let current = "";
    let open = false;
    let activeIndex = -1;
    let typeahead = "";
    let typeaheadTimer;

    // -----------------------------------------------------------------
    // Applying a theme
    // -----------------------------------------------------------------

    function applyTheme(slug) {
        if (!slug) return;
        current = slug;
        getManagedLink(name).href = themeHref(themesUrl, slug, extension);
        const target = opts.target || document.documentElement;
        target.setAttribute("data-theme", slug);
        if (storageKey) safeStorageSet(storageKey, slug);
        // The hidden input carries the value into any enclosing form.
        if (input) input.value = slug;
        // Keep the listbox's selected state in sync with the applied theme.
        options.forEach((o, i) => {
            o.setAttribute("aria-selected", values[i] === slug ? "true" : "false");
        });
        if (typeof opts.onChange === "function") opts.onChange(slug);
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
        const slug = values[index];
        if (slug) applyTheme(slug);
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
    // value attribute > storage > system > default > "light" > first
    //
    // BREAKING (Unreleased): `value` now beats storage. It used to be the
    // other way round, which meant a consumer who resolved the theme on
    // the server (cookie, session, header) and passed it as `opts.value`
    // had it silently overridden by whatever was left in localStorage.
    // That is the SSR case this catalog exists for, and every other Lily
    // helper — including the canonical Svelte one — resolves value-first.
    // -----------------------------------------------------------------

    let initial = "";

    // 1. value prop — read from `data-lily-theme-chooser-value`.
    initial = valueAttr;

    // 2. storage
    const storedValue = storageKey ? safeStorageGet(storageKey) || "" : "";

    // The precedence between these two reversed in 0.4.0, so a consumer
    // who set both and relied on storage winning would otherwise change
    // behaviour silently on upgrade. Warn once per select, and only when
    // the two actually disagree — when they agree, or only one is set,
    // the outcome is identical to 0.3.x and there is nothing to say.
    if (valueAttr && storedValue && valueAttr !== storedValue) {
        warnResolutionOrderChanged(root, valueAttr, storedValue);
    }

    if (!initial) initial = storedValue;

    // 3. system colour-scheme preference
    if (!initial && detectFromSystem) initial = matchSystemTheme(values);

    // 4. default-value
    if (!initial && defaultValue) initial = defaultValue;

    // 5. "light" if present
    if (!initial && values.includes("light")) initial = "light";

    // 6. first option
    if (!initial && values.length > 0) initial = values[0];

    if (initial) applyTheme(initial);

    return {
        setTheme: applyTheme,
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

/** Selects that have already warned, so the message appears once each. */
const warnedRoots = new WeakSet();

/**
 * Announce the 0.4.0 precedence reversal to a consumer whose `value` and
 * stored theme disagree. Silent in production-ish environments that strip
 * console.warn, and never thrown — this is advisory, not an error.
 *
 * @param {HTMLElement} root
 * @param {string} value
 * @param {string} stored
 */
function warnResolutionOrderChanged(root, value, stored) {
    try {
        if (warnedRoots.has(root)) return;
        warnedRoots.add(root);
        if (typeof console === "undefined" || !console.warn) return;
        console.warn(
            `[lily theme-chooser] value="${value}" now takes precedence over ` +
                `the stored theme "${stored}". This reversed in 0.4.0: ` +
                `previously the stored value won. If you want the stored ` +
                `value to keep winning, stop passing "value" and let storage ` +
                `resolve it. See the package CHANGELOG for the rationale.`,
        );
    } catch {
        // never let a warning break initialisation
    }
}

/**
 * Find every [data-lily-theme-chooser-root] and wire it.
 *
 * @param {{onChange?: (slug:string)=>void, target?: HTMLElement|null}=} opts
 * @returns {Array<{setTheme: (slug:string)=>void, destroy: ()=>void}>}
 */
export function autoInit(opts = {}) {
    if (typeof document === "undefined") return [];
    const roots = Array.from(
        document.querySelectorAll("[data-lily-theme-chooser-root]"),
    );
    return roots.map((root) => initThemeChooser(root, opts));
}
