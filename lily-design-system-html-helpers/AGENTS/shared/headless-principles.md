# Headless principles (shared)

Adapted from the repo-root [`AGENTS/headless.md`](../../../AGENTS/headless.md)
for the HTML helpers catalog. All custom elements in this catalog
ship unstyled and focus on semantic HTML, ARIA accessibility, and
keyboard interaction. The library ships markup, ARIA, focus
management, and keyboard semantics; consumers ship every visual
decision.

## Markup

- Choose the most specific semantic HTML element that fits
  (`<button>`, `<dialog>`, `<details>`, `<nav>`, `<article>`,
  `<figure>`, `<fieldset>`, etc.) before reaching for `<div>` or
  `<span>`. The canonical HTML tag for each helper's rendered
  children is fixed in its `spec.md` "DOM contract" section.
- The first attribute on the **rendered** root child is always the
  kebab-case base class plus the consumer's optional `class`
  attribute, so consumer CSS can target any helper with one
  selector. The custom-element host itself (`<theme-select>`,
  `<locale-select>`) is a transparent container.
- Inner sub-classes (e.g. `theme-select-option`,
  `locale-select-option`) are kebab-case derivatives of the
  base class. Sub-classes are stable contracts: consumers can rely
  on them, so don't rename or remove them between versions.
- "Rest props" are not a concept in custom elements — every
  attribute the consumer writes onto `<theme-select>` already lives
  on the host element. The element does not forward attributes to
  the rendered children; the host element is the attribute
  collector and the children are rendered fresh on every render.

## Accessibility

- Reach for native semantics first; add ARIA only where the
  canonical AGENTS spec demands it. `role="button"` on a `<div>` is
  a smell — use `<button>`.
- ARIA attributes that ride along with semantic elements
  (`aria-label`, `aria-pressed`, `aria-expanded`, `aria-current`,
  `aria-live`, `role="alert"`, `role="region"`, `role="img"`,
  `aria-roledescription`, `aria-valuemin/max/now`) are the
  responsibility of the helper, not the consumer. The helper
  renders them based on its attributes.
- Keyboard interaction patterns (Arrow / Enter / Space / Escape /
  Home / End / Tab) follow the WAI-ARIA Authoring Practices for the
  relevant pattern (Combobox, Tabs, Menu, Slider, Dialog, Tree).
  The keyboard contract for each helper is documented in its
  `AGENTS/accessibility.md`.
- WCAG 2.2 AAA is the target. Colour contrast and focus-ring
  visibility are the consumer's CSS concern; semantic structure and
  keyboard reachability are the helper's concern.

## Behaviour boundaries

- **Helpers handle.** Focus management inside the helper, keyboard
  navigation between own children, opening/closing internal state
  via attributes / properties, `IntersectionObserver` and scroll
  listeners that belong to the helper.
- **Helpers do not handle.** Data fetching, network state,
  locale-specific formatting (currency / dates / measurement),
  persistence (beyond an opt-in `storage-key`), animation
  choreography, or page-level routing. Those belong to the
  consumer.

## Visual decisions

- No stylesheets shipped. No inline `style="..."` attributes except
  where structurally required (e.g. `display: contents` on
  `ThemeProvider`, CSS custom properties applied as variables).
- No bundled fonts, images, or icon assets. Helpers that visualise
  something (chart, QR code, signature pad, mockup device frame)
  accept the visual content as children — the consumer supplies
  SVG, canvas, image, or library output.
- No CSS framework dependencies (Tailwind, DaisyUI, Bootstrap). The
  base class is the only contract for consumer CSS.

## Data attributes

- `data-*` attributes are used for state that the consumer's CSS or
  JS may want to observe — e.g. `data-visible`, `data-active`,
  `data-step-index`, `data-currency-code`, `data-width`,
  `data-remaining-seconds`, `data-theme`, `data-lily-theme-select`.
  Use `data-*` rather than inventing new ARIA attributes when a
  state is for the consumer, not assistive technology.

## Custom-element-specific re-statements

- `class extends HTMLElement` is the default. No "customised
  built-in" elements (`extends "div"`) — Safari does not support
  them, and they complicate the rendering contract.
- Light DOM only. Shadow DOM is forbidden in this catalog for the
  reasons listed in [`../conventions.md`](../conventions.md)
  §"Light DOM".
- Every observed attribute mirrors a JS property of the same name
  (camelCased). The attribute is the serialised source of truth;
  the property is the convenient programmatic view.
- Array / object properties accept the native form (`string[]` or
  `Record<string, string>`) and serialise to CSV / JSON for the
  attribute.
- Lifecycle methods (`connectedCallback`,
  `attributeChangedCallback`, `disconnectedCallback`) are the
  effect surface — nothing else mutates the DOM.
- `CustomEvent` is the change-notification mechanism. Always
  `bubbles: true, composed: true` so event delegation works.
