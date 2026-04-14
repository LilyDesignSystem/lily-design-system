# AI Label

AiLabel is a headless inline indicator that communicates the presence of AI-generated content and provides a pathway to AI explainability. It renders as a `<span>` element with appropriate ARIA attributes, serving as a visual marker that content has been generated, modified, or enhanced by artificial intelligence.

Use AiLabel wherever AI is generating, modifying, or enhancing content to reinforce AI transparency, accountability, and explainability. The component can be placed inline with text, within form fields, alongside data visualizations, or anywhere users need to identify AI-generated content.

## Implementation Notes

- Renders a `<span>` element for inline placement
- Uses `aria-label` for accessible naming, defaulting to "AI" if not provided
- The `text` prop provides visible label text, defaulting to "AI"
- Spreads `restProps` onto the span for consumer customization
- Designed as the first layer of AI explainability; consumers can wrap in a button or attach a popover for deeper explainability content

## Props

- `label`: string (default: "AI") -- accessible name for the indicator via `aria-label`
- `text`: string (default: "AI") -- visible text displayed inside the indicator
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Usage

Inline AI indicator within text:

```html
<p>This summary was created by <AiLabel /> based on your uploaded documents.</p>
```

Custom label with explainability context:

```html
<AiLabel text="AI generated" label="AI generated content" />
```

Wrapped in a button as an explainability trigger:

```html
<button onclick={showExplainability}>
  <AiLabel text="AI assisted" label="AI assisted diagnosis -- click for details" />
</button>
```

## Keyboard Interactions

None at the component level. When used as an explainability trigger, the consumer wraps AiLabel in a `<button>` element for keyboard accessibility.

## ARIA

- `aria-label={label}` -- provides an accessible name for the AI indicator so screen readers announce its purpose

## When to Use

- Use to indicate that content was generated or assisted by artificial intelligence.
- Use as a pathway to AI explainability, linking to or triggering information about how the AI was used.
- Use when transparency about AI involvement is required by policy, regulation, or user trust expectations.
- Use inline with text, inside form fields, or alongside data visualisations to mark AI-generated output.
- Use as the first layer of AI explainability -- wrap in a button and attach a Popover for deeper explanation.

## When Not to Use

- Do not use for general status indicators -- use Tag or Badge instead.
- Do not use for content authored entirely by humans -- the label would be misleading.
- Do not use without an explainability pathway -- the label alone is insufficient for meaningful transparency.

## Headless

This headless component provides a `<span>` with visible text and an `aria-label` for accessible naming. The consumer provides all visual styling including colors, borders, typography, sizing, and positioning. For explainability popover behavior, the consumer wraps AiLabel in a button and attaches their own popover component.

## Styles

The consumer provides all CSS styling. The component renders with an `.ai-label` class for targeting. Common styling includes a small pill or badge shape, distinct color to differentiate AI content, and inline-flex display for alignment with surrounding text.

## Testing

- Verify the component renders a `<span>` element with the `ai-label` class
- Verify the default text "AI" is rendered
- Verify custom `text` prop is rendered
- Verify `aria-label` defaults to "AI" when not provided
- Verify custom `label` prop is applied as `aria-label`
- Verify pass-through attributes are applied to the span

## Advice

- **Designers**: Make the AI label visually distinct from surrounding content using a contrasting color or badge style. Keep it small and unobtrusive but clearly visible. Consider a consistent AI color across your product.
- **Developers**: Always include AiLabel wherever AI generates content, even if the output is reviewed by a human. For explainability popover behavior, wrap the label in a button and use your popover component to show explanatory content on click.

## References

- Carbon Design System AI Label: https://carbondesignsystem.com/components/ai-label/usage/
- Carbon for AI Guidelines: https://carbondesignsystem.com/guidelines/carbon-for-ai/
