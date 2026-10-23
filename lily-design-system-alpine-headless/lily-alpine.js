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

import { truncateMiddle } from "./middle-truncation.js";
import {
  isWheelTypeaheadKey,
  nextWheelIndex,
  nextWheelPrefix,
  WHEEL_MOVE_KEYS,
  wheelTypeaheadIndex,
} from "./wheel-picker.js";

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

/** How many descendants carry an x-bind starting with `prefix` (counts parts before they initialise). */
function boundCount(root, prefix) {
  return Array.from(root.querySelectorAll("[x-bind]")).filter((e) => e.getAttribute("x-bind").startsWith(prefix)).length;
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

  // CharacterCounter: a polite status "count / max" (or just count). Give it
  // `forId` to follow a field by id; otherwise set `count` yourself. Exposes
  // data-count, data-max, data-remaining and (only when over) data-over-limit.
  const counterBind = {
    role: "status",
    "aria-live": "polite",
    "x-text"() { return this.max == null ? String(this.count) : `${this.count} / ${this.max}`; },
    ":data-count"() { return String(this.count); },
    ":data-max"() { return this.max == null ? null : String(this.max); },
    ":data-remaining"() { return this.max == null ? null : String(this.max - this.count); },
    ":data-over-limit"() { return this.max != null && this.count > this.max ? "" : null; },
  };

  Alpine.data("lilyCharacterCounter", (max = null, forId = "") => ({
    count: 0,
    max,
    init() {
      const field = forId && document.getElementById(forId);
      if (!field) return;
      this.count = field.value.length;
      field.addEventListener("input", () => { this.count = field.value.length; });
    },
    counter: counterBind,
  }));

  // A textarea with its own counter, linked by aria-describedby.
  Alpine.data("lilyCountedTextarea", (max = null, value = "") => ({
    value,
    max,
    get count() { return this.value.length; },
    textarea: {
      ":value"() { return this.value; },
      "@input"(event) { this.value = event.target.value; },
      ":aria-invalid"() { return this.max != null && this.count > this.max ? "true" : null; },
    },
    counter: counterBind,
  }));

  // Password field with a show / hide toggle button (aria-pressed).
  Alpine.data("lilyPasswordToggle", (visible = false) => ({
    visible,
    input: {
      ":type"() { return this.visible ? "text" : "password"; },
      autocomplete: "current-password",
    },
    toggle: {
      type: "button",
      ":aria-pressed"() { return String(this.visible); },
      "@click"() { this.visible = !this.visible; },
    },
  }));

  // PinInput: one digit per input. A digit moves focus on, Backspace on an empty
  // box moves back, arrows move, and a paste fills the boxes from the focused
  // one. Non-digits are dropped. `lily:complete` fires when every box is filled.
  Alpine.data("lilyPinInput", () => ({
    boxes() { return Array.from(this.$root.querySelectorAll("input")); },
    get value() { return this.boxes().map((b) => b.value).join(""); },
    sync() {
      const value = this.value;
      this.$root.dataset.value = value;
      if (value.length === this.boxes().length) this.$dispatch("lily:complete", { value });
    },
    fill(boxes, from, digits) {
      digits.split("").forEach((d, k) => { if (boxes[from + k]) boxes[from + k].value = d; });
      boxes[Math.min(from + digits.length, boxes.length - 1)]?.focus();
      this.sync();
    },
    digit(i) {
      return {
        type: "text",
        inputmode: "numeric",
        maxlength: "1",
        autocomplete: "off",
        "@input"(event) {
          const boxes = this.boxes();
          const digits = event.target.value.replace(/\D/g, "");
          event.target.value = "";
          if (digits) this.fill(boxes, i, digits);
          else this.sync();
        },
        "@paste"(event) {
          event.preventDefault();
          this.fill(this.boxes(), i, (event.clipboardData?.getData("text") ?? "").replace(/\D/g, ""));
        },
        "@keydown"(event) {
          const boxes = this.boxes();
          if (event.key === "Backspace" && !event.target.value && i > 0) {
            event.preventDefault();
            boxes[i - 1].value = "";
            boxes[i - 1].focus();
            this.sync();
          } else if (event.key === "ArrowLeft" && i > 0) {
            event.preventDefault();
            boxes[i - 1].focus();
          } else if (event.key === "ArrowRight" && i < boxes.length - 1) {
            event.preventDefault();
            boxes[i + 1].focus();
          }
        },
      };
    },
  }));

  // TagInput: Enter adds the trimmed text as a tag (duplicates ignored) and
  // clears the field; Backspace on an empty field removes the last tag.
  Alpine.data("lilyTagInput", (tags = []) => ({
    tags: [...tags],
    add(text) {
      const tag = text.trim();
      if (!tag || this.tags.includes(tag)) return false;
      this.tags = [...this.tags, tag];
      this.$dispatch("lily:add", { value: tag, tags: [...this.tags] });
      return true;
    },
    remove(tag) {
      this.tags = this.tags.filter((t) => t !== tag);
      this.$dispatch("lily:remove", { value: tag, tags: [...this.tags] });
    },
    input: {
      type: "text",
      "@keydown"(event) {
        if (event.key === "Enter" && this.$el.value.trim()) {
          event.preventDefault();
          this.add(this.$el.value);
          this.$el.value = "";
        } else if (event.key === "Backspace" && !this.$el.value && this.tags.length) {
          this.remove(this.tags[this.tags.length - 1]);
        }
      },
    },
  }));

  // CurrencyInput: a decimal text field that keeps only digits and one ".",
  // carries data-currency-code, and flags aria-invalid outside min / max.
  // Formatting (Intl.NumberFormat, locale) stays the consumer's.
  Alpine.data("lilyCurrencyInput", (currencyCode = "", min = null, max = null) => ({
    input: {
      type: "text",
      inputmode: "decimal",
      "data-currency-code": currencyCode,
      "@input"() {
        const [whole, ...rest] = this.$el.value.replace(/[^\d.]/g, "").split(".");
        this.$el.value = rest.length ? `${whole}.${rest.join("")}` : whole;
        const n = Number(this.$el.value);
        const bad = this.$el.value !== "" && ((min != null && n < min) || (max != null && n > max));
        if (bad) this.$el.setAttribute("aria-invalid", "true");
        else this.$el.removeAttribute("aria-invalid");
      },
    },
  }));

  // TextInputWithSearch: Enter in the field or the button emits `lily:search`.
  Alpine.data("lilySearch", (value = "") => ({
    value,
    search() { this.$dispatch("lily:search", { value: this.value }); },
    input: {
      type: "text",
      ":value"() { return this.value; },
      "@input"(event) { this.value = event.target.value; },
      "@keydown.enter.prevent"() { this.search(); },
    },
    button: {
      type: "button",
      "@click"() { this.search(); },
    },
  }));

  // MentionsInput: typing the trigger character opens suggestions filtered by
  // the text after it. Arrows move the active option (aria-activedescendant),
  // Enter replaces "@query" with the chosen option, Escape closes.
  Alpine.data("lilyMentions", (trigger = "@") => ({
    open: false,
    active: "",
    query: "",
    visible() {
      return Array.from(this.$root.querySelectorAll('[role="option"]')).filter((o) => !o.hidden);
    },
    match(el) { return el.textContent.toLowerCase().includes(this.query.toLowerCase()); },
    scan(value) {
      const at = value.lastIndexOf(trigger);
      const tail = at < 0 ? null : value.slice(at + trigger.length);
      this.open = tail !== null && !/\s/.test(tail);
      this.query = this.open ? tail : "";
      this.active = "";
    },
    choose(el) {
      const input = this.$refs.input;
      const at = input.value.lastIndexOf(trigger);
      input.value = `${input.value.slice(0, at)}${trigger}${el.textContent.trim()} `;
      this.open = false;
      this.active = "";
      input.focus();
      this.$dispatch("lily:select", { value: el.textContent.trim() });
    },
    input: {
      "x-ref": "input",
      role: "combobox",
      "aria-haspopup": "listbox",
      "aria-autocomplete": "list",
      ":aria-expanded"() { return String(this.open); },
      ":aria-activedescendant"() { return this.open && this.active ? this.active : null; },
      "@input"(event) { this.scan(event.target.value); },
      "@keydown"(event) {
        if (!this.open) return;
        if (event.key === "Escape") { this.open = false; this.active = ""; return; }
        if (event.key === "Enter") {
          const el = this.visible().find((o) => o.id === this.active);
          if (el) { event.preventDefault(); this.choose(el); }
          return;
        }
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        event.preventDefault();
        const options = this.visible();
        if (!options.length) return;
        this.active = menuTarget(event.key, options, options.findIndex((o) => o.id === this.active), false).id;
      },
    },
    panel: {
      ":hidden"() { return !this.open; },
    },
    option(id) {
      return {
        role: "option",
        id,
        ":hidden"() { return !this.match(this.$el); },
        ":aria-selected"() { return String(this.active === id); },
        "@mousedown.prevent"() {},
        "@click"() { this.choose(this.$el); },
      };
    },
  }));

  // Editable: a button-like display that swaps for a text field. Enter,
  // Space or a click edits; Enter confirms; Escape cancels. The display's
  // accessible name is "value, label" so the visible text is in the name.
  Alpine.data("lilyEditable", (value = "", editing = false, label = "", disabled = false) => ({
    value,
    draft: value,
    editing,
    disabled,
    label,
    edit() {
      if (this.disabled) return;
      this.draft = this.value;
      this.editing = true;
      this.$nextTick(() => this.$refs.input?.focus());
    },
    confirm() {
      this.value = this.draft;
      this.editing = false;
      this.$dispatch("lily:change", { value: this.value });
      this.$nextTick(() => this.$refs.display?.focus());
    },
    cancel() {
      this.draft = this.value;
      this.editing = false;
      this.$nextTick(() => this.$refs.display?.focus());
    },
    display: {
      role: "button",
      "x-ref": "display",
      ":tabindex"() { return this.disabled ? "-1" : "0"; },
      ":aria-disabled"() { return this.disabled ? "true" : null; },
      ":aria-label"() { return this.value ? `${this.value}, ${this.label}` : this.label; },
      ":hidden"() { return this.editing; },
      "x-text"() { return this.value; },
      "@click"() { this.edit(); },
      "@keydown.enter.prevent"() { this.edit(); },
      "@keydown.space.prevent"() { this.edit(); },
    },
    input: {
      type: "text",
      "x-ref": "input",
      ":aria-label"() { return this.label; },
      ":value"() { return this.draft; },
      ":hidden"() { return !this.editing; },
      "@input"(event) { this.draft = event.target.value; },
      "@keydown.enter.prevent"() { this.confirm(); },
      "@keydown.escape.prevent"() { this.cancel(); },
    },
  }));

  // EditableForm: a form shown only while editing. Submit saves (the consumer
  // handles `lily:submit`) and closes; Escape cancels and closes. The form is
  // tabindex -1 and takes focus when it opens.
  Alpine.data("lilyEditableForm", (editing = false) => ({
    editing,
    edit() {
      this.editing = true;
      this.$nextTick(() => this.$refs.form?.focus());
    },
    cancel() {
      this.editing = false;
      this.$dispatch("lily:cancel");
    },
    editButton: {
      type: "button",
      ":hidden"() { return this.editing; },
      "@click"() { this.edit(); },
    },
    form: {
      "x-ref": "form",
      tabindex: "-1",
      ":hidden"() { return !this.editing; },
      "@submit.prevent"() {
        this.editing = false;
        this.$dispatch("lily:submit", { values: Object.fromEntries(new FormData(this.$el)) });
      },
      "@keydown.escape"() { this.cancel(); },
    },
  }));

  // DataFilterForm: a role="search" form that never navigates. Submit emits
  // `lily:filter` with the field values; reset emits `lily:reset`.
  Alpine.data("lilyDataFilterForm", () => ({
    form: {
      role: "search",
      "@submit.prevent"() {
        this.$dispatch("lily:filter", { values: Object.fromEntries(new FormData(this.$el)) });
      },
      "@reset"() { this.$dispatch("lily:reset"); },
    },
  }));

  // NewsletterSignup: a state machine (idle | submitting | success | error)
  // surfaced as data-state. While submitting the field and button are
  // disabled; success is a polite status, error an alert. Submit emits
  // `lily:submit` — the consumer moves `state` on.
  Alpine.data("lilyNewsletterSignup", (state = "idle") => ({
    state,
    form: {
      ":data-state"() { return this.state; },
      "@submit.prevent"() {
        const email = this.$el.querySelector('input[type="email"]');
        this.$dispatch("lily:submit", { email: email?.value ?? "" });
      },
    },
    field: { ":disabled"() { return this.state === "submitting"; } },
    submit: { ":disabled"() { return this.state === "submitting"; } },
    success: { ":hidden"() { return this.state !== "success"; } },
    error: { ":hidden"() { return this.state !== "error"; } },
  }));

  // DateTimeNowInput: date and time fields plus a button that fills both with
  // the current local date and time.
  Alpine.data("lilyDateTimeNow", () => ({
    date: "",
    time: "",
    now() {
      const d = new Date();
      const p = (n) => String(n).padStart(2, "0");
      this.date = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
      this.time = `${p(d.getHours())}:${p(d.getMinutes())}`;
      this.$dispatch("lily:change", { date: this.date, time: this.time });
    },
    nowButton: {
      type: "button",
      "@click"() { this.now(); },
    },
  }));

  // Dial / slider keys (APG slider): Right/Up raise, Left/Down lower, Shift
  // moves ten steps, Home and End jump to the bounds.
  const sliderKey = (event, value, { min, max, step }) => {
    const big = event.shiftKey ? 10 : 1;
    let next = value;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") next = value + step * big;
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown") next = value - step * big;
    else if (event.key === "Home") next = min;
    else if (event.key === "End") next = max;
    else return null;
    return Math.min(max, Math.max(min, next));
  };

  // Dial: a role="slider" div (there is no native dial). Focusable unless
  // disabled; aria-disabled only when disabled; data-value for CSS.
  Alpine.data("lilyDial", (value = 0, min = 0, max = 100, step = 1, disabled = false) => ({
    value: Math.min(max, Math.max(min, value)),
    min,
    max,
    step,
    disabled,
    dial: {
      role: "slider",
      ":tabindex"() { return this.disabled ? "-1" : "0"; },
      ":aria-valuenow"() { return String(this.value); },
      ":aria-valuemin"() { return String(this.min); },
      ":aria-valuemax"() { return String(this.max); },
      ":aria-disabled"() { return this.disabled ? "true" : null; },
      ":data-value"() { return String(this.value); },
      "@keydown"(event) {
        if (this.disabled) return;
        const next = sliderKey(event, this.value, this);
        if (next === null) return;
        event.preventDefault();
        if (next === this.value) return;
        this.value = next;
        this.$dispatch("lily:change", { value: next });
      },
    },
  }));

  // ColorPicker: a two-axis role="slider" over a 0–100 square. aria-valuenow
  // is x; data-x and data-y position the cursor. Up lowers y, Down raises it.
  Alpine.data("lilyColorPicker", (x = 0, y = 0, disabled = false) => ({
    x,
    y,
    disabled,
    area: {
      role: "slider",
      ":tabindex"() { return this.disabled ? "-1" : "0"; },
      "aria-valuemin": "0",
      "aria-valuemax": "100",
      ":aria-valuenow"() { return String(this.x); },
      ":aria-disabled"() { return this.disabled ? "true" : null; },
      ":data-x"() { return String(this.x); },
      ":data-y"() { return String(this.y); },
      "@keydown"(event) {
        if (this.disabled) return;
        const big = event.shiftKey ? 10 : 1;
        const clamp = (n) => Math.min(100, Math.max(0, n));
        const move = {
          ArrowRight: () => { this.x = clamp(this.x + big); },
          ArrowLeft: () => { this.x = clamp(this.x - big); },
          ArrowUp: () => { this.y = clamp(this.y - big); },
          ArrowDown: () => { this.y = clamp(this.y + big); },
          Home: () => { this.x = 0; },
          End: () => { this.x = 100; },
        }[event.key];
        if (!move) return;
        event.preventDefault();
        move();
        this.$dispatch("lily:change", { x: this.x, y: this.y });
      },
    },
  }));

  // Splitter: a focusable role="separator" with a 0–100 position. The keys
  // that move it follow the orientation (Left/Right when the panes sit side by
  // side, Up/Down when stacked); Shift moves ten steps; Home/End jump to the
  // bounds. Dragging maps the pointer onto the separator's parent. The
  // position is also exposed as --splitter-position on the separator.
  Alpine.data("lilySplitter", (value = 50, orientation = "vertical", min = 0, max = 100, step = 1) => ({
    value,
    orientation,
    min,
    max,
    step,
    set(next) {
      next = Math.min(this.max, Math.max(this.min, next));
      if (next === this.value) return;
      this.value = next;
      this.$dispatch("lily:change", { value: next });
    },
    separator: {
      role: "separator",
      tabindex: "0",
      ":aria-orientation"() { return this.orientation; },
      ":aria-valuenow"() { return String(this.value); },
      ":aria-valuemin"() { return String(this.min); },
      ":aria-valuemax"() { return String(this.max); },
      ":data-value"() { return String(this.value); },
      ":style"() { return { "--splitter-position": `${this.value}%` }; },
      "@keydown"(event) {
        const sideBySide = this.orientation === "vertical";
        const keys = sideBySide ? ["ArrowLeft", "ArrowRight"] : ["ArrowUp", "ArrowDown"];
        const big = event.shiftKey ? 10 : 1;
        if (event.key === keys[0]) this.set(this.value - this.step * big);
        else if (event.key === keys[1]) this.set(this.value + this.step * big);
        else if (event.key === "Home") this.set(this.min);
        else if (event.key === "End") this.set(this.max);
        else return;
        event.preventDefault();
      },
      "@pointerdown"(event) {
        const parent = this.$el.parentElement;
        const sideBySide = this.orientation === "vertical";
        const move = (e) => {
          const box = parent.getBoundingClientRect();
          const size = sideBySide ? box.width : box.height;
          if (!size) return;
          const at = sideBySide ? e.clientX - box.left : e.clientY - box.top;
          this.set(Math.round(this.min + (at / size) * (this.max - this.min)));
        };
        const stop = () => {
          document.removeEventListener("pointermove", move);
          document.removeEventListener("pointerup", stop);
        };
        event.preventDefault();
        document.addEventListener("pointermove", move);
        document.addEventListener("pointerup", stop);
      },
    },
  }));

  // Carousel: one slide shown at a time (the rest hidden), previous / next
  // buttons that wrap, and a numeric "n / m" slide label. It never advances
  // by itself.
  Alpine.data("lilyCarousel", (index = 0) => ({
    index,
    total: 0,
    init() { this.total = this.count(); },
    count() { return boundCount(this.$root, "slide("); },
    go(to) {
      const count = this.count();
      if (!count) return;
      this.index = (to + count) % count;
      this.$dispatch("lily:change", { index: this.index });
    },
    root: { ":data-index"() { return String(this.index); } },
    previous: { type: "button", "@click"() { this.go(this.index - 1); } },
    next: { type: "button", "@click"() { this.go(this.index + 1); } },
    slide(i) {
      return {
        role: "group",
        "aria-roledescription": "slide",
        ":aria-label"() { return `${i + 1} / ${this.total}`; },
        ":hidden"() { return this.index !== i; },
        ":data-active"() { return String(this.index === i); },
      };
    },
  }));

  // Tour: steps shown one at a time, the current one aria-current="step".
  // Next on the last step finishes; Escape and close end the tour.
  Alpine.data("lilyTour", (step = 0, open = true) => ({
    step,
    open,
    total: 0,
    init() { this.total = this.count(); },
    count() { return boundCount(this.$root, "item("); },
    go(to) {
      if (to < 0) return;
      if (to >= this.count()) return this.end("lily:finish");
      this.step = to;
      this.$dispatch("lily:change", { step: to });
    },
    end(type = "lily:close") {
      this.open = false;
      this.$dispatch(type);
    },
    root: {
      ":hidden"() { return !this.open; },
      "@keydown.escape"() { if (this.open) this.end(); },
    },
    previous: { type: "button", "@click"() { this.go(this.step - 1); } },
    next: { type: "button", "@click"() { this.go(this.step + 1); } },
    close: { type: "button", "@click"() { this.end(); } },
    item(i) {
      return {
        "aria-roledescription": "step",
        ":aria-label"() { return `${i + 1} / ${this.total}`; },
        ":aria-current"() { return this.step === i ? "step" : null; },
        ":aria-hidden"() { return this.step === i ? null : "true"; },
        ":hidden"() { return this.step !== i; },
      };
    },
  }));

  // Coachmark: a non-modal dialog (aria-modal="false") with a dismiss button;
  // Escape dismisses. Hidden while closed.
  Alpine.data("lilyCoachmark", (open = true) => ({
    open,
    dismiss() {
      this.open = false;
      this.$dispatch("lily:dismiss");
    },
    root: {
      ":hidden"() { return !this.open; },
      "@keydown.escape"() { if (this.open) this.dismiss(); },
    },
    dismissButton: { type: "button", "@click"() { this.dismiss(); } },
  }));

  // FileUpload: a button opens the hidden native file input; the status
  // (aria-live="polite") carries the file count in data-file-count.
  Alpine.data("lilyFileUpload", () => ({
    count: 0,
    trigger: {
      type: "button",
      "@click"() { this.$refs.input.click(); },
    },
    input: {
      "x-ref": "input",
      type: "file",
      "@change"(event) {
        const files = Array.from(event.target.files ?? []);
        this.count = files.length;
        this.$dispatch("lily:change", { files });
      },
    },
    status: {
      "aria-live": "polite",
      ":data-file-count"() { return String(this.count); },
      "x-text"() { return this.count ? String(this.count) : ""; },
    },
  }));

  // MiddleTruncation: the text shortened in the middle to the root's measured width (canvas metrics in its own font),
  // re-measured on resize. The full text stays in the page for assistive technology; ellipsis has no default.
  Alpine.data("lilyMiddleTruncation", (options = {}) => ({
    text: options.text ?? "",
    ellipsis: options.ellipsis ?? "",
    strategy: options.strategy ?? "even",
    end: options.end,
    shown: null,
    _observer: null,
    _frame: 0,
    _context: undefined,
    init() {
      this.recalculate();
      if (typeof ResizeObserver !== "undefined") {
        this._observer = new ResizeObserver(() => {
          cancelAnimationFrame(this._frame);
          this._frame = requestAnimationFrame(() => this.recalculate());
        });
        this._observer.observe(this.$el);
      }
      this.$watch(() => [this.text, this.ellipsis, this.strategy, this.end], () => this.recalculate());
    },
    destroy() {
      cancelAnimationFrame(this._frame);
      this._observer?.disconnect();
    },
    recalculate() {
      const el = this.$el;
      const width = el.clientWidth;
      if (this._context === undefined) this._context = document.createElement("canvas").getContext("2d");
      const ctx = this._context;
      if (!ctx || width <= 0) {
        this.shown = null;
        return;
      }
      const style = getComputedStyle(el);
      ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const result = truncateMiddle(this.text, {
        ellipsis: this.ellipsis,
        strategy: this.strategy,
        end: this.end,
        maxWidth: width,
        measure: (t) => ctx.measureText(t).width,
      });
      this.shown = result === this.text ? null : result;
    },
    root: {
      ":data-strategy"() { return this.strategy; },
      ":data-truncated"() { return this.shown === null ? null : ""; },
    },
    visual: { "x-text"() { return this.shown ?? this.text; } },
    full: { "x-text"() { return this.text; } },
  }));

  // WheelPicker: a vertical single-select listbox where the selection follows the cursor (APG listbox). The roles live in the
  // snippet; this owns the value, the keys (arrows, Home/End, PageUp/PageDown, type-ahead) and centring the selected option.
  let wheelPickerCount = 0;
  Alpine.data("lilyWheelPicker", (config = {}) => ({
    options: config.options ?? [],
    value: config.value ?? "",
    loop: Boolean(config.loop),
    pageSize: config.pageSize ?? 5,
    disabled: Boolean(config.disabled),
    uid: `wheel-picker-${++wheelPickerCount}`,
    _typeahead: { prefix: "", at: 0 },
    init() {
      this.$nextTick(() => this.centre());
      this.$watch("value", () => this.$nextTick(() => this.centre()));
    },
    get selectedIndex() {
      return this.options.findIndex((o) => o.value === this.value);
    },
    select(index) {
      if (index < 0) return;
      const next = this.options[index].value;
      if (next === this.value) return; // applying the selection already held is a no-op
      this.value = next;
      this.$dispatch("change", { value: next });
    },
    // Only the list scrolls (never the page), and instantly: no animation.
    centre() {
      const list = this.$refs.list;
      const option = list?.querySelector(`[data-index="${this.selectedIndex}"]`);
      if (list && option) list.scrollTop = option.offsetTop - (list.clientHeight - option.offsetHeight) / 2;
    },
    list: {
      role: "listbox",
      "aria-orientation": "vertical",
      ":aria-disabled"() { return this.disabled ? "true" : null; },
      ":aria-activedescendant"() { return this.selectedIndex >= 0 ? `${this.uid}-option-${this.selectedIndex}` : null; },
      ":tabindex"() { return this.disabled ? -1 : 0; },
      "@keydown"(event) {
        if (this.disabled) return;
        if (WHEEL_MOVE_KEYS.includes(event.key)) {
          event.preventDefault();
          this.select(nextWheelIndex(this.options, this.selectedIndex, event.key, { loop: this.loop, pageSize: this.pageSize }));
        } else if (isWheelTypeaheadKey(event)) {
          this._typeahead = nextWheelPrefix(this._typeahead, event.key, Date.now());
          this.select(wheelTypeaheadIndex(this.options, this.selectedIndex, this._typeahead.prefix));
        }
      },
      "@click"(event) {
        if (this.disabled) return;
        const target = event.target.closest('[role="option"]');
        if (!target || target.getAttribute("aria-disabled") === "true") return;
        this.select(Number(target.getAttribute("data-index")));
        this.$refs.list.focus();
      },
    },
  }));
}
