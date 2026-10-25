# Lily Design System™ - Alpine.js Headless

Headless components for [Alpine.js](https://alpinejs.dev/): annotated, semantic HTML snippets that carry the ARIA, class hooks and Alpine directives, plus one small Alpine plugin that owns state and keyboard behaviour. Zero CSS, zero text, zero icons. Targets WCAG 2.2 AAA.

**Status: 581 of the 581 catalog components** — every component that is pure markup (488) plus 83 with Alpine behaviour. The whole catalog is covered; the [example app](../lily-design-system-alpine-examples/) and four helpers ([data grid](../lily-design-system-alpine-data-grid/), [kanban board](../lily-design-system-alpine-kanban-board/), [calendar](../lily-design-system-alpine-calendar/), [Gantt chart](../lily-design-system-alpine-gantt-chart/)) exist; what is left (the other helpers, the publish pipeline) is in [spec/index.md](spec/index.md).

## How it works

Alpine has no component model, so a Lily component here is a snippet you copy into your page (or include from a template) and a behaviour registered by the plugin:

```html
<script type="module">
  import Alpine from "alpinejs";
  import lily from "@lilydesignsystem/alpine-headless/plugin";
  Alpine.plugin(lily);
  Alpine.start();
</script>

<button class="switch-button" x-data="lilySwitchButton(false)" x-bind="button" aria-label="Notifications">
  Notifications
</button>
```

The snippet fixes the element, the base class (first, as in every Lily catalog) and the ARIA. The plugin's `Alpine.data()` behaviours expose `x-bind` objects (`button`, `trigger`, `tab('id')`, `panel('id')` …) so you can reuse the contract on your own elements.

## Components

- **Static markup (488):** every html-headless snippet with no behaviour, e.g. `alert`, `badge`, `breadcrumb-nav`, `button`, `card`, `table`, the national identifiers. Their tests check the element, base class and ARIA role, not behaviour.
- **Hand-written (83), by family** (the `families/*.mjs` modules, plus the first 12 in the generator):
  - *Toggles and disclosure:* `toggle-button` (`lilyToggleButton`), `switch-button` (`lilySwitchButton`), `toggle-group` (`lilyToggleGroup`), `collapsible`, `expander`, `government-banner`, `hamburger-menu` (`lilyCollapsible`), `show-more` (`lilyShowMore`), `accordion-nav` (`lilyAccordion`), `accordion-checkbox` (`lilyCheckboxAccordion`), `medical-banner`, `sticky-promo-banner` (`lilyDismissible`), `hover-card` (`lilyHoverCard`), `tooltip` (`lilyTooltip`), `popover`, `contextual-help` (`lilyPopover`), `clipboard-copy-button` (`lilyClipboardCopy`), `tab-bar`, `tab-bar-button`, `tab-panel` (`lilyTabs`).
  - *Overlays:* `dialog`, `alert-dialog`, `file-dialog` (`lilyDialog`), `drawer`, `slide-out-drawer`, `sheet`, `popup`, `overlay-container` (`lilyOverlay`), `popconfirm-dialog` (`lilyConfirm`).
  - *Menus:* `menu`, `menu-bar` (`lilyMenu`), `dropdown-menu`, `split-button`, `action-group` (`lilyDropdownMenu`), `context-menu` (`lilyContextMenu`).
  - *Selection:* `listbox` (`lilyListbox`), `segment-group` (`lilySegmentGroup`), `combobox` (`lilyCombobox`), `command` (`lilyCommand`); the five rating and status pickers are native radios and `<select>` bound with `x-model`.
  - *Trees:* `tree-nav`, `tree-menu`, `file-tree` (`lilyTree`), `tree-select` (`lilyTreeSelect`), `cascader` (`lilyCascader`).
  - *Text and form inputs:* `character-counter`, `text-area-input-with-character-counter`, `password-input-or-text-input-div`, `pin-input-div`, `tag-input`, `currency-input`, `text-input-with-search`, `mentions-input`, `editable`, `editable-form`, `data-filter-form`, `newsletter-signup`, `date-time-now-input`, `time-picker-input`.
  - *Value controls and guided widgets:* `slider`, `dial`, `color-picker`, `splitter`, `resizable`, `scroll-area`, `carousel`, `tour`, `coachmark`, `file-upload`.
  - *Container-only (role and name, no behaviour):* `calendar-range-picker`, `emoji-character-picker`, `image-cropper`, `signature-pad`, `file-manager`, `float-button`, `toast`, `sonner`, `timer`.

## Develop

```sh
pnpm install
pnpm test      # vitest + jsdom, every snippet mounted under real Alpine
```

`node generate-components.mjs` regenerates the snippets, tests and stories.

Lily™ and Lily Design System™ are trademarks.
