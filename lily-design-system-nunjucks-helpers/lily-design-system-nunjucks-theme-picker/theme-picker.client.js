// ThemePicker client-side runtime.
//
// Pairs with theme-picker.njk. The macro renders the markup with
// `data-lily-theme-picker-*` hooks; this module picks them up in the
// browser and owns the lifecycle:
//
//   1. Inject/update a managed <link rel="stylesheet"> in <head>.
//   2. Set data-theme="<slug>" on the resolved target (default <html>).
//   3. Optionally persist to localStorage.
//   4. Mirror the active slug onto the radio.checked state.
//   5. Call opts.onChange(slug).
//
// See spec.md §4.3 (client.js exports), §5 (behaviour).

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
    const selector = `link[data-lily-theme-picker="${name}"]`;
    let link = document.head.querySelector(selector);
    if (!link) {
        link = document.createElement("link");
        link.rel = "stylesheet";
        link.setAttribute("data-lily-theme-picker", name);
        document.head.appendChild(link);
    }
    return link;
}

function readRadios(root) {
    return Array.from(
        root.querySelectorAll('input[type="radio"]')
    );
}

/**
 * Wire one rendered ThemePicker fieldset.
 *
 * @param {HTMLElement} root - The <fieldset data-lily-theme-picker-root>.
 * @param {{onChange?: (slug:string)=>void, target?: HTMLElement|null}=} opts
 * @returns {{setTheme: (slug: string) => void, destroy: () => void}}
 */
export function initThemePicker(root, opts = {}) {
    if (typeof document === "undefined" || !root) {
        return { setTheme: () => {}, destroy: () => {} };
    }

    const name = root.getAttribute("data-lily-theme-picker-name") || "theme";
    const themesUrl =
        root.getAttribute("data-lily-theme-picker-themes-url") || "";
    const extension =
        root.getAttribute("data-lily-theme-picker-extension") || ".css";
    const storageKey =
        root.getAttribute("data-lily-theme-picker-storage-key") || "";
    const defaultValue =
        root.getAttribute("data-lily-theme-picker-default-value") || "";

    function applyTheme(slug) {
        if (!slug) return;
        getManagedLink(name).href = themeHref(themesUrl, slug, extension);
        const target = opts.target || document.documentElement;
        target.setAttribute("data-theme", slug);
        if (storageKey) safeStorageSet(storageKey, slug);
        const radios = readRadios(root);
        for (const r of radios) r.checked = r.value === slug;
        if (typeof opts.onChange === "function") opts.onChange(slug);
    }

    // §5.2 initial value resolution: storage > checked-radio > default > "light" > first
    const radios = readRadios(root);
    const radioValues = radios.map((r) => r.value);
    let initial = "";
    if (storageKey) initial = safeStorageGet(storageKey) || "";
    if (!initial) {
        const checked = radios.find((r) => r.checked);
        if (checked) initial = checked.value;
    }
    if (!initial && defaultValue) initial = defaultValue;
    if (!initial && radioValues.includes("light")) initial = "light";
    if (!initial && radioValues.length > 0) initial = radioValues[0];

    if (initial) applyTheme(initial);

    function onChange(e) {
        const target = e.target;
        if (
            target &&
            target.tagName === "INPUT" &&
            target.type === "radio" &&
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
 * Find every [data-lily-theme-picker-root] and wire it.
 *
 * @param {{onChange?: (slug:string)=>void, target?: HTMLElement|null}=} opts
 * @returns {Array<{setTheme: (slug:string)=>void, destroy: ()=>void}>}
 */
export function autoInit(opts = {}) {
    if (typeof document === "undefined") return [];
    const roots = Array.from(
        document.querySelectorAll("[data-lily-theme-picker-root]")
    );
    return roots.map((root) => initThemePicker(root, opts));
}
