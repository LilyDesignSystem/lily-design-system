// TextSizeSelect client-side runtime.
//
// Pairs with text-size-select.njk. The macro renders the markup with
// `data-lily-text-size-select-*` hooks; this module picks them up in
// the browser and owns the lifecycle:
//
//   1. Set `target.dataset.textSize = slug` (data-text-size attribute).
//   2. Mirror the active slug onto the <select> value (select the option).
//   3. Optionally persist to localStorage.
//   4. Call opts.onChange(slug).
//
// The consumer owns the actual typography via CSS keyed on
// `[data-text-size="{slug}"]`. This module makes no visual decisions.
//
// See spec/index.md §4.3 (client.js exports), §5 (behaviour).

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
 * Wire one rendered TextSizeSelect.
 *
 * @param {HTMLSelectElement} root - The <select data-lily-text-size-select-root>.
 * @param {{onChange?: (size:string)=>void, target?: HTMLElement|null}=} opts
 * @returns {{setSize: (size: string) => void, destroy: () => void}}
 */
export function initTextSizeSelect(root, opts = {}) {
    if (typeof document === "undefined" || !root) {
        return { setSize: () => {}, destroy: () => {} };
    }

    const storageKey =
        root.getAttribute("data-lily-text-size-select-storage-key") || "";
    const defaultValue =
        root.getAttribute("data-lily-text-size-select-default-value") || "";

    function applySize(slug) {
        if (!slug) return;
        const target = opts.target || document.documentElement;
        target.setAttribute("data-text-size", slug);
        if (storageKey) safeStorageSet(storageKey, slug);
        // Select the option matching the active slug.
        root.value = slug;
        if (typeof opts.onChange === "function") opts.onChange(slug);
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

    // 3. default-value
    if (!initial && defaultValue) initial = defaultValue;

    // 4. "medium" if present
    if (!initial && values.includes("medium")) initial = "medium";

    // 5. first option
    if (!initial && values.length > 0) initial = values[0];

    if (initial) applySize(initial);

    function onChange(e) {
        const target = e.target;
        if (
            target &&
            target.tagName === "SELECT" &&
            typeof target.value === "string"
        ) {
            applySize(target.value);
        }
    }
    root.addEventListener("change", onChange);

    return {
        setSize: applySize,
        destroy: () => root.removeEventListener("change", onChange),
    };
}

/**
 * Find every [data-lily-text-size-select-root] and wire it.
 *
 * @param {{onChange?: (size:string)=>void, target?: HTMLElement|null}=} opts
 * @returns {Array<{setSize: (size:string)=>void, destroy: ()=>void}>}
 */
export function autoInit(opts = {}) {
    if (typeof document === "undefined") return [];
    const roots = Array.from(
        document.querySelectorAll("[data-lily-text-size-select-root]"),
    );
    return roots.map((root) => initTextSizeSelect(root, opts));
}
