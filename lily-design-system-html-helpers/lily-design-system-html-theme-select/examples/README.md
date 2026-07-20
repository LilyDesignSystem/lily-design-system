# Examples

Self-contained HTML examples for
`lily-design-system-html-theme-select`. Each file is a runnable
page that can be opened in any browser after building the
custom-element module.

Every example assumes:

- A directory of theme CSS files served at `/assets/themes/`
  (typically `public/assets/themes/light.css`, etc.). The
  [Lily themes](../../../themes/) catalog ships 45 ready-to-use
  themes.
- A built copy of the `theme-select` ES module at
  `/dist/theme-select.js` (or any path you prefer; adjust the
  `<script type="module" src=…>` per example).
- Each theme CSS file scopes its tokens with
  `:root[data-theme="<slug>"]`.

| #  | File                                        | Demonstrates                              |
|----|---------------------------------------------|-------------------------------------------|
| 1  | [`01-basic.html`](./01-basic.html)          | Minimal three-theme select.               |
| 2  | [`02-custom-labels.html`](./02-custom-labels.html) | `theme-labels` for i18n / display.   |
| 3  | [`03-multiple-selects.html`](./03-multiple-selects.html) | Two selects in one page via `name`. |
| 4  | [`04-persistence.html`](./04-persistence.html) | `localStorage` survival across reloads. |
| 5  | [`05-preloaded.html`](./05-preloaded.html)  | Zero-flicker switching via preloading.    |
| 6  | [`06-system-preference.html`](./06-system-preference.html) | Follow `prefers-color-scheme`. |
| 7  | [`07-two-way-binding.html`](./07-two-way-binding.html) | Read/write `el.value`, `themechange`. |
| 8  | [`08-lily-themes.html`](./08-lily-themes.html) | All 45 Lily themes.                    |
| 9  | [`09-custom-rendering.html`](./09-custom-rendering.html) | `renderButtonContent()`: inline SVG, and glyph + theme name. |
| 10 | [`eleventy-cookie/`](./eleventy-cookie/)    | Cookie-driven first-paint via Eleventy.   |

## The examples ship their own CSS — deliberately

The package ships no CSS at all, and that includes the dropdown's
positioning: the `<ul class="theme-select-list">` renders in normal
flow until the consumer gives the root `position: relative` and the
list `position: absolute`. Examples 1 and 9 carry a `<style>` block
with the minimum needed, including the `[hidden]` re-assertion that
keeps the closed list hidden. Copy it as a starting point; the full
version is in [`../docs/styling.md`](../docs/styling.md).

## Running the examples

These files are illustrations, not a hosted build. The fastest way
to try one:

1. Place the example file in a directory served by any local HTTP
   server (e.g. `python3 -m http.server`,
   `npx http-server`, Vite, …).
2. Place a built copy of `theme-select.js` at the path the example
   references (typically `/dist/theme-select.js`).
3. Copy a couple of theme CSS files from
   [`../../../themes/`](../../../themes/) into
   `/assets/themes/`.
4. Open the example in a browser.

## Attribute and property conventions

The custom-element attributes are kebab-case:

```html
<theme-select
    label="Theme"
    themes-url="/assets/themes/"
    themes="light,dark"
    default-value="dark"
    storage-key="lily-theme"
    theme-labels='{"light":"Bright","dark":"Midnight"}'
></theme-select>
```

The matching JS properties are camelCase. Array / object properties
accept the native form:

```ts
const select = document.querySelector("theme-select") as ThemeSelect;
select.themes = ["light", "dark", "abyss"];
select.themeLabels = { light: "Bright" };
```

## CustomEvent listening

Every example that needs to react to a theme change uses:

```ts
select.addEventListener("themechange", (e) => {
    const { theme } = (e as CustomEvent<{ theme: string }>).detail;
});
```

Because the event bubbles, `document.body.addEventListener(...)`
also works.

Use the element's public `labelFor(slug)` to turn the slug into a
display name — it applies `theme-labels` overrides and falls back to
the title-cased slug:

```ts
select.addEventListener("themechange", (e) => {
    console.log(select.labelFor(e.detail.theme));
});
```

## See also

- [`../docs/recipes.md`](../docs/recipes.md) — short solutions for
  common problems.
- [`../docs/ssr.md`](../docs/ssr.md) — static-site-generation
  recipes (Eleventy, Astro, Hugo).
- [`../docs/styling.md`](../docs/styling.md) — class hooks and a
  suggested baseline CSS.
- [`../spec/index.md`](../spec/index.md) — the canonical contract.
