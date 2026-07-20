# Macro opts reference

Field-by-field reference for every key the `themeSelect(opts)`
macro understands. The contract is owned by
[`../spec/index.md`](../spec/index.md) §4; this file expands the rationale and
common usage.

## `label` — required, string

`aria-label` on **both** the button and the listbox. Always
supplied, always translatable.

The button is icon-only — its glyph is `aria-hidden="true"` — so
`label` is the only accessible name it has. Screen readers announce
it as the control's name; the collapsed button never announces the
active theme. See [accessibility.md](./accessibility.md) for the
tradeoff and the `.theme-select-status` region that compensates for
it.

There is no `placeholder` opt. It belonged to the native `<select>`
this macro used to render, and went away with it — along with the
`theme-select-placeholder` CSS hook.

## `themesUrl` — required, string

Base URL of the directory the theme CSS files are served from. The
client.js normalises a trailing `/` at runtime, so both
`"/assets/themes/"` and `"/assets/themes"` work.

Acceptable values:

- Absolute path: `"/assets/themes/"` — recommended for in-app
  assets.
- Absolute URL: `"https://cdn.example.com/themes/"` — for
  CDN-hosted themes (CORS-permitting).
- Relative path: `"./themes/"` — works but depends on the current
  document base URL; not recommended for production.

## `themes` — required, array of strings

The slugs of the themes the control exposes as options. The slug is
used both as the `<li>` `data-value` and as the URL path segment when
the client.js constructs the stylesheet href. Choose slugs that
are safe URL path segments — kebab-case ASCII is recommended.

The array order is the listbox order, which is also the order
`Arrow Down`, `Home`/`End`, and typeahead traverse.

## `value` — optional, string

The currently-active slug. The macro serialises it as
`data-lily-theme-select-value` on the root `<div>`, and omits the
attribute entirely when `value` is empty. That attribute remains the
only channel by which `value` reaches the client.

`value` also feeds the macro's **server-side** selected resolution
(`value or defaultValue or ("light" if present else themes[0])`), so
the rendered `<li>` for this slug carries `aria-selected="true"` and
the hidden input is pre-filled with it.

When supplied as a non-empty string and the consumer is pre-resolving
the theme on the server (cookie, header, session, signed-in profile),
this is the prop to use. The client.js reads the attribute on init and
applies the matching theme.

`value` is the **first** input in the client's resolution order, so it
outranks `localStorage`. This changed: the helper used to put storage
first, which meant a server-resolved theme was silently overridden by a
stale local entry — the exact case this catalog exists to serve. See
[ssr.md](./ssr.md), spec §5.2, and the BREAKING note in the
[CHANGELOG](../CHANGELOG.md).

## `defaultValue` — optional, string

Used during initial-value resolution by the client.js when `value`,
storage, and system detection have all come up empty. If `defaultValue`
is itself empty, the resolver falls back to `"light"` (when present in
`themes`) and then to `themes[0]`.

Use `defaultValue` for "what a brand new visitor with no signals should
get", and `value` for "what this particular request resolved to".

It is also the second term in the macro's server-side selected
resolution, so it decides which option is `aria-selected` in the
rendered HTML when `value` is absent.

The macro serialises this as `data-lily-theme-select-default-value`
on the root.

## `storageKey` — optional, string

`localStorage` key for persistence. When set, the client.js:

- Reads the stored slug during initial-value resolution.
- Writes the slug to storage after every successful apply.

Errors (private mode, quota, disabled storage) are silently
swallowed — the select continues to work in-memory.

Storage is consulted **after** `value` and **before** system detection.
A returning visitor with a saved choice and no server-resolved theme
therefore lands on their saved choice, exactly as before; what changed
is only that an explicit `value` now wins a genuine conflict.

The macro serialises this as
`data-lily-theme-select-storage-key` on the root.

## `detectFromSystem` — optional, boolean — defaults to `false`

When true, and when neither `value` nor storage supplied a slug, the
client resolves `matchMedia("(prefers-color-scheme: dark)")` to
`"dark"` or `"light"` — provided that slug is among `themes`. If it is
not, detection contributes nothing and resolution falls through to
`defaultValue`.

Mirrors `detectFromNavigator` in the locale-select helper, and occupies
the same position in the chain.

Detection is **client-only**. There is no `matchMedia` at Nunjucks
render time, so the macro emits
`data-lily-theme-select-detect-from-system` and nothing more; its
server-rendered `aria-selected` continues to resolve from
`value or defaultValue or ("light" if present else themes[0])`. With
detection on and no `value`, expect the server markup to name one theme
and the client to apply another — a light first paint on a
dark-preferring machine. The listbox is closed and the button inert
until the client runs, so this is never visible as an inconsistent
control, but the flash is real. Resolve server-side and pass `value` if
you need first-paint agreement. Spec §5.8 covers this in full.

