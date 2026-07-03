# Accessibility — Lily Svelte Helpers

The catalog inherits the Lily-wide accessibility commitments
documented in [`shared/headless-principles.md`](./shared/headless-principles.md)
and in the repo-root `AGENTS/accessibility.md`. This file lists the
Svelte-specific notes that are easy to miss.

## Standards

- **WCAG 2.2 AAA** is the target.
- **WAI-ARIA Authoring Practices 1.2** patterns are the reference.
- Semantic HTML first; ARIA only where the canonical helper's
  `spec/index.md` calls it out.

## The native `<select>` contract

Every current helper roots at `<select class="{helper} {class}"
aria-label={label}>` with one native `<option>` child per choice.
This combination gives:

- The control's accessible name from `aria-label` (or
  `aria-labelledby` / a consumer `<label for>` via rest-prop spread).
- An implicit `role="combobox"` (per the HTML-AAM mapping for
  `<select>`) with `role="option"` children — no explicit ARIA
  needed.
- Native keyboard handling — Arrow keys move through options, Home /
  End jump, first-letter typeahead works, Enter/collapse behaviour is
  the platform's.
- One focus stop in the page's Tab order.
- On touch devices the OS-native picker UI (iOS scroll wheel,
  Android sheet) opens for free.

WCAG passes on the strength of the native element without any JS
keyboard handling on Lily's side.

## Why `aria-label` instead of a visible `<label>`

The catalog uses `aria-label` rather than a visible `<label>` for
the default rendering because:

1. The default markup is minimal and unstyled. A visible label
   would suggest a visual decision the headless layer doesn't own.
2. Consumers who want a visible label can render one themselves and
   point it at the select:

   ```svelte
   <label for="theme">Theme</label>
   <ThemeSelect id="theme" label="Theme" themesUrl="/themes/" themes={themes} />
   ```

   (The spread `id` lands on the `<select>`; a consumer-supplied
   `aria-labelledby` or `<label for>` takes precedence for the
   accessible name.)
3. `aria-label` is the WAI-ARIA APG-recommended fallback when no
   visible label exists. It matches every other helper catalog
   (Vue, React, Angular, Blazor, Nunjucks, HTML).

## Focus management

The helpers never call `.focus()` automatically. Changing the
selection does not move focus elsewhere on the page (WCAG 3.2.2,
On Input). When wiring `onChange` to navigation (`goto`,
`router.push`), preserve scroll position and avoid focus jumps.

If a consumer builds a custom widget on top of the helper's state
(swatch buttons, a listbox), the consumer becomes responsible for
the keyboard contract — pair each `<button>` with `aria-pressed` or
implement a roving tabindex as documented in the APG patterns.

## Per-option `lang` (locale select)

Each `<option>` in the locale select carries `lang="{tagFor(locale)}"`
so screen readers switch pronunciation per option (WCAG 3.1.2,
Language of Parts). The same rule applies to any custom snippet
rendering — preserve the `lang` attribute on each `<option>` so
"Français" gets pronounced "Fran-SAY" inside an English page.

If `localeLabels` is written in the viewer's language (e.g. the
labels are all English exonyms — "English", "French", "Arabic"), the
per-option `lang` becomes technically incorrect; drop it via a
custom snippet in that case.

## Visible focus

The helpers ship no CSS; visible focus is the consumer's CSS
responsibility. Don't suppress `:focus` or `:focus-visible` in
consumer styles. The NHS-UK reference theme ships a high-contrast
focus outline that meets AAA.

## Reduced motion

The helpers perform no animation. Theme CSS files that introduce
transitions on `data-theme` changes are responsible for honouring
`prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
    :root, :root * {
        transition: none !important;
    }
}
```

## Svelte-specific gotchas

### Rest-prop spread does not block ARIA overrides

The helpers spread `{...restProps}` onto the root element. Consumers
can override the default ARIA wiring by passing their own attribute:

```svelte
<ThemeSelect label="X" themesUrl="/t/" themes={["a"]} aria-labelledby="legend-id" />
```

The `aria-label="X"` baked into the markup loses to the spread
`aria-labelledby` (last-wins in Svelte template attribute order),
which is the desired behaviour: consumers retain final ARIA
authority.

### Snippets render options, not the root

A custom `children` snippet replaces the **inside** of the
`<select>` — it must render `<option>` (or `<optgroup>`) elements,
because that is all HTML allows inside a select. The root
`<select>`, its class hook, and its `aria-label` always remain, so
custom option rendering never loses the accessible name.

If a consumer needs a different widget entirely (swatch buttons, a
command palette), they should drive the helper's state via
`bind:value` / `setTheme` from their own markup, or use the upstream
headless `ThemeSelect` (which has no opinion at all).

### `{@render}` is not a live region

`{@render children(args)}` does not announce updates the way an
`aria-live="polite"` region does. If a consumer's snippet needs to
announce a "Theme changed to Dark" toast, they have to write that
live region themselves.

## Keyboard summary

| Key                | Action                                            |
| ------------------ | ------------------------------------------------- |
| `Tab`              | Move focus to / from the select (one stop).       |
| `Arrow Down/Up`    | Move through the options.                         |
| `Home` / `End`     | Jump to first / last option (most browsers).      |
| `Enter` / `Space`  | Open / commit, per platform convention.           |
| Printable keys     | First-letter typeahead to a matching option.      |

All native. The helpers add zero key handlers.

## Testing for a11y

vitest + jsdom is enough for ARIA-attribute assertions (jsdom maps
`<select>` to the implicit `combobox` role):

```ts
const root = screen.getByRole("combobox");
expect(root.getAttribute("aria-label")).toBe("Theme");
expect(screen.getAllByRole("option").length).toBe(3);
```

For full audits run axe-core (e.g. via
[`@axe-core/playwright`](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright))
or Lighthouse in a real Svelte host (SvelteKit, plain Vite + Svelte,
Astro). The catalog has no built-in axe runner because the helpers
ship no CSS — a meaningful audit must run against the consumer's
styled markup.
