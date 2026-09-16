# Lily Design System™ — Vue PickerBar

A single page-header row that composes four of the Lily
[`*-picker` helpers](../index.md) — theme, locale, text size, and
share — with two catalog-wide defaults pre-wired, so you can drop one
component into a header instead of assembling and configuring four.

`motion-picker` and `date-time-picker` are not part of the bar: motion
has no natural spot next to the other three header preferences, and
`date-time-picker` is a form control, not a header control.

## Install

```sh
npm install @lilydesignsystem/vue-picker-bar
```

`@lilydesignsystem/vue-theme-picker`, `-locale-picker`,
`-text-size-picker`, and `-share-picker` install automatically as
regular dependencies — `PickerBar` is a thin wrapper around them, not
a reimplementation.

## Usage

```vue
<script setup lang="ts">
import PickerBar from "@lilydesignsystem/vue-picker-bar";
</script>

<template>
  <PickerBar
    :labels="{
      theme: 'Theme',
      locale: 'Language',
      textSize: 'Text size',
      share: 'Share',
    }"
    themesUrl="/assets/themes/"
    :locales="['en', 'cy', 'gd', 'ga']"
    :shareTargets="[
      {
        id: 'email',
        label: 'Email',
        href: (url, title) => `mailto:?subject=${title}&body=${url}`,
      },
    ]"
  />
</template>
```

That's a complete, working header row: 45 themes, four locales, the
seven-step text-size scale, and one share destination plus copy-to-URL
if you add `:shareProps="{ copyLabel: 'Copy link' }"`.

## Defaults

- **`themes`** defaults to `DEFAULT_THEMES` — all 45 Lily reference
  theme slugs, alphabetical, with the 8 United Kingdom / United States
  government themes moved to their own alphabetical group at the
  bottom. Pass your own `themes` array to override.
- **`sizes`** defaults to `DEFAULT_SIZES` — the seven-step scale
  `largest`, `larger`, `large`, `normal`, `small`, `smaller`,
  `smallest` — and the text-size picker starts on `normal`. Pass your
  own `sizes` array (and `:textSizeProps="{ defaultValue: '…' }"` if
  you want a different starting point) to override.

Both are exported as named constants:

```ts
import { DEFAULT_THEMES, DEFAULT_SIZES } from "@lilydesignsystem/vue-picker-bar";
```

## Passing extra props to one picker

Each wrapped picker takes a `*Props` bag for anything beyond what
`PickerBar` lifts to the top level — persistence, initial value,
detection, a `*Labels` override map:

```vue
<PickerBar
  :labels="{ theme: 'Theme', locale: 'Language', textSize: 'Text size', share: 'Share' }"
  themesUrl="/assets/themes/"
  :locales="['en', 'cy']"
  :themeProps="{ storageKey: 'lily-theme', detectFromSystem: true }"
  :localeProps="{ storageKey: 'lily-locale', detectFromNavigator: true }"
  :textSizeProps="{ storageKey: 'lily-text-size' }"
  :shareProps="{ copyLabel: 'Copy link', copiedLabel: 'Copied' }"
/>
```

Anything in a `*Props` bag wins over `PickerBar`'s own default for
that picker — including overriding `themes`, `locales`, or `sizes`
per-picker if you ever needed to (you'd normally just use the
top-level prop instead).

## Listening for changes

`PickerBar` re-emits each wrapped picker's own event under a
bar-scoped name, so you don't need a `ref` per picker:

```vue
<PickerBar
  ...
  @theme-change="(theme) => console.log('theme is now', theme)"
  @locale-change="(locale) => console.log('locale is now', locale)"
  @text-size-change="(size) => console.log('text size is now', size)"
  @share="(targetId, url) => console.log('shared to', targetId, url)"
  @copy="(url) => console.log('copied', url)"
  @native-share="(url) => console.log('used the native share sheet for', url)"
/>
```

## Styling

`PickerBar` renders no CSS of its own class beyond the `picker-bar`
root wrapper — style each child through its own package's class hooks
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
