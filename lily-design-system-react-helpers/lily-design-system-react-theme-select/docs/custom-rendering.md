# Custom rendering

The default `children` is a list of native `<option>` elements inside
the `<select>`. When you need a different option layout — grouped
options via `<optgroup>`, custom labels — pass your own render prop.
The render output is placed inside the `<select>`, so it should return
`<option>` (or `<optgroup>`) elements.

If you need a fundamentally different control — swatch buttons, a
segmented control, a flyout menu — render that control outside the
select and drive it by calling `setTheme` from a wrapper (see the
button-group pattern below).

## The ChildArgs contract

The render prop receives one argument with five fields:

```ts
type ChildArgs = {
    themes: string[];                    // the available slugs
    value: string;                       // the active slug
    setTheme: (theme: string) => void;   // imperative apply (writes value)
    name: string;                        // shared identity for the select
    labelFor: (theme: string) => string; // resolved display label
};
```

`setTheme(slug)` writes the new slug to internal state (uncontrolled)
or calls `onChange` so the consumer can update `value` (controlled),
then performs the four steps in
[spec/index.md §5.3](../spec/index.md#53-applying-a-theme).

## Patterns

### Custom option labels and grouping

The render output lands inside the `<select>`, so return `<option>`
(and optionally `<optgroup>`) elements:

```tsx
<ThemeSelect label="Theme" themesUrl="/assets/themes/" themes={["light", "dark", "abyss"]}>
    {({ themes, value, labelFor }) => (
        <optgroup label="Available themes">
            {themes.map((t) => (
                <option
                    key={t}
                    className="theme-select-option"
                    value={t}
                >
                    {labelFor(t)}
                </option>
            ))}
        </optgroup>
    )}
</ThemeSelect>
```

The select's own `onChange` calls `setTheme` with the chosen
`<option>`'s `value`, so you do not wire click handlers per option —
the native `<select>` does it for you.

### Swatch buttons (rendered outside the select)

A `<select>` only accepts `<option>` / `<optgroup>` children, so a
button group is built standalone and driven by `setTheme`. Wrap the
select so you can call `setTheme` imperatively, or lift the state into
your own component and call the exported helpers. The simplest form
uses a controlled `value` and your own buttons:

```tsx
function ThemeSwatches({ value, setTheme, themes, labelFor }: {
    value: string;
    setTheme: (slug: string) => void;
    themes: string[];
    labelFor: (slug: string) => string;
}) {
    return (
        <div role="group" aria-label="Theme">
            {themes.map((t) => (
                <button
                    key={t}
                    type="button"
                    className="theme-select-swatch"
                    data-theme={t}
                    aria-pressed={value === t}
                    onClick={() => setTheme(t)}
                >
                    {labelFor(t)}
                </button>
            ))}
        </div>
    );
}
```

`aria-pressed` carries the active state. The `data-theme` on each
button lets your CSS preview the swatch colours by hooking into the
same `:root[data-theme]` cascade.

### Segmented control with explicit roles

Like the swatch buttons, a segmented control is rendered standalone
(not inside the `<select>`) because it isn't an `<option>` list:

```tsx
function ThemeSegments({ value, setTheme, themes, labelFor }: {
    value: string;
    setTheme: (slug: string) => void;
    themes: string[];
    labelFor: (slug: string) => string;
}) {
    return (
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
    );
}
```

## What the render prop should *not* do

- Don't mutate `document.head` or `data-theme` directly; let the
  select own that lifecycle.
- Don't return non-`<option>` children from the render prop — they
  render inside the `<select>`, which only accepts `<option>` /
  `<optgroup>`. For other controls, render outside the select and
  call `setTheme`.
- Don't call `setTheme` inside a render — only inside event handlers
  or effects.

## React-specific tips

### Stable function identity

The select doesn't memoize `setTheme` with `useCallback`. If a
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
