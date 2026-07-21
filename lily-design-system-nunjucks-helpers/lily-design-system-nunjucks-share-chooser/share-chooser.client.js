// ShareChooser client-side runtime.
//
// Pairs with share-chooser.njk. The macro renders the markup with
// `data-lily-share-chooser-*` hooks and REAL destination hrefs; this
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

/**
 * Default button glyph: U+21AA RIGHTWARDS ARROW WITH HOOK.
 *
 * An in-font arrow rather than a pictograph, matching the other helpers'
 * rule: it renders in the page's own font on every platform and stays
 * monochrome alongside theme-chooser's ◑, locale-chooser's 🌐 and
 * text-size-chooser's "A".
 */
export const RIGHTWARDS_ARROW_WITH_HOOK = "↪";

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
 * the macro's default `share-chooser-{name}` shape. The macro derives
 * its ids from `opts.name` / `opts.id` instead, because a macro has no
 * module-level counter to share; this exists for consumers building
 * roots in JavaScript.
 */
export function nextShareChooserId() {
    uid += 1;
    return `share-chooser-${uid}`;
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

/**
 * Wire one rendered ShareChooser root.
 *
 * @param {HTMLElement} root - The <div data-lily-share-chooser-root>.
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
export function initShareChooser(root, opts = {}) {
    const noop = {
        open: () => {},
        close: () => {},
        copy: () => Promise.resolve(),
        refreshHrefs: () => {},
        destroy: () => {},
    };
    if (typeof document === "undefined" || !root) return noop;

    const trigger = root.querySelector("[data-lily-share-chooser-button]");
    const list = root.querySelector("[data-lily-share-chooser-list]");
    const status = root.querySelector("[data-lily-share-chooser-status]");
    if (!trigger || !list) return noop;

    const attr = (suffix) =>
        root.getAttribute(`data-lily-share-chooser-${suffix}`) || "";

    // Init opts win over the rendered attributes, so a consumer who is
    // already reaching for JavaScript can override what the template
    // baked in without re-rendering.
    const urlAttr = opts.url || attr("url");
    const title = opts.title || attr("title");
    const text = opts.text || attr("text");
    const strategy = opts.strategy || attr("strategy") || "auto";
    const copiedLabel = opts.copiedLabel || attr("copied-label");
    const copyFailedLabel =
        opts.copyFailedLabel || attr("copy-failed-label");

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
            list.querySelectorAll(".share-chooser-target, .share-chooser-copy"),
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
                `.share-chooser-target[data-target-id="${target.id}"]`,
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
        if (target) target.focus();
    }

    function closeList(refocus = true) {
        if (!open) return;
        open = false;
        list.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
        if (refocus) trigger.focus();
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
        const next = Math.min(
            Math.max((i < 0 ? 0 : i) + delta, 0),
            all.length - 1,
        );
        if (all[next]) all[next].focus();
    }

    // -----------------------------------------------------------------
    // Event handlers
    // -----------------------------------------------------------------

    async function onTriggerClick() {
        if (open) {
            closeList();
            return;
        }
        if (
            strategy === "native" ||
            (strategy === "auto" && canShareNatively())
        ) {
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
                if (all[0]) all[0].focus();
            }
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) openList(true);
            else {
                const all = items();
                if (all[all.length - 1]) all[all.length - 1].focus();
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
                if (all[0]) all[0].focus();
                break;
            }
            case "End": {
                event.preventDefault();
                const all = items();
                if (all[all.length - 1]) all[all.length - 1].focus();
                break;
            }
            case "Escape":
                event.preventDefault();
                closeList();
                break;
            case "Tab":
                // Tab leaves the control: close, but let focus go where
                // the browser was sending it.
                closeList(false);
                break;
            default:
                break;
        }
    }

    function onListClick(event) {
        const el = event.target;
        if (!el || !el.closest) return;

        const copy = el.closest(".share-chooser-copy");
        if (copy) {
            copyUrl();
            return;
        }

        const anchor = el.closest(".share-chooser-target");
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

    return {
        open: () => openList(),
        close: () => closeList(false),
        copy: copyUrl,
        refreshHrefs,
        destroy: () => {
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
 * Find every [data-lily-share-chooser-root] and wire it.
 *
 * @param {Parameters<typeof initShareChooser>[1]=} opts
 * @returns {Array<ReturnType<typeof initShareChooser>>}
 */
export function autoInit(opts = {}) {
    if (typeof document === "undefined") return [];
    const roots = Array.from(
        document.querySelectorAll("[data-lily-share-chooser-root]"),
    );
    return roots.map((root) => initShareChooser(root, opts));
}
