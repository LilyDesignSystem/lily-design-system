# Attributes reference

Field-by-field reference for every public attribute. The contract
is owned by [`../spec/index.md`](../spec/index.md) §4; this file expands the
rationale and common usage.

## `label` — required, string

`aria-label` on **both** the rendered `<button>` and the rendered
`<ul role="listbox">`. Always supplied, always translatable.

The control is icon-only, so this is the *entire* accessible name —
there is no visible text to fall back on. A vague `label` leaves the
control unusable to screen-reader users, and the absence of a
visible label means the control fails WCAG 2.5.3 Label in Name
unless you add one yourself. See
[accessibility.md](./accessibility.md#1-it-is-an-icon-only-control).

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

Comma-separated list of theme slugs the control exposes as options.
Each slug becomes one `<li role="option">` and is used as the URL
path segment when constructing the stylesheet href. Choose slugs
that are safe URL path segments — kebab-case ASCII is recommended.

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

## `detect-from-system` — optional, boolean attribute

Present (and not `="false"`) → on first visit, with no `value` and no
stored slug, resolve the OS colour-scheme preference to a supported
theme and use it.

```html
<theme-select
  label="Theme"
  themes-url="/assets/themes/"
  themes="light,dark"
  storage-key="myapp:theme"
  detect-from-system
></theme-select>
```

This is the mirror of locale-select's `detect-from-navigator`, and it
occupies the same slot in the resolution order:

```
value > storage > detection > default-value > "light" > themes[0]
```

So an explicit `value` (the server-resolved cookie case) still wins,
and a user's stored past choice still outranks the OS preference —
someone who deliberately picked light on a dark-mode machine keeps
light.

The rule is implemented by the exported pure helper
`matchSystemTheme(themes)`, which mirrors `matchNavigatorLanguage`:

```ts
import { matchSystemTheme } from "lily-design-system-html-theme-select";

matchSystemTheme(["light", "dark"]);   // → "dark" on a dark-mode OS
matchSystemTheme(["light", "abyss"]);  // → ""  (no "dark" slug offered)
```

It reads `matchMedia("(prefers-color-scheme: dark)")` and maps the
result to the slug `"dark"` or `"light"`. It returns `""` — and
resolution falls through to `default-value` — in two cases:

1. the preferred slug is not in `themes` (a catalog with no literal
   `"dark"` or `"light"` slug cannot be matched by name), and
2. `matchMedia` is unavailable. That guard is required, not
   optional: it is the SSR case, and also jsdom, which does not
   implement `matchMedia` either.

Detection resolves the *initial* value only; it does not subscribe to
later OS changes. To track them live, add your own listener — see
[recipes.md](./recipes.md#track-os-colour-scheme-changes-live).

## `name` — optional, string — defaults to `"theme"`

The `name` attribute on the rendered hidden `<input>`, which is what
carries the control's value into an enclosing form (a listbox is not
a form control, so the hidden input supplies the form
participation the old native `<select>` had).

It also serves as the discriminator on the managed `<link>` element
(`data-lily-theme-select="{name}"`), so multiple controls can
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

Extra CSS class on the rendered root `<div>`. Always emitted after
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

## Read-only state and methods

Not attributes, but part of the public surface:

| Member                     | Type      | Purpose                                                    |
| -------------------------- | --------- | ----------------------------------------------------------- |
| `el.open`                  | `boolean` | Whether the listbox is open. Read-only.                     |
| `el.listId`                | `string`  | id of the rendered `<ul role="listbox">`.                   |
| `el.optionId(index)`       | `string`  | id of the rendered option at `index`.                       |
| `el.openList(startIndex?)` | `void`    | Open the list; optionally choose which option starts active. |
| `el.closeList(refocus?)`   | `void`    | Close the list; pass `false` to leave focus where it is.     |
| `el.labelFor(slug)`        | `string`  | Display label for a slug — applies `theme-labels`, else title-cases. |
| `el.renderButtonContent()` | `Node`    | Overridable hook for the button's content. See [custom-rendering.md](./custom-rendering.md). |

`labelFor` is the one to reach for when writing a status region: it
picks up `theme-labels` overrides and translations for free.

## Fall-through attributes

Other attributes on the host (`id`, `data-*`, event handlers, ARIA
overrides) stay on `<theme-select>` and don't propagate to the
rendered children. This is the natural behaviour of custom
elements: the host is where the consumer declares them; the
rendered children are recreated on every render.

The one exception is `class`, which the element deliberately mirrors
onto the rendered root after the `theme-select` base hook.

If you need an attribute to land on a rendered child, write a
consumer wrapper or subclass and post-process the children.

---

Lily™ and Lily Design System™ are trademarks.
