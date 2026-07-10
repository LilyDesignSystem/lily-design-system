# Summary Box

A summary box is an `<aside>` callout that highlights key takeaways or
next steps from a longer page, with a required heading and any body
content.

Use it to surface the most important information from a long article so
that scanning users can find the essentials without reading every word.

## Implementation Notes

- Uses an `<aside>` element so it is announced as a complementary landmark
- `heading` prop is **required** — rendered as an `<h3>` inside the box
- `label` prop is optional — when omitted it defaults to the heading text
- Children render inside `<div class="summary-box-body">`
- Pass-through attributes are forwarded to the root `<aside>`

## Props

- `heading`: string (**required**) -- box heading text
- `label`: string (optional) -- aria-label override (defaults to heading)
- `children`: slot -- body content
- `...restProps`: any additional HTML attributes

## Usage

Key takeaways summary:

```html
<SummaryBox heading="Key takeaways">
  <ul>
    <li>Eligibility extends to all U.S. citizens 18 and older.</li>
    <li>Applications are reviewed within 10 business days.</li>
    <li>Approved applicants receive a confirmation by mail.</li>
  </ul>
</SummaryBox>
```

Next steps summary with custom aria-label:

```html
<SummaryBox heading="Next steps" label="What to do next">
  <ol>
    <li>Gather your supporting documents.</li>
    <li>Complete the online form.</li>
    <li>Submit before the deadline.</li>
  </ol>
</SummaryBox>
```

## Keyboard Interactions

- Tab: focus moves to interactive descendants (links, buttons) within the body
- The box itself is not interactive

## ARIA

- `<aside>` provides the implicit `complementary` landmark role
- `aria-label` defaults to the `heading` prop, or uses `label` when supplied
- The heading is a real `<h3>` element so it appears in the document outline

## When to Use

- Use to highlight key takeaways, next steps, or a TL;DR for a long page.
- Use when the same content also appears in the body and the box should serve as a quick reference.

## When Not to Use

- Do not use for warnings or alerts — use `Alert`, `WarningCallout`, or `InformationCallout`.
- Do not use as a generic content container — use `Card` or `Panel` instead.
- Do not use as a replacement for proper headings within the article body.

## Headless

Renders the structural skeleton — `<aside>` with `<h3>` heading and a
body `<div>`. Visual treatment, border, padding, color, and any leading
icon are entirely the consumer's responsibility.

## Styles

Consumer CSS targets the `summary-box` class plus the inner
`summary-box-heading` and `summary-box-body` classes for fine-grained
control.

## Testing

- Verify the component renders an `<aside>` element with class `summary-box`
- Verify the heading is rendered inside an `<h3>` with class `summary-box-heading`
- Verify the heading text equals the `heading` prop
- Verify `aria-label` defaults to the heading when `label` is omitted
- Verify `aria-label` uses the `label` prop when supplied
- Verify children render inside `<div class="summary-box-body">`
- Verify additional HTML attributes pass through to the root `<aside>`

## Advice

- **Designers**: Place the summary box near the top of the page so scanning users see it first. Keep the heading short and the body to a few bullet points.
- **Developers**: Always supply a meaningful `heading`. Use `label` only when the heading would not make sense as a standalone landmark name.

## Related components

- `panel` — a generic content panel with optional heading
- `card` — a grouped content container with header, body, and footer areas
- `info-state` — a composition of illustration, title, description, and action for empty, error, or info states

## References

- US Web Design System Summary Box: https://designsystem.digital.gov/components/summary-box/
- HTML `<aside>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside
- WAI-ARIA complementary role: https://www.w3.org/TR/wai-aria-1.2/#complementary

---

Lily™ and Lily Design System™ are trademarks.
