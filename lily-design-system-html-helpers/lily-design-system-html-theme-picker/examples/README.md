# Examples

Self-contained HTML examples for
`lily-design-system-html-theme-picker`. Each file is a runnable
page that can be opened in any browser after building the
custom-element module.

Every example assumes:

- A directory of theme CSS files served at `/assets/themes/`
  (typically `public/assets/themes/light.css`, etc.). The
  [Lily themes](../../../themes/) catalog ships 41 ready-to-use
  themes.
- A built copy of the `theme-picker` ES module at
  `/dist/theme-picker.js` (or any path you prefer; adjust the
  `<script type="module" src=…>` per example).
- Each theme CSS file scopes its tokens with
  `:root[data-theme="<slug>"]`.

| #  | File                                        | Demonstrates                              |
|----|---------------------------------------------|-------------------------------------------|
| 1  | [`01-basic.html`](./01-basic.html)          | Minimal three-theme picker.               |
| 2  | [`02-custom-labels.html`](./02-custom-labels.html) | `theme-labels` for i18n / display.   |
| 3  | [`03-multiple-pickers.html`](./03-multiple-pickers.html) | Two pickers in one page via `name`. |
| 4  | [`04-persistence.html`](./04-persistence.html) | `localStorage` survival across reloads. |
| 5  | [`05-preloaded.html`](./05-preloaded.html)  | Zero-flicker switching via preloading.    |
| 6  | [`06-system-preference.html`](./06-system-preference.html) | Follow `prefers-color-scheme`. |
| 7  | [`07-two-way-binding.html`](./07-two-way-binding.html) | Read/write `el.value`, `themechange`. |
| 8  | [`08-lily-themes.html`](./08-lily-themes.html) | All 41 Lily / DaisyUI themes.          |
| 9  | [`09-custom-rendering.html`](./09-custom-rendering.html) | Subclass with swatch buttons.    |
| 10 | [`eleventy-cookie/`](./eleventy-cookie/)    | Cookie-driven first-paint via Eleventy.   |

## Running the examples

These files are illustrations, not a hosted build. The fastest way
to try one:

1. Place the example file in a directory served by any local HTTP
   server (e.g. `python3 -m http.server`,
   `npx http-server`, Vite, …).
2. Place a built copy of `theme-picker.js` at the path the example
   references (typically `/dist/theme-picker.js`).
3. Copy a couple of theme CSS files from
   [`../../../themes/`](../../../themes/) into
   `/assets/themes/`.
4. Open the example in a browser.

## Attribute and property conventions

The custom-element attributes are kebab-case:

```html
<theme-picker
    label="Theme"
    themes-url="/assets/themes/"
    themes="light,dark"
    default-value="dark"
    storage-key="lily-theme"
    theme-labels='{"light":"Bright","dark":"Midnight"}'
></theme-picker>
```

The matching JS properties are camelCase. Array / object properties
accept the native form:

```ts
const picker = document.querySelector("theme-picker") as ThemePicker;
picker.themes = ["light", "dark", "abyss"];
picker.themeLabels = { light: "Bright" };
```

## CustomEvent listening

Every example that needs to react to a theme change uses:

```ts
picker.addEventListener("themechange", (e) => {
    const { theme } = (e as CustomEvent<{ theme: string }>).detail;
});
```

Because the event bubbles, `document.body.addEventListener(...)`
also works.

## See also

- [`../docs/recipes.md`](../docs/recipes.md) — short solutions for
  common problems.
- [`../docs/ssr.md`](../docs/ssr.md) — static-site-generation
  recipes (Eleventy, Astro, Hugo).
- [`../docs/styling.md`](../docs/styling.md) — class hooks and a
  suggested baseline CSS.
- [`../spec.md`](../spec.md) — the canonical contract.
