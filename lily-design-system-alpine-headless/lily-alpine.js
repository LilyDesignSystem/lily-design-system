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

/** Roving-focus keys shared by every composite widget (APG). */
function rovingIndex(key, index, count) {
  if (key === "ArrowRight" || key === "ArrowDown") return (index + 1) % count;
  if (key === "ArrowLeft" || key === "ArrowUp") return (index - 1 + count) % count;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return -1;
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
}
