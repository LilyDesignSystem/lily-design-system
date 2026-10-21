// Lily Design System — Alpine.js headless plugin.
//
// Registers the Alpine.data() behaviours the component snippets in
// components/*.html use. The snippets own the markup, ARIA and class
// hooks; this plugin owns state and keyboard handling only. It ships no
// CSS, no text and no icons. Every behaviour exposes its bindings as
// x-bind objects so a consumer can reuse them on their own elements.
//
//   import Alpine from "alpinejs";
//   import lily from "@lilydesignsystem/alpine-headless/plugin";
//   Alpine.plugin(lily);
//   Alpine.start();

/** What focus may land on when an overlay opens. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Roving-focus keys shared by every composite widget (APG). */
function rovingIndex(key, index, count) {
  if (key === "ArrowRight" || key === "ArrowDown") return (index + 1) % count;
  if (key === "ArrowLeft" || key === "ArrowUp") return (index - 1 + count) % count;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return -1;
}

/** Focus-move for menu-like widgets: returns the item to focus, or null. */
function menuTarget(key, items, from, horizontal) {
  const next = horizontal ? "ArrowRight" : "ArrowDown";
  const prev = horizontal ? "ArrowLeft" : "ArrowUp";
  if (!items.length) return null;
  if (key === next) return items[(from + 1) % items.length];
  if (key === prev) return items[(from - 1 + items.length) % items.length];
  if (key === "Home") return items[0];
  if (key === "End") return items[items.length - 1];
  return null;
}

const MENU_ITEMS = '[role="menuitem"]:not([disabled])';

/**
 * Shared APG tree-view behaviour for lilyTree, lilyTreeSelect and lilyCascader.
 * Items are role="treeitem" carrying data-item; a branch has aria-expanded and
 * owns a role="group". Visibility is read from the ancestors' aria-expanded.
 */
