# TabBar

## Metadata

- Component: tab-bar
- PascalCase: TabBar
- Description: a group of tabs for switching between content panels
- HTML tag: <div>
- CSS class: .tab-bar
- Interactive: yes

## Composition

- Pattern: Bar/BarButton
- Children: tab-bar-button

## Key Behaviors

- Renders a `<div>` element with `role="tablist"` for ARIA semantics
- Uses two-way `this` binding to capture a reference to the tablist element for DOM queries
- Queries all child elements with `[role='tab']` to build the list of navigable tabs
- Implements keyboard navigation via an `onkeydown` handler:
- Uses reactive state for the internal DOM reference (`tablistRef`)
- Consumer is responsible for managing `aria-selected` state on tab buttons and displaying corresponding tab panels
- Spreads `restProps` onto the div for consumer customization

## ARIA

- `role="tablist"` -- identifies the container as a list of tabs
- `aria-label={label}` -- provides an accessible name for the tab list so screen readers announce its purpose
- Child tabs should have `role="tab"` and `aria-selected` attributes (managed by consumer)
- Associated tab panels should have `role="tabpanel"` with `aria-labelledby` pointing to the corresponding tab (managed by consumer)

## Keyboard

- Arrow Right: Moves focus to the next tab; wraps from the last tab to the first
- Arrow Left: Moves focus to the previous tab; wraps from the first tab to the last
- Home: Moves focus to the first tab
- End: Moves focus to the last tab
- Tab: Moves focus into and out of the tab list (only one tab in the list is in the tab order at a time)

## Props

- `label`: string (required) -- accessible label for the tab list, applied via `aria-label`
- `children`: slot (required) -- tab button elements to render inside the tablist
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="tab-bar"
- [ ] Has aria-label attribute
- [ ] Has role="tablist"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tab-bar in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tab-bar.html
- WAI-ARIA Tabs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- WAI-ARIA Authoring Practices - Tabs Example: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-automatic/
