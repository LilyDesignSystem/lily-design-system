# CodeBlock

## Metadata

- Component: code-block
- PascalCase: CodeBlock
- Description: a block of formatted code with optional line numbers and line highlighting
- HTML tag: <pre>
- CSS class: .code-block
- Interactive: no

## Key Behaviors

- Uses `<pre>` element to preserve whitespace and line breaks
- Contains a nested `<code>` element for semantic code marking
- Optional line numbers via `data-line-numbers` attribute
- Optional line highlighting via `data-highlight-lines` attribute

## ARIA

- `aria-label` -- optional description of the code block content
- `role="region"` when `aria-label` is provided

## Keyboard

- None -- code blocks are informational, not interactive

## Props

- `label`: string (optional) -- accessible label describing the code content
- `lineNumbers`: boolean (default: false) -- whether to display line numbers
- `highlightLines`: string (optional) -- comma-separated line numbers to highlight
- `children`: slot (required) -- the code content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <pre> element with class="code-block"
- [ ] Has aria-label attribute when provided
- [ ] Supports line numbers and line highlighting
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .code-block in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/code-block.html
- MDN `<pre>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre
