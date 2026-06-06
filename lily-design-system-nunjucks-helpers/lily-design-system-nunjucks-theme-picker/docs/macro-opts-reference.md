# Macro opts reference

Field-by-field reference for every key the `themePicker(opts)`
macro understands. The contract is owned by
[`../spec.md`](../spec.md) §4; this file expands the rationale and
common usage.

## `label` — required, string

`aria-label` on the `<fieldset role="radiogroup">`. Always
supplied, always translatable. Screen readers announce it as the
group's name.

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

The slugs of the themes the picker exposes as options. The slug is
used both as the radio `value` and as the URL path segment when
the client.js constructs the stylesheet href. Choose slugs that
are safe URL path segments — kebab-case ASCII is recommended.

## `value` — optional, string

The currently-active slug to render with `checked`. The macro
emits `checked` on the matching radio when `value === slug`.

When supplied as a non-empty string and the consumer is pre-
resolving the theme on the server (cookie, header), this is the
prop to use. The client.js sees the `checked` radio on init and
applies the matching theme.

## `defaultValue` — optional, string

Used during initial-value resolution by the client.js when
`storageKey` is unset and no radio is rendered with `checked`. If
`defaultValue` is itself empty, the resolver falls back to
`"light"` (when present in `themes`) and then to `themes[0]`.

The macro serialises this as `data-lily-theme-picker-default-value`
on the root.

## `storageKey` — optional, string

`localStorage` key for persistence. When set, the client.js:

- Reads the stored slug during initial-value resolution.
- Writes the slug to storage after every successful apply.

Errors (private mode, quota, disabled storage) are silently
swallowed — the picker continues to work in-memory.

The macro serialises this as
`data-lily-theme-picker-storage-key` on the root.

## `name` — optional, string — defaults to `"theme"`

The `name` attribute shared by the radio inputs. It also serves
as the discriminator on the managed `<link>` element
(`data-lily-theme-picker="{name}"`), so multiple pickers can
coexist by giving each a distinct `name`.

## `extension` — optional, string — defaults to `".css"`

File extension appended to each slug when constructing the URL.
Pass `".css?v=2"` to bust a cached version, or `".module.css"` to
point at CSS-module-style files.

The macro serialises this as
`data-lily-theme-picker-extension` on the root.

## `themeLabels` — optional, object<string, string>

Per-slug display label override. When unset, default labels
title-case the slug: `"light"` → `"Light"`, `"abyss"` →
`"Abyss"`. Use `themeLabels` for i18n or for slugs that don't
gracefully title-case (e.g.
`"united-kingdom-national-health-service-england-for-patients"`).

The macro reads this at render time; the client.js does not
inspect labels.

## `classes` — optional, string

Extra CSS class hook on the `<fieldset>`. Always emitted after
`"theme-picker"`, so consumer styles can use either selector.

## `attributes` — optional, object<string, string>

Arbitrary HTML attributes to spread onto the root `<fieldset>`.
Use this for `id`, `data-testid`, `data-cy`, analytics hooks, or
ARIA overrides you don't want the macro to manage. The macro
spreads them after the `data-lily-*` configuration attributes, so
a consumer can override any of them.

```njk
{{ themePicker({
    label: "Theme",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark"],
    attributes: { "id": "theme-picker", "data-testid": "tp" }
}) }}
```

## Custom rendering opts

There is no `bodyCaller` opt in the shipped macro — see
[`./custom-rendering.md`](./custom-rendering.md) for the
`{% call %}` pattern and the recipe for adding `opts.bodyCaller`
to a forked macro.

## Attribute fall-through summary

The macro emits the following attributes on `<fieldset>`, in
order:

1. `class="theme-picker {classes}"`
2. `role="radiogroup"`
3. `aria-label="{label}"`
4. `data-lily-theme-picker-root`
5. `data-lily-theme-picker-name="{name}"`
6. `data-lily-theme-picker-themes-url="{themesUrl}"`
7. `data-lily-theme-picker-extension="{extension}"`
8. `data-lily-theme-picker-storage-key="{storageKey}"`
9. `data-lily-theme-picker-default-value="{defaultValue}"`
10. Each `{key}="{value}"` from `opts.attributes`.

If a key in `opts.attributes` collides with one above, the spread
attribute wins (HTML uses the last occurrence). Use this to
override `aria-label` (rare), `role`, or any `data-lily-*` field.
