# Lily Design System™ — `<lily-picker-bar>`

A single page-header row that composes four of the Lily
[`*-picker` helpers](../index.md) — theme, locale, text size, and
share — with two catalog-wide defaults pre-wired, so you can drop one
custom element into a header instead of assembling and configuring
four.

`<lily-motion-picker>` and `<lily-date-time-picker>` are not part of
the bar: motion has no natural spot next to the other three header
preferences, and `<lily-date-time-picker>` is a form control, not a
header control.

## Install

```sh
npm install lily-design-system-web-components-picker-bar
```

`lily-design-system-web-components-theme-picker`, `-locale-picker`,
`-text-size-picker`, and `-share-picker` install automatically as
regular dependencies — `<lily-picker-bar>` is a thin wrapper around
them, not a reimplementation.

## Usage

```html
<script type="module">
  import "lily-design-system-web-components-picker-bar";
</script>

<lily-picker-bar id="header-picker-bar" themes-url="/assets/themes/"></lily-picker-bar>

<script type="module">
  const bar = document.getElementById("header-picker-bar");
  bar.labels = {
    theme: "Theme",
    locale: "Language",
    textSize: "Text size",
    share: "Share",
  };
  bar.locales = ["en", "cy", "gd", "ga"];
  bar.shareTargets = [
    {
      id: "email",
      label: "Email",
      href: (url, title) => `mailto:?subject=${title}&body=${url}`,
    },
  ];
</script>
```

`labels`, `locales`, and `shareTargets` are property-only (§4.3 of the
spec) — objects and functions cannot be expressed as HTML attributes
— so set them from script, before or after the element connects.
`themes-url` (required) and `class` are plain attributes and can be
written directly in HTML, as shown above.

That's a complete, working header row: 45 themes, four locales, the
seven-step text-size scale, and one share destination plus
copy-to-URL if you add `bar.shareProps = { copyLabel: "Copy link" }`.

## Defaults

- **`themes`** defaults to `DEFAULT_THEMES` — all 45 Lily reference
  theme slugs, alphabetical, with the 8 United Kingdom / United States
  government themes moved to their own alphabetical group at the
  bottom. Set `bar.themes = [...]` (or the `themes="a,b,c"` attribute)
  to override.
- **`sizes`** defaults to `DEFAULT_SIZES` — the seven-step scale
  `largest`, `larger`, `large`, `normal`, `small`, `smaller`,
  `smallest` — and the text-size picker starts on `normal`. Set
  `bar.sizes = [...]` (and `bar.textSizeProps = { defaultValue: "…" }`
  if you want a different starting point) to override.

Both are exported as named constants:

```js
import { DEFAULT_THEMES, DEFAULT_SIZES } from "lily-design-system-web-components-picker-bar";
```

## Passing extra properties to one picker

Each wrapped picker takes a `*Props` bag for anything beyond what
`<lily-picker-bar>` lifts to the top level — persistence, initial
value, detection, a `*Labels` override map, a custom glyph:

```js
bar.themeProps = { storageKey: "lily-theme", detectFromSystem: true };
bar.localeProps = { storageKey: "lily-locale", detectFromNavigator: true };
bar.textSizeProps = { storageKey: "lily-text-size" };
bar.shareProps = { copyLabel: "Copy link", copiedLabel: "Copied" };
```

Anything in a `*Props` bag wins over `<lily-picker-bar>`'s own default
for that picker.

## Styling

`<lily-picker-bar>` renders no CSS of its own class beyond the
`picker-bar` root wrapper — style each child through its own
package's class hooks (`theme-picker`, `locale-picker`,
`text-size-picker`, `share-picker`; see each package's own `index.md`).
A typical header layout:

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
case the rest of Lily's i18n rule exists for. Each wrapped picker
keeps its own WAI-ARIA APG contract unchanged; see that picker's own
`index.md`.

## Full contract

See [`spec/index.md`](./spec/index.md).

---

Lily™ and Lily Design System™ are trademarks.
