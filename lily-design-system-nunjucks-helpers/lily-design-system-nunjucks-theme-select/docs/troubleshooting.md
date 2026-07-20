# Troubleshooting

Symptoms, root causes, and fixes for the most common problems.

## "Clicking the button does nothing"

**Likely cause.** `theme-select.client.js` has not run. The control
is an icon button plus a listbox, and every interactive behaviour —
open, close, focus movement, arrow keys, typeahead, selection — is
implemented in that module. The server-rendered markup is inert.
This is a genuine no-JS regression from the native `<select>` this
macro used to render; there is no fallback to fall back to.

**Fixes.**

- Confirm a `<script type="module">` on the page imports the client
  and calls `autoInit()` (or `initThemeSelect(root)`).
- Check the Console for a module-resolution error and the Network
  panel for a 404 on the client.js path.
- Check the CSP `script-src` directive allows the module's origin.
- If JavaScript is genuinely unavailable in your deployment target,
  this helper is the wrong tool — render a server-side form of
  links or submit buttons instead. The only no-JS affordance here
  is the pre-filled hidden input, which lets an enclosing form
  submit carry a theme.

## "The listbox opens but the arrow keys do nothing"

**Likely cause.** Focus never reached the `<ul>`. The client calls
`list.focus()` on open, which requires the `tabindex="-1"` the macro
renders. Hand-written or post-processed markup that drops
`tabindex="-1"` breaks the whole keyboard contract, because the
keydown handler is attached to the list, not the document.

**Fix.** Keep `tabindex="-1"` on the `<ul role="listbox">`. Also
check that no consumer script or CSS is moving focus away on open.

## "Two controls on the page interfere with each other"

**Likely cause.** They share a `name`, so they also share the
default id prefix `theme-select-{name}` — which means duplicate
listbox and option ids, and `aria-controls` /
`aria-activedescendant` resolving to whichever element the browser
finds first.

**Fix.** Give each instance a distinct `name` (usually what you
want anyway, since `name` also discriminates the managed `<link>`),
or, when they must share a `name`, pass distinct `id`s. Nunjucks
macros cannot generate per-instance ids automatically — see
[macro-opts-reference.md](./macro-opts-reference.md).

## "The button glyph renders as a box, or not at all"

**Likely cause.** The default glyph is U+25D1 CIRCLE WITH RIGHT
HALF BLACK (`◑`), and not every platform font covers it.

**Fix.** Supply your own icon through the `{% call %}` block — an
inline SVG has no font dependency. Mark it `aria-hidden="true"` so
the button's accessible name still comes only from `aria-label`.
See [custom-rendering.md](./custom-rendering.md).

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
  pipeline (Eleventy `addPassthroughCopy`, Express `static`, etc.).
- `extension` matches the file extension (`.css`, `.module.css`,
  etc.).
- The slug case matches the file name (case-sensitive on most
  servers).

## "Flash of unstyled theme on first paint"

**Likely cause.** The macro rendered with no `opts.value`, so the
root carries no `data-lily-theme-select-value` at first paint.
The client.js reads
`localStorage["my-app:theme"]` and applies the stored theme on
hydration; users see a frame of default-styled content first.

**Fix.** Resolve the theme on the server (cookie, header, session
store) and pass it as `opts.value`. See
[ssr.md](./ssr.md) for per-host recipes.

## "My stored theme stopped winning over the value I pass"

**Not a bug — an intentional BREAKING change.** The resolution order
used to run storage-first; it now runs

```
value > storage > system detection > defaultValue > "light" > first
```

`opts.value` is how a server-resolved theme reaches the page, and a
stale `localStorage` entry silently overriding it was the bug. Every
other Lily helper already resolved value-first.

**If you relied on the old behaviour**, make it explicit at the call
site: read `localStorage` in your own page script and pass the result
as `opts.value`. If you set `storageKey` and pass no `opts.value`,
nothing changes for you — storage is still the next input consulted.

See the BREAKING entry in [../CHANGELOG.md](../CHANGELOG.md).

## "detectFromSystem does nothing"

Checklist:

- The resolved slug — `"dark"` or `"light"` — is actually in your
  `themes` array. If you ship `["midnight", "daylight"]`, detection
  has nothing to match and contributes nothing.
- Neither `opts.value` nor a stored entry already resolved a theme;
  both outrank detection.
- `matchMedia` exists. It does not in Node, and it does not in jsdom,
  so `matchSystemTheme` returns `""` in both — by design.
- Your OS preference is what you think it is. Check
  `matchMedia("(prefers-color-scheme: dark)").matches` in the Console.

Also expected: the server-rendered `aria-selected` will not reflect
the system preference. Detection is client-only. See spec §5.8.

## "Theme does not persist across reloads"

Checklist:

- `opts.storageKey` is set.
- `localStorage` is available (not blocked by private mode or
  browser extensions).
