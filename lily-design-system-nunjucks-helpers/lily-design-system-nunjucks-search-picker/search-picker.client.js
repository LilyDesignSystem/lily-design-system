// SearchPicker client-side runtime.
//
// Pairs with search-picker.njk. The macro renders the markup with
// `data-lily-search-picker-*` hooks and the panel `hidden`; this module
// picks them up in the browser and owns everything the markup cannot
// express:
//
// A. The disclosure INTERACTION: open / close, focus movement, Escape,
//    outside-click and focus-out dismissal.
// B. The SUBMIT: cancel the native GET (which would send
//    `/?name=value`), trim the query, and navigate to the bare query,
//    `${action}?${encodeURIComponent(query)}` — `foo` goes to `/?foo`.
//
// Like share-picker, this module applies NOTHING to the document and
// persists NOTHING. No localStorage, no data-* on <html>.
//
// See spec/index.md §4.3 (client.js exports), §5 (behaviour).

/**
 * The submit button's visible content: U+23CE RETURN SYMBOL, a bare
 * literal character (never an escape — see `bin/test`'s glyph check).
 * It is the button's visible label only; the accessible name comes from
 * the required `submitLabel`, so assistive technology never has to
 * announce a symbol.
 */
export const RETURN_SYMBOL = "⏎";

/**
 * The destination for a query: `action` + `?` + the URI-encoded,
 * trimmed query. `searchHref("foo")` is `"/?foo"`;
 * `searchHref("foo bar")` is `"/?foo%20bar"`.
 *
 * @param {string} query
 * @param {string=} action
 * @returns {string}
 */
export function searchHref(query, action = "/") {
  return `${action}?${encodeURIComponent(String(query).trim())}`;
}

let uid = 0;

/**
 * Mint a stable per-instance id prefix.
 *
 * SSR-safe by construction (no Math.random, no Date.now), and mirrors
 * the macro's default `search-picker-{name}` shape. The macro derives
 * its ids from `opts.name` / `opts.id` instead, because a macro has no
 * module-level counter to share; this exists for consumers building
 * roots in JavaScript.
 */
export function nextSearchPickerId() {
  uid += 1;
  return `search-picker-${uid}`;
}

/**
 * Wire one rendered SearchPicker root.
 *
 * @param {HTMLElement} root - The <div data-lily-search-picker-root>.
 * @param {{
 *   action?: string,
 *   navigate?: (href: string) => void,
 *   onSearch?: (query: string, href: string) => void
 * }=} opts
 * @returns {{open: () => void, close: () => void, search: (query?: string) => void, destroy: () => void}}
 */
export function initSearchPicker(root, opts = {}) {
  const noop = {
    open: () => {},
    close: () => {},
    search: () => {},
    destroy: () => {},
  };
  if (typeof document === "undefined" || !root) return noop;

  const button = root.querySelector("[data-lily-search-picker-button]");
  const panel = root.querySelector("[data-lily-search-picker-panel]");
  const form = root.querySelector("[data-lily-search-picker-form]");
  const input = root.querySelector("[data-lily-search-picker-input]");
  if (!button || !panel || !form || !input) return noop;

  // Init opts win over the rendered markup. getAttribute, not
  // `form.action`: the property is resolved to an absolute URL.
  const action = opts.action || form.getAttribute("action") || "/";

  let open = !panel.hidden;

  function openPanel() {
    open = true;
    panel.hidden = false;
    button.setAttribute("aria-expanded", "true");
    // preventScroll: the panel is positioned by consumer CSS, and
    // focusing a field rendered partly off-screen would otherwise
    // scroll the whole page — the same fix the sibling pickers carry.
    input.focus({ preventScroll: true });
  }

  function closePanel(refocus = true) {
    if (!open) return;
    open = false;
    panel.hidden = true;
    button.setAttribute("aria-expanded", "false");
    if (refocus) button.focus({ preventScroll: true });
  }

  /** Perform a search for `query` (default: the field's current text). */
  function search(query = input.value) {
    const trimmed = String(query ?? "").trim();
    if (!trimmed) return;
    const href = searchHref(trimmed, action);
    if (typeof opts.onSearch === "function") opts.onSearch(trimmed, href);
    closePanel(false);
    if (typeof opts.navigate === "function") opts.navigate(href);
    else if (typeof location !== "undefined") location.assign(href);
  }

  function onButtonClick() {
    if (open) closePanel();
    else openPanel();
  }

  function onSubmit(event) {
    // The form's native GET would send `/?name=value`; the contract is
    // the bare query (`/?foo`), so navigation is done here instead.
    event.preventDefault();
    search(input.value);
  }

  function onPanelKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closePanel();
    }
  }

  function onRootFocusOut(event) {
    // Close only when focus moves to a known element outside the
    // picker. A focusout with no relatedTarget is not "focus left":
    // Safari does not focus a <button> on click, so pressing ⏎ (or the
    // icon button) blurs the field with relatedTarget = null. Closing
    // there hid the panel before the click landed, so ⏎ never searched
    // and the icon button re-opened instead of closing. Clicks outside
    // the picker are handled by the document click listener below.
    const next = event.relatedTarget;
    if (!next || root.contains(next)) return;
    closePanel(false);
  }

  function onDocumentClick(event) {
    if (!open) return;
    const t = event.target;
    if (t && !root.contains(t)) closePanel(false);
  }

  button.addEventListener("click", onButtonClick);
  form.addEventListener("submit", onSubmit);
  panel.addEventListener("keydown", onPanelKeydown);
  root.addEventListener("focusout", onRootFocusOut);
  document.addEventListener("click", onDocumentClick);

  return {
    open: () => openPanel(),
    close: () => closePanel(false),
    search,
    destroy: () => {
      button.removeEventListener("click", onButtonClick);
      form.removeEventListener("submit", onSubmit);
      panel.removeEventListener("keydown", onPanelKeydown);
      root.removeEventListener("focusout", onRootFocusOut);
      document.removeEventListener("click", onDocumentClick);
    },
  };
}

/**
 * Find every [data-lily-search-picker-root] and wire it.
 *
 * @param {Parameters<typeof initSearchPicker>[1]=} opts
 * @returns {Array<ReturnType<typeof initSearchPicker>>}
 */
export function autoInit(opts = {}) {
  if (typeof document === "undefined") return [];
  const roots = Array.from(
    document.querySelectorAll("[data-lily-search-picker-root]"),
  );
  return roots.map((root) => initSearchPicker(root, opts));
}
