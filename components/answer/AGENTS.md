# Answer

## Metadata

- Component: answer
- PascalCase: Answer
- Description: an answer is anything that responds to a question, request, action, etc.
- HTML tag: <div>
- CSS class: .answer
- Interactive: no

## Key Behaviors

- Uses `<div>` element with class `answer`
- Optional `aria-label` describes the answer for screen readers
- Pairs naturally with the `question` component for Q&A patterns

## ARIA

- `aria-label` -- describes the answer for screen readers when no visible heading is present

## Keyboard

- None -- answers are informational, not interactive

## Props

- `label`: string (optional) -- accessible label for the answer
- `children`: slot (required) -- answer content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="answer"
- [ ] Has aria-label attribute when provided
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .answer in css-style-sheet-template.css
