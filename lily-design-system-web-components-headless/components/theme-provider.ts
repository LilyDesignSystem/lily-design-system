// ThemeProvider component
//
// A container that applies CSS custom properties from a theme object to
// its children by flattening nested keys into `--theme-*` properties
// (AGENTS/theme.md). Renders as the canonical <div>; the custom element
// stands in for that div directly (see lib/dom-utils.applySelfClassName)
// since <div> has no native behaviour worth preserving as a separate
// element, and `display: contents` (the second documented structural-
// style exception in this catalog, alongside FloatButton's
// `position: fixed`) keeps it from affecting layout.
//
// PUBLIC API — ported faithfully from the Svelte canonical
// (lily-design-system-svelte-headless/components/ThemeProvider/ThemeProvider.svelte):
// a plain HTML attribute cannot carry a nested object, so the theme is
// primarily set via the JS property `theme` (a plain object, flattened
// the same way Svelte's own `flatten()` helper does — nested objects walk
// recursively, joining keys with "-"; arrays and null/undefined values are
// left alone / skipped exactly as Svelte's `typeof value === "object" &&
// !Array.isArray(value)` check does). A `theme="…"` attribute is also
// accepted as a JSON-string fallback for purely-declarative markup (no
// script) — read once at connect time, and only when the `theme` property
// was not already set programmatically before the element connected.
//
// Attributes:
//   theme — optional JSON-string fallback for the `theme` property (see
//     above). The property is the primary API.
//   base — "light" | "dark", default "light". Reflected as data-theme
//     (matching Svelte's `data-theme={base}` exactly — not `data-base`).
//
// References:
//   - components/theme-provider/index.md (canonical contract)
//   - AGENTS/theme.md (token-flattening contract, `--theme-{path}`, `data-theme`)
//   - Reuters Graphics Theme component

import { applySelfClassName } from "../lib/dom-utils.js";

export type ThemeValue = string | number | boolean;
export type ThemeObject = { [key: string]: ThemeValue | ThemeObject | undefined | null };

function flatten(obj: ThemeObject, prefix = "--theme"): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(obj)) {
        const k = `${prefix}-${key}`;
        if (value !== null && typeof value === "object" && !Array.isArray(value)) {
            Object.assign(out, flatten(value as ThemeObject, k));
        } else if (value !== undefined && value !== null) {
            out[k] = String(value);
        }
    }
    return out;
}

export class ThemeProvider extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["base"];
    }

    #built = false;
    #theme: ThemeObject = {};
    #themeSetProgrammatically = false;
    #appliedKeys: string[] = [];

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "theme-provider");
            this.style.setProperty("display", "contents");

            if (!this.#themeSetProgrammatically) {
                const attr = this.getAttribute("theme");
                if (attr !== null) {
                    try {
                        this.#theme = JSON.parse(attr) as ThemeObject;
                    } catch {
                        // Invalid JSON in the theme attribute is ignored; the
                        // theme property is the primary, documented API.
                    }
                }
            }
        }
        this.#applyTheme();
        this.#applyBase();
    }

    attributeChangedCallback(name: string): void {
        if (name === "base") this.#applyBase();
    }

    /** The theme object. Primary API — see file header. */
    get theme(): ThemeObject {
        return this.#theme;
    }

    set theme(value: ThemeObject) {
        this.#theme = value ?? {};
        this.#themeSetProgrammatically = true;
        if (this.#built) this.#applyTheme();
    }

    get base(): "light" | "dark" {
        return (this.getAttribute("base") as "light" | "dark" | null) ?? "light";
    }

    set base(value: "light" | "dark") {
        this.setAttribute("base", value);
    }

    #applyBase(): void {
        if (!this.#built) return;
        this.setAttribute("data-theme", this.base);
    }

    #applyTheme(): void {
        for (const key of this.#appliedKeys) this.style.removeProperty(key);
        const flattened = flatten(this.#theme);
        this.#appliedKeys = Object.keys(flattened);
        for (const [key, value] of Object.entries(flattened)) {
            this.style.setProperty(key, value);
        }
    }
}
