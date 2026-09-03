/**
 * `<motion-picker>` — Lily Design System HTML helper.
 *
 * See `./spec/index.md` for the canonical contract. This file implements
 * the custom-element class but does NOT register it. The `index.ts`
 * barrel registers it on import.
 *
 * The control is an icon button that opens a dropdown listbox
 * (WAI-ARIA APG listbox pattern). It is not a native `<select>`.
 */

/**
 * Default button glyph: U+23F8 PAUSE SIGN, paired with U+FE0E
 * (VARIATION SELECTOR-15) to force text presentation — the same
 * treatment locale-picker gives its globe.
 *
 * A pause glyph reads as "stop the moving parts" more directly than an
 * abstract symbol, has a real monochrome glyph in ordinary system
 * fonts (media-transport symbols default to text presentation, unlike
 * most pictographs), and doesn't collide with any sibling picker's
 * glyph (theme's CIRCLE WITH RIGHT HALF BLACK, locale's GLOBE WITH
 * MERIDIANS, text-size's plain "A", share's BLACK RIGHTWARDS
 * ARROWHEAD, date-time's CALENDAR).
 */
export const PAUSE_SIGN = "⏸︎";

/** Change-event detail dispatched on every applied motion preference. */
export type MotionPickerChangeDetail = {
    motion: string;
};

/** Mirrors the observed attributes / properties for typing convenience. */
export type MotionPickerProps = {
    label: string;
    motions: string[];
    value?: string;
    defaultValue?: string;
    storageKey?: string;
    name?: string;
    target?: HTMLElement | null;
    motionLabels?: Record<string, string>;
    class?: string;
};

/**
 * Resolve a motion slug to its display label: each hyphen-separated
 * word title-cased, so "no-preference" renders as "No Preference".
 *
 * Mirrors `sizeName` in text-size-picker and `themeName` in
 * theme-picker. The element's `labelFor` delegates here after
 * consulting `motion-labels`, so there is exactly one implementation
 * of the title-casing rule.
 */
export function motionName(motion: string): string {
    return motion
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * True when the platform reports a preference for reduced motion.
 * SSR-safe: `window`/`matchMedia` are absent on the server, so this
 * resolves to `false` there and the client re-derives it on connect.
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return false;
    }
    try {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
        return false;
    }
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextMotionPickerId(): string {
    uid += 1;
    return `motion-picker-${uid}`;
}

/** Custom-element class implementing `<motion-picker>`. */
export class MotionPicker extends HTMLElement {
    static get observedAttributes(): string[] {
        return [
            "label",
            "motions",
            "value",
            "default-value",
            "storage-key",
            "name",
            "motion-labels",
            "class",
        ];
    }

    // Backing storage for properties.
    #motions: string[] = [];
    #motionLabels: Record<string, string> = {};
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
    readonly #baseId = nextMotionPickerId();

    // Typeahead buffer: APG listbox behaviour. Reset after a pause.
    #typeahead = "";
    #typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

    #onDocumentClick = (event: MouseEvent): void => {
        if (!this.#open) return;
        // Judge the click by its composedPath() snapshot, not by containment
        // of event.target: opening replaceChildren()s the button content, so
        // the clicked icon span is already DETACHED when this bubbles back to
        // the document — a containment check then closed the picker on the
        // very pointer click that opened it (trusted clicks target the span;
        // synthetic button.click() targets the button, which is why no test
        // saw it).
        if (!event.composedPath().includes(this)) this.closeList(false);
    };

    // ---- Property accessors ----

    get label(): string {
        return this.getAttribute("label") ?? "";
    }
    set label(v: string) {
        this.setAttribute("label", v);
    }

