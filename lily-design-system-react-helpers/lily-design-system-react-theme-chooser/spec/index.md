# ThemeChooser — Specification

Single source of truth for the `lily-design-system-react-theme-chooser`
React helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by
a test.

Sibling files in this directory:

- `ThemeChooser.tsx` — the implementation
- `ThemeChooser.test.tsx` — vitest spec exercising every clause in §4–§7
- `index.ts` — re-export barrel
- `index.md` — user-facing readme

The companion headless catalog entry
(`lily-design-system-react-headless/src/ThemeChooser/`) is a pure
container — a native `<select>` + `<option>` children. This helper is
the opinionated, reusable counterpart that owns the dynamic loading
lifecycle and, since the button+listbox migration, its own keyboard
contract.

---

## 1. Goal

Give a React 19 application a drop-in, headless theme chooser that:

1. Renders an accessible icon button that opens a dropdown listbox of
   the available themes, following the WAI-ARIA APG listbox pattern.
2. **Loads themes dynamically at runtime** from a developer-specified
   directory URL (e.g. `/assets/themes/`).
3. Applies the chosen theme by injecting / swapping one
   `<link rel="stylesheet">` in `document.head` and by setting a
   `data-theme="…"` attribute on the document root.
4. Optionally persists the chosen theme to `localStorage` so the choice
   survives reload.
5. Ships zero CSS — the consumer styles every visual aspect via the
   `theme-chooser` class hook.

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

- **One `<link>` per select name.** Switching themes mutates `href` on a
  single `<link rel="stylesheet" data-lily-theme-chooser="{name}">`. Only
  the active theme is fetched; previously-active CSS is unloaded when the
  href changes. Multiple selects can coexist by passing distinct `name`
  props.
- **`data-theme` attribute is the activation switch.** Theme CSS files
  scope their `:root[data-theme="slug"]` rules so that authors can
  preload multiple themes (one `<link>` per theme) and switch between
  them with only the attribute change. The default loading strategy
  ("swap-link") covers the common case; consumers who want to preload
  all themes can drop their own `<link>` tags and rely on the attribute
  change alone — see §6.4.
- **Button + listbox, not a native `<select>`.** The control is an
  icon button (`aria-haspopup="listbox"`) that toggles a `<ul
  role="listbox">`. The component therefore owns the keyboard contract
  itself (§6.2) rather than inheriting it from the platform. A hidden
  `<input type="hidden" name="{name}">` carries the active slug so the
  control still participates in ordinary form submission.
- **Ids come from `useId`.** The listbox id and every option id derive
  from React's `useId`, so they are stable across server and client
  render and survive hydration. No `Math.random`, no `Date.now`.
- **TypeScript everywhere.** Public surface is fully typed via a `Props`
  type exported from `ThemeChooser.tsx` and re-exported from `index.ts`.
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
| `label`         | `string`                                  | yes      | —                        | Accessible name for the button and the listbox. |
| `themesUrl`     | `string`                                  | yes      | —                        | Base URL of the themes directory. Trailing `/` is auto-normalised. |
| `themes`        | `string[]`                                | yes      | —                        | Available theme slugs (e.g. `["light", "dark", "abyss"]`). |
| `value`         | `string`                                  | no       | `undefined` (uncontrolled) | Currently selected theme slug. When supplied, the component is controlled. |
| `defaultValue`  | `string`                                  | no       | `"light"` if present in `themes`, else first item | Initial theme when nothing else is supplied. |
| `storageKey`    | `string`                                  | no       | `undefined`              | If set, persist the selection to `localStorage` under this key. |
| `detectFromSystem` | `boolean`                              | no       | `false`                  | If true and no value/storage entry exists, resolve `prefers-color-scheme` to a supported theme. |
| `name`          | `string`                                  | no       | `"theme"`                | Discriminates the managed `<link>`; also the hidden input's `name`. |
| `extension`     | `string`                                  | no       | `".css"`                 | File extension appended to each slug when constructing the URL. |
| `target`        | `HTMLElement \| null`                     | no       | `document.documentElement` | Element that receives `data-theme`. |
| `themeLabels`   | `Record<string, string>`                  | no       | `{}`                     | Optional pretty labels per slug. |
| `children`      | `(args: ChildArgs) => React.ReactNode`    | no       | the half-circle glyph    | Replaces the glyph **inside the button**. It does not render the options — the component owns those. |
| `onChange`      | `(theme: string) => void`                 | no       | `undefined`              | Fires after the select applies a new theme. |
| `className`     | `string`                                  | no       | `""`                     | Extra CSS class on the root `<div>`. |
| `...restProps`  | any HTML `<div>` attributes               | no       | —                        | Spread onto the root `<div>`. |

