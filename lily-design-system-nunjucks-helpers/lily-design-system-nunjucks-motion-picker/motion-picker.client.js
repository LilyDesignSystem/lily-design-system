// MotionPicker client-side runtime.
//
// Pairs with motion-picker.njk. The macro renders the markup with
// `data-lily-motion-picker-*` hooks; this module picks them up in the
// browser and owns two things:
//
// A. The listbox INTERACTION: open / close, focus movement, the APG
//    listbox keyboard contract, and typeahead. None of this exists in
//    the server markup — the button is inert until this module runs.
//    See docs/ssr.md.
//
// B. The motion LIFECYCLE:
//   0. Read the consumer's `value` prop from
//      `data-lily-motion-picker-value`. This is the only channel by
//      which `opts.value` reaches the client, and it is what keeps the
//      pre-hydration paint honest.
//   1. Set `data-motion="{slug}"` on the resolved target (default <html>).
//   2. Optionally persist to localStorage.
//   3. Mirror the active slug into the hidden input (form
//      participation) and onto the options' aria-selected state.
//   4. Call opts.onChange(slug).
//
// The consumer decides what `[data-motion="reduce"]` actually
// suppresses via CSS/JS. This module makes no visual decisions.
//
// Unlike text-size-picker (no OS signal exists) and theme-picker
// (whose prefers-color-scheme detection is opt-in via
// detectFromSystem), this module checks
// `(prefers-reduced-motion: reduce)` UNCONDITIONALLY as one step of
// initial-value resolution — see §5.1 below and spec/index.md §5,
// which treats this as the canonical default rather than an opt-in.
//
// See spec/index.md §4.3 (client.js exports), §5 (behaviour).

/**
 * Default button glyph: U+23F8 PAUSE SIGN, paired with U+FE0E
 * (VARIATION SELECTOR-15) to force text presentation — the same
 * treatment locale-picker gives its globe.
 *
 * A pause glyph reads as "stop the moving parts" more directly than an
 * abstract symbol, has a real monochrome glyph in ordinary system
 * fonts (media-transport symbols default to text presentation, unlike
 * most pictographs), and doesn't collide with any sibling picker's
 * glyph (theme's CIRCLE WITH RIGHT HALF BLACK, locale's GLOBE WITH
 * MERIDIANS, text-size's plain "A", share's BLACK RIGHTWARDS
 * ARROWHEAD, date-time's CALENDAR).
 */
export const PAUSE_SIGN = "⏸︎";

/** How long the typeahead buffer survives between keystrokes, in ms. */
const TYPEAHEAD_RESET_MS = 500;

/**
 * Resolve a motion slug to its display label: each hyphen-separated
 * word title-cased, so "no-preference" renders as "No Preference".
 *
 * Mirrors `sizeName` in text-size-picker and `themeName` in
 * theme-picker. This is the JS statement of the rule the macro applies
 * in template syntax with `| replace(r/-/g, " ") | title`; a Nunjucks
 * macro cannot call into this module, and delegating would force every
 * consumer to register a custom filter, so the two are kept in
 * agreement by a test rather than by delegation.
 */
