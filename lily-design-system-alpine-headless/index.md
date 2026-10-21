# Lily Design System™ - Alpine.js Headless

Headless components for [Alpine.js](https://alpinejs.dev/): annotated, semantic HTML snippets that carry the ARIA, class hooks and Alpine directives, plus one small Alpine plugin that owns state and keyboard behaviour. Zero CSS, zero text, zero icons. Targets WCAG 2.2 AAA.

**Status: 520 of the 571 catalog components** — every component that is pure markup (488) plus 32 with Alpine behaviour. The other 51 (those with behaviour in the html-headless catalog) are queued in [spec/index.md](spec/index.md).

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
- **Alpine behaviour (12):** `clipboard-copy-button` (`lilyClipboardCopy`), `collapsible` (`lilyCollapsible`), `dialog` (`lilyDialog`), `popover` (`lilyPopover`), `show-more` (`lilyShowMore`), `switch-button` (`lilySwitchButton`), `tab-bar`, `tab-bar-button`, `tab-panel` (`lilyTabs`), `toggle-button` (`lilyToggleButton`), `toggle-group` (`lilyToggleGroup`), `tooltip` (`lilyTooltip`).

## Develop

```sh
pnpm install
pnpm test      # vitest + jsdom, every snippet mounted under real Alpine
```

`node generate-components.mjs` regenerates the snippets, tests and stories.

Lily™ and Lily Design System™ are trademarks.
