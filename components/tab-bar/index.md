# Tab Bar

TabBar is a headless tab list container that provides the ARIA `tablist` role and built-in keyboard navigation for tab interfaces. It manages arrow key navigation between tab elements, allowing users to cycle through tabs with Left/Right arrow keys, and jump to the first or last tab with Home/End keys.

Use TabBar when building a tabbed interface where users switch between different views or content panels. The component wraps tab buttons in a `<div>` with `role="tablist"` and handles keyboard interactions automatically. Consumer provides tab buttons as children (each with `role="tab"` and `aria-selected`) and is responsible for managing selection state and associating tab panels.

## Implementation Notes

- Renders a `<div>` element with `role="tablist"` for ARIA semantics
- Uses two-way `this` binding to capture a reference to the tablist element for DOM queries
- Queries all child elements with `[role='tab']` to build the list of navigable tabs
- Implements keyboard navigation via an `onkeydown` handler:
  - ArrowRight moves focus to the next tab (wraps to first)
  - ArrowLeft moves focus to the previous tab (wraps to last)
  - Home moves focus to the first tab
  - End moves focus to the last tab
- Uses reactive state for the internal DOM reference (`tablistRef`)
- Consumer is responsible for managing `aria-selected` state on tab buttons and displaying corresponding tab panels
- Spreads `restProps` onto the div for consumer customization

## Props

- `label`: string (required) -- accessible label for the tab list, applied via `aria-label`
- `children`: slot (required) -- tab button elements to render inside the tablist
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```html
<TabBar label="Medication information">
  <TabBarButton selected controls="panel-about">About this medicine</TabBarButton>
  <TabBarButton controls="panel-dosage">Dosage</TabBarButton>
  <TabBarButton controls="panel-side-effects">Side effects</TabBarButton>
  <TabBarButton controls="panel-interactions">Interactions</TabBarButton>
</TabBar>
```

## Keyboard Interactions

- Arrow Right: Moves focus to the next tab; wraps from the last tab to the first
- Arrow Left: Moves focus to the previous tab; wraps from the first tab to the last
- Home: Moves focus to the first tab
- End: Moves focus to the last tab
- Tab: Moves focus into and out of the tab list (only one tab in the list is in the tab order at a time)

## ARIA

- `role="tablist"` -- identifies the container as a list of tabs
- `aria-label={label}` -- provides an accessible name for the tab list so screen readers announce its purpose
- Child tabs should have `role="tab"` and `aria-selected` attributes (managed by consumer)
- Associated tab panels should have `role="tabpanel"` with `aria-labelledby` pointing to the corresponding tab (managed by consumer)

## When to Use

- Use to let users navigate between related sections of content without leaving the page
- Use when content naturally divides into distinct categories that users will access one at a time
- Use to reduce page length by showing only the relevant section
- Use when there are 2-6 sections -- enough to justify tabs, few enough to remain scannable

## When Not to Use

- Do not use when users need to compare information across sections -- show all content on one page or use a Table
- Do not use with only one section -- show the content directly without tabs
- Do not use for sequential steps or progress -- use TaskList or a multi-page form with BackLink
- Do not use for navigation between different pages -- use NavigationMenu or BreadcrumbNav instead

## Headless

This headless component renders a `<div>` with `role="tablist"`, `aria-label`, and built-in arrow key navigation (Left/Right to cycle tabs, Home/End to jump to first/last). The consumer provides tab button children, manages selection state, associates tab panels, and applies all visual styling.


## Styles

The consumer provides all CSS styling. The component renders with a `.tab-bar` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `tab-bar`
- Verify role="tablist"` -- identifies the container as a list of tabs
- Verify aria-label={label}` -- provides an accessible name for the tab list so screen readers announce its purpose
- Verify Child tabs should have `role="tab"` and `aria-selected` attributes (managed by consumer)
- Verify Associated tab panels should have `role="tabpanel"` with `aria-labelledby` pointing to the corresponding tab (managed by consumer)
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Clearly indicate the active tab with a visual treatment such as an underline, background color, or border. Keep tab labels short and descriptive.
- **Developers**: Pair each TabBarButton with a corresponding `role="tabpanel"` element linked via `aria-controls` and `aria-labelledby`. Manage the `aria-selected` state on child tab buttons from the consumer.

## Composition

TabBar uses the Bar/BarButton composition pattern. Place TabBarButton components as children inside TabBar. The TabBar provides the `role="tablist"` container with keyboard navigation, while each TabBarButton provides `role="tab"` with selection state and panel association.

## References

- WAI-ARIA Tabs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- WAI-ARIA Authoring Practices - Tabs Example: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-automatic/
