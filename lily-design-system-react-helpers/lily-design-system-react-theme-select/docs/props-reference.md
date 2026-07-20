# Props reference

Field-by-field reference for every public prop. The contract is owned
by [`../spec/index.md`](../spec/index.md) §4; this file expands the rationale and
common usage.

## `label` — required, string

`aria-label` on both the trigger `<button>` and the `<ul
role="listbox">`. Always supplied, always translatable. Screen readers
announce it as the control's name.

```tsx
<ThemeSelect label="Theme" {...required} />
<ThemeSelect label="Thème" {...required} />
<ThemeSelect label="主题" {...required} />
```

This prop carries more weight than it did with a native `<select>`: the
button holds only an `aria-hidden` glyph, so `label` is the **only**
accessible name the control has. See
[accessibility.md](./accessibility.md).

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

The slugs of the themes the select exposes as options — one
`<li role="option">` each, in array order. The slug is used both as the
option's identity and as the URL path segment when constructing the
stylesheet href. Choose slugs that are safe URL path segments —
kebab-case ASCII is recommended.

## `value` — optional, string

The active slug. When supplied, the component is **controlled** —
the consumer is responsible for updating it from `onChange`.

When omitted, the component is **uncontrolled** — internal state
seeds from `defaultValue` / `storageKey` / `"light"` / `themes[0]`.

```tsx
// Controlled
const [theme, setTheme] = useState("");
<ThemeSelect value={theme} onChange={setTheme} {...required} />

// Uncontrolled
<ThemeSelect defaultValue="dark" {...required} />
```

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

```tsx
<ThemeSelect storageKey="lily-theme" {...required} />
```

## `detectFromSystem` — optional, boolean — defaults to `false`

On first visit only — no `value`, nothing in storage — resolve the OS
colour-scheme preference and use it if the resulting slug is one you
offer.

```tsx
<ThemeSelect detectFromSystem storageKey="lily-theme" {...required} />
```

The resolution reads `matchMedia("(prefers-color-scheme: dark)")` and
maps it to `"dark"` or `"light"`. If that slug is not in `themes` — or
if `matchMedia` is unavailable, as during SSR — detection yields
nothing and resolution falls through to `defaultValue`.

Storage **beats** detection: an explicit past choice outranks an OS
preference. `value` beats both. The full order is
`value` > storage > detection > `defaultValue` > `"light"` > `themes[0]`,
mirroring `detectFromNavigator` in locale-select.

This resolves the preference **once**, at mount. To keep tracking the
OS as it changes, add a `matchMedia` change listener and write to a
controlled `value` — see
[`../examples/system-preference.tsx`](../examples/system-preference.tsx).

Off by default, because a theme flip on first paint surprises users who
have already themed the rest of your app another way.

## `name` — optional, string — defaults to `"theme"`

Two jobs. It is the `name` of the hidden
`<input type="hidden">` that carries the active slug — so the control
still submits with a surrounding form — and it is the discriminator on
the managed `<link>` element (`data-lily-theme-select="{name}"`), so
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

```tsx
const ref = useRef<HTMLDivElement>(null);
<div ref={ref}>
    <ThemeSelect target={ref.current} {...required} />
</div>
```

Note: in React, `ref.current` is null on first render and populated
after the first commit. The select handles the null case by falling
back to `document.documentElement` until the ref resolves.

## `themeLabels` — optional, Record<string, string>

Per-slug display label override. When unset, default labels title-case
each hyphen-separated word of the slug: `"light"` → `"Light"`,
`"high-contrast"` → `"High Contrast"`. Use `themeLabels` for i18n or for
slugs that don't gracefully title-case (e.g.
`"united-kingdom-national-health-service-england-for-patients"`).

The labels are also what the listbox typeahead matches against, so a
`themeLabels` override changes which keystrokes jump where.

## `onChange` — optional, (slug: string) => void

Called synchronously after every successful apply. Good place for
analytics, server sync, or notifying sibling components.

```tsx
<ThemeSelect
    onChange={(slug) => {
        analytics.track("theme_changed", { slug });
        document.cookie = `theme=${slug}; path=/`;
    }}
    {...required}
/>
```

## `children` — optional, (args: ChildArgs) => React.ReactNode

Replaces the glyph **inside the trigger button**. It does not render
the options — the component owns those. The render prop receives:

```ts
type ChildArgs = {
    value: string;                       // the active slug
    open: boolean;                       // is the listbox expanded?
    labelFor: (theme: string) => string; // resolved display label
};
```

Keep whatever you render `aria-hidden="true"`; the button's accessible
name comes from `label`. See
[custom-rendering.md](./custom-rendering.md) for patterns.

## `className` — optional, string

Extra CSS class hook on the root `<div>`. Always emitted after
`"theme-select"`, so consumer styles can use either selector.

```tsx
<ThemeSelect className="my-custom-class" {...required} />
// Renders:
// <div class="theme-select my-custom-class" ...>
```

It reaches only the root. The button, list, and options carry their own
component-owned hooks — see [styling.md](./styling.md).

## `...restProps` — any `<div>` attributes

Spread onto the root `<div>`. Use to attach `data-*`, `id`, event
handlers, and ARIA overrides.

```tsx
<ThemeSelect
    id="theme-select-1"
    data-testid="theme-select"
    {...required}
/>
```

The TypeScript surface accepts any
`React.HTMLAttributes<HTMLDivElement>` except `onChange`, `children`,
and `defaultValue`, which are reserved for the component's own
contract.

Note that rest props land on the wrapper, not on the button — so
`aria-describedby` here describes the group, not the trigger. To
describe the trigger itself, extend the `label` text instead.

---

Lily™ and Lily Design System™ are trademarks.
