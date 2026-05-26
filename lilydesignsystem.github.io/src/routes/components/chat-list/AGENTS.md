# ChatList

## Metadata

- Component: chat-list
- PascalCase: ChatList
- Description: an ordered list of chat list item components
- HTML tag: <ol>
- CSS class: .chat-list
- Interactive: no

## Composition

- Pattern: Nav/List/ListItem
- Parent: chat-nav
- Children: chat-list-item

## Key Behaviors

- Renders an `<ol>` element for ordered list semantics
- Consumer places ChatListItem components as children
- Each ChatListItem typically contains a ChatMessage component
- Spreads `restProps` onto the `<ol>` for consumer customization

## ARIA

- Implicit `list` role from `<ol>` element
- Implicit `listitem` role from child `<li>` elements
- Ordered list conveys sequential relationship of chat entries

## Keyboard

- Tab: Focus moves between interactive elements within the list items
- (Keyboard interactions are primarily handled by child ChatListItem components)

## Props

- `children`: slot (required) -- ChatListItem components
- `...restProps`: unknown -- additional attributes spread onto the `<ol>` element

## Acceptance Criteria

- [ ] Renders <ol> element with class="chat-list"
- [ ] Implicit list role from <ol> element
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .chat-list in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/chat-list.html
- MDN HTML ol element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol
