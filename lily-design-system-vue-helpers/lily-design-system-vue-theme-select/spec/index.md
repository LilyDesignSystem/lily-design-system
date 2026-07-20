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

---

## 1. Goal

Give a Vue 3 application a drop-in, headless theme select that:

1. Renders an accessible native `<select>` of available themes.
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
| `label`         | `string`                                  | yes      | —                        | Accessible name for the `<select>`. |
| `placeholder`   | `string`                                  | no       | value of `label`         | Text of the always-displayed placeholder option. The closed `<select>` shows this instead of the active theme name. |
| `themesUrl`     | `string`                                  | yes      | —                        | Base URL of the themes directory. Trailing `/` is auto-normalised. |
| `themes`        | `string[]`                                | yes      | —                        | Available theme slugs. |
| `value`         | `string` (`v-model:value`)                | no       | `""`                     | Currently selected theme slug. |
| `defaultValue`  | `string`                                  | no       | `"light"` if present in `themes`, else first item | Initial theme. |
| `storageKey`    | `string`                                  | no       | `undefined`              | If set, persist the selection to `localStorage` under this key. |
| `name`          | `string`                                  | no       | `"theme"`                | `name` attribute on the `<select>`. |
| `extension`     | `string`                                  | no       | `".css"`                 | File extension appended to each slug when constructing the URL. |
| `target`        | `HTMLElement \| null`                     | no       | `document.documentElement` | Element that receives `data-theme`. |
| `themeLabels`   | `Record<string, string>`                  | no       | `{}`                     | Optional pretty labels per slug. |
| `class`         | `string`                                  | no       | `""`                     | Extra CSS class on the `<select>` root. |

### 4.2 Events

| Event           | Payload          | Purpose                                                |
| --------------- | ---------------- | ------------------------------------------------------ |
| `update:value`  | `string`         | Emitted on selection (drives `v-model:value`).         |
| `change`        | `string`         | Emitted after the select applies a new theme.          |

### 4.3 Slots

Default slot — when provided, replaces the built-in `<option>`
markup. The slot receives the following scoped props:

```ts
type SlotArgs = {
  themes: string[];
  value: string;
  setTheme: (theme: string) => void;
  name: string;
  labelFor: (theme: string) => string;
};
```

### 4.4 DOM contract

- Root element: `<select class="theme-select {class}"
  aria-label="{label}" name="{name}">`. `$attrs` falls through to the
  root via the default Vue inheritAttrs behaviour.
- **First child, always:** a component-owned placeholder
  `<option class="theme-select-option theme-select-placeholder"
  value="" selected>{placeholder ?? label}</option>`. It is rendered
  in both the default and the custom-slot code paths, so a consumer
  slot cannot displace it.
- Remaining default children: one `<option class="theme-select-option"
  value="{slug}">{labelFor(slug)}</option>` per theme slug.
- The `<select>` element's own value is **not** bound to the active
  slug. Its DOM selection stays pinned to the placeholder: on
  `change` the component reads the chosen slug, immediately resets
  `select.value = ""`, and then applies the slug. The closed control
  therefore always reads `placeholder ?? label` rather than the
  active theme name, which keeps the control as narrow as that one
  word. The real selection lives in `value` / `v-model:value` and in
  `data-theme` on the target.
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
- `normaliseThemesUrl`, `themeHref` (pure helpers)
- `type Props`, `type SlotArgs`

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
3. `defaultValue`.
4. `"light"` (if `"light"` is in `themes`).
5. `themes[0]`.
6. `""` (no apply happens — select waits for user interaction).

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

- A native `<select>` (implicit `role="combobox"`) is the announced
  control.
- `aria-label={label}` supplies the accessible name.
- Native `<option>` elements get the option role, selected state,
  and keyboard semantics for free.

### 6.2 Keyboard contract

Provided by the platform (native `<select>`):

| Key               | Action                                        |
| ----------------- | --------------------------------------------- |
| `Tab`             | Move focus to the select (one stop).          |
| `Shift+Tab`       | Move focus away from the select.              |
| `Arrow Down`      | Select the next option.                       |
| `Arrow Up`        | Select the previous option.                   |
| `Home` / `End`    | Select the first / last option.               |
| Typeahead         | Type characters to jump to a matching option. |
| `Enter` / `Space` | Open the option list (platform-dependent).    |
| `Escape`          | Close the option list.                        |

### 6.3 Internationalisation

- `label` and entries of `themeLabels` are passed through verbatim.
- No user-facing strings are hardcoded.
- `dir` and writing direction inherit from the document.

## 7. Testing acceptance criteria

`ThemeSelect.test.ts` must assert every numbered item below. Tests
run under vitest + jsdom + `@vue/test-utils`.

1. Renders a `<select>` carrying the supplied `name` attribute.
2. `aria-label` is the supplied `label`.
3. Renders the leading placeholder `<option>` plus one `<option>` per
   entry in `themes` (`themes.length + 1` options in total).
4. The first `<option>` has `value=""`; each following `<option>`'s
   `value` attribute is the theme slug.
5. The default rendering shows `themeLabels[slug]` when supplied, or
   the slug with its first character upper-cased otherwise. The word
   `"default"` never appears.
6. After mount with no consumer-supplied value/storage/`defaultValue`,
   the resolved initial value is `"light"` when present in `themes`,
   otherwise `themes[0]`. It is written to
   `document.documentElement.dataset.theme`.
7. After mount, a `<link rel="stylesheet"
   data-lily-theme-select="{name}">` exists in `document.head` and
   its `href` equals
   `${normalise(themesUrl)}${initial}${extension}`.
8. Changing the `<select>` to a different option updates the link
   `href`, `document.documentElement.dataset.theme`, and emits
   `change` with the new slug.
9. When `storageKey` is set, the active slug is written to
   `localStorage` and read back on a fresh mount.
10. When `value` is supplied as a non-empty prop, the initial-value
    resolution skips storage and defaults and uses the supplied
    value.
11. When `themesUrl` does not end with `/`, the constructed URL still
    has exactly one `/` between the directory and the slug.
12. Extra attributes spread through onto the `<select>` (e.g.
    `data-testid`).
13. A custom default slot is rendered with the `SlotArgs` contract.
14. The placeholder `<option class="theme-select-placeholder">`
    renders the `label` text, carries `value=""`, and the
    `<select>`'s own `value` stays `""` after the initial theme has
    been resolved and applied to `data-theme`.
15. When `placeholder` is supplied it overrides `label` as the
    placeholder option's text, while `aria-label` still carries
    `label`.
16. Choosing an option applies the theme (`data-theme` updates) and
    snaps the `<select>`'s own `value` back to `""`.

## 8. Out-of-scope (future, not implemented here)

- A complementary `ThemeView` helper that displays the active theme.
- A `prefers-color-scheme` integration.
- A non-`<link>` loader that injects a `<style>` block.
- A `preload` prop that adds `<link rel="preload" as="style">` tags
  for every available theme.

## 9. Tracking

- Package directory:
  `lily-design-system-vue-helpers/lily-design-system-vue-theme-select/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
