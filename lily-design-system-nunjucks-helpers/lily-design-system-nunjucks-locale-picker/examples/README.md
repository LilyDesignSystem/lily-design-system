# Examples

Self-contained Nunjucks examples for
`lily-design-system-nunjucks-locale-chooser`. Each file is a
runnable template that can be dropped into any Nunjucks host
(Eleventy page, Express view, plain `nunjucks.render` script,
Cloudflare Workers).

Every example assumes:

- The macro file (`../locale-chooser.njk`) and the client.js
  (`../locale-chooser.client.js`) are reachable from your
  template loader and your static-asset pipeline respectively.
- The locale codes referenced in each example are valid BCP 47
  (or BCP 47-ish — `en_US` is auto-normalised to `en-US` when
  written to the `lang` attribute).
- The consumer styles the `locale-chooser` CSS class hook. The
  helper ships zero CSS.
- **The control needs JavaScript.** The macro renders an icon button
  and a `hidden` listbox; the button opens nothing until
  `locale-chooser.client.js` runs. Every example therefore loads the
  module. The hidden input is pre-filled server-side, so a no-JS form
  submit still carries a locale — that is the only unenhanced
  affordance. See [`../docs/ssr.md`](../docs/ssr.md).

Files 01, 02, 03, and 10 were named in the radio-group era
(`01-radios`, `02-select`, `03-buttons`, `10-combobox`) and none of
them has rendered radios, a `<select>`, a button group, or a combobox
for some time. They are now named for what they show, matching the
theme-chooser catalog's convention.

| #  | File                                                              | Demonstrates                                                       |
|----|-------------------------------------------------------------------|--------------------------------------------------------------------|
| 1  | [`01-basic.njk`](./01-basic.njk)                                  | The default control: icon button + listbox, plus the status region. |
| 2  | [`02-custom-labels.njk`](./02-custom-labels.njk)                  | A longer locale list with `localeLabels` driving option text and typeahead. |
| 3  | [`03-custom-rendering.njk`](./03-custom-rendering.njk)            | Replacing the trigger glyph via the `{% call %}` block, and the styling hooks. |
| 4  | [`04-rtl-demo.njk`](./04-rtl-demo.njk)                            | RTL locales (ar, he, fa, ur, ps) showing `dir` flipping.           |
| 5  | [`05-nhs-style.njk`](./05-nhs-style.njk)                          | Kebab-case `locale-chooser` class + NHS-style language banner.      |
| 6  | [`06-with-eleventy-i18n.njk`](./06-with-eleventy-i18n.njk)        | Eleventy i18n plugin pattern (URL-prefixed locales).               |
| 7  | [`07-with-intl.njk`](./07-with-intl.njk)                          | Native `Intl.DateTimeFormat` / `NumberFormat` client-side update.  |
| 8  | [`08-ssr-cookie.njk`](./08-ssr-cookie.njk)                        | Eleventy / Express + cookie-resolved initial value before render.  |
| 9  | [`09-scoped-target.njk`](./09-scoped-target.njk)                  | `target` option pointing to a specific element; distinct `id` per instance. |
| 10 | [`10-typeahead.njk`](./10-typeahead.njk)                          | A 57-locale list and the built-in label typeahead.                 |
|    | [`localeChooserCustom.njk`](./localeChooserCustom.njk)              | Reusable wrapper macro that swaps the glyph via `{% call %}`.      |

## Running the examples

These files are illustrations, not a build. The fastest way to
try one is:

1. Inside any Nunjucks-rendering project (Eleventy, Express,
   Cloudflare Workers, plain `nunjucks.render`), drop the example
   into a route / page.
2. Serve the static-asset directory containing
   `locale-chooser.client.js` and `locales.js` (the compiled JS
   form of the `locales.ts` source).
3. Visit the route. The macro renders the collapsed button and the
   hidden listbox; the client.js mounts, wires the interaction, and
   applies `lang` / `dir` to `<html>` on first paint.

## onChange vs v-model / bind:value

Nunjucks doesn't have reactive bindings like Svelte / Vue /
React. The closest equivalent is the `onChange` callback on
`initLocaleChooser(root, opts)` (and on `autoInit(opts)`),
combined with the consumer maintaining whatever store they want
to keep in sync. Every example past `01-basic.njk` shows the
pattern.

There is no `change` event to listen for: the control is a button
plus a `<ul role="listbox">`, not a form control. Read the active
locale from `onChange(code)`, from `lang` on the target, or from the
hidden input's value.

## Caller block

Calling `localeChooser` with a `{% call %}` block replaces the default
globe glyph **inside the trigger button** with the block body — the
Nunjucks equivalent of "children". It does not render options; the
listbox always comes from `opts.locales`.

[`localeChooserCustom.njk`](./localeChooserCustom.njk) packages that
pattern as a reusable wrapper macro with an inline SVG globe, so a
project can share one branded trigger. Example 03 uses the wrapper;
example 05 uses the plain macro with the default glyph.

Keep any replacement glyph `aria-hidden="true"` and non-interactive:
the button's accessible name is `opts.label` via `aria-label`.

If you need a control the macro cannot render at all, hand-write the
DOM with the same hooks — `data-lily-locale-chooser-root`, `-button`,
`-list`, `-input`, plus `role="option"` and `data-value` on each
choice. `initLocaleChooser(root)` works against any conforming DOM and
returns an inert controller when the button or the list is missing.

## Ids

Listbox and option ids come from `opts.id`, which defaults to
`"locale-chooser-{name}"`. Two instances on one page that share a
`name` need an explicit distinct `id`, or their ids collide and
`aria-controls` / `aria-activedescendant` break. Example 09 shows
this. Nunjucks macros cannot hold a module counter, so there is no
automatic uniqueness.

## Naming

- Macro keys are camelCase: `locales`, `defaultValue`,
  `localeLabels`, `storageKey`, `detectFromNavigator`, `applyDir`.
- CSS class hooks are kebab-case: `locale-chooser`,
  `locale-chooser-button`, `locale-chooser-icon`,
  `locale-chooser-list`, `locale-chooser-option`.
- `data-lily-locale-chooser-*` attributes are kebab-case
  throughout.

## See also

- [../index.md](../index.md) — user-facing readme.
- [../spec/index.md](../spec/index.md) — canonical contract.
- [../docs/concepts.md](../docs/concepts.md) — macro / client.js
  split, lifecycle, persistence.
- [../docs/i18n-integration.md](../docs/i18n-integration.md) —
  Eleventy i18n, native `Intl.*`, i18next, ICU MessageFormat.
- [../docs/rtl.md](../docs/rtl.md) — RTL detection and the
  CSS implications.
- [../docs/ssr.md](../docs/ssr.md) — Nunjucks IS server-side;
  cookie-resolved value before render.
- [../docs/bcp47.md](../docs/bcp47.md) — BCP 47 tag composition.
- [../docs/accessibility.md](../docs/accessibility.md) —
  WCAG 2.2 AAA, the APG listbox contract, and the tradeoffs.
- [../docs/macro-opts-reference.md](../docs/macro-opts-reference.md) —
  every `localeChooser(opts)` key, field by field.
- [../docs/custom-rendering.md](../docs/custom-rendering.md) —
  glyph override, CSS-only styling, hand-written DOM.
- [../docs/recipes.md](../docs/recipes.md) — task-shaped solutions.
- [../docs/troubleshooting.md](../docs/troubleshooting.md) —
  symptoms, causes, fixes.
