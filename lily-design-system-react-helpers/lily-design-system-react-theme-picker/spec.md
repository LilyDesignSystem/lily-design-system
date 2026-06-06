# ThemePicker — Specification

Single source of truth for the `lily-design-system-react-theme-picker`
React helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by
a test.

Sibling files in this directory:

- `ThemePicker.tsx` — the implementation
- `ThemePicker.test.tsx` — vitest spec exercising every clause in §4–§7
- `index.ts` — re-export barrel
- `index.md` — user-facing readme

The companion headless catalog entry
(`lily-design-system-react-headless/src/ThemePicker/`) is a pure
container — fieldset + `role="radiogroup"` + children. This helper is
the opinionated, reusable counterpart that owns the dynamic loading
lifecycle.

---

## 1. Goal

Give a React 19 application a drop-in, headless theme picker that:

1. Renders an accessible radio group of available themes.
2. **Loads themes dynamically at runtime** from a developer-specified
   directory URL (e.g. `/assets/themes/`).
3. Applies the chosen theme by injecting / swapping one
   `<link rel="stylesheet">` in `document.head` and by setting a
   `data-theme="…"` attribute on the document root.
4. Optionally persists the chosen theme to `localStorage` so the choice
   survives reload.
5. Ships zero CSS — the consumer styles every visual aspect via the
   `theme-picker` class hook.

## 2. Non-goals

- Bundling theme CSS files inside the component. Themes are author-owned
  static assets the consumer drops into their `public/` directory.
- Auto-discovering themes via directory listing. Browsers cannot list a
  directory, so the consumer always supplies the list of available theme
  slugs (or fetches a manifest themselves and passes the result in).
- Providing colour, spacing, or typography values. Theme tokens live inside
  each theme CSS file.
- Next.js-only features. The component only depends on React 19 + DOM
  APIs and runs in any React host (Next.js, plain Vite + React, Remix,
  Storybook).
- A `ThemeProvider` style wrapper / context. Theme application happens
  at the document root, not in a wrapping element.

## 3. Architectural decisions

- **One `<link>` per picker name.** Switching themes mutates `href` on a
  single `<link rel="stylesheet" data-lily-theme-picker="{name}">`. Only
  the active theme is fetched; previously-active CSS is unloaded when the
  href changes. Multiple pickers can coexist by passing distinct `name`
  props.
- **`data-theme` attribute is the activation switch.** Theme CSS files
  scope their `:root[data-theme="slug"]` rules so that authors can
  preload multiple themes (one `<link>` per theme) and switch between
  them with only the attribute change. The default loading strategy
  ("swap-link") covers the common case; consumers who want to preload
  all themes can drop their own `<link>` tags and rely on the attribute
  change alone — see §6.4.
- **TypeScript everywhere.** Public surface is fully typed via a `Props`
  type exported from `ThemePicker.tsx` and re-exported from `index.ts`.
- **SSR-safe.** The component compiles cleanly under Next.js / Remix
  SSR. All DOM mutations happen inside `useEffect`, which only runs on
  the client.
- **No dependencies beyond `react`.** No localStorage wrappers, no
  fetch wrappers, no UUID library.
- **Controlled or uncontrolled `value`.** Consumers can pass
  `value` + `onChange` (controlled) or omit `value` and let the
  component manage internal state (uncontrolled). The component
  resolves from `defaultValue` or storage when uncontrolled.

## 4. Public API

### 4.1 Props

| Prop            | Type                                      | Required | Default                  | Purpose |
| --------------- | ----------------------------------------- | -------- | ------------------------ | ------- |
| `label`         | `string`                                  | yes      | —                        | Accessible name for the radiogroup. |
| `themesUrl`     | `string`                                  | yes      | —                        | Base URL of the themes directory. Trailing `/` is auto-normalised. |
| `themes`        | `string[]`                                | yes      | —                        | Available theme slugs (e.g. `["light", "dark", "abyss"]`). |
| `value`         | `string`                                  | no       | `undefined` (uncontrolled) | Currently selected theme slug. When supplied, the component is controlled. |
| `defaultValue`  | `string`                                  | no       | `"light"` if present in `themes`, else first item | Initial theme when nothing else is supplied. |
| `storageKey`    | `string`                                  | no       | `undefined`              | If set, persist the selection to `localStorage` under this key. |
| `name`          | `string`                                  | no       | `"theme"`                | `name` attribute shared by the radio inputs. |
| `extension`     | `string`                                  | no       | `".css"`                 | File extension appended to each slug when constructing the URL. |
| `target`        | `HTMLElement \| null`                     | no       | `document.documentElement` | Element that receives `data-theme`. |
| `themeLabels`   | `Record<string, string>`                  | no       | `{}`                     | Optional pretty labels per slug. |
| `children`      | `(args: ChildArgs) => React.ReactNode`    | no       | default radio markup     | Custom render prop for the options. |
| `onChange`      | `(theme: string) => void`                 | no       | `undefined`              | Fires after the picker applies a new theme. |
| `className`     | `string`                                  | no       | `""`                     | Extra CSS class on the `<fieldset>` root. |
| `...restProps`  | any HTML `<fieldset>` attributes          | no       | —                        | Spread onto the root. |

`ChildArgs` shape:

```ts
type ChildArgs = {
  themes: string[];
  value: string;
  setTheme: (theme: string) => void;
  name: string;
  labelFor: (theme: string) => string;
};
```

### 4.2 DOM contract

- Root element: `<fieldset className="theme-picker {className}" role="radiogroup"
  aria-label="{label}">`.
- Default children: one `<label className="theme-picker-option">` per theme
  slug containing `<input type="radio" name="{name}" value="{slug}"
  checked={value === slug}>` followed by
  `<span className="theme-picker-option-label">{labelFor(slug)}</span>`.
- `labelFor(slug)` returns `themeLabels[slug]` when supplied; otherwise
  the slug with its first character upper-cased (e.g. `"light"` →
  `"Light"`). The picker never emits the word "default".
- Custom children: rendered via the `children` render prop with `ChildArgs`.
- A single managed `<link rel="stylesheet" data-lily-theme-picker="{name}">`
  in `document.head`. Created on first apply, reused thereafter.
- `data-theme="{slug}"` is set on the `target` element on every apply.

### 4.3 Re-exports

`index.ts` exports:

- `ThemePicker` (the component, both default and named export)
- `normalizeThemesUrl` (the pure helper)
- `themeHref` (the pure helper)
- `type Props`
- `type ChildArgs`

## 5. Behaviour

### 5.1 URL construction

For a theme slug `slug`, the loaded URL is exactly:

```
normalize(themesUrl) + slug + extension
```

`normalize` ensures exactly one trailing `/`. If `themesUrl` ends with
`/`, it is used as-is; otherwise one `/` is appended. The component does
not URL-encode the slug; consumers must pick slugs that are safe URL
path segments (kebab-case ASCII is recommended).

### 5.2 Initial value resolution

On first effect run in the browser, the initial theme is the first
non-empty value of:

1. `value` (if a consumer supplied a non-empty string — controlled mode)
2. `localStorage.getItem(storageKey)` (only if `storageKey` is set and
   the read does not throw)
3. `defaultValue`
4. `"light"` (if `"light"` is in `themes`)
5. `themes[0]`
6. `""` (no apply happens — the picker waits for user interaction)

Rationale: `"light"` is the conventional baseline theme for Lily and
for the broader DaisyUI palette this helper draws from. The picker
never displays the word "default" — option labels are derived from the
slugs (title-cased) or from `themeLabels`.

When uncontrolled, resolution sets the internal state. When controlled,
the consumer is responsible for updating `value` based on `onChange`.

### 5.3 Applying a theme

Applying a theme `slug` performs, in order:

1. Locate or create the managed `<link>` (matched by
   `data-lily-theme-picker="{name}"`).
2. Set `link.href = normalize(themesUrl) + slug + extension`.
3. Set `data-theme="{slug}"` on the resolved target element. If
   `target` is `null` or `undefined`, use
   `document.documentElement`.
4. If `storageKey` is set, write the slug to `localStorage` inside a
   try/catch (so private-mode / quota errors are silently swallowed).
5. Call `onChange(slug)` if supplied.

### 5.4 Reactivity

