# Affix

A wrapper that pins its content to a viewport position while the page scrolls. Uses CSS `position: sticky` as the headless behavior. Either `offsetTop` or `offsetBottom` can be supplied (defaults to `top: 0` if neither is given).

## Implementation Notes

- Inline `style="position: sticky"` is the only inline style and is required for behavior
- `offsetTop` is preferred when both are supplied
- `data-offset-top` / `data-offset-bottom` are exposed for consumer CSS hooks
- Purely structural; no ARIA semantics

## Props

- `offsetTop`: number (optional) -- distance from top edge in px
- `offsetBottom`: number (optional) -- distance from bottom edge in px
- `children`: ReactNode (required) -- the pinned content
- `...restProps`: Any additional HTML attributes passed to the `<div>`

## Usage

```tsx
<Affix offsetTop={0}>
  <header>Sticky header</header>
</Affix>

<Affix offsetBottom={16}>
  <button>Back to top</button>
</Affix>
```

## Keyboard Interactions

None -- structural component.

## ARIA

None -- decorative/structural wrapper.
