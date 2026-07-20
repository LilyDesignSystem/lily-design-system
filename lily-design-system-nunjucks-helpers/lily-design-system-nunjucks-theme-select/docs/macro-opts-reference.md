# Macro opts reference

Field-by-field reference for every key the `themeSelect(opts)`
macro understands. The contract is owned by
[`../spec/index.md`](../spec/index.md) §4; this file expands the rationale and
common usage.

## `label` — required, string

`aria-label` on the `<select>`. Always supplied, always
translatable. Screen readers announce it as the control's name.

## `placeholder` — optional, string — defaults to `label`

Text of the always-rendered placeholder `<option>` that sits first
inside the `<select>`. The closed control shows this word instead of
the active theme's name, so the control's width stays constant
regardless of how long your theme names are.

Defaults to the value of `label`, which keeps the package
i18n-clean: no user-facing string is ever hardcoded. Supply
`placeholder` separately when you want a long, descriptive
`aria-label` but a short visible word:

```njk
{{ themeSelect({
  label: "Choose a colour theme",
  placeholder: "Theme",
  themesUrl: "/assets/themes/",
  themes: ["light", "dark"]
}) }}
```

Note that because the control always displays the placeholder, the
`<select>`'s own `value` is always `""` — see
[`../spec/index.md` §4.2](../spec/index.md) and
[accessibility.md](./accessibility.md) for the tradeoff.

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

The slugs of the themes the select exposes as options. The slug is
used both as the `<option>` `value` and as the URL path segment when
the client.js constructs the stylesheet href. Choose slugs that
are safe URL path segments — kebab-case ASCII is recommended.

## `value` — optional, string

The currently-active slug. The macro serialises it as
`data-lily-theme-select-value` on the `<select>` root, and omits the
attribute entirely when `value` is empty. It does **not** render
`selected` on the matching `<option>` — the placeholder stays the only
selected option, so the closed control never flashes the theme name
before the client runs (see [ssr.md](./ssr.md)).

When supplied as a non-empty string and the consumer is pre-
resolving the theme on the server (cookie, header), this is the
prop to use. The client.js reads the attribute on init and applies
the matching theme.

## `defaultValue` — optional, string

Used during initial-value resolution by the client.js when
`storageKey` is unset and no `data-lily-theme-select-value` is present.
If `defaultValue` is itself empty, the resolver falls back to
`"light"` (when present in `themes`) and then to `themes[0]`.

The macro serialises this as `data-lily-theme-select-default-value`
on the root.

## `storageKey` — optional, string

`localStorage` key for persistence. When set, the client.js:

- Reads the stored slug during initial-value resolution.
- Writes the slug to storage after every successful apply.

Errors (private mode, quota, disabled storage) are silently
swallowed — the select continues to work in-memory.

The macro serialises this as
`data-lily-theme-select-storage-key` on the root.

## `name` — optional, string — defaults to `"theme"`

The `<select>` `name` attribute (default `"theme"`). It also serves
as the discriminator on the managed `<link>` element
(`data-lily-theme-select="{name}"`), so multiple selects can
coexist by giving each a distinct `name`.

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

The macro reads this at render time; the client.js does not
inspect labels.

## `classes` — optional, string

Extra CSS class hook on the `<select>`. Always emitted after
`"theme-select"`, so consumer styles can use either selector.

## `attributes` — optional, object<string, string>

Arbitrary HTML attributes to spread onto the root `<select>`.
Use this for `id`, `data-testid`, `data-cy`, analytics hooks, or
ARIA overrides you don't want the macro to manage. The macro
spreads them after the `data-lily-*` configuration attributes, so
a consumer can override any of them.

```njk
{{ themeSelect({
    label: "Theme",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark"],
    attributes: { "id": "theme-select", "data-testid": "tp" }
}) }}
```

## Custom rendering opts

There is no `bodyCaller` opt in the shipped macro — see
[`./custom-rendering.md`](./custom-rendering.md) for the
`{% call %}` pattern and the recipe for adding `opts.bodyCaller`
to a forked macro.

## Attribute fall-through summary

The macro emits the following attributes on `<select>`, in
order:

1. `class="theme-select {classes}"`
2. `aria-label="{label}"`
3. `name="{name}"`
4. `data-lily-theme-select-root`
5. `data-lily-theme-select-name="{name}"`
6. `data-lily-theme-select-themes-url="{themesUrl}"`
7. `data-lily-theme-select-extension="{extension}"`
8. `data-lily-theme-select-storage-key="{storageKey}"`
9. `data-lily-theme-select-default-value="{defaultValue}"`
10. Each `{key}="{value}"` from `opts.attributes`.

If a key in `opts.attributes` collides with one above, the spread
attribute wins (HTML uses the last occurrence). Use this to
override `aria-label` (rare) or any `data-lily-*` field.

---

Lily™ and Lily Design System™ are trademarks.
