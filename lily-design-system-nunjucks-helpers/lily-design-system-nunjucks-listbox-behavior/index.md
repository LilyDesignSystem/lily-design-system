# ListboxBehavior (Nunjucks)

Shared WAI-ARIA APG listbox keyboard behaviour for the Lily Design
System™ Nunjucks helpers. It is the one copy of the active-descendant
contract that the theme, locale, text-size and motion picker client
scripts use, instead of each carrying its own.

Behaviour only: no markup and no CSS. It never sets `aria-selected`
(that is the picker's applied value, not the keyboard cursor); it only
sets `data-active` and `aria-activedescendant`.

## Install

```sh
npm install @lilydesignsystem/nunjucks-listbox-behavior
```

## Usage

```js
import { createListboxKeyboard } from "@lilydesignsystem/nunjucks-listbox-behavior";

const keyboard = createListboxKeyboard(listElement, {
  clamp: true,
  typeahead: true,
  pageSize: 10,
  onActivate: (option) => { /* select it */ },
  onEscape: () => { /* close, keep value */ },
  onTabOut: () => { /* close and move on */ },
});
```

`listElement` is the rendered `<ul role="listbox">` (or any container)
holding `[role="option"]` children. Options are read live on every call,
so a changing option set stays correct without re-attaching.

## Keyboard contract

ArrowUp / ArrowDown move the cursor (clamped by default), Home / End
jump, printable characters typeahead over option text, PageUp / PageDown
move by `pageSize`, Enter / Space call `onActivate`, Escape calls
`onEscape`, Tab calls `onTabOut`.

## Related

- [Changelog](CHANGELOG.md)
- [Nunjucks helpers](../index.md)

---

Lily™ and Lily Design System™ are trademarks.
