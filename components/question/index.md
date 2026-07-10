# Question

A question is anything that asks for information, invites a response, tests knowledge, etc. Examples include FAQ entries, quiz prompts, survey questions, forum questions, and interview questions.

This headless component renders a `<div>` with class `question`. The consumer supplies the question text and any related content (answer slot, metadata, action buttons) as children.

## Implementation Notes

- Uses `<div>` element with class `question`
- `aria-label` describes the question for assistive technology when no visible heading is present
- Pairs naturally with the `answer` component for Q&A patterns

## Props

- `label`: string (optional) -- accessible label for the question
- `children`: slot (required) -- question content (heading, body, related answers, metadata)
- `...restProps`: Any additional HTML attributes

## Usage

```html
<Question label="Sample FAQ question">
  <h3>What time does the clinic open?</h3>
  <p>The clinic opens at 8:00 a.m. on weekdays.</p>
</Question>
```

Paired with an answer:

```html
<Question>
  <h3>How do I reset my password?</h3>
  <Answer>
    <p>Use the "Forgot password" link on the sign-in page.</p>
  </Answer>
</Question>
```

## Keyboard Interactions

- None -- questions are informational, not interactive

## ARIA

- `aria-label` -- describes the question for screen readers when no visible heading is present

## When to Use

- Use for FAQ entries that pair a question with one or more answers.
- Use for quiz, survey, or knowledge-check prompts.
- Use for forum-style threads where each thread starts with a question.

## When Not to Use

- Do not use for form input prompts -- use `field` with `label` instead.
- Do not use for dialog confirmation prompts -- use `popconfirm-dialog` or `alert-dialog`.
- Do not use for input validation hints -- use `hint` instead.

## Headless

This component provides a `<div>` element with optional `aria-label` and zero visual styling. The consumer is responsible for all CSS including heading styling, spacing, list-of-questions layout, and any expand/collapse interactions.

## Styles

The consumer provides all CSS styling. The component renders with a `.question` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `question`
- Verify `aria-label` is applied when provided
- Verify child content slots are rendered correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Distinguish question text visually from answer text; consider numbering or iconography for FAQ pages.
- **Developers**: For collapsible FAQ entries, wrap the question and answer pair in `details` or a `collapsible` component; the `question` component itself stays passive.

## Related components

- `answer` — an answer is anything that responds to a question, request, action, etc.
- `comment` — a comment is anything that expresses an opinion, observation, explanation, etc.
- `field` — a form field wrapper with label, input, and error message

## References

- [MDN div element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div)

---

Lily™ and Lily Design System™ are trademarks.
