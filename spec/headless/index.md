# Headless

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Lily™'s headless layer ships semantic HTML, ARIA, focus management, and keyboard behaviour with zero visual decisions; consumers supply every stylesheet, font, icon, and string.

## Scope

This topic covers the binding rules for the seven headless component libraries (HTML, Svelte, React, Vue, Angular, Blazor, Nunjucks): markup conventions, the accessibility-second principle, behaviour boundaries (what a component owns versus what the consumer owns), the prohibition on shipped CSS/fonts/icons, the one structurally-required inline style, and the `data-*` versus ARIA attribute split.

It does **not** cover: visual theming (see [theme](../theme/index.md)), the full accessibility contract and testing baseline (see [accessibility](../accessibility/index.md)), per-component naming and suffix-to-element mappings (see [components](../components/index.md)), or example-app styling and routes (see [examples](../examples/index.md)).

## Principles and rules

- The headless library ships markup, ARIA, focus management, and keyboard semantics; consumers ship every visual decision.
- Choose the most specific semantic HTML element that fits (`<button>`, `<dialog>`, `<details>`, `<nav>`, `<article>`, `<figure>`) before reaching for `<div>` or `<span>`. The canonical HTML tag for each component is fixed in `components/{slug}/AGENTS.md` under "HTML tag" and is the single source of truth.
- The first attribute on the root element is always the kebab-case base class plus the consumer's optional class hook (`className` / `class` / `CssClass`), so consumer CSS can target any component with one selector. No additional component-defined classes appear on the root unless the canonical spec calls them out.
- Inner sub-classes (e.g. `byline-authors`, `feature-photo-caption`) are kebab-case derivatives of the base class and are stable contracts: do not rename or remove them between versions.
- Spread the framework's "rest props" pattern onto the root element so consumers can pass through arbitrary HTML attributes (`id`, `data-*`, event handlers, ARIA overrides) without the component blocking them.
- Reach for native semantics first; add ARIA only where the canonical AGENTS spec demands it. `role="button"` on a `<div>` is a smell — use `<button>`.
- ARIA attributes that ride along with semantic elements are the responsibility of the component, not the consumer. The component renders them based on its props.
- WCAG 2.2 AAA is the target. Colour contrast and focus-ring visibility are the consumer's CSS concern; semantic structure and keyboard reachability are the component's concern.
- No stylesheets, fonts, images, icon assets, or CSS framework dependencies (Tailwind, DaisyUI, Bootstrap) shipped. The base class is the only contract for consumer CSS.

## Markup contract

The root element of every component carries exactly the base class plus the consumer hook, then any spread rest props.

```html
<!-- byline component: base class "byline" + consumer hook, then rest props -->
<p class="byline {consumer class}" id="article-byline" data-variant="compact">
  <span class="byline-authors">…</span>
  <span class="byline-date">…</span>
</p>
```

| Layer            | Owner    | Rule                                                                 |
| ---------------- | -------- | ------------------------------------------------------------------- |
| Element choice   | Lily     | Most specific semantic element; canonical in `components/{slug}/AGENTS.md`. |
| Base class       | Lily     | Kebab-case, equals the slug; the single selector contract.          |
| Class hook       | Consumer | `className` / `class` / `CssClass`, merged onto the root.           |
| Inner sub-classes| Lily     | `{base}-{part}` kebab-case; stable across versions.                 |
| Rest props       | Consumer | Spread onto root: `id`, `data-*`, handlers, ARIA overrides.         |

The framework-specific rest-props mechanism:

| Framework | Mechanism                |
| --------- | ------------------------ |
| React     | `{...restProps}`         |
| Svelte    | `{...$$restProps}` / `@attributes` |
| Vue       | `v-bind="$attrs"`        |
| Angular   | `additional-attributes`  |
| Blazor    | `@attributes`            |

## Behaviour boundaries

| Component owns                                              | Consumer owns                                  |
| ---------------------------------------------------------- | ---------------------------------------------- |
| Focus management inside the component                      | Data fetching, network state                   |
| Keyboard navigation between own children                   | Locale-specific formatting                     |
| Open/close internal state via bindable props               | Persistence                                    |
| `IntersectionObserver` / scroll listeners that belong to the component (`Visible`, `Scroller*`, `VideoPlayer.autoplay`) | Animation choreography |
| ARIA, roles, states, properties on its own elements        | Page-level routing                             |

## Visual decisions and the one allowed inline style

- No stylesheets shipped; no inline `style="..."` attributes **except** where structurally required — e.g. `display: contents` on `ThemeProvider`, or CSS custom properties applied as variables.
- No bundled fonts, images, or icon assets. Components that visualise something (chart, QR code, signature pad, mockup device frame) accept the visual content as `children` / a slot; the consumer supplies SVG, canvas, image, or library output.

```html
<!-- ThemeProvider: the only structurally-required inline style -->
<div class="theme-provider" style="display: contents" data-theme="dark">
  …
</div>
```

## data-* versus ARIA

- `data-*` attributes are for state the consumer's CSS or JS may want to observe — `data-visible`, `data-active`, `data-step-index`, `data-currency-code`, `data-width`, `data-remaining-seconds`.
- ARIA attributes are for assistive technology.
- Use `data-*` rather than inventing new ARIA attributes when a state is for the consumer, not assistive technology.

## Acceptance criteria

- [ ] Each component's root element renders the kebab-case base class plus the consumer class hook as its first class contract, with rest props spread onto the root.
- [ ] Each component uses the most specific semantic HTML element, matching the canonical "HTML tag" in `components/{slug}/AGENTS.md`.
- [ ] Inner sub-classes follow `{base}-{part}` kebab-case and are stable across versions.
- [ ] No component ships a stylesheet, font, icon asset, or CSS framework dependency; no inline `style` except the structurally-required cases (e.g. `display: contents` on `ThemeProvider`).
- [ ] No component performs data fetching, network state, locale formatting, persistence, animation choreography, or page-level routing.
- [ ] Consumer-observable state uses `data-*`; assistive-technology state uses ARIA.
- [ ] Per-framework CSS class-name audit: 490 / 490 components in every headless subproject reference their canonical kebab-case base class (spec §11.4).

## Related topics

- [accessibility](../accessibility/index.md) — the WCAG 2.2 AAA and WAI-ARIA contract the headless layer implements
- [components](../components/index.md) — canonical catalog, suffix-to-element mapping, naming patterns
- [theme](../theme/index.md) — where colour, spacing, and typography actually live
- [examples](../examples/index.md) — the styled reference apps that consume the headless layer
- [frameworks](../frameworks/index.md) — the seven headless libraries and their rest-props mechanisms

## Sources

- [AGENTS/headless.md](../../AGENTS/headless.md)
- [AGENTS/accessibility.md](../../AGENTS/accessibility.md)
- [spec/index.md](../index.md) §4.1 (Headless), §11.4 (per-framework class-name audit)

---

Lily™ and Lily Design System™ are trademarks.
