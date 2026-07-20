# ThemeSelect — Specification

Single source of truth for the `lily-design-system-vue-theme-select`
Vue 3 helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by
a test.

Sibling files in this directory:

- `ThemeSelect.vue` — the implementation
- `ThemeSelect.test.ts` — vitest spec exercising every clause in §4–§7
- `index.ts` — re-export barrel
- `index.md` — user-facing readme

The canonical reference for this helper is the Svelte sibling at
`../../lily-design-system-svelte-helpers/lily-design-system-svelte-theme-select/`.
This Vue port mirrors the contract and behaviour, swapping in Vue 3
idioms (Composition API, `defineProps`, `defineModel`, `ref`, `watch`,
`onMounted`, slots).

The companion headless catalog entry
(`lily-design-system-vue-headless/components/ThemeSelect/`) is a pure
container — a native `<select>` + slot. This helper is the
opinionated, reusable counterpart that owns the dynamic loading
lifecycle.

> **Breaking change (unreleased).** The control is no longer a native
> `<select>`. It is now an icon button (◑, U+25D1 CIRCLE WITH RIGHT
> HALF BLACK) that opens a WAI-ARIA APG listbox. The `placeholder`
> prop is removed — there is no `<select>` left to pin — and the
> default slot now replaces the button glyph rather than the options.
> Everything downstream (managed `<link>` swap, `data-theme`,
> persistence, `change`, initial-value resolution, SSR safety, the
> exported pure helpers) is unchanged.

---

## 1. Goal

Give a Vue 3 application a drop-in, headless theme select that:

1. Renders an accessible icon button that opens a listbox of available
   themes.
2. **Loads themes dynamically at runtime** from a developer-specified
   directory URL (e.g. `/assets/themes/`).
3. Applies the chosen theme by injecting / swapping one
   `<link rel="stylesheet">` in `document.head` and by setting a
   `data-theme="…"` attribute on the document root.
4. Optionally persists the chosen theme to `localStorage` so the
   choice survives reload.
5. Ships zero CSS — the consumer styles every visual aspect via the
   `theme-select` class hook.

## 2. Non-goals

- Bundling theme CSS files inside the component. Themes are
  author-owned static assets the consumer drops into their `public/`
  directory.
- Auto-discovering themes via directory listing. Browsers cannot list
  a directory, so the consumer always supplies the list of available
  theme slugs.
- Providing colour, spacing, or typography values. Theme tokens live
  inside each theme CSS file.
- Nuxt-only features. The component only depends on Vue 3 + DOM APIs
  and runs in any Vue 3 host (Nuxt, plain Vite + Vue, Astro, Storybook).
- A `ThemeProvider` style wrapper. Theme application happens at the
  document root, not in a wrapping element.

## 3. Architectural decisions

- **One `<link>` per select name.** Switching themes mutates `href`
  on a single `<link rel="stylesheet"
  data-lily-theme-select="{name}">`. Only the active theme is
  fetched; previously-active CSS is unloaded when the href changes.
  Multiple selects can coexist by passing distinct `name` props.
- **`data-theme` attribute is the activation switch.** Theme CSS
  files scope their `:root[data-theme="slug"]` rules so authors can
  preload multiple themes (one `<link>` per theme) and switch with
  only the attribute change.
- **TypeScript everywhere.** Public surface is fully typed via a
  `Props` type exported from `ThemeSelect.vue` and re-exported from
  `index.ts`.
- **SSR-safe.** All DOM mutations happen inside `onMounted` /
  `watch`, which only run in the browser. The component renders
  cleanly during server-side rendering with no DOM access.
- **No dependencies beyond `vue`.** No localStorage wrappers, no
  fetch wrappers.
- **Two-way bindable `value` via `v-model:value`.** Consumers can
  `v-model:value="theme"` to bind the selected slug. The component is
  fully controlled when `value` is supplied non-empty and uncontrolled
  (resolves from `defaultValue` or storage) otherwise.

## 4. Public API

### 4.1 Props

