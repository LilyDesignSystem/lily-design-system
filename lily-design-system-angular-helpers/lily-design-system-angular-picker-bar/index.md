# Lily Design System™ — Angular PickerBar

A single page-header row that composes four of the Lily
[`*-picker` helpers](../index.md) — theme, locale, text size, and
share — with two catalog-wide defaults pre-wired, so you can drop one
component into a header instead of assembling and configuring four.

`motion-picker` and `date-time-picker` are not part of the bar: motion
has no natural spot next to the other three header preferences, and
`date-time-picker` is a form control, not a header control.

## Install

```sh
npm install @lilydesignsystem/angular-picker-bar
```

`@lilydesignsystem/angular-theme-picker`, `-locale-picker`,
`-text-size-picker`, and `-share-picker` install automatically as
regular dependencies — `PickerBar` is a thin wrapper around them, not
a reimplementation.

## Usage

```ts
import { Component } from "@angular/core";
import { PickerBar } from "@lilydesignsystem/angular-picker-bar";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [PickerBar],
  template: `
    <lily-picker-bar
      [labels]="{ theme: 'Theme', locale: 'Language', textSize: 'Text size', share: 'Share' }"
      themesUrl="/assets/themes/"
      [locales]="['en', 'cy', 'gd', 'ga']"
      [shareTargets]="[{ id: 'email', label: 'Email', href: (url, title) => 'mailto:?subject=' + title + '&body=' + url }]"
    />
  `,
})
export class HeaderComponent {}
```

That's a complete, working header row: 45 themes, four locales, the
seven-step text-size scale, and one share destination plus copy-to-URL
if you add `[copyLabel]="'Copy link'"`.

## Defaults

- **`themes`** defaults to `DEFAULT_THEMES` — all 45 Lily reference
  theme slugs, alphabetical, with the 8 United Kingdom / United States
  government themes moved to their own alphabetical group at the
  bottom. Pass your own `[themes]` array to override.
- **`sizes`** defaults to `DEFAULT_SIZES` — the seven-step scale
  `largest`, `larger`, `large`, `normal`, `small`, `smaller`,
  `smallest` — and the text-size picker starts on `normal`. Pass your
  own `[sizes]` array (and `[textSizeDefaultValue]="'…'"` for a
  different starting point) to override.

Both are exported as named constants:

```ts
import { DEFAULT_THEMES, DEFAULT_SIZES } from "@lilydesignsystem/angular-picker-bar";
```

## Overriding one picker's extra options

Unlike the canonical Svelte contract's per-picker `*Props` bag,
Angular inputs are always named bindings — there is no generic spread
onto a child component's inputs. `PickerBar` flattens the most common
extras onto its own inputs, prefixed by which picker they belong to:

```html
<lily-picker-bar
  [labels]="labels"
  themesUrl="/assets/themes/"
  [locales]="['en', 'cy']"
  themeStorageKey="lily-theme"
  [themeDetectFromSystem]="true"
  localeStorageKey="lily-locale"
  [localeDetectFromNavigator]="true"
  textSizeStorageKey="lily-text-size"
  copyLabel="Copy link"
  copiedLabel="Copied"
/>
```

Two-way bind a picker's current value with the matching `model()`
input:

```html
<lily-picker-bar ... [(themeValue)]="currentTheme" />
```

For anything not flattened here (a custom icon template, for
instance), compose the four wrapped pickers directly instead of using
`PickerBar` — see each picker's own `index.md`.

## Styling

`PickerBar` renders no CSS of its own beyond the `picker-bar` root
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
its own WAI-ARIA APG contract unchanged; see that picker's own `index.md`.

## Full contract

See [`spec/index.md`](./spec/index.md).

---

Lily™ and Lily Design System™ are trademarks.
