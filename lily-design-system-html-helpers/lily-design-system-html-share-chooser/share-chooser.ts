/**
 * `<share-chooser>` — Lily Design System HTML helper.
 *
 * See `./spec/index.md` for the canonical contract. This file implements
 * the custom-element class but does NOT register it. The `index.ts`
 * barrel registers it on import.
 *
 * The control is a single-glyph button that opens the **native share
 * sheet** where the browser provides one, and otherwise a **disclosure
 * list** of consumer-supplied destinations plus a built-in copy-the-URL
 * action.
 *
 * Unlike its sibling helpers this one owns an *action*, not a user
 * preference: it applies nothing to the document and persists nothing.
 * There is no `storage-key`, and nothing is written to `localStorage`.
 */

/**
 * Default button glyph: U+21AA RIGHTWARDS ARROW WITH HOOK.
 *
 * An in-font arrow rather than a pictograph, matching the other helpers'
 * rule: it renders in the page's own font on every platform and stays
 * monochrome alongside theme-chooser's ◑, locale-chooser's 🌐 and
 * text-size-chooser's "A".
 */
export const RIGHTWARDS_ARROW_WITH_HOOK = "↪";

/**
 * One destination in the share list.
 *
 * `href` is a function, not a string, so the consumer owns the whole URL
 * — this package ships no third-party endpoints and takes no view on
 * which networks exist. See `spec/index.md` §3.
 *
 * Because `href` is a function, `targets` **cannot** be expressed as an
 * attribute; it is a JS-property-only part of the API. See
 * `spec/index.md` §4.3.
 */
export type ShareTarget = {
    /** Stable identifier, reported back via `onShare` / the `share` event. */
    id: string;
    /** Visible link text. Consumer-supplied, so it localises. */
    label: string;
    /** Build the destination URL from the shared page's metadata. */
    href: (url: string, title: string, text: string) => string;
    /** Overrides the default `target="_blank"` for this destination. */
    newTab?: boolean;
};

/** How the button behaves when activated. */
export type ShareStrategy = "auto" | "native" | "list";

/** Detail dispatched on the `share` CustomEvent. */
export type ShareChooserShareDetail = {
    /** The chosen target's `id`. */
    targetId: string;
    /** The URL that was shared. */
    url: string;
};

/** Detail dispatched on the `copy` and `nativeshare` CustomEvents. */
export type ShareChooserUrlDetail = {
    /** The URL that was copied / handed to the native sheet. */
    url: string;
};

/** Mirrors the observed attributes / properties for typing convenience. */
export type ShareChooserProps = {
    label: string;
    /** Property-only: `href` is a function, so this cannot be an attribute. */
    targets?: ShareTarget[];
    url?: string;
    /** Attribute is `share-title`, not `title` — see `spec/index.md` §4.1. */
    shareTitle?: string;
    text?: string;
    copyLabel?: string;
    copiedLabel?: string;
    copyFailedLabel?: string;
    strategy?: ShareStrategy;
    /** Property-only callbacks; each has a matching CustomEvent. */
    onShare?: (targetId: string, url: string) => void;
    onCopy?: (url: string) => void;
    onNativeShare?: (url: string) => void;
    class?: string;
};

