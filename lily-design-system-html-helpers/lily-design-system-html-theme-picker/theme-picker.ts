/**
 * `<theme-picker>` — Lily Design System HTML helper.
 *
 * See `./spec.md` for the canonical contract. This file implements
 * the custom-element class but does NOT register it. The `index.ts`
 * barrel registers it on import.
 */

/** Change-event detail dispatched on every applied theme. */
export type ThemePickerChangeDetail = {
    theme: string;
};

/** Mirrors the observed attributes / properties for typing convenience. */
export type ThemePickerProps = {
    label: string;
    themesUrl: string;
    themes: string[];
    value?: string;
    defaultValue?: string;
    storageKey?: string;
    name?: string;
    extension?: string;
    themeLabels?: Record<string, string>;
    target?: HTMLElement | null;
    class?: string;
};

/** Normalise the themes directory URL to end with exactly one `/`. */
export function normalizeThemesUrl(themesUrl: string): string {
    return themesUrl.endsWith("/") ? themesUrl : themesUrl + "/";
}

/** Construct the href for a given theme slug. */
export function themeHref(themesUrl: string, slug: string, extension: string): string {
    return normalizeThemesUrl(themesUrl) + slug + extension;
}

/** Custom-element class implementing `<theme-picker>`. */
export class ThemePicker extends HTMLElement {
    static get observedAttributes(): string[] {
        return [
            "label",
            "themes-url",
            "themes",
            "value",
            "default-value",
            "storage-key",
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
                this.#render();
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
        // If no other <theme-picker> with the same name remains in the
        // document, garbage-collect the managed <link>.
        const sameName = document.querySelectorAll(
            `theme-picker[name="${this.name}"]`,
        );
        if (sameName.length === 0) {
            const link = document.head.querySelector(
                `link[data-lily-theme-picker="${this.name}"]`,
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
        const selector = `link[data-lily-theme-picker="${this.name}"]`;
        let link = document.head.querySelector<HTMLLinkElement>(selector);
        if (!link) {
            link = document.createElement("link");
            link.rel = "stylesheet";
            link.setAttribute("data-lily-theme-picker", this.name);
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
            new CustomEvent<ThemePickerChangeDetail>("themechange", {
                detail: { theme: slug },
                bubbles: true,
                composed: true,
            }),
        );
    }

    #labelFor(theme: string): string {
        if (theme in this.#themeLabels) return this.#themeLabels[theme];
        return theme.charAt(0).toUpperCase() + theme.slice(1);
    }

    #render(): void {
        const fieldset = document.createElement("fieldset");
        const extraClass = this.getAttribute("class") ?? "";
        fieldset.className = `theme-picker ${extraClass}`.trim();
        fieldset.setAttribute("role", "radiogroup");
        fieldset.setAttribute("aria-label", this.label);

        const radioName = this.name;
        const current = this.value;
        for (const theme of this.#themes) {
            const label = document.createElement("label");
            label.className = "theme-picker-option";

            const input = document.createElement("input");
            input.type = "radio";
            input.name = radioName;
            input.value = theme;
            input.checked = current === theme;
            input.addEventListener("change", () => {
                this.value = theme;
            });

            const span = document.createElement("span");
            span.className = "theme-picker-option-label";
            span.textContent = this.#labelFor(theme);

            label.appendChild(input);
            label.appendChild(span);
            fieldset.appendChild(label);
        }

        this.replaceChildren(fieldset);
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
