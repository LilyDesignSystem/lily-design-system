# Troubleshooting

Symptoms, root causes, and fixes for the most common problems.

## "CSS does not switch when I pick a new theme"

**Likely cause.** Your theme CSS files declare rules under `:root`
without scoping them to a `[data-theme="<slug>"]` selector. The
first-loaded theme then sets values that the next-loaded theme cannot
unset.

**Fix.** Scope every rule in every theme to
`:where(:root, :root[data-theme="<slug>"])`. The Lily™ themes follow
this convention; see `../../../themes/light.css` for an example.

## "404 on the theme href"

**Likely cause.** `themesUrl + slug + extension` does not resolve to a
real file. Check that:

- The themes directory is actually served by your static asset
  pipeline (e.g. `public/assets/themes/` under Next.js).
- `extension` matches the file extension (`.css`, `.module.css`, etc).
- The slug case matches the file name (case-sensitive on most
  servers).

## "The dropdown pushes the rest of the page down when it opens"

**Likely cause.** The package ships no CSS, including no positioning.
An unstyled `<ul>` is a block element in normal flow.

**Fix.** Give the root `position: relative` and the list
`position: absolute`. See [styling.md](./styling.md#positioning-is-yours).

## "The dropdown is always open" / "never opens"

**Likely cause.** Your CSS sets `display` on `.theme-select-list`,
overriding the UA stylesheet's `[hidden] { display: none }`. The
component toggles the `hidden` attribute; it does not set `display`.

**Fix.** Re-assert the rule after your own:

```css
.theme-select-list[hidden] {
    display: none;
}
```

## "The button shows an empty box instead of the half-circle"

**Likely cause.** The default glyph is U+25D1, a Unicode character, not
a bundled icon. The user's device has no font covering it.

**Fix.** Supply your own glyph via `children` — an inline SVG, or a
character from a font you actually ship. Keep it `aria-hidden="true"`.
See [custom-rendering.md](./custom-rendering.md).

## "The active option has no visible highlight while I arrow through it"

**Likely cause.** You styled the options with `:focus` or
`:focus-visible`. Options never take DOM focus — the listbox holds
focus and tracks the active option with `aria-activedescendant`.

**Fix.** Style the `[data-active]` attribute instead:

```css
.theme-select-option[data-active] {
    background: var(--theme-color-base-200, highlight);
}
```

## "SSR hydration mismatch"

**Likely cause.** The component rendered on the server with no option
selected (because `value` was empty), but on the client the first
effect resolved a non-empty initial value from `localStorage` or
`defaultValue`. React logs a hydration warning when the resulting DOM
differs.

Option and listbox ids are not the cause: they come from `useId`, which
is deliberately stable across server and client.

**Fix.** Resolve the theme on the server (cookie, header, or session
store) and pass it to the select via `value`. See [ssr.md](./ssr.md).

## "Theme does not persist across reloads"

Checklist:

- `storageKey` is set.
- `localStorage` is available (not blocked by private mode or
  browser extensions).
- No other component is overwriting the same key on mount.

## "The word 'default' appears in my select"

It does not come from this component. The select only emits the
slug (title-cased word by word) or the value from `themeLabels`. Check
the consumer markup wrapping the select for hardcoded "(default)"
annotations.

## "Multiple selects fight over `<html data-theme>`"

When two selects share `document.documentElement` as the target, the
last apply wins. Either pass a per-select `target` element, or
designate one select as the "global" one and have the others apply
their themes to a wrapping element via `target`.

## "The select re-fetches the same CSS file on every render"

It shouldn't — the managed `<link>` is reused, and changing
`themesUrl` is not enough to re-trigger `applyTheme`. If you observe
re-fetches:

- Confirm the surrounding component isn't remounting the select every
  render (e.g. inside a list whose key is unstable).
- Confirm the consumer isn't manually removing the managed `<link>`
  on each render.

## "TypeScript complains about spreading restProps"

`Props` extends `HTMLAttributes<HTMLDivElement>` minus `onChange`,
`children`, and `defaultValue`, so any HTML attribute valid on a
`<div>` is acceptable. Attributes that only made sense on the old
`<select>` root (`required`, `disabled`, `form`, `autoComplete`) are no
longer part of the surface. Strict TS configs may flag specific
attributes; use a type assertion at the call site, or supply the
attribute via `element.setAttribute` inside a `useEffect`.

## "Theme switch works locally but not in production"

Almost always a caching issue. Either:

- Add a cache-busting suffix via `extension` (e.g. `.css?v=1`), or
- Configure the static asset server to send `Cache-Control:
  must-revalidate` for theme CSS files.

## "Error: useState is not a function" / "Cannot read property 'useState' of null"

**Likely cause.** The select's `.tsx` file is being imported into a
server component or a non-React context. The select is a client
component.

**Fix.** Confirm `ThemeSelect.tsx` starts with `"use client"`. The
consumer file (the one that renders `<ThemeSelect>`) does NOT need
the directive — Next.js follows the import graph and the select's
own directive is sufficient.

If the consumer's file ALSO needs to call `useState` /
`useEffect` (e.g. to manage `value` state), the consumer file
itself becomes a client component and needs `"use client"`.

## "Warning: A component is changing a controlled component to be uncontrolled"

**Likely cause.** Switched between `value={something}` and
`value={undefined}` mid-lifecycle. The select picks controlled vs
uncontrolled at first render and assumes the mode is stable.

**Fix.** Pick one mode and stick with it. If your `value` might be
undefined initially, coalesce to empty string:

```tsx
<ThemeSelect value={theme ?? ""} onChange={setTheme} {...required} />
```

## "Storybook story renders no selected option"

**Likely cause.** The select is uncontrolled and waits for the
first-effect resolution before any option carries
`aria-selected="true"`. Storybook's isolated render may not have a
chance for the effect to run before the screenshot.

**Fix.** Pass an explicit `value` or `defaultValue` to make the
initial state deterministic:

```tsx
export const Default: Story = {
    args: {
        label: "Theme",
        themesUrl: "/t/",
        themes: ["light", "dark"],
        defaultValue: "light",
    },
};
```

## "Tests fail because document.head is polluted"

**Likely cause.** A previous test's managed `<link>` is still in
`document.head`.

**Fix.** Reset in `beforeEach`:

```ts
beforeEach(() => {
    document.head
        .querySelectorAll("link[data-lily-theme-select]")
        .forEach((el) => el.remove());
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
});
```

See [`../AGENTS/testing.md`](../AGENTS/testing.md) for the canonical
reset.

---

Lily™ and Lily Design System™ are trademarks.
