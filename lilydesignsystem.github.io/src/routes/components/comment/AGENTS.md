# Comment

## Metadata

- Component: comment
- PascalCase: Comment
- Description: a comment displays user discussions and user feedback
- HTML tag: <article>
- CSS class: .comment
- Interactive: no

## Key Behaviors

- Uses `<article>` element for self-contained comment semantics
- `aria-label` describes the comment
- Contains slots for avatar, author name, timestamp, and body content
- Supports nested replies through recursive composition

## ARIA

- Implicit `article` role from `<article>` element
- `aria-label` -- describes the comment for screen readers

## Keyboard

- None -- comments are informational, not interactive

## Props

- `label`: string (optional) -- accessible label for the comment
- `children`: slot (required) -- comment content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <article> element with class="comment"
- [ ] Has aria-label attribute when provided
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .comment in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/comment.html
