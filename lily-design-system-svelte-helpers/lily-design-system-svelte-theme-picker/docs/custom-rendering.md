# Custom rendering

The default `children` is a row of native radio inputs. When you need
a different visual — swatch buttons, a dropdown, a segmented control,
a flyout menu — pass your own snippet.

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
<ThemePicker label="Theme" themesUrl="/assets/themes/" themes={["light", "dark"]}>
  {#snippet children({ themes, value, setTheme, labelFor })}
    {#each themes as t (t)}
      <button
        type="button"
        class="theme-picker-swatch"
        data-theme={t}
        aria-pressed={value === t}
        onclick={() => setTheme(t)}
      >
        {labelFor(t)}
      </button>
    {/each}
  {/snippet}
</ThemePicker>
```

`aria-pressed` carries the active state; the picker no longer renders
radios, so `aria-checked` is gone. The `data-theme` on each button
lets your CSS preview the swatch colours by hooking into the same
`:root[data-theme]` cascade.

### Native `<select>` dropdown

```svelte
<ThemePicker label="Theme" themesUrl="/assets/themes/" themes={["light", "dark", "abyss"]}>
  {#snippet children({ themes, value, setTheme, labelFor })}
    <label class="theme-picker-select-label">
      <select
        value={value}
        onchange={(e) => setTheme((e.currentTarget as HTMLSelectElement).value)}
      >
        {#each themes as t (t)}
          <option value={t}>{labelFor(t)}</option>
        {/each}
      </select>
    </label>
  {/snippet}
</ThemePicker>
```

Note: the outer `<fieldset role="radiogroup">` is still present. If
you don't want radiogroup semantics, render a `<select>` outside the
picker and call `setTheme` from a wrapper component instead.

### Custom radio markup

If you want native radio semantics but a custom visual layout:

```svelte
<ThemePicker label="Theme" themesUrl="/assets/themes/" themes={["light", "dark"]}>
  {#snippet children({ themes, value, setTheme, name, labelFor })}
    {#each themes as t (t)}
      <label class={`my-radio ${value === t ? "is-active" : ""}`}>
        <input
          type="radio"
          {name}
          value={t}
          checked={value === t}
          onchange={() => setTheme(t)}
        />
        <span class="my-radio-swatch" aria-hidden="true"></span>
        <span class="my-radio-label">{labelFor(t)}</span>
      </label>
    {/each}
  {/snippet}
</ThemePicker>
```

## What the snippet should *not* do

- Don't mutate `document.head` or `data-theme` directly; let the
  picker own that lifecycle.
- Don't add a competing `name` to your inputs — use the one provided.
- Don't render outside the `<fieldset>`; the picker assumes its
  children are inside the radiogroup container.
