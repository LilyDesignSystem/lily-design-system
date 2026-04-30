# ChatListItem

## Metadata

- Component: chat-list-item
- PascalCase: ChatListItem
- Description: one chat list item component, typically containing one chat message component
- HTML tag: <li>
- CSS class: .chat-list-item
- Interactive: yes

## Composition

- Pattern: Nav/List/ListItem
- Parent: chat-list
- Children: chat-message

## Key Behaviors

- Renders an `<li>` element for list item semantics
- Consumer places a ChatMessage component as a child
- Supports `current` prop for marking the currently selected conversation
- `aria-current` rendered when the `current` prop is provided
- Spreads `restProps` onto the `<li>` for consumer customization

## ARIA

- Implicit `listitem` role from `<li>` element
- `aria-current="true"` when the `current` prop is provided

## Keyboard

- Tab: Focus the interactive element within the list item
- Enter: Activate the focused list item or link

## Props

- `current`: boolean (default: false) -- marks this item as the currently selected conversation
- `children`: slot (required) -- typically a ChatMessage component
- `...restProps`: unknown -- additional attributes spread onto the `<li>` element

## Acceptance Criteria

- [ ] Renders <li> element with class="chat-list-item"
- [ ] Has aria-current attribute when current prop is true
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .chat-list-item in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/chat-list-item.html
- MDN HTML li element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
