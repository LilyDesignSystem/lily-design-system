# MenuGroup

## Metadata

- Component: menu-group
- PascalCase: MenuGroup
- Description: a labeled section of menu items within a menu
- HTML tag: <div> with role="group"
- CSS class: .menu-group
- Interactive: no (static container; menu interactions are on items)

## Key Behaviors

- Renders a <div role="group"> with required aria-label
- Renders a visible heading <div class="menu-group-heading" aria-hidden="true"> containing the label text
- Renders children (typically MenuItem components) after the heading

## ARIA

- `role="group"` on the container
- `aria-label` is the accessible name (required)
- Visible heading uses `aria-hidden="true"` to prevent double-announcement

## Keyboard

- Group itself is non-interactive
- Parent menu provides arrow-key navigation across items, Enter/Space to activate, Escape to close

## Props

- `label`: string (REQUIRED) -- section heading text and aria-label
- `children`: slot -- menu-item children
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with role="group" and class="menu-group"
- [ ] aria-label is present and equals the label prop
- [ ] Visible heading renders with class="menu-group-heading" and aria-hidden="true"
- [ ] Heading text equals the label prop
- [ ] Children are rendered after the heading
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .menu-group in css-style-sheet-template.css
- Adobe Spectrum Menu: https://spectrum.adobe.com/page/menu/
- WAI-ARIA Menubar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
