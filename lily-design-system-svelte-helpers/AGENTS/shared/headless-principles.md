# Headless principles (shared)

Adapted from the repo-root [`AGENTS/headless.md`](../../../AGENTS/headless.md)
for the Svelte helpers catalog. All components in this catalog ship
unstyled and focus on semantic HTML, ARIA accessibility, and
keyboard interaction. The library ships markup, ARIA, focus
management, and keyboard semantics; consumers ship every visual
decision.

## Markup

- Choose the most specific semantic HTML element that fits
  (`<button>`, `<dialog>`, `<details>`, `<nav>`, `<article>`,
  `<figure>`, `<fieldset>`, etc.) before reaching for `<div>` or
  `<span>`. The canonical HTML tag for each helper is fixed in its
  `spec/index.md` "DOM contract" section.
- The first attribute on the root element is always the kebab-case
  base class plus the consumer's optional `class` prop, so consumer
  CSS can target any helper with one selector. No additional
  component-defined classes appear on the root unless the spec calls
  them out.
- Inner sub-classes (e.g. `theme-select-option`,
  `locale-select-option-label`) are kebab-case derivatives of the
  base class. Sub-classes are stable contracts: consumers can rely
  on them, so don't rename or remove them between versions.
- The `...restProps` spread on the root element forwards arbitrary
  HTML attributes (`id`, `data-*`, event handlers, ARIA overrides)
  without the component blocking them.

## Accessibility

- Reach for native semantics first; add ARIA only where the
  canonical AGENTS spec demands it. `role="button"` on a `<div>` is
  a smell — use `<button>`.
- ARIA attributes that ride along with semantic elements
  (`aria-label`, `aria-pressed`, `aria-expanded`, `aria-current`,
  `aria-live`, `role="alert"`, `role="region"`, `role="img"`,
  `aria-roledescription`, `aria-valuemin/max/now`) are the
  responsibility of the component, not the consumer. The component
  renders them based on its props.
- Keyboard interaction patterns (Arrow / Enter / Space / Escape /
  Home / End / Tab) follow the WAI-ARIA Authoring Practices for the
  relevant pattern (Combobox, Tabs, Menu, Slider, Dialog, Tree). The
  keyboard contract for each helper is documented in its
  `AGENTS/accessibility.md`.
- WCAG 2.2 AAA is the target. Colour contrast and focus-ring
  visibility are the consumer's CSS concern; semantic structure and
  keyboard reachability are the component's concern.

## Behaviour boundaries

- **Components handle.** Focus management inside the component,
  keyboard navigation between own children, opening/closing
  internal state via `$bindable`, `IntersectionObserver` and scroll
  listeners that belong to the component.
- **Components do not handle.** Data fetching, network state,
  locale-specific formatting (currency / dates / measurement),
  persistence (beyond an opt-in `storageKey`), animation
  choreography, or page-level routing. Those belong to the consumer.

## Visual decisions

- No stylesheets shipped. No `<style>` blocks inside helper `.svelte`
  files. No inline `style="..."` attributes except where structurally
  required (e.g. `display: contents` on a `ThemeProvider`, CSS custom
  properties applied as variables).
- No bundled fonts, images, or icon assets. Components that
  visualise something (chart, QR code, signature pad, mockup device
  frame) accept the visual content as `children` — the consumer
  supplies SVG, canvas, image, or library output.
- No CSS framework dependencies (Tailwind, DaisyUI, Bootstrap). The
  base class is the only contract for consumer CSS.

## Data attributes

- `data-*` attributes are used for state that the consumer's CSS or
  JS may want to observe — e.g. `data-visible`, `data-active`,
  `data-step-index`, `data-currency-code`, `data-width`,
  `data-remaining-seconds`, `data-theme`, `data-lily-theme-select`.
  Use `data-*` rather than inventing new ARIA attributes when a
  state is for the consumer, not assistive technology.

## Svelte-specific re-statements

- **Svelte 5 runes only.** `$props()`, `$bindable()`, `$state()`,
  `$effect()`, `$derived()`. No Svelte 4 `export let`, no `$:`, no
  `createEventDispatcher`.
- **TypeScript on the public surface.** `Props` and `ChildArgs`
  types are exported from the `<script lang="ts" module>` block and
  re-exported from `index.ts`.
- **Rest-prop spread.** Every helper component spreads
  `{...restProps}` onto the root element so `id`, `data-*`,
  `aria-*`, and event handlers fall through.
- **`children` as a typed `Snippet`.** Custom rendering takes a
  `children?: Snippet<[ChildArgs]>` prop, rendered via
  `{@render children(args)}` when present.
- **No `<style>` blocks** — scoped or global — in helper components.
  Consumer styles every visual aspect via the base class hook.
- **Pure helpers exported from the module script** so consumers can
  reuse them outside the component (e.g. `bcp47LocaleTag`,
  `isRtlLocale`, `normaliseThemesUrl`).
