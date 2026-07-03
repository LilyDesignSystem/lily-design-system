// ThemeSelect client-side runtime.
//
// Pairs with theme-select.njk. The macro renders the markup with
// `data-lily-theme-select-*` hooks; this module picks them up in the
// browser and owns the lifecycle:
//
//   1. Inject/update a managed <link rel="stylesheet"> in <head>.
//   2. Set data-theme="<slug>" on the resolved target (default <html>).
//   3. Optionally persist to localStorage.
//   4. Mirror the active slug onto the <select> value (select the option).
//   5. Call opts.onChange(slug).
//
// See spec/index.md §4.3 (client.js exports), §5 (behaviour).

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
    const selector = `link[data-lily-theme-select="${name}"]`;
    let link = document.head.querySelector(selector);
    if (!link) {
        link = document.createElement("link");
        link.rel = "stylesheet";
        link.setAttribute("data-lily-theme-select", name);
        document.head.appendChild(link);
    }
    return link;
}

function optionValues(select) {
    return Array.from(select.options).map((o) => o.value);
}

/**
 * Wire one rendered ThemeSelect <select>.
 *
 * @param {HTMLSelectElement} root - The <select data-lily-theme-select-root>.
 * @param {{onChange?: (slug:string)=>void, target?: HTMLElement|null}=} opts
 * @returns {{setTheme: (slug: string) => void, destroy: () => void}}
 */
export function initThemeSelect(root, opts = {}) {
    if (typeof document === "undefined" || !root) {
        return { setTheme: () => {}, destroy: () => {} };
    }

    const name = root.getAttribute("data-lily-theme-select-name") || "theme";
    const themesUrl =
        root.getAttribute("data-lily-theme-select-themes-url") || "";
    const extension =
        root.getAttribute("data-lily-theme-select-extension") || ".css";
    const storageKey =
        root.getAttribute("data-lily-theme-select-storage-key") || "";
    const defaultValue =
        root.getAttribute("data-lily-theme-select-default-value") || "";

    function applyTheme(slug) {
        if (!slug) return;
        getManagedLink(name).href = themeHref(themesUrl, slug, extension);
        const target = opts.target || document.documentElement;
        target.setAttribute("data-theme", slug);
        if (storageKey) safeStorageSet(storageKey, slug);
        // Select the option matching the active slug.
        root.value = slug;
        if (typeof opts.onChange === "function") opts.onChange(slug);
    }

    // §5.2 initial value resolution: storage > selected option > default > "light" > first
    const values = optionValues(root);
    let initial = "";
    if (storageKey) initial = safeStorageGet(storageKey) || "";
    if (!initial) {
        // The macro renders `selected` on the value option; read it back
        // via `defaultSelected` (the HTML `selected` attribute), because
        // `root.value` reports the first option even when none is
        // explicitly selected.
        const selectedOption = Array.from(root.options).find(
            (o) => o.defaultSelected,
        );
        if (selectedOption) initial = selectedOption.value;
    }
    if (!initial && defaultValue) initial = defaultValue;
    if (!initial && values.includes("light")) initial = "light";
    if (!initial && values.length > 0) initial = values[0];

    if (initial) applyTheme(initial);

    function onChange(e) {
        const target = e.target;
        if (
            target &&
            target.tagName === "SELECT" &&
            typeof target.value === "string"
        ) {
            applyTheme(target.value);
        }
    }
    root.addEventListener("change", onChange);

    return {
        setTheme: applyTheme,
        destroy: () => root.removeEventListener("change", onChange),
    };
}

/**
 * Find every [data-lily-theme-select-root] and wire it.
 *
 * @param {{onChange?: (slug:string)=>void, target?: HTMLElement|null}=} opts
 * @returns {Array<{setTheme: (slug:string)=>void, destroy: ()=>void}>}
 */
export function autoInit(opts = {}) {
    if (typeof document === "undefined") return [];
    const roots = Array.from(
        document.querySelectorAll("[data-lily-theme-select-root]")
    );
    return roots.map((root) => initThemeSelect(root, opts));
}
