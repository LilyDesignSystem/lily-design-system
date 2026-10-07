/**
 * `<lily-picker-bar>` — Lily Design System HTML helper.
 *
 * See `./spec/index.md` for the canonical contract. This file implements
 * the custom-element class but does NOT register it. The `index.ts`
 * barrel registers it on import.
 *
 * A thin composition wrapper: it renders `<lily-search-picker>`,
 * `<lily-theme-picker>`, `<lily-locale-picker>`,
 * `<lily-text-size-picker>`, and `<lily-share-picker>` — search first,
 * each depended on as a real npm package, not
 * vendored — in that fixed order, with two catalog-specific defaults
 * pre-wired (§5.1, §5.2 of the spec). It owns no interaction of its
 * own: no listbox, no keyboard handling, no applied/persisted state.
 */

// Side-effect imports: each registers its custom element tag on load.
// These must stay bare `import "…"` statements — importing the class
// binding ONLY to use it in a type position (`as ThemePicker`) is a
// type-only usage, and esbuild's TS transform silently elides an
// import whose binding is never used as a runtime value, dropping the
// registration side effect with it. A bare side-effect import can
// never be elided.
import "@lilydesignsystem/web-components-link-picker";
import "@lilydesignsystem/web-components-search-picker";
import "@lilydesignsystem/web-components-theme-picker";
import "@lilydesignsystem/web-components-locale-picker";
import "@lilydesignsystem/web-components-text-size-picker";
import "@lilydesignsystem/web-components-share-picker";

import type { LinkPicker, LinkPickerProps, LinkItem } from "@lilydesignsystem/web-components-link-picker";
import type { SearchPicker, SearchPickerProps } from "@lilydesignsystem/web-components-search-picker";
import type { ThemePicker, ThemePickerProps } from "@lilydesignsystem/web-components-theme-picker";
import type { LocalePicker, LocalePickerProps } from "@lilydesignsystem/web-components-locale-picker";
import type { TextSizePicker, TextSizePickerProps } from "@lilydesignsystem/web-components-text-size-picker";
import type {
  SharePicker,
  SharePickerProps,
  ShareTarget,
} from "@lilydesignsystem/web-components-share-picker";

/**
 * All 45 Lily reference theme slugs (see `themes/` at the repo root),
 * sorted alphabetically except the United Kingdom and United States
 * government/public-sector themes, which sort last as one alphabetical
 * group of their own. Mirrors `<lily-theme-picker>`'s own title-casing
 * of each slug, so no `theme-labels` override is needed for these to
 * read well.
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
 * requested label ("largest" → "Largest", …) via `<lily-text-size-picker>`'s
 * own default `labelFor`, so no `size-labels` override is needed either.
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
  /**
   * Accessible name for the link picker's button and list. Needed only when `links` is
   * supplied; the link picker renders only when both are present.
   */
  link?: string;
  /** Accessible name for the search picker's button and search landmark. */
  search: string;
  /** Accessible name for the search picker's text field. */
  searchInput: string;
  /** Accessible name for the search picker's ⏎ submit button. */
  searchSubmit: string;
  /** Accessible name for the theme picker's button and listbox. */
  theme: string;
  /** Accessible name for the locale picker's button and listbox. */
  locale: string;
  /** Accessible name for the text-size picker's button and listbox. */
  textSize: string;
  /** Accessible name for the share picker's button and list. */
  share: string;
};

/**
 * Matches `DateTimePicker`'s own `DEFAULT_LABELS`: empty strings, never
 * English text, so an omitted `labels` renders unnamed controls rather
 * than a name this catalog invented.
 */
const DEFAULT_LABELS: PickerBarLabels = {
  search: "",
  searchInput: "",
  searchSubmit: "",
  theme: "",
  locale: "",
  textSize: "",
  share: "",
};

