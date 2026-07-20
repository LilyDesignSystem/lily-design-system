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

### One control shape across this catalog

All three helpers share one markup model:

| Helper             | Control                                       |
| ------------------ | --------------------------------------------- |
| `theme-select`     | Icon button (◑) + `role="listbox"` popup.     |
| `locale-select`    | Icon button (🌐) + `role="listbox"` popup.    |
| `text-size-select` | Icon button (A) + `role="listbox"` popup.     |

All three were converted from native `<select>` elements to
icon-button-plus-listbox widgets — `theme-select` and `locale-select`
first, `text-size-select` after. Their root is a `<div>`, the trigger
is a `<button aria-haspopup="listbox">`, and the popup is a
`<ul role="listbox">` of `<li role="option">`.

`text-size-select`'s glyph is the letter `A` (U+0041), not a
pictograph: U+1F5DB DECREASE FONT SIZE SYMBOL has no real glyph in
common font stacks and means *decrease* rather than *size*. A plain
letter renders in the page's own font everywhere and stays monochrome
like ◑.

### Scoped slots and the glyph contract

For all three helpers, the default scoped slot replaces the **button
glyph only** — it does not render the options.
The listbox, its option markup, the ARIA state, and the keyboard
contract are all component-owned and cannot be displaced by a slot.

Slot content is decorative. The button's accessible name always comes
from `label` via `aria-label`, so slot content must be
`aria-hidden="true"` or text-free; otherwise it competes with that
name. See the per-helper `docs/accessibility.md`.

### Label vs aria-label

The helpers carry the consumer's name as `aria-label={label}`. For all
three this is the **only** accessible name — the button has no visible
text — and the same `label` also names the
listbox. Consumers who want a visible label should render their own
text next to the helper; a `.{helper}-status` live region is the
documented pattern (see the per-helper `docs/accessibility.md`).

## Keyboard

All three helpers implement the WAI-ARIA APG listbox
pattern themselves. On the button, `ArrowDown` / `Enter` / `Space`
open with the selected option active and `ArrowUp` opens with the last
option active; opening moves focus to the `<ul>`. On the listbox,
`ArrowDown` / `ArrowUp` move the active option and **clamp** (no
wrapping), `Home` / `End` jump to first / last, `Enter` / `Space`
commit and return focus to the button, `Escape` cancels and returns
focus without changing the value, `Tab` closes without stealing focus
back, and printable characters run a typeahead over the labels with a
500 ms buffer. The active option is conveyed with
`aria-activedescendant` on the `<ul>`, not by moving DOM focus.

When porting, keep the clamping (the APG listbox pattern does not
wrap) and keep `aria-activedescendant` absent while closed.

## Focus management

All three helpers move focus deliberately and only
within their own control: to the `<ul>` when the listbox opens, and
back to the button when it closes via commit or `Escape`. `Tab` and
click-outside close **without** pulling focus back, so the user's own
focus move is never fought. Focus is never moved elsewhere on the page
in response to a selection (WCAG 3.2.2, On Input).

Because focus moves after a reactive state change, the focus call must
wait for Vue to flush the DOM — `await nextTick()` before `.focus()`.
A `hidden` element cannot take focus, so focusing the `<ul>` in the
same tick that sets `open` silently fails.

## Screen-reader pronunciation (locale select)

Each `<li role="option">` carries `lang="…"` so screen readers switch
pronunciation per option (WCAG 3.1.2, Language of Parts). The button
and the list itself carry no `lang`. This survived the conversion from
the native `<select>` and must be preserved in any port.

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