function treeCore({ wrap = false, exclusive = false, expanded = [] } = {}) {
  let buffer = "";
  let timer;
  const parentOf = (item) => item.parentElement?.closest('[role="treeitem"]') ?? null;
  const ownText = (item) =>
    Array.from(item.childNodes)
      .filter((n) => n.nodeType !== 8 && !(n.nodeType === 1 && n.getAttribute("role") === "group"))
      .map((n) => n.textContent || "")
      .join("")
      .trim()
      .toLowerCase();
  return {
    expanded: [...expanded],
    selected: [],
    current: "",
    allItems() { return Array.from(this.$root.querySelectorAll('[role="treeitem"]')); },
    visibleItems() {
      return this.allItems().filter((item) => {
        for (let p = parentOf(item); p; p = parentOf(p)) {
          if (p.getAttribute("aria-expanded") === "false") return false;
        }
        return true;
      });
    },
    itemFor(id) { return this.allItems().find((i) => i.dataset.item === id); },
    pathOf(id) {
      const path = [];
      for (let item = this.itemFor(id); item; item = parentOf(item)) path.unshift(item.dataset.item);
      return path;
    },
    focusItem(item) {
      if (!item) return;
      this.current = item.dataset.item;
      item.focus();
    },
    toggle(id) {
      if (this.expanded.includes(id)) {
        this.expanded = this.expanded.filter((e) => e !== id);
        return;
      }
      let next = [...this.expanded, id];
      if (exclusive) {
        const item = this.itemFor(id);
        const siblings = this.allItems().filter((i) => i !== item && parentOf(i) === parentOf(item));
        next = next.filter((e) => !siblings.some((s) => s.dataset.item === e));
      }
      this.expanded = next;
    },
    choose(id) {
      this.selected = [id];
      this.$dispatch("lily:select", { selected: id, path: this.pathOf(id) });
    },
    activate(id, branch) { if (branch) this.toggle(id); else this.choose(id); },
    treeKey(event) {
      const target = event.target;
      const item = target.closest('[role="treeitem"]');
      if (!item || !this.$root.contains(item)) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const visible = this.visibleItems();
      const index = visible.indexOf(item);
      const expandedState = item.getAttribute("aria-expanded");
      const go = (to) => { event.preventDefault(); this.focusItem(to); };
      switch (event.key) {
        case "ArrowDown": return go(visible[wrap ? (index + 1) % visible.length : Math.min(index + 1, visible.length - 1)]);
        case "ArrowUp": return go(visible[wrap ? (index - 1 + visible.length) % visible.length : Math.max(index - 1, 0)]);
        case "Home": return go(visible[0]);
        case "End": return go(visible[visible.length - 1]);
        case "ArrowRight":
          if (target !== item) return;
          event.preventDefault();
          if (expandedState === "false") this.toggle(item.dataset.item);
          else if (expandedState === "true") this.focusItem(item.querySelector('[role="group"] [role="treeitem"]'));
          return;
        case "ArrowLeft":
          if (target !== item) return;
          event.preventDefault();
          if (expandedState === "true") this.toggle(item.dataset.item);
          else this.focusItem(parentOf(item));
          return;
        case "Enter":
        case " ":
          if (target !== item) return;
          event.preventDefault();
          this.activate(item.dataset.item, expandedState !== null);
          return;
        case "*":
          event.preventDefault();
          this.allItems()
            .filter((i) => parentOf(i) === parentOf(item) && i.getAttribute("aria-expanded") === "false")
            .forEach((i) => this.toggle(i.dataset.item));
          return;
      }
      if (event.key.length !== 1) return;
      event.preventDefault();
      buffer += event.key.toLowerCase();
      clearTimeout(timer);
      timer = setTimeout(() => { buffer = ""; }, 500);
      const cycle = buffer.length === 1 || [...buffer].every((c) => c === buffer[0]);
      const needle = cycle ? buffer[0] : buffer;
      const cut = index + (cycle ? 1 : 0);
      const ordered = visible.slice(cut).concat(visible.slice(0, cut));
      this.focusItem(ordered.find((i) => ownText(i).startsWith(needle)));
    },
    tree: {
      "@keydown"(event) { this.treeKey(event); },
    },
    group(id) {
      return { role: "group", ":hidden"() { return !this.expanded.includes(id); } };
    },
    item(id, branch = false) {
      return {
        role: "treeitem",
        "data-item": id,
        ":tabindex"() { return (this.current || this.selected[0] || this.allItems()[0]?.dataset.item) === id ? "0" : "-1"; },
        ":aria-selected"() { return String(this.selected.includes(id)); },
        ...(branch ? { ":aria-expanded"() { return String(this.expanded.includes(id)); } } : {}),
        "@focus"() { this.current = id; },
        "@click"(event) {
          if (event.target.closest('[role="treeitem"]') === this.$el) this.activate(id, branch);
        },
      };
    },
  };
}

