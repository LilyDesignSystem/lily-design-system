// SharePicker client-side runtime.
//
// Pairs with share-picker.njk. The macro renders the markup with
// `data-lily-share-picker-*` hooks and REAL destination hrefs; this
// module picks them up in the browser and owns everything the markup
// cannot express:
//
// A. The disclosure INTERACTION: open / close, real focus movement,
//    the keyboard contract, outside-click and focus-out dismissal.
// B. The native share sheet path (`navigator.share`).
// C. Copy-to-clipboard, and the polite announcement of its outcome.
// D. Optional re-resolution of destination hrefs from FUNCTIONS, which
//    is where the canonical Svelte `href(url, title, text)` API lives
//    on in this catalog. See spec/index.md §3.3.
//
// Unlike the *-select helpers, this module applies NOTHING to the
// document and persists NOTHING. No localStorage, no data-* on <html>.
//
// See spec/index.md §4.3 (client.js exports), §5 (behaviour).

/** Is a native share sheet available? SSR-safe. */
export function canShareNatively() {
  return (
    typeof navigator !== "undefined" && typeof navigator.share === "function"
  );
}

/** Is an async clipboard available? SSR-safe. */
export function canCopy() {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  );
}

let uid = 0;

/**
 * Mint a stable per-instance id prefix.
 *
 * SSR-safe by construction (no Math.random, no Date.now), and mirrors
 * the macro's default `share-picker-{name}` shape. The macro derives
 * its ids from `opts.name` / `opts.id` instead, because a macro has no
 * module-level counter to share; this exists for consumers building
 * roots in JavaScript.
 */
export function nextSharePickerId() {
  uid += 1;
  return `share-picker-${uid}`;
}

/**
 * Resolve one target's href.
 *
 * Accepts the canonical function form — `href(url, title, text)` — and
 * the plain-string form the Nunjucks macro requires, so the same
 * `targets` array can feed both the template and this module. A
 * function that throws yields "" rather than breaking the whole list.
 *
 * @param {{href?: string | ((url: string, title: string, text: string) => string)}} target
 * @param {string} url
 * @param {string} title
 * @param {string} text
 * @returns {string}
 */