| Prop            | Type                                      | Required | Default                  | Purpose |
| --------------- | ----------------------------------------- | -------- | ------------------------ | ------- |
| `label`         | `string`                                  | yes      | —                        | Accessible name for **both** the button and the listbox. The button is icon-only, so this is its only name. |
| `themesUrl`     | `string`                                  | yes      | —                        | Base URL of the themes directory. Trailing `/` is auto-normalised. |
| `themes`        | `string[]`                                | yes      | —                        | Available theme slugs. |
| `value`         | `string` (`v-model:value`)                | no       | `""`                     | Currently selected theme slug. |
| `defaultValue`  | `string`                                  | no       | `"light"` if present in `themes`, else first item | Initial theme. |
| `storageKey`    | `string`                                  | no       | `undefined`              | If set, persist the selection to `localStorage` under this key. |
| `detectFromSystem` | `boolean`                              | no       | `false`                  | Resolve `prefers-color-scheme` to a supported theme on first visit. Mirrors `detectFromNavigator` on locale-select. |
| `name`          | `string`                                  | no       | `"theme"`                | `name` of the hidden input that carries the value in a form. **Also** discriminates the managed `<link data-lily-theme-select="{name}">`. |
| `extension`     | `string`                                  | no       | `".css"`                 | File extension appended to each slug when constructing the URL. |
| `target`        | `HTMLElement \| null`                     | no       | `document.documentElement` | Element that receives `data-theme`. |
| `themeLabels`   | `Record<string, string>`                  | no       | `{}`                     | Optional pretty labels per slug. |
| `class`         | `string`                                  | no       | `""`                     | Extra CSS class on the root `<div>`. |

### 4.2 Events

| Event           | Payload          | Purpose                                                |
| --------------- | ---------------- | ------------------------------------------------------ |
| `update:value`  | `string`         | Emitted on selection (drives `v-model:value`).         |
| `change`        | `string`         | Emitted after the select applies a new theme.          |

### 4.3 Slots

Default slot — when provided, replaces the **button glyph**. It does
not render the options: the listbox, its `<li role="option">`
children, the keyboard contract, and the apply lifecycle are all
component-owned. The slot receives the following scoped props:

```ts
type SlotArgs = {
  /** Currently selected theme slug. */
  value: string;
  /** Is the listbox open? */
  open: boolean;
  /** Resolve a slug to its display label. */
  labelFor: (theme: string) => string;
};
```

`ChildArgs` is exported as an alias of `SlotArgs`, matching the
canonical Svelte helper's type name.

Whatever the slot renders is decorative: the button's accessible name
always comes from `label` via `aria-label`. Slot content should be
`aria-hidden="true"` or text-free so it does not compete with that
name.

### 4.4 DOM contract

```html
<div class="theme-select {class}" ...$attrs>
  <input type="hidden" name="{name}" value="{value}" />
  <button type="button" class="theme-select-button"
          aria-label="{label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{listId}">
    <span class="theme-select-icon" aria-hidden="true">◑</span>
  </button>
  <ul class="theme-select-list" id="{listId}" role="listbox"
      aria-label="{label}" tabindex="-1" hidden
      aria-activedescendant="{optionId of active, only while open}">
    <li class="theme-select-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active>{labelFor(slug)}</li>
  </ul>
</div>
```

- Root element: a `<div class="theme-select {class}">`. `$attrs`
  falls through to it via the default Vue `inheritAttrs` behaviour.
- The button is icon-only. The glyph is `◑` (U+25D1 CIRCLE WITH RIGHT
  HALF BLACK, `&#9681;`), exported as
  `CIRCLE_WITH_RIGHT_HALF_BLACK`, wrapped in `aria-hidden="true"` so
  it can never become the accessible name.
- The hidden input preserves form participation and carries `name`.
- `aria-expanded` tracks the open state; `aria-controls` points at the
  listbox id.
- The listbox carries `hidden` while closed, `tabindex="-1"` so it can
  receive focus on open, and `aria-activedescendant` **only while
  open** — it is removed on close.
- One `<li class="theme-select-option" role="option">` per slug, with
  a stable per-instance `id`, `aria-selected` reflecting the active
  slug, and `data-active` on the keyboard-active option.
- Option ids come from an incrementing module counter
  (`nextThemeSelectId()`), so they are stable and SSR-safe — never
  `Math.random()` or `Date.now()`.
- The selection lives in `value` / `v-model:value`, in the hidden
  input, and in `data-theme` on the target.
- `labelFor(slug)` returns `themeLabels[slug]` when supplied;
  otherwise the slug with its first character upper-cased. The select
  never emits the word "default".
- A single managed `<link rel="stylesheet"
  data-lily-theme-select="{name}">` in `document.head`. Created on
  first apply, reused thereafter.
- `data-theme="{slug}"` is set on the `target` element on every apply.

### 4.5 Re-exports

`index.ts` exports:

