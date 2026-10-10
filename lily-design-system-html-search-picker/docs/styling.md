# Styling — `<search-picker>`

The package ships **no CSS at all**, including the panel's positioning.
Everything below is a starting point to copy, not something the package
applies.

## Class hooks

| Hook                           | Element                                                        |
| ------------------------------ | -------------------------------------------------------------- |
| `.search-picker`               | Rendered root `<div>`. Your `class` attribute is appended here. |
| `.search-picker-button`        | The icon `<button>`.                                           |
| `.search-picker-icon`          | The `aria-hidden` magnifying-glass `<svg>`.                    |
| `.search-picker-panel`         | The disclosure `<div>`. Carries `hidden` when closed.          |
| `.search-picker-form`          | The `<form role="search">`.                                    |
| `.search-picker-input`         | The `type="search"` field.                                     |
| `.search-picker-submit`        | The `⏎` submit `<button>`.                                     |
| `.search-picker-submit-symbol` | The `aria-hidden` `⏎` `<span>`.                                |

The custom element itself (`search-picker`) is an unstyled inline
element until you give it a `display`.

## Minimum viable CSS

```css
search-picker { display: inline-block; }
.search-picker { position: relative; display: inline-block; }
.search-picker-button { display: inline-flex; align-items: center; justify-content: center; }
.search-picker-panel {
  position: absolute;
  inset-block-start: 100%;
  inset-inline-end: 0;
  z-index: 10;
}
/* Required: the display above would otherwise defeat [hidden]. */
.search-picker-panel[hidden] { display: none; }
.search-picker-form { display: flex; gap: 0.25rem; }
```

`hidden` is only `display: none` at the UA-stylesheet level, so any
`display` you set on the panel wins unless you restore it for
`[hidden]`.

The root `themes/` stylesheets already style every hook above.
