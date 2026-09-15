/**
 * `<picker-bar>` — Lily Design System HTML helper.
 *
 * See `./spec/index.md` for the canonical contract. This file implements
 * the custom-element class but does NOT register it. The `index.ts`
 * barrel registers it on import.
 *
 * A thin composition: renders `<theme-picker>`, `<locale-picker>`,
 * `<text-size-picker>`, and `<share-picker>` — each imported from its
 * own published package, not vendored — inside one
 * `<div class="picker-bar {class}">` row. Owns no lifecycle of its
 * own beyond two catalog-specific defaults (§5.1, §5.2 of the spec).
 */

// Side-effect imports: each registers its own custom element.
import "lily-design-system-html-theme-picker";
import "lily-design-system-html-locale-picker";
import "lily-design-system-html-text-size-picker";
import "lily-design-system-html-share-picker";

import type {
  ThemePicker,
  ThemePickerProps,
} from "lily-design-system-html-theme-picker";
import type {
  LocalePicker,
  LocalePickerProps,
} from "lily-design-system-html-locale-picker";
import type {
  TextSizePicker,
  TextSizePickerProps,
} from "lily-design-system-html-text-size-picker";
import type {
  SharePicker,
  SharePickerProps,
  ShareTarget,
} from "lily-design-system-html-share-picker";

export type { ShareTarget };

/**
 * All 45 Lily reference theme slugs (see `themes/` at the repo root),
 * sorted alphabetically except the United Kingdom and United States
 * government/public-sector themes, which sort last as one alphabetical
 * group of their own. Mirrors `theme-picker`'s own title-casing of each
 * slug, so no `theme-labels` override is needed for these to read well.
 */
export const DEFAULT_THEMES: string[] = [
  "abyss",
  "acid",
  "adobe-spectrum",
  "aqua",
  "autumn",
  "black",
  "bumblebee",
  "business",
  "caramellatte",
  "cmyk",
  "coffee",
  "corporate",
  "cupcake",
  "cyberpunk",
  "dark",
  "dim",
  "dracula",
  "emerald",
  "fantasy",
  "forest",
  "garden",
  "halloween",
  "lemonade",
  "light",
  "lofi",
  "luxury",
  "mozilla-protocol",
  "night",
  "nord",
  "pastel",
  "retro",
  "silk",
  "sunset",
  "synthwave",
  "valentine",
  "winter",
  "wireframe",
  "united-kingdom-government-digital-service",
  "united-kingdom-national-health-service-england-for-patients",
  "united-kingdom-national-health-service-england-for-practitioners",
  "united-kingdom-national-health-service-scotland-for-patients",
  "united-kingdom-national-health-service-scotland-for-practitioners",
  "united-kingdom-national-health-service-wales-for-patients",
  "united-kingdom-national-health-service-wales-for-practitioners",
  "united-states-web-design-system",
];

/**
 * The seven-step text-size scale. Each slug title-cases to exactly the
 * requested label ("largest" → "Largest", …) via `text-size-picker`'s
 * own default label resolver, so no `size-labels` override is needed
 * either.
 */
export const DEFAULT_SIZES: string[] = [
  "largest",
  "larger",
  "large",
  "normal",
  "small",
  "smaller",
  "smallest",
];

/** Accessible names for the four pickers. Required — no English default. */
export type PickerBarLabels = {
  /** Accessible name for the theme picker's button and listbox. */
  theme: string;
  /** Accessible name for the locale picker's button and listbox. */
  locale: string;
  /** Accessible name for the text-size picker's button and listbox. */
  textSize: string;
  /** Accessible name for the share picker's button and list. */
  share: string;
};

const DEFAULT_LABELS: PickerBarLabels = {
  theme: "",
  locale: "",
  textSize: "",
  share: "",
};

