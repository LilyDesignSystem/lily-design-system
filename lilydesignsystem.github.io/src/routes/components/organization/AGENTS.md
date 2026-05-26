# Organization

## Metadata

- Component: organization
- PascalCase: Organization
- Description: an organization component that contains other organization-related information
- HTML tag: <article>
- CSS class: .organization
- Interactive: no

## Key Behaviors

- Uses `<article>` element for self-contained organization semantics
- `aria-label` describes the organization for screen readers

## ARIA

- Implicit `article` role from `<article>` element
- `aria-label` -- describes the organization for screen readers

## Keyboard

- None -- organizations are informational, not interactive

## Props

- `label`: string (optional) -- accessible label for the organization
- `children`: slot (required) -- organization content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <article> element with class="organization"
- [ ] Has aria-label attribute when provided
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .organization in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/organization.html
