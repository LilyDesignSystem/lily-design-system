# Recipes

Short solutions to common adjacent problems. Each recipe is the
smallest code that solves the problem; production code may want
more error handling.

## Follow the OS colour scheme on first visit

Read the `Sec-CH-Prefers-Color-Scheme` client hint server-side
(supported by Chromium browsers when the server advertises
`Accept-CH: Sec-CH-Prefers-Color-Scheme`):

```js
// Express middleware
app.use((req, res, next) => {
    res.set("Accept-CH", "Sec-CH-Prefers-Color-Scheme");
    res.set("Critical-CH", "Sec-CH-Prefers-Color-Scheme");
    next();
});

app.get("/", (req, res) => {
    const prefersDark =
        req.headers["sec-ch-prefers-color-scheme"] === "dark";
    const theme = req.cookies.theme ?? (prefersDark ? "dark" : "light");
    res.render("index.njk", { theme });
});
```

```njk
{{ themeSelect({
    label: "Theme",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark"],
    value: theme,
    storageKey: "my-app:theme"
}) }}
```

Note the division of labour once both are set. `value` outranks
storage, so the cookie the server resolved is what applies — which is
what you want here, because the `onChange` handler writes the user's
explicit choice *into* that cookie, so the server's answer already is
the user's latest choice, and it follows them across devices.
`storageKey` is then a same-device cache for the case where the cookie
is missing or expired.

If you set `storageKey` **without** passing `value`, storage is the
first thing consulted and the user's explicit choice wins on later
visits exactly as you would expect.

## Track OS colour scheme changes live

Add a `matchMedia` listener in the consumer's JS that swaps the
theme via the controller:

```html
<script type="module">
    import {
        autoInit,
        initThemeSelect,
    } from "/path/to/theme-select.client.js";

    const [controller] = autoInit();
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", (e) => {
        controller.setTheme(e.matches ? "dark" : "light");
    });
</script>
```

## Read a theme cookie before render (Eleventy edge function)

See [`../examples/eleventy-cookie/`](../examples/eleventy-cookie/)
for the full recipe.

## Migrate from a localStorage-only select to a cookie-backed one

1. Keep `storageKey` for now so existing users don't lose their
   preference.
2. In the `onChange` handler, also `fetch("/api/theme", { method:
   "POST", body: JSON.stringify({ theme: slug }) })` to write the
   cookie.
3. On the server, prefer the cookie and pass it as `opts.value`. The
   client then prefers it automatically: `value` is the first input in
   the resolution order, ahead of the `localStorage` entry you kept in
   step 1. That is exactly the migration behaviour you want — the
   cookie leads, storage covers the users who have not been through an
   `onChange` yet.
4. Once traffic has cycled through, drop `storageKey` if you no longer
   want a same-device cache.

## Replace the button glyph with your own icon

The control is already a button-triggered dropdown. The one piece
of markup it hands over is the glyph, via a `{% call %}` block:

```njk
{% call themeSelect({
    label: "Theme",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark"]
}) %}
    <svg width="16" height="16" aria-hidden="true" focusable="false">
        <use href="#icon-palette"></use>
    </svg>
{% endcall %}
```

Keep `aria-hidden="true"` on the glyph — the button's accessible
name must keep coming from `aria-label`. Everything else (the
listbox, the ARIA wiring, the keyboard contract) stays
macro-rendered. Full details in
[custom-rendering](./custom-rendering.md).

## Style the open listbox

The client toggles `hidden` on the `<ul>` and sets `data-active` on
the option under the keyboard cursor, so positioning and highlight
are pure CSS:

```css
.theme-select { position: relative; display: inline-block; }
.theme-select-list { position: absolute; inset-inline-start: 0; z-index: 1; }
.theme-select-option[data-active] { background: Highlight; }
.theme-select-option[aria-selected="true"]::after { content: "\2713"; }
```

## Serve themes from a CDN

```njk
{{ themeSelect({
    label: "Theme",
    themesUrl: "https://cdn.example.com/lily-themes/",
    themes: ["light", "dark", "abyss"]
}) }}
```

The CDN must allow cross-origin stylesheet loading (a stylesheet
served from a different origin does not need CORS, but a
`<link crossorigin="…">` attribute is needed if you also need
`document.styleSheets[].cssRules` access from the same origin).

## Cache-bust a theme

```njk
{{ themeSelect({
    label: "Theme",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark"],
    extension: ".css?v=2025-06-05"
}) }}
```

The extension is concatenated verbatim, so anything that comes
after the slug works.

## Multiple regions with independent themes

See [`../examples/03-multiple-selects.njk`](../examples/03-multiple-selects.njk).
Each select gets a distinct `name` (so the selects and managed
`<link>`s don't collide) and a distinct `target` (so `data-theme`
goes on the section root rather than `<html>`).

The `target` is set at `initThemeSelect` time, not via macro opts:

```html
<script type="module">
    import { initThemeSelect } from "/path/to/theme-select.client.js";
    initThemeSelect(
        document.querySelector("[data-lily-theme-select-name='region-a']"),
        { target: document.querySelector("section.region-a") },
    );
    initThemeSelect(
        document.querySelector("[data-lily-theme-select-name='region-b']"),
        { target: document.querySelector("section.region-b") },
    );
</script>
```

## Programmatically switch themes from a sibling component

The controller returned by `initThemeSelect` exposes `setTheme`.
Hoist it to a shared module:

```html
<script type="module">
    import { autoInit } from "/path/to/theme-select.client.js";
    const controllers = autoInit();
    window.__themeController = controllers[0]; // singleton select
</script>

<script type="module">
    // elsewhere
    document.getElementById("go-dark").addEventListener("click", () => {
        window.__themeController.setTheme("dark");
    });
</script>
```

## Sync theme across multiple tabs

`localStorage` writes fire a `storage` event in other tabs:

```html
<script type="module">
    import { autoInit } from "/path/to/theme-select.client.js";
    const controllers = autoInit();
    window.addEventListener("storage", (e) => {
        if (e.key === "my-app:theme" && e.newValue) {
            controllers.forEach((c) => c.setTheme(e.newValue));
        }
    });
</script>
```

## Lazy-load the runtime

The macro renders the markup eagerly. To delay the runtime, put
the client.js import inside an `IntersectionObserver`:

```html
<script type="module">
    const observer = new IntersectionObserver(async (entries) => {
        for (const e of entries) {
            if (!e.isIntersecting) continue;
            const { autoInit } = await import(
                "/path/to/theme-select.client.js"
            );
            autoInit();
            observer.disconnect();
        }
    });
    document
        .querySelectorAll("[data-lily-theme-select-root]")
        .forEach((root) => observer.observe(root));
</script>
```

Be aware of what this trades away: until the module loads, the
button is dead. It will not open the listbox, and there is no
native fallback — the control is not a `<select>` any more. Only
defer the runtime for a control that is genuinely below the fold,
and prefer a plain deferred `<script type="module">` unless the
byte savings are measured and real. See [ssr.md](./ssr.md) for the
full no-JS picture.

---

Lily™ and Lily Design System™ are trademarks.
