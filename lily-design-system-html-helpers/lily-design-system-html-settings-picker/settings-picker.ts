/**
 * `<settings-picker>` — Lily Design System HTML helper.
 *
 * See `./spec/index.md` for the canonical contract. This file implements
 * the custom-element class but does NOT register it. The `index.ts`
 * barrel registers it on import.
 *
 * A single-icon button (a bundled cog SVG) that opens a **disclosure
 * panel** holding whatever the app provides: links, buttons, a form. The
 * element's own light-DOM children are the panel's content. It owns no
 * content and no words; the panel's content and every accessible name are
 * the consumer's.
 *
 * It owns an *interaction*, not a preference: it applies nothing to the
 * document and persists nothing.
 */

const SVG_NS = "http://www.w3.org/2000/svg";

/** The selector for focusable things inside the panel. */
export const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Detail dispatched on the `openchange` CustomEvent. */
export type SettingsPickerOpenChangeDetail = {
    /** The new open state. */
    open: boolean;
};

/** Mirrors the observed attributes / properties for typing convenience. */
export type SettingsPickerProps = {
    label: string;
    /** Is the panel open? Reflects the `open` attribute. */
    open?: boolean;
    /** Set `close-on-select="false"` to keep the panel open when its content is activated. */
    closeOnSelect?: boolean;
    class?: string;
};

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextSettingsPickerId(): string {
    uid += 1;
    return `settings-picker-${uid}`;
}

