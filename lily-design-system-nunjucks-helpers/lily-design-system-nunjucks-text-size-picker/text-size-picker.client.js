// TextSizePicker client-side runtime.
//
// Pairs with text-size-picker.njk. The macro renders the markup with
// `data-lily-text-size-picker-*` hooks; this module picks them up in
// the browser and owns two things:
//
// A. The listbox INTERACTION (new in the icon-button release): open /
//    close and focus movement here; the APG listbox keyboard contract
//    itself is delegated to the shared
//    @lilydesignsystem/nunjucks-listbox-behavior module. None of this
//    exists in the server markup — the button is inert until this
//    module runs. See docs/ssr.md.
//
// B. The text-size LIFECYCLE (unchanged):
//   0. Read the consumer's `value` prop from
//      `data-lily-text-size-picker-value`. This is the only channel by
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
// `prefers-color-scheme` (theme-picker) and `navigator.languages`
// (locale-picker), the web platform exposes no OS "preferred text
// size" signal.
//
// See spec/index.md §4.3 (client.js exports), §5 (behaviour).

import { createListboxKeyboard } from "@lilydesignsystem/nunjucks-listbox-behavior";

/**
 * Resolve a size slug to its display label: each hyphen-separated word
 * title-cased, so "x-large" renders as "X Large".
 *
 * Mirrors `themeName` in theme-picker and `localeName` in
 * locale-picker. This is the JS statement of the rule the macro applies
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

/**
 * Wire one rendered TextSizePicker root.
 *
 * @param {HTMLElement} root - The <div data-lily-text-size-picker-root>.
 * @param {{onChange?: (size:string)=>void, target?: HTMLElement|null}=} opts
 * @returns {{setSize: (size: string) => void, destroy: () => void}}
 */
export function initTextSizePicker(root, opts = {}) {
  const noop = { setSize: () => {}, destroy: () => {} };
  if (typeof document === "undefined" || !root) return noop;

  const button = root.querySelector("[data-lily-text-size-picker-button]");
  const list = root.querySelector("[data-lily-text-size-picker-list]");
  const input = root.querySelector("[data-lily-text-size-picker-input]");
  if (!button || !list) return noop;

  const options = Array.from(list.querySelectorAll('[role="option"]'));
  const values = options.map((o) => o.getAttribute("data-value") || "");

  const storageKey =
    root.getAttribute("data-lily-text-size-picker-storage-key") || "";
  const defaultValue =
    root.getAttribute("data-lily-text-size-picker-default-value") || "";
  // The consumer's `value` prop. The macro emits it as a data
  // attribute rather than baking it into a control the browser would
  // paint before hydration.
  const valueAttr = root.getAttribute("data-lily-text-size-picker-value") || "";

  let current = "";
  let open = false;

  // -----------------------------------------------------------------
  // Applying a size
  // -----------------------------------------------------------------

  // The size the DOM currently carries. Applying is idempotent: a
  // size already applied is a no-op, so `onChange` fires once per
  // changed value. `setSize` on the returned api is this same
  // function, so without the guard a consumer that mirrors the value
  // back from `onChange` re-enters it forever.
  let appliedValue = "";

  function applySize(slug) {
    if (!slug) return;
    if (slug === appliedValue) return;
    appliedValue = slug;
    current = slug;
    const target = opts.target || document.documentElement;
    target.setAttribute("data-text-size", slug);
    if (storageKey) safeStorageSet(storageKey, slug);
    // The hidden input carries the value into any enclosing form.
    if (input) input.value = slug;
    // Keep the listbox's selected state in sync with the applied size.
    options.forEach((o, i) => {
      o.setAttribute("aria-selected", values[i] === slug ? "true" : "false");
    });
    if (typeof opts.onChange === "function") opts.onChange(slug);
  }

  // -----------------------------------------------------------------
  // Open / close / active-option movement
  //
  // Arrow move/clamp, Home/End, typeahead, PageUp/PageDown, and
  // Enter/Space/Escape/Tab are owned by the shared listbox-behavior
  // controller below (`keyboard`); this picker only decides what
  // open/close/choose mean.
  // -----------------------------------------------------------------

  function openList(startIndex) {
    const selected = values.indexOf(current);
    // An empty list has no option to activate; -1 keeps
    // aria-activedescendant off rather than pointing at an id that
    // does not exist.
    const start =
      options.length === 0
        ? -1
        : typeof startIndex === "number"
          ? startIndex
          : selected >= 0
            ? selected
            : 0;
    open = true;
    list.hidden = false;
    button.setAttribute("aria-expanded", "true");
    keyboard.setActive(start);
    // Focus moves to the listbox; the active option is conveyed via
    // aria-activedescendant, per the APG listbox pattern.
    list.focus({ preventScroll: true });
  }

  function closeList(refocus = true) {
    if (!open) return;
    open = false;
    list.hidden = true;
    button.setAttribute("aria-expanded", "false");
    keyboard.setActive(-1);
    if (refocus) button.focus({ preventScroll: true });
  }

  function choose(index) {
    const slug = values[index];
    if (slug) applySize(slug);
    closeList();
  }

  const keyboard = createListboxKeyboard(list, {
    clamp: true,
    typeahead: true,
    pageSize: 10,
    onActivate: choose,
    onEscape: () => closeList(),
    onTabOut: () => {
      // Tab moves on — but focus goes to the button FIRST, without
      // cancelling the key (the shared controller never prevents Tab's
      // default). Hiding the focused list drops focus to <body>, and
      // the browser then computes the default Tab move from the top of
      // the document, so tabbing out of an open picker teleported the
      // user to the page's first tab stop. From the button, the default
      // Tab lands exactly where leaving the picker should. Guard the
      // METHOD, not just the element: this shape has bitten these
      // helpers before.
      button?.focus?.({ preventScroll: true });
      closeList(false);
    },
  });

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
  list.addEventListener("click", onListClick);
  root.addEventListener("focusout", onRootFocusOut);
  document.addEventListener("click", onDocumentClick);

  // -----------------------------------------------------------------
  // §5.1 initial value resolution
  // value attribute > storage > default > "medium" > first
  //
  // Unchanged by the icon-button release: `value` already beat
  // storage here, so unlike theme-picker there is no precedence
  // reversal to warn about.
  // -----------------------------------------------------------------

  let initial = "";

  // 1. value prop — read from `data-lily-text-size-picker-value`.
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
      keyboard.destroy();
      button.removeEventListener("click", onButtonClick);
      button.removeEventListener("keydown", onButtonKeydown);
      list.removeEventListener("click", onListClick);
      root.removeEventListener("focusout", onRootFocusOut);
      document.removeEventListener("click", onDocumentClick);
    },
  };
}

/**
 * Find every [data-lily-text-size-picker-root] and wire it.
 *
 * @param {{onChange?: (size:string)=>void, target?: HTMLElement|null}=} opts
 * @returns {Array<{setSize: (size:string)=>void, destroy: ()=>void}>}
 */
export function autoInit(opts = {}) {
  if (typeof document === "undefined") return [];
  const roots = Array.from(
    document.querySelectorAll("[data-lily-text-size-picker-root]"),
  );
  return roots.map((root) => initTextSizePicker(root, opts));
}
