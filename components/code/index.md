# Code

A code component displays an inline code span for showing short code snippets, variable names, file paths, or commands within surrounding text. It visually distinguishes code from prose to improve readability.

This headless component uses the native HTML `<code>` element for semantic correctness, ensuring assistive technologies can identify inline code content.

## Implementation Notes

- Uses native `<code>` element for semantic inline code
- Content is provided through child elements
- No interactive behavior -- purely presentational
- Consumer styles the code appearance (font, background, padding)

## Props

- `children`: slot (required) -- the code text content
- `...restProps`: Any additional HTML attributes

## Usage

```html
<p>Use the <Code>console.log()</Code> function for debugging.</p>
<p>Set the <Code>--primary-color</Code> CSS variable.</p>
```

## Keyboard Interactions

- None -- code spans are informational, not interactive

## ARIA

- No additional ARIA attributes needed -- the `<code>` element provides semantic meaning natively

## When to Use

- Use for short inline code snippets within surrounding text, such as variable names, CSS classes, or HTML elements.
- Use when displaying file paths, terminal commands, or configuration keys inline.
- Use to visually distinguish code from prose for improved readability.

## When Not to Use

- Do not use for multi-line code -- use CodeBlock instead.
- Do not use for non-code emphasis -- use `<strong>` or `<em>` for standard text formatting.
- Do not use for terminal-style presentation -- use MockupShell for a command-line appearance.

## Headless

This component provides a semantic `<code>` element with zero visual styling. The consumer is responsible for all CSS including font family, background color, padding, border radius, and text color.

## Styles

The consumer provides all CSS styling. The component renders with a `.code` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<code>` element with class `code`
- Verify child content is rendered correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use a monospace font to distinguish code from prose. A subtle background color helps code stand out within paragraphs.
- **Developers**: Use Code for inline snippets and CodeBlock for multi-line code. No ARIA attributes are needed beyond the semantic `<code>` element.

## References

- MDN `<code>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code
