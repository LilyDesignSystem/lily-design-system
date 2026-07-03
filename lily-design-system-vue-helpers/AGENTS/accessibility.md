# Accessibility — Lily Vue Helpers

The catalog inherits the Lily-wide accessibility commitments
documented in [`shared/headless-principles.md`](./shared/headless-principles.md)
and in the repo-root `AGENTS/accessibility.md`. This file lists the
Vue-specific notes that are easy to miss when porting a helper from
Svelte to Vue.

## Standards

- **WCAG 2.2 AAA** is the target.
- **WAI-ARIA Authoring Practices 1.2** patterns are the reference.
- Semantic HTML first; ARIA only where the canonical helper's
  `spec/index.md` calls it out.

## Vue-specific gotchas

### `inheritAttrs`

Leave it at its default of `true`. The helpers depend on Vue's
fall-through-attrs behaviour so consumers can pass `id`,
`data-testid`, event handlers, and ARIA overrides without the
component blocking them. Setting `inheritAttrs: false` removes the
guarantee and silently breaks tests that rely on
`<ThemeSelect data-testid="x">`.

### `v-bind="$attrs"`

You don't need it. With `inheritAttrs: true` (default), `$attrs`
flow to the single root element automatically. Only reach for
`v-bind="$attrs"` if a helper grows multiple roots, which none of
the current helpers do.

### `v-html` and `<output>`

Never write user-facing strings through `v-html` — it bypasses
escaping. None of the helpers in this catalog use it; if a future
helper needs to render markdown, the rendering belongs to the
consumer.

### Scoped slots and the select contract

The default rendering is a native `<select>` whose children are
`<option>` elements. A scoped slot replaces only the inside of the
`<select>`, so the combobox container is preserved even when
consumers render their own `<option>` set.

If a custom slot renders non-`<option>` markup (e.g. `<button>`
swatches), the consumer is no longer inside a native `<select>` and
must add `aria-pressed` (button group) themselves, or render those
controls outside the helper and call `setTheme` / `setLocale` from a
wrapper. See the per-helper `docs/accessibility.md` for patterns.

### Label vs aria-label

The helpers carry the consumer's name as `aria-label={label}` on the
root `<select>`, which exposes the implicit `combobox` role. There is
no separate visible label by default; consumers who want a visible
label can pair the `<select>` with their own `<label>` element
outside the helper and point it at the helper via `id` /
`aria-labelledby`.

## Keyboard

The native `<select>` provides Tab / Shift+Tab, Arrow Down / Up to
move selection, Home / End, typeahead, Enter / Space to open, and
Escape to close — all for free. None of the helpers add keyboard
handlers; if a scoped slot renders non-`<option>` controls, the
consumer becomes responsible for keyboard behaviour.

## Focus management

The helpers never call `.focus()` automatically. Changing the
selection does not move focus elsewhere on the page (WCAG 3.2.2,
On Input). When wiring `onChange` to navigation (`router.push`,
`vue-router`), preserve scroll position and avoid focus jumps.

## Screen-reader pronunciation (locale select)

Each `<option>` carries `lang="…"` so screen readers switch
pronunciation per option (WCAG 3.1.2, Language of Parts). Custom
scoped-slot renderings must keep this attribute on the rendered
element.

## Visible focus

The helpers ship no CSS; visible focus is the consumer's CSS
responsibility. Don't suppress `:focus` or `:focus-visible` in
consumer styles.

## Reduced motion

The helpers perform no animation. Theme CSS files that introduce
transitions on `data-theme` changes are responsible for honouring
`prefers-reduced-motion`.

## Testing for a11y

vitest + jsdom is enough for ARIA-attribute assertions. For full
audits run axe-core (e.g. via
[`@axe-core/playwright`](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright))
or Lighthouse in a real Vue host (Nuxt, Vite + Vue, Astro). The
catalog has no built-in axe runner because the helpers ship no CSS
— a meaningful audit must run against the consumer's styled markup.
