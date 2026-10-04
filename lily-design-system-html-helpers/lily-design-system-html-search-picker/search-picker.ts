/**
 * `<search-picker>` — Lily Design System HTML helper.
 *
 * See `./spec/index.md` for the canonical contract. This file implements
 * the custom-element class but does NOT register it. The `index.ts`
 * barrel registers it on import.
 *
 * The control is a single-icon button (a bundled magnifying-glass SVG)
 * that opens a disclosure panel holding a real `<form role="search">`: a
 * `type="search"` field and, after it, a `⏎` submit button. Submitting
 * navigates to `${action}?${encodeURIComponent(query.trim())}` — by
 * default `/?<query>`, so a search for `foo` goes to `/?foo`.
 *
 * Like `<share-picker>` this helper owns an *action*, not a user
 * preference: it applies nothing to the document and persists nothing.
 * There is no `storage-key`, and nothing is written to `localStorage`.
 *
 * Ported from the canonical Svelte helper
 * `@lilydesignsystem/svelte-search-picker`; Svelte wins on behaviour.
 */

/** Namespace for building the default button icon's SVG elements. */
const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * The submit button's visible content: U+23CE RETURN SYMBOL, a bare
 * literal character (never an escape — see `bin/test`'s glyph check).
 * It is the button's visible label only; the accessible name comes from
 * the required `submit-label` attribute, so assistive technology never
 * has to announce a symbol.
 */
export const RETURN_SYMBOL = "⏎";

/** Detail dispatched on the `search` CustomEvent. */
export type SearchPickerSearchDetail = {
    /** The trimmed query. */
    query: string;
    /** The destination: `searchHref(query, action)`. */
    href: string;
};

/** Mirrors the observed attributes / properties for typing convenience. */
export type SearchPickerProps = {
    /** Accessible name for the icon button and the search landmark. */
    label: string;
    /** Accessible name for the search field. Attribute `input-label`. */
    inputLabel: string;
    /** Accessible name for the ⏎ submit button. Attribute `submit-label`. */
    submitLabel: string;
    /** Placeholder for the field. No default. */
    placeholder?: string;
    /** The search text. */
    value?: string;
    /** Path the query is appended to. Default `"/"`. */
    action?: string;
    /** Property-only: performs the navigation. Default `location.assign`. */
    navigate?: (href: string) => void;
    /** Property-only callback; mirrored by the `search` CustomEvent. */
    onSearch?: (query: string, href: string) => void;
    class?: string;
};

/**
 * The destination for a query: `action` + `?` + the URI-encoded,
 * trimmed query. `searchHref("foo")` is `"/?foo"`;
 * `searchHref("foo bar")` is `"/?foo%20bar"`.
 */
export function searchHref(query: string, action = "/"): string {
    return `${action}?${encodeURIComponent(query.trim())}`;
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextSearchPickerId(): string {
    uid += 1;
    return `search-picker-${uid}`;
}

/** Custom-element class implementing `<search-picker>`. */
export class SearchPicker extends HTMLElement {
    static get observedAttributes(): string[] {
        return [
            "label",
            "input-label",
            "submit-label",
            "placeholder",
            "value",
            "action",
            "class",
        ];
    }

    /**
     * Performs the navigation. Property-only (a function). When unset,
     * the default is `location.assign(href)` — a real GET request.
     */
    navigate?: (href: string) => void;
    /** Fires with the trimmed query and href, before navigating. Mirrored by the `search` event. */
    onSearch?: (query: string, href: string) => void;

    // Rendered-DOM references. Null until #render() has run.
    #rootEl: HTMLDivElement | null = null;
    #buttonEl: HTMLButtonElement | null = null;
    #tooltip: { el: HTMLDivElement; update: () => void; destroy: () => void } | null = null;
    #panelEl: HTMLDivElement | null = null;
    #formEl: HTMLFormElement | null = null;
    #inputEl: HTMLInputElement | null = null;
    #submitEl: HTMLButtonElement | null = null;

    // Disclosure state.
    #open = false;
    // The live search text. Seeded from the `value` attribute; typing
    // updates this, never the attribute (same split as a native <input>).
    #value: string | null = null;

    // Stable id for the button/panel aria wiring.
    readonly #baseId = nextSearchPickerId();

    #onDocumentClick = (event: MouseEvent): void => {
        if (!this.#open) return;
        // Judge by composedPath(), not containment of event.target:
        // opening replaceChildren()s the button content, so the clicked
        // icon is already DETACHED when the click bubbles to the document
        // — the share-picker regression this guard exists for.
        if (!event.composedPath().includes(this)) this.closePanel(false);
    };

    // ---- Property accessors (attribute mirrors) ----

    get label(): string {
        return this.getAttribute("label") ?? "";
    }
    set label(v: string) {
        this.setAttribute("label", v);
    }

    get inputLabel(): string {
        return this.getAttribute("input-label") ?? "";
    }
    set inputLabel(v: string) {
        this.setAttribute("input-label", v);
    }

    get submitLabel(): string {
        return this.getAttribute("submit-label") ?? "";
    }
    set submitLabel(v: string) {
        this.setAttribute("submit-label", v);
    }

    get placeholder(): string {
        return this.getAttribute("placeholder") ?? "";
    }
    set placeholder(v: string) {
        if (v) this.setAttribute("placeholder", v);
        else this.removeAttribute("placeholder");
    }

    get action(): string {
        return this.getAttribute("action") || "/";
    }
    set action(v: string) {
        if (v) this.setAttribute("action", v);
        else this.removeAttribute("action");
    }

    /**
     * The live search text. Like a native `<input>`, the `value`
     * attribute seeds it and typing changes only the property; writing
     * the property updates the field without touching the attribute.
     */
    get value(): string {
        return this.#value ?? this.getAttribute("value") ?? "";
    }
    set value(v: string) {
        const next = v ?? "";
        if (next === this.value) return;
        this.#value = next;
        if (this.#inputEl && this.#inputEl.value !== next) this.#inputEl.value = next;
        this.#syncButtonContent();
    }

    /** Is the panel open? Read-only; use `openPanel()` / `closePanel()`. */
    get open(): boolean {
        return this.#open;
    }

    /** id of the rendered `<div class="search-picker-panel">`. */
    get panelId(): string {
        return `${this.#baseId}-panel`;
    }

    // ---- Public, overridable rendering hook ----

    /**
     * Build the content of the icon button. The default is a bundled
     * magnifying-glass SVG with `aria-hidden="true"`, so the accessible
     * name comes from the button's `aria-label` alone.
     *
     * This is the HTML-helper equivalent of the Svelte `children`
     * snippet and receives the same information as its `ChildArgs`:
     * `this.open` and `this.value` (the query). Light DOM has no
     * `<slot>`, so subclassing is the customisation surface. It re-runs
     * on open, close, and every change to the query.
     */
    renderButtonContent(): Node {
        const svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("class", "search-picker-icon");
        svg.setAttribute("viewBox", "0 0 16 16");
        svg.setAttribute("width", "1.05rem");
        svg.setAttribute("height", "1.05rem");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "1.6");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        const circle = document.createElementNS(SVG_NS, "circle");
        circle.setAttribute("cx", "7");
        circle.setAttribute("cy", "7");
        circle.setAttribute("r", "4.5");
        svg.appendChild(circle);
        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("d", "M10.5 10.5 14 14");
        svg.appendChild(path);
        return svg;
    }

    // ---- Lifecycle ----

    connectedCallback(): void {
        this.#render();
        document.addEventListener("click", this.#onDocumentClick);
    }

    attributeChangedCallback(name: string, old: string | null, value: string | null): void {
        // Idempotent: an unchanged write is a no-op.
        if (old === value) return;
        if (name === "value") {
            // The attribute re-seeds the live value, like a form reset.
            this.#value = null;
            if (this.#inputEl) this.#inputEl.value = this.value;
            this.#syncButtonContent();
            return;
        }
        // Every other attribute is a value on an element that already
        // exists, so it syncs in place. Nothing is ever rebuilt after the
        // first render, so focus inside an open panel always survives.
        this.#syncAttributes();
    }

    disconnectedCallback(): void {
        this.#tooltip?.destroy();
        document.removeEventListener("click", this.#onDocumentClick);
    }

    // ---- Open / close ----

    /** Open the panel and move focus into the search field. */
    openPanel(): void {
        if (!this.#rootEl) return;
        this.#open = true;
        this.#syncState();
        // preventScroll: the panel is positioned by consumer CSS, and
        // focusing a field rendered partly off-screen would otherwise
        // scroll the whole page. #syncState has already removed `hidden`.
        this.#inputEl?.focus({ preventScroll: true });
    }

    /** Close the panel. Returns focus to the button unless `refocus` is false. */
    closePanel(refocus = true): void {
        if (!this.#open) return;
        this.#open = false;
        this.#syncState();
        if (refocus) this.#buttonEl?.focus({ preventScroll: true });
    }

    // ---- Behaviour ----

    #onButtonClick = (): void => {
        if (this.#open) this.closePanel();
        else this.openPanel();
    };

    #onPanelKeydown = (event: KeyboardEvent): void => {
        if (event.key === "Escape") {
            event.preventDefault();
            this.closePanel();
        }
    };

    #onInput = (): void => {
        if (!this.#inputEl) return;
        this.#value = this.#inputEl.value;
        this.#syncButtonContent();
    };

    #onRootFocusOut = (event: FocusEvent): void => {
        // Close only when focus moves to a known element outside the
        // picker. A focusout with no relatedTarget is not "focus left":
        // Safari does not focus a <button> on click, so pressing ⏎ (or the
        // icon button) blurs the field with relatedTarget = null — and
        // document.activeElement is <body> afterwards, so even a deferred
        // activeElement re-check (the sibling pickers' pattern) closed the
        // panel before the click landed: ⏎ never searched, and the icon
        // button re-opened instead of closing. Reproduced in real WebKit,
        // 2026-10-02. Clicks outside the picker are handled by the
        // document click listener (#onDocumentClick).
        const next = event.relatedTarget as Node | null;
        if (!next || this.#rootEl?.contains(next)) return;
        this.closePanel(false);
    };

    #onSubmit = (event: Event): void => {
        // The form's native GET would send `/?name=value`; the contract is
        // the bare query (`/?foo`), so navigation is done here instead.
        event.preventDefault();
        const query = this.value.trim();
        if (!query) return;
        const href = searchHref(query, this.action);
        this.onSearch?.(query, href);
        this.dispatchEvent(
            new CustomEvent<SearchPickerSearchDetail>("search", {
                detail: { query, href },
                bubbles: true,
                composed: true,
            }),
        );
        this.closePanel(false);
        if (this.navigate) this.navigate(href);
        else if (typeof location !== "undefined") location.assign(href);
    };

    // ---- Rendering ----

    /** Rebuild the icon button content so an overriding hook stays current. */
    #syncButtonContent(): void {
        this.#buttonEl?.replaceChildren(this.renderButtonContent());
    }

    /** Open/closed state, written in place. */
    #syncState(): void {
        if (!this.#rootEl) return;
        this.#tooltip?.update();
        this.#buttonEl?.setAttribute("aria-expanded", String(this.#open));
        if (this.#panelEl) {
            if (this.#open) this.#panelEl.removeAttribute("hidden");
            else this.#panelEl.setAttribute("hidden", "");
        }
        this.#syncButtonContent();
    }

    /** Attribute-derived values, written in place on existing nodes. */
    #syncAttributes(): void {
        if (!this.#rootEl) return;
        this.#tooltip?.update();
        const extraClass = this.getAttribute("class") ?? "";
        this.#rootEl.className = `search-picker ${extraClass}`.trim();
        this.#buttonEl?.setAttribute("aria-label", this.label);
        this.#formEl?.setAttribute("aria-label", this.label);
        this.#formEl?.setAttribute("action", this.action);
        this.#inputEl?.setAttribute("aria-label", this.inputLabel);
        if (this.#inputEl) {
            // No default placeholder: it would be English.
            const placeholder = this.getAttribute("placeholder");
            if (placeholder) this.#inputEl.setAttribute("placeholder", placeholder);
            else this.#inputEl.removeAttribute("placeholder");
        }
        this.#submitEl?.setAttribute("aria-label", this.submitLabel);
    }

    #render(): void {
        if (!this.isConnected) return;
        // Re-connecting (e.g. moving the element) must not leave it open.
        this.#open = false;

        const root = document.createElement("div");
        root.addEventListener("focusout", this.#onRootFocusOut);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "search-picker-button";
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", this.panelId);
        button.appendChild(this.renderButtonContent());
        button.addEventListener("click", this.#onButtonClick);
        root.appendChild(button);
        this.#tooltip?.destroy();
        const tooltip = createTooltip(
            button,
            "search-picker-tooltip",
            `${this.#baseId}-tooltip`,
            () => this.label,
            () => this.#open,
        );
        root.appendChild(tooltip.el);
        this.#tooltip = tooltip;

        const panel = document.createElement("div");
        panel.className = "search-picker-panel";
        panel.id = this.panelId;
        panel.setAttribute("hidden", "");
        // Listens only for Escape bubbling up from the field and the
        // submit button; the panel itself takes no focus.
        panel.addEventListener("keydown", this.#onPanelKeydown);

        // A real search landmark: Return-to-submit, mobile search
        // keyboards and form semantics come from the platform. action /
        // method stay truthful even though submission is done in script.
        const form = document.createElement("form");
        form.className = "search-picker-form";
        form.setAttribute("role", "search");
        form.setAttribute("method", "get");
        form.addEventListener("submit", this.#onSubmit);

        const input = document.createElement("input");
        input.className = "search-picker-input";
        input.type = "search";
        input.setAttribute("enterkeyhint", "search");
        input.value = this.value;
        input.addEventListener("input", this.#onInput);
        form.appendChild(input);

        // After the field in DOM order: at its right in LTR, at its left
        // under dir="rtl". Placement beyond that is consumer CSS.
        const submit = document.createElement("button");
        submit.type = "submit";
        submit.className = "search-picker-submit";
        const symbol = document.createElement("span");
        symbol.className = "search-picker-submit-symbol";
        symbol.setAttribute("aria-hidden", "true");
        symbol.textContent = RETURN_SYMBOL;
        submit.appendChild(symbol);
        form.appendChild(submit);

        panel.appendChild(form);
        root.appendChild(panel);

        this.#rootEl = root;
        this.#buttonEl = button;
        this.#panelEl = panel;
        this.#formEl = form;
        this.#inputEl = input;
        this.#submitEl = submit;
        this.#syncAttributes();

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
