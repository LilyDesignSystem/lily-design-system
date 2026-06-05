# Troubleshooting

Symptoms, root causes, and fixes for the most common problems.

## "CSS does not switch when I pick a new theme"

**Likely cause.** Your theme CSS files declare rules under `:root`
without scoping them to a `[data-theme="<slug>"]` selector. The
first-loaded theme then sets values that the next-loaded theme cannot
unset.

**Fix.** Scope every rule in every theme to
`:where(:root, :root[data-theme="<slug>"])`. The Lily themes follow
this convention; see [`../../themes/light.css`](../../themes/light.css)
for an example.

## "404 on the theme href"

**Likely cause.** `themesUrl + slug + extension` does not resolve to a
real file. Check that:

- The themes directory is actually served by your static asset
  pipeline (e.g. `static/assets/themes/` under SvelteKit).
- `extension` matches the file extension (`.css`, `.module.css`, etc).
- The slug case matches the file name (case-sensitive on most
  servers).

## "SSR hydration mismatch"

**Likely cause.** The picker rendered on the server with no checked
radio (because `value` was empty), but on the client the picker's
effect resolved a non-empty initial value from `localStorage` or
`defaultValue`. Svelte logs a hydration warning when the resulting
DOM differs.

**Fix.** Resolve the theme on the server (cookie, header, or session
store) and pass it to the picker via `value`. See [ssr.md](./ssr.md).

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

When two pickers share `document.documentElement` as the target, the
last apply wins. Either pass a per-picker `target` element, or
designate one picker as the "global" one and have the others apply
their themes to a wrapping element via `target`.

## "The picker re-fetches the same CSS file on every render"

It shouldn't — the managed `<link>` is reused, and changing
`themesUrl` is not enough to re-trigger `applyTheme`. If you observe
re-fetches:

- Confirm the surrounding component isn't remounting the picker every
  render (e.g. inside a keyed `{#each}` whose key is unstable).
- Confirm the consumer isn't manually removing the managed `<link>`
  on each render.

## "TypeScript complains about spreading restProps"

`Props` includes `[key: string]: unknown` so any HTML attribute is
acceptable, but strict TS configs may flag specific attributes. Use a
type assertion at the call site, or supply the attribute via
`element.setAttribute` inside an `onMount`.

## "Theme switch works locally but not in production"

Almost always a caching issue. Either:

- Add a cache-busting suffix via `extension` (e.g. `.css?v=1`), or
- Configure the static asset server to send `Cache-Control:
  must-revalidate` for theme CSS files.
