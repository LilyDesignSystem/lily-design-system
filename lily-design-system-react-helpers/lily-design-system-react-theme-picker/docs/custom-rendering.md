# Custom rendering

The default `children` is a row of native radio inputs. When you need
a different visual — swatch buttons, a dropdown, a segmented control,
a flyout menu — pass your own render prop.

## The ChildArgs contract

The render prop receives one argument with five fields:

```ts
type ChildArgs = {
    themes: string[];                    // the available slugs
    value: string;                       // the active slug
    setTheme: (theme: string) => void;   // imperative apply (writes value)
    name: string;                        // shared identity for the picker
    labelFor: (theme: string) => string; // resolved display label
};
```

`setTheme(slug)` writes the new slug to internal state (uncontrolled)
or calls `onChange` so the consumer can update `value` (controlled),
then performs the four steps in
[spec.md §5.3](../spec.md#53-applying-a-theme).

## Patterns

### Swatch buttons

```tsx
<ThemePicker label="Theme" themesUrl="/assets/themes/" themes={["light", "dark"]}>
    {({ themes, value, setTheme, labelFor }) =>
        themes.map((t) => (
            <button
                key={t}
                type="button"
                className="theme-picker-swatch"
                data-theme={t}
                aria-pressed={value === t}
                onClick={() => setTheme(t)}
            >
                {labelFor(t)}
            </button>
        ))
    }
</ThemePicker>
```

`aria-pressed` carries the active state; the picker no longer renders
radios, so `aria-checked` is gone. The `data-theme` on each button
lets your CSS preview the swatch colours by hooking into the same
`:root[data-theme]` cascade.

### Native `<select>` dropdown

```tsx
<ThemePicker label="Theme" themesUrl="/assets/themes/" themes={["light", "dark", "abyss"]}>
    {({ themes, value, setTheme, labelFor }) => (
        <label className="theme-picker-select-label">
            <select
                value={value}
                onChange={(e) => setTheme(e.target.value)}
            >
                {themes.map((t) => (
                    <option key={t} value={t}>{labelFor(t)}</option>
                ))}
            </select>
        </label>
    )}
</ThemePicker>
```

Note: the outer `<fieldset role="radiogroup">` is still present. If
you don't want radiogroup semantics, render a `<select>` outside the
picker and call `setTheme` from a wrapper component instead.

### Custom radio markup

If you want native radio semantics but a custom visual layout:

```tsx
<ThemePicker label="Theme" themesUrl="/assets/themes/" themes={["light", "dark"]}>
    {({ themes, value, setTheme, name, labelFor }) =>
        themes.map((t) => (
            <label
                key={t}
                className={`my-radio ${value === t ? "is-active" : ""}`}
            >
                <input
                    type="radio"
                    name={name}
                    value={t}
                    checked={value === t}
                    onChange={() => setTheme(t)}
                />
                <span className="my-radio-swatch" aria-hidden="true" />
                <span className="my-radio-label">{labelFor(t)}</span>
            </label>
        ))
    }
</ThemePicker>
```

### Segmented control with explicit roles

```tsx
<ThemePicker label="Theme" themesUrl="/assets/themes/" themes={["light", "dark"]}>
    {({ themes, value, setTheme, labelFor }) => (
        <div role="tablist" className="segmented">
            {themes.map((t) => (
                <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={value === t}
                    onClick={() => setTheme(t)}
                >
                    {labelFor(t)}
                </button>
            ))}
        </div>
    )}
</ThemePicker>
```

Note: the outer `<fieldset role="radiogroup">` still wraps. The
inner `role="tablist"` overrides the announced container only
inside the tablist — VoiceOver and NVDA will announce both. If
you want pure tablist semantics, render outside the picker and
call `setTheme` from a wrapper.

## What the render prop should *not* do

- Don't mutate `document.head` or `data-theme` directly; let the
  picker own that lifecycle.
- Don't add a competing `name` to your inputs — use the one provided.
- Don't render outside the `<fieldset>`; the picker assumes its
  children are inside the radiogroup container.
- Don't call `setTheme` inside a render — only inside event handlers
  or effects.

## React-specific tips

### Stable function identity

The picker doesn't memoize `setTheme` with `useCallback`. If a
deeply nested child relies on referential equality for memo
optimisations, wrap with `useCallback` yourself in the render prop:

```tsx
{({ setTheme }) => {
    const onClick = useCallback(
        (slug: string) => () => setTheme(slug),
        [setTheme],
    );
    // …
}}
```

This is rarely needed — most consumers use inline arrow functions.

### Keys

Each rendered option needs a stable `key`. The slug is canonical.

```tsx
{themes.map((t) => <button key={t}>{labelFor(t)}</button>)}
```

### Children type

`children` is typed as `(args: ChildArgs) => React.ReactNode`, not
`React.ReactNode`. Passing a raw element (not a function) is a
TypeScript error, by design.
