# Question

## Metadata

- Component: question
- PascalCase: Question
- Description: a question is anything that asks for information, invites a response, tests knowledge, etc.
- HTML tag: <div>
- CSS class: .question
- Interactive: no

## Key Behaviors

- Uses `<div>` element with class `question`
- Optional `aria-label` describes the question for screen readers
- Pairs naturally with the `answer` component for Q&A patterns

## ARIA

- `aria-label` -- describes the question for screen readers when no visible heading is present

## Keyboard

- None -- questions are informational, not interactive

## Props

- `label`: string (optional) -- accessible label for the question
- `children`: slot (required) -- question content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="question"
- [ ] Has aria-label attribute when provided
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .question in css-style-sheet-template.css
