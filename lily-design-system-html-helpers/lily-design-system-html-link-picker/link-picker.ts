/**
 * `<link-picker>` — Lily Design System HTML helper.
 *
 * See `./spec/index.md` for the canonical contract. This file implements
 * the custom-element class but does NOT register it. The `index.ts`
 * barrel registers it on import.
 *
 * A single-icon button (a bundled home SVG) that opens a **disclosure
 * list** of page links the app defines: "Home", "About Us", "Contact Us",
 * "Privacy Policy", … It owns no routes and no words; every link, and
 * every accessible name, is the consumer's.
 *
 * It owns an *interaction*, not a preference: it applies nothing to the
 * document and persists nothing.
 */

const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * One destination in the list. The app defines them all.
 */
export type LinkItem = {
    /** Stable identifier, reported by the `navigate` event. Defaults to `href`. */
    id?: string;
    /** Visible link text. Consumer-supplied, so it localises. */
    label: string;
    /** Where the link goes: a route ("/about/") or a full URL. */
    href: string;
    /** Marks this link as the current page (`aria-current="page"`). */
    current?: boolean;
    /** Open in a new tab (`target="_blank"` with `rel="noopener noreferrer"`). */
    newTab?: boolean;
};

/** Detail dispatched on the cancelable `navigate` CustomEvent. */
export type LinkPickerNavigateDetail = {
    /** The chosen link's `id` (its `href` when it has none). */
    id: string;
    /** The chosen link's `href`. */
    href: string;
};

/** Mirrors the observed attributes / properties for typing convenience. */
export type LinkPickerProps = {
    label: string;
    /** Property, or a JSON array in the `links` attribute. */
    links?: LinkItem[];
    /** Property-only callback; mirrored by the `navigate` CustomEvent. */
    onNavigate?: (id: string, href: string) => void;
    class?: string;
};

/** The id a link reports: its explicit `id`, else its `href`. */
export function linkId(link: LinkItem): string {
    return link.id ?? link.href;
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextLinkPickerId(): string {
    uid += 1;
    return `link-picker-${uid}`;
}

/** Custom-element class implementing `<link-picker>`. */
export class LinkPicker extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "links", "class"];
    }

    #links: LinkItem[] = [];

    /** Fires after a link is chosen. Mirrored by the `navigate` event. */
    onNavigate?: (id: string, href: string) => void;

    #rootEl: HTMLDivElement | null = null;
    #buttonEl: HTMLButtonElement | null = null;
    #tooltip: { el: HTMLDivElement; update: () => void; destroy: () => void } | null = null;
    #listEl: HTMLUListElement | null = null;

    #open = false;

    readonly #baseId = nextLinkPickerId();

    #onDocumentClick = (event: MouseEvent): void => {
        if (!this.#open) return;
        // Judge by the composedPath() snapshot, not event.target: opening
        // replaces the button content, so the clicked icon is already
        // detached when the click bubbles back to the document.
        if (!event.composedPath().includes(this)) this.closeList(false);
    };

    // ---- Property accessors (attribute mirrors) ----

    get label(): string {
        return this.getAttribute("label") ?? "";
    }
    set label(v: string) {
        this.setAttribute("label", v);
    }

    /**
     * The page links. Settable as a property, or as a JSON array in the
     * `links` attribute for markup-only use:
     * `<link-picker label="Pages" links='[{"label":"Home","href":"/"}]'>`.
     * Setting the property writes no attribute (it would be a second
     * source of truth); reading returns the parsed attribute when no
     * property was set.
     */
    get links(): LinkItem[] {
        return [...this.#links];
    }
    set links(v: LinkItem[]) {
        this.#links = Array.isArray(v) ? v.slice() : [];
        this.#render();
    }

    /** Is the list open? Read-only; use `openList()` / `closeList()`. */
    get open(): boolean {
        return this.#open;
    }

    /** id of the rendered `<ul class="link-picker-list">`. */
    get listId(): string {
        return `${this.#baseId}-list`;
    }

    // ---- Public, overridable rendering hook ----

    /**
     * Build the content of the button: a bundled home SVG wrapped so the
     * accessible name comes from the button's `aria-label` alone. The
     * HTML-helper equivalent of the framework `children` snippet; light
     * DOM has no `<slot>`, so subclassing is the customisation surface.
     */
    renderButtonContent(): Node {
        const svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("class", "link-picker-icon");
        svg.setAttribute("viewBox", "0 0 16 16");
        svg.setAttribute("width", "1.05rem");
        svg.setAttribute("height", "1.05rem");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "1.6");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        for (const d of ["M2 7.5 8 2.5l6 5", "M3.5 6.5v7h9v-7", "M6.5 13.5V10h3v3.5"]) {
            const path = document.createElementNS(SVG_NS, "path");
            path.setAttribute("d", d);
            svg.appendChild(path);
        }
        return svg;
    }

    // ---- Lifecycle ----

    connectedCallback(): void {
        this.#readLinksAttribute();
        this.#render();
        document.addEventListener("click", this.#onDocumentClick);
    }

    attributeChangedCallback(name: string): void {
        if (name === "links") this.#readLinksAttribute();
        if (name === "label" || name === "links" || name === "class") this.#render();
    }

    disconnectedCallback(): void {
        this.#tooltip?.destroy();
        document.removeEventListener("click", this.#onDocumentClick);
    }

    #readLinksAttribute(): void {
        const raw = this.getAttribute("links");
        if (raw === null) return;
        try {
            const parsed = JSON.parse(raw);
            this.#links = Array.isArray(parsed) ? parsed : [];
        } catch {
            this.#links = [];
        }
    }

    // ---- Open / close ----

    /** Open the list. Focuses the last link instead of the first when `focusLast`. */
    openList(focusLast = false): void {
        const all = this.items();
        if (all.length === 0) return;
        this.#open = true;
        this.#syncState();
        (focusLast ? all[all.length - 1] : all[0])?.focus({ preventScroll: true });
    }

    /** Close the list. Returns focus to the trigger unless `refocus` is false. */
    closeList(refocus = true): void {
        if (!this.#open) return;
        this.#open = false;
        this.#syncState();
        if (refocus) this.#buttonEl?.focus({ preventScroll: true });
    }

    /** Every focusable link in the list, in DOM order. */
    items(): HTMLElement[] {
        if (!this.#listEl) return [];
        return [...this.#listEl.querySelectorAll<HTMLElement>(".link-picker-link")];
    }

    // ---- Behaviour ----

    #onButtonClick = (): void => {
        if (this.#open) this.closeList();
        else this.openList();
    };

    #onButtonKeydown = (event: KeyboardEvent): void => {
        // Enter and Space already produce a click; only the arrows need handling.
        if (event.key === "ArrowDown") {
            event.preventDefault();
            if (!this.#open) this.openList();
            else this.items()[0]?.focus({ preventScroll: true });
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (!this.#open) this.openList(true);
            else {
                const all = this.items();
                all[all.length - 1]?.focus({ preventScroll: true });
            }
        }
    };

    #moveFocus(delta: number): void {
        const all = this.items();
        if (all.length === 0) return;
        const i = all.indexOf(document.activeElement as HTMLElement);
        // Clamps rather than wrapping: a short list's ends are a real boundary.
        const next = Math.min(Math.max((i < 0 ? 0 : i) + delta, 0), all.length - 1);
        all[next]?.focus({ preventScroll: true });
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
            case "Home":
                event.preventDefault();
                this.items()[0]?.focus({ preventScroll: true });
                break;
            case "End": {
                event.preventDefault();
                const all = this.items();
                all[all.length - 1]?.focus({ preventScroll: true });
                break;
            }
            case "Escape":
                event.preventDefault();
                this.closeList();
                break;
            case "Tab":
                // Focus goes to the button FIRST, without cancelling the key:
                // hiding the list while a link has focus drops focus to
                // <body>, and the default Tab would restart from the top.
                this.#buttonEl?.focus?.({ preventScroll: true });
                this.closeList(false);
                break;
        }
    };

    #onRootFocusOut = (event: FocusEvent): void => {
        const next = event.relatedTarget as Node | null;
        if (next && this.#rootEl?.contains(next)) return;
        // Some engines dispatch focusout with a null relatedTarget before the
        // new focus target is committed; re-check on the next microtask.
        queueMicrotask(() => {
            const active = document.activeElement;
            if (active && this.#rootEl?.contains(active)) return;
            this.closeList(false);
        });
    };

    #choose(link: LinkItem, event: MouseEvent): void {
        const id = linkId(link);
        this.onNavigate?.(id, link.href);
        // Cancelable: a client-side router calls preventDefault() on the
        // event and navigates itself. Modified clicks and newTab links are
        // never offered for interception.
        const modified = event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0;
        const navigate = new CustomEvent<LinkPickerNavigateDetail>("navigate", {
            detail: { id, href: link.href },
            bubbles: true,
            composed: true,
            cancelable: !modified && !link.newTab,
        });
        if (!this.dispatchEvent(navigate)) event.preventDefault();
        this.closeList();
    }

    // ---- Rendering ----

    /** Update state-carrying attributes without rebuilding the DOM. */
    #syncState(): void {
        if (!this.#rootEl) return;
        this.#tooltip?.update();
        if (this.#buttonEl) {
            this.#buttonEl.setAttribute("aria-expanded", String(this.#open));
            this.#buttonEl.replaceChildren(this.renderButtonContent());
        }
        if (this.#listEl) {
            if (this.#open) this.#listEl.removeAttribute("hidden");
            else this.#listEl.setAttribute("hidden", "");
        }
    }

    #render(): void {
        if (!this.isConnected) return;
        this.#open = false;

        const extraClass = this.getAttribute("class") ?? "";
        const root = document.createElement("div");
        root.className = `link-picker ${extraClass}`.trim();
        root.addEventListener("focusout", this.#onRootFocusOut);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "link-picker-button";
        button.setAttribute("aria-label", this.label);
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", this.listId);
        button.appendChild(this.renderButtonContent());
        button.addEventListener("click", this.#onButtonClick);
        button.addEventListener("keydown", this.#onButtonKeydown);
        root.appendChild(button);
        this.#tooltip?.destroy();
        const tooltip = createTooltip(
            button,
            "link-picker-tooltip",
            `${this.#baseId}-tooltip`,
            () => this.label,
            () => this.#open,
        );
        root.appendChild(tooltip.el);
        this.#tooltip = tooltip;

        const list = document.createElement("ul");
        list.className = "link-picker-list";
        list.id = this.listId;
        list.setAttribute("aria-label", this.label);
        list.setAttribute("hidden", "");
        list.addEventListener("keydown", this.#onListKeydown);

        for (const link of this.#links) {
            const item = document.createElement("li");
            item.className = "link-picker-list-item";
            // A real link, not role="menuitem": these ARE navigation.
            const a = document.createElement("a");
            a.className = "link-picker-link";
            a.setAttribute("data-link-id", linkId(link));
            a.setAttribute("href", link.href);
            if (link.current) a.setAttribute("aria-current", "page");
            if (link.newTab) {
                a.setAttribute("target", "_blank");
                a.setAttribute("rel", "noopener noreferrer");
            }
            a.textContent = link.label;
            a.addEventListener("click", (event) => this.#choose(link, event));
            item.appendChild(a);
            list.appendChild(item);
        }
        root.appendChild(list);

        this.#rootEl = root;
        this.#buttonEl = button;
        this.#listEl = list;

        this.replaceChildren(root);
    }
}

// ---- Tooltip (module-local) ----

/**
 * The picker tooltip: a purely visual `<div role="tooltip">` holding the
 * button's label, shown while the pointer is over the button or the
 * tooltip itself (hoverable, WCAG 1.4.13) or while the button has keyboard
 * focus; Escape dismisses it without moving focus; never shown while the
 * popup is open. Deliberately NOT linked with `aria-describedby`: the text
 * duplicates the button's `aria-label`, so linking would announce the name
 * twice. All listeners sit on the button and tooltip elements themselves,
 * so they are discarded with the DOM and nothing needs removing on
 * disconnect. `update()` is idempotent.
 */
function createTooltip(
    button: HTMLButtonElement,
    className: string,
    id: string,
    getLabel: () => string,
    isOpen: () => boolean,
): { el: HTMLDivElement; update: () => void; destroy: () => void } {
    const el = document.createElement("div");
    el.className = className;
    el.setAttribute("role", "tooltip");
    el.id = id;
    el.setAttribute("hidden", "");
    let hoverButton = false;
    let hoverTooltip = false;
    let focusButton = false;
    let dismissed = false;
    let listening = false;
    // WCAG 1.4.13: Escape dismisses wherever focus is (pointer-only hover
    // has no focus on the button). Added only while visible.
    const onDocumentKeydown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        dismissed = true;
        update();
      }
    };
    const destroy = (): void => {
      if (listening) {
        document.removeEventListener("keydown", onDocumentKeydown);
        listening = false;
      }
    };
    const update = (): void => {
      const label = getLabel();
      if (el.textContent !== label) el.textContent = label;
      const visible =
        !isOpen() && !dismissed && (hoverButton || hoverTooltip || focusButton);
      if (visible) el.removeAttribute("hidden");
      else if (!el.hasAttribute("hidden")) el.setAttribute("hidden", "");
      if (visible && !listening) {
        document.addEventListener("keydown", onDocumentKeydown);
        listening = true;
      } else if (!visible) destroy();
    };
    button.addEventListener("mouseenter", () => {
      hoverButton = true;
      dismissed = false;
      update();
    });
    button.addEventListener("mouseleave", () => {
      hoverButton = false;
      update();
    });
    button.addEventListener("focus", () => {
      // Keyboard focus only: a mouse click also focuses the button in
      // Chromium, and the tooltip should not stick after a click.
      try {
        focusButton = button.matches(":focus-visible");
      } catch {
        focusButton = true; // engine without :focus-visible — err towards showing
      }
      update();
    });
    button.addEventListener("blur", () => {
      focusButton = false;
      dismissed = false;
      update();
    });
    button.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Escape" && !el.hasAttribute("hidden")) {
        dismissed = true;
        update();
      }
    });
    // A click acts on the control, so the pointer hint gets out of the way.
    button.addEventListener("click", () => {
      hoverButton = false;
      update();
    });
    el.addEventListener("mouseenter", () => {
      hoverTooltip = true;
      update();
    });
    el.addEventListener("mouseleave", () => {
      hoverTooltip = false;
      update();
    });
    update();
    return { el, update, destroy };
}
