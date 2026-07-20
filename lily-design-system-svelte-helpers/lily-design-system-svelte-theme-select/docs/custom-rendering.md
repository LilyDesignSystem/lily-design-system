# Custom rendering

The `children` snippet **replaces the glyph inside the trigger
button**. That is its whole job.

It does *not* render the options. The popup
`<ul role="listbox">` and its `<li role="option">` children are
component-owned: they carry the ids that `aria-activedescendant`
points at, the `aria-selected` state, and the click handlers, so the
component keeps ownership of them and always emits them.

If you came from 0.3.0 or earlier: the old `ChildArgs`
(`{ themes, setTheme, name, labelFor }`) rendered `<option>` elements
inside a `<select>`. That contract is gone.

## The ChildArgs contract

```ts
type ChildArgs = {
  value: string;                       // the active slug
  open: boolean;                       // is the listbox open?
  labelFor: (theme: string) => string; // resolved display label
};
```

There is no `setTheme` and no `themes` array, because the snippet no
longer draws anything selectable. To change the theme
programmatically, write to the bindable `value` prop.

## Patterns

### Glyph plus visible text

The most useful override, and the mitigation for
[tradeoff 1](./accessibility.md#tradeoff-1--the-accessible-name-rests-entirely-on-aria-label):
give sighted users an on-screen word.

```svelte
<ThemeSelect label="Theme" themesUrl="/assets/themes/" themes={["light", "dark"]}>
  {#snippet children({ value, labelFor })}
    <span aria-hidden="true">◑</span>
    <span class="theme-select-text">{labelFor(value)}</span>
  {/snippet}
</ThemeSelect>
```

The button's `aria-label` still supplies the accessible name and
overrides this visible text for assistive technology. Keep the two
consistent, or drop the `aria-label` in favour of `aria-labelledby`.

This gives up the narrow-control benefit — which is often the right
call.

### An inline SVG instead of the Unicode glyph

Removes the font dependency described in
[tradeoff 3](./accessibility.md#tradeoff-3--the-glyph-is-font-dependent).
This package ships no assets, but nothing stops you supplying one.

```svelte
<ThemeSelect label="Theme" themesUrl="/assets/themes/" themes={["light", "dark"]}>
  {#snippet children()}
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" />
      <path d="M8 1a7 7 0 0 1 0 14z" fill="currentColor" />
    </svg>
  {/snippet}
</ThemeSelect>
```

Keep `aria-hidden="true"` and `focusable="false"` on the SVG: the
accessible name must stay on the button.

### A caret that reflects the open state

`open` is in `ChildArgs` precisely so the trigger can show its state
without a CSS-only workaround. (`[aria-expanded="true"]` on
`.theme-select-button` also works, and is usually simpler.)

```svelte
{#snippet children({ open })}
  <span aria-hidden="true">◑</span>
  <span aria-hidden="true">{open ? "▴" : "▾"}</span>
{/snippet}
```

### A swatch preview of the active theme

```svelte
{#snippet children({ value })}
  <span class="theme-select-swatch" data-theme={value} aria-hidden="true"></span>
{/snippet}
```

The `data-theme` on the span lets your CSS preview the theme's colours
through the same `:root[data-theme]` cascade the themes already use.
Because it is decorative and duplicated by the `aria-label`, keep it
`aria-hidden` — and do not let colour be the only signal (WCAG 1.4.1).

## What the snippet should *not* do

- **Don't render `<option>` elements.** There is no `<select>` to put
  them in. They will render as stray inline content inside the button.
- **Don't render interactive elements** — buttons, links, inputs.
  The snippet's output lives inside a `<button>`; nesting interactive
  content inside a button is invalid HTML and breaks keyboard
  behaviour.
- **Don't try to render the theme list.** If you want an
  always-visible list of themes rather than a popup, this helper is
  the wrong shape — read `value` and write to it from your own
  controls, or use the headless `ThemeSelect` container in
  `lily-design-system-svelte-headless`.
- **Don't mutate `document.head` or `data-theme` directly.** Let the
  component own that lifecycle.
- **Don't leave the glyph exposed to assistive technology.** Anything
  decorative in the snippet should be `aria-hidden="true"` so the
  `aria-label` remains the single accessible name.

---

Lily™ and Lily Design System™ are trademarks.
