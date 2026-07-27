# Troubleshooting

Symptoms, root causes, and fixes for the most common problems.

## "CSS does not switch when I pick a new theme"

**Likely cause.** Your theme CSS files declare rules under `:root`
without scoping them to a `[data-theme="<slug>"]` selector. The
first-loaded theme then sets values that the next-loaded theme
cannot unset.

**Fix.** Scope every rule in every theme to
`:where(:root, :root[data-theme="<slug>"])`. The Lily™ themes
follow this convention.

## "404 on the theme href"

**Likely cause.** `themesUrl + slug + extension` does not resolve
to a real file. Check that:

- The themes directory is actually served by your static asset
  pipeline (e.g. `public/assets/themes/` under Vite + Vue).
- `extension` matches the file extension (`.css`, `.module.css`,
  etc).
- The slug case matches the file name (case-sensitive on most
  servers).

## "The listbox pushes the rest of the page down when it opens"

**Likely cause.** You have not positioned it. The listbox is a plain
`<ul>` in normal document flow and the package ships **no CSS at
all** — including no positioning.

**Fix.** `position: relative` on `.theme-chooser`, `position: absolute`
on `.theme-chooser-list`. Full block in
[styling.md](./styling.md#positioning-the-listbox).

## "The listbox is visible even when closed"

**Likely cause.** You set `display` on `.theme-chooser-list` (e.g.
`display: flex` or `display: grid`), which overrides the UA
stylesheet's `[hidden] { display: none }`.

**Fix.** Restore it explicitly:

```css
.theme-chooser-list[hidden] { display: none; }
```

## "Arrowing through the list does nothing visible"

**Likely cause.** You styled `[aria-selected="true"]` but not
`[data-active]`. They are different signals: `aria-selected` is the
committed theme, `data-active` is the option the arrow keys are on.
Focus sits on the `<ul>`, never on an option, so `[data-active]` is the
only visible cue during navigation.

**Fix.** Add a `.theme-chooser-option[data-active]` rule — see
[styling.md](./styling.md#attribute-hooks).

## "The button shows an empty box (tofu)"

**Likely cause.** The default glyph `◑` (U+25D1 CIRCLE WITH RIGHT HALF
BLACK) is not present in any font available on the user's system. It is
a plain text character, so it depends entirely on installed fonts.

**Fix.** Pass your own icon through the default slot — an inline SVG
renders identically everywhere. See
[custom-rendering.md](./custom-rendering.md).

## "My slot content isn't replacing the options"

It never did. As of the icon-button rewrite the default slot replaces
the **button glyph** only; the listbox and its `<li role="option">`
children are component-owned. Slot content renders inside the
`<button>`, so `<option>` or `<li>` elements there are invalid.

To build a different UI entirely, drive `v-model:value` from your own
controls — see the recipe in [recipes.md](./recipes.md).

## "TypeScript says `placeholder` does not exist on Props"

Correct: the `placeholder` prop was **removed** in the icon-button
rewrite. It described the leading `<option>` of the old native
`<select>`, and there is no `<select>` any more.

**Fix.** Delete the prop. If you were using it to keep the control
narrow, that is now the default — the trigger is a single glyph. The
`.theme-chooser-placeholder` CSS hook is gone too; delete any rules
targeting it.

## "SSR hydration mismatch"

**Likely cause.** The chooser rendered on the server with an empty
hidden-input value (because `value` was empty), but on the client
the lifecycle resolved a non-empty initial value from `localStorage`
or `defaultValue`. Vue logs a hydration warning when the resulting
DOM differs.

**Fix.** Resolve the theme on the server (cookie, header, or
session store) and pass it to the chooser via `value`. See
[ssr.md](./ssr.md).

## "Theme does not persist across reloads"

Checklist:

- `storageKey` is set.
- `localStorage` is available (not blocked by private mode or
  browser extensions).
- No other component is overwriting the same key on mount.

## "The word 'default' appears in my select"

It does not come from this component. The chooser only emits the
slug (title-cased) or the value from `themeLabels`. Check the
consumer markup wrapping the chooser for hardcoded "(default)"
annotations.

## "Typeahead jumps to the wrong option"

Typeahead matches the **display labels**, not the slugs. With
`themeLabels: { light: "Bright" }`, typing `l` will not reach it —
type `b`. The buffer resets 500 ms after the last keystroke, so typing
slowly restarts the match rather than extending it.

## "Multiple choosers fight over `<html data-theme>`"

When two choosers share `document.documentElement` as the target,
the last apply wins. Either pass a per-select `target` element, or
designate one select as the "global" one and have the others apply
their themes to a wrapping element via `target`.

## "The chooser re-fetches the same CSS file on every render"

It shouldn't — the managed `<link>` is reused, and changing
`themesUrl` is not enough to re-trigger `applyTheme`. If you
observe re-fetches:

- Confirm the surrounding component isn't remounting the chooser
  every render (e.g. inside a `v-if` whose condition toggles
  rapidly, or a `<KeepAlive>` configuration that detaches /
  reattaches).
- Confirm the consumer isn't manually removing the managed `<link>`
  on each render.

## "v-model:value doesn't update"

**Likely cause.** You typed `v-model` instead of `v-model:value`.
The default `v-model` binds to `modelValue`, but this helper
exposes its bindable on `value`.

**Fix.** Use `v-model:value="theme"`.

## "TypeScript complains about the v-model expression"

`v-model:value` requires `value` to be typed as `string` on the
component, which it is. If your wrapping component re-exposes
`value`, ensure you also re-emit `update:value`:

```ts
defineEmits<{
    (event: "update:value", value: string): void;
}>();
```

Otherwise the typed `v-model` on the wrapper will compile-error.

## "Theme switch works locally but not in production"

Almost always a caching issue. Either:

- Add a cache-busting suffix via `extension` (e.g. `.css?v=1`), or
- Configure the static asset server to send `Cache-Control:
  must-revalidate` for theme CSS files.

## "Nuxt's useHead clobbers my data-theme"

`useHead({ htmlAttrs: { "data-theme": "…" } })` overwrites the
attribute on every navigation. The chooser sets it once on
hydration, then `useHead` overwrites it on the next route change.

**Fix.** Bind `useHead` to the same reactive ref that
`v-model:value` writes to:

```ts
const theme = ref<string>("");
useHead({ htmlAttrs: { "data-theme": theme } });
```

Now both Nuxt and the chooser write the same source of truth.

## "Inside `<Suspense>` the chooser shows the default for a frame"

`<Suspense>` defers `onMounted` until the async dependency
resolves. The chooser still works but the FOUT window grows. Move
the chooser outside the `<Suspense>` boundary, or pre-resolve the
theme on the server and pass it as `value`.

---

Lily™ and Lily Design System™ are trademarks.
