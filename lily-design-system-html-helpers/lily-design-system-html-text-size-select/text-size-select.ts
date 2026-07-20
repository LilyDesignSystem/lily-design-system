/**
 * `<text-size-select>` — Lily Design System HTML helper.
 *
 * See `./spec/index.md` for the canonical contract. This file implements
 * the custom-element class but does NOT register it. The `index.ts`
 * barrel registers it on import.
 *
 * The control is an icon button that opens a dropdown listbox
 * (WAI-ARIA APG listbox pattern). It is not a native `<select>`.
 */

/**
 * Default button glyph: U+0041 LATIN CAPITAL LETTER A.
 *
 * A plain letter rather than a pictograph, deliberately. The obvious
 * candidate — U+1F5DB DECREASE FONT SIZE SYMBOL — has no real glyph in
 * common font stacks and falls back to a crude bitmap shape, and it
 * means *decrease* rather than *size*. "A" renders in the page's own
 * font on every platform, stays monochrome like theme-select's ◑, and
 * is the conventional text-size affordance.
 */
export const LATIN_CAPITAL_LETTER_A = "A";

/** Change-event detail dispatched on every applied size. */
export type TextSizeSelectChangeDetail = {
    size: string;
};

/** Mirrors the observed attributes / properties for typing convenience. */
export type TextSizeSelectProps = {
    label: string;
    sizes: string[];
    value?: string;
    defaultValue?: string;
    storageKey?: string;
    name?: string;
    target?: HTMLElement | null;
    sizeLabels?: Record<string, string>;
    class?: string;
};

/**
 * Resolve a size slug to its display label: each hyphen-separated word
 * title-cased, so "x-large" renders as "X Large".
 *
 * Mirrors `themeName` in theme-select and `localeName` in
 * locale-select. The element's `labelFor` delegates here after
 * consulting `size-labels`, so there is exactly one implementation of
 * the title-casing rule.
 */
