# Answer

An answer is anything that responds to a question, request, action, etc. Examples include FAQ replies, quiz answers, survey responses, and forum replies.

This headless component renders a `<div>` with class `answer`. The consumer supplies the answer content as children.

## Implementation Notes

- Uses `<div>` element with class `answer`
- `aria-label` describes the answer for assistive technology when no visible heading is present
- Pairs naturally with the `question` component for Q&A patterns

## Props

- `label`: string (optional) -- accessible label for the answer
- `children`: slot (required) -- answer content (body, citations, related links, action buttons)
- `...restProps`: Any additional HTML attributes

## Usage

```html
<Answer label="Sample FAQ answer">
  <p>The clinic opens at 8:00 a.m. on weekdays.</p>
</Answer>
```

Paired with a question:

```html
<Question>
  <h3>How do I reset my password?</h3>
  <Answer>
    <p>Use the "Forgot password" link on the sign-in page.</p>
  </Answer>
</Question>
```

## Keyboard Interactions

- None -- answers are informational, not interactive

## ARIA

- `aria-label` -- describes the answer for screen readers when no visible heading is present

## When to Use

- Use to pair with a `question` for FAQ and Q&A patterns.
- Use for quiz answer reveals or feedback panels.
- Use for forum replies displayed beneath the original question.

## When Not to Use

- Do not use for form input results -- use `success-panel` or `notification` instead.
- Do not use for chat replies -- use `chat-message` inside a `chat-list-item`.
- Do not use for system-generated confirmations -- use `alert` or `toast`.

## Headless

This component provides a `<div>` element with optional `aria-label` and zero visual styling. The consumer is responsible for all CSS including heading styling, indentation, citation formatting, and any reveal/collapse interactions.

## Styles

The consumer provides all CSS styling. The component renders with a `.answer` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `answer`
- Verify `aria-label` is applied when provided
- Verify child content slots are rendered correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Distinguish answer text from the surrounding question; indent or color-band groups to reinforce pairing on FAQ pages.
- **Developers**: For quiz answer reveals or collapsible FAQ entries, wrap the question/answer pair in `details` or a `collapsible` component; the `answer` component itself stays passive.

## Related components

- `question` — a question is anything that asks for information, invites a response, tests knowledge, etc.
- `comment` — a comment is anything that expresses an opinion, observation, explanation, etc.
- `success-panel` — a panel confirming a task has been completed

## References

- [MDN div element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div)
