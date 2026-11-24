# SSR and hydration

The select is SSR-safe out of the box but does not, on its own,
deliver a flicker-free first paint. This guide explains why and how
to close the gap.

## What the select does on the server

Under SSR, no `$effect` runs and the select does not touch the DOM.
The rendered HTML looks like:

```html
<div class="theme-picker">
  <input
    type="hidden"
    name="theme"
    value=""
  />
  <button
    type="button"
    class="theme-picker-button"
    aria-label="Theme"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-controls="theme-picker-1-list"
  >
    <svg
      class="theme-picker-icon"
      viewBox="0 0 16 16"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
      />
      <path
        d="M8 2a6 6 0 0 1 0 12z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  </button>
  <ul
    class="theme-picker-list"
    id="theme-picker-1-list"
    role="listbox"
    aria-label="Theme"
    tabindex="-1"
    hidden
  >
    <li
      class="theme-picker-option"
      id="theme-picker-1-option-0"
      role="option"
      aria-selected="false"
    >
      Light
    </li>
    …
  </ul>
</div>
```

No option is `aria-selected` and the hidden input is empty unless the
consumer supplied a non-empty `value`.

Option ids come from an incrementing module counter
(`nextThemePickerId`), not from `Math.random()` or `Date.now()`, so the
server and the client generate the same ids in the same mount order and
hydration matches.

## What happens on hydration

On the client the select's `$effect` runs once after mount:

1. Resolves the initial slug per
   [spec/index.md §5.2](../spec/index.md#52-initial-value-resolution).
2. Writes the resolved slug back to the bindable `value`.
3. Injects / sets the managed `<link>` href.
4. Sets `data-theme` on the target.

If the resolved slug differs from the one that the server rendered
with, the user sees one frame of unstyled (or wrongly-themed) content
before the effect runs. This is the "flash of unstyled theme" (FOUT).

## How to get a flicker-free first paint

The fix is to **resolve the theme on the server** and inline both:

- `<html data-theme="<slug>">` in the document shell, and
- the `<link rel="stylesheet" href="/assets/themes/<slug>.css">`

so that CSS is in place before any pixel is painted. The select can
then hydrate without changing anything visible.

### SvelteKit recipe

End-to-end code lives in
[`../examples/sveltekit-cookie/`](../examples/sveltekit-cookie/).
The shape is:

1. The picker writes every change of choice to a first-party
   `lily-theme` cookie itself, once it is given `cookieName="lily-theme"`
   (the cookie is off by default since 2026-11-24). No endpoint is needed.
2. `hooks.server.ts` reads it with `readThemeCookie(cookie, "lily-theme", allowed)`
   into `event.locals.theme` and uses `transformPageChunk` to substitute
   `data-theme` and the theme's `<link>` into `app.html`.
3. The picker is mounted with `value={data.theme}` (forwarded from a
   layout `load` function), so the server and the client agree.

### Astro recipe

In an Astro layout:

```astro
---
const theme = Astro.cookies.get("theme")?.value ?? "light";
---
<html lang="en" data-theme={theme}>
  <head>
    <link rel="stylesheet" href={`/assets/themes/${theme}.css`} />
  </head>
  <body>
    <ThemePicker value={theme} ... />
    <slot />
  </body>
</html>
```

### Hydration mismatch

If Svelte logs a `hydration_mismatch` warning, the usual cause is that
the server rendered with an empty `value` while the client resolved a
non-empty one from `localStorage`, `detectFromSystem`, or
`defaultValue` — so `aria-selected` and the hidden input's `value`
differ between the two passes.

The fix is the same as for the flash: resolve the theme on the server
and pass it as `value`.

Note that `detectFromSystem` can only ever run on the client —
`matchMedia` does not exist on the server — so enabling it guarantees a
client-side resolution step unless `value` or storage short-circuits
it first.

### Plain Vite + Svelte recipe

Without SSR, there is no first-paint problem worth solving — the
select hydrates from `localStorage` before content renders if you
mount it at the top of `<body>`. Avoid styles depending on
`data-theme` for the first paint, or hard-code the default theme's
`<link>` in `index.html`.

## A cookie the server can read

`localStorage` is invisible to a server, so a page kept there is always
sent in the default theme and corrected after the script runs. A cookie
travels with every request. By default the picker keeps each change of
choice in one as well as in `localStorage`, named `lily-{name}` (`Path=/`, `SameSite=Lax`, `Secure` on https, 400 days),
and the module exports what a server needs:

```ts
import { readThemeCookie, themeCookie, SYSTEM_THEME } from "@lilydesignsystem/svelte-theme-picker";

const choice = readThemeCookie(request.headers.get("cookie"), "lily-theme", [
  "system",
  "light",
  "dark",
]);
```

`readThemeCookie` returns `""` when the cookie is absent, cannot be
decoded, or is not in the list you allow: never put a cookie into a
stylesheet URL unchecked. `themeCookie(name, value, secure)` builds the
same string for a `Set-Cookie` header, if the server sets it instead.

The choice can be `"system"` ("Follow this device", `systemLabel`). The
server cannot know the device's colour scheme, so link both themes and
let the browser choose until the picker hydrates:

```html
<link
  rel="stylesheet"
  href="/assets/themes/light.css"
  media="(prefers-color-scheme: light)"
/>
<link
  rel="stylesheet"
  href="/assets/themes/dark.css"
  media="(prefers-color-scheme: dark)"
/>
```

Leave `data-theme` off `<html>` for `"system"`, or set it from a small
inline script that reads `matchMedia` before the body renders.

Other transports (a header, a server-side preference store, a URL
parameter) still work as before: pass the resolved `value` and leave
`cookieName` unset, so no cookie is kept.

---

Lily™ and Lily Design System™ are trademarks.
