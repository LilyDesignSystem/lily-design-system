# NavigationMenu

## Metadata

- Component: navigation-menu
- PascalCase: NavigationMenu
- Description: a site-wide navigation menu with links
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <nav>
- CSS class: .navigation-menu
- Interactive: no

## Key Behaviors

- Renders a native `<nav>` element, which is automatically recognized as a navigation landmark by screen readers.
- Uses `aria-label` to distinguish this navigation from other `<nav>` elements on the same page (e.g., "Main navigation" vs. "Footer navigation").
- Content is passed via the `children` slot, allowing any markup structure (links, lists, nested menus).
- Spreads `restProps` onto the `<nav>` for consumer customization.
- No internal state or keyboard handling by default; relies on native link and focus behavior.
- Optional overflow mode (`overflow`): renders `<ul class="navigation-menu-list">` (children must be `<li>`), a hidden `<li class="navigation-menu-more">` holding `<button class="navigation-menu-more-button" type="button" aria-expanded aria-controls>` named by the required `moreLabel` and `<ul class="navigation-menu-more-list" hidden>`, and publishes `data-overflow="true"`. A `ResizeObserver` on the list (guarded by `typeof ResizeObserver`; never a window `resize` listener) moves the items that do not fit into the More list, in order, and back when widened. The opened list is in normal flow (it pushes content down, WCAG 2.4.11); Escape closes it and refocuses the button; a click outside closes it. With no JavaScript the links wrap. Shared logic: `shared/overflow-navigation.ts` (HTML inlines it in its snippet script). Nunjucks renders markup only.

## ARIA

- The `<nav>` element implicitly has `role="navigation"`, making it a navigation landmark.
- `aria-label` -- provides an accessible name to distinguish this navigation from other `<nav>` landmarks on the page.

## Keyboard

- No keyboard interactions — this is a passive element
- Overflow mode: Enter/Space toggle the More button; Escape closes the list and returns focus to the button; Tab flows through the links in order; a click outside closes the list

## Props

- `label`: string (required) -- accessible name applied via `aria-label` to distinguish this nav landmark.
- `overflow`: boolean (optional, default false) -- overflow mode; publishes `data-overflow="true"`; children must be `<li>` items.
- `moreLabel`: string (required with `overflow`) -- the More button's accessible name; no English default (Web Components `more-label`, Blazor `MoreLabel`).
- `children`: slot (required) -- navigation content to render inside the `<nav>` element.
- `...restProps`: unknown -- additional attributes spread onto the `<nav>` element.

## Native platform

- Decision: hand-rolled because the More list is an APG disclosure-navigation list in normal flow and degrades to wrapped links without JS
- Uses: <nav>; ResizeObserver overflow into a "More" disclosure
- Could use: popover="auto" for the More list; anchor positioning
- Notes: popover="auto" for the More list is an option later; not needed for correctness.
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Acceptance Criteria

- [ ] Renders <nav> element with class="navigation-menu"
- [ ] Has aria-label attribute
- [ ] Has role="navigation"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .navigation-menu in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/navigation-menu.html
- WAI-ARIA Navigation Landmark: https://www.w3.org/TR/wai-aria-1.2/#navigation
- WAI-ARIA Landmarks: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