- No other script is overwriting the same key on load.
- The client.js is actually loaded (check the Network panel for
  the script request and the Console for any module-load errors).

## "The word 'default' appears in my option list"

It does not come from this helper. The macro only emits the slug
(title-cased) or the value from `opts.themeLabels`. Check the
consumer markup wrapping the control for hardcoded "(default)"
annotations.

## "My `{% call %}` block renders options that don't work"

**Likely cause.** Stale markup from the native-`<select>` era. The
caller block no longer renders the option list — its body replaces
the button's **glyph**, inside the `<button>`. `<option>` elements
there are invalid markup and produce no choices.

**Fix.** Delete the options from the block and let `opts.themes`
render them; keep only your icon in the block body. See
[custom-rendering.md](./custom-rendering.md).

## "Multiple selects fight over `<html data-theme>`"

When two selects share `document.documentElement` as the target,
the last apply wins. Either pass a per-select `target` via the
client.js `opts`, or designate one select as the "global" one and
have the others apply their themes to a wrapping element.

```html
<script type="module">
    import { initThemeSelect } from "/path/to/theme-select.client.js";
    document
        .querySelectorAll("[data-lily-theme-select-root]")
        .forEach((root) => {
            const targetId = root.dataset.regionTarget;
            const target = targetId ? document.getElementById(targetId) : null;
            initThemeSelect(root, { target });
        });
</script>
```

## "The select re-fetches the same CSS file on every render"

It shouldn't — the managed `<link>` is reused, and the macro is
idempotent. If you observe re-fetches:

- Confirm the page isn't full-reloading between select
  interactions (a 304 still shows up in the Network panel).
- Confirm the consumer isn't manually removing the managed `<link>`
  before the next apply.
- Check the cache headers on the theme CSS files; a `Cache-Control:
  no-store` response forces a refetch every time.

## "autoInit() doesn't find my select"

**Likely cause.** The macro hasn't rendered the
`data-lily-theme-select-root` attribute, or the client.js runs
before the select is in the DOM.

**Fixes.**

- Render the select in the body, then load the client.js after.
  `<script type="module">` runs deferred by default, so this is
  usually correct.
- If you mount the select dynamically (after page load), call
  `initThemeSelect(root)` on the new root directly instead of
  relying on `autoInit()`.

## "Theme switch works locally but not in production"

Almost always a caching issue. Either:

- Add a cache-busting suffix via `extension` (e.g. `.css?v=1`),
  or
- Configure the static asset server to send
  `Cache-Control: must-revalidate` for theme CSS files.

## "The client.js throws `localStorage is not defined`"

`localStorage` is available in every modern browser. The error
usually means the client.js was imported in a non-browser
environment (a vitest spec without
`@vitest-environment jsdom`, a Node SSR pre-render, etc.).

**Fix.** The client.js's exported functions guard `document` but
not `localStorage`. Either run only in a browser context, or
override `Storage.prototype.getItem` for the duration of the test
environment. See the test file for the safe-storage pattern.

## "Eleventy build fails: `themeSelect is not a function`"

**Likely cause.** The macro file path in the `{% from %}`
statement is wrong, or the macro file uses an old syntax.

**Fixes.**

- Verify the path is relative to the importing template (e.g.
  `{% from "../helpers/theme-select.njk" import themeSelect %}`).
- Confirm the macro is named `themeSelect` (camelCase) inside the
  file — Nunjucks identifiers cannot contain hyphens.

## "CSP error: Refused to load stylesheet"

The select injects a `<link rel="stylesheet">` in `<head>`. The
CSP `style-src` directive must allow the themes URL.

**Fix.** Add the themes URL to `style-src` and (if the CSS uses
`@font-face` URLs) `font-src`:

```
Content-Security-Policy:
    default-src 'self';
    style-src 'self' https://cdn.example.com;
    font-src 'self' https://cdn.example.com;
```

## "TypeScript: cannot find module './theme-select.client.js'"

The client.js is a `.js` file (not `.ts`). TypeScript projects
need either a `.d.ts` ambient module declaration or
`allowJs: true` in `tsconfig.json`:

```jsonc
// tsconfig.json
{
    "compilerOptions": {
        "allowJs": true,
        "checkJs": false,
        // …
    }
}
```

Alternatively, ship your own `theme-select.client.d.ts`:

```ts
// theme-select.client.d.ts
export const CIRCLE_WITH_RIGHT_HALF_BLACK: string;
export function normaliseThemesUrl(url: string): string;
export function themeHref(url: string, slug: string, extension: string): string;
export function initThemeSelect(
    root: HTMLElement,
    opts?: { onChange?: (slug: string) => void; target?: HTMLElement | null },
): { setTheme: (slug: string) => void; destroy: () => void };
export function autoInit(
    opts?: { onChange?: (slug: string) => void; target?: HTMLElement | null },
): Array<{ setTheme: (slug: string) => void; destroy: () => void }>;
```

---

Lily™ and Lily Design System™ are trademarks.
