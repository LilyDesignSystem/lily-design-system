# SSR conventions for Lily Solid helpers

Every helper renders on the server with `@solidjs/web` (`renderToString`, `renderToStream`) and hydrates on the client.
Solid 2.0 retired SolidStart; server rendering is core Solid plus a Vite plugin, so these rules hold for any Solid SSR
setup.

## The contract

- **No DOM access while rendering.** `document`, `window`, `localStorage`, `navigator` and `matchMedia` are touched
  only inside `onSettled` or a `createEffect`'s `apply`, which never run on the server.
- **The first render depends only on props.** Given `value`, the server renders that choice; otherwise the default.
  After hydration the helper resolves its real initial value (storage, navigator, a media query) and applies it. If
  that differs from what the server rendered, the page shows one frame of the default: pass a server-resolved `value`
  (from a cookie) to avoid it.
- **Ids are `createUniqueId()`**, which the server and the client produce identically, so `aria-controls` and the
  tooltip id survive hydration.
- **`isServer`** from `@solidjs/web` guards any browser-only code outside a lifecycle: `if (!isServer) { … }`.

## Applying a preference before first paint

A preference picker (theme, locale, text size, motion, time zone) writes to `<html>`. On the server, set the same
attribute from a cookie in the document template, so the HTML arrives right:

```tsx
// server entry: read the cookie, render the document with the attribute already set
const theme = readCookie(request, "theme") ?? "light";
const html = renderToString(() => <App initialTheme={theme} />);
// … <html data-theme="${theme}"> … ${html}
```

```tsx
// App
<ThemePicker
  label="Theme"
  themes={["light", "dark"]}
  value={theme()}
  onChange={(next) => {
    setTheme(next);
    document.cookie = `theme=${next}; path=/; max-age=31536000; SameSite=Lax`;
  }}
/>
```

## Common pitfalls

- **"document is not defined" on the server**: a DOM read moved out of `onSettled` or an effect. Put it back.
- **Hydration mismatch**: the server and client rendered different props; pass the same `value` to both.
- **A preference that flashes**: the attribute on `<html>` was not set on the server; set it from the cookie.