export function motionName(motion) {
  return String(motion || "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * True when the platform reports a preference for reduced motion.
 * SSR-safe: `window`/`matchMedia` are absent on the server, so this
 * resolves to `false` there and the client re-derives it on init.
 */
export function prefersReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (_e) {
    return false;
  }
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
 * Wire one rendered MotionPicker root.
 *
 * @param {HTMLElement} root - The <div data-lily-motion-picker-root>.
 * @param {{onChange?: (motion:string)=>void, target?: HTMLElement|null}=} opts
 * @returns {{setMotion: (motion: string) => void, destroy: () => void}}
 */
export function initMotionPicker(root, opts = {}) {
  const noop = { setMotion: () => {}, destroy: () => {} };
  if (typeof document === "undefined" || !root) return noop;

  const button = root.querySelector("[data-lily-motion-picker-button]");
  const list = root.querySelector("[data-lily-motion-picker-list]");
  const input = root.querySelector("[data-lily-motion-picker-input]");
  if (!button || !list) return noop;

  const options = Array.from(list.querySelectorAll('[role="option"]'));
  const values = options.map((o) => o.getAttribute("data-value") || "");
  const labels = options.map((o) => (o.textContent || "").trim());

  const storageKey =
    root.getAttribute("data-lily-motion-picker-storage-key") || "";
  const defaultValue =
    root.getAttribute("data-lily-motion-picker-default-value") || "";
  // The consumer's `value` prop. The macro emits it as a data
  // attribute rather than baking it into a control the browser would
  // paint before hydration.
  const valueAttr = root.getAttribute("data-lily-motion-picker-value") || "";

  let current = "";
  let open = false;
  let activeIndex = -1;
  let typeahead = "";
  let typeaheadTimer;

  // -----------------------------------------------------------------
  // Applying a motion preference
  // -----------------------------------------------------------------

  // The motion the DOM currently carries. Applying is idempotent: a
  // motion already applied is a no-op, so `onChange` fires once per
  // changed value. `setMotion` on the returned api is this same
  // function, so without the guard a consumer that mirrors the value
  // back from `onChange` re-enters it forever.
  let appliedValue = "";

  function applyMotion(slug) {
    if (!slug) return;
    if (slug === appliedValue) return;
    appliedValue = slug;
    current = slug;
    const target = opts.target || document.documentElement;
    target.setAttribute("data-motion", slug);
    if (storageKey) safeStorageSet(storageKey, slug);
    // The hidden input carries the value into any enclosing form.
    if (input) input.value = slug;
    // Keep the listbox's selected state in sync with the applied motion.
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
    if (slug) applyMotion(slug);
    closeList();
  }

  function moveActive(delta) {
    if (options.length === 0) return;
    // Clamp rather than wrap, matching the canonical Svelte helper.
    const next = Math.min(Math.max(activeIndex + delta, 0), options.length - 1);
    setActive(next);
  }

  function runTypeahead(char) {
    const lower = char.toLowerCase();
    // APG listbox typeahead: a single character moves to the NEXT
    // option starting with it, and repeating that character keeps
    // cycling. Only a buffer of differing characters refines the
    // match, and that buffer stays anchored on the active option.
    const sameCharRun =
      typeahead === "" || Array.from(typeahead).every((c) => c === lower);
    typeahead += lower;
    clearTimeout(typeaheadTimer);
    typeaheadTimer = setTimeout(() => {
      typeahead = "";
    }, TYPEAHEAD_RESET_MS);
    const query = sameCharRun ? lower : typeahead;
    const anchor = activeIndex < 0 ? 0 : activeIndex;
    const start = sameCharRun ? anchor + 1 : anchor;
    // Search forward, wrapping once — typeahead wraps even though the
    // arrows clamp, or options above the cursor would be untypable.
    for (let n = 0; n < options.length; n++) {
      const i = (start + n) % options.length;
      if (labels[i].toLowerCase().startsWith(query)) {
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
      case "PageUp":
        event.preventDefault();
        moveActive(-10);
        break;
      case "PageDown":
        // ±10, clamped: an APG-optional key for long lists.
        event.preventDefault();
        moveActive(10);
        break;
      case "Tab":
        // Tab moves on — but focus goes to the button FIRST, without
        // cancelling the key. Hiding the focused list drops focus to
        // <body>, and the browser then computes the default Tab move
        // from the top of the document, so tabbing out of an open
        // picker teleported the user to the page's first tab stop.
        // From the button, the default Tab lands exactly where leaving
        // the picker should. Guard the METHOD, not just the element:
        // this shape has bitten these helpers before.
        button?.focus?.();
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
  // value attribute > storage > default > OS preference > first
  //
  // Unlike text-size-picker (no OS signal exists at all) and
  // theme-picker (whose prefers-color-scheme check is opt-in via
  // detectFromSystem), the OS check here runs unconditionally: motion
  // has a real accessibility signal to defer to, and the canonical
  // Svelte contract treats deferring to it as the default, not an
  // opt-in extra.
  // -----------------------------------------------------------------

  let initial = "";

  // 1. value prop — read from `data-lily-motion-picker-value`.
  initial = valueAttr;

  // 2. storage
  if (!initial && storageKey) initial = safeStorageGet(storageKey) || "";

  // 3. default-value
  if (!initial && defaultValue) initial = defaultValue;

  // 4. OS preference, unconditionally.
  if (!initial) {
    const osPreferred = prefersReducedMotion() ? "reduce" : "no-preference";
    if (values.includes(osPreferred)) initial = osPreferred;
  }

  // 5. first option
  if (!initial && values.length > 0) initial = values[0];

  if (initial) applyMotion(initial);

  return {
    setMotion: applyMotion,
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
 * Find every [data-lily-motion-picker-root] and wire it.
 *
 * @param {{onChange?: (motion:string)=>void, target?: HTMLElement|null}=} opts
 * @returns {Array<{setMotion: (motion:string)=>void, destroy: ()=>void}>}
 */
export function autoInit(opts = {}) {
  if (typeof document === "undefined") return [];
  const roots = Array.from(
    document.querySelectorAll("[data-lily-motion-picker-root]"),
  );
  return roots.map((root) => initMotionPicker(root, opts));
}
