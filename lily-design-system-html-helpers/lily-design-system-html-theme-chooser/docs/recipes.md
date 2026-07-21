# Recipes

Short solutions to common adjacent problems. Each recipe is the
smallest code that solves the problem; production code may want
more error handling.

## Follow the OS colour scheme on first visit

Add the `detect-from-system` boolean attribute. No script needed.

```html
<theme-chooser
    label="Theme"
    themes-url="/assets/themes/"
    themes="light,dark"
    storage-key="my-app:theme"
    detect-from-system
></theme-chooser>
```

Detection sits between storage and `default-value` in the resolution
order (`value` > storage > detection > `default-value` > `"light"` >
first), so a user's explicit past choice still wins on later visits,
and a server-rendered `value` still wins over both.

It maps `prefers-color-scheme` to the slug `"dark"` or `"light"`. If
your catalog has no slug by that name, detection returns `""` and
resolution falls through — reach for the exported helper and your own
mapping instead:

```ts
import { matchSystemTheme } from "lily-design-system-html-theme-chooser";

// Catalog uses "midnight" rather than "dark".
const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
select.setAttribute("default-value", prefersDark ? "midnight" : "daylight");
```

## Track OS colour scheme changes live

`detect-from-system` resolves the *initial* value only; it does not
subscribe. To follow the OS while the page is open, add a listener:

```html
<theme-chooser
    label="Theme"
    themes-url="/assets/themes/"
    themes="light,dark"
></theme-chooser>

<script type="module">
    const select = document.querySelector("theme-chooser");
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", (e) => {
        select.value = e.matches ? "dark" : "light";
    });
</script>
```

## Read a theme cookie before render (Eleventy)

See [`../examples/eleventy-cookie/`](../examples/eleventy-cookie/)
for the full recipe.

## Migrate from a localStorage-only select to a cookie-backed one

1. Keep `storage-key` for now so existing users don't lose their
   preference.
2. In the `themechange` handler, also `fetch("/api/theme", { method: "POST", body: ... })`
   to write the cookie.
3. On the server, prefer the cookie. On the client, prefer the
   server-supplied value via the `value` attribute (which
   short-circuits the storage read).

```html
<theme-chooser
    label="Theme"
    themes-url="/assets/themes/"
    themes="light,dark"
    storage-key="my-app:theme"
    value="dark"
></theme-chooser>

<script type="module">
    const select = document.querySelector("theme-chooser");
    select.addEventListener("themechange", (e) => {
        fetch("/api/theme", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ theme: e.detail.theme }),
        });
    });
</script>
```

## Position the dropdown

The control already *is* a disclosure button plus a listbox — but it
ships no CSS, so the list renders in flow until you position it:

```css
.theme-chooser { position: relative; }

.theme-chooser-list {
    position: absolute;
    inset-block-start: calc(100% + 0.25rem);
    inset-inline-start: 0;
    z-index: 10;
}
```

Full worked example, including the `[hidden]` trap to avoid:
[styling.md](./styling.md#a-minimal-worked-example).

## Put the theme name on the button

The default button is icon-only, so nothing shows the active theme.
Override `renderButtonContent()` to render the label instead of (or
beside) the glyph:

```ts
class LabelledThemeChooser extends ThemeChooser {
    renderButtonContent(): Node {
        const span = document.createElement("span");
        span.className = "theme-chooser-button-label";
        span.textContent = this.labelFor(this.value);
        return span;
    }
}
customElements.define("labelled-theme-chooser", LabelledThemeChooser);
```

No listener is needed: the hook re-runs on every state sync as well
as on structural rebuilds, so the label follows `this.value`
automatically. See
[custom-rendering.md](./custom-rendering.md#timing).

## Show the active theme in a status region

The recommended default. `labelFor()` is public, so the status line
picks up `theme-labels` and translations for free:

```html
<theme-chooser label="Theme" themes-url="/assets/themes/" themes="light,dark"></theme-chooser>
<p class="theme-chooser-status" aria-live="polite">Active theme: Light</p>

<script type="module">
    await customElements.whenDefined("theme-chooser");
    const select = document.querySelector("theme-chooser");
    const status = document.querySelector(".theme-chooser-status");
    select.addEventListener("themechange", (e) => {
        status.textContent = `Active theme: ${select.labelFor(e.detail.theme)}`;
    });
</script>
```

## Open or close the list from your own code

`openList()` and `closeList()` are public:

```ts
const select = document.querySelector<ThemeChooser>("theme-chooser")!;

select.openList();        // open on the selected option
select.openList(0);       // open on the first option
select.closeList();       // close, returning focus to the button
select.closeList(false);  // close, leaving focus where it is

if (select.open) { /* … */ }
```

Useful for a keyboard shortcut that opens the theme menu, or for
closing every open dropdown when a modal opens.

## Serve themes from a CDN

```html
<theme-chooser
    themes-url="https://cdn.example.com/lily-themes/"
    themes="light,dark,abyss"
    label="Theme"
></theme-chooser>
```

The CDN must allow cross-origin stylesheet loading. A stylesheet
served from a different origin does not need CORS for `<link>`
loading, but a `<link crossorigin="…">` attribute is needed if you
also need same-origin access to `document.styleSheets[].cssRules`.

## Cache-bust a theme

```html
<theme-chooser
    themes-url="/assets/themes/"
    themes="light,dark"
    extension=".css?v=2025-06-05"
    label="Theme"
></theme-chooser>
```

The extension is concatenated verbatim, so anything that comes
after the slug works.

## Multiple regions with independent themes

```html
<section data-region="hero">
    <theme-chooser
        name="hero-theme"
        label="Hero theme"
        themes-url="/assets/themes/"
        themes="light,dark"
    ></theme-chooser>
</section>

<script type="module">
    const hero = document.querySelector("[data-region=hero]");
    const select = hero.querySelector("theme-chooser");
    select.target = hero;
    // Now picking a theme writes data-theme to the hero section
    // instead of <html>.
</script>
```

Each control gets a distinct `name` (so the hidden inputs and
managed `<link>`s don't collide) and a distinct `target` (so
`data-theme` goes on the section root rather than `<html>`).

## Programmatically switch themes from a sibling component

```ts
// in a sibling
const select = document.querySelector<ThemeChooser>("theme-chooser")!;
select.value = "dark";
```

The select reacts via `attributeChangedCallback` and applies the
new theme.

## Sync theme across multiple tabs

`localStorage` writes fire a `storage` event in other tabs:

```html
<theme-chooser
    label="Theme"
    themes-url="/assets/themes/"
    themes="light,dark"
    storage-key="my-app:theme"
></theme-chooser>

<script type="module">
    const select = document.querySelector("theme-chooser");
    window.addEventListener("storage", (e) => {
        if (e.key === "my-app:theme" && e.newValue) {
            select.value = e.newValue;
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
class TokensOnlyPicker extends ThemeChooser {
    // Override the link creation by intercepting before the apply.
    // The cleanest approach is to short-circuit themesUrl so the
    // resulting href is a no-op.
}
```

Or simply ignore the 404 — the browser logs a warning but
`data-theme` still switches correctly.

## Listening for theme changes from outside the select

Event delegation:

```ts
document.body.addEventListener("themechange", (e) => {
    console.log("theme changed:", (e as CustomEvent).detail.theme);
});
```

Because the event has `bubbles: true`, a single listener on
`document.body` catches every select on the page.

---

Lily™ and Lily Design System™ are trademarks.
