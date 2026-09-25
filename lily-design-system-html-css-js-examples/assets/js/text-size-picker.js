// lily-design-system-html-text-size-picker/text-size-picker.ts
import { ListboxController } from "@lilydesignsystem/html-headless/components/listbox-controller.js";
var SVG_NS = "http://www.w3.org/2000/svg";
function sizeName(size) {
  return size.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
var uid = 0;
function nextTextSizePickerId() {
  uid += 1;
  return `text-size-picker-${uid}`;
}
var TextSizePicker = class extends HTMLElement {
  static get observedAttributes() {
    return [
      "label",
      "sizes",
      "value",
      "default-value",
      "storage-key",
      "name",
      "size-labels",
      "class"
    ];
  }
  // Backing storage for properties.
  #sizes = [];
  #sizeLabels = {};
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
  #baseId = nextTextSizePickerId();
  // Arrow/Home/End/typeahead/PageUp/PageDown/Escape/Tab keyboard handling
  // inside the open list is owned by the shared ListboxController (see
  // @lilydesignsystem/html-headless/components/listbox-controller.js);
  // this element only decides what open/close/choose mean.
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
  get sizes() {
    return [...this.#sizes];
  }
  set sizes(v) {
    this.#sizes = Array.isArray(v) ? v.slice() : [];
    const csv = this.#sizes.join(",");
    if (this.getAttribute("sizes") !== csv) {
      this.setAttribute("sizes", csv);
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
  get name() {
    return this.getAttribute("name") ?? "text-size";
  }
  set name(v) {
    if (v) this.setAttribute("name", v);
    else this.removeAttribute("name");
  }
  get sizeLabels() {
    return { ...this.#sizeLabels };
  }
  set sizeLabels(v) {
    this.#sizeLabels = v && typeof v === "object" ? { ...v } : {};
    const json = JSON.stringify(this.#sizeLabels);
    if (this.getAttribute("size-labels") !== json) {
      this.setAttribute("size-labels", json);
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
   * Build the content of the button. The default is a bundled
   * SVG icon (a stroke-drawn "A")
   * wrapped in `aria-hidden="true"` so the accessible name comes from
   * the button's `aria-label` alone.
   *
   * This is the HTML-helper equivalent of the Svelte/React/Vue
   * `children` snippet: it replaces the glyph inside the button, and
   * has `this.value`, `this.open`, and `this.labelFor(...)` available.
   * Subclasses may override it. Whatever it returns is placed inside
   * the button; the button's own aria wiring is not the subclass's to
   * change.
   */
  renderButtonContent() {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "text-size-picker-icon");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("width", "1.05rem");
    svg.setAttribute("height", "1.05rem");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.6");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", "M4 13 7.2 3h1.6L12 13M5.4 9.5h5.2");
    svg.appendChild(path);
    return svg;
  }
  /** Resolve a slug to its display label. Public for subclasses. */
  labelFor(size) {
    if (size in this.#sizeLabels) return this.#sizeLabels[size];
    return sizeName(size);
  }
  // ---- Lifecycle ----
  connectedCallback() {
    const sizesAttr = this.getAttribute("sizes");
    if (sizesAttr !== null && this.#sizes.length === 0) {
      this.#sizes = parseCsv(sizesAttr);
    }
    const labelsAttr = this.getAttribute("size-labels");
    if (labelsAttr !== null && Object.keys(this.#sizeLabels).length === 0) {
      this.#sizeLabels = parseJsonObject(labelsAttr);
    }
    if (!this.#initialised) {
      this.#initialised = true;
      this.#resolveInitialValue();
    }
    this.#render();
    document.addEventListener("click", this.#onDocumentClick);
    if (this.value) this.#applySize(this.value);
  }
  attributeChangedCallback(name, _old, value) {
    switch (name) {
      case "sizes":
        this.#sizes = value === null ? [] : parseCsv(value);
        this.#render();
        break;
      case "size-labels":
        this.#sizeLabels = value === null ? {} : parseJsonObject(value);
        this.#render();
        break;
      case "value":
        this.#syncState();
        if (this.isConnected && value) this.#applySize(value);
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
  disconnectedCallback() {
    document.removeEventListener("click", this.#onDocumentClick);
    this.#listboxController?.destroy();
    this.#appliedValue = "";
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
    if (!initial) {
      initial = this.defaultValue || (this.#sizes.includes("medium") ? "medium" : this.#sizes[0]) || "";
    }
    if (initial && initial !== this.value) {
      this.setAttribute("value", initial);
    }
  }
  // The size the DOM currently carries. Applying is idempotent: a
  // size already applied is a no-op. `attributeChangedCallback` fires
  // on every `setAttribute("value", …)`, unchanged value included, so
  // without this a consumer whose `textsizechange` listener mirrors the value
  // back onto the element re-enters apply forever.
  #appliedValue = "";
  #applySize(slug) {
    if (typeof document === "undefined" || !slug) return;
    if (slug === this.#appliedValue) return;
    this.#appliedValue = slug;
    (this.#target ?? document.documentElement).setAttribute("data-text-size", slug);
    if (this.storageKey) {
      try {
        localStorage.setItem(this.storageKey, slug);
      } catch {
      }
    }
    this.dispatchEvent(
      new CustomEvent("textsizechange", {
        detail: { size: slug },
        bubbles: true,
        composed: true
      })
    );
  }
  // ---- Open / close ----
  /** Open the listbox. `startIndex` overrides the active option. */
  openList(startIndex) {
    const selected = this.#sizes.indexOf(this.value);
    this.#activeIndex = this.#sizes.length === 0 ? -1 : startIndex ?? (selected >= 0 ? selected : 0);
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
    const slug = this.#sizes[index];
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
        this.openList(this.#sizes.length - 1);
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
      option.setAttribute("aria-selected", String(this.#sizes[i] === value));
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
    root.className = `text-size-picker ${extraClass}`.trim();
    root.addEventListener("focusout", this.#onRootFocusOut);
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = this.name;
    input.value = this.value;
    root.appendChild(input);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "text-size-picker-button";
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
    list.className = "text-size-picker-list";
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
      // Each <li>'s textContent is already labelFor(size) — set
      // below — so reading it back needs no index lookup.
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
    this.#sizes.forEach((size, i) => {
      const option = document.createElement("li");
      option.className = "text-size-picker-option";
      option.id = this.optionId(i);
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", String(size === this.value));
      option.textContent = this.labelFor(size);
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

// lily-design-system-html-text-size-picker/index.ts
if (typeof customElements !== "undefined" && !customElements.get("text-size-picker")) {
  customElements.define("text-size-picker", TextSizePicker);
}
export {
  TextSizePicker,
  nextTextSizePickerId,
  sizeName
};