/** Mirrors the observed attributes / properties for typing convenience. */
export type PickerBarProps = {
  /** Property-only — see `spec/index.md` §4.3. Required, no default. */
  labels: PickerBarLabels;
  /** Property-only extra `<lily-search-picker>` config (`action`, `navigate`, `placeholder`, `onSearch`, …), applied after the bar's own. */
  searchProps?: Partial<Omit<SearchPickerProps, "label" | "inputLabel" | "submitLabel">>;
  /** Page links for the link picker, which renders FIRST (leftmost). Omitted or empty: no link picker. */
  links?: LinkItem[];
  /** Property-only extra `<lily-link-picker>` config (`onNavigate`, …), applied after this bar's own. */
  linkProps?: Partial<Omit<LinkPickerProps, "label" | "links">>;
  themesUrl: string;
  themes?: string[];
  /** Property-only extra `<lily-theme-picker>` config, applied after the bar's own. */
  themeProps?: Partial<Omit<ThemePickerProps, "themesUrl" | "themes" | "label">>;
  locales: string[];
  /** Property-only extra `<lily-locale-picker>` config, applied after the bar's own. */
  localeProps?: Partial<Omit<LocalePickerProps, "locales" | "label">>;
  sizes?: string[];
  /** Property-only extra `<lily-text-size-picker>` config, applied after the bar's own. */
  textSizeProps?: Partial<Omit<TextSizePickerProps, "sizes" | "label">>;
  /** Property-only — `ShareTarget.href` is a function. */
  shareTargets?: ShareTarget[];
  /** Property-only extra `<lily-share-picker>` config, applied after the bar's own. */
  shareProps?: Partial<Omit<SharePickerProps, "targets" | "label">>;
  class?: string;
};

