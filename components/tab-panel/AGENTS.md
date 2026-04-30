# TabPanel

## Metadata

- Component: tab-panel
- PascalCase: TabPanel
- Description: a content panel associated with a tab in a tab bar
- HTML tag: <div> with role="tabpanel"
- CSS class: .tab-panel
- Interactive: focusable container (tabindex="0")

## Key Behaviors

- Renders <div role="tabpanel" class="tab-panel" tabindex="0">
- When `labelledBy` is provided, uses aria-labelledby={labelledBy} and omits aria-label
- When `labelledBy` is not provided, uses aria-label={label}
- Sets the hidden attribute when `selected` is false
- Renders children inside the panel

## ARIA

- `role="tabpanel"` on the container
- `aria-labelledby` when controlled by a tab id, otherwise `aria-label`
- `tabindex="0"` so the panel is keyboard-focusable
- `hidden` reflects `!selected`

## Keyboard

- Tab: Move focus into and out of the panel
- Parent TabBar provides arrow-key navigation between tabs

## Props

- `label`: string (REQUIRED) -- aria-label
- `labelledBy`: string (optional) -- if present, used as aria-labelledby; aria-label is omitted
- `selected`: boolean (default false)
- `children`: slot -- panel content
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> with role="tabpanel" and class="tab-panel"
- [ ] tabindex="0" is present
- [ ] aria-labelledby is set and aria-label is absent when labelledBy is provided
- [ ] aria-label is set and aria-labelledby is absent when labelledBy is not provided
- [ ] hidden is set when selected is false
- [ ] hidden is absent when selected is true
- [ ] Children render inside the panel
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tab-panel in css-style-sheet-template.css
- Adobe Spectrum Tabs: https://spectrum.adobe.com/page/tabs/
- WAI-ARIA Tabs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
