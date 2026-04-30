# ChatNav

## Metadata

- Component: chat-nav
- PascalCase: ChatNav
- Description: a navigation container for chat information
- HTML tag: <nav>
- CSS class: .chat-nav
- Interactive: yes

## Composition

- Pattern: Nav/List/ListItem
- Children: chat-list, chat-list-item, chat-message

## Key Behaviors

- Renders a `<nav>` element for the navigation landmark
- `aria-label` on the `<nav>` provides an accessible name (e.g. "Chat conversations")
- Consumer places ChatList component and ChatListItem components as children
- Each ChatListItem typically contains a ChatMessage component
- Spreads `restProps` onto the `<nav>` for consumer customization

## ARIA

- `<nav>` with `aria-label` creates a navigation landmark for the chat list
- `<ol>` conveys the ordered relationship of the chat entries
- Implicit `listitem` role from semantic `<li>` elements
- `aria-current` on the currently selected chat item

## Keyboard

- Tab: Focus moves between interactive elements in the chat list
- Enter: Activates the focused chat list item or link
- Arrow Down: Move focus to the next chat list item
- Arrow Up: Move focus to the previous chat list item

## Props

- `label`: string (required) -- accessible name for the navigation landmark
- `children`: slot (required) -- ChatList with ChatListItem components
- `...restProps`: unknown -- additional attributes spread onto the `<nav>` element

## Acceptance Criteria

- [ ] Renders <nav> element with class="chat-nav"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .chat-nav in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/chat-nav.html
- WAI-ARIA Navigation Landmark: https://www.w3.org/WAI/ARIA/apg/patterns/landmark/
