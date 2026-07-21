# Headless principles (shared)

Adapted from the repo-root [`AGENTS/headless.md`](../../../AGENTS/headless.md)
for the Angular helpers catalog. All components in this catalog ship
unstyled and focus on semantic HTML, ARIA accessibility, and
keyboard interaction. The library ships markup, ARIA, focus
management, and keyboard semantics; consumers ship every visual
decision.

## Markup

- Choose the most specific semantic HTML element that fits
  (`<button>`, `<dialog>`, `<details>`, `<nav>`, `<article>`,
  `<figure>`, `<select>`, etc.) before reaching for `<div>` or
  `<span>`. The canonical HTML tag for each helper is fixed in its
  `spec/index.md` "DOM contract" section.
- The first attribute on the root element is always the kebab-case
  base class plus the consumer's optional `className` input, so
  consumer CSS can target any helper with one selector. No
  additional component-defined classes appear on the root unless
  the spec calls them out.
- Inner sub-classes (e.g. `theme-chooser-option`,
  `locale-chooser-option`) are kebab-case derivatives of the
  base class. Sub-classes are stable contracts: consumers can rely
  on them, so don't rename or remove them between versions.
- Angular has no implicit attribute-spread. Each helper accepts the
  small set of pass-through properties it needs (`className`, plus
  the always-present `data-*` attributes the consumer can bind via
  `[attr.data-foo]`). For larger pass-through needs, the consumer
  binds attributes directly on the host element.

## Accessibility

- Reach for native semantics first; add ARIA only where the
  canonical AGENTS spec demands it. `role="button"` on a `<div>` is
  a smell — use `<button>`.
- ARIA attributes that ride along with semantic elements
  (`aria-label`, `aria-pressed`, `aria-expanded`, `aria-current`,
  `aria-live`, `role="alert"`, `role="region"`, `role="img"`,
  `aria-roledescription`, `aria-valuemin/max/now`) are the
  responsibility of the component, not the consumer. The component
  renders them based on its inputs.
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
  keyboard navigation between own children, opening/closing internal
  state via `model<T>()`, `IntersectionObserver` and scroll
  listeners that belong to the component.
- **Components do not handle.** Data fetching, network state,
  locale-specific formatting (currency / dates / measurement),
  persistence (beyond an opt-in `storageKey`), animation
  choreography, or page-level routing. Those belong to the consumer.

## Visual decisions

- No stylesheets shipped. No inline `style="..."` attributes except
  where structurally required (e.g. `display: contents` on
  `ThemeProvider`, CSS custom properties applied as variables).
  Components declare their templates inline (`template:`) and never
  use `styles` / `styleUrls`.
- No bundled fonts, images, or icon assets. Components that
  visualise something (chart, QR code, signature pad, mockup device
  frame) accept the visual content via `ng-content` projection — the
  consumer supplies SVG, canvas, image, or library output.
- No CSS framework dependencies (Tailwind, DaisyUI, Bootstrap). The
  base class is the only contract for consumer CSS.

## Data attributes

- `data-*` attributes are used for state that the consumer's CSS or
  JS may want to observe — e.g. `data-visible`, `data-active`,
  `data-step-index`, `data-currency-code`, `data-width`,
  `data-remaining-seconds`, `data-theme`, `data-lily-theme-chooser`.
  Use `data-*` rather than inventing new ARIA attributes when a
  state is for the consumer, not assistive technology.

## Angular-specific re-statements

- **Standalone components only.** Every helper declares
  `standalone: true` and is imported by the consumer's own
  standalone component via the `imports: [...]` array.
- **Signal inputs.** `input<T>()` and `input.required<T>()` for
  typed reactive inputs; no `@Input()` decorator.
- **Signal outputs.** `output<T>()` for typed events; consumer uses
  `(name)="..."` in the template.
- **Model signals.** `model<T>()` for two-way bindable inputs;
  consumer uses `[(value)]="x"`.
- **`OnPush` change detection** on every component. Signals power
  reactivity; no `markForCheck` or `detectChanges` calls.
- **`@for` control flow** (not `*ngFor`). `@if` instead of `*ngIf`.
- **No `provide()` / `inject()` for helpers.** Each helper is
  self-contained. Consumers can wire their own service tokens
  inside their own components; the helpers don't expose any.
- **No animations.** No `@angular/animations` use.
- **No `HttpClient`.** No network access from the helpers.
- **Template-inline only.** No `templateUrl`, no `styleUrls`, no
  `styles`. The template lives in the `template:` field of the
  `@Component` decorator.
