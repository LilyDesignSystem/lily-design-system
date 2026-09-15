# Lily Design System™ — HTML PickerBar

A single page-header custom element, `<picker-bar>`, that composes four
of the Lily [`*-picker` helpers](../index.md) — theme, locale, text
size, and share — with two catalog-wide defaults pre-wired, so you can
drop one element into a header instead of assembling and configuring
four.

`motion-picker` and `date-time-picker` are not part of the bar: motion
has no natural spot next to the other three header preferences, and
`date-time-picker` is a form control, not a header control.

## Install

```sh
npm install lily-design-system-html-picker-bar
```

`lily-design-system-html-theme-picker`, `-locale-picker`,
`-text-size-picker`, and `-share-picker` install automatically as
regular dependencies — `<picker-bar>` is a thin wrapper around them,
not a reimplementation.

## Usage

```js
import "lily-design-system-html-picker-bar";

const bar = document.createElement("picker-bar");
bar.labels = {
  theme: "Theme",
  locale: "Language",
  textSize: "Text size",
  share: "Share",
};
bar.themesUrl = "/assets/themes/";
bar.locales = ["en", "cy", "gd", "ga"];
bar.shareTargets = [
  {
    id: "email",
    label: "Email",
    href: (url, title) => `mailto:?subject=${title}&body=${url}`,
  },
];
document.querySelector("header").appendChild(bar);
```

Or in markup, for the parts that fit plain attributes:

```html
<script type="module" src="/node_modules/lily-design-system-html-picker-bar/dist/index.js"></script>
<picker-bar themes-url="/assets/themes/" locales="en,cy,gd,ga"></picker-bar>
<script type="module">
  document.querySelector("picker-bar").labels = {
    theme: "Theme",
    locale: "Language",
    textSize: "Text size",
    share: "Share",
  };
</script>
```

`labels` has to be set as a JS property (no honest attribute encoding
exists for an object), same as `shareTargets` — see
`<date-time-picker>`'s `labels` and `<share-picker>`'s `targets` for the
same pattern elsewhere in this catalog.

## Defaults

- **`themes`** defaults to `DEFAULT_THEMES` — all 45 Lily reference
  theme slugs, alphabetical, with the 8 United Kingdom / United States
  government themes moved to their own alphabetical group at the
  bottom. Set your own `themes` attribute (comma-separated) or
  `.themes` property (array) to override.
- **`sizes`** defaults to `DEFAULT_SIZES` — the seven-step scale
  `largest`, `larger`, `large`, `normal`, `small`, `smaller`,
  `smallest` — and the text-size picker starts on `normal`. Set your
  own `sizes` to override (and `textSizeProps = { defaultValue: "…" }`
  for a different starting point).

Both are exported as named constants:

```js
import { DEFAULT_THEMES, DEFAULT_SIZES } from "lily-design-system-html-picker-bar";
```

## Passing extra configuration to one picker

Each wrapped picker takes a `*Props` bag — a property, not an
attribute — for anything beyond what `<picker-bar>` lifts to the top
level: persistence, initial value, detection, a `*Labels` override map.

```js
bar.themeProps = { storageKey: "lily-theme", detectFromSystem: true };
bar.localeProps = { storageKey: "lily-locale", detectFromNavigator: true };
bar.textSizeProps = { storageKey: "lily-text-size" };
bar.shareProps = { copyLabel: "Copy link", copiedLabel: "Copied" };
```

Set these **before** appending `bar` to the document — they apply to
the wrapped picker's element instance before it connects, so
persistence and initial-value resolution see them on first mount, the
same as if you had configured that picker directly.

## Reading a wrapped picker directly

After `<picker-bar>` has rendered (i.e. once it's connected to the
document), each wrapped element is available as a read-only property:

```js
bar.themePicker; // the <theme-picker> instance
bar.localePicker; // the <locale-picker> instance
bar.textSizePicker; // the <text-size-picker> instance
bar.sharePicker; // the <share-picker> instance
```

Useful for attaching a `themechange` listener, reading `.value`, or any
other post-mount interaction — the elements are real, unmodified
instances of their own packages.

## Styling

`<picker-bar>` renders no CSS of its own beyond the `picker-bar` root
wrapper class — style each child through its own package's class hooks
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
its own WAI-ARIA APG contract unchanged; see that picker's own `index.md`.

## Full contract

See [`spec/index.md`](./spec/index.md).

---

Lily™ and Lily Design System™ are trademarks.
