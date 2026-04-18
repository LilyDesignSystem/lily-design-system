# InsetText

An inset text component is used to distinguish a block of content from the surrounding text, drawing attention to important information that a user needs to know. It is commonly used in government and institutional design systems to highlight supplementary information, processing times, eligibility criteria, or important notices without using an alert or warning pattern.

The component renders its content within a semantic container that screen readers announce as a note, making it clear that the content is supplementary or distinguished from the main flow.

## Implementation Notes

- Renders a `<div>` with `role="note"` to semantically indicate supplementary content.
- Content is passed via the `children` snippet, allowing any markup structure inside the inset.
- Spreads `restProps` onto the container for consumer customization.
- No internal state management; this is a purely presentational container.
- Inspired by the GOV.UK and NHS England design system "inset text" pattern.

## Props

- `children`: Snippet (required) -- content to display inside the inset text block.
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`.

## Usage

```svelte
<InsetText>It can take up to 8 weeks to process.</InsetText>
```

```svelte
<InsetText>
    <p>You must apply before the deadline. Late applications will not be accepted.</p>
</InsetText>
```

## Keyboard Interactions

None -- this component is a passive container with no interactive behavior.

## ARIA

- `role="note"` -- identifies the content as a note or supplementary information, so screen readers announce it with appropriate context.

## References

- WAI-ARIA Note Role: https://www.w3.org/TR/wai-aria-1.2/#note
- GOV.UK Inset Text: https://design-system.service.gov.uk/components/inset-text/
- NHS England Inset Text: https://service-manual.nhs.uk/design-system/components/inset-text
