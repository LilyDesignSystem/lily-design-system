# SectionHeading

a styled heading introducing a major content section, with optional
eyebrow and subtitle

## Description

SectionHeading wraps an `<h2>`–`<h6>` element in a `<header>` along
with optional eyebrow (`<p>` above) and subtitle (`<p>` below). Only
the heading element contributes to the document outline; the
eyebrow and subtitle are paragraphs.

## HTML tag

`<header>`

## CSS class

`section-heading`

## Params

- `heading` — string. **Required.** Main heading text.
- `eyebrow` — string. Eyebrow text rendered above the heading.
- `subtitle` — string. Subtitle text rendered below the heading.
- `level` — `2` | `3` | `4` | `5` | `6`. Default `2`. Controls which
  heading element is rendered.
- `id` — string.
- `classes` — string.
- `attributes` — object.

## Usage

```njk
{% from "components/section-heading/macro.njk" import sectionHeading %}

{{ sectionHeading({
  eyebrow: "Why us",
  heading: "Built for everyone",
  subtitle: "Open source, privacy first.",
  level: 2
}) }}
```

## Accessibility

- Pick `level` to maintain the document outline. The previous
  heading on the page should be one level higher (e.g., page `<h1>`
  followed by section `<h2>`s).
- Eyebrows and subtitles are `<p>` elements so screen readers do not
  treat them as additional headings.

## When to use

- Major content section introductions on marketing or article pages.

## When not to use

- For top-of-page page titles, prefer `Headline` or `HeroHeadline`.

## Headless

No CSS or JavaScript bundled. Consumers provide all styling.

## Testing

`components/section-heading/macro.test.js` verifies the base class,
default and overridden heading levels, eyebrow and subtitle
rendering, and ordering.

## References

- [Mozilla Protocol: Section Heading](https://protocol.mozilla.org/components/detail/section-heading)