`ChildArgs` shape:

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

The render output replaces the default
`<span class="theme-chooser-icon" aria-hidden="true">&#9681;</span>`. It sits
inside the button, whose accessible name always comes from `label` via
`aria-label` — so custom glyph content should be `aria-hidden` and must
never be relied on for naming.

### 4.2 DOM contract

The rendered tree is:

```html
<div class="theme-chooser {className}" ...restProps>
  <input type="hidden" name="{name}" value="{value}" />
  <button type="button" class="theme-chooser-button"
          aria-label="{label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{listId}">
    <span class="theme-chooser-icon" aria-hidden="true">&#9681;</span>
  </button>
  <ul class="theme-chooser-list" id="{listId}" role="listbox"
      aria-label="{label}" tabindex="-1" hidden
      aria-activedescendant="{optionId of active, only while open}">
    <li class="theme-chooser-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active>Light</li>
  </ul>
</div>
```

- **Root element:** `<div className="theme-chooser {className}">`. Rest
  props spread onto this `<div>`.
- **Hidden input.** `<input type="hidden" name="{name}"
  value="{value}">` carries the active slug so the control participates
  in ordinary form submission.
- **Button.** `type="button"`, class hook `theme-chooser-button`,
  `aria-label="{label}"`, `aria-haspopup="listbox"`, `aria-expanded`
  tracking open state, and `aria-controls` pointing at the listbox id.
- **Glyph.** The default button content is
  `<span class="theme-chooser-icon" aria-hidden="true">&#9681;</span>` — U+25D1
  CIRCLE WITH RIGHT HALF BLACK (`&#9681;`), exported as
  `CIRCLE_WITH_RIGHT_HALF_BLACK`. It is `aria-hidden`, so the button's
  accessible name comes solely from `label` via `aria-label`. Supplying
  `children` replaces the glyph.
- **Listbox.** `<ul class="theme-chooser-list" role="listbox"
  aria-label="{label}" tabindex="-1">`, `hidden` while closed. While
  open it carries `aria-activedescendant` set to the active option's id.
- **Options.** One `<li class="theme-chooser-option" role="option">` per
  theme slug, each with a `useId`-derived `id`, `aria-selected` set to
  whether it is the active theme, and `data-active` present on the
  keyboard-active option only.
- `labelFor(slug)` returns `themeLabels[slug]` when supplied; otherwise
  the slug with each hyphen-separated word title-cased (e.g. `"light"` →
  `"Light"`, `"high-contrast"` → `"High Contrast"`). The component never
  emits the word "default".
- A single managed `<link rel="stylesheet" data-lily-theme-chooser="{name}">`
  in `document.head`. Created on first apply, reused thereafter.
- `data-theme="{slug}"` is set on the `target` element on every apply.
- The package ships no CSS, so the listbox has no positioning: consumers
  supply the `position: relative` / `position: absolute` pair (see
  `docs/styling.md`).

### 4.3 Re-exports

`index.ts` exports:

- `ThemeChooser` (the component, both default and named export)
- `normalizeThemesUrl` (the pure helper)
- `themeHref` (the pure helper)
- `themeName` (the pure helper; the single implementation of the
  title-casing label rule, mirroring `localeName` in locale-chooser)
- `matchSystemTheme` (the pure helper; mirrors `matchNavigatorLanguage`
  in locale-chooser)
- `type Props`
- `type ChildArgs`

`ThemeChooser.tsx` additionally exports the default glyph constant
`CIRCLE_WITH_RIGHT_HALF_BLACK`. The barrel does not currently re-export
it; import it from `./ThemeChooser` directly if you need it.

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
3. `matchSystemTheme(themes)` (only if `detectFromSystem` is true; the
   OS colour-scheme preference, or `""` when the resulting slug is not
   in `themes` or `matchMedia` is unavailable)
