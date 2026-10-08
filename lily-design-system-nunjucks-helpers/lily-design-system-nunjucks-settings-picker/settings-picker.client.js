// SettingsPicker client-side runtime.
//
// Pairs with settings-picker.njk. The macro renders the markup with `data-lily-settings-picker-*` hooks
// around whatever content the app puts in the `{% call %}` block; this module picks it up in
// the browser and owns everything the markup cannot express: the disclosure INTERACTION (open /
// close, real focus movement, the keyboard contract, outside-click and focus-out dismissal) and
// the hover/focus tooltip.
//
// It applies NOTHING to the document and persists NOTHING. The panel's content is server-rendered
// and present without JavaScript, but the panel cannot be opened (see docs/ssr.md).
//
// See spec/index.md §5 (behaviour).

let uid = 0;

/**
 * Mint a stable per-instance id prefix. SSR-safe by construction (no Math.random, no Date.now);
 * mirrors the macro's default `settings-picker-{name}` shape.
 */
export function nextSettingsPickerId() {
  uid += 1;
  return `settings-picker-${uid}`;
}

/** The selector for focusable things inside the panel. */
export const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
 * Wire one rendered SettingsPicker root.
 *
 * @param {HTMLElement} root - The <div data-lily-settings-picker-root>.
 * @param {{
 *   closeOnSelect?: boolean,
 *   onOpenChange?: (open: boolean) => void
 * }=} opts
 *   `closeOnSelect` (default true) closes the panel when a link, button or [role="menuitem"] inside
 *   it is activated; an ancestor with data-settings-picker-keep-open opts an element out.
 * @returns {{open: () => void, close: () => void, destroy: () => void}}
 */
export function initSettingsPicker(root, opts = {}) {
  const noop = { open: () => {}, close: () => {}, destroy: () => {} };
  if (typeof document === "undefined" || !root) return noop;

  const trigger = root.querySelector("[data-lily-settings-picker-button]");
  const panel = root.querySelector("[data-lily-settings-picker-panel]");
  if (!trigger || !panel) return noop;

  const closeOnSelect = opts.closeOnSelect !== false;
  let open = !panel.hidden;

  function setOpen(next) {
    if (open === next) return;
    open = next;
    panel.hidden = !next;
    trigger.setAttribute("aria-expanded", String(next));
    if (typeof opts.onOpenChange === "function") opts.onOpenChange(next);
  }

  /** Every focusable element in the panel, in DOM order. */
  function focusables() {
    return Array.from(panel.querySelectorAll(FOCUSABLE));
  }

  function openPanel(focus = "none") {
    setOpen(true);
    if (focus === "none") return;
    const all = focusables();
    const target = focus === "last" ? all[all.length - 1] : all[0];
    if (target) target.focus({ preventScroll: true });
  }

  function closePanel(refocus = true) {
    if (!open) return;
    setOpen(false);
    if (refocus) trigger.focus({ preventScroll: true });
  }

  function onTriggerClick() {
    if (open) closePanel();
    else openPanel();
  }

  function onTriggerKeydown(event) {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      closePanel();
    } else if (event.key === "ArrowDown") {
      // Enter and Space already produce a click; the arrows open and move into the panel.
      event.preventDefault();
      if (!open) openPanel("first");
      else {
        const all = focusables();
        if (all[0]) all[0].focus({ preventScroll: true });
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) openPanel("last");
      else {
        const all = focusables();
        if (all[all.length - 1]) all[all.length - 1].focus({ preventScroll: true });
      }
    }
  }

  function onPanelKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closePanel();
    } else if (event.key === "Tab") {
      // Focus goes to the button FIRST, without cancelling the key, so the browser continues from
      // the picker's position rather than from <body>.
      trigger.focus({ preventScroll: true });
      closePanel(false);
    }
  }

  function onPanelClick(event) {
    if (!closeOnSelect) return;
    const el = event.target;
    if (!el || !el.closest) return;
    const hit = el.closest('a[href], button, [role="menuitem"]');
    if (!hit || !panel.contains(hit)) return;
    if (hit.closest("[data-settings-picker-keep-open]")) return;
    closePanel();
  }

  function onRootFocusOut(event) {
    const next = event.relatedTarget;
    if (next && root.contains(next)) return;
    closePanel(false);
  }

  function onDocumentClick(event) {
    if (!open) return;
    const t = event.target;
    if (t && !root.contains(t)) closePanel(false);
  }

  trigger.addEventListener("click", onTriggerClick);
  trigger.addEventListener("keydown", onTriggerKeydown);
  panel.addEventListener("keydown", onPanelKeydown);
  panel.addEventListener("click", onPanelClick);
  root.addEventListener("focusout", onRootFocusOut);
  document.addEventListener("click", onDocumentClick);

  const tooltipDestroy = wireTooltip(root, trigger, ".settings-picker-tooltip", panel);

  return {
    open: () => openPanel(),
    close: () => closePanel(false),
    destroy: () => {
      tooltipDestroy();
      trigger.removeEventListener("click", onTriggerClick);
      trigger.removeEventListener("keydown", onTriggerKeydown);
      panel.removeEventListener("keydown", onPanelKeydown);
      panel.removeEventListener("click", onPanelClick);
      root.removeEventListener("focusout", onRootFocusOut);
      document.removeEventListener("click", onDocumentClick);
    },
  };
}

/**
 * Find every [data-lily-settings-picker-root] and wire it.
 *
 * @param {Parameters<typeof initSettingsPicker>[1]=} opts
 * @returns {Array<ReturnType<typeof initSettingsPicker>>}
 */
export function autoInit(opts = {}) {
  if (typeof document === "undefined") return [];
  const roots = Array.from(document.querySelectorAll("[data-lily-settings-picker-root]"));
  return roots.map((root) => initSettingsPicker(root, opts));
}
