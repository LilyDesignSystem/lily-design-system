# TabPanel

A content panel associated with a tab in a tab bar.

## Implementation Notes

- Headless: no CSS
- `role="tabpanel"` with `tabindex="0"` so the panel is focusable for keyboard users
- When `labelledBy` is provided, the panel uses `aria-labelledby` and omits `aria-label`
- Visibility is controlled via the native `hidden` attribute

## Props

- `label`: string (**required**) — aria-label fallback for the panel
- `labelledBy`: string (optional) — ID of the controlling tab button; when set, used as `aria-labelledby`
- `selected`: boolean (default `false`) — whether the panel is currently selected
- default slot — panel content

## Usage

```vue
<TabBar>
    <TabBarButton id="tab-details" :selected="active === 'details'">Details</TabBarButton>
</TabBar>
<TabPanel label="Details" labelled-by="tab-details" :selected="active === 'details'">
    <p>Details content here</p>
</TabPanel>
```

## ARIA

- `role="tabpanel"`
- `aria-labelledby` when wired to a tab; otherwise `aria-label`
- `tabindex="0"` for keyboard accessibility

## When to Use

- For each panel in a tabbed interface, paired with a `TabBar` and `TabBarButton`

## When Not to Use

- For collapsible content — use `Collapsible` or `Details`
- For non-tabbed panels — use `Panel`

## Headless

Semantic HTML and ARIA only. Consumers supply CSS and tab-state coordination.

## Testing

- Verify root `tab-panel` class and `role="tabpanel"`
- Verify `aria-label` is used when `labelledBy` is not supplied
- Verify `aria-labelledby` is used and `aria-label` is omitted when `labelledBy` is supplied
- Verify the panel is `hidden` when `selected` is false
- Verify `tabindex="0"` is set

## References

- [Adobe Spectrum — Tabs](https://spectrum.adobe.com/page/tabs/)
- [WAI-ARIA Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
