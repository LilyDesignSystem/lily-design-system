/**
 * `<locale-picker>` — Lily Design System HTML helper.
 *
 * See `./spec/index.md` for the canonical contract. This file implements
 * the custom-element class but does NOT register it. The `index.ts`
 * barrel registers it on import.
 *
 * The control is an icon button that opens a dropdown listbox
 * (WAI-ARIA APG listbox pattern). It is not a native `<select>`.
 */

import {
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
} from "./locales.js";

export { defaultLocaleLabels, RTL_LANGUAGE_TAGS, RTL_SCRIPT_SUBTAGS };

/**
 * Default button glyph: U+1F310 GLOBE WITH MERIDIANS followed by
 * U+FE0E VARIATION SELECTOR-15.
 *
 * VS15 requests the *text* presentation. Without it browsers pick the
 * colour-emoji font and the globe renders blue, which does not match
 * theme-picker's monochrome ◑. (U+25D1 needs no selector — it is not
 * an emoji codepoint and already defaults to text presentation.)
 */
export const GLOBE_WITH_MERIDIANS = "\u{1F310}\uFE0E";

/** Change-event detail dispatched on every applied locale. */
export type LocalePickerChangeDetail = {
    locale: string;
};

/** Mirrors the observed attributes / properties for typing convenience. */
export type LocalePickerProps = {
    label: string;
    locales: string[];
    value?: string;
    defaultValue?: string;
    storageKey?: string;
    detectFromNavigator?: boolean;
    name?: string;
    target?: HTMLElement | null;
    applyDir?: boolean;
    localeLabels?: Record<string, string>;
    class?: string;
};

// ----------------------------------------------------------------
// Pure helpers (exported so consumers can reuse them)
// ----------------------------------------------------------------

/** Convert a locale code to its BCP 47 hyphen form. */
export function bcp47LocaleTag(locale: string): string {
    return locale.replace(/_/g, "-");
}

/** Detect whether a locale is right-to-left. See spec/index.md §5.6. */
export function isRtlLocale(locale: string): boolean {
    if (!locale) return false;
    const parts = locale.split(/[-_]/);
    for (const part of parts) {
        if (RTL_SCRIPT_SUBTAGS.has(part.toLowerCase())) return true;
    }
    const base = parts[0]?.toLowerCase() ?? "";
    return RTL_LANGUAGE_TAGS.has(base);
}

/** Resolve a locale code to its English name via the built-in table. */
export function localeName(locale: string): string {
    return defaultLocaleLabels[locale] ?? locale;
}

/**
 * The language's own name for itself — "de" → "Deutsch", "cy" →
 * "Cymraeg" — from `Intl.DisplayNames` asked *in that language*.
 *
 * Endonyms are the right default for a language menu: the user who
 * needs it most is the one lost in a UI that is not in their
 * language, and they recognise "Cymraeg" where "Welsh" means
 * nothing to them. Deterministic (no `navigator` dependency), so
 * the server and the client render the same label. Returns "" when
 * the runtime has no data — some runtimes echo the tag back instead
 * of failing, and an echo is not a name.
 */
export function localeEndonym(locale: string): string {
    try {
        const tag = bcp47LocaleTag(locale);
        const dn = new Intl.DisplayNames([tag], { type: "language" });
        const found = dn.of(tag) ?? "";
        return found && found.toLowerCase() !== tag.toLowerCase() ? found : "";
    } catch {
        return "";
    }
}

/** Opportunistic Intl.DisplayNames lookup; never throws. */
function intlDisplayName(locale: string): string {
    try {
        const env =
            typeof navigator !== "undefined" && navigator.language
                ? navigator.language
                : "en";
        const dn = new Intl.DisplayNames([env], { type: "language" });
        return dn.of(bcp47LocaleTag(locale)) ?? "";
    } catch {
        return "";
    }
}

/** Match a navigator preference against a supported-locales list. */
export function matchNavigatorLanguage(
    navLangs: readonly string[],
    locales: readonly string[],
): string | "" {
    const lc = (s: string) => s.toLowerCase().replace(/_/g, "-");
    const localesLc = locales.map(lc);
    for (const raw of navLangs) {
        const nav = lc(raw);

        // 1. Exact match (treating - and _ as equivalent).
        const exactIndex = localesLc.indexOf(nav);
        if (exactIndex !== -1) return locales[exactIndex];

        // 2. Language-only match.
        const navBase = nav.split("-")[0];
        for (let i = 0; i < locales.length; i++) {
            const base = localesLc[i].split("-")[0];
            if (base === navBase) return locales[i];
        }
    }
    return "";
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextLocalePickerId(): string {
    uid += 1;
    return `locale-picker-${uid}`;
}

// ----------------------------------------------------------------
// Custom-element class
// ----------------------------------------------------------------

export class LocalePicker extends HTMLElement {
    static get observedAttributes(): string[] {
        return [
            "label",
            "locales",
            "value",
            "default-value",
            "storage-key",
            "detect-from-navigator",
            "name",
            "apply-dir",
            "locale-labels",
            "class",
        ];
    }

    #locales: string[] = [];
    #localeLabels: Record<string, string> = {};
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
    readonly #baseId = nextLocalePickerId();

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

    get locales(): string[] {
        return [...this.#locales];
    }
    set locales(v: string[]) {
        this.#locales = Array.isArray(v) ? v.slice() : [];
        const csv = this.#locales.join(",");
        if (this.getAttribute("locales") !== csv) {
            this.setAttribute("locales", csv);
            return;
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

    get detectFromNavigator(): boolean {
        const v = this.getAttribute("detect-from-navigator");
        return v !== null && v !== "false";
    }
    set detectFromNavigator(v: boolean) {
        if (v) this.setAttribute("detect-from-navigator", "");
        else this.removeAttribute("detect-from-navigator");
    }

    get name(): string {
        return this.getAttribute("name") ?? "locale";
    }
    set name(v: string) {
        if (v) this.setAttribute("name", v);
        else this.removeAttribute("name");
    }

    get applyDir(): boolean {
        // Absent attribute → true. Present and equal to "false" → false.
        // Any other value (including "") → true.
        const v = this.getAttribute("apply-dir");
        return v !== "false";
    }
    set applyDir(v: boolean) {
        if (v) this.removeAttribute("apply-dir");
        else this.setAttribute("apply-dir", "false");
    }

    get localeLabels(): Record<string, string> {
        return { ...this.#localeLabels };
    }
    set localeLabels(v: Record<string, string>) {
        this.#localeLabels = v && typeof v === "object" ? { ...v } : {};
        const json = JSON.stringify(this.#localeLabels);
        if (this.getAttribute("locale-labels") !== json) {
            this.setAttribute("locale-labels", json);
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
     * Build the content of the button. The default is the globe glyph
     * wrapped in `aria-hidden="true"` so the accessible name comes from
     * the button's `aria-label` alone.
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
        icon.className = "locale-picker-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = GLOBE_WITH_MERIDIANS;
        return icon;
    }

    /** Resolve a locale code to its display label. Public for subclasses. */
    labelFor(locale: string): string {
        if (locale in this.#localeLabels) return this.#localeLabels[locale];
        // Endonym first: a language menu names each language in itself,
        // because the user who needs the menu is the one who cannot read
        // the page's language. The English table and the environment
        // lookup are fallbacks for runtimes without DisplayNames data.
        const endonym = localeEndonym(locale);
        if (endonym) return endonym;
        if (locale in defaultLocaleLabels) return defaultLocaleLabels[locale];
        const intl = intlDisplayName(locale);
        if (intl) return intl;
        return locale;
    }

    /** Resolve a locale code to its BCP 47 tag. Public for subclasses. */
    tagFor(locale: string): string {
        return bcp47LocaleTag(locale);
    }

    /**
     * The `lang` attribute for one option — a claim about the language
     * of the option's TEXT, made only when the text is the endonym we
     * derived ourselves. A consumer label or the English fallback is in
     * whatever language the consumer's UI speaks, and claiming otherwise
     * sends a screen reader's speech engine to the wrong voice: the
     * English word "Arabic" read out by an Arabic synthesizer. Returns
     * "" when no claim can be made. Public for subclasses.
     */
    optionLang(locale: string): string {
        if (locale in this.#localeLabels) return "";
        return localeEndonym(locale) ? bcp47LocaleTag(locale) : "";
    }

    // ---- Lifecycle ----

    connectedCallback(): void {
        const localesAttr = this.getAttribute("locales");
        if (localesAttr !== null && this.#locales.length === 0) {
            this.#locales = parseCsv(localesAttr);
        }
        const labelsAttr = this.getAttribute("locale-labels");
        if (labelsAttr !== null && Object.keys(this.#localeLabels).length === 0) {
            this.#localeLabels = parseJsonObject(labelsAttr);
        }

        if (!this.#initialised) {
            this.#initialised = true;
            this.#resolveInitialValue();
        }
        this.#render();
        document.addEventListener("click", this.#onDocumentClick);
        if (this.value) this.#applyLocale(this.value);
    }

    attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
        switch (name) {
            case "locales":
                this.#locales = value === null ? [] : parseCsv(value);
                this.#render();
                break;
            case "locale-labels":
                this.#localeLabels = value === null ? {} : parseJsonObject(value);
                this.#render();
                break;
            case "value":
                // A value change never rebuilds the DOM: rebuilding while
                // the listbox is open would destroy focus and the active
                // descendant. Only the state-carrying attributes change.
                this.#syncState();
                if (this.isConnected && value) this.#applyLocale(value);
                break;
            case "label":
            case "name":
            case "class":
                this.#render();
                break;
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

        if (!initial && this.detectFromNavigator && typeof navigator !== "undefined") {
            const navLangs =
                navigator.languages && navigator.languages.length > 0
                    ? Array.from(navigator.languages)
                    : navigator.language
                      ? [navigator.language]
                      : [];
            initial = matchNavigatorLanguage(navLangs, this.#locales);
        }

        if (!initial) {
            initial =
                this.defaultValue ||
                (this.#locales.includes("en") ? "en" : this.#locales[0]) ||
                "";
        }

        if (initial && initial !== this.value) {
            this.setAttribute("value", initial);
        }
    }

    // The locale the DOM currently carries. Applying is idempotent: a
    // locale already applied is a no-op. `attributeChangedCallback` fires
    // on every `setAttribute("value", …)`, unchanged value included, so
    // without this a consumer whose `localechange` listener mirrors the value
    // back onto the element re-enters apply forever.
    #appliedValue = "";

    #applyLocale(code: string): void {
        if (typeof document === "undefined" || !code) return;
        if (code === this.#appliedValue) return;
        this.#appliedValue = code;
        const root = this.#target ?? document.documentElement;
        root.setAttribute("lang", bcp47LocaleTag(code));
        if (this.applyDir) {
            root.setAttribute("dir", isRtlLocale(code) ? "rtl" : "ltr");
        }
        if (this.storageKey) {
            try {
                localStorage.setItem(this.storageKey, code);
            } catch {
                /* ignore */
            }
        }
        this.dispatchEvent(
            new CustomEvent<LocalePickerChangeDetail>("localechange", {
                detail: { locale: code },
                bubbles: true,
                composed: true,
            }),
        );
    }

    // ---- Open / close ----

    /** Open the listbox. `startIndex` overrides the active option. */
    openList(startIndex?: number): void {
        const selected = this.#locales.indexOf(this.value);
        // An empty list has no option to activate; -1 keeps
        // aria-activedescendant off rather than pointing at an id that
        // does not exist.
        this.#activeIndex =
            this.#locales.length === 0
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
        const code = this.#locales[index];
        if (code) this.value = code;
        this.closeList();
    }

    #scrollActiveIntoView(): void {
        if (this.#activeIndex < 0) return;
        // jsdom has no scrollIntoView; call it only where it exists.
        this.#optionEls[this.#activeIndex]?.scrollIntoView?.({ block: "nearest" });
    }

    #moveActive(delta: number): void {
        if (this.#locales.length === 0) return;
        this.#activeIndex = Math.min(
            Math.max(this.#activeIndex + delta, 0),
            this.#locales.length - 1,
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
        for (let n = 0; n < this.#locales.length; n++) {
            const i = (start + n) % this.#locales.length;
            if (this.labelFor(this.#locales[i]).toLowerCase().startsWith(query)) {
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
                this.openList(this.#locales.length - 1);
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
                this.#setActive(this.#locales.length - 1);
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
                // ±10, clamped: an APG-optional key for long locale lists.
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
            option.setAttribute("aria-selected", String(this.#locales[i] === value));
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
        root.className = `locale-picker ${extraClass}`.trim();
        root.addEventListener("focusout", this.#onRootFocusOut);

        // The hidden input preserves form participation and the `name`.
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = this.name;
        input.value = this.value;
        root.appendChild(input);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "locale-picker-button";
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
        list.className = "locale-picker-list";
        list.id = this.listId;
        list.setAttribute("role", "listbox");
        list.setAttribute("aria-label", this.label);
        list.setAttribute("tabindex", "-1");
        list.setAttribute("hidden", "");
        list.addEventListener("keydown", this.#onListKeydown);

        const optionEls: HTMLLIElement[] = [];
        this.#locales.forEach((locale, i) => {
            const option = document.createElement("li");
            option.className = "locale-picker-option";
            option.id = this.optionId(i);
            option.setAttribute("role", "option");
            option.setAttribute("aria-selected", String(locale === this.value));
            // `lang` is set only when the label is the endonym we derived
            // (WCAG 3.1.2 Language of Parts) — see `optionLang`. The
            // button and the list carry no `lang`: they are not
            // locale-specific.
            const lang = this.optionLang(locale);
            if (lang) option.setAttribute("lang", lang);
            option.textContent = this.labelFor(locale);
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

// ---- Module-local helpers ----

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
