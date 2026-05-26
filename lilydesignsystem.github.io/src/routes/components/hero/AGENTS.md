# Hero

## Metadata

- Component: hero
- PascalCase: Hero
- Description: a large box or image with a title and description
- HTML tag: <section>
- CSS class: .hero
- Interactive: no

## Key Behaviors

- Uses `<section>` element for landmark semantics
- `aria-label` describes the hero section for screen readers
- Contains slots for title, description, image, and call-to-action

## ARIA

- Implicit `region` role from `<section>` element with `aria-label`
- `aria-label` -- describes the hero section for screen readers

## Keyboard

- None at the section level -- interactive children handle their own keyboard interactions

## Props

- `label`: string (required) -- accessible label for the hero section
- `children`: slot (required) -- hero content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <section> element with class="hero"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .hero in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/hero.html
