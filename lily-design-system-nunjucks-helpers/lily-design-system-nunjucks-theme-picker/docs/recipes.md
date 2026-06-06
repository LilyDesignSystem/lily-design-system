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
{{ themePicker({
    label: "Theme",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark"],
    value: theme,
    storageKey: "my-app:theme"
}) }}
```

The user's explicit choice (via `storageKey`) wins on later
visits.

## Track OS colour scheme changes live

Add a `matchMedia` listener in the consumer's JS that swaps the
theme via the controller:

```html
<script type="module">
    import {
        autoInit,
        initThemePicker,
    } from "/path/to/theme-picker.client.js";

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

## Migrate from a localStorage-only picker to a cookie-backed one

1. Keep `storageKey` for now so existing users don't lose their
   preference.
2. In the `onChange` handler, also `fetch("/api/theme", { method:
   "POST", body: JSON.stringify({ theme: slug }) })` to write the
   cookie.
3. On the server, prefer the cookie. On the client, prefer the
   server-supplied `opts.value` (which short-circuits the storage
   read by being the `checked` radio at init time).

## Build a flyout / dropdown UI

Use [custom-rendering](./custom-rendering.md) to swap the radio
list for a button-triggered popover. Keep the picker's fieldset
around the flyout *trigger* so screen readers still hear the
group label.

## Serve themes from a CDN

```njk
{{ themePicker({
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
{{ themePicker({
    label: "Theme",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark"],
    extension: ".css?v=2025-06-05"
}) }}
```

The extension is concatenated verbatim, so anything that comes
after the slug works.

## Multiple regions with independent themes

See [`../examples/03-multiple-pickers.njk`](../examples/03-multiple-pickers.njk).
Each picker gets a distinct `name` (so the radios and managed
`<link>`s don't collide) and a distinct `target` (so `data-theme`
goes on the section root rather than `<html>`).

The `target` is set at `initThemePicker` time, not via macro opts:

```html
<script type="module">
    import { initThemePicker } from "/path/to/theme-picker.client.js";
    initThemePicker(
        document.querySelector("[data-lily-theme-picker-name='region-a']"),
        { target: document.querySelector("section.region-a") },
    );
    initThemePicker(
        document.querySelector("[data-lily-theme-picker-name='region-b']"),
        { target: document.querySelector("section.region-b") },
    );
</script>
```

## Programmatically switch themes from a sibling component

The controller returned by `initThemePicker` exposes `setTheme`.
Hoist it to a shared module:

```html
<script type="module">
    import { autoInit } from "/path/to/theme-picker.client.js";
    const controllers = autoInit();
    window.__themeController = controllers[0]; // singleton picker
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
    import { autoInit } from "/path/to/theme-picker.client.js";
    const controllers = autoInit();
    window.addEventListener("storage", (e) => {
        if (e.key === "my-app:theme" && e.newValue) {
            controllers.forEach((c) => c.setTheme(e.newValue));
        }
    });
</script>
```

## Lazy-load the picker

The macro renders the fieldset eagerly. To delay the runtime, put
the client.js import inside an `IntersectionObserver`:

```html
<script type="module">
    const observer = new IntersectionObserver(async (entries) => {
        for (const e of entries) {
            if (!e.isIntersecting) continue;
            const { autoInit } = await import(
                "/path/to/theme-picker.client.js"
            );
            autoInit();
            observer.disconnect();
        }
    });
    document
        .querySelectorAll("[data-lily-theme-picker-root]")
        .forEach((root) => observer.observe(root));
</script>
```

The radios remain interactive without JS (form-submission level),
and the apply lifecycle kicks in once the picker scrolls into
view.
