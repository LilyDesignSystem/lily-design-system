# Comment

## Metadata

- Component: comment
- PascalCase: Comment
- Description: a comment is anything that expresses an opinion, observation, explanation, etc.
- HTML tag: <div>
- CSS class: .comment
- Interactive: no

## Key Behaviors

- Uses `<div>` element with class `comment`
- `aria-label` describes the comment for screen readers
- Contains slots for avatar, author name, timestamp, and body content
- Supports nested replies through recursive composition

## ARIA

- `aria-label` -- describes the comment for screen readers

## Keyboard

- None -- comments are informational, not interactive

## Props

- `label`: string (optional) -- accessible label for the comment
- `children`: slot (required) -- comment content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="comment"
- [ ] Has aria-label attribute when provided
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .comment in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/comment.html