/** Custom-element class implementing `<settings-picker>`. */
export class SettingsPicker extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "class", "open"];
    }

    /**
     * The app's content: the element's original children, captured on first connect and moved into
     * the panel (light DOM has no `<slot>`). Kept across re-renders.
     */
    #content: Node[] | null = null;

    #rootEl: HTMLDivElement | null = null;
    #buttonEl: HTMLButtonElement | null = null;
    #tooltip: { el: HTMLDivElement; update: () => void; destroy: () => void } | null = null;
    #panelEl: HTMLDivElement | null = null;

    #open = false;

    readonly #baseId = nextSettingsPickerId();

    #onDocumentClick = (event: MouseEvent): void => {
        if (!this.#open) return;
        // Judge by the composedPath() snapshot, not event.target: opening
        // replaces the button content, so the clicked icon is already
        // detached when the click bubbles back to the document.
        if (!event.composedPath().includes(this)) this.closePanel(false);
    };

    // ---- Property accessors (attribute mirrors) ----

    get label(): string {
        return this.getAttribute("label") ?? "";
    }
    set label(v: string) {
        this.setAttribute("label", v);
    }

    /** Is the panel open? Reflects the `open` attribute. */
    get open(): boolean {
        return this.#open;
    }
    set open(v: boolean) {
        if (v) this.openPanel();
        else this.closePanel(false);
    }

    /** Close on select (default). `close-on-select="false"` turns it off. */
    get closeOnSelect(): boolean {
        return this.getAttribute("close-on-select") !== "false";
    }
    set closeOnSelect(v: boolean) {
        this.setAttribute("close-on-select", String(v));
    }

    /** id of the rendered `<div class="settings-picker-panel">`. */
    get panelId(): string {
        return `${this.#baseId}-panel`;
    }

    // ---- Public, overridable rendering hook ----

    /**
     * Build the content of the button: a bundled cog SVG wrapped so the
     * accessible name comes from the button's `aria-label` alone. The
     * HTML-helper equivalent of the framework `icon` snippet; light
     * DOM has no `<slot>`, so subclassing is the customisation surface.
     */
    renderButtonContent(): Node {
        const svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("class", "settings-picker-icon");
        svg.setAttribute("viewBox", "0 0 16 16");
        svg.setAttribute("width", "1.05rem");
        svg.setAttribute("height", "1.05rem");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "1.6");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        for (const d of ["M6.7 3.3L7.0 1.4L9.0 1.4L9.3 3.3L10.5 3.8L11.9 2.6L13.4 4.1L12.2 5.6L12.7 6.7L14.6 7.0L14.6 9.0L12.7 9.3L12.2 10.4L13.4 11.9L11.9 13.4L10.5 12.2L9.3 12.7L9.0 14.6L7.0 14.6L6.7 12.7L5.6 12.2L4.1 13.4L2.6 11.9L3.8 10.4L3.3 9.3L1.4 9.0L1.4 7.0L3.3 6.7L3.8 5.5L2.6 4.1L4.1 2.6L5.5 3.8Z"]) {
            const path = document.createElementNS(SVG_NS, "path");
            path.setAttribute("d", d);
            svg.appendChild(path);
        }
        const hub = document.createElementNS(SVG_NS, "circle");
        hub.setAttribute("cx", "8");
        hub.setAttribute("cy", "8");
        hub.setAttribute("r", "2.2");
        svg.appendChild(hub);
        return svg;
    }

    // ---- Lifecycle ----

    connectedCallback(): void {
        this.#render();
        if (this.hasAttribute("open")) this.openPanel();
        document.addEventListener("click", this.#onDocumentClick);
    }

    attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
        if (name === "open") {
            if (value !== null && !this.#open) this.openPanel();
            else if (value === null && this.#open) this.closePanel(false);
            return;
        }
        if (name === "label" || name === "class") this.#render();
    }

    disconnectedCallback(): void {
        this.#tooltip?.destroy();
        document.removeEventListener("click", this.#onDocumentClick);
    }

    // ---- Open / close ----

    /** Open the panel. `focus` moves focus to its first or last focusable element. */
    openPanel(focus: "none" | "first" | "last" = "none"): void {
        if (!this.#panelEl) return;
        const changed = !this.#open;
        this.#open = true;
        this.#syncState();
        if (focus !== "none") {
            const all = this.focusables();
            (focus === "last" ? all[all.length - 1] : all[0])?.focus({ preventScroll: true });
        }
        if (changed) this.#announce();
    }

    /** Close the panel. Returns focus to the trigger unless `refocus` is false. */
    closePanel(refocus = true): void {
        if (!this.#open) return;
        this.#open = false;
        this.#syncState();
        if (refocus) this.#buttonEl?.focus({ preventScroll: true });
        this.#announce();
    }

    /** Close the panel and return focus to the button. For the app's own controls to call. */
    close(): void {
        this.closePanel();
    }

    /** Every focusable element in the panel, in DOM order. */
    focusables(): HTMLElement[] {
        if (!this.#panelEl) return [];
        return [...this.#panelEl.querySelectorAll<HTMLElement>(FOCUSABLE)];
    }

    #announce(): void {
        if (this.#open) {
            if (!this.hasAttribute("open")) this.setAttribute("open", "");
        } else if (this.hasAttribute("open")) this.removeAttribute("open");
        this.dispatchEvent(
            new CustomEvent<SettingsPickerOpenChangeDetail>("openchange", {
                detail: { open: this.#open },
                bubbles: true,
                composed: true,
            }),
        );
    }

    // ---- Behaviour ----

    #onButtonClick = (): void => {
        if (this.#open) this.closePanel();
        else this.openPanel();
    };

    #onButtonKeydown = (event: KeyboardEvent): void => {
        if (event.key === "Escape" && this.#open) {
            event.preventDefault();
            this.closePanel();
        } else if (event.key === "ArrowDown") {
            // Enter and Space already produce a click; the arrows open and move into the panel.
            event.preventDefault();
            if (!this.#open) this.openPanel("first");
            else this.focusables()[0]?.focus({ preventScroll: true });
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (!this.#open) this.openPanel("last");
            else {
                const all = this.focusables();
                all[all.length - 1]?.focus({ preventScroll: true });
            }
        }
    };

    #onPanelKeydown = (event: KeyboardEvent): void => {
        if (event.key === "Escape") {
            event.preventDefault();
            this.closePanel();
        } else if (event.key === "Tab") {
            // Focus goes to the button FIRST, without cancelling the key, so the browser
            // continues from the picker's position rather than from <body>.
            this.#buttonEl?.focus?.({ preventScroll: true });
            this.closePanel(false);
        }
    };

    #onPanelClick = (event: MouseEvent): void => {
        if (!this.closeOnSelect) return;
        const target = event.target as Element | null;
        const hit = target?.closest?.('a[href], button, [role="menuitem"]');
        if (!hit || !this.#panelEl?.contains(hit)) return;
        if (hit.closest("[data-settings-picker-keep-open]")) return;
        this.closePanel();
    };

    #onRootFocusOut = (event: FocusEvent): void => {
        const next = event.relatedTarget as Node | null;
        if (next && this.#rootEl?.contains(next)) return;
        // Some engines dispatch focusout with a null relatedTarget before the
        // new focus target is committed; re-check on the next microtask.
        queueMicrotask(() => {
            const active = document.activeElement;
            if (active && this.#rootEl?.contains(active)) return;
            this.closePanel(false);
        });
    };

    // ---- Rendering ----

    /** Update state-carrying attributes without rebuilding the DOM. */
    #syncState(): void {
        if (!this.#rootEl) return;
        this.#tooltip?.update();
        if (this.#buttonEl) {
            this.#buttonEl.setAttribute("aria-expanded", String(this.#open));
            this.#buttonEl.replaceChildren(this.renderButtonContent());
        }
        if (this.#panelEl) {
            if (this.#open) this.#panelEl.removeAttribute("hidden");
            else this.#panelEl.setAttribute("hidden", "");
        }
    }

    #render(): void {
        if (!this.isConnected) return;
        // Capture the app's content before the first render replaces the children. This must live
        // here, not in connectedCallback: when the element is upgraded in place, the observed
        // attributes' attributeChangedCallback fires (and renders) before connectedCallback does.
        if (this.#content === null) this.#content = [...this.childNodes];
        const wasOpen = this.#open;

        const extraClass = this.getAttribute("class") ?? "";
        const root = document.createElement("div");
        root.className = `settings-picker ${extraClass}`.trim();
        root.addEventListener("focusout", this.#onRootFocusOut);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "settings-picker-button";
        button.setAttribute("aria-label", this.label);
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", this.panelId);
        button.appendChild(this.renderButtonContent());
        button.addEventListener("click", this.#onButtonClick);
        button.addEventListener("keydown", this.#onButtonKeydown);
        root.appendChild(button);
        this.#tooltip?.destroy();
        const tooltip = createTooltip(
            button,
            "settings-picker-tooltip",
            `${this.#baseId}-tooltip`,
            () => this.label,
            () => this.#open,
        );
        root.appendChild(tooltip.el);
        this.#tooltip = tooltip;

        // A named group, not a menu: the content is the app's.
        const panel = document.createElement("div");
        panel.className = "settings-picker-panel";
        panel.id = this.panelId;
        panel.setAttribute("role", "group");
        panel.setAttribute("aria-label", this.label);
        panel.setAttribute("hidden", "");
        panel.addEventListener("keydown", this.#onPanelKeydown);
        panel.addEventListener("click", this.#onPanelClick);
        for (const node of this.#content ?? []) panel.appendChild(node);
        root.appendChild(panel);

        this.#rootEl = root;
        this.#buttonEl = button;
        this.#panelEl = panel;

        this.replaceChildren(root);
        this.#open = false;
        if (wasOpen) {
            this.#open = true;
            this.#syncState();
        }
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
