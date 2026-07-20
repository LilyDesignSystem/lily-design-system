# Styling

The select is headless: it ships no CSS. Every visual decision
belongs to the consumer. This guide lists the hooks the select
exposes.

## Class hooks

| Selector                                             | Element                                  |
| ---------------------------------------------------- | ---------------------------------------- |
| `.theme-select`                                      | The root native `<select>`.              |
| `.theme-select.{consumerClass}`                      | Both classes when `className` is passed. |
| `.theme-select > .theme-select-option`               | Each `<option>`.                         |
| `.theme-select-placeholder`                          | The leading placeholder `<option>` — the one the closed control always displays. |
| `.theme-select-status`                               | The consumer-rendered status line naming the active theme. Not emitted by the component — you render it, per the default pattern in [accessibility.md](./accessibility.md#the-status-region-is-part-of-the-pattern). |

The `className` input is the Angular equivalent of Vue's
`inheritAttrs`-driven `class` fall-through. Angular has no
implicit attribute spread; the helper exposes an explicit input.

## Attribute hooks

| Attribute                          | On                          | Purpose                          |
| ---------------------------------- | --------------------------- | -------------------------------- |
| `data-theme="<slug>"`              | `target` (default `<html>`) | Active theme indicator for theme CSS files. |
| `data-lily-theme-select="<name>"`  | the managed `<link>`        | Discriminator for multiple selects. |

## Suggested baseline CSS

Drop into the consumer's app stylesheet:

```css
.theme-select {
    /* The closed control always shows the placeholder word ("Theme"),
       never the active theme name, so size it to that word rather than
       to the widest option. field-sizing sizes to the displayed option
       in Chromium; max-width caps the fallback everywhere else. */
    width: auto;
    max-width: 12ch;
    field-sizing: content;

    padding: 0.25rem 0.5rem;
    border: 1px solid var(--color-base-300, currentColor);
    border-radius: var(--radius-selector, 0.25rem);
    background: var(--color-base-100, transparent);
    color: inherit;
    cursor: pointer;
}

.theme-select:focus-visible {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: 2px;
}
```

Native `<option>` styling is limited by the platform; most browsers
render the dropdown list with OS chrome. Style the closed
`.theme-select` control and rely on the platform for the open list.

## Visually-hidden status line

The default pattern renders the active theme as **visible** text (see
[accessibility.md](./accessibility.md#the-status-region-is-part-of-the-pattern)):

```html
<p class="theme-select-status" aria-live="polite">
    Active theme: {{ themeSelect.labelFor(theme()) }}
</p>
```

Visible is the recommendation — it serves sighted, low-vision, and
cognitively-impaired users, not only screen-reader users. But if a
layout genuinely cannot spare the space, hide it **visually** while
keeping it in the accessibility tree:

```css
.theme-select-status {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
}
```

Do not reach for `display: none` or `visibility: hidden`: both remove
the element from the accessibility tree, which kills the live-region
announcements and leaves you with no compensation at all. Removing the
element entirely is worse still — prefer this recipe over deleting it.

## Don'ts

- Don't hide the `<select>` with `display: none`. It is the
  accessibility tree's anchor point. Use `clip-path` or a
  `.sr-only` recipe if you need to visually hide it.
- Don't override the select's `aria-*` attributes from CSS. They
  are part of the accessibility contract.
- Don't add `styles` / `styleUrls` to a wrapping component that
  imports the select if the goal is to style the select — Angular
  view encapsulation (`Emulated`) prefixes the styles with a
  scoping attribute, so they won't reach the select. Use a global
  stylesheet (or `ViewEncapsulation.None` on a wrapper component)
  instead.

## Angular view encapsulation

Angular's default `ViewEncapsulation.Emulated` rewrites CSS
selectors to include a unique scoping attribute (`_nghost-xyz`).
This means styles declared in a component's `styles` field don't
reach child components by default.

The select is a standalone component with no `styles`, so emulation
doesn't bite the helper itself. But a consumer wrapping the select
in another component must publish their select-targeting styles
either globally or with `ViewEncapsulation.None`:

```ts
import { Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector: "my-settings",
    standalone: true,
    imports: [ThemeSelect],
    encapsulation: ViewEncapsulation.None,  // styles reach .theme-select
    template: `
        <lily-theme-select label="Theme" themesUrl="/t/" [themes]="themes" />
    `,
    styles: `
        .theme-select {
            border: 1px solid var(--brand);
        }
    `,
})
export class MySettings { /* … */ }
```

Or, more idiomatically, put the select CSS in a global stylesheet
referenced from `angular.json`'s `styles` array.

## `:host` pseudo-class

If you wrap the select in your own component, the outer host element
is a `<my-settings>` tag, not the select's `<select>`. To style
the host:

```css
:host {
    display: block;
    padding: 1rem;
}
```

This styles the wrapping `<my-settings>`, not the inner
`<select>`.

## `::ng-deep` (deprecated but useful)

For reaching into child component styles from a parent's component
styles, `::ng-deep` still works (despite being deprecated). It's
brittle — prefer global stylesheets. If you must use it:

```css
::ng-deep .theme-select-option {
    /* applies to descendants regardless of scope */
}
```

A safer alternative is to drop the styles into the global stylesheet
referenced from `angular.json`.

---

Lily™ and Lily Design System™ are trademarks.
