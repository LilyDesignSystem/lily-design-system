# Headless principles (shared)

Adapted from the repo-root [`AGENTS/headless.md`](../../../AGENTS/headless.md)
for the Blazor helpers catalog. All components in this catalog ship
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
  base class plus the consumer's optional `CssClass` parameter, so
  consumer CSS can target any helper with one selector. No
  additional component-defined classes appear on the root unless
  the spec calls them out.
- Inner sub-classes (e.g. `theme-select-option`,
  `locale-select-option`) are kebab-case derivatives of the
  base class. Sub-classes are stable contracts: consumers can rely
  on them, so don't rename or remove them between versions.
- `@attributes="AdditionalAttributes"` is bound on the root element
  so consumers can pass through arbitrary HTML attributes (`id`,
  `data-*`, event handlers, ARIA overrides) without the component
  blocking them.

## Accessibility

- Reach for native semantics first; add ARIA only where the
  canonical AGENTS spec demands it. `role="button"` on a `<div>` is
  a smell — use `<button>`.
- ARIA attributes that ride along with semantic elements
  (`aria-label`, `aria-pressed`, `aria-expanded`, `aria-current`,
  `aria-live`, `role="alert"`, `role="region"`, `role="img"`,
  `aria-roledescription`, `aria-valuemin/max/now`) are the
  responsibility of the component, not the consumer. The component
  renders them based on its parameters.
- Keyboard interaction patterns (Arrow / Enter / Space / Escape /
  Home / End / Tab) follow the WAI-ARIA Authoring Practices for the
  relevant pattern (Combobox, Tabs, Menu, Slider, Dialog, Tree).
  The keyboard contract for each helper is documented in its
  `AGENTS/accessibility.md`.
- WCAG 2.2 AAA is the target. Colour contrast and focus-ring
  visibility are the consumer's CSS concern; semantic structure and
  keyboard reachability are the component's concern.

## Behaviour boundaries

- **Components handle.** Focus management inside the component,
  keyboard navigation between own children, opening / closing
  internal state via `@bind-*`, IntersectionObserver and scroll
  listeners that belong to the component.
- **Components do not handle.** Data fetching, network state,
  locale-specific formatting (currency / dates / measurement),
  persistence (beyond an opt-in `StorageKey`), animation
  choreography, or page-level routing. Those belong to the
  consumer.

## Visual decisions

- No stylesheets shipped. No inline `style="..."` attributes except
  where structurally required (e.g. `display: contents` on
  `ThemeProvider`).
- No bundled fonts, images, or icon assets. Components that
  visualise something (chart, QR code, signature pad, mockup device
  frame) accept the visual content via a `RenderFragment` — the
  consumer supplies SVG, canvas, image, or library output.
- No CSS framework dependencies (Tailwind, DaisyUI, Bootstrap). The
  base class is the only contract for consumer CSS.

## Data attributes

- `data-*` attributes are used for state that the consumer's CSS or
  JS may want to observe — e.g. `data-visible`, `data-active`,
  `data-step-index`, `data-currency-code`, `data-width`,
  `data-remaining-seconds`, `data-theme`, `data-lily-theme-select`.
  Use `data-*` rather than inventing new ARIA attributes when a
  state is for the consumer, not assistive technology.

## Blazor-specific re-statements

- `@namespace LilyDesignSystem.Blazor.Helpers` is declared in every
  `.razor` file. `namespace LilyDesignSystem.Blazor.Helpers;` is
  declared in every `.razor.cs` file.
- `partial class {Pascal} : ComponentBase` splits the component
  between `{Pascal}.razor` (markup) and `{Pascal}.razor.cs`
  (code-behind).
- `[Parameter, EditorRequired]` is the contract for required
  parameters.
- `[Parameter(CaptureUnmatchedValues = true)] public Dictionary<string, object>?
  AdditionalAttributes` is the contract for attribute spread.
- `EventCallback<T>` is the contract for events; the
  `{Name}` + `{Name}Changed` parameter pair drives `@bind-{Name}`.
- `RenderFragment<TContext>` is the contract for custom rendering;
  the helper exposes a `*Context` `sealed class` with `required init`
  fields.
- Never set `InteractiveServer` / `InteractiveWebAssembly` render
  modes from within the helper — that's the consumer's choice.
- No `CascadingValue` / `CascadingParameter` for the helpers in this
  catalog; each helper is self-contained.
