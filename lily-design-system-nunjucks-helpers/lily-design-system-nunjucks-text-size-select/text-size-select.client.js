// TextSizeSelect client-side runtime.
//
// Pairs with text-size-select.njk. The macro renders the markup with
// `data-lily-text-size-select-*` hooks; this module picks them up in
// the browser and owns two things:
//
// A. The listbox INTERACTION (new in the icon-button release): open /
//    close, focus movement, the APG listbox keyboard contract, and
//    typeahead. None of this exists in the server markup — the button
//    is inert until this module runs. See docs/ssr.md.
//
// B. The text-size LIFECYCLE (unchanged):
//   0. Read the consumer's `value` prop from
//      `data-lily-text-size-select-value`. This is the only channel by
//      which `opts.value` reaches the client, and it is what keeps the
//      pre-hydration paint honest.
//   1. Set `data-text-size="{slug}"` on the resolved target
//      (default <html>).
//   2. Optionally persist to localStorage.
//   3. Mirror the active slug into the hidden input (form
//      participation) and onto the options' aria-selected state.
//   4. Call opts.onChange(slug).
//
// The consumer owns the actual typography via CSS keyed on
// `[data-text-size="{slug}"]`. This module makes no visual decisions.
//
// There is deliberately no system-preference detection: unlike
// `prefers-color-scheme` (theme-select) and `navigator.languages`
// (locale-select), the web platform exposes no OS "preferred text
// size" signal.
//
// See spec/index.md §4.3 (client.js exports), §5 (behaviour).

/**
 * Default button glyph: U+0041 LATIN CAPITAL LETTER A.
 *
 * A plain letter rather than a pictograph, deliberately. The obvious
 * candidate — U+1F5DB DECREASE FONT SIZE SYMBOL — has no real glyph in
 * common font stacks and falls back to a crude bitmap shape, and it
 * means *decrease* rather than *size*. "A" renders in the page's own
 * font on every platform, stays monochrome like theme-select's ◑, and
 * is the conventional text-size affordance.
 */
export const LATIN_CAPITAL_LETTER_A = "A";

/** How long the typeahead buffer survives between keystrokes, in ms. */
const TYPEAHEAD_RESET_MS = 500;

/**
 * Resolve a size slug to its display label: each hyphen-separated word
 * title-cased, so "x-large" renders as "X Large".
 *
 * Mirrors `themeName` in theme-select and `localeName` in
 * locale-select. This is the JS statement of the rule the macro applies
 * in template syntax with `| replace(r/-/g, " ") | title`; a Nunjucks
 * macro cannot call into this module, and delegating would force every
 * consumer to register a custom filter, so the two are kept in
 * agreement by a test rather than by delegation.
 */
export function sizeName(size) {
    return String(size || "")
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
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

/** jsdom and older browsers do not always implement scrollIntoView. */
function scrollIntoViewIfPossible(el) {
    if (el && typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ block: "nearest" });
    }
}

/**
 * Wire one rendered TextSizeSelect root.
 *
 * @param {HTMLElement} root - The <div data-lily-text-size-select-root>.
 * @param {{onChange?: (size:string)=>void, target?: HTMLElement|null}=} opts
 * @returns {{setSize: (size: string) => void, destroy: () => void}}
 */
export function initTextSizeSelect(root, opts = {}) {
    const noop = { setSize: () => {}, destroy: () => {} };
    if (typeof document === "undefined" || !root) return noop;

    const button = root.querySelector("[data-lily-text-size-select-button]");
    const list = root.querySelector("[data-lily-text-size-select-list]");
    const input = root.querySelector("[data-lily-text-size-select-input]");
    if (!button || !list) return noop;

    const options = Array.from(list.querySelectorAll('[role="option"]'));
    const values = options.map((o) => o.getAttribute("data-value") || "");
    const labels = options.map((o) => (o.textContent || "").trim());

    const storageKey =
        root.getAttribute("data-lily-text-size-select-storage-key") || "";
    const defaultValue =
        root.getAttribute("data-lily-text-size-select-default-value") || "";
    // The consumer's `value` prop. The macro emits it as a data
    // attribute rather than baking it into a control the browser would
    // paint before hydration.
    const valueAttr =
        root.getAttribute("data-lily-text-size-select-value") || "";

    let current = "";
    let open = false;
    let activeIndex = -1;
    let typeahead = "";
    let typeaheadTimer;

    // -----------------------------------------------------------------
    // Applying a size
    // -----------------------------------------------------------------

    function applySize(slug) {
        if (!slug) return;
        current = slug;
        const target = opts.target || document.documentElement;
        target.setAttribute("data-text-size", slug);
        if (storageKey) safeStorageSet(storageKey, slug);
        // The hidden input carries the value into any enclosing form.
        if (input) input.value = slug;
        // Keep the listbox's selected state in sync with the applied size.
        options.forEach((o, i) => {
            o.setAttribute(
                "aria-selected",
                values[i] === slug ? "true" : "false",
            );
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
        if (slug) applySize(slug);
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
        const li =
            event.target && event.target.closest
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
    // §5.1 initial value resolution
    // value attribute > storage > default > "medium" > first
    //
    // Unchanged by the icon-button release: `value` already beat
    // storage here, so unlike theme-select there is no precedence
    // reversal to warn about.
    // -----------------------------------------------------------------

    let initial = "";

    // 1. value prop — read from `data-lily-text-size-select-value`.
    initial = valueAttr;

    // 2. storage
    if (!initial && storageKey) initial = safeStorageGet(storageKey) || "";

    // 3. default-value
    if (!initial && defaultValue) initial = defaultValue;

    // 4. "medium" if present
    if (!initial && values.includes("medium")) initial = "medium";

    // 5. first option
    if (!initial && values.length > 0) initial = values[0];

    if (initial) applySize(initial);

    return {
        setSize: applySize,
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