export function sizeName(size: string): string {
    return size
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextTextSizeSelectId(): string {
    uid += 1;
    return `text-size-select-${uid}`;
}

/** Custom-element class implementing `<text-size-select>`. */
export class TextSizeSelect extends HTMLElement {
    static get observedAttributes(): string[] {
        return [
            "label",
            "sizes",
            "value",
            "default-value",
            "storage-key",
            "name",
            "size-labels",
            "class",
        ];
    }

    // Backing storage for properties.
    #sizes: string[] = [];
    #sizeLabels: Record<string, string> = {};
    #target: HTMLElement | null = null;
    #initialised = false;

    // Rendered-DOM references. Null until #render() has run.
    #rootEl: HTMLDivElement | null = null;
    #inputEl: HTMLInputElement | null = null;
    #buttonEl: HTMLButtonElement | null = null;
    #listEl: HTMLUListElement | null = null;
    #optionEls: HTMLLIElement[] = [];

    // Listbox state.
    #open = false;
    #activeIndex = -1;

    // Stable ids for the button/listbox aria wiring.
    readonly #baseId = nextTextSizeSelectId();

    // Typeahead buffer: APG listbox behaviour. Reset after a pause.
    #typeahead = "";
    #typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

    #onDocumentClick = (event: MouseEvent): void => {
        if (!this.#open) return;
        const t = event.target as Node | null;
        if (t && this.#rootEl && !this.#rootEl.contains(t)) this.closeList(false);
    };

    // ---- Property accessors ----

    get label(): string {
        return this.getAttribute("label") ?? "";
    }
    set label(v: string) {
        this.setAttribute("label", v);
    }

    get sizes(): string[] {
        return [...this.#sizes];
    }
    set sizes(v: string[]) {
        this.#sizes = Array.isArray(v) ? v.slice() : [];
        // Keep the attribute in sync (CSV form) without re-entering the
        // attribute change callback to re-parse.
        const csv = this.#sizes.join(",");
        if (this.getAttribute("sizes") !== csv) {
            this.setAttribute("sizes", csv);
            return; // attributeChangedCallback will render
        }
        this.#render();
    }

    get value(): string {
        return this.getAttribute("value") ?? "";
    }
    set value(v: string) {
        if (v) this.setAttribute("value", v);
        else this.removeAttribute("value");
    }

    get defaultValue(): string {
        return this.getAttribute("default-value") ?? "";
    }
    set defaultValue(v: string) {
        if (v) this.setAttribute("default-value", v);
        else this.removeAttribute("default-value");
    }

    get storageKey(): string {
        return this.getAttribute("storage-key") ?? "";
    }
    set storageKey(v: string) {
        if (v) this.setAttribute("storage-key", v);
        else this.removeAttribute("storage-key");
    }

    get name(): string {
        return this.getAttribute("name") ?? "text-size";
    }
    set name(v: string) {
        if (v) this.setAttribute("name", v);
        else this.removeAttribute("name");
    }

    get sizeLabels(): Record<string, string> {
        return { ...this.#sizeLabels };
    }
    set sizeLabels(v: Record<string, string>) {
        this.#sizeLabels = v && typeof v === "object" ? { ...v } : {};
        const json = JSON.stringify(this.#sizeLabels);
        if (this.getAttribute("size-labels") !== json) {
            this.setAttribute("size-labels", json);
            return;
        }
        this.#render();
    }

    get target(): HTMLElement | null {
        return this.#target;
    }
    set target(v: HTMLElement | null) {
        this.#target = v ?? null;
    }

    /** Is the listbox open? Read-only; use `openList()` / `closeList()`. */
    get open(): boolean {
        return this.#open;
    }

    /** id of the rendered `<ul role="listbox">`. */
    get listId(): string {
        return `${this.#baseId}-list`;
    }

    /** id of the rendered option at `index`. */
    optionId(index: number): string {
        return `${this.#baseId}-option-${index}`;
    }

    // ---- Public, overridable rendering hook ----

    /**
     * Build the content of the button. The default is the "A" glyph
     * wrapped in `aria-hidden="true"` so the accessible name comes from
     * the button's `aria-label` alone.
     *
     * This is the HTML-helper equivalent of the Svelte/React/Vue
     * `children` snippet: it replaces the glyph inside the button, and
     * has `this.value`, `this.open`, and `this.labelFor(...)` available.
     * Subclasses may override it. Whatever it returns is placed inside
     * the button; the button's own aria wiring is not the subclass's to
     * change.
     */
    renderButtonContent(): Node {
        const icon = document.createElement("span");
        icon.className = "text-size-select-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = LATIN_CAPITAL_LETTER_A;
        return icon;
    }

    /** Resolve a slug to its display label. Public for subclasses. */
    labelFor(size: string): string {
        if (size in this.#sizeLabels) return this.#sizeLabels[size];
        return sizeName(size);
    }

    // ---- Lifecycle ----

    connectedCallback(): void {
        // Pick up the initial sizes / sizeLabels from attributes if they
        // were set via HTML before the JS evaluated.
        const sizesAttr = this.getAttribute("sizes");
        if (sizesAttr !== null && this.#sizes.length === 0) {
            this.#sizes = parseCsv(sizesAttr);
        }
        const labelsAttr = this.getAttribute("size-labels");
        if (labelsAttr !== null && Object.keys(this.#sizeLabels).length === 0) {
            this.#sizeLabels = parseJsonObject(labelsAttr);
        }

        if (!this.#initialised) {
            this.#initialised = true;
            this.#resolveInitialValue();
        }
        this.#render();
        document.addEventListener("click", this.#onDocumentClick);
        if (this.value) this.#applySize(this.value);
    }

    attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
        switch (name) {
            case "sizes":
                this.#sizes = value === null ? [] : parseCsv(value);
                this.#render();
                break;
            case "size-labels":
                this.#sizeLabels = value === null ? {} : parseJsonObject(value);
                this.#render();
                break;
            case "value":
                // A value change never rebuilds the DOM: rebuilding while
                // the listbox is open would destroy focus and the active
                // descendant. Only the state-carrying attributes change.
                this.#syncState();
                if (this.isConnected && value) this.#applySize(value);
                break;
            case "label":
            case "name":
            case "class":
                this.#render();
                break;
            // default-value / storage-key don't need a re-render; they
            // affect the next apply.
            default:
                break;
        }
    }

    disconnectedCallback(): void {
        document.removeEventListener("click", this.#onDocumentClick);
        clearTimeout(this.#typeaheadTimer);
    }

    // ---- Behaviour ----

    #resolveInitialValue(): void {
        let initial = this.value;

        if (!initial && this.storageKey) {
            try {
                initial = localStorage.getItem(this.storageKey) ?? "";
            } catch {
                /* ignore */
            }
        }

        if (!initial) {
            initial =
                this.defaultValue ||
                (this.#sizes.includes("medium") ? "medium" : this.#sizes[0]) ||
                "";
        }

        if (initial && initial !== this.value) {
            // Set without triggering re-entry through the change callback.
            this.setAttribute("value", initial);
        }
    }

    #applySize(slug: string): void {
        if (typeof document === "undefined" || !slug) return;
        (this.#target ?? document.documentElement).setAttribute("data-text-size", slug);
        if (this.storageKey) {
            try {
                localStorage.setItem(this.storageKey, slug);
            } catch {
                /* ignore */
            }
        }
        this.dispatchEvent(
            new CustomEvent<TextSizeSelectChangeDetail>("textsizechange", {
                detail: { size: slug },
                bubbles: true,
                composed: true,
            }),
        );
    }

    // ---- Open / close ----

    /** Open the listbox. `startIndex` overrides the active option. */
    openList(startIndex?: number): void {
        if (this.#sizes.length === 0) return;
        const selected = this.#sizes.indexOf(this.value);
        this.#activeIndex = startIndex ?? (selected >= 0 ? selected : 0);
        this.#open = true;
        this.#syncState();
        // Focus moves to the listbox; the active option is conveyed via
        // aria-activedescendant, per the APG listbox pattern.
        this.#listEl?.focus();
        this.#scrollActiveIntoView();
    }

    /** Close the listbox. Returns focus to the button unless `refocus` is false. */
    closeList(refocus = true): void {
        if (!this.#open) return;
        this.#open = false;
        this.#activeIndex = -1;
        this.#syncState();
        if (refocus) this.#buttonEl?.focus();
    }

    #choose(index: number): void {
        const slug = this.#sizes[index];
        if (slug) this.value = slug;
        this.closeList();
    }

    #scrollActiveIntoView(): void {
        if (this.#activeIndex < 0) return;
        // jsdom has no scrollIntoView; call it only where it exists.
        this.#optionEls[this.#activeIndex]?.scrollIntoView?.({ block: "nearest" });
    }

    #moveActive(delta: number): void {
        if (this.#sizes.length === 0) return;
        this.#activeIndex = Math.min(
            Math.max(this.#activeIndex + delta, 0),
            this.#sizes.length - 1,
        );
        this.#syncState();
        this.#scrollActiveIntoView();
    }

    #setActive(index: number): void {
        this.#activeIndex = index;
        this.#syncState();
        this.#scrollActiveIntoView();
    }

    #runTypeahead(char: string): void {
        this.#typeahead += char.toLowerCase();
        clearTimeout(this.#typeaheadTimer);
        this.#typeaheadTimer = setTimeout(() => {
            this.#typeahead = "";
        }, 500);
        const from = this.#activeIndex < 0 ? 0 : this.#activeIndex;
        // Search forward from the active option, wrapping once.
        for (let n = 0; n < this.#sizes.length; n++) {
            const i = (from + n) % this.#sizes.length;
            if (this.labelFor(this.#sizes[i]).toLowerCase().startsWith(this.#typeahead)) {
                this.#setActive(i);
                return;
            }
        }
    }

    #onButtonKeydown = (event: KeyboardEvent): void => {
        switch (event.key) {
            case "ArrowDown":
            case "Enter":
            case " ":
                event.preventDefault();
                this.openList();
                break;
            case "ArrowUp":
                event.preventDefault();
                this.openList(this.#sizes.length - 1);
                break;
        }
    };

    #onListKeydown = (event: KeyboardEvent): void => {
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                this.#moveActive(1);
                break;
            case "ArrowUp":
                event.preventDefault();
                this.#moveActive(-1);
                break;
            case "Home":
                event.preventDefault();
                this.#setActive(0);
                break;
            case "End":
                event.preventDefault();
                this.#setActive(this.#sizes.length - 1);
                break;
            case "Enter":
            case " ":
                event.preventDefault();
                if (this.#activeIndex >= 0) this.#choose(this.#activeIndex);
                break;
            case "Escape":
                event.preventDefault();
                this.closeList();
                break;
            case "Tab":
                // Tab moves on: close without stealing focus back.
                this.closeList(false);
                break;
            default:
                if (
                    event.key.length === 1 &&
                    !event.ctrlKey &&
                    !event.metaKey &&
                    !event.altKey
                ) {
                    this.#runTypeahead(event.key);
                }
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

    // ---- Rendering ----

    /**
     * Update every state-carrying attribute without rebuilding the DOM:
     * `aria-expanded`, `hidden`, `aria-activedescendant`, per-option
     * `aria-selected` / `data-active`, and the hidden input's value.
     */
    #syncState(): void {
        if (!this.#rootEl) return;
        const value = this.value;

        if (this.#inputEl) this.#inputEl.value = value;

        if (this.#buttonEl) {
            this.#buttonEl.setAttribute("aria-expanded", String(this.#open));
            // Rebuild the button content so an overridden
            // renderButtonContent() that reads `value` or `open` stays
            // current. This is what makes the hook behave like the
            // reactive `children` snippet in the other frameworks.
            this.#buttonEl.replaceChildren(this.renderButtonContent());
        }

        if (this.#listEl) {
            if (this.#open) this.#listEl.removeAttribute("hidden");
            else this.#listEl.setAttribute("hidden", "");

            if (this.#open && this.#activeIndex >= 0) {
                this.#listEl.setAttribute(
                    "aria-activedescendant",
                    this.optionId(this.#activeIndex),
                );
            } else {
                this.#listEl.removeAttribute("aria-activedescendant");
            }
        }

        this.#optionEls.forEach((option, i) => {
            option.setAttribute("aria-selected", String(this.#sizes[i] === value));
            if (i === this.#activeIndex) option.setAttribute("data-active", "");
            else option.removeAttribute("data-active");
        });
    }

    #render(): void {
        if (!this.isConnected) return;

        // A structural rebuild cannot preserve focus inside the listbox,
        // so it closes first.
        this.#open = false;
        this.#activeIndex = -1;

        const extraClass = this.getAttribute("class") ?? "";
        const root = document.createElement("div");
        root.className = `text-size-select ${extraClass}`.trim();
        root.addEventListener("focusout", this.#onRootFocusOut);

        // The hidden input preserves form participation and the `name`.
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = this.name;
        input.value = this.value;
        root.appendChild(input);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "text-size-select-button";
        button.setAttribute("aria-label", this.label);
        button.setAttribute("aria-haspopup", "listbox");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", this.listId);
        button.appendChild(this.renderButtonContent());
        button.addEventListener("click", () => {
            if (this.#open) this.closeList();
            else this.openList();
        });
        button.addEventListener("keydown", this.#onButtonKeydown);
        root.appendChild(button);

        const list = document.createElement("ul");
        list.className = "text-size-select-list";
        list.id = this.listId;
        list.setAttribute("role", "listbox");
        list.setAttribute("aria-label", this.label);
        list.setAttribute("tabindex", "-1");
        list.setAttribute("hidden", "");
        list.addEventListener("keydown", this.#onListKeydown);

        const optionEls: HTMLLIElement[] = [];
        this.#sizes.forEach((size, i) => {
            const option = document.createElement("li");
            option.className = "text-size-select-option";
            option.id = this.optionId(i);
            option.setAttribute("role", "option");
            option.setAttribute("aria-selected", String(size === this.value));
            option.textContent = this.labelFor(size);
            option.addEventListener("click", () => this.#choose(i));
            list.appendChild(option);
            optionEls.push(option);
        });
        root.appendChild(list);

        this.#rootEl = root;
        this.#inputEl = input;
        this.#buttonEl = button;
        this.#listEl = list;
        this.#optionEls = optionEls;

        this.replaceChildren(root);
    }
}

// ---- Pure helpers (module-local) ----

function parseCsv(s: string): string[] {
    return s
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
}

function parseJsonObject(s: string): Record<string, string> {
    try {
        const v = JSON.parse(s);
        if (v && typeof v === "object" && !Array.isArray(v)) {
            return v as Record<string, string>;
        }
    } catch {
        /* ignore */
    }
    return {};
}
