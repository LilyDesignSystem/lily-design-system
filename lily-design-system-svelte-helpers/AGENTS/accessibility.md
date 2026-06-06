# Accessibility — Lily Svelte Helpers

The catalog inherits the Lily-wide accessibility commitments
documented in [`shared/headless-principles.md`](./shared/headless-principles.md)
and in the repo-root `AGENTS/accessibility.md`. This file lists the
Svelte-specific notes that are easy to miss.

## Standards

- **WCAG 2.2 AAA** is the target.
- **WAI-ARIA Authoring Practices 1.2** patterns are the reference.
- Semantic HTML first; ARIA only where the canonical helper's
  `spec.md` calls it out.

## The fieldset + radiogroup contract

Every current helper roots at `<fieldset role="radiogroup"
aria-label={label}>` with native `<input type="radio">` children.
This combination gives:

- The group's accessible name from `aria-label` (or `aria-labelledby`
  if the consumer's slot adds a `<legend id="…">`).
- Implicit `role="radio"` and `aria-checked` on each input.
- Native keyboard handling — Arrow keys cycle selection, Tab moves
  in / out of the group as one stop, Space re-selects.
- A single focus stop in the page's Tab order.

The `<fieldset>` element is special: it announces its content as a
group, and assistive technology reads the `aria-label` before the
first option name. WCAG passes on the strength of this pattern
without any JS keyboard handling on Lily's side.

## Why `aria-label` instead of `<legend>`

The catalog uses `aria-label` rather than a visible `<legend>` for
the default rendering because:

1. The default markup is minimal and unstyled. A visible legend
   would suggest a visual decision the headless layer doesn't own.
2. Consumers who want a visible legend can render one inside their
   `{#snippet children(...)}` block:

   ```svelte
   <ThemePicker label="Theme">
       {#snippet children({ themes, value, setTheme, name, labelFor })}
           <legend>Theme</legend>
           {#each themes as theme}
               <!-- … -->
           {/each}
       {/snippet}
   </ThemePicker>
   ```

3. `aria-label` is the WAI-ARIA APG-recommended fallback when no
   visible label exists. It matches every other helper catalog
   (Vue, React, Angular, Blazor, Nunjucks, HTML).

## Focus management

The helpers never call `.focus()` automatically. Changing the
selection does not move focus elsewhere on the page (WCAG 3.2.2,
On Input). When wiring `onChange` to navigation (`goto`,
`router.push`), preserve scroll position and avoid focus jumps.

If a custom snippet drops the native radios in favour of buttons,
the consumer becomes responsible for the keyboard contract — pair
each `<button>` with `aria-pressed` or implement a roving tabindex
as documented in the APG Toolbar pattern.

## Per-option `lang` (locale picker)

Each `<label>` in the locale picker carries `lang="{tagFor(locale)}"`
so screen readers switch pronunciation per option (WCAG 3.1.2,
Language of Parts). The same rule applies to any custom snippet
rendering — preserve the `lang` attribute on the visible element so
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
<ThemePicker label="X" themesUrl="/t/" themes={["a"]} aria-labelledby="legend-id" />
```

The `aria-label="X"` baked into the markup loses to the spread
`aria-labelledby` (last-wins in Svelte template attribute order),
which is the desired behaviour: consumers retain final ARIA
authority.

### Snippets do not break the fieldset

A custom `children` snippet replaces the **inside** of the
`<fieldset>`. The `role="radiogroup"` and `aria-label` always
remain on the fieldset, so even a `<select>` rendering inside the
snippet stays inside the announced group.

If a consumer needs to drop the fieldset entirely (e.g. to render a
single `<select>` without group semantics), they should write a
thin wrapper around the helper or use the upstream headless
`ThemePicker` (which has no opinion at all).

### `{@render}` is not a live region

`{@render children(args)}` does not announce updates the way a
`aria-live="polite"` region does. If a consumer's snippet needs to
announce a "Theme changed to Dark" toast, they have to write that
live region themselves.

## Keyboard summary

| Key                | Action                                            |
| ------------------ | ------------------------------------------------- |
| `Tab`              | Move focus into / out of the group (one stop).    |
| `Shift+Tab`        | Move focus backwards out of the group.            |
| `Arrow Down/Right` | Move selection to the next option.                |
| `Arrow Up/Left`    | Move selection to the previous option.            |
| `Space`            | Re-select the focused option (rarely needed).     |
| `Home` / `End`     | Move to first / last option (most browsers).      |

All native. The helpers add zero key handlers.

## Testing for a11y

vitest + jsdom is enough for ARIA-attribute assertions:

```ts
expect(root!.getAttribute("role")).toBe("radiogroup");
expect(root!.getAttribute("aria-label")).toBe("Theme");
```

For full audits run axe-core (e.g. via
[`@axe-core/playwright`](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright))
or Lighthouse in a real Svelte host (SvelteKit, plain Vite + Svelte,
Astro). The catalog has no built-in axe runner because the helpers
ship no CSS — a meaningful audit must run against the consumer's
styled markup.
