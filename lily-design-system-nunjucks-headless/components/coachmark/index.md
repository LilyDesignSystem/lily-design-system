# Coachmark

an anchored popover that spotlights and explains a single feature

## Description

Coachmark is a non-modal `<div role="dialog">` used to explain a
single feature on first use. It always renders a heading and a
dismiss button, and may optionally include a body description. The
`hidden` attribute toggles visibility based on `open`.

The Nunjucks macro does not generate ids dynamically. The consumer
should pass `params.id` for the panel; the title and description
ids are derived from it (`{id}-title`, `{id}-description`). When
`params.id` is omitted the title and description ids fall back to
`coachmark-title` and `coachmark-description`. The consumer can
also override these explicitly with `titleId` and `descriptionId`.

## HTML tag

`<div role="dialog">`

## CSS class

`coachmark`

## Params

- `open` — boolean. Default `false`. When false, the dialog is
  rendered with the `hidden` attribute.
- `title` — string. **Required.** Heading text rendered as
  `<h2 class="coachmark-title">`.
- `description` — string. Optional body text rendered as
  `<p class="coachmark-description">`.
- `dismissLabel` — string. **Required.** Accessible label for the
  dismiss button.
- `id` — string. Optional id for the dialog and the seed for the
  title and description ids.
- `titleId` — string. Optional explicit id for the title.
- `descriptionId` — string. Optional explicit id for the description.
- `html` — string. Raw HTML extra content (rendered via `| safe`).
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/coachmark/macro.njk" import coachmark %}

{{ coachmark({
  id: "feature-tip",
  open: true,
  title: "New feature",
  description: "Click here to try it out.",
  dismissLabel: "Dismiss"
}) }}
```

## Accessibility

- `role="dialog"` with `aria-modal="false"`.
- `aria-labelledby` always points to the title element.
- `aria-describedby` is rendered only when a description is
  supplied, pointing to the description element.
- The dismiss button is a native `<button type="button">` with its
  own `aria-label`.

## Headless

No CSS or JavaScript bundled. The consumer wires up the dismiss
handler, focus management, and styling.

## Testing

`components/coachmark/macro.test.js` verifies the dialog role,
title/description aria wiring, conditional `hidden`, dismiss
button, classes, and attributes.

## References

- [WAI-ARIA: dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [Adobe Spectrum: Coach mark](https://spectrum.adobe.com/page/coach-mark/)

---

Lily™ and Lily Design System™ are trademarks.
