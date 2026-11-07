# CodeBlock

## Metadata

- Component: code-block
- PascalCase: CodeBlock
- Description: a block of formatted code with optional line numbers and line highlighting
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <pre>
- CSS class: .code-block
- Interactive: no

## Key Behaviors

- Uses `<pre>` element to preserve whitespace and line breaks
- Contains a nested `<code>` element for semantic code marking
- Optional line numbers via `data-line-numbers` attribute
- Optional line highlighting via `data-highlight-lines` attribute

## ARIA

- `aria-label` -- the `label`, with `role="region"`
- `role="region"` when `label` is given, because a name on a bare `<pre>` is not reliably read

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
- [ ] Has role="region" and aria-label when `label` is given
- [ ] Supports line numbers and line highlighting
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .code-block in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/code-block.html
- MDN `<pre>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre
