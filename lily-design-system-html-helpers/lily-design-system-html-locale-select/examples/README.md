# Examples

Self-contained HTML examples for
`lily-design-system-html-locale-select`. Each file is a runnable
page that can be opened in any browser after building the
custom-element module.

Every example assumes:

- A built copy of the `locale-select` ES module at
  `../../locale-select.js` (relative to the example). Consumers may
  need to compile `locale-select.ts` → `.js` first (any TS toolchain
  works: `tsc`, `esbuild`, `vite`, `bun build`, …).
- A modern browser supporting custom elements, ES modules, and (for
  some examples) dynamic imports from CDN.

| #  | File                                          | Demonstrates                                |
| -- | --------------------------------------------- | ------------------------------------------- |
| 1  | [`01-radios.html`](./01-radios.html)          | Default native `<select>` rendering.        |
| 2  | [`02-select.html`](./02-select.html)          | Styling the native `<select>`.              |
| 3  | [`03-buttons.html`](./03-buttons.html)        | Toggle buttons with `aria-pressed`.         |
| 4  | [`04-rtl-demo.html`](./04-rtl-demo.html)      | Auto-detected RTL flipping for Arabic etc.  |
| 5  | [`05-nhs-style.html`](./05-nhs-style.html)    | NHS UK-style language banner.               |
| 6  | [`06-with-formatjs.html`](./06-with-formatjs.html) | FormatJS IntlMessageFormat from CDN.   |
| 7  | [`07-with-intl.html`](./07-with-intl.html)    | Native `Intl.*` formatters on `localechange`. |
| 8  | [`08-ssr-cookie.html`](./08-ssr-cookie.html)  | SSG / SSR cookie pre-seed flow.             |
| 9  | [`09-scoped-target.html`](./09-scoped-target.html) | `target` property — panel-only lang/dir. |
| 10 | [`10-combobox.html`](./10-combobox.html)      | `<datalist>` combobox for long locale lists.|

## Running the examples

These files are illustrations, not a hosted build. The fastest way
to try one:

1. Compile `locale-select.ts` → `locale-select.js` at the project
   root (the path `../../locale-select.js` is relative to each
   example file).
2. Serve the directory with any static HTTP server (e.g.
   `python3 -m http.server`, `npx http-server`, Vite, …).
3. Open the example URL in a browser.

If your build pipeline emits the bundle elsewhere, change the
`<script type="module" src=…>` line at the top of each example to
match.

## Attribute and property conventions

The custom-element attributes are kebab-case:

```html
<locale-select
    label="Language"
    locales="en,fr,ar"
    value="en"
    default-value="en"
    storage-key="app-locale"
    name="locale"
    apply-dir="false"
    detect-from-navigator
    locale-labels='{"en":"English","fr":"Français","ar":"العربية"}'
></locale-select>
```

The matching JS properties are camelCase. Array / object properties
accept the native form:

```js
const select = document.querySelector("locale-select");
select.locales = ["en", "fr", "ar"];
select.localeLabels = { en: "English", fr: "Français" };
select.target = document.querySelector("#widget");   // no attribute form
```

## CustomEvent listening

Every example that needs to react to a locale change uses:

```js
select.addEventListener("localechange", (e) => {
    const code = e.detail.locale;
});
```

Because the event bubbles and is composed, `document.body.addEventListener(...)`
also works — even across Shadow DOM boundaries.

## Custom rendering via subclassing

The HTML helpers don't have Vue scoped slots or Svelte snippets.
For custom markup (`<select>`, buttons, combobox), extend the
`LocaleSelect` class and override `connectedCallback` /
`attributeChangedCallback` (private methods cannot be overridden).
The base class keeps owning the lifecycle: `lang` / `dir` writes,
`localStorage`, the `localechange` event. See examples
[2](./02-select.html), [3](./03-buttons.html),
[5](./05-nhs-style.html), and [10](./10-combobox.html) for the
pattern.

## See also

- [`../docs/concepts.md`](../docs/concepts.md) — what the select
  owns vs leaves to the consumer.
- [`../docs/accessibility.md`](../docs/accessibility.md) — WCAG 2.2
  AAA and native `<select>` combobox conformance.
- [`../docs/bcp47.md`](../docs/bcp47.md) — locale tag format and
  normalisation rules.
- [`../docs/rtl.md`](../docs/rtl.md) — RTL detection, `dir`
  semantics, CSS implications.
- [`../docs/i18n-integration.md`](../docs/i18n-integration.md) —
  wiring up native `Intl.*`, FormatJS, gettext, vanilla state.
- [`../docs/ssr.md`](../docs/ssr.md) — Eleventy / Astro / Hugo
  static-site generation and cookie pre-seed.
- [`../spec/index.md`](../spec/index.md) — the canonical contract.