The exported `matchSystemTheme(themes)` helper performs the same
resolution, so consumers can reuse it directly — for a "follow the OS"
toggle, or to react to a live `change` event on the media query. It
returns `""` when `matchMedia` is unavailable, which is the SSR guard.

## `name` — optional, string — defaults to `"theme"`

The hidden input's `name` attribute (default `"theme"`), so an
enclosing form submits the active theme under this key. It also
serves as:

- the discriminator on the managed `<link>` element
  (`data-lily-theme-select="{name}"`), so multiple controls can
  coexist without swapping each other's stylesheet; and
- the default id prefix (`"theme-select-{name}"`), so distinct
  names also produce distinct listbox and option ids.

## `extension` — optional, string — defaults to `".css"`

File extension appended to each slug when constructing the URL.
Pass `".css?v=2"` to bust a cached version, or `".module.css"` to
point at CSS-module-style files.

The macro serialises this as
`data-lily-theme-select-extension` on the root.

## `themeLabels` — optional, object<string, string>

Per-slug display label override. When unset, default labels
title-case the slug: `"light"` → `"Light"`, `"abyss"` →
`"Abyss"`. Use `themeLabels` for i18n or for slugs that don't
gracefully title-case (e.g.
`"united-kingdom-national-health-service-england-for-patients"`).

The macro reads this at render time. The client.js reads the
rendered option text back as its **typeahead corpus**, so these
labels — not the slugs — are what a user types against.

The default title-casing rule is also exported from the client module
as `themeName(slug)` (`"high-contrast"` → `"High Contrast"`), mirroring
`localeName(code)` in locale-select. Use it wherever you need to render
a theme's display name outside the control — a status region, a
settings summary — instead of re-deriving the rule. A Nunjucks macro
cannot call into the client module, so the macro applies the same rule
in template syntax and a test holds the two in agreement.

## `id` — optional, string — defaults to `"theme-select-{name}"`

Id prefix for the listbox and its options:

- the `<ul role="listbox">` gets `id="{id}-list"`, which the button
  references via `aria-controls`;
- each `<li role="option">` gets `id="{id}-option-{index}"`, which
  the client references via `aria-activedescendant`.

The default is derived from `name`, which is deterministic and
SSR-safe: two renders of the same opts produce byte-identical ids,
with no `Math.random()` or `Date.now()` in the markup.

A Nunjucks macro cannot hold a module-level counter, so unlike the
Svelte / React / Vue helpers there is no automatic per-instance
uniqueness. **Two instances that share a `name` must be given
distinct `id`s**, or their ids collide and `aria-controls` /
`aria-activedescendant` resolve to the wrong element:

```njk
{{ themeSelect({
    label: "Theme",
    id: "header-theme",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark"]
}) }}

{{ themeSelect({
    label: "Theme",
    id: "footer-theme",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark"]
}) }}
```

Giving each instance a distinct `name` achieves the same thing, and
is usually what you want anyway — see
[`../examples/03-multiple-selects.njk`](../examples/03-multiple-selects.njk).

## `classes` — optional, string

Extra CSS class hook on the root `<div>`. Always emitted after
`"theme-select"`, so consumer styles can use either selector.

## `attributes` — optional, object<string, string>

Arbitrary HTML attributes to spread onto the root `<div>`.
Use this for `id`, `data-testid`, `data-cy`, analytics hooks, or
ARIA overrides you don't want the macro to manage.

Note that a DOM `id` passed here lands on the **root** and has
nothing to do with the `id` opt, which is the listbox/option id
prefix.

```njk
{{ themeSelect({
    label: "Theme",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark"],
    attributes: { "id": "theme-select", "data-testid": "tp" }
}) }}
```

## Custom rendering opts

There is no opt for custom rendering. The macro's one extension
point is the `{% call %}` block, whose body replaces the button's
glyph — see [`./custom-rendering.md`](./custom-rendering.md).

## Attribute fall-through summary

The macro emits the following attributes on the root `<div>`, in
order:

1. `class="theme-select {classes}"`
2. `data-lily-theme-select-root`
3. `data-lily-theme-select-name="{name}"`
4. `data-lily-theme-select-themes-url="{themesUrl}"`
5. `data-lily-theme-select-extension="{extension}"`
6. `data-lily-theme-select-storage-key="{storageKey}"`
7. `data-lily-theme-select-default-value="{defaultValue}"`
8. `data-lily-theme-select-value="{value}"` — only when `value` is
   non-empty.
9. Each `{key}="{value}"` from `opts.attributes`.

`aria-label` is **not** on this list any more: it lives on the
button and the listbox, not on the root, so `opts.attributes`
cannot override it. Change `opts.label` instead.

Avoid colliding an `opts.attributes` key with one of the
`data-lily-*` names above: duplicate attributes on one element are
not a supported override mechanism.

---

Lily™ and Lily Design System™ are trademarks.