/** Is a native share sheet available? SSR-safe. */
export function canShareNatively(): boolean {
    return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

/** Is an async clipboard available? SSR-safe. */
export function canCopy(): boolean {
    return (
        typeof navigator !== "undefined" &&
        typeof navigator.clipboard?.writeText === "function"
    );
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextShareChooserId(): string {
    uid += 1;
    return `share-chooser-${uid}`;
}

/** Custom-element class implementing `<share-chooser>`. */
export class ShareChooser extends HTMLElement {
    static get observedAttributes(): string[] {
        return [
            "label",
            "url",
            // NOT "title": `title` is a global HTML attribute that would
            // render a tooltip over the whole control. See spec §4.1.
            "share-title",
            "text",
            "copy-label",
            "copied-label",
            "copy-failed-label",
            "strategy",
            "class",
        ];
    }

    // Backing storage for property-only members.
    #targets: ShareTarget[] = [];

    /** Fires after a destination is chosen. Mirrored by the `share` event. */
    onShare?: (targetId: string, url: string) => void;
    /** Fires after a successful copy. Mirrored by the `copy` event. */
    onCopy?: (url: string) => void;
    /** Fires when the native sheet was used. Mirrored by `nativeshare`. */
    onNativeShare?: (url: string) => void;

    // Rendered-DOM references. Null until #render() has run.
    #rootEl: HTMLDivElement | null = null;
    #buttonEl: HTMLButtonElement | null = null;
    #listEl: HTMLUListElement | null = null;
    #statusEl: HTMLParagraphElement | null = null;
    #targetEls: HTMLAnchorElement[] = [];

    // Disclosure state.
    #open = false;
    #status = "";

    // Stable id for the button/list aria wiring.
    readonly #baseId = nextShareChooserId();

    #onDocumentClick = (event: MouseEvent): void => {
        if (!this.#open) return;
        const t = event.target as Node | null;
        if (t && this.#rootEl && !this.#rootEl.contains(t)) this.closeList(false);
    };

    // ---- Property accessors (attribute mirrors) ----

    get label(): string {
        return this.getAttribute("label") ?? "";
    }
    set label(v: string) {
        this.setAttribute("label", v);
    }

    get url(): string {
        return this.getAttribute("url") ?? "";
    }
    set url(v: string) {
        if (v) this.setAttribute("url", v);
        else this.removeAttribute("url");
    }

    /**
     * Title passed to `href(...)` and the native sheet.
     *
     * Named `shareTitle` / `share-title` rather than `title`, because
     * `title` is a global HTML attribute and an `HTMLElement` property:
     * claiming it would paint a tooltip over the whole control and
     * shadow a platform member. The one unavoidable rename against the
     * cross-framework prop table. See `spec/index.md` §4.1.
     */
    get shareTitle(): string {
        return this.getAttribute("share-title") ?? "";
    }
    set shareTitle(v: string) {
        if (v) this.setAttribute("share-title", v);
        else this.removeAttribute("share-title");
    }

    get text(): string {
        return this.getAttribute("text") ?? "";
    }
    set text(v: string) {
        if (v) this.setAttribute("text", v);
        else this.removeAttribute("text");
    }

    get copyLabel(): string {
        return this.getAttribute("copy-label") ?? "";
    }
    set copyLabel(v: string) {
        if (v) this.setAttribute("copy-label", v);
        else this.removeAttribute("copy-label");
    }

    get copiedLabel(): string {
        return this.getAttribute("copied-label") ?? "";
    }
    set copiedLabel(v: string) {
        if (v) this.setAttribute("copied-label", v);
        else this.removeAttribute("copied-label");
    }

    get copyFailedLabel(): string {
        return this.getAttribute("copy-failed-label") ?? "";
    }
    set copyFailedLabel(v: string) {
        if (v) this.setAttribute("copy-failed-label", v);
        else this.removeAttribute("copy-failed-label");
    }

    get strategy(): ShareStrategy {
        const v = this.getAttribute("strategy");
        return v === "native" || v === "list" ? v : "auto";
    }
    set strategy(v: ShareStrategy) {
        if (v) this.setAttribute("strategy", v);
        else this.removeAttribute("strategy");
    }

    /**
     * The share destinations.
     *
     * Property-only. `ShareTarget.href` is a function, so there is no
     * honest attribute encoding — a JSON attribute could not carry it,
     * and shipping a string-template form would bake in a URL
     * convention this package deliberately refuses to own.
     */
    get targets(): ShareTarget[] {
        return [...this.#targets];
    }
    set targets(v: ShareTarget[]) {
        this.#targets = Array.isArray(v) ? v.slice() : [];
        this.#render();
    }

    /** Is the list open? Read-only; use `openList()` / `closeList()`. */
    get open(): boolean {
        return this.#open;
    }

    /** The text currently shown in the polite status region. */
    get status(): string {
        return this.#status;
    }

    /** id of the rendered `<ul class="share-chooser-list">`. */
    get listId(): string {
        return `${this.#baseId}-list`;
    }

    /**
     * The URL to share. Resolved lazily so the default works without the
     * consumer threading `location.href` through, and so importing this
     * module under SSR never touches `location`.
     */
    currentUrl(): string {
        const explicit = this.url;
        if (explicit) return explicit;
        return typeof location !== "undefined" ? location.href : "";
    }

    // ---- Public, overridable rendering hook ----

    /**
     * Build the content of the button. The default is the ↪ glyph
     * wrapped in `aria-hidden="true"`, so the accessible name comes from
     * the button's `aria-label` alone.
     *
     * This is the HTML-helper equivalent of the Svelte/React/Vue
     * `children` snippet, and it receives the same information those
     * frameworks pass as `ChildArgs`: `this.open` and `this.currentUrl()`
     * are both available. Light DOM has no `<slot>`, so subclassing is
     * the customisation surface. Whatever this returns is placed inside
     * the button; the button's own aria wiring is not the subclass's to
     * change. See `docs/custom-rendering.md`.
     */
    renderButtonContent(): Node {
        const icon = document.createElement("span");
        icon.className = "share-chooser-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = RIGHTWARDS_ARROW_WITH_HOOK;
        return icon;
    }

    // ---- Lifecycle ----

    connectedCallback(): void {
        this.#render();
        document.addEventListener("click", this.#onDocumentClick);
    }

    attributeChangedCallback(name: string, _old: string | null, _value: string | null): void {
        switch (name) {
            // Structural: these change which elements exist, so the DOM
            // is rebuilt. `copy-label` gates the copy item's existence.
            case "label":
            case "copy-label":
            case "class":
                this.#render();
                break;
            // Non-structural: these only change attribute values on
            // elements that already exist. Rebuilding here would destroy
            // focus inside an open list, so they sync in place.
            case "url":
            case "share-title":
            case "text":
                this.#syncState();
                break;
            // copied-label / copy-failed-label / strategy affect the next
            // action only; nothing rendered depends on them.
            default:
                break;
        }
    }

    disconnectedCallback(): void {
        document.removeEventListener("click", this.#onDocumentClick);
    }

    // ---- Open / close ----

    /** Open the list. Focuses the last item instead of the first when `focusLast`. */
    openList(focusLast = false): void {
        const all = this.items();
        if (all.length === 0) return;
        this.#open = true;
        this.#status = "";
        this.#syncState();
        // Items are real focusable elements, so focus moves for real
        // rather than via aria-activedescendant. #syncState has already
        // removed `hidden`, so the target is focusable by now.
        (focusLast ? all[all.length - 1] : all[0])?.focus();
    }

    /** Close the list. Returns focus to the trigger unless `refocus` is false. */
    closeList(refocus = true): void {
        if (!this.#open) return;
        this.#open = false;
        this.#syncState();
        if (refocus) this.#buttonEl?.focus();
    }

    /** Every focusable item in the list, in DOM order. */
    items(): HTMLElement[] {
        if (!this.#listEl) return [];
        return [
            ...this.#listEl.querySelectorAll<HTMLElement>(
                ".share-chooser-target, .share-chooser-copy",
            ),
        ];
    }

    // ---- Behaviour ----

    #announce(message: string): void {
        this.#status = message;
        if (this.#statusEl) this.#statusEl.textContent = message;
    }

    async #shareNatively(): Promise<boolean> {
        if (!canShareNatively()) return false;
        const shareUrl = this.currentUrl();
        try {
            await navigator.share({ url: shareUrl, title: this.shareTitle, text: this.text });
            this.onNativeShare?.(shareUrl);
            this.dispatchEvent(
                new CustomEvent<ShareChooserUrlDetail>("nativeshare", {
                    detail: { url: shareUrl },
                    bubbles: true,
                    composed: true,
                }),
            );
            return true;
        } catch {
            // A rejected promise here is almost always the user dismissing
            // the sheet, which is not an error and must not fall through to
            // the list — that would reopen UI they just dismissed.
            return true;
        }
    }

    #onButtonClick = async (): Promise<void> => {
        if (this.#open) {
            this.closeList();
            return;
        }
        const strategy = this.strategy;
        if (strategy === "native" || (strategy === "auto" && canShareNatively())) {
            if (await this.#shareNatively()) return;
        }
        this.openList();
    };

    #onButtonKeydown = (event: KeyboardEvent): void => {
        // Enter and Space are the button's own activation keys and already
        // produce a click; only the arrows need handling here.
        if (event.key === "ArrowDown") {
            event.preventDefault();
            if (!this.#open) this.openList();
            else this.items()[0]?.focus();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (!this.#open) this.openList(true);
            else {
                const all = this.items();
                all[all.length - 1]?.focus();
            }
        }
    };

    #moveFocus(delta: number): void {
        const all = this.items();
        if (all.length === 0) return;
        const i = all.indexOf(document.activeElement as HTMLElement);
        // Clamps rather than wrapping: the ends of the list are a real
        // boundary, and wrapping in a short disclosure list disorients.
        const next = Math.min(Math.max((i < 0 ? 0 : i) + delta, 0), all.length - 1);
        all[next]?.focus();
    }

    #onListKeydown = (event: KeyboardEvent): void => {
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                this.#moveFocus(1);
                break;
            case "ArrowUp":
                event.preventDefault();
                this.#moveFocus(-1);
                break;
            case "Home": {
                event.preventDefault();
                this.items()[0]?.focus();
                break;
            }
            case "End": {
                event.preventDefault();
                const all = this.items();
                all[all.length - 1]?.focus();
                break;
            }
            case "Escape":
                event.preventDefault();
                this.closeList();
                break;
            case "Tab":
                // Tab leaves the control: close, but let focus go where the
                // browser was sending it.
                this.closeList(false);
                break;
        }
    };

    #onRootFocusOut = (event: FocusEvent): void => {
        const next = event.relatedTarget as Node | null;
        if (next && this.#rootEl?.contains(next)) return;
        // Some engines (and jsdom) dispatch focusout with a null
        // relatedTarget before the new focus target is committed, so
        // re-check activeElement on the next microtask before closing.
        queueMicrotask(() => {
            const active = document.activeElement;
            if (active && this.#rootEl?.contains(active)) return;
            this.closeList(false);
        });
    };

    #chooseTarget(target: ShareTarget): void {
        const shareUrl = this.currentUrl();
        this.onShare?.(target.id, shareUrl);
        this.dispatchEvent(
            new CustomEvent<ShareChooserShareDetail>("share", {
                detail: { targetId: target.id, url: shareUrl },
                bubbles: true,
                composed: true,
            }),
        );
        this.closeList();
    }

    async #copyUrl(): Promise<void> {
        const shareUrl = this.currentUrl();
        try {
            if (!canCopy()) throw new Error("clipboard unavailable");
            await navigator.clipboard.writeText(shareUrl);
            this.onCopy?.(shareUrl);
            this.dispatchEvent(
                new CustomEvent<ShareChooserUrlDetail>("copy", {
                    detail: { url: shareUrl },
                    bubbles: true,
                    composed: true,
                }),
            );
            if (this.copiedLabel) this.#announce(this.copiedLabel);
        } catch {
            // Copying can fail for permissions, an insecure context, or a
            // browser with no clipboard API at all. None of those may throw
            // out of here.
            if (this.copyFailedLabel) this.#announce(this.copyFailedLabel);
        }
        this.closeList();
    }

    // ---- Rendering ----

    /**
     * Update every state-carrying attribute without rebuilding the DOM:
     * `aria-expanded`, the list's `hidden`, the destination hrefs, the
     * status text, and the button's content.
     *
     * Everything here is an in-place attribute write, so a state change
     * never destroys focus inside an open list.
     */
    #syncState(): void {
        if (!this.#rootEl) return;

        if (this.#buttonEl) {
            this.#buttonEl.setAttribute("aria-expanded", String(this.#open));
            // Rebuild the button content so an overridden
            // renderButtonContent() that reads `open` or `currentUrl()`
            // stays current. This is what makes the hook behave like the
            // reactive `children` snippet in the other frameworks.
            this.#buttonEl.replaceChildren(this.renderButtonContent());
        }

        if (this.#listEl) {
            if (this.#open) this.#listEl.removeAttribute("hidden");
            else this.#listEl.setAttribute("hidden", "");
        }

        // Hrefs are recomputed in place rather than by re-rendering, so a
        // url/title/text change while the list is open keeps focus.
        const shareUrl = this.currentUrl();
        const title = this.shareTitle;
        const text = this.text;
        this.#targetEls.forEach((a, i) => {
            const target = this.#targets[i];
            if (target) a.setAttribute("href", target.href(shareUrl, title, text));
        });

        if (this.#statusEl) this.#statusEl.textContent = this.#status;
    }

    #render(): void {
        if (!this.isConnected) return;

        // A structural rebuild cannot preserve focus inside the list, so
        // it closes first.
        this.#open = false;
        this.#status = "";

        const extraClass = this.getAttribute("class") ?? "";
        const root = document.createElement("div");
        root.className = `share-chooser ${extraClass}`.trim();
        root.addEventListener("focusout", this.#onRootFocusOut);

        const button = document.createElement("button");
        button.type = "button";
        // Follows the catalog's `{helper}-button` convention, same as the
        // sibling helpers.
        button.className = "share-chooser-button";
        button.setAttribute("aria-label", this.label);
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", this.listId);
        button.appendChild(this.renderButtonContent());
        button.addEventListener("click", this.#onButtonClick);
        button.addEventListener("keydown", this.#onButtonKeydown);
        root.appendChild(button);

        const list = document.createElement("ul");
        list.className = "share-chooser-list";
        list.id = this.listId;
        list.setAttribute("hidden", "");
        list.addEventListener("keydown", this.#onListKeydown);

        const shareUrl = this.currentUrl();
        const title = this.shareTitle;
        const text = this.text;

        const targetEls: HTMLAnchorElement[] = [];
        this.#targets.forEach((target) => {
            const item = document.createElement("li");
            item.className = "share-chooser-list-item";

            // A real link, not role="menuitem": these ARE navigation, and
            // menuitem would strip middle-click, open-in-new-tab and
            // copy-link-address.
            const a = document.createElement("a");
            a.className = "share-chooser-target";
            a.setAttribute("data-target-id", target.id);
            a.setAttribute("href", target.href(shareUrl, title, text));
            if (target.newTab !== false) {
                a.setAttribute("target", "_blank");
            }
            a.setAttribute("rel", "noopener noreferrer");
            a.textContent = target.label;
            a.addEventListener("click", () => this.#chooseTarget(target));

            item.appendChild(a);
            list.appendChild(item);
            targetEls.push(a);
        });

        // The copy item renders only when `copy-label` is supplied: a
        // default would be a hardcoded English string.
        if (this.copyLabel) {
            const item = document.createElement("li");
            item.className = "share-chooser-list-item";
            const copyEl = document.createElement("button");
            copyEl.type = "button";
            copyEl.className = "share-chooser-copy";
            copyEl.textContent = this.copyLabel;
            copyEl.addEventListener("click", () => void this.#copyUrl());
            item.appendChild(copyEl);
            list.appendChild(item);
        }
        root.appendChild(list);

        // Copying gives no visual feedback of its own, so the outcome is
        // announced. Empty until something happens, so it stays silent on
        // load; aria-live announces mutations only.
        const status = document.createElement("p");
        status.className = "share-chooser-status";
        status.setAttribute("aria-live", "polite");
        status.textContent = "";
        root.appendChild(status);

        this.#rootEl = root;
        this.#buttonEl = button;
        this.#listEl = list;
        this.#statusEl = status;
        this.#targetEls = targetEls;

        this.replaceChildren(root);
    }
}
