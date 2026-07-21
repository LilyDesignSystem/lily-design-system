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

## "Element doesn't upgrade — `<theme-chooser>` stays empty"

**Likely cause.** The browser parsed the host tag before the JS
module that registers the custom element ran. The host element
exists in the DOM but `connectedCallback` has not fired.

**Fix.** Either:

- Place the `<script type="module">` for `theme-chooser.js` in the
  `<head>` (it deferes by default, but the registration still runs
  before `DOMContentLoaded`).
- Or use the `customElements.whenDefined("theme-chooser")` API to
  await the registration before interacting with the element:

```ts
await customElements.whenDefined("theme-chooser");
const select = document.querySelector("theme-chooser");
// safe to interact
```

## "The dropdown pushes the page down instead of floating over it"

**Likely cause.** The package ships no CSS, and that includes
positioning. The `<ul class="theme-chooser-list">` is an ordinary
flow element until you position it.

**Fix.**

```css
.theme-chooser { position: relative; }
.theme-chooser-list {
    position: absolute;
    inset-block-start: 100%;
    inset-inline-start: 0;
    z-index: 10;
}
```

## "The dropdown is always visible, even when closed"

**Likely cause.** You set a `display` value on
`.theme-chooser-list`. A class selector outranks the user-agent
`[hidden] { display: none }` rule, so your `display` wins and the
closed list stays on screen.

**Fix.** Re-assert the hidden rule after yours, or scope your rule
to the open state:

```css
.theme-chooser-list { display: grid; }
.theme-chooser-list[hidden] { display: none; }

/* or */
.theme-chooser-list:not([hidden]) { display: grid; }
```

## "Keyboard users can't see which option they're on"

**Likely cause.** You styled `:focus` or `:hover` on the options but
not `[data-active]`. Focus stays on the `<ul>` while the list is
open — it never moves to an `<li>` — so `.theme-chooser-option:focus`
never matches. The keyboard highlight is `[data-active]`.

**Fix.**

```css
.theme-chooser-option[data-active] { background: #eee; }
.theme-chooser-list:focus-visible { outline: 2px solid currentColor; }
```

Also make sure `[data-active]` and `[aria-selected="true"]` look
different: the first is where `Enter` would land, the second is the
theme already applied.

## "The button shows a box / question mark instead of an icon"

**Likely cause.** Tofu. The glyph is a plain Unicode character
(U+25D1) and the package bundles no fonts, so rendering depends
entirely on the platform's installed fonts.

**Fix.** Override `renderButtonContent()` and return your own inline
SVG — see
[custom-rendering.md](./custom-rendering.md#recipe-an-inline-svg-icon).

## "Element upgrades but stays empty (no button)"

**Likely cause.** Required attributes (`label`, `themes-url`,
`themes`) are missing. The control doesn't throw — it just renders
no options, and `openList()` no-ops when `themes` is empty.

**Fix.** Confirm the host has all three attributes:

```html
<theme-chooser label="Theme" themes-url="/t/" themes="light,dark"></theme-chooser>
```

## "Theme does not persist across reloads"

Checklist:

- `storage-key` is set.
- `localStorage` is available (not blocked by private mode or
  browser extensions).
- No other component is overwriting the same key on mount.
- The page is not opened via `file://` — some browsers disable
  `localStorage` on the `file://` protocol.

## "The word 'default' appears in my option list"

It does not come from this component. The control only emits the
slug (title-cased) or the value from `theme-labels`. Check the
consumer markup wrapping the control for hardcoded "(default)"
annotations.

## "The list closes as soon as I click inside it"

**Likely cause.** Something is moving focus out of the rendered root
— a focus-trap library, a framework re-render, or a wrapper that
calls `focus()` elsewhere. The element closes on a click outside the
root and on focus leaving the root.

**Fix.** Ensure the list stays inside `.theme-chooser` in the DOM. If
you teleport / portal it elsewhere, both the outside-click check and
the focus-out check will treat it as external and close it
immediately.

## "Multiple controls fight over `<html data-theme>`"

When two controls share `document.documentElement` as the target,
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

The `ThemeChooser` class declares `value` as `string`. If you have
a typed enum of slugs, cast at the call site:

```ts
type Slug = "light" | "dark" | "abyss";
const select = document.querySelector<ThemeChooser>("theme-chooser")!;
select.value = "dark" satisfies Slug;
```

Or extend `ThemeChooser` and narrow the property type.

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

Private fields (`#x`) in TypeScript / JavaScript are *truly*
private — subclasses cannot override them.

For custom **button content**, which is the common case, override
the public `renderButtonContent()` instead. It is the supported
hook, and the base class keeps owning the aria wiring and the whole
keyboard contract.

For a different **structure**, override `connectedCallback` /
`attributeChangedCallback`, call `super.<callback>(...)`, and then
post-process the children — accepting that you take over the entire
accessibility contract in doing so.

See [custom-rendering.md](./custom-rendering.md) for both tiers.

## "My `renderButtonContent()` output goes stale"

**Likely cause.** You cached the returned node and hand back the same
instance on every call. The hook's return value *replaces* the
button's children, so a reused node is detached and reattached rather
than re-evaluated, and any text you set once never changes.

The hook itself re-runs on structural rebuilds (`themes`,
`theme-labels`, `label`, `name`, `class`) *and* on every state sync
(a `value` change, each open and close), so content that reads
`this.value` or `this.open` does stay current.

**Fix.** Build and return a fresh `Node` on each call. For purely
visual open/closed styling, prefer
`.theme-chooser-button[aria-expanded="true"]` in CSS over
re-rendering on `this.open`. See
[custom-rendering.md](./custom-rendering.md#timing).

## "`customElements.define` throws DOMException: tag already defined"

You imported the barrel twice in a setup that doesn't share the
module cache (e.g. two separate webpack chunks). The barrel guards
with `customElements.get("theme-chooser")` so this shouldn't happen
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
