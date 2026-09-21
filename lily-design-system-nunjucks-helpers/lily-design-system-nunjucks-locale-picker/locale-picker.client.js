// LocalePicker client-side runtime.
//
// Pairs with locale-picker.njk. The macro renders the markup with
// `data-lily-locale-picker-*` hooks; this module picks them up in the
// browser and owns two things:
//
// A. The listbox INTERACTION (new in the icon-button release): open /
//    close and focus movement here; the APG listbox keyboard contract
//    itself is delegated to the shared
//    @lilydesignsystem/nunjucks-listbox-behavior module. None of this
//    exists in the server markup — the button is inert until this
//    module runs. See docs/ssr.md.
//
// B. The locale LIFECYCLE (unchanged):
//   0. Read the consumer's `value` prop from
//      `data-lily-locale-picker-value`. This is still the only channel
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

import { createListboxKeyboard } from "@lilydesignsystem/nunjucks-listbox-behavior";

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

/**
 * The language's own name for itself — "de" → "Deutsch", "cy" →
 * "Cymraeg" — from `Intl.DisplayNames` asked *in that language*.
 *
 * Endonyms are the right default for a language menu: the user who
 * needs it most is the one lost in a UI that is not in their
 * language, and they recognise "Cymraeg" where "Welsh" means
 * nothing to them. Deterministic (no `navigator` dependency), so
 * every runtime with the same ICU data renders the same label.
 * Returns "" when the runtime has no data — some runtimes echo the
 * tag back instead of failing, and an echo is not a name.
 */
export function localeEndonym(locale) {
  try {
    const tag = bcp47LocaleTag(locale);
    const dn = new Intl.DisplayNames([tag], { type: "language" });
    const found = dn.of(tag) || "";
    return found && found.toLowerCase() !== tag.toLowerCase() ? found : "";
  } catch (_e) {
    return "";
  }
}

/**
 * Resolve the label the picker should show for one derived (not
 * consumer-labelled) option: endonym → built-in English table → the
 * raw code. This is the client half of the label contract in
 * spec/index.md §5.7 — the macro cannot ask ICU for anything, so it
 * renders the raw code as a pre-hydration fallback and marks the
 * option `data-lily-locale-picker-derive`; this function upgrades it.
 */
export function derivedLocaleLabel(locale) {
  return localeEndonym(locale) || defaultLocaleLabels[locale] || locale;
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

// ---------------------------------------------------------------
// Init
// ---------------------------------------------------------------

/**
 * Wire one rendered LocalePicker root.
 *
 * @param {HTMLElement} root - The <div data-lily-locale-picker-root>.
 * @param {{onChange?: (code:string)=>void, target?: HTMLElement|null}=} opts
 * @returns {{setLocale: (code: string) => void, destroy: () => void}}
 */
export function initLocalePicker(root, opts = {}) {
  const noop = { setLocale: () => {}, destroy: () => {} };
  if (typeof document === "undefined" || !root) return noop;

  const button = root.querySelector("[data-lily-locale-picker-button]");
  const list = root.querySelector("[data-lily-locale-picker-list]");
  const input = root.querySelector("[data-lily-locale-picker-input]");
  if (!button || !list) return noop;

  const options = Array.from(list.querySelectorAll('[role="option"]'));
  const values = options.map((o) => o.getAttribute("data-value") || "");

  // Upgrade the derived option labels (§5.7). The macro renders the
  // raw code as a pre-hydration fallback — a template cannot ask ICU
  // for anything — and marks those options with
  // `data-lily-locale-picker-derive`. Here each becomes its endonym
  // ("Cymraeg", not "Welsh"), falling back to the English table, then
  // the raw code. `lang` is set ONLY when the text really is the
  // endonym: `lang` is a claim about the language of the option's
  // TEXT, and the English word "Arabic" must never be handed to an
  // Arabic speech engine. Consumer-labelled options are left alone
  // and carry no `lang` — their language is unknown.
  options.forEach((o, i) => {
    if (!o.hasAttribute("data-lily-locale-picker-derive")) return;
    const code = values[i];
    const endonym = localeEndonym(code);
    o.textContent = endonym || defaultLocaleLabels[code] || code;
    if (endonym) o.setAttribute("lang", bcp47LocaleTag(code));
    else o.removeAttribute("lang");
  });

  const storageKey =
    root.getAttribute("data-lily-locale-picker-storage-key") || "";
  const defaultValue =
    root.getAttribute("data-lily-locale-picker-default-value") || "";
  const detectFromNavigator =
    root.getAttribute("data-lily-locale-picker-detect-from-navigator") ===
    "true";
  const applyDir =
    root.getAttribute("data-lily-locale-picker-apply-dir") !== "false";
  // The consumer's `value` prop. The macro emits it as a data
  // attribute rather than baking it into a control the browser would
  // paint before hydration.
  const valueAttr = root.getAttribute("data-lily-locale-picker-value") || "";

  let current = "";
  let open = false;

  // -----------------------------------------------------------------
  // Applying a locale
  // -----------------------------------------------------------------

  // The locale the DOM currently carries. Applying is idempotent: a
  // locale already applied is a no-op, so `onChange` fires once per
  // changed value. `setLocale` on the returned api is this same
  // function, so without the guard a consumer that mirrors the value
  // back from `onChange` re-enters it forever.
  let appliedValue = "";

  function applyLocale(code) {
    if (!code) return;
    if (code === appliedValue) return;
    appliedValue = code;
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
    const code = values[index];
    if (code) applyLocale(code);
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
  // §5.2 initial value resolution
  // value attribute > storage > navigator > default > "en" > first
  // -----------------------------------------------------------------

  let initial = "";

  // 1. value prop — read from `data-lily-locale-picker-value`.
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
 * Find every [data-lily-locale-picker-root] and wire it.
 *
 * @param {{onChange?: (code:string)=>void, target?: HTMLElement|null}=} opts
 * @returns {Array<{setLocale: (code:string)=>void, destroy: ()=>void}>}
 */
export function autoInit(opts = {}) {
  if (typeof document === "undefined") return [];
  const roots = Array.from(
    document.querySelectorAll("[data-lily-locale-picker-root]"),
  );
  return roots.map((root) => initLocalePicker(root, opts));
}
