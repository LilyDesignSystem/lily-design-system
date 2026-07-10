# SummaryBox

a boxed callout highlighting key takeaways or next steps from a longer page

## Description

SummaryBox is an `<aside>` complementary landmark that contains a
heading and a body. It is typically used to surface key takeaways
or "next steps" content near the top of a long article.

This component is inspired by the U.S. Web Design System (USWDS)
summary box pattern.

## HTML tag

`<aside>`

## CSS class

`summary-box`

## Params

- `heading` — string. **Required.** Box heading text.
- `label` — string. Optional `aria-label` override (defaults to the
  heading text).
- `text` — string. Optional escaped fallback body text.
- `html` — string. Raw HTML body content rendered via `| safe`.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/summary-box/macro.njk" import summaryBox %}

{% call summaryBox({ heading: "Key takeaways" }) %}
  <ul>
    <li>First takeaway</li>
    <li>Second takeaway</li>
  </ul>
{% endcall %}
```

## Accessibility

- `<aside>` provides a complementary landmark.
- `aria-label` defaults to the heading text so the landmark has a
  meaningful name even when assistive technology lists landmarks
  without their content.
- The heading uses `<h3>` so screen reader users can navigate to it.

## Headless

No CSS or JavaScript bundled. Sub-element classes
(`summary-box-heading`, `summary-box-body`) are styling hooks only.

## Testing

`components/summary-box/macro.test.js` verifies the base class, the
default `aria-label` from heading, the optional `label` override,
heading and body rendering, and prop pass-through.

## References

- [USWDS: Summary box](https://designsystem.digital.gov/components/summary-box/)

---

Lily™ and Lily Design System™ are trademarks.
