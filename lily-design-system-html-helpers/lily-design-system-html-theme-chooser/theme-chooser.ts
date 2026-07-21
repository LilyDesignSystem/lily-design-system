/**
 * `<theme-chooser>` — Lily Design System HTML helper.
 *
 * See `./spec/index.md` for the canonical contract. This file implements
 * the custom-element class but does NOT register it. The `index.ts`
 * barrel registers it on import.
 *
 * The control is an icon button that opens a dropdown listbox
 * (WAI-ARIA APG listbox pattern). It is not a native `<select>`.
 */

/** Default button glyph: U+25D1 CIRCLE WITH RIGHT HALF BLACK. */
export const CIRCLE_WITH_RIGHT_HALF_BLACK = "◑";

/** Change-event detail dispatched on every applied theme. */
export type ThemeChooserChangeDetail = {
    theme: string;
};

/** Mirrors the observed attributes / properties for typing convenience. */
export type ThemeChooserProps = {
    label: string;
    themesUrl: string;
    themes: string[];
    value?: string;
    defaultValue?: string;
    storageKey?: string;
    detectFromSystem?: boolean;
    name?: string;
    extension?: string;
    themeLabels?: Record<string, string>;
    target?: HTMLElement | null;
    class?: string;
};

/**
 * Resolve a theme slug to its display label: each hyphen-separated
 * word title-cased, so a slug like
 * "united-kingdom-national-health-service-england-for-patients"
 * renders as "United Kingdom National Health Service England For
 * Patients" rather than a half-capitalised hyphenated string.
 *
 * Mirrors `localeName` in locale-chooser. The element's `labelFor`
 * delegates here after consulting `theme-labels`, so there is exactly
 * one implementation of the title-casing rule.
 */
export function themeName(theme: string): string {
    return theme
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * Resolve the OS colour-scheme preference to a supported theme slug.
 * Mirrors `matchNavigatorLanguage` in locale-chooser.
 *
 * Returns `""` when the preferred scheme is not present in `themes`,
 * or when `matchMedia` is unavailable — the SSR case, and also jsdom,
 * which does not implement `matchMedia` either. The guard is required,
 * not optional.
 */
export function matchSystemTheme(themes: readonly string[]): string {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return "";
    }
    const wanted = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    return themes.includes(wanted) ? wanted : "";
}

/** Normalise the themes directory URL to end with exactly one `/`. */
export function normalizeThemesUrl(themesUrl: string): string {
    return themesUrl.endsWith("/") ? themesUrl : themesUrl + "/";
}

/** Construct the href for a given theme slug. */
export function themeHref(themesUrl: string, slug: string, extension: string): string {
    return normalizeThemesUrl(themesUrl) + slug + extension;
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextThemeChooserId(): string {
    uid += 1;
    return `theme-chooser-${uid}`;
}

/** Custom-element class implementing `<theme-chooser>`. */
export class ThemeChooser extends HTMLElement {
    static get observedAttributes(): string[] {
        return [
            "label",
            "themes-url",
            "themes",
            "value",
            "default-value",
            "storage-key",
            "detect-from-system",
            "name",
            "extension",
            "theme-labels",
            "class",
        ];
    }

    // Backing storage for properties.
    #themes: string[] = [];
    #themeLabels: Record<string, string> = {};
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
    readonly #baseId = nextThemeChooserId();

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

    get themesUrl(): string {
        return this.getAttribute("themes-url") ?? "";
    }
    set themesUrl(v: string) {
        this.setAttribute("themes-url", v);
    }

    get themes(): string[] {
        return [...this.#themes];
    }
    set themes(v: string[]) {
        this.#themes = Array.isArray(v) ? v.slice() : [];
        // Keep the attribute in sync (CSV form) without re-entering the
        // attribute change callback to re-parse.
        const csv = this.#themes.join(",");
        if (this.getAttribute("themes") !== csv) {
            this.setAttribute("themes", csv);
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

    /**
     * Resolve `prefers-color-scheme` to a supported theme on first
     * visit. Mirrors `detectFromNavigator` in locale-chooser, including
     * the boolean-attribute convention: absent → false, present →
     * true, present and equal to "false" → false.
     */
    get detectFromSystem(): boolean {
        const v = this.getAttribute("detect-from-system");
        return v !== null && v !== "false";
    }
    set detectFromSystem(v: boolean) {
        if (v) this.setAttribute("detect-from-system", "");
        else this.removeAttribute("detect-from-system");
    }

    get name(): string {
        return this.getAttribute("name") ?? "theme";
    }
    set name(v: string) {
        if (v) this.setAttribute("name", v);
        else this.removeAttribute("name");
    }

    get extension(): string {
        return this.getAttribute("extension") ?? ".css";
    }
    set extension(v: string) {
        if (v) this.setAttribute("extension", v);
        else this.removeAttribute("extension");
    }

    get themeLabels(): Record<string, string> {
        return { ...this.#themeLabels };
    }
    set themeLabels(v: Record<string, string>) {
        this.#themeLabels = v && typeof v === "object" ? { ...v } : {};
        const json = JSON.stringify(this.#themeLabels);
        if (this.getAttribute("theme-labels") !== json) {
            this.setAttribute("theme-labels", json);
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
     * Build the content of the button. The default is the half-circle
     * glyph wrapped in `aria-hidden="true"` so the accessible name comes
     * from the button's `aria-label` alone.
     *
     * This is the HTML-helper equivalent of the Svelte/React/Vue
     * `children` snippet: it replaces the glyph inside the button, and
     * has `this.value`, `this.open`, and `this.labelFor(...)` available.
     * Subclasses may override it. Whatever it returns is placed inside
     * the button; the button's own aria wiring is not the subclass's to
     * change. See `docs/custom-rendering.md`.
     */
    renderButtonContent(): Node {
        const icon = document.createElement("span");
        icon.className = "theme-chooser-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = CIRCLE_WITH_RIGHT_HALF_BLACK;
        return icon;
    }

    /** Resolve a slug to its display label. Public for subclasses. */
    labelFor(theme: string): string {
        if (theme in this.#themeLabels) return this.#themeLabels[theme];
        return themeName(theme);
    }

    // ---- Lifecycle ----

    connectedCallback(): void {
        // Pick up the initial themes / themeLabels from attributes if
        // they were set via HTML before the JS evaluated.
        const themesAttr = this.getAttribute("themes");
        if (themesAttr !== null && this.#themes.length === 0) {
            this.#themes = parseCsv(themesAttr);
        }
        const labelsAttr = this.getAttribute("theme-labels");
        if (labelsAttr !== null && Object.keys(this.#themeLabels).length === 0) {
            this.#themeLabels = parseJsonObject(labelsAttr);
        }

        if (!this.#initialised) {
            this.#initialised = true;
            this.#resolveInitialValue();
        }
        this.#render();
        document.addEventListener("click", this.#onDocumentClick);
        if (this.value) this.#applyTheme(this.value);
    }

    attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
        switch (name) {
            case "themes":
                this.#themes = value === null ? [] : parseCsv(value);
                this.#render();
                break;
            case "theme-labels":
                this.#themeLabels = value === null ? {} : parseJsonObject(value);
                this.#render();
                break;
            case "value":
                // A value change never rebuilds the DOM: rebuilding while
                // the listbox is open would destroy focus and the active
                // descendant. Only the state-carrying attributes change.
                this.#syncState();
                if (this.isConnected && value) this.#applyTheme(value);
                break;
            case "label":
            case "name":
            case "class":
                this.#render();
                break;
            // themes-url / default-value / storage-key / extension don't
            // need a re-render; they affect the next apply.
            default:
                break;
        }
    }

    disconnectedCallback(): void {
        document.removeEventListener("click", this.#onDocumentClick);
        clearTimeout(this.#typeaheadTimer);
        // If no other <theme-chooser> with the same name remains in the
        // document, garbage-collect the managed <link>.
        const sameName = document.querySelectorAll(
            `theme-chooser[name="${this.name}"]`,
        );
        if (sameName.length === 0) {
            const link = document.head.querySelector(
                `link[data-lily-theme-chooser="${this.name}"]`,
            );
            link?.remove();
        }
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

        if (!initial && this.detectFromSystem) {
            initial = matchSystemTheme(this.#themes);
        }

        if (!initial) {
            initial =
                this.defaultValue ||
                (this.#themes.includes("light") ? "light" : this.#themes[0]) ||
                "";
        }

        if (initial && initial !== this.value) {
            // Set without triggering re-entry through the change callback.
            this.setAttribute("value", initial);
        }
    }

    #getManagedLink(): HTMLLinkElement {
        const selector = `link[data-lily-theme-chooser="${this.name}"]`;
        let link = document.head.querySelector<HTMLLinkElement>(selector);
        if (!link) {
            link = document.createElement("link");
            link.rel = "stylesheet";
            link.setAttribute("data-lily-theme-chooser", this.name);
            document.head.appendChild(link);
        }
        return link;
    }

    #applyTheme(slug: string): void {
        if (typeof document === "undefined" || !slug) return;
        this.#getManagedLink().href = themeHref(this.themesUrl, slug, this.extension);
        (this.#target ?? document.documentElement).setAttribute("data-theme", slug);
        if (this.storageKey) {
            try {
                localStorage.setItem(this.storageKey, slug);
            } catch {
                /* ignore */
            }
        }
        this.dispatchEvent(
            new CustomEvent<ThemeChooserChangeDetail>("themechange", {
                detail: { theme: slug },
                bubbles: true,
                composed: true,
            }),
        );
    }

    // ---- Open / close ----

    /** Open the listbox. `startIndex` overrides the active option. */
    openList(startIndex?: number): void {
        if (this.#themes.length === 0) return;
        const selected = this.#themes.indexOf(this.value);
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
        const slug = this.#themes[index];
        if (slug) this.value = slug;
        this.closeList();
    }

    #scrollActiveIntoView(): void {
        if (this.#activeIndex < 0) return;
        // jsdom has no scrollIntoView; call it only where it exists.
        this.#optionEls[this.#activeIndex]?.scrollIntoView?.({ block: "nearest" });
    }

    #moveActive(delta: number): void {
        if (this.#themes.length === 0) return;
        this.#activeIndex = Math.min(
            Math.max(this.#activeIndex + delta, 0),
            this.#themes.length - 1,
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
        for (let n = 0; n < this.#themes.length; n++) {
            const i = (from + n) % this.#themes.length;
            if (this.labelFor(this.#themes[i]).toLowerCase().startsWith(this.#typeahead)) {
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
                this.openList(this.#themes.length - 1);
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
                this.#setActive(this.#themes.length - 1);
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
            option.setAttribute("aria-selected", String(this.#themes[i] === value));
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
        root.className = `theme-chooser ${extraClass}`.trim();
        root.addEventListener("focusout", this.#onRootFocusOut);

        // The hidden input preserves form participation and the `name`.
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = this.name;
        input.value = this.value;
        root.appendChild(input);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "theme-chooser-button";
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
        list.className = "theme-chooser-list";
        list.id = this.listId;
        list.setAttribute("role", "listbox");
        list.setAttribute("aria-label", this.label);
        list.setAttribute("tabindex", "-1");
        list.setAttribute("hidden", "");
        list.addEventListener("keydown", this.#onListKeydown);

        const optionEls: HTMLLIElement[] = [];
        this.#themes.forEach((theme, i) => {
            const option = document.createElement("li");
            option.className = "theme-chooser-option";
            option.id = this.optionId(i);
            option.setAttribute("role", "option");
            option.setAttribute("aria-selected", String(theme === this.value));
            option.textContent = this.labelFor(theme);
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
