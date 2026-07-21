# Examples

Self-contained HTML examples for
`lily-design-system-html-locale-chooser`. Each file is a runnable
page that can be opened in any browser after building the
custom-element module.

Every example assumes:

- A built copy of the `locale-chooser` ES module at
  `../../locale-chooser.js` (relative to the example). Consumers may
  need to compile `locale-chooser.ts` → `.js` first (any TS toolchain
  works: `tsc`, `esbuild`, `vite`, `bun build`, …).
- A modern browser supporting custom elements, ES modules, and (for
  some examples) dynamic imports from CDN.

| #  | File                                          | Demonstrates                                |
| -- | --------------------------------------------- | ------------------------------------------- |
| 1  | [`01-basic.html`](./01-basic.html)            | Basic usage: icon button + listbox.         |
| 2  | [`02-styling.html`](./02-styling.html)        | Styling the default rendering; the five class hooks and both state selectors. |
| 3  | [`03-buttons.html`](./03-buttons.html)        | Toggle buttons with `aria-pressed` (tier-2 subclass). |
| 4  | [`04-rtl-demo.html`](./04-rtl-demo.html)      | Auto-detected RTL flipping for Arabic etc.  |
| 5  | [`05-nhs-style.html`](./05-nhs-style.html)    | NHS UK-style language banner (tier-2 subclass). |
| 6  | [`06-with-formatjs.html`](./06-with-formatjs.html) | FormatJS IntlMessageFormat from CDN.   |
| 7  | [`07-with-intl.html`](./07-with-intl.html)    | Native `Intl.*` formatters on `localechange`. |
| 8  | [`08-ssr-cookie.html`](./08-ssr-cookie.html)  | SSG / SSR cookie pre-seed flow.             |
| 9  | [`09-scoped-target.html`](./09-scoped-target.html) | `target` property — panel-only lang/dir. |
| 10 | [`10-combobox.html`](./10-combobox.html)      | `<datalist>` filter-as-you-type combobox for long locale lists (tier-2 subclass). |

Examples 1 and 2 were previously named `01-radios.html` and
`02-select.html`, after rendering models the element no longer uses.

## The CSS in these examples is not optional

The package ships **no CSS at all**, which means the dropdown has no
positioning. Until the root gets `position: relative` and the
`<ul>` gets `position: absolute`, the list renders in normal flow and
pushes the rest of the page down whenever it opens. Every example
here carries that minimum block; `02-styling.html` is the one to read
first if you are writing your own.

## Running the examples

These files are illustrations, not a hosted build. The fastest way
to try one:

1. Compile `locale-chooser.ts` → `locale-chooser.js` at the project
   root (the path `../../locale-chooser.js` is relative to each
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
<locale-chooser
    label="Language"
    locales="en,fr,ar"
    value="en"
    default-value="en"
    storage-key="app-locale"
    name="locale"
    apply-dir="false"
    detect-from-navigator
    locale-labels='{"en":"English","fr":"Français","ar":"العربية"}'
></locale-chooser>
```

There is no `placeholder` attribute; it was removed along with the
native `<select>` rendering it existed to pin.

The matching JS properties are camelCase. Array / object properties
accept the native form:

```js
const select = document.querySelector("locale-chooser");
select.locales = ["en", "fr", "ar"];
select.localeLabels = { en: "English", fr: "Français" };
select.target = document.querySelector("#widget");   // no attribute form
```

The listbox itself is drivable from script:

```js
select.open;              // boolean
select.openList();        // open with the selected option active
select.closeList();       // close and refocus the button
select.labelFor("fr");    // "French"
select.tagFor("fr_CA");   // "fr-CA"
```

## Keyboard

The control implements the WAI-ARIA APG listbox pattern in
JavaScript — there is no native `<select>` underneath, so none of
this comes from the platform.

On the button: `ArrowDown` / `Enter` / `Space` open with the selected
option active; `ArrowUp` opens with the last option active; opening
moves focus to the `<ul>`.

On the list: `ArrowDown` / `ArrowUp` move the active option and clamp
(no wrapping); `Home` / `End` jump to the ends; `Enter` / `Space`
select, apply, close, and refocus the button; `Escape` closes without
changing the value; `Tab` closes without stealing focus back;
printable characters run a 500 ms typeahead over the option labels.

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

The HTML helpers don't have Vue scoped slots or Svelte snippets, and
light DOM has no `<slot>`. Subclassing is the customisation surface,
in two tiers:

- **Tier 1** — override `renderButtonContent(): Node` to replace the
  glyph inside the button. The base class still owns the button, the
  listbox, all the ARIA, and the entire keyboard contract. This is
  the direct analogue of the other frameworks' `children` prop and
  the path to prefer.
- **Tier 2** — post-process the rendered children after
  `super.connectedCallback()`. You then own the accessibility *and*
  keyboard contracts, because the base class's handlers are bound to
  the DOM it built. Examples [3](./03-buttons.html),
  [5](./05-nhs-style.html), and [10](./10-combobox.html) are tier 2;
  each keeps the `.locale-chooser` root, the hidden `<input>`, and the
  base apply lifecycle (write `this.value`, never touch `lang` /
  `dir` / `localStorage` yourself).

Full invariant list:
[`../docs/custom-rendering.md`](../docs/custom-rendering.md).

## See also

- [`../docs/concepts.md`](../docs/concepts.md) — what the select
  owns vs leaves to the consumer.
- [`../docs/accessibility.md`](../docs/accessibility.md) — WCAG 2.2
  AAA, the APG listbox pattern, and the three tradeoffs of the
  icon-button rendering.
- [`../docs/custom-rendering.md`](../docs/custom-rendering.md) — the
  two subclassing tiers.
- [`../docs/bcp47.md`](../docs/bcp47.md) — locale tag format and
  normalisation rules.
- [`../docs/rtl.md`](../docs/rtl.md) — RTL detection, `dir`
  semantics, CSS implications.
- [`../docs/i18n-integration.md`](../docs/i18n-integration.md) —
  wiring up native `Intl.*`, FormatJS, gettext, vanilla state.
- [`../docs/ssr.md`](../docs/ssr.md) — Eleventy / Astro / Hugo
  static-site generation and cookie pre-seed.
- [`../spec/index.md`](../spec/index.md) — the canonical contract.