/**
 * Extra per-picker configuration, applied to that picker's element
 * instance (via property assignment, which each sibling package
 * reflects onto its own attributes) BEFORE the element is connected —
 * so persistence, detection, and initial-value props still take
 * effect on first mount. Applied after `<picker-bar>`'s own defaults,
 * so anything here overrides them. Excludes the props `<picker-bar>`
 * already lifts to the top level.
 */
export type ThemePickerExtra = Partial<
  Omit<ThemePickerProps, "label" | "themesUrl" | "themes">
>;
export type LocalePickerExtra = Partial<Omit<LocalePickerProps, "label" | "locales">>;
export type TextSizePickerExtra = Partial<
  Omit<TextSizePickerProps, "label" | "sizes">
>;
export type SharePickerExtra = Partial<Omit<SharePickerProps, "label" | "targets">>;

/** Mirrors the observed attributes / properties for typing convenience. */
export type PickerBarProps = {
  labels: PickerBarLabels;
  themesUrl: string;
  themes?: string[];
  themeProps?: ThemePickerExtra;
  locales: string[];
  localeProps?: LocalePickerExtra;
  sizes?: string[];
  textSizeProps?: TextSizePickerExtra;
  shareTargets?: ShareTarget[];
  shareProps?: SharePickerExtra;
  class?: string;
};

