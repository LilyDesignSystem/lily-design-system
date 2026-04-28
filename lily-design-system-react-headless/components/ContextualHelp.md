# ContextualHelp

A help button that opens a popover with explanatory content. Inspired by Adobe Spectrum's ContextualHelp.

## Implementation Notes

- Renders a `<div>` containing a `<button>` trigger and a `<div role="dialog">` panel
- The panel ID is generated with React's `useId()`
- The trigger has `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls` linking to the panel
- The panel is hidden via the `hidden` attribute when `expanded` is false
- All user-facing strings are consumer-supplied (i18n-ready)

## Props

- `label`: string (**required**) — aria-label for the help trigger button
- `expanded`: boolean (default: `false`) — whether the popover is open
- `onClick`: (event: React.MouseEvent) => void (optional) — trigger click handler
- `children`: ReactNode (optional) — popover content
- `...restProps`: any additional HTML attributes passed to the root `<div>`

## Usage

```tsx
<ContextualHelp
  label="What is a username?"
  expanded={open}
  onClick={() => setOpen(!open)}
>
  <p>Your username is shown next to your posts and comments.</p>
</ContextualHelp>
```

## ARIA

- Trigger: `aria-label`, `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`
- Panel: `role="dialog"` with a stable id, hidden via `hidden` attribute

## References

- [Adobe Spectrum ContextualHelp](https://spectrum.adobe.com/page/contextual-help/)
