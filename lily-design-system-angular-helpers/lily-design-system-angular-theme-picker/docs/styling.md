# Styling

The picker is headless: it ships no CSS. Every visual decision
belongs to the consumer. This guide lists the hooks the picker
exposes.

## Class hooks

| Selector                                             | Element                                  |
| ---------------------------------------------------- | ---------------------------------------- |
| `.theme-picker`                                      | The root `<fieldset role="radiogroup">`. |
| `.theme-picker.{consumerClass}`                      | Both classes when `className` is passed. |
| `.theme-picker > .theme-picker-option`               | Each `<label>` wrapping a radio.         |
| `.theme-picker-option > input[type="radio"]`         | The native radio input.                  |
| `.theme-picker-option > .theme-picker-option-label`  | The visible option text.                 |

The `className` input is the Angular equivalent of Vue's
`inheritAttrs`-driven `class` fall-through. Angular has no
implicit attribute spread; the helper exposes an explicit input.

## Attribute hooks

| Attribute                          | On                          | Purpose                          |
| ---------------------------------- | --------------------------- | -------------------------------- |
| `data-theme="<slug>"`              | `target` (default `<html>`) | Active theme indicator for theme CSS files. |
| `data-lily-theme-picker="<name>"`  | the managed `<link>`        | Discriminator for multiple pickers. |

## Suggested baseline CSS

Drop into the consumer's app stylesheet:

```css
.theme-picker {
    border: 0;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.theme-picker-option {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--color-base-300, currentColor);
    border-radius: var(--radius-selector, 0.25rem);
    cursor: pointer;
}

.theme-picker-option:has(:checked) {
    background: var(--color-primary, currentColor);
    color: var(--color-primary-content, white);
}

.theme-picker-option:focus-within {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: 2px;
}
```

## Don'ts

- Don't hide the radio inputs with `display: none`. They are the
  accessibility tree's anchor point. Use `clip-path` or a
  `.sr-only` recipe if you need to render only the labels.
- Don't override the picker's `aria-*` attributes from CSS. They
  are part of the accessibility contract.
- Don't add `styles` / `styleUrls` to a wrapping component that
  imports the picker if the goal is to style the picker — Angular
  view encapsulation (`Emulated`) prefixes the styles with a
  scoping attribute, so they won't reach the picker. Use a global
  stylesheet (or `ViewEncapsulation.None` on a wrapper component)
  instead.

## Angular view encapsulation

Angular's default `ViewEncapsulation.Emulated` rewrites CSS
selectors to include a unique scoping attribute (`_nghost-xyz`).
This means styles declared in a component's `styles` field don't
reach child components by default.

The picker is a standalone component with no `styles`, so emulation
doesn't bite the helper itself. But a consumer wrapping the picker
in another component must publish their picker-targeting styles
either globally or with `ViewEncapsulation.None`:

```ts
import { Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector: "my-settings",
    standalone: true,
    imports: [ThemePicker],
    encapsulation: ViewEncapsulation.None,  // styles reach .theme-picker
    template: `
        <lily-theme-picker label="Theme" themesUrl="/t/" [themes]="themes" />
    `,
    styles: `
        .theme-picker {
            border: 1px solid var(--brand);
        }
    `,
})
export class MySettings { /* … */ }
```

Or, more idiomatically, put the picker CSS in a global stylesheet
referenced from `angular.json`'s `styles` array.

## `:host` pseudo-class

If you wrap the picker in your own component, the outer host element
is a `<my-settings>` tag, not the picker's `<fieldset>`. To style
the host:

```css
:host {
    display: block;
    padding: 1rem;
}
```

This styles the wrapping `<my-settings>`, not the inner
`<fieldset>`.

## `::ng-deep` (deprecated but useful)

For reaching into child component styles from a parent's component
styles, `::ng-deep` still works (despite being deprecated). It's
brittle — prefer global stylesheets. If you must use it:

```css
::ng-deep .theme-picker-option {
    /* applies to descendants regardless of scope */
}
```

A safer alternative is to drop the styles into the global stylesheet
referenced from `angular.json`.