- `default` (the component)
- `ThemeSelect` (named alias of the default export)
- `normaliseThemesUrl`, `themeHref`, `themeName`, `matchSystemTheme`
  (pure helpers)
- `nextThemeSelectId` (per-instance id generator)
- `CIRCLE_WITH_RIGHT_HALF_BLACK` (the default button glyph)
- `type Props`, `type SlotArgs`, `type ChildArgs`

## 5. Behaviour

### 5.1 URL construction

For a theme slug `slug`, the loaded URL is exactly:

```
normalise(themesUrl) + slug + extension
```

`normalise` ensures exactly one trailing `/`.

### 5.2 Initial value resolution

On `onMounted` in the browser, the initial theme is the first
non-empty value of:

1. `value` (if a consumer supplied a non-empty string).
2. `localStorage.getItem(storageKey)` (only if `storageKey` is set).
3. `matchSystemTheme(themes)` (only if `detectFromSystem` is `true`).
4. `defaultValue`.
5. `"light"` (if `"light"` is in `themes`).
6. `themes[0]`.
7. `""` (no apply happens — select waits for user interaction).

Step 3 occupies the same position navigator detection occupies in
locale-select, so the two helpers resolve symmetrically:

```
value > storage > DETECTION > defaultValue > "light" / "en" > first
```

Resolution emits `update:value` so consumers binding via
`v-model:value` see the resolved value.

### 5.3 Applying a theme

Applying a theme `slug` performs, in order:

1. Locate or create the managed `<link>` (matched by
   `data-lily-theme-select="{name}"`).
2. Set `link.href = normalise(themesUrl) + slug + extension`.
3. Set `data-theme="{slug}"` on the resolved target element. If
   `target` is `null` or `undefined`, use `document.documentElement`.
4. If `storageKey` is set, write the slug to `localStorage` inside a
   try/catch (so private-mode / quota errors are silently swallowed).
5. Emit `change` with the slug.

### 5.4 Reactivity

A single `watch` on `value` re-applies the theme whenever it changes
(including the emit from initial-value resolution). Other prop
changes (`themesUrl`, `extension`, `target`, `name`) take effect on
the next theme change, not retroactively.

### 5.5 SSR

During server rendering, no `onMounted` or `watch` callback fires and
no DOM is touched. The markup renders with the value supplied by the
consumer.

## 6. Accessibility

### 6.1 Roles and properties

- A `<button aria-haspopup="listbox" aria-expanded aria-controls>` is
  the trigger. Because it is icon-only, `aria-label={label}` is its
  **only** accessible name — the glyph is `aria-hidden="true"`.
- A `<ul role="listbox" aria-label={label}>` holds one
  `<li role="option" aria-selected>` per slug.
- The active option is conveyed with `aria-activedescendant` on the
  listbox (focus stays on the `<ul>`), per the APG listbox pattern.
- `data-active` mirrors the active option for consumer CSS;
  `aria-selected` mirrors the committed selection for assistive
  technology.

### 6.2 Keyboard contract

Implemented by the component, following the WAI-ARIA APG listbox
pattern. Focus moves to the `<ul>` on open and returns to the button
on commit or cancel.

On the **button**:

| Key                  | Action                                                        |
| -------------------- | ------------------------------------------------------------- |
| `ArrowDown`          | Open, active option = the selected one (or index 0).          |
| `Enter` / `Space`    | Open, active option = the selected one (or index 0).          |
| `ArrowUp`            | Open, active option = the **last** option.                    |
| `Tab` / `Shift+Tab`  | Move focus away (native).                                     |

On the **listbox**:

| Key                  | Action                                                        |
| -------------------- | ------------------------------------------------------------- |
| `ArrowDown`          | Move the active option down one. **Clamps** — no wrapping.    |
| `ArrowUp`            | Move the active option up one. **Clamps** — no wrapping.      |
| `Home` / `End`       | Jump to the first / last option.                              |
| `Enter` / `Space`    | Select the active option, apply it, close, refocus the button.|
| `Escape`             | Close and refocus the button **without** changing the value.  |
| `Tab`                | Close without stealing focus back.                            |
| Printable characters | Typeahead over the option **labels**, 500 ms buffer reset.    |

Pointer and focus behaviour: clicking an option selects it; clicking
outside the root closes the listbox; focus leaving the root closes it.

### 6.3 Internationalisation

- `label` and entries of `themeLabels` are passed through verbatim.
- No user-facing strings are hardcoded.
- `dir` and writing direction inherit from the document.

