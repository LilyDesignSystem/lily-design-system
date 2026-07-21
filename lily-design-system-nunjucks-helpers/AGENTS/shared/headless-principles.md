# Headless principles (shared)

Adapted from the repo-root [`AGENTS/headless.md`](../../../AGENTS/headless.md)
for the Nunjucks helpers catalog. All helpers in this catalog ship
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
  base class plus the consumer's optional `classes` opt, so consumer
  CSS can target any helper with one selector. No additional
  component-defined classes appear on the root unless the spec calls
  them out.
- Inner sub-classes (e.g. `theme-chooser-option`,
  `locale-chooser-option`) are kebab-case derivatives of the
  base class. Sub-classes are stable contracts: consumers can rely
  on them, so don't rename or remove them between versions.
- `opts.attributes` spreads arbitrary HTML attributes onto the root
  so consumers can pass through `id`, `data-*`, ARIA overrides
  without the macro blocking them.

## Accessibility

- Reach for native semantics first; add ARIA only where the
  canonical AGENTS spec demands it. `role="button"` on a `<div>` is
  a smell — use `<button>`.
- ARIA attributes that ride along with semantic elements
  (`aria-label`, `aria-pressed`, `aria-expanded`, `aria-current`,
  `aria-live`, `role="alert"`, `role="region"`, `role="img"`,
  `aria-roledescription`, `aria-valuemin/max/now`) are the
  responsibility of the macro, not the consumer. The macro renders
  them based on its `opts`.
- Keyboard interaction patterns (Arrow / Enter / Space / Escape /
  Home / End / Tab) follow the WAI-ARIA Authoring Practices for the
  relevant pattern (Combobox, Tabs, Menu, Slider, Dialog, Tree). The
  keyboard contract for each helper is documented in its
  `AGENTS/accessibility.md`.
- WCAG 2.2 AAA is the target. Colour contrast and focus-ring
  visibility are the consumer's CSS concern; semantic structure and
  keyboard reachability are the macro's concern.

## Behaviour boundaries

- **Macro handles.** ARIA, role, class hooks, `data-lily-*`
  configuration, the initial `selected` option from `opts.value`,
  per-option `lang` on locale labels.
- **Client.js handles.** Focus management inside the component (none
  by default — the platform does it via the native `<select>`),
  bindable selection state, `IntersectionObserver` and scroll
  listeners that
  belong to the component, storage and apply lifecycle.
- **Neither handles.** Data fetching, network state, locale-specific
  formatting (currency / dates / measurement), persistence (beyond
  an opt-in `storageKey`), animation choreography, or page-level
  routing. Those belong to the consumer.

## Visual decisions

- No stylesheets shipped. No inline `style="..."` attributes except
  where structurally required (e.g. `display: contents` on
  `ThemeProvider` — not present in this catalog).
- No bundled fonts, images, or icon assets. Helpers that visualise
  something accept the visual content via the `caller` block — the
  consumer supplies SVG, canvas, image, or library output.
- No CSS framework dependencies (Tailwind, DaisyUI, Bootstrap). The
  base class is the only contract for consumer CSS.

## Data attributes

- `data-lily-{name}-root` identifies a select root for `autoInit()`.
- `data-lily-{name}-{kebab-cased-opt}` carries serialised
  configuration from macro to client.js.
- `data-*` attributes are used for state that the consumer's CSS or
  JS may want to observe — e.g. `data-theme`, `data-lily-theme-chooser`.
  Use `data-*` rather than inventing new ARIA attributes when a
  state is for the consumer, not assistive technology.

## Nunjucks-specific re-statements

- The macro is the rendering layer; the client.js is the runtime
  layer. Neither can do the other's job.
- The macro is pure: same `opts` → same string, deterministically.
- The client.js is the only place DOM mutation happens.
- The consumer loads the client.js once per page; they choose how
  (a `<script type="module">` in the layout, a bundler entry point,
  an ES-module import in their own JS).
- No `<style>` or `<script>` in the macro output. Ever.
- `nunjucks.configure({ autoescape: true })` is mandatory; the
  helpers test against autoescape on.
