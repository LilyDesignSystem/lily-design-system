# Recipes

Short solutions to common adjacent problems. Each recipe is the
smallest code that solves the problem; production code may want
more error handling.

## Follow the OS colour scheme on first visit

```html
<theme-picker
    label="Theme"
    themes-url="/assets/themes/"
    themes="light,dark"
    storage-key="my-app:theme"
></theme-picker>

<script type="module">
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const picker = document.querySelector("theme-picker");
    picker.setAttribute("default-value", prefersDark ? "dark" : "light");
</script>
```

The user's explicit choice (via `storage-key`) wins on later visits.

## Track OS colour scheme changes live

```html
<theme-picker
    label="Theme"
    themes-url="/assets/themes/"
    themes="light,dark"
></theme-picker>

<script type="module">
    const picker = document.querySelector("theme-picker");
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", (e) => {
        picker.value = e.matches ? "dark" : "light";
    });
</script>
```

## Read a theme cookie before render (Eleventy)

See [`../examples/eleventy-cookie/`](../examples/eleventy-cookie/)
for the full recipe.

## Migrate from a localStorage-only picker to a cookie-backed one

1. Keep `storage-key` for now so existing users don't lose their
   preference.
2. In the `themechange` handler, also `fetch("/api/theme", { method: "POST", body: ... })`
   to write the cookie.
3. On the server, prefer the cookie. On the client, prefer the
   server-supplied value via the `value` attribute (which
   short-circuits the storage read).

```html
<theme-picker
    label="Theme"
    themes-url="/assets/themes/"
    themes="light,dark"
    storage-key="my-app:theme"
    value="dark"
></theme-picker>

<script type="module">
    const picker = document.querySelector("theme-picker");
    picker.addEventListener("themechange", (e) => {
        fetch("/api/theme", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ theme: e.detail.theme }),
        });
    });
</script>
```

## Build a flyout / dropdown UI

Subclass `ThemePicker` and replace the radio markup with a
disclosure button + popover. Keep the rendered `<fieldset>` around
the popover *trigger* so screen readers still hear the group label.
See [custom-rendering.md](./custom-rendering.md) for the pattern.

## Serve themes from a CDN

```html
<theme-picker
    themes-url="https://cdn.example.com/lily-themes/"
    themes="light,dark,abyss"
    label="Theme"
></theme-picker>
```

The CDN must allow cross-origin stylesheet loading. A stylesheet
served from a different origin does not need CORS for `<link>`
loading, but a `<link crossorigin="…">` attribute is needed if you
also need same-origin access to `document.styleSheets[].cssRules`.

## Cache-bust a theme

```html
<theme-picker
    themes-url="/assets/themes/"
    themes="light,dark"
    extension=".css?v=2025-06-05"
    label="Theme"
></theme-picker>
```

The extension is concatenated verbatim, so anything that comes
after the slug works.

## Multiple regions with independent themes

```html
<section data-region="hero">
    <theme-picker
        name="hero-theme"
        label="Hero theme"
        themes-url="/assets/themes/"
        themes="light,dark"
    ></theme-picker>
</section>

<script type="module">
    const hero = document.querySelector("[data-region=hero]");
    const picker = hero.querySelector("theme-picker");
    picker.target = hero;
    // Now picking a theme writes data-theme to the hero section
    // instead of <html>.
</script>
```

Each picker gets a distinct `name` (so the radios and managed
`<link>`s don't collide) and a distinct `target` (so `data-theme`
goes on the section root rather than `<html>`).

## Programmatically switch themes from a sibling component

```ts
// in a sibling
const picker = document.querySelector<ThemePicker>("theme-picker")!;
picker.value = "dark";
```

The picker reacts via `attributeChangedCallback` and applies the
new theme.

## Sync theme across multiple tabs

`localStorage` writes fire a `storage` event in other tabs:

```html
<theme-picker
    label="Theme"
    themes-url="/assets/themes/"
    themes="light,dark"
    storage-key="my-app:theme"
></theme-picker>

<script type="module">
    const picker = document.querySelector("theme-picker");
    window.addEventListener("storage", (e) => {
        if (e.key === "my-app:theme" && e.newValue) {
            picker.value = e.newValue;
        }
    });
</script>
```

## Disable the managed `<link>` and write tokens yourself

If you bundle every theme into one CSS file (Strategy 3 in
[preloading.md](./preloading.md)), the managed `<link>` is harmless
— but if you want to remove it entirely, subclass and skip the
`#applyTheme` step:

```ts
class TokensOnlyPicker extends ThemePicker {
    // Override the link creation by intercepting before the apply.
    // The cleanest approach is to short-circuit themesUrl so the
    // resulting href is a no-op.
}
```

Or simply ignore the 404 — the browser logs a warning but
`data-theme` still switches correctly.

## Listening for theme changes from outside the picker

Event delegation:

```ts
document.body.addEventListener("themechange", (e) => {
    console.log("theme changed:", (e as CustomEvent).detail.theme);
});
```

Because the event has `bubbles: true`, a single listener on
`document.body` catches every picker on the page.
