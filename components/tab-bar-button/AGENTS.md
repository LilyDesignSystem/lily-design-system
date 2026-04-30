# TabBarButton

## Metadata

- Component: tab-bar-button
- PascalCase: TabBarButton
- Description: one tab button in a tab group
- HTML tag: <button>
- CSS class: .tab-bar-button
- Interactive: yes

## Composition

- Pattern: Bar/BarButton
- Parent: tab-bar

## Key Behaviors

- Renders as `<button role="tab">` for proper tab semantics
- `aria-selected` reflects active/inactive state
- `aria-controls` links to the associated tabpanel id
- Roving tabindex: selected tab has tabindex=0, others have tabindex=-1
- Should be placed within a `role="tablist"` container

## ARIA

- `role="tab"` identifies this as a tab
- `aria-selected` communicates selection state
- `aria-controls` links to the corresponding tabpanel
- Roving `tabindex` (0 for selected, -1 for unselected)

## Keyboard

- TabBarButton: moves focus to the selected tab in the tablist
- ArrowLeft/ArrowRight: moves between tabs (handled by parent tablist)
- Enter/Space: activates the tab (native button behavior)

## Props

- `selected`: boolean (default: false) -- whether this tab is active
- `controls`: string (required) -- id of the associated tabpanel
- `children`: slot -- tab label content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <button> element with class="tab-bar-button"
- [ ] Has role="tab"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tab-bar-button in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tab-bar-button.html
- WAI-ARIA TabBarButtons Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- WAI-ARIA TabBarButton Role: https://www.w3.org/TR/wai-aria-1.2/#tab
