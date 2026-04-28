# FeatureCard

a large content card with a prominent image positioned alongside or
above the text

## Description

FeatureCard is an `<article>` landmark composed of an optional image,
a heading, optional description, and arbitrary trailing content
(usually CTAs). The image position is exposed as a data attribute so
consumers can drive layout with CSS.

## HTML tag

`<article>`

## CSS class

`feature-card`

## Params

- `heading` — string. **Required.** Card heading text rendered inside
  an `<h3 class="feature-card-heading">`.
- `imagePosition` — `"start"` | `"end"` | `"top"`. Default `"start"`.
  Rendered as `data-image-position`.
- `imageUrl` — string. Image `src`.
- `imageAlt` — string. Image `alt` text. Use `""` for purely
  decorative images.
- `description` — string. Body text rendered as a
  `<p class="feature-card-description">`.
- `descriptionHtml` — string. Raw HTML body rendered inside a
  `<div class="feature-card-description">`.
- `label` — string. `aria-label` override (defaults to `heading`).
- `text` — string. Plain text trailing content.
- `html` — string. Raw HTML trailing content (e.g., CTAs).
- `id` — string.
- `classes` — string.
- `attributes` — object.

## Usage

```njk
{% from "components/feature-card/macro.njk" import featureCard %}

{% call featureCard({
  heading: "Privacy by design",
  imageUrl: "/img/lock.png",
  imageAlt: "",
  description: "Your data, your choice.",
  imagePosition: "start"
}) %}
  <a href="/learn-more">Learn more</a>
{% endcall %}
```

## Accessibility

- `<article>` is a labelled landmark; `aria-label` defaults to the
  heading and may be overridden via `label`.
- For purely decorative imagery, set `imageAlt: ""`.
- Trailing CTAs should each have a clear, unique accessible name.

## When to use

- Marketing pages that pair an illustration with a brief value
  proposition and a CTA.

## When not to use

- For tightly-packed lists of small cards, prefer `Card`.
- For a hero unit at the top of a page, prefer `HeroHeadline`.

## Headless

No CSS or JavaScript bundled. Consumers provide all styling.

## Testing

`components/feature-card/macro.test.js` verifies the base class,
heading element, image rendering, default aria-label, data-image-
position, and content slots.

## References

- [Mozilla Protocol: Feature Card](https://protocol.mozilla.org/components/detail/feature-card)
