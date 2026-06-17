# Troubleshooting

Symptoms, root causes, and fixes for the most common problems.

## "CSS does not switch when I pick a new theme"

**Likely cause.** Your theme CSS files declare rules under `:root`
without scoping them to a `[data-theme="<slug>"]` selector. The
first-loaded theme then sets values that the next-loaded theme
cannot unset.

**Fix.** Scope every rule in every theme to
`:where(:root, :root[data-theme="<slug>"])`. The Lily themes
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

## "SSR hydration mismatch"

**Likely cause.** The picker rendered on the server with no
selected `<option>` (because `value` was empty), but on the client
the lifecycle resolved a non-empty initial value from `localStorage`
or `defaultValue`. Vue logs a hydration warning when the resulting
DOM differs.

**Fix.** Resolve the theme on the server (cookie, header, or
session store) and pass it to the picker via `value`. See
[ssr.md](./ssr.md).

## "Theme does not persist across reloads"

Checklist:

- `storageKey` is set.
- `localStorage` is available (not blocked by private mode or
  browser extensions).
- No other component is overwriting the same key on mount.

## "The word 'default' appears in my picker"

It does not come from this component. The picker only emits the
slug (title-cased) or the value from `themeLabels`. Check the
consumer markup wrapping the picker for hardcoded "(default)"
annotations.

## "Multiple pickers fight over `<html data-theme>`"

When two pickers share `document.documentElement` as the target,
the last apply wins. Either pass a per-picker `target` element, or
designate one picker as the "global" one and have the others apply
their themes to a wrapping element via `target`.

## "The picker re-fetches the same CSS file on every render"

It shouldn't — the managed `<link>` is reused, and changing
`themesUrl` is not enough to re-trigger `applyTheme`. If you
observe re-fetches:

- Confirm the surrounding component isn't remounting the picker
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
attribute on every navigation. The picker sets it once on
hydration, then `useHead` overwrites it on the next route change.

**Fix.** Bind `useHead` to the same reactive ref that
`v-model:value` writes to:

```ts
const theme = ref<string>("");
useHead({ htmlAttrs: { "data-theme": theme } });
```

Now both Nuxt and the picker write the same source of truth.

## "Inside `<Suspense>` the picker shows the default for a frame"

`<Suspense>` defers `onMounted` until the async dependency
resolves. The picker still works but the FOUT window grows. Move
the picker outside the `<Suspense>` boundary, or pre-resolve the
theme on the server and pass it as `value`.
