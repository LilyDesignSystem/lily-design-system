# Tab Panel

A tab panel is a content panel associated with a tab in a tab bar. It
shows the content for the currently selected tab.

Use it as the content companion to a `TabBar` and `TabBarButton`. Each
panel is labelled by its corresponding tab and is shown only when its tab
is selected.

## Implementation Notes

- Uses a `<div>` with `role="tabpanel"` and class `tab-panel`
- When `labelledBy` is provided, the panel uses `aria-labelledby={labelledBy}` and omits `aria-label`
- When `labelledBy` is not provided, the panel uses `aria-label={label}` instead
- The panel is hidden via the `hidden` attribute when `selected` is `false`
- The panel uses `tabindex="0"` so keyboard users can scroll the panel content

## Props

- `label`: string (**required**) -- aria-label for the panel
- `labelledBy`: string (optional) -- ID of the tab button that controls this panel; when provided, sets `aria-labelledby` and the panel does not set `aria-label`
- `selected`: boolean (default `false`) -- whether the panel is the currently selected one
- `children`: slot -- panel content
- `...restProps`: any additional HTML attributes

## Usage

```html
<TabBar>
  <TabBarButton id="tab-overview" controls="panel-overview" selected>Overview</TabBarButton>
  <TabBarButton id="tab-details" controls="panel-details">Details</TabBarButton>
</TabBar>
<TabPanel id="panel-overview" labelledBy="tab-overview" selected={tab === 'overview'}>
  Overview content...
</TabPanel>
<TabPanel id="panel-details" labelledBy="tab-details" selected={tab === 'details'}>
  Details content...
</TabPanel>
```

## Keyboard Interactions

- Tab: Move focus into and out of the panel
- (Provided by the parent `TabBar`) Arrow keys to navigate between tabs
- Within the panel, the consumer provides any additional keyboard handling

## ARIA

- `role="tabpanel"` on the container
- `aria-labelledby={labelledBy}` when controlled by a tab; otherwise `aria-label={label}`
- `hidden` reflects `!selected`
- `tabindex="0"` so the panel itself is keyboard-focusable

## When to Use

- Use as the content companion to a `TabBar`
- Use to switch among related views without navigating to a new page
- Use when only one view is shown at a time

## When Not to Use

- Do not use without a corresponding tab in a `TabBar`
- Do not show multiple selected panels at once
- Do not use for primary navigation between pages — use `NavigationMenu`

## Composition

Tab panels pair with tabs:

```html
<TabBar label="Sections">
  <TabBarButton id="t1" controls="p1" selected>One</TabBarButton>
  <TabBarButton id="t2" controls="p2">Two</TabBarButton>
</TabBar>
<TabPanel id="p1" labelledBy="t1" selected>...</TabPanel>
<TabPanel id="p2" labelledBy="t2">...</TabPanel>
```

## Headless

Renders a `<div role="tabpanel">` linked to its tab via `aria-labelledby`.
Selection state is controlled by the consumer via the `selected` prop;
animation, lazy loading, and styling are entirely the consumer's
responsibility.

## Styles

Consumer CSS targets the `tab-panel` class. Use the `hidden` attribute
selector or `[aria-selected]` on the parent tab to style transitions.
Provide a clear focus indicator on the panel since it is keyboard-focusable.

## Testing

- Verify the component renders a `<div>` with `role="tabpanel"` and class `tab-panel`
- Verify `tabindex="0"` is present
- Verify `aria-labelledby` is set and `aria-label` is absent when `labelledBy` is provided
- Verify `aria-label` is set and `aria-labelledby` is absent when `labelledBy` is not provided
- Verify `hidden` is set when `selected` is `false`
- Verify `hidden` is absent when `selected` is `true`
- Verify children are rendered inside the panel

## Advice

- **Designers**: Keep tab labels short; communicate the selection clearly with both color and a non-color indicator (underline, weight).
- **Developers**: Use stable ids on tabs and panels so `aria-labelledby` and `aria-controls` survive re-renders.

## Related components

- `tab-bar` — a group of tabs for switching between content panels
- `tab-bar-button` — one tab button in a tab group

## References

- WAI-ARIA Tabs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- Adobe Spectrum Tabs: https://spectrum.adobe.com/page/tabs/
- WCAG 1.3.1 Info and Relationships: https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships
