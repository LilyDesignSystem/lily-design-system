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

**Likely cause.** `themes-url + slug + extension` does not resolve
to a real file. Check that:

- The themes directory is actually served by your static asset
  pipeline (e.g. `public/assets/themes/` under Vite, `static/` under
  Eleventy / Hugo).
- `extension` matches the file extension (`.css`, `.module.css`,
  etc).
- The slug case matches the file name (case-sensitive on most
  servers).

## "Element doesn't upgrade — `<theme-select>` stays empty"

**Likely cause.** The browser parsed the host tag before the JS
module that registers the custom element ran. The host element
exists in the DOM but `connectedCallback` has not fired.

**Fix.** Either:

- Place the `<script type="module">` for `theme-select.js` in the
  `<head>` (it deferes by default, but the registration still runs
  before `DOMContentLoaded`).
- Or use the `customElements.whenDefined("theme-select")` API to
  await the registration before interacting with the element:

```ts
await customElements.whenDefined("theme-select");
const select = document.querySelector("theme-select");
// safe to interact
```

## "Element upgrades but stays empty (no select)"

**Likely cause.** Required attributes (`label`, `themes-url`,
`themes`) are missing. The select doesn't throw — it just renders
no options.

**Fix.** Confirm the host has all three attributes:

```html
<theme-select label="Theme" themes-url="/t/" themes="light,dark"></theme-select>
```

## "Theme does not persist across reloads"

Checklist:

- `storage-key` is set.
- `localStorage` is available (not blocked by private mode or
  browser extensions).
- No other component is overwriting the same key on mount.
- The page is not opened via `file://` — some browsers disable
  `localStorage` on the `file://` protocol.

## "The word 'default' appears in my select"

It does not come from this component. The select only emits the
slug (title-cased) or the value from `theme-labels`. Check the
consumer markup wrapping the select for hardcoded "(default)"
annotations.

## "Multiple selects fight over `<html data-theme>`"

When two selects share `document.documentElement` as the target,
the last apply wins. Either pass a per-select `target` (via the
`el.target` JS property), or designate one select as the "global"
one and have the others apply their themes to a wrapping element
via `target`.

## "The select re-fetches the same CSS file on every render"

It shouldn't — the managed `<link>` is reused, and changing
`themes-url` is not enough to re-trigger `applyTheme`. If you
observe re-fetches:

- Confirm the surrounding code isn't removing and re-adding the
  select every render (e.g. inside a framework component whose
  conditional toggles rapidly).
- Confirm the consumer isn't manually removing the managed `<link>`
  on each render.

## "TypeScript complains about `el.value` being too narrow"

The `ThemeSelect` class declares `value` as `string`. If you have
a typed enum of slugs, cast at the call site:

```ts
type Slug = "light" | "dark" | "abyss";
const select = document.querySelector<ThemeSelect>("theme-select")!;
select.value = "dark" satisfies Slug;
```

Or extend `ThemeSelect` and narrow the property type.

## "Theme switch works locally but not in production"

Almost always a caching issue. Either:

- Add a cache-busting suffix via `extension` (e.g. `.css?v=1`), or
- Configure the static asset server to send
  `Cache-Control: must-revalidate` for theme CSS files.

## "Inside a `<dialog>` the select forgets its selection on close"

`<dialog>` doesn't detach its contents from the DOM on `close()`,
so the select stays mounted and its `disconnectedCallback` does not
fire. The selection persists. If you're seeing the opposite, you
might be removing the dialog from the DOM entirely on close (e.g.
`dialog.remove()`); change to `dialog.close()` to keep the select
mounted.

## "The `themechange` event doesn't fire"

Checklist:

- Confirm you're listening on the select, on an ancestor (events
  bubble), or with capture (`{ capture: true }`).
- Confirm `el.value` actually changed — the event fires only on a
  successful apply.
- If you're listening on `document`, also try the host element
  directly to rule out an interfering listener that calls
  `e.stopPropagation()`.

## "Subclassing breaks: my `#render()` override isn't called"

Private methods (`#x`) in TypeScript / JavaScript are *truly*
private — subclasses cannot override them. Override
`connectedCallback` / `attributeChangedCallback` instead, call
`super.<callback>(...)`, and then post-process the children.

See [custom-rendering.md](./custom-rendering.md) for the canonical
pattern.

## "`customElements.define` throws DOMException: tag already defined"

You imported the barrel twice in a setup that doesn't share the
module cache (e.g. two separate webpack chunks). The barrel guards
with `customElements.get("theme-select")` so this shouldn't happen
— if it does, the duplicate import is the bug, not the select.

## "Hydration mismatch warning (in a framework)"

Custom elements don't hydrate, so the warning is coming from your
framework (Vue, React, etc.) noticing that the rendered children
appeared after the framework's hydration pass. To silence:

- In Vue: wrap the host in `<ClientOnly>` if you can tolerate the
  flash.
- In React: render the host with `dangerouslySetInnerHTML` so React
  doesn't try to reconcile its children.
- Better: pre-render the host with all the right attributes; the
  upgraded children don't appear in the framework's virtual DOM, so
  there's nothing to reconcile.

---

Lily™ and Lily Design System™ are trademarks.
