# Custom rendering

The `children` render prop replaces the glyph **inside the trigger
button**. Nothing else. The component owns the listbox, the options,
their ids, their ARIA state, and the whole keyboard contract — so a
custom glyph cannot break the pattern.

By default the button holds:

```html
<span class="theme-chooser-icon" aria-hidden="true">◑</span>
```

that is U+25D1 CIRCLE WITH RIGHT HALF BLACK (`&#9681;`), exported from
`ThemeChooser.tsx` as `CIRCLE_WITH_RIGHT_HALF_BLACK`. Passing `children`
replaces that span entirely — the `.theme-chooser-icon` hook disappears
unless you re-render it yourself.

## The ChildArgs contract

The render prop receives one argument with three fields:

```ts
type ChildArgs = {
    value: string;                       // the active slug
    open: boolean;                       // is the listbox expanded?
    labelFor: (theme: string) => string; // resolved display label
};
```

- `value` — the active slug. Empty string until the first-mount
  resolution completes.
- `open` — whether the listbox is currently expanded. Useful for
  flipping a caret.
- `labelFor(slug)` — `themeLabels[slug]` when supplied, otherwise the
  slug with each hyphen-separated word title-cased.

There is no `setTheme`, no `themes`, and no `name`: a glyph has no
reason to mutate the selection or enumerate the catalog. Consumers who
need to drive the value from their own UI use the controlled
`value` + `onChange` pair instead — see
[Driving the theme from your own control](#driving-the-theme-from-your-own-control).

## The one rule

**Keep everything you render `aria-hidden="true"`.**

The button's accessible name comes from `aria-label`, which is the
`label` prop. Anything visible you render that is *not* hidden joins the
accessible name computation and can leave the announced name out of step
with the visible text — WCAG 2.5.3, Label in Name. Either hide your
glyph content, or make `label` start with the visible text.

## Patterns

### A live swatch of the active theme

```tsx
<ThemeChooser
    label="Theme"
    themesUrl="/assets/themes/"
    themes={["light", "dark", "abyss"]}
>
    {({ value, open, labelFor }) => (
        <>
            <span
                className="theme-chooser-swatch"
                data-theme={value}
                aria-hidden="true"
            />
            <span aria-hidden="true">{labelFor(value)}</span>
            <span aria-hidden="true">{open ? "▴" : "▾"}</span>
        </>
    )}
</ThemeChooser>
```

The `data-theme` on the swatch lets your CSS preview the theme's colours
through the same `:root[data-theme]` cascade the themes themselves use.

Working file: [`../examples/custom-rendering.tsx`](../examples/custom-rendering.tsx).

### Your own SVG icon

The default glyph is a Unicode character, so its appearance depends on
the fonts installed on the user's device — it can render at an odd
weight, fall back to a box, or be missing. When the visual must be
certain, ship your own vector:

```tsx
<ThemeChooser label="Theme" themesUrl="/assets/themes/" themes={themes}>
    {() => (
        <svg
            className="theme-chooser-icon"
            viewBox="0 0 16 16"
            width="16"
            height="16"
            aria-hidden="true"
            focusable="false"
        >
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" />
            <path d="M8 1a7 7 0 0 1 0 14Z" fill="currentColor" />
        </svg>
    )}
</ThemeChooser>
```

`focusable="false"` keeps legacy Internet Explorer / Edge from putting
the SVG in the tab order; `aria-hidden` keeps it out of the name.

### A visible text trigger

If you want the button to state the active theme rather than show an
icon, render the label and extend `label` so the accessible name still
contains the visible text:

```tsx
<ThemeChooser
    label={`Theme: ${labelFor(theme)}`}
    themesUrl="/assets/themes/"
    themes={themes}
    value={theme}
    onChange={setTheme}
>
    {({ value, labelFor }) => (
        <span aria-hidden="true">{labelFor(value)}</span>
    )}
</ThemeChooser>
```

This also removes the reason to ship the separate status region
described in [accessibility.md](./accessibility.md) — the control itself
now reports its value.

## Driving the theme from your own control

`children` cannot change the theme. To build a different control
entirely — swatch buttons, a segmented control, a command palette entry
— run the select in controlled mode and drive `value` from your own
state:

```tsx
function ThemeSwatches({
    value,
    setTheme,
    themes,
    labelFor,
}: {
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
                    className="theme-chooser-swatch"
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

Render it alongside a controlled `<ThemeChooser value={theme}
onChange={setTheme} />` — writing `value` is what applies the theme, so
your buttons and the select stay in step. You own the keyboard contract
of whatever pattern you build: a button group gets `aria-pressed` and
`Tab` between buttons, with no arrow-key navigation unless you add it.

## What the render prop should *not* do

- Don't render the options. The component owns them; anything you
  render lands inside the button.
- Don't render interactive elements (`<button>`, `<a>`, `<input>`).
  They would nest inside the trigger button, which is invalid HTML and
  breaks activation.
- Don't mutate `document.head` or `data-theme` directly; let the
  component own that lifecycle.
- Don't leave content un-`aria-hidden`. See [The one rule](#the-one-rule).

## React-specific tips

### `labelFor` identity

`labelFor` is re-created on each render — it is a pure function of
`themeLabels`, so don't rely on referential equality for memo
optimisations. If a deeply nested child needs a stable reference, wrap
it yourself:

```tsx
{({ value, labelFor }) => {
    const stable = useCallback(labelFor, [value]);
    // …
}}
```

This is rarely needed; glyph content is cheap to re-render.

### Children type

`children` is typed as `(args: ChildArgs) => React.ReactNode`, not
`React.ReactNode`. Passing a raw element (not a function) is a
TypeScript error, by design.

### Fragments

The render output goes straight inside the `<button>`, so a fragment
with several spans is fine — no wrapper element is required or added.

---

Lily™ and Lily Design System™ are trademarks.
