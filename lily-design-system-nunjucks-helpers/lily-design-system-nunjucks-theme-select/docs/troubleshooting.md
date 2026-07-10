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
  pipeline (Eleventy `addPassthroughCopy`, Express `static`, etc.).
- `extension` matches the file extension (`.css`, `.module.css`,
  etc.).
- The slug case matches the file name (case-sensitive on most
  servers).

## "Flash of unstyled theme on first paint"

**Likely cause.** The macro rendered with no `opts.value`, so no
`<option>` is `selected` at first paint. The client.js reads
`localStorage["my-app:theme"]` and applies the stored theme on
hydration; users see a frame of default-styled content first.

**Fix.** Resolve the theme on the server (cookie, header, session
store) and pass it as `opts.value`. See
[ssr.md](./ssr.md) for per-host recipes.

## "Theme does not persist across reloads"

Checklist:

- `opts.storageKey` is set.
- `localStorage` is available (not blocked by private mode or
  browser extensions).
- No other script is overwriting the same key on load.
- The client.js is actually loaded (check the Network panel for
  the script request and the Console for any module-load errors).

## "The word 'default' appears in my select"

It does not come from this helper. The macro only emits the slug
(title-cased) or the value from `opts.themeLabels`. Check the
consumer markup wrapping the select for hardcoded "(default)"
annotations.

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