## 7. Testing acceptance criteria

`ThemeSelect.test.ts` must assert every numbered item below. Tests
run under vitest + jsdom + `@vue/test-utils`.

1. Renders a `<button type="button">` with `aria-haspopup="listbox"`,
   `aria-expanded="false"`, and an `aria-controls` pointing at an
   element with `role="listbox"`. The root is a `<div>` carrying the
   `theme-select` class hook plus the consumer's `class`. The button
   renders `◑` (U+25D1) inside
   `<span class="theme-select-icon" aria-hidden="true">`.
2. `aria-label` is the supplied `label` on **both** the button and the
   listbox.
3. Renders one `<li class="theme-select-option">` per entry in
   `themes`, and a hidden input carrying the supplied `name` and the
   resolved value.
4. The listbox carries `hidden` until the button is activated; then
   `hidden` is dropped and `aria-expanded` becomes `"true"`. Exactly
   one option carries `aria-selected="true"` — the active theme.
5. The default rendering shows `themeLabels[slug]` when supplied, or
   the title-cased slug otherwise. The word `"default"` never appears.
6. After mount with no consumer-supplied value/storage/`defaultValue`,
   the resolved initial value is `"light"` when present in `themes`,
   otherwise `themes[0]`. It is written to
   `document.documentElement.dataset.theme`.
7. After mount, a `<link rel="stylesheet"
   data-lily-theme-select="{name}">` exists in `document.head` and
   its `href` equals
   `${normalise(themesUrl)}${initial}${extension}`.
8. Clicking a different option updates the link `href`,
   `document.documentElement.dataset.theme`, emits `change` with the
   new slug, and round-trips `v-model:value`.
9. When `storageKey` is set, the active slug is written to
   `localStorage` and read back on a fresh mount.
10. When `value` is supplied as a non-empty prop, the initial-value
    resolution skips storage and defaults and uses the supplied
    value.
11. When `themesUrl` does not end with `/`, the constructed URL still
    has exactly one `/` between the directory and the slug. The
    managed `<link>` is discriminated by `name`, so two selects with
    different names never share a `<link>`.
12. Extra attributes spread through onto the root `<div>` (e.g.
    `data-testid`).
13. A custom default slot replaces the button glyph — the
    `.theme-select-icon` span is absent — and receives the `SlotArgs`
    contract (`value`, `open`, `labelFor`). Its `open` flag tracks the
    listbox state.
14. `ArrowDown`, `Enter` and `Space` on the button all open the
    listbox. `ArrowUp` opens with the **last** option active. Opening
    moves focus to the `<ul>`.
15. On the listbox, `ArrowDown` / `ArrowUp` move `aria-activedescendant`
    and clamp at both ends rather than wrapping; `Home` / `End` jump to
    the first / last option; exactly one option carries `data-active`.
16. `Enter` selects the active option, applies it, closes the listbox
    (`hidden` returns, `aria-expanded` becomes `"false"`), and returns
    focus to the button. `Escape` closes without changing the value.
    `Tab` closes without stealing focus back. `aria-activedescendant`
    is removed once closed.
17. Printable characters run a typeahead over the option labels.
    Clicking an option selects and applies it. Clicking outside the
    root closes the listbox.
18. `themeName(slug)` title-cases each hyphen-separated word, and
    `labelFor` delegates to it so there is exactly one implementation
    of the rule.
19. `matchSystemTheme(themes)` returns `"dark"` when
    `prefers-color-scheme: dark` matches, `"light"` when it does not,
    and `""` when the resolved slug is absent from `themes` **or**
    when `matchMedia` is unavailable (SSR / jsdom).
20. With `detectFromSystem`, the initial theme resolves from the OS
    preference; storage and an explicit `value` still outrank it, and
    detection does nothing unless the prop is set.

## 8. Out-of-scope (future, not implemented here)

- A complementary `ThemeView` helper that displays the active theme.
- *Tracking* `prefers-color-scheme` changes after first paint. The
  `detectFromSystem` prop resolves the initial value only; consumers
  who want live tracking add a `matchMedia` `change` listener and
  write to the bound ref (see `examples/system-preference.vue`).
- A non-`<link>` loader that injects a `<style>` block.
- A `preload` prop that adds `<link rel="preload" as="style">` tags
  for every available theme.

## 9. Tracking

- Package directory:
  `lily-design-system-vue-helpers/lily-design-system-vue-theme-select/`
- Spec version: 0.3.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
