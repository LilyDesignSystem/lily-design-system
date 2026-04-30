# GovernmentBanner

## Metadata

- Component: government-banner
- PascalCase: GovernmentBanner
- Description: a banner identifying a website as belonging to a government, with an expandable details panel
- HTML tag: <aside>
- CSS class: .government-banner
- Interactive: yes

## Key Behaviors

- Renders an `<aside>` (complementary landmark) with class `government-banner`
- `label` prop is REQUIRED and sets `aria-label`
- `headerText` prop is REQUIRED and rendered in `<header class="government-banner-header">`
- `expandLabel` prop is REQUIRED and rendered as the toggle button label
- `expanded` controls the visibility of the details panel
- Toggle `<button>` has `aria-expanded` and `aria-controls`
- Panel `<div class="government-banner-details">` has a stable id and uses `hidden` when collapsed
- `onToggle` / `ontoggle` callback fires when the toggle is activated
- Children render inside the details panel

## ARIA

- `<aside>` (complementary landmark) with `aria-label`
- Toggle `<button>` with `aria-expanded` and `aria-controls`
- Panel uses `hidden` attribute when collapsed

## Keyboard

- Tab: Focus the toggle button
- Enter: Activate the toggle button
- Space: Activate the toggle button
- (All handled natively by the `<button>` element)

## Props

- `label`: string (REQUIRED) -- aria-label for the banner
- `headerText`: string (REQUIRED) -- top headline
- `expanded`: boolean (default: false) -- panel state
- `expandLabel`: string (REQUIRED) -- toggle button text
- `onToggle` / `ontoggle`: callback (optional)
- `children`: slot -- details panel content
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <aside> with class="government-banner"
- [ ] aria-label equals the label prop
- [ ] headerText is rendered inside the banner header
- [ ] Toggle button is present with expandLabel text
- [ ] aria-expanded reflects the expanded prop
- [ ] aria-controls references the panel id
- [ ] Panel is hidden when expanded is false
- [ ] Panel is visible when expanded is true
- [ ] Toggle handler fires on click, Enter, and Space
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .government-banner in css-style-sheet-template.css
- US Web Design System Banner: https://designsystem.digital.gov/components/banner/
- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
