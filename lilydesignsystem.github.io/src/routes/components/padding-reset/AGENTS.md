# Padding Reset

## Metadata

- Component: padding-reset
- PascalCase: PaddingReset
- Description: a container that resets padding inside fluid-width containers
- HTML tag: <div>
- CSS class: .padding-reset
- Interactive: no

## Key Behaviors

- Resets horizontal padding when content needs to break out of a padded container
- Useful inside fluid-width ContentBlock elements
- Uses negative margins to counteract parent padding
- Inspired by Reuters Graphics PaddingReset component

## ARIA

- None -- presentational container

## Keyboard

- None

## Props

- `children`: slot (required) -- content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="padding-reset"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .padding-reset in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/padding-reset.html
