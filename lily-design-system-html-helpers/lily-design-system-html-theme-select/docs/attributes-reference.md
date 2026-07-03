# Attributes reference

Field-by-field reference for every public attribute. The contract
is owned by [`../spec/index.md`](../spec/index.md) §4; this file expands the
rationale and common usage.

## `label` — required, string

`aria-label` on the rendered `<select>`. Always supplied, always
translatable. Screen readers announce it as the control's name.

## `themes-url` — required, string

Base URL of the directory the theme CSS files are served from. A
trailing `/` is appended automatically if missing, so both
`"/assets/themes/"` and `"/assets/themes"` work.

Acceptable values:

- Absolute path: `"/assets/themes/"` — recommended for in-app
  assets.
- Absolute URL: `"https://cdn.example.com/themes/"` — for
  CDN-hosted themes (CORS-permitting).
- Relative path: `"./themes/"` — works but depends on the current
  document base URL; not recommended for production.

## `themes` — required, string (CSV)

Comma-separated list of theme slugs the select exposes as options.
Each slug is used both as the `<option>` `value` and as the URL path
segment when constructing the stylesheet href. Choose slugs that
are safe URL path segments — kebab-case ASCII is recommended.

The matching JS property `el.themes` accepts a native `string[]`:

```ts
(select as ThemeSelect).themes = ["light", "dark", "abyss"];
// equivalent to: select.setAttribute("themes", "light,dark,abyss")
```

The CSV form makes the select safe to declare in HTML without
escaping commas.

## `value` — optional, string

The active slug. Read and write via attribute or property:

```ts
select.setAttribute("value", "dark");          // → applies "dark"
select.value = "abyss";                         // → applies "abyss"
select.getAttribute("value");                   // → "abyss"
```

When supplied as a non-empty string on first mount, the select
treats it as the authoritative initial value — `storage-key` and
`default-value` are both skipped.

## `default-value` — optional, string

Used during initial-value resolution when `value` is empty and
nothing was stored. If `default-value` is itself empty, the
resolver falls back to `"light"` (when present in `themes`) and
then to `themes[0]`.

## `storage-key` — optional, string

`localStorage` key for persistence. When set, the select:

- Reads the stored slug during initial-value resolution.
- Writes the slug to storage after every successful apply.

Errors (private mode, quota, disabled storage) are silently
swallowed — the select continues to work in-memory.

## `name` — optional, string — defaults to `"theme"`

The `name` attribute on the rendered `<select>`. It also serves as
the discriminator on the managed `<link>` element
(`data-lily-theme-select="{name}"`), so multiple selects can
coexist by giving each a distinct `name`.

## `extension` — optional, string — defaults to `".css"`

File extension appended to each slug when constructing the URL.
Pass `".css?v=2"` to bust a cached version, or `".module.css"` to
point at CSS-module-style files.

## `theme-labels` — optional, string (JSON)

JSON-encoded object mapping slugs to display labels. The matching
JS property `el.themeLabels` accepts a native
`Record<string, string>`:

```ts
(select as ThemeSelect).themeLabels = {
    light: "Bright",
    dark: "Midnight",
};
// equivalent to:
// select.setAttribute("theme-labels", '{"light":"Bright","dark":"Midnight"}')
```

When unset (or for slugs not in the object), default labels
title-case the slug: `"light"` → `"Light"`. Use `theme-labels` for
i18n or for slugs that don't gracefully title-case (e.g.
`"united-kingdom-national-health-service-england-for-patients"`).

## `class` — optional, string

Extra CSS class on the rendered `<select>`. Always emitted after
`"theme-select"`, so consumer styles can use either selector:

```css
.theme-select.extra-class { /* … */ }
.extra-class .theme-select-option { /* … */ }
```

## `el.target` — JS-only, `HTMLElement | null`

Element that receives `data-theme` on each apply. Defaults to
`document.documentElement` (i.e. `<html>`). Pass a specific element
when you want themes scoped to a section of the page rather than
the whole document.

Because `HTMLElement` references are not serialisable to a string,
there is no attribute form — only the JS-property setter:

```ts
const section = document.querySelector("section.theme-region") as HTMLElement;
(select as ThemeSelect).target = section;
select.value = "dark"; // section now has data-theme="dark"
```

## Attribute / property mirroring

Every observed attribute mirrors a JS property of the same name in
camelCase:

| Attribute       | Property         | Encoding      |
| --------------- | ---------------- | ------------- |
| `label`         | `label`          | string        |
| `themes-url`    | `themesUrl`      | string        |
| `themes`        | `themes`         | CSV ↔ string[] |
| `value`         | `value`          | string        |
| `default-value` | `defaultValue`   | string        |
| `storage-key`   | `storageKey`     | string        |
| `name`          | `name`           | string        |
| `extension`     | `extension`      | string        |
| `theme-labels`  | `themeLabels`    | JSON ↔ object |
| `class`         | (use `el.classList` / `class` attr) | string |

Setting an array / object property writes back the encoded form to
the attribute, which feeds through `attributeChangedCallback` so
the select re-renders.

## Non-attribute properties

- `el.target`: `HTMLElement | null`. JS-only.

These properties have no attribute serialisation because their
runtime value cannot be expressed as a string.

## Fall-through attributes

Other attributes on the host (`id`, `data-*`, event handlers, ARIA
overrides) stay on `<theme-select>` and don't propagate to the
rendered `<select>`. This is the natural behaviour of custom
elements: the host is where the consumer declares them; the
rendered children are recreated on every render.

If you need an attribute to land on the rendered `<select>`, write a
consumer wrapper or subclass and post-process the children.
