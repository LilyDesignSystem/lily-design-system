# Props reference

Field-by-field reference for every public prop. The contract is owned
by [`../spec/index.md`](../spec/index.md) §4; this file expands the rationale and
common usage.

## `label` — required, string

`aria-label` on **both** the trigger `<button>` and the popup
`<ul role="listbox">`. Always supplied, always translatable.

Because the button renders only an `aria-hidden` glyph, this prop is
the control's *entire* accessible name — there is no visible text to
fall back on. Passing an empty or untranslated string leaves the
control announced as a bare "button". See
[accessibility.md § Tradeoff 1](./accessibility.md#tradeoff-1--the-accessible-name-rests-entirely-on-aria-label).

## `placeholder` — removed

This prop existed in 0.3.0 to name the pinned option of a native
`<select>`. There is no `<select>` and no pinned option any more, so
the prop is gone. Passing it is a no-op — it falls through `restProps`
onto the root `<div>` as a stray `placeholder` attribute.

If you were using it to give the closed control a short visible word,
render that word yourself with the `children` snippet, which replaces
the button's glyph.

## `themesUrl` — required, string

Base URL of the directory the theme CSS files are served from. A
trailing `/` is appended automatically if missing, so both
`"/assets/themes/"` and `"/assets/themes"` work.

Acceptable values:

- Absolute path: `"/assets/themes/"` — recommended for in-app assets.
- Absolute URL: `"https://cdn.example.com/themes/"` — for CDN-hosted
  themes (CORS-permitting).
- Relative path: `"./themes/"` — works but depends on the current
  document base URL; not recommended for production.

## `themes` — required, string[]

The slugs of the themes the select exposes as options. The slug is
used both as the `<option>` `value` and as the URL path segment when
constructing the stylesheet href. Choose slugs that are safe URL path
segments — kebab-case ASCII is recommended.

## `value` — optional, string (bindable)

The active slug. Two-way bindable with `bind:value={slug}` so the
surrounding code can read and write the selection.

When supplied as a non-empty string, the select treats it as the
authoritative initial value — `storageKey` and `defaultValue` are
both skipped on first mount.

## `defaultValue` — optional, string

Used during initial-value resolution when `value` is empty and
nothing was stored. If `defaultValue` is itself empty, the resolver
falls back to `"light"` (when present in `themes`) and then to
`themes[0]`.

## `storageKey` — optional, string

`localStorage` key for persistence. When set, the select:

- Reads the stored slug during initial-value resolution.
- Writes the slug to storage after every successful apply.

Errors (private mode, quota, disabled storage) are silently swallowed
— the select continues to work in-memory.

## `detectFromSystem` — optional, boolean — defaults to `false`

When `true` and neither `value` nor storage supplied a slug, resolve
the OS colour-scheme preference to a supported theme on first mount.
`matchMedia("(prefers-color-scheme: dark)")` maps to the slug `"dark"`
or `"light"`, and is used only if that slug is present in `themes`.

It sits below storage in the resolution order, so a user who explicitly
picked a theme keeps it when they later flip their OS setting:

```
value > storage > detectFromSystem > defaultValue > "light" > themes[0]
```

Returns nothing useful during SSR (and under jsdom), where `matchMedia`
is unavailable — resolution simply falls through to the next step.

This mirrors `detectFromNavigator` in `locale-chooser`. The underlying
`matchSystemTheme(themes)` helper is exported from
`ThemeChooser.svelte` if you want to call it yourself.

To *track* the OS preference for the whole session rather than only
resolving it once, see [recipes.md](./recipes.md).

## `name` — optional, string — defaults to `"theme"`

The `name` attribute of the hidden `<input type="hidden">` that carries
the value for form submission. It also serves as the discriminator on
the managed `<link>` element (`data-lily-theme-chooser="{name}"`), so
multiple selects can coexist by giving each a distinct `name`.

## `extension` — optional, string — defaults to `".css"`

File extension appended to each slug when constructing the URL. Pass
`".css?v=2"` to bust a cached version, or `".module.css"` to point at
CSS-module-style files.

## `target` — optional, HTMLElement | null

Element that receives `data-theme` on each apply. Defaults to
`document.documentElement` (i.e. `<html>`). Pass a specific element
when you want themes scoped to a section of the page rather than the
whole document.

## `themeLabels` — optional, Record<string, string>

Per-slug display label override. When unset, labels come from the
exported `themeName(slug)`, which title-cases each hyphen-separated
word: `"light"` → `"Light"`, `"high-contrast"` → `"High Contrast"`. Use
`themeLabels` for i18n or for slugs that don't gracefully title-case
(e.g. `"united-kingdom-national-health-service-england-for-patients"`).

Labels are also what the listbox's typeahead searches, so a label
override changes which keystrokes jump where.

## `onChange` — optional, (slug: string) => void

Called synchronously after every successful apply. Good place for
analytics, server sync, or notifying sibling components.

## `children` — optional, Snippet<[ChildArgs]>

**Replaces the glyph inside the trigger button.** It does *not* render
the options — the listbox and its `<li role="option">` children are
component-owned and always emitted.

The snippet receives:

```ts
type ChildArgs = {
  /** Currently selected theme slug. */
  value: string;
  /** Is the listbox open? */
  open: boolean;
  /** Resolve a slug to its display label. */
  labelFor: (theme: string) => string;
};
```

When supplied, no `.theme-chooser-icon` span is emitted. See
[custom-rendering.md](./custom-rendering.md) for patterns.

## `class` — optional, string

Extra CSS class hook on the root `<div>`. Always emitted after
`"theme-chooser"`, so consumer styles can use either selector.

## `...restProps` — any HTML attributes

Spread onto the root `<div>`. Use to attach `data-*`, `id`, event
handlers, and ARIA overrides. Note that attributes meant for the
*button* (such as `aria-labelledby`) land on the root, not the button
— pass them deliberately.

---

Lily™ and Lily Design System™ are trademarks.
