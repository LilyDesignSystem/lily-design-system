# CodeBlock

A code block displays a block of formatted code with optional line numbers and line highlighting. Code blocks are used for presenting multi-line code examples, configuration files, or terminal output in documentation and tutorials.

This headless component uses a `<pre>` element to preserve whitespace and formatting, providing a container for structured code display.

## Implementation Notes

- Uses `<pre>` element to preserve whitespace and line breaks
- Contains a nested `<code>` element for semantic code marking
- Optional line numbers via `data-line-numbers` attribute
- Optional line highlighting via `data-highlight-lines` attribute
- `aria-label` provides a description of the code block content

## Props

- `label`: string (optional) -- accessible label describing the code content
- `lineNumbers`: boolean (default: false) -- whether to display line numbers
- `highlightLines`: string (optional) -- comma-separated line numbers to highlight (e.g., "1,3,5-7")
- `children`: slot (required) -- the code content
- `...restProps`: Any additional HTML attributes

## Usage

Inline code within a paragraph, paired with a code block for a full example:

```html
<p>Add the <Code>.button</Code> class to your element.</p>

<CodeBlock label="Button markup example" lineNumbers>
  <code>&lt;button class="button" type="submit"&gt;
  Save and continue
&lt;/button&gt;</code>
</CodeBlock>
```

Highlighting a specific line in a code block:

```html
<CodeBlock label="JavaScript greeting function" lineNumbers highlightLines="2">
  <code>function greet(name) {
  return `Hello, ${name}!`;
}</code>
</CodeBlock>
```

## Keyboard Interactions

- None -- code blocks are informational, not interactive
- Tab: Moves focus past the code block (not into it)

## ARIA

- `aria-label` -- optional description of the code block content
- `role="region"` when `aria-label` is provided, to create a navigable landmark

## When to Use

- Use for multi-line formatted code with optional line numbers and syntax highlighting.
- Use in documentation, tutorials, or developer-facing content for code examples.
- Use when preserving whitespace and formatting is important.
- Use for configuration files, API responses, or structured data display.

## When Not to Use

- Do not use for single inline code references -- use Code instead.
- Do not use for terminal commands presented in a shell context -- use MockupShell for a terminal-style presentation.
- Do not use for non-code preformatted text that has no semantic code meaning.

## Headless

This component provides a `<pre>` element with optional line numbers, line highlighting data attributes, and accessible labeling, with zero visual styling. The consumer is responsible for all CSS including font family, background color, padding, border, overflow handling, line number display, and highlight styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.code-block` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<pre>` element with class `code-block`
- Verify `aria-label` is applied when provided
- Verify `data-line-numbers` attribute reflects the lineNumbers prop
- Verify `data-highlight-lines` attribute reflects the highlightLines prop
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use a monospace font with sufficient line height. Provide horizontal scrolling for long lines. Use a distinct background to separate code from surrounding content.
- **Developers**: Use the `label` prop to describe the code block purpose for screen readers. Nest a `<code>` element inside the `<pre>` for proper semantics.

## References

- MDN `<pre>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre
