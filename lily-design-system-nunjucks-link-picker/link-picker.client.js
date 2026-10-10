// LinkPicker client-side runtime.
//
// Pairs with link-picker.njk. The macro renders the markup with `data-lily-link-picker-*` hooks
// and REAL link hrefs; this module picks them up in the browser and owns everything the markup
// cannot express: the disclosure INTERACTION (open / close, real focus movement, the keyboard
// contract, outside-click and focus-out dismissal) and the hover/focus tooltip.
//
// It applies NOTHING to the document and persists NOTHING. The links work without JavaScript —
// they are real hrefs — but the list cannot be opened (see docs/ssr.md).
//
// See spec/index.md §5 (behaviour).

let uid = 0;

/**
 * Mint a stable per-instance id prefix. SSR-safe by construction (no Math.random, no Date.now);
 * mirrors the macro's default `link-picker-{name}` shape. The macro derives its ids from
 * `opts.name` / `opts.id` instead; this exists for consumers building roots in JavaScript.
 */
export function nextLinkPickerId() {
  uid += 1;
  return `link-picker-${uid}`;
}

/** The id a link reports: its explicit `id`, else its `href`. */
export function linkId(link) {
  return (link && (link.id ?? link.href)) || "";
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
 * Wire one rendered LinkPicker root.
 *
 * @param {HTMLElement} root - The <div data-lily-link-picker-root>.
 * @param {{
 *   navigate?: (href: string) => void,
 *   onNavigate?: (id: string, href: string) => void
 * }=} opts
 *   `navigate` is the client-side routing hook: a plain left click calls `navigate(href)` and
 *   prevents the page load; modified clicks and `target="_blank"` links stay native.
 * @returns {{open: () => void, close: () => void, destroy: () => void}}
 */
export function initLinkPicker(root, opts = {}) {
  const noop = { open: () => {}, close: () => {}, destroy: () => {} };
  if (typeof document === "undefined" || !root) return noop;

  const trigger = root.querySelector("[data-lily-link-picker-button]");
  const list = root.querySelector("[data-lily-link-picker-list]");
  if (!trigger || !list) return noop;

  let open = false;

  /** Every focusable link in the list, in DOM order. */
  function items() {
    return Array.from(list.querySelectorAll(".link-picker-link"));
  }

  function openList(focusLast = false) {
    open = true;
    list.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    const all = items();
    const target = focusLast ? all[all.length - 1] : all[0];
    if (target) target.focus({ preventScroll: true });
  }

  function closeList(refocus = true) {
    if (!open) return;
    open = false;
    list.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    if (refocus) trigger.focus({ preventScroll: true });
  }

  function moveFocus(delta) {
    const all = items();
    if (all.length === 0) return;
    const i = all.indexOf(document.activeElement);
    // Clamp rather than wrap, matching the canonical Svelte helper.
    const next = Math.min(Math.max((i < 0 ? 0 : i) + delta, 0), all.length - 1);
    if (all[next]) all[next].focus({ preventScroll: true });
  }

  function onTriggerClick() {
    if (open) closeList();
    else openList();
  }

  function onTriggerKeydown(event) {
    // Enter and Space already produce a click; only the arrows need handling here.
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) openList();
      else {
        const all = items();
        if (all[0]) all[0].focus({ preventScroll: true });
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) openList(true);
      else {
        const all = items();
        if (all[all.length - 1]) all[all.length - 1].focus({ preventScroll: true });
      }
    }
  }

  function onListKeydown(event) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveFocus(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveFocus(-1);
        break;
      case "Home": {
        event.preventDefault();
        const all = items();
        if (all[0]) all[0].focus({ preventScroll: true });
        break;
      }
      case "End": {
        event.preventDefault();
        const all = items();
        if (all[all.length - 1]) all[all.length - 1].focus({ preventScroll: true });
        break;
      }
      case "Escape":
        event.preventDefault();
        closeList();
        break;
      case "Tab":
        // Focus goes to the button FIRST, without cancelling the key: hiding the list while a
        // link has focus drops focus to <body>, and the default Tab would restart from the top.
        trigger?.focus?.({ preventScroll: true });
        closeList(false);
        break;
      default:
        break;
    }
  }

  function onListClick(event) {
    const el = event.target;
    if (!el || !el.closest) return;
    const anchor = el.closest(".link-picker-link");
    if (!anchor) return;
    const href = anchor.getAttribute("href") || "";
    const id = anchor.getAttribute("data-link-id") || href;
    if (typeof opts.onNavigate === "function") opts.onNavigate(id, href);
    const modified =
      event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0;
    if (
      typeof opts.navigate === "function" &&
      anchor.getAttribute("target") !== "_blank" &&
      !modified &&
      !event.defaultPrevented
    ) {
      event.preventDefault();
      opts.navigate(href);
    }
    closeList();
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

  trigger.addEventListener("click", onTriggerClick);
  trigger.addEventListener("keydown", onTriggerKeydown);
  list.addEventListener("keydown", onListKeydown);
  list.addEventListener("click", onListClick);
  root.addEventListener("focusout", onRootFocusOut);
  document.addEventListener("click", onDocumentClick);

  const tooltipDestroy = wireTooltip(root, trigger, ".link-picker-tooltip", list);

  return {
    open: () => openList(),
    close: () => closeList(false),
    destroy: () => {
      tooltipDestroy();
      trigger.removeEventListener("click", onTriggerClick);
      trigger.removeEventListener("keydown", onTriggerKeydown);
      list.removeEventListener("keydown", onListKeydown);
      list.removeEventListener("click", onListClick);
      root.removeEventListener("focusout", onRootFocusOut);
      document.removeEventListener("click", onDocumentClick);
    },
  };
}

/**
 * Find every [data-lily-link-picker-root] and wire it.
 *
 * @param {Parameters<typeof initLinkPicker>[1]=} opts
 * @returns {Array<ReturnType<typeof initLinkPicker>>}
 */
export function autoInit(opts = {}) {
  if (typeof document === "undefined") return [];
  const roots = Array.from(document.querySelectorAll("[data-lily-link-picker-root]"));
  return roots.map((root) => initLinkPicker(root, opts));
}
