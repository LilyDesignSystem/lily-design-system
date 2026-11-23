// theme-picker.ts
import { ListboxController } from "./listbox-controller.js";

// theme-color.ts
function brandColor(root = document.documentElement) {
  return getComputedStyle(root).getPropertyValue("--lily-brand").trim();
}
function applyThemeColor(root = document.documentElement) {
  const color = brandColor(root);
  if (!color) return false;
  let meta = document.head.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  if (meta.content === color) return false;
  meta.content = color;
  return true;
}
function applyThemeColorWhenLoaded(link, root = document.documentElement) {
  link.addEventListener("load", () => applyThemeColor(root), { once: true });
}

// view-transition.ts
function canViewTransition() {
  if (typeof document === "undefined") return false;
  if (typeof document.startViewTransition !== "function")
    return false;
  if (typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches)
    return false;
  return true;
}
function withViewTransition(enabled, apply) {
  if (!enabled || !canViewTransition()) {
    void apply();
    return;
  }
  document.startViewTransition(apply);
}
function linkSettled(link, limit = 1e3) {
  return new Promise((resolve) => {
    const done = () => resolve();
    link.addEventListener("load", done, { once: true });
    link.addEventListener("error", done, { once: true });
    setTimeout(done, limit);
  });
}

// theme-choice.ts
var SYSTEM_THEME = "system";
var DEFAULT_SYSTEM_THEMES = { light: "light", dark: "dark" };
var DARK_QUERY = "(prefers-color-scheme: dark)";
function prefersDarkScheme() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia(DARK_QUERY).matches;
}
function watchColorScheme(onChange) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return () => {
  };
  const query = window.matchMedia(DARK_QUERY);
  const listener = (event) => onChange(event.matches);
  query.addEventListener?.("change", listener);
  return () => query.removeEventListener?.("change", listener);
}
function resolveTheme(choice, prefersDark, systemThemes = DEFAULT_SYSTEM_THEMES) {
  if (choice !== SYSTEM_THEME) return choice;
  return prefersDark ? systemThemes.dark : systemThemes.light;
}
function pageLanguage() {
  return typeof document !== "undefined" && document.documentElement.lang || void 0;
}
function sortThemes(themes, labelOf, locale) {
  const options = { sensitivity: "base", numeric: true };
  let collator;
  try {
    collator = new Intl.Collator(locale || void 0, options);
  } catch {
    collator = new Intl.Collator(void 0, options);
  }
  return [...themes].sort(
    (a, b) => collator.compare(labelOf(a), labelOf(b)) || (a < b ? -1 : a > b ? 1 : 0)
  );
}
function themeChoices(themes, systemLabel) {
  return systemLabel ? [SYSTEM_THEME, ...themes] : [...themes];
}
var THEME_COOKIE_MAX_AGE = 400 * 24 * 60 * 60;
function readThemeCookie(cookies, name, allowed) {
  for (const part of (cookies ?? "").split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0 || part.slice(0, eq).trim() !== name) continue;
    let value = part.slice(eq + 1).trim();
    try {
      value = decodeURIComponent(value);
    } catch {
      return "";
    }
    return !allowed || allowed.includes(value) ? value : "";
  }
  return "";
}
function themeCookie(name, value, secure = false) {
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax` + (secure ? "; Secure" : "");
}
function readDocumentThemeCookie(name, allowed) {
  try {
    return typeof document === "undefined" ? "" : readThemeCookie(document.cookie, name, allowed);
  } catch {
    return "";
  }
}
function writeDocumentThemeCookie(name, value) {
  try {
    if (typeof document === "undefined") return;
    document.cookie = themeCookie(name, value, window.location?.protocol === "https:");
  } catch {
  }
}

// theme-picker.ts
var SVG_NS = "http://www.w3.org/2000/svg";
function themeName(theme) {
  return theme.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
function matchSystemTheme(themes) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "";
  }
  const wanted = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  return themes.includes(wanted) ? wanted : "";
}
function normalizeThemesUrl(themesUrl) {
  return themesUrl.endsWith("/") ? themesUrl : themesUrl + "/";
}
function themeHref(themesUrl, slug, extension) {
  return normalizeThemesUrl(themesUrl) + slug + extension;
}
var uid = 0;
function nextThemePickerId() {
  uid += 1;
  return `theme-picker-${uid}`;
}
var ThemePicker = class extends HTMLElement {
  static get observedAttributes() {
    return [
      "label",
      "themes-url",
      "themes",
      "value",
      "default-value",
      "storage-key",
      "detect-from-system",
      "system-label",
      "system-themes",
      "cookie-name",
      "name",
      "extension",
      "theme-labels",
      "sort-themes",
      "class",
      "open",
      "disabled",
      "variant"
    ];
  }
  // Backing storage for properties.
  #themes = [];
  #themeLabels = {};
  // The page's language (`<html lang>`), kept current while connected, so a language change sorts the names again.
  #language = void 0;
  #languageObserver = null;
  #target = null;
  #initialised = false;
  // Rendered-DOM references. Null until #render() has run.
  #rootEl = null;
  // The native select of variant="select"; null in the listbox variant.
  #selectEl = null;
  #inputEl = null;
  #buttonEl = null;
  #tooltip = null;
  #listEl = null;
  #optionEls = [];
  // Listbox state.
  #open = false;
  /** True while an open comes from outside (the property, the attribute, mounting): state only, focus stays put. */
  #quietOpen = false;
  /** True while mounting open: the initial value is not a change, so nothing is reported. */
  #silentOpen = false;
  /** Called with the new open state whenever it changes; also dispatched as a bubbling `openchange` event. */
  onOpenChange;
  #activeIndex = -1;
  // Stable ids for the button/listbox aria wiring.
  #baseId = nextThemePickerId();
  // Arrow/Home/End/typeahead/PageUp/PageDown/Escape/Tab keyboard handling
  // inside the open list is owned by the shared ListboxController (see
  // @lilydesignsystem/html-headless/components/listbox-controller.js);
  // this element only decides what open/close/choose mean. Created once
  // per #render() (the listbox root is rebuilt each time); destroyed in
  // disconnectedCallback and before every rebuild.
  #listboxController = null;
  #onDocumentClick = (event) => {
    if (!this.#open) return;
    if (!event.composedPath().includes(this)) this.closeList(false);
  };
  // ---- Property accessors ----
  get label() {
    return this.getAttribute("label") ?? "";
  }
  set label(v) {
    this.setAttribute("label", v);
  }
  get themesUrl() {
    return this.getAttribute("themes-url") ?? "";
  }
  set themesUrl(v) {
    this.setAttribute("themes-url", v);
  }
  get themes() {
    return [...this.#themes];
  }
  set themes(v) {
    this.#themes = Array.isArray(v) ? v.slice() : [];
    const csv = this.#themes.join(",");
    if (this.getAttribute("themes") !== csv) {
      this.setAttribute("themes", csv);
      return;
    }
    this.#render();
  }
  get value() {
    return this.getAttribute("value") ?? "";
  }
  set value(v) {
    if (v) this.setAttribute("value", v);
    else this.removeAttribute("value");
  }
  get defaultValue() {
    return this.getAttribute("default-value") ?? "";
  }
  set defaultValue(v) {
    if (v) this.setAttribute("default-value", v);
    else this.removeAttribute("default-value");
  }
  /**
   * The localStorage key that keeps the choice. Default `lily-{name}` (`lily-theme`); `storage-key=""` keeps nothing
   * there. Written only when the choice changes, never on first load. Setting `null` restores the default.
   */
  get storageKey() {
    return this.getAttribute("storage-key") ?? `lily-${this.name}`;
  }
  set storageKey(v) {
    if (v === null || v === void 0) this.removeAttribute("storage-key");
    else this.setAttribute("storage-key", v);
  }
  /**
   * Resolve `prefers-color-scheme` to a supported theme on first
   * visit. Mirrors `detectFromNavigator` in locale-picker, including
   * the boolean-attribute convention: absent → false, present →
   * true, present and equal to "false" → false.
   */
  get detectFromSystem() {
    const v = this.getAttribute("detect-from-system");
    return v !== null && v !== "false";
  }
  set detectFromSystem(v) {
    if (v) this.setAttribute("detect-from-system", "");
    else this.removeAttribute("detect-from-system");
  }
  /**
   * The visible name of a first option, value `"system"` (`SYSTEM_THEME`), that follows the device: it applies the
   * light or dark theme of `system-themes` from `prefers-color-scheme`, and changes when the device does, for example
   * "Follow this device". Without it there is no such option. No English default. Attribute `system-label`.
   */
  get systemLabel() {
    return this.getAttribute("system-label") ?? "";
  }
  set systemLabel(v) {
    if (v) this.setAttribute("system-label", v);
    else this.removeAttribute("system-label");
  }
  /** The themes `"system"` applies. Attribute `system-themes="light,dark"`; default light and dark. */
  get systemThemes() {
    const [light, dark] = parseCsv(this.getAttribute("system-themes") ?? "");
    return light && dark ? { light, dark } : DEFAULT_SYSTEM_THEMES;
  }
  set systemThemes(v) {
    this.setAttribute("system-themes", `${v.light},${v.dark}`);
  }
  /**
   * The first-party cookie that keeps the choice (`Path=/`, `SameSite=Lax`, `Secure` on https, 400 days), so a
   * server can read it and send the page in the right theme. Attribute `cookie-name`; default `lily-{name}`
   * (`lily-theme`), `cookie-name=""` sets no cookie. Written only when the choice changes, never on first load.
   * Setting `null` restores the default.
   */
  get cookieName() {
    return this.getAttribute("cookie-name") ?? `lily-${this.name}`;
  }
  set cookieName(v) {
    if (v === null || v === void 0) this.removeAttribute("cookie-name");
    else this.setAttribute("cookie-name", v);
  }
  /**
   * List the themes alphabetically by the name shown, in the page's language. On by default; `sort-themes="false"` keeps the
   * order of `themes`, for an editorial order. "Follow this device" is first either way.
   */
  get sortThemes() {
    return this.getAttribute("sort-themes") !== "false";
  }
  set sortThemes(v) {
    this.setAttribute("sort-themes", v ? "true" : "false");
  }
  /** The choices offered: "system" first when it has a label, then the themes in alphabetical order of the name shown. */
  get #options() {
    const themes = this.sortThemes ? sortThemes(this.#themes, (theme) => this.labelFor(theme), this.#language) : this.#themes;
    return themeChoices(themes, this.systemLabel || void 0);
  }
  /**
   * Also set `<meta name="theme-color">` from the theme's `--lily-brand` once its stylesheet has loaded, so the
   * browser chrome follows the theme. Off by default (absent → false, present → true, "false" → false); a theme
   * without `--lily-brand` leaves the tag alone.
   */
  get themeColor() {
    const v = this.getAttribute("theme-color");
    return v !== null && v !== "false";
  }
  set themeColor(v) {
    if (v) this.setAttribute("theme-color", "");
    else this.removeAttribute("theme-color");
  }
  /**
   * Wrap each theme change in document.startViewTransition() when the browser has it and the user has not asked for
   * reduced motion, so the consumer's ::view-transition-* CSS can animate it. Off by default; the theme applies the same
   * either way. Off by default (absent → false, present → true, "false" → false).
   */
  get viewTransition() {
    const v = this.getAttribute("view-transition");
    return v !== null && v !== "false";
  }
  set viewTransition(v) {
    if (v) this.setAttribute("view-transition", "");
    else this.removeAttribute("view-transition");
  }
  get name() {
    return this.getAttribute("name") ?? "theme";
  }
  set name(v) {
    if (v) this.setAttribute("name", v);
    else this.removeAttribute("name");
  }
  get extension() {
    return this.getAttribute("extension") ?? ".css";
  }
  set extension(v) {
    if (v) this.setAttribute("extension", v);
    else this.removeAttribute("extension");
  }
  get themeLabels() {
    return { ...this.#themeLabels };
  }
  set themeLabels(v) {
    this.#themeLabels = v && typeof v === "object" ? { ...v } : {};
    const json = JSON.stringify(this.#themeLabels);
    if (this.getAttribute("theme-labels") !== json) {
      this.setAttribute("theme-labels", json);
      return;
    }
    this.#render();
  }
  get target() {
    return this.#target;
  }
  set target(v) {
    this.#target = v ?? null;
  }
  /** Is the popup open? Settable: `true` opens it and `false` closes it, without moving focus. The `open` attribute is the initial state. */
  get open() {
    return this.#open;
  }
  set open(value) {
    if (!!value === this.#open) return;
    this.#quietOpen = true;
    try {
      if (value) this.openList();
      else this.closeList(false);
    } finally {
      this.#quietOpen = false;
    }
  }
  /**
   * `"select"` renders a native `<select>` instead of the button and listbox (RFC 3 prototype; ported from the
   * Svelte reference 2026-10-30). Keyboard, typeahead and the mobile picker are the platform's; `open` does not
   * apply. Attribute `variant`; default `"listbox"`.
   */
  get variant() {
    return this.getAttribute("variant") === "select" ? "select" : "listbox";
  }
  set variant(value) {
    this.setAttribute("variant", value);
  }
  /** Disables the button; an open popup closes. Attribute `disabled`. */
  get disabled() {
    return this.hasAttribute("disabled");
  }
  set disabled(value) {
    if (value) this.setAttribute("disabled", "");
    else this.removeAttribute("disabled");
  }
  #emitOpenChange(open) {
    if (this.#silentOpen) return;
    this.onOpenChange?.(open);
    this.dispatchEvent(
      new CustomEvent("openchange", { detail: open, bubbles: true, composed: true })
    );
  }
  /** The `open` and `disabled` attributes, applied to the rendered button and popup. */
  #syncOpenAttributes(name) {
    if (this.#selectEl && name === "disabled") this.#selectEl.disabled = this.disabled;
    if (!this.#buttonEl) return;
    if (name === "disabled") {
      this.#buttonEl.disabled = this.disabled;
      if (this.disabled && this.#open) this.open = false;
      return;
    }
    this.open = this.hasAttribute("open");
  }
  /** After a render: carry `disabled` onto the button and honour an initial `open` attribute (not reported as a change). */
  #applyInitialOpen() {
    if (this.#buttonEl) this.#buttonEl.disabled = this.disabled;
    if (!this.hasAttribute("open") || this.disabled || this.#open) return;
    this.#silentOpen = true;
    try {
      this.open = true;
    } finally {
      this.#silentOpen = false;
    }
  }
  /** id of the rendered `<ul role="listbox">`. */
  get listId() {
    return `${this.#baseId}-list`;
  }
  /** id of the rendered option at `index`. */
  optionId(index) {
    return `${this.#baseId}-option-${index}`;
  }
  // ---- Public, overridable rendering hook ----
  /**
   * Build the content of the button. The default is a bundled SVG icon
   * (contrast/half-circle) wrapped in `aria-hidden="true"` so the
   * accessible name comes from the button's `aria-label` alone.
   *
   * This is the HTML-helper equivalent of the Svelte/React/Vue
   * `children` snippet: it replaces the icon inside the button, and
   * has `this.value`, `this.open`, and `this.labelFor(...)` available.
   * Subclasses may override it. Whatever it returns is placed inside
   * the button; the button's own aria wiring is not the subclass's to
   * change. See `docs/custom-rendering.md`.
   */
  renderButtonContent() {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "theme-picker-icon");
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
    circle.setAttribute("cx", "8");
    circle.setAttribute("cy", "8");
    circle.setAttribute("r", "6");
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", "M8 2a6 6 0 0 1 0 12z");
    path.setAttribute("fill", "currentColor");
    path.setAttribute("stroke", "none");
    svg.append(circle, path);
    return svg;
  }
  /** Resolve a slug to its display label. Public for subclasses. */
  labelFor(theme) {
    if (theme === SYSTEM_THEME && this.systemLabel) return this.systemLabel;
    if (theme in this.#themeLabels) return this.#themeLabels[theme];
    return themeName(theme);
  }
  // ---- Lifecycle ----
  connectedCallback() {
    const themesAttr = this.getAttribute("themes");
    if (themesAttr !== null && this.#themes.length === 0) {
      this.#themes = parseCsv(themesAttr);
    }
    const labelsAttr = this.getAttribute("theme-labels");
    if (labelsAttr !== null && Object.keys(this.#themeLabels).length === 0) {
      this.#themeLabels = parseJsonObject(labelsAttr);
    }
    this.#language = pageLanguage();
    this.#languageObserver = new MutationObserver(() => {
      this.#language = pageLanguage();
      this.#render();
    });
    this.#languageObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"]
    });
    if (!this.#initialised) {
      this.#initialised = true;
      this.#resolveInitialValue();
    }
    this.#render();
    document.addEventListener("click", this.#onDocumentClick);
    if (this.value) this.#applyChoice(this.value);
  }
  attributeChangedCallback(name, _old, value) {
    if (name === "open" || name === "disabled") {
      this.#syncOpenAttributes(name);
      return;
    }
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
        this.#syncState();
        if (this.isConnected && value) this.#applyChoice(value);
        break;
      case "system-label":
      case "sort-themes":
        this.#render();
        break;
      case "system-themes":
        if (this.isConnected && this.value === SYSTEM_THEME) this.#applyChoice(this.value);
        break;
      case "label":
      case "name":
      case "class":
      case "variant":
        this.#render();
        break;
      // themes-url / default-value / storage-key / extension don't
      // need a re-render; they affect the next apply.
      default:
        break;
    }
  }
  disconnectedCallback() {
    this.#languageObserver?.disconnect();
    this.#languageObserver = null;
    this.#tooltip?.destroy();
    document.removeEventListener("click", this.#onDocumentClick);
    this.#listboxController?.destroy();
    this.#stopWatchingScheme();
    this.#appliedValue = "";
    const sameName = document.querySelectorAll(`theme-picker[name="${this.name}"]`);
    if (sameName.length === 0) {
      const link = document.head.querySelector(`link[data-lily-theme-picker="${this.name}"]`);
      link?.remove();
    }
  }
  // ---- Behaviour ----
  #resolveInitialValue() {
    let initial = this.value;
    if (!initial && this.cookieName) {
      initial = readDocumentThemeCookie(this.cookieName, this.#options);
    }
    if (!initial && this.storageKey) {
      try {
        const stored = localStorage.getItem(this.storageKey) ?? "";
        if (this.#options.includes(stored)) initial = stored;
      } catch {
      }
    }
    if (!initial && this.detectFromSystem) {
      initial = matchSystemTheme(this.#themes);
    }
    if (!initial) {
      initial = this.defaultValue || (this.systemLabel ? SYSTEM_THEME : this.#themes.includes("light") ? "light" : this.#themes[0]) || "";
    }
    this.#keptValue = initial;
    if (initial && initial !== this.value) {
      this.setAttribute("value", initial);
    }
  }
  #getManagedLink() {
    const selector = `link[data-lily-theme-picker="${this.name}"]`;
    let link = document.head.querySelector(selector);
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.setAttribute("data-lily-theme-picker", this.name);
      document.head.appendChild(link);
    }
    return link;
  }
  // The theme the DOM currently carries. Applying is idempotent: a
  // theme already applied is a no-op. `attributeChangedCallback` fires
  // on every `setAttribute("value", …)`, unchanged value included, so
  // without this a consumer whose `themechange` listener mirrors the value
  // back onto the element re-enters apply forever.
  #appliedValue = "";
  // The device's colour scheme while "system" is chosen, and the function that stops watching it.
  #prefersDark = false;
  #stopWatchingScheme = () => {
  };
  /** Apply a choice, follow the device while it is "system", and keep it. */
  #applyChoice(choice) {
    if (typeof document === "undefined" || !choice) return;
    this.#stopWatchingScheme();
    this.#stopWatchingScheme = () => {
    };
    if (choice === SYSTEM_THEME) {
      this.#prefersDark = prefersDarkScheme();
      this.#stopWatchingScheme = watchColorScheme((dark) => {
        this.#prefersDark = dark;
        this.#applyTheme(resolveTheme(SYSTEM_THEME, dark, this.systemThemes), SYSTEM_THEME);
      });
    }
    this.#applyTheme(resolveTheme(choice, this.#prefersDark, this.systemThemes), choice);
    this.#keepChoice(choice);
  }
  // The choice is kept, not the theme it applies: "system" stays "system", so the next visit follows the device
  // again. Kept once per change of choice ("dark" to "system" on a dark device applies nothing new).
  #keptValue = "";
  #keepChoice(choice) {
    if (choice === this.#keptValue) return;
    this.#keptValue = choice;
    if (this.storageKey) {
      try {
        localStorage.setItem(this.storageKey, choice);
      } catch {
      }
    }
    if (this.cookieName) writeDocumentThemeCookie(this.cookieName, choice);
  }
  #applyTheme(slug, choice) {
    if (typeof document === "undefined" || !slug) return;
    if (slug === this.#appliedValue) return;
    const first = this.#appliedValue === "";
    this.#appliedValue = slug;
    const link = this.#getManagedLink();
    withViewTransition(this.viewTransition && !first, async () => {
      link.href = themeHref(this.themesUrl, slug, this.extension);
      if (this.themeColor) applyThemeColorWhenLoaded(link);
      (this.#target ?? document.documentElement).setAttribute("data-theme", slug);
      if (this.viewTransition) await linkSettled(link);
    });
    this.dispatchEvent(
      new CustomEvent("themechange", {
        detail: { theme: slug, choice },
        bubbles: true,
        composed: true
      })
    );
  }
  // ---- Open / close ----
  /** Open the listbox. `startIndex` overrides the active option. */
  openList(startIndex) {
    if (this.disabled || !this.#listEl) return;
    const selected = this.#options.indexOf(this.value);
    this.#activeIndex = this.#options.length === 0 ? -1 : startIndex ?? (selected >= 0 ? selected : 0);
    this.#listboxController?.setActiveIndex(this.#activeIndex);
    this.#open = true;
    this.#emitOpenChange(true);
    this.#syncState();
    if (!this.#quietOpen) this.#listEl?.focus({ preventScroll: true });
    this.#scrollActiveIntoView();
  }
  /** Close the listbox. Returns focus to the button unless `refocus` is false. */
  closeList(refocus = true) {
    if (!this.#open) return;
    this.#open = false;
    this.#emitOpenChange(false);
    this.#activeIndex = -1;
    this.#listboxController?.setActiveIndex(-1);
    this.#syncState();
    if (refocus) this.#buttonEl?.focus({ preventScroll: true });
  }
  #choose(index) {
    const slug = this.#options[index];
    if (slug) this.value = slug;
    this.closeList();
  }
  #scrollActiveIntoView() {
    if (this.#activeIndex < 0) return;
    this.#optionEls[this.#activeIndex]?.scrollIntoView?.({ block: "nearest" });
  }
  #onButtonKeydown = (event) => {
    switch (event.key) {
      case "ArrowDown":
      case "Enter":
      case " ":
        event.preventDefault();
        this.openList();
        break;
      case "ArrowUp":
        event.preventDefault();
        this.openList(this.#options.length - 1);
        break;
    }
  };
  #onRootFocusOut = (event) => {
    const next = event.relatedTarget;
    if (next && this.#rootEl?.contains(next)) return;
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
  #syncState() {
    if (!this.#rootEl) return;
    this.#tooltip?.update();
    const value = this.value;
    if (this.#selectEl && this.#selectEl.value !== value) this.#selectEl.value = value;
    if (this.#inputEl) this.#inputEl.value = value;
    if (this.#buttonEl) {
      this.#buttonEl.setAttribute("aria-expanded", String(this.#open));
      this.#buttonEl.replaceChildren(this.renderButtonContent());
    }
    if (this.#listEl) {
      if (this.#open) this.#listEl.removeAttribute("hidden");
      else this.#listEl.setAttribute("hidden", "");
      if (this.#open && this.#activeIndex >= 0) {
        this.#listEl.setAttribute(
          "aria-activedescendant",
          this.optionId(this.#activeIndex)
        );
      } else {
        this.#listEl.removeAttribute("aria-activedescendant");
      }
    }
    const options = this.#options;
    this.#optionEls.forEach((option, i) => {
      option.setAttribute("aria-selected", String(options[i] === value));
      if (i === this.#activeIndex) option.setAttribute("data-active", "");
      else option.removeAttribute("data-active");
    });
  }
  #render() {
    if (!this.isConnected) return;
    this.#open = false;
    this.#activeIndex = -1;
    this.#listboxController?.destroy();
    const extraClass = this.getAttribute("class") ?? "";
    const root = document.createElement("div");
    root.className = `theme-picker ${extraClass}`.trim();
    if (this.variant === "select") {
      this.#renderSelect(root);
      return;
    }
    this.#selectEl = null;
    root.addEventListener("focusout", this.#onRootFocusOut);
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = this.name;
    input.value = this.value;
    root.appendChild(input);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-picker-button";
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
    this.#tooltip?.destroy();
    const tooltip = createTooltip(
      button,
      "theme-picker-tooltip",
      `${this.#baseId}-tooltip`,
      () => this.label,
      () => this.#open
    );
    root.appendChild(tooltip.el);
    this.#tooltip = tooltip;
    const list = document.createElement("ul");
    list.className = "theme-picker-list";
    list.id = this.listId;
    list.setAttribute("role", "listbox");
    list.setAttribute("aria-label", this.label);
    list.setAttribute("tabindex", "-1");
    list.setAttribute("hidden", "");
    this.#listboxController = new ListboxController({
      root: list,
      clamp: true,
      typeahead: true,
      pageSize: 10,
      // Each <li>'s textContent is already labelFor(theme) — set below —
      // so reading it back needs no index lookup.
      getOptionLabel: (option) => option.textContent ?? "",
      onActiveIndexChange: (index) => {
        this.#activeIndex = index;
        this.#syncState();
        this.#scrollActiveIntoView();
      },
      onActivate: (index) => this.#choose(index),
      onEscape: () => this.closeList(),
      onTabOut: () => {
        this.#buttonEl?.focus?.({ preventScroll: true });
        this.closeList(false);
      }
    });
    const optionEls = [];
    this.#options.forEach((theme, i) => {
      const option = document.createElement("li");
      option.className = optionClass(theme);
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
    this.#applyInitialOpen();
  }
  /**
   * variant="select": the platform's own select. Keyboard, typeahead, the mobile picker and the screen-reader
   * announcement are the browser's; the element only applies the chosen theme (a change sets `value`, whose
   * attribute change runs the existing apply path). `selected` on each option keeps the markup correct before the
   * first change.
   */
  #renderSelect(root) {
    this.#tooltip?.destroy();
    this.#tooltip = null;
    root.setAttribute("data-variant", "select");
    const select = document.createElement("select");
    select.className = "theme-picker-select";
    select.name = this.name;
    select.setAttribute("aria-label", this.label);
    select.disabled = this.disabled;
    for (const theme of this.#options) {
      const option = document.createElement("option");
      option.className = optionClass(theme);
      option.value = theme;
      option.selected = theme === this.value;
      if (option.selected) option.setAttribute("selected", "");
      option.textContent = this.labelFor(theme);
      select.appendChild(option);
      if (theme === SYSTEM_THEME) {
        const hr = document.createElement("hr");
        hr.className = "theme-picker-separator";
        select.appendChild(hr);
      }
    }
    select.addEventListener("change", () => {
      this.value = select.value;
    });
    root.appendChild(select);
    this.#rootEl = root;
    this.#selectEl = select;
    this.#inputEl = null;
    this.#buttonEl = null;
    this.#listEl = null;
    this.#optionEls = [];
    this.replaceChildren(root);
  }
};
function optionClass(theme) {
  return theme === SYSTEM_THEME ? "theme-picker-option theme-picker-option-system" : "theme-picker-option";
}
function parseCsv(s) {
  return s.split(",").map((p) => p.trim()).filter((p) => p.length > 0);
}
function parseJsonObject(s) {
  try {
    const v = JSON.parse(s);
    if (v && typeof v === "object" && !Array.isArray(v)) {
      return v;
    }
  } catch {
  }
  return {};
}
function createTooltip(button, className, id, getLabel, isOpen) {
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
  const onDocumentKeydown = (event) => {
    if (event.key === "Escape") {
      dismissed = true;
      update();
    }
  };
  const destroy = () => {
    if (listening) {
      document.removeEventListener("keydown", onDocumentKeydown);
      listening = false;
    }
  };
  const update = () => {
    const label = getLabel();
    if (el.textContent !== label) el.textContent = label;
    const visible = !isOpen() && !dismissed && (hoverButton || hoverTooltip || focusButton);
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
    try {
      focusButton = button.matches(":focus-visible");
    } catch {
      focusButton = true;
    }
    update();
  });
  button.addEventListener("blur", () => {
    focusButton = false;
    dismissed = false;
    update();
  });
  button.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !el.hasAttribute("hidden")) {
      dismissed = true;
      update();
    }
  });
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

// index.ts
if (typeof customElements !== "undefined" && !customElements.get("theme-picker")) {
  customElements.define("theme-picker", ThemePicker);
}
export {
  DEFAULT_SYSTEM_THEMES,
  SYSTEM_THEME,
  THEME_COOKIE_MAX_AGE,
  ThemePicker,
  matchSystemTheme,
  nextThemePickerId,
  normalizeThemesUrl,
  prefersDarkScheme,
  readDocumentThemeCookie,
  readThemeCookie,
  resolveTheme,
  themeChoices,
  themeCookie,
  themeHref,
  themeName,
  watchColorScheme,
  writeDocumentThemeCookie
};
