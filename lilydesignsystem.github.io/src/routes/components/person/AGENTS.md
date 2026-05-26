# Person

## Metadata

- Component: person
- PascalCase: Person
- Description: a person component that contains other person-related information
- HTML tag: <article>
- CSS class: .person
- Interactive: no

## Key Behaviors

- Uses `<article>` element for self-contained person semantics
- `aria-label` describes the person for screen readers

## ARIA

- Implicit `article` role from `<article>` element
- `aria-label` -- describes the person for screen readers

## Keyboard

- None -- person components are informational, not interactive

## Props

- `label`: string (optional) -- accessible label for the person
- `children`: slot (required) -- person content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <article> element with class="person"
- [ ] Has aria-label attribute when provided
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .person in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/person.html