    get motions(): string[] {
        return [...this.#motions];
    }
    set motions(v: string[]) {
        this.#motions = Array.isArray(v) ? v.slice() : [];
        // Keep the attribute in sync (CSV form) without re-entering the
        // attribute change callback to re-parse.
        const csv = this.#motions.join(",");
        if (this.getAttribute("motions") !== csv) {
            this.setAttribute("motions", csv);
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
        return this.getAttribute("name") ?? "motion";
    }
    set name(v: string) {
        if (v) this.setAttribute("name", v);
        else this.removeAttribute("name");
    }

    get motionLabels(): Record<string, string> {
        return { ...this.#motionLabels };
    }
    set motionLabels(v: Record<string, string>) {
        this.#motionLabels = v && typeof v === "object" ? { ...v } : {};
        const json = JSON.stringify(this.#motionLabels);
        if (this.getAttribute("motion-labels") !== json) {
            this.setAttribute("motion-labels", json);
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
     * Build the content of the button. The default is the pause-sign
     * glyph wrapped in `aria-hidden="true"` so the accessible name
     * comes from the button's `aria-label` alone.
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
        icon.className = "motion-picker-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = PAUSE_SIGN;
        return icon;
    }

    /** Resolve a slug to its display label. Public for subclasses. */
    labelFor(motion: string): string {
        if (motion in this.#motionLabels) return this.#motionLabels[motion];
        return motionName(motion);
    }

    // ---- Lifecycle ----

    connectedCallback(): void {
        // Pick up the initial motions / motionLabels from attributes if
        // they were set via HTML before the JS evaluated.
        const motionsAttr = this.getAttribute("motions");
        if (motionsAttr !== null && this.#motions.length === 0) {
            this.#motions = parseCsv(motionsAttr);
        }
        const labelsAttr = this.getAttribute("motion-labels");
        if (labelsAttr !== null && Object.keys(this.#motionLabels).length === 0) {
            this.#motionLabels = parseJsonObject(labelsAttr);
        }

        if (!this.#initialised) {
            this.#initialised = true;
            this.#resolveInitialValue();
        }
        this.#render();
        document.addEventListener("click", this.#onDocumentClick);
        if (this.value) this.#applyMotion(this.value);
    }

    attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
        switch (name) {
            case "motions":
                this.#motions = value === null ? [] : parseCsv(value);
                this.#render();
                break;
            case "motion-labels":
                this.#motionLabels = value === null ? {} : parseJsonObject(value);
                this.#render();
                break;
            case "value":
                // A value change never rebuilds the DOM: rebuilding while
                // the listbox is open would destroy focus and the active
                // descendant. Only the state-carrying attributes change.
                this.#syncState();
                if (this.isConnected && value) this.#applyMotion(value);
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
        // A re-connected element must apply again: the document root it
        // returns to need not be the one it left.
        this.#appliedValue = "";
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
            // Unlike text-size-picker's "medium" default, motion has a
            // real external signal to defer to: the platform's own
            // (prefers-reduced-motion: reduce) media query.
            const osPreferred = prefersReducedMotion() ? "reduce" : "no-preference";
            initial =
                this.defaultValue ||
                (this.#motions.includes(osPreferred) ? osPreferred : "") ||
                this.#motions[0] ||
                "";
        }

        if (initial && initial !== this.value) {
            // Set without triggering re-entry through the change callback.
            this.setAttribute("value", initial);
        }
    }

    // The motion the DOM currently carries. Applying is idempotent: a
    // motion already applied is a no-op. `attributeChangedCallback` fires
    // on every `setAttribute("value", …)`, unchanged value included, so
    // without this a consumer whose `motionchange` listener mirrors the
    // value back onto the element re-enters apply forever.
    #appliedValue = "";

    #applyMotion(slug: string): void {
        if (typeof document === "undefined" || !slug) return;
        if (slug === this.#appliedValue) return;
        this.#appliedValue = slug;
        (this.#target ?? document.documentElement).setAttribute("data-motion", slug);
        if (this.storageKey) {
            try {
                localStorage.setItem(this.storageKey, slug);
            } catch {
                /* ignore */
            }
        }
        this.dispatchEvent(
            new CustomEvent<MotionPickerChangeDetail>("motionchange", {
                detail: { motion: slug },
                bubbles: true,
                composed: true,
            }),
        );
    }

    // ---- Open / close ----

    /** Open the listbox. `startIndex` overrides the active option. */
    openList(startIndex?: number): void {
        const selected = this.#motions.indexOf(this.value);
        // An empty list has no option to activate; -1 keeps
        // aria-activedescendant off rather than pointing at an id that
        // does not exist.
        this.#activeIndex =
            this.#motions.length === 0
                ? -1
                : (startIndex ?? (selected >= 0 ? selected : 0));
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
        const slug = this.#motions[index];
        if (slug) this.value = slug;
        this.closeList();
    }

    #scrollActiveIntoView(): void {
        if (this.#activeIndex < 0) return;
        // jsdom has no scrollIntoView; call it only where it exists.
        this.#optionEls[this.#activeIndex]?.scrollIntoView?.({ block: "nearest" });
    }

    #moveActive(delta: number): void {
        if (this.#motions.length === 0) return;
        this.#activeIndex = Math.min(
            Math.max(this.#activeIndex + delta, 0),
            this.#motions.length - 1,
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
        const lower = char.toLowerCase();
        // APG listbox typeahead: a single character moves to the NEXT
        // option starting with it, and repeating that character keeps
        // cycling. Only a buffer of differing characters refines the
        // match, and that buffer stays anchored on the active option.
        const sameCharRun =
            this.#typeahead === "" ||
            [...this.#typeahead].every((c) => c === lower);
        this.#typeahead += lower;
        clearTimeout(this.#typeaheadTimer);
        this.#typeaheadTimer = setTimeout(() => {
            this.#typeahead = "";
        }, 500);
        const query = sameCharRun ? lower : this.#typeahead;
        const anchor = this.#activeIndex < 0 ? 0 : this.#activeIndex;
        const start = sameCharRun ? anchor + 1 : anchor;
        // Search forward, wrapping once — typeahead wraps even though the
        // arrows clamp, or options above the cursor would be untypable.
        for (let n = 0; n < this.#motions.length; n++) {
            const i = (start + n) % this.#motions.length;
            if (this.labelFor(this.#motions[i]).toLowerCase().startsWith(query)) {
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
                this.openList(this.#motions.length - 1);
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
                this.#setActive(this.#motions.length - 1);
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
            case "PageUp":
                event.preventDefault();
                this.#moveActive(-10);
                break;
            case "PageDown":
                // ±10, clamped: an APG-optional key for long lists.
                event.preventDefault();
                this.#moveActive(10);
                break;
            case "Tab":
                // Tab moves on — but focus goes to the button FIRST,
                // without cancelling the key. Hiding the focused list
                // drops focus to <body>, and the browser then computes
                // the default Tab move from the top of the document, so
                // tabbing out of an open picker teleported the user to
                // the page's first tab stop. From the button, the
                // default Tab lands exactly where leaving the picker
                // should. Guard the METHOD: jsdom-shaped environments
                // may lack it.
                this.#buttonEl?.focus?.();
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
            option.setAttribute("aria-selected", String(this.#motions[i] === value));
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
        root.className = `motion-picker ${extraClass}`.trim();
        root.addEventListener("focusout", this.#onRootFocusOut);

        // The hidden input preserves form participation and the `name`.
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = this.name;
        input.value = this.value;
        root.appendChild(input);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "motion-picker-button";
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
        list.className = "motion-picker-list";
        list.id = this.listId;
        list.setAttribute("role", "listbox");
        list.setAttribute("aria-label", this.label);
        list.setAttribute("tabindex", "-1");
        list.setAttribute("hidden", "");
        list.addEventListener("keydown", this.#onListKeydown);

        const optionEls: HTMLLIElement[] = [];
        this.#motions.forEach((motion, i) => {
            const option = document.createElement("li");
            option.className = "motion-picker-option";
            option.id = this.optionId(i);
            option.setAttribute("role", "option");
            option.setAttribute("aria-selected", String(motion === this.value));
            option.textContent = this.labelFor(motion);
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