function parseCsv(s: string): string[] {
  return s
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

/** Custom-element class implementing `<lily-picker-bar>`. */
export class PickerBar extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["themes-url", "themes", "locales", "sizes", "class"];
  }

  #themes: string[] = [...DEFAULT_THEMES];
  #locales: string[] = [];
  #sizes: string[] = [...DEFAULT_SIZES];
  #labels: PickerBarLabels = { ...DEFAULT_LABELS };
  #shareTargets: ShareTarget[] = [];
  #links: LinkItem[] = [];
  #linkProps: Partial<LinkPickerProps> = {};
  #searchProps: Partial<SearchPickerProps> = {};
  #themeProps: Partial<ThemePickerProps> = {};
  #localeProps: Partial<LocalePickerProps> = {};
  #textSizeProps: Partial<TextSizePickerProps> = {};
  #shareProps: Partial<SharePickerProps> = {};

  #built = false;
  #rootEl: HTMLDivElement | null = null;
  #linkEl: LinkPicker | null = null;
  #searchEl: SearchPicker | null = null;
  #themeEl: ThemePicker | null = null;
  #localeEl: LocalePicker | null = null;
  #textSizeEl: TextSizePicker | null = null;
  #shareEl: SharePicker | null = null;

  // ---- Property accessors ----

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
    this.#themes = Array.isArray(v) && v.length > 0 ? v.slice() : [...DEFAULT_THEMES];
    const csv = this.#themes.join(",");
    if (this.getAttribute("themes") !== csv) {
      this.setAttribute("themes", csv);
      return; // attributeChangedCallback applies it
    }
    if (this.#themeEl) this.#themeEl.themes = this.#themes;
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
    if (this.#localeEl) this.#localeEl.locales = this.#locales;
  }

  get sizes(): string[] {
    return [...this.#sizes];
  }
  set sizes(v: string[]) {
    this.#sizes = Array.isArray(v) && v.length > 0 ? v.slice() : [...DEFAULT_SIZES];
    const csv = this.#sizes.join(",");
    if (this.getAttribute("sizes") !== csv) {
      this.setAttribute("sizes", csv);
      return;
    }
    if (this.#textSizeEl) this.#textSizeEl.sizes = this.#sizes;
  }

  /** Property-only. No English default — see `spec/index.md` §4.3. */
  get labels(): PickerBarLabels {
    return { ...this.#labels };
  }
  set labels(v: PickerBarLabels) {
    this.#labels = v ?? { ...DEFAULT_LABELS };
    this.#syncLink();
    if (this.#searchEl) {
      this.#searchEl.label = this.#labels.search;
      this.#searchEl.inputLabel = this.#labels.searchInput;
      this.#searchEl.submitLabel = this.#labels.searchSubmit;
    }
    if (this.#themeEl) this.#themeEl.label = this.#labels.theme;
    if (this.#localeEl) this.#localeEl.label = this.#labels.locale;
    if (this.#textSizeEl) this.#textSizeEl.label = this.#labels.textSize;
    if (this.#shareEl) this.#shareEl.label = this.#labels.share;
  }

  /** Property-only — `ShareTarget.href` is a function. */
  get shareTargets(): ShareTarget[] {
    return [...this.#shareTargets];
  }
  set shareTargets(v: ShareTarget[]) {
    this.#shareTargets = Array.isArray(v) ? v.slice() : [];
    if (this.#shareEl) this.#shareEl.targets = this.#shareTargets;
  }

  /** Page links for the link picker (leftmost). Property-only. */
  get links(): LinkItem[] {
    return [...this.#links];
  }
  set links(v: LinkItem[]) {
    this.#links = Array.isArray(v) ? v.slice() : [];
    this.#syncLink();
  }

  get linkProps(): Partial<LinkPickerProps> {
    return { ...this.#linkProps };
  }
  set linkProps(v: Partial<LinkPickerProps>) {
    this.#linkProps = v ?? {};
    if (this.#linkEl) Object.assign(this.#linkEl, this.#linkProps);
  }

  /** The rendered `<lily-link-picker>` instance (null when no links). */
  get linkPicker(): LinkPicker | null {
    return this.#linkEl;
  }

  /**
   * Create, update or remove the link picker so it is the root's first child exactly when
   * `links` is non-empty and `labels.link` is set. The picker is optional, so unlike the
   * other five it can appear and disappear after the bar is rendered.
   */
  #syncLink(): void {
    if (!this.#rootEl) return;
    const wanted = this.#links.length > 0 && !!this.#labels.link;
    if (!wanted) {
      this.#linkEl?.remove();
      this.#linkEl = null;
      return;
    }
    if (!this.#linkEl) {
      this.#linkEl = document.createElement("lily-link-picker") as LinkPicker;
      this.#rootEl.insertBefore(this.#linkEl, this.#rootEl.firstChild);
    }
    this.#linkEl.label = this.#labels.link as string;
    this.#linkEl.links = this.#links;
    Object.assign(this.#linkEl, this.#linkProps);
  }

  get searchProps(): Partial<SearchPickerProps> {
    return { ...this.#searchProps };
  }
  set searchProps(v: Partial<SearchPickerProps>) {
    this.#searchProps = v ?? {};
    if (this.#searchEl) Object.assign(this.#searchEl, this.#searchProps);
  }

  get themeProps(): Partial<ThemePickerProps> {
    return { ...this.#themeProps };
  }
  set themeProps(v: Partial<ThemePickerProps>) {
    this.#themeProps = v ?? {};
    if (this.#themeEl) Object.assign(this.#themeEl, this.#themeProps);
  }

  get localeProps(): Partial<LocalePickerProps> {
    return { ...this.#localeProps };
  }
  set localeProps(v: Partial<LocalePickerProps>) {
    this.#localeProps = v ?? {};
    if (this.#localeEl) Object.assign(this.#localeEl, this.#localeProps);
  }

  get textSizeProps(): Partial<TextSizePickerProps> {
    return { ...this.#textSizeProps };
  }
  set textSizeProps(v: Partial<TextSizePickerProps>) {
    this.#textSizeProps = v ?? {};
    if (this.#textSizeEl) Object.assign(this.#textSizeEl, this.#textSizeProps);
  }

  get shareProps(): Partial<SharePickerProps> {
    return { ...this.#shareProps };
  }
  set shareProps(v: Partial<SharePickerProps>) {
    this.#shareProps = v ?? {};
    if (this.#shareEl) Object.assign(this.#shareEl, this.#shareProps);
  }

  // ---- Lifecycle ----

  connectedCallback(): void {
    // Pick up initial CSV attributes set via HTML before JS evaluated,
    // mirroring `<lily-theme-picker>`'s own pattern.
    const themesAttr = this.getAttribute("themes");
    if (themesAttr !== null) this.#themes = parseCsv(themesAttr);
    const localesAttr = this.getAttribute("locales");
    if (localesAttr !== null) this.#locales = parseCsv(localesAttr);
    const sizesAttr = this.getAttribute("sizes");
    if (sizesAttr !== null) this.#sizes = parseCsv(sizesAttr);

    this.#build();
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ): void {
    switch (name) {
      case "themes-url":
        if (this.#themeEl) this.#themeEl.themesUrl = this.themesUrl;
        break;
      case "themes":
        this.#themes = value === null ? [...DEFAULT_THEMES] : parseCsv(value);
        if (this.#themeEl) this.#themeEl.themes = this.#themes;
        break;
      case "locales":
        this.#locales = value === null ? [] : parseCsv(value);
        if (this.#localeEl) this.#localeEl.locales = this.#locales;
        break;
      case "sizes":
        this.#sizes = value === null ? [...DEFAULT_SIZES] : parseCsv(value);
        if (this.#textSizeEl) this.#textSizeEl.sizes = this.#sizes;
        break;
      case "class":
        if (this.#rootEl) {
          this.#rootEl.className = `picker-bar ${value ?? ""}`.trim();
        }
        break;
      default:
        break;
    }
  }

  // ---- Rendering (built once; later changes update the existing children in place) ----

  #build(): void {
    if (this.#built) return;
    this.#built = true;

    const extraClass = this.getAttribute("class") ?? "";
    const root = document.createElement("div");
    root.className = `picker-bar ${extraClass}`.trim();

    // Connect `root` to the document FIRST, then append each picker
    // into it — not the other way round. Appending children to a
    // still-detached `root` and connecting the whole subtree in one
    // move relies on the engine walking the inserted subtree to fire
    // every descendant's connectedCallback recursively; jsdom does not
    // do this reliably. Appending each child only after its parent
    // chain is already connected guarantees its connectedCallback
    // fires immediately, in every environment.
    this.replaceChildren(root);

    // Search comes first in the row (maintainer-directed, 2026-10-02).
    const searchEl = document.createElement("lily-search-picker") as SearchPicker;
    searchEl.label = this.#labels.search;
    searchEl.inputLabel = this.#labels.searchInput;
    searchEl.submitLabel = this.#labels.searchSubmit;
    Object.assign(searchEl, this.#searchProps);
    root.appendChild(searchEl);

    const themeEl = document.createElement("lily-theme-picker") as ThemePicker;
    themeEl.label = this.#labels.theme;
    themeEl.themesUrl = this.themesUrl;
    themeEl.themes = this.#themes;
    Object.assign(themeEl, this.#themeProps);
    root.appendChild(themeEl);

    const localeEl = document.createElement("lily-locale-picker") as LocalePicker;
    localeEl.label = this.#labels.locale;
    localeEl.locales = this.#locales;
    Object.assign(localeEl, this.#localeProps);
    root.appendChild(localeEl);

    const textSizeEl = document.createElement(
      "lily-text-size-picker",
    ) as TextSizePicker;
    textSizeEl.label = this.#labels.textSize;
    textSizeEl.sizes = this.#sizes;
    // text-size-picker's own initial-value fallback ("medium" if
    // present, else sizes[0]) does not fit this seven-slug scale — see
    // spec/index.md §5.2.
    textSizeEl.defaultValue = "normal";
    Object.assign(textSizeEl, this.#textSizeProps);
    root.appendChild(textSizeEl);

    const shareEl = document.createElement("lily-share-picker") as SharePicker;
    shareEl.label = this.#labels.share;
    shareEl.targets = this.#shareTargets;
    Object.assign(shareEl, this.#shareProps);
    root.appendChild(shareEl);

    this.#rootEl = root;
    this.#searchEl = searchEl;
    this.#themeEl = themeEl;
    this.#localeEl = localeEl;
    this.#textSizeEl = textSizeEl;
    this.#shareEl = shareEl;
    this.#linkEl = null;
    this.#syncLink();
  }
}