A single `useEffect` re-applies the theme whenever the resolved value
changes. Other prop changes (`themesUrl`, `extension`, `target`,
`name`) take effect on the next theme change, not retroactively. This
keeps the effect's dependency graph small and avoids surprise re-fetches
when the consumer mutates labels.

### 5.5 SSR

During server rendering, no effects run and no DOM is touched. The
markup renders with the value supplied by the consumer (if any).
Consumers wanting flicker-free first paint pass a server-resolved
`value` (from a cookie, header, etc.).

## 6. Accessibility

### 6.1 Roles and properties

- `<fieldset>` with `role="radiogroup"` is the announced container.
- `aria-label={label}` supplies the group name.
- Native `<input type="radio">` elements get the radio role, checked
  state, and keyboard semantics for free.

### 6.2 Keyboard contract

Provided by the platform (native radio inputs):

| Key            | Action                                           |
| -------------- | ------------------------------------------------ |
| `Tab`          | Move focus into / out of the group.              |
| `Arrow` keys   | Move selection between options inside the group. |
| `Space`        | Select the focused option (when not already).    |

### 6.3 Internationalisation

- `label` and entries of `themeLabels` are passed through verbatim.
- No user-facing strings are hardcoded.
- `dir` and writing direction inherit from the document.

### 6.4 Preloading strategy (consumer choice)

The default ("swap-link") loads exactly one theme at a time. A consumer
who wants instant switching can:

1. Drop their own `<link rel="stylesheet"
   href="/assets/themes/{slug}.css">` tags for every theme in the
   document `<head>` (so all theme CSS files are preloaded and parsed).
2. Continue to use this picker — the picker still updates `data-theme`,
   and because every theme's CSS rule set is scoped to
   `:root[data-theme="{slug}"]`, the active rules switch instantly with
   the attribute.

This is documented in §6.4 of `index.md` for adopters who care about
zero-flicker switching.

## 7. Testing acceptance criteria

`ThemePicker.test.tsx` must assert every numbered item below. Tests run
under vitest + jsdom + `@testing-library/react`.

1. Renders a `<fieldset>` with `role="radiogroup"`.
2. `aria-label` is the supplied `label`.
3. Renders one radio input per entry in `themes`, sharing the supplied
   `name` attribute.
4. Each radio's `value` attribute is the theme slug.
5. The default rendering shows `themeLabels[slug]` when supplied, or
   the slug with its first character upper-cased otherwise (e.g.
   `"light"` → `"Light"`). The word `"default"` never appears.
6. After mount with no consumer-supplied value/storage/`defaultValue`,
   the resolved initial value is `"light"` when present in `themes`,
   otherwise `themes[0]`. It is written to
   `document.documentElement.dataset.theme`.
7. After mount, a `<link rel="stylesheet"
   data-lily-theme-picker="{name}">` exists in `document.head` and its
   `href` equals `${normalize(themesUrl)}${initial}${extension}`.
8. Selecting a different radio updates the link `href`,
   `document.documentElement.dataset.theme`, and fires `onChange` with
   the new slug.
9. When `storageKey` is set, the active slug is written to
   `localStorage` and read back on a fresh mount.
10. When `value` is supplied as a prop, the initial-value resolution
    skips storage and defaults and uses the supplied value.
11. When `themesUrl` does not end with `/`, the constructed URL still
    has exactly one `/` between the directory and the slug.
12. Extra attributes spread through onto the `<fieldset>` (e.g.
    `data-testid`).
13. A custom `children` render prop is invoked with the `ChildArgs`
    contract.

## 8. Out-of-scope (future, not implemented here)

- A complementary `ThemeView` helper that displays the active theme. The
  headless `ThemeView` already exists upstream.
- A `prefers-color-scheme` integration that auto-picks light/dark on
  first visit. Easy to add as a follow-up by mapping the media query to
  a slug in the consumer.
- A non-`<link>` loader that injects a `<style>` block (useful for CSP
  contexts that block external stylesheets but allow inline). Could be
  added behind a `loader` prop.
- A `preload` prop that adds `<link rel="preload" as="style">` tags for
  every available theme.

## 9. Tracking

- Package directory: `lily-design-system-react-helpers/lily-design-system-react-theme-picker/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or
  contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
