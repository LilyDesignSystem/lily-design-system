// TimeZonePicker client-side runtime.
//
// Pairs with time-zone-picker.njk. The macro renders the markup with
// `data-lily-time-zone-picker-*` hooks; this module picks them up in
// the browser and owns two things:
//
// A. The listbox INTERACTION (new in the icon-button release): open /
//    close and focus movement here; the APG listbox keyboard contract
//    itself is delegated to the shared
//    @lilydesignsystem/nunjucks-listbox-behavior module. None of this
//    exists in the server markup — the button is inert until this
//    module runs. See docs/ssr.md.
//
// B. The time-zone LIFECYCLE (unchanged):
//   0. Read the consumer's `value` prop from
//      `data-lily-time-zone-picker-value`. This is the only channel by
//      which `opts.value` reaches the client, and it is what keeps the
//      pre-hydration paint honest.
//   1. Set `data-time-zone="{slug}"` on the resolved target
//      (default <html>).
//   2. Optionally persist to localStorage.
//   3. Mirror the active slug into the hidden input (form
//      participation) and onto the options' aria-selected state.
//   4. Call opts.onChange(slug).
//
// The consumer owns the actual typography via CSS keyed on
// `[data-time-zone="{slug}"]`. This module makes no visual decisions.
//
// The reader's own zone is the default when it is offered (or has an offered twin with the same offset and name);
// see §5.1. The zone list itself is built at render time with `timeZoneOptions()` and rendered by the macro.
//
// See spec/index.md §4.3 (client.js exports), §5 (behaviour).

import { createListboxKeyboard } from "@lilydesignsystem/nunjucks-listbox-behavior";
import { DEFAULT_ZONES, defaultLabel, formatOffset, matchZone, offsetMinutes, orderedZones, systemZone, zoneInfo, zoneName } from "./zones.js";

export { DEFAULT_ZONES, defaultLabel, formatOffset, matchZone, offsetMinutes, orderedZones, systemZone, zoneInfo, zoneName };

/**
 * The zones as the macro renders them, ordered by UTC offset: `[{ id, offsetMinutes, offset, name, label }]`.
 * Call it where the page is built (an Eleventy global, a filter, a view model) and pass the result to the macro
 * as `options`. `locale` is required: the picker never picks a language for you.
 *
 * @param {{locale: string, zones?: readonly string[], date?: Date, labelFor?: (zone: object) => string}} opts
 */