4. `defaultValue`
5. `"light"` (if `"light"` is in `themes`)
6. `themes[0]`
7. `""` (no apply happens — the select waits for user interaction)

This is the same position navigator detection occupies in
locale-chooser's order, keeping the two helpers symmetric.

Rationale: `"light"` is the conventional baseline theme for Lily and
for the broader DaisyUI palette this helper draws from. The select
never displays the word "default" — option labels are derived from the
slugs (title-cased) or from `themeLabels`.

When uncontrolled, resolution sets the internal state. When controlled,
the consumer is responsible for updating `value` based on `onChange`.

### 5.3 Applying a theme

Applying a theme `slug` performs, in order:

1. Locate or create the managed `<link>` (matched by
   `data-lily-theme-chooser="{name}"`).
2. Set `link.href = normalize(themesUrl) + slug + extension`.
3. Set `data-theme="{slug}"` on the resolved target element. If
   `target` is `null` or `undefined`, use
   `document.documentElement`.
4. If `storageKey` is set, write the slug to `localStorage` inside a
   try/catch (so private-mode / quota errors are silently swallowed).
5. Call `onChange(slug)` if supplied.

### 5.3.1 Open / close lifecycle

- Opening sets the active option to the currently-selected theme, or to
  index 0 when nothing matches — except `ArrowUp` on the button, which
  opens with the **last** option active.
- Opening moves focus to the `<ul role="listbox">` (it is `tabindex="-1"`);
  the active option is tracked with `aria-activedescendant`, not with
  roving DOM focus.
- Closing via a selection or `Escape` returns focus to the button.
  Closing via `Tab`, an outside click, or focus leaving the root does
  **not** move focus back.
- Selecting applies the theme through §5.3. `Escape`, an outside click,
  and focus loss all close without changing the value.
- The active option is kept in view with `scrollIntoView({ block:
  "nearest" })` as it moves.

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

The control follows the WAI-ARIA APG **listbox** pattern with a button
trigger.

| Element  | Role / property                                                   |
| -------- | ----------------------------------------------------------------- |
| `<button>` | `aria-label={label}`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` |
| glyph `<span>` | `aria-hidden="true"` — never part of the accessible name.    |
| `<ul>`   | `role="listbox"`, `aria-label={label}`, `tabindex="-1"`, `hidden` while closed, `aria-activedescendant` while open |
| `<li>`   | `role="option"`, `aria-selected`, `data-active` on the keyboard-active option |

The glyph carries no accessible name, so `label` is load-bearing: it is
the only name the control has. See `docs/accessibility.md` for the
tradeoffs this pattern accepts.

### 6.2 Keyboard contract

The component implements this itself; nothing is inherited from a
native `<select>`.

On the **button**:

| Key                          | Action                                                     |
| ---------------------------- | ---------------------------------------------------------- |
| `Tab` / `Shift+Tab`          | Move focus to / from the button (one tab stop).            |
| `ArrowDown` / `Enter` / `Space` | Open, with the currently-selected option active (else index 0). Focus moves to the listbox. |
| `ArrowUp`                    | Open with the **last** option active. Focus moves to the listbox. |

On the **listbox**:

| Key                 | Action                                                              |
| ------------------- | ------------------------------------------------------------------- |
| `ArrowDown` / `ArrowUp` | Move the active option. Clamps at the ends — it does not wrap.  |
| `Home` / `End`      | Jump to the first / last option.                                     |
| `Enter` / `Space`   | Select the active option, apply it, close, and return focus to the button. |
| `Escape`            | Close and return focus to the button **without** changing the value. |
| `Tab`               | Close without stealing focus back, letting focus move on.            |
| Printable character | Typeahead over the option **labels**; the buffer accumulates and resets after 500 ms of inactivity. |

Pointer behaviour: clicking an option selects it; clicking the button
again closes the listbox; clicking outside the root closes it; focus
leaving the root closes it. None of the close-only paths change the
value.

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
2. Continue to use this select — the select still updates `data-theme`,
   and because every theme's CSS rule set is scoped to
   `:root[data-theme="{slug}"]`, the active rules switch instantly with
   the attribute.

This is documented in §6.4 of `index.md` for adopters who care about
zero-flicker switching.

## 7. Testing acceptance criteria

`ThemeChooser.test.tsx` must assert every numbered item below. Tests run
under vitest + jsdom + `@testing-library/react`.

1. Markup shape:
   1. Renders a `<button type="button">` with `aria-haspopup="listbox"`,
      `aria-expanded="false"`, and an `aria-controls` that resolves to an
      element with `role="listbox"`.
   2. The button holds `<span class="theme-chooser-icon"
      aria-hidden="true">&#9681;</span>` (U+25D1, `&#9681;`).
   3. The root is a `<div>` whose class is `theme-chooser` plus the
      consumer's `className`.
