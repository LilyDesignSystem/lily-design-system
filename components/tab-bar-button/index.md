# Tab Bar Button

A tab is a UI/UX component that allows users to navigate between different
sections of content within a single interface by clicking or tapping on labeled
tabs, typically displayed horizontally at the top of a content area. Each tab
represents a distinct section, and only the content related to the active tab is
displayed at a time, keeping the interface clean and organized. TabBarButtons help group
similar information in a compact and accessible way, allowing users to switch
between views without reloading or navigating away from the page. They enhance
usability by providing an intuitive, quick way to explore different content or
options within the same context.

This component renders an individual tab button with proper ARIA attributes
including role="tab", aria-selected for the active state, and aria-controls to
associate the tab with its corresponding tabpanel. It follows the roving
tabindex pattern where only the selected tab participates in the tab order.

## Implementation Notes

- Renders as `<button role="tab">` for proper tab semantics
- `aria-selected` reflects active/inactive state
- `aria-controls` links to the associated tabpanel id
- Roving tabindex: selected tab has tabindex=0, others have tabindex=-1
- Should be placed within a `role="tablist"` container

## Props

- `selected`: boolean (default: false) -- whether this tab is active
- `controls`: string (required) -- id of the associated tabpanel
- `children`: slot -- tab label content
- `...restProps`: Any additional HTML attributes

## Usage

```html
<TabBarButton
  selected={activeTab === 'overview'}
  controls="panel-overview"
  onclick={() => activeTab = 'overview'}
>
  Overview
</TabBarButton>
```

## Keyboard Interactions

- TabBarButton: moves focus to the selected tab in the tablist
- ArrowLeft/ArrowRight: moves between tabs (handled by parent tablist)
- Enter/Space: activates the tab (native button behavior)

## ARIA

- `role="tab"` identifies this as a tab
- `aria-selected` communicates selection state
- `aria-controls` links to the corresponding tabpanel
- Roving `tabindex` (0 for selected, -1 for unselected)

## When to Use

- Use inside TabBar to represent one selectable tab that reveals its associated content panel
- Use with `selected` state to indicate the currently active tab
- Use with `aria-controls` to associate the tab with its content panel

## When Not to Use

- Do not use outside of a TabBar -- it has no standalone meaning without a `role="tablist"` parent
- Do not use for actions that navigate to a different page -- use a link or NavigationMenu
- Do not use for toggle actions unrelated to content panels -- use ToggleButton or SegmentGroupItem instead

## Headless

This headless component renders a `<button>` with `role="tab"`, `aria-selected`, `aria-controls`, and roving `tabindex` for proper tab semantics and keyboard navigation. The consumer provides all visual styling including active/inactive states, typography, and spacing.


## Styles

The consumer provides all CSS styling. The component renders with a `.tab-bar-button` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<button>` element with class `tab-bar-button`
- Verify role="tab"` identifies this as a tab
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Visually differentiate the selected tab from unselected tabs using weight, color, or an underline indicator. Maintain consistent tab sizing so the layout does not shift on selection.
- **Developers**: Set the `controls` prop to the `id` of the associated `role="tabpanel"` element. Manage the `selected` prop from the parent to keep tab and panel state synchronized.

## Composition

TabBarButton is designed to be used as a child of TabBar. The TabBar provides the `role="tablist"` container with arrow key navigation, and each TabBarButton provides an individual `role="tab"` button with selection state.

## References

- WAI-ARIA TabBarButtons Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/tabs/
- WAI-ARIA TabBarButton Role: https://www.w3.org/TR/wai-aria-1.2/#tab
