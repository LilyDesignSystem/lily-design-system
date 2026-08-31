## Headless design principles rules

All components are unstyled and focus on semantic HTML, ARIA accessibility, and keyboard interaction. The library ships markup, ARIA, focus management, and keyboard semantics; consumers ship every visual decision.

### Markup

- Choose the most specific semantic HTML element that fits (`<button>`, `<dialog>`, `<details>`, `<nav>`, `<article>`, `<figure>`, etc.) before reaching for `<div>` or `<span>`. The canonical HTML tag for each component is fixed in `components/{slug}/AGENTS.md` under "HTML tag" and is the single source of truth.
- The first attribute on the root element is always the kebab-case base class plus the consumer's optional class hook (`className` / `class` / `CssClass`), so consumer CSS can target any component with one selector. No additional component-defined classes appear on the root unless the canonical spec calls them out.
- Inner sub-classes (e.g. `byline-authors`, `feature-photo-caption`) are kebab-case derivatives of the base class. Sub-classes are stable contracts: consumers can rely on them, so don't rename or remove them between versions.
- Spread the framework's "rest props" pattern (`...restProps`, `@attributes`, `v-bind="$attrs"`, `additional-attributes`) onto the root element so consumers can pass through arbitrary HTML attributes (`id`, `data-*`, event handlers, ARIA overrides) without the component blocking them.

### Accessibility

- Reach for native semantics first; add ARIA only where the canonical AGENTS spec demands it. `role="button"` on a `<div>` is a smell — use `<button>`.
- ARIA attributes that ride along with semantic elements (`aria-label`, `aria-pressed`, `aria-expanded`, `aria-current`, `aria-live`, `role="alert"`, `role="region"`, `role="img"`, `aria-roledescription`, `aria-valuemin/max/now`) are the responsibility of the component, not the consumer. The component renders them based on its props.
- Keyboard interaction patterns (Arrow / Enter / Space / Escape / Home / End / Tab) follow the WAI-ARIA Authoring Practices for the relevant pattern (Combobox, Tabs, Menu, Slider, Dialog, Tree). The keyboard contract for each component is documented in `components/{slug}/AGENTS.md` under "Keyboard".
- WCAG 2.2 AAA is the target. Colour contrast and focus-ring visibility are the consumer's CSS concern; semantic structure and keyboard reachability are the component's concern.

### Behavior boundaries

- Components handle: focus management inside the component, keyboard navigation between own children, opening/closing internal state with bindable props, and IntersectionObserver / scroll listeners that belong to the component (`Visible`, `Scroller*`, `VideoPlayer.autoplay`).
- Components do not handle: data fetching, network state, locale-specific formatting, persistence, animation choreography, or page-level routing. Those belong to the consumer.

### Visual decisions

- No stylesheets shipped. No inline `style="..."` attributes except where structurally required (e.g. `display: contents` on `ThemeProvider`, CSS custom properties applied as variables).
- No bundled fonts, images, or icon assets. Components that visualise something (chart, QR code, signature pad, mockup device frame) accept the visual content as `children` / a slot — the consumer supplies SVG, canvas, image, or library output.
- No CSS framework dependencies (Tailwind, DaisyUI, Bootstrap). The base class is the only contract for consumer CSS.

### Data attributes

- `data-*` attributes are used for state that the consumer's CSS or JS may want to observe — e.g. `data-visible`, `data-active`, `data-step-index`, `data-currency-code`, `data-width`, `data-remaining-seconds`. Use `data-*` rather than inventing new ARIA attributes when a state is for the consumer, not assistive technology.
