# Props reference

Field-by-field reference for every public prop. The contract is owned
by [`../spec.md`](../spec.md) §4; this file expands the rationale and
common usage.

## `label` — required, string

`aria-label` on the `<fieldset role="radiogroup">`. Always supplied,
always translatable. Screen readers announce it as the group's name.

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

The slugs of the themes the picker exposes as options. The slug is
used both as the radio `value` and as the URL path segment when
constructing the stylesheet href. Choose slugs that are safe URL path
segments — kebab-case ASCII is recommended.

## `value` — optional, string (bindable)

The active slug. Two-way bindable with `bind:value={slug}` so the
surrounding code can read and write the selection.

When supplied as a non-empty string, the picker treats it as the
authoritative initial value — `storageKey` and `defaultValue` are
both skipped on first mount.

## `defaultValue` — optional, string

Used during initial-value resolution when `value` is empty and
nothing was stored. If `defaultValue` is itself empty, the resolver
falls back to `"light"` (when present in `themes`) and then to
`themes[0]`.

## `storageKey` — optional, string

`localStorage` key for persistence. When set, the picker:

- Reads the stored slug during initial-value resolution.
- Writes the slug to storage after every successful apply.

Errors (private mode, quota, disabled storage) are silently swallowed
— the picker continues to work in-memory.

## `name` — optional, string — defaults to `"theme"`

The `name` attribute shared by the radio inputs. It also serves as the
discriminator on the managed `<link>` element
(`data-lily-theme-select="{name}"`), so multiple pickers can coexist
by giving each a distinct `name`.

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

Per-slug display label override. When unset, default labels title-case
the slug: `"light"` → `"Light"`, `"abyss"` → `"Abyss"`. Use
`themeLabels` for i18n or for slugs that don't gracefully title-case
(e.g. `"united-kingdom-national-health-service-england-for-patients"`).

## `onChange` — optional, (slug: string) => void

Called synchronously after every successful apply. Good place for
analytics, server sync, or notifying sibling components.

## `children` — optional, Snippet<[ChildArgs]>

Custom rendering of the options. The snippet receives:

```ts
type ChildArgs = {
  themes: string[];
  value: string;
  setTheme: (theme: string) => void;
  name: string;
  labelFor: (theme: string) => string;
};
```

See [custom-rendering.md](./custom-rendering.md) for patterns.

## `class` — optional, string

Extra CSS class hook on the `<fieldset>`. Always emitted after
`"theme-select"`, so consumer styles can use either selector.

## `...restProps` — any `<fieldset>` attributes

Spread onto the root. Use to attach `data-*`, `id`, event handlers,
and ARIA overrides.
