/**
 * `<locale-select>` — Lily Design System HTML helper.
 *
 * See `./spec/index.md` for the canonical contract. This file implements
 * the custom-element class but does NOT register it. The `index.ts`
 * barrel registers it on import.
 */

import {
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
} from "./locales.js";

export { defaultLocaleLabels, RTL_LANGUAGE_TAGS, RTL_SCRIPT_SUBTAGS };

/** Change-event detail dispatched on every applied locale. */
export type LocaleSelectChangeDetail = {
    locale: string;
};

/** Mirrors the observed attributes / properties for typing convenience. */
export type LocaleSelectProps = {
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

// ----------------------------------------------------------------
// Custom-element class
// ----------------------------------------------------------------

export class LocaleSelect extends HTMLElement {
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
                this.#render();
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

    #applyLocale(code: string): void {
        if (typeof document === "undefined" || !code) return;
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
            new CustomEvent<LocaleSelectChangeDetail>("localechange", {
                detail: { locale: code },
                bubbles: true,
                composed: true,
            }),
        );
    }

    #labelFor(locale: string): string {
        if (locale in this.#localeLabels) return this.#localeLabels[locale];
        if (locale in defaultLocaleLabels) return defaultLocaleLabels[locale];
        const intl = intlDisplayName(locale);
        if (intl) return intl;
        return locale;
    }

    #tagFor(locale: string): string {
        return bcp47LocaleTag(locale);
    }

    #render(): void {
        const select = document.createElement("select");
        const extraClass = this.getAttribute("class") ?? "";
        select.className = `locale-select ${extraClass}`.trim();
        select.setAttribute("aria-label", this.label);
        select.name = this.name;

        const current = this.value;
        for (const locale of this.#locales) {
            const option = document.createElement("option");
            option.className = "locale-select-option";
            option.value = locale;
            option.setAttribute("lang", this.#tagFor(locale));
            option.textContent = this.#labelFor(locale);
            if (current === locale) option.selected = true;
            select.appendChild(option);
        }

        select.addEventListener("change", () => {
            this.value = select.value;
        });

        this.replaceChildren(select);
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
