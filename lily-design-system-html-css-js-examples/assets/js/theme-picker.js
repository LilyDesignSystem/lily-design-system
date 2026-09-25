// lily-design-system-html-theme-picker/theme-picker.ts
import { ListboxController } from "@lilydesignsystem/html-headless/components/listbox-controller.js";
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
      "name",
      "extension",
      "theme-labels",
      "class"
    ];
  }
  // Backing storage for properties.
  #themes = [];
  #themeLabels = {};
  #target = null;
  #initialised = false;
  // Rendered-DOM references. Null until #render() has run.
  #rootEl = null;
  #inputEl = null;
  #buttonEl = null;
  #listEl = null;
  #optionEls = [];
  // Listbox state.
  #open = false;
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
  get storageKey() {
    return this.getAttribute("storage-key") ?? "";
  }
  set storageKey(v) {
    if (v) this.setAttribute("storage-key", v);
    else this.removeAttribute("storage-key");
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
  /** Is the listbox open? Read-only; use `openList()` / `closeList()`. */
  get open() {
    return this.#open;
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
    if (!this.#initialised) {
      this.#initialised = true;
      this.#resolveInitialValue();
    }
    this.#render();
    document.addEventListener("click", this.#onDocumentClick);
    if (this.value) this.#applyTheme(this.value);
  }
  attributeChangedCallback(name, _old, value) {
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
  disconnectedCallback() {
    document.removeEventListener("click", this.#onDocumentClick);
    this.#listboxController?.destroy();
    this.#appliedValue = "";
    const sameName = document.querySelectorAll(
      `theme-picker[name="${this.name}"]`
    );
    if (sameName.length === 0) {
      const link = document.head.querySelector(
        `link[data-lily-theme-picker="${this.name}"]`
      );
      link?.remove();
    }
  }
  // ---- Behaviour ----
  #resolveInitialValue() {
    let initial = this.value;
    if (!initial && this.storageKey) {
      try {
        initial = localStorage.getItem(this.storageKey) ?? "";
      } catch {
      }
    }
    if (!initial && this.detectFromSystem) {
      initial = matchSystemTheme(this.#themes);
    }
    if (!initial) {
      initial = this.defaultValue || (this.#themes.includes("light") ? "light" : this.#themes[0]) || "";
    }
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
  #applyTheme(slug) {
    if (typeof document === "undefined" || !slug) return;
    if (slug === this.#appliedValue) return;
    this.#appliedValue = slug;
    this.#getManagedLink().href = themeHref(
      this.themesUrl,
      slug,
      this.extension
    );
    (this.#target ?? document.documentElement).setAttribute("data-theme", slug);
    if (this.storageKey) {
      try {
        localStorage.setItem(this.storageKey, slug);
      } catch {
      }
    }
    this.dispatchEvent(
      new CustomEvent("themechange", {
        detail: { theme: slug },
        bubbles: true,
        composed: true
      })
    );
  }
  // ---- Open / close ----
  /** Open the listbox. `startIndex` overrides the active option. */
  openList(startIndex) {
    const selected = this.#themes.indexOf(this.value);
    this.#activeIndex = this.#themes.length === 0 ? -1 : startIndex ?? (selected >= 0 ? selected : 0);
    this.#listboxController?.setActiveIndex(this.#activeIndex);
    this.#open = true;
    this.#syncState();
    this.#listEl?.focus({ preventScroll: true });
    this.#scrollActiveIntoView();
  }
  /** Close the listbox. Returns focus to the button unless `refocus` is false. */
  closeList(refocus = true) {
    if (!this.#open) return;
    this.#open = false;
    this.#activeIndex = -1;
    this.#listboxController?.setActiveIndex(-1);
    this.#syncState();
    if (refocus) this.#buttonEl?.focus({ preventScroll: true });
  }
  #choose(index) {
    const slug = this.#themes[index];
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
        this.openList(this.#themes.length - 1);
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
    const value = this.value;
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
    this.#optionEls.forEach((option, i) => {
      option.setAttribute("aria-selected", String(this.#themes[i] === value));
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
    this.#themes.forEach((theme, i) => {
      const option = document.createElement("li");
      option.className = "theme-picker-option";
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
};
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

// lily-design-system-html-theme-picker/index.ts
if (typeof customElements !== "undefined" && !customElements.get("theme-picker")) {
  customElements.define("theme-picker", ThemePicker);
}
export {
  ThemePicker,
  matchSystemTheme,
  nextThemePickerId,
  normalizeThemesUrl,
  themeHref,
  themeName
};
