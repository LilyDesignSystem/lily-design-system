# TabPanel

A content panel associated with a tab in a tab bar. Implements the WAI-ARIA Tabs pattern.

## Implementation Notes

- Renders a `<div>` with `role="tabpanel"`
- When `labelledBy` is provided, the panel sets `aria-labelledby` and omits `aria-label`
- When `labelledBy` is not provided, the panel sets `aria-label` from the `label` prop
- `tabIndex={0}` makes the panel focusable for keyboard users
- The panel is hidden via the `hidden` attribute when `selected` is false
- All user-facing strings are consumer-supplied (i18n-ready)

## Props

- `label`: string (**required**) — aria-label for the panel (used when `labelledBy` is not provided)
- `labelledBy`: string (optional) — ID of the tab button that controls this panel
- `selected`: boolean (default: `false`) — whether the panel is the currently selected one
- `children`: ReactNode (optional) — panel content
- `...restProps`: any additional HTML attributes passed to the root `<div>`

## Usage

```tsx
<TabBar label="Settings tabs">
  <TabBarButton id="tab-general" controls="panel-general" selected>General</TabBarButton>
  <TabBarButton id="tab-account" controls="panel-account">Account</TabBarButton>
</TabBar>

<TabPanel id="panel-general" labelledBy="tab-general" selected>
  <p>General settings content.</p>
</TabPanel>
<TabPanel id="panel-account" labelledBy="tab-account">
  <p>Account settings content.</p>
</TabPanel>
```

## ARIA

- `role="tabpanel"`
- `aria-labelledby` when controlled by a tab; otherwise `aria-label`
- `tabIndex={0}` so keyboard users can focus the panel

## References

- [WAI-ARIA Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [Adobe Spectrum Tabs](https://spectrum.adobe.com/page/tabs/)
