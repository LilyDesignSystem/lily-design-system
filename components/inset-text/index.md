# Inset Text

An inset text component is used to distinguish a block of content from the surrounding text, drawing attention to important information that a user needs to know. It is commonly used in government and institutional design systems to highlight supplementary information, processing times, eligibility criteria, or important notices without using an alert or warning pattern.

The component renders its content within a semantic container that screen readers announce as a note, making it clear that the content is supplementary or distinguished from the main flow.

## Implementation Notes

- Renders a `<div>` with `role="note"` to semantically indicate supplementary content.
- Content is passed via the `children` slot, allowing any markup structure inside the inset.
- Spreads `restProps` onto the container for consumer customization.
- No internal state management; this is a purely presentational container.
- Inspired by the GOV.UK and NHS England design system "inset text" pattern.

## Props

- `children`: slot (required) -- content to display inside the inset text block.
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`.

## Usage

```html
<InsetText>
  <p>You can report any suspected side effect using the
  <a href="https://yellowcard.mhra.gov.uk/">Yellow Card safety scheme</a>.</p>
</InsetText>
```

```html
<InsetText>
  <p>If you are registered with a GP surgery, you can get an
  NHS number by calling or visiting them.</p>
</InsetText>
```

```html
<InsetText>
  <p>It can take up to 8 weeks to process your application.</p>
</InsetText>
```

## Keyboard Interactions

None -- this component is a passive container with no interactive behavior.

## ARIA

- `role="note"` -- identifies the content as a note or supplementary information, so screen readers announce it with appropriate context.

## When to Use

- Use to help users identify and understand important content that needs to stand out from the rest of the page
- Use on content pages to highlight key information without the visual weight of a WarningCallout
- Use sparingly -- its effectiveness depends on it being distinct from surrounding content

## When Not to Use

- Do not use on transactional pages -- the pattern is untested in that context
- Do not use when directing users to contact their GP or seek medical help -- use CareCard instead
- Do not use for time-critical or health-impacting information -- use WarningCallout instead
- Do not use for system-level status messages -- use Alert or Banner instead
- Do not overuse on a single page -- if everything is highlighted, nothing stands out

## Headless

This headless component provides a `<div>` with `role="note"` for semantic supplementary content. The consumer provides all visual styling including the characteristic left border, indentation, padding, and font treatment.


## Styles

The consumer provides all CSS styling. The component renders with a `.inset-text` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `inset-text`
- Verify role="note"` -- identifies the content as a note or supplementary information, so screen readers announce it with appropriate context.
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use a thick left border (typically 4-10px) as the primary visual indicator. Keep inset text visually distinct from blockquotes and callouts.
- **Developers**: Keep inset text content concise. Avoid nesting interactive elements inside the inset text; use it for informational content only.

## References

- WAI-ARIA Note Role: https://www.w3.org/TR/wai-aria-1.2/#note
- GOV.UK Inset Text: https://design-system.service.gov.uk/components/inset-text/
- NHS England Inset Text: https://service-manual.nhs.uk/design-system/components/inset-text
