# Custom rendering

The default `children` is a set of native `<option>` elements inside
the `<select>`. When you need a different visual — swatch buttons, a
segmented control, a flyout menu — pass your own snippet.

## The ChildArgs contract

The snippet receives one argument with five fields:

```ts
type ChildArgs = {
  themes: string[];                    // the available slugs
  value: string;                       // the active slug
  setTheme: (theme: string) => void;   // imperative apply (writes value)
  name: string;                        // shared identity for the picker
  labelFor: (theme: string) => string; // resolved display label
};
```

`setTheme(slug)` writes the new slug to the bindable `value`. The
picker's `$effect` then performs the four steps in
[spec.md §5.3](../spec.md#53-applying-a-theme).

## Patterns

### Swatch buttons

```svelte
<ThemeSelect label="Theme" themesUrl="/assets/themes/" themes={["light", "dark"]}>
  {#snippet children({ themes, value, setTheme, labelFor })}
    {#each themes as t (t)}
      <button
        type="button"
        class="theme-select-swatch"
        data-theme={t}
        aria-pressed={value === t}
        onclick={() => setTheme(t)}
      >
        {labelFor(t)}
      </button>
    {/each}
  {/snippet}
</ThemeSelect>
```

`aria-pressed` carries the active state; the picker no longer renders
a native `<select>` of options, so the implicit option selection is
gone. The `data-theme` on each button lets your CSS preview the
swatch colours by hooking into the same `:root[data-theme]` cascade.

Note: because the snippet replaces the default `<option>`s, rendering
non-`<option>` markup means you are no longer inside a native
`<select>`. If you want button or segmented-control semantics, render
your custom controls outside the picker and call `setTheme` from a
wrapper component instead.

### Custom option markup

If you want the native `<select>` semantics but custom option labels:

```svelte
<ThemeSelect label="Theme" themesUrl="/assets/themes/" themes={["light", "dark"]}>
  {#snippet children({ themes, value, labelFor })}
    {#each themes as t (t)}
      <option value={t} selected={value === t}>{labelFor(t)}</option>
    {/each}
  {/snippet}
</ThemeSelect>
```

The picker's `<select>` owns the `onchange` handler, so the snippet
only needs to render `<option>` elements.

## What the snippet should *not* do

- Don't mutate `document.head` or `data-theme` directly; let the
  picker own that lifecycle.
- Don't render non-`<option>` markup directly inside the picker — the
  root is a native `<select>`. For a non-`<select>` UI, render your
  controls outside the picker and call `setTheme` from a wrapper.
