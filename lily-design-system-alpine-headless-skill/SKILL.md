---
name: lily-design-system-alpine-headless-skill
description: Explains Lily Design System's Alpine.js headless catalog — annotated semantic-HTML snippets (`components/{slug}.html`) plus one Alpine plugin (`lily-alpine.js`) that registers `Alpine.data("lily…")` behaviours. Use when someone asks how to use Lily with Alpine.js, wants the snippet-plus-plugin idiom, asks which components have Alpine behaviour and which are pure markup, needs the `x-bind` object names and keyboard contracts (menus, trees, combobox, tabs, dialogs, sliders), the `lily:*` events, or how to test a snippet under jsdom.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Lily Design System™ — Alpine.js headless usage

`@lilydesignsystem/alpine-headless` (0.1.0, added 2026-10-21, **not yet
published to npm**) is Lily's ninth headless catalog. It covers **all 571
components**. Alpine has no component model, so a Lily component here is
two things:

- a **snippet**, `components/{slug}.html`: the semantic element, the
  kebab-case base class (first in the class list, as in every Lily catalog),
  the ARIA, and Alpine directives (`x-data`, `x-bind`);
- a **behaviour**, registered by the plugin `lily-alpine.js` as
  `Alpine.data("lily{Name}")`, which owns state and keyboard handling and
  exposes its bindings as `x-bind` objects.

Root of the ecosystem: [../spec/index.md](../spec/index.md). General Lily
concepts: [../lily-design-system-skill/](../lily-design-system-skill/). The
package itself: [../lily-design-system-alpine-headless/](../lily-design-system-alpine-headless/).

## Using it

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

Copy a snippet from `components/{slug}.html` (also importable as
`@lilydesignsystem/alpine-headless/components/{slug}.html`) into the page or
a server template (Rails, Laravel, Django, Phoenix, Eleventy). Fill the
`<!-- Consumer provides … -->` holes and every empty `aria-label=""`:
**no snippet ships any visible text, icon or CSS.** `alpinejs` is a peer
dependency (`^3.14`).

## What has behaviour

488 components are static markup, identical to the html-headless snippet. 83
are hand-written. By behaviour (full lists in the package `index.md`):

| Behaviour | Components | Keys and events |
| --- | --- | --- |
| `lilyToggleButton`, `lilySwitchButton`, `lilyToggleGroup` | toggle-button, switch-button, toggle-group | click; `aria-pressed` / `aria-checked` |
| `lilyCollapsible`, `lilyAccordion`, `lilyCheckboxAccordion`, `lilyShowMore`, `lilyDismissible` | collapsible, expander, accordion-nav, show-more, banners | click / Enter / Space; Escape where dismissible |
| `lilyTabs` | tab-bar, tab-bar-button, tab-panel | arrows, Home, End; automatic activation |
| `lilyPopover`, `lilyTooltip`, `lilyHoverCard` | popover, tooltip, hover-card, contextual-help | Escape closes; outside click closes |
| `lilyDialog`, `lilyOverlay`, `lilyConfirm` | dialog, alert-dialog, drawer, sheet, popup, popconfirm-dialog | Escape; focus in on open and back on close; `lily:confirm` / `lily:cancel` |
| `lilyMenu`, `lilyDropdownMenu`, `lilyContextMenu` | menu, menu-bar, dropdown-menu, split-button, context-menu | arrows (wrap), Home/End; roving tabindex |
| `lilyListbox`, `lilySegmentGroup`, `lilyCombobox`, `lilyCommand` | listbox, segment-group, combobox, command | arrows, Enter; `aria-activedescendant`; `lily:select` |
| `lilyTree`, `lilyTreeSelect`, `lilyCascader` | tree-nav, tree-menu, file-tree, tree-select, cascader | APG tree keys, `*`, typeahead; `lily:select` |
| inputs | pin-input-div, tag-input, mentions-input, editable, editable-form, password toggle, character counter, search, newsletter-signup … | `lily:add`, `lily:remove`, `lily:search`, `lily:submit`, `lily:change`, `lily:complete` |
| `lilyDial`, `lilyColorPicker`, `lilySplitter`, `lilyCarousel`, `lilyTour`, `lilyCoachmark`, `lilyFileUpload` | dial, color-picker, splitter, carousel, tour, coachmark, file-upload | arrows, Shift = ten steps, Home/End; drag for the splitter |

The five rating and status pickers (`five-star-rating-picker`,
`five-face-rating-picker`, `net-promoter-score-picker`,
`red-amber-green-picker`, `red-orange-yellow-green-blue-picker`) and
`slider` / `time-picker-input` are native radios, `<select>` and `<input>`
bound with `x-model` — no plugin behaviour.

Behaviours announce changes as bubbling `CustomEvent`s named `lily:*`
(`lily:select`, `lily:change`, `lily:submit` …); listen with Alpine's
`@lily:select="…"` or `addEventListener`.

## Rules that match every Lily catalog

- Base class first; rest attributes pass through.
- Semantic element first, ARIA only where semantics fall short.
- No hardcoded text: names come from `aria-label` and slots you fill.
- Headless: no `<style>`, no inline style except the structural custom
  properties a contract names (`--context-menu-x`, `--splitter-position`).

## Gotchas

- Inside an `x-bind` object method, `this.$el` is the element being
  evaluated; use `this.$root` for the `x-data` root.
- Do not use Alpine's `.outside` modifier in tests: jsdom has no layout, so it
  skips boxless elements. The plugin uses `@click.document` and `contains`.
- A `type="time"` input must not carry `role="radiogroup"` (the html-headless
  `time-picker-input` snippet does; the Alpine one does not).
- Carousel and tour manage their own slide and step state, which the
  html-headless contract leaves to the consumer.

## Testing

`pnpm test` in the package runs vitest + jsdom. `test/mount.js` mounts the
*shipped* snippet under real Alpine and each test drives it with DOM events.
Static components are tested only for element, base class and role.

## What is not built yet

No Alpine example app, no helper packages (the ten pickers, `picker-bar`,
`data-grid`, `filter`, `kanban-board`, `calendar`, `gantt-chart`), and the
package is not yet in `bin/check-coverage`, `bin/check-class-names`,
`bin/publish-headless` or `bin/smoke-packages`. Say so rather than implying
otherwise. The package `spec/index.md` is the source of truth for scope.
