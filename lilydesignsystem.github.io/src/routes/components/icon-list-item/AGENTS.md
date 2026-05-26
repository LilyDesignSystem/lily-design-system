# IconListItem

## Metadata

- Component: icon-list-item
- PascalCase: IconListItem
- Description: one item in an icon list with a leading icon slot
- HTML tag: <li>
- CSS class: .icon-list-item
- Interactive: no

## Key Behaviors

- Renders a `<li>` with class `icon-list-item`
- Optional `icon` slot/snippet/ReactNode renders inside `<span class="icon-list-item-icon" aria-hidden="true">`
- Item text renders inside `<span class="icon-list-item-text">`
- Pass-through attributes are forwarded to the root `<li>`

## ARIA

- Implicit `listitem` role from the `<li>` element
- Icon span has `aria-hidden="true"` (decorative)
- Text span carries the accessible content of the item

## Keyboard

- Tab: moves focus to interactive descendants of the item
- The item itself is not interactive

## Props

- `icon`: slot/snippet/ReactNode (optional) -- leading icon content
- `children`: slot -- text content
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <li> element with class="icon-list-item"
- [ ] Icon span renders only when the icon slot is provided
- [ ] Icon span has aria-hidden="true"
- [ ] Icon span has class="icon-list-item-icon"
- [ ] Text span has class="icon-list-item-text"
- [ ] Children render inside the text span
- [ ] Additional HTML attributes pass through to the root element
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .icon-list-item in css-style-sheet-template.css
- US Web Design System Icon List: https://designsystem.digital.gov/components/icon-list/
- WAI-ARIA aria-hidden: https://www.w3.org/TR/wai-aria-1.2/#aria-hidden
