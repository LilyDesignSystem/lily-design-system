# Styling

The select is headless: it ships no CSS. Every visual decision
belongs to the consumer. This guide lists the hooks the macro
exposes. For RTL-specific layout guidance see [rtl.md](./rtl.md).

## Class hooks

| Selector                                    | Element                                  |
| ------------------------------------------- | ---------------------------------------- |
| `.locale-select`                            | The root `<select>`.                     |
| `.locale-select.{classes}`                  | Both classes when `opts.classes` is set. |
| `.locale-select > .locale-select-option`    | Each `<option>`, including the placeholder. |
| `.locale-select-placeholder`                | The always-displayed leading placeholder `<option>` (`value=""`, no `lang`). |

## Attribute hooks

| Attribute                          | On                          | Purpose                                |
| ---------------------------------- | --------------------------- | -------------------------------------- |
| `lang="<bcp47>"`                   | `target` (default `<html>`) | Active locale, BCP 47 hyphen form.     |
| `dir="ltr\|rtl"`                   | `target` (default `<html>`) | Script direction; skipped when `applyDir` is false. |
| `lang="<bcp47>"`                   | each locale `<option>`      | WCAG 3.1.2 Language of Parts.          |
| `data-lily-locale-select-root`     | the `<select>`              | `autoInit()` selector.                 |

## Suggested baseline CSS

Drop into the consumer's app stylesheet:

```css
.locale-select {
    /* The closed control always shows the placeholder word, so it can be
       sized to that word instead of to the longest locale name. */
    field-sizing: content;  /* Chrome 123+: size to the shown option */
    width: auto;
    max-width: 12ch;        /* fallback for Firefox / Safari */

    padding: 0.25rem 0.5rem;
    border: 1px solid var(--theme-color-base-300, currentColor);
    border-radius: var(--theme-radius-selector, 0.25rem);
    background: var(--theme-color-base-background, white);
    color: var(--theme-color-base-content, currentColor);
    cursor: pointer;
}

.locale-select:focus-visible {
    outline: 2px solid var(--theme-color-primary, currentColor);
    outline-offset: 2px;
}

.locale-select-option {
    /* <option> styling support is limited and platform-dependent. */
    background: var(--theme-color-base-background, white);
    color: var(--theme-color-base-content, currentColor);
}
```

## Why the width recipe works

The macro renders a component-owned placeholder as the first
`<option>`, and the client snaps `select.value` back to `""` after
every change, so the closed control never displays a locale name. A
`<select>` normally reserves width for its longest option; pinning the
displayed option to a short placeholder lets you cap the width without
truncating anything the user needs to read while the list is open.

`field-sizing: content` is the modern way to say "size to the option
actually shown". `max-width` is the fallback for engines that have not
shipped it yet.

## Don'ts

- Don't set `width` in `ch` units so tight that the open listbox
  clips long locale names on platforms that size the popup to the
  control.
- Don't hide the placeholder option with `display: none` — it is the
  option the control displays, and hiding it breaks the control.
- Don't rely on the control alone to communicate the active locale;
  see [accessibility.md](./accessibility.md).
