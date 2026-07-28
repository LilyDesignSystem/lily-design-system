# Examples

Self-contained HTML examples for
`lily-design-system-html-text-size-picker`. Each file is a runnable
page that can be opened in any browser after building the
custom-element module.

Every example assumes:

- A built copy of the `text-size-picker` ES module at
  `/dist/text-size-picker.js` (or any path you prefer; adjust the
  `<script type="module" src=…>` per example).
- Your own CSS mapping each `[data-text-size="<slug>"]` to a real font
  scale — the package ships **no CSS at all**, which includes the
  typography itself. Without that mapping the control applies the
  attribute but nothing visibly resizes.

| #   | File                                                     | Demonstrates                                                    |
| --- | --------------------------------------------------------- | ----------------------------------------------------------------- |
| 1   | [`01-basic.html`](./01-basic.html)                       | Minimal four-size picker plus the status region.                |
| 2   | [`02-custom-labels.html`](./02-custom-labels.html)       | `size-labels` for i18n / display names.                         |
| 3   | [`03-multiple-pickers.html`](./03-multiple-pickers.html) | Two pickers in one page via `name` and per-instance `target`.   |
| 4   | [`04-persistence.html`](./04-persistence.html)           | `localStorage` survival across reloads via `storage-key`.       |
| 5   | [`05-external-buttons.html`](./05-external-buttons.html) | Driving the control from your own A-/A+ preset buttons.         |
| 6   | [`06-custom-rendering.html`](./06-custom-rendering.html) | `renderButtonContent()`: inline SVG, and glyph + size name.      |

## The examples ship their own CSS — deliberately

The package ships no CSS at all, and that includes the dropdown's
positioning and the typography itself: the `<ul class="text-size-picker-list">`
renders in normal flow until the consumer gives the root
`position: relative` and the list `position: absolute`, and no text
anywhere resizes until the consumer maps each slug to a font scale.
Examples 1 and 6 carry a `<style>` block with the minimum needed,
including the `[hidden]` re-assertion that keeps the closed list
hidden and the `:root[data-text-size="…"]` mapping. Copy it as a
starting point.

## Running the examples

These files are illustrations, not a hosted build. The fastest way
to try one:

1. Place the example file in a directory served by any local HTTP
   server (e.g. `python3 -m http.server`, `npx http-server`, Vite, …).
2. Place a built copy of `text-size-picker.js` at the path the
   example references (typically `/dist/text-size-picker.js`).
3. Open the example in a browser.

## Attribute and property conventions

The custom-element attributes are kebab-case:

```html
<text-size-picker
  label="Text size"
  sizes="small,medium,large,x-large"
  default-value="medium"
  storage-key="lily-text-size"
  size-labels='{"small":"Petit","medium":"Moyen"}'
></text-size-picker>
```

The matching JS properties are camelCase. Array / object properties
accept the native form:

```ts
const picker = document.querySelector("text-size-picker") as TextSizePicker;
picker.sizes = ["small", "medium", "large", "x-large"];
picker.sizeLabels = { small: "Petit" };
```

## CustomEvent listening

Every example that needs to react to a size change uses:

```ts
picker.addEventListener("textsizechange", (e) => {
  const { size } = (e as CustomEvent<{ size: string }>).detail;
});
```

Because the event bubbles, `document.body.addEventListener(...)`
also works.

Use the element's public `labelFor(slug)` to turn the slug into a
display name — it applies `size-labels` overrides and falls back to
the title-cased slug:

```ts
picker.addEventListener("textsizechange", (e) => {
  console.log(picker.labelFor(e.detail.size));
});
```

## What is deliberately missing

There is no system-preference example here, unlike `theme-picker`
(`06-system-preference.html`) and `locale-picker`
(`04-rtl-demo.html`'s auto-detection). Browsers expose no "preferred
text size" signal — there is no media query equivalent to
`prefers-color-scheme` and no `navigator.languages` analogue — so the
element ships no `detect-from-*` attribute to demonstrate (see
[`../spec/index.md`](../spec/index.md) §2). Users who scale text at
the OS level are already served by browser zoom and the browser's own
minimum-font-size setting, which this helper must not fight.

There is also no preloaded-assets or Lily-themes-catalog example,
unlike `theme-picker`'s `05-preloaded.html` / `08-lily-themes.html`:
`text-size-picker` loads no external CSS files at all, so neither
concept applies.

## See also

- [`../docs/accessibility.md`](../docs/accessibility.md) — WCAG 2.2
  AAA, the APG listbox pattern, and the three tradeoffs of the
  icon-button rendering.
- [`../spec/index.md`](../spec/index.md) — the canonical contract.
