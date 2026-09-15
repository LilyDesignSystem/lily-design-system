# Lily Design System™ — Nunjucks PickerBar

A single page-header macro that composes four of the Lily
[`*-picker` helpers](../index.md) in this catalog — theme, locale,
text size, and share — with two catalog-wide defaults pre-wired, so
you can call one macro instead of assembling and configuring four.

`motion-picker` and `date-time-picker` are not part of the bar: motion
has no natural spot next to the other three header preferences, and
`date-time-picker` is a form control, not a header control.

## Install

```sh
npm install lily-design-system-nunjucks-picker-bar
```

`lily-design-system-nunjucks-theme-picker`, `-locale-picker`,
`-text-size-picker`, and `-share-picker` install automatically as
regular dependencies — `pickerBar` is a thin wrapper around them, not
a reimplementation.

Point your Nunjucks `Environment` at `node_modules` so the macro's
cross-package imports resolve:

```js
import nunjucks from "nunjucks";
const env = nunjucks.configure(["views", "node_modules"], { autoescape: true });
```

## Usage

```njk
{% from "lily-design-system-nunjucks-picker-bar/dist/picker-bar.njk" import pickerBar %}

{{ pickerBar({
  labels: {
    theme: "Theme",
    locale: "Language",
    textSize: "Text size",
    share: "Share"
  },
  themesUrl: "/assets/themes/",
  locales: ["en", "cy", "gd", "ga"],
  shareTargets: [
    { id: "email", label: "Email", href: "mailto:?subject=Check this out&body=https://example.com" }
  ]
}) }}
```

Then load `picker-bar.client.js` once and call `autoInit()`:

```html
<script type="module">
  import { autoInit } from "/path/to/picker-bar.client.js";
  autoInit();
</script>
```

That's a complete, working header row: 45 themes, four locales, the
seven-step text-size scale, and one share destination plus copy-to-URL
if you add `shareProps: { copyLabel: "Copy link" }`.

Note the [`share-picker` deviation](../lily-design-system-nunjucks-share-picker/index.md):
`href` in `shareTargets` is an already-resolved string, not a
function — a Nunjucks macro cannot call an arbitrary JS function.

## Defaults

- **`themes`** defaults to `DEFAULT_THEMES` — all 45 Lily reference
  theme slugs, alphabetical, with the 8 United Kingdom / United States
  government themes moved to their own alphabetical group at the
  bottom. Pass your own `themes` array to override.
- **`sizes`** defaults to `DEFAULT_SIZES` — the seven-step scale
  `largest`, `larger`, `large`, `normal`, `small`, `smaller`,
  `smallest` — and the text-size picker starts on `normal`. Pass your
  own `sizes` array (and `textSizeProps: { defaultValue: "…" }` if
  you want a different starting point) to override.

Both are exported from the client.js module too:

```js
import { DEFAULT_THEMES, DEFAULT_SIZES } from "lily-design-system-nunjucks-picker-bar";
```

## Passing extra params to one picker

Each wrapped picker takes a `*Props` object for anything beyond what
`pickerBar` lifts to the top level — persistence, initial value,
detection, a `*Labels` override map, an `id`:

```njk
{{ pickerBar({
  labels: { theme: "Theme", locale: "Language", textSize: "Text size", share: "Share" },
  themesUrl: "/assets/themes/",
  locales: ["en", "cy"],
  themeProps: { storageKey: "lily-theme", detectFromSystem: true },
  localeProps: { storageKey: "lily-locale", detectFromNavigator: true },
  textSizeProps: { storageKey: "lily-text-size" },
  shareProps: { copyLabel: "Copy link", copiedLabel: "Copied" }
}) }}
```

Unlike the Svelte canonical, `pickerBar` cannot route a custom glyph to
one specific picker (a Nunjucks macro call accepts only one
`{% call %}` block) — compose the four macros directly if you need
that.

## Styling

`pickerBar` renders no CSS of its own beyond the `picker-bar` root
wrapper — style each child through its own package's class hooks
(`theme-picker`, `locale-picker`, `text-size-picker`, `share-picker`;
see each package's own `index.md`). A typical header layout:

```css
.picker-bar {
  display: flex;
  gap: var(--theme-space-sm, 0.5rem);
  align-items: center;
}
```

## Accessibility

Every accessible name comes from `labels` — there is no English
default, because a set of names this catalog invented is exactly the
case the rest of Lily's i18n rule exists for. Each wrapped picker keeps
its own WAI-ARIA APG contract unchanged; see that picker's own
`index.md`. As with every helper in this catalog, none of the four is
operable until its client.js has run — see each package's own
`docs/ssr.md`.

## Full contract

See [`spec/index.md`](./spec/index.md).

---

Lily™ and Lily Design System™ are trademarks.