2. `aria-label` is the supplied `label` on **both** the button and the
   listbox.
3. Renders exactly one `.theme-chooser-option` per entry in `themes`, and
   the hidden input carries the supplied `name` and the resolved slug as
   its `value`.
4. Open state:
   1. The listbox is `hidden` until the button is activated; activating
      it removes `hidden` and flips `aria-expanded` to `"true"`.
   2. Exactly one option has `aria-selected="true"` — the active theme.
5. The rendering shows `themeLabels[slug]` when supplied, or the slug
   with each hyphen-separated word title-cased otherwise (e.g.
   `"light"` → `"Light"`). The word `"default"` never appears.
6. After mount with no consumer-supplied value/storage/`defaultValue`,
   the resolved initial value is `"light"` when present in `themes`,
   otherwise `themes[0]`. It is written to
   `document.documentElement.dataset.theme`.
7. After mount, a `<link rel="stylesheet"
   data-lily-theme-chooser="{name}">` exists in `document.head` and its
   `href` equals `${normalize(themesUrl)}${initial}${extension}`.
8. Choosing a different option updates the link `href`,
   `document.documentElement.dataset.theme`, and fires `onChange` with
   the new slug.
9. When `storageKey` is set, the active slug is written to
   `localStorage` and read back on a fresh mount.
10. When `value` is supplied as a prop, the initial-value resolution
    skips storage and defaults and uses the supplied value.
11. When `themesUrl` does not end with `/`, the constructed URL still
    has exactly one `/` between the directory and the slug.
12. Extra attributes spread through onto the root `<div>` (e.g.
    `data-testid`).
13. A custom `children` render prop:
    1. Replaces the default glyph inside the button (the
       `.theme-chooser-icon` span is absent) and receives `ChildArgs` —
       `value`, `open`, `labelFor`.
    2. Sees `open === true` once the listbox is expanded.
14. Opening from the button:
    1. `ArrowDown`, `Enter`, and `Space` each open the listbox.
    2. `ArrowUp` opens with the last option active.
    3. Opening moves focus to the listbox element.
15. Moving within the listbox:
    1. `ArrowDown` / `ArrowUp` move `aria-activedescendant` and clamp at
       the top rather than wrapping.
    2. `ArrowDown` clamps at the last option.
    3. Exactly one option carries `data-active`, and it is the active one.
    4. `Home` / `End` jump to the first / last option.
16. Committing and dismissing:
    1. `Enter` selects the active option, applies it, and closes
       (`hidden` returns, `aria-expanded` returns to `"false"`).
    2. `Enter` returns focus to the button.
    3. `Space` selects the active option and closes.
    4. `Escape` closes and refocuses the button without changing
       `data-theme`.
    5. `Tab` closes the listbox without stealing focus back to the button.
17. Typeahead:
    1. A printable character moves `aria-activedescendant` to the first
       option whose label starts with it.
    2. Characters accumulate within the buffer window, so a longer prefix
       keeps matching the same option.
    3. The buffer resets after the 500 ms idle window, so the next
       character starts a fresh search.
18. Pointer interaction:
    1. Clicking an option selects and applies it, and closes the listbox.
    2. Clicking outside closes the listbox without changing the theme.
    3. Clicking the button again closes the listbox.

The pure helpers `normalizeThemesUrl`, `themeHref`, `themeName`, and
`matchSystemTheme` are additionally covered by direct unit tests of
§5.1, including `matchSystemTheme` resolving dark, resolving light,
returning `""` for an unsupported slug, and returning `""` when
`matchMedia` is unavailable.

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

- Package directory: `lily-design-system-react-helpers/lily-design-system-react-theme-chooser/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or
  contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
