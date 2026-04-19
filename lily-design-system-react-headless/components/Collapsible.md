# Collapsible

A collapsible (disclosure) component allows users to expand or collapse a section of content. Built on the native HTML `<details>` and `<summary>` elements, it provides built-in keyboard support and screen reader announcements without any JavaScript.

The summary text is always visible and acts as the toggle trigger. The content below is hidden when collapsed and revealed when expanded. The `open` prop is controlled, enabling parent components to programmatically control or observe the expanded/collapsed state.

## Implementation Notes

- Uses native `<details>` and `<summary>` elements for built-in accessibility support
- The `open` prop supports controlled component usage
- No custom ARIA attributes needed because native elements handle all announcements
- Spreads `restProps` onto the `<details>` element for consumer customization

## Props

- `summary`: string (required) -- the clickable summary text shown as the toggle trigger
- `open`: boolean (default: false) -- whether the content is expanded; controlled
- `children`: ReactNode (required) -- the collapsible content revealed when expanded

## Usage

```tsx
<Collapsible summary="More info">
  <p>Hidden content revealed on expand.</p>
</Collapsible>
```

```tsx
<Collapsible summary="Advanced settings" open={showAdvanced} onChange={setShowAdvanced}>
  <p>Advanced configuration options here.</p>
</Collapsible>
```

## Keyboard Interactions

- Enter/Space: Toggle the disclosure open/closed (handled natively by `<summary>`)

## ARIA

- No custom ARIA attributes required -- native `<details>`/`<summary>` elements provide built-in expanded/collapsed state announcements to screen readers

## References

- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