export default function lily(Alpine) {
  // ToggleButton: <button aria-pressed>
  Alpine.data("lilyToggleButton", (pressed = false) => ({
    pressed,
    button: {
      type: "button",
      ":aria-pressed"() { return String(this.pressed); },
      "@click"() { this.pressed = !this.pressed; },
    },
  }));

  // SwitchButton: <button role="switch" aria-checked>
  Alpine.data("lilySwitchButton", (checked = false) => ({
    checked,
    button: {
      type: "button",
      role: "switch",
      ":aria-checked"() { return String(this.checked); },
      "@click"() { this.checked = !this.checked; },
    },
  }));

  // Collapsible: a trigger button controlling one content region.
  Alpine.data("lilyCollapsible", (expanded = false) => ({
    expanded,
    root: { ":data-expanded"() { return String(this.expanded); } },
    trigger: {
      type: "button",
      ":aria-expanded"() { return String(this.expanded); },
      "@click"() { this.expanded = !this.expanded; },
    },
    content: { ":hidden"() { return !this.expanded; } },
  }));

  // ShowMore: like Collapsible; the labels are the consumer's.
  Alpine.data("lilyShowMore", (expanded = false) => ({
    expanded,
    root: { ":data-expanded"() { return String(this.expanded); } },
    button: {
      type: "button",
      ":aria-expanded"() { return String(this.expanded); },
      "@click"() { this.expanded = !this.expanded; },
    },
    content: { ":data-expanded"() { return String(this.expanded); } },
  }));

  // Popover: non-modal, closes on Escape and on an outside click.
  Alpine.data("lilyPopover", (open = false) => ({
    open,
    root: {
      ":data-open"() { return String(this.open); },
      "@keydown.escape"() {
        if (this.open) { this.open = false; this.$refs.trigger?.focus(); }
      },
      // Not `.outside`: Alpine skips elements with no layout box, so it
      // would never fire in a layout-less test DOM.
      "@click.document"(event) {
        if (this.open && !this.$el.contains(event.target)) this.open = false;
      },
    },
    trigger: {
      type: "button",
      "x-ref": "trigger",
      "aria-haspopup": "dialog",
      ":aria-expanded"() { return String(this.open); },
      "@click"() { this.open = !this.open; },
    },
    panel: { ":hidden"() { return !this.open; } },
  }));

  // Tooltip: shows on hover and keyboard focus, Escape dismisses (WCAG 1.4.13).
  Alpine.data("lilyTooltip", () => ({
    visible: false,
    trigger: {
      "@mouseenter"() { this.visible = true; },
      "@mouseleave"() { this.visible = false; },
      "@focus"() { this.visible = true; },
      "@blur"() { this.visible = false; },
      "@keydown.escape"() { this.visible = false; },
    },
    tooltip: {
      role: "tooltip",
      ":aria-hidden"() { return String(!this.visible); },
      ":hidden"() { return !this.visible; },
      "@mouseenter"() { this.visible = true; },
      "@mouseleave"() { this.visible = false; },
    },
  }));

  // ClipboardCopyButton: the text to copy is the consumer's.
  Alpine.data("lilyClipboardCopy", (text = "") => ({
    copied: false,
    async copy() {
      if (!globalThis.navigator?.clipboard) return;
      await navigator.clipboard.writeText(text);
      this.copied = true;
    },
    button: {
      type: "button",
      ":data-copied"() { return String(this.copied); },
      "@click"() { return this.copy(); },
    },
  }));

  // ToggleGroup: independent toggle buttons in one role="group".
  Alpine.data("lilyToggleGroup", (pressed = []) => ({
    pressed: [...pressed],
    isPressed(id) { return this.pressed.includes(id); },
    toggleItem(id) {
      this.pressed = this.isPressed(id)
        ? this.pressed.filter((p) => p !== id)
        : [...this.pressed, id];
    },
    item(id) {
      return {
        type: "button",
        ":aria-pressed"() { return String(this.isPressed(id)); },
        "@click"() { this.toggleItem(id); },
      };
    },
  }));

  // Tabs: TabBar + TabBarButton + TabPanel with automatic activation,
  // roving tabindex and Arrow / Home / End keys (APG tabs pattern).
  Alpine.data("lilyTabs", (selected = "") => ({
    selected,
    tabIds() {
      return Array.from(this.$el.querySelectorAll('[role="tab"]')).map((t) => t.dataset.tab);
    },
    tablist: {
      "@keydown"(event) {
        const tabs = Array.from(this.$el.querySelectorAll('[role="tab"]'));
        const index = tabs.indexOf(document.activeElement);
        if (index < 0) return;
        const next = rovingIndex(event.key, index, tabs.length);
        if (next < 0) return;
        event.preventDefault();
        tabs[next].focus();
        this.selected = tabs[next].dataset.tab;
      },
    },
    tab(id) {
      return {
        role: "tab",
        type: "button",
        "data-tab": id,
        ":id"() { return `${id}-tab`; },
        ":aria-controls"() { return `${id}-panel`; },
        ":aria-selected"() { return String(this.selected === id); },
        ":tabindex"() { return this.selected === id ? "0" : "-1"; },
        "@click"() { this.selected = id; },
      };
    },
    panel(id) {
      return {
        role: "tabpanel",
        tabindex: "0",
        ":id"() { return `${id}-panel`; },
        ":aria-labelledby"() { return `${id}-tab`; },
        ":data-selected"() { return String(this.selected === id); },
        ":hidden"() { return this.selected !== id; },
      };
    },
  }));

  // Dialog: native <dialog>; showModal() where the browser has it.
  Alpine.data("lilyDialog", (open = false) => ({
    open,
    init() {
      this.$watch("open", (value) => this.sync(value));
      if (open) this.$nextTick(() => this.sync(true));
    },
    sync(value) {
      const dialog = this.$refs.dialog;
      if (!dialog) return;
      if (value && !dialog.open) {
        typeof dialog.showModal === "function" ? dialog.showModal() : dialog.setAttribute("open", "");
      } else if (!value && dialog.open) {
        typeof dialog.close === "function" ? dialog.close() : dialog.removeAttribute("open");
      }
    },
    trigger: {
      type: "button",
      "aria-haspopup": "dialog",
      "@click"() { this.open = true; },
    },
    dialog: {
      "x-ref": "dialog",
      "aria-modal": "true",
      "@close"() { this.open = false; },
      "@cancel"() { this.open = false; },
      "@keydown.escape"() { this.open = false; },
    },
    closer: {
      type: "button",
      "@click"() { this.open = false; },
    },
  }));
  // Dismissible: a banner the user can close. Hides with `hidden` (never an
  // inline style) and emits a bubbling `close` event.
  Alpine.data("lilyDismissible", (open = true) => ({
    open,
    root: { ":hidden"() { return !this.open; } },
    dismiss: {
      type: "button",
      "@click"() { this.open = false; this.$dispatch("close"); },
    },
  }));

  // Accordion: trigger / region pairs by id; one open at a time unless `multiple`.
  Alpine.data("lilyAccordion", (multiple = false, open = []) => ({
    open: [...open],
    isOpen(id) { return this.open.includes(id); },
    toggle(id) {
      if (this.isOpen(id)) this.open = this.open.filter((o) => o !== id);
      else this.open = multiple ? [...this.open, id] : [id];
    },
    trigger(id) {
      return {
        type: "button",
        ":id"() { return `${id}-trigger`; },
        ":aria-controls"() { return `${id}-panel`; },
        ":aria-expanded"() { return String(this.isOpen(id)); },
        "@click"() { this.toggle(id); },
      };
    },
    panel(id) {
      return {
        role: "region",
        ":id"() { return `${id}-panel`; },
        ":aria-labelledby"() { return `${id}-trigger`; },
        ":hidden"() { return !this.isOpen(id); },
      };
    },
  }));

  // CheckboxAccordion: a real checkbox is the disclosure control.
  Alpine.data("lilyCheckboxAccordion", (checked = false) => ({
    checked,
    input: {
      ":checked"() { return this.checked; },
      ":aria-expanded"() { return String(this.checked); },
      "@change"() { this.checked = this.$el.checked; },
    },
    panel: { ":hidden"() { return !this.checked; } },
  }));

  // HoverCard: opens on hover or focus within, stays open while the pointer
  // is over the card (it is inside the root), Escape dismisses (WCAG 1.4.13).
  Alpine.data("lilyHoverCard", () => ({
    open: false,
    root: {
      ":data-open"() { return String(this.open); },
      "@mouseenter"() { this.open = true; },
      "@mouseleave"() { this.open = false; },
      "@focusin"() { this.open = true; },
      "@focusout"(event) {
        if (!this.$el.contains(event.relatedTarget)) this.open = false;
      },
      "@keydown.escape"() { this.open = false; },
    },
    card: { ":hidden"() { return !this.open; } },
  }));
  // Overlay: a dialog-role surface (drawer, sheet, slide-out drawer, popup)
  // opened by a trigger. Focus moves in on open and returns to the trigger on
  // close; Escape closes. `container` is the backdrop form (overlay-container).
  Alpine.data("lilyOverlay", (open = false) => ({
    open,
    init() {
      this.$watch("open", (value) => { if (value) this.$nextTick(() => this.focusIn()); });
    },
    focusIn() {
      const surface = this.$refs.surface;
      if (!surface) return;
      const first = surface.querySelector(FOCUSABLE);
      (first || surface).focus();
    },
    close() {
      this.open = false;
      this.$refs.trigger?.focus();
    },
    trigger: {
      type: "button",
      "x-ref": "trigger",
      "aria-haspopup": "dialog",
      ":aria-expanded"() { return String(this.open); },
      "@click"() { this.open = !this.open; },
    },
    surface: {
      "x-ref": "surface",
      ":data-open"() { return String(this.open); },
      ":hidden"() { return !this.open; },
      "@keydown.escape"() { if (this.open) this.close(); },
    },
    closer: {
      type: "button",
      "@click"() { this.close(); },
    },
    container: {
      role: "presentation",
      ":data-open"() { return String(this.open); },
      ":aria-hidden"() { return String(!this.open); },
      ":hidden"() { return !this.open; },
      "@click"(event) { if (event.target === this.$el) this.$dispatch("overlay-close"); },
    },
  }));

  // Confirm: a non-modal alertdialog with confirm and cancel. Emits the
  // bubbling `lily:confirm` / `lily:cancel` events and closes; Escape cancels.
  Alpine.data("lilyConfirm", (open = false) => ({
    open,
    root: {
      ":hidden"() { return !this.open; },
      "@keydown.escape"() { if (this.open) this.cancel(); },
    },
    trigger: {
      type: "button",
      "aria-haspopup": "dialog",
      ":aria-expanded"() { return String(this.open); },
      "@click"() { this.open = !this.open; },
    },
    confirm() { this.open = false; this.$dispatch("lily:confirm"); },
    cancel() { this.open = false; this.$dispatch("lily:cancel"); },
    confirmButton: { type: "button", "@click"() { this.confirm(); } },
    cancelButton: { type: "button", "@click"() { this.cancel(); } },
  }));
  // Menu / MenuBar: an always-visible menu with roving tabindex. Vertical
  // for role="menu", horizontal for role="menubar"; arrows wrap, Home/End jump.
  Alpine.data("lilyMenu", (orientation = "vertical") => ({
    current: "",
    ids() {
      // $root, not $el: this runs while an item evaluates its own :tabindex.
      return Array.from(this.$root.querySelectorAll(MENU_ITEMS)).map((i) => i.dataset.item);
    },
    menu: {
      "@keydown"(event) {
        const items = Array.from(this.$el.querySelectorAll(MENU_ITEMS));
        const target = menuTarget(event.key, items, items.indexOf(document.activeElement), orientation === "horizontal");
        if (!target) return;
        event.preventDefault();
        this.current = target.dataset.item;
        target.focus();
      },
    },
    item(id) {
      return {
        role: "menuitem",
        "data-item": id,
        ":tabindex"() { return (this.current || this.ids()[0]) === id ? "0" : "-1"; },
        "@focus"() { this.current = id; },
      };
    },
  }));

  // DropdownMenu: a trigger opening a role="menu" popup (also the split-button
  // menu and the action-group overflow). Focus moves to the first item on
  // open and back to the trigger on close; Escape and a selection close,
  // Tab and an outside click close without moving focus.
  Alpine.data("lilyDropdownMenu", (open = false) => ({
    open,
    init() {
      this.$watch("open", (value) => {
        if (value) this.$nextTick(() => this.items()[0]?.focus());
      });
    },
    items() {
      return Array.from(this.$refs.menu?.querySelectorAll(MENU_ITEMS) ?? []);
    },
    close(returnFocus = true) {
      this.open = false;
      if (returnFocus) this.$refs.trigger?.focus();
    },
    root: {
      ":data-open"() { return String(this.open); },
      "@click.document"(event) {
        if (this.open && !this.$el.contains(event.target)) this.open = false;
      },
    },
    trigger: {
      type: "button",
      "x-ref": "trigger",
      "aria-haspopup": "menu",
      ":aria-expanded"() { return String(this.open); },
      "@click"() { this.open = !this.open; },
      "@keydown.arrow-down.prevent"() { this.open = true; },
    },
    menu: {
      role: "menu",
      "x-ref": "menu",
      ":hidden"() { return !this.open; },
      "@keydown"(event) {
        if (event.key === "Escape") return this.close();
        if (event.key === "Tab") return this.close(false);
        const items = this.items();
        const target = menuTarget(event.key, items, items.indexOf(document.activeElement), false);
        if (!target) return;
        event.preventDefault();
        target.focus();
      },
    },
    item: {
      role: "menuitem",
      tabindex: "-1",
      "@click"() { this.close(); },
    },
  }));

  // ContextMenu: opens on the right button, or the ContextMenu key / Shift+F10
  // on the focusable target. The pointer position is exposed as the CSS
  // custom properties --context-menu-x / --context-menu-y.
  Alpine.data("lilyContextMenu", () => ({
    open: false,
    x: 0,
    y: 0,
    init() {
      this.$watch("open", (value) => {
        if (value) this.$nextTick(() => this.items()[0]?.focus());
      });
    },
    items() {
      return Array.from(this.$refs.menu?.querySelectorAll(MENU_ITEMS) ?? []);
    },
    close(returnFocus = true) {
      this.open = false;
      if (returnFocus) this.$refs.target?.focus();
    },
    target: {
      "x-ref": "target",
      "@contextmenu.prevent"(event) {
        this.x = event.clientX; this.y = event.clientY; this.open = true;
      },
      "@keydown"(event) {
        if (event.key === "ContextMenu" || (event.key === "F10" && event.shiftKey)) {
          event.preventDefault();
          const box = this.$el.getBoundingClientRect();
          this.x = box.left; this.y = box.bottom; this.open = true;
        }
      },
    },
    menu: {
      role: "menu",
      "x-ref": "menu",
      ":hidden"() { return !this.open; },
      ":style"() { return { "--context-menu-x": `${this.x}px`, "--context-menu-y": `${this.y}px` }; },
      "@click.document"(event) {
        if (this.open && !this.$el.contains(event.target)) this.open = false;
      },
      "@keydown"(event) {
        if (event.key === "Escape") return this.close();
        if (event.key === "Tab") return this.close(false);
        const items = this.items();
        const target = menuTarget(event.key, items, items.indexOf(document.activeElement), false);
        if (!target) return;
        event.preventDefault();
        target.focus();
      },
    },
    item: {
      role: "menuitem",
      tabindex: "-1",
      "@click"() { this.close(); },
    },
  }));

  // Listbox: role="listbox" of role="option" items with roving focus
  // (arrows wrap, Home/End jump) and selection (single or multiple).
  Alpine.data("lilyListbox", (multiple = false, selected = []) => ({
    multiple,
    selected: [].concat(selected).filter((s) => s !== ""),
    current: "",
    ids() {
      // $root, not $el: this runs while an option evaluates its own :tabindex.
      return Array.from(this.$root.querySelectorAll('[role="option"]')).map((o) => o.dataset.option);
    },
    isSelected(id) { return this.selected.includes(id); },
    choose(id) {
      if (!this.multiple) this.selected = [id];
      else this.selected = this.isSelected(id) ? this.selected.filter((s) => s !== id) : [...this.selected, id];
      this.$dispatch("lily:select", { selected: [...this.selected] });
    },
    listbox: {
      role: "listbox",
      ":aria-multiselectable"() { return this.multiple ? "true" : null; },
      "@keydown"(event) {
        const options = Array.from(this.$el.querySelectorAll('[role="option"]'));
        const target = menuTarget(event.key, options, options.indexOf(document.activeElement), false);
        if (!target) return;
        event.preventDefault();
        target.focus();
      },
    },
    option(id) {
      return {
        role: "option",
        "data-option": id,
        ":aria-selected"() { return String(this.isSelected(id)); },
        ":tabindex"() { return (this.current || this.selected[0] || this.ids()[0]) === id ? "0" : "-1"; },
        "@focus"() { this.current = id; },
        "@click"() { this.choose(id); },
        "@keydown.enter.prevent"() { this.choose(id); },
        "@keydown.space.prevent"() { this.choose(id); },
      };
    },
  }));

  // SegmentGroup: a role="radiogroup" of role="radio" buttons. Arrow keys move
  // focus and select (APG radio group); one segment is in the tab order.
  Alpine.data("lilySegmentGroup", (selected = "") => ({
    selected,
    ids() {
      return Array.from(this.$root.querySelectorAll('[role="radio"]')).map((r) => r.dataset.segment);
    },
    group: {
      "@keydown"(event) {
        const items = Array.from(this.$el.querySelectorAll('[role="radio"]'));
        const from = items.indexOf(document.activeElement);
        if (from < 0) return;
        const next = rovingIndex(event.key, from, items.length);
        if (next < 0) return;
        const target = items[next];
        event.preventDefault();
        target.focus();
        this.selected = target.dataset.segment;
        this.$dispatch("lily:select", { selected: this.selected });
      },
    },
    segment(id) {
      return {
        role: "radio",
        type: "button",
        "data-segment": id,
        ":aria-checked"() { return String(this.selected === id); },
        ":tabindex"() { return (this.selected || this.ids()[0]) === id ? "0" : "-1"; },
        "@click"() { this.selected = id; this.$dispatch("lily:select", { selected: id }); },
      };
    },
  }));

  // Combobox: a text input driving a role="listbox" popup. The input keeps
  // DOM focus; the highlighted option is aria-activedescendant. Options are
  // filtered by the typed text (case-insensitive substring); ArrowDown/Up
  // move (wrapping), Enter chooses, Escape closes, an outside click closes.
  Alpine.data("lilyCombobox", (value = "", open = false) => ({
    value,
    open,
    active: "",
    visible() {
      return Array.from(this.$root.querySelectorAll('[role="option"]')).filter((o) => !o.hidden);
    },
    matches(el) {
      return !this.value || el.textContent.toLowerCase().includes(this.value.toLowerCase());
    },
    choose(el) {
      this.value = el.textContent.trim();
      this.open = false;
      this.active = "";
      this.$dispatch("lily:select", { value: this.value });
    },
    root: {
      ":data-open"() { return String(this.open); },
      "@click.document"(event) {
        if (this.open && !this.$el.contains(event.target)) this.open = false;
      },
    },
    input: {
      role: "combobox",
      autocomplete: "off",
      "aria-autocomplete": "list",
      ":aria-expanded"() { return String(this.open); },
      ":aria-activedescendant"() { return this.open && this.active ? this.active : null; },
      ":value"() { return this.value; },
      "@input"(event) { this.value = event.target.value; this.open = true; this.active = ""; },
      "@keydown"(event) {
        if (event.key === "Escape") { this.open = false; this.active = ""; return; }
        if (event.key === "Enter") {
          const el = this.visible().find((o) => o.id === this.active);
          if (this.open && el) { event.preventDefault(); this.choose(el); }
          return;
        }
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        event.preventDefault();
        this.open = true;
        const options = this.visible();
        if (!options.length) return;
        const from = options.findIndex((o) => o.id === this.active);
        this.active = menuTarget(event.key, options, from, false).id;
      },
    },
    listbox: {
      role: "listbox",
      ":hidden"() { return !this.open; },
    },
    option(id) {
      return {
        role: "option",
        id,
        ":hidden"() { return !this.matches(this.$el); },
        ":aria-selected"() { return String(this.active === id); },
        ":data-active"() { return String(this.active === id); },
        "@mousedown.prevent"() {},
        "@click"() { this.choose(this.$el); },
      };
    },
  }));

  // Command: a role="search" palette. A search input filters the role="option"
  // results (case-insensitive substring); arrows move the active result
  // (aria-activedescendant, wrapping) and Enter activates it with a click.
  Alpine.data("lilyCommand", (value = "") => ({
    value,
    active: "",
    visible() {
      return Array.from(this.$root.querySelectorAll('[role="option"]')).filter((o) => !o.hidden);
    },
    matches(el) {
      return !this.value || el.textContent.toLowerCase().includes(this.value.toLowerCase());
    },
    input: {
      ":aria-activedescendant"() { return this.active || null; },
      ":value"() { return this.value; },
      "@input"(event) { this.value = event.target.value; this.active = ""; },
      "@keydown"(event) {
        if (event.key === "Enter") {
          const el = this.visible().find((o) => o.id === this.active);
          if (el) { event.preventDefault(); el.click(); }
          return;
        }
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        event.preventDefault();
        const options = this.visible();
        if (!options.length) return;
        this.active = menuTarget(event.key, options, options.findIndex((o) => o.id === this.active), false).id;
      },
    },
    option(id) {
      return {
        role: "option",
        id,
        ":hidden"() { return !this.matches(this.$el); },
        ":aria-selected"() { return String(this.active === id); },
        ":data-active"() { return String(this.active === id); },
      };
    },
  }));

  // Tree (tree-nav, tree-menu, file-tree): a role="tree" with roving tabindex
  // and the APG keys. `wrap` makes the arrows wrap (tree-menu); the others stop
  // at the ends.
  Alpine.data("lilyTree", (wrap = false, expanded = []) => ({
    ...treeCore({ wrap, expanded }),
  }));

  // TreeSelect / Cascader: a role="combobox" holding a trigger and a panel
  // with a tree. Opening moves focus into the tree; Escape returns it to the
  // trigger; choosing a leaf sets the selection and (single mode) closes.
  // `exclusive` opens one branch per level, which is the cascader.
  const popupTree = (name, exclusive) =>
    Alpine.data(name, (multiple = false, expanded = []) => ({
      ...treeCore({ exclusive, expanded }),
      multiple,
      open: false,
      init() {
        this.$watch("open", (value) => {
          if (value) this.$nextTick(() => this.focusItem(this.itemFor(this.selected[0]) ?? this.visibleItems()[0]));
        });
      },
      choose(id) {
        if (this.multiple) {
          this.selected = this.selected.includes(id) ? this.selected.filter((s) => s !== id) : [...this.selected, id];
        } else {
          this.selected = [id];
          this.open = false;
          this.$refs.trigger?.focus();
        }
        this.$dispatch("lily:select", { selected: [...this.selected], path: this.pathOf(id) });
      },
      root: {
        ":aria-expanded"() { return String(this.open); },
        ":aria-multiselectable"() { return this.multiple ? "true" : null; },
        "@keydown.escape"() {
          if (!this.open) return;
          this.open = false;
          this.$refs.trigger?.focus();
        },
        "@click.document"(event) {
          if (this.open && !this.$el.contains(event.target)) this.open = false;
        },
      },
      trigger: {
        type: "button",
        "x-ref": "trigger",
        "@click"() { this.open = !this.open; },
        "@keydown.arrow-down.prevent"() { this.open = true; },
      },
      panel: {
        ":hidden"() { return !this.open; },
      },
    }));
  popupTree("lilyTreeSelect", false);
  popupTree("lilyCascader", true);
}