export function shareTargetHref(target, url, title, text) {
  if (!target) return "";
  const href = target.href;
  if (typeof href === "function") {
    try {
      return String(href(url || "", title || "", text || "") || "");
    } catch (_e) {
      return "";
    }
  }
  return href ? String(href) : "";
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
 * Wire one rendered SharePicker root.
 *
 * @param {HTMLElement} root - The <div data-lily-share-picker-root>.
 * @param {{
 *   url?: string,
 *   title?: string,
 *   text?: string,
 *   strategy?: "auto" | "native" | "list",
 *   targets?: Array<{id: string, href?: string | ((url: string, title: string, text: string) => string)}>,
 *   copiedLabel?: string,
 *   copyFailedLabel?: string,
 *   onShare?: (targetId: string, url: string) => void,
 *   onCopy?: (url: string) => void,
 *   onNativeShare?: (url: string) => void
 * }=} opts
 * @returns {{open: () => void, close: () => void, copy: () => Promise<void>, refreshHrefs: () => void, destroy: () => void}}
 */
export function initSharePicker(root, opts = {}) {
  const noop = {
    open: () => {},
    close: () => {},
    copy: () => Promise.resolve(),
    refreshHrefs: () => {},
    destroy: () => {},
  };
  if (typeof document === "undefined" || !root) return noop;

  const trigger = root.querySelector("[data-lily-share-picker-button]");
  const list = root.querySelector("[data-lily-share-picker-list]");
  const status = root.querySelector("[data-lily-share-picker-status]");
  if (!trigger || !list) return noop;

  const attr = (suffix) =>
    root.getAttribute(`data-lily-share-picker-${suffix}`) || "";

  // Init opts win over the rendered attributes, so a consumer who is
  // already reaching for JavaScript can override what the template
  // baked in without re-rendering.
  const urlAttr = opts.url || attr("url");
  const title = opts.title || attr("title");
  const text = opts.text || attr("text");
  const strategy = opts.strategy || attr("strategy") || "auto";
  const copiedLabel = opts.copiedLabel || attr("copied-label");
  const copyFailedLabel = opts.copyFailedLabel || attr("copy-failed-label");

  let open = false;

  /**
   * The URL to share. Resolved lazily at share time so the default
   * tracks the live location — which matters for client-side routing
   * — and so nothing here runs at render time.
   */
  function currentUrl() {
    if (urlAttr) return urlAttr;
    return typeof location !== "undefined" ? location.href : "";
  }

  /** Every focusable item in the list, in DOM order. */
  function items() {
    return Array.from(
      list.querySelectorAll(".share-picker-target, .share-picker-copy"),
    );
  }

  function setStatus(message) {
    if (status) status.textContent = message || "";
  }

  // -----------------------------------------------------------------
  // Function-href re-resolution (§3.3)
  //
  // The macro can only render pre-resolved href strings. A consumer
  // who supplies `targets` with function hrefs here gets the canonical
  // Svelte behaviour back: every anchor is rebuilt from the live URL.
  // -----------------------------------------------------------------

  function refreshHrefs() {
    if (!Array.isArray(opts.targets) || opts.targets.length === 0) return;
    const url = currentUrl();
    for (const target of opts.targets) {
      if (!target || !target.id) continue;
      const anchor = list.querySelector(
        `.share-picker-target[data-target-id="${target.id}"]`,
      );
      if (!anchor) continue;
      const href = shareTargetHref(target, url, title, text);
      if (href) anchor.setAttribute("href", href);
      if (target.newTab === false) anchor.removeAttribute("target");
    }
  }

  // -----------------------------------------------------------------
  // Open / close
  // -----------------------------------------------------------------

  function openList(focusLast = false) {
    open = true;
    list.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    setStatus("");
    refreshHrefs();
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

  // -----------------------------------------------------------------
  // Native share sheet
  // -----------------------------------------------------------------

  async function shareNatively() {
    if (!canShareNatively()) return false;
    const shareUrl = currentUrl();
    try {
      await navigator.share({ url: shareUrl, title, text });
      if (typeof opts.onNativeShare === "function") {
        opts.onNativeShare(shareUrl);
      }
      return true;
    } catch (_e) {
      // A rejected promise here is almost always the user
      // dismissing the sheet, which is not an error and must NOT
      // fall through to the list — that would resurrect UI they
      // just dismissed.
      return true;
    }
  }

  // -----------------------------------------------------------------
  // Copy
  // -----------------------------------------------------------------

  async function copyUrl() {
    const shareUrl = currentUrl();
    try {
      if (!canCopy()) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(shareUrl);
      if (typeof opts.onCopy === "function") opts.onCopy(shareUrl);
      if (copiedLabel) setStatus(copiedLabel);
    } catch (_e) {
      if (copyFailedLabel) setStatus(copyFailedLabel);
    }
    closeList();
  }

  // -----------------------------------------------------------------
  // Focus movement
  // -----------------------------------------------------------------

  function moveFocus(delta) {
    const all = items();
    if (all.length === 0) return;
    const i = all.indexOf(document.activeElement);
    // Clamp rather than wrap, matching the canonical Svelte helper.
    const next = Math.min(Math.max((i < 0 ? 0 : i) + delta, 0), all.length - 1);
    if (all[next]) all[next].focus({ preventScroll: true });
  }

  // -----------------------------------------------------------------
  // Event handlers
  // -----------------------------------------------------------------

  async function onTriggerClick() {
    if (open) {
      closeList();
      return;
    }
    if (strategy === "native" || (strategy === "auto" && canShareNatively())) {
      if (await shareNatively()) return;
    }
    openList();
  }

  function onTriggerKeydown(event) {
    // Enter and Space are the button's own activation keys and
    // already produce a click; only the arrows need handling here.
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
        // Tab leaves the control — but focus goes to the button
        // FIRST, without cancelling the key. Hiding the list while
        // one of its items has focus drops focus to <body>, and the
        // browser then computes the default Tab move from the top of
        // the document, so tabbing out of the open list teleported
        // the user to the page's first tab stop. From the button, the
        // default Tab lands exactly where leaving the picker should.
        // Guard the METHOD, not just the element: this shape has
        // bitten these helpers before.
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

    const copy = el.closest(".share-picker-copy");
    if (copy) {
      copyUrl();
      return;
    }

    const anchor = el.closest(".share-picker-target");
    if (!anchor) return;
    const id = anchor.getAttribute("data-target-id") || "";
    if (typeof opts.onShare === "function") opts.onShare(id, currentUrl());
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

  // Resolve function hrefs once up front, so the anchors are correct
  // before the list is ever opened (middle-click, copy-link-address).
  refreshHrefs();

  const tooltipDestroy = wireTooltip(root, trigger, ".share-picker-tooltip", list);

  return {
    open: () => openList(),
    close: () => closeList(false),
    copy: copyUrl,
    refreshHrefs,
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
 * Find every [data-lily-share-picker-root] and wire it.
 *
 * @param {Parameters<typeof initSharePicker>[1]=} opts
 * @returns {Array<ReturnType<typeof initSharePicker>>}
 */
export function autoInit(opts = {}) {
  if (typeof document === "undefined") return [];
  const roots = Array.from(
    document.querySelectorAll("[data-lily-share-picker-root]"),
  );
  return roots.map((root) => initSharePicker(root, opts));
}