/** Custom-element class implementing `<picker-bar>`. */
export class PickerBar extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["themes-url", "themes", "locales", "sizes", "class"];
  }

  // Backing storage for property-only members (no honest attribute
  // encoding — labels/targets carry non-string data, and the *Extra
  // bags are applied at property-assignment time, not re-derivable
  // from an attribute).
  #labels: PickerBarLabels = DEFAULT_LABELS;
  #themes: string[] = DEFAULT_THEMES;
  #locales: string[] = [];
  #sizes: string[] = DEFAULT_SIZES;
  #shareTargets: ShareTarget[] = [];
  #themeProps: ThemePickerExtra = {};
  #localeProps: LocalePickerExtra = {};
  #textSizeProps: TextSizePickerExtra = {};
  #shareProps: SharePickerExtra = {};

  // Rendered-DOM references. Null until #render() has run.
  #rootEl: HTMLDivElement | null = null;
  #themePickerEl: ThemePicker | null = null;
  #localePickerEl: LocalePicker | null = null;
  #textSizePickerEl: TextSizePicker | null = null;
  #sharePickerEl: SharePicker | null = null;

  // ---- Property accessors ----

  get labels(): PickerBarLabels {
    return this.#labels;
  }
  set labels(v: PickerBarLabels) {
    this.#labels = v ?? DEFAULT_LABELS;
    this.#render();
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
    this.#themes = Array.isArray(v) && v.length > 0 ? v.slice() : DEFAULT_THEMES;
    const csv = this.#themes.join(",");
    if (this.getAttribute("themes") !== csv) {
      this.setAttribute("themes", csv);
      return; // attributeChangedCallback will render
    }
    this.#render();
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

  get sizes(): string[] {
    return [...this.#sizes];
  }
  set sizes(v: string[]) {
    this.#sizes = Array.isArray(v) && v.length > 0 ? v.slice() : DEFAULT_SIZES;
    const csv = this.#sizes.join(",");
    if (this.getAttribute("sizes") !== csv) {
      this.setAttribute("sizes", csv);
      return;
    }
    this.#render();
  }

  get shareTargets(): ShareTarget[] {
    return [...this.#shareTargets];
  }
  set shareTargets(v: ShareTarget[]) {
    this.#shareTargets = Array.isArray(v) ? v.slice() : [];
    this.#render();
  }

  get themeProps(): ThemePickerExtra {
    return this.#themeProps;
  }
  set themeProps(v: ThemePickerExtra) {
    this.#themeProps = v ?? {};
    this.#render();
  }

  get localeProps(): LocalePickerExtra {
    return this.#localeProps;
  }
  set localeProps(v: LocalePickerExtra) {
    this.#localeProps = v ?? {};
    this.#render();
  }

  get textSizeProps(): TextSizePickerExtra {
    return this.#textSizeProps;
  }
  set textSizeProps(v: TextSizePickerExtra) {
    this.#textSizeProps = v ?? {};
    this.#render();
  }

  get shareProps(): SharePickerExtra {
    return this.#shareProps;
  }
  set shareProps(v: SharePickerExtra) {
    this.#shareProps = v ?? {};
    this.#render();
  }

  /** The rendered `<theme-picker>` instance, once connected. */
  get themePicker(): ThemePicker | null {
    return this.#themePickerEl;
  }
  /** The rendered `<locale-picker>` instance, once connected. */
  get localePicker(): LocalePicker | null {
    return this.#localePickerEl;
  }
  /** The rendered `<text-size-picker>` instance, once connected. */
  get textSizePicker(): TextSizePicker | null {
    return this.#textSizePickerEl;
  }
  /** The rendered `<share-picker>` instance, once connected. */
  get sharePicker(): SharePicker | null {
    return this.#sharePickerEl;
  }

  // ---- Lifecycle ----

  connectedCallback(): void {
    // Pick up CSV attributes set via HTML before the JS evaluated.
    const themesAttr = this.getAttribute("themes");
    if (themesAttr !== null) this.#themes = parseCsv(themesAttr);
    const localesAttr = this.getAttribute("locales");
    if (localesAttr !== null) this.#locales = parseCsv(localesAttr);
    const sizesAttr = this.getAttribute("sizes");
    if (sizesAttr !== null) this.#sizes = parseCsv(sizesAttr);

    this.#render();
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ): void {
    switch (name) {
      case "themes":
        this.#themes = value === null ? DEFAULT_THEMES : parseCsv(value);
        this.#render();
        break;
      case "locales":
        this.#locales = value === null ? [] : parseCsv(value);
        this.#render();
        break;
      case "sizes":
        this.#sizes = value === null ? DEFAULT_SIZES : parseCsv(value);
        this.#render();
        break;
      case "themes-url":
      case "class":
        this.#render();
        break;
      default:
        break;
    }
  }

  // ---- Rendering ----

  #render(): void {
    if (!this.isConnected) return;

    const extraClass = this.getAttribute("class") ?? "";
    const root = document.createElement("div");
    root.className = `picker-bar ${extraClass}`.trim();

    const themeEl = document.createElement("theme-picker") as ThemePicker;
    themeEl.label = this.#labels.theme;
    themeEl.themesUrl = this.themesUrl;
    themeEl.themes = this.#themes;
    Object.assign(themeEl, this.#themeProps);
    root.appendChild(themeEl);

    const localeEl = document.createElement("locale-picker") as LocalePicker;
    localeEl.label = this.#labels.locale;
    localeEl.locales = this.#locales;
    Object.assign(localeEl, this.#localeProps);
    root.appendChild(localeEl);

    const textSizeEl = document.createElement(
      "text-size-picker",
    ) as TextSizePicker;
    textSizeEl.label = this.#labels.textSize;
    textSizeEl.sizes = this.#sizes;
    // text-size-picker's own fallback ("medium" if offered, else
    // sizes[0]) doesn't fit this seven-slug scale — "medium" isn't
    // one of them, so an unset default would silently start on
    // "largest". Set before #textSizeProps so a consumer's own
    // defaultValue still wins.
    textSizeEl.defaultValue = "normal";
    Object.assign(textSizeEl, this.#textSizeProps);
    root.appendChild(textSizeEl);

    const shareEl = document.createElement("share-picker") as SharePicker;
    shareEl.label = this.#labels.share;
    shareEl.targets = this.#shareTargets;
    Object.assign(shareEl, this.#shareProps);
    root.appendChild(shareEl);

    this.replaceChildren(root);
    this.#rootEl = root;
    this.#themePickerEl = themeEl;
    this.#localePickerEl = localeEl;
    this.#textSizePickerEl = textSizeEl;
    this.#sharePickerEl = shareEl;
  }
}

function parseCsv(s: string): string[] {
  return s
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}
