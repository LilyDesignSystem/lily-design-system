# ClampText

## Metadata

- Component: clamp-text
- PascalCase: ClampText
- Description: a text container that truncates content to a maximum number of lines
- HTML tag: <div>
- CSS class: .clamp-text
- Interactive: no

## Key Behaviors

- Renders a `<div>` wrapping arbitrary inner content
- Sets `data-lines={lines}` for consumer CSS hooks
- Exposes `--clamp-text-lines` as an inline CSS custom property
- Leaves all visual line-clamping to the consumer stylesheet
- Keeps the full content in the DOM so screen readers can access it

## ARIA

- `aria-label` rendered only when the `label` prop is provided
- No role is forced — this is a generic presentation container

## Keyboard

- None — passive container

## Props

- `lines`: number (default: 2) -- maximum visible lines
- `label`: string (optional) -- aria-label
- `children`: slot -- the text content to clamp
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="clamp-text"
- [ ] data-lines attribute matches lines prop
- [ ] Inline style sets --clamp-text-lines custom property
- [ ] aria-label is rendered when label prop is provided
- [ ] Children content is preserved
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .clamp-text in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/clamp-text.html
- MDN line-clamp: https://developer.mozilla.org/en-US/docs/Web/CSS/line-clamp
