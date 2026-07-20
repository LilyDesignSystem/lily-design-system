# Troubleshooting

Symptoms, root causes, and fixes for the most common problems.

## "CSS does not switch when I pick a new theme"

**Likely cause.** Your theme CSS files declare rules under `:root`
without scoping them to a `[data-theme="<slug>"]` selector. The
first-loaded theme then sets values that the next-loaded theme cannot
unset.

**Fix.** Scope every rule in every theme to
`:where(:root, :root[data-theme="<slug>"])`. The Lily™ themes follow
this convention; see [`../../themes/light.css`](../../../themes/light.css)
for an example.

## "404 on the theme href"

**Likely cause.** `themesUrl + slug + extension` does not resolve to a
real file. Check that:

- The themes directory is actually served by your static asset
  pipeline (e.g. `static/assets/themes/` under SvelteKit).
- `extension` matches the file extension (`.css`, `.module.css`, etc).
- The slug case matches the file name (case-sensitive on most
  servers).

## "SSR hydration mismatch"

**Likely cause.** The select rendered on the server with no
`aria-selected` option and an empty hidden input (because `value` was
empty), but on the client the effect resolved a non-empty initial value
from `localStorage`, `detectFromSystem`, or `defaultValue`. Svelte logs
a hydration warning when the resulting DOM differs.

**Fix.** Resolve the theme on the server (cookie, header, or session
store) and pass it to the select via `value`. See [ssr.md](./ssr.md).

Note that `detectFromSystem` can only run client-side, so it always
introduces a resolution step unless `value` or storage wins first.

## "The listbox pushes the page down when it opens"

**Likely cause.** You have not positioned it. The package ships zero
CSS, so the `<ul role="listbox">` is a normal-flow block element.

**Fix.** Give the root `position: relative` and the list
`position: absolute` — see
[styling.md § Positioning the listbox](./styling.md#positioning-the-listbox).

## "The listbox is visible even when closed"

**Likely cause.** Your CSS sets `display` on `.theme-select-list`,
which overrides the user-agent's `[hidden] { display: none }` rule.

**Fix.** Add an explicit reset:

```css
.theme-select-list[hidden] { display: none; }
```

## "Keyboard users can't see which option they're on"

**Likely cause.** You styled `[aria-selected="true"]` but not
`[data-active]`. They are different states: `aria-selected` is the
applied theme, `data-active` is the keyboard cursor.

**Fix.** Style both — see
[styling.md § Attribute hooks](./styling.md#attribute-hooks).

## "The button is empty / shows a box"

**Likely cause.** No font on the device covers U+25D1, so the glyph
falls back to `.notdef` ("tofu") or nothing.

**Fix.** Pin a font stack on `.theme-select-icon`, or replace the glyph
with an inline SVG via the `children` snippet. See
[accessibility.md § Tradeoff 3](./accessibility.md#tradeoff-3--the-glyph-is-font-dependent).

## "`placeholder` does nothing"

The prop was removed along with the native `<select>` it belonged to.
Passing it now falls through `restProps` onto the root `<div>` as a
stray attribute.

To put a visible word on the trigger, use the `children` snippet — it
replaces the button's glyph. See
[custom-rendering.md](./custom-rendering.md).

## "My `children` snippet renders nothing selectable"

The snippet no longer renders options — it replaces the glyph inside
the trigger button. The listbox and its options are component-owned.
See [custom-rendering.md](./custom-rendering.md).

## "`detectFromSystem` doesn't do anything"

Checklist:

- The OS-preferred slug (`"dark"` or `"light"`) must actually be in
  your `themes` array; otherwise `matchSystemTheme` returns `""` and
  resolution falls through.
- `value` and `localStorage[storageKey]` both take precedence. Clear
  storage when testing.
- It resolves once on mount. To follow OS changes for the session, add
  a `matchMedia` listener — see [recipes.md](./recipes.md).
- It never runs on the server, and never under jsdom, because
  `matchMedia` is unavailable there.

## "Theme does not persist across reloads"

Checklist:

- `storageKey` is set.
- `localStorage` is available (not blocked by private mode or
  browser extensions).
- No other component is overwriting the same key on mount.

## "The word 'default' appears in my select"

It does not come from this component. The select only emits
`themeName(slug)` (title-cased) or the value from `themeLabels`. Check
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
  render (e.g. inside a keyed `{#each}` whose key is unstable).
- Confirm the consumer isn't manually removing the managed `<link>`
  on each render.

## "TypeScript complains about spreading restProps"

`Props` includes `[key: string]: unknown` so any HTML attribute is
acceptable, but strict TS configs may flag specific attributes. Use a
type assertion at the call site, or supply the attribute via
`element.setAttribute` inside an `onMount`.

## "Theme switch works locally but not in production"

Almost always a caching issue. Either:

- Add a cache-busting suffix via `extension` (e.g. `.css?v=1`), or
- Configure the static asset server to send `Cache-Control:
  must-revalidate` for theme CSS files.

---

Lily™ and Lily Design System™ are trademarks.