export function timeZoneOptions({ locale, zones = DEFAULT_ZONES, date = new Date(), labelFor }) {
  return orderedZones(zones, locale, date, labelFor);
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

// ---------------------------------------------------------------------
// Tooltip (purely visual; the same text is already the button's
// aria-label, so it is NOT linked with aria-describedby). Visible iff the
// popup is closed, it has not been dismissed with Escape, and the pointer
// is over the button or the tooltip (hoverable, WCAG 1.4.13) or the
// button has KEYBOARD focus (:focus-visible; a mouse click's focus does
// not count). Never interferes with the picker's own keys or closing.
// Idempotent: wiring the same tooltip twice replaces the first wiring.
// ---------------------------------------------------------------------

const tooltipWirings = new WeakMap();

function wireTooltip(root, button, selector, popup) {
  const tooltip = root.querySelector(selector);
  if (!tooltip || !button || !popup) return () => {};
  const previous = tooltipWirings.get(tooltip);
  if (previous) previous();

  let hoverButton = false;
  let hoverTooltip = false;
  let focusButton = false;
  let dismissed = false;

  // WCAG 1.4.13 "dismissable": Escape must work wherever focus is while
  // the tooltip is visible (pointer hover alone leaves focus elsewhere).
  // The document listener exists only while visible; never preventDefault
  // or stopPropagation, never move focus.
  let docListening = false;
  const onDocumentKeydown = (event) => {
    if (event.key === "Escape") {
      dismissed = true;
      update();
    }
  };
  function syncDocumentListener() {
    const want = !tooltip.hidden;
    if (want && !docListening) {
      document.addEventListener("keydown", onDocumentKeydown);
      docListening = true;
    } else if (!want && docListening) {
      document.removeEventListener("keydown", onDocumentKeydown);
      docListening = false;
    }
  }

  function update() {
    tooltip.hidden = !(
      popup.hidden &&
      !dismissed &&
      (hoverButton || hoverTooltip || focusButton)
    );
    syncDocumentListener();
  }

  const onButtonEnter = () => {
    hoverButton = true;
    dismissed = false;
    update();
  };
  const onButtonLeave = () => {
    hoverButton = false;
    update();
  };
  const onTooltipEnter = () => {
    hoverTooltip = true;
    update();
  };
  const onTooltipLeave = () => {
    hoverTooltip = false;
    update();
  };
  const onButtonFocus = () => {
    try {
      focusButton = button.matches(":focus-visible");
    } catch {
      focusButton = true; // engine without :focus-visible
    }
    update();
  };
  const onButtonBlur = () => {
    focusButton = false;
    dismissed = false;
    update();
  };
  const onButtonKeydown = (event) => {
    if (event.key === "Escape" && !tooltip.hidden) dismissed = true;
    update();
  };
  const onButtonClick = () => {
    hoverButton = false;
    update();
  };

  button.addEventListener("mouseenter", onButtonEnter);
  button.addEventListener("mouseleave", onButtonLeave);
  button.addEventListener("focus", onButtonFocus);
  button.addEventListener("blur", onButtonBlur);
  button.addEventListener("keydown", onButtonKeydown);
  button.addEventListener("click", onButtonClick);
  tooltip.addEventListener("mouseenter", onTooltipEnter);
  tooltip.addEventListener("mouseleave", onTooltipLeave);

  // The popup's own open/close (including the programmatic API) flips its
  // `hidden` attribute; follow it so the tooltip never shows over it.
  const observer =
    typeof MutationObserver === "function"
      ? new MutationObserver(update)
      : null;
  if (observer) observer.observe(popup, { attributes: true, attributeFilter: ["hidden"] });

  update();

  const destroy = () => {
    button.removeEventListener("mouseenter", onButtonEnter);
    button.removeEventListener("mouseleave", onButtonLeave);
    button.removeEventListener("focus", onButtonFocus);
    button.removeEventListener("blur", onButtonBlur);
    button.removeEventListener("keydown", onButtonKeydown);
    button.removeEventListener("click", onButtonClick);
    tooltip.removeEventListener("mouseenter", onTooltipEnter);
    tooltip.removeEventListener("mouseleave", onTooltipLeave);
    if (observer) observer.disconnect();
    if (docListening) {
      document.removeEventListener("keydown", onDocumentKeydown);
      docListening = false;
    }
    if (tooltipWirings.get(tooltip) === destroy) tooltipWirings.delete(tooltip);
  };
  tooltipWirings.set(tooltip, destroy);
  return destroy;
}

/**
 * Wire one rendered TimeZonePicker root.
 *
 * @param {HTMLElement} root - The <div data-lily-time-zone-picker-root>.
 * @param {{onChange?: (zone:string)=>void, target?: HTMLElement|null}=} opts
 * @returns {{setZone: (zone: string) => void, destroy: () => void}}
 */
export function initTimeZonePicker(root, opts = {}) {
  const noop = { setZone: () => {}, destroy: () => {} };
  if (typeof document === "undefined" || !root) return noop;

  const button = root.querySelector("[data-lily-time-zone-picker-button]");
  const list = root.querySelector("[data-lily-time-zone-picker-list]");
  const input = root.querySelector("[data-lily-time-zone-picker-input]");
  if (!button || !list) return noop;

  const options = Array.from(list.querySelectorAll('[role="option"]'));
  const values = options.map((o) => o.getAttribute("data-value") || "");

  const storageKey =
    root.getAttribute("data-lily-time-zone-picker-storage-key") || "";
  const defaultValue =
    root.getAttribute("data-lily-time-zone-picker-default-value") || "";
  // The consumer's `value` prop. The macro emits it as a data
  // attribute rather than baking it into a control the browser would
  // paint before hydration.
  const valueAttr = root.getAttribute("data-lily-time-zone-picker-value") || "";

  let current = "";
  let open = !list.hidden && !button.disabled;

  // -----------------------------------------------------------------
  // Applying a zone
  // -----------------------------------------------------------------

  // The zone the DOM currently carries. Applying is idempotent: a
  // zone already applied is a no-op, so `onChange` fires once per
  // changed value. `setZone` on the returned api is this same
  // function, so without the guard a consumer that mirrors the value
  // back from `onChange` re-enters it forever.
  let appliedValue = "";

  function applyZone(slug) {
    if (!slug) return;
    if (slug === appliedValue) return;
    appliedValue = slug;
    current = slug;
    const target = opts.target || document.documentElement;
    target.setAttribute("data-time-zone", slug);
    if (storageKey) safeStorageSet(storageKey, slug);
    // The hidden input carries the value into any enclosing form.
    if (input) input.value = slug;
    // Keep the listbox's selected state in sync with the applied zone.
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

  /** True while an open comes from outside (`setOpen`): state only, focus stays put. */
  let quiet = false;

  /** Report an open or close to `opts.onOpenChange` and as a bubbling `openchange` event on the root. */
  function emitOpenChange(isOpen) {
    if (typeof opts.onOpenChange === "function") opts.onOpenChange(isOpen);
    root.dispatchEvent(new CustomEvent("openchange", { detail: isOpen, bubbles: true }));
  }

  function openList(startIndex) {
    if (button.disabled) return;
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
    emitOpenChange(true);
    list.hidden = false;
    button.setAttribute("aria-expanded", "true");
    keyboard.setActive(start);
    // Focus moves to the listbox; the active option is conveyed via
    // aria-activedescendant, per the APG listbox pattern.
    if (!quiet) list.focus({ preventScroll: true });
  }

  function closeList(refocus = true) {
    if (!open) return;
    open = false;
    emitOpenChange(false);
    list.hidden = true;
    button.setAttribute("aria-expanded", "false");
    keyboard.setActive(-1);
    if (refocus) button.focus({ preventScroll: true });
  }

  function choose(index) {
    const slug = values[index];
    if (slug) applyZone(slug);
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
  // value attribute > stored zone (only if still offered) > default > the reader's own zone (or its offered
  // twin) > "UTC" > first
  // -----------------------------------------------------------------

  let initial = "";

  // 1. value prop, read from `data-lily-time-zone-picker-value`.
  initial = valueAttr;

  // 2. storage
  if (!initial && storageKey) {
    const stored = safeStorageGet(storageKey) || "";
    if (values.includes(stored)) initial = stored;
  }

  // 3. default-value
  if (!initial && defaultValue) initial = defaultValue;

  // 4. the reader's own zone, or an offered zone with the same offset and name
  if (!initial) {
    const infos = options.map((o) => ({
      id: o.getAttribute("data-value") || "",
      offsetMinutes: Number(o.getAttribute("data-offset-minutes")),
      name: o.getAttribute("data-name") || "",
    }));
    const dateAttr = root.getAttribute("data-lily-time-zone-picker-date");
    const when = dateAttr && !Number.isNaN(new Date(dateAttr).getTime()) ? new Date(dateAttr) : new Date();
    initial = matchZone(systemZone(), infos, root.getAttribute("data-lily-time-zone-picker-locale") || "", when) || "";
  }

  // 5. "UTC" if offered
  if (!initial && values.includes("UTC")) initial = "UTC";

  // 6. first option
  if (!initial && values.length > 0) initial = values[0];

  if (initial) applyZone(initial);

  const tooltipDestroy = wireTooltip(root, button, ".time-zone-picker-tooltip", list);

  return {
    isOpen: () => open,
    /** Open or close from outside: state only, focus stays put. Opening is ignored while disabled. */
    setOpen: (next) => {
      if (!!next === open) return;
      quiet = true;
      try {
        if (next) openList();
        else closeList(false);
      } finally {
        quiet = false;
      }
    },
    /** Disable or enable the button; disabling closes an open popup. */
    setDisabled: (next) => {
      button.disabled = !!next;
      if (next) closeList(false);
    },
    setZone: applyZone,
    destroy: () => {
      tooltipDestroy();
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
 * Find every [data-lily-time-zone-picker-root] and wire it.
 *
 * @param {{onChange?: (zone:string)=>void, target?: HTMLElement|null}=} opts
 * @returns {Array<{setZone: (zone:string)=>void, destroy: ()=>void}>}
 */
export function autoInit(opts = {}) {
  if (typeof document === "undefined") return [];
  const roots = Array.from(
    document.querySelectorAll("[data-lily-time-zone-picker-root]"),
  );
  return roots.map((root) => initTimeZonePicker(root, opts));
}
